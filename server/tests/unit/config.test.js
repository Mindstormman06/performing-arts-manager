/**
 * Unit tests for the database config's env-var defaults.
 *
 * @remarks
 * Needs no database. Each test edits `process.env`, resets the module cache
 * and re-imports `database.config.js` so the new env is read; the original
 * env is restored after the suite. Uses Vitest globals instead of imports.
 */

describe("Database Configuration Coverage", () => {
	const originalEnv = process.env;

	beforeEach(() => {
		// Without a module reset, the config keeps the env read at first import.
		vi.resetModules();
		process.env = { ...originalEnv };
	});

	afterAll(() => {
		process.env = originalEnv;
	});

	it("should use default values when environment variables are missing", async () => {
		delete process.env.DB_USER;
		delete process.env.DB_PASSWORD;
		delete process.env.DB_PORT;

		const { databaseConfig } = await import(
			"../../src/config/database.config.js"
		);

		expect(databaseConfig.username).toBe("root");
		expect(databaseConfig.port).toBe(3306);
	});

	it("should use provided environment variables", async () => {
		process.env.DB_USER = "testuser";
		process.env.DB_PORT = "9999";

		const { databaseConfig } = await import(
			"../../src/config/database.config.js"
		);

		expect(databaseConfig.username).toBe("testuser");
		expect(databaseConfig.port).toBe("9999");
	});
});
