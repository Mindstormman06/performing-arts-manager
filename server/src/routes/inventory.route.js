import Router from "express";

import upload, { setUploadSubDir } from "../config/multer.config.js";
import inventoryController from "../controllers/inventory.controller.js";
import {
	authenticate,
	authorizeInventoryDept,
	authorizeOrg,
	authorizeShow,
} from "../middleware/auth.middleware.js";

const router = Router();

// --- Department Routes ---

// GET /api/inventory/departments
router.get("/departments", authenticate, inventoryController.getDepartments);

// --- Organization Level Routes ---

// GET /api/inventory/orgs/1
router.get(
	"/orgs/:orgId",
	authenticate,
	authorizeOrg(), // Read-only viewing stays open to any org member
	inventoryController.getGlobal,
);

// POST /api/inventory/orgs/1
router.post(
	"/orgs/:orgId",
	authenticate,
	authorizeInventoryDept("org"), // <-- Updated
	setUploadSubDir("inventory"),
	upload.single("photo"),
	inventoryController.createGlobal,
);

// PUT /api/inventory/orgs/1/items/5
router.put(
	"/orgs/:orgId/items/:inventoryId",
	authenticate,
	authorizeInventoryDept("org"),
	inventoryController.updateGlobal,
);

// DELETE /api/inventory/orgs/1/items/5
router.delete(
	"/orgs/:orgId/items/:inventoryId",
	authenticate,
	authorizeInventoryDept("org"), // <-- Updated
	inventoryController.removeGlobal,
);

// --- Show Level Routes ---

// GET /api/inventory/shows/1
router.get(
	"/shows/:showId",
	authenticate,
	authorizeShow(), // Read-only viewing stays open to any show member
	inventoryController.getShowInventory,
);

// POST /api/inventory/shows/1
router.post(
	"/shows/:showId",
	authenticate,
	authorizeInventoryDept("show"), // <-- Updated
	setUploadSubDir("inventory"),
	upload.single("photo"),
	inventoryController.createShowItem,
);

// POST /api/inventory/shows/1/pull/5
router.post(
	"/shows/:showId/pull/:inventoryId",
	authenticate,
	authorizeInventoryDept("show"), // <-- Updated
	inventoryController.pullItem,
);

// PUT /api/inventory/shows/1/items/5
router.put(
	"/shows/:showId/items/:inventoryId",
	authenticate,
	authorizeInventoryDept("show"),
	inventoryController.updateItem,
);

// PUT /api/inventory/shows/1/items/5/assign
router.put(
	"/shows/:showId/items/:inventoryId/assign",
	authenticate,
	authorizeInventoryDept("show"),
	inventoryController.assignItem,
);

// DELETE /api/inventory/shows/1/items/5
router.delete(
	"/shows/:showId/items/:inventoryId",
	authenticate,
	authorizeInventoryDept("show"), // <-- Updated
	inventoryController.removeItem,
);

export default router;
