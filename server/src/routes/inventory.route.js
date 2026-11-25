/**
 * Express router for organization and show inventory, mounted at
 * `/api/inventory`.
 *
 * @remarks
 * Every route requires a logged-in user, and the department list is open to
 * any of them. Reading org or show inventory requires active membership.
 * Changes go through `authorizeInventoryDept`: org admins and presidents at
 * org level, directors and stage managers at show level, or members whose role
 * matches the item's department. Create routes accept a `photo` upload saved
 * under `uploads/inventory`.
 */

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

router.get("/departments", authenticate, inventoryController.getDepartments);

router.get(
	"/orgs/:orgId",
	authenticate,
	authorizeOrg(), // Read-only viewing stays open to any org member
	inventoryController.getGlobal,
);

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

router.put(
	"/orgs/:orgId/items/:inventoryId",
	authenticate,
	authorizeInventoryDept("org"),
	inventoryController.updateGlobal,
);

router.delete(
	"/orgs/:orgId/items/:inventoryId",
	authenticate,
	authorizeInventoryDept("org"),
	inventoryController.removeGlobal,
);

router.get(
	"/shows/:showId",
	authenticate,
	authorizeShow(), // Read-only viewing stays open to any show member
	inventoryController.getShowInventory,
);

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

router.post(
	"/shows/:showId/pull/:inventoryId",
	authenticate,
	authorizeInventoryDept("show"),
	inventoryController.pullItem,
);

router.put(
	"/shows/:showId/items/:inventoryId",
	authenticate,
	authorizeInventoryDept("show"),
	inventoryController.updateItem,
);

router.put(
	"/shows/:showId/items/:inventoryId/assign",
	authenticate,
	authorizeInventoryDept("show"),
	inventoryController.assignItem,
);

router.delete(
	"/shows/:showId/items/:inventoryId",
	authenticate,
	authorizeInventoryDept("show"),
	inventoryController.removeItem,
);

export default router;
