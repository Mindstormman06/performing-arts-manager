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

// Org CRUD routes
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

// POST /api/organizations/1/join -> Links User 1 to Org 1 (assignment_id created)
router.post(
	"/:orgId/join",
	authenticate,
	authorizeOrg(ORG_ADMIN_ROLES),
	orgMembershipController.join,
);

// PUT /api/organizations/1/users/1/roles -> Appends roles to that assignment_id
router.put(
	"/:orgId/users/:userId/roles",
	authenticate,
	authorizeOrg(ORG_ADMIN_ROLES),
	orgMembershipController.addRoles,
);

// GET all users in an organizations
router.get(
	"/:orgId/users",
	authenticate,
	authorizeOrg(),
	orgMembershipController.getAllUsers,
);

// GET all users with a specific role (usage: /api/organizations/1/users/role?role=admin)
router.get(
	"/:orgId/users/role",
	authenticate,
	authorizeOrg(),
	orgMembershipController.getByRole,
);

// GET a specific user by ID in an organizations
router.get(
	"/:orgId/users/:userId",
	authenticate,
	authorizeOrg(),
	orgMembershipController.getUser,
);

// DELETE user from organizations (Leave)
// Members may remove themselves; removing someone else needs an admin role
const requireOrgAdmin = authorizeOrg(ORG_ADMIN_ROLES);
router.delete(
	"/:orgId/users/:userId",
	authenticate,
	(req, res, next) => (isSelf(req) ? next() : requireOrgAdmin(req, res, next)),
	orgMembershipController.leave,
);

// DELETE a specific role from a user
router.delete(
	"/:orgId/users/:userId/roles",
	authenticate,
	authorizeOrg(ORG_ADMIN_ROLES),
	orgMembershipController.removeRole,
);

// POST /api/organizations/1/invite -> Invite user by email to join org (creates pending assignment_id)
router.post(
	"/:orgId/invite",
	authenticate,
	authorizeOrg(ORG_ADMIN_ROLES),
	orgMembershipController.invite,
);
// PUT /api/organizations/1/respond -> Accept or decline invite (updates status to 'active' or deletes assignment_id)
router.put(
	"/:orgId/respond",
	authenticate,
	orgMembershipController.respondToInvite,
);

export default router;
