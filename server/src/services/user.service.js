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

async function getAll() {
	return await User.findAll();
}

async function getById(id) {
	const user = await User.findByPk(id);
	if (!user) {
		throw new Error("User not found");
	}
	return user;
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
