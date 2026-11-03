import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/jwt.config.js";
import models from "../models/index.js";

const { User } = models;

async function login(email, password) {
	if (typeof email !== "string" || typeof password !== "string") {
		throw new Error("Invalid credentials");
	}

	// 1. Find user by email
	const user = await User.scope("withPassword").findOne({
		where: { email: email.trim() },
	});
	if (!user?.passwordHash) throw new Error("Invalid credentials");

	// 2. Verify password
	const isMatch = await bcrypt.compare(password, user.passwordHash);
	if (!isMatch) throw new Error("Invalid credentials");

	// 3. Generate Token
	const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
		expiresIn: JWT_EXPIRES_IN,
	});

	return { token, user: { id: user.id, fname: user.fname, lname: user.lname } };
}

async function verify(userId) {
	// Find the user by their ID (extracted from the token)
	const user = await User.findByPk(userId);

	if (!user) throw new Error("User no longer exists");

	// Return safe user data
	return {
		id: user.id,
		fname: user.fname,
		lname: user.lname,
		email: user.email,
	};
}

export default { login, verify };
