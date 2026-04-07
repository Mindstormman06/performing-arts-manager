import { expect, test } from "@playwright/test";

test("should open the Create Organization modal", async ({ page }) => {
	await page.goto("/login");
	await page.fill('input[placeholder="Email"]', "sarah@example.com");
	await page.fill('input[placeholder="Password"]', "password123");
	await page.click('button:has-text("Login")');

	await page.click('button:has-text("+ New Organization")');

	const modalHeading = page.locator("text=Create New Organization");
	await expect(modalHeading).toBeVisible();
});
