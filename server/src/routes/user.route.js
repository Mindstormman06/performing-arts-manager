import Router from "express";

import userController from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { signupLimiter } from "../middleware/rateLimit.middleware.js";

const router = Router();

router.get("/", authenticate, userController.get);
router.get("/:id", authenticate, userController.getById);
// Public: account sign-up
router.post("/", signupLimiter, userController.create);
router.put("/:id", authenticate, userController.update);
router.delete("/:id", authenticate, userController.remove);

export default router;
