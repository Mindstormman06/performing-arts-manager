/**
 * Integration tests for the inventory routes: departments, org-wide (global)
 * inventory CRUD, and authentication on the show inventory routes.
 *
 * @remarks
 * Needs the live MySQL test DB: `beforeAll` runs `setupTestDatabase`, then
 * creates a user, an org and a show through the API. The first departments
 * test stores the department id that later create and delete tests use.
 * Service error paths spy on `inventoryService` and restore each spy.
 */

import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import app from "../../server.js";
import inventoryService from "../../src/services/inventory.service.js";
import { closeDatabase, setupTestDatabase } from "./utils/test-setup.js";

describe("Inventory Management API", () => {
	let authToken;
	let testUserId;
	let testOrgId;
	let testShowId;
	let _testInventoryId;
	let testDepartmentId;

	beforeAll(async () => {
		await setupTestDatabase();

		const email = `inventory-tester-${Date.now()}@viu.ca`;
		const userRes = await request(app).post("/api/users").send({
			fname: "Inventory",
			lname: "Tester",
			email,
			password: "password123",
		});
		testUserId = userRes.body.id;

		const loginRes = await request(app).post("/api/auth/login").send({
			email,
			password: "password123",
		});
		authToken = loginRes.body.token;

		const orgRes = await request(app)
			.post("/api/orgs")
			.set("Authorization", `Bearer ${authToken}`)
			.send({ name: "Inventory Test Org" });
		testOrgId = orgRes.body.id;

		await request(app)
			.put(`/api/orgs/${testOrgId}/users/${testUserId}/roles`)
			.set("Authorization", `Bearer ${authToken}`)
			.send({ roles: ["admin", "costumes", "props", "sets", "tech"] });

		const showRes = await request(app)
			.post("/api/shows")
			.set("Authorization", `Bearer ${authToken}`)
			.send({
				name: "Inventory Test Show",
				org_id: testOrgId,
				start_date: "2026-04-01",
				end_date: "2026-04-15",
			});
		testShowId = showRes.body.id;

		await request(app)
			.post(`/api/shows/${testShowId}/join`)
			.send({ userId: testUserId });

		await request(app)
			.put(`/api/shows/${testShowId}/users/${testUserId}/roles`)
			.set("Authorization", `Bearer ${authToken}`)
			.send({
				roles: [
					"director",
					"stage-manager",
					"costumes",
					"props",
					"sets",
					"tech",
				],
			});
	}, 30000);

	afterAll(async () => {
		await closeDatabase();
	});

	describe("getDepartments", () => {
		it("GET /api/inventory/departments - should return all departments", async () => {
			const res = await request(app)
				.get("/api/inventory/departments")
				.set("Authorization", `Bearer ${authToken}`);

			expect(res.statusCode).toEqual(200);
			expect(Array.isArray(res.body)).toBe(true);
			expect(res.body.length).toBeGreaterThan(0);
			expect(res.body[0]).toHaveProperty("name");
			testDepartmentId = res.body[0].id;
			expect(testDepartmentId).toBeDefined();
		});

		it("GET /api/inventory/departments - should require authentication", async () => {
			const res = await request(app).get("/api/inventory/departments");

			expect(res.statusCode).toEqual(401);
		});

		it("GET /api/inventory/departments - should handle service errors", async () => {
			const spy = vi
				.spyOn(inventoryService, "getDepartments")
				.mockRejectedValue(new Error("Database error"));

			const res = await request(app)
				.get("/api/inventory/departments")
				.set("Authorization", `Bearer ${authToken}`);

			expect(res.statusCode).toEqual(500);
			expect(res.body.success).toBe(false);

			spy.mockRestore();
		});
	});

	describe("Global Inventory Management", () => {
		describe("getGlobal", () => {
			it("GET /api/inventory/orgs/:orgId - should return organization inventory items", async () => {
				const res = await request(app)
					.get(`/api/inventory/orgs/${testOrgId}`)
					.set("Authorization", `Bearer ${authToken}`);

				expect(res.statusCode).toEqual(200);
				expect(Array.isArray(res.body)).toBe(true);
			});

			it("GET /api/inventory/orgs/:orgId - should require authentication", async () => {
				const res = await request(app).get(`/api/inventory/orgs/${testOrgId}`);

				expect(res.statusCode).toEqual(401);
			});

			it("GET /api/inventory/orgs/:orgId - should handle service errors", async () => {
				const spy = vi
					.spyOn(inventoryService, "getGlobalInventory")
					.mockRejectedValue(new Error("Database error"));

				const res = await request(app)
					.get(`/api/inventory/orgs/${testOrgId}`)
					.set("Authorization", `Bearer ${authToken}`);

				expect(res.statusCode).toEqual(500);

				spy.mockRestore();
			});
		});

		describe("createGlobal", () => {
			it("POST /api/inventory/orgs/:orgId - should create a global inventory item", async () => {
				const res = await request(app)
					.post(`/api/inventory/orgs/${testOrgId}`)
					.set("Authorization", `Bearer ${authToken}`)
					.send({
						name: "Test Prop",
						description: "A test prop for inventory",
						dept_id: testDepartmentId,
						quantity: 5,
						condition: "good",
					});

				expect(res.statusCode).toEqual(201);
				expect(res.body.success).toBe(true);
				expect(res.body.data).toHaveProperty("id");
				_testInventoryId = res.body.data.id;
			});

			it("POST /api/inventory/orgs/:orgId - should return 400 for invalid department", async () => {
				const res = await request(app)
					.post(`/api/inventory/orgs/${testOrgId}`)
					.set("Authorization", `Bearer ${authToken}`)
					.send({
						name: "Test Prop",
						description: "A test prop",
						dept_id: 99999,
						quantity: 5,
						condition: "good",
					});

				expect(res.statusCode).toEqual(400);
				expect(res.body.success).toBe(false);
				expect(res.body.message).toContain("Invalid department");
			});

			it("POST /api/inventory/orgs/:orgId - should require authentication", async () => {
				const res = await request(app)
					.post(`/api/inventory/orgs/${testOrgId}`)
					.send({
						name: "Test Prop",
						description: "A test prop",
						dept_id: testDepartmentId,
						quantity: 5,
					});

				expect(res.statusCode).toEqual(401);
			});

			it("POST /api/inventory/orgs/:orgId - should handle service errors", async () => {
				const spy = vi
					.spyOn(inventoryService, "createGlobalItem")
					.mockRejectedValue(new Error("Some unexpected error"));

				const res = await request(app)
					.post(`/api/inventory/orgs/${testOrgId}`)
					.set("Authorization", `Bearer ${authToken}`)
					.send({
						name: "Test Prop",
						description: "A test prop",
						dept_id: testDepartmentId,
						quantity: 5,
					});

				expect(res.statusCode).toEqual(500);

				spy.mockRestore();
			});
		});

		describe("removeGlobal", () => {
			it("DELETE /api/inventory/orgs/:orgId/items/:inventoryId - should delete a global inventory item", async () => {
				const createRes = await request(app)
					.post(`/api/inventory/orgs/${testOrgId}`)
					.set("Authorization", `Bearer ${authToken}`)
					.send({
						name: "Test Prop to Delete",
						description: "A test prop for deletion",
						dept_id: testDepartmentId,
						quantity: 5,
						condition: "good",
					});

				const itemId = createRes.body.data.id;

				const res = await request(app)
					.delete(`/api/inventory/orgs/${testOrgId}/items/${itemId}`)
					.set("Authorization", `Bearer ${authToken}`);

				expect(res.statusCode).toEqual(200);
				expect(res.body.success).toBe(true);
				expect(res.body.message).toEqual("Global item deleted");
			});

			it("DELETE /api/inventory/orgs/:orgId/items/:inventoryId - should return 404 when item not found", async () => {
				const res = await request(app)
					.delete(`/api/inventory/orgs/${testOrgId}/items/99999`)
					.set("Authorization", `Bearer ${authToken}`);

				expect(res.statusCode).toEqual(404);
				expect(res.body.success).toBe(false);
				expect(res.body.message).toContain("not found");
			});

			it("DELETE /api/inventory/orgs/:orgId/items/:inventoryId - should require authentication", async () => {
				const res = await request(app).delete(
					`/api/inventory/orgs/${testOrgId}/items/1`,
				);

				expect(res.statusCode).toEqual(401);
			});

			it("DELETE /api/inventory/orgs/:orgId/items/:inventoryId - should handle service errors", async () => {
				const spy = vi
					.spyOn(inventoryService, "removeGlobalItem")
					.mockRejectedValue(new Error("Some unexpected error"));

				const res = await request(app)
					.delete(`/api/inventory/orgs/${testOrgId}/items/1`)
					.set("Authorization", `Bearer ${authToken}`);

				expect(res.statusCode).toEqual(500);

				spy.mockRestore();
			});
		});
	});

	describe("Show Inventory Management", () => {
		describe("getShowInventory", () => {
			it("GET /api/inventory/shows/:showId - should require authentication", async () => {
				const res = await request(app).get(
					`/api/inventory/shows/${testShowId}`,
				);

				expect(res.statusCode).toEqual(401);
			});
		});

		describe("createShowItem", () => {
			it("POST /api/inventory/shows/:showId - should require authentication", async () => {
				const res = await request(app)
					.post(`/api/inventory/shows/${testShowId}`)
					.send({
						name: "Show Specific Prop",
						dept_id: testDepartmentId,
						quantity: 3,
					});

				expect(res.statusCode).toEqual(401);
			});
		});

		describe("pullItem", () => {
			it("POST /api/inventory/shows/:showId/pull/:inventoryId - should require authentication", async () => {
				const res = await request(app).post(
					`/api/inventory/shows/${testShowId}/pull/1`,
				);

				expect(res.statusCode).toEqual(401);
			});
		});

		describe("removeItem", () => {
			it("DELETE /api/inventory/shows/:showId/items/:inventoryId - should require authentication", async () => {
				const res = await request(app).delete(
					`/api/inventory/shows/${testShowId}/items/1`,
				);

				expect(res.statusCode).toEqual(401);
			});
		});
	});
});
