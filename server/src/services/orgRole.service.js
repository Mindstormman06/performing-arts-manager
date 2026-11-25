import models from "../models/index.js";
import sequelize from "./db.service.js";

// async function appendRolesToAssignment(orgId, userId, roleNames) {
// 	const org = await models.Organization.findOne({ where: { id: orgId } });
// 	if (!org) throw new Error("Organization not found");
// 	const membership = await models.OrgMembership.findOne({
// 		where: { org_id: orgId, users_id: userId },
// 	});
// 	if (!membership) throw new Error("User is not a member of this organizations");

// 	const roles = await models.Role.findAll({
// 		where: { name: roleNames },
// 	});
// 	if (!roles.length) throw new Error("No valid roles provided");

// 	const roleEntries = roles.map((role) => ({
// 		assignment_id: membership.assignment_id,
// 		role_id: role.id,
// 	}));

// 	await models.OrgRole.bulkCreate(roleEntries, { ignoreDuplicates: true });

// 	return await membership.getAssignedRoles();
// }

const PRESIDENT_ROLE_ERROR =
	"Only a president can grant, remove or change a president's roles";

async function hasOrgRole(orgId, userId, roleName) {
	const membership = await models.OrgMembership.findOne({
		where: { org_id: orgId, users_id: userId, status: "active" },
		include: [
			{
				model: models.OrganizationRole,
				as: "assignedRoles",
				where: { name: roleName },
			},
		],
	});
	return Boolean(membership);
}

// Admins manage the org day to day, but only a president may hand out the
// president role or act on an existing president. Internal calls without an
// acting user are exempt.
async function assertPresidentRules(orgId, actingUserId, targetUserId, roles) {
	if (actingUserId === null || actingUserId === undefined) return;
	const names = (Array.isArray(roles) ? roles : [roles]).map((r) =>
		String(r || "")
			.toLowerCase()
			.trim(),
	);
	const touchesPresident =
		names.includes("president") ||
		(await hasOrgRole(orgId, targetUserId, "president"));
	if (!touchesPresident) return;
	if (!(await hasOrgRole(orgId, actingUserId, "president"))) {
		throw new Error(PRESIDENT_ROLE_ERROR);
	}
}

async function setRolesForAssignment(
	orgId,
	userId,
	roleNames,
	actingUserId = null,
) {
	const org = await models.Organization.findOne({ where: { id: orgId } });
	if (!org) throw new Error("Organization not found");
	const membership = await models.OrgMembership.findOne({
		where: { org_id: orgId, users_id: userId },
	});
	if (!membership)
		throw new Error("User is not a member of this organizations");

	await assertPresidentRules(orgId, actingUserId, userId, roleNames || []);

	await sequelize.transaction(async (transaction) => {
		// Replace all existing roles
		await models.OrgRoleRelationship.destroy({
			where: { assignment_id: membership.assignment_id },
			transaction,
		});

		if (roleNames && roleNames.length > 0) {
			const roles = await models.OrganizationRole.findAll({
				where: { name: roleNames },
				transaction,
			});

			const roleEntries = roles.map((role) => ({
				assignment_id: membership.assignment_id,
				role_id: role.id,
			}));

			await models.OrgRoleRelationship.bulkCreate(roleEntries, {
				transaction,
			});
		}
	});

	return await membership.getAssignedRoles();
}

async function getOrgUsers(orgId) {
	const org = await models.Organization.findOne({ where: { id: orgId } });
	if (!org) throw new Error("Organization not found");

	const memberships = await models.OrgMembership.findAll({
		where: { org_id: orgId },
		include: [
			{ model: models.User },
			{ model: models.OrganizationRole, as: "assignedRoles" },
		],
	});
	if (!memberships.length)
		throw new Error("No users found for this organizations");
	return memberships;
}

async function getOrgUserById(orgId, userId) {
	const org = await models.Organization.findOne({ where: { id: orgId } });
	if (!org) throw new Error("Organization not found");

	const membership = await models.OrgMembership.findOne({
		where: { org_id: orgId, users_id: userId },
		include: [
			{ model: models.User },
			{ model: models.OrganizationRole, as: "assignedRoles" },
		],
	});
	if (!membership) throw new Error("User not found in this organizations");
	return membership;
}

async function getUsersByRole(orgId, roleName) {
	const org = await models.Organization.findOne({ where: { id: orgId } });
	if (!org) throw new Error("Organization not found");

	const role = await models.OrganizationRole.findOne({
		where: { name: roleName },
	});
	if (!role) throw new Error("Role not found");

	return await models.User.findAll({
		include: [
			{
				model: models.OrgMembership,
				where: { org_id: orgId },
				include: [
					{
						model: models.OrganizationRole,
						as: "assignedRoles",
						where: { name: roleName }, // Filter by role name here
					},
				],
			},
		],
	});
}

async function removeUserFromOrg(orgId, userId, actingUserId = null) {
	const org = await models.Organization.findOne({ where: { id: orgId } });
	if (!org) throw new Error("Organization not found");

	if (String(actingUserId) !== String(userId)) {
		await assertPresidentRules(orgId, actingUserId, userId, []);
	}

	await sequelize.transaction(async (transaction) => {
		const deleted = await models.OrgMembership.destroy({
			where: { org_id: orgId, users_id: userId },
			transaction,
		});
		if (!deleted) throw new Error("User is not a member of this organizations");

		// Leaving an org also removes the user from every show in it
		const shows = await models.Show.findAll({
			where: { organization_id: orgId },
			attributes: ["id"],
			transaction,
		});
		if (shows.length) {
			await models.ShowMembership.destroy({
				where: { users_id: userId, show_id: shows.map((s) => s.id) },
				transaction,
			});
		}
	});
	return { message: "User removed from organizations successfully" };
}

async function removeRolesFromUser(
	orgId,
	userId,
	roleNames,
	actingUserId = null,
) {
	const namesArray = Array.isArray(roleNames) ? roleNames : [roleNames];

	if (!namesArray.length || !namesArray[0])
		throw new Error("Role names are required");

	await assertPresidentRules(orgId, actingUserId, userId, namesArray);

	const membership = await models.OrgMembership.findOne({
		where: { org_id: orgId, users_id: userId },
	});

	const roles = await models.OrganizationRole.findAll({
		where: { name: namesArray },
	});

	if (!membership || !roles.length)
		throw new Error("Membership or Roles not found");

	const roleIds = roles.map((r) => r.id);

	const deletedCount = await models.OrgRoleRelationship.destroy({
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
	// appendRolesToAssignment,
	setRolesForAssignment,
	getOrgUsers,
	getOrgUserById,
	getUsersByRole,
	removeUserFromOrg,
	removeRolesFromUser,
};
