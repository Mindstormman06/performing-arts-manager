/**
 * Integration tests for registration, login, token verification and the
 * auth middleware's handling of a malformed JWT.
 *
 * @remarks
 * Needs the live MySQL test DB: `beforeAll` runs `setupTestDatabase`. Later
 * tests log in as the user created by "Should register a new user
 * successfully", so that test must run first. Controller error paths are
 * covered by spying on `authService` and restoring the spy afterwards.
 */

import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import app from "../../server.js";
import authService from "../../src/services/auth.service.js";
import { closeDatabase, setupTestDatabase } from "./utils/test-setup.js";

describe("Authentication & Registration", () => {
	const testUserEmail = `auth-test-${Date.now()}@viu.ca`;
	const testUserPassword = "password123";

	beforeAll(async () => {
		await setupTestDatabase();
	}, 30000);

	afterAll(async () => {
		await closeDatabase();
	});

	it("Should register a new user successfully", async () => {
		const userRes = await request(app).post("/api/users").send({
			fname: "Auth",
			lname: "Tester",
			email: testUserEmail,
			password: testUserPassword,
		});

		expect(userRes.statusCode).toEqual(201);
		expect(userRes.body).toHaveProperty("id");
	});

	it("Should login and return a JWT token", async () => {
		const loginRes = await request(app).post("/api/auth/login").send({
			email: testUserEmail,
			password: testUserPassword,
		});

		expect(loginRes.statusCode).toEqual(200);
		expect(loginRes.body).toHaveProperty("token");
	});

	describe("Auth Service Validation (Happy Path Rejections)", () => {
		it("should reject login if the email is not found", async () => {
			const res = await request(app).post("/api/auth/login").send({
				email: "nobody@viu.ca",
				password: "password123",
			});

			expect(res.statusCode).toEqual(401);
			expect(res.body.success).toBe(false);
			expect(res.body.message).toBe("Invalid credentials");
		});

		it("should reject login if the password does not match", async () => {
			const res = await request(app).post("/api/auth/login").send({
				email: testUserEmail,
				password: "completely-wrong-password",
			});

			expect(res.statusCode).toEqual(401);
			expect(res.body.success).toBe(false);
			expect(res.body.message).toBe("Invalid credentials");
		});
	});

	describe("Login Controller - Error Handling", () => {
		it("should return 401 when authService throws an error", async () => {
			const authSpy = vi
				.spyOn(authService, "login")
				.mockRejectedValue(new Error("Invalid credentials"));

			const res = await request(app)
				.post("/api/auth/login")
				.send({ email: "wrong@viu.ca", password: "wrongpassword" });

			expect(res.statusCode).toEqual(401);
			expect(res.body.success).toBe(false);
			expect(res.body.message).toBe("Invalid credentials");

			authSpy.mockRestore();
		});
	});

	describe("Verify Controller - Happy Path", () => {
		it("should verify user and return user data successfully", async () => {
			const loginRes = await request(app).post("/api/auth/login").send({
				email: testUserEmail,
				password: testUserPassword,
			});

			const token = loginRes.body.token;

			const verifyRes = await request(app)
				.get("/api/auth/verify")
				.set("Authorization", `Bearer ${token}`);

			expect(verifyRes.statusCode).toEqual(200);
			expect(verifyRes.body.success).toBe(true);
			expect(verifyRes.body).toHaveProperty("user");
			expect(verifyRes.body.user).toHaveProperty("id");
		});
	});

	describe("Verify Controller - Error Handling", () => {
		it("should return 401 when authService.verify throws an error", async () => {
			const verifySpy = vi
				.spyOn(authService, "verify")
				.mockRejectedValue(new Error("User not found"));

			const loginRes = await request(app).post("/api/auth/login").send({
				email: testUserEmail,
				password: testUserPassword,
			});

			const token = loginRes.body.token;

			const verifyRes = await request(app)
				.get("/api/auth/verify")
				.set("Authorization", `Bearer ${token}`);

			expect(verifyRes.statusCode).toEqual(401);
			expect(verifyRes.body.success).toBe(false);
			expect(verifyRes.body.message).toBe("User not found");

			verifySpy.mockRestore();
		});
	});

	describe("Auth Middleware", () => {
		it("should return 400 for an invalid JWT token", async () => {
			const res = await request(app)
				.post("/api/orgs")
				.set("Authorization", `Bearer an-invalid-token`)
				.send({ name: "Test Org" });

			expect(res.statusCode).toEqual(400);
			expect(res.body.message).toContain("Invalid token");
		});
	});
});
