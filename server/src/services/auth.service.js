import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import models from "../models/index.js";

const { User } = models;
const JWT_SECRET = process.env.JWT_SECRET || "your_theatre_secret";

async function login(email, password) {
	// 1. Find user by email
	const user = await User.findOne({ where: { email } });
	if (!user) throw new Error("Invalid credentials");

	// 2. Verify password
	const isMatch = await bcrypt.compare(password, user.passwordHash);
	if (!isMatch) throw new Error("Invalid credentials");

	// 3. Generate Token
	const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
		expiresIn: "8h",
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
