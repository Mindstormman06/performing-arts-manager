import Router from "express";

import inventoryController from "../controllers/inventory.controller.js";
import {
	authenticate,
	authorizeInventoryDept, // <-- Import the new dynamic checker
	authorizeOrg,
	authorizeShow} from "../middleware/auth.middleware.js";

const router = Router();

// --- Department Routes ---

// GET /api/inventory/departments
router.get(
	"/departments",
	authenticate,
	inventoryController.getDepartments
);


// --- Organization Level Routes ---

// GET /api/inventory/orgs/1
router.get(
	"/orgs/:orgId",
	authenticate,
	authorizeOrg(), // Read-only viewing stays open to any org member
	inventoryController.getGlobal
);

// POST /api/inventory/orgs/1
router.post(
	"/orgs/:orgId",
	authenticate,
	authorizeInventoryDept("org"), // <-- Updated
	inventoryController.createGlobal
);

// DELETE /api/inventory/orgs/1/items/5
router.delete(
	"/orgs/:orgId/items/:inventoryId",
	authenticate,
	authorizeInventoryDept("org"), // <-- Updated
	inventoryController.removeGlobal
);


// --- Show Level Routes ---

// GET /api/inventory/shows/1
router.get(
	"/shows/:showId",
	authenticate,
	authorizeShow(), // Read-only viewing stays open to any show member
	inventoryController.getShowInventory
);

// POST /api/inventory/shows/1
router.post(
	"/shows/:showId",
	authenticate,
	authorizeInventoryDept("show"), // <-- Updated
	inventoryController.createShowItem
);

// POST /api/inventory/shows/1/pull/5
router.post(
	"/shows/:showId/pull/:inventoryId",
	authenticate,
	authorizeInventoryDept("show"), // <-- Updated
	inventoryController.pullItem
);

// DELETE /api/inventory/shows/1/items/5
router.delete(
	"/shows/:showId/items/:inventoryId",
	authenticate,
	authorizeInventoryDept("show"), // <-- Updated
	inventoryController.removeItem
);

export default router;