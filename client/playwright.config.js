/**
 * The Playwright end-to-end test configuration.
 *
 * @remarks
 * Runs `tests/e2e` serially in Desktop Chrome against `localhost:5173`,
 * starting the Vite dev server (or reusing one already running). Only the
 * client is started: the backend API (`server/`, default port 8050) and its
 * database must already be running. `globalSetup` re-seeds that database via
 * `server/seed.js` before the run. Retries once when `CI` is set.
 */

import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	globalSetup: "./tests/e2e/setup.js",

	testDir: "./tests/e2e",
	fullyParallel: false,
	// One retry on CI so that `trace: "on-first-retry"` actually records traces.
	// eslint-disable-next-line no-undef
	retries: process.env.CI ? 1 : 0,
	reporter: "html",
	use: {
		baseURL: "http://localhost:5173",
		trace: "on-first-retry",
	},
	webServer: [
		{
			command: "npm run dev",
			url: "http://localhost:5173",
			reuseExistingServer: true,
			cwd: "./",
		},
	],
	projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
