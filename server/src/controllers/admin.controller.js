/**
 * Express controller for destructive database maintenance.
 *
 * @remarks
 * Exports `resetDb`, which drops and recreates every table with
 * `sequelize.sync({ force: true })` and then seeds the fixed OrganizationRole
 * and ShowRole names in a transaction, using the models directly rather than a
 * service. The drop and recreate is MySQL DDL and can't be rolled back, so a
 * failed reset may leave empty tables; running the reset again recovers. Any
 * error responds 500. The admin route only enables it outside production when
 * `ALLOW_DB_RESET=true`, or under Vitest.
 */

import models from "../models/index.js";
import sequelize from "../services/db.service.js";

const resetDb = async (_req, res) => {
	let t;

	try {
		await sequelize.sync({ force: true });
		console.log("Database reset complete!");

		t = await sequelize.transaction();

		const { OrganizationRole, ShowRole } = models;
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

		await Promise.all(
			orgRoles.map((roleName) =>
				OrganizationRole.findOrCreate({
					where: { name: roleName },
					transaction: t,
				}),
			),
		);

		await Promise.all(
			showRoles.map((roleName) =>
				ShowRole.findOrCreate({
					where: { name: roleName },
					transaction: t,
				}),
			),
		);

		await t.commit();

		console.log("Roles seeding complete");

		res.json({
			success: true,
			message: "Database reset and seeded successfully.",
		});
	} catch (error) {
		await t?.rollback();
		console.error("Error resetting database:", error);
		res.status(500).json({
			success: false,
			message: "Failed to reset database.",
		});
	}
};

export default { resetDb };
