import jwt from "jsonwebtoken";
import { describe, expect, it, vi } from "vitest";
import showController from "../../src/controllers/show.controller.js";
import showService from "../../src/services/show.service.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_theatre_secret";

describe("Show Controller - Direct Tests", () => {
	describe("getUserShows", () => {
		it("should get user shows with orgId in query and authenticated user", async () => {
			const mockShows = [
				{ id: 1, title: "Show 1" },
				{ id: 2, title: "Show 2" },
			];
			const spy = vi
				.spyOn(showService, "getUserShows")
				.mockResolvedValue(mockShows);

			const mockRes = {
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				query: { orgId: 1 },
				user: { id: 5 },
				headers: {},
			};

			await showController.getUserShows(mockReq, mockRes, mockNext);

			expect(spy).toHaveBeenCalledWith(1, 5);
			expect(mockRes.json).toHaveBeenCalledWith(mockShows);
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should use organization_id from query if orgId not present", async () => {
			const mockShows = [{ id: 1, title: "Show 1" }];
			const spy = vi
				.spyOn(showService, "getUserShows")
				.mockResolvedValue(mockShows);

			const mockRes = {
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				query: { organization_id: 2 },
				user: { id: 5 },
				headers: {},
			};

			await showController.getUserShows(mockReq, mockRes, mockNext);

			expect(spy).toHaveBeenCalledWith(2, 5);
			expect(mockRes.json).toHaveBeenCalledWith(mockShows);

			spy.mockRestore();
		});

		it("should extract userId from JWT token when no user in request (Line 23-30)", async () => {
			const mockShows = [{ id: 1, title: "Show 1" }];
			const spy = vi
				.spyOn(showService, "getUserShows")
				.mockResolvedValue(mockShows);

			const token = jwt.sign({ id: 10 }, JWT_SECRET);

			const mockRes = {
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				query: { orgId: 1 },
				user: undefined,
				headers: {
					authorization: `Bearer ${token}`,
				},
			};

			await showController.getUserShows(mockReq, mockRes, mockNext);

			expect(spy).toHaveBeenCalledWith(1, 10);
			expect(mockRes.json).toHaveBeenCalledWith(mockShows);

			spy.mockRestore();
		});

		it("should handle invalid JWT token gracefully (Line 28-30)", async () => {
			const mockShows = [{ id: 1, title: "Show 1" }];
			const spy = vi
				.spyOn(showService, "getUserShows")
				.mockResolvedValue(mockShows);

			const mockRes = {
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				query: { orgId: 1 },
				user: undefined,
				headers: {
					authorization: "Bearer invalid-token",
				},
			};

			await showController.getUserShows(mockReq, mockRes, mockNext);

			// Should call service with undefined userId when token is invalid
			expect(spy).toHaveBeenCalledWith(1, undefined);
			expect(mockRes.json).toHaveBeenCalledWith(mockShows);

			spy.mockRestore();
		});

		it("should handle service error with no token (Line 34-36)", async () => {
			const error = new Error("Database error");
			const spy = vi
				.spyOn(showService, "getUserShows")
				.mockRejectedValue(error);

			const mockRes = {};
			const mockNext = vi.fn();
			const mockReq = {
				query: { orgId: 1 },
				user: undefined,
				headers: {},
			};

			await showController.getUserShows(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);

			spy.mockRestore();
		});

		it("should handle service error with valid token", async () => {
			const error = new Error("Database error");
			const spy = vi
				.spyOn(showService, "getUserShows")
				.mockRejectedValue(error);

			const token = jwt.sign({ id: 10 }, JWT_SECRET);

			const mockRes = {};
			const mockNext = vi.fn();
			const mockReq = {
				query: { orgId: 1 },
				user: undefined,
				headers: {
					authorization: `Bearer ${token}`,
				},
			};

			await showController.getUserShows(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);

			spy.mockRestore();
		});
	});

	describe("getDashboardSummary", () => {
		it("should return dashboard summary on success (Line 88-90)", async () => {
			const mockSummary = {
				totalCast: 10,
				totalCrew: 5,
				upcomingEvents: 3,
			};
			const spy = vi
				.spyOn(showService, "getDashboardSummary")
				.mockResolvedValue(mockSummary);

			const mockRes = {
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { id: 1 },
			};

			await showController.getDashboardSummary(mockReq, mockRes, mockNext);

			expect(spy).toHaveBeenCalledWith(1);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				data: mockSummary,
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should return 404 when Show not found (Line 92-94)", async () => {
			const spy = vi
				.spyOn(showService, "getDashboardSummary")
				.mockRejectedValue(new Error("Show not found"));

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { id: 999 },
			};

			await showController.getDashboardSummary(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(404);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				message: "Show not found",
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should call next with error on generic failure (Line 95)", async () => {
			const error = new Error("Database error");
			const spy = vi
				.spyOn(showService, "getDashboardSummary")
				.mockRejectedValue(error);

			const mockRes = {};
			const mockNext = vi.fn();
			const mockReq = {
				params: { id: 1 },
			};

			await showController.getDashboardSummary(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);

			spy.mockRestore();
		});
	});

	describe("get", () => {
		it("should get all shows with orgId query parameter", async () => {
			const mockShows = [{ id: 1, title: "Show 1" }];
			const spy = vi.spyOn(showService, "getAll").mockResolvedValue(mockShows);

			const mockRes = {
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				query: { org: 1 },
			};

			await showController.get(mockReq, mockRes, mockNext);

			expect(spy).toHaveBeenCalledWith(1);
			expect(mockRes.json).toHaveBeenCalledWith(mockShows);

			spy.mockRestore();
		});

		it("should handle service errors", async () => {
			const error = new Error("Database error");
			const spy = vi.spyOn(showService, "getAll").mockRejectedValue(error);

			const mockRes = {};
			const mockNext = vi.fn();
			const mockReq = {
				query: { org: 1 },
			};

			await showController.get(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);

			spy.mockRestore();
		});
	});

	describe("getById", () => {
		it("should get show by id on success", async () => {
			const mockShow = { id: 1, title: "Show 1" };
			const spy = vi.spyOn(showService, "getById").mockResolvedValue(mockShow);

			const mockRes = {
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { id: 1 },
			};

			await showController.getById(mockReq, mockRes, mockNext);

			expect(mockRes.json).toHaveBeenCalledWith(mockShow);

			spy.mockRestore();
		});

		it("should return 404 when Show not found", async () => {
			const spy = vi
				.spyOn(showService, "getById")
				.mockRejectedValue(new Error("Show not found"));

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { id: 999 },
			};

			await showController.getById(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(404);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				message: "Show not found",
			});

			spy.mockRestore();
		});

		it("should call next with error on generic failure", async () => {
			const error = new Error("Database error");
			const spy = vi.spyOn(showService, "getById").mockRejectedValue(error);

			const mockRes = {};
			const mockNext = vi.fn();
			const mockReq = {
				params: { id: 1 },
			};

			await showController.getById(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);

			spy.mockRestore();
		});
	});

	describe("create", () => {
		it("should create a show and return 201", async () => {
			const mockShow = { id: 1, title: "New Show" };
			const spy = vi.spyOn(showService, "create").mockResolvedValue(mockShow);

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				user: { id: 5 },
				body: { title: "New Show" },
			};

			await showController.create(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(201);
			expect(mockRes.json).toHaveBeenCalledWith(mockShow);
			expect(spy).toHaveBeenCalledWith({
				title: "New Show",
				creatorId: 5,
			});

			spy.mockRestore();
		});

		it("should handle service errors", async () => {
			const error = new Error("Database error");
			const spy = vi.spyOn(showService, "create").mockRejectedValue(error);

			const mockRes = {
				status: vi.fn().mockReturnThis(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				user: { id: 5 },
				body: { title: "New Show" },
			};

			await showController.create(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);

			spy.mockRestore();
		});
	});

	describe("update", () => {
		it("should update a show on success", async () => {
			const mockShow = { id: 1, title: "Updated Show" };
			const spy = vi.spyOn(showService, "update").mockResolvedValue(mockShow);

			const mockRes = {
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { id: 1 },
				body: { title: "Updated Show" },
			};

			await showController.update(mockReq, mockRes, mockNext);

			expect(mockRes.json).toHaveBeenCalledWith(mockShow);

			spy.mockRestore();
		});

		it("should return 404 when Show not found", async () => {
			const spy = vi
				.spyOn(showService, "update")
				.mockRejectedValue(new Error("Show not found"));

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { id: 999 },
				body: { title: "Updated" },
			};

			await showController.update(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(404);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				message: "Show not found",
			});

			spy.mockRestore();
		});

		it("should call next with error on generic failure", async () => {
			const error = new Error("Database error");
			const spy = vi.spyOn(showService, "update").mockRejectedValue(error);

			const mockRes = {};
			const mockNext = vi.fn();
			const mockReq = {
				params: { id: 1 },
				body: { title: "Updated" },
			};

			await showController.update(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);

			spy.mockRestore();
		});
	});

	describe("remove", () => {
		it("should remove a show on success", async () => {
			const spy = vi.spyOn(showService, "remove").mockResolvedValue(undefined);

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { id: 1 },
			};

			await showController.remove(mockReq, mockRes, mockNext);

			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				message: "Show deleted successfully",
			});

			spy.mockRestore();
		});

		it("should return 404 when Show not found", async () => {
			const spy = vi
				.spyOn(showService, "remove")
				.mockRejectedValue(new Error("Show not found"));

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { id: 999 },
			};

			await showController.remove(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(404);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				message: "Show not found",
			});

			spy.mockRestore();
		});

		it("should call next with error on generic failure", async () => {
			const error = new Error("Database error");
			const spy = vi.spyOn(showService, "remove").mockRejectedValue(error);

			const mockRes = {};
			const mockNext = vi.fn();
			const mockReq = {
				params: { id: 1 },
			};

			await showController.remove(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);

			spy.mockRestore();
		});
	});
});
