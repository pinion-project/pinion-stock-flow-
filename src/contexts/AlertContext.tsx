import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { useRealtime } from './RealtimeContext';

interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'low_stock' | 'security' | 'system_error' | 'maintenance' | 'unauthorized_access';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  acknowledged: boolean;
  userId?: string;
  warehouseId?: string;
  productId?: string;
  metadata?: Record<string, any>;
}

interface AlertRule {
  id: string;
  name: string;
  type: Alert['type'];
  condition: string;
  threshold?: number;
  enabled: boolean;
  notificationMethods: ('toast' | 'email' | 'sms')[];
}

interface AlertContextType {
  alerts: Alert[];
  activeAlerts: Alert[];
  alertRules: AlertRule[];
  createAlert: (alert: Omit<Alert, 'id' | 'timestamp' | 'acknowledged'>) => void;
  acknowledgeAlert: (alertId: string) => void;
  dismissAlert: (alertId: string) => void;
  updateAlertRule: (ruleId: string, updates: Partial<AlertRule>) => void;
  getAlertsByType: (type: Alert['type']) => Alert[];
  getAlertsBySeverity: (severity: Alert['severity']) => Alert[];
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { updates } = useRealtime();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [alertRules, setAlertRules] = useState<AlertRule[]>([
    {
      id: 'low-stock-rule',
      name: 'تنبيه المخزون المنخفض',
      type: 'low_stock',
      condition: 'quantity <= threshold',
      threshold: 10,
      enabled: true,
      notificationMethods: ['toast', 'email']
    },
    {
      id: 'security-rule',
      name: 'تنبيه أمني',
      type: 'security',
      condition: 'failed_login_attempts >= 3',
      threshold: 3,
      enabled: true,
      notificationMethods: ['toast', 'email', 'sms']
    },
    {
      id: 'maintenance-rule',
      name: 'تنبيه الصيانة',
      type: 'maintenance',
      condition: 'warehouse_status = maintenance',
      enabled: true,
      notificationMethods: ['toast']
    },
    {
      id: 'unauthorized-access-rule',
      name: 'تنبيه الوصول غير المصرح',
      type: 'unauthorized_access',
      condition: 'access_denied = true',
      enabled: true,
      notificationMethods: ['toast', 'email']
    }
  ]);

  // مراقبة التحديثات الفورية لإنشاء تنبيهات
  useEffect(() => {
    updates.forEach(update => {
      // تحقق من قواعد التنبيهات
      alertRules.forEach(rule => {
        if (!rule.enabled) return;

        let shouldAlert = false;
        let alertData: Partial<Alert> = {};

        switch (rule.type) {
          case 'low_stock':
            if (update.type === 'inventory_change' && update.data.quantity < 0) {
              const remainingStock = Math.abs(update.data.quantity); // محاكاة
              if (remainingStock <= (rule.threshold || 10)) {
                shouldAlert = true;
                alertData = {
                  title: 'مخزون منخفض',
                  message: `المنتج "${update.data.productName}" وصل إلى مستوى منخفض (${remainingStock} قطعة متبقية)`,
                  severity: remainingStock <= 5 ? 'critical' : 'high',
                  productId: update.data.sku,
                  warehouseId: update.warehouseId
                };
              }
            }
            break;

          case 'maintenance':
            if (update.type === 'warehouse_update' && update.data.status === 'maintenance') {
              shouldAlert = true;
              alertData = {
                title: 'مخزن تحت الصيانة',
                message: `المخزن "${update.data.warehouseName}" دخل في وضع الصيانة`,
                severity: 'medium',
                warehouseId: update.warehouseId
              };
            }
            break;

          case 'unauthorized_access':
            // محاكاة اكتشاف محاولة وصول غير مصرح
            if (Math.random() < 0.1) { // 10% احتمال لمحاكاة التنبيه
              shouldAlert = true;
              alertData = {
                title: 'محاولة وصول غير مصرح',
                message: 'تم اكتشاف محاولة وصول غير مصرح بها إلى النظام',
                severity: 'critical',
                userId: 'unknown-user'
              };
            }
            break;
        }

        if (shouldAlert) {
          createAlert({
            ...alertData,
            type: rule.type
          } as Omit<Alert, 'id' | 'timestamp' | 'acknowledged'>);
        }
      });
    });
  }, [updates, alertRules]);

  // إنشاء تنبيهات تلقائية للنظام
  useEffect(() => {
    const systemAlerts: Alert[] = [
      {
        id: 'system-1',
        title: 'فحص النظام اليومي',
        message: 'تم إجراء فحص شامل للنظام - تم اكتشاف 3 منتجات بمخزون منخفض',
        type: 'low_stock',
        severity: 'medium',
        timestamp: new Date().toISOString(),
        acknowledged: false,
        metadata: {
          productsCount: 3,
          checkType: 'daily'
        }
      },
      {
        id: 'security-1',
        title: 'تحديث أمني',
        message: 'تم تطبيق تحديث أمني جديد على النظام',
        type: 'security',
        severity: 'low',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        acknowledged: false,
        metadata: {
          updateVersion: '2.1.1',
          securityLevel: 'enhanced'
        }
      }
    ];

    setAlerts(prev => {
      const hasSystemAlerts = prev.some(alert => alert.id.startsWith('system-'));
      if (!hasSystemAlerts) {
        return [...systemAlerts, ...prev];
      }
      return prev;
    });
  }, []);

  const createAlert = (alertData: Omit<Alert, 'id' | 'timestamp' | 'acknowledged'>) => {
    const newAlert: Alert = {
      ...alertData,
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      acknowledged: false
    };

    setAlerts(prev => [newAlert, ...prev.slice(0, 99)]); // الاحتفاظ بآخر 100 تنبيه

    // إرسال إشعارات حسب قواعد التنبيه
    const rule = alertRules.find(r => r.type === alertData.type && r.enabled);
    if (rule?.notificationMethods.includes('toast')) {
      const toastConfig = {
        description: newAlert.message,
        duration: newAlert.severity === 'critical' ? 10000 : 5000
      };

      switch (newAlert.severity) {
        case 'critical':
          toast.error(newAlert.title, toastConfig);
          break;
        case 'high':
          toast.warning(newAlert.title, toastConfig);
          break;
        case 'medium':
          toast.info(newAlert.title, toastConfig);
          break;
        default:
          toast(newAlert.title, toastConfig);
      }
    }

    // محاكاة إرسال إيميل أو SMS
    if (rule?.notificationMethods.includes('email')) {
      console.log(`📧 إرسال إيميل: ${newAlert.title}`);
    }
    if (rule?.notificationMethods.includes('sms')) {
      console.log(`📱 إرسال SMS: ${newAlert.title}`);
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const updateAlertRule = (ruleId: string, updates: Partial<AlertRule>) => {
    setAlertRules(prev => 
      prev.map(rule => 
        rule.id === ruleId ? { ...rule, ...updates } : rule
      )
    );
  };

  const getAlertsByType = (type: Alert['type']) => {
    return alerts.filter(alert => alert.type === type);
  };

  const getAlertsBySeverity = (severity: Alert['severity']) => {
    return alerts.filter(alert => alert.severity === severity);
  };

  const activeAlerts = alerts.filter(alert => !alert.acknowledged);

  const value: AlertContextType = {
    alerts,
    activeAlerts,
    alertRules,
    createAlert,
    acknowledgeAlert,
    dismissAlert,
    updateAlertRule,
    getAlertsByType,
    getAlertsBySeverity
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  );
};

export default AlertProvider;