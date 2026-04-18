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
			update,
			toJSON: () => ({ id: 7, title: "Updated" }),
		};
		vi.spyOn(models.Schedule, "findByPk").mockResolvedValue(event);

		const result = await scheduleService.updateEvent(7, { title: "Updated" });

		expect(update).toHaveBeenCalledWith({ title: "Updated" });
		expect(result).toEqual({ id: 7, title: "Updated" });
	});

	it("throws when updating a missing event", async () => {
		vi.spyOn(models.Schedule, "findByPk").mockResolvedValue(null);

		await expect(scheduleService.updateEvent(99, {})).rejects.toThrow(
			"Event not found",
		);
	});

	it("deletes an event when it exists", async () => {
		const destroy = vi.fn().mockResolvedValue(undefined);
		vi.spyOn(models.Schedule, "findByPk").mockResolvedValue({ destroy });

		const result = await scheduleService.deleteEvent(2);

		expect(destroy).toHaveBeenCalled();
		expect(result).toEqual({ message: "Event deleted successfully" });
	});

	it("throws when deleting a missing event", async () => {
		vi.spyOn(models.Schedule, "findByPk").mockResolvedValue(null);

		await expect(scheduleService.deleteEvent(404)).rejects.toThrow("Event not found");
	});

	it("assigns all org members to an org event", async () => {
		const event = {
			setAttendees: vi.fn().mockResolvedValue(undefined),
			getAttendees: vi.fn().mockResolvedValue([{ id: 10 }]),
		};
		vi.spyOn(models.Schedule, "findByPk").mockResolvedValue(event);
		vi.spyOn(models.OrgMembership, "findAll").mockResolvedValue([
			{ users_id: 10 },
			{ users_id: 11 },
		]);

		const result = await scheduleService.assignUsersToOrgEvent(1, 2, { all: true });

		expect(event.setAttendees).toHaveBeenCalledWith([10, 11]);
		expect(result).toEqual([{ id: 10 }]);
	});

	it("assigns org users by roles and explicit user IDs", async () => {
		const event = {
			setAttendees: vi.fn().mockResolvedValue(undefined),
			getAttendees: vi.fn().mockResolvedValue([{ id: 10 }, { id: 12 }]),
		};
		vi.spyOn(models.Schedule, "findByPk").mockResolvedValue(event);
		vi.spyOn(models.OrgMembership, "findAll").mockResolvedValue([
			{ users_id: 10 },
			{ users_id: 11 },
		]);

		await scheduleService.assignUsersToOrgEvent(1, 2, {
			all: false,
			roles: ["president"],
			users: [12],
			userIds: [12, 10],
		});

		expect(models.OrgMembership.findAll).toHaveBeenCalled();
		expect(event.setAttendees).toHaveBeenCalledWith(expect.arrayContaining([10, 11, 12]));
	});

	it("throws for missing org event before assignment", async () => {
		vi.spyOn(models.Schedule, "findByPk").mockResolvedValue(null);

		await expect(
			scheduleService.assignUsersToOrgEvent(1, 2, { all: true }),
		).rejects.toThrow("Event not found");
	});

	it("assigns all show members when all=true", async () => {
		const event = {
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
			setAttendees: vi.fn().mockResolvedValue(undefined),
			setRequiredCharacters: vi.fn().mockResolvedValue(undefined),
			getAttendees: vi.fn().mockResolvedValue([{ id: 3 }]),
		};
		vi.spyOn(models.Schedule, "findByPk").mockResolvedValue(event);
		const showMembershipSpy = vi
			.spyOn(models.ShowMembership, "findAll")
			.mockResolvedValue([{ users_id: 3 }, { users_id: 4 }]);
		vi.spyOn(models.Casting, "findAll").mockResolvedValue([{ id: 91 }, { id: 92 }]);

		await scheduleService.assignUsersToShowEvent(50, 9, {
			all: false,
			roles: ["director"],
			userIds: [5, 3],
			characterIds: [91, 92, 999],
		});

		expect(showMembershipSpy).toHaveBeenCalled();
		expect(event.setAttendees).toHaveBeenCalledWith(expect.arrayContaining([3, 4, 5]));
		expect(event.setRequiredCharacters).toHaveBeenCalledWith([91, 92]);
	});

	it("throws for missing show event before assignment", async () => {
		vi.spyOn(models.Schedule, "findByPk").mockResolvedValue(null);

		await expect(
			scheduleService.assignUsersToShowEvent(1, 2, { all: false }),
		).rejects.toThrow("Event not found");
	});
});

