import userService from "../services/user.service.js";

async function get(req, res, next) {
    try {
        res.json(await userService.getAll());
    } catch (error) {
        console.error(error);
        next(error);
    }
}

async function getById(req, res, next) {
    try {
        res.json(await userService.getById(req.params.id));
    } catch (error) {
        if (error.message === 'User not found') {
            res.status(404).json({ success: false, message: 'User not found' });
        }
        next(error);
    }
}

async function create(req, res, next) {
    try {
        res.status(201).json(await userService.create(req.body));
    } catch (error) {
        console.error(error);
        next(error);
    }
}

async function update(req, res, next) {
    try {
        res.json(await userService.update(req.params.id, req.body));
    } catch (error) {
        if (error.message === 'User not found') {
            res.status(404).json({ success: false, message: 'User not found' });
        }
        next(error);
    }
}

async function remove(req, res, next) {
    try {
        await userService.remove(req.params.id);
        res.status(204).send();
    } catch (error) {
        if (error.message === 'User not found') {
            res.status(404).json({ success: false, message: 'User not found' });
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
