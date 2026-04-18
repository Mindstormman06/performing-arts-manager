import { expect, test } from "@playwright/test";

test.describe("Authentication Flow", () => {
	test("should log in successfully as the President", async ({ page }) => {
		await page.goto("/login");
		await page.waitForLoadState("networkidle");

		// Log to check for any error messages on login page
		const initialError = page.locator("p.text-red-500");
		const errorVisible = await initialError.isVisible().catch(() => false);
		if (errorVisible) {
			const errorText = await initialError.textContent();
			console.log("Initial error:", errorText);
		}

		await page.fill('input[placeholder="Email"]', "levitybill@gmail.com");
		await page.fill('input[placeholder="Password"]', "password123");

		await page.click('button:has-text("Login")');

		// Wait for navigation to /organizations after successful login
		await page.waitForURL(/\/organizations/, { timeout: 10000 });
		await expect(page).toHaveURL("/organizations");

		const header = page.locator('h1:has-text("Your Organizations")');
		await expect(header).toBeVisible();

		await expect(page.locator("text=Shawnigan Players")).toBeVisible();
	});

	test("should show an error message on failed login", async ({ page }) => {
		await page.goto("/login");
		await page.fill('input[placeholder="Email"]', "wrong@example.com");
		await page.fill('input[placeholder="Password"]', "wrongpassword");
		await page.click('button:has-text("Login")');

		// Checks the error paragraph in Login.jsx
		const errorMsg = page.locator("p.text-red-500");
		await expect(errorMsg).toBeVisible();
	});
});
