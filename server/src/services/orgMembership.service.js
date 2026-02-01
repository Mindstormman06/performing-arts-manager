import models from '../models/index.js';

async function addUserToOrg(orgId, userId) {
    // Check if membership already exists
    const existing = await models.OrgMembership.findOne({
        where: { org_id: orgId, users_id: userId }
    });
    if (existing) throw new Error('User already in organization');

    // Create membership without any roles in the second join table
    return await models.OrgMembership.create({
        org_id: orgId,
        users_id: userId
    });
}

export default { addUserToOrg };