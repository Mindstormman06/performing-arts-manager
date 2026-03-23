import jwt from "jsonwebtoken";

import models from "../models/index.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_theatre_secret";

export const authenticate = async (req, res, next) => {
	const token = req.header("Authorization")?.replace("Bearer ", "");

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
		let orgId = req.params.orgId || req.params.id || req.body.organization_id;
		const userId = req.user.id;

		if (orgId === "undefined") {
			orgId = undefined;
		}

		if (!orgId)
			return res.status(400).json({ message: "Organization ID is missing" });

		const membership = await models.OrgMembership.findOne({
			where: { org_id: orgId, users_id: userId },
			include: [{ model: models.OrganizationRole, as: "assignedRoles" }],
		});
		if (!membership) {
			console.debug("authorizeOrg: membership not found", { orgId, userId });
		}

		if (!membership) {
			return res.status(403).json({
				success: false,
				message: "Not a member of this organization.",
			});
		}

		const userRoles = membership.assignedRoles.map((r) => r.name);
		console.debug("authorizeOrg: userRoles", userRoles);

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
			return res.status(404).json({ success: false, message: "Show not found." });
		}

		const orgMembership = await models.OrgMembership.findOne({
			where: { org_id: show.organization_id, users_id: userId },
			include: [{ model: models.OrganizationRole, as: "assignedRoles" }]
		});

		if (orgMembership) {
			const orgRoles = orgMembership.assignedRoles.map(r => r.name);
			if (orgRoles.includes("president") || orgRoles.includes("board-member")) {
				return next();
			}
		}

		const membership = await models.ShowMembership.findOne({
			where: { show_id: showId, users_id: userId },
			include: [{ model: models.ShowRole, as: "assignedRoles" }],
		});

		if (!membership) {
			return res
				.status(403)
				.json({ success: false, message: "Not a member of this show." });
		}

		const userRoles = membership.assignedRoles.map((r) => r.name);

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
		const userId = req.user.id;
		let userRoles = [];
		let entityId;

		if (level === "org") {
			entityId = req.params.orgId;
			const membership = await models.OrgMembership.findOne({
				where: { org_id: entityId, users_id: userId },
				include: [{ model: models.OrganizationRole, as: "assignedRoles" }],
			});
			if (!membership) return res.status(403).json({ success: false, message: "Not a member of this organization." });
			userRoles = membership.assignedRoles.map((r) => r.name);
		} else if (level === "show") {
			entityId = req.params.showId;
			const membership = await models.ShowMembership.findOne({
				where: { show_id: entityId, users_id: userId },
				include: [{ model: models.ShowRole, as: "assignedRoles" }],
			});
			if (!membership) return res.status(403).json({ success: false, message: "Not a member of this show." });
			userRoles = membership.assignedRoles.map((r) => r.name);
		}

		const allowedBaseRoles = level === "org" ? ["admin", "president"] : ["director", "stage-manager"];
		const hasBaseRole = allowedBaseRoles.some((role) => userRoles.includes(role));

		if (hasBaseRole) {
			return next();
		}

		let deptIdToCheck = req.body?.dept_id;

		if (!deptIdToCheck && req.params.inventoryId) {
			const item = await models.Inventory.findByPk(req.params.inventoryId);
			if (!item) {
				return res.status(404).json({ success: false, message: "Inventory item not found." });
			}
			deptIdToCheck = item.dept_id;
		}

		if (deptIdToCheck) {
			const dept = await models.Department.findByPk(deptIdToCheck);
			if (dept) {
				const deptRoleName = dept.name.toLowerCase();
				if (userRoles.includes(deptRoleName)) {
					return next();
				}
			}
		}

		return res.status(403).json({ 
			success: false, 
			message: "Insufficient permissions. You must be in this department to manage its inventory." 
		});
	};
};