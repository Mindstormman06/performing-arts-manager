/**
 * Cucumber step definitions for the show management feature: creating a show
 * in organization 1 and checking that it was saved.
 *
 * @remarks
 * Needs the live MySQL DB filled by `seed.js`, which creates organization 1.
 * The When step sends `this.currentToken` from the shared login step, creates
 * a show starting tomorrow (a DB write on success), and stores the response
 * in `this.lastResponse` for the Then steps.
 */

import assert from "node:assert";

import { Then, When } from "@cucumber/cucumber";
import request from "supertest";

import app from "../../../server.js";

When(
	"they attempt to create a new show titled {string} for the organization",
	async function (showTitle) {
		const startDate = new Date();
		startDate.setDate(startDate.getDate() + 1);

		const endDate = new Date();
		endDate.setDate(endDate.getDate() + 30);

		this.lastResponse = await request(app)
			.post("/api/shows/")
			.set("Authorization", `Bearer ${this.currentToken}`)
			.send({
				title: showTitle,
				start_date: startDate.toISOString(),
				end_date: endDate.toISOString(),
				organization_id: 1,
			});
	},
);

Then("the new show should be saved successfully", function () {
	const responseData = this.lastResponse.body.data || this.lastResponse.body;

	assert.ok(
		responseData.id,
		"Expected the database to return the newly created show ID",
	);
});
