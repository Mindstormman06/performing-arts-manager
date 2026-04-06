import { describe, expect, it, vi } from "vitest";
import { Op } from "sequelize";

import orgMembershipController from "../src/controllers/orgMembership.controller.js";
import models from "../src/models/index.js";

describe("OrgMembership Controller - Direct Tests", () => {
	describe("respondToInvite - accept action with shows", () => {
		it("should update ShowMembership status when accepting invite and shows exist (Line 197)", async () => {
			// Mock the org membership
			const mockMembership = { update: vi.fn() };
			const membershipSpy = vi
				.spyOn(models.OrgMembership, "findOne")
				.mockResolvedValue(mockMembership);

			// Mock the shows returned
			const mockShows = [
				{ id: 1 },
				{ id: 2 },
			];
			const showSpy = vi
				.spyOn(models.Show, "findAll")
				.mockResolvedValue(mockShows);

			// Mock ShowMembership update
			const showMembershipSpy = vi
				.spyOn(models.ShowMembership, "update")
				.mockResolvedValue([1, 1]); // [number of affected rows, updated rows]

			const mockRes = {
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { orgId: 1 },
				body: { action: "accept" },
				user: { id: 5 },
			};

			await orgMembershipController.respondToInvite(
				mockReq,
				mockRes,
				mockNext
			);

			// Verify ShowMembership.update was called with correct parameters
			expect(showMembershipSpy).toHaveBeenCalledWith(
				{ status: "active" },
				{
					where: {
						users_id: 5,
						show_id: { [Op.in]: [1, 2] },
						status: "pending",
					},
				}
			);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				message: "Invitation accepted!",
			});
			expect(mockNext).not.toHaveBeenCalled();

			membershipSpy.mockRestore();
			showSpy.mockRestore();
			showMembershipSpy.mockRestore();
		});

		it("should not update ShowMembership when accepting invite but no shows exist", async () => {
			// Mock the org membership
			const mockMembership = { update: vi.fn() };
			const membershipSpy = vi
				.spyOn(models.OrgMembership, "findOne")
				.mockResolvedValue(mockMembership);

			// Mock the shows returned (empty array)
			const showSpy = vi
				.spyOn(models.Show, "findAll")
				.mockResolvedValue([]);

			// Mock ShowMembership update should NOT be called
			const showMembershipSpy = vi
				.spyOn(models.ShowMembership, "update")
				.mockResolvedValue([0, 0]);

			const mockRes = {
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { orgId: 1 },
				body: { action: "accept" },
				user: { id: 5 },
			};

			await orgMembershipController.respondToInvite(
				mockReq,
				mockRes,
				mockNext
			);

			// Verify ShowMembership.update was NOT called
			expect(showMembershipSpy).not.toHaveBeenCalled();
			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				message: "Invitation accepted!",
			});
			expect(mockNext).not.toHaveBeenCalled();

			membershipSpy.mockRestore();
			showSpy.mockRestore();
			showMembershipSpy.mockRestore();
		});
	});

	describe("respondToInvite - decline action with shows", () => {
		it("should destroy ShowMembership when declining invite and shows exist (Line 217)", async () => {
			// Mock the org membership
			const mockMembership = { destroy: vi.fn() };
			const membershipSpy = vi
				.spyOn(models.OrgMembership, "findOne")
				.mockResolvedValue(mockMembership);

			// Mock the shows returned
			const mockShows = [
				{ id: 1 },
				{ id: 2 },
			];
			const showSpy = vi
				.spyOn(models.Show, "findAll")
				.mockResolvedValue(mockShows);

			// Mock ShowMembership destroy
			const showMembershipSpy = vi
				.spyOn(models.ShowMembership, "destroy")
				.mockResolvedValue(2); // number of rows deleted

			const mockRes = {
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { orgId: 1 },
				body: { action: "decline" },
				user: { id: 5 },
			};

			await orgMembershipController.respondToInvite(
				mockReq,
				mockRes,
				mockNext
			);

			// Verify ShowMembership.destroy was called with correct parameters
			expect(showMembershipSpy).toHaveBeenCalledWith({
				where: {
					users_id: 5,
					show_id: { [Op.in]: [1, 2] },
					status: "pending",
				},
			});
			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				message: "Invitation declined.",
			});
			expect(mockNext).not.toHaveBeenCalled();

			membershipSpy.mockRestore();
			showSpy.mockRestore();
			showMembershipSpy.mockRestore();
		});

		it("should not destroy ShowMembership when declining invite but no shows exist", async () => {
			// Mock the org membership
			const mockMembership = { destroy: vi.fn() };
			const membershipSpy = vi
				.spyOn(models.OrgMembership, "findOne")
				.mockResolvedValue(mockMembership);

			// Mock the shows returned (empty array)
			const showSpy = vi
				.spyOn(models.Show, "findAll")
				.mockResolvedValue([]);

			// Mock ShowMembership destroy should NOT be called
			const showMembershipSpy = vi
				.spyOn(models.ShowMembership, "destroy")
				.mockResolvedValue(0);

			const mockRes = {
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { orgId: 1 },
				body: { action: "decline" },
				user: { id: 5 },
			};

			await orgMembershipController.respondToInvite(
				mockReq,
				mockRes,
				mockNext
			);

			// Verify ShowMembership.destroy was NOT called
			expect(showMembershipSpy).not.toHaveBeenCalled();
			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				message: "Invitation declined.",
			});
			expect(mockNext).not.toHaveBeenCalled();

			membershipSpy.mockRestore();
			showSpy.mockRestore();
			showMembershipSpy.mockRestore();
		});
	});

	describe("respondToInvite - invalid action", () => {
		it("should return 400 for invalid action (Line 229)", async () => {
			// Mock the org membership
			const mockMembership = { update: vi.fn(), destroy: vi.fn() };
			const membershipSpy = vi
				.spyOn(models.OrgMembership, "findOne")
				.mockResolvedValue(mockMembership);

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { orgId: 1 },
				body: { action: "invalid-action" },
				user: { id: 5 },
			};

			await orgMembershipController.respondToInvite(
				mockReq,
				mockRes,
				mockNext
			);

			expect(mockRes.status).toHaveBeenCalledWith(400);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				message: "Invalid action.",
			});
			expect(mockNext).not.toHaveBeenCalled();

			membershipSpy.mockRestore();
		});
	});

	describe("respondToInvite - error handling", () => {
		it("should call next with error when OrgMembership.findOne throws", async () => {
			const error = new Error("Database error");
			const spy = vi
				.spyOn(models.OrgMembership, "findOne")
				.mockRejectedValue(error);

			const mockRes = {};
			const mockNext = vi.fn();
			const mockReq = {
				params: { orgId: 1 },
				body: { action: "accept" },
				user: { id: 5 },
			};

			await orgMembershipController.respondToInvite(
				mockReq,
				mockRes,
				mockNext
			);

			expect(mockNext).toHaveBeenCalledWith(error);

			spy.mockRestore();
		});

		it("should call next with error when Show.findAll throws", async () => {
			const mockMembership = { update: vi.fn() };
			const membershipSpy = vi
				.spyOn(models.OrgMembership, "findOne")
				.mockResolvedValue(mockMembership);

			const error = new Error("Database error finding shows");
			const showSpy = vi
				.spyOn(models.Show, "findAll")
				.mockRejectedValue(error);

			const mockRes = {};
			const mockNext = vi.fn();
			const mockReq = {
				params: { orgId: 1 },
				body: { action: "accept" },
				user: { id: 5 },
			};

			await orgMembershipController.respondToInvite(
				mockReq,
				mockRes,
				mockNext
			);

			expect(mockNext).toHaveBeenCalledWith(error);

			membershipSpy.mockRestore();
			showSpy.mockRestore();
		});

		it("should call next with error when ShowMembership.update throws", async () => {
			const mockMembership = { update: vi.fn() };
			const membershipSpy = vi
				.spyOn(models.OrgMembership, "findOne")
				.mockResolvedValue(mockMembership);

			const mockShows = [{ id: 1 }];
			const showSpy = vi
				.spyOn(models.Show, "findAll")
				.mockResolvedValue(mockShows);

			const error = new Error("Error updating show memberships");
			const showMembershipSpy = vi
				.spyOn(models.ShowMembership, "update")
				.mockRejectedValue(error);

			const mockRes = {};
			const mockNext = vi.fn();
			const mockReq = {
				params: { orgId: 1 },
				body: { action: "accept" },
				user: { id: 5 },
			};

			await orgMembershipController.respondToInvite(
				mockReq,
				mockRes,
				mockNext
			);

			expect(mockNext).toHaveBeenCalledWith(error);

			membershipSpy.mockRestore();
			showSpy.mockRestore();
			showMembershipSpy.mockRestore();
		});

		it("should call next with error when ShowMembership.destroy throws", async () => {
			const mockMembership = { destroy: vi.fn() };
			const membershipSpy = vi
				.spyOn(models.OrgMembership, "findOne")
				.mockResolvedValue(mockMembership);

			const mockShows = [{ id: 1 }];
			const showSpy = vi
				.spyOn(models.Show, "findAll")
				.mockResolvedValue(mockShows);

			const error = new Error("Error destroying show memberships");
			const showMembershipSpy = vi
				.spyOn(models.ShowMembership, "destroy")
				.mockRejectedValue(error);

			const mockRes = {};
			const mockNext = vi.fn();
			const mockReq = {
				params: { orgId: 1 },
				body: { action: "decline" },
				user: { id: 5 },
			};

			await orgMembershipController.respondToInvite(
				mockReq,
				mockRes,
				mockNext
			);

			expect(mockNext).toHaveBeenCalledWith(error);

			membershipSpy.mockRestore();
			showSpy.mockRestore();
			showMembershipSpy.mockRestore();
		});
	});
});

