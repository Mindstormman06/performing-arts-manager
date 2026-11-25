/**
 * Unit tests for the Express config's `API_PORT` handling.
 *
 * @remarks
 * Needs no database. Each test edits `process.env` and imports
 * `express.config.js` with a distinct query string so a fresh copy of the
 * module reads the env; the original env is restored after the suite. Uses
 * Vitest globals instead of imports.
 */

describe("Express Config Coverage", () => {
	const originalEnv = { ...process.env };

	beforeEach(() => {
		vi.resetModules();
		process.env = { ...originalEnv };
	});

	afterAll(() => {
		process.env = originalEnv;
	});

	it("should use the port from process.env if available", async () => {
		process.env.API_PORT = "8080";
		const { expressConfig } = await import(
			`../../src/config/express.config.js?cache=1`
		);

		expect(expressConfig.port).toBe("8080");
	});

	it("should default to 5000 if API_PORT is missing", async () => {
		delete process.env.API_PORT;
		const { expressConfig } = await import(
			`../../src/config/express.config.js?cache=2`
		);

		expect(expressConfig.port).toBe(5000);
	});
});
