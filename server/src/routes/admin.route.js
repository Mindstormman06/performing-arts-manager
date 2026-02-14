import Router from "express";

import adminController from "../controllers/admin.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

// POST /api/admin/reset-db
router.post("/reset-db", authenticate, adminController.resetDb);

export default router;
