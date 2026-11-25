/**
 * Service for show roles and member management.
 *
 * @remarks
 * Exports functions to replace a member's roles, list members (all, one, or by
 * role), remove a member and revoke roles. Reads Show and ShowRole; writes
 * ShowMembership and its role associations. With an acting user id and no org
 * oversight, acting on someone else requires outranking the target and every
 * changed role by `SHOW_ROLE_PRIORITY`; acting on yourself can never raise or
 * remove your own highest role. Nothing is transactional. Callers must
 * already have checked show membership and manager rights.
 */

import models from "../models/index.js";
import {
	getHighestRoleWeight,
	isSelfDemotion,
	normalizeRoleNames,
	SHOW_ROLE_PRIORITY,
} from "./rolePriority.service.js";

const ROLE_HIERARCHY_ERROR =
	"You cannot change roles at or above your own highest role";

// The target's current roles and every role being changed must rank strictly
// below the actor's highest show role.
async function assertOutranks(
	showId,
	actingUserId,
	targetRoleNames,
	changedRoleNames,
) {
	const actor = await models.ShowMembership.findOne({
		where: { show_id: showId, users_id: actingUserId },
		include: [{ model: models.ShowRole, as: "assignedRoles" }],
	});
	const actorWeight = getHighestRoleWeight(
		(actor?.assignedRoles || []).map((r) => r.name),
		SHOW_ROLE_PRIORITY,
	);
	const targetWeight = getHighestRoleWeight(
		targetRoleNames,
		SHOW_ROLE_PRIORITY,
	);
	const changedWeight = getHighestRoleWeight(
		changedRoleNames,
		SHOW_ROLE_PRIORITY,
	);
	if (targetWeight >= actorWeight || changedWeight >= actorWeight) {
		throw new Error(ROLE_HIERARCHY_ERROR);
	}
}

function isOtherUser(actingUserId, userId, actorHasOversight) {
	return (
		actingUserId !== null &&
		actingUserId !== undefined &&
		!actorHasOversight &&
		Number(actingUserId) !== Number(userId)
	);
}

async function appendRolesToAssignment(
	showId,
	userId,
	roleNames,
	actingUserId = null,
	actorHasOversight = false,
) {
	const show = await models.Show.findOne({ where: { id: showId } });
	if (!show) throw new Error("Show not found");

	const membership = await models.ShowMembership.findOne({
		where: { show_id: showId, users_id: userId },
		include: [{ model: models.ShowRole, as: "assignedRoles" }],
	});
	if (!membership) throw new Error("User is not a member of this show");

	let roles = [];
	if (roleNames && roleNames.length > 0) {
		roles = await models.ShowRole.findAll({
			where: { name: roleNames },
		});
		if (!roles.length) throw new Error("No valid roles provided");
	}

	if (isOtherUser(actingUserId, userId, actorHasOversight)) {
		const currentNames = normalizeRoleNames(
			membership.assignedRoles.map((role) => role.name),
		);
		const nextNames = normalizeRoleNames(roles.map((role) => role.name));
		const changed = [
			...currentNames.filter((n) => !nextNames.includes(n)),
			...nextNames.filter((n) => !currentNames.includes(n)),
		];
		await assertOutranks(showId, actingUserId, currentNames, changed);
	}

	if (Number(actingUserId) === Number(userId)) {
		const currentRoleNames = membership.assignedRoles.map((role) => role.name);
		const nextRoleNames = normalizeRoleNames(roles.map((role) => role.name));
		const currentHighestWeight = getHighestRoleWeight(
			currentRoleNames,
			SHOW_ROLE_PRIORITY,
		);
		const nextHighestWeight = getHighestRoleWeight(
			nextRoleNames,
			SHOW_ROLE_PRIORITY,
		);

		if (nextHighestWeight > currentHighestWeight) {
			throw new Error("You cannot assign yourself a higher role");
		}

		if (isSelfDemotion(currentRoleNames, nextRoleNames, SHOW_ROLE_PRIORITY)) {
			throw new Error("You cannot remove your highest role from yourself");
		}
	}

	await membership.setAssignedRoles(roles);

	const updatedMembership = await models.ShowMembership.findOne({
		where: { show_id: showId, users_id: userId },
		include: [{ model: models.ShowRole, as: "assignedRoles" }],
	});

	return updatedMembership.assignedRoles;
}

async function getShowUsers(showId) {
	const show = await models.Show.findOne({ where: { id: showId } });
	if (!show) throw new Error("Show not found");

	const memberships = await models.ShowMembership.findAll({
		where: { show_id: showId },
		include: [
			{ model: models.User },
			{ model: models.ShowRole, as: "assignedRoles" },
		],
	});
	if (!memberships.length) throw new Error("No users found for this show");
	return memberships;
}

async function getShowUserById(showId, userId) {
	const show = await models.Show.findOne({ where: { id: showId } });
	if (!show) throw new Error("Show not found");

	const membership = await models.ShowMembership.findOne({
		where: { show_id: showId, users_id: userId },
		include: [
			{ model: models.User },
			{ model: models.ShowRole, as: "assignedRoles" },
		],
	});
	if (!membership) throw new Error("User not found in this show");
	return membership;
}

async function getUsersByRole(showId, roleName) {
	const show = await models.Show.findOne({ where: { id: showId } });
	if (!show) throw new Error("Show not found");

	const role = await models.ShowRole.findOne({ where: { name: roleName } });
	if (!role) throw new Error("Role not found");

	return await models.User.findAll({
		include: [
			{
				model: models.ShowMembership,
				where: { show_id: showId },
				include: [
					{
						model: models.ShowRole,
						as: "assignedRoles",
						where: { name: roleName },
					},
				],
			},
		],
	});
}

async function removeUserFromShow(
	showId,
	userId,
	actingUserId = null,
	actorHasOversight = false,
) {
	const show = await models.Show.findOne({ where: { id: showId } });
	if (!show) throw new Error("Show not found");

	if (isOtherUser(actingUserId, userId, actorHasOversight)) {
		const target = await models.ShowMembership.findOne({
			where: { show_id: showId, users_id: userId },
			include: [{ model: models.ShowRole, as: "assignedRoles" }],
		});
		if (target) {
			await assertOutranks(
				showId,
				actingUserId,
				target.assignedRoles.map((role) => role.name),
				[],
			);
		}
	}

	const deleted = await models.ShowMembership.destroy({
		where: { show_id: showId, users_id: userId },
	});
	if (!deleted) throw new Error("User is not a member of this show");
	return { message: "User removed from show successfully" };
}

async function removeRolesFromUser(
	showId,
	userId,
	roleNames,
	actingUserId = null,
	actorHasOversight = false,
) {
	const namesArray = normalizeRoleNames(
		Array.isArray(roleNames) ? roleNames : [roleNames],
	);

	if (!namesArray.length || !namesArray[0])
		throw new Error("Role names are required");

	const membership = await models.ShowMembership.findOne({
		where: { show_id: showId, users_id: userId },
		include: [{ model: models.ShowRole, as: "assignedRoles" }],
	});

	const roles = await models.ShowRole.findAll({
		where: { name: namesArray },
	});

	if (!membership || !roles.length)
		throw new Error("Membership or Roles not found");

	const hasAny = membership.assignedRoles
		.map((r) => r.name)
		.filter((n) => namesArray.includes(n));
	if (!hasAny.length) {
		throw new Error("User does not have any of these roles");
	}

	if (isOtherUser(actingUserId, userId, actorHasOversight)) {
		await assertOutranks(
			showId,
			actingUserId,
			membership.assignedRoles.map((role) => role.name),
			namesArray,
		);
	}

	if (Number(actingUserId) === Number(userId)) {
		const currentRoleNames = normalizeRoleNames(
			membership.assignedRoles.map((role) => role.name),
		);
		const nextRoleNames = currentRoleNames.filter(
			(roleName) => !namesArray.includes(roleName),
		);

		if (isSelfDemotion(currentRoleNames, nextRoleNames, SHOW_ROLE_PRIORITY)) {
			throw new Error("You cannot remove your highest role from yourself");
		}
	}

	await membership.removeAssignedRoles(roles);

	return { message: `role(s) removed successfully` };
}

export default {
	appendRolesToAssignment,
	getShowUsers,
	getShowUserById,
	getUsersByRole,
	removeUserFromShow,
	removeRolesFromUser,
};
