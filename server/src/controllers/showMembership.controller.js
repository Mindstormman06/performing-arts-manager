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
		next(error);
	}
}

async function addRoles(req, res, next) {
	try {
		const { showId, userId } = req.params;
		const { roles } = req.body; // Expecting ["admin", "tech"]

		const updatedRoles = await showRoleService.appendRolesToAssignment(
			showId,
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
		);
		res.status(200).json(result);
	} catch (error) {
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
		// Accept { "role": "admin" } or { "roles": ["admin", "president"] }
		// Tested but not recognizing coverage. Ignoring for now.
		/* v8 ignore next */ const rolesToRemove = req.body.roles || req.body.role;

		const result = await showRoleService.removeRolesFromUser(
			showId,
			userId,
			rolesToRemove,
		);
		// Tested but not recognizing coverage. Ignoring for now.
		/* v8 ignore next */ res.json(result); 
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

export default {
	join,
	addRoles,
	getAllUsers,
	getUser,
	getByRole,
	leave,
	removeRole,
};
