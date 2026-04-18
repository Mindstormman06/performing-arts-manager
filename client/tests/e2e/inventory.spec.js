import { expect, test } from "@playwright/test";

test.describe("Show Inventory UI", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/login");
		await page.fill('input[placeholder="Email"]', "sarah@example.com");
		await page.fill('input[placeholder="Password"]', "password123");
		await page.click('button:has-text("Login")');
	});

	test("should navigate to Rock of Ages and view inventory", async ({
		page,
	}) => {
		await page.click("text=Cowichan Valley Players");

		await expect(page).toHaveURL(/\/orgs\/\d+\/overview/);

		await page.click("text=Rock of Ages");

		await page.click("text=Inventory");

		await expect(page.locator("text=Fake Electric Guitar")).toBeVisible();
	});
});
