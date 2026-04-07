import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import app from "../../server.js";
import userService from "../../src/services/user.service.js";
import { closeDatabase, setupTestDatabase } from "./utils/test-setup.js";

describe("User Management API", () => {
	let testUserId;

	beforeAll(async () => {
		await setupTestDatabase();

		// Create a user strictly for these tests to interact with
		const userRes = await request(app)
			.post("/api/users")
			.send({
				fname: "User",
				lname: "Tester",
				email: `user-test-${Date.now()}@viu.ca`,
				password: "password123",
			});
		testUserId = userRes.body.id;
	}, 30000);

	afterAll(async () => {
		await closeDatabase();
	});

	it("GET /api/users - should get all users", async () => {
		const res = await request(app).get("/api/users");
		expect(res.statusCode).toEqual(200);
		// Ensure the response is a list
		expect(Array.isArray(res.body)).toBe(true);
	});

	it("GET /api/users/:id - should get a specific user by id", async () => {
		const res = await request(app).get(`/api/users/${testUserId}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty("id", testUserId);
	});

	it("PUT /api/users/:id - should update user details", async () => {
		const res = await request(app)
			.put(`/api/users/${testUserId}`)
			.send({ fname: "Updated User" });
		expect(res.statusCode).toEqual(200);
	});

	describe("User Controller - Error Handling", () => {
		// Mock services to simulate database failures and test standard error responses

		it("GET /api/users - should handle generic errors", async () => {
			const spy = vi
				.spyOn(userService, "getAll")
				.mockRejectedValue(new Error("Database error"));
			const res = await request(app).get("/api/users");
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});

		it("GET /api/users/:id - should return 404 for user not found", async () => {
			const spy = vi
				.spyOn(userService, "getById")
				.mockRejectedValue(new Error("User not found"));
			const res = await request(app).get("/api/users/999");
			expect(res.statusCode).toEqual(404);
			spy.mockRestore();
		});

		it("PUT /api/users/:id - should return 404 for user not found", async () => {
			const spy = vi
				.spyOn(userService, "update")
				.mockRejectedValue(new Error("User not found"));
			const res = await request(app)
				.put("/api/users/999")
				.send({ fname: "Test" });
			expect(res.statusCode).toEqual(404);
			spy.mockRestore();
		});

		it("DELETE /api/users/:id - should return 404 for user not found", async () => {
			const spy = vi
				.spyOn(userService, "remove")
				.mockRejectedValue(new Error("User not found"));
			const res = await request(app).delete("/api/users/999");
			expect(res.statusCode).toEqual(404);
			spy.mockRestore();
		});

		it("POST /api/users - should handle generic errors (Lines 27-28)", async () => {
			const spy = vi
				.spyOn(userService, "create")
				.mockRejectedValue(new Error("Database offline"));
			const res = await request(app)
				.post("/api/users")
				.send({ fname: "T", email: "t@t.com", password: "p" });
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});

		it("PUT /api/users/:id - should handle generic errors", async () => {
			const spy = vi
				.spyOn(userService, "update")
				.mockRejectedValue(new Error("Database offline"));
			const res = await request(app)
				.put("/api/users/999")
				.send({ fname: "Test" });
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});

		it("DELETE /api/users/:id - should handle generic errors (Line 46)", async () => {
			// Throw an error that is NOT "User not found" to bypass the if block and hit next(error)
			const spy = vi
				.spyOn(userService, "remove")
				.mockRejectedValue(new Error("Database offline"));
			const res = await request(app).delete("/api/users/999");
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});

		it("GET /api/users/:id - should handle generic errors (Line 16 False Branch)", async () => {
			const spy = vi
				.spyOn(userService, "getById")
				.mockRejectedValue(new Error("Database error"));
			const res = await request(app).get("/api/users/999");
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});
	});

	it("DELETE /api/users/:id - should delete a user successfully (Line 46)", async () => {
		// Create a temporary user just to delete them
		const tempUser = await request(app)
			.post("/api/users")
			.send({
				fname: "Delete",
				lname: "Me",
				email: `delete-${Date.now()}@viu.ca`,
				password: "password123",
			});
		const res = await request(app).delete(`/api/users/${tempUser.body.id}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body.success).toBe(true);
	});

	describe("user.service.js - Direct Service Tests", () => {
		it("create - should create a user without a password (Line 21 False Branch)", async () => {
			// Passing an object without a password completely skips the bcrypt block
			const userWithoutPassword = {
				fname: "No",
				lname: "Password",
				email: `nopass-${Date.now()}@viu.ca`,
			};

			const newUser = await userService.create(userWithoutPassword);

			expect(newUser.email).toBe(userWithoutPassword.email);
			expect(newUser.passwordHash).toBeUndefined();
		});

		it("getById - should throw 'User not found' (Line 15)", async () => {
			await expect(userService.getById(99999)).rejects.toThrow(
				"User not found",
			);
		});

		it("update - should throw 'User not found' (Line 32)", async () => {
			await expect(
				userService.update(99999, { fname: "Ghost" }),
			).rejects.toThrow("User not found");
		});

		it("update - should hash new password if provided (Lines 35-36)", async () => {
			// Sending a password triggers the bcrypt hashing block in the service
			const updatedUser = await userService.update(testUserId, {
				password: "newpassword123",
			});

			expect(updatedUser.passwordHash).toBeDefined();
			expect(updatedUser.password).toBeUndefined(); // The service should delete the plaintext password
		});

		it("remove - should throw 'User not found' (Line 45)", async () => {
			await expect(userService.remove(99999)).rejects.toThrow("User not found");
		});
	});
});
