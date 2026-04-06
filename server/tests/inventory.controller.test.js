import { describe, expect, it, vi } from "vitest";
import inventoryController from "../src/controllers/inventory.controller.js";
import inventoryService from "../src/services/inventory.service.js";

describe("Inventory Controller - Direct Tests", () => {
	describe("getShowInventory", () => {
		it("should call service and return JSON response", async () => {
			const mockItems = [{ id: 1, name: "Prop 1" }];
			const spy = vi
				.spyOn(inventoryService, "getShowInventory")
				.mockResolvedValue(mockItems);

			const mockRes = {
				json: vi.fn(),
			};
			const mockNext = vi.fn();

			await inventoryController.getShowInventory(
				{ params: { showId: 1 } },
				mockRes,
				mockNext
			);

			expect(spy).toHaveBeenCalledWith(1);
			expect(mockRes.json).toHaveBeenCalledWith(mockItems);
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should call next with error on service failure", async () => {
			const error = new Error("Database error");
			const spy = vi
				.spyOn(inventoryService, "getShowInventory")
				.mockRejectedValue(error);

			const mockRes = {};
			const mockNext = vi.fn();

			await inventoryController.getShowInventory(
				{ params: { showId: 1 } },
				mockRes,
				mockNext
			);

			expect(mockNext).toHaveBeenCalledWith(error);

			spy.mockRestore();
		});
	});

	describe("createShowItem", () => {
		it("should create item and return 201 response", async () => {
			const mockItem = { id: 123, name: "New Prop" };
			const spy = vi
				.spyOn(inventoryService, "createShowItem")
				.mockResolvedValue(mockItem);

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1 },
				body: { name: "New Prop", dept_id: 1 },
				user: { id: 5 },
			};

			await inventoryController.createShowItem(mockReq, mockRes, mockNext);

			expect(spy).toHaveBeenCalledWith(1, { name: "New Prop", dept_id: 1 }, 5);
			expect(mockRes.status).toHaveBeenCalledWith(201);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				data: mockItem,
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should call next with error on service failure", async () => {
			const error = new Error("Database error");
			const spy = vi
				.spyOn(inventoryService, "createShowItem")
				.mockRejectedValue(error);

			const mockRes = {};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1 },
				body: { name: "New Prop" },
				user: { id: 5 },
			};

			await inventoryController.createShowItem(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);

			spy.mockRestore();
		});
	});

	describe("pullItem", () => {
		it("should pull item and return 200 response", async () => {
			const spy = vi
				.spyOn(inventoryService, "pullGlobalItemToShow")
				.mockResolvedValue(undefined);

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1, inventoryId: 10 },
				user: { id: 5 },
			};

			await inventoryController.pullItem(mockReq, mockRes, mockNext);

			expect(spy).toHaveBeenCalledWith(1, 10, 5);
			expect(mockRes.status).toHaveBeenCalledWith(200);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				message: "Item pulled to show",
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should return 409 when item already in show", async () => {
			const error = new Error("Item is already in this show");
			const spy = vi
				.spyOn(inventoryService, "pullGlobalItemToShow")
				.mockRejectedValue(error);

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1, inventoryId: 10 },
				user: { id: 5 },
			};

			await inventoryController.pullItem(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(409);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				message: error.message,
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should call next with error on unexpected failure", async () => {
			const error = new Error("Unexpected error");
			const spy = vi
				.spyOn(inventoryService, "pullGlobalItemToShow")
				.mockRejectedValue(error);

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1, inventoryId: 10 },
				user: { id: 5 },
			};

			// Mock the error message so it doesn't contain the expected string
			error.message = "Something went wrong";

			await inventoryController.pullItem(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);

			spy.mockRestore();
		});
	});

	describe("removeItem", () => {
		it("should remove item and return 200 response", async () => {
			const spy = vi
				.spyOn(inventoryService, "removeShowItem")
				.mockResolvedValue(undefined);

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1, inventoryId: 10 },
			};

			await inventoryController.removeItem(mockReq, mockRes, mockNext);

			expect(spy).toHaveBeenCalledWith(1, 10);
			expect(mockRes.status).toHaveBeenCalledWith(200);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				message: "Item removed",
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should return 404 when item not found", async () => {
			const error = new Error("Item not found");
			const spy = vi
				.spyOn(inventoryService, "removeShowItem")
				.mockRejectedValue(error);

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1, inventoryId: 10 },
			};

			await inventoryController.removeItem(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(404);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				message: error.message,
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should call next with error on unexpected failure", async () => {
			const error = new Error("Unexpected error");
			const spy = vi
				.spyOn(inventoryService, "removeShowItem")
				.mockRejectedValue(error);

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1, inventoryId: 10 },
			};

			// Mock the error message so it doesn't contain the expected string
			error.message = "Something went wrong";

			await inventoryController.removeItem(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);

			spy.mockRestore();
		});
	});
});

