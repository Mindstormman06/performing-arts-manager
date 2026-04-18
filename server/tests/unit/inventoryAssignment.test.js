import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import app from "../../server.js";
import models from "../../src/models/index.js";
import { closeDatabase, setupTestDatabase } from "./utils/test-setup.js";

describe("Show Inventory Assignment", () => {
	let directorToken;
	let directorUserId;
	let actorUserId;
	let orgId;
	let showId;
	let characterId;
	let costumesItemId;
	let techItemId;

	beforeAll(async () => {
		await setupTestDatabase();

		await models.Department.bulkCreate([
			{ name: "Costumes" },
			{ name: "Tech" },
		]);

		const directorEmail = `inv-assign-director-${Date.now()}@viu.ca`;
		const directorRes = await request(app).post("/api/users").send({
			fname: "Dir",
			lname: "One",
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
			.send({ name: "Inventory Assignment Org" });
		orgId = orgRes.body.id;

		await request(app)
			.post(`/api/orgs/${orgId}/join`)
			.send({ userId: directorUserId });
		await request(app)
			.put(`/api/orgs/${orgId}/users/${directorUserId}/roles`)
			.set("Authorization", `Bearer ${directorToken}`)
			.send({ roles: ["admin"] });

		const showRes = await request(app)
			.post("/api/shows")
			.set("Authorization", `Bearer ${directorToken}`)
			.send({
				title: "Inventory Assignment Show",
				start_date: "2026-09-01",
				end_date: "2026-09-30",
				organization_id: orgId,
			});
		showId = showRes.body.id;

		await request(app)
			.post(`/api/shows/${showId}/join`)
			.set("Authorization", `Bearer ${directorToken}`)
			.send({ userId: directorUserId });
		await request(app)
			.put(`/api/shows/${showId}/users/${directorUserId}/roles`)
			.set("Authorization", `Bearer ${directorToken}`)
			.send({ roles: ["director"] });

		const actorEmail = `inv-assign-actor-${Date.now()}@viu.ca`;
		const actorRes = await request(app).post("/api/users").send({
			fname: "Actor",
			lname: "Two",
			email: actorEmail,
			password: "password123",
		});
		actorUserId = actorRes.body.id;

		await request(app)
			.post(`/api/orgs/${orgId}/join`)
			.send({ userId: actorUserId });
		await request(app)
			.post(`/api/shows/${showId}/join`)
			.set("Authorization", `Bearer ${directorToken}`)
			.send({ userId: actorUserId });
		await request(app)
			.put(`/api/shows/${showId}/users/${actorUserId}/roles`)
			.set("Authorization", `Bearer ${directorToken}`)
			.send({ roles: ["actor"] });

		const characterRes = await request(app)
			.post(`/api/shows/${showId}/casting`)
			.set("Authorization", `Bearer ${directorToken}`)
			.send({ name: "Hamlet" });
		characterId = characterRes.body.data.id;

		const costumesRes = await request(app)
			.post(`/api/inventory/shows/${showId}`)
			.set("Authorization", `Bearer ${directorToken}`)
			.send({
				name: "Cape",
				description: "Velvet cape",
				dept_id: 1,
			});
		costumesItemId = costumesRes.body.data.id;

		const techRes = await request(app)
			.post(`/api/inventory/shows/${showId}`)
			.set("Authorization", `Bearer ${directorToken}`)
			.send({
				name: "Headset",
				description: "Comms headset",
				dept_id: 4,
			});
		techItemId = techRes.body.data.id;
	}, 30000);

	afterAll(async () => {
		await closeDatabase();
	});

	it("assigns actor user to costumes item", async () => {
		const res = await request(app)
			.put(`/api/inventory/shows/${showId}/items/${costumesItemId}/assign`)
			.set("Authorization", `Bearer ${directorToken}`)
			.send({ users_id: actorUserId });

		expect(res.statusCode).toBe(200);
		expect(res.body.success).toBe(true);
	});

	it("rejects assigning actor user to tech item", async () => {
		const res = await request(app)
			.put(`/api/inventory/shows/${showId}/items/${techItemId}/assign`)
			.set("Authorization", `Bearer ${directorToken}`)
			.send({ users_id: actorUserId });

		expect(res.statusCode).toBe(400);
		expect(res.body.message).toContain("eligible");
	});

	it("assigns character to costumes item", async () => {
		const res = await request(app)
			.put(`/api/inventory/shows/${showId}/items/${costumesItemId}/assign`)
			.set("Authorization", `Bearer ${directorToken}`)
			.send({ casting_id: characterId });

		expect(res.statusCode).toBe(200);
		expect(res.body.success).toBe(true);
	});
});
