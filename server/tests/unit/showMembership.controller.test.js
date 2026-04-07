import { describe, expect, it, vi } from "vitest";
import showMembershipController from "../../src/controllers/showMembership.controller.js";
import showMembershipService from "../../src/services/showMembership.service.js";
import showRoleService from "../../src/services/showRole.service.js";

describe("ShowMembership Controller - Direct Tests", () => {
	describe("join", () => {
		it("should add user to show and return 201 on success", async () => {
			const mockMembership = { id: 1, showId: 1, userId: 5 };
			const spy = vi
				.spyOn(showMembershipService, "addUserToShow")
				.mockResolvedValue(mockMembership);

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1 },
				body: { userId: 5 },
			};

			await showMembershipController.join(mockReq, mockRes, mockNext);

			expect(spy).toHaveBeenCalledWith(1, 5);
			expect(mockRes.status).toHaveBeenCalledWith(201);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				message: "User added to show",
				data: mockMembership,
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should return 409 when user already in show", async () => {
			const spy = vi
				.spyOn(showMembershipService, "addUserToShow")
				.mockRejectedValue(new Error("User already in show"));

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1 },
				body: { userId: 5 },
			};

			await showMembershipController.join(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(409);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				message: "User already in show",
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should call next with error on generic failure", async () => {
			const error = new Error("Database error");
			const spy = vi
				.spyOn(showMembershipService, "addUserToShow")
				.mockRejectedValue(error);

			const mockRes = {};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1 },
				body: { userId: 5 },
			};

			await showMembershipController.join(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);

			spy.mockRestore();
		});
	});

	describe("invite (Lines 28-43)", () => {
		it("should send invitation and return 201 on success", async () => {
			const mockInvitation = { id: 1, showId: 1, email: "test@example.com" };
			const spy = vi
				.spyOn(showMembershipService, "inviteByEmail")
				.mockResolvedValue(mockInvitation);

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1 },
				body: { orgId: 2, email: "test@example.com" },
			};

			await showMembershipController.invite(mockReq, mockRes, mockNext);

			expect(spy).toHaveBeenCalledWith(2, 1, "test@example.com");
			expect(mockRes.status).toHaveBeenCalledWith(201);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				message: "Invitation sent",
				data: mockInvitation,
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should return 400 when user already in show (Line 40)", async () => {
			const spy = vi
				.spyOn(showMembershipService, "inviteByEmail")
				.mockRejectedValue(new Error("User is already in the show"));

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1 },
				body: { orgId: 2, email: "test@example.com" },
			};

			await showMembershipController.invite(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(400);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				message: "User is already in the show",
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should return 400 when no user found (Line 40)", async () => {
			const spy = vi
				.spyOn(showMembershipService, "inviteByEmail")
				.mockRejectedValue(new Error("No user found with that email"));

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1 },
				body: { orgId: 2, email: "nonexistent@example.com" },
			};

			await showMembershipController.invite(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(400);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				message: "No user found with that email",
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should call next with error on generic failure (Line 43)", async () => {
			const error = new Error("Database error");
			const spy = vi
				.spyOn(showMembershipService, "inviteByEmail")
				.mockRejectedValue(error);

			const mockRes = {};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1 },
				body: { orgId: 2, email: "test@example.com" },
			};

			await showMembershipController.invite(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);

			spy.mockRestore();
		});
	});

	describe("addRoles", () => {
		it("should add roles to user and return success", async () => {
			const mockRoles = [{ id: 1, name: "director" }];
			const spy = vi
				.spyOn(showRoleService, "appendRolesToAssignment")
				.mockResolvedValue(mockRoles);

			const mockRes = {
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1, userId: 5 },
				body: { roles: ["director"] },
			};

			await showMembershipController.addRoles(mockReq, mockRes, mockNext);

			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				data: mockRoles,
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should return 404 when no valid roles", async () => {
			const spy = vi
				.spyOn(showRoleService, "appendRolesToAssignment")
				.mockRejectedValue(new Error("No valid roles"));

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1, userId: 5 },
				body: { roles: ["invalid"] },
			};

			await showMembershipController.addRoles(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(404);
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should return 404 when user not a member", async () => {
			const spy = vi
				.spyOn(showRoleService, "appendRolesToAssignment")
				.mockRejectedValue(new Error("User is not a member"));

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1, userId: 5 },
				body: { roles: ["director"] },
			};

			await showMembershipController.addRoles(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(404);
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should return 404 when not found", async () => {
			const spy = vi
				.spyOn(showRoleService, "appendRolesToAssignment")
				.mockRejectedValue(new Error("Role not found"));

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1, userId: 5 },
				body: { roles: ["director"] },
			};

			await showMembershipController.addRoles(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(404);
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should call next with error on generic failure", async () => {
			const error = new Error("Database error");
			const spy = vi
				.spyOn(showRoleService, "appendRolesToAssignment")
				.mockRejectedValue(error);

			const mockRes = {};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1, userId: 5 },
				body: { roles: ["director"] },
			};

			await showMembershipController.addRoles(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);

			spy.mockRestore();
		});
	});

	describe("getAllUsers", () => {
		it("should return all users on success", async () => {
			const mockUsers = [{ id: 1, name: "User 1" }];
			const spy = vi
				.spyOn(showRoleService, "getShowUsers")
				.mockResolvedValue(mockUsers);

			const mockRes = {
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1 },
			};

			await showMembershipController.getAllUsers(mockReq, mockRes, mockNext);

			expect(mockRes.json).toHaveBeenCalledWith(mockUsers);
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should return 404 when no users found", async () => {
			const spy = vi
				.spyOn(showRoleService, "getShowUsers")
				.mockRejectedValue(new Error("No users found"));

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1 },
			};

			await showMembershipController.getAllUsers(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(404);
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should return 404 when show not found", async () => {
			const spy = vi
				.spyOn(showRoleService, "getShowUsers")
				.mockRejectedValue(new Error("Show not found"));

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 999 },
			};

			await showMembershipController.getAllUsers(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(404);
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should call next with error on generic failure", async () => {
			const error = new Error("Database error");
			const spy = vi
				.spyOn(showRoleService, "getShowUsers")
				.mockRejectedValue(error);

			const mockRes = {};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1 },
			};

			await showMembershipController.getAllUsers(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);

			spy.mockRestore();
		});
	});

	describe("getUser", () => {
		it("should return specific user on success", async () => {
			const mockUser = { id: 5, name: "User 5" };
			const spy = vi
				.spyOn(showRoleService, "getShowUserById")
				.mockResolvedValue(mockUser);

			const mockRes = {
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1, userId: 5 },
			};

			await showMembershipController.getUser(mockReq, mockRes, mockNext);

			expect(mockRes.json).toHaveBeenCalledWith(mockUser);
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should return 404 when user not found", async () => {
			const spy = vi
				.spyOn(showRoleService, "getShowUserById")
				.mockRejectedValue(new Error("User not found"));

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1, userId: 999 },
			};

			await showMembershipController.getUser(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(404);
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should call next with error on generic failure", async () => {
			const error = new Error("Database error");
			const spy = vi
				.spyOn(showRoleService, "getShowUserById")
				.mockRejectedValue(error);

			const mockRes = {};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1, userId: 5 },
			};

			await showMembershipController.getUser(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);

			spy.mockRestore();
		});
	});

	describe("getByRole", () => {
		it("should return users by role on success", async () => {
			const mockUsers = [{ id: 1, role: "director" }];
			const spy = vi
				.spyOn(showRoleService, "getUsersByRole")
				.mockResolvedValue(mockUsers);

			const mockRes = {
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1 },
				query: { role: "director" },
			};

			await showMembershipController.getByRole(mockReq, mockRes, mockNext);

			expect(mockRes.json).toHaveBeenCalledWith(mockUsers);
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should return 404 when role not found", async () => {
			const spy = vi
				.spyOn(showRoleService, "getUsersByRole")
				.mockRejectedValue(new Error("Role not found"));

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1 },
				query: { role: "invalid" },
			};

			await showMembershipController.getByRole(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(404);
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should call next with error on generic failure", async () => {
			const error = new Error("Database error");
			const spy = vi
				.spyOn(showRoleService, "getUsersByRole")
				.mockRejectedValue(error);

			const mockRes = {};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1 },
				query: { role: "director" },
			};

			await showMembershipController.getByRole(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);

			spy.mockRestore();
		});
	});

	describe("leave", () => {
		it("should remove user from show and return 200 on success", async () => {
			const mockResult = { success: true, message: "User removed" };
			const spy = vi
				.spyOn(showRoleService, "removeUserFromShow")
				.mockResolvedValue(mockResult);

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1, userId: 5 },
			};

			await showMembershipController.leave(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(200);
			expect(mockRes.json).toHaveBeenCalledWith(mockResult);
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should return 404 when user not a member", async () => {
			const spy = vi
				.spyOn(showRoleService, "removeUserFromShow")
				.mockRejectedValue(new Error("User is not a member"));

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1, userId: 5 },
			};

			await showMembershipController.leave(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(404);
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should return 404 when show not found", async () => {
			const spy = vi
				.spyOn(showRoleService, "removeUserFromShow")
				.mockRejectedValue(new Error("Show not found"));

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 999, userId: 5 },
			};

			await showMembershipController.leave(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(404);
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should call next with error on generic failure", async () => {
			const error = new Error("Database error");
			const spy = vi
				.spyOn(showRoleService, "removeUserFromShow")
				.mockRejectedValue(error);

			const mockRes = {};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1, userId: 5 },
			};

			await showMembershipController.leave(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);

			spy.mockRestore();
		});
	});

	describe("removeRole", () => {
		it("should remove role from user on success", async () => {
			const mockResult = { success: true, message: "Role removed" };
			const spy = vi
				.spyOn(showRoleService, "removeRolesFromUser")
				.mockResolvedValue(mockResult);

			const mockRes = {
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1, userId: 5 },
				body: { role: "director" },
			};

			await showMembershipController.removeRole(mockReq, mockRes, mockNext);

			expect(mockRes.json).toHaveBeenCalledWith(mockResult);
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should support roles array parameter", async () => {
			const mockResult = { success: true, message: "Roles removed" };
			const spy = vi
				.spyOn(showRoleService, "removeRolesFromUser")
				.mockResolvedValue(mockResult);

			const mockRes = {
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1, userId: 5 },
				body: { roles: ["director", "actor"] },
			};

			await showMembershipController.removeRole(mockReq, mockRes, mockNext);

			expect(spy).toHaveBeenCalledWith(1, 5, ["director", "actor"]);
			expect(mockRes.json).toHaveBeenCalledWith(mockResult);

			spy.mockRestore();
		});

		it("should return 404 when role is required", async () => {
			const spy = vi
				.spyOn(showRoleService, "removeRolesFromUser")
				.mockRejectedValue(new Error("Role is required"));

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1, userId: 5 },
				body: { role: "director" },
			};

			await showMembershipController.removeRole(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(404);
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should return 404 when role not found", async () => {
			const spy = vi
				.spyOn(showRoleService, "removeRolesFromUser")
				.mockRejectedValue(new Error("Role not found"));

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1, userId: 5 },
				body: { role: "invalid" },
			};

			await showMembershipController.removeRole(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(404);
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should return 404 when user does not have role", async () => {
			const spy = vi
				.spyOn(showRoleService, "removeRolesFromUser")
				.mockRejectedValue(new Error("User does not have that role"));

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1, userId: 5 },
				body: { role: "director" },
			};

			await showMembershipController.removeRole(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(404);
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should call next with error on generic failure", async () => {
			const error = new Error("Database error");
			const spy = vi
				.spyOn(showRoleService, "removeRolesFromUser")
				.mockRejectedValue(error);

			const mockRes = {};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1, userId: 5 },
				body: { role: "director" },
			};

			await showMembershipController.removeRole(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);

			spy.mockRestore();
		});
	});
});
