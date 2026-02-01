import models from '../models/index.js';

const { Organization } = models;

async function getAll() {
    const organizations = await Organization.findAll();
    return organizations;
}

async function getById(id) {
    const organization = await Organization.findByPk(id);
    if (!organization) {
        throw new Error('Organization not found');
    }
    return organization;
}

async function create(data) {
    const newOrganization = await Organization.create(data);
    return newOrganization.toJSON();
}

async function update(id, data) {
    const organization = await Organization.findByPk(id);
    if (!organization) {
        throw new Error('Organization not found');
    }
    await organization.update(data);
    return organization.toJSON();
}

async function remove(id) {
    const organization = await Organization.findByPk(id);
    if (!organization) {
        throw new Error('Organization not found');
    }
    await organization.destroy();
    return { message: 'Organization deleted successfully' };
}

export default {
    getAll,
    getById,
    create,
    update,
    remove,
};