import models from "../models/index.js";

async function appendRolesToAssignment(showId, userId, roleNames) {
	const show = await models.Show.findOne({ where: { id: showId } });
	if (!show) throw new Error("Show not found");
	
	const membership = await models.ShowMembership.findOne({
		where: { show_id: showId, users_id: userId },
	});
	if (!membership) throw new Error("User is not a member of this show");

    let roles = [];
    if (roleNames && roleNames.length > 0) {
        roles = await models.ShowRole.findAll({
            where: { name: roleNames },
        });
        if (!roles.length) throw new Error("No valid roles provided");
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