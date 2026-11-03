import fs from "node:fs";

import jwt from "jsonwebtoken";

import { JWT_SECRET } from "../config/jwt.config.js";
import models from "../models/index.js";

// Org-level roles that may manage everything in the org, including its shows
export const ORG_ADMIN_ROLES = ["admin", "president"];
const ORG_SHOW_OVERSIGHT_ROLES = ["admin", "president", "board-member"];

const roleNames = (membership) =>
	(membership?.assignedRoles || []).map((r) => r.name);

// Remove a file multer already wrote when the request is then rejected
const discardUpload = (req) => {
	if (req.file?.path) {
		// eslint-disable-next-line security/detect-non-literal-fs-filename
		fs.promises.unlink(req.file.path).catch(() => {});
	}
};

export const authenticate = async (req, res, next) => {
	const header = req.header("Authorization") || "";
	const token = header.startsWith("Bearer ") ? header.slice(7) : null;

	if (!token) {
		return res
			.status(401)
			.json({ success: false, message: "Access denied. No token provided." });
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET);

		const user = await models.User.findByPk(decoded.id);
		if (!user) {
			return res.status(401).json({
				success: false,
				message: "User no longer exists. Please log in again.",
			});
		}

		req.user = decoded;
		next();
	} catch (error) {
		const statusCode = error.name === "JsonWebTokenError" ? 400 : 401;
		res
			.status(statusCode)
			.json({ success: false, message: `Invalid token: ${error.message}` });
	}
};

export const authorizeOrg = (requiredRoles = []) => {
	return async (req, res, next) => {
		let orgId = req.params.orgId || req.params.id || req.body?.organization_id;
		const userId = req.user.id;

		if (orgId === "undefined") {
			orgId = undefined;
		}

		if (!orgId)
			return res.status(400).json({ message: "Organization ID is missing" });

		const membership = await models.OrgMembership.findOne({
			where: { org_id: orgId, users_id: userId, status: "active" },
			include: [{ model: models.OrganizationRole, as: "assignedRoles" }],
		});

		if (!membership) {
			return res.status(403).json({
				success: false,
				message: "Not a member of this organization.",
			});
		}

		const userRoles = roleNames(membership);
		req.orgRoles = userRoles;

		const hasPermission = requiredRoles.some((role) =>
			userRoles.includes(role),
		);

		if (requiredRoles.length > 0 && !hasPermission) {
			return res.status(403).json({
				success: false,
				message: "Insufficient permissions.",
			});
		}

		next();
	};
};

export const authorizeShow = (requiredRoles = []) => {
	return async (req, res, next) => {
		const showId = req.params.showId || req.params.id;
		const userId = req.user.id;

		const show = await models.Show.findByPk(showId);
		if (!show) {
			return res
				.status(404)
				.json({ success: false, message: "Show not found." });
		}

		req.show = show;

		const orgMembership = await models.OrgMembership.findOne({
			where: {
				org_id: show.organization_id,
				users_id: userId,
				status: "active",
			},
			include: [{ model: models.OrganizationRole, as: "assignedRoles" }],
		});

		if (orgMembership) {
			const orgRoles = roleNames(orgMembership);
			if (ORG_SHOW_OVERSIGHT_ROLES.some((r) => orgRoles.includes(r))) {
				req.showOversight = true;
				return next();
			}
		}

		const membership = await models.ShowMembership.findOne({
			where: { show_id: showId, users_id: userId, status: "active" },
			include: [{ model: models.ShowRole, as: "assignedRoles" }],
		});

		if (!membership) {
			return res
				.status(403)
				.json({ success: false, message: "Not a member of this show." });
		}

		const userRoles = roleNames(membership);
		req.showRoles = userRoles;

		const hasPermission = requiredRoles.some((role) =>
			userRoles.includes(role),
		);

		if (requiredRoles.length > 0 && !hasPermission) {
			return res
				.status(403)
				.json({ success: false, message: "Insufficient permissions." });
		}

		next();
	};
};

export const authorizeInventoryDept = (level) => {
	return async (req, res, next) => {
		const deny = (status, message) => {
			discardUpload(req);
			return res.status(status).json({ success: false, message });
		};

		const userId = req.user.id;
		let userRoles = [];

		if (level === "org") {
			const membership = await models.OrgMembership.findOne({
				where: { org_id: req.params.orgId, users_id: userId, status: "active" },
				include: [{ model: models.OrganizationRole, as: "assignedRoles" }],
			});
			if (!membership) return deny(403, "Not a member of this organization.");
			userRoles = roleNames(membership);
		} else if (level === "show") {
			const membership = await models.ShowMembership.findOne({
				where: {
					show_id: req.params.showId,
					users_id: userId,
					status: "active",
				},
				include: [{ model: models.ShowRole, as: "assignedRoles" }],
			});
			if (!membership) return deny(403, "Not a member of this show.");
			userRoles = roleNames(membership);
		}

		const allowedBaseRoles =
			level === "org" ? ORG_ADMIN_ROLES : ["director", "stage-manager"];
		if (allowedBaseRoles.some((role) => userRoles.includes(role))) {
			return next();
		}

		const inDept = async (deptId) => {
			const dept = await models.Department.findByPk(deptId);
			return Boolean(dept && userRoles.includes(dept.name.toLowerCase()));
		};

		// The department that matters is the item's actual department, never one
		// supplied by the client. If the client is moving the item to another
		// department, they must belong to that one as well.
		const deptsToCheck = [];
		if (req.params.inventoryId) {
			const item = await models.Inventory.findByPk(req.params.inventoryId);
			if (!item) return deny(404, "Inventory item not found.");
			deptsToCheck.push(item.dept_id);
		}
		const requestedDept = req.body?.dept_id;
		if (
			requestedDept !== undefined &&
			requestedDept !== null &&
			requestedDept !== "" &&
			!deptsToCheck.some((d) => String(d) === String(requestedDept))
		) {
			deptsToCheck.push(requestedDept);
		}

		if (deptsToCheck.length > 0) {
			let allowed = true;
			for (const deptId of deptsToCheck) {
				if (!(await inDept(deptId))) {
					allowed = false;
					break;
				}
			}
			if (allowed) return next();
		}

		return deny(
			403,
			"Insufficient permissions. You must be in this department to manage its inventory.",
		);
	};
};

/**
 * True when the authenticated user is acting on their own record
 * (req.params[param] === req.user.id).
 */
export const isSelf = (req, param = "userId") =>
	// eslint-disable-next-line security/detect-object-injection -- param is a route name chosen in code
	String(req.params[param]) === String(req.user?.id);
