/**
 * Express router for organizations and their members, mounted at `/api/orgs`.
 *
 * @remarks
 * Every route requires a logged-in user. Listing orgs, listing the caller's
 * own orgs, creating an org and answering an invite need nothing more. Reading
 * an org or its members requires active membership. Updating or deleting the
 * org, adding members, inviting, and changing roles require an org admin or
 * president; members may remove themselves.
 */

import Router from "express";

import organizationController from "../controllers/organization.controller.js";
import orgMembershipController from "../controllers/orgMembership.controller.js";
import {
	authenticate,
	authorizeOrg,
	isSelf,
	ORG_ADMIN_ROLES,
} from "../middleware/auth.middleware.js";

const router = Router();

router.get("/my", authenticate, orgMembershipController.getUserOrganizations);

router.get("/", authenticate, organizationController.get);
router.get(
	"/:id",
	authenticate,
	authorizeOrg(),
	organizationController.getById,
);
router.post("/", authenticate, organizationController.create);
router.put(
	"/:id",
	authenticate,
	authorizeOrg(ORG_ADMIN_ROLES),
	organizationController.update,
);
router.delete(
	"/:id",
	authenticate,
	authorizeOrg(ORG_ADMIN_ROLES),
	organizationController.remove,
);

router.post(
	"/:orgId/join",
	authenticate,
	authorizeOrg(ORG_ADMIN_ROLES),
	orgMembershipController.join,
);

router.put(
	"/:orgId/users/:userId/roles",
	authenticate,
	authorizeOrg(ORG_ADMIN_ROLES),
	orgMembershipController.addRoles,
);

router.get(
	"/:orgId/users",
	authenticate,
	authorizeOrg(),
	orgMembershipController.getAllUsers,
);

router.get(
	"/:orgId/users/role",
	authenticate,
	authorizeOrg(),
	orgMembershipController.getByRole,
);

router.get(
	"/:orgId/users/:userId",
	authenticate,
	authorizeOrg(),
	orgMembershipController.getUser,
);

// Members may remove themselves; removing someone else needs an admin role
const requireOrgAdmin = authorizeOrg(ORG_ADMIN_ROLES);
router.delete(
	"/:orgId/users/:userId",
	authenticate,
	(req, res, next) => (isSelf(req) ? next() : requireOrgAdmin(req, res, next)),
	orgMembershipController.leave,
);

router.delete(
	"/:orgId/users/:userId/roles",
	authenticate,
	authorizeOrg(ORG_ADMIN_ROLES),
	orgMembershipController.removeRole,
);

router.post(
	"/:orgId/invite",
	authenticate,
	authorizeOrg(ORG_ADMIN_ROLES),
	orgMembershipController.invite,
);
router.put(
	"/:orgId/respond",
	authenticate,
	orgMembershipController.respondToInvite,
);

export default router;
