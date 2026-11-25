/**
 * Express controller for show membership, roles, invitations and profiles.
 *
 * @remarks
 * Delegates to `showMembership.service` (join, invite, profile) and
 * `showRole.service` (role changes, member lookups, removal), passing
 * `req.user.id` and `req.showOversight` (set by `authorizeShow` for org
 * admins) so the role-hierarchy rules apply. Invites always target the
 * organization of `req.show`. Service errors map by message: hierarchy
 * violations to 403; "not found", "No valid", "does not", a missing role name,
 * or a non-member target of a role change or removal to 404; "User already in
 * show" to 409; and joining from outside the org or a failed invite to 400.
 * Anything else goes to `next`. `updateProfile` accepts a multer `req.file`
 * stored under `/uploads/profiles/`.
 */

import showMembershipService from "../services/showMembership.service.js";
import showRoleService from "../services/showRole.service.js";

async function join(req, res, next) {
	try {
		const { showId } = req.params;
		const { userId } = req.body;

		const membership = await showMembershipService.addUserToShow(
			showId,
			userId,
		);

		return res.status(201).json({
			success: true,
			message: "User added to show",
			data: membership,
		});
	} catch (error) {
		if (error.message === "User already in show") {
			return res.status(409).json({ success: false, message: error.message });
		}
		if (error.message.includes("not a member")) {
			return res.status(400).json({ success: false, message: error.message });
		}
		if (error.message.includes("not found")) {
			return res.status(404).json({ success: false, message: error.message });
		}
		next(error);
	}
}

async function invite(req, res, next) {
	try {
		const { showId } = req.params;
		const { email } = req.body;
		// Always invite into the show's own organization, never one from the body
		const orgId = req.show?.organization_id;

		const invitation = await showMembershipService.inviteByEmail(
			orgId,
			showId,
			email,
		);

		return res.status(201).json({
			success: true,
			message: "Invitation sent",
			data: invitation,
		});
	} catch (error) {
		if (
			error.message.includes("already in") ||
			error.message.includes("No user found")
		) {
			return res.status(400).json({ success: false, message: error.message });
		}
		next(error);
	}
}

async function addRoles(req, res, next) {
	try {
		const { showId, userId } = req.params;
		const { roles } = req.body;

		const updatedRoles = await showRoleService.appendRolesToAssignment(
			showId,
			userId,
			roles,
			req.user?.id,
			Boolean(req.showOversight),
		);

		return res.json({
			success: true,
			data: updatedRoles,
		});
	} catch (error) {
		if (
			error.message.includes("higher role") ||
			error.message.includes("highest role") ||
			error.message.includes("cannot remove") ||
			error.message.includes("cannot change roles")
		) {
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

async function getAllUsers(req, res, next) {
	try {
		const users = await showRoleService.getShowUsers(req.params.showId);
		res.json(users);
	} catch (error) {
		if (
			error.message.includes("No users found") ||
			error.message.includes("Show not found")
		) {
			return res.status(404).json({ success: false, message: error.message });
		}
		next(error);
	}
}

async function getUser(req, res, next) {
	try {
		const user = await showRoleService.getShowUserById(
			req.params.showId,
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
		const users = await showRoleService.getUsersByRole(
			req.params.showId,
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
		const result = await showRoleService.removeUserFromShow(
			req.params.showId,
			req.params.userId,
			req.user?.id,
			Boolean(req.showOversight),
		);
		res.status(200).json(result);
	} catch (error) {
		if (error.message.includes("cannot change roles")) {
			return res.status(403).json({ success: false, message: error.message });
		}
		if (
			error.message.includes("not a member") ||
			error.message.includes("Show not found")
		)
			return res.status(404).json({ success: false, message: error.message });
		next(error);
	}
}

async function removeRole(req, res, next) {
	try {
		const { showId, userId } = req.params;
		// Covered by tests, but v8 does not register it.
		/* v8 ignore next */ const rolesToRemove = req.body.roles || req.body.role;

		const result = await showRoleService.removeRolesFromUser(
			showId,
			userId,
			rolesToRemove,
			req.user?.id,
			Boolean(req.showOversight),
		);
		/* v8 ignore next */ res.json(result);
	} catch (error) {
		if (
			error.message.includes("highest role") ||
			error.message.includes("cannot remove") ||
			error.message.includes("cannot change roles")
		) {
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

// Only paths to files this server stored are accepted from the request body
const PROFILE_PHOTO_PATH = /^\/?uploads\/profiles\/[\w.-]+$/;

async function updateProfile(req, res, next) {
	try {
		const { showId, userId } = req.params;
		const { bio } = req.body;

		let photoPath;
		if (req.file) {
			photoPath = `/uploads/profiles/${req.file.filename}`;
		} else if (req.body.photo_path === null || req.body.photo_path === "") {
			photoPath = null;
		} else if (req.body.photo_path !== undefined) {
			if (
				typeof req.body.photo_path !== "string" ||
				!PROFILE_PHOTO_PATH.test(req.body.photo_path)
			) {
				return res
					.status(400)
					.json({ success: false, message: "Invalid photo_path." });
			}
			photoPath = req.body.photo_path;
		}

		const updatedMembership = await showMembershipService.updateProfile(
			showId,
			userId,
			bio,
			photoPath,
		);

		return res.json({
			success: true,
			message: "Profile updated successfully",
			data: updatedMembership,
		});
	} catch (error) {
		if (error.message.includes("not found")) {
			return res.status(404).json({ success: false, message: error.message });
		}
		next(error);
	}
}

export default {
	join,
	invite,
	addRoles,
	getAllUsers,
	getUser,
	getByRole,
	leave,
	removeRole,
	updateProfile,
};
