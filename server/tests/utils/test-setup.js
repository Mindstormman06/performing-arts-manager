import models from "../../src/models/index.js";
import sequelize from "../../src/services/db.service.js";

/**
 * Prepares the database for testing.
 * This drops existing tables, recreates them, and seeds required roles.
 * It should be called in the `beforeAll` block of any test file that hits the DB.
 */
export const setupTestDatabase = async () => {
	try {
		// Verify connection to the database
		await sequelize.authenticate();
		// Force sync drops all tables and recreates them to ensure a clean slate
		await sequelize.sync({ force: true });

		// Seed all required roles necessary for the multi-tenant logic
		const roles = [
			"admin",
			"president",
			"actor",
			"lead",
			"director",
			"stage-manager",
		];
		
		// Insert each role into the database if it doesn't already exist
		for (const roleName of roles) {
			await models.Role.findOrCreate({ where: { name: roleName } });
		}
	} catch (error) {
		/* v8 ignore next */ console.error("Unable to connect to the database:", error);
	}
};

/**
 * Gracefully closes the database connection after tests finish.
 * Call this in the `afterAll` block.
 */
export const closeDatabase = async () => {
	await sequelize.close();
};