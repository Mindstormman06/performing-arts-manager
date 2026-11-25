/**
 * Unit tests for the `rateLimit` middleware factory.
 *
 * @remarks
 * Mounts each limiter on a throwaway Express app with `enabled: true`, since
 * limiters are off by default under test. Covers blocking with `Retry-After`,
 * failure-only counting, per-key limits, reset, window expiry and the
 * disabled pass-through. Needs no database.
 */

import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { rateLimit } from "../../src/middleware/rateLimit.middleware.js";

function appWith(limiter, status = 200) {
	const app = express();
	app.use(express.json());
	app.post("/", limiter, (_req, res) => res.status(status).json({ ok: true }));
	return app;
}

describe("rateLimit middleware", () => {
	it("blocks requests over the limit with 429 and Retry-After", async () => {
		const app = appWith(rateLimit({ windowMs: 60_000, max: 2, enabled: true }));

		expect((await request(app).post("/")).statusCode).toBe(200);
		expect((await request(app).post("/")).statusCode).toBe(200);
		const blocked = await request(app).post("/");
		expect(blocked.statusCode).toBe(429);
		expect(Number(blocked.headers["retry-after"])).toBeGreaterThan(0);
	});

	it("only counts failures when countOnlyFailures is set", async () => {
		const ok = appWith(
			rateLimit({
				windowMs: 60_000,
				max: 1,
				countOnlyFailures: true,
				enabled: true,
			}),
		);
		for (let i = 0; i < 3; i += 1) {
			expect((await request(ok).post("/")).statusCode).toBe(200);
		}

		const failing = appWith(
			rateLimit({
				windowMs: 60_000,
				max: 1,
				countOnlyFailures: true,
				enabled: true,
			}),
			401,
		);
		expect((await request(failing).post("/")).statusCode).toBe(401);
		expect((await request(failing).post("/")).statusCode).toBe(429);
	});

	it("keys limits separately and can be reset", async () => {
		const limiter = rateLimit({
			windowMs: 60_000,
			max: 1,
			key: (req) => req.body.email,
			enabled: true,
		});
		const app = appWith(limiter);
		const statusFor = async (email) =>
			(await request(app).post("/").send({ email })).statusCode;

		expect(await statusFor("a")).toBe(200);
		expect(await statusFor("b")).toBe(200);
		expect(await statusFor("a")).toBe(429);

		limiter.reset();
		expect(await statusFor("a")).toBe(200);
	});

	it("starts a new window once the old one expires", async () => {
		const app = appWith(rateLimit({ windowMs: 50, max: 1, enabled: true }));
		expect((await request(app).post("/")).statusCode).toBe(200);
		expect((await request(app).post("/")).statusCode).toBe(429);
		await new Promise((resolve) => setTimeout(resolve, 80));
		expect((await request(app).post("/")).statusCode).toBe(200);
	});

	it("passes everything through when disabled", async () => {
		const app = appWith(
			rateLimit({ windowMs: 60_000, max: 0, enabled: false }),
		);
		expect((await request(app).post("/")).statusCode).toBe(200);
	});
});
