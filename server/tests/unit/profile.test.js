import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";

import app from "../../server.js";
import models from "../../src/models/index.js";

dotenv.config();

describe("ShowMembership Profile API", () => {
	let authToken;
	let userId;
	let showId;

	beforeAll(async () => {
		// Find or create a user
		const [user] = await models.User.findOrCreate({
			where: { email: "profile-test@example.com" },
			defaults: { fname: "Profile", lname: "Test", passwordHash: "hashed" },
		});
		userId = user.id;

		// Find or create a show
		const [show] = await models.Show.findOrCreate({
			where: { title: "Profile Test Show" },
			defaults: { start_date: new Date(), end_date: new Date() },
		});
		showId = show.id;

		// Create membership
		await models.ShowMembership.findOrCreate({
			where: { show_id: showId, users_id: userId },
			defaults: { status: "active" },
		});

		// Create token
		authToken = jwt.sign(
			{ id: userId, email: user.email },
			process.env.JWT_SECRET || "your_theatre_secret",
		);
	});

	it("should update show-specific bio", async () => {
		const res = await request(app)
			.put(`/api/shows/${showId}/users/${userId}/profile`)
			.set("Authorization", `Bearer ${authToken}`)
			.send({ bio: "This is my show-specific bio!" });

		expect(res.statusCode).toEqual(200);
		expect(res.body.success).toBe(true);
		expect(res.body.data.bio).toEqual("This is my show-specific bio!");

		// Verify in DB
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

		// Verify in DB
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
		// The client expects data to be in res.data.data or res.data
		const data = res.body.data || res.body;
		expect(data.bio).toEqual("This is my show-specific bio!");
		expect(data).toHaveProperty("photo_path");
	});

	// Note: Testing file upload with supertest is possible but might be complex with the current setup.
	// Let's at least test the bio update which confirms the route and service work.
});
