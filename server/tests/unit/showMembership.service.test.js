import { afterEach, describe, expect, it, vi } from "vitest";

import models from "../../src/models/index.js";
import showMembershipService from "../../src/services/showMembership.service.js";

describe("Show Membership Service", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("addUserToShow", () => {
		it("throws when the show does not exist", async () => {
			vi.spyOn(models.Show, "findOne").mockResolvedValue(null);

			await expect(showMembershipService.addUserToShow(1, 2)).rejects.toThrow(
				"Show not found",
			);
		});

		it("throws when the user does not exist", async () => {
			vi.spyOn(models.Show, "findOne").mockResolvedValue({ id: 1 });
			vi.spyOn(models.User, "findOne").mockResolvedValue(null);

			await expect(showMembershipService.addUserToShow(1, 2)).rejects.toThrow(
				"User not found",
			);
		});

		it("throws when the membership already exists", async () => {
			vi.spyOn(models.Show, "findOne").mockResolvedValue({ id: 1 });
			vi.spyOn(models.User, "findOne").mockResolvedValue({ id: 2 });
			vi.spyOn(models.ShowMembership, "findOne").mockResolvedValue({ id: 10 });

			await expect(showMembershipService.addUserToShow(1, 2)).rejects.toThrow(
				"User already in show",
			);
		});

		it("creates membership when validation passes", async () => {
			vi.spyOn(models.Show, "findOne").mockResolvedValue({ id: 1 });
			vi.spyOn(models.User, "findOne").mockResolvedValue({ id: 2 });
			vi.spyOn(models.ShowMembership, "findOne").mockResolvedValue(null);
			const createSpy = vi
				.spyOn(models.ShowMembership, "create")
				.mockResolvedValue({
					id: 11,
					show_id: 1,
					users_id: 2,
					status: "active",
				});

			const result = await showMembershipService.addUserToShow(1, 2);

			expect(createSpy).toHaveBeenCalledWith({
				show_id: 1,
				users_id: 2,
				status: "active",
			});
			expect(result.status).toBe("active");
		});
	});

	describe("inviteByEmail", () => {
		it("throws when email does not match a user", async () => {
			vi.spyOn(models.User, "findOne").mockResolvedValue(null);

			await expect(
				showMembershipService.inviteByEmail(1, 2, "missing@example.com"),
			).rejects.toThrow("No user found with that email.");
		});

		it("throws when user is already in the show", async () => {
			vi.spyOn(models.User, "findOne").mockResolvedValue({ id: 9 });
			vi.spyOn(models.OrgMembership, "findOne").mockResolvedValue({
				id: 2,
				status: "active",
			});
			vi.spyOn(models.ShowMembership, "findOne").mockResolvedValue({ id: 8 });

			await expect(
				showMembershipService.inviteByEmail(1, 2, "exists@example.com"),
			).rejects.toThrow("User is already a member of the show.");
		});

		it("creates pending org membership and pending show invite for new org user", async () => {
			vi.spyOn(models.User, "findOne").mockResolvedValue({ id: 15 });
			vi.spyOn(models.OrgMembership, "findOne").mockResolvedValue(null);
			vi.spyOn(models.OrgMembership, "create").mockResolvedValue({
				id: 4,
				status: "pending",
			});
			vi.spyOn(models.ShowMembership, "findOne").mockResolvedValue(null);
			const createSpy = vi
				.spyOn(models.ShowMembership, "create")
				.mockResolvedValue({ id: 99, status: "pending" });

			const result = await showMembershipService.inviteByEmail(
				1,
				2,
				"new@example.com",
			);

			expect(createSpy).toHaveBeenCalledWith({
				show_id: 2,
				users_id: 15,
				status: "pending",
			});
			expect(result.status).toBe("pending");
		});

		it("creates active show invite for active org member", async () => {
			vi.spyOn(models.User, "findOne").mockResolvedValue({ id: 22 });
			vi.spyOn(models.OrgMembership, "findOne").mockResolvedValue({
				id: 6,
				status: "active",
			});
			vi.spyOn(models.ShowMembership, "findOne").mockResolvedValue(null);
			const createSpy = vi
				.spyOn(models.ShowMembership, "create")
				.mockResolvedValue({ id: 100, status: "active" });

			await showMembershipService.inviteByEmail(1, 2, "member@example.com");

			expect(createSpy).toHaveBeenCalledWith({
				show_id: 2,
				users_id: 22,
				status: "active",
			});
		});
	});

	describe("updateProfile", () => {
		it("throws when show membership is missing", async () => {
			vi.spyOn(models.ShowMembership, "findOne").mockResolvedValue(null);

			await expect(
				showMembershipService.updateProfile(4, 5, "bio", "path/to/photo.png"),
			).rejects.toThrow("Show membership not found.");
		});

		it("updates only the provided profile fields", async () => {
			const update = vi.fn().mockResolvedValue({ id: 7 });
			vi.spyOn(models.ShowMembership, "findOne").mockResolvedValue({ update });

			await showMembershipService.updateProfile(4, 5, "new bio", undefined);

			expect(update).toHaveBeenCalledWith({ bio: "new bio" });
		});
	});
});
