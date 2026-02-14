import bcrypt from "bcryptjs";

import models from "../models/index.js";

const { User } = models;

async function getAll() {
	const users = await User.findAll();
	return users;
}

async function getById(id) {
	const user = await User.findByPk(id);
	if (!user) {
		throw new Error("User not found");
	}
	return user;
}

async function create(data) {
	if (data.password) {
		data.passwordHash = await bcrypt.hash(data.password, 10);
		delete data.password;
	}
	const newUser = await User.create(data);
	return newUser.toJSON();
}

async function update(id, data) {
	const user = await User.findByPk(id);
	if (!user) {
		throw new Error("User not found");
	}
	if (data.password) {
		data.passwordHash = await bcrypt.hash(data.password, 10);
		delete data.password;
	}
	await user.update(data);
	return user.toJSON();
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
