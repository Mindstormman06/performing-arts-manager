/**
 * Express controller for organization membership, roles and invitations.
 *
 * @remarks
 * Delegates to `orgMembership.service` (join, invite, the caller's own
 * memberships) and `orgRole.service` (role changes, member lookups, removal),
 * passing `req.user.id` as the acting user so president-only rules apply.
 * Service errors map by message: "Only a president" to 403; "not found", "not
 * a member", "No valid", "does not" or a missing role name to 404; an existing
 * member on join to 409; and invite failures to 400. Anything else goes to
 * `next`. `respondToInvite` rejects anything but "accept" or "decline" with
 * 400, then uses the models directly in one transaction: accepting activates
 * the caller's pending OrgMembership and their pending ShowMemberships in that
 * org, and declining deletes them.
 */

import { Op } from "sequelize";

import models from "../models/index.js";
import sequelize from "../services/db.service.js";
import orgMembershipService from "../services/orgMembership.service.js";
import orgRoleService from "../services/orgRole.service.js";

async function join(req, res, next) {
	try {
		const { orgId } = req.params;
		const { userId } = req.body;

		const membership = await orgMembershipService.addUserToOrg(orgId, userId);

		return res.status(201).json({
			success: true,
			message: "User added to organizations",
			data: membership,
		});
	} catch (error) {
		if (error.message === "User already in organizations") {
			return res.status(409).json({ success: false, message: error.message });
		}
		if (error.message.endsWith("not found")) {
			return res.status(404).json({ success: false, message: error.message });
		}
		next(error);
	}
}

async function addRoles(req, res, next) {
	try {
		const { orgId, userId } = req.params;
		const { roles } = req.body;

		const updatedRoles = await orgRoleService.setRolesForAssignment(
			orgId,
			userId,
			roles,
			req.user?.id,
		);

		return res.json({
			success: true,
			data: updatedRoles,
		});
	} catch (error) {
		if (error.message.includes("Only a president")) {
			return res.status(403).json({ success: false, message: error.message });
		}
		if (
			error.message.includes("No valid") ||
			error.message.includes("not a member") ||
			error.message.includes("not found")
		) {
			return res.status(404).json({ success: false, message: error.message });
		}
		next(error);
	}
}

async function getUserOrganizations(req, res, next) {
	try {
		res.json(await orgMembershipService.getUserOrganizations(req.user.id));
	} catch (error) {
		next(error);
	}
}

async function getAllUsers(req, res, next) {
	try {
		const users = await orgRoleService.getOrgUsers(req.params.orgId);
		res.json(users);
	} catch (error) {
		if (
			error.message.includes("No users found") ||
			error.message.includes("Organization not found")
		) {
			return res.status(404).json({ success: false, message: error.message });
		}
		next(error);
	}
}

async function getUser(req, res, next) {
	try {
		const user = await orgRoleService.getOrgUserById(
			req.params.orgId,
			req.params.userId,
		);
		res.json(user);
	} catch (error) {
		if (error.message.includes("not found")) {
			return res.status(404).json({ success: false, message: error.message });
		}
		next(error);
	}
}

async function getByRole(req, res, next) {
	try {
		const users = await orgRoleService.getUsersByRole(
			req.params.orgId,
			req.query.role,
		);
		res.json(users);
	} catch (error) {
		if (error.message.includes("not found")) {
			return res.status(404).json({ success: false, message: error.message });
		}
		next(error);
	}
}

async function leave(req, res, next) {
	try {
		const result = await orgRoleService.removeUserFromOrg(
			req.params.orgId,
			req.params.userId,
			req.user?.id,
		);
		res.status(200).json(result);
	} catch (error) {
		if (error.message.includes("Only a president")) {
			return res.status(403).json({ success: false, message: error.message });
		}
		if (
			error.message.includes("not a member") ||
			error.message.includes("Organization not found")
		)
			return res.status(404).json({ success: false, message: error.message });
		next(error);
	}
}

async function removeRole(req, res, next) {
	try {
		const { orgId, userId } = req.params;
		const rolesToRemove = req.body.roles || req.body.role;

		const result = await orgRoleService.removeRolesFromUser(
			orgId,
			userId,
			rolesToRemove,
			req.user?.id,
		);
		res.json(result);
	} catch (error) {
		if (error.message.includes("Only a president")) {
			return res.status(403).json({ success: false, message: error.message });
		}
		if (
			error.message.includes("required") ||
			error.message.includes("not found") ||
			error.message.includes("does not")
		) {
			return res.status(404).json({ success: false, message: error.message });
		}
		next(error);
	}
}

async function invite(req, res, next) {
	try {
		const { orgId } = req.params;
		const { email } = req.body;

		const invitation = await orgMembershipService.inviteByEmail(orgId, email);

		return res.status(201).json({
			success: true,
			message: "Invitation sent successfully",
			data: invitation,
		});
	} catch (error) {
		if (
			error.message.includes("No user found") ||
			error.message.includes("already in")
		) {
			return res.status(400).json({ success: false, message: error.message });
		}
		next(error);
	}
}

async function respondToInvite(req, res, next) {
	try {
		const { orgId } = req.params;
		const { action } = req.body;
		const userId = req.user.id;

		if (action !== "accept" && action !== "decline") {
			return res
				.status(400)
				.json({ success: false, message: "Invalid action." });
		}

		const handled = await sequelize.transaction(async (transaction) => {
			const membership = await models.OrgMembership.findOne({
				where: { org_id: orgId, users_id: userId, status: "pending" },
				transaction,
			});
			if (!membership) return false;

			const orgShows = await models.Show.findAll({
				where: { organization_id: orgId },
				transaction,
			});
			const showIds = orgShows.map((show) => show.id);
			const pendingShowInvites = {
				users_id: userId,
				show_id: { [Op.in]: showIds },
				status: "pending",
			};

			if (action === "accept") {
				await membership.update({ status: "active" }, { transaction });
				if (showIds.length > 0) {
					await models.ShowMembership.update(
						{ status: "active" },
						{ where: pendingShowInvites, transaction },
					);
				}
			} else {
				await membership.destroy({ transaction });
				if (showIds.length > 0) {
					await models.ShowMembership.destroy({
						where: pendingShowInvites,
						transaction,
					});
				}
			}
			return true;
		});

		if (!handled) {
			return res.status(404).json({ message: "Invite not found." });
		}
		return res.json({
			success: true,
			message:
				action === "accept" ? "Invitation accepted!" : "Invitation declined.",
		});
	} catch (error) {
		console.error(error);
		next(error);
	}
}

export default {
	join,
	addRoles,
	getAllUsers,
	getUser,
	getByRole,
	leave,
	removeRole,
	respondToInvite,
	invite,
	getUserOrganizations,
};
