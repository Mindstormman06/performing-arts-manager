import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import app from "../server.js";
import models from "../src/models/index.js";
import showService from "../src/services/show.service.js";
import showMembershipService from "../src/services/showMembership.service.js";
import showRoleService from "../src/services/showRole.service.js";
import { closeDatabase, setupTestDatabase } from "./utils/test-setup.js";

describe("Show Management API", () => {
	let authToken;
	let testUserId;
	let testOrgId;
	let testShowId;

	beforeAll(async () => {
		await setupTestDatabase();

		// 1. Create a user
		const email = `show-tester-${Date.now()}@viu.ca`;
		const userRes = await request(app).post("/api/users").send({
			fname: "Show",
			lname: "Tester",
			email,
			password: "password123",
		});
		testUserId = userRes.body.id;

		// 2. Login to get Auth Token
		const loginRes = await request(app).post("/api/auth/login").send({
			email,
			password: "password123",
		});
		authToken = loginRes.body.token;

		// 3. Create an Organization
		const orgRes = await request(app)
			.post("/api/orgs")
			.set("Authorization", `Bearer ${authToken}`)
			.send({ name: "Show Test Org" });
		testOrgId = orgRes.body.id;

		// 4. Join the Org & elevate to Admin (Required to create shows)
		await request(app)
			.post(`/api/orgs/${testOrgId}/join`)
			.send({ userId: testUserId });
		await request(app)
			.put(`/api/orgs/${testOrgId}/users/${testUserId}/roles`)
			.set("Authorization", `Bearer ${authToken}`)
			.send({ roles: ["admin"] });
	}, 30000);

	afterAll(async () => {
		await closeDatabase();
	});

	describe("Show Operations", () => {
		it("POST /api/shows - should create show with Admin permissions", async () => {
			const res = await request(app)
				.post("/api/shows")
				.set("Authorization", `Bearer ${authToken}`)
				.send({
					title: "Macbeth",
					start_date: "2026-07-01",
					end_date: "2026-07-15",
					organization_id: testOrgId,
				});

			expect(res.statusCode).toEqual(201);
			testShowId = res.body.id; // Save for later tests
		});

		it("PUT .../roles - should assign roles (actor, director) to a user in a show", async () => {
			// Must join the show before receiving roles
			await request(app)
				.post(`/api/shows/${testShowId}/join`)
				.send({ userId: testUserId });

			const res = await request(app)
				.put(`/api/shows/${testShowId}/users/${testUserId}/roles`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ roles: ["actor", "director"] });

			expect(res.statusCode).toEqual(200);
			const roleNames = res.body.data.map((r) => r.name);
			expect(roleNames).toContain("actor");
			expect(roleNames).toContain("director");
		});

		it("GET /api/shows/:showId/dashboard - should return viewer dashboard data", async () => {
			const department =
				(await models.Department.findOne()) ||
				(await models.Department.create({ name: `Dashboard Dept ${Date.now()}` }));

			const inventoryName = `Dashboard Prop ${Date.now()}`;
			const eventTitle = `Dashboard Call ${Date.now()}`;
			const inventory = await models.Inventory.create({
				name: inventoryName,
				description: "Dashboard item",
				dept_id: department.id,
				is_global: 0,
				added_by: testUserId,
				org_id: testOrgId,
			});

			await models.ShowInventory.create({
				inventory_id: inventory.id,
				shows_id: testShowId,
				user_id: testUserId,
				assigned_character_id: null,
			});

			const character = await models.Casting.create({
				name: `Dashboard Character ${Date.now()}`,
				show_id: testShowId,
				users_id: testUserId,
			});

			const event = await models.Schedule.create({
				title: eventTitle,
				start_time: new Date(Date.now() + 86400000),
				end_time: new Date(Date.now() + 90000000),
				location: "Main Stage",
				description: "Personal dashboard test event",
				show_id: testShowId,
				creator_id: testUserId,
			});

			await event.setAttendees([testUserId]);
			await event.setRequiredCharacters([character.id]);

			const res = await request(app)
				.get(`/api/shows/${testShowId}/dashboard`)
				.set("Authorization", `Bearer ${authToken}`);

			expect(res.statusCode).toEqual(200);
			expect(res.body.success).toBe(true);
			expect(res.body.data.viewer.membership.roles).toEqual(
				expect.arrayContaining(["actor", "director"]),
			);
			expect(res.body.data.viewer.casting.map((item) => item.name)).toContain(
				character.name,
			);
			expect(res.body.data.viewer.inventory.map((item) => item.name)).toContain(
				inventoryName,
			);
			expect(res.body.data.viewer.schedule.map((item) => item.title)).toContain(
				eventTitle,
			);
		});

		it("PUT /api/shows/:id - should update a show's title", async () => {
			const res = await request(app)
				.put(`/api/shows/${testShowId}`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ title: "Updated Macbeth" });

			expect(res.statusCode).toEqual(200);
			expect(res.body.title).toEqual("Updated Macbeth");
		});

		it("GET /api/shows/:showId/users - should get all users in a show", async () => {
			const res = await request(app).get(`/api/shows/${testShowId}/users`);
			expect(res.statusCode).toEqual(200);
			expect(Array.isArray(res.body)).toBe(true);
		});
	});

	describe("Show Controller Error Handling", () => {
		it("DELETE /api/shows/:id - should return 404 when show is not found", async () => {
			// Mock the deletion service to simulate a non-existent show
			const spy = vi
				.spyOn(showService, "remove")
				.mockRejectedValue(new Error("Show not found"));

			const res = await request(app)
				.delete(`/api/shows/${testShowId}`)
				.set("Authorization", `Bearer ${authToken}`);

			expect(res.statusCode).toEqual(404);
			expect(res.body.message).toBe("Show not found");

			spy.mockRestore();
		});

		it("POST /api/shows/:showId/join - should return 409 for user already in show", async () => {
			const spy = vi
				.spyOn(showMembershipService, "addUserToShow")
				.mockRejectedValue(new Error("User already in show"));

			const res = await request(app)
				.post(`/api/shows/${testShowId}/join`)
				.send({ userId: testUserId });

			expect(res.statusCode).toEqual(409);
			spy.mockRestore();
		});
	});

	describe("showController - Error Handling", () => {
		it("GET /api/shows - should handle generic errors", async () => {
			const spy = vi
				.spyOn(showService, "getAll")
				.mockRejectedValue(new Error("Some error"));
			const res = await request(app).get("/api/shows");
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});
		it("GET /api/shows/:id - should return 404 for show not found", async () => {
			const spy = vi
				.spyOn(showService, "getById")
				.mockRejectedValue(new Error("Show not found"));
			const res = await request(app).get(`/api/shows/999`);
			expect(res.statusCode).toEqual(404);
			spy.mockRestore();
		});
		it("GET /api/shows/:id - should handle generic errors", async () => {
			const spy = vi
				.spyOn(showService, "getById")
				.mockRejectedValue(new Error("Some other error"));
			const res = await request(app).get(`/api/shows/${testShowId}`);
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});
		it("POST /api/shows - should handle generic errors", async () => {
			const spy = vi
				.spyOn(showService, "create")
				.mockRejectedValue(new Error("Some error"));
			const res = await request(app)
				.post("/api/shows")
				.set("Authorization", `Bearer ${authToken}`)
				.send({
					title: "New Show",
					start_date: "2026-09-01",
					end_date: "2026-09-15",
					organization_id: testOrgId,
				});
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});
		it("PUT /api/shows/:id - should return 404 for show not found", async () => {
			const spy = vi
				.spyOn(showService, "update")
				.mockRejectedValue(new Error("Show not found"));
			const res = await request(app)
				.put(`/api/shows/${testShowId}`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ title: "Updated" });
			expect(res.statusCode).toEqual(404);
			spy.mockRestore();
		});
		it("PUT /api/shows/:id - should handle generic errors", async () => {
			const spy = vi
				.spyOn(showService, "update")
				.mockRejectedValue(new Error("Some other error"));
			const res = await request(app)
				.put(`/api/shows/${testShowId}`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ title: "Updated" });
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});
		it("DELETE /api/shows/:id - should handle generic errors", async () => {
			const spy = vi
				.spyOn(showService, "remove")
				.mockRejectedValue(new Error("Some other error"));
			const res = await request(app)
				.delete(`/api/shows/${testShowId}`)
				.set("Authorization", `Bearer ${authToken}`);
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});
		it("POST /api/shows/:showId/join - should handle generic errors", async () => {
			const spy = vi
				.spyOn(showMembershipService, "addUserToShow")
				.mockRejectedValue(new Error("Some error"));
			const res = await request(app)
				.post(`/api/shows/${testShowId}/join`)
				.send({ userId: testUserId });
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});
		it("PUT /api/shows/:showId/users/:userId/roles - should return 404 for not found errors", async () => {
			const spy = vi
				.spyOn(showRoleService, "appendRolesToAssignment")
				.mockRejectedValue(new Error("not found"));
			const res = await request(app)
				.put(`/api/shows/${testShowId}/users/${testUserId}/roles`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ roles: ["actor"] });
			expect(res.statusCode).toEqual(404);
			spy.mockRestore();
		});
		it("PUT /api/shows/:showId/users/:userId/roles - should handle generic errors", async () => {
			const spy = vi
				.spyOn(showRoleService, "appendRolesToAssignment")
				.mockRejectedValue(new Error("Some error"));
			const res = await request(app)
				.put(`/api/shows/${testShowId}/users/${testUserId}/roles`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ roles: ["actor"] });
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});
		it("GET /api/shows/:showId/users - should return 404 for show not found", async () => {
			const spy = vi
				.spyOn(showRoleService, "getShowUsers")
				.mockRejectedValue(new Error("Show not found"));
			const res = await request(app).get(`/api/shows/${testShowId}/users`);
			expect(res.statusCode).toEqual(404);
			spy.mockRestore();
		});
		it("GET /api/shows/:showId/users - should handle generic errors", async () => {
			const spy = vi
				.spyOn(showRoleService, "getShowUsers")
				.mockRejectedValue(new Error("Some error"));
			const res = await request(app).get(`/api/shows/${testShowId}/users`);
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});
		it("GET /api/shows/:showId/users/:userId - should return 404 for not found", async () => {
			const spy = vi
				.spyOn(showRoleService, "getShowUserById")
				.mockRejectedValue(new Error("not found"));
			const res = await request(app).get(
				`/api/shows/${testShowId}/users/${testUserId}`,
			);
			expect(res.statusCode).toEqual(404);
			spy.mockRestore();
		});
		it("GET /api/shows/:showId/users/:userId - should handle generic errors", async () => {
			const spy = vi
				.spyOn(showRoleService, "getShowUserById")
				.mockRejectedValue(new Error("Some error"));
			const res = await request(app).get(
				`/api/shows/${testShowId}/users/${testUserId}`,
			);
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});
		it("GET /api/shows/:showId/users/search - should return 404 for not found", async () => {
			const spy = vi
				.spyOn(showRoleService, "getUsersByRole")
				.mockRejectedValue(new Error("not found"));
			const res = await request(app).get(
				`/api/shows/${testShowId}/users/search?role=actor`,
			);
			expect(res.statusCode).toEqual(404);
			spy.mockRestore();
		});
		it("GET /api/shows/:showId/users/search - should handle generic errors", async () => {
			const spy = vi
				.spyOn(showRoleService, "getUsersByRole")
				.mockRejectedValue(new Error("Some error"));
			const res = await request(app).get(
				`/api/shows/${testShowId}/users/search?role=actor`,
			);
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});
		it("DELETE /api/shows/:showId/users/:userId - should return 404 for not found", async () => {
			const spy = vi
				.spyOn(showRoleService, "removeUserFromShow")
				.mockRejectedValue(new Error("not a member"));
			const res = await request(app).delete(
				`/api/shows/${testShowId}/users/${testUserId}`,
			);
			expect(res.statusCode).toEqual(404);
			spy.mockRestore();
		});
		it("DELETE /api/shows/:showId/users/:userId - should handle generic errors", async () => {
			const spy = vi
				.spyOn(showRoleService, "removeUserFromShow")
				.mockRejectedValue(new Error("Some error"));
			const res = await request(app).delete(
				`/api/shows/${testShowId}/users/${testUserId}`,
			);
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});
		it("DELETE /api/shows/:showId/users/:userId/roles - should return 404 for not found", async () => {
			const spy = vi
				.spyOn(showRoleService, "removeRolesFromUser")
				.mockRejectedValue(new Error("not found"));
			const res = await request(app)
				.delete(`/api/shows/${testShowId}/users/${testUserId}/roles`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ roles: ["actor"] });
			expect(res.statusCode).toEqual(404);
			spy.mockRestore();
		});
		it("DELETE /api/shows/:showId/users/:userId/roles - should handle generic errors", async () => {
			const spy = vi
				.spyOn(showRoleService, "removeRolesFromUser")
				.mockRejectedValue(new Error("Some error"));
			const res = await request(app)
				.delete(`/api/shows/${testShowId}/users/${testUserId}/roles`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ roles: ["actor"] });
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});
	});

	describe("showMembershipController", () => {
		it("GET /api/shows/:showId/users/search?role=actor - should get users by role", async () => {
			const res = await request(app).get(
				`/api/shows/${testShowId}/users/search?role=actor`,
			);
			expect(res.statusCode).toEqual(200);
			expect(Array.isArray(res.body)).toBe(true);
		});
		it("GET /api/shows/:showId/users/:userId - should get a specific user", async () => {
			const res = await request(app).get(
				`/api/shows/${testShowId}/users/${testUserId}`,
			);
			expect(res.statusCode).toEqual(200);
		});
		it("DELETE /api/shows/:showId/users/:userId - should remove user from show", async () => {
			const res = await request(app).delete(
				`/api/shows/${testShowId}/users/${testUserId}`,
			);
			expect(res.statusCode).toEqual(200);
		});
		it("DELETE /api/shows/:showId/users/:userId/roles - should remove roles from user", async () => {
			const res = await request(app)
				.delete(`/api/shows/${testShowId}/users/${testUserId}/roles`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ roles: ["actor"] });
			expect(res.statusCode).toEqual(404);
		});
	});

	describe("Auth Middleware Tests (Lines 33, 41, 54, 75, 87)", () => {
		let basicAuthToken;
		let basicUserId;

		beforeAll(async () => {
			// Create a regular user to test permission rejections
			const userRes = await request(app)
				.post("/api/users")
				.send({
					fname: "Basic",
					lname: "User",
					email: `basic-${Date.now()}@viu.ca`,
					password: "password123",
				});
			basicUserId = userRes.body.id;
			const loginRes = await request(app).post("/api/auth/login").send({
				email: userRes.body.email,
				password: "password123",
			});
			basicAuthToken = loginRes.body.token;
		});

		it("authorizeOrg - should return 400 if orgId is missing (Line 33)", async () => {
			// Trying to create a show without providing an organization_id in the body
			const res = await request(app)
				.post("/api/shows")
				.set("Authorization", `Bearer ${authToken}`)
				.send({
					title: "No Org Show",
					start_date: "2026-07-01",
					end_date: "2026-07-15",
				});
			expect(res.statusCode).toEqual(400);
			expect(res.body.message).toBe("Organization ID is missing");
		});

		it("authorizeOrg - should return 403 if user is not a member of the org (Line 41)", async () => {
			// basicUser never joined testOrgId
			const res = await request(app)
				.post("/api/shows")
				.set("Authorization", `Bearer ${basicAuthToken}`)
				.send({
					title: "Unauthorized Show",
					organization_id: testOrgId,
				});
			expect(res.statusCode).toEqual(403);
			expect(res.body.message).toBe("Not a member of this organizations.");
		});

		it("authorizeOrg - should return 403 for insufficient org permissions (Line 54)", async () => {
			// Join org, but don't get 'admin' role
			await request(app)
				.post(`/api/orgs/${testOrgId}/join`)
				.send({ userId: basicUserId });

			const res = await request(app)
				.post("/api/shows")
				.set("Authorization", `Bearer ${basicAuthToken}`)
				.send({
					title: "No Admin Show",
					organization_id: testOrgId,
				});
			expect(res.statusCode).toEqual(403);
			expect(res.body.message).toBe("Insufficient permissions.");
		});

		it("authorizeShow - should return 403 if user is not a member of the show (Line 75)", async () => {
			// basicUser tries to edit testShowId without joining it
			const res = await request(app)
				.put(`/api/shows/${testShowId}`)
				.set("Authorization", `Bearer ${basicAuthToken}`)
				.send({
					title: "Hacked Show",
				});
			expect(res.statusCode).toEqual(403);
			expect(res.body.message).toBe("Not a member of this show.");
		});

		it("authorizeShow - should return 403 for insufficient show permissions (Line 87)", async () => {
			// basicUser joins show, but is given 'actor' role (updating requires director/admin)
			await request(app)
				.post(`/api/shows/${testShowId}/join`)
				.send({ userId: basicUserId });
			await request(app)
				.put(`/api/shows/${testShowId}/users/${basicUserId}/roles`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ roles: ["actor"] });

			const res = await request(app)
				.put(`/api/shows/${testShowId}`)
				.set("Authorization", `Bearer ${basicAuthToken}`)
				.send({
					title: "Actor Edited Show",
				});
			expect(res.statusCode).toEqual(403);
			expect(res.body.message).toBe("Insufficient permissions.");
		});
	});

	describe("showMembership.service.js - Direct Service Tests", () => {
		it("addUserToShow - should throw 'Show not found' (Line 5)", async () => {
			await expect(
				showMembershipService.addUserToShow(99999, testUserId),
			).rejects.toThrow("Show not found");
		});

		it("addUserToShow - should throw 'User not found' (Line 8)", async () => {
			await expect(
				showMembershipService.addUserToShow(testShowId, 99999),
			).rejects.toThrow("User not found");
		});

		it("addUserToShow - should throw 'User already in show' (Line 14)", async () => {
			// 1. Add the user back to the show (since they were removed by earlier tests)
			await showMembershipService.addUserToShow(testShowId, testUserId);

			// 2. Try to add them a second time to trigger the native error
			await expect(
				showMembershipService.addUserToShow(testShowId, testUserId),
			).rejects.toThrow("User already in show");
		});
	});

	describe("showRole.service.js - Direct Service Tests", () => {
		it("appendRolesToAssignment - should throw 'Show not found'", async () => {
			await expect(
				showRoleService.appendRolesToAssignment(99999, testUserId, ["actor"]),
			).rejects.toThrow("Show not found");
		});

		it("appendRolesToAssignment - should throw 'User is not a member'", async () => {
			await expect(
				showRoleService.appendRolesToAssignment(testShowId, 99999, ["actor"]),
			).rejects.toThrow("User is not a member of this show");
		});

		it("appendRolesToAssignment - should throw 'No valid roles'", async () => {
			await expect(
				showRoleService.appendRolesToAssignment(testShowId, testUserId, [
					"mythical-role",
				]),
			).rejects.toThrow("No valid roles provided");
		});

		it("getShowUsers - should throw 'Show not found'", async () => {
			await expect(showRoleService.getShowUsers(99999)).rejects.toThrow(
				"Show not found",
			);
		});

		it("getShowUsers - should throw 'No users found'", async () => {
			// Create a temporary show with no users to trigger the empty array error
			// We must include start_date and end_date to satisfy the database constraints!
			const emptyShow = await models.Show.create({
				title: "Empty",
				organization_id: testOrgId,
				start_date: "2026-10-01",
				end_date: "2026-10-15",
			});

			await expect(showRoleService.getShowUsers(emptyShow.id)).rejects.toThrow(
				"No users found for this show",
			);
		});

		it("getShowUserById - should throw 'Show not found'", async () => {
			await expect(
				showRoleService.getShowUserById(99999, testUserId),
			).rejects.toThrow("Show not found");
		});

		it("getShowUserById - should throw 'User not found in this show'", async () => {
			await expect(
				showRoleService.getShowUserById(testShowId, 99999),
			).rejects.toThrow("User not found in this show");
		});

		it("getUsersByRole - should throw 'Show not found'", async () => {
			await expect(
				showRoleService.getUsersByRole(99999, "actor"),
			).rejects.toThrow("Show not found");
		});

		it("getUsersByRole - should throw 'Role not found'", async () => {
			await expect(
				showRoleService.getUsersByRole(testShowId, "mythical-role"),
			).rejects.toThrow("Role not found");
		});

		it("removeUserFromShow - should throw 'Show not found'", async () => {
			await expect(
				showRoleService.removeUserFromShow(99999, testUserId),
			).rejects.toThrow("Show not found");
		});

		it("removeRolesFromUser - should throw 'Role names are required' (Line 95)", async () => {
			await expect(
				showRoleService.removeRolesFromUser(testShowId, testUserId, []),
			).rejects.toThrow("Role names are required");

			await expect(
				showRoleService.removeRolesFromUser(testShowId, testUserId, ""),
			).rejects.toThrow("Role names are required");
		});

		it("removeUserFromShow - should throw 'User is not a member' (Line 95)", async () => {
			await expect(
				showRoleService.removeUserFromShow(testShowId, 99999),
			).rejects.toThrow("User is not a member of this show");
		});

		it("removeRolesFromUser - should throw 'Membership or Roles not found' (Lines 108-109)", async () => {
			// Fake user ID to trigger !membership
			await expect(
				showRoleService.removeRolesFromUser(testShowId, 99999, ["actor"]),
			).rejects.toThrow("Membership or Roles not found");

			// Fake role to trigger !roles.length
			await expect(
				showRoleService.removeRolesFromUser(testShowId, testUserId, [
					"mythical-role",
				]),
			).rejects.toThrow("Membership or Roles not found");
		});

		it("removeRolesFromUser - should throw 'User does not have any of these roles' (Line 120)", async () => {
			// testUserId is in the show, but doesn't have the 'president' role assigned.
			await expect(
				showRoleService.removeRolesFromUser(testShowId, testUserId, [
					"president",
				]),
			).rejects.toThrow("User does not have any of these roles");
		});

		it("removeRolesFromUser - should remove role successfully (Happy Path)", async () => {
			// Assign a role first so we have something to successfully remove
			await showRoleService.appendRolesToAssignment(testShowId, testUserId, [
				"actor",
			]);

			// Now remove it to hit the final return statement (Line 123)
			const res = await showRoleService.removeRolesFromUser(
				testShowId,
				testUserId,
				["actor"],
			);
			expect(res.message).toContain("role(s) removed successfully");
		});
	});

	describe("show.service.js - Direct Service Tests", () => {
		it("getAll - should return all shows (Lines 6-9)", async () => {
			const shows = await showService.getAll();
			expect(Array.isArray(shows)).toBe(true);
		});

		it("getById - should return a show successfully (Lines 11-15)", async () => {
			const show = await showService.getById(testShowId);
			expect(show).toBeDefined();
			expect(show.id).toBe(testShowId);
		});

		it("getById - should throw 'Show not found' for invalid ID", async () => {
			await expect(showService.getById(99999)).rejects.toThrow(
				"Show not found",
			);
		});

		it("update - should throw 'Show not found' (Line 26)", async () => {
			await expect(
				showService.update(99999, { title: "Fake" }),
			).rejects.toThrow("Show not found");
		});

		it("remove - should throw 'Show not found' (Lines 33-35)", async () => {
			await expect(showService.remove(99999)).rejects.toThrow("Show not found");
		});

		it("remove - should delete show successfully (Lines 37-38)", async () => {
			// Because this is the absolute last test in the file,
			// we can safely destroy the test show directly through the service!
			const res = await showService.remove(testShowId);
			expect(res.message).toBe("Show deleted successfully");
		});
	});
});
