import { describe, expect, it, vi } from "vitest";

import inventoryController from "../../src/controllers/inventory.controller.js";
import inventoryService from "../../src/services/inventory.service.js";

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
				mockNext,
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
				mockNext,
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

			expect(spy).toHaveBeenCalledWith(
				1,
				{ name: "New Prop", dept_id: 1 },
				5,
				null,
			);
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

	describe("getDepartments", () => {
		it("should return departments from service", async () => {
			const mockDepts = [
				{ id: 1, name: "Props" },
				{ id: 2, name: "Lighting" },
			];
			const spy = vi
				.spyOn(inventoryService, "getDepartments")
				.mockResolvedValue(mockDepts);

			const mockRes = {
				json: vi.fn(),
			};
			const mockNext = vi.fn();

			await inventoryController.getDepartments({}, mockRes, mockNext);

			expect(spy).toHaveBeenCalled();
			expect(mockRes.json).toHaveBeenCalledWith(mockDepts);
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should call next with error on service failure", async () => {
			const error = new Error("Database error");
			const spy = vi
				.spyOn(inventoryService, "getDepartments")
				.mockRejectedValue(error);

			const mockRes = {};
			const mockNext = vi.fn();

			await inventoryController.getDepartments({}, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);

			spy.mockRestore();
		});
	});

	describe("getGlobal", () => {
		it("should return global inventory from service", async () => {
			const mockItems = [
				{ id: 1, name: "Global Item 1" },
				{ id: 2, name: "Global Item 2" },
			];
			const spy = vi
				.spyOn(inventoryService, "getGlobalInventory")
				.mockResolvedValue(mockItems);

			const mockRes = {
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { orgId: 1 },
			};

			await inventoryController.getGlobal(mockReq, mockRes, mockNext);

			expect(spy).toHaveBeenCalledWith(1);
			expect(mockRes.json).toHaveBeenCalledWith(mockItems);
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should call next with error on service failure", async () => {
			const error = new Error("Database error");
			const spy = vi
				.spyOn(inventoryService, "getGlobalInventory")
				.mockRejectedValue(error);

			const mockRes = {};
			const mockNext = vi.fn();
			const mockReq = {
				params: { orgId: 1 },
			};

			await inventoryController.getGlobal(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);

			spy.mockRestore();
		});
	});

	describe("createGlobal", () => {
		it("should create global item and return 201 response", async () => {
			const mockItem = { id: 5, name: "New Global Item" };
			const spy = vi
				.spyOn(inventoryService, "createGlobalItem")
				.mockResolvedValue(mockItem);

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { orgId: 1 },
				body: { name: "New Global Item", dept_id: 1 },
				user: { id: 5 },
				file: null,
			};

			await inventoryController.createGlobal(mockReq, mockRes, mockNext);

			expect(spy).toHaveBeenCalledWith(
				1,
				{ name: "New Global Item", dept_id: 1 },
				5,
				null,
			);
			expect(mockRes.status).toHaveBeenCalledWith(201);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				data: mockItem,
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should create global item with photo path", async () => {
			const mockItem = {
				id: 5,
				name: "New Global Item",
				photo_path: "/uploads/test.jpg",
			};
			const spy = vi
				.spyOn(inventoryService, "createGlobalItem")
				.mockResolvedValue(mockItem);

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { orgId: 1 },
				body: { name: "New Global Item", dept_id: 1 },
				user: { id: 5 },
				file: { filename: "test.jpg" },
			};

			await inventoryController.createGlobal(mockReq, mockRes, mockNext);

			expect(spy).toHaveBeenCalledWith(
				1,
				{ name: "New Global Item", dept_id: 1 },
				5,
				"/uploads/inventory/test.jpg",
			);
			expect(mockRes.status).toHaveBeenCalledWith(201);

			spy.mockRestore();
		});

		it("should return 400 on invalid department error", async () => {
			const error = new Error("Invalid department");
			const spy = vi
				.spyOn(inventoryService, "createGlobalItem")
				.mockRejectedValue(error);

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { orgId: 1 },
				body: { name: "New Global Item", dept_id: 999 },
				user: { id: 5 },
				file: null,
			};

			await inventoryController.createGlobal(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(400);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				message: error.message,
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should call next with unexpected error", async () => {
			const error = new Error("Unexpected error");
			const spy = vi
				.spyOn(inventoryService, "createGlobalItem")
				.mockRejectedValue(error);

			const mockRes = {};
			const mockNext = vi.fn();
			const mockReq = {
				params: { orgId: 1 },
				body: { name: "New Global Item", dept_id: 1 },
				user: { id: 5 },
				file: null,
			};

			await inventoryController.createGlobal(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);

			spy.mockRestore();
		});
	});

	describe("removeGlobal", () => {
		it("should remove global item and return 200 response", async () => {
			const spy = vi
				.spyOn(inventoryService, "removeGlobalItem")
				.mockResolvedValue(undefined);

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { orgId: 1, inventoryId: 10 },
			};

			await inventoryController.removeGlobal(mockReq, mockRes, mockNext);

			expect(spy).toHaveBeenCalledWith(1, 10);
			expect(mockRes.status).toHaveBeenCalledWith(200);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				message: "Global item deleted",
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should return 404 when global item not found", async () => {
			const error = new Error("Global item not found");
			const spy = vi
				.spyOn(inventoryService, "removeGlobalItem")
				.mockRejectedValue(error);

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { orgId: 1, inventoryId: 10 },
			};

			await inventoryController.removeGlobal(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(404);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				message: error.message,
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should call next with unexpected error", async () => {
			const error = new Error("Unexpected error");
			const spy = vi
				.spyOn(inventoryService, "removeGlobalItem")
				.mockRejectedValue(error);

			const mockRes = {};
			const mockNext = vi.fn();
			const mockReq = {
				params: { orgId: 1, inventoryId: 10 },
			};

			await inventoryController.removeGlobal(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);

			spy.mockRestore();
		});
	});

	describe("updateGlobal", () => {
		it("should update global item and return 200 response", async () => {
			const mockItem = { id: 10, name: "Updated Item" };
			const spy = vi
				.spyOn(inventoryService, "updateGlobalItem")
				.mockResolvedValue(mockItem);

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { orgId: 1, inventoryId: 10 },
				body: { name: "Updated Item", dept_id: 1 },
			};

			await inventoryController.updateGlobal(mockReq, mockRes, mockNext);

			expect(spy).toHaveBeenCalledWith(1, 10, {
				name: "Updated Item",
				dept_id: 1,
			});
			expect(mockRes.status).toHaveBeenCalledWith(200);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				data: mockItem,
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should return 404 when global item not found", async () => {
			const error = new Error("Global item not found");
			const spy = vi
				.spyOn(inventoryService, "updateGlobalItem")
				.mockRejectedValue(error);

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { orgId: 1, inventoryId: 999 },
				body: { name: "Updated Item" },
			};

			await inventoryController.updateGlobal(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(404);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				message: error.message,
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should return 400 on invalid department error", async () => {
			const error = new Error("Invalid department");
			const spy = vi
				.spyOn(inventoryService, "updateGlobalItem")
				.mockRejectedValue(error);

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { orgId: 1, inventoryId: 10 },
				body: { name: "Updated Item", dept_id: 999 },
			};

			await inventoryController.updateGlobal(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(400);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				message: error.message,
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should call next with unexpected error", async () => {
			const error = new Error("Unexpected error");
			const spy = vi
				.spyOn(inventoryService, "updateGlobalItem")
				.mockRejectedValue(error);

			const mockRes = {};
			const mockNext = vi.fn();
			const mockReq = {
				params: { orgId: 1, inventoryId: 10 },
				body: { name: "Updated Item" },
			};

			await inventoryController.updateGlobal(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);

			spy.mockRestore();
		});
	});

	describe("updateItem", () => {
		it("should update show item and return 200 response", async () => {
			const mockItem = { id: 10, name: "Updated Show Item" };
			const spy = vi
				.spyOn(inventoryService, "updateShowItem")
				.mockResolvedValue(mockItem);

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1, inventoryId: 10 },
				body: { name: "Updated Show Item", dept_id: 1 },
			};

			await inventoryController.updateItem(mockReq, mockRes, mockNext);

			expect(spy).toHaveBeenCalledWith(1, 10, {
				name: "Updated Show Item",
				dept_id: 1,
			});
			expect(mockRes.status).toHaveBeenCalledWith(200);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				data: mockItem,
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should return 404 when show item not found", async () => {
			const error = new Error("Show item not found");
			const spy = vi
				.spyOn(inventoryService, "updateShowItem")
				.mockRejectedValue(error);

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1, inventoryId: 999 },
				body: { name: "Updated Show Item" },
			};

			await inventoryController.updateItem(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(404);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				message: error.message,
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should return 400 on invalid department error", async () => {
			const error = new Error("Invalid department");
			const spy = vi
				.spyOn(inventoryService, "updateShowItem")
				.mockRejectedValue(error);

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1, inventoryId: 10 },
				body: { name: "Updated Show Item", dept_id: 999 },
			};

			await inventoryController.updateItem(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(400);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				message: error.message,
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should call next with unexpected error", async () => {
			const error = new Error("Unexpected error");
			const spy = vi
				.spyOn(inventoryService, "updateShowItem")
				.mockRejectedValue(error);

			const mockRes = {};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1, inventoryId: 10 },
				body: { name: "Updated Show Item" },
			};

			await inventoryController.updateItem(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);

			spy.mockRestore();
		});
	});

	describe("assignItem", () => {
		it("should assign item and return 200 response", async () => {
			const mockAssignment = { id: 1, inventory_id: 10, user_id: 5 };
			const spy = vi
				.spyOn(inventoryService, "assignShowItem")
				.mockResolvedValue(mockAssignment);

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1, inventoryId: 10 },
				body: { user_id: 5 },
			};

			await inventoryController.assignItem(mockReq, mockRes, mockNext);

			expect(spy).toHaveBeenCalledWith(1, 10, { user_id: 5 });
			expect(mockRes.status).toHaveBeenCalledWith(200);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				data: mockAssignment,
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should return 404 when item not found", async () => {
			const error = new Error("Item not found");
			const spy = vi
				.spyOn(inventoryService, "assignShowItem")
				.mockRejectedValue(error);

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1, inventoryId: 999 },
				body: { user_id: 5 },
			};

			await inventoryController.assignItem(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(404);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				message: error.message,
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should return 400 when user not eligible error", async () => {
			const error = new Error("User not eligible");
			const spy = vi
				.spyOn(inventoryService, "assignShowItem")
				.mockRejectedValue(error);

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1, inventoryId: 10 },
				body: { user_id: 5 },
			};

			await inventoryController.assignItem(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(400);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				message: error.message,
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should return 400 when Choose either error", async () => {
			const error = new Error("Choose either user or member");
			const spy = vi
				.spyOn(inventoryService, "assignShowItem")
				.mockRejectedValue(error);

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1, inventoryId: 10 },
				body: { user_id: 5, member_id: 2 },
			};

			await inventoryController.assignItem(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(400);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				message: error.message,
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should return 400 when only be assigned error", async () => {
			const error = new Error("Item can only be assigned to one member");
			const spy = vi
				.spyOn(inventoryService, "assignShowItem")
				.mockRejectedValue(error);

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1, inventoryId: 10 },
				body: { user_id: 5 },
			};

			await inventoryController.assignItem(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(400);

			spy.mockRestore();
		});

		it("should return 400 when member error", async () => {
			const error = new Error("Invalid member");
			const spy = vi
				.spyOn(inventoryService, "assignShowItem")
				.mockRejectedValue(error);

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1, inventoryId: 10 },
				body: { member_id: 999 },
			};

			await inventoryController.assignItem(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(400);

			spy.mockRestore();
		});

		it("should call next with unexpected error", async () => {
			const error = new Error("Unexpected error");
			const spy = vi
				.spyOn(inventoryService, "assignShowItem")
				.mockRejectedValue(error);

			const mockRes = {};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1, inventoryId: 10 },
				body: { user_id: 5 },
			};

			await inventoryController.assignItem(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);

			spy.mockRestore();
		});
	});
});
