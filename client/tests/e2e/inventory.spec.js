import { expect, test } from "@playwright/test";

test.setTimeout(60000);

test.describe("Show Inventory UI", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/login");
		await page.waitForLoadState("networkidle");

		await page.fill('input[placeholder="Email"]', "aidenadzich@gmail.com");
		await page.fill('input[placeholder="Password"]', "password123");
		await page.click('button:has-text("Login")');
		await page.waitForLoadState("networkidle");
		await page.waitForSelector("text=Shawnigan Players", { timeout: 15000 });
	});

	test("should navigate to Santa in Space and view inventory", async ({
		page,
	}) => {
		await page.click("text=Shawnigan Players");
		await page.waitForLoadState("networkidle");

		await expect(page).toHaveURL(/\/orgs\/\d+\/overview/);

		await page.waitForSelector("text=Santa in Space");
		await page.click("text=Santa in Space");
		await page.waitForLoadState("networkidle");

		await page.click("text=Inventory");
		await page.waitForLoadState("networkidle");

		await expect(page.locator("text=ETC Source Four 36°")).toBeVisible();
	});
});
