/**
 * Express router for database maintenance, mounted at `/api/admin`.
 *
 * @remarks
 * Exposes `POST /reset-db`, which wipes and re-creates the database. It
 * requires a logged-in user and answers 404 unless `ALLOW_DB_RESET` is `true`
 * or the process runs under Vitest, so only enable it on throwaway databases.
 */

import Router from "express";

import adminController from "../controllers/admin.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

// Enabled automatically only inside the unit-test runner, so CI jobs that run
// the real server (UAT, DAST) can't wipe the database mid-run.
const isUnitTestRun = () => typeof process.env.VITEST !== "undefined";

const requireDbResetEnabled = (_req, res, next) => {
	if (process.env.ALLOW_DB_RESET === "true" || isUnitTestRun()) return next();
	return res.status(404).json({ success: false, message: "Route Not Found" });
};

router.post(
	"/reset-db",
	requireDbResetEnabled,
	authenticate,
	adminController.resetDb,
);

export default router;
