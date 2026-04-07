import { Op } from "sequelize";

import models from "../models/index.js";
import sequelize from "./db.service.js";

const { Show } = models;

async function getAll(orgId) {
	const whereClause = orgId ? { organization_id: orgId } : {};
	const shows = await models.Show.findAll({ where: whereClause });
	return shows;
}

async function getUserShows(orgId, userId) {
	const whereClause = orgId ? { organization_id: orgId } : {};

	if (orgId && userId) {
		const orgMembership = await models.OrgMembership.findOne({
			where: { org_id: orgId, users_id: userId },
			include: [{ model: models.OrganizationRole, as: "assignedRoles" }],
		});

		const isSuperAdmin = orgMembership?.assignedRoles?.some((r) =>
			["president", "board-member"].includes(r.name),
		);

		if (!isSuperAdmin) {
			return await models.Show.findAll({
				where: whereClause,
				include: [
					{
						model: models.ShowMembership,
						where: { users_id: userId },
						attributes: [],
					},
				],
			});
		}
	}

	return await models.Show.findAll({ where: whereClause });
}

async function getById(id) {
	const show = await Show.findByPk(id);
	if (!show) {
		throw new Error("Show not found");
	}
	return show;
}

async function create(data) {
	const t = await sequelize.transaction();
	try {
		const newShow = await models.Show.create(data, { transaction: t });

		if (data.creatorId) {
			const directorRole = await models.ShowRole.findOne({
				where: { name: "director" },
				transaction: t,
			});

			if (directorRole) {
				const membership = await models.ShowMembership.create(
					{
						users_id: data.creatorId,
						show_id: newShow.id,
						status: "active",
					},
					{ transaction: t },
				);
				await membership.addAssignedRole(directorRole, { transaction: t });
			}
		}

		await t.commit();
		return newShow.toJSON();
	} catch (err) {
		await t.rollback();
		throw err;
	}
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

async function getDashboardSummary(showId) {
	const show = await models.Show.findByPk(showId, {
		include: [
			{
				model: models.ShowMembership,
				include: [
					{ model: models.User, attributes: ["id", "fname", "lname"] },
					{ model: models.ShowRole, as: "assignedRoles" },
				],
			},
			{
				model: models.Schedule,
				where: {
					start_time: { [Op.gte]: new Date() }, // Only get future events
				},
				limit: 5, // Just get the next 5 for the "Up Next" widget
				order: [["start_time", "ASC"]],
				required: false, // Don't fail if there are no schedules yet
			},
			{
				model: models.Budget,
				required: false,
			},
			{
				model: models.Expense,
				required: false,
			},
		],
	});

	if (!show) {
		throw new Error("Show not found");
	}

	// Calculate budget totals
	const totalBudget = show.Budget ? show.Budget.amount : 0; // Assuming your Budget model has an 'amount' field
	const totalSpent = show.Expenses
		? show.Expenses.reduce((sum, exp) => sum + exp.amount, 0)
		: 0;

	return {
		id: show.id,
		title: show.title,
		start_date: show.start_date,
		end_date: show.end_date,
		members: show.ShowMemberships,
		schedule: show.Schedules,
		budget: {
			total: totalBudget,
			spent: totalSpent,
		},
	};
}

export default {
	getAll,
	getUserShows,
	getById,
	create,
	update,
	remove,
	getDashboardSummary,
};
