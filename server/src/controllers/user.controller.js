/**
 * Express controller for user accounts.
 *
 * @remarks
 * Delegates to `user.service`, which limits listing and lookup to users who
 * share an active organization with the caller. Update and delete are allowed
 * only on the caller's own account and respond 403 otherwise. Known service
 * errors map through `CLIENT_ERRORS` (404, 409, 400) and Sequelize validation
 * errors to 400; anything else goes to `next`.
 */

import userService from "../services/user.service.js";

const CLIENT_ERRORS = {
	"User not found": 404,
	"Email already in use": 409,
	"Password must be at least 8 characters": 400,
};

function handleError(error, res, next) {
	const status = CLIENT_ERRORS[error.message];
	if (status) {
		return res.status(status).json({ success: false, message: error.message });
	}
	if (error.name === "SequelizeValidationError") {
		return res.status(400).json({
			success: false,
			message: error.errors?.map((e) => e.message).join(", ") || "Invalid data",
		});
	}
	return next(error);
}

// Users may only modify or delete their own account
function forbidUnlessSelf(req, res) {
	if (String(req.params.id) !== String(req.user.id)) {
		res.status(403).json({
			success: false,
			message: "You can only modify your own account.",
		});
		return true;
	}
	return false;
}

async function get(req, res, next) {
	try {
		res.json(await userService.getAll(req.user.id));
	} catch (error) {
		handleError(error, res, next);
	}
}

async function getById(req, res, next) {
	try {
		res.json(await userService.getById(req.params.id, req.user.id));
	} catch (error) {
		handleError(error, res, next);
	}
}

async function create(req, res, next) {
	try {
		res.status(201).json(await userService.create(req.body));
	} catch (error) {
		handleError(error, res, next);
	}
}

async function update(req, res, next) {
	try {
		if (forbidUnlessSelf(req, res)) return;
		res.json(await userService.update(req.params.id, req.body));
	} catch (error) {
		handleError(error, res, next);
	}
}

async function remove(req, res, next) {
	try {
		if (forbidUnlessSelf(req, res)) return;
		await userService.remove(req.params.id);
		res
			.status(200)
			.json({ success: true, message: "User deleted successfully" });
	} catch (error) {
		handleError(error, res, next);
	}
}

export default {
	get,
	getById,
	create,
	update,
	remove,
};
