import models from '../models/index.js';

async function appendRolesToAssignment(orgId, userId, roleNames) {
    const org = await models.Organization.findOne({ where: { id: orgId } });
    if (!org) throw new Error('Organization not found');
    const membership = await models.OrgMembership.findOne({
        where: { org_id: orgId, users_id: userId }
    });
    if (!membership) throw new Error('User is not a member of this organization');

    const roles = await models.Role.findAll({
        where: { name: roleNames }
    });
    if (!roles.length) throw new Error('No valid roles provided');

    const roleEntries = roles.map(role => ({
        assignment_id: membership.assignment_id,
        role_id: role.id
    }));

    await models.OrgRole.bulkCreate(roleEntries, { ignoreDuplicates: true });

    return await membership.getAssignedRoles();
}

async function getOrgUsers(orgId) {
    const org = await models.Organization.findOne({ where: { id: orgId } });
    if (!org) throw new Error('Organization not found');

    const memberships = await models.OrgMembership.findAll({
        where: { org_id: orgId },
        include: [
            { model: models.User }, 
            { model: models.Role, as: 'assignedRoles' }
        ]
    });
    if (!memberships.length) throw new Error('No users found for this organization');
    return memberships;
}

async function getOrgUserById(orgId, userId) {
    const org = await models.Organization.findOne({ where: { id: orgId } });
    if (!org) throw new Error('Organization not found');

    const membership = await models.OrgMembership.findOne({
        where: { org_id: orgId, users_id: userId },
        include: [
            { model: models.User },
            { model: models.Role, as: 'assignedRoles' }
        ]
    });
    if (!membership) throw new Error('User not found in this organization');
    return membership;
}

async function getUsersByRole(orgId, roleName) {
    const org = await models.Organization.findOne({ where: { id: orgId } });
    if (!org) throw new Error('Organization not found');

    const role = await models.Role.findOne({ where: { name: roleName } });
    if (!role) throw new Error('Role not found');

    return await models.User.findAll({
        include: [{
            model: models.OrgMembership,
            where: { org_id: orgId },
            include: [{
                model: models.Role,
                as: 'assignedRoles',
                where: { name: roleName } // Filter by role name here
            }]
        }]
    });
}

async function removeUserFromOrg(orgId, userId) {
    const org = await models.Organization.findOne({ where: { id: orgId } });
    if (!org) throw new Error('Organization not found');

    const deleted = await models.OrgMembership.destroy({
        where: { org_id: orgId, users_id: userId }
    });
    if (!deleted) throw new Error('User is not a member of this organization');
    return { message: 'User removed from organization successfully' };
}

async function removeRolesFromUser(orgId, userId, roleNames) {
    const namesArray = Array.isArray(roleNames) ? roleNames : [roleNames];
    
    if (!namesArray.length || !namesArray[0]) throw new Error('Role names are required');

    const membership = await models.OrgMembership.findOne({
        where: { org_id: orgId, users_id: userId }
    });
    
    const roles = await models.Role.findAll({ 
        where: { name: namesArray } 
    });

    if (!membership || !roles.length) throw new Error('Membership or Roles not found');

    const roleIds = roles.map(r => r.id);

    const deletedCount = await models.OrgRole.destroy({
        where: {
            assignment_id: membership.assignment_id,
            role_id: roleIds
        }
    });
    
    if (deletedCount === 0) throw new Error('User does not have any of these roles');
    
    return { message: `${deletedCount} role(s) removed successfully` };
}

export default { 
    appendRolesToAssignment, 
    getOrgUsers, 
    getOrgUserById, 
    getUsersByRole, 
    removeUserFromOrg, 
    removeRolesFromUser 
};