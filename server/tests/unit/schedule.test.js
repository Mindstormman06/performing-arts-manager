/**
 * Integration tests for every route under `/api/schedule`: org and show
 * calendars, event CRUD, attendee assignment and the personal schedule, plus
 * 404/500 mapping in the controllers.
 *
 * @remarks
 * Needs the live MySQL test DB: `beforeAll` runs `setupTestDatabase`, then
 * creates an org where the main user is president, a show where they are
 * director, and a second user in both. The happy-path tests run in order:
 * they create one org and one show event, update and assign them, and delete
 * them at the end. Error tests spy on `scheduleService` and restore each spy.
 */

import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import app from "../../server.js";
import scheduleService from "../../src/services/schedule.service.js";
import {
	addActiveOrgMember,
	closeDatabase,
	setupTestDatabase,
} from "./utils/test-setup.js";

describe("Schedule Routes", () => {
	let authToken;
	let testUserId;
	let testOrgId;
	let testShowId;
	let orgEventId;
	let showEventId;
	let otherUserId;

	beforeAll(async () => {
		await setupTestDatabase();

		const email = `schedule-tester-${Date.now()}@viu.ca`;
		const userRes = await request(app).post("/api/users").send({
			fname: "Schedule",
			lname: "Tester",
			email,
			password: "password123",
		});
		testUserId = userRes.body.id;

		const loginRes = await request(app).post("/api/auth/login").send({
			email,
			password: "password123",
		});
		authToken = loginRes.body.token;

		const orgRes = await request(app)
			.post("/api/orgs")
			.set("Authorization", `Bearer ${authToken}`)
			.send({ name: "Schedule Test Org" });
		testOrgId = orgRes.body.id;

		await addActiveOrgMember(testOrgId, testUserId);
		await request(app)
			.put(`/api/orgs/${testOrgId}/users/${testUserId}/roles`)
			.set("Authorization", `Bearer ${authToken}`)
			.send({ roles: ["president"] });

		const showRes = await request(app)
			.post("/api/shows")
			.set("Authorization", `Bearer ${authToken}`)
			.send({
				title: "Schedule Test Show",
				start_date: "2026-08-01",
				end_date: "2026-08-15",
				organization_id: testOrgId,
			});
		testShowId = showRes.body.id;

		await request(app)
			.post(`/api/shows/${testShowId}/join`)
			.set("Authorization", `Bearer ${authToken}`)
			.send({ userId: testUserId });
		await request(app)
			.put(`/api/shows/${testShowId}/users/${testUserId}/roles`)
			.set("Authorization", `Bearer ${authToken}`)
			.send({ roles: ["director"] });

		const otherRes = await request(app)
			.post("/api/users")
			.send({
				fname: "Other",
				lname: "User",
				email: `other-${Date.now()}@viu.ca`,
				password: "password123",
			});
		otherUserId = otherRes.body.id;

		await addActiveOrgMember(testOrgId, otherUserId);
		await request(app)
			.post(`/api/shows/${testShowId}/join`)
			.set("Authorization", `Bearer ${authToken}`)
			.send({ userId: otherUserId });
	}, 30000);

	afterAll(async () => {
		await closeDatabase();
	});

	describe("Happy path operations", () => {
		it("POST /api/schedule/orgs/:orgId - create organizations event", async () => {
			const res = await request(app)
				.post(`/api/schedule/orgs/${testOrgId}`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({
					title: "Org Meeting",
					start_time: "2026-04-01T10:00:00Z",
					end_time: "2026-04-01T11:00:00Z",
					location: "Main Hall",
				});
			expect(res.statusCode).toEqual(201);
			orgEventId = res.body.data.id;
		});

		it("POST /api/schedule/shows/:showId - create show event", async () => {
			const res = await request(app)
				.post(`/api/schedule/shows/${testShowId}`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({
					title: "Show Rehearsal",
					start_time: "2026-04-02T14:00:00Z",
					end_time: "2026-04-02T16:00:00Z",
				});
			expect(res.statusCode).toEqual(201);
			showEventId = res.body.data.id;
		});

		it("GET /api/schedule/orgs/:orgId - should return calendar array", async () => {
			const res = await request(app)
				.get(`/api/schedule/orgs/${testOrgId}`)
				.set("Authorization", `Bearer ${authToken}`);
			expect(res.statusCode).toEqual(200);
			expect(Array.isArray(res.body.data)).toBe(true);
		});

		it("GET /api/schedule/shows/:showId - should return calendar array", async () => {
			const res = await request(app)
				.get(`/api/schedule/shows/${testShowId}`)
				.set("Authorization", `Bearer ${authToken}`);
			expect(res.statusCode).toEqual(200);
			expect(Array.isArray(res.body.data)).toBe(true);
		});

		it("PUT org event - should update title", async () => {
			const res = await request(app)
				.put(`/api/schedule/orgs/${testOrgId}/${orgEventId}`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ title: "Updated Org Meeting" });
			expect(res.statusCode).toEqual(200);
			expect(res.body.data.title).toEqual("Updated Org Meeting");
		});

		it("PUT show event - should update location", async () => {
			const res = await request(app)
				.put(`/api/schedule/shows/${testShowId}/${showEventId}`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ location: "Stage A" });
			expect(res.statusCode).toEqual(200);
			expect(res.body.data.location).toEqual("Stage A");
		});

		it("POST /api/schedule/orgs/:orgId/:eventId/users - assign all org users", async () => {
			const res = await request(app)
				.post(`/api/schedule/orgs/${testOrgId}/${orgEventId}/users`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ all: true });
			expect(res.statusCode).toEqual(200);
			expect(Array.isArray(res.body.data)).toBe(true);
			expect(res.body.data.length).toBeGreaterThanOrEqual(2);
		});

		it("POST /api/schedule/shows/:showId/:eventId/users - assign all show users", async () => {
			const res = await request(app)
				.post(`/api/schedule/shows/${testShowId}/${showEventId}/users`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ all: true });
			if (res.statusCode !== 200) {
				console.error("unexpected body:", res.body);
			}
			expect(res.statusCode).toEqual(200);
			expect(Array.isArray(res.body.data)).toBe(true);
			expect(res.body.data.length).toBeGreaterThanOrEqual(2);
		});

		it("GET /api/schedule/personal - should include assigned events", async () => {
			const res = await request(app)
				.get("/api/schedule/personal")
				.set("Authorization", `Bearer ${authToken}`);
			expect(res.statusCode).toEqual(200);
			expect(Array.isArray(res.body.data)).toBe(true);
			expect(res.body.data.some((e) => e.id === orgEventId)).toBe(true);
		});

		it("DELETE org event - should remove it", async () => {
			const res = await request(app)
				.delete(`/api/schedule/orgs/${testOrgId}/${orgEventId}`)
				.set("Authorization", `Bearer ${authToken}`);
			expect(res.statusCode).toEqual(200);
		});

		it("DELETE show event - should remove it", async () => {
			const res = await request(app)
				.delete(`/api/schedule/shows/${testShowId}/${showEventId}`)
				.set("Authorization", `Bearer ${authToken}`);
			expect(res.statusCode).toEqual(200);
		});
	});

	describe("Error handling", () => {
		it("PUT /orgs event - 404 when not found", async () => {
			const spy = vi
				.spyOn(scheduleService, "updateEvent")
				.mockRejectedValue(new Error("Event not found"));
			const res = await request(app)
				.put(`/api/schedule/orgs/${testOrgId}/9999`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ title: "nope" });
			expect(res.statusCode).toEqual(404);
			spy.mockRestore();
		});

		it("PUT /shows event - generic error -> 500", async () => {
			const spy = vi
				.spyOn(scheduleService, "updateEvent")
				.mockRejectedValue(new Error("some failure"));
			const res = await request(app)
				.put(`/api/schedule/shows/${testShowId}/9999`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ title: "nope" });
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});

		it("DELETE /orgs event - 404", async () => {
			const spy = vi
				.spyOn(scheduleService, "deleteEvent")
				.mockRejectedValue(new Error("Event not found"));
			const res = await request(app)
				.delete(`/api/schedule/orgs/${testOrgId}/9999`)
				.set("Authorization", `Bearer ${authToken}`);
			expect(res.statusCode).toEqual(404);
			spy.mockRestore();
		});

		it("DELETE /shows event - generic error", async () => {
			const spy = vi
				.spyOn(scheduleService, "deleteEvent")
				.mockRejectedValue(new Error("kaboom"));
			const res = await request(app)
				.delete(`/api/schedule/shows/${testShowId}/9999`)
				.set("Authorization", `Bearer ${authToken}`);
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});

		it("POST assign org users - 404", async () => {
			const spy = vi
				.spyOn(scheduleService, "assignUsersToOrgEvent")
				.mockRejectedValue(new Error("Event not found"));
			const res = await request(app)
				.post(`/api/schedule/orgs/${testOrgId}/123/users`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ all: true });
			expect(res.statusCode).toEqual(404);
			spy.mockRestore();
		});

		it("PUT assign show users - generic 500", async () => {
			const spy = vi
				.spyOn(scheduleService, "assignUsersToShowEvent")
				.mockRejectedValue(new Error("fail"));
			const res = await request(app)
				.put(`/api/schedule/shows/${testShowId}/123/users`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({ all: true });
			expect(res.statusCode).toEqual(500);
			spy.mockRestore();
		});
	});
});
