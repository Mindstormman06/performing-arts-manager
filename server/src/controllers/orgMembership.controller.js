import { Op } from "sequelize";

import models from "../models/index.js";
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
		next(error);
	}
}

async function addRoles(req, res, next) {
	try {
		const { orgId, userId } = req.params;
		const { roles } = req.body; // Expecting ["admin", "tech"]

		const updatedRoles = await orgRoleService.setRolesForAssignment(
			orgId,
			userId,
			roles,
		);

		return res.json({
			success: true,
			data: updatedRoles,
		});
	} catch (error) {
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
		);
		res.status(200).json(result);
	} catch (error) {
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
		// Accept { "role": "admin" } or { "roles": ["admin", "president"] }
		const rolesToRemove = req.body.roles || req.body.role;

		const result = await orgRoleService.removeRolesFromUser(
			orgId,
			userId,
			rolesToRemove,
		);
		res.json(result);
	} catch (error) {
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

		const membership = await models.OrgMembership.findOne({
			where: { org_id: orgId, users_id: userId, status: "pending" },
		});

		if (!membership) {
			return res.status(404).json({ message: "Invite not found." });
		}

		// 1. Get all shows belonging to this organizations
		const orgShows = await models.Show.findAll({
			where: { organization_id: orgId },
		});
		const showIds = orgShows.map((show) => show.id);

		if (action === "accept") {
			// Update the Organization membership
			await membership.update({ status: "active" });

			// Cascade the 'active' status to any pending Show memberships in this org
			if (showIds.length > 0) {
				await models.ShowMembership.update(
					{ status: "active" },
					{
						where: {
							users_id: userId,
							show_id: { [Op.in]: showIds },
							status: "pending",
						},
					},
				);
			}

			return res.json({ success: true, message: "Invitation accepted!" });
		} else if (action === "decline") {
			// Remove the pending Organization membership entirely
			await membership.destroy();

			// Cascade the deletion to any pending Show memberships in this org
			if (showIds.length > 0) {
				await models.ShowMembership.destroy({
					where: {
						users_id: userId,
						show_id: { [Op.in]: showIds },
						status: "pending",
					},
				});
			}

			return res.json({ success: true, message: "Invitation declined." });
		} else {
			return res
				.status(400)
				.json({ success: false, message: "Invalid action." });
		}
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
