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
	// NOTE: only the Vite dev server is started here. The backend API
	// (server/, default http://localhost:8050) and its database must already be
	// running; globalSetup re-seeds the database via server/seed.js.
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
