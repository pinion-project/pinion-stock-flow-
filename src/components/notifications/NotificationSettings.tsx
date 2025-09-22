import React, { useState } from 'react';
import { Bell, Mail, Smartphone, Monitor, Volume2, VolumeX, Settings, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface NotificationSettingsProps {
  onSave?: (settings: NotificationSettings) => void;
}

interface NotificationSettings {
  // General settings
  enabled: boolean;
  sound: boolean;
  volume: number;
  
  // Channels
  email: boolean;
  sms: boolean;
  push: boolean;
  desktop: boolean;
  
  // Categories
  inventory: boolean;
  system: boolean;
  users: boolean;
  reports: boolean;
  
  // Timing
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  
  // Frequency
  frequency: 'immediate' | 'hourly' | 'daily';
  
  // Custom settings
  lowStockThreshold: number;
  emailAddress: string;
  phoneNumber: string;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ onSave }) => {
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    sound: true,
    volume: 70,
    email: true,
    sms: false,
    push: true,
    desktop: true,
    inventory: true,
    system: true,
    users: false,
    reports: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    },
    frequency: 'immediate',
    lowStockThreshold: 10,
    emailAddress: 'user@example.com',
    phoneNumber: '+966501234567'
  });

  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = (key: keyof NotificationSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const updateQuietHours = (key: keyof NotificationSettings['quietHours'], value: any) => {
    setSettings(prev => ({
      ...prev,
      quietHours: { ...prev.quietHours, [key]: value }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave?.(settings);
    setHasChanges(false);
  };

  const resetToDefaults = () => {
    setSettings({
      enabled: true,
      sound: true,
      volume: 70,
      email: true,
      sms: false,
      push: true,
      desktop: true,
      inventory: true,
      system: true,
      users: false,
      reports: true,
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00'
      },
      frequency: 'immediate',
      lowStockThreshold: 10,
      emailAddress: 'user@example.com',
      phoneNumber: '+966501234567'
    });
    setHasChanges(true);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">إعدادات الإشعارات</h2>
          <p className="text-muted-foreground mt-1">
            تخصيص طريقة استلام الإشعارات والتنبيهات
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetToDefaults}>
            إعادة تعيين
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges}
            className="bg-primary hover:bg-primary/90"
          >
            <Save className="w-4 h-4 ml-2" />
            حفظ الإعدادات
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">عام</TabsTrigger>
          <TabsTrigger value="channels">القنوات</TabsTrigger>
          <TabsTrigger value="categories">الفئات</TabsTrigger>
          <TabsTrigger value="advanced">متقدم</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                الإعدادات العامة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Master Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">تفعيل الإشعارات</Label>
                  <p className="text-sm text-muted-foreground">تشغيل أو إيقاف جميع الإشعارات</p>
                </div>
                <Switch
                  checked={settings.enabled}
                  onCheckedChange={(checked) => updateSetting('enabled', checked)}
                />
              </div>

              <Separator />

              {/* Sound Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">الأصوات</Label>
                    <p className="text-sm text-muted-foreground">تشغيل الأصوات مع الإشعارات</p>
                  </div>
                  <Switch
                    checked={settings.sound}
                    onCheckedChange={(checked) => updateSetting('sound', checked)}
                    disabled={!settings.enabled}
                  />
                </div>

                {settings.sound && settings.enabled && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">مستوى الصوت</Label>
                      <Badge variant="outline">{settings.volume}%</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <VolumeX className="h-4 w-4 text-muted-foreground" />
                      <Slider
                        value={[settings.volume]}
                        onValueChange={([value]) => updateSetting('volume', value)}
                        max={100}
                        step={10}
                        className="flex-1"
                      />
                      <Volume2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Frequency */}
              <div className="space-y-2">
                <Label className="text-base font-medium">تكرار الإشعارات</Label>
                <p className="text-sm text-muted-foreground">كم مرة تريد استلام الإشعارات</p>
                <Select
                  value={settings.frequency}
                  onValueChange={(value: any) => updateSetting('frequency', value)}
                  disabled={!settings.enabled}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">فوري</SelectItem>
                    <SelectItem value="hourly">كل ساعة</SelectItem>
                    <SelectItem value="daily">يومي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Channels Settings */}
        <TabsContent value="channels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>قنوات الإشعارات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <div>
                    <Label className="text-base font-medium">البريد الإلكتروني</Label>
                    <p className="text-sm text-muted-foreground">استلام الإشعارات عبر البريد الإلكتروني</p>
                  </div>
                </div>
                <Switch
                  checked={settings.email}
                  onCheckedChange={(checked) => updateSetting('email', checked)}
                  disabled={!settings.enabled}
                />
              </div>

              {settings.email && settings.enabled && (
                <div className="mr-8 space-y-2">
                  <Label className="text-sm">عنوان البريد الإلكتروني</Label>
                  <Input
                    type="email"
                    value={settings.emailAddress}
                    onChange={(e) => updateSetting('emailAddress', e.target.value)}
                    placeholder="user@example.com"
                  />
                </div>
              )}

              <Separator />

              {/* SMS */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-green-500" />
                  <div>
                    <Label className="text-base font-medium">الرسائل النصية</Label>
                    <p className="text-sm text-muted-foreground">استلام الإشعارات عبر الرسائل النصية</p>
                  </div>
                </div>
                <Switch
                  checked={settings.sms}
                  onCheckedChange={(checked) => updateSetting('sms', checked)}
                  disabled={!settings.enabled}
                />
              </div>

              {settings.sms && settings.enabled && (
                <div className="mr-8 space-y-2">
                  <Label className="text-sm">رقم الهاتف</Label>
                  <Input
                    type="tel"
                    value={settings.phoneNumber}
                    onChange={(e) => updateSetting('phoneNumber', e.target.value)}
                    placeholder="+966501234567"
                  />
                </div>
              )}

              <Separator />

              {/* Push Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-purple-500" />
                  <div>
                    <Label className="text-base font-medium">الإشعارات المنبثقة</Label>
                    <p className="text-sm text-muted-foreground">إشعارات فورية في المتصفح</p>
                  </div>
                </div>
                <Switch
                  checked={settings.push}
                  onCheckedChange={(checked) => updateSetting('push', checked)}
                  disabled={!settings.enabled}
                />
              </div>

              <Separator />

              {/* Desktop Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Monitor className="h-5 w-5 text-orange-500" />
                  <div>
                    <Label className="text-base font-medium">إشعارات سطح المكتب</Label>
                    <p className="text-sm text-muted-foreground">إشعارات نظام التشغيل</p>
                  </div>
                </div>
                <Switch
                  checked={settings.desktop}
                  onCheckedChange={(checked) => updateSetting('desktop', checked)}
                  disabled={!settings.enabled}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Settings */}
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>فئات الإشعارات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Inventory */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">المخزون</Label>
                  <p className="text-sm text-muted-foreground">تنبيهات المخزون المنخفض والحركات</p>
                </div>
                <Switch
                  checked={settings.inventory}
                  onCheckedChange={(checked) => updateSetting('inventory', checked)}
                  disabled={!settings.enabled}
                />
              </div>

              {settings.inventory && settings.enabled && (
                <div className="mr-8 space-y-2">
                  <Label className="text-sm">حد المخزون المنخفض</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={settings.lowStockThreshold}
                      onChange={(e) => updateSetting('lowStockThreshold', parseInt(e.target.value) || 0)}
                      className="w-24"
                    />
                    <span className="text-sm text-muted-foreground">قطعة</span>
                  </div>
                </div>
              )}

              <Separator />

              {/* System */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">النظام</Label>
                  <p className="text-sm text-muted-foreground">تحديثات النظام والصيانة</p>
                </div>
                <Switch
                  checked={settings.system}
                  onCheckedChange={(checked) => updateSetting('system', checked)}
                  disabled={!settings.enabled}
                />
              </div>

              <Separator />

              {/* Users */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">المستخدمين</Label>
                  <p className="text-sm text-muted-foreground">أنشطة المستخدمين الجدد والتغييرات</p>
                </div>
                <Switch
                  checked={settings.users}
                  onCheckedChange={(checked) => updateSetting('users', checked)}
                  disabled={!settings.enabled}
                />
              </div>

              <Separator />

              {/* Reports */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">التقارير</Label>
                  <p className="text-sm text-muted-foreground">اكتمال التقارير والتحليلات</p>
                </div>
                <Switch
                  checked={settings.reports}
                  onCheckedChange={(checked) => updateSetting('reports', checked)}
                  disabled={!settings.enabled}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                الإعدادات المتقدمة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quiet Hours */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">ساعات الهدوء</Label>
                    <p className="text-sm text-muted-foreground">إيقاف الإشعارات في أوقات محددة</p>
                  </div>
                  <Switch
                    checked={settings.quietHours.enabled}
                    onCheckedChange={(checked) => updateQuietHours('enabled', checked)}
                    disabled={!settings.enabled}
                  />
                </div>

                {settings.quietHours.enabled && settings.enabled && (
                  <div className="mr-8 grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">من الساعة</Label>
                      <Input
                        type="time"
                        value={settings.quietHours.start}
                        onChange={(e) => updateQuietHours('start', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">إلى الساعة</Label>
                      <Input
                        type="time"
                        value={settings.quietHours.end}
                        onChange={(e) => updateQuietHours('end', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Test Notification */}
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">اختبار الإشعارات</Label>
                  <p className="text-sm text-muted-foreground">إرسال إشعار تجريبي للتأكد من الإعدادات</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    // Test notification logic here
                    alert('تم إرسال إشعار تجريبي!');
                  }}
                  disabled={!settings.enabled}
                >
                  إرسال إشعار تجريبي
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Changes Banner */}
      {hasChanges && (
        <div className="fixed bottom-4 right-4 left-4 z-50">
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <span className="font-medium">لديك تغييرات غير محفوظة</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setHasChanges(false)}>
                    تجاهل
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    حفظ الآن
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default NotificationSettings;