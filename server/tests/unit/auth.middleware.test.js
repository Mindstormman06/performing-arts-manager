import jwt from "jsonwebtoken";
import { describe, expect, it, vi } from "vitest";

import {
	authenticate,
	authorizeInventoryDept,
	authorizeOrg,
	authorizeShow,
} from "../../src/middleware/auth.middleware.js";
import models from "../../src/models/index.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_theatre_secret";

describe("Auth Middleware - Direct Tests", () => {
	describe("authenticate", () => {
		it("should authenticate user with valid token", async () => {
			const token = jwt.sign({ id: 1, email: "test@example.com" }, JWT_SECRET);
			const mockUser = { id: 1, email: "test@example.com" };

			const spy = vi.spyOn(models.User, "findByPk").mockResolvedValue(mockUser);

			const mockReq = {
				header: vi.fn((name) => {
					if (name === "Authorization") return `Bearer ${token}`;
					return undefined;
				}),
			};
			const mockRes = {};
			const mockNext = vi.fn();

			await authenticate(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalled();
			expect(mockReq.user).toMatchObject({ id: 1, email: "test@example.com" });

			spy.mockRestore();
		});

		it("should return 401 when no token provided", async () => {
			const mockReq = {
				header: vi.fn(() => undefined),
			};
			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();

			await authenticate(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(401);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				message: "Access denied. No token provided.",
			});
			expect(mockNext).not.toHaveBeenCalled();
		});

		it("should return 401 when user no longer exists (Line 21)", async () => {
			const token = jwt.sign({ id: 999 }, JWT_SECRET);

			const spy = vi.spyOn(models.User, "findByPk").mockResolvedValue(null);

			const mockReq = {
				header: vi.fn((name) => {
					if (name === "Authorization") return `Bearer ${token}`;
					return undefined;
				}),
			};
			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();

			await authenticate(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(401);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				message: "User no longer exists. Please log in again.",
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should return 400 for JsonWebTokenError", async () => {
			const mockReq = {
				header: vi.fn((name) => {
					if (name === "Authorization") return "Bearer malformed-token";
					return undefined;
				}),
			};
			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();

			await authenticate(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(400);
			expect(mockRes.json.mock.calls[0][0].message).toContain("Invalid token");
		});

		it("should return 401 for expired token", async () => {
			const token = jwt.sign({ id: 1 }, JWT_SECRET, { expiresIn: "-1h" });

			const mockReq = {
				header: vi.fn((name) => {
					if (name === "Authorization") return `Bearer ${token}`;
					return undefined;
				}),
			};
			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();

			await authenticate(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(401);
			expect(mockRes.json.mock.calls[0][0].message).toContain("Invalid token");
		});
	});

	describe("authorizeOrg", () => {
		it("should authorize user with org membership and no required roles", async () => {
			const mockMembership = {
				assignedRoles: [{ name: "admin" }],
			};

			const spy = vi
				.spyOn(models.OrgMembership, "findOne")
				.mockResolvedValue(mockMembership);

			const middleware = authorizeOrg();
			const mockReq = {
				params: { orgId: 1 },
				user: { id: 5 },
			};
			const mockRes = {};
			const mockNext = vi.fn();

			await middleware(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should return 400 when orgId is missing (Line 43)", async () => {
			const middleware = authorizeOrg();
			const mockReq = {
				params: { orgId: "undefined" },
				user: { id: 5 },
			};
			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();

			await middleware(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(400);
			expect(mockRes.json).toHaveBeenCalledWith({
				message: "Organization ID is missing",
			});
		});

		it("should return 403 when user not a member of org", async () => {
			const spy = vi
				.spyOn(models.OrgMembership, "findOne")
				.mockResolvedValue(null);

			const middleware = authorizeOrg();
			const mockReq = {
				params: { orgId: 1 },
				user: { id: 5 },
			};
			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();

			await middleware(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(403);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				message: "Not a member of this organization.",
			});

			spy.mockRestore();
		});

		it("should return 403 when user lacks required roles", async () => {
			const mockMembership = {
				assignedRoles: [{ name: "member" }],
			};

			const spy = vi
				.spyOn(models.OrgMembership, "findOne")
				.mockResolvedValue(mockMembership);

			const middleware = authorizeOrg(["admin"]);
			const mockReq = {
				params: { orgId: 1 },
				user: { id: 5 },
			};
			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();

			await middleware(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(403);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				message: "Insufficient permissions.",
			});

			spy.mockRestore();
		});

		it("should authorize when user has required role", async () => {
			const mockMembership = {
				assignedRoles: [{ name: "admin" }],
			};

			const spy = vi
				.spyOn(models.OrgMembership, "findOne")
				.mockResolvedValue(mockMembership);

			const middleware = authorizeOrg(["admin"]);
			const mockReq = {
				params: { orgId: 1 },
				user: { id: 5 },
			};
			const mockRes = {};
			const mockNext = vi.fn();

			await middleware(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should use organization_id from body if params not available", async () => {
			const mockMembership = {
				assignedRoles: [{ name: "admin" }],
			};

			const spy = vi
				.spyOn(models.OrgMembership, "findOne")
				.mockResolvedValue(mockMembership);

			const middleware = authorizeOrg();
			const mockReq = {
				params: {},
				body: { organization_id: 2 },
				user: { id: 5 },
			};
			const mockRes = {};
			const mockNext = vi.fn();

			await middleware(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalled();
			expect(spy).toHaveBeenCalledWith(
				expect.objectContaining({
					where: expect.objectContaining({ org_id: 2 }),
				}),
			);

			spy.mockRestore();
		});
	});

	describe("authorizeShow", () => {
		it("should return 404 when show not found (Line 89)", async () => {
			const spy = vi.spyOn(models.Show, "findByPk").mockResolvedValue(null);

			const middleware = authorizeShow();
			const mockReq = {
				params: { showId: 999 },
				user: { id: 5 },
			};
			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();

			await middleware(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(404);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				message: "Show not found.",
			});

			spy.mockRestore();
		});

		it("should allow access if user is org president", async () => {
			const mockShow = { id: 1, organization_id: 1 };
			const mockOrgMembership = {
				assignedRoles: [{ name: "president" }],
			};

			const showSpy = vi
				.spyOn(models.Show, "findByPk")
				.mockResolvedValue(mockShow);

			const orgSpy = vi
				.spyOn(models.OrgMembership, "findOne")
				.mockResolvedValue(mockOrgMembership);

			const middleware = authorizeShow();
			const mockReq = {
				params: { showId: 1 },
				user: { id: 5 },
			};
			const mockRes = {};
			const mockNext = vi.fn();

			await middleware(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalled();

			showSpy.mockRestore();
			orgSpy.mockRestore();
		});

		it("should allow access if user is org board-member", async () => {
			const mockShow = { id: 1, organization_id: 1 };
			const mockOrgMembership = {
				assignedRoles: [{ name: "board-member" }],
			};

			const showSpy = vi
				.spyOn(models.Show, "findByPk")
				.mockResolvedValue(mockShow);

			const orgSpy = vi
				.spyOn(models.OrgMembership, "findOne")
				.mockResolvedValue(mockOrgMembership);

			const middleware = authorizeShow();
			const mockReq = {
				params: { showId: 1 },
				user: { id: 5 },
			};
			const mockRes = {};
			const mockNext = vi.fn();

			await middleware(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalled();

			showSpy.mockRestore();
			orgSpy.mockRestore();
		});

		it("should return 403 when user not a member of show", async () => {
			const mockShow = { id: 1, organization_id: 1 };

			const showSpy = vi
				.spyOn(models.Show, "findByPk")
				.mockResolvedValue(mockShow);

			const orgSpy = vi
				.spyOn(models.OrgMembership, "findOne")
				.mockResolvedValue(null);

			const showMemberSpy = vi
				.spyOn(models.ShowMembership, "findOne")
				.mockResolvedValue(null);

			const middleware = authorizeShow();
			const mockReq = {
				params: { showId: 1 },
				user: { id: 5 },
			};
			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();

			await middleware(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(403);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				message: "Not a member of this show.",
			});

			showSpy.mockRestore();
			orgSpy.mockRestore();
			showMemberSpy.mockRestore();
		});

		it("should authorize show member with required roles", async () => {
			const mockShow = { id: 1, organization_id: 1 };
			const mockShowMembership = {
				assignedRoles: [{ name: "director" }],
			};

			const showSpy = vi
				.spyOn(models.Show, "findByPk")
				.mockResolvedValue(mockShow);

			const orgSpy = vi
				.spyOn(models.OrgMembership, "findOne")
				.mockResolvedValue(null);

			const showMemberSpy = vi
				.spyOn(models.ShowMembership, "findOne")
				.mockResolvedValue(mockShowMembership);

			const middleware = authorizeShow(["director"]);
			const mockReq = {
				params: { showId: 1 },
				user: { id: 5 },
			};
			const mockRes = {};
			const mockNext = vi.fn();

			await middleware(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalled();

			showSpy.mockRestore();
			orgSpy.mockRestore();
			showMemberSpy.mockRestore();
		});

		it("should return 403 for insufficient show permissions", async () => {
			const mockShow = { id: 1, organization_id: 1 };
			const mockShowMembership = {
				assignedRoles: [{ name: "actor" }],
			};

			const showSpy = vi
				.spyOn(models.Show, "findByPk")
				.mockResolvedValue(mockShow);

			const orgSpy = vi
				.spyOn(models.OrgMembership, "findOne")
				.mockResolvedValue(null);

			const showMemberSpy = vi
				.spyOn(models.ShowMembership, "findOne")
				.mockResolvedValue(mockShowMembership);

			const middleware = authorizeShow(["director"]);
			const mockReq = {
				params: { showId: 1 },
				user: { id: 5 },
			};
			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();

			await middleware(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(403);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				message: "Insufficient permissions.",
			});

			showSpy.mockRestore();
			orgSpy.mockRestore();
			showMemberSpy.mockRestore();
		});
	});

	describe("authorizeInventoryDept", () => {
		it("should authorize org admin for inventory (Line 145-152)", async () => {
			const mockMembership = {
				assignedRoles: [{ name: "admin" }],
			};

			const spy = vi
				.spyOn(models.OrgMembership, "findOne")
				.mockResolvedValue(mockMembership);

			const middleware = authorizeInventoryDept("org");
			const mockReq = {
				params: { orgId: 1 },
				user: { id: 5 },
				body: {},
			};
			const mockRes = {};
			const mockNext = vi.fn();

			await middleware(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should return 403 when org user not found", async () => {
			const spy = vi
				.spyOn(models.OrgMembership, "findOne")
				.mockResolvedValue(null);

			const middleware = authorizeInventoryDept("org");
			const mockReq = {
				params: { orgId: 1 },
				user: { id: 5 },
				body: {},
			};
			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();

			await middleware(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(403);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				message: "Not a member of this organization.",
			});

			spy.mockRestore();
		});

		it("should authorize show director for inventory (Line 145-152)", async () => {
			const mockMembership = {
				assignedRoles: [{ name: "director" }],
			};

			const spy = vi
				.spyOn(models.ShowMembership, "findOne")
				.mockResolvedValue(mockMembership);

			const middleware = authorizeInventoryDept("show");
			const mockReq = {
				params: { showId: 1 },
				user: { id: 5 },
				body: {},
			};
			const mockRes = {};
			const mockNext = vi.fn();

			await middleware(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should return 403 when show user not found", async () => {
			const spy = vi
				.spyOn(models.ShowMembership, "findOne")
				.mockResolvedValue(null);

			const middleware = authorizeInventoryDept("show");
			const mockReq = {
				params: { showId: 1 },
				user: { id: 5 },
				body: {},
			};
			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();

			await middleware(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(403);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				message: "Not a member of this show.",
			});

			spy.mockRestore();
		});

		it("should authorize user with dept role via dept_id in body (Line 162)", async () => {
			const mockMembership = {
				assignedRoles: [{ name: "costumes" }],
			};

			const mockDept = { id: 1, name: "Costumes" };

			const orgSpy = vi
				.spyOn(models.OrgMembership, "findOne")
				.mockResolvedValue(mockMembership);

			const deptSpy = vi
				.spyOn(models.Department, "findByPk")
				.mockResolvedValue(mockDept);

			const middleware = authorizeInventoryDept("org");
			const mockReq = {
				params: { orgId: 1 },
				user: { id: 5 },
				body: { dept_id: 1 },
			};
			const mockRes = {};
			const mockNext = vi.fn();

			await middleware(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalled();

			orgSpy.mockRestore();
			deptSpy.mockRestore();
		});

		it("should look up dept_id from inventory item (Lines 165-182)", async () => {
			const mockMembership = {
				assignedRoles: [{ name: "costumes" }],
			};

			const mockInventory = { id: 1, dept_id: 2 };
			const mockDept = { id: 2, name: "Costumes" };

			const orgSpy = vi
				.spyOn(models.OrgMembership, "findOne")
				.mockResolvedValue(mockMembership);

			const invSpy = vi
				.spyOn(models.Inventory, "findByPk")
				.mockResolvedValue(mockInventory);

			const deptSpy = vi
				.spyOn(models.Department, "findByPk")
				.mockResolvedValue(mockDept);

			const middleware = authorizeInventoryDept("org");
			const mockReq = {
				params: { orgId: 1, inventoryId: 1 },
				user: { id: 5 },
				body: {},
			};
			const mockRes = {};
			const mockNext = vi.fn();

			await middleware(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalled();
			expect(invSpy).toHaveBeenCalledWith(1);

			orgSpy.mockRestore();
			invSpy.mockRestore();
			deptSpy.mockRestore();
		});

		it("should return 404 when inventory item not found (Lines 165-182)", async () => {
			const mockMembership = {
				assignedRoles: [{ name: "member" }],
			};

			const orgSpy = vi
				.spyOn(models.OrgMembership, "findOne")
				.mockResolvedValue(mockMembership);

			const invSpy = vi
				.spyOn(models.Inventory, "findByPk")
				.mockResolvedValue(null);

			const middleware = authorizeInventoryDept("org");
			const mockReq = {
				params: { orgId: 1, inventoryId: 999 },
				user: { id: 5 },
				body: {},
			};
			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();

			await middleware(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(404);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				message: "Inventory item not found.",
			});

			orgSpy.mockRestore();
			invSpy.mockRestore();
		});

		it("should return 403 when user lacks dept permission (Line 162)", async () => {
			const mockMembership = {
				assignedRoles: [{ name: "props" }],
			};

			const mockDept = { id: 1, name: "Costumes" };

			const orgSpy = vi
				.spyOn(models.OrgMembership, "findOne")
				.mockResolvedValue(mockMembership);

			const deptSpy = vi
				.spyOn(models.Department, "findByPk")
				.mockResolvedValue(mockDept);

			const middleware = authorizeInventoryDept("org");
			const mockReq = {
				params: { orgId: 1 },
				user: { id: 5 },
				body: { dept_id: 1 },
			};
			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();

			await middleware(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(403);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				message:
					"Insufficient permissions. You must be in this department to manage its inventory.",
			});

			orgSpy.mockRestore();
			deptSpy.mockRestore();
		});

		it("should return 403 when no dept found and no dept_id provided", async () => {
			const mockMembership = {
				assignedRoles: [{ name: "member" }],
			};

			const orgSpy = vi
				.spyOn(models.OrgMembership, "findOne")
				.mockResolvedValue(mockMembership);

			const middleware = authorizeInventoryDept("org");
			const mockReq = {
				params: { orgId: 1 },
				user: { id: 5 },
				body: {},
			};
			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();

			await middleware(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(403);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				message:
					"Insufficient permissions. You must be in this department to manage its inventory.",
			});

			orgSpy.mockRestore();
		});

		it("should return 403 when department not found", async () => {
			const mockMembership = {
				assignedRoles: [{ name: "member" }],
			};

			const orgSpy = vi
				.spyOn(models.OrgMembership, "findOne")
				.mockResolvedValue(mockMembership);

			const deptSpy = vi
				.spyOn(models.Department, "findByPk")
				.mockResolvedValue(null);

			const middleware = authorizeInventoryDept("org");
			const mockReq = {
				params: { orgId: 1 },
				user: { id: 5 },
				body: { dept_id: 999 },
			};
			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();

			await middleware(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(403);

			orgSpy.mockRestore();
			deptSpy.mockRestore();
		});

		it("should authorize org president for inventory", async () => {
			const mockMembership = {
				assignedRoles: [{ name: "president" }],
			};

			const spy = vi
				.spyOn(models.OrgMembership, "findOne")
				.mockResolvedValue(mockMembership);

			const middleware = authorizeInventoryDept("org");
			const mockReq = {
				params: { orgId: 1 },
				user: { id: 5 },
				body: {},
			};
			const mockRes = {};
			const mockNext = vi.fn();

			await middleware(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should authorize show stage-manager for inventory", async () => {
			const mockMembership = {
				assignedRoles: [{ name: "stage-manager" }],
			};

			const spy = vi
				.spyOn(models.ShowMembership, "findOne")
				.mockResolvedValue(mockMembership);

			const middleware = authorizeInventoryDept("show");
			const mockReq = {
				params: { showId: 1 },
				user: { id: 5 },
				body: {},
			};
			const mockRes = {};
			const mockNext = vi.fn();

			await middleware(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalled();

			spy.mockRestore();
		});
	});
});
