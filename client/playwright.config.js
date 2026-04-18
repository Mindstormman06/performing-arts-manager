import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	globalSetup: "./tests/e2e/setup.js",

	testDir: "./tests/e2e",
	fullyParallel: false,
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
