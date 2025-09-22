import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

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
  const [ws, setWs] = useState<WebSocket | null>(null);

  // محاكاة الاتصال بـ WebSocket
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // محاكاة إنشاء اتصال WebSocket
    const mockWebSocket = {
      send: (data: string) => {
        console.log('Sending:', data);
      },
      close: () => {
        setIsConnected(false);
      }
    } as WebSocket;

    setWs(mockWebSocket);
    setIsConnected(true);

    // محاكاة استقبال التحديثات
    const simulateUpdates = () => {
      const mockUpdates: RealtimeUpdate[] = [
        {
          id: Date.now().toString(),
          type: 'inventory_change',
          data: {
            productName: 'لابتوب ديل XPS 13',
            sku: 'DELL-XPS-001',
            quantity: -2,
            warehouse: 'المخزن الرئيسي',
            reason: 'بيع للعميل'
          },
          timestamp: new Date().toISOString(),
          userId: 'user-2',
          warehouseId: 'warehouse-1'
        },
        {
          id: (Date.now() + 1).toString(),
          type: 'warehouse_update',
          data: {
            warehouseName: 'المخزن المسطح',
            status: 'maintenance',
            message: 'بدء أعمال الصيانة الدورية'
          },
          timestamp: new Date().toISOString(),
          warehouseId: 'warehouse-2'
        }
      ];

      // إضافة التحديثات تدريجياً
      mockUpdates.forEach((update, index) => {
        setTimeout(() => {
          setUpdates(prev => [update, ...prev.slice(0, 49)]); // الاحتفاظ بآخر 50 تحديث
          
          // عرض إشعار للمستخدم
          if (update.type === 'inventory_change') {
            toast.info(`تم تحديث المخزون: ${update.data.productName}`, {
              description: `الكمية: ${update.data.quantity > 0 ? '+' : ''}${update.data.quantity} في ${update.data.warehouse}`
            });
          } else if (update.type === 'warehouse_update') {
            toast.warning(`تحديث المخزن: ${update.data.warehouseName}`, {
              description: update.data.message
            });
          }
        }, index * 3000); // تأخير 3 ثوان بين كل تحديث
      });
    };

    // بدء محاكاة التحديثات بعد 5 ثوان
    const timer = setTimeout(simulateUpdates, 5000);

    return () => {
      clearTimeout(timer);
      mockWebSocket.close();
    };
  }, [isAuthenticated, user]);

  const sendUpdate = (update: Omit<RealtimeUpdate, 'id' | 'timestamp'>) => {
    if (!ws || !isConnected) return;

    const fullUpdate: RealtimeUpdate = {
      ...update,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };

    // إرسال التحديث عبر WebSocket (محاكاة)
    ws.send(JSON.stringify(fullUpdate));
    
    // إضافة التحديث محلياً
    setUpdates(prev => [fullUpdate, ...prev.slice(0, 49)]);
  };

  const clearUpdates = () => {
    setUpdates([]);
  };

  const subscribeToWarehouse = (warehouseId: string) => {
    setSubscribedWarehouses(prev => new Set([...prev, warehouseId]));
    if (ws && isConnected) {
      ws.send(JSON.stringify({ action: 'subscribe', warehouseId }));
    }
  };

  const unsubscribeFromWarehouse = (warehouseId: string) => {
    setSubscribedWarehouses(prev => {
      const newSet = new Set(prev);
      newSet.delete(warehouseId);
      return newSet;
    });
    if (ws && isConnected) {
      ws.send(JSON.stringify({ action: 'unsubscribe', warehouseId }));
    }
  };

  const value: RealtimeContextType = {
    isConnected,
    updates,
    sendUpdate,
    clearUpdates,
    subscribeToWarehouse,
    unsubscribeFromWarehouse
  };

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
};

export default RealtimeProvider;