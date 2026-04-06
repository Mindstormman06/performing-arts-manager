import { describe, expect, it, vi } from "vitest";
import scheduleController from "../src/controllers/schedule.controller.js";
import scheduleService from "../src/services/schedule.service.js";

describe("Schedule Controller - Direct Tests", () => {
	describe("getOrgCalendar", () => {
		it("should call next with error when service throws (Line 9-10)", async () => {
			const error = new Error("Database error");
			const spy = vi
				.spyOn(scheduleService, "getOrgCalendar")
				.mockRejectedValue(error);

			const mockRes = {};
			const mockNext = vi.fn();
			const mockReq = {
				params: { orgId: 1 },
			};

			await scheduleController.getOrgCalendar(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);

			spy.mockRestore();
		});

		it("should return success with calendar data on success", async () => {
			const mockCalendar = [
				{ id: 1, title: "Event 1" },
				{ id: 2, title: "Event 2" },
			];
			const spy = vi
				.spyOn(scheduleService, "getOrgCalendar")
				.mockResolvedValue(mockCalendar);

			const mockRes = {
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { orgId: 1 },
			};

			await scheduleController.getOrgCalendar(mockReq, mockRes, mockNext);

			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				data: mockCalendar,
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});
	});

	describe("getShowCalendar", () => {
		it("should call next with error when service throws (Line 20-21)", async () => {
			const error = new Error("Database error");
			const spy = vi
				.spyOn(scheduleService, "getShowCalendar")
				.mockRejectedValue(error);

			const mockRes = {};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1 },
			};

			await scheduleController.getShowCalendar(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);

			spy.mockRestore();
		});

		it("should return success with calendar data on success", async () => {
			const mockCalendar = [{ id: 1, title: "Rehearsal" }];
			const spy = vi
				.spyOn(scheduleService, "getShowCalendar")
				.mockResolvedValue(mockCalendar);

			const mockRes = {
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1 },
			};

			await scheduleController.getShowCalendar(mockReq, mockRes, mockNext);

			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				data: mockCalendar,
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});
	});

	describe("createOrgEvent", () => {
		it("should create org event and return 201 on success", async () => {
			const mockEvent = { id: 1, title: "Org Meeting" };
			const spy = vi
				.spyOn(scheduleService, "createOrgEvent")
				.mockResolvedValue(mockEvent);

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { orgId: 1 },
				user: { id: 5 },
				body: { title: "Org Meeting" },
			};

			await scheduleController.createOrgEvent(mockReq, mockRes, mockNext);

			expect(spy).toHaveBeenCalledWith(1, 5, { title: "Org Meeting" });
			expect(mockRes.status).toHaveBeenCalledWith(201);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				data: mockEvent,
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should call next with error when service throws (Line 32-33)", async () => {
			const error = new Error("Database error");
			const spy = vi
				.spyOn(scheduleService, "createOrgEvent")
				.mockRejectedValue(error);

			const mockRes = {};
			const mockNext = vi.fn();
			const mockReq = {
				params: { orgId: 1 },
				user: { id: 5 },
				body: { title: "Org Meeting" },
			};

			await scheduleController.createOrgEvent(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);

			spy.mockRestore();
		});
	});

	describe("createShowEvent", () => {
		it("should create show event and return 201 on success", async () => {
			const mockEvent = { id: 1, title: "Rehearsal" };
			const spy = vi
				.spyOn(scheduleService, "createShowEvent")
				.mockResolvedValue(mockEvent);

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1 },
				user: { id: 5 },
				body: { title: "Rehearsal" },
			};

			await scheduleController.createShowEvent(mockReq, mockRes, mockNext);

			expect(spy).toHaveBeenCalledWith(1, 5, { title: "Rehearsal" });
			expect(mockRes.status).toHaveBeenCalledWith(201);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				data: mockEvent,
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should call next with error when service throws (Line 44-45)", async () => {
			const error = new Error("Database error");
			const spy = vi
				.spyOn(scheduleService, "createShowEvent")
				.mockRejectedValue(error);

			const mockRes = {};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1 },
				user: { id: 5 },
				body: { title: "Rehearsal" },
			};

			await scheduleController.createShowEvent(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);

			spy.mockRestore();
		});
	});

	describe("updateEvent", () => {
		it("should update event on success", async () => {
			const mockEvent = { id: 1, title: "Updated Event" };
			const spy = vi
				.spyOn(scheduleService, "updateEvent")
				.mockResolvedValue(mockEvent);

			const mockRes = {
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { eventId: 1 },
				body: { title: "Updated Event" },
			};

			await scheduleController.updateEvent(mockReq, mockRes, mockNext);

			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				data: mockEvent,
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should return 404 when Event not found", async () => {
			const spy = vi
				.spyOn(scheduleService, "updateEvent")
				.mockRejectedValue(new Error("Event not found"));

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { eventId: 999 },
				body: { title: "Updated" },
			};

			await scheduleController.updateEvent(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(404);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				message: "Event not found",
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should call next with error on generic failure", async () => {
			const error = new Error("Database error");
			const spy = vi
				.spyOn(scheduleService, "updateEvent")
				.mockRejectedValue(error);

			const mockRes = {};
			const mockNext = vi.fn();
			const mockReq = {
				params: { eventId: 1 },
				body: { title: "Updated" },
			};

			await scheduleController.updateEvent(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);

			spy.mockRestore();
		});
	});

	describe("deleteEvent", () => {
		it("should delete event on success", async () => {
			const mockResult = { message: "Event deleted" };
			const spy = vi
				.spyOn(scheduleService, "deleteEvent")
				.mockResolvedValue(mockResult);

			const mockRes = {
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { eventId: 1 },
			};

			await scheduleController.deleteEvent(mockReq, mockRes, mockNext);

			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				message: "Event deleted",
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should return 404 when Event not found", async () => {
			const spy = vi
				.spyOn(scheduleService, "deleteEvent")
				.mockRejectedValue(new Error("Event not found"));

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { eventId: 999 },
			};

			await scheduleController.deleteEvent(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(404);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				message: "Event not found",
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should call next with error on generic failure", async () => {
			const error = new Error("Database error");
			const spy = vi
				.spyOn(scheduleService, "deleteEvent")
				.mockRejectedValue(error);

			const mockRes = {};
			const mockNext = vi.fn();
			const mockReq = {
				params: { eventId: 1 },
			};

			await scheduleController.deleteEvent(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);

			spy.mockRestore();
		});
	});

	describe("assignShowEventUsers", () => {
		it("should assign users to show event on success", async () => {
			const mockAssignment = [{ user_id: 1 }, { user_id: 2 }];
			const spy = vi
				.spyOn(scheduleService, "assignUsersToShowEvent")
				.mockResolvedValue(mockAssignment);

			const mockRes = {
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1, eventId: 1 },
				body: { all: true },
			};

			await scheduleController.assignShowEventUsers(mockReq, mockRes, mockNext);

			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				data: mockAssignment,
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should return 404 when Event not found (Line 84)", async () => {
			const spy = vi
				.spyOn(scheduleService, "assignUsersToShowEvent")
				.mockRejectedValue(new Error("Event not found"));

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1, eventId: 999 },
				body: { all: true },
			};

			await scheduleController.assignShowEventUsers(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(404);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				message: "Event not found",
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should call next with error on generic failure", async () => {
			const error = new Error("Database error");
			const spy = vi
				.spyOn(scheduleService, "assignUsersToShowEvent")
				.mockRejectedValue(error);

			const mockRes = {};
			const mockNext = vi.fn();
			const mockReq = {
				params: { showId: 1, eventId: 1 },
				body: { all: true },
			};

			await scheduleController.assignShowEventUsers(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);

			spy.mockRestore();
		});
	});

	describe("assignOrgEventUsers", () => {
		it("should assign users to org event on success", async () => {
			const mockAssignment = [{ user_id: 1 }, { user_id: 2 }];
			const spy = vi
				.spyOn(scheduleService, "assignUsersToOrgEvent")
				.mockResolvedValue(mockAssignment);

			const mockRes = {
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { orgId: 1, eventId: 1 },
				body: { all: true },
			};

			await scheduleController.assignOrgEventUsers(mockReq, mockRes, mockNext);

			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				data: mockAssignment,
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should return 404 when Event not found", async () => {
			const spy = vi
				.spyOn(scheduleService, "assignUsersToOrgEvent")
				.mockRejectedValue(new Error("Event not found"));

			const mockRes = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				params: { orgId: 1, eventId: 999 },
				body: { all: true },
			};

			await scheduleController.assignOrgEventUsers(mockReq, mockRes, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(404);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				message: "Event not found",
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should call next with error on generic failure (Line 100-101)", async () => {
			const error = new Error("Database error");
			const spy = vi
				.spyOn(scheduleService, "assignUsersToOrgEvent")
				.mockRejectedValue(error);

			const mockRes = {};
			const mockNext = vi.fn();
			const mockReq = {
				params: { orgId: 1, eventId: 1 },
				body: { all: true },
			};

			await scheduleController.assignOrgEventUsers(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);

			spy.mockRestore();
		});
	});

	describe("getPersonalSchedule", () => {
		it("should return personal schedule on success", async () => {
			const mockSchedule = [{ id: 1, title: "Event 1" }];
			const spy = vi
				.spyOn(scheduleService, "getPersonalSchedule")
				.mockResolvedValue(mockSchedule);

			const mockRes = {
				json: vi.fn(),
			};
			const mockNext = vi.fn();
			const mockReq = {
				user: { id: 5 },
			};

			await scheduleController.getPersonalSchedule(mockReq, mockRes, mockNext);

			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				data: mockSchedule,
			});
			expect(mockNext).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it("should call next with error when service throws (Line 111-112)", async () => {
			const error = new Error("Database error");
			const spy = vi
				.spyOn(scheduleService, "getPersonalSchedule")
				.mockRejectedValue(error);

			const mockRes = {};
			const mockNext = vi.fn();
			const mockReq = {
				user: { id: 5 },
			};

			await scheduleController.getPersonalSchedule(mockReq, mockRes, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);

			spy.mockRestore();
		});
	});
});

