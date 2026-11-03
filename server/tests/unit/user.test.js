import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import app from "../../server.js";
import models from "../../src/models/index.js";
import userService from "../../src/services/user.service.js";
import { closeDatabase, setupTestDatabase } from "./utils/test-setup.js";

const PASSWORD = "password123";

async function createAndLogin(prefix) {
	const email = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}@viu.ca`;
	const userRes = await request(app)
		.post("/api/users")
		.send({ fname: prefix, lname: "Tester", email, password: PASSWORD });
	const loginRes = await request(app)
		.post("/api/auth/login")
		.send({ email, password: PASSWORD });
	return { id: userRes.body.id, email, token: loginRes.body.token };
}

describe("User Management API", () => {
	let testUser;
	let otherUser;
	const auth = (user = testUser) => ({
		Authorization: `Bearer ${user.token}`,
	});

	beforeAll(async () => {
		await setupTestDatabase();
		testUser = await createAndLogin("user-test");
		otherUser = await createAndLogin("other-user");
	}, 30000);

	afterAll(async () => {
		await closeDatabase();
	});

	it("GET /api/users - should get all users", async () => {
		const res = await request(app).get("/api/users").set(auth());
		expect(res.statusCode).toEqual(200);
		// Ensure the response is a list
		expect(Array.isArray(res.body)).toBe(true);
	});

	it("GET /api/users/:id - should get a specific user by id", async () => {
		const res = await request(app).get(`/api/users/${testUser.id}`).set(auth());
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty("id", testUser.id);
	});

	it("PUT /api/users/:id - should update user details", async () => {
		const res = await request(app)
			.put(`/api/users/${testUser.id}`)
			.set(auth())
			.send({ fname: "Updated User" });
		expect(res.statusCode).toEqual(200);
		expect(res.body.fname).toBe("Updated User");
	});

	describe("Security", () => {
		it("rejects unauthenticated reads and writes", async () => {
			expect((await request(app).get("/api/users")).statusCode).toBe(401);
			expect(
				(await request(app).get(`/api/users/${testUser.id}`)).statusCode,
			).toBe(401);
			expect(
				(
					await request(app)
						.put(`/api/users/${testUser.id}`)
						.send({ password: "hijacked123" })
				).statusCode,
			).toBe(401);
			expect(
				(await request(app).delete(`/api/users/${testUser.id}`)).statusCode,
			).toBe(401);
		});

		it("never returns password hashes or session data", async () => {
			const list = await request(app).get("/api/users").set(auth());
			for (const user of list.body) {
				expect(user).not.toHaveProperty("passwordHash");
				expect(user).not.toHaveProperty("sessionToken");
			}
			const single = await request(app)
				.get(`/api/users/${testUser.id}`)
				.set(auth());
			expect(single.body).not.toHaveProperty("passwordHash");

			const signup = await request(app)
				.post("/api/users")
				.send({
					fname: "Hash",
					lname: "Check",
					email: `hash-${Date.now()}@viu.ca`,
					password: PASSWORD,
				});
			expect(signup.statusCode).toBe(201);
			expect(signup.body).not.toHaveProperty("passwordHash");
		});

		it("forbids changing another user's account", async () => {
			const put = await request(app)
				.put(`/api/users/${otherUser.id}`)
				.set(auth())
				.send({ password: "hijacked123" });
			expect(put.statusCode).toBe(403);

			const del = await request(app)
				.delete(`/api/users/${otherUser.id}`)
				.set(auth());
			expect(del.statusCode).toBe(403);

			// The other user's password must still work
			const login = await request(app)
				.post("/api/auth/login")
				.send({ email: otherUser.email, password: PASSWORD });
			expect(login.statusCode).toBe(200);
		});

		it("ignores privileged fields such as passwordHash and id", async () => {
			const res = await request(app)
				.put(`/api/users/${testUser.id}`)
				.set(auth())
				.send({ passwordHash: "not-a-real-hash", id: 9999 });
			expect(res.statusCode).toBe(200);
			expect(res.body.id).toBe(testUser.id);

			const login = await request(app)
				.post("/api/auth/login")
				.send({ email: testUser.email, password: PASSWORD });
			expect(login.statusCode).toBe(200);
		});

		it("rejects duplicate emails with 409", async () => {
			const res = await request(app).post("/api/users").send({
				fname: "Dupe",
				lname: "User",
				email: otherUser.email,
				password: PASSWORD,
			});
			expect(res.statusCode).toBe(409);

			const update = await request(app)
				.put(`/api/users/${testUser.id}`)
				.set(auth())
				.send({ email: otherUser.email });
			expect(update.statusCode).toBe(409);
		});

		it("rejects passwords shorter than 8 characters", async () => {
			const res = await request(app)
				.post("/api/users")
				.send({
					fname: "Short",
					lname: "Pass",
					email: `short-${Date.now()}@viu.ca`,
					password: "abc",
				});
			expect(res.statusCode).toBe(400);
		});

		it("returns 400 for invalid user data", async () => {
			const res = await request(app)
				.post("/api/users")
				.send({ fname: "Bad", lname: "Email", email: "not-an-email" });
			expect(res.statusCode).toBe(400);
		});
	});

	describe("User Controller - Error Handling", () => {
		// Mock services to simulate database failures and test standard error responses

		it("GET /api/users - should handle generic errors", async () => {
			const spy = vi
				.spyOn(userService, "getAll")
				.mockRejectedValue(new Error("Database error"));
			const res = await request(app).get("/api/users").set(auth());
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});

		it("GET /api/users/:id - should return 404 for user not found", async () => {
			const spy = vi
				.spyOn(userService, "getById")
				.mockRejectedValue(new Error("User not found"));
			const res = await request(app).get("/api/users/999").set(auth());
			expect(res.statusCode).toEqual(404);
			spy.mockRestore();
		});

		it("PUT /api/users/:id - should return 404 for user not found", async () => {
			const spy = vi
				.spyOn(userService, "update")
				.mockRejectedValue(new Error("User not found"));
			const res = await request(app)
				.put(`/api/users/${testUser.id}`)
				.set(auth())
				.send({ fname: "Test" });
			expect(res.statusCode).toEqual(404);
			spy.mockRestore();
		});

		it("DELETE /api/users/:id - should return 404 for user not found", async () => {
			const spy = vi
				.spyOn(userService, "remove")
				.mockRejectedValue(new Error("User not found"));
			const res = await request(app)
				.delete(`/api/users/${testUser.id}`)
				.set(auth());
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
				.put(`/api/users/${testUser.id}`)
				.set(auth())
				.send({ fname: "Test" });
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});

		it("DELETE /api/users/:id - should handle generic errors (Line 46)", async () => {
			const spy = vi
				.spyOn(userService, "remove")
				.mockRejectedValue(new Error("Database offline"));
			const res = await request(app)
				.delete(`/api/users/${testUser.id}`)
				.set(auth());
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});

		it("GET /api/users/:id - should handle generic errors (Line 16 False Branch)", async () => {
			const spy = vi
				.spyOn(userService, "getById")
				.mockRejectedValue(new Error("Database error"));
			const res = await request(app).get("/api/users/999").set(auth());
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});
	});

	it("DELETE /api/users/:id - should delete your own account (Line 46)", async () => {
		const tempUser = await createAndLogin("delete-me");
		const res = await request(app)
			.delete(`/api/users/${tempUser.id}`)
			.set(auth(tempUser));
		expect(res.statusCode).toEqual(200);
		expect(res.body.success).toBe(true);
	});

	describe("user.service.js - Direct Service Tests", () => {
		it("create - should create a user without a password (Line 21 False Branch)", async () => {
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
			const updatedUser = await userService.update(testUser.id, {
				password: "newpassword123",
			});

			// The hash is stored but never returned
			expect(updatedUser.passwordHash).toBeUndefined();
			expect(updatedUser.password).toBeUndefined();
			const stored = await models.User.scope("withPassword").findByPk(
				testUser.id,
			);
			expect(stored.passwordHash).toMatch(/^\$2[aby]\$/);
		});

		it("remove - should throw 'User not found' (Line 45)", async () => {
			await expect(userService.remove(99999)).rejects.toThrow("User not found");
		});
	});
});
