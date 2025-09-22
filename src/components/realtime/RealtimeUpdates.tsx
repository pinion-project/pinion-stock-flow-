import React from 'react';
import { Bell, Package, Building2, User, AlertTriangle, CheckCircle, Clock, Wifi, WifiOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRealtime } from '@/contexts/RealtimeContext';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface RealtimeUpdatesProps {
  className?: string;
  maxHeight?: string;
}

const RealtimeUpdates: React.FC<RealtimeUpdatesProps> = ({ 
  className = '', 
  maxHeight = 'h-96' 
}) => {
  const { isConnected, updates, clearUpdates } = useRealtime();

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'inventory_change':
        return <Package className="h-4 w-4" />;
      case 'warehouse_update':
        return <Building2 className="h-4 w-4" />;
      case 'user_action':
        return <User className="h-4 w-4" />;
      case 'system_alert':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getUpdateColor = (type: string) => {
    switch (type) {
      case 'inventory_change':
        return 'text-blue-600 bg-blue-50';
      case 'warehouse_update':
        return 'text-orange-600 bg-orange-50';
      case 'user_action':
        return 'text-green-600 bg-green-50';
      case 'system_alert':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

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
        return 'تحديث';
    }
  };

  const formatUpdateMessage = (update: any) => {
    switch (update.type) {
      case 'inventory_change':
        return `${update.data.productName} - ${update.data.quantity > 0 ? 'إضافة' : 'خصم'} ${Math.abs(update.data.quantity)} قطعة`;
      case 'warehouse_update':
        return `${update.data.warehouseName}: ${update.data.message}`;
      case 'user_action':
        return update.data.message || 'تم تنفيذ إجراء جديد';
      case 'system_alert':
        return update.data.message || 'تنبيه من النظام';
      default:
        return 'تحديث جديد';
    }
  };

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Bell className="h-5 w-5" />
            التحديثات الفورية
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge 
              variant={isConnected ? "default" : "destructive"}
              className="flex items-center gap-1"
            >
              {isConnected ? (
                <>
                  <Wifi className="h-3 w-3" />
                  متصل
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3" />
                  غير متصل
                </>
              )}
            </Badge>
            {updates.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearUpdates}
                className="text-xs"
              >
                مسح الكل
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className={maxHeight}>
          {updates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>لا توجد تحديثات جديدة</p>
              <p className="text-sm">ستظهر التحديثات الفورية هنا</p>
            </div>
          ) : (
            <div className="space-y-3">
              {updates.map((update) => (
                <div 
                  key={update.id} 
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className={`p-2 rounded-full ${getUpdateColor(update.type)}`}>
                    {getUpdateIcon(update.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium">
                        {getUpdateTitle(update.type)}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(update.timestamp), { 
                          addSuffix: true, 
                          locale: ar 
                        })}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatUpdateMessage(update)}
                    </p>
                    {update.data.warehouse && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        {update.data.warehouse}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RealtimeUpdates;