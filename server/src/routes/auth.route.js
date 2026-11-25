/**
 * Express router for login, mounted at `/api/auth`.
 *
 * @remarks
 * `POST /login` is public but rate-limited on failed attempts per IP and per
 * account email. `GET /verify` requires a valid JWT.
 */

import Router from "express";

import authController from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import {
	loginAccountLimiter,
	loginIpLimiter,
} from "../middleware/rateLimit.middleware.js";

const router = Router();

router.post(
	"/login",
	loginIpLimiter,
	loginAccountLimiter,
	authController.login,
);

router.get("/verify", authenticate, authController.verify);

export default router;
