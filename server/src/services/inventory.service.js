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

async function createGlobalItem(orgId, data, userId, photoPath) {
	const dept = await models.Department.findByPk(data.dept_id);
	if (!dept) throw new Error("Invalid department");

	return await models.Inventory.create({
		...data,
		photo_path: photoPath || null,
		is_global: 1,
		added_by: userId,
		org_id: orgId,
	});
}

async function removeGlobalItem(orgId, inventoryId) {
	const item = await models.Inventory.findOne({
		where: { id: inventoryId, org_id: orgId, is_global: 1 },
	});

	if (!item) {
		throw new Error("Global item not found in this organizations");
	}

	await models.ShowInventory.destroy({
		where: { inventory_id: inventoryId },
	});

	await item.destroy();

	return { message: "Global item permanently deleted" };
}

async function updateGlobalItem(orgId, inventoryId, data) {
	const item = await models.Inventory.findOne({
		where: { id: inventoryId, org_id: orgId, is_global: 1 },
	});
	if (!item) throw new Error("Global item not found in this organizations");

	if (data.dept_id) {
		const dept = await models.Department.findByPk(data.dept_id);
		if (!dept) throw new Error("Invalid department");
	}

	await item.update({
		name: data.name ?? item.name,
		description: data.description ?? item.description,
		dept_id: data.dept_id ?? item.dept_id,
	});

	return item;
}

// --- Show Inventory ---

async function getShowInventory(showId) {
	const items = await models.Inventory.findAll({
		include: [
			{
				model: models.Show,
				where: { id: showId },
				through: { attributes: ["user_id", "assigned_character_id"] },
			},
			{
				model: models.Department,
				attributes: ["id", "name"],
			},
		],
	});

	const links = await models.ShowInventory.findAll({
		where: { shows_id: showId },
		include: [
			{
				model: models.User,
				as: "assignedUser",
				attributes: ["id", "fname", "lname", "email"],
			},
			{
				model: models.Casting,
				as: "assignedCharacter",
				attributes: ["id", "name", "users_id"],
			},
		],
	});

	const linkByInventoryId = new Map(
		links.map((link) => [link.inventory_id, link]),
	);

	return items.map((item) => {
		const plain = item.toJSON();
		const link = linkByInventoryId.get(item.id);
		return {
			...plain,
			assigned_user_id: link?.user_id ?? null,
			assigned_character_id: link?.assigned_character_id ?? null,
			assignedUser: link?.assignedUser ?? null,
			assignedCharacter: link?.assignedCharacter ?? null,
		};
	});
}

async function createShowItem(showId, data, userId, photoPath) {
	const show = await models.Show.findByPk(showId);
	if (!show) throw new Error("Show not found");

	const newItem = await models.Inventory.create({
		...data,
		photo_path: photoPath || null,
		added_by: userId,
		is_global: 0,
		org_id: show.organization_id, // Inherit the org_id from the show
	});

	await models.ShowInventory.create({
		inventory_id: newItem.id,
		shows_id: showId,
		user_id: null,
		assigned_character_id: null,
	});

	return newItem;
}

async function pullGlobalItemToShow(showId, inventoryId, _userId) {
	const existing = await models.ShowInventory.findOne({
		where: { inventory_id: inventoryId, shows_id: showId },
	});
	if (existing) throw new Error("Item is already in this show's inventory");

	return await models.ShowInventory.create({
		inventory_id: inventoryId,
		shows_id: showId,
		user_id: null,
		assigned_character_id: null,
	});
}

const ACTOR_FRIENDLY_DEPTS = new Set(["costumes", "props"]);

function canAssignUserToDepartment(userRoles, departmentName) {
	const dept = String(departmentName || "").toLowerCase();
	if (!dept) return false;
	if (userRoles.includes("director") || userRoles.includes("stage-manager")) {
		return true;
	}
	if (userRoles.includes(dept)) return true;
	if (ACTOR_FRIENDLY_DEPTS.has(dept) && userRoles.includes("actor")) {
		return true;
	}
	return false;
}

async function assignShowItem(showId, inventoryId, payload) {
	const link = await models.ShowInventory.findOne({
		where: { inventory_id: inventoryId, shows_id: showId },
	});
	if (!link) throw new Error("Item not found in show inventory");

	if (payload.users_id && payload.casting_id) {
		throw new Error("Choose either a user or a character, not both");
	}

	const item = await models.Inventory.findByPk(inventoryId, {
		include: [{ model: models.Department, attributes: ["id", "name"] }],
	});
	if (!item) throw new Error("Item not found in show inventory");

	if (payload.users_id) {
		const membership = await models.ShowMembership.findOne({
			where: { show_id: showId, users_id: payload.users_id },
			include: [{ model: models.ShowRole, as: "assignedRoles" }],
		});
		if (!membership) throw new Error("User is not a member of this show");

		const userRoles = (membership.assignedRoles || []).map((r) =>
			String(r.name || "").toLowerCase(),
		);
		if (!canAssignUserToDepartment(userRoles, item.Department?.name)) {
			throw new Error(
				"User role is not eligible for this inventory department",
			);
		}

		await link.update({
			user_id: payload.users_id,
			assigned_character_id: null,
		});
	} else if (payload.casting_id) {
		const deptName = String(item.Department?.name || "").toLowerCase();
		if (!ACTOR_FRIENDLY_DEPTS.has(deptName)) {
			throw new Error("Characters can only be assigned to costumes or props");
		}

		const character = await models.Casting.findOne({
			where: { id: payload.casting_id, show_id: showId },
		});
		if (!character) throw new Error("Character not found for this show");

		await link.update({
			user_id: null,
			assigned_character_id: payload.casting_id,
		});
	} else {
		await link.update({ user_id: null, assigned_character_id: null });
	}

	return link;
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

async function updateShowItem(showId, inventoryId, data) {
	const showInventoryLink = await models.ShowInventory.findOne({
		where: { inventory_id: inventoryId, shows_id: showId },
	});
	if (!showInventoryLink) throw new Error("Item not found in show inventory");

	const item = await models.Inventory.findByPk(inventoryId);
	if (!item) throw new Error("Item not found in show inventory");

	if (data.dept_id) {
		const dept = await models.Department.findByPk(data.dept_id);
		if (!dept) throw new Error("Invalid department");
	}

	await item.update({
		name: data.name ?? item.name,
		description: data.description ?? item.description,
		dept_id: data.dept_id ?? item.dept_id,
	});

	return item;
}

export default {
	getDepartments,
	getGlobalInventory,
	createGlobalItem,
	removeGlobalItem,
	updateGlobalItem,
	getShowInventory,
	createShowItem,
	pullGlobalItemToShow,
	removeShowItem,
	updateShowItem,
	assignShowItem,
};
