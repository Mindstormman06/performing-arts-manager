import { test, expect } from '@playwright/test';

test.describe('Show Scheduling UI Flow', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.fill('input[placeholder="Email"]', 'sarah@example.com');
        await page.fill('input[placeholder="Password"]', 'password123');
        await page.click('button:has-text("Login")');
    });

    test('should successfully create a new rehearsal event', async ({ page }) => {
        await page.click('text=Cowichan Valley Players');
        await page.click('text=Rock of Ages');

        await page.click('text=Scheduling');
        await expect(page).toHaveURL(/.*\/scheduling/);

        await page.click('button:has-text("+")');

        await expect(page.locator('h2:has-text("Create Event")')).toBeVisible();

        await page.fill('#create-event-title', 'Blocking Act 1');
        await page.fill('#create-event-date', '2026-12-01');
        await page.fill('#create-event-start-time', '18:00');
        await page.fill('#create-event-end-time', '20:30');
        await page.fill('#create-event-location', 'Rehearsal Hall');

        await page.locator('button:has-text("Create Event")').click();

        await expect(page.locator('h2:has-text("Create Event")')).not.toBeVisible();
        await expect(page.locator('text=Blocking Act 1')).toBeVisible();

        await expect(page.locator('text=📍 Rehearsal Hall')).toBeVisible();
    });
});