import { Server as SocketIOServer } from 'socket.io';
import logger from '@/utils/logger';

export interface WebSocketEvent {
  type: string;
  data: any;
  timestamp: Date;
  userId?: string;
  warehouseId?: string;
}

export interface WebSocketConnection {
  socketId: string;
  userId: string;
  warehouseId?: string;
  connectedAt: Date;
  lastActivity: Date;
}

class WebSocketService {
  private io: SocketIOServer | null = null;
  private connections: Map<string, WebSocketConnection> = new Map();
  private userSockets: Map<string, string> = new Map(); // userId -> socketId

  public initialize(io: SocketIOServer): void {
    this.io = io;
    this.setupEventHandlers();
    logger.info('WebSocket service initialized');
  }

  private setupEventHandlers(): void {
    if (!this.io) return;

    this.io.on('connection', (socket) => {
      logger.info(`Client connected: ${socket.id}`);

      // Handle authentication
      socket.on('authenticate', (data: { userId: string; token: string }) => {
        this.handleAuthentication(socket, data);
      });

      // Handle joining warehouse room
      socket.on('join_warehouse', (warehouseId: string) => {
        this.handleJoinWarehouse(socket, warehouseId);
      });

      // Handle leaving warehouse room
      socket.on('leave_warehouse', (warehouseId: string) => {
        this.handleLeaveWarehouse(socket, warehouseId);
      });

      // Handle ping/pong for connection health
      socket.on('ping', () => {
        socket.emit('pong');
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        this.handleDisconnection(socket);
      });

      // Handle custom events
      socket.on('custom_event', (data: any) => {
        this.handleCustomEvent(socket, data);
      });
    });
  }

  private handleAuthentication(socket: any, data: { userId: string; token: string }): void {
    try {
      // In a real implementation, verify the JWT token here
      const { userId } = data;
      
      // Store connection info
      const connection: WebSocketConnection = {
        socketId: socket.id,
        userId,
        connectedAt: new Date(),
        lastActivity: new Date()
      };

      this.connections.set(socket.id, connection);
      this.userSockets.set(userId, socket.id);

      // Join user-specific room
      socket.join(`user_${userId}`);

      // Send authentication success
      socket.emit('authenticated', {
        success: true,
        userId,
        socketId: socket.id
      });

      logger.info(`User ${userId} authenticated on socket ${socket.id}`);
    } catch (error) {
      logger.error('Authentication error:', error);
      socket.emit('auth_error', {
        success: false,
        message: 'Authentication failed'
      });
    }
  }

  private handleJoinWarehouse(socket: any, warehouseId: string): void {
    try {
      const connection = this.connections.get(socket.id);
      if (connection) {
        connection.warehouseId = warehouseId;
        connection.lastActivity = new Date();
        this.connections.set(socket.id, connection);
      }

      socket.join(`warehouse_${warehouseId}`);
      socket.emit('joined_warehouse', { warehouseId });

      logger.info(`Socket ${socket.id} joined warehouse ${warehouseId}`);
    } catch (error) {
      logger.error('Error joining warehouse:', error);
      socket.emit('error', { message: 'Failed to join warehouse' });
    }
  }

  private handleLeaveWarehouse(socket: any, warehouseId: string): void {
    try {
      socket.leave(`warehouse_${warehouseId}`);
      socket.emit('left_warehouse', { warehouseId });

      logger.info(`Socket ${socket.id} left warehouse ${warehouseId}`);
    } catch (error) {
      logger.error('Error leaving warehouse:', error);
      socket.emit('error', { message: 'Failed to leave warehouse' });
    }
  }

  private handleDisconnection(socket: any): void {
    try {
      const connection = this.connections.get(socket.id);
      if (connection) {
        this.userSockets.delete(connection.userId);
        this.connections.delete(socket.id);
        logger.info(`User ${connection.userId} disconnected from socket ${socket.id}`);
      }
    } catch (error) {
      logger.error('Error handling disconnection:', error);
    }
  }

  private handleCustomEvent(socket: any, data: any): void {
    try {
      const connection = this.connections.get(socket.id);
      if (connection) {
        connection.lastActivity = new Date();
        this.connections.set(socket.id, connection);
      }

      // Handle custom event logic here
      logger.info(`Custom event from ${socket.id}:`, data);
    } catch (error) {
      logger.error('Error handling custom event:', error);
    }
  }

  // Public methods for sending events
  public sendToUser(userId: string, event: string, data: any): void {
    if (!this.io) return;

    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, {
        ...data,
        timestamp: new Date(),
        type: event
      });
      logger.info(`Sent ${event} to user ${userId}`);
    } else {
      logger.warn(`User ${userId} not connected`);
    }
  }

  public sendToWarehouse(warehouseId: string, event: string, data: any): void {
    if (!this.io) return;

    this.io.to(`warehouse_${warehouseId}`).emit(event, {
      ...data,
      timestamp: new Date(),
      type: event
    });
    logger.info(`Sent ${event} to warehouse ${warehouseId}`);
  }

  public sendToAll(event: string, data: any): void {
    if (!this.io) return;

    this.io.emit(event, {
      ...data,
      timestamp: new Date(),
      type: event
    });
    logger.info(`Broadcasted ${event} to all connected clients`);
  }

  public sendToRoom(room: string, event: string, data: any): void {
    if (!this.io) return;

    this.io.to(room).emit(event, {
      ...data,
      timestamp: new Date(),
      type: event
    });
    logger.info(`Sent ${event} to room ${room}`);
  }

  // Get connection statistics
  public getConnectionStats(): any {
    const totalConnections = this.connections.size;
    const activeUsers = new Set(Array.from(this.connections.values()).map(c => c.userId)).size;
    const warehouseConnections = new Set(
      Array.from(this.connections.values())
        .filter(c => c.warehouseId)
        .map(c => c.warehouseId)
    ).size;

    return {
      totalConnections,
      activeUsers,
      warehouseConnections,
      connections: Array.from(this.connections.values())
    };
  }

  // Check if user is connected
  public isUserConnected(userId: string): boolean {
    return this.userSockets.has(userId);
  }

  // Get user's socket ID
  public getUserSocketId(userId: string): string | undefined {
    return this.userSockets.get(userId);
  }

  // Force disconnect user
  public disconnectUser(userId: string): void {
    if (!this.io) return;

    const socketId = this.userSockets.get(userId);
    if (socketId) {
      const socket = this.io.sockets.sockets.get(socketId);
      if (socket) {
        socket.disconnect();
        logger.info(`Force disconnected user ${userId}`);
      }
    }
  }

  // Send system notification
  public sendSystemNotification(message: string, type: 'info' | 'warning' | 'error' | 'success' = 'info'): void {
    this.sendToAll('system_notification', {
      message,
      type,
      timestamp: new Date()
    });
  }

  // Send inventory update
  public sendInventoryUpdate(warehouseId: string, productId: string, quantity: number, action: string): void {
    this.sendToWarehouse(warehouseId, 'inventory_update', {
      productId,
      quantity,
      action,
      warehouseId
    });
  }

  // Send transaction update
  public sendTransactionUpdate(warehouseId: string, transaction: any): void {
    this.sendToWarehouse(warehouseId, 'transaction_update', {
      transaction,
      warehouseId
    });
  }

  // Send low stock alert
  public sendLowStockAlert(warehouseId: string, productId: string, productName: string, currentStock: number, minStock: number): void {
    this.sendToWarehouse(warehouseId, 'low_stock_alert', {
      productId,
      productName,
      currentStock,
      minStock,
      warehouseId
    });
  }

  // Send purchase order update
  public sendPurchaseOrderUpdate(warehouseId: string, purchaseOrder: any): void {
    this.sendToWarehouse(warehouseId, 'purchase_order_update', {
      purchaseOrder,
      warehouseId
    });
  }

  // Send supplier update
  public sendSupplierUpdate(supplierId: string, supplier: any): void {
    this.sendToAll('supplier_update', {
      supplierId,
      supplier
    });
  }

  // Send analytics update
  public sendAnalyticsUpdate(warehouseId: string, analytics: any): void {
    this.sendToWarehouse(warehouseId, 'analytics_update', {
      analytics,
      warehouseId
    });
  }

  // Send file upload update
  public sendFileUploadUpdate(userId: string, file: any): void {
    this.sendToUser(userId, 'file_upload_update', {
      file
    });
  }

  // Send real-time dashboard update
  public sendDashboardUpdate(warehouseId: string, metrics: any): void {
    this.sendToWarehouse(warehouseId, 'dashboard_update', {
      metrics,
      warehouseId
    });
  }
}

export default new WebSocketService();
