import inventoryService from "../services/inventory.service.js";

async function getDepartments(_req, res, next) {
	try {
		res.json(await inventoryService.getDepartments());
	} catch (error) {
		next(error);
	}
}

async function getGlobal(req, res, next) {
	try {
		res.json(await inventoryService.getGlobalInventory(req.params.orgId));
	} catch (error) {
		next(error);
	}
}

async function createGlobal(req, res, next) {
	try {
		const item = await inventoryService.createGlobalItem(
			req.params.orgId,
			req.body,
			req.user.id
		);
		res.status(201).json({ success: true, data: item });
	} catch (error) {
		if (error.message.includes("Invalid department")) {
			return res.status(400).json({ success: false, message: error.message });
		}
		next(error);
	}
}

async function removeGlobal(req, res, next) {
	try {
		await inventoryService.removeGlobalItem(
			req.params.orgId,
			req.params.inventoryId
		);
		res.status(200).json({ success: true, message: "Global item deleted" });
	} catch (error) {
		if (error.message.includes("not found")) {
			return res.status(404).json({ success: false, message: error.message });
		}
		next(error);
	}
}

async function getShowInventory(req, res, next) {
	try {
		res.json(await inventoryService.getShowInventory(req.params.showId));
	} catch (error) {
		next(error);
	}
}

async function createShowItem(req, res, next) {
	try {
		const item = await inventoryService.createShowItem(
			req.params.showId,
			req.body,
			req.user.id
		);
		res.status(201).json({ success: true, data: item });
	} catch (error) {
		next(error);
	}
}

async function pullItem(req, res, next) {
	try {
		await inventoryService.pullGlobalItemToShow(
			req.params.showId,
			req.params.inventoryId,
			req.user.id
		);
		res.status(200).json({ success: true, message: "Item pulled to show" });
	} catch (error) {
		if (error.message.includes("already in this show")) {
			return res.status(409).json({ success: false, message: error.message });
		}
		next(error);
	}
}

async function removeItem(req, res, next) {
	try {
		await inventoryService.removeShowItem(
			req.params.showId,
			req.params.inventoryId
		);
		res.status(200).json({ success: true, message: "Item removed" });
	} catch (error) {
		if (error.message.includes("not found")) {
			return res.status(404).json({ success: false, message: error.message });
		}
		next(error);
	}
}

export default {
	getDepartments,
	getGlobal,
	createGlobal,
    removeGlobal,
	getShowInventory,
	createShowItem,
	pullItem,
	removeItem,
};