import { Request, Response } from 'express';
import notificationService from '@/services/notificationService';
import logger from '@/utils/logger';
import { validationResult } from 'express-validator';
import prisma from '@/config/database';

export class NotificationController {
  // Get user notifications with pagination
  public async getUserNotifications(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      const result = await notificationService.getUserNotifications(userId, page, limit);

      res.status(200).json({
        success: true,
        data: result,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit),
        },
      });
    } catch (error) {
      logger.error('Error fetching user notifications:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch notifications',
      });
    }
  }

  // Create a new notification
  public async createNotification(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
        return;
      }

      const { userId, title, message, type, category, data } = req.body;

      const notification = await notificationService.createNotification({
        userId,
        title,
        message,
        type,
        category,
        data,
      });

      res.status(201).json({
        success: true,
        data: notification,
        message: 'Notification created successfully',
      });
    } catch (error) {
      logger.error('Error creating notification:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create notification',
      });
    }
  }

  // Mark notification as read
  public async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await notificationService.markAsRead(id);

      res.status(200).json({
        success: true,
        message: 'Notification marked as read',
      });
    } catch (error) {
      logger.error('Error marking notification as read:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark notification as read',
      });
    }
  }

  // Mark all notifications as read for user
  public async markAllAsRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      await notificationService.markAllAsRead(userId);

      res.status(200).json({
        success: true,
        message: 'All notifications marked as read',
      });
    } catch (error) {
      logger.error('Error marking all notifications as read:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark all notifications as read',
      });
    }
  }

  // Delete notification
  public async deleteNotification(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await notificationService.deleteNotification(id);

      res.status(200).json({
        success: true,
        message: 'Notification deleted successfully',
      });
    } catch (error) {
      logger.error('Error deleting notification:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete notification',
      });
    }
  }

  // Get notification settings
  public async getNotificationSettings(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      // Get user settings from database
      const userSettings = await prisma.userSettings.findUnique({
        where: { userId },
        select: { notifications: true },
      });

      const defaultSettings = {
        inventory: true,
        system: true,
        user: true,
        report: true,
        email: true,
        push: true,
        sms: false,
      };

      res.status(200).json({
        success: true,
        data: userSettings?.notifications || defaultSettings,
      });
    } catch (error) {
      logger.error('Error fetching notification settings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch notification settings',
      });
    }
  }

  // Update notification settings
  public async updateNotificationSettings(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { notifications } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      // Update user settings
      await prisma.userSettings.upsert({
        where: { userId },
        update: { notifications },
        create: {
          userId,
          notifications,
        },
      });

      res.status(200).json({
        success: true,
        message: 'Notification settings updated successfully',
      });
    } catch (error) {
      logger.error('Error updating notification settings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update notification settings',
      });
    }
  }

  // Get notification statistics
  public async getNotificationStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      const [total, unread, byType, byCategory] = await Promise.all([
        prisma.notification.count({ where: { userId } }),
        prisma.notification.count({ where: { userId, isRead: false } }),
        prisma.notification.groupBy({
          by: ['type'],
          where: { userId },
          _count: { type: true },
        }),
        prisma.notification.groupBy({
          by: ['category'],
          where: { userId },
          _count: { category: true },
        }),
      ]);

      res.status(200).json({
        success: true,
        data: {
          total,
          unread,
          byType: byType.reduce((acc: Record<string, number>, item: any) => {
            acc[item.type] = item._count.type;
            return acc;
          }, {}),
          byCategory: byCategory.reduce((acc: Record<string, number>, item: any) => {
            acc[item.category] = item._count.category;
            return acc;
          }, {}),
        },
      });
    } catch (error) {
      logger.error('Error fetching notification statistics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch notification statistics',
      });
    }
  }
}

export default new NotificationController();
