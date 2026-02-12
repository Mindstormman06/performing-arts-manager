import showService from "../services/show.service.js";

async function get(req, res, next) {
    try {
        res.json(await showService.getAll());
    } catch (error) {
        console.error(error);
        next(error);
    }
}

async function getById(req, res, next) {
    try {
        res.json(await showService.getById(req.params.id));
    } catch (error) {
        if (error.message === 'Show not found') {
            res.status(404).json({ success: false, message: 'Show not found' });
        }
        next(error);
    }
}

async function create(req, res, next) {
    try {
        res.status(201).json(await showService.create(req.body));
    } catch (error) {
        console.error(error);
        next(error);
    }
}

async function update(req, res, next) {
    try {
        res.json(await showService.update(req.params.id, req.body));
    } catch (error) {
        if (error.message === 'Show not found') {
            res.status(404).json({ success: false, message: 'Show not found' });
        }
        next(error);
    }
}

async function remove(req, res, next) {
    try {
        await showService.remove(req.params.id);
        res.status(200).json({ success: true, message: 'Show deleted successfully' });
    } catch (error) {
        if (error.message === 'Show not found') {
            res.status(404).json({ success: false, message: 'Show not found' });
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
