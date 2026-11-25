/**
 * Integration tests that unauthorized callers are rejected across org
 * membership, shows, schedule events, inventory and the database-reset route.
 *
 * @remarks
 * Needs the live MySQL test DB: `beforeAll` runs `setupTestDatabase`, then
 * builds Org A (president, props-department member, plus an outsider with no
 * org) and Org B (its own president, show, event and inventory item). The
 * profile-edit tests rely on the earlier test that adds the props member to
 * Show A, and the reset test temporarily unsets `VITEST` and
 * `ALLOW_DB_RESET` in `process.env`.
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
	const email = `authz-${label}-${Date.now()}-${counter}@viu.ca`;
	const res = await request(app)
		.post("/api/users")
		.send({ fname: label, lname: "Authz", email, password: PASSWORD });
	const login = await request(app)
		.post("/api/auth/login")
		.send({ email, password: PASSWORD });
	return { id: res.body.id, email, token: login.body.token };
}

const bearer = (user) => ({ Authorization: `Bearer ${user.token}` });

describe("Authorization regressions", () => {
	let presA;
	let propsMember;
	let outsider;
	let presB;
	let orgA;
	let orgB;
	let showA;
	let showB;
	let eventB;
	let costumesDeptId;
	let propsDeptId;
	let costumesItemA;
	let globalItemB;

	beforeAll(async () => {
		await setupTestDatabase();

		presA = await makeUser("presA");
		propsMember = await makeUser("props");
		outsider = await makeUser("outsider");
		presB = await makeUser("presB");

		orgA = (
			await request(app)
				.post("/api/orgs")
				.set(bearer(presA))
				.send({ name: "Org A" })
		).body.id;
		orgB = (
			await request(app)
				.post("/api/orgs")
				.set(bearer(presB))
				.send({ name: "Org B" })
		).body.id;

		await addActiveOrgMember(orgA, propsMember.id);
		await request(app)
			.put(`/api/orgs/${orgA}/users/${propsMember.id}/roles`)
			.set(bearer(presA))
			.send({ roles: ["props"] });

		showA = (
			await request(app).post("/api/shows").set(bearer(presA)).send({
				title: "Show A",
				start_date: "2030-01-01",
				end_date: "2030-02-01",
				organization_id: orgA,
			})
		).body.id;
		showB = (
			await request(app).post("/api/shows").set(bearer(presB)).send({
				title: "Show B",
				start_date: "2030-01-01",
				end_date: "2030-02-01",
				organization_id: orgB,
			})
		).body.id;

		eventB = (
			await request(app)
				.post(`/api/schedule/shows/${showB}`)
				.set(bearer(presB))
				.send({
					title: "B rehearsal",
					start_time: "2030-01-01T18:00:00Z",
					end_time: "2030-01-01T20:00:00Z",
				})
		).body.data.id;

		costumesDeptId = (
			await models.Department.findOne({ where: { name: "Costumes" } })
		).id;
		propsDeptId = (
			await models.Department.findOne({ where: { name: "Props" } })
		).id;

		costumesItemA = (
			await request(app)
				.post(`/api/inventory/orgs/${orgA}`)
				.set(bearer(presA))
				.send({
					name: "Gown",
					description: "Red gown",
					dept_id: costumesDeptId,
				})
		).body.data.id;
		globalItemB = (
			await request(app)
				.post(`/api/inventory/orgs/${orgB}`)
				.set(bearer(presB))
				.send({
					name: "Crown",
					description: "Gold crown",
					dept_id: propsDeptId,
				})
		).body.data.id;
	}, 60000);

	afterAll(async () => {
		await closeDatabase();
	});

	describe("Organization membership", () => {
		it("rejects an unauthenticated join", async () => {
			const res = await request(app)
				.post(`/api/orgs/${orgA}/join`)
				.send({ userId: outsider.id });
			expect(res.statusCode).toBe(401);
		});

		it("does not let a user add themselves to an org", async () => {
			const res = await request(app)
				.post(`/api/orgs/${orgA}/join`)
				.set(bearer(outsider))
				.send({ userId: outsider.id });
			expect(res.statusCode).toBe(403);
		});

		it("does not let a regular member grant themselves president", async () => {
			const res = await request(app)
				.put(`/api/orgs/${orgA}/users/${propsMember.id}/roles`)
				.set(bearer(propsMember))
				.send({ roles: ["president", "admin"] });
			expect(res.statusCode).toBe(403);
		});

		it("does not let a member remove someone else from the org", async () => {
			const res = await request(app)
				.delete(`/api/orgs/${orgA}/users/${presA.id}`)
				.set(bearer(propsMember));
			expect(res.statusCode).toBe(403);
		});

		it("hides member lists from non-members", async () => {
			const res = await request(app)
				.get(`/api/orgs/${orgA}/users`)
				.set(bearer(outsider));
			expect(res.statusCode).toBe(403);
		});

		it("treats a pending invite as not-yet-a-member", async () => {
			const invitee = await makeUser("invitee");
			await request(app)
				.post(`/api/orgs/${orgA}/invite`)
				.set(bearer(presA))
				.send({ email: invitee.email });

			const before = await request(app)
				.get(`/api/orgs/${orgA}/users`)
				.set(bearer(invitee));
			expect(before.statusCode).toBe(403);

			await request(app)
				.put(`/api/orgs/${orgA}/respond`)
				.set(bearer(invitee))
				.send({ action: "accept" });

			const after = await request(app)
				.get(`/api/orgs/${orgA}/users`)
				.set(bearer(invitee));
			expect(after.statusCode).toBe(200);
		});

		it("still lets a member leave on their own", async () => {
			const leaver = await makeUser("leaver");
			await addActiveOrgMember(orgA, leaver.id);
			const res = await request(app)
				.delete(`/api/orgs/${orgA}/users/${leaver.id}`)
				.set(bearer(leaver));
			expect(res.statusCode).toBe(200);
		});
	});

	describe("Shows", () => {
		it("only adds active org members to a show", async () => {
			const res = await request(app)
				.post(`/api/shows/${showA}/join`)
				.set(bearer(presA))
				.send({ userId: outsider.id });
			expect(res.statusCode).toBe(400);
		});

		it("invites into the show's own org, ignoring orgId in the body", async () => {
			const invitee = await makeUser("show-invitee");
			const res = await request(app)
				.post(`/api/shows/${showA}/invite`)
				.set(bearer(presA))
				.send({ orgId: orgB, email: invitee.email });
			expect(res.statusCode).toBe(201);

			const inB = await models.OrgMembership.findOne({
				where: { org_id: orgB, users_id: invitee.id },
			});
			expect(inB).toBeNull();
			const inA = await models.OrgMembership.findOne({
				where: { org_id: orgA, users_id: invitee.id },
			});
			expect(inA).not.toBeNull();
		});

		it("does not let a show member edit someone else's profile", async () => {
			await request(app)
				.post(`/api/shows/${showA}/join`)
				.set(bearer(presA))
				.send({ userId: propsMember.id });

			const res = await request(app)
				.put(`/api/shows/${showA}/users/${presA.id}/profile`)
				.set(bearer(propsMember))
				.send({ bio: "hacked" });
			expect(res.statusCode).toBe(403);
		});

		it("lets a member edit their own profile but rejects arbitrary photo paths", async () => {
			const ok = await request(app)
				.put(`/api/shows/${showA}/users/${propsMember.id}/profile`)
				.set(bearer(propsMember))
				.send({ bio: "My bio" });
			expect(ok.statusCode).toBe(200);

			const bad = await request(app)
				.put(`/api/shows/${showA}/users/${propsMember.id}/profile`)
				.set(bearer(propsMember))
				.send({ photo_path: "https://evil.example/x.png" });
			expect(bad.statusCode).toBe(400);
		});
	});

	describe("Schedule events", () => {
		it("cannot edit another show's event by swapping the event id", async () => {
			const res = await request(app)
				.put(`/api/schedule/shows/${showA}/${eventB}`)
				.set(bearer(presA))
				.send({ title: "Hijacked" });
			expect(res.statusCode).toBe(404);

			const event = await models.Schedule.findByPk(eventB);
			expect(event.title).toBe("B rehearsal");
		});

		it("cannot delete another org's event through an org route", async () => {
			const res = await request(app)
				.delete(`/api/schedule/orgs/${orgA}/${eventB}`)
				.set(bearer(presA));
			expect(res.statusCode).toBe(404);
			expect(await models.Schedule.findByPk(eventB)).not.toBeNull();
		});

		it("cannot move an event to another show via the request body", async () => {
			const res = await request(app)
				.put(`/api/schedule/shows/${showB}/${eventB}`)
				.set(bearer(presB))
				.send({ title: "Renamed", show_id: showA });
			expect(res.statusCode).toBe(200);
			const event = await models.Schedule.findByPk(eventB);
			expect(event.title).toBe("Renamed");
			expect(event.show_id).toBe(showB);
		});
	});

	describe("Inventory", () => {
		it("cannot pull another org's global item into a show", async () => {
			const res = await request(app)
				.post(`/api/inventory/shows/${showA}/pull/${globalItemB}`)
				.set(bearer(presA));
			expect(res.statusCode).toBe(404);
		});

		it("cannot edit another department's item by claiming your own dept_id", async () => {
			const res = await request(app)
				.put(`/api/inventory/orgs/${orgA}/items/${costumesItemA}`)
				.set(bearer(propsMember))
				.send({ name: "Stolen gown", dept_id: propsDeptId });
			expect(res.statusCode).toBe(403);

			const item = await models.Inventory.findByPk(costumesItemA);
			expect(item.name).toBe("Gown");
			expect(item.dept_id).toBe(costumesDeptId);
		});

		it("cannot delete another department's item", async () => {
			const res = await request(app)
				.delete(`/api/inventory/orgs/${orgA}/items/${costumesItemA}`)
				.set(bearer(propsMember))
				.send({ dept_id: propsDeptId });
			expect(res.statusCode).toBe(403);
		});

		it("can still create items in your own department", async () => {
			const res = await request(app)
				.post(`/api/inventory/orgs/${orgA}`)
				.set(bearer(propsMember))
				.send({
					name: "Sword",
					description: "Foam sword",
					dept_id: propsDeptId,
					org_id: orgB,
					id: 9999,
				});
			expect(res.statusCode).toBe(201);
			// Ownership fields in the body are ignored.
			expect(Number(res.body.data.org_id)).toBe(orgA);
			expect(res.body.data.id).not.toBe(9999);
		});
	});

	describe("Database reset", () => {
		it("is disabled outside unit tests unless ALLOW_DB_RESET=true", async () => {
			const savedVitest = process.env.VITEST;
			const savedAllow = process.env.ALLOW_DB_RESET;
			delete process.env.VITEST;
			delete process.env.ALLOW_DB_RESET;
			try {
				const res = await request(app)
					.post("/api/admin/reset-db")
					.set(bearer(presA));
				expect(res.statusCode).toBe(404);
			} finally {
				process.env.VITEST = savedVitest;
				if (savedAllow !== undefined) process.env.ALLOW_DB_RESET = savedAllow;
			}
		});
	});
});
