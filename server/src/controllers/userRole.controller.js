import userRoleService from '../services/userRole.service.js';

async function get(req, res, next) {
    try {
        res.json(await userRoleService.getUserRoles(req.params.userId));
    } catch (error) {
        if (error.message === 'User or Role not found') {
            return res.status(404).json({ success: false, message: error.message });
        }
        next(error);
    }
}

async function update(req, res, next) {
    try {
        // Expects { roles: ['admin', 'tech'] }
        const roles = await userRoleService.updateUserRoles(req.params.userId, req.body.roles);
        res.json(roles);
    } catch (error) {
        if (error.message === 'User or Role not found') {
            return res.status(404).json({ success: false, message: error.message });
        }
        next(error);
    }
}

async function remove(req, res, next) {
    try {
        // Support both { role: 'admin' } and { roles: ['admin'] }
        const rolesToRemove = req.body.roles || req.body.role;
        
        await userRoleService.removeUserRole(req.params.userId, rolesToRemove);
        res.status(204).send();
    } catch (error) {
        if (error.message === 'User or Role not found') {
            return res.status(404).json({ success: false, message: error.message });
        }
        next(error);
    }
}

export default { get, update, remove };