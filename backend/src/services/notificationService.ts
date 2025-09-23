import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import prisma from '@/config/database';
import logger from '@/utils/logger';
import { NotificationType, NotificationCategory } from '@prisma/client';

export interface NotificationData {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  data?: any;
}

export interface RealtimeNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  isRead: boolean;
  createdAt: Date;
  data?: any;
}

class NotificationService {
  private io: SocketIOServer | null = null;
  private connectedUsers: Map<string, string> = new Map(); // userId -> socketId

  public initialize(server: HTTPServer): void {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    this.setupSocketHandlers();
    logger.info('Notification service initialized with Socket.io');
  }

  private setupSocketHandlers(): void {
    if (!this.io) return;

    this.io.on('connection', (socket) => {
      logger.info(`User connected: ${socket.id}`);

      // Handle user authentication
      socket.on('authenticate', async (data: { userId: string, token: string }) => {
        try {
          // Verify JWT token here (you can use your auth service)
          // For now, we'll just store the user mapping
          this.connectedUsers.set(data.userId, socket.id);
          socket.join(`user_${data.userId}`);
          logger.info(`User ${data.userId} authenticated and joined room`);
        } catch (error) {
          logger.error('Authentication failed:', error);
          socket.emit('auth_error', { message: 'Authentication failed' });
        }
      });

      // Handle joining warehouse-specific rooms
      socket.on('join_warehouse', (warehouseId: string) => {
        socket.join(`warehouse_${warehouseId}`);
        logger.info(`Socket ${socket.id} joined warehouse ${warehouseId}`);
      });

      // Handle leaving warehouse rooms
      socket.on('leave_warehouse', (warehouseId: string) => {
        socket.leave(`warehouse_${warehouseId}`);
        logger.info(`Socket ${socket.id} left warehouse ${warehouseId}`);
      });

      // Handle marking notifications as read
      socket.on('mark_notification_read', async (notificationId: string) => {
        try {
          await this.markAsRead(notificationId);
          socket.emit('notification_read', { notificationId });
        } catch (error) {
          logger.error('Error marking notification as read:', error);
          socket.emit('error', { message: 'Failed to mark notification as read' });
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        // Remove user from connected users map
        for (const [userId, socketId] of this.connectedUsers.entries()) {
          if (socketId === socket.id) {
            this.connectedUsers.delete(userId);
            break;
          }
        }
        logger.info(`User disconnected: ${socket.id}`);
      });
    });
  }

  public async createNotification(notificationData: NotificationData): Promise<RealtimeNotification> {
    try {
      const notification = await prisma.notification.create({
        data: {
          userId: notificationData.userId,
          title: notificationData.title,
          message: notificationData.message,
          type: notificationData.type,
          category: notificationData.category,
        },
      });

      const realtimeNotification: RealtimeNotification = {
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        category: notification.category,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
        data: notificationData.data,
      };

      // Send real-time notification
      this.sendToUser(notificationData.userId, 'new_notification', realtimeNotification);

      logger.info(`Notification created for user ${notificationData.userId}: ${notification.title}`);
      return realtimeNotification;
    } catch (error) {
      logger.error('Error creating notification:', error);
      throw error;
    }
  }

  public async createBulkNotifications(notifications: NotificationData[]): Promise<RealtimeNotification[]> {
    try {
      const createdNotifications = await prisma.notification.createMany({
        data: notifications.map(notif => ({
          userId: notif.userId,
          title: notif.title,
          message: notif.message,
          type: notif.type,
          category: notif.category,
        })),
      });

      // Get the created notifications to return with IDs
      const recentNotifications = await prisma.notification.findMany({
        where: {
          userId: { in: notifications.map(n => n.userId) },
        },
        orderBy: { createdAt: 'desc' },
        take: notifications.length,
      });

      const realtimeNotifications: RealtimeNotification[] = recentNotifications.map(notification => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        category: notification.category,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
      }));

      // Send real-time notifications
      realtimeNotifications.forEach((notification, index) => {
        this.sendToUser(notifications[index].userId, 'new_notification', notification);
      });

      logger.info(`Created ${createdNotifications.count} bulk notifications`);
      return realtimeNotifications;
    } catch (error) {
      logger.error('Error creating bulk notifications:', error);
      throw error;
    }
  }

  public async getUserNotifications(userId: string, page: number = 1, limit: number = 20): Promise<{
    notifications: RealtimeNotification[];
    total: number;
    unreadCount: number;
  }> {
    try {
      const skip = (page - 1) * limit;
      
      const [notifications, total, unreadCount] = await Promise.all([
        prisma.notification.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.notification.count({ where: { userId } }),
        prisma.notification.count({ where: { userId, isRead: false } }),
      ]);

      const realtimeNotifications: RealtimeNotification[] = notifications.map(notification => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        category: notification.category,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
      }));

      return {
        notifications: realtimeNotifications,
        total,
        unreadCount,
      };
    } catch (error) {
      logger.error('Error fetching user notifications:', error);
      throw error;
    }
  }

  public async markAsRead(notificationId: string): Promise<void> {
    try {
      await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true },
      });
      logger.info(`Notification ${notificationId} marked as read`);
    } catch (error) {
      logger.error('Error marking notification as read:', error);
      throw error;
    }
  }

  public async markAllAsRead(userId: string): Promise<void> {
    try {
      await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      });
      logger.info(`All notifications marked as read for user ${userId}`);
    } catch (error) {
      logger.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  public async deleteNotification(notificationId: string): Promise<void> {
    try {
      await prisma.notification.delete({
        where: { id: notificationId },
      });
      logger.info(`Notification ${notificationId} deleted`);
    } catch (error) {
      logger.error('Error deleting notification:', error);
      throw error;
    }
  }

  // Real-time notification methods
  public sendToUser(userId: string, event: string, data: any): void {
    if (!this.io) return;

    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
      logger.info(`Sent ${event} to user ${userId}`);
    } else {
      logger.warn(`User ${userId} not connected, notification queued`);
    }
  }

  public sendToWarehouse(warehouseId: string, event: string, data: any): void {
    if (!this.io) return;

    this.io.to(`warehouse_${warehouseId}`).emit(event, data);
    logger.info(`Sent ${event} to warehouse ${warehouseId}`);
  }

  public sendToAll(event: string, data: any): void {
    if (!this.io) return;

    this.io.emit(event, data);
    logger.info(`Broadcasted ${event} to all connected users`);
  }

  // Specific notification types
  public async notifyLowStock(productId: string, warehouseId: string, currentStock: number, minStock: number): Promise<void> {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { warehouse: true },
      });

      if (!product) return;

      const warehouse = await prisma.warehouse.findUnique({
        where: { id: warehouseId },
      });

      if (!warehouse) return;

      // Get warehouse managers
      const managers = await prisma.user.findMany({
        where: {
          warehouseId,
          role: 'WAREHOUSE_MANAGER',
          isActive: true,
        },
      });

      const notifications: NotificationData[] = managers.map(manager => ({
        userId: manager.id,
        title: 'تنبيه مخزون منخفض',
        message: `المنتج ${product.name} في المستودع ${warehouse.name} وصل إلى الحد الأدنى. الكمية الحالية: ${currentStock}، الحد الأدنى: ${minStock}`,
        type: 'WARNING',
        category: 'INVENTORY',
        data: {
          productId,
          warehouseId,
          currentStock,
          minStock,
          productName: product.name,
          warehouseName: warehouse.name,
        },
      }));

      await this.createBulkNotifications(notifications);

      // Send real-time update to warehouse
      this.sendToWarehouse(warehouseId, 'low_stock_alert', {
        productId,
        productName: product.name,
        currentStock,
        minStock,
      });
    } catch (error) {
      logger.error('Error creating low stock notification:', error);
    }
  }

  public async notifyInventoryMovement(transactionId: string): Promise<void> {
    try {
      const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId },
        include: {
          product: true,
          warehouse: true,
          user: true,
        },
      });

      if (!transaction) return;

      // Get warehouse users
      const warehouseUsers = await prisma.user.findMany({
        where: {
          warehouseId: transaction.warehouseId,
          isActive: true,
        },
      });

      const notifications: NotificationData[] = warehouseUsers.map(user => ({
        userId: user.id,
        title: 'حركة مخزون جديدة',
        message: `${transaction.type === 'PURCHASE' ? 'شراء' : transaction.type === 'SALE' ? 'بيع' : 'تحويل'} ${transaction.quantity} ${transaction.unit} من ${transaction.productName}`,
        type: 'INFO',
        category: 'INVENTORY',
        data: {
          transactionId,
          productId: transaction.productId,
          warehouseId: transaction.warehouseId,
          quantity: transaction.quantity,
          type: transaction.type,
        },
      }));

      await this.createBulkNotifications(notifications);

      // Send real-time update to warehouse
      this.sendToWarehouse(transaction.warehouseId, 'inventory_movement', {
        transactionId,
        productName: transaction.productName,
        quantity: transaction.quantity,
        type: transaction.type,
        userName: transaction.userName,
      });
    } catch (error) {
      logger.error('Error creating inventory movement notification:', error);
    }
  }

  public async notifySystemUpdate(title: string, message: string, category: NotificationCategory = 'SYSTEM'): Promise<void> {
    try {
      const allUsers = await prisma.user.findMany({
        where: { isActive: true },
        select: { id: true },
      });

      const notifications: NotificationData[] = allUsers.map(user => ({
        userId: user.id,
        title,
        message,
        type: 'INFO',
        category,
      }));

      await this.createBulkNotifications(notifications);

      // Broadcast to all connected users
      this.sendToAll('system_update', {
        title,
        message,
        category,
      });
    } catch (error) {
      logger.error('Error creating system update notification:', error);
    }
  }

  public getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  public isUserConnected(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }
}

export default new NotificationService();
