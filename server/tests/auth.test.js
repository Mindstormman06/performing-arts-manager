import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import app from "../server.js";
import authService from "../src/services/auth.service.js";
import { closeDatabase, setupTestDatabase } from "./utils/test-setup.js";

describe("Authentication & Registration", () => {
	const testUserEmail = `auth-test-${Date.now()}@viu.ca`;
	const testUserPassword = "password123";

	// Setup a fresh database before running auth tests
	beforeAll(async () => {
		await setupTestDatabase();
	}, 30000);

	afterAll(async () => {
		await closeDatabase();
	});

	it("Should register a new user successfully", async () => {
		// Create User (unprotected route)
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
		// Attempt to login with the newly created credentials
		const loginRes = await request(app).post("/api/auth/login").send({
			email: testUserEmail,
			password: testUserPassword,
		});

		expect(loginRes.statusCode).toEqual(200);
		// The presence of a token confirms successful authentication
		expect(loginRes.body).toHaveProperty("token");
	});

	describe("Auth Service Validation (Happy Path Rejections)", () => {
		it("should reject login if the email is not found", async () => {
			const res = await request(app).post("/api/auth/login").send({
				email: "nobody@viu.ca", // Unregistered email
				password: "password123",
			});

			expect(res.statusCode).toEqual(401);
			expect(res.body.success).toBe(false);
			expect(res.body.message).toBe("Invalid credentials");
		});

		it("should reject login if the password does not match", async () => {
			const res = await request(app).post("/api/auth/login").send({
				email: testUserEmail, // Valid registered email
				password: "completely-wrong-password", // Wrong password
			});

			expect(res.statusCode).toEqual(401);
			expect(res.body.success).toBe(false);
			expect(res.body.message).toBe("Invalid credentials");
		});
	});

	describe("Login Controller - Error Handling", () => {
		it("should return 401 when authService throws an error", async () => {
			// Force the auth service to throw an error to test the controller's catch block
			const authSpy = vi
				.spyOn(authService, "login")
				.mockRejectedValue(new Error("Invalid credentials"));

			const res = await request(app)
				.post("/api/auth/login")
				.send({ email: "wrong@viu.ca", password: "wrongpassword" });

			expect(res.statusCode).toEqual(401);
			expect(res.body.success).toBe(false);
			expect(res.body.message).toBe("Invalid credentials");

			// Clean up the mock so it doesn't affect other tests
			authSpy.mockRestore();
		});
	});

	describe("Auth Middleware", () => {
		it("should return 400 for an invalid JWT token", async () => {
			// Provide garbage data instead of a real JWT
			const res = await request(app)
				.post("/api/orgs")
				.set("Authorization", `Bearer an-invalid-token`)
				.send({ name: "Test Org" });

			expect(res.statusCode).toEqual(400);
			expect(res.body.message).toContain("Invalid token");
		});
	});
});
