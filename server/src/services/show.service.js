import models from '../models/index.js';

const { Show } = models;

async function getAll() {
    const shows = await Show.findAll();
    return shows;
}

async function getById(id) {
    const show = await Show.findByPk(id);
    if (!show) {
        throw new Error('Show not found');
    }
    return show;
}

async function create(data) {
    const newShow = await Show.create(data);
    return newShow.toJSON();
}

async function update(id, data) {
    const show = await Show.findByPk(id);
    if (!show) {
        throw new Error('Show not found');
    }
    await show.update(data);
    return show.toJSON();
}

async function remove(id) {
    const show = await Show.findByPk(id);
    if (!show) {
        throw new Error('Show not found');
    }
    await show.destroy();
    return { message: 'Show deleted successfully' };
}

export default {
    getAll,
    getById,
    create,
    update,
    remove,
};