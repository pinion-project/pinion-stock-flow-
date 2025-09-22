import React, { useState, useEffect } from 'react';
import { Bell, X, Check, AlertTriangle, Info, CheckCircle, Clock, Trash2 } from 'lucide-react';
import { useRealtime } from '@/contexts/RealtimeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  category: 'inventory' | 'system' | 'user' | 'report';
}

const NotificationCenter = () => {
  const { updates } = useRealtime();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'مخزون منخفض',
      message: 'المنتج "لابتوب Dell" وصل إلى الحد الأدنى للمخزون (5 قطع متبقية)',
      type: 'warning',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      category: 'inventory'
    },
    {
      id: '2',
      title: 'تم إكمال النقل',
      message: 'تم نقل 50 قطعة من "ماوس لاسلكي" من المخزن الرئيسي إلى المخزن المسطح',
      type: 'success',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
      category: 'inventory'
    },
    {
      id: '3',
      title: 'تحديث النظام',
      message: 'تم تحديث النظام إلى الإصدار 2.1.1 بنجاح',
      type: 'info',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: true,
      category: 'system'
    },
    {
      id: '4',
      title: 'مستخدم جديد',
      message: 'تم إضافة مستخدم جديد: أحمد محمد (مدير مخزن)',
      type: 'info',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      read: true,
      category: 'user'
    },
    {
      id: '5',
      title: 'تقرير شهري جاهز',
      message: 'تقرير المخزون الشهري لشهر يناير 2024 جاهز للمراجعة',
      type: 'info',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      category: 'report'
    }
  ]);

  const [isOpen, setIsOpen] = useState(false);

  // دمج التحديثات الفورية مع الإشعارات
  useEffect(() => {
    const realtimeNotifications = updates.slice(0, 10).map(update => ({
      id: `realtime-${update.id}`,
      title: getUpdateTitle(update.type),
      message: getUpdateMessage(update),
      type: getUpdateNotificationType(update.type),
      timestamp: new Date(update.timestamp),
      read: false,
      category: getCategoryFromType(update.type)
    }));

    setNotifications(prev => {
      const existingIds = new Set(prev.map(n => n.id));
      const uniqueNew = realtimeNotifications.filter(n => !existingIds.has(n.id));
      return [...uniqueNew, ...prev].slice(0, 50); // الاحتفاظ بآخر 50 إشعار
    });
  }, [updates]);

  const getUpdateTitle = (type: string) => {
    switch (type) {
      case 'inventory_change':
        return 'تحديث المخزون';
      case 'warehouse_update':
        return 'تحديث المخزن';
      case 'user_action':
        return 'إجراء مستخدم';
      case 'system_alert':
        return 'تنبيه النظام';
      default:
        return 'إشعار جديد';
    }
  };

  const getUpdateMessage = (update: any) => {
    switch (update.type) {
      case 'inventory_change':
        return `تم ${update.data.quantity > 0 ? 'إضافة' : 'خصم'} ${Math.abs(update.data.quantity)} من ${update.data.productName} في ${update.data.warehouse}`;
      case 'warehouse_update':
        return `${update.data.warehouseName}: ${update.data.message}`;
      default:
        return update.data.message || 'تحديث جديد في النظام';
    }
  };

  const getUpdateNotificationType = (type: string): 'info' | 'success' | 'warning' | 'error' => {
    switch (type) {
      case 'inventory_change':
        return 'info';
      case 'warehouse_update':
        return 'warning';
      case 'system_alert':
        return 'error';
      default:
        return 'info';
    }
  };

  const getCategoryFromType = (type: string): 'inventory' | 'system' | 'user' | 'report' => {
    switch (type) {
      case 'inventory_change':
        return 'inventory';
      case 'warehouse_update':
        return 'system';
      case 'user_action':
        return 'user';
      default:
        return 'system';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getCategoryColor = (category: Notification['category']) => {
    switch (category) {
      case 'inventory':
        return 'bg-blue-100 text-blue-800';
      case 'system':
        return 'bg-gray-100 text-gray-800';
      case 'user':
        return 'bg-green-100 text-green-800';
      case 'report':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: Notification['category']) => {
    switch (category) {
      case 'inventory':
        return 'المخزون';
      case 'system':
        return 'النظام';
      case 'user':
        return 'المستخدمين';
      case 'report':
        return 'التقارير';
      default:
        return 'عام';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${days} يوم`;
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Add a random notification every 30 seconds (for demo purposes)
      const randomNotifications = [
        {
          title: 'طلب جديد',
          message: 'تم استلام طلب جديد من العميل محمد أحمد',
          type: 'info' as const,
          category: 'inventory' as const
        },
        {
          title: 'نفاد المخزون',
          message: 'المنتج "كيبورد ميكانيكي" نفد من المخزون',
          type: 'error' as const,
          category: 'inventory' as const
        },
        {
          title: 'نسخة احتياطية مكتملة',
          message: 'تم إنشاء النسخة الاحتياطية اليومية بنجاح',
          type: 'success' as const,
          category: 'system' as const
        }
      ];

      if (Math.random() > 0.7) { // 30% chance
        const randomNotification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
        const newNotification: Notification = {
          id: Date.now().toString(),
          ...randomNotification,
          timestamp: new Date(),
          read: false
        };
        
        setNotifications(prev => [newNotification, ...prev]);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-96 p-0" dir="rtl">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">الإشعارات</h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  <Check className="h-3 w-3 ml-1" />
                  قراءة الكل
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllNotifications}
                className="text-xs text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3 ml-1" />
                مسح الكل
              </Button>
            </div>
          </div>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              لديك {unreadCount} إشعار غير مقروء
            </p>
          )}
        </div>

        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>لا توجد إشعارات</p>
            </div>
          ) : (
            <div className="p-2">
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <Card 
                    className={`mb-2 cursor-pointer transition-colors hover:bg-muted/50 ${
                      !notification.read ? 'border-primary/50 bg-primary/5' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-sm truncate">
                              {notification.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${getCategoryColor(notification.category)}`}
                              >
                                {getCategoryLabel(notification.category)}
                              </Badge>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary rounded-full" />
                              )}
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatTimestamp(notification.timestamp)}
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="h-6 w-6 p-0 text-muted-foreground hover:text-red-600"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {index < notifications.length - 1 && <Separator className="my-1" />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        <div className="p-3 border-t">
          <Button variant="outline" className="w-full" size="sm">
            عرض جميع الإشعارات
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationCenter;