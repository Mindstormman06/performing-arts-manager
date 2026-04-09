import { Op } from "sequelize";

import models from "../models/index.js";
import sequelize from "./db.service.js";
import inventoryService from "./inventory.service.js";

const { Show } = models;

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
		const attendeeIds = (schedule.attendees ?? []).map((attendee) => attendee.id);
		const requiredCharacterOwnerIds = (schedule.requiredCharacters ?? [])
			.map((character) => character.users_id)
			.filter((id) => id !== null && id !== undefined);

		return attendeeIds.includes(userId) || requiredCharacterOwnerIds.includes(userId);
	});

	const viewerInventory = inventoryItems.filter(
		(item) => item.assigned_user_id === userId || item.assignedCharacter?.users_id === userId,
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

async function getUserShows(orgId, userId) {
    const whereClause = orgId ? { organization_id: orgId } : {};

    if (orgId && userId) {
        const orgMembership = await models.OrgMembership.findOne({
            where: { org_id: orgId, users_id: userId },
            include: [{ model: models.OrganizationRole, as: "assignedRoles" }]
        });

        const isSuperAdmin = orgMembership?.assignedRoles?.some(r => 
            ["president", "board-member"].includes(r.name)
        );

        if (!isSuperAdmin) {
            return await models.Show.findAll({
                where: whereClause,
                include: [{
                    model: models.ShowMembership,
                    where: { users_id: userId },
                    attributes: []
                }]
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
                    { transaction: t }
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

async function getDashboardSummary(showId, viewerUserId) {
	const show = await models.Show.findByPk(showId, {
		include: [
			{
				model: models.ShowMembership,
				include: [
					{ model: models.User, attributes: ["id", "fname", "lname"] },
					{ model: models.ShowRole, as: "assignedRoles" }
				]
			},
			{
				model: models.Budget,
				required: false
			},
			{
				model: models.Expense,
				required: false
			}
		]
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
		viewerUserId ? getViewerDashboard(showId, viewerUserId) : Promise.resolve(null),
	]);

	const showData = show.toJSON();
	const totalBudget = showData.Budget ? showData.Budget.amount : 0;
	const totalSpent = showData.Expenses ? showData.Expenses.reduce((sum, exp) => sum + exp.amount, 0) : 0;

	return {
		id: showData.id,
		title: showData.title,
		start_date: showData.start_date,
		end_date: showData.end_date,
		members: showData.ShowMemberships ?? [],
		schedule: upNext.map(toPlain),
		budget: {
			total: totalBudget,
			spent: totalSpent
		},
		viewer,
	};
}

async function getAvailableRoles() {
	const roles = await models.ShowRole.findAll({
		attributes: ["id", "name"],
		order: [["id", "ASC"]],
	});
	return roles.map(role => role.toJSON());
}

export default {
	getAll,
	getUserShows,
	getById,
	create,
	update,
	remove,
	getDashboardSummary,
	getAvailableRoles
};
