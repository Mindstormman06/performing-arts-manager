/**
 * End-to-end test for opening the Create Organization modal.
 *
 * @remarks
 * Logs in as the seeded user Bill and checks that the New Organization button
 * opens the modal; nothing is submitted. Needs the backend API and its
 * database running, seeded by the global setup.
 */

import { expect, test } from "@playwright/test";
import { loginAs, USERS } from "./setup.js";

test.setTimeout(60000);

test("should open the Create Organization modal", async ({ page }) => {
	await loginAs(page, USERS.bill);

	const newOrgButton = page.getByRole("button", {
		name: "+ New Organization",
	});
	await expect(newOrgButton).toBeVisible({ timeout: 10000 });
	await newOrgButton.click();

	const modalHeading = page.getByText("Create New Organization");
	await expect(modalHeading).toBeVisible();
});
