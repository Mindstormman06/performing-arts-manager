/**
 * Integration tests for the Express app's health route, 404 handling and
 * global error handler.
 *
 * @remarks
 * Needs no database; requests go through supertest against the exported app.
 * Relies on the `/crash-test` and `/crash-test-minimal` routes, which
 * `server.js` registers only when `NODE_ENV` is "test" or Vitest is running.
 */

import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../../server.js";

describe("Server Core & Error Handling", () => {
	it("Server should be up and running", async () => {
		const res = await request(app).get("/server-up");
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty("message", "ok");
	});

	it("Should return 404 for unknown routes", async () => {
		const res = await request(app).get("/unknown-route");
		expect(res.statusCode).toEqual(404);
	});

	it("Should handle server errors gracefully", async () => {
		const res = await request(app).get("/crash-test");
		expect(res.statusCode).toEqual(500);
		expect(res.body).toHaveProperty(
			"message",
			"Intentional crash for testing error handling",
		);
	});

	it("Should fallback to 500 and default message when error is empty", async () => {
		const res = await request(app).get("/crash-test-minimal");
		expect(res.statusCode).toEqual(500);
		expect(res.body.message).toBe("Internal server error");
	});
});
