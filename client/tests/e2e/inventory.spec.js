import { expect, test } from "@playwright/test";
import { loginAs, USERS } from "./setup.js";

test.setTimeout(60000);

test.describe("Show Inventory UI", () => {
	test.beforeEach(async ({ page }) => {
		await loginAs(page, USERS.laura);
		await expect(
			page.getByRole("link", { name: /Shawnigan Players/ }),
		).toBeVisible({ timeout: 15000 });
	});

	test("should navigate to Santa in Space and view inventory", async ({
		page,
	}) => {
		await page.getByRole("link", { name: /Shawnigan Players/ }).click();
		await expect(page).toHaveURL(/\/orgs\/\d+\/overview/);

		await page.getByRole("link", { name: /Santa in Space/ }).click();
		await expect(page).toHaveURL(/\/orgs\/\d+\/shows\/\d+$/);

		await page.getByRole("link", { name: "Inventory" }).click();
		await expect(page).toHaveURL(/\/inventory$/);

		await expect(page.getByText("ETC Source Four 36°")).toBeVisible();
	});
});
