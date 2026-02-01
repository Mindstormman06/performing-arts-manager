import organizationService from "../services/organization.service.js";

async function get(req, res, next) {
    try {
        res.json(await organizationService.getAll());
    } catch (error) {
        console.error(error);
        next(error);
    }
}

async function getById(req, res, next) {
    try {
        res.json(await organizationService.getById(req.params.id));
    } catch (error) {
        if (error.message === 'Organization not found') {
            res.status(404).json({ success: false, message: 'Organization not found' });
        }
        next(error);
    }
}

async function create(req, res, next) {
    try {
        res.status(201).json(await organizationService.create(req.body));
    } catch (error) {
        console.error(error);
        next(error);
    }
}

async function update(req, res, next) {
    try {
        res.json(await organizationService.update(req.params.id, req.body));
    } catch (error) {
        if (error.message === 'Organization not found') {
            res.status(404).json({ success: false, message: 'Organization not found' });
        }
        next(error);
    }
}

async function remove(req, res, next) {
    try {
        await organizationService.remove(req.params.id);
        res.status(204).send();
    } catch (error) {
        if (error.message === 'Organization not found') {
            res.status(404).json({ success: false, message: 'Organization not found' });
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
