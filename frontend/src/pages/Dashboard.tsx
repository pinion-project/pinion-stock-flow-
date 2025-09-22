import { Building2, Package, TrendingUp, DollarSign, Users, AlertTriangle, Calendar, Clock, BarChart3, ShoppingCart, Truck, Bell, Shield, Activity, Eye, Settings } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/navigation/Sidebar";
import StatsCard from "@/components/dashboard/StatsCard";
import WarehouseCard from "@/components/dashboard/WarehouseCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRealtime } from "@/contexts/RealtimeContext";
import { UserRole, Permission } from "@/types/auth";
import RealtimeUpdates from "@/components/realtime/RealtimeUpdates";
import AlertPanel from "@/components/alerts/AlertPanel";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, hasPermission, hasRole } = useAuth();
  const { isConnected } = useRealtime();
  
  // تحديد أدوار المستخدمين
  const isGeneralManager = hasRole(UserRole.GENERAL_MANAGER);
  const isWarehouseManager = hasRole(UserRole.WAREHOUSE_MANAGER);
  const isPurchasingManager = hasRole(UserRole.PURCHASING_MANAGER);
  
  // البيانات المثبتة للمخازن - يجب استبدالها ببيانات حقيقية من API
  const allWarehouses = [
    {
      id: 1,
      name: "المخزن الرئيسي",
      location: "القاهرة الجديدة",
      totalProducts: 2450,
      capacity: 3000,
      status: "active" as const,
      revenue: "1.2M ج.م",
      trend: 12
    },
    {
      id: 2,
      name: "المخزن المسطح",
      location: "برج العرب الجديدة",
      totalProducts: 1800,
      capacity: 2500,
      status: "active" as const,
      revenue: "850K ج.م",
      trend: 8
    },
    {
      id: 3,
      name: "مخزن الدرفلة",
      location: "6 أكتوبر",
      totalProducts: 2850,
      capacity: 3000,
      status: "full" as const,
      revenue: "1.1M ج.م",
      trend: 15
    },
    {
      id: 4,
      name: "مخزن ستيل",
      location: "طنطا الجديدة",
      totalProducts: 950,
      capacity: 2000,
      status: "maintenance" as const,
      revenue: "420K ج.م",
      trend: -3
    },
    {
      id: 5,
      name: "مخزن العربية للأسمنت",
      location: "أسوان",
      totalProducts: 650,
      capacity: 1500,
      status: "active" as const,
      revenue: "320K ج.م",
      trend: 5
    },
    {
      id: 6,
      name: "مخزن غبور",
      location: "الإسماعيلية",
      totalProducts: 800,
      capacity: 1800,
      status: "active" as const,
      revenue: "450K ج.م",
      trend: 7
    }
  ];

  // ربط معرفات المخازن بأرقام المخازن
  const warehouseMapping: Record<string, number> = {
    'warehouse_1': 1,
    'warehouse_2': 2,
    'warehouse_3': 3,
    'warehouse_4': 4,
    'warehouse_5': 5,
    'warehouse_6': 6
  };

  // دالة لتصفية المخازن حسب صلاحيات المستخدم
  const getAccessibleWarehouses = () => {
    if (isGeneralManager || isPurchasingManager) {
      return allWarehouses;
    }
    
    if (isWarehouseManager && user?.warehouseId) {
      const warehouseNumericId = warehouseMapping[user.warehouseId];
      if (warehouseNumericId) {
        return allWarehouses.filter(warehouse => warehouse.id === warehouseNumericId);
      }
    }
    
    return [];
  };

  const warehouses = getAccessibleWarehouses();

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-3 sm:p-4 md:p-6">
          {/* Welcome Section */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">
                  أهلاً بك، {user?.fullName}
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {isGeneralManager 
                    ? "لوحة تحكم المدير العام - نظرة شاملة على جميع العمليات"
                    : isPurchasingManager
                    ? "لوحة تحكم مدير المشتريات - إدارة عمليات الشراء والتوريد"
                    : isWarehouseManager 
                    ? `لوحة تحكم مدير المخزن - ${warehouses[0]?.name || 'مخزنك'}`
                    : "نظرة شاملة على مخازنك ومنتجاتك"
                  }
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={isGeneralManager ? "default" : isPurchasingManager ? "default" : "secondary"} className="text-sm">
                  {user?.role === UserRole.GENERAL_MANAGER ? "مدير عام" 
                    : user?.role === UserRole.PURCHASING_MANAGER ? "مدير مشتريات"
                    : "مدير مخزن"}
                </Badge>
                {isGeneralManager && (
                  <Badge variant="outline" className="text-sm">
                    <Shield className="w-3 h-3 ml-1" />
                    صلاحيات كاملة
                  </Badge>
                )}
                {isPurchasingManager && (
                  <Badge variant="outline" className="text-sm bg-blue-50 text-blue-700">
                    <ShoppingCart className="w-3 h-3 ml-1" />
                    إدارة المشتريات
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Stats Cards - تختلف حسب دور المستخدم */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8">
            {isGeneralManager ? (
              // إحصائيات المدير العام
              <>
                <div className="stagger-item">
                  <StatsCard
                    title="إجمالي المخازن"
                    value={warehouses.length.toString()}
                    change="+2 مخازن جديدة"
                    changeType="increase"
                    icon={Building2}
                    gradient="bg-gradient-primary"
                  />
                </div>
                <div className="stagger-item">
                  <StatsCard
                    title="إجمالي المنتجات"
                    value={warehouses.reduce((sum, w) => sum + w.totalProducts, 0).toLocaleString('ar')}
                    change="+12.5%"
                    changeType="increase"
                    icon={Package}
                    gradient="bg-gradient-success"
                  />
                </div>
                <div className="stagger-item">
                  <StatsCard
                    title="إجمالي الإيرادات"
                    value={warehouses.reduce((sum, w) => sum + parseFloat(w.revenue.replace(/[^0-9.]/g, '')), 0).toLocaleString('ar') + " ج.م"}
                    change="+8.3%"
                    changeType="increase"
                    icon={DollarSign}
                    gradient="bg-gradient-accent"
                  />
                </div>
                <div className="stagger-item">
                  <StatsCard
                    title="المستخدمين النشطين"
                    value="47"
                    change="+3 مستخدمين جدد"
                    changeType="increase"
                    icon={Users}
                    gradient="bg-gradient-secondary"
                  />
                </div>
              </>
            ) : isPurchasingManager ? (
              // إحصائيات مدير المشتريات
              <>
                <div className="stagger-item">
                  <StatsCard
                    title="طلبات الشراء الشهرية"
                    value="156"
                    change="+18 طلب جديد"
                    changeType="increase"
                    icon={ShoppingCart}
                    gradient="bg-gradient-primary"
                  />
                </div>
                <div className="stagger-item">
                  <StatsCard
                    title="إجمالي المشتريات"
                    value="2.8M ج.م"
                    change="+15.2%"
                    changeType="increase"
                    icon={DollarSign}
                    gradient="bg-gradient-success"
                  />
                </div>
                <div className="stagger-item">
                  <StatsCard
                    title="الموردين النشطين"
                    value="23"
                    change="+2 موردين جدد"
                    changeType="increase"
                    icon={Truck}
                    gradient="bg-gradient-accent"
                  />
                </div>
                <div className="stagger-item">
                  <StatsCard
                    title="معدل التوفير"
                    value="12.5%"
                    change="+2.1%"
                    changeType="increase"
                    icon={TrendingUp}
                    gradient="bg-gradient-secondary"
                  />
                </div>
              </>
            ) : (
              // إحصائيات مدير المخزن - بيانات من المخزن المخصص
              <>
                <div className="stagger-item">
                  <StatsCard
                    title="منتجات المخزن"
                    value={warehouses[0]?.totalProducts.toLocaleString('ar') || "0"}
                    change={warehouses[0] ? `+${warehouses[0].trend}%` : "+0%"}
                    changeType={warehouses[0]?.trend > 0 ? "increase" : warehouses[0]?.trend < 0 ? "decrease" : "neutral"}
                    icon={Package}
                    gradient="bg-gradient-success"
                  />
                </div>
                <div className="stagger-item">
                  <StatsCard
                    title="مساحة المخزن"
                    value={warehouses[0] ? Math.round((warehouses[0].totalProducts / warehouses[0].capacity) * 100) + "%" : "0%"}
                    change="مستوى جيد"
                    changeType="increase"
                    icon={Building2}
                    gradient="bg-gradient-primary"
                  />
                </div>
                <div className="stagger-item">
                  <StatsCard
                    title="إيرادات المخزن"
                    value={warehouses[0]?.revenue || "0 ج.م"}
                    change={warehouses[0] ? `+${warehouses[0].trend}%` : "+0%"}
                    changeType={warehouses[0]?.trend > 0 ? "increase" : warehouses[0]?.trend < 0 ? "decrease" : "neutral"}
                    icon={DollarSign}
                    gradient="bg-gradient-accent"
                  />
                </div>
                <div className="stagger-item">
                  <StatsCard
                    title="تنبيهات المخزون"
                    value="5"
                    change="2 عاجل"
                    changeType="decrease"
                    icon={AlertTriangle}
                    gradient="bg-destructive"
                  />
                </div>
              </>
            )}
          </div>

          {/* Warehouses Grid - يظهر للمدير العام ومدير المشتريات أو المخزن المخصص لمدير المخزن */}
          {isGeneralManager || isPurchasingManager ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-full mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  {isPurchasingManager ? "جميع المخازن - نظرة شاملة للمشتريات" : "جميع المخازن"}
                  <Badge variant="secondary" className="text-xs">{warehouses.length}</Badge>
                  {isPurchasingManager && (
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                      <ShoppingCart className="w-3 h-3 ml-1" />
                      إدارة المشتريات
                    </Badge>
                  )}
                </h2>
              </div>
              {warehouses.map((warehouse, index) => (
                <div key={warehouse.id} className="stagger-item">
                  <WarehouseCard
                    {...warehouse}
                    warehouseId={warehouse.id}
                  />
                </div>
              ))}
            </div>
          ) : (
            // عرض المخزن المخصص لمدير المخزن
            <div className="grid grid-cols-1 gap-6 mb-8">
              <div className="mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  مخزنك المخصص
                </h2>
              </div>
              <div className="stagger-item">
                <WarehouseCard
                  {...warehouses[0]} // المخزن الأول كمثال لمخزن المستخدم
                  warehouseId={warehouses[0]?.id}
                />
              </div>
            </div>
          )}

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="stagger-item">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {isGeneralManager ? "أداء المبيعات اليومي" : "مبيعات مخزنك اليومي"}
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isGeneralManager ? "125,430 ج.م" : warehouses[0]?.revenue || "0 ج.م"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {isGeneralManager ? "+20.1% من الأمس" : warehouses[0] ? `${warehouses[0].trend > 0 ? '+' : ''}${warehouses[0].trend}% من الأمس` : "0% من الأمس"}
                </p>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>الهدف اليومي</span>
                    <span>{isGeneralManager ? "78%" : warehouses[0] ? Math.min(Math.round((warehouses[0].totalProducts / warehouses[0].capacity) * 100), 100) + "%" : "0%"}</span>
                  </div>
                  <Progress value={isGeneralManager ? 78 : warehouses[0] ? Math.min(Math.round((warehouses[0].totalProducts / warehouses[0].capacity) * 100), 100) : 0} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="stagger-item">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {isGeneralManager ? "الطلبات المعلقة" : "طلبات مخزنك"}
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isGeneralManager ? "47" : Math.floor(Math.random() * 20) + 5}</div>
                <p className="text-xs text-muted-foreground">
                  {isGeneralManager ? "+3 طلبات جديدة" : "+2 طلبات جديدة"}
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">عاجل</span>
                    <Badge variant="destructive" className="text-xs">{isGeneralManager ? "12" : Math.floor(Math.random() * 5) + 1}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">عادي</span>
                    <Badge variant="secondary" className="text-xs">{isGeneralManager ? "35" : Math.floor(Math.random() * 15) + 5}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="stagger-item">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {isGeneralManager ? "الشحنات اليوم" : "شحنات مخزنك"}
                </CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isGeneralManager ? "89" : Math.floor(Math.random() * 30) + 10}</div>
                <p className="text-xs text-muted-foreground">
                  {isGeneralManager ? "+15% من الأمس" : warehouses[0] ? `+${Math.abs(warehouses[0].trend)}% من الأمس` : "+5% من الأمس"}
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">تم التسليم</span>
                    <Badge variant="default" className="text-xs bg-green-100 text-green-800">{isGeneralManager ? "67" : Math.floor(Math.random() * 20) + 8}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">في الطريق</span>
                    <Badge variant="secondary" className="text-xs">{isGeneralManager ? "22" : Math.floor(Math.random() * 8) + 2}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Purchasing Manager Dashboard - قسم خاص بمدير المشتريات */}
          {isPurchasingManager && (
            <div className="mb-8">
              <div className="mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex flex-wrap items-center gap-2">
                  <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                  لوحة تحكم المشتريات
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                    نظرة شاملة
                  </Badge>
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                {/* طلبات الشراء المعلقة */}
                <Card className="stagger-item">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">طلبات الشراء المعلقة</CardTitle>
                    <Clock className="h-4 w-4 text-orange-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">8</div>
                    <p className="text-xs text-muted-foreground">تحتاج موافقة فورية</p>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">عاجل</span>
                        <Badge variant="destructive" className="text-xs">3</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">عادي</span>
                        <Badge variant="secondary" className="text-xs">5</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* المنتجات منخفضة المخزون */}
                <Card className="stagger-item">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">منتجات تحتاج إعادة طلب</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">12</div>
                    <p className="text-xs text-muted-foreground">من جميع المخازن</p>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>نسبة التغطية</span>
                        <span className="text-red-600">65%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
                
                {/* الشحنات الواردة */}
                <Card className="stagger-item">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">شحنات واردة متوقعة</CardTitle>
                    <Truck className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">5</div>
                    <p className="text-xs text-muted-foreground">هذا الأسبوع</p>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">اليوم</span>
                        <Badge variant="default" className="text-xs bg-green-100 text-green-800">2</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">غداً</span>
                        <Badge variant="secondary" className="text-xs">3</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Recent Activity and Notifications */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <RecentActivity user={user} />
            </div>
            
            {/* Notifications & Alerts */}
            <div className="space-y-4 stagger-item">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">التنبيهات والإشعارات</CardTitle>
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="space-y-3">
                  {isGeneralManager ? (
                    <>
                      <div className="flex items-start space-x-2 space-x-reverse p-3 bg-red-50 rounded-lg border border-red-200">
                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-red-800">نفاد مخزون</p>
                          <p className="text-xs text-red-600">5 منتجات نفد مخزونها</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2 space-x-reverse p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <Clock className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-yellow-800">طلبات متأخرة</p>
                          <p className="text-xs text-yellow-600">3 طلبات تحتاج متابعة</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2 space-x-reverse p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-blue-800">تحسن الأداء</p>
                          <p className="text-xs text-blue-600">زيادة 15% في المبيعات</p>
                        </div>
                      </div>
                    </>
                  ) : isPurchasingManager ? (
                    <>
                      <div className="flex items-start space-x-2 space-x-reverse p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <ShoppingCart className="h-4 w-4 text-orange-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-orange-800">طلبات شراء معلقة</p>
                          <p className="text-xs text-orange-600">8 طلبات تحتاج موافقة</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2 space-x-reverse p-3 bg-red-50 rounded-lg border border-red-200">
                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-red-800">مخزون منخفض</p>
                          <p className="text-xs text-red-600">12 منتج يحتاج إعادة طلب</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2 space-x-reverse p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <Truck className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-blue-800">شحنات واردة</p>
                          <p className="text-xs text-blue-600">5 شحنات متوقعة هذا الأسبوع</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {warehouses[0]?.status === "maintenance" && (
                        <div className="flex items-start space-x-2 space-x-reverse p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <Clock className="h-4 w-4 text-yellow-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-yellow-800">مخزن تحت الصيانة</p>
                            <p className="text-xs text-yellow-600">مخزنك حالياً تحت الصيانة</p>
                          </div>
                        </div>
                      )}
                      
                      {warehouses[0]?.status === "full" && (
                        <div className="flex items-start space-x-2 space-x-reverse p-3 bg-red-50 rounded-lg border border-red-200">
                          <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-red-800">مخزن ممتلئ</p>
                            <p className="text-xs text-red-600">مخزنك وصل للسعة القصوى</p>
                          </div>
                        </div>
                      )}
                      
                      {warehouses[0]?.trend > 10 && (
                        <div className="flex items-start space-x-2 space-x-reverse p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-blue-800">أداء ممتاز</p>
                            <p className="text-xs text-blue-600">زيادة {warehouses[0].trend}% في الإيرادات</p>
                          </div>
                        </div>
                      )}
                      
                      {(!warehouses[0] || (warehouses[0].status === "active" && warehouses[0].trend <= 10)) && (
                        <div className="flex items-start space-x-2 space-x-reverse p-3 bg-green-50 rounded-lg border border-green-200">
                          <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-green-800">كل شيء على ما يرام</p>
                            <p className="text-xs text-green-600">مخزنك يعمل بكفاءة</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  
                  <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/audit-logs')}>
                    عرض جميع التنبيهات
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Actions - تختلف حسب صلاحيات المستخدم */}
          <div className="mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 md:w-5 md:h-5" />
              الإجراءات السريعة
            </h2>
          </div>
          
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* إدارة المنتجات - متاح للجميع مع صلاحية MANAGE_PRODUCTS */}
            {hasPermission(Permission.MANAGE_PRODUCTS) && (
              <Card className="stagger-item cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]" onClick={() => navigate('/products')}>
                <CardContent className="p-4 sm:p-6 text-center">
                  <Package className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                  <h3 className="font-semibold mb-2">إدارة المنتجات</h3>
                  <p className="text-sm text-muted-foreground">إضافة وتعديل المنتجات</p>
                </CardContent>
              </Card>
            )}
            
            {/* إدارة المخازن - للمدير العام أو مع صلاحية VIEW_ALL_WAREHOUSES */}
            {(isGeneralManager || hasPermission(Permission.VIEW_ALL_WAREHOUSES)) && (
              <Card className="stagger-item cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]" onClick={() => navigate('/warehouses')}>
                <CardContent className="p-4 sm:p-6 text-center">
                  <Building2 className="h-8 w-8 mx-auto mb-3 text-green-600" />
                  <h3 className="font-semibold mb-2">
                    {isGeneralManager ? "إدارة المخازن" : "مخزني"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isGeneralManager ? "متابعة جميع المخازن" : "متابعة مخزنك"}
                  </p>
                </CardContent>
              </Card>
            )}
            
            {/* التقارير - متاح للجميع */}
            <Card className="stagger-item cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]" onClick={() => navigate('/reports')}>
              <CardContent className="p-4 sm:p-6 text-center">
                <BarChart3 className="h-8 w-8 mx-auto mb-3 text-purple-600" />
                <h3 className="font-semibold mb-2">التقارير</h3>
                <p className="text-sm text-muted-foreground">
                  {isGeneralManager ? "تقارير شاملة" : "تقارير مخزنك"}
                </p>
              </CardContent>
            </Card>
            
            {/* إدارة المستخدمين - للمدير العام فقط */}
            {isGeneralManager && hasPermission(Permission.MANAGE_USERS) && (
              <Card className="stagger-item cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]" onClick={() => navigate('/users')}>
                <CardContent className="p-4 sm:p-6 text-center">
                  <Users className="h-8 w-8 mx-auto mb-3 text-orange-600" />
                  <h3 className="font-semibold mb-2">إدارة المستخدمين</h3>
                  <p className="text-sm text-muted-foreground">إدارة الحسابات والصلاحيات</p>
                </CardContent>
              </Card>
            )}
            
            {/* المخزون - لمدراء المخازن */}
            {isWarehouseManager && hasPermission(Permission.MANAGE_INVENTORY) && (
              <Card className="stagger-item cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]" onClick={() => navigate('/inventory')}>
                <CardContent className="p-4 sm:p-6 text-center">
                  <Package className="h-8 w-8 mx-auto mb-3 text-indigo-600" />
                  <h3 className="font-semibold mb-2">إدارة المخزون</h3>
                  <p className="text-sm text-muted-foreground">متابعة وإدارة المخزون</p>
                </CardContent>
              </Card>
            )}
            
            {/* اقتراحات الشراء - لمدير المشتريات */}
            {isPurchasingManager && (
              <Card className="stagger-item cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]" onClick={() => navigate('/purchase-suggestions')}>
                <CardContent className="p-4 sm:p-6 text-center">
                  <ShoppingCart className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                  <h3 className="font-semibold mb-2">اقتراحات الشراء</h3>
                  <p className="text-sm text-muted-foreground">مراجعة طلبات الشراء المقترحة</p>
                </CardContent>
              </Card>
            )}
            
            {/* التحليلات - لمدير المشتريات */}
            {isPurchasingManager && (
              <Card className="stagger-item cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]" onClick={() => navigate('/analytics')}>
                <CardContent className="p-4 sm:p-6 text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-3 text-green-600" />
                  <h3 className="font-semibold mb-2">تحليلات المشتريات</h3>
                  <p className="text-sm text-muted-foreground">تحليل أداء المشتريات والموردين</p>
                </CardContent>
              </Card>
            )}
            
            {/* المخزون الشامل - لمدير المشتريات */}
            {isPurchasingManager && (
              <Card className="stagger-item cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]" onClick={() => navigate('/inventory')}>
                <CardContent className="p-4 sm:p-6 text-center">
                  <Eye className="h-8 w-8 mx-auto mb-3 text-purple-600" />
                  <h3 className="font-semibold mb-2">المخزون الشامل</h3>
                  <p className="text-sm text-muted-foreground">مراقبة مخزون جميع المخازن</p>
                </CardContent>
              </Card>
            )}
            
            {/* الإعدادات - حسب الصلاحيات */}
            {hasPermission(Permission.MANAGE_SYSTEM_SETTINGS) && (
              <Card className="stagger-item cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]" onClick={() => navigate('/settings')}>
                <CardContent className="p-4 sm:p-6 text-center">
                  <Settings className="h-8 w-8 mx-auto mb-3 text-gray-600" />
                  <h3 className="font-semibold mb-2">الإعدادات</h3>
                  <p className="text-sm text-muted-foreground">
                    {isGeneralManager ? "إعدادات النظام" : "إعداداتك"}
                  </p>
                </CardContent>
              </Card>
            )}
            
            {/* سجل العمليات - للمدير العام فقط */}
            {isGeneralManager && hasPermission(Permission.VIEW_AUDIT_LOGS) && (
              <Card className="stagger-item cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]" onClick={() => navigate('/audit-logs')}>
                <CardContent className="p-4 sm:p-6 text-center">
                  <Eye className="h-8 w-8 mx-auto mb-3 text-red-600" />
                  <h3 className="font-semibold mb-2">سجل العمليات</h3>
                  <p className="text-sm text-muted-foreground">مراقبة جميع الأنشطة</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Real-time Updates Section */}
          <div className="mt-6 md:mt-8">
            <RealtimeUpdates className="w-full" maxHeight="h-60 md:h-80" />
          </div>

          {/* Alerts Section */}
          <div className="mt-6 md:mt-8">
            <div className="mb-3 md:mb-4">
              <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 md:w-5 md:h-5" />
                التنبيهات النشطة
              </h2>
            </div>
            <AlertPanel />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;