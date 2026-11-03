import Router from "express";

import adminController from "../controllers/admin.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

// Enabled automatically only inside the unit-test runner, so CI jobs that run
// the real server (UAT, DAST) can't wipe the database mid-run.
const isUnitTestRun = () => typeof process.env.VITEST !== "undefined";

// Destructive maintenance endpoints are disabled unless explicitly enabled.
// Set ALLOW_DB_RESET=true only on throwaway development/test databases.
const requireDbResetEnabled = (_req, res, next) => {
	if (process.env.ALLOW_DB_RESET === "true" || isUnitTestRun()) return next();
	return res.status(404).json({ success: false, message: "Route Not Found" });
};

// POST /api/admin/reset-db
router.post(
	"/reset-db",
	requireDbResetEnabled,
	authenticate,
	adminController.resetDb,
);

export default router;
