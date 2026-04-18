import { Op } from "sequelize";

import models from "../models/index.js";

async function getOrgCalendar(orgId) {
	const shows = await models.Show.findAll({
		where: { organization_id: orgId },
		attributes: ["id"],
	});
	const showIds = shows.map((s) => s.id);

	return await models.Schedule.findAll({
		where: {
			[Op.or]: [{ org_id: orgId }, { show_id: { [Op.in]: showIds } }],
		},
		include: [
			{ model: models.Show, attributes: ["title"] },
			{
				model: models.User,
				as: "attendees",
				attributes: ["id", "fname", "lname"],
				through: { attributes: [] },
			},
		],
		order: [["start_time", "ASC"]],
	});
}

async function getShowCalendar(showId) {
	return await models.Schedule.findAll({
		where: { show_id: showId },
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
	});
}

async function createOrgEvent(orgId, creatorId, data) {
	return await models.Schedule.create({
		...data,
		org_id: orgId,
		creator_id: creatorId,
	});
}

async function createShowEvent(showId, creatorId, data) {
	return await models.Schedule.create({
		...data,
		show_id: showId,
		creator_id: creatorId,
	});
}

async function updateEvent(id, data) {
	const event = await models.Schedule.findByPk(id);
	if (!event) {
		throw new Error("Event not found");
	}
	await event.update(data);
	return event.toJSON();
}

async function deleteEvent(id) {
	const event = await models.Schedule.findByPk(id);
	if (!event) {
		throw new Error("Event not found");
	}
	await event.destroy();
	return { message: "Event deleted successfully" };
}

async function assignUsersToOrgEvent(orgId, eventId, config) {
	const event = await models.Schedule.findByPk(eventId);
	if (!event) {
		throw new Error("Event not found");
	}

	const userIdsToAssign = new Set();

	if (config.all) {
		const memberships = await models.OrgMembership.findAll({
			where: { org_id: orgId },
		});
		memberships.forEach((m) => {
			userIdsToAssign.add(m.users_id);
		});
	} else {
		if (config.roles && config.roles.length > 0) {
			const memberships = await models.OrgMembership.findAll({
				where: { org_id: orgId },
				include: [
					{
						model: models.OrganizationRole,
						as: "assignedRoles",
						where: { name: { [Op.in]: config.roles } },
					},
				],
			});
			memberships.forEach((m) => {
				userIdsToAssign.add(m.users_id);
			});
		}

		if (config.users && config.users.length > 0) {
			config.userIds.forEach((id) => {
				userIdsToAssign.add(id);
			});
		}
	}

	await event.setAttendees(Array.from(userIdsToAssign));

	return await event.getAttendees({ attributes: ["id", "fname", "lname"] });
}

async function assignUsersToShowEvent(showId, eventId, config) {
	const event = await models.Schedule.findByPk(eventId);
	if (!event) {
		throw new Error("Event not found");
	}

	const userIdsToAssign = new Set();
	let characterIdsToAssign = [];

	if (config.all) {
		const memberships = await models.ShowMembership.findAll({
			where: { show_id: showId },
		});
		memberships.forEach((m) => {
			userIdsToAssign.add(m.users_id);
		});
	} else {
		if (config.roles && config.roles.length > 0) {
			const memberships = await models.ShowMembership.findAll({
				where: { show_id: showId },
				include: [
					{
						model: models.ShowRole,
						as: "assignedRoles",
						where: { name: { [Op.in]: config.roles } },
					},
				],
			});
			memberships.forEach((m) => {
				userIdsToAssign.add(m.users_id);
			});
		}

		if (config.userIds && config.userIds.length > 0) {
			config.userIds.forEach((id) => {
				userIdsToAssign.add(id);
			});
		}

		if (config.characterIds && config.characterIds.length > 0) {
			const validCharacters = await models.Casting.findAll({
				where: {
					id: { [Op.in]: config.characterIds },
					show_id: showId,
				},
				attributes: ["id"],
			});
			characterIdsToAssign = validCharacters.map((c) => c.id);
		}
	}

	await event.setAttendees(Array.from(userIdsToAssign));
	await event.setRequiredCharacters(characterIdsToAssign);
	return await event.getAttendees({ attributes: ["id", "fname", "lname"] });
}

async function getPersonalSchedule(userId) {
	return await models.Schedule.findAll({
		include: [
			{
				model: models.User,
				as: "attendees",
				where: { id: userId },
				attributes: [],
				through: { attributes: [] },
			},
			{
				model: models.Show,
				attributes: ["id", "title"],
			},
			{
				model: models.Organization,
				attributes: ["id", "name"],
			},
		],
		order: [["start_time", "ASC"]],
	});
}

export default {
	createOrgEvent,
	createShowEvent,
	getOrgCalendar,
	getShowCalendar,
	updateEvent,
	deleteEvent,
	assignUsersToOrgEvent,
	assignUsersToShowEvent,
	getPersonalSchedule,
};
