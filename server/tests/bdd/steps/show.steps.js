import assert from "node:assert";

import { Then, When } from "@cucumber/cucumber";
import request from "supertest";

import app from "../../../server.js";

// ----------------------------------------------------------------
// WHEN STEPS
// ----------------------------------------------------------------

When(
	"they attempt to create a new show titled {string} for the organization",
	async function (showTitle) {
		// Generate valid ISO dates for the database (Starting tomorrow, running for 30 days)
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
				organization_id: 1, // Cowichan Valley Players
			});
	},
);

// ----------------------------------------------------------------
// THEN STEPS (Asserting the responses)
// ----------------------------------------------------------------

Then("the new show should be saved successfully", function () {
	const responseData = this.lastResponse.body.data || this.lastResponse.body;

	assert.ok(
		responseData.id,
		"Expected the database to return the newly created show ID",
	);
});
