import { useState } from "react";
import { Settings as SettingsIcon, User, Building2, Bell, Shield, Database, Key, Save, Download, Upload, RefreshCw, Palette, Globe, Monitor, Smartphone, Mail, Phone, MapPin, Calendar, Clock, AlertTriangle, CheckCircle, XCircle, Info, Trash2, Edit, Plus, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Permission } from "@/types/auth";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/navigation/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Settings = () => {
  const { hasPermission } = useAuth();
  
  const [notifications, setNotifications] = useState({
    lowStock: true,
    transferComplete: true,
    dailyReports: false,
    systemUpdates: true,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true
  });

  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("ar");
  const [showPassword, setShowPassword] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleBackup = () => {
    setIsBackingUp(true);
    setBackupProgress(0);
    
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackingUp(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleExportSettings = () => {
    const settings = {
      notifications,
      theme,
      language,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'pinion_settings.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">الإعدادات المتقدمة</h1>
              <p className="text-muted-foreground">إدارة شاملة لإعدادات النظام والتفضيلات والأمان</p>
            </div>
            
            <div className="flex gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="w-4 h-4 ml-2" />
                    تصدير/استيراد
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleExportSettings}>
                    <Download className="w-4 h-4 ml-2" />
                    تصدير الإعدادات
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Upload className="w-4 h-4 ml-2" />
                    استيراد الإعدادات
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 ml-2" />
                إعادة تعيين
              </Button>
              
              <Button className="bg-primary hover:bg-primary/90">
                <Save className="w-4 h-4 ml-2" />
                حفظ التغييرات
              </Button>
            </div>
          </div>

          <Tabs defaultValue="company" className="space-y-6">
            <TabsList className={`grid w-full ${hasPermission(Permission.MANAGE_USERS) ? 'grid-cols-8' : 'grid-cols-4'}`}>
              <TabsTrigger value="company" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                الشركة
              </TabsTrigger>
              {hasPermission(Permission.MANAGE_USERS) && (
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  المستخدمين
                </TabsTrigger>
              )}
              <TabsTrigger value="warehouses" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                المخازن
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                التنبيهات
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                الأمان
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                المظهر
              </TabsTrigger>
              {hasPermission(Permission.MANAGE_USERS) && (
                <TabsTrigger value="integrations" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  التكاملات
                </TabsTrigger>
              )}
              {hasPermission(Permission.MANAGE_USERS) && (
                <TabsTrigger value="system" className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  النظام
                </TabsTrigger>
              )}
            </TabsList>

            {/* Company Settings */}
            <TabsContent value="company">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>معلومات الشركة</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company-name">اسم الشركة</Label>
                <Input id="company-name" value="شركة بينيون مصر للتجارة" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company-email">البريد الإلكتروني</Label>
                <Input id="company-email" value="info@pinion-egypt.com" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company-phone">رقم الهاتف</Label>
                        <Input id="company-phone" value="+20 2 12345678" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company-website">الموقع الإلكتروني</Label>
                <Input id="company-website" value="www.pinion-egypt.com" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company-address">العنوان</Label>
                <Textarea id="company-address" value="القاهرة الجديدة، التجمع الخامس، شارع التسعين الشمالي، مبنى رقم 15" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>إعدادات العملة والتوقيت</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>العملة الافتراضية</Label>
                        <Select defaultValue="egp">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="egp">جنيه مصري (ج.م)</SelectItem>
                            <SelectItem value="usd">دولار أمريكي ($)</SelectItem>
                            <SelectItem value="eur">يورو (€)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>المنطقة الزمنية</Label>
                        <Select defaultValue="cairo">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cairo">القاهرة (GMT+2)</SelectItem>
                            <SelectItem value="dubai">دبي (GMT+4)</SelectItem>
                            <SelectItem value="cairo">القاهرة (GMT+2)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Users Management */}
            {hasPermission(Permission.MANAGE_USERS) && (
              <TabsContent value="users">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>إدارة المستخدمين</CardTitle>
                      <Button size="sm">إضافة مستخدم جديد</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-4">
                       {[
                         { name: "أحمد محمد", email: "ahmed@pinion-egypt.com", role: "مدير", status: "نشط" },
                         { name: "سارة أحمد", email: "sara@pinion-egypt.com", role: "محاسب", status: "نشط" },
                          { name: "محمد علي", email: "mohamed@pinion-egypt.com", role: "مخزني", status: "متوقف" },
                         { name: "فاطمة حسن", email: "fatma@pinion-egypt.com", role: "مخزني", status: "نشط" }
                       ].map((user, index) => (
                         <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                           <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                               <User className="h-5 w-5 text-primary" />
                             </div>
                             <div>
                               <h4 className="font-medium">{user.name}</h4>
                               <p className="text-sm text-muted-foreground">{user.email}</p>
                             </div>
                           </div>
                           <div className="flex items-center gap-3">
                             <Badge variant="outline">{user.role}</Badge>
                             <Badge variant={user.status === "نشط" ? "default" : "secondary"}>
                               {user.status}
                             </Badge>
                             <Button size="sm" variant="outline">تعديل</Button>
                           </div>
                         </div>
                       ))}
                     </div>
                   </CardContent>
                 </Card>
               </TabsContent>
            )}

            {/* Warehouses Settings */}
            <TabsContent value="warehouses">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>إعدادات المخازن</CardTitle>
                    <Button size="sm">إضافة مخزن جديد</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "المخزن الرئيسي", location: "القاهرة الجديدة", capacity: 3000, status: "نشط" },
                      { name: "المخزن المسطح", location: "برج العرب الجديدة", capacity: 2500, status: "نشط" },
                      { name: "مخزن الدرفلة", location: "6 أكتوبر", capacity: 3000, status: "ممتلئ" },
                      { name: "مخزن ستيل", location: "طنطا الجديدة", capacity: 2000, status: "صيانة" },
                      { name: "مخزن العربية للأسمنت", location: "أسوان", capacity: 1500, status: "نشط" },
                      { name: "مخزن غبور", location: "الإسماعيلية", capacity: 1800, status: "نشط" }
                    ].map((warehouse, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <h4 className="font-medium">{warehouse.name}</h4>
                            <p className="text-sm text-muted-foreground">{warehouse.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm">السعة: {warehouse.capacity}</span>
                          <Badge variant={
                            warehouse.status === "نشط" ? "default" : 
                            warehouse.status === "ممتلئ" ? "destructive" : "secondary"
                          }>
                            {warehouse.status}
                          </Badge>
                          <Button size="sm" variant="outline">تعديل</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>إعدادات التنبيهات العامة</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">تنبيهات المخزون المنخفض</h4>
                        <p className="text-sm text-muted-foreground">إشعار عندما ينخفض المخزون عن الحد الأدنى</p>
                      </div>
                      <Switch 
                        checked={notifications.lowStock}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, lowStock: checked }))}
                      />
                    </div>
                    <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">إتمام عمليات النقل</h4>
                      <p className="text-sm text-muted-foreground">إشعار عند إتمام نقل المنتجات بين المخازن</p>
                    </div>
                    <Switch 
                      checked={notifications.transferComplete}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, transferComplete: checked }))}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">التقارير اليومية</h4>
                      <p className="text-sm text-muted-foreground">إرسال تقرير يومي بحالة المخازن</p>
                    </div>
                    <Switch 
                      checked={notifications.dailyReports}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, dailyReports: checked }))}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">تحديثات النظام</h4>
                      <p className="text-sm text-muted-foreground">إشعارات حول تحديثات وصيانة النظام</p>
                    </div>
                    <Switch 
                      checked={notifications.systemUpdates}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, systemUpdates: checked }))}
                    />
                  </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>قنوات التنبيهات</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-blue-500" />
                        <div>
                          <h4 className="font-medium">البريد الإلكتروني</h4>
                          <p className="text-sm text-muted-foreground">إرسال التنبيهات عبر البريد الإلكتروني</p>
                        </div>
                      </div>
                      <Switch 
                        checked={notifications.emailNotifications}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailNotifications: checked }))}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-green-500" />
                        <div>
                          <h4 className="font-medium">الرسائل النصية</h4>
                          <p className="text-sm text-muted-foreground">إرسال التنبيهات عبر الرسائل النصية</p>
                        </div>
                      </div>
                      <Switch 
                        checked={notifications.smsNotifications}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, smsNotifications: checked }))}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-purple-500" />
                        <div>
                          <h4 className="font-medium">الإشعارات المباشرة</h4>
                          <p className="text-sm text-muted-foreground">إشعارات فورية في المتصفح والتطبيق</p>
                        </div>
                      </div>
                      <Switch 
                        checked={notifications.pushNotifications}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, pushNotifications: checked }))}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>إعدادات التنبيهات المتقدمة</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>تكرار التنبيهات</Label>
                        <Select defaultValue="daily">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">فوري</SelectItem>
                            <SelectItem value="hourly">كل ساعة</SelectItem>
                            <SelectItem value="daily">يومي</SelectItem>
                            <SelectItem value="weekly">أسبوعي</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>أوقات الإرسال</Label>
                        <Select defaultValue="business">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="always">دائماً</SelectItem>
                            <SelectItem value="business">أوقات العمل فقط</SelectItem>
                            <SelectItem value="custom">مخصص</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Security */}
            <TabsContent value="security">
              <div className="grid gap-6">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    الأمان أولوية قصوى. تأكد من استخدام كلمات مرور قوية وتفعيل المصادقة الثنائية.
                  </AlertDescription>
                </Alert>

                <Card>
                  <CardHeader>
                    <CardTitle>الأمان وكلمات المرور</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">كلمة المرور الحالية</Label>
                      <div className="relative">
                        <Input 
                          id="current-password" 
                          type={showPassword ? "text" : "password"} 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                      <Input id="new-password" type="password" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>8 أحرف على الأقل</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <XCircle className="h-3 w-3 text-red-500" />
                          <span>حرف كبير واحد على الأقل</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>رقم واحد على الأقل</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <Button>تحديث كلمة المرور</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>المصادقة الثنائية</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">تفعيل المصادقة الثنائية</h4>
                        <p className="text-sm text-muted-foreground">إضافة طبقة حماية إضافية لحسابك</p>
                      </div>
                      <Button variant="outline">
                        <Key className="w-4 h-4 ml-2" />
                        إعداد
                      </Button>
                    </div>
                    <Separator />
                    <div className="space-y-3">
                      <h5 className="font-medium">الأجهزة المتصلة</h5>
                      {[
                        { device: "Chrome على Windows", location: "القاهرة، مصر", lastActive: "الآن", current: true },
                        { device: "Safari على iPhone", location: "الإسكندرية، مصر", lastActive: "منذ ساعتين", current: false },
                        { device: "Firefox على Mac", location: "دبي، الإمارات", lastActive: "أمس", current: false }
                      ].map((session, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Monitor className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-sm">{session.device}</p>
                              <p className="text-xs text-muted-foreground">{session.location} • {session.lastActive}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {session.current && <Badge variant="default">الحالي</Badge>}
                            {!session.current && (
                              <Button size="sm" variant="outline">
                                <XCircle className="h-3 w-3 ml-1" />
                                إنهاء
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>سجل الأنشطة الأمنية</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { action: "تسجيل دخول ناجح", time: "منذ 5 دقائق", status: "success" },
                        { action: "تغيير كلمة المرور", time: "أمس 3:30 م", status: "info" },
                        { action: "محاولة دخول فاشلة", time: "أمس 2:15 م", status: "warning" },
                        { action: "تفعيل المصادقة الثنائية", time: "منذ 3 أيام", status: "success" }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center gap-3 p-2">
                          {activity.status === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
                          {activity.status === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                          {activity.status === "info" && <Info className="h-4 w-4 text-blue-500" />}
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.action}</p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Appearance */}
            <TabsContent value="appearance">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>المظهر والثيم</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <Label>نمط المظهر</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: "light", name: "فاتح", icon: Monitor },
                          { id: "dark", name: "داكن", icon: Monitor },
                          { id: "system", name: "النظام", icon: Monitor }
                        ].map((themeOption) => (
                          <div
                            key={themeOption.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              theme === themeOption.id ? "border-primary bg-primary/5" : "hover:border-muted-foreground/50"
                            }`}
                            onClick={() => setTheme(themeOption.id)}
                          >
                            <div className="flex flex-col items-center gap-2">
                              <themeOption.icon className="h-6 w-6" />
                              <span className="text-sm font-medium">{themeOption.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-3">
                      <Label>اللغة</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ar">العربية</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>تخصيص الواجهة</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">الشريط الجانبي المضغوط</h4>
                        <p className="text-sm text-muted-foreground">عرض الشريط الجانبي بشكل مضغوط</p>
                      </div>
                      <Switch />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">إخفاء الرأس التلقائي</h4>
                        <p className="text-sm text-muted-foreground">إخفاء شريط الرأس عند التمرير</p>
                      </div>
                      <Switch />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">الرسوم المتحركة</h4>
                        <p className="text-sm text-muted-foreground">تفعيل الانتقالات والرسوم المتحركة</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Integrations */}
            {hasPermission(Permission.MANAGE_USERS) && (
            <TabsContent value="integrations">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>التكاملات المتاحة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {[
                        { name: "WhatsApp Business", description: "إرسال التنبيهات عبر واتساب", connected: true, icon: Phone },
                        { name: "Slack", description: "تنبيهات الفريق والتقارير", connected: false, icon: Bell },
                        { name: "Microsoft Teams", description: "تكامل مع فرق العمل", connected: false, icon: User },
                        { name: "Google Sheets", description: "تصدير البيانات تلقائياً", connected: true, icon: Database },
                        { name: "Zapier", description: "أتمتة المهام والعمليات", connected: false, icon: RefreshCw }
                      ].map((integration, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <integration.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium">{integration.name}</h4>
                              <p className="text-sm text-muted-foreground">{integration.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={integration.connected ? "default" : "secondary"}>
                              {integration.connected ? "متصل" : "غير متصل"}
                            </Badge>
                            <Button size="sm" variant={integration.connected ? "outline" : "default"}>
                              {integration.connected ? "قطع الاتصال" : "اتصال"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>API والمطورين</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>مفتاح API</Label>
                      <div className="flex gap-2">
                        <Input value="pk_live_51H..." readOnly className="font-mono" />
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          نسخ
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Webhook URL</Label>
                      <Input placeholder="https://yourapp.com/webhook" />
                    </div>
                    <Button variant="outline">
                      <Plus className="h-4 w-4 ml-2" />
                      إنشاء مفتاح جديد
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            )}

            {/* System */}
            {hasPermission(Permission.MANAGE_USERS) && (
            <TabsContent value="system">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>معلومات النظام</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>إصدار النظام</Label>
                        <p className="text-sm text-muted-foreground">v2.1.0</p>
                      </div>
                      <div>
                        <Label>آخر تحديث</Label>
                        <p className="text-sm text-muted-foreground">15 يناير 2024</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>قاعدة البيانات</Label>
                        <p className="text-sm text-muted-foreground">Supabase</p>
                      </div>
                      <div>
                        <Label>حالة النظام</Label>
                        <Badge variant="default">يعمل بشكل طبيعي</Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>استخدام التخزين</Label>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>2.4 GB من 10 GB</span>
                            <span>24%</span>
                          </div>
                          <Progress value={24} className="h-2" />
                        </div>
                      </div>
                      <div>
                        <Label>عدد المستخدمين النشطين</Label>
                        <p className="text-sm text-muted-foreground">12 مستخدم</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>النسخ الاحتياطي والاستعادة</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">النسخ الاحتياطي التلقائي</h4>
                        <p className="text-sm text-muted-foreground">آخر نسخة احتياطية: اليوم 3:00 ص</p>
                      </div>
                      <Button variant="outline" onClick={handleBackup} disabled={isBackingUp}>
                        <Database className="w-4 h-4 ml-2" />
                        {isBackingUp ? "جاري الإنشاء..." : "إنشاء نسخة احتياطية"}
                      </Button>
                    </div>
                    
                    {isBackingUp && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>جاري إنشاء النسخة الاحتياطية...</span>
                          <span>{backupProgress}%</span>
                        </div>
                        <Progress value={backupProgress} className="h-2" />
                      </div>
                    )}
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <h5 className="font-medium">النسخ الاحتياطية المتاحة</h5>
                      {[
                        { name: "نسخة احتياطية يومية", date: "اليوم 3:00 ص", size: "245 MB", type: "تلقائي" },
                        { name: "نسخة احتياطية أسبوعية", date: "أمس 11:30 م", size: "1.2 GB", type: "تلقائي" },
                        { name: "نسخة قبل التحديث", date: "منذ 3 أيام", size: "890 MB", type: "يدوي" }
                      ].map((backup, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Database className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-sm">{backup.name}</p>
                              <p className="text-xs text-muted-foreground">{backup.date} • {backup.size}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{backup.type}</Badge>
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3 ml-1" />
                              تحميل
                            </Button>
                            <Button size="sm" variant="outline">
                              استعادة
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>إعدادات الصيانة</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">وضع الصيانة</h4>
                        <p className="text-sm text-muted-foreground">تفعيل وضع الصيانة لمنع الوصول المؤقت</p>
                      </div>
                      <Switch />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label>رسالة الصيانة</Label>
                      <Textarea 
                        placeholder="النظام قيد الصيانة حالياً. سيعود للعمل قريباً."
                        className="min-h-[80px]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>بداية الصيانة</Label>
                        <Input type="datetime-local" />
                      </div>
                      <div className="space-y-2">
                        <Label>نهاية الصيانة</Label>
                        <Input type="datetime-local" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>إعادة تعيين النظام</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        تحذير: هذه العمليات لا يمكن التراجع عنها. تأكد من إنشاء نسخة احتياطية قبل المتابعة.
                      </AlertDescription>
                    </Alert>
                    <div className="flex gap-3 mt-4">
                      <Button variant="outline">
                        <RefreshCw className="w-4 h-4 ml-2" />
                        إعادة تعيين الإعدادات
                      </Button>
                      <Button variant="destructive">
                        <Trash2 className="w-4 h-4 ml-2" />
                        مسح جميع البيانات
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            )}
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Settings;