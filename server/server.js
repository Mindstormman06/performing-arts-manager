import cors from "cors";
import express from "express";

import { expressConfig } from "./src/config/index.js";
import models from "./src/models/index.js";
import adminRouter from "./src/routes/admin.route.js";
import authRouter from "./src/routes/auth.route.js";
import organzationRouter from "./src/routes/organization.route.js";
import showRouter from "./src/routes/show.route.js";
import userRouter from "./src/routes/user.route.js";
import sequelize from "./src/services/db.service.js";

const app = express();
app.use(cors());
app.use(express.json());

/* v8 ignore start */
if (process.env.NODE_ENV !== "test") {
	sequelize
		.sync({ alter: true })
		.then(() => console.log("Database synchronized!"))
		.then(() => {
			seedRoles();
		})
		.catch((err) => console.error("Error syncing database:", err));

	const seedRoles = async () => {
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

		for (const roleName of roles) {
			const [created] = await Role.findOrCreate({ where: { name: roleName } });
			if (created) {
				console.log(`Created role: ${roleName}`);
			}
		}
		console.log("Roles seeding complete");
	};
}
/* v8 ignore stop */

app.get("/server-up", (_req, res) => {
	res.json({ message: "ok" });
});

app.get("/crash-test", (req, res, next) => {
    next(new Error("Intentional crash for testing error handling")); 
});

app.get("/crash-test-minimal", (req, res, next) => {
    next({}); 
});

app.use("/api/users", userRouter);
app.use("/api/orgs", organzationRouter);
app.use("/api/shows", showRouter);
app.use("/api/auth", authRouter);
// Usage: curl -X POST http://localhost:3000/api/admin/reset-db \ -H "Authorization: Bearer YOUR_JWT_TOKEN"
app.use("/api/admin", adminRouter);

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
