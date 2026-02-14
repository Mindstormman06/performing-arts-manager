import Router from "express";

import organizationController from "../controllers/organization.controller.js";
import orgMembershipController from "../controllers/orgMembership.controller.js";
import { authenticate, authorizeOrg } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/my", authenticate, orgMembershipController.getUserOrganizations);

// Org CRUD routes
router.get("/", organizationController.get);
router.get("/:id", organizationController.getById);
router.post("/", authenticate, organizationController.create);
router.put(
	"/:id",
	authenticate,
	authorizeOrg(["admin", "president"]),
	organizationController.update,
);
router.delete(
	"/:id",
	authenticate,
	authorizeOrg(["admin", "president"]),
	organizationController.remove,
);

// POST /api/organizations/1/join -> Links User 1 to Org 1 (assignment_id created)
router.post("/:orgId/join", orgMembershipController.join);

// PUT /api/organizations/1/users/1/roles -> Appends roles to that assignment_id
router.put("/:orgId/users/:userId/roles", orgMembershipController.addRoles);

// GET all users in an organization
router.get("/:orgId/users", orgMembershipController.getAllUsers);

// GET all users with a specific role (usage: /api/organizations/1/users/search?role=admin)
router.get("/:orgId/users/search", orgMembershipController.getByRole);

// GET a specific user by ID in an organization
router.get("/:orgId/users/:userId", orgMembershipController.getUser);

// DELETE user from organization (Leave)
router.delete("/:orgId/users/:userId", orgMembershipController.leave);

// DELETE a specific role from a user
router.delete(
	"/:orgId/users/:userId/roles",
	orgMembershipController.removeRole,
);

// POST /api/organizations/1/invite -> Invite user by email to join org (creates pending assignment_id)
router.post(
	"/:orgId/invite",
	authenticate,
	authorizeOrg(["admin", "president"]),
	orgMembershipController.invite,
);
// PUT /api/organizations/1/respond -> Accept or decline invite (updates status to 'active' or deletes assignment_id)
router.put(
	"/:orgId/respond",
	authenticate,
	orgMembershipController.respondToInvite,
);

// GET all organizations for the authenticated user

export default router;
