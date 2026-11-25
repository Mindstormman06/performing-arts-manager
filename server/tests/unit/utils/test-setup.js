/**
 * Shared database helpers for the unit test suites.
 *
 * @remarks
 * Exports `setupTestDatabase`, which connects to the MySQL database named by
 * the `DB_*` env vars, drops and recreates every table with
 * `sequelize.sync({ force: true })`, and seeds the org roles, show roles and
 * departments the services expect. It is destructive, so `DB_NAME` must point
 * at a throwaway test database; connection errors are logged, not thrown.
 * Also exports `closeDatabase` for `afterAll`, and `addActiveOrgMember`, which
 * writes an active `OrgMembership` row directly because joining through the
 * API needs an org admin and leaves the membership pending.
 */

import models from "../../../src/models/index.js";
import sequelize from "../../../src/services/db.service.js";

export const setupTestDatabase = async () => {
	try {
		await sequelize.authenticate();
		await sequelize.sync({ force: true });

		// "admin" is not seeded in production; the tests use it as an org role.
		const orgRoles = [
			"admin",
			"president",
			"board-member",
			"costumes",
			"props",
			"sets",
			"tech",
		];
		const showRoles = [
			"director",
			"stage-manager",
			"actor",
			"stagehand",
			"costumes",
			"props",
			"sets",
			"tech",
		];

		for (const roleName of orgRoles) {
			await models.OrganizationRole.findOrCreate({ where: { name: roleName } });
		}
		for (const roleName of showRoles) {
			await models.ShowRole.findOrCreate({ where: { name: roleName } });
		}

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

export const closeDatabase = async () => {
	await sequelize.close();
};

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
