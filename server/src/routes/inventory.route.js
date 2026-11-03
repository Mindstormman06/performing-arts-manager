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
	// Upload first so multipart fields (dept_id) are parsed; a rejected
	// request has its uploaded file removed by authorizeInventoryDept.
	setUploadSubDir("inventory"),
	upload.single("photo"),
	authorizeInventoryDept("org"),
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
	authorizeInventoryDept("org"),
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
	// Upload first so multipart fields (dept_id) are parsed; a rejected
	// request has its uploaded file removed by authorizeInventoryDept.
	setUploadSubDir("inventory"),
	upload.single("photo"),
	authorizeInventoryDept("show"),
	inventoryController.createShowItem,
);

// POST /api/inventory/shows/1/pull/5
router.post(
	"/shows/:showId/pull/:inventoryId",
	authenticate,
	authorizeInventoryDept("show"),
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
	authorizeInventoryDept("show"),
	inventoryController.removeItem,
);

export default router;
