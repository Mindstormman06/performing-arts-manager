import models from "../models/index.js";
import sequelize from "../services/db.service.js";

const resetDb = async (_req, res) => {
	const t = await sequelize.transaction();

	try {
		// Force sync to drop and recreate tables
		await sequelize.sync({ force: true, transaction: t });
		console.log("Database reset complete!");

		// Seed organization/show roles instead of generic Role model
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

		// ensure org roles
		await Promise.all(
			orgRoles.map((roleName) =>
				OrganizationRole.findOrCreate({
					where: { name: roleName },
					transaction: t,
				}),
			),
		);

		// ensure show roles
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
			error: error.message,
		});
	}
};

export default { resetDb };
