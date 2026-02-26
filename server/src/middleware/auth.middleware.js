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
		res
			.status(401)
			.json({ success: false, message: `Invalid token: ${error.message}` });
	}
};

export const authorizeOrg = (requiredRoles = []) => {
	return async (req, res, next) => {
		const orgId = req.params.orgId || req.params.id || req.body.organization_id;
		const userId = req.user.id;

		if (!orgId)
			return res.status(400).json({ message: "Organization ID is missing" });

		const membership = await models.OrgMembership.findOne({
			where: { org_id: orgId, users_id: userId },
			include: [{ model: models.Role, as: "assignedRoles" }],
		});

		if (!membership) {
			return res.status(403).json({
				success: false,
				message: "Not a member of this organization.",
			});
		}

		const userRoles = membership.assignedRoles.map((r) => r.name);

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
			include: [{ model: models.Role, as: "assignedRoles" }],
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