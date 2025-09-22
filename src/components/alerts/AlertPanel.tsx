import React, { useState } from 'react';
import { AlertTriangle, Shield, Wrench, Eye, EyeOff, Check, X, Settings, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAlert } from '@/contexts/AlertContext';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface AlertPanelProps {
  className?: string;
  showOnlyActive?: boolean;
}

const AlertPanel: React.FC<AlertPanelProps> = ({ 
  className = '', 
  showOnlyActive = false 
}) => {
  const { 
    alerts, 
    activeAlerts, 
    acknowledgeAlert, 
    dismissAlert, 
    getAlertsByType, 
    getAlertsBySeverity 
  } = useAlert();
  
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'low_stock':
        return <AlertTriangle className="h-4 w-4" />;
      case 'security':
        return <Shield className="h-4 w-4" />;
      case 'maintenance':
        return <Wrench className="h-4 w-4" />;
      case 'unauthorized_access':
        return <Eye className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getTypeDisplayName = (type: string) => {
    switch (type) {
      case 'low_stock':
        return 'مخزون منخفض';
      case 'security':
        return 'أمني';
      case 'maintenance':
        return 'صيانة';
      case 'unauthorized_access':
        return 'وصول غير مصرح';
      case 'system_error':
        return 'خطأ نظام';
      default:
        return type;
    }
  };

  const getSeverityDisplayName = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'حرج';
      case 'high':
        return 'عالي';
      case 'medium':
        return 'متوسط';
      case 'low':
        return 'منخفض';
      default:
        return severity;
    }
  };

  const filteredAlerts = (showOnlyActive ? activeAlerts : alerts).filter(alert => {
    const severityMatch = selectedSeverity === 'all' || alert.severity === selectedSeverity;
    const typeMatch = selectedType === 'all' || alert.type === selectedType;
    return severityMatch && typeMatch;
  });

  const criticalAlerts = filteredAlerts.filter(alert => alert.severity === 'critical');
  const highAlerts = filteredAlerts.filter(alert => alert.severity === 'high');
  const mediumAlerts = filteredAlerts.filter(alert => alert.severity === 'medium');
  const lowAlerts = filteredAlerts.filter(alert => alert.severity === 'low');

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {showOnlyActive ? 'التنبيهات النشطة' : 'جميع التنبيهات'}
            {activeAlerts.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {activeAlerts.length}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="الأهمية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المستويات</SelectItem>
                <SelectItem value="critical">حرج</SelectItem>
                <SelectItem value="high">عالي</SelectItem>
                <SelectItem value="medium">متوسط</SelectItem>
                <SelectItem value="low">منخفض</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="low_stock">مخزون منخفض</SelectItem>
                <SelectItem value="security">أمني</SelectItem>
                <SelectItem value="maintenance">صيانة</SelectItem>
                <SelectItem value="unauthorized_access">وصول غير مصرح</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all" className="text-xs">
              الكل ({filteredAlerts.length})
            </TabsTrigger>
            <TabsTrigger value="critical" className="text-xs">
              حرج ({criticalAlerts.length})
            </TabsTrigger>
            <TabsTrigger value="high" className="text-xs">
              عالي ({highAlerts.length})
            </TabsTrigger>
            <TabsTrigger value="medium" className="text-xs">
              متوسط ({mediumAlerts.length})
            </TabsTrigger>
            <TabsTrigger value="low" className="text-xs">
              منخفض ({lowAlerts.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <AlertList alerts={filteredAlerts} onAcknowledge={acknowledgeAlert} onDismiss={dismissAlert} />
          </TabsContent>
          <TabsContent value="critical">
            <AlertList alerts={criticalAlerts} onAcknowledge={acknowledgeAlert} onDismiss={dismissAlert} />
          </TabsContent>
          <TabsContent value="high">
            <AlertList alerts={highAlerts} onAcknowledge={acknowledgeAlert} onDismiss={dismissAlert} />
          </TabsContent>
          <TabsContent value="medium">
            <AlertList alerts={mediumAlerts} onAcknowledge={acknowledgeAlert} onDismiss={dismissAlert} />
          </TabsContent>
          <TabsContent value="low">
            <AlertList alerts={lowAlerts} onAcknowledge={acknowledgeAlert} onDismiss={dismissAlert} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface AlertListProps {
  alerts: any[];
  onAcknowledge: (id: string) => void;
  onDismiss: (id: string) => void;
}

const AlertList: React.FC<AlertListProps> = ({ alerts, onAcknowledge, onDismiss }) => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'low_stock':
        return <AlertTriangle className="h-4 w-4" />;
      case 'security':
        return <Shield className="h-4 w-4" />;
      case 'maintenance':
        return <Wrench className="h-4 w-4" />;
      case 'unauthorized_access':
        return <Eye className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getTypeDisplayName = (type: string) => {
    switch (type) {
      case 'low_stock':
        return 'مخزون منخفض';
      case 'security':
        return 'أمني';
      case 'maintenance':
        return 'صيانة';
      case 'unauthorized_access':
        return 'وصول غير مصرح';
      case 'system_error':
        return 'خطأ نظام';
      default:
        return type;
    }
  };

  const getSeverityDisplayName = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'حرج';
      case 'high':
        return 'عالي';
      case 'medium':
        return 'متوسط';
      case 'low':
        return 'منخفض';
      default:
        return severity;
    }
  };

  return (
    <ScrollArea className="h-96">
      {alerts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Check className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>لا توجد تنبيهات</p>
          <p className="text-sm">جميع التنبيهات تم التعامل معها</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`p-4 rounded-lg border-2 ${getAlertColor(alert.severity)} ${
                alert.acknowledged ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getAlertIcon(alert.type)}
                  <h4 className="font-medium">{alert.title}</h4>
                  <Badge variant={getSeverityBadgeVariant(alert.severity)} className="text-xs">
                    {getSeverityDisplayName(alert.severity)}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {getTypeDisplayName(alert.type)}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  {!alert.acknowledged && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onAcknowledge(alert.id)}
                      className="h-8 w-8 p-0"
                      title="تأكيد القراءة"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onDismiss(alert.id)}
                    className="h-8 w-8 p-0"
                    title="إزالة التنبيه"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm mb-2">{alert.message}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {formatDistanceToNow(new Date(alert.timestamp), { 
                    addSuffix: true, 
                    locale: ar 
                  })}
                </span>
                {alert.acknowledged && (
                  <Badge variant="secondary" className="text-xs">
                    تم التأكيد
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </ScrollArea>
  );
};

export default AlertPanel;