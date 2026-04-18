import models from "../models/index.js";

async function getShowCharacters(showId) {
	return models.Casting.findAll({
		where: { show_id: showId },
		include: [
			{ model: models.User, attributes: ["id", "fname", "lname", "email"] },
		],
		order: [["id", "ASC"]],
	});
}

async function getCharacterById(showId, characterId) {
	const character = await models.Casting.findOne({
		where: { id: characterId, show_id: showId },
		include: [
			{ model: models.User, attributes: ["id", "fname", "lname", "email"] },
		],
	});
	if (!character) throw new Error("Character not found");
	return character;
}

async function ensureAssignedUserIsShowMember(showId, userId) {
	if (userId == null) return;
	const membership = await models.ShowMembership.findOne({
		where: { show_id: showId, users_id: userId },
	});
	if (!membership) throw new Error("User is not a member of this show");
}

async function createCharacter(showId, data) {
	if (!data?.name?.trim()) throw new Error("Character name is required");
	await ensureAssignedUserIsShowMember(showId, data.users_id ?? null);
	return models.Casting.create({
		name: data.name.trim(),
		show_id: showId,
		users_id: data.users_id ?? null,
	});
}

async function updateCharacter(showId, characterId, data) {
	const character = await models.Casting.findOne({
		where: { id: characterId, show_id: showId },
	});
	if (!character) throw new Error("Character not found");
	if (data.name != null && !String(data.name).trim()) {
		throw new Error("Character name is required");
	}
	if (Object.prototype.hasOwnProperty.call(data, "users_id")) {
		await ensureAssignedUserIsShowMember(showId, data.users_id);
	}

	await character.update({
		name: data.name != null ? String(data.name).trim() : character.name,
		users_id: Object.prototype.hasOwnProperty.call(data, "users_id")
			? data.users_id
			: character.users_id,
	});
	return character;
}

async function assignCharacter(showId, characterId, userId) {
	const character = await models.Casting.findOne({
		where: { id: characterId, show_id: showId },
	});
	if (!character) throw new Error("Character not found");
	await ensureAssignedUserIsShowMember(showId, userId ?? null);
	await character.update({ users_id: userId ?? null });
	return character;
}

async function deleteCharacter(showId, characterId) {
	const deleted = await models.Casting.destroy({
		where: { id: characterId, show_id: showId },
	});
	if (!deleted) throw new Error("Character not found");
	return { message: "Character deleted" };
}

export default {
	getShowCharacters,
	getCharacterById,
	createCharacter,
	updateCharacter,
	assignCharacter,
	deleteCharacter,
};

