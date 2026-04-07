import assert from "node:assert";

import { Given, Then, When } from "@cucumber/cucumber";
import request from "supertest";

import app from "../../../server.js";

// ----------------------------------------------------------------
// GIVEN STEPS
// ----------------------------------------------------------------

Given("a schedule event with ID {int} exists for Rock of Ages", (_eventId) => {
	// No action needed, ID will be created
});

// ----------------------------------------------------------------
// WHEN STEPS
// ----------------------------------------------------------------

When(
	"they attempt to create a {string} event for Rock of Ages on {string} from {string} to {string}",
	async function (title, date, startTime, endTime) {
		this.lastResponse = await request(app)
			.post("/api/schedule/shows/1")
			.set("Authorization", `Bearer ${this.currentToken}`)
			.send({
				title: title,
				start_time: `${date}T${startTime}:00Z`,
				end_time: `${date}T${endTime}:00Z`,
			});
	},
);

When(
	"they assigned user ID {int} to event ID {int}",
	async function (userId, eventId) {
		this.lastResponse = await request(app)
			.post(`/api/schedule/shows/1/${eventId}/users`)
			.set("Authorization", `Bearer ${this.currentToken}`)
			.send({ userIds: [userId] });
	},
);

When(
	"they attempt to delete the schedule event with ID {int} for Rock of Ages",
	async function (eventId) {
		this.lastResponse = await request(app)
			.delete(`/api/schedule/shows/1/${eventId}`)
			.set("Authorization", `Bearer ${this.currentToken}`);
	},
);

// ----------------------------------------------------------------
// THEN STEPS (Asserting the responses)
// ----------------------------------------------------------------

Then("the event should be saved successfully", function () {
	assert.strictEqual(this.lastResponse.body.success, true);
	assert.ok(
		this.lastResponse.body.data.id,
		"Expected the database to return the newly created event ID",
	);
});

Then("the response should contain the assigned user data", function () {
	assert.strictEqual(this.lastResponse.body.success, true);
	assert.ok(
		Array.isArray(this.lastResponse.body.data),
		"Expected the data payload to be an array of assigned users",
	);
});
