import { Given, Then, When } from '@cucumber/cucumber';
import assert from "assert";
import request from "supertest";

import app from '../../../server.js';


// ----------------------------------------------------------------
// GIVEN STEPS
// ----------------------------------------------------------------

Given('an inventory item with ID {int} exists', function (itemId) {
	// No action needed, ID will be created by seed data
});

// ----------------------------------------------------------------
// WHEN STEPS
// ----------------------------------------------------------------

When('they request the show inventory for Rock of Ages', async function () {
	this.lastResponse = await request(app)
		.get('/api/inventory/shows/1')
		.set('Authorization', `Bearer ${this.currentToken}`);
});

When('they attempt to add a {string} to the {string} department in the show inventory', async function (itemName, department) {
    const deptIdMap = { "Lighting": 1, "Tech": 2, "Costumes": 3, "Props": 4, "Scenic": 5, "Front of House": 6 };
    const mappedId = deptIdMap[department] || 1;

    this.lastResponse = await request(app)
		.post('/api/inventory/shows/1')
		.set('Authorization', `Bearer ${this.currentToken}`)
		.send({
			name: itemName,
			dept_id: mappedId,
			description: 'Test item'
		});
});

When('they pull inventory item ID {int} for Rock of Ages', async function (inventoryId) {
	this.lastResponse = await request(app)
		.post(`/api/inventory/shows/1/pull/${inventoryId}`)
		.set('Authorization', `Bearer ${this.currentToken}`);
});

// ----------------------------------------------------------------
// THEN STEPS (Asserting the responses)
// ----------------------------------------------------------------

Then('the response should contain a list of inventory items', function () {
    const responseData = this.lastResponse.body.data || this.lastResponse.body;

    assert.ok(Array.isArray(responseData), "Expected the response to contain an array of inventory items");
})

Then('the item should be saved successfully', function () {
	assert.strictEqual(this.lastResponse.body.success, true);
	assert.ok(this.lastResponse.body.data.id, "Expected the database to return the newly created item ID");
	assert.ok(this.lastResponse.body.data.name, "Expected the item to have a name");
});
