/**
 * Cucumber step definitions shared by every feature: logging in, clearing the
 * session, and asserting the response status.
 *
 * @remarks
 * Needs the live MySQL DB filled by `seed.js` (which `npm run test:bdd` runs
 * first); users log in with the seeded password `password123`. Steps share
 * state through the Cucumber World: `this.currentToken` is set here for later
 * requests, and `this.lastResponse` must be set by a When step before the
 * status assertion.
 */

import assert from "node:assert";

import { Given, Then } from "@cucumber/cucumber";
import request from "supertest";

import app from "../../../server.js";

Given("the user {string} is logged in", async function (email) {
	const res = await request(app)
		.post("/api/auth/login")
		.send({ email, password: "password123" });

	this.currentToken = res.body.token;
});

Given("they have the {string} role", (_role) => {
	// Nothing to do: the seed data already gives the user this role.
});

Given("no user is logged in", function () {
	this.currentToken = "";
});

Then("the API should return a {string} status", function (statusString) {
	const expectedStatus = parseInt(statusString.split(" ")[0], 10);
	assert.strictEqual(this.lastResponse.status, expectedStatus);
});
