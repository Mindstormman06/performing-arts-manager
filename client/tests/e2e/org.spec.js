import { expect, test } from "@playwright/test";

test.setTimeout(60000);

test("should open the Create Organization modal", async ({ page }) => {
	await page.goto("/login");
	await page.waitForLoadState("networkidle");

	await page.fill('input[placeholder="Email"]', "levitybill@gmail.com");
	await page.fill('input[placeholder="Password"]', "password123");
	await page.click('button:has-text("Login")');

	await page.waitForLoadState("networkidle");
	await page.waitForSelector('button:has-text("+ New Organization")', { timeout: 10000 });
	await page.click('button:has-text("+ New Organization")');

	const modalHeading = page.locator("text=Create New Organization");
	await expect(modalHeading).toBeVisible();
});
