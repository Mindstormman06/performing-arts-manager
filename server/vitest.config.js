/**
 * Vitest configuration for the server tests.
 *
 * @remarks
 * Runs in the Node environment with global test APIs and executes test files
 * one at a time rather than in parallel. V8 coverage is reported as text, JSON
 * and HTML, and the run fails below 80% lines, functions, branches or
 * statements.
 */

import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		fileParallelism: false,
		environment: "node",
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			thresholds: {
				lines: 80,
				functions: 80,
				branches: 80,
				statements: 80,
			},
		},
	},
});
