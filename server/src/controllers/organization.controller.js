/**
 * Express controller for organization CRUD.
 *
 * @remarks
 * Delegates to `organization.service`. Listing returns only organizations the
 * caller is an active member of, and `create` makes `req.user.id` the new
 * organization's president. "Organization not found" responds 404; anything
 * else goes to `next`. Role checks for update and delete happen in route
 * middleware.
 */

import organizationService from "../services/organization.service.js";

async function get(req, res, next) {
	try {
		res.json(await organizationService.getAll(req.user.id));
	} catch (error) {
		console.error(error);
		next(error);
	}
}

async function getById(req, res, next) {
	try {
		res.json(await organizationService.getById(req.params.id));
	} catch (error) {
		if (error.message === "Organization not found") {
			return res
				.status(404)
				.json({ success: false, message: "Organization not found" });
		}
		next(error);
	}
}

async function create(req, res, next) {
	try {
		const userId = req.user.id;
		const newOrg = await organizationService.create({ ...req.body, userId });
		res.status(201).json(newOrg);
	} catch (error) {
		console.error(error);
		next(error);
	}
}

async function update(req, res, next) {
	try {
		res.json(await organizationService.update(req.params.id, req.body));
	} catch (error) {
		if (error.message === "Organization not found") {
			return res
				.status(404)
				.json({ success: false, message: "Organization not found" });
		}
		next(error);
	}
}

async function remove(req, res, next) {
	try {
		await organizationService.remove(req.params.id);
		res
			.status(200)
			.json({ success: true, message: "Organization deleted successfully" });
	} catch (error) {
		if (error.message === "Organization not found") {
			return res
				.status(404)
				.json({ success: false, message: "Organization not found" });
		}
		next(error);
	}
}

export default {
	get,
	getById,
	create,
	update,
	remove,
};
