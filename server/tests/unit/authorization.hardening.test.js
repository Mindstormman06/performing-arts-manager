/**
 * Integration tests for access control across shows, organizations and users.
 *
 * @remarks
 * Covers the show field allow-list, scoping of the show, org and user read
 * endpoints, the requirement that show access needs an active org membership,
 * and role hierarchy for show and org role changes. Needs the live MySQL
 * test DB: `beforeAll` runs `setupTestDatabase`, then builds one org with a
 * president, admin, director, stage-manager and actor, plus an unrelated org
 * and an outsider. Tests run in order and later ones depend on role state
 * left by earlier ones.
 */

import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import app from "../../server.js";
import models from "../../src/models/index.js";
import {
	addActiveOrgMember,
	closeDatabase,
	setupTestDatabase,
} from "./utils/test-setup.js";

const PASSWORD = "password123";
let counter = 0;

async function makeUser(label) {
	counter += 1;
	const email = `hard-${label}-${Date.now()}-${counter}@viu.ca`;
	const res = await request(app)
		.post("/api/users")
		.send({ fname: label, lname: "Hardening", email, password: PASSWORD });
	const login = await request(app)
		.post("/api/auth/login")
		.send({ email, password: PASSWORD });
	return { id: res.body.id, email, token: login.body.token };
}

const bearer = (user) => ({ Authorization: `Bearer ${user.token}` });

async function addToShow(showId, user, roles, actor) {
	await models.ShowMembership.findOrCreate({
		where: { show_id: showId, users_id: user.id },
		defaults: { status: "active" },
	});
	if (roles.length) {
		await request(app)
			.put(`/api/shows/${showId}/users/${user.id}/roles`)
			.set(bearer(actor))
			.send({ roles });
	}
}

async function showRoleNames(showId, userId) {
	const membership = await models.ShowMembership.findOne({
		where: { show_id: showId, users_id: userId },
		include: [{ model: models.ShowRole, as: "assignedRoles" }],
	});
	return membership ? membership.assignedRoles.map((r) => r.name) : null;
}

describe("Authorization hardening", () => {
	let president;
	let admin;
	let director;
	let stageManager;
	let actor;
	let outsider;
	let otherPresident;
	let org;
	let otherOrg;
	let show;

	beforeAll(async () => {
		await setupTestDatabase();

		president = await makeUser("president");
		admin = await makeUser("admin");
		director = await makeUser("director");
		stageManager = await makeUser("sm");
		actor = await makeUser("actor");
		outsider = await makeUser("outsider");
		otherPresident = await makeUser("otherPres");

		org = (
			await request(app)
				.post("/api/orgs")
				.set(bearer(president))
				.send({ name: "Hardening Org" })
		).body.id;
		otherOrg = (
			await request(app)
				.post("/api/orgs")
				.set(bearer(otherPresident))
				.send({ name: "Other Org" })
		).body.id;

		for (const u of [admin, director, stageManager, actor]) {
			await addActiveOrgMember(org, u.id);
		}
		await request(app)
			.put(`/api/orgs/${org}/users/${admin.id}/roles`)
			.set(bearer(president))
			.send({ roles: ["admin"] });

		show = (
			await request(app).post("/api/shows").set(bearer(president)).send({
				title: "Hardening Show",
				start_date: "2030-01-01",
				end_date: "2030-02-01",
				organization_id: org,
			})
		).body.id;

		await addToShow(show, director, ["director"], president);
		await addToShow(show, stageManager, ["stage-manager"], president);
		await addToShow(show, actor, ["actor"], president);
	}, 60000);

	afterAll(async () => {
		await closeDatabase();
	});

	describe("Show mass assignment", () => {
		it("ignores organization_id and unknown fields on update", async () => {
			const res = await request(app)
				.put(`/api/shows/${show}`)
				.set(bearer(director))
				.send({ title: "Renamed", organization_id: otherOrg, id: 9999 });
			expect(res.statusCode).toBe(200);

			const reloaded = await models.Show.findByPk(show);
			expect(reloaded.title).toBe("Renamed");
			expect(reloaded.organization_id).toBe(org);
		});

		it("ignores a client-supplied id on create", async () => {
			const res = await request(app)
				.post("/api/shows")
				.set(bearer(president))
				.send({
					id: 4242,
					title: "No Id Override",
					start_date: "2030-03-01",
					end_date: "2030-04-01",
					organization_id: org,
				});
			expect(res.statusCode).toBe(201);
			expect(res.body.id).not.toBe(4242);
		});
	});

	describe("Scoped read endpoints", () => {
		it("requires authentication for show reads", async () => {
			expect((await request(app).get("/api/shows")).statusCode).toBe(401);
			expect((await request(app).get(`/api/shows/${show}`)).statusCode).toBe(
				401,
			);
		});

		it("lists only shows the caller can see", async () => {
			const outsiderList = await request(app)
				.get("/api/shows")
				.set(bearer(outsider));
			expect(outsiderList.statusCode).toBe(200);
			expect(outsiderList.body).toEqual([]);

			const actorList = await request(app).get("/api/shows").set(bearer(actor));
			expect(actorList.body.map((s) => s.id)).toContain(show);

			const otherList = await request(app)
				.get("/api/shows/user")
				.set(bearer(otherPresident));
			expect(otherList.body.map((s) => s.id)).not.toContain(show);
		});

		it("gives org oversight every show in the org", async () => {
			const res = await request(app)
				.get(`/api/shows/user?orgId=${org}`)
				.set(bearer(admin));
			expect(res.body.map((s) => s.id)).toContain(show);
		});

		it("blocks reading a show the caller is not part of", async () => {
			const res = await request(app)
				.get(`/api/shows/${show}`)
				.set(bearer(outsider));
			expect(res.statusCode).toBe(403);
		});

		it("only shows other users' names, and only to people sharing an org", async () => {
			const list = await request(app).get("/api/users").set(bearer(outsider));
			expect(list.statusCode).toBe(200);
			expect(list.body.map((u) => u.id)).toEqual([outsider.id]);

			const hidden = await request(app)
				.get(`/api/users/${actor.id}`)
				.set(bearer(outsider));
			expect(hidden.statusCode).toBe(404);

			const peer = await request(app)
				.get(`/api/users/${actor.id}`)
				.set(bearer(director));
			expect(peer.statusCode).toBe(200);
			expect(Object.keys(peer.body).sort()).toEqual(["fname", "id", "lname"]);

			const peers = await request(app).get("/api/users").set(bearer(director));
			const actorEntry = peers.body.find((u) => u.id === actor.id);
			expect(actorEntry).toBeDefined();
			expect(actorEntry).not.toHaveProperty("email");
		});
	});

	describe("Show role hierarchy", () => {
		it("stops a stage-manager from stripping the director", async () => {
			const res = await request(app)
				.put(`/api/shows/${show}/users/${director.id}/roles`)
				.set(bearer(stageManager))
				.send({ roles: [] });
			expect(res.statusCode).toBe(403);
			expect(await showRoleNames(show, director.id)).toContain("director");
		});

		it("stops a stage-manager from granting director", async () => {
			const res = await request(app)
				.put(`/api/shows/${show}/users/${actor.id}/roles`)
				.set(bearer(stageManager))
				.send({ roles: ["actor", "director"] });
			expect(res.statusCode).toBe(403);
			expect(await showRoleNames(show, actor.id)).not.toContain("director");
		});

		it("stops a stage-manager from removing director roles or the director", async () => {
			const roleRes = await request(app)
				.delete(`/api/shows/${show}/users/${director.id}/roles`)
				.set(bearer(stageManager))
				.send({ roles: ["director"] });
			expect(roleRes.statusCode).toBe(403);

			const removeRes = await request(app)
				.delete(`/api/shows/${show}/users/${director.id}`)
				.set(bearer(stageManager));
			expect(removeRes.statusCode).toBe(403);
			expect(await showRoleNames(show, director.id)).toContain("director");
		});

		it("lets a stage-manager manage roles below their own", async () => {
			const res = await request(app)
				.put(`/api/shows/${show}/users/${actor.id}/roles`)
				.set(bearer(stageManager))
				.send({ roles: ["actor", "props"] });
			expect(res.statusCode).toBe(200);
			expect(await showRoleNames(show, actor.id)).toEqual(
				expect.arrayContaining(["actor", "props"]),
			);
		});

		it("lets a director promote someone to stage-manager", async () => {
			const res = await request(app)
				.put(`/api/shows/${show}/users/${actor.id}/roles`)
				.set(bearer(director))
				.send({ roles: ["stage-manager"] });
			expect(res.statusCode).toBe(200);

			// Restore the actor role, which later tests expect.
			await request(app)
				.put(`/api/shows/${show}/users/${actor.id}/roles`)
				.set(bearer(director))
				.send({ roles: ["actor"] });
		});
	});

	describe("Org role hierarchy", () => {
		it("stops an admin from stripping or removing the president", async () => {
			const strip = await request(app)
				.put(`/api/orgs/${org}/users/${president.id}/roles`)
				.set(bearer(admin))
				.send({ roles: [] });
			expect(strip.statusCode).toBe(403);

			const removeRole = await request(app)
				.delete(`/api/orgs/${org}/users/${president.id}/roles`)
				.set(bearer(admin))
				.send({ role: "president" });
			expect(removeRole.statusCode).toBe(403);

			const kick = await request(app)
				.delete(`/api/orgs/${org}/users/${president.id}`)
				.set(bearer(admin));
			expect(kick.statusCode).toBe(403);
		});

		it("stops an admin from granting president", async () => {
			const res = await request(app)
				.put(`/api/orgs/${org}/users/${admin.id}/roles`)
				.set(bearer(admin))
				.send({ roles: ["admin", "president"] });
			expect(res.statusCode).toBe(403);
		});

		it("lets the president manage roles", async () => {
			const res = await request(app)
				.put(`/api/orgs/${org}/users/${stageManager.id}/roles`)
				.set(bearer(president))
				.send({ roles: ["props"] });
			expect(res.statusCode).toBe(200);
		});
	});

	describe("Leaving the org revokes show access", () => {
		it("removes show memberships and blocks the show afterwards", async () => {
			const leaver = await makeUser("leaver");
			await addActiveOrgMember(org, leaver.id);
			await addToShow(show, leaver, ["director"], president);

			const before = await request(app)
				.get(`/api/shows/${show}`)
				.set(bearer(leaver));
			expect(before.statusCode).toBe(200);

			const kick = await request(app)
				.delete(`/api/orgs/${org}/users/${leaver.id}`)
				.set(bearer(president));
			expect(kick.statusCode).toBe(200);

			expect(await showRoleNames(show, leaver.id)).toBeNull();
			const after = await request(app)
				.put(`/api/shows/${show}`)
				.set(bearer(leaver))
				.send({ title: "Hijacked" });
			expect(after.statusCode).toBe(403);
		});
	});
});
