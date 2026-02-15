import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../server.js";

describe("Server Core & Error Handling", () => {
	// Check if the base server is responding correctly
	it("Server should be up and running", async () => {
		const res = await request(app).get("/server-up");
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty("message", "ok");
	});

	// Ensure the app catches unregistered routes and returns a standard 404
	it("Should return 404 for unknown routes", async () => {
		const res = await request(app).get("/unknown-route");
		expect(res.statusCode).toEqual(404);
	});

	// Test the global error handler using an intentional crash route
	it("Should handle server errors gracefully", async () => {
		const res = await request(app).get("/crash-test");
		expect(res.statusCode).toEqual(500);
		expect(res.body).toHaveProperty(
			"message",
			"Intentional crash for testing error handling",
		);
	});

	// Test fallback error handling when no specific error message is provided
	it("Should fallback to 500 and default message when error is empty", async () => {
		const res = await request(app).get("/crash-test-minimal");
		expect(res.statusCode).toEqual(500);
		expect(res.body.message).toBe("Internal server error");
	});
});
