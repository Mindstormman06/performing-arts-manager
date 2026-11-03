import { expect, test } from "@playwright/test";
import { loginAs, USERS } from "./setup.js";

// A date ~30 days in the future, formatted as YYYY-MM-DD (local time) for the date input.
const futureDate = () => {
	const d = new Date();
	d.setDate(d.getDate() + 30);
	const pad = (n) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

test.describe("Show Scheduling UI Flow", () => {
	test.beforeEach(async ({ page }) => {
		await loginAs(page, USERS.laura);
		await expect(
			page.getByRole("link", { name: /Shawnigan Players/ }),
		).toBeVisible();
	});

	test("should successfully create a new rehearsal event", async ({ page }) => {
		await page.getByRole("link", { name: /Shawnigan Players/ }).click();
		await expect(page).toHaveURL(/\/orgs\/\d+\/overview/);

		await page.getByRole("link", { name: /Santa in Space/ }).click();
		await expect(page).toHaveURL(/\/orgs\/\d+\/shows\/\d+$/);

		await page.getByRole("link", { name: "Scheduling" }).click();
		await expect(page).toHaveURL(/.*\/scheduling/);

		await page.click('button:has-text("+")');

		await expect(page.locator('h2:has-text("Create Event")')).toBeVisible();

		await page.fill("#create-event-title", "Blocking Act 1");
		await page.fill("#create-event-date", futureDate());
		await page.fill("#create-event-start-time", "18:00");
		await page.fill("#create-event-end-time", "20:30");
		await page.fill("#create-event-location", "Rehearsal Hall");

		await page.locator('button:has-text("Create Event")').click();

		await expect(page.locator('h2:has-text("Create Event")')).not.toBeVisible();

		// Switch to list view to see the event title
		await page.getByRole("button", { name: "Event List" }).click();

		await expect(page.getByText("Blocking Act 1")).toBeVisible();

		await expect(page.getByText("📍 Rehearsal Hall")).toBeVisible();
	});
});
