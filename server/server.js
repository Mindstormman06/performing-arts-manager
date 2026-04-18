import cors from "cors";
import express from "express";

import { expressConfig } from "./src/config/index.js";
import models from "./src/models/index.js";
import adminRouter from "./src/routes/admin.route.js";
import authRouter from "./src/routes/auth.route.js";
import inventoryRouter from "./src/routes/inventory.route.js";
import organzationRouter from "./src/routes/organization.route.js";
import scheduleRouter from "./src/routes/schedule.route.js";
import showRouter from "./src/routes/show.route.js";
import userRouter from "./src/routes/user.route.js";
import sequelize from "./src/services/db.service.js";

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

/* v8 ignore start */
if (process.env.NODE_ENV !== "test") {
	sequelize
		.sync({ alter: true })
		.then(() => console.log("Database synchronized!"))
		// .then(() => {
		// 	seedRoles();
		// 	seedDepartments();
		// })
		.catch((err) => console.error("Error syncing database:", err));

	const seedRoles = async () => {
		const { OrganizationRole, ShowRole } = models;
		const orgRoles = [
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

		for (const roleName of orgRoles) {
			const [created] = await OrganizationRole.findOrCreate({ where: { name: roleName } });
			if (created) {
				console.log(`Created organization role: ${roleName}`);
			}
		}
		for (const roleName of showRoles) {
			const [created] = await ShowRole.findOrCreate({ where: { name: roleName } });
			if (created) {
				console.log(`Created show role: ${roleName}`);
			}
		}
		console.log("Roles seeding complete");
	};

	const seedDepartments = async () => {
		const { Department } = models;
		const departments = ["Costumes", "Props", "Sets", "Tech"];

		for (const deptName of departments) {
			const [created] = await Department.findOrCreate({ where: { name: deptName } });
			if (created) {
				console.log(`Created department: ${deptName}`);
			}
		}
		console.log("Departments seeding complete");
	};

}
/* v8 ignore stop */

app.get("/server-up", (_req, res) => {
	res.json({ message: "ok" });
});

app.get("/crash-test", (_req, _res, next) => {
	next(new Error("Intentional crash for testing error handling"));
});

app.get("/crash-test-minimal", (_req, _res, next) => {
	next({});
});

app.get("/test", (_req, res) => {
	res.json({ message: "This is a test route." });
});

app.use("/api/users", userRouter);
app.use("/api/orgs", organzationRouter);
app.use("/api/shows", showRouter);
app.use("/api/auth", authRouter);
// Usage: curl -X POST http://localhost:3000/api/admin/reset-db \ -H "Authorization: Bearer YOUR_JWT_TOKEN"
app.use("/api/admin", adminRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/schedule", scheduleRouter)

app.use((_req, _res, next) => {
	next({
		statusCode: 404,
		message: "Route Not Found",
	});
});

app.use((err, _req, res, _next) => {
	const statusCode = err.statusCode || err.status || 500;
	console.error(err);
	res.status(statusCode).json({
		success: false,
		message: err.message || "Internal server error",
	});

	return;
});

/* v8 ignore start */
if (process.env.NODE_ENV !== "test") {
	app.listen(expressConfig.port, () => {
		console.log(`Server is running on http://localhost:${expressConfig.port}`);
	});
}
/* v8 ignore stop */

export default app;
