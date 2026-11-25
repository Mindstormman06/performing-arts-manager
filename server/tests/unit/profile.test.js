/**
 * Integration tests for the show-specific profile routes (bio, photo path and
 * profile fetch) on a show membership.
 *
 * @remarks
 * Needs the live MySQL test DB with tables already created: it does not call
 * `setupTestDatabase`, so it relies on an earlier suite or the seed having
 * synced the schema. Loads `.env` via dotenv, find-or-creates its own user,
 * org, active memberships and show, and signs a JWT directly. The fetch test
 * expects the bio written by the first test.
 */

import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";

import app from "../../server.js";
import { JWT_SECRET } from "../../src/config/jwt.config.js";
import models from "../../src/models/index.js";

dotenv.config();

describe("ShowMembership Profile API", () => {
	let authToken;
	let userId;
	let showId;

	beforeAll(async () => {
		const [user] = await models.User.findOrCreate({
			where: { email: "profile-test@example.com" },
			defaults: { fname: "Profile", lname: "Test", passwordHash: "hashed" },
		});
		userId = user.id;

		// Show access requires an active membership in the show's org
		const [org] = await models.Organization.findOrCreate({
			where: { name: "Profile Test Org" },
		});
		await models.OrgMembership.findOrCreate({
			where: { org_id: org.id, users_id: userId },
			defaults: { status: "active" },
		});

		const [show] = await models.Show.findOrCreate({
			where: { title: "Profile Test Show" },
			defaults: {
				start_date: new Date(),
				end_date: new Date(),
				organization_id: org.id,
			},
		});
		showId = show.id;

		await models.ShowMembership.findOrCreate({
			where: { show_id: showId, users_id: userId },
			defaults: { status: "active" },
		});

		authToken = jwt.sign({ id: userId, email: user.email }, JWT_SECRET);
	});

	it("should update show-specific bio", async () => {
		const res = await request(app)
			.put(`/api/shows/${showId}/users/${userId}/profile`)
			.set("Authorization", `Bearer ${authToken}`)
			.send({ bio: "This is my show-specific bio!" });

		expect(res.statusCode).toEqual(200);
		expect(res.body.success).toBe(true);
		expect(res.body.data.bio).toEqual("This is my show-specific bio!");

		const membership = await models.ShowMembership.findOne({
			where: { show_id: showId, users_id: userId },
		});
		expect(membership.bio).toEqual("This is my show-specific bio!");
	});

	it("should update show-specific photo path", async () => {
		const res = await request(app)
			.put(`/api/shows/${showId}/users/${userId}/profile`)
			.set("Authorization", `Bearer ${authToken}`)
			.send({ photo_path: "uploads/profiles/test-photo.jpg" });

		expect(res.statusCode).toEqual(200);
		expect(res.body.success).toBe(true);
		expect(res.body.data.photo_path).toEqual("uploads/profiles/test-photo.jpg");

		const membership = await models.ShowMembership.findOne({
			where: { show_id: showId, users_id: userId },
		});
		expect(membership.photo_path).toEqual("uploads/profiles/test-photo.jpg");
	});

	it("should fetch the show-specific profile", async () => {
		const res = await request(app)
			.get(`/api/shows/${showId}/users/${userId}`)
			.set("Authorization", `Bearer ${authToken}`);

		expect(res.statusCode).toEqual(200);
		// The profile may come back wrapped in `data` or as the body itself.
		const data = res.body.data || res.body;
		expect(data.bio).toEqual("This is my show-specific bio!");
		expect(data).toHaveProperty("photo_path");
	});
});
