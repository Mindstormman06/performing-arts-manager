import models from "../models/index.js";

const { Show } = models;

async function getAll(orgId) {
	const whereClause = orgId ? { org_id: orgId } : {}; 
    const shows = await Show.findAll({ where: whereClause });
	return shows;
}

async function getById(id) {
	const show = await Show.findByPk(id);
	if (!show) {
		throw new Error("Show not found");
	}
	return show;
}

async function getByOrg(orgId) {
	const shows = await Show.findAll({ where: { org_id: orgId } });
	if (!show) {
		throw new Error("No shows found for this organization");
	}
	return shows;
}

async function create(data) {
	const newShow = await Show.create(data);
	return newShow.toJSON();
}

async function update(id, data) {
	const show = await Show.findByPk(id);
	if (!show) {
		throw new Error("Show not found");
	}
	await show.update(data);
	return show.toJSON();
}

async function remove(id) {
	const show = await Show.findByPk(id);
	if (!show) {
		throw new Error("Show not found");
	}
	await show.destroy();
	return { message: "Show deleted successfully" };
}

export default {
	getAll,
	getById,
	create,
	update,
	remove,
};
