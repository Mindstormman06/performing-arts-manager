/**
 * Unit tests for `schedule.service.js`: event update and delete scoping, and
 * assigning attendees to org and show events by role, user and character.
 *
 * @remarks
 * Needs no database. Sequelize model methods are stubbed with `vi.spyOn` and
 * restored after each test, so tests are independent of each other.
 */

import { afterEach, describe, expect, it, vi } from "vitest";

import models from "../../src/models/index.js";
import scheduleService from "../../src/services/schedule.service.js";

describe("Schedule Service", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("updates an event when it exists", async () => {
		const update = vi.fn().mockResolvedValue(undefined);
		const event = {
			show_id: 3,
			update,
			toJSON: () => ({ id: 7, title: "Updated" }),
		};
		vi.spyOn(models.Schedule, "findByPk").mockResolvedValue(event);

		const result = await scheduleService.updateEvent(
			7,
			{ title: "Updated", show_id: 999, org_id: 999, creator_id: 1 },
			{ showId: 3 },
		);

		// Ownership fields from the request body are ignored
		expect(update).toHaveBeenCalledWith({ title: "Updated" });
		expect(result).toEqual({ id: 7, title: "Updated" });
	});

	it("throws when updating a missing event", async () => {
		vi.spyOn(models.Schedule, "findByPk").mockResolvedValue(null);

		await expect(
			scheduleService.updateEvent(99, {}, { showId: 1 }),
		).rejects.toThrow("Event not found");
	});

	it("refuses to update an event that belongs to a different show", async () => {
		const update = vi.fn();
		vi.spyOn(models.Schedule, "findByPk").mockResolvedValue({
			show_id: 8,
			update,
		});

		await expect(
			scheduleService.updateEvent(7, { title: "Hijack" }, { showId: 3 }),
		).rejects.toThrow("Event not found");
		expect(update).not.toHaveBeenCalled();
	});

	it("refuses to delete an event from a different organization", async () => {
		const destroy = vi.fn();
		vi.spyOn(models.Schedule, "findByPk").mockResolvedValue({
			org_id: 5,
			show_id: null,
			destroy,
		});

		await expect(scheduleService.deleteEvent(7, { orgId: 1 })).rejects.toThrow(
			"Event not found",
		);
		expect(destroy).not.toHaveBeenCalled();
	});

	it("lets an org manage events of its own shows", async () => {
		const destroy = vi.fn().mockResolvedValue(undefined);
		vi.spyOn(models.Schedule, "findByPk").mockResolvedValue({
			org_id: null,
			show_id: 4,
			destroy,
		});
		vi.spyOn(models.Show, "findByPk").mockResolvedValue({
			id: 4,
			organization_id: 1,
		});

		await scheduleService.deleteEvent(7, { orgId: 1 });
		expect(destroy).toHaveBeenCalled();
	});

	it("requires a scope", async () => {
		vi.spyOn(models.Schedule, "findByPk").mockResolvedValue({ org_id: 1 });
		await expect(scheduleService.deleteEvent(7)).rejects.toThrow(
			"Event scope is required",
		);
	});

	it("deletes an event when it exists", async () => {
		const destroy = vi.fn().mockResolvedValue(undefined);
		vi.spyOn(models.Schedule, "findByPk").mockResolvedValue({
			org_id: 1,
			destroy,
		});

		const result = await scheduleService.deleteEvent(2, { orgId: 1 });

		expect(destroy).toHaveBeenCalled();
		expect(result).toEqual({ message: "Event deleted successfully" });
	});

	it("throws when deleting a missing event", async () => {
		vi.spyOn(models.Schedule, "findByPk").mockResolvedValue(null);

		await expect(
			scheduleService.deleteEvent(404, { orgId: 1 }),
		).rejects.toThrow("Event not found");
	});

	it("assigns all org members to an org event", async () => {
		const event = {
			org_id: 1,
			setAttendees: vi.fn().mockResolvedValue(undefined),
			getAttendees: vi.fn().mockResolvedValue([{ id: 10 }]),
		};
		vi.spyOn(models.Schedule, "findByPk").mockResolvedValue(event);
		vi.spyOn(models.OrgMembership, "findAll").mockResolvedValue([
			{ users_id: 10 },
			{ users_id: 11 },
		]);

		const result = await scheduleService.assignUsersToOrgEvent(1, 2, {
			all: true,
		});

		expect(event.setAttendees).toHaveBeenCalledWith([10, 11]);
		expect(result).toEqual([{ id: 10 }]);
	});

	it("assigns org users by roles and explicit user IDs", async () => {
		const event = {
			org_id: 1,
			setAttendees: vi.fn().mockResolvedValue(undefined),
			getAttendees: vi.fn().mockResolvedValue([{ id: 10 }, { id: 12 }]),
		};
		vi.spyOn(models.Schedule, "findByPk").mockResolvedValue(event);
		vi.spyOn(models.OrgMembership, "findAll")
			// members holding the requested role
			.mockResolvedValueOnce([{ users_id: 10 }, { users_id: 11 }])
			// explicit user IDs, filtered to org members (99 is not a member)
			.mockResolvedValueOnce([{ users_id: 12 }, { users_id: 10 }]);

		await scheduleService.assignUsersToOrgEvent(1, 2, {
			all: false,
			roles: ["president"],
			userIds: [12, 10, 99],
		});

		expect(models.OrgMembership.findAll).toHaveBeenCalledTimes(2);
		const assigned = event.setAttendees.mock.calls[0][0];
		expect(assigned).toEqual(expect.arrayContaining([10, 11, 12]));
		expect(assigned).not.toContain(99);
	});

	it("throws for missing org event before assignment", async () => {
		vi.spyOn(models.Schedule, "findByPk").mockResolvedValue(null);

		await expect(
			scheduleService.assignUsersToOrgEvent(1, 2, { all: true }),
		).rejects.toThrow("Event not found");
	});

	it("assigns all show members when all=true", async () => {
		const event = {
			show_id: 50,
			setAttendees: vi.fn().mockResolvedValue(undefined),
			setRequiredCharacters: vi.fn().mockResolvedValue(undefined),
			getAttendees: vi.fn().mockResolvedValue([{ id: 1 }]),
		};
		vi.spyOn(models.Schedule, "findByPk").mockResolvedValue(event);
		vi.spyOn(models.ShowMembership, "findAll").mockResolvedValue([
			{ users_id: 1 },
			{ users_id: 2 },
		]);

		await scheduleService.assignUsersToShowEvent(50, 9, { all: true });

		expect(event.setAttendees).toHaveBeenCalledWith([1, 2]);
		expect(event.setRequiredCharacters).toHaveBeenCalledWith([]);
	});

	it("assigns show users by roles, explicit users, and valid characters", async () => {
		const event = {
			show_id: 50,
			setAttendees: vi.fn().mockResolvedValue(undefined),
			setRequiredCharacters: vi.fn().mockResolvedValue(undefined),
			getAttendees: vi.fn().mockResolvedValue([{ id: 3 }]),
		};
		vi.spyOn(models.Schedule, "findByPk").mockResolvedValue(event);
		const showMembershipSpy = vi
			.spyOn(models.ShowMembership, "findAll")
			// members holding the requested role
			.mockResolvedValueOnce([{ users_id: 3 }, { users_id: 4 }])
			// explicit user IDs, filtered to show members
			.mockResolvedValueOnce([{ users_id: 5 }, { users_id: 3 }]);
		vi.spyOn(models.Casting, "findAll").mockResolvedValue([
			{ id: 91 },
			{ id: 92 },
		]);

		await scheduleService.assignUsersToShowEvent(50, 9, {
			all: false,
			roles: ["director"],
			userIds: [5, 3],
			characterIds: [91, 92, 999],
		});

		expect(showMembershipSpy).toHaveBeenCalled();
		expect(event.setAttendees).toHaveBeenCalledWith(
			expect.arrayContaining([3, 4, 5]),
		);
		expect(event.setRequiredCharacters).toHaveBeenCalledWith([91, 92]);
	});

	it("throws for missing show event before assignment", async () => {
		vi.spyOn(models.Schedule, "findByPk").mockResolvedValue(null);

		await expect(
			scheduleService.assignUsersToShowEvent(1, 2, { all: false }),
		).rejects.toThrow("Event not found");
	});

	it("supports show assignment with no role, user, or character filters", async () => {
		const event = {
			show_id: 7,
			setAttendees: vi.fn().mockResolvedValue(undefined),
			setRequiredCharacters: vi.fn().mockResolvedValue(undefined),
			getAttendees: vi.fn().mockResolvedValue([]),
		};
		vi.spyOn(models.Schedule, "findByPk").mockResolvedValue(event);

		const result = await scheduleService.assignUsersToShowEvent(7, 8, {
			all: false,
			roles: [],
			userIds: [],
			characterIds: [],
		});

		expect(event.setAttendees).toHaveBeenCalledWith([]);
		expect(event.setRequiredCharacters).toHaveBeenCalledWith([]);
		expect(result).toEqual([]);
	});
});
