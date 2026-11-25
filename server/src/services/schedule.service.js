/**
 * Service for organization and show calendar events.
 *
 * @remarks
 * Exports functions to list org, show and personal calendars, create, update
 * and delete events, and set event attendees. Reads Show, OrgMembership,
 * ShowMembership, their roles and Casting; writes Schedule and its attendee
 * and required-character associations. Only title, times, location and
 * description come from client data. Updates, deletes and assignment find
 * events within an org or show scope and report events outside it as not
 * found, and assignees are limited to members of that org or show. Nothing is
 * transactional. Callers must already have checked the acting user's role.
 */

import { Op } from "sequelize";

import models from "../models/index.js";

const EDITABLE_EVENT_FIELDS = [
	"title",
	"start_time",
	"end_time",
	"location",
	"description",
];

function pickEventFields(data = {}) {
	return Object.fromEntries(
		Object.entries(data).filter(
			([field, value]) =>
				EDITABLE_EVENT_FIELDS.includes(field) && value !== undefined,
		),
	);
}

// { orgId } matches org events and events of shows in that org; { showId }
// matches only that show's events.
async function findScopedEvent(eventId, scope = {}) {
	const event = await models.Schedule.findByPk(eventId);
	if (!event) throw new Error("Event not found");

	if (scope.showId !== undefined) {
		if (String(event.show_id) !== String(scope.showId)) {
			throw new Error("Event not found");
		}
		return event;
	}

	if (scope.orgId !== undefined) {
		if (String(event.org_id) === String(scope.orgId)) return event;
		if (event.show_id) {
			const show = await models.Show.findByPk(event.show_id);
			if (show && String(show.organization_id) === String(scope.orgId)) {
				return event;
			}
		}
		throw new Error("Event not found");
	}

	throw new Error("Event scope is required");
}

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
		...pickEventFields(data),
		org_id: orgId,
		creator_id: creatorId,
	});
}

async function createShowEvent(showId, creatorId, data) {
	return await models.Schedule.create({
		...pickEventFields(data),
		show_id: showId,
		creator_id: creatorId,
	});
}

async function updateEvent(id, data, scope) {
	const event = await findScopedEvent(id, scope);
	await event.update(pickEventFields(data));
	return event.toJSON();
}

async function deleteEvent(id, scope) {
	const event = await findScopedEvent(id, scope);
	await event.destroy();
	return { message: "Event deleted successfully" };
}

async function assignUsersToOrgEvent(orgId, eventId, config) {
	const event = await findScopedEvent(eventId, { orgId });

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

		if (config.userIds && config.userIds.length > 0) {
			// Only allow assigning users who are members of this organization
			const memberships = await models.OrgMembership.findAll({
				where: { org_id: orgId, users_id: { [Op.in]: config.userIds } },
				attributes: ["users_id"],
			});
			memberships.forEach((m) => {
				userIdsToAssign.add(m.users_id);
			});
		}
	}

	await event.setAttendees(Array.from(userIdsToAssign));

	return await event.getAttendees({ attributes: ["id", "fname", "lname"] });
}

async function assignUsersToShowEvent(showId, eventId, config) {
	const event = await findScopedEvent(eventId, { showId });

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
			// Only allow assigning users who are members of this show
			const memberships = await models.ShowMembership.findAll({
				where: { show_id: showId, users_id: { [Op.in]: config.userIds } },
				attributes: ["users_id"],
			});
			memberships.forEach((m) => {
				userIdsToAssign.add(m.users_id);
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
