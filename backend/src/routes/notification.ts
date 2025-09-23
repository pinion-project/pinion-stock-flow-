import { Router } from 'express';
import { body, param, query } from 'express-validator';
import notificationController from '@/controllers/notificationController';
import { authenticateToken } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validation';

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Get user notifications with pagination
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  ],
  validateRequest,
  notificationController.getUserNotifications
);

// Create a new notification (admin only)
router.post(
  '/',
  [
    body('userId').isString().notEmpty().withMessage('User ID is required'),
    body('title').isString().notEmpty().withMessage('Title is required'),
    body('message').isString().notEmpty().withMessage('Message is required'),
    body('type').isIn(['INFO', 'SUCCESS', 'WARNING', 'ERROR']).withMessage('Invalid notification type'),
    body('category').isIn(['INVENTORY', 'SYSTEM', 'USER', 'REPORT']).withMessage('Invalid notification category'),
    body('data').optional().isObject().withMessage('Data must be an object'),
  ],
  validateRequest,
  notificationController.createNotification
);

// Mark notification as read
router.put(
  '/:id/read',
  [
    param('id').isString().notEmpty().withMessage('Notification ID is required'),
  ],
  validateRequest,
  notificationController.markAsRead
);

// Mark all notifications as read
router.put('/read-all', notificationController.markAllAsRead);

// Delete notification
router.delete(
  '/:id',
  [
    param('id').isString().notEmpty().withMessage('Notification ID is required'),
  ],
  validateRequest,
  notificationController.deleteNotification
);

// Get notification settings
router.get('/settings', notificationController.getNotificationSettings);

// Update notification settings
router.put(
  '/settings',
  [
    body('notifications').isObject().withMessage('Notifications settings must be an object'),
    body('notifications.inventory').optional().isBoolean().withMessage('Inventory setting must be boolean'),
    body('notifications.system').optional().isBoolean().withMessage('System setting must be boolean'),
    body('notifications.user').optional().isBoolean().withMessage('User setting must be boolean'),
    body('notifications.report').optional().isBoolean().withMessage('Report setting must be boolean'),
    body('notifications.email').optional().isBoolean().withMessage('Email setting must be boolean'),
    body('notifications.push').optional().isBoolean().withMessage('Push setting must be boolean'),
    body('notifications.sms').optional().isBoolean().withMessage('SMS setting must be boolean'),
  ],
  validateRequest,
  notificationController.updateNotificationSettings
);

// Get notification statistics
router.get('/stats', notificationController.getNotificationStats);

export default router;
