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
		// invalid or malformed token should be treated as bad request
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

		// guard against the literal string 'undefined' which can occur when test
		// filters skip earlier setup and a template string gets passed an undefined
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

// --- NEW INVENTORY MIDDLEWARE ---
export const authorizeInventoryDept = (level) => {
	return async (req, res, next) => {
		const userId = req.user.id;
		let userRoles = [];
		let entityId;

		// 1. Fetch membership and roles based on context level
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

		// 2. Check for "Super" Roles that can manage everything
		const allowedBaseRoles = level === "org" ? ["admin", "president"] : ["director", "stage-manager"];
		const hasBaseRole = allowedBaseRoles.some((role) => userRoles.includes(role));

		if (hasBaseRole) {
			return next(); // Admins, Presidents, Directors, and Stage Managers get a free pass
		}

		// 3. Determine the Department ID involved in the request
		let deptIdToCheck = req.body?.dept_id; // Usually available on POST (creation) routes

		// If it's a pull or delete route, we have to look up the item in the DB to find its department
		if (!deptIdToCheck && req.params.inventoryId) {
			const item = await models.Inventory.findByPk(req.params.inventoryId);
			if (!item) {
				return res.status(404).json({ success: false, message: "Inventory item not found." });
			}
			deptIdToCheck = item.dept_id;
		}

		// 4. Validate specific Department Role
		if (deptIdToCheck) {
			const dept = await models.Department.findByPk(deptIdToCheck);
			if (dept) {
				// Assumes your department names (e.g., "Costumes") match your role names (e.g., "costumes")
				const deptRoleName = dept.name.toLowerCase(); 
				if (userRoles.includes(deptRoleName)) {
					return next(); // They have the specific department role!
				}
			}
		}

		return res.status(403).json({ 
			success: false, 
			message: "Insufficient permissions. You must be in this department to manage its inventory." 
		});
	};
};