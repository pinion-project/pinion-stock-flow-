import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Calendar, Shield, Key, Bell, Eye, EyeOff, Camera, Save, Edit3, Lock } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/navigation/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/auth";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: string;
  department: string;
  warehouse: string;
  joinDate: string;
  lastLogin: string;
  address: string;
  bio: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  preferences: {
    language: string;
    theme: string;
    timezone: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
      marketing: boolean;
    };
  };
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    loginSessions: Array<{
      device: string;
      location: string;
      lastActive: string;
      current: boolean;
    }>;
  };
}

const Profile = () => {
  const { user, hasRole } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // بيانات المخازن
  const warehouses = [
    { id: 1, name: "المخزن الرئيسي", location: "القاهرة الجديدة", warehouseId: "warehouse_1" },
    { id: 2, name: "المخزن المسطح", location: "برج العرب الجديدة", warehouseId: "warehouse_2" },
    { id: 3, name: "مخزن الدرفلة", location: "6 أكتوبر", warehouseId: "warehouse_3" },
    { id: 4, name: "مخزن ستيل", location: "طنطا الجديدة", warehouseId: "warehouse_4" },
    { id: 5, name: "مخزن العربية للأسمنت", location: "أسوان", warehouseId: "warehouse_5" },
    { id: 6, name: "مخزن غبور", location: "الإسماعيلية", warehouseId: "warehouse_6" }
  ];

  // الحصول على معلومات المخزن المخصص للمستخدم
  const getUserWarehouse = () => {
    if (user?.warehouseId) {
      return warehouses.find(w => w.warehouseId === user.warehouseId);
    }
    return null;
  };

  const userWarehouse = getUserWarehouse();

  // تحويل دور المستخدم إلى نص عربي
  const getRoleText = (role: UserRole) => {
    switch (role) {
      case UserRole.GENERAL_MANAGER:
        return "مدير عام";
      case UserRole.WAREHOUSE_MANAGER:
        return "مدير مخزن";
      case UserRole.PURCHASING_MANAGER:
        return "مدير مشتريات";
      default:
        return "مستخدم";
    }
  };

  // بيانات المستخدم الحقيقية
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: user?.id || "1",
    name: user?.fullName || "مستخدم",
    email: user?.email || "user@pinion-egypt.com",
    phone: "+20 12 3456 7890",
    avatar: "",
    role: getRoleText(user?.role || UserRole.WAREHOUSE_MANAGER),
    department: hasRole(UserRole.GENERAL_MANAGER) ? "الإدارة العامة" : hasRole(UserRole.PURCHASING_MANAGER) ? "المشتريات" : "إدارة المخازن",
    warehouse: userWarehouse ? `${userWarehouse.name} - ${userWarehouse.location}` : "جميع المخازن",
    joinDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-EG') : "2024-01-01",
    lastLogin: "اليوم 14:30",
    address: "القاهرة، مصر",
    bio: hasRole(UserRole.GENERAL_MANAGER) 
      ? "مدير عام مسؤول عن الإشراف على جميع عمليات المخازن والإدارة الشاملة للنظام."
      : hasRole(UserRole.PURCHASING_MANAGER)
      ? "مدير مشتريات مسؤول عن إدارة عمليات الشراء وتوريد المنتجات لجميع المخازن."
      : `مدير مخزن مسؤول عن إدارة وتشغيل ${userWarehouse?.name || 'المخزن المخصص'} وضمان سير العمليات بكفاءة.`,
    emergencyContact: {
      name: "فاطمة أحمد علي",
      phone: "+20 10 9876 5432",
      relation: "الزوجة"
    },
    preferences: {
      language: "ar",
      theme: "light",
      timezone: "Africa/Cairo",
      notifications: {
        email: true,
        sms: true,
        push: true,
        marketing: false
      }
    },
    security: {
      twoFactorEnabled: true,
      lastPasswordChange: "2023-12-01",
      loginSessions: [
        {
          device: "Chrome على Windows",
          location: "القاهرة، مصر",
          lastActive: "الآن",
          current: true
        },
        {
          device: "Safari على iPhone",
          location: "القاهرة، مصر",
          lastActive: "منذ ساعتين",
          current: false
        },
        {
          device: "Chrome على Android",
          location: "الجيزة، مصر",
          lastActive: "أمس",
          current: false
        }
      ]
    }
  });

  // تحديث بيانات المستخدم عند تغيير المستخدم المسجل دخوله
  useEffect(() => {
    if (user) {
      const warehouse = getUserWarehouse();
      setUserProfile(prev => ({
        ...prev,
        id: user.id,
        name: user.fullName,
        email: user.email,
        role: getRoleText(user.role),
        department: hasRole(UserRole.GENERAL_MANAGER) ? "الإدارة العامة" : hasRole(UserRole.PURCHASING_MANAGER) ? "المشتريات" : "إدارة المخازن",
        warehouse: warehouse ? `${warehouse.name} - ${warehouse.location}` : "جميع المخازن",
        joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-EG') : "2024-01-01",
        bio: hasRole(UserRole.GENERAL_MANAGER) 
          ? "مدير عام مسؤول عن الإشراف على جميع عمليات المخازن والإدارة الشاملة للنظام."
          : hasRole(UserRole.PURCHASING_MANAGER)
          ? "مدير مشتريات مسؤول عن إدارة عمليات الشراء وتوريد المنتجات لجميع المخازن."
          : `مدير مخزن مسؤول عن إدارة وتشغيل ${warehouse?.name || 'المخزن المخصص'} وضمان سير العمليات بكفاءة.`
      }));
    }
  }, [user, hasRole]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const handleSaveProfile = () => {
    // هنا يتم حفظ البيانات
    setIsEditing(false);
    toast.success("تم حفظ البيانات بنجاح");
  };

  const handleChangePassword = () => {
    // هنا يتم تغيير كلمة المرور
    toast.success("تم تغيير كلمة المرور بنجاح");
  };

  const handleNotificationChange = (type: keyof typeof userProfile.preferences.notifications, value: boolean) => {
    setUserProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        notifications: {
          ...prev.preferences.notifications,
          [type]: value
        }
      }
    }));
  };

  const handleTerminateSession = (index: number) => {
    const updatedSessions = userProfile.security.loginSessions.filter((_, i) => i !== index);
    setUserProfile(prev => ({
      ...prev,
      security: {
        ...prev.security,
        loginSessions: updatedSessions
      }
    }));
    toast.success("تم إنهاء الجلسة بنجاح");
  };

  return (
    <div className="flex h-screen bg-background" dir="rtl">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-foreground">الملف الشخصي</h1>
                <p className="text-muted-foreground mt-1">
                  إدارة بياناتك الشخصية وإعدادات الحساب
                </p>
              </div>
              <Button
                onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                className={isEditing ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4 ml-2" />
                    حفظ التغييرات
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4 ml-2" />
                    تعديل البيانات
                  </>
                )}
              </Button>
            </div>

            {/* Profile Header Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={userProfile.avatar} />
                      <AvatarFallback className="text-lg">
                        {getInitials(userProfile.name)}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        size="sm"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold">{userProfile.name}</h2>
                      <Badge className="bg-blue-100 text-blue-800">{userProfile.role}</Badge>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {userProfile.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {userProfile.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        انضم في {new Date(userProfile.joinDate).toLocaleDateString('ar-EG')}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {userProfile.department} - {userProfile.warehouse}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">البيانات الشخصية</TabsTrigger>
                <TabsTrigger value="security">الأمان</TabsTrigger>
                <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
                <TabsTrigger value="preferences">التفضيلات</TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        المعلومات الأساسية
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">الاسم الكامل</Label>
                          <Input
                            id="name"
                            value={userProfile.name}
                            onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">البريد الإلكتروني</Label>
                          <Input
                            id="email"
                            type="email"
                            value={userProfile.email}
                            onChange={(e) => setUserProfile(prev => ({ ...prev, email: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">رقم الهاتف</Label>
                        <Input
                          id="phone"
                          value={userProfile.phone}
                          onChange={(e) => setUserProfile(prev => ({ ...prev, phone: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">العنوان</Label>
                        <Input
                          id="address"
                          value={userProfile.address}
                          onChange={(e) => setUserProfile(prev => ({ ...prev, address: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">نبذة شخصية</Label>
                        <Textarea
                          id="bio"
                          value={userProfile.bio}
                          onChange={(e) => setUserProfile(prev => ({ ...prev, bio: e.target.value }))}
                          disabled={!isEditing}
                          rows={4}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        معلومات العمل
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>الدور الوظيفي</Label>
                        <Input value={userProfile.role} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label>القسم</Label>
                        <Input value={userProfile.department} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label>المخزن المسؤول عنه</Label>
                        <Input value={userProfile.warehouse} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label>تاريخ الانضمام</Label>
                        <Input value={new Date(userProfile.joinDate).toLocaleDateString('ar-EG')} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label>آخر تسجيل دخول</Label>
                        <Input value={userProfile.lastLogin} disabled />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>جهة الاتصال في حالات الطوارئ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="emergency-name">الاسم</Label>
                        <Input
                          id="emergency-name"
                          value={userProfile.emergencyContact.name}
                          onChange={(e) => setUserProfile(prev => ({
                            ...prev,
                            emergencyContact: { ...prev.emergencyContact, name: e.target.value }
                          }))}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergency-phone">رقم الهاتف</Label>
                        <Input
                          id="emergency-phone"
                          value={userProfile.emergencyContact.phone}
                          onChange={(e) => setUserProfile(prev => ({
                            ...prev,
                            emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
                          }))}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergency-relation">صلة القرابة</Label>
                        <Input
                          id="emergency-relation"
                          value={userProfile.emergencyContact.relation}
                          onChange={(e) => setUserProfile(prev => ({
                            ...prev,
                            emergencyContact: { ...prev.emergencyContact, relation: e.target.value }
                          }))}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Key className="w-5 h-5" />
                        تغيير كلمة المرور
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">كلمة المرور الحالية</Label>
                        <div className="relative">
                          <Input
                            id="current-password"
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="أدخل كلمة المرور الحالية"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                        <div className="relative">
                          <Input
                            id="new-password"
                            type={showNewPassword ? "text" : "password"}
                            placeholder="أدخل كلمة المرور الجديدة"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
                        <div className="relative">
                          <Input
                            id="confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="أعد إدخال كلمة المرور الجديدة"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <Button onClick={handleChangePassword} className="w-full">
                        <Lock className="w-4 h-4 ml-2" />
                        تغيير كلمة المرور
                      </Button>
                      <div className="text-sm text-muted-foreground">
                        آخر تغيير: {new Date(userProfile.security.lastPasswordChange).toLocaleDateString('ar-EG')}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        المصادقة الثنائية
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">تفعيل المصادقة الثنائية</div>
                          <div className="text-sm text-muted-foreground">
                            إضافة طبقة حماية إضافية لحسابك
                          </div>
                        </div>
                        <Switch
                          checked={userProfile.security.twoFactorEnabled}
                          onCheckedChange={(checked) => 
                            setUserProfile(prev => ({
                              ...prev,
                              security: { ...prev.security, twoFactorEnabled: checked }
                            }))
                          }
                        />
                      </div>
                      {userProfile.security.twoFactorEnabled && (
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2 text-green-800">
                            <Shield className="w-4 h-4" />
                            <span className="font-medium">المصادقة الثنائية مفعلة</span>
                          </div>
                          <p className="text-sm text-green-700 mt-1">
                            حسابك محمي بالمصادقة الثنائية
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>الجلسات النشطة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userProfile.security.loginSessions.map((session, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className="font-medium">{session.device}</div>
                              {session.current && (
                                <Badge className="bg-green-100 text-green-800">الجلسة الحالية</Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {session.location} • آخر نشاط: {session.lastActive}
                            </div>
                          </div>
                          {!session.current && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleTerminateSession(index)}
                            >
                              إنهاء الجلسة
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      إعدادات الإشعارات
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">إشعارات البريد الإلكتروني</div>
                          <div className="text-sm text-muted-foreground">
                            تلقي الإشعارات عبر البريد الإلكتروني
                          </div>
                        </div>
                        <Switch
                          checked={userProfile.preferences.notifications.email}
                          onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">الرسائل النصية</div>
                          <div className="text-sm text-muted-foreground">
                            تلقي الإشعارات عبر الرسائل النصية
                          </div>
                        </div>
                        <Switch
                          checked={userProfile.preferences.notifications.sms}
                          onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">الإشعارات الفورية</div>
                          <div className="text-sm text-muted-foreground">
                            تلقي الإشعارات الفورية في المتصفح
                          </div>
                        </div>
                        <Switch
                          checked={userProfile.preferences.notifications.push}
                          onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">الإشعارات التسويقية</div>
                          <div className="text-sm text-muted-foreground">
                            تلقي العروض والأخبار التسويقية
                          </div>
                        </div>
                        <Switch
                          checked={userProfile.preferences.notifications.marketing}
                          onCheckedChange={(checked) => handleNotificationChange('marketing', checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="preferences" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>التفضيلات العامة</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="language">اللغة</Label>
                        <Select
                          value={userProfile.preferences.language}
                          onValueChange={(value) => 
                            setUserProfile(prev => ({
                              ...prev,
                              preferences: { ...prev.preferences, language: value }
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ar">العربية</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="fr">Français</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="theme">المظهر</Label>
                        <Select
                          value={userProfile.preferences.theme}
                          onValueChange={(value) => 
                            setUserProfile(prev => ({
                              ...prev,
                              preferences: { ...prev.preferences, theme: value }
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">فاتح</SelectItem>
                            <SelectItem value="dark">داكن</SelectItem>
                            <SelectItem value="system">تلقائي</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="timezone">المنطقة الزمنية</Label>
                        <Select
                          value={userProfile.preferences.timezone}
                          onValueChange={(value) => 
                            setUserProfile(prev => ({
                              ...prev,
                              preferences: { ...prev.preferences, timezone: value }
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Africa/Cairo">القاهرة (GMT+2)</SelectItem>
                            <SelectItem value="Africa/Cairo">القاهرة (GMT+2)</SelectItem>
                            <SelectItem value="Asia/Dubai">دبي (GMT+4)</SelectItem>
                            <SelectItem value="Europe/London">لندن (GMT+0)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;