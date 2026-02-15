import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import app from "../server.js";
import sequelize from "../src/services/db.service.js";
import { closeDatabase,setupTestDatabase } from "./utils/test-setup.js";

describe("Admin & Database Operations", () => {
	let authToken;

	beforeAll(async () => {
		await setupTestDatabase();

		// Set up an admin user to interact with the protected reset routes
		const userRes = await request(app).post("/api/users").send({
			fname: "System", lname: "Admin", email: `admin-${Date.now()}@viu.ca`, password: "password123",
		});
		
		const loginRes = await request(app).post("/api/auth/login").send({
			email: userRes.body.email, password: "password123",
		});
		
		authToken = loginRes.body.token;
	}, 30000);

	afterAll(async () => {
		await closeDatabase();
	});

	describe("Database Reset Route", () => {
		it("POST /api/admin/reset-db - should catch database execution errors", async () => {
			// Spying on Sequelize's sync function to force a critical failure
			const spy = vi
				.spyOn(sequelize, "sync")
				.mockRejectedValue(new Error("Database connection lost"));

			const res = await request(app)
				.post("/api/admin/reset-db")
				.set("Authorization", `Bearer ${authToken}`);

			expect(res.statusCode).toEqual(500);
			expect(res.body.error).toBe("Database connection lost");

			spy.mockRestore();
		});

		it("POST /api/admin/reset-db - should reset database successfully", async () => {
			const res = await request(app)
				.post("/api/admin/reset-db")
				.set("Authorization", `Bearer ${authToken}`);

			expect(res.statusCode).toEqual(200);
			expect(res.body).toHaveProperty("success", true);
			expect(res.body).toHaveProperty("message", "Database reset and seeded successfully.");
		}, 30000); // 30 second timeout as DB resets can be slow
	});
});