import models from "../models/index.js";

// --- Departments ---

async function getDepartments() {
	// Departments are static and global now, just return all of them
	return await models.Department.findAll();
}

// --- Organization / Global Inventory ---

async function getGlobalInventory(orgId) {
	return await models.Inventory.findAll({
		where: { is_global: 1, org_id: orgId }, // Filter by the new org_id column
		include: [
			{
				model: models.Department,
				attributes: ["id", "name"],
			},
			{
				model: models.User,
				attributes: ["id", "fname", "lname"],
			},
		],
	});
}

async function createGlobalItem(orgId, data, userId) {
	const dept = await models.Department.findByPk(data.dept_id);
	if (!dept) throw new Error("Invalid department");

	const newItem = await models.Inventory.create({
		...data,
		is_global: 1,
		added_by: userId,
		org_id: orgId, // Ensure it is tied to the organization
	});

	return newItem;
}

async function removeGlobalItem(orgId, inventoryId) {
	// 1. Find the item and ensure it belongs to this org and is global
	const item = await models.Inventory.findOne({
		where: { id: inventoryId, org_id: orgId, is_global: 1 },
	});

	if (!item) {
		throw new Error("Global item not found in this organization");
	}

	// 2. Delete any links to shows so we don't get Foreign Key constraint errors
	await models.ShowInventory.destroy({
		where: { inventory_id: inventoryId },
	});

	// 3. Delete the item itself
	await item.destroy();

	return { message: "Global item permanently deleted" };
}

// --- Show Inventory ---

async function getShowInventory(showId) {
	return await models.Inventory.findAll({
		include: [
			{
				model: models.Show,
				where: { id: showId },
				through: { attributes: ["user_id"] },
			},
			{
				model: models.Department,
				attributes: ["id", "name"],
			},
		],
	});
}

async function createShowItem(showId, data, userId) {
	// We need to know which org this show belongs to so we can assign the org_id to the inventory item
	const show = await models.Show.findByPk(showId);
	if (!show) throw new Error("Show not found");

	const newItem = await models.Inventory.create({
		...data,
		added_by: userId,
		is_global: 0,
		org_id: show.organization_id, // Inherit the org_id from the show
	});

	await models.ShowInventory.create({
		inventory_id: newItem.id,
		shows_id: showId,
		user_id: userId,
	});

	return newItem;
}

async function pullGlobalItemToShow(showId, inventoryId, userId) {
	const existing = await models.ShowInventory.findOne({
		where: { inventory_id: inventoryId, shows_id: showId },
	});
	if (existing) throw new Error("Item is already in this show's inventory");

	return await models.ShowInventory.create({
		inventory_id: inventoryId,
		shows_id: showId,
		user_id: userId,
	});
}

async function removeShowItem(showId, inventoryId) {
	const deletedLinkCount = await models.ShowInventory.destroy({
		where: { inventory_id: inventoryId, shows_id: showId },
	});

	if (deletedLinkCount === 0)
		throw new Error("Item not found in show inventory");

	const item = await models.Inventory.findByPk(inventoryId);
	if (item && item.is_global === 0) {
		await item.destroy();
	}

	return { message: "Item removed from show successfully" };
}

export default {
	getDepartments,
	getGlobalInventory,
	createGlobalItem,
	removeGlobalItem,
	getShowInventory,
	createShowItem,
	pullGlobalItemToShow,
	removeShowItem,
};
