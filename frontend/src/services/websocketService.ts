import { io, Socket } from 'socket.io-client';

// WebSocket event types
export interface WebSocketEvent {
  type: string;
  data: any;
  timestamp: string;
}

// WebSocket configuration
interface WebSocketConfig {
  url: string;
  token: string;
  userId: string;
  warehouseId?: string;
  autoReconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

class WebSocketService {
  private socket: Socket | null = null;
  private config: WebSocketConfig | null = null;
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private eventHandlers: Map<string, Function[]> = new Map();
  private isConnected = false;
  private isConnecting = false;

  constructor() {
    this.setupEventHandlers();
  }

  // Connect to WebSocket server
  public connect(config: WebSocketConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnected || this.isConnecting) {
        resolve();
        return;
      }

      this.config = config;
      this.isConnecting = true;

      try {
        this.socket = io(config.url, {
          auth: {
            userId: config.userId,
            token: config.token,
          },
          transports: ['websocket', 'polling'],
          autoConnect: true,
        });

        this.socket.on('connect', () => {
          this.isConnected = true;
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          
          // Join warehouse room if specified
          if (config.warehouseId) {
            this.joinWarehouse(config.warehouseId);
          }

          this.emit('connected');
          resolve();
        });

        this.socket.on('disconnect', (reason) => {
          this.isConnected = false;
          this.isConnecting = false;
          this.emit('disconnected', reason);

          // Auto-reconnect if enabled
          if (config.autoReconnect && this.reconnectAttempts < (config.maxReconnectAttempts || 5)) {
            this.scheduleReconnect();
          }
        });

        this.socket.on('connect_error', (error) => {
          this.isConnecting = false;
          this.emit('error', error);
          reject(error);
        });

        // Handle server events
        this.socket.on('new_notification', (data) => {
          this.emit('notification', data);
        });

        this.socket.on('inventory_update', (data) => {
          this.emit('inventory_update', data);
        });

        this.socket.on('transaction_update', (data) => {
          this.emit('transaction_update', data);
        });

        this.socket.on('low_stock_alert', (data) => {
          this.emit('low_stock_alert', data);
        });

        this.socket.on('purchase_order_update', (data) => {
          this.emit('purchase_order_update', data);
        });

        this.socket.on('supplier_update', (data) => {
          this.emit('supplier_update', data);
        });

        this.socket.on('analytics_update', (data) => {
          this.emit('analytics_update', data);
        });

        this.socket.on('file_upload_update', (data) => {
          this.emit('file_upload_update', data);
        });

        this.socket.on('dashboard_update', (data) => {
          this.emit('dashboard_update', data);
        });

        this.socket.on('system_notification', (data) => {
          this.emit('system_notification', data);
        });

      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  // Disconnect from WebSocket server
  public disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.isConnected = false;
    this.isConnecting = false;
  }

  // Join warehouse room
  public joinWarehouse(warehouseId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_warehouse', warehouseId);
    }
  }

  // Leave warehouse room
  public leaveWarehouse(warehouseId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_warehouse', warehouseId);
    }
  }

  // Send custom event
  public send(event: string, data: any): void {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    } else {
      console.warn('WebSocket not connected. Cannot send message.');
    }
  }

  // Add event listener
  public on(event: string, handler: Function): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  // Remove event listener
  public off(event: string, handler?: Function): void {
    if (!this.eventHandlers.has(event)) return;

    if (handler) {
      const handlers = this.eventHandlers.get(event)!;
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    } else {
      this.eventHandlers.delete(event);
    }
  }

  // Ping server
  public ping(): void {
    this.send('ping', {});
  }

  // Check connection status
  public isConnectedToServer(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  // Get connection state
  public getConnectionState(): string {
    if (this.isConnecting) return 'connecting';
    if (this.isConnected) return 'connected';
    return 'disconnected';
  }

  // Setup default event handlers
  private setupEventHandlers(): void {
    // Handle authentication response
    this.on('authenticated', (data: any) => {
      console.log('WebSocket authenticated:', data);
    });

    // Handle authentication error
    this.on('auth_error', (data: any) => {
      console.error('WebSocket authentication error:', data);
    });

    // Handle warehouse join/leave responses
    this.on('joined_warehouse', (data: any) => {
      console.log('Joined warehouse:', data);
    });

    this.on('left_warehouse', (data: any) => {
      console.log('Left warehouse:', data);
    });

    // Handle pong response
    this.on('pong', () => {
      console.log('Received pong from server');
    });
  }

  // Emit event to handlers
  private emit(event: string, data?: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error('Error in event handler:', error);
        }
      });
    }
  }

  // Schedule reconnection
  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;

    const interval = this.config?.reconnectInterval || 5000;
    this.reconnectAttempts++;

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (this.config) {
        this.connect(this.config).catch(error => {
          console.error('Reconnection failed:', error);
        });
      }
    }, interval);
  }
}

// Export singleton instance
export default new WebSocketService();
