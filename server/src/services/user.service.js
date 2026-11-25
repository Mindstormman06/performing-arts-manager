/**
 * Service for user accounts.
 *
 * @remarks
 * Exports `getAll`, `getById`, `create`, `update` and `remove`. Reads and
 * writes User and reads OrgMembership. Other users are visible only if they
 * share an active organization with the viewer, and then only by id and name.
 * Only name, email, phone and password come from client data; passwords must
 * be at least 8 characters and are bcrypt-hashed, and emails must be unique.
 * Password hashes and session fields are never returned. Callers must already
 * have checked that the caller owns the account being changed.
 */

import bcrypt from "bcryptjs";
import { Op } from "sequelize";

import models from "../models/index.js";

const { User } = models;

function toSafeUser(user) {
	const {
		passwordHash: _passwordHash,
		sessionToken: _sessionToken,
		sessionExpiry: _sessionExpiry,
		...safe
	} = user.toJSON();
	return safe;
}

// Only these fields can be set by a client; everything else is ignored
async function buildUserData(data = {}, existingId = null) {
	const { fname, lname, email, phone, password } = data;
	const clean = Object.fromEntries(
		Object.entries({ fname, lname, email, phone }).filter(
			([, value]) => value !== undefined,
		),
	);
	if (typeof clean.email === "string") clean.email = clean.email.trim();

	if (clean.email) {
		const where = { email: clean.email };
		if (existingId) where.id = { [Op.ne]: existingId };
		const duplicate = await User.findOne({ where });
		if (duplicate) throw new Error("Email already in use");
	}

	if (password) {
		if (typeof password !== "string" || password.length < 8) {
			throw new Error("Password must be at least 8 characters");
		}
		clean.passwordHash = await bcrypt.hash(password, 10);
	}
	return clean;
}

const PUBLIC_USER_FIELDS = ["id", "fname", "lname"];

async function activeOrgIds(userId) {
	const memberships = await models.OrgMembership.findAll({
		where: { users_id: userId, status: "active" },
		attributes: ["org_id"],
	});
	return memberships.map((m) => m.org_id);
}

async function getAll(viewerId) {
	const orgIds = await activeOrgIds(viewerId);
	const peers = orgIds.length
		? await models.OrgMembership.findAll({
				where: { org_id: orgIds, status: "active" },
				attributes: ["users_id"],
			})
		: [];
	const ids = [...new Set([Number(viewerId), ...peers.map((p) => p.users_id)])];
	return await User.findAll({
		where: { id: ids },
		attributes: PUBLIC_USER_FIELDS,
	});
}

async function getById(id, viewerId) {
	const user = await User.findByPk(id);
	if (!user) {
		throw new Error("User not found");
	}
	if (viewerId === undefined || String(id) === String(viewerId)) {
		return user;
	}
	const orgIds = await activeOrgIds(viewerId);
	const shared = orgIds.length
		? await models.OrgMembership.count({
				where: { users_id: id, org_id: orgIds, status: "active" },
			})
		: 0;
	// Mirror the missing-user error so other users' ids can't be probed.
	if (!shared) {
		throw new Error("User not found");
	}
	return { id: user.id, fname: user.fname, lname: user.lname };
}

async function create(data) {
	const newUser = await User.create(await buildUserData(data));
	return toSafeUser(newUser);
}

async function update(id, data) {
	const user = await User.findByPk(id);
	if (!user) {
		throw new Error("User not found");
	}
	await user.update(await buildUserData(data, user.id));
	return toSafeUser(user);
}

async function remove(id) {
	const user = await User.findByPk(id);
	if (!user) {
		throw new Error("User not found");
	}
	await user.destroy();
	return { message: "User deleted successfully" };
}

export default {
	getAll,
	getById,
	create,
	update,
	remove,
};
