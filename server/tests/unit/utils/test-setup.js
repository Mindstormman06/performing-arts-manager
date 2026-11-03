import models from "../../../src/models/index.js";
import sequelize from "../../../src/services/db.service.js";

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
		const orgRoles = [
			"admin", // Org - added for tests
			"president", // Org
			"board-member", // Org
			"costumes", // Both
			"props", // Both
			"sets", // Both
			"tech", // Both
		];
		const showRoles = [
			"director", // Show
			"stage-manager", // Show
			"actor", // Show
			"stagehand", // Show
			"costumes", // Both
			"props", // Both
			"sets", // Both
			"tech", // Both
		];

		// Insert each role into the database if it doesn't already exist
		for (const roleName of orgRoles) {
			await models.OrganizationRole.findOrCreate({ where: { name: roleName } });
		}
		for (const roleName of showRoles) {
			await models.ShowRole.findOrCreate({ where: { name: roleName } });
		}

		// Seed departments
		const departments = ["Costumes", "Props", "Sets", "Tech"];
		for (const deptName of departments) {
			await models.Department.findOrCreate({ where: { name: deptName } });
		}
	} catch (error) {
		/* v8 ignore next */ console.error(
			"Unable to connect to the database:",
			error,
		);
	}
};

/**
 * Gracefully closes the database connection after tests finish.
 * Call this in the `afterAll` block.
 */
export const closeDatabase = async () => {
	await sequelize.close();
};

/**
 * Makes a user an active member of an organization, as if they had been
 * invited and accepted. Joining through the API now requires an org admin
 * and leaves the membership pending, so test setup uses this instead.
 */
export const addActiveOrgMember = async (orgId, userId) => {
	const [membership] = await models.OrgMembership.findOrCreate({
		where: { org_id: orgId, users_id: userId },
		defaults: { status: "active" },
	});
	if (membership.status !== "active") {
		await membership.update({ status: "active" });
	}
	return membership;
};
