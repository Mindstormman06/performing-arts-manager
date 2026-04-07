import assert from "node:assert";
import { Given, Then } from "@cucumber/cucumber";
import request from "supertest";

import app from "../../../server.js";

// ----------------------------------------------------------------
// GIVEN STEPS
// ----------------------------------------------------------------

Given("the user {string} is logged in", async function (email) {
	const res = await request(app)
		.post("/api/auth/login")
		.send({ email, password: "password123" });

	this.currentToken = res.body.token;
});

Given("they have the {string} role", (_role) => {
	// No action needed, seed data gives them the correct role
});

Given("no user is logged in", function () {
	this.currentToken = "";
});

// ----------------------------------------------------------------
// THEN STEPS (Asserting the responses)
// ----------------------------------------------------------------

Then("the API should return a {string} status", function (statusString) {
	const expectedStatus = parseInt(statusString.split(" ")[0], 10);
	assert.strictEqual(this.lastResponse.status, expectedStatus);
});
