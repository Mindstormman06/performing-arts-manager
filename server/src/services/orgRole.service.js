/**
 * Service for organization roles and member management.
 *
 * @remarks
 * Exports functions to replace a member's roles, list members (all, one, or by
 * role), remove a member and revoke roles. Reads Organization, User and
 * OrganizationRole; writes OrgMembership, OrgRoleRelationship and
 * ShowMembership. Replacing roles and removing a member each run in a
 * transaction, and removal also deletes the user's memberships in the
 * organization's shows. When an acting user id is passed, only a president may
 * grant or revoke the president role or act on a president. Callers must
 * already have checked org admin rights.
 */

import models from "../models/index.js";
import sequelize from "./db.service.js";

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

// Only a president may grant or revoke the president role or act on a
// president; internal calls without an acting user skip the check.
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
						where: { name: roleName },
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
	setRolesForAssignment,
	getOrgUsers,
	getOrgUserById,
	getUsersByRole,
	removeUserFromOrg,
	removeRolesFromUser,
};
