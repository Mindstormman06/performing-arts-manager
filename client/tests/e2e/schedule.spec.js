import { expect, test } from "@playwright/test";

test.describe("Show Scheduling UI Flow", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/login");
		await page.waitForLoadState("networkidle");

		await page.fill('input[placeholder="Email"]', "aidenadzich@gmail.com");
		await page.fill('input[placeholder="Password"]', "password123");
		await page.click('button:has-text("Login")');
		await page.waitForLoadState("networkidle");
		await page.waitForSelector("text=Shawnigan Players");
	});

	test("should successfully create a new rehearsal event", async ({ page }) => {
		await page.click("text=Shawnigan Players");
		await page.waitForLoadState("networkidle");

		await page.click("text=Santa in Space");
		await page.waitForLoadState("networkidle");

		await page.click("text=Scheduling");
		await expect(page).toHaveURL(/.*\/scheduling/);

		await page.click('button:has-text("+")');

		await expect(page.locator('h2:has-text("Create Event")')).toBeVisible();

		await page.fill("#create-event-title", "Blocking Act 1");
		await page.fill("#create-event-date", "2026-12-01");
		await page.fill("#create-event-start-time", "18:00");
		await page.fill("#create-event-end-time", "20:30");
		await page.fill("#create-event-location", "Rehearsal Hall");

		await page.locator('button:has-text("Create Event")').click();

		await expect(page.locator('h2:has-text("Create Event")')).not.toBeVisible();

		// Switch to list view to see the event title
		await page.click('button:has-text("Event List")');
		await page.waitForLoadState("networkidle");

		await expect(page.locator("text=Blocking Act 1")).toBeVisible();

		await expect(page.locator("text=📍 Rehearsal Hall")).toBeVisible();
	});
});
