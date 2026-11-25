/**
 * Service for organization CRUD.
 *
 * @remarks
 * Exports `getAll` (organizations where a user is an active member),
 * `getById`, `create`, `update` and `remove`. `create` inserts the
 * Organization and an active OrgMembership holding the president
 * OrganizationRole for `data.userId` in one transaction, and fails if that
 * role has not been seeded. `update` passes its data straight to Sequelize, so
 * callers decide which fields are allowed. Callers must already have checked
 * membership or admin rights.
 */

import models from "../models/index.js";
import sequelize from "./db.service.js";

const { Organization } = models;

async function getAll(userId) {
	return await Organization.findAll({
		include: [
			{
				model: models.OrgMembership,
				where: { users_id: userId, status: "active" },
				attributes: [],
			},
		],
	});
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

		const presidentRole = await models.OrganizationRole.findOne({
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
