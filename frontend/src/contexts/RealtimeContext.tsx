import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import websocketService from '@/services/websocketService';

interface RealtimeUpdate {
  id: string;
  type: 'inventory_change' | 'warehouse_update' | 'user_action' | 'system_alert';
  data: any;
  timestamp: string;
  userId?: string;
  warehouseId?: string;
}

interface RealtimeContextType {
  isConnected: boolean;
  updates: RealtimeUpdate[];
  sendUpdate: (update: Omit<RealtimeUpdate, 'id' | 'timestamp'>) => void;
  clearUpdates: () => void;
  subscribeToWarehouse: (warehouseId: string) => void;
  unsubscribeFromWarehouse: (warehouseId: string) => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (context === undefined) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};

interface RealtimeProviderProps {
  children: ReactNode;
}

export const RealtimeProvider: React.FC<RealtimeProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [updates, setUpdates] = useState<RealtimeUpdate[]>([]);
  const [subscribedWarehouses, setSubscribedWarehouses] = useState<Set<string>>(new Set());

  // الاتصال الحقيقي بـ WebSocket
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const url = (import.meta as any).env?.VITE_WS_URL || 'http://localhost:5000';

    websocketService
      .connect({
        url,
        token: localStorage.getItem('auth_token') || '',
        userId: user.id,
        warehouseId: user.warehouseId,
        autoReconnect: true,
        reconnectInterval: 5000,
        maxReconnectAttempts: 10,
      })
      .then(() => setIsConnected(true))
      .catch(() => setIsConnected(false));

    const onNotification = (data: any) => {
      toast.info(data.title || 'إشعار جديد', { description: data.message });
    };
    const onLowStock = (data: any) => {
      toast.warning(`تنبيه مخزون منخفض: ${data.productName}`, {
        description: `الكمية الحالية: ${data.currentStock}`,
      });
    };
    const onInventory = (data: any) => {
      setUpdates(prev => [
        { id: String(Date.now()), type: 'inventory_change', data, timestamp: new Date().toISOString() },
        ...prev.slice(0, 49),
      ]);
    };

    websocketService.on('notification', onNotification);
    websocketService.on('low_stock_alert', onLowStock);
    websocketService.on('inventory_update', onInventory);

    return () => {
      websocketService.off('notification', onNotification);
      websocketService.off('low_stock_alert', onLowStock);
      websocketService.off('inventory_update', onInventory);
      websocketService.disconnect();
      setIsConnected(false);
    };
  }, [isAuthenticated, user]);

  const sendUpdate = (update: Omit<RealtimeUpdate, 'id' | 'timestamp'>) => {
    if (!isConnected) return;

    const fullUpdate: RealtimeUpdate = {
      ...update,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };

    websocketService.send('custom_event', fullUpdate);

    setUpdates(prev => [fullUpdate, ...prev.slice(0, 49)]);
  };

  const clearUpdates = () => {
    setUpdates([]);
  };

  const subscribeToWarehouse = (warehouseId: string) => {
    setSubscribedWarehouses(prev => new Set([...prev, warehouseId]));
    if (isConnected) {
      websocketService.send('join_warehouse', warehouseId);
    }
  };

  const unsubscribeFromWarehouse = (warehouseId: string) => {
    setSubscribedWarehouses(prev => {
      const newSet = new Set(prev);
      newSet.delete(warehouseId);
      return newSet;
    });
    if (isConnected) {
      websocketService.send('leave_warehouse', warehouseId);
    }
  };

  const value: RealtimeContextType = {
    isConnected,
    updates,
    sendUpdate,
    clearUpdates,
    subscribeToWarehouse,
    unsubscribeFromWarehouse,
  };

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
};

export default RealtimeProvider;