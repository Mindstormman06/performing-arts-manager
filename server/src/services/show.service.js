import { Op } from "sequelize";

import models from "../models/index.js";
import sequelize from "./db.service.js";
import inventoryService from "./inventory.service.js";

const { Show } = models;

// Fields a client may set on a show. organization_id is only accepted on
// create; a show can never be moved to another organization afterwards.
const EDITABLE_SHOW_FIELDS = ["title", "start_date", "end_date"];
const ORG_OVERSIGHT_ROLES = ["admin", "president", "board-member"];

function pickShowFields(data = {}, fields = EDITABLE_SHOW_FIELDS) {
	return Object.fromEntries(
		Object.entries(data).filter(
			([field, value]) => fields.includes(field) && value !== undefined,
		),
	);
}

function toPlain(record) {
	if (!record) {
		return record;
	}

	return typeof record.toJSON === "function" ? record.toJSON() : record;
}

function getRoleNames(membership) {
	return (membership?.assignedRoles ?? []).map((role) => role.name);
}

async function getViewerDashboard(showId, userId) {
	const [membership, castings, schedules, inventoryItems] = await Promise.all([
		models.ShowMembership.findOne({
			where: { show_id: showId, users_id: userId },
			include: [
				{ model: models.User, attributes: ["id", "fname", "lname", "email"] },
				{ model: models.ShowRole, as: "assignedRoles" },
			],
		}),
		models.Casting.findAll({
			where: { show_id: showId, users_id: userId },
			order: [["id", "ASC"]],
		}),
		models.Schedule.findAll({
			where: {
				show_id: showId,
				start_time: { [Op.gte]: new Date() },
			},
			include: [
				{
					model: models.User,
					as: "attendees",
					attributes: ["id", "fname", "lname"],
					through: { attributes: [] },
				},
				{
					model: models.Casting,
					as: "requiredCharacters",
					attributes: ["id", "name", "users_id"],
					through: { attributes: [] },
				},
			],
			order: [["start_time", "ASC"]],
		}),
		inventoryService.getShowInventory(showId),
	]);

	const viewerSchedule = schedules.filter((schedule) => {
		const attendeeIds = (schedule.attendees ?? []).map(
			(attendee) => attendee.id,
		);
		const requiredCharacterOwnerIds = (schedule.requiredCharacters ?? [])
			.map((character) => character.users_id)
			.filter((id) => id !== null && id !== undefined);

		return (
			attendeeIds.includes(userId) || requiredCharacterOwnerIds.includes(userId)
		);
	});

	const viewerInventory = inventoryItems.filter(
		(item) =>
			item.assigned_user_id === userId ||
			item.assignedCharacter?.users_id === userId,
	);

	return {
		user: membership?.User ?? null,
		membership: membership
			? {
					assignment_id: membership.assignment_id,
					status: membership.status,
					roles: getRoleNames(membership),
				}
			: null,
		casting: castings.map(toPlain),
		schedule: viewerSchedule.map(toPlain),
		inventory: viewerInventory,
	};
}

async function getAll(orgId) {
	const whereClause = orgId ? { organization_id: orgId } : {};
	return await models.Show.findAll({ where: whereClause });
}

// Shows the user can see: every show in orgs where they hold an oversight
// role, plus shows they are an active member of in orgs they still belong to.
async function getUserShows(orgId, userId) {
	if (!userId) return [];

	const orgWhere = { users_id: userId, status: "active" };
	if (orgId) orgWhere.org_id = orgId;
	const orgMemberships = await models.OrgMembership.findAll({
		where: orgWhere,
		include: [{ model: models.OrganizationRole, as: "assignedRoles" }],
	});
	if (!orgMemberships.length) return [];

	const memberOrgIds = orgMemberships.map((m) => m.org_id);
	const oversightOrgIds = orgMemberships
		.filter((m) =>
			(m.assignedRoles || []).some((r) => ORG_OVERSIGHT_ROLES.includes(r.name)),
		)
		.map((m) => m.org_id);

	const showMemberships = await models.ShowMembership.findAll({
		where: { users_id: userId, status: "active" },
		attributes: ["show_id"],
	});
	const memberShowIds = showMemberships.map((m) => m.show_id);

	return await models.Show.findAll({
		where: {
			[Op.or]: [
				{ organization_id: oversightOrgIds },
				{ id: memberShowIds, organization_id: memberOrgIds },
			],
		},
	});
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
		const newShow = await models.Show.create(
			pickShowFields(data, [...EDITABLE_SHOW_FIELDS, "organization_id"]),
			{ transaction: t },
		);

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
	await show.update(pickShowFields(data));
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

async function getDashboardSummary(showId, viewerUserId) {
	const show = await models.Show.findByPk(showId, {
		include: [
			{
				model: models.ShowMembership,
				include: [
					{
						model: models.User,
						attributes: ["id", "fname", "lname", "email", "phone"],
					},
					{ model: models.ShowRole, as: "assignedRoles" },
				],
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

	const [upNext, viewer] = await Promise.all([
		models.Schedule.findAll({
			where: {
				show_id: showId,
				start_time: { [Op.gte]: new Date() },
			},
			order: [["start_time", "ASC"]],
			limit: 5,
		}),
		viewerUserId
			? getViewerDashboard(showId, viewerUserId)
			: Promise.resolve(null),
	]);

	const showData = show.toJSON();
	const totalBudget = showData.Budget ? showData.Budget.amount : 0;
	const totalSpent = showData.Expenses
		? showData.Expenses.reduce((sum, exp) => sum + exp.amount, 0)
		: 0;

	return {
		id: showData.id,
		title: showData.title,
		start_date: showData.start_date,
		end_date: showData.end_date,
		members: showData.ShowMemberships ?? [],
		schedule: upNext.map(toPlain),
		budget: {
			total: totalBudget,
			spent: totalSpent,
		},
		viewer,
	};
}

async function getAvailableRoles() {
	const roles = await models.ShowRole.findAll({
		attributes: ["id", "name"],
		order: [["id", "ASC"]],
	});
	return roles.map((role) => role.toJSON());
}

export default {
	getAll,
	getUserShows,
	getById,
	create,
	update,
	remove,
	getDashboardSummary,
	getAvailableRoles,
};
