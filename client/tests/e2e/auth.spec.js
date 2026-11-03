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

		// Checks the error paragraph in Login.jsx
		const errorMsg = page.locator("p.text-red-500");
		await expect(errorMsg).toBeVisible();
	});
});
