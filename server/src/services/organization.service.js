import models from "../models/index.js";
import sequelize from "./db.service.js";

const { Organization } = models;

async function getAll() {
	const organizations = await Organization.findAll();
	return organizations;
}

async function getById(id) {
	const organization = await Organization.findByPk(id);
	if (!organization) {
		throw new Error("Organization not found");
	}
	return organization;
}

async function create(data) {
	const t = await sequelize.transaction();

	try {
		const newOrg = await Organization.create(data, { transaction: t });

		const presidentRole = await models.Role.findOne({
			where: { name: "president" },
			transaction: t,
		});
		if (!presidentRole) {
			throw new Error("President role not found");
		}

		const membership = await models.OrgMembership.create(
			{
				users_id: data.userId,
				org_id: newOrg.id,
				status: "active",
			},
			{ transaction: t },
		);

		await membership.addAssignedRole(presidentRole, { transaction: t });

		await t.commit();
		return newOrg.toJSON();
	} catch (err) {
		await t.rollback();
		throw err;
	}
}

async function update(id, data) {
	const organization = await Organization.findByPk(id);
	if (!organization) {
		throw new Error("Organization not found");
	}
	await organization.update(data);
	return organization.toJSON();
}

async function remove(id) {
	const organization = await Organization.findByPk(id);
	if (!organization) {
		throw new Error("Organization not found");
	}
	await organization.destroy();
	return { message: "Organization deleted successfully" };
}

export default {
	getAll,
	getById,
	create,
	update,
	remove,
};
