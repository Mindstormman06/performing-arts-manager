import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import app from "../server.js";
import models from "../src/models/index.js";
import organizationService from "../src/services/organization.service.js";
import orgMembershipService from "../src/services/orgMembership.service.js";
import orgRoleService from "../src/services/orgRole.service.js";
import { closeDatabase, setupTestDatabase } from "./utils/test-setup.js";

describe("Organization API & Permissions", () => {
	let authToken;
	let testUserId;
	let testOrgId;

	beforeAll(async () => {
		await setupTestDatabase();

		// Create user and login to get JWT for protected Org routes
		const email = `org-tester-${Date.now()}@viu.ca`;
		const userRes = await request(app).post("/api/users").send({
			fname: "Org",
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
	}, 30000);

	afterAll(async () => {
		await closeDatabase();
	});

	describe("Organization Core CRUD", () => {
		it("POST /api/orgs - should block creation if no token provided", async () => {
			const res = await request(app)
				.post("/api/orgs")
				.send({ name: "Test Org" });
			expect(res.statusCode).toEqual(401);
		});

		it("POST /api/orgs - should create organization when authenticated", async () => {
			const res = await request(app)
				.post("/api/orgs")
				.set("Authorization", `Bearer ${authToken}`)
				.send({ name: "VIU Theatre Dept" });

			expect(res.statusCode).toEqual(201);
			testOrgId = res.body.id; // Save org ID for subsequent tests
		});

		it("GET /api/orgs - should fetch all organizations", async () => {
			const res = await request(app).get("/api/orgs");
			expect(res.statusCode).toEqual(200);
			expect(Array.isArray(res.body)).toBe(true);
		});

		it("PUT /api/orgs/:id - should update organization details", async () => {
			const res = await request(app)
				.put(`/api/orgs/${testOrgId}`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ name: "Updated VIU Theatre Dept" });
			expect(res.statusCode).toEqual(200);
		});
	});

	describe("Organization Membership & Roles", () => {
		it("Should allow a new user to join an organization", async () => {
			// Create a brand new user who isn't in the org yet
			const newUserRes = await request(app)
				.post("/api/users")
				.send({
					fname: "New",
					lname: "Joiner",
					email: `joiner-${Date.now()}@viu.ca`,
					password: "password123",
				});
			const newUserId = newUserRes.body.id;

			const res = await request(app)
				.post(`/api/orgs/${testOrgId}/join`)
				.send({ userId: newUserId });

			expect(res.statusCode).toBeLessThan(300);
		});

		it("Should fail when joining an org the user is already in", async () => {
			const res = await request(app)
				.post(`/api/orgs/${testOrgId}/join`)
				.send({ userId: testUserId });

			expect(res.statusCode).toEqual(409);
		});

		it("Should assign a role to a user within an org", async () => {
			const res = await request(app)
				.put(`/api/orgs/${testOrgId}/users/${testUserId}/roles`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ roles: ["admin"] });

			expect(res.statusCode).toEqual(200);
		});

		it("GET /api/orgs/:orgId/users - should get all users in an org", async () => {
			const res = await request(app)
				.get(`/api/orgs/${testOrgId}/users`)
				.set("Authorization", `Bearer ${authToken}`);
			expect(res.statusCode).toEqual(200);
		});
	});

	describe("Org User Management (Happy Paths)", () => {
		it("GET /api/orgs/:orgId/users/role?role=admin - should get users by role (Line 81)", async () => {
			const res = await request(app)
				.get(`/api/orgs/${testOrgId}/users/role`)
				.query({ role: "admin" })
				.set("Authorization", `Bearer ${authToken}`);
			expect(res.statusCode).toEqual(200);
		});

		it("GET /api/orgs/:orgId/users/:userId - should get a specific user", async () => {
			const res = await request(app)
				.get(`/api/orgs/${testOrgId}/users/${testUserId}`)
				.set("Authorization", `Bearer ${authToken}`);
			expect(res.statusCode).toEqual(200);
		});

		it("GET /api/orgs/my - should get user's organizations", async () => {
			const res = await request(app)
				.get("/api/orgs/my")
				.set("Authorization", `Bearer ${authToken}`);
			expect(res.statusCode).toEqual(200);
		});

		it("DELETE /api/orgs/:orgId/users/:userId - should remove user from organization (Line 96)", async () => {
			// Create another user to leave
			const leaveUserRes = await request(app)
				.post("/api/users")
				.send({
					fname: "Leave",
					lname: "User",
					email: `leave-${Date.now()}@viu.ca`,
					password: "password123",
				});
			const leaveUserId = leaveUserRes.body.id;
			await request(app)
				.post(`/api/orgs/${testOrgId}/join`)
				.send({ userId: leaveUserId });

			const res = await request(app)
				.delete(`/api/orgs/${testOrgId}/users/${leaveUserId}`)
				.set("Authorization", `Bearer ${authToken}`);
			expect(res.statusCode).toEqual(200);
		});

		it("DELETE /api/orgs/:orgId/users/:userId/roles - should remove a role (Line 111)", async () => {
			// 1. Send BOTH roles so the PUT endpoint doesn't overwrite and wipe out 'admin'
			await request(app)
				.put(`/api/orgs/${testOrgId}/users/${testUserId}/roles`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ roles: ["admin", "actor"] });

			// 2. Now safely remove only the disposable actor role
			const res = await request(app)
				.delete(`/api/orgs/${testOrgId}/users/${testUserId}/roles`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ role: "actor" });
			expect(res.statusCode).toEqual(200);
		});
	});

	describe("Invitations", () => {
		const inviteeEmail = `invitee-${Date.now()}@viu.ca`;

		it("Should invite a user via email", async () => {
			// Create the user first so they exist in the DB
			await request(app).post("/api/users").send({
				fname: "Invitee",
				lname: "User",
				email: inviteeEmail,
				password: "password123",
			});

			const res = await request(app)
				.post(`/api/orgs/${testOrgId}/invite`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ email: inviteeEmail });
			expect(res.statusCode).toEqual(201);
		});

		it("Should accept an organization invite", async () => {
			// Mocking the DB call to simulate an active invitation
			const mockMembership = { update: vi.fn(), destroy: vi.fn() };
			const spy = vi
				.spyOn(models.OrgMembership, "findOne")
				.mockResolvedValue(mockMembership);

			const res = await request(app)
				.put(`/api/orgs/${testOrgId}/respond`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ action: "accept" });

			expect(res.statusCode).toEqual(200);
			expect(mockMembership.update).toHaveBeenCalledWith({ status: "active" });
			spy.mockRestore();
		});

		it("Should reject invite if user is already in org or pending (Service Line 43)", async () => {
			// inviteeEmail was successfully invited in the first test of this block,
			// meaning their status is now 'pending' or 'active'.
			// Inviting them again natively forces the service to throw its own error.
			const res = await request(app)
				.post(`/api/orgs/${testOrgId}/invite`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ email: inviteeEmail });

			expect(res.statusCode).toEqual(400);
			expect(res.body.success).toBe(false);
			expect(res.body.message).toContain(
				"already in this organization or pending",
			);
		});
	});

	describe("Organization Error Handling Mocks", () => {
		it("GET /api/orgs/:orgId/users - should return 404 for non-existent org", async () => {
			const res = await request(app).get(`/api/orgs/9999/users`);
			expect(res.statusCode).toEqual(404);
		});

		it("Should handle service crash during org creation", async () => {
			const spy = vi
				.spyOn(organizationService, "create")
				.mockRejectedValue(new Error("DB error"));
			const res = await request(app)
				.post("/api/orgs")
				.set("Authorization", `Bearer ${authToken}`)
				.send({ name: "Crash Org" });
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});
	});

	describe("orgMembership.service.js - Native Validation", () => {
		it("should throw 'Organization not found' natively (Line 19)", async () => {
			const res = await request(app)
				.post(`/api/orgs/99999/join`)
				.send({ userId: testUserId });

			// The join controller passes unknown errors to next(), resulting in 500
			expect(res.statusCode).toEqual(500);
		});

		it("should throw 'User not found' natively (Line 22)", async () => {
			const res = await request(app)
				.post(`/api/orgs/${testOrgId}/join`)
				.send({ userId: 99999 });

			expect(res.statusCode).toEqual(500);
		});

		it("should throw 'No user found with that email.' natively (Line 37)", async () => {
			const res = await request(app)
				.post(`/api/orgs/${testOrgId}/invite`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ email: "doesnotexist@viu.ca" });

			// The invite controller specifically catches this error and returns a 400
			expect(res.statusCode).toEqual(400);
		});
	});

	describe("orgMembershipController - Error Handling", () => {
		it("Should return an error for non-existent org", async () => {
			const res = await request(app).get(`/api/orgs/9999/users`);
			expect(res.statusCode).toEqual(404);
		});
		it("Should return an error for non-existent user in org", async () => {
			const res = await request(app)
				.get(`/api/orgs/${testOrgId}/users/999`)
				.set("Authorization", `Bearer ${authToken}`);
			expect(res.statusCode).toEqual(404);
		});
		it("GET /api/orgs/:orgId/users/:userId - should handle generic errors", async () => {
			const spy = vi
				.spyOn(orgRoleService, "getOrgUserById")
				.mockRejectedValue(new Error("Some other error"));
			const res = await request(app)
				.get(`/api/orgs/${testOrgId}/users/${testUserId}`)
				.set("Authorization", `Bearer ${authToken}`);
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});
		it("PUT /api/orgs/:orgId/users/:userId/roles - should return 404 for invalid roles", async () => {
			const spy = vi
				.spyOn(orgRoleService, "setRolesForAssignment")
				.mockRejectedValue(
					new Error("User is not a member of this organization"),
				);
			const res = await request(app)
				.put(`/api/orgs/${testOrgId}/users/${testUserId}/roles`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ roles: ["invalid"] });
			expect(res.statusCode).toEqual(404);
			spy.mockRestore();
		});
		it("PUT /api/orgs/:orgId/users/:userId/roles - should handle generic errors", async () => {
			const spy = vi
				.spyOn(orgRoleService, "setRolesForAssignment")
				.mockRejectedValue(new Error("Some other error"));
			const res = await request(app)
				.put(`/api/orgs/${testOrgId}/users/${testUserId}/roles`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ roles: ["admin"] });
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});
		it("GET /api/orgs/my - should handle service errors", async () => {
			const spy = vi
				.spyOn(orgMembershipService, "getUserOrganizations")
				.mockRejectedValue(new Error("Database error"));
			const res = await request(app)
				.get("/api/orgs/my")
				.set("Authorization", `Bearer ${authToken}`);
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});
		it("GET /api/orgs/:orgId/users - should return 404 for org not found", async () => {
			const spy = vi
				.spyOn(orgRoleService, "getOrgUsers")
				.mockRejectedValue(new Error("Organization not found"));
			const res = await request(app)
				.get(`/api/orgs/9999/users`)
				.set("Authorization", `Bearer ${authToken}`);
			expect(res.statusCode).toEqual(404);
			spy.mockRestore();
		});
		it("GET /api/orgs/:orgId/users - should handle generic errors", async () => {
			const spy = vi
				.spyOn(orgRoleService, "getOrgUsers")
				.mockRejectedValue(new Error("Some other error"));
			const res = await request(app)
				.get(`/api/orgs/${testOrgId}/users`)
				.set("Authorization", `Bearer ${authToken}`);
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});
		it("GET /api/orgs/:orgId/users/role - should return 404 for role not found", async () => {
			const spy = vi
				.spyOn(orgRoleService, "getUsersByRole")
				.mockRejectedValue(new Error("Role not found"));
			const res = await request(app)
				.get(`/api/orgs/${testOrgId}/users/role`)
				.query({ role: "nonexistent" })
				.set("Authorization", `Bearer ${authToken}`);
			expect(res.statusCode).toEqual(404);
			spy.mockRestore();
		});
		it("GET /api/orgs/:orgId/users/role - should handle generic errors", async () => {
			const spy = vi
				.spyOn(orgRoleService, "getUsersByRole")
				.mockRejectedValue(new Error("Some other error"));
			const res = await request(app)
				.get(`/api/orgs/${testOrgId}/users/role`)
				.query({ role: "admin" })
				.set("Authorization", `Bearer ${authToken}`);
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});
		it("DELETE /api/orgs/:orgId/users/:userId - should return 404 for user not member", async () => {
			const spy = vi
				.spyOn(orgRoleService, "removeUserFromOrg")
				.mockRejectedValue(new Error("not a member"));
			const res = await request(app)
				.delete(`/api/orgs/${testOrgId}/users/999`)
				.set("Authorization", `Bearer ${authToken}`);
			expect(res.statusCode).toEqual(404);
			spy.mockRestore();
		});
		it("DELETE /api/orgs/:orgId/users/:userId - should handle generic errors", async () => {
			const spy = vi
				.spyOn(orgRoleService, "removeUserFromOrg")
				.mockRejectedValue(new Error("Some other error"));
			const res = await request(app)
				.delete(`/api/orgs/${testOrgId}/users/${testUserId}`)
				.set("Authorization", `Bearer ${authToken}`);
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});
		it("DELETE /api/orgs/:orgId/users/:userId/roles - should return 404 for invalid role removal", async () => {
			const spy = vi
				.spyOn(orgRoleService, "removeRolesFromUser")
				.mockRejectedValue(new Error("required role"));
			const res = await request(app)
				.delete(`/api/orgs/${testOrgId}/users/${testUserId}/roles`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ role: "invalid" });
			expect(res.statusCode).toEqual(404);
			spy.mockRestore();
		});
		it("DELETE /api/orgs/:orgId/users/:userId/roles - should handle generic errors", async () => {
			const spy = vi
				.spyOn(orgRoleService, "removeRolesFromUser")
				.mockRejectedValue(new Error("Some other error"));
			const res = await request(app)
				.delete(`/api/orgs/${testOrgId}/users/${testUserId}/roles`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ role: "admin" });
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});
		it("POST /api/orgs/:orgId/invite - should return 400 for user already in org", async () => {
			const spy = vi
				.spyOn(orgMembershipService, "inviteByEmail")
				.mockRejectedValue(new Error("already in this organization"));
			const res = await request(app)
				.post(`/api/orgs/${testOrgId}/invite`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ email: "existing@example.com" });
			expect(res.statusCode).toEqual(400);
			spy.mockRestore();
		});
		it("POST /api/orgs/:orgId/invite - should handle generic errors", async () => {
			const spy = vi
				.spyOn(orgMembershipService, "inviteByEmail")
				.mockRejectedValue(new Error("Some other error"));
			const res = await request(app)
				.post(`/api/orgs/${testOrgId}/invite`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ email: "new@example.com" });
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});
		it("PUT /api/orgs/:orgId/respond - should return 404 for no pending invite", async () => {
			const res = await request(app)
				.put(`/api/orgs/${testOrgId}/respond`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ action: "accept" });
			expect(res.statusCode).toEqual(404);
		});
		it("PUT /api/orgs/:orgId/respond - should handle decline action", async () => {
			const mockMembership = { update: vi.fn(), destroy: vi.fn() };
			const spy = vi
				.spyOn(models.OrgMembership, "findOne")
				.mockResolvedValue(mockMembership);
			const res = await request(app)
				.put(`/api/orgs/${testOrgId}/respond`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ action: "decline" });
			expect(res.statusCode).toEqual(200);
			expect(mockMembership.destroy).toHaveBeenCalled();
			spy.mockRestore();
		});
		it("PUT /api/orgs/:orgId/respond - should handle generic errors", async () => {
			const spy = vi
				.spyOn(models.OrgMembership, "findOne")
				.mockRejectedValue(new Error("Some other error"));
			const res = await request(app)
				.put(`/api/orgs/${testOrgId}/respond`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ action: "accept" });
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});

		it("POST /api/orgs/:orgId/join - should catch 'User already in organization' (Line 21)", async () => {
			const spy = vi
				.spyOn(orgMembershipService, "addUserToOrg")
				.mockRejectedValue(new Error("User already in organization"));
			const res = await request(app)
				.post(`/api/orgs/${testOrgId}/join`)
				.send({ userId: testUserId });
			expect(res.statusCode).toEqual(409);
			spy.mockRestore();
		});

		it("GET /api/orgs/:orgId/users/role - should catch 'not found' (Line 81)", async () => {
			const spy = vi
				.spyOn(orgRoleService, "getUsersByRole")
				.mockRejectedValue(new Error("Role not found"));
			const res = await request(app).get(
				`/api/orgs/${testOrgId}/users/role?role=fake`,
			);
			expect(res.statusCode).toEqual(404);
			spy.mockRestore();
		});

		it("DELETE /api/orgs/:orgId/users/:userId - should catch 'not a member' (Line 96)", async () => {
			const spy = vi
				.spyOn(orgRoleService, "removeUserFromOrg")
				.mockRejectedValue(new Error("User is not a member"));
			const res = await request(app)
				.delete(`/api/orgs/${testOrgId}/users/${testUserId}`)
				.set("Authorization", `Bearer ${authToken}`);
			expect(res.statusCode).toEqual(404);
			spy.mockRestore();
		});

		it("DELETE .../roles - should catch 'required' role error (Line 111)", async () => {
			const spy = vi
				.spyOn(orgRoleService, "removeRolesFromUser")
				.mockRejectedValue(new Error("Role is required"));
			const res = await request(app)
				.delete(`/api/orgs/${testOrgId}/users/${testUserId}/roles`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ role: "admin" });
			expect(res.statusCode).toEqual(404);
			spy.mockRestore();
		});

		it("POST /api/orgs/:orgId/invite - should catch 'No user found' (Line 133)", async () => {
			const spy = vi
				.spyOn(orgMembershipService, "inviteByEmail")
				.mockRejectedValue(new Error("No user found with that email"));
			const res = await request(app)
				.post(`/api/orgs/${testOrgId}/invite`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ email: "ghost@viu.ca" });
			expect(res.statusCode).toEqual(400);
			spy.mockRestore();
		});

		it("POST /api/orgs/:orgId/join - should hit next(error) (Line 21)", async () => {
			const spy = vi
				.spyOn(orgMembershipService, "addUserToOrg")
				.mockRejectedValue(new Error("Random Database Error"));
			const res = await request(app)
				.post(`/api/orgs/${testOrgId}/join`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ userId: testUserId });
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});

		it("GET /api/orgs/:orgId/users/role - should hit next(error) (Line 81)", async () => {
			const spy = vi
				.spyOn(orgRoleService, "getUsersByRole")
				.mockRejectedValue(new Error("Random Database Error"));
			const res = await request(app)
				.get(`/api/orgs/${testOrgId}/users/role?role=admin`)
				.set("Authorization", `Bearer ${authToken}`);
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});

		it("DELETE /api/orgs/:orgId/users/:userId - should catch 'Organization not found' (Line 96)", async () => {
			const spy = vi
				.spyOn(orgRoleService, "removeUserFromOrg")
				.mockRejectedValue(new Error("Organization not found"));
			const res = await request(app)
				.delete(`/api/orgs/${testOrgId}/users/${testUserId}`)
				.set("Authorization", `Bearer ${authToken}`);
			expect(res.statusCode).toEqual(404);
			spy.mockRestore();
		});

		it("DELETE .../roles - should catch 'not found' and 'does not' (Lines 111 & 112)", async () => {
			let spy = vi
				.spyOn(orgRoleService, "removeRolesFromUser")
				.mockRejectedValue(new Error("Role not found"));
			let res = await request(app)
				.delete(`/api/orgs/${testOrgId}/users/${testUserId}/roles`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ role: "admin" });
			expect(res.statusCode).toEqual(404);
			spy.mockRestore();

			spy = vi
				.spyOn(orgRoleService, "removeRolesFromUser")
				.mockRejectedValue(new Error("User does not have role"));
			res = await request(app)
				.delete(`/api/orgs/${testOrgId}/users/${testUserId}/roles`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ role: "admin" });
			expect(res.statusCode).toEqual(404);
			spy.mockRestore();
		});

		it("POST /api/orgs/:orgId/invite - should catch 'already in' (Line 133)", async () => {
			const spy = vi
				.spyOn(orgMembershipService, "inviteByEmail")
				.mockRejectedValue(new Error("User is already in this org"));
			const res = await request(app)
				.post(`/api/orgs/${testOrgId}/invite`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ email: "ghost@viu.ca" });
			expect(res.statusCode).toEqual(400);
			spy.mockRestore();
		});
	});

	describe("organizationController - Error Handling", () => {
		it("GET /api/orgs - should handle generic errors", async () => {
			const spy = vi
				.spyOn(organizationService, "getAll")
				.mockRejectedValue(new Error("Some error"));
			const res = await request(app).get("/api/orgs");
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});
		it("GET /api/orgs/:id - should return 404 for organization not found", async () => {
			const spy = vi
				.spyOn(organizationService, "getById")
				.mockRejectedValue(new Error("Organization not found"));
			const res = await request(app).get(`/api/orgs/999`);
			expect(res.statusCode).toEqual(404);
			spy.mockRestore();
		});
		it("GET /api/orgs/:id - should handle generic errors", async () => {
			const spy = vi
				.spyOn(organizationService, "getById")
				.mockRejectedValue(new Error("Some other error"));
			const res = await request(app).get(`/api/orgs/${testOrgId}`);
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});
		it("PUT /api/orgs/:id - should return 404 for organization not found", async () => {
			const spy = vi
				.spyOn(organizationService, "update")
				.mockRejectedValue(new Error("Organization not found"));
			const res = await request(app)
				.put(`/api/orgs/${testOrgId}`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ name: "Updated" });
			expect(res.statusCode).toEqual(404);
			spy.mockRestore();
		});
		it("PUT /api/orgs/:id - should handle generic errors", async () => {
			const spy = vi
				.spyOn(organizationService, "update")
				.mockRejectedValue(new Error("Some other error"));
			const res = await request(app)
				.put(`/api/orgs/${testOrgId}`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ name: "Updated" });
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});
		it("DELETE /api/orgs/:id - should return 404 for organization not found", async () => {
			const spy = vi
				.spyOn(organizationService, "remove")
				.mockRejectedValue(new Error("Organization not found"));
			const res = await request(app)
				.delete(`/api/orgs/${testOrgId}`)
				.set("Authorization", `Bearer ${authToken}`);
			expect(res.statusCode).toEqual(404);
			spy.mockRestore();
		});
		it("DELETE /api/orgs/:id - should handle generic errors", async () => {
			const spy = vi
				.spyOn(organizationService, "remove")
				.mockRejectedValue(new Error("Some other error"));
			const res = await request(app)
				.delete(`/api/orgs/${testOrgId}`)
				.set("Authorization", `Bearer ${authToken}`);
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});

		it("getOrgUsers - should throw 'No users found' (Line 68)", async () => {
			// Create an empty org using Sequelize directly to guarantee zero members
			const emptyOrg = await models.Organization.create({
				name: "Ghost Town Org",
			});

			await expect(orgRoleService.getOrgUsers(emptyOrg.id)).rejects.toThrow(
				"No users found for this organization",
			);
		});

		it("removeUserFromOrg - should throw 'Organization not found' (Line 126)", async () => {
			await expect(
				orgRoleService.removeUserFromOrg(99999, testUserId),
			).rejects.toThrow("Organization not found");
		});

		it("removeRolesFromUser - should throw 'Role names are required' (Line 137)", async () => {
			await expect(
				orgRoleService.removeRolesFromUser(testOrgId, testUserId, []),
			).rejects.toThrow("Role names are required");

			await expect(
				orgRoleService.removeRolesFromUser(testOrgId, testUserId, ""),
			).rejects.toThrow("Role names are required");
		});

		it("removeRolesFromUser - should throw 'Membership or Roles not found' (Line 149)", async () => {
			// Testing a fake user id
			await expect(
				orgRoleService.removeRolesFromUser(testOrgId, 99999, ["admin"]),
			).rejects.toThrow("Membership or Roles not found");

			// Testing a fake role
			await expect(
				orgRoleService.removeRolesFromUser(testOrgId, testUserId, [
					"mythical-role",
				]),
			).rejects.toThrow("Membership or Roles not found");
		});

		it("removeRolesFromUser - should throw 'User does not have any of these roles'", async () => {
			// testUserId is an "admin". "president" is a real role in the DB,
			// but this user doesn't have it. This will yield a deletedCount of 0.
			await expect(
				orgRoleService.removeRolesFromUser(testOrgId, testUserId, [
					"president",
				]),
			).rejects.toThrow("User does not have any of these roles");
		});

		it("setRolesForAssignment - should throw 'Organization not found'", async () => {
			await expect(
				orgRoleService.setRolesForAssignment(99999, testUserId, ["admin"]),
			).rejects.toThrow("Organization not found");
		});

		it("setRolesForAssignment - should throw 'User is not a member'", async () => {
			await expect(
				orgRoleService.setRolesForAssignment(testOrgId, 99999, ["admin"]),
			).rejects.toThrow("User is not a member of this organization");
		});

		it("getOrgUserById - should throw 'Organization not found'", async () => {
			await expect(
				orgRoleService.getOrgUserById(99999, testUserId),
			).rejects.toThrow("Organization not found");
		});

		it("getOrgUserById - should throw 'User not found in this organization'", async () => {
			await expect(
				orgRoleService.getOrgUserById(testOrgId, 99999),
			).rejects.toThrow("User not found in this organization");
		});

		it("getUsersByRole - should throw 'Organization not found'", async () => {
			await expect(
				orgRoleService.getUsersByRole(99999, "admin"),
			).rejects.toThrow("Organization not found");
		});

		it("getUsersByRole - should throw 'Role not found'", async () => {
			await expect(
				orgRoleService.getUsersByRole(testOrgId, "mythical-role"),
			).rejects.toThrow("Role not found");
		});

		it("removeUserFromOrg - should throw 'User is not a member'", async () => {
			await expect(
				orgRoleService.removeUserFromOrg(testOrgId, 99999),
			).rejects.toThrow("User is not a member of this organization");
		});

		it("setRolesForAssignment - should clear all roles when passing an empty array (Line 40)", async () => {
			// Passing an empty array skips the role creation block entirely
			const res = await orgRoleService.setRolesForAssignment(
				testOrgId,
				testUserId,
				[],
			);
			expect(Array.isArray(res)).toBe(true);

			// Restore the admin role so the final test can successfully delete the org!
			await orgRoleService.setRolesForAssignment(testOrgId, testUserId, [
				"admin",
			]);
		});

		describe("organization.service.js - Direct Service Tests", () => {
			it("getById - should throw 'Organization not found' (Line 14)", async () => {
				await expect(organizationService.getById(99999)).rejects.toThrow(
					"Organization not found",
				);
			});

			it("update - should throw 'Organization not found' (Line 55)", async () => {
				await expect(
					organizationService.update(99999, { name: "Test" }),
				).rejects.toThrow("Organization not found");
			});

			it("remove - should throw 'Organization not found' (Line 64)", async () => {
				await expect(organizationService.remove(99999)).rejects.toThrow(
					"Organization not found",
				);
			});

			it("create - should throw 'President role not found' (Line 30)", async () => {
				// Intercept the Role lookup and pretend the 'president' role doesn't exist in the DB
				const spy = vi.spyOn(models.OrganizationRole, "findOne").mockResolvedValue(null);

				await expect(
					organizationService.create({
						name: "No President Org",
						userId: testUserId,
					}),
				).rejects.toThrow("President role not found");

				spy.mockRestore();
			});

			it("getById - should return organization successfully (Line 16)", async () => {
				// Directly calling the service's happy path
				const org = await organizationService.getById(testOrgId);
				expect(org).toBeDefined();
				expect(org.id).toBe(testOrgId);
			});

			it("create - should rollback transaction on error (Lines 47-48)", async () => {
				// Intercept the Organization creation and force a critical database failure
				const spy = vi
					.spyOn(models.Organization, "create")
					.mockRejectedValue(new Error("Critical DB Transaction Failure"));

				await expect(
					organizationService.create({ name: "Fail Org", userId: testUserId }),
				).rejects.toThrow("Critical DB Transaction Failure");

				spy.mockRestore();
			});
		});

		it("DELETE /api/orgs/:id - should delete organization", async () => {
			// Because the testUser retained their admin role, we can safely
			// delete the main test organization to finish the file!
			const res = await request(app)
				.delete(`/api/orgs/${testOrgId}`)
				.set("Authorization", `Bearer ${authToken}`);
			expect(res.statusCode).toEqual(200);
		});
	});
});
