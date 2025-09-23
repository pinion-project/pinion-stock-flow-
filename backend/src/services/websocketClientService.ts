// This is a client-side WebSocket service for the frontend
// It should be moved to the frontend project

export interface WebSocketEvent {
  type: string;
  data: any;
  timestamp: string;
}

export interface WebSocketConfig {
  url: string;
  token: string;
  userId: string;
  warehouseId?: string;
  autoReconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

class WebSocketClientService {
  private socket: WebSocket | null = null;
  private config: WebSocketConfig | null = null;
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private eventHandlers: Map<string, Function[]> = new Map();
  private isConnected = false;
  private isConnecting = false;

  constructor() {
    this.setupEventHandlers();
  }

  public connect(config: WebSocketConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnected || this.isConnecting) {
        resolve();
        return;
      }

      this.config = config;
      this.isConnecting = true;

      try {
        this.socket = new WebSocket(config.url);

        this.socket.onopen = () => {
          this.isConnected = true;
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          
          // Authenticate with the server
          this.send('authenticate', {
            userId: config.userId,
            token: config.token
          });

          // Join warehouse room if specified
          if (config.warehouseId) {
            this.send('join_warehouse', config.warehouseId);
          }

          this.emit('connected');
          resolve();
        };

        this.socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.socket.onclose = (event) => {
          this.isConnected = false;
          this.isConnecting = false;
          this.emit('disconnected', event);

          // Auto-reconnect if enabled
          if (config.autoReconnect && this.reconnectAttempts < (config.maxReconnectAttempts || 5)) {
            this.scheduleReconnect();
          }
        };

        this.socket.onerror = (error) => {
          this.isConnecting = false;
          this.emit('error', error);
          reject(error);
        };

      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  public disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    this.isConnected = false;
    this.isConnecting = false;
  }

  public send(event: string, data: any): void {
    if (this.socket && this.isConnected) {
      this.socket.send(JSON.stringify({
        event,
        data,
        timestamp: new Date().toISOString()
      }));
    } else {
      console.warn('WebSocket not connected. Cannot send message.');
    }
  }

  public on(event: string, handler: Function): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

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

  public joinWarehouse(warehouseId: string): void {
    this.send('join_warehouse', warehouseId);
  }

  public leaveWarehouse(warehouseId: string): void {
    this.send('leave_warehouse', warehouseId);
  }

  public ping(): void {
    this.send('ping', {});
  }

  public isConnectedToServer(): boolean {
    return this.isConnected;
  }

  public getConnectionState(): string {
    if (this.isConnecting) return 'connecting';
    if (this.isConnected) return 'connected';
    return 'disconnected';
  }

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

    // Handle system notifications
    this.on('system_notification', (data: any) => {
      console.log('System notification:', data);
      // You can integrate this with your notification system
    });

    // Handle inventory updates
    this.on('inventory_update', (data: any) => {
      console.log('Inventory update:', data);
      // Update your inventory state
    });

    // Handle transaction updates
    this.on('transaction_update', (data: any) => {
      console.log('Transaction update:', data);
      // Update your transaction state
    });

    // Handle low stock alerts
    this.on('low_stock_alert', (data: any) => {
      console.log('Low stock alert:', data);
      // Show low stock notification
    });

    // Handle purchase order updates
    this.on('purchase_order_update', (data: any) => {
      console.log('Purchase order update:', data);
      // Update your purchase order state
    });

    // Handle supplier updates
    this.on('supplier_update', (data: any) => {
      console.log('Supplier update:', data);
      // Update your supplier state
    });

    // Handle analytics updates
    this.on('analytics_update', (data: any) => {
      console.log('Analytics update:', data);
      // Update your analytics dashboard
    });

    // Handle file upload updates
    this.on('file_upload_update', (data: any) => {
      console.log('File upload update:', data);
      // Update your file upload state
    });

    // Handle dashboard updates
    this.on('dashboard_update', (data: any) => {
      console.log('Dashboard update:', data);
      // Update your dashboard metrics
    });
  }

  private handleMessage(data: WebSocketEvent): void {
    const handlers = this.eventHandlers.get(data.type);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data.data);
        } catch (error) {
          console.error('Error in event handler:', error);
        }
      });
    }
  }

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
export default new WebSocketClientService();
