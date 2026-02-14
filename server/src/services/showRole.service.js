import models from "../models/index.js";

async function appendRolesToAssignment(showId, userId, roleNames) {
	const show = await models.Show.findOne({ where: { id: showId } });
	if (!show) throw new Error("Show not found");
	const membership = await models.ShowMembership.findOne({
		where: { show_id: showId, users_id: userId },
	});
	if (!membership) throw new Error("User is not a member of this show");

	const roles = await models.Role.findAll({
		where: { name: roleNames },
	});
	if (!roles.length) throw new Error("No valid roles provided");

	const roleEntries = roles.map((role) => ({
		assignment_id: membership.assignment_id,
		role_id: role.id,
	}));

	await models.ShowRole.bulkCreate(roleEntries, { ignoreDuplicates: true });

	return await membership.getAssignedRoles();
}

async function getShowUsers(showId) {
	const show = await models.Show.findOne({ where: { id: showId } });
	if (!show) throw new Error("Show not found");

	const memberships = await models.ShowMembership.findAll({
		where: { show_id: showId },
		include: [
			{ model: models.User },
			{ model: models.Role, as: "assignedRoles" },
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
			{ model: models.Role, as: "assignedRoles" },
		],
	});
	if (!membership) throw new Error("User not found in this show");
	return membership;
}

async function getUsersByRole(showId, roleName) {
	const show = await models.Show.findOne({ where: { id: showId } });
	if (!show) throw new Error("Show not found");

	const role = await models.Role.findOne({ where: { name: roleName } });
	if (!role) throw new Error("Role not found");

	return await models.User.findAll({
		include: [
			{
				model: models.ShowMembership,
				where: { show_id: showId },
				include: [
					{
						model: models.Role,
						as: "assignedRoles",
						where: { name: roleName }, // Filter by role name here
					},
				],
			},
		],
	});
}

async function removeUserFromShow(showId, userId) {
	const show = await models.Show.findOne({ where: { id: showId } });
	if (!show) throw new Error("Show not found");

	const deleted = await models.ShowMembership.destroy({
		where: { show_id: showId, users_id: userId },
	});
	if (!deleted) throw new Error("User is not a member of this show");
	return { message: "User removed from show successfully" };
}

async function removeRolesFromUser(showId, userId, roleNames) {
	const namesArray = Array.isArray(roleNames) ? roleNames : [roleNames];

	if (!namesArray.length || !namesArray[0])
		throw new Error("Role names are required");

	const membership = await models.ShowMembership.findOne({
		where: { show_id: showId, users_id: userId },
	});

	const roles = await models.Role.findAll({
		where: { name: namesArray },
	});

	if (!membership || !roles.length)
		throw new Error("Membership or Roles not found");

	const roleIds = roles.map((r) => r.id);

	const deletedCount = await models.ShowRole.destroy({
		where: {
			assignment_id: membership.assignment_id,
			role_id: roleIds,
		},
	});

	if (deletedCount === 0)
		throw new Error("User does not have any of these roles");

	return { message: `${deletedCount} role(s) removed successfully` };
}

export default {
	appendRolesToAssignment,
	getShowUsers,
	getShowUserById,
	getUsersByRole,
	removeUserFromShow,
	removeRolesFromUser,
};
