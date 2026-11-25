/**
 * Express router for shows, their members and casting, mounted at
 * `/api/shows`.
 *
 * @remarks
 * `GET /roles/available` is public; every other route requires a logged-in
 * user. Creating a show requires an org admin or president of the
 * `organization_id` in the body. Show routes require active membership in the
 * show and its organization, and changes require `director` or
 * `stage-manager`, except for org admins, presidents and board members, who
 * pass every show check. A member's profile (bio and `photo` upload under
 * `uploads/profiles`) can be edited by that member or a show manager.
 */

import Router from "express";

import upload, { setUploadSubDir } from "../config/multer.config.js";
import castingController from "../controllers/casting.controller.js";
import showController from "../controllers/show.controller.js";
import showMembershipController from "../controllers/showMembership.controller.js";
import {
	authenticate,
	authorizeOrg,
	authorizeShow,
	isSelf,
	ORG_ADMIN_ROLES,
} from "../middleware/auth.middleware.js";

const SHOW_MANAGER_ROLES = ["director", "stage-manager"];

// Profile edits: the member themselves, a show manager, or org oversight
const requireSelfOrShowManager = (req, res, next) => {
	if (
		isSelf(req) ||
		req.showOversight ||
		SHOW_MANAGER_ROLES.some((r) => req.showRoles?.includes(r))
	) {
		return next();
	}
	return res.status(403).json({
		success: false,
		message: "You can only edit your own show profile.",
	});
};

const router = Router();

router.get("/", authenticate, showController.get);
router.get("/roles/available", showController.getAvailableRoles);
router.get("/user", authenticate, showController.getUserShows);
router.get(
	"/:id/dashboard",
	authenticate,
	authorizeShow(),
	showController.getDashboardSummary,
);
router.get("/:id", authenticate, authorizeShow(), showController.getById);
router.post(
	"/",
	authenticate,
	authorizeOrg(ORG_ADMIN_ROLES),
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

router.post(
	"/:showId/join",
	authenticate,
	authorizeShow(["director", "stage-manager"]),
	showMembershipController.join,
);

router.post(
	"/:showId/invite",
	authenticate,
	authorizeShow(["director", "stage-manager"]),
	showMembershipController.invite,
);

router.put(
	"/:showId/users/:userId/roles",
	authenticate,
	authorizeShow(["director", "stage-manager"]),
	showMembershipController.addRoles,
);

router.get(
	"/:showId/users",
	authenticate,
	authorizeShow(),
	showMembershipController.getAllUsers,
);

router.get(
	"/:showId/users/search",
	authenticate,
	authorizeShow(),
	showMembershipController.getByRole,
);

router.get(
	"/:showId/users/:userId",
	authenticate,
	authorizeShow(),
	showMembershipController.getUser,
);

router.delete(
	"/:showId/users/:userId",
	authenticate,
	authorizeShow(["director", "stage-manager"]),
	showMembershipController.leave,
);

router.delete(
	"/:showId/users/:userId/roles",
	authenticate,
	authorizeShow(["director", "stage-manager"]),
	showMembershipController.removeRole,
);

router.put(
	"/:showId/users/:userId/profile",
	authenticate,
	authorizeShow(),
	requireSelfOrShowManager,
	setUploadSubDir("profiles"),
	upload.single("photo"),
	showMembershipController.updateProfile,
);

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
