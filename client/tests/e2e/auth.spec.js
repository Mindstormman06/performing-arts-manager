/**
 * End-to-end tests for logging in through the UI.
 *
 * @remarks
 * Covers a successful login as the seeded president (landing on
 * `/organizations` with Shawnigan Players listed) and the error message shown
 * for bad credentials. Needs the backend API and its database running, seeded
 * by the global setup.
 */

import { expect, test } from "@playwright/test";
import { loginAs, USERS } from "./setup.js";

test.describe("Authentication Flow", () => {
	test("should log in successfully as the President", async ({ page }) => {
		await loginAs(page, USERS.bill);
		await expect(page).toHaveURL("/organizations");

		await expect(
			page.getByRole("heading", { name: "Your Organizations" }),
		).toBeVisible();

		await expect(
			page.getByRole("link", { name: /Shawnigan Players/ }),
		).toBeVisible();
	});

	test("should show an error message on failed login", async ({ page }) => {
		await page.goto("/login");
		await page.getByPlaceholder("Email").fill("wrong@example.com");
		await page.getByPlaceholder("Password").fill("wrongpassword");
		await page.getByRole("button", { name: "Login", exact: true }).click();

		const errorMsg = page.locator("p.text-red-500");
		await expect(errorMsg).toBeVisible();
	});
});
