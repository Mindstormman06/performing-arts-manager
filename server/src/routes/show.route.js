import Router from "express";

import castingController from "../controllers/casting.controller.js";
import showController from "../controllers/show.controller.js";
import showMembershipController from "../controllers/showMembership.controller.js";
import upload from "../config/multer.config.js";
import {
	authenticate,
	authorizeOrg,
	authorizeShow,
} from "../middleware/auth.middleware.js";

const router = Router();

// Show CRUD routes
router.get("/", showController.get);
router.get("/roles/available", showController.getAvailableRoles);
router.get("/user", authenticate, showController.getUserShows);
router.get(
	"/:id/dashboard",
	authenticate,
	authorizeShow(),
	showController.getDashboardSummary
);
router.get("/:id", showController.getById);
router.post(
	"/",
	authenticate,
	authorizeOrg(["admin", "president"]),
	showController.create,
);
router.put(
	"/:id",
	authenticate,
	authorizeShow(["director", "stage-manager"]),
	showController.update,
);
router.delete(
	"/:id",
	authenticate,
	authorizeShow(["director", "stage-manager"]),
	showController.remove,
);

// POST /api/shows/1/join -> Links User 1 to Show 1 (assignment_id created)
router.post("/:showId/join", showMembershipController.join);

router.post(
	"/:showId/invite",
	authenticate,
	authorizeShow(["director", "stage-manager"]),
	showMembershipController.invite,
);

// PUT /api/shows/1/users/1/roles -> Appends roles to that assignment_id
router.put("/:showId/users/:userId/roles", showMembershipController.addRoles);

// GET all users in an show
router.get("/:showId/users", showMembershipController.getAllUsers);

// GET all users with a specific role (usage: /api/shows/1/users/search?role=admin)
router.get("/:showId/users/search", showMembershipController.getByRole);

// GET a specific user by ID in an show
router.get("/:showId/users/:userId", showMembershipController.getUser);

// DELETE user from show (Leave)
router.delete("/:showId/users/:userId", showMembershipController.leave);

// DELETE a specific role from a user
router.delete(
	"/:showId/users/:userId/roles",
	showMembershipController.removeRole,
);

// UPDATE user profile (bio and/or photo) for a specific show
router.put(
	"/:showId/users/:userId/profile",
	authenticate,
	upload.single("photo"),
	showMembershipController.updateProfile,
);

// Casting (characters)
router.get(
	"/:showId/casting",
	authenticate,
	authorizeShow(),
	castingController.getAll,
);

router.get(
	"/:showId/casting/:characterId",
	authenticate,
	authorizeShow(),
	castingController.getById,
);

router.post(
	"/:showId/casting",
	authenticate,
	authorizeShow(["director", "stage-manager"]),
	castingController.create,
);

router.put(
	"/:showId/casting/:characterId",
	authenticate,
	authorizeShow(["director", "stage-manager"]),
	castingController.update,
);

router.put(
	"/:showId/casting/:characterId/assign",
	authenticate,
	authorizeShow(["director", "stage-manager"]),
	castingController.assign,
);

router.delete(
	"/:showId/casting/:characterId",
	authenticate,
	authorizeShow(["director", "stage-manager"]),
	castingController.remove,
);

export default router;
