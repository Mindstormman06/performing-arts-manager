/**
 * Service for password login and token verification.
 *
 * @remarks
 * Exports `login` and `verify`. `login` reads the User with the `withPassword`
 * scope, compares the bcrypt hash and signs a JWT with `JWT_SECRET` and
 * `JWT_EXPIRES_IN`; every failure throws the same "Invalid credentials" error
 * so accounts can't be probed. `verify` loads a user by id and throws "User no
 * longer exists" if it is gone. It never writes to the database.
 */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/jwt.config.js";
import models from "../models/index.js";

const { User } = models;

async function login(email, password) {
	if (typeof email !== "string" || typeof password !== "string") {
		throw new Error("Invalid credentials");
	}

	const user = await User.scope("withPassword").findOne({
		where: { email: email.trim() },
	});
	if (!user?.passwordHash) throw new Error("Invalid credentials");

	const isMatch = await bcrypt.compare(password, user.passwordHash);
	if (!isMatch) throw new Error("Invalid credentials");

	const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
		expiresIn: JWT_EXPIRES_IN,
	});

	return { token, user: { id: user.id, fname: user.fname, lname: user.lname } };
}

async function verify(userId) {
	const user = await User.findByPk(userId);

	if (!user) throw new Error("User no longer exists");

	return {
		id: user.id,
		fname: user.fname,
		lname: user.lname,
		email: user.email,
	};
}

export default { login, verify };
