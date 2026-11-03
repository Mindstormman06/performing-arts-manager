import { execSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function globalSetup() {
	console.log("🚀 Starting Global Setup: Seeding Database...");
	try {
		const serverPath = resolve(__dirname, "../../../server");
		execSync("node seed.js", {
			cwd: serverPath,
			stdio: "inherit",
			// eslint-disable-next-line no-undef
			env: { ...process.env, NODE_ENV: "test" },
		});
		console.log("✅ Global Setup Complete: Database is ready.");
	} catch (error) {
		console.error("❌ Global Setup Failed:", error);
		// eslint-disable-next-line no-undef
		process.exit(1);
	}
}

export default globalSetup;

// Seeded test users (see server/seed.js).
export const USERS = {
	bill: "bill.levity@example.com",
	laura: "laura.gibson@example.com",
	lily: "lily.parker@example.com",
};
export const DEFAULT_PASSWORD = "password123";

/**
 * Shared login helper: logs in through the UI and waits until the
 * organizations dashboard has loaded.
 */
export async function loginAs(page, email, password = DEFAULT_PASSWORD) {
	await page.goto("/login");
	await page.getByPlaceholder("Email").fill(email);
	await page.getByPlaceholder("Password").fill(password);
	await page.getByRole("button", { name: "Login", exact: true }).click();
	await page.waitForURL(/\/organizations/, { timeout: 15000 });
}
