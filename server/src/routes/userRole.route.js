import Router from 'express';
import userRoleController from '../controllers/userRole.controller.js';

const router = Router();

// GET /api/users/:userId/roles - View all roles for a user
router.get('/:userId/roles', userRoleController.get);

// UPDATE /api/users/:userId/roles - Update all roles (overwrite with new list)
router.put('/:userId/roles', userRoleController.update);

// DELETE /api/users/:userId/roles - Remove a specific role
router.delete('/:userId/roles', userRoleController.remove);

export default router;