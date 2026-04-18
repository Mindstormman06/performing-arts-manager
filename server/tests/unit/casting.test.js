import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import app from "../server.js";
import { closeDatabase, setupTestDatabase } from "./utils/test-setup.js";

describe("Casting API", () => {
	let directorToken;
	let memberToken;
	let directorUserId;
	let memberUserId;
	let outsiderUserId;
	let orgId;
	let showId;
	let characterId;

	beforeAll(async () => {
		await setupTestDatabase();

		const directorEmail = `casting-director-${Date.now()}@viu.ca`;
		const directorRes = await request(app).post("/api/users").send({
			fname: "Casey",
			lname: "Director",
			email: directorEmail,
			password: "password123",
		});
		directorUserId = directorRes.body.id;

		const directorLogin = await request(app).post("/api/auth/login").send({
			email: directorEmail,
			password: "password123",
		});
		directorToken = directorLogin.body.token;

		const orgRes = await request(app)
			.post("/api/orgs")
			.set("Authorization", `Bearer ${directorToken}`)
			.send({ name: "Casting Org" });
		orgId = orgRes.body.id;

		await request(app).post(`/api/orgs/${orgId}/join`).send({ userId: directorUserId });
		await request(app)
			.put(`/api/orgs/${orgId}/users/${directorUserId}/roles`)
			.set("Authorization", `Bearer ${directorToken}`)
			.send({ roles: ["admin"] });

		const showRes = await request(app)
			.post("/api/shows")
			.set("Authorization", `Bearer ${directorToken}`)
			.send({
				title: "Casting Show",
				start_date: "2026-08-01",
				end_date: "2026-08-31",
				organization_id: orgId,
			});
		showId = showRes.body.id;

		await request(app).post(`/api/shows/${showId}/join`).send({ userId: directorUserId });
		await request(app)
			.put(`/api/shows/${showId}/users/${directorUserId}/roles`)
			.set("Authorization", `Bearer ${directorToken}`)
			.send({ roles: ["director"] });

		const memberEmail = `casting-member-${Date.now()}@viu.ca`;
		const memberRes = await request(app).post("/api/users").send({
			fname: "Morgan",
			lname: "Member",
			email: memberEmail,
			password: "password123",
		});
		memberUserId = memberRes.body.id;

		const memberLogin = await request(app).post("/api/auth/login").send({
			email: memberEmail,
			password: "password123",
		});
		memberToken = memberLogin.body.token;

		await request(app).post(`/api/orgs/${orgId}/join`).send({ userId: memberUserId });
		await request(app).post(`/api/shows/${showId}/join`).send({ userId: memberUserId });

		const outsiderEmail = `casting-outsider-${Date.now()}@viu.ca`;
		const outsiderRes = await request(app).post("/api/users").send({
			fname: "Outside",
			lname: "User",
			email: outsiderEmail,
			password: "password123",
		});
		outsiderUserId = outsiderRes.body.id;
	}, 30000);

	afterAll(async () => {
		await closeDatabase();
	});

	it("POST /api/shows/:showId/casting creates character (director)", async () => {
		const res = await request(app)
			.post(`/api/shows/${showId}/casting`)
			.set("Authorization", `Bearer ${directorToken}`)
			.send({ name: "Hamlet" });

		characterId = res.body?.data?.id;

		expect(res.statusCode).toBe(201);
		expect(res.body.success).toBe(true);
		expect(res.body.data.name).toBe("Hamlet");
		expect(Number(res.body.data.show_id)).toBe(Number(showId));
		expect(res.body.data.users_id).toBeNull();
	});

	it("POST /api/shows/:showId/casting rejects non-manager role", async () => {
		const res = await request(app)
			.post(`/api/shows/${showId}/casting`)
			.set("Authorization", `Bearer ${memberToken}`)
			.send({ name: "Ophelia" });

		expect(res.statusCode).toBe(403);
	});

	it("GET /api/shows/:showId/casting allows show members", async () => {
		const res = await request(app)
			.get(`/api/shows/${showId}/casting`)
			.set("Authorization", `Bearer ${memberToken}`);

		expect(res.statusCode).toBe(200);
		expect(res.body.success).toBe(true);
		expect(Array.isArray(res.body.data)).toBe(true);
		expect(res.body.data.find((c) => c.id === characterId)).toBeTruthy();
	});

	it("PUT /api/shows/:showId/casting/:characterId/assign assigns a member", async () => {
		const res = await request(app)
			.put(`/api/shows/${showId}/casting/${characterId}/assign`)
			.set("Authorization", `Bearer ${directorToken}`)
			.send({ users_id: memberUserId });

		expect(res.statusCode).toBe(200);
		expect(res.body.success).toBe(true);
		expect(res.body.data.users_id).toBe(memberUserId);
	});

	it("PUT /api/shows/:showId/casting/:characterId/assign rejects non-member user", async () => {
		const res = await request(app)
			.put(`/api/shows/${showId}/casting/${characterId}/assign`)
			.set("Authorization", `Bearer ${directorToken}`)
			.send({ users_id: outsiderUserId });

		expect(res.statusCode).toBe(400);
		expect(res.body.message).toContain("member");
	});

	it("PUT /api/shows/:showId/casting/:characterId renames character", async () => {
		const res = await request(app)
			.put(`/api/shows/${showId}/casting/${characterId}`)
			.set("Authorization", `Bearer ${directorToken}`)
			.send({ name: "Prince Hamlet" });

		expect(res.statusCode).toBe(200);
		expect(res.body.data.name).toBe("Prince Hamlet");
	});

	it("DELETE /api/shows/:showId/casting/:characterId deletes character", async () => {
		const res = await request(app)
			.delete(`/api/shows/${showId}/casting/${characterId}`)
			.set("Authorization", `Bearer ${directorToken}`);

		expect(res.statusCode).toBe(200);
		expect(res.body.success).toBe(true);
	});
});


