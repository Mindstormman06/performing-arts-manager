import models from '../models/index.js';
const { User, Role } = models;

async function getUserRoles(userId) {
    const user = await User.findByPk(userId, {
        include: { model: Role, as: 'globalRoles' }
    });
    if (!user) throw new Error('User not found');
    return user.globalRoles;
}

async function updateUserRoles(userId, roleNames) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');

    const roles = await Role.findAll({
        where: { name: roleNames }
    });

    await user.addGlobalRoles(roles);
    
    return user.getGlobalRoles();
}

async function removeUserRole(userId, roleNames) {
    const user = await User.findByPk(userId);
    
    const namesArray = Array.isArray(roleNames) ? roleNames : [roleNames];
    
    const roles = await Role.findAll({ 
        where: { name: namesArray } 
    });
    
    if (!user || !roles.length) throw new Error('User or Role not found');

    await user.removeGlobalRoles(roles);
    return { message: `Roles ${namesArray.join(', ')} removed from user` };
}

export default { getUserRoles, updateUserRoles, removeUserRole };