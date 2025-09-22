import { Router } from 'express';
import { UserController } from '@/controllers/userController';
import { authenticateToken, requireRole } from '@/middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get all users (admin only)
router.get('/', requireRole(['GENERAL_MANAGER']), UserController.getUsers);

// Get user by ID
router.get('/:id', UserController.getUserById);

// Create new user (admin only)
router.post('/', requireRole(['GENERAL_MANAGER']), UserController.createUser);

// Update user
router.put('/:id', UserController.updateUser);

// Deactivate user (admin only)
router.delete('/:id', requireRole(['GENERAL_MANAGER']), UserController.deactivateUser);

export default router;
