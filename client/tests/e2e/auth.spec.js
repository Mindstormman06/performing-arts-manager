import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {

    test('should log in successfully as the President', async ({ page }) => {
        await page.goto('/login');

        await page.fill('input[placeholder="Email"]', 'sarah@example.com');
        await page.fill('input[placeholder="Password"]', 'password123');

        await page.click('button:has-text("Login")');

        await expect(page).toHaveURL('/organizations');

        const header = page.locator('h2:has-text("Your Organizations")');
        await expect(header).toBeVisible();

        await expect(page.locator('text=Cowichan Valley Players')).toBeVisible();
    });

    test('should show an error message on failed login', async ({ page }) => {
        await page.goto('/login');
        await page.fill('input[placeholder="Email"]', 'wrong@example.com');
        await page.fill('input[placeholder="Password"]', 'wrongpassword');
        await page.click('button:has-text("Login")');

        // Checks the error paragraph in Login.jsx
        const errorMsg = page.locator('p.text-red-500');
        await expect(errorMsg).toBeVisible();
    });
});