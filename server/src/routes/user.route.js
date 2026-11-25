/**
 * Express router for user accounts, mounted at `/api/users`.
 *
 * @remarks
 * `POST /` is the public sign-up, rate-limited per IP. Every other route
 * requires a logged-in user, and the controller only lets users update or
 * delete their own account.
 */

import Router from "express";

import userController from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { signupLimiter } from "../middleware/rateLimit.middleware.js";

const router = Router();

router.get("/", authenticate, userController.get);
router.get("/:id", authenticate, userController.getById);
router.post("/", signupLimiter, userController.create);
router.put("/:id", authenticate, userController.update);
router.delete("/:id", authenticate, userController.remove);

export default router;
