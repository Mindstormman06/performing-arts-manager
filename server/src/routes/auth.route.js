import Router from "express";

import authController from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

// POST /api/auth/login
router.post("/login", authController.login);

// GET /api/auth/verify
router.get("/verify", authenticate, authController.verify);

export default router;
