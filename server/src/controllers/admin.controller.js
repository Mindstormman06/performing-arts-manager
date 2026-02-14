import models from "../models/index.js";
import sequelize from "../services/db.service.js";

const resetDb = async (_req, res) => {
	const t = await sequelize.transaction();

	try {
		// Force sync to drop and recreate tables
		await sequelize.sync({ force: true, transaction: t });
		console.log("Database reset complete!");

		// Seed roles
		const { Role } = models;
		const roles = [
			"admin",
			"president",
			"board-member",
			"costumes",
			"props",
			"sets",
			"tech",
			"director",
			"stage-manager",
			"actor",
			"stagehand",
			"lead",
		];

		await Promise.all(
			roles.map((roleName) =>
				Role.findOrCreate({
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
