import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/navigation/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Legend
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  TrendingDown,
  Package,
  Warehouse,
  DollarSign,
  Users,
  Activity,
  AlertTriangle,
  Download,
  RefreshCw,
  Filter,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Target,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Shield
} from 'lucide-react';
import { PRODUCTS_DATABASE as products, calculateTotalInventoryValue } from '@/data/products';
import { WAREHOUSES_DATABASE as warehouses } from '@/data/warehouses';
import { SUPPLIERS_DATABASE as suppliers } from '@/data/suppliers';
import { USERS_DATABASE as users } from '@/data/users';
import { TRANSACTIONS_DATABASE as transactions, calculateTotalRevenue, calculateCurrentStock } from '@/data/transactions';

const Analytics: React.FC = () => {
  const { user, hasRole } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // تحديد أدوار المستخدمين
  const isGeneralManager = hasRole(UserRole.GENERAL_MANAGER);
  const isWarehouseManager = hasRole(UserRole.WAREHOUSE_MANAGER);
  const isPurchasingManager = hasRole(UserRole.PURCHASING_MANAGER);

  // Real-time data refresh
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Calculate key metrics
  const totalProducts = products.length;
  const totalWarehouses = warehouses.length;
  const activeWarehouses = warehouses.filter(w => w.status === 'active').length;
  const totalValue = calculateTotalInventoryValue();
  const totalCapacity = warehouses.reduce((sum, w) => sum + w.capacity, 0);
  const usedCapacity = warehouses.reduce((sum, w) => sum + w.currentStock, 0);
  const totalRevenue = calculateTotalRevenue();
  const totalSuppliers = suppliers.length;
  const totalUsers = users.length;

  // Generate sample data for charts
  const monthlyData = useMemo(() => {
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];
    return months.map(month => ({
      month,
      revenue: Math.floor(Math.random() * 1000000) + 500000,
      expenses: Math.floor(Math.random() * 600000) + 300000,
      profit: Math.floor(Math.random() * 400000) + 200000
    }));
  }, []);

  const warehouseDistribution = useMemo(() => {
    const warehouseData = [
      { name: 'مخزن القاهرة الجديدة', value: 35, capacity: 100, color: '#0088FE' },
      { name: 'مخزن الإسكندرية', value: 25, capacity: 80, color: '#00C49F' },
      { name: 'مخزن 6 أكتوبر', value: 20, capacity: 60, color: '#FFBB28' },
      { name: 'مخزن العاشر من رمضان', value: 20, capacity: 70, color: '#FF8042' },
    ];
    return warehouseData.length > 0 ? warehouseData : warehouses.map(warehouse => ({
      name: warehouse.name,
      value: warehouse.currentStock,
      capacity: warehouse.capacity
    }));
  }, []);

  const productMovement = useMemo(() => {
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    return days.map(day => ({
      day,
      inbound: Math.floor(Math.random() * 50) + 10,
      outbound: Math.floor(Math.random() * 40) + 15,
      net: Math.floor(Math.random() * 20) - 10
    }));
  }, []);

  const performanceMetrics = useMemo(() => {
    return [
      { metric: 'الكفاءة', value: 85 },
      { metric: 'الجودة', value: 92 },
      { metric: 'السرعة', value: 78 },
      { metric: 'الدقة', value: 95 },
      { metric: 'الموثوقية', value: 88 },
      { metric: 'الرضا', value: 90 }
    ];
  }, []);

  const topProducts = useMemo(() => {
    const topProductsData = [
      { id: 1, name: 'أرز أبو كاس 5 كيلو', sales: 1250, revenue: 450000, growth: 12.5 },
      { id: 2, name: 'زيت المائدة 1.8 لتر', sales: 980, revenue: 380000, growth: 8.3 },
      { id: 3, name: 'سكر أبيض 1 كيلو', sales: 750, revenue: 280000, growth: -2.1 },
      { id: 4, name: 'شاي ليبتون 100 كيس', sales: 650, revenue: 220000, growth: 15.7 },
      { id: 5, name: 'مكرونة أبو شاهين 500 جم', sales: 520, revenue: 180000, growth: 5.2 },
    ];
    return topProductsData;
  }, []);

  const recentActivities = [
    { id: 1, type: 'sale', description: 'بيع أرز أبو كاس - 50 كيس', time: '10:30 ص', value: '+15,000 ج.م' },
    { id: 2, type: 'purchase', description: 'شراء زيت المائدة - 100 عبوة', time: '09:15 ص', value: '-8,500 ج.م' },
    { id: 3, type: 'transfer', description: 'نقل من مخزن القاهرة إلى الإسكندرية', time: '08:45 ص', value: '25 وحدة' },
    { id: 4, type: 'alert', description: 'تنبيه: مخزون السكر الأبيض منخفض', time: '08:00 ص', value: '5 أكياس متبقية' },
  ];

  const forecastData = useMemo(() => {
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];
    return months.map(month => ({
      month,
      actual: Math.floor(Math.random() * 800000) + 400000,
      forecast: Math.floor(Math.random() * 900000) + 450000,
      revenue: Math.floor(Math.random() * 1000000) + 500000
    }));
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  const handleExportData = (format: string) => {
    // Export functionality would be implemented here
    console.log(`Exporting data in ${format} format`);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const TrendIcon = ({ value }: { value: number }) => {
    return value >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <AlertCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold mb-2">
              مرحباً، {user?.name || 'المستخدم'}
            </h1>
            <p className="text-blue-100 mb-1 text-sm sm:text-base">
              {user?.role === 'ADMIN' ? 'مدير النظام' : 
               user?.role === 'WAREHOUSE_MANAGER' ? 'مدير المستودع' :
               user?.role === 'PURCHASING_MANAGER' ? 'مدير المشتريات' :
               user?.role === 'INVENTORY_CLERK' ? 'موظف المخزون' : 'مستخدم'}
            </p>
            <p className="text-blue-200 text-xs sm:text-sm">
              آخر دخول: {new Date().toLocaleDateString('ar-EG')}
            </p>
          </div>
          <div className="text-right">
            <div className="bg-white/20 rounded-lg p-2 sm:p-3">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 mb-1 sm:mb-2" />
              <p className="text-xs sm:text-sm">لوحة التحليلات</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">لوحة التحليلات</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            آخر تحديث: {lastUpdated.toLocaleTimeString('ar-EG')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            className="gap-2 w-full sm:w-auto"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
          
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 أيام</SelectItem>
              <SelectItem value="30">30 يوم</SelectItem>
              <SelectItem value="90">90 يوم</SelectItem>
              <SelectItem value="365">سنة</SelectItem>
            </SelectContent>
          </Select>
          
          {user?.role === 'ADMIN' && (
            <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر المستودع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المستودعات</SelectItem>
                {warehouses.map(warehouse => (
                  <SelectItem key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          <Button
            onClick={() => handleExportData('pdf')}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            تصدير
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                  <p className="text-blue-100 text-xs sm:text-sm font-medium">إجمالي القيمة</p>
                  <p className="text-xl sm:text-2xl font-bold">{(totalValue * 15).toLocaleString()} ج.م</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendIcon value={5.2} />
                    <span className="text-blue-100 text-xs sm:text-sm">+5.2% من الشهر الماضي</span>
                  </div>
                </div>
              <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs sm:text-sm font-medium">المنتجات المتاحة</p>
                <p className="text-xl sm:text-2xl font-bold">{totalProducts.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendIcon value={2.1} />
                  <span className="text-xs sm:text-sm">+2.1%</span>
                </div>
              </div>
              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs sm:text-sm font-medium">المستودعات النشطة</p>
                <p className="text-xl sm:text-2xl font-bold">{activeWarehouses}/{totalWarehouses}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendIcon value={0} />
                  <span className="text-xs sm:text-sm">0%</span>
                </div>
              </div>
              <Warehouse className="h-6 w-6 sm:h-8 sm:w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-xs sm:text-sm font-medium">معدل الاستخدام</p>
                <p className="text-xl sm:text-2xl font-bold">{Math.round((usedCapacity / totalCapacity) * 100)}%</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendIcon value={-1.5} />
                  <span className="text-xs sm:text-sm">-1.5%</span>
                </div>
              </div>
              <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="overview" className="gap-1 sm:gap-2 text-xs sm:text-sm">
            <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">نظرة عامة</span>
            <span className="xs:hidden">عامة</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="gap-1 sm:gap-2 text-xs sm:text-sm">
            <Target className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">الأداء</span>
            <span className="xs:hidden">أداء</span>
          </TabsTrigger>
          <TabsTrigger value="inventory" className="gap-1 sm:gap-2 text-xs sm:text-sm">
            <Package className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">المخزون</span>
            <span className="xs:hidden">مخزون</span>
          </TabsTrigger>
          <TabsTrigger value="forecasting" className="gap-1 sm:gap-2 text-xs sm:text-sm">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">التنبؤات</span>
            <span className="xs:hidden">تنبؤ</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Revenue Chart */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <LineChartIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  الإيرادات والمصروفات الشهرية
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  مقارنة الإيرادات والمصروفات خلال الأشهر الماضية
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <ResponsiveContainer width="100%" height={250}>
                  <ComposedChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      fill="#8884d8"
                      stroke="#8884d8"
                      name="الإيرادات"
                    />
                    <Bar dataKey="expenses" fill="#82ca9d" name="المصروفات" />
                    <Line
                      type="monotone"
                      dataKey="profit"
                      stroke="#ffc658"
                      strokeWidth={2}
                      name="الربح"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Warehouse Distribution */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <PieChartIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  توزيع المخزون حسب المستودع
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  نسبة توزيع المنتجات في المستودعات المختلفة
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={warehouseDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {warehouseDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Product Movement Chart */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
                حركة المنتجات اليومية
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                تتبع حركة دخول وخروج المنتجات على مدار الأسبوع
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="overflow-x-auto">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={productMovement}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="inbound"
                      stroke="#8884d8"
                      strokeWidth={2}
                      name="الوارد"
                    />
                    <Line
                      type="monotone"
                      dataKey="outbound"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      name="الصادر"
                    />
                    <Line
                      type="monotone"
                      dataKey="net"
                      stroke="#ffc658"
                      strokeWidth={2}
                      name="الصافي"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Performance Radar */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg">مؤشرات الأداء</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  تقييم شامل لجميع جوانب الأداء
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={performanceMetrics}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" fontSize={12} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} fontSize={10} />
                    <Radar
                      name="الأداء"
                      dataKey="value"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle>أفضل المنتجات أداءً</CardTitle>
                <CardDescription>
                  المنتجات الأكثر مبيعاً ونمواً
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => {
                    const isPositiveGrowth = product.growth >= 0;
                    return (
                      <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-500">{product.sales} مبيعة</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendIcon value={product.growth} />
                          <span className={`text-sm font-medium ${
                            isPositiveGrowth ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {isPositiveGrowth ? '+' : ''}{product.growth.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          {/* Warehouse Capacity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Warehouse className="h-5 w-5" />
                سعة المستودعات
              </CardTitle>
              <CardDescription>
                مقارنة السعة المستخدمة والمتاحة في كل مستودع
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={warehouseDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" name="المستخدم" />
                  <Bar dataKey="capacity" fill="#82ca9d" name="السعة الكلية" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Inventory Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">حالة المخزون</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>مخزون كافي</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {Math.floor(totalProducts * 0.7)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>مخزون منخفض</span>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      {Math.floor(totalProducts * 0.2)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>نفد المخزون</span>
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      {Math.floor(totalProducts * 0.1)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">الموردون</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>إجمالي الموردين</span>
                    <Badge variant="outline">{totalSuppliers}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>موردون نشطون</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {Math.floor(totalSuppliers * 0.8)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>في انتظار التقييم</span>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      {Math.floor(totalSuppliers * 0.2)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">المستخدمون</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>إجمالي المستخدمين</span>
                    <Badge variant="outline">{totalUsers}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>نشطون اليوم</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {Math.floor(totalUsers * 0.6)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>غير متصلين</span>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                      {Math.floor(totalUsers * 0.4)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Forecast */}
            <Card>
              <CardHeader>
                <CardTitle>توقعات المبيعات</CardTitle>
                <CardDescription>
                  مقارنة المبيعات الفعلية مع التوقعات
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={forecastData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="#8884d8"
                      strokeWidth={2}
                      name="الفعلي"
                    />
                    <Line
                      type="monotone"
                      dataKey="forecast"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="التوقعات"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue Forecast */}
            <Card>
              <CardHeader>
                <CardTitle>توقعات الإيرادات</CardTitle>
                <CardDescription>
                  نمو الإيرادات المتوقع للأشهر القادمة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={forecastData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8884d8"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="التوقعات"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Inventory Needs */}
          <Card>
            <CardHeader>
              <CardTitle>احتياجات المخزون</CardTitle>
              <CardDescription>
                التنبؤ باحتياجات إعادة التخزين
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="font-medium">يحتاج إعادة طلب فوري</span>
                  <Badge variant="destructive">15 منتج</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="font-medium">يحتاج إعادة طلب قريباً</span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    32 منتج
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">مخزون كافي</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {totalProducts - 47} منتج
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            خيارات التصدير
          </CardTitle>
          <CardDescription>
            تصدير البيانات التحليلية بصيغ مختلفة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => handleExportData('pdf')}
              variant="outline"
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              تصدير PDF
            </Button>
            <Button
              onClick={() => handleExportData('excel')}
              variant="outline"
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              تصدير Excel
            </Button>
            <Button
              onClick={() => handleExportData('csv')}
              variant="outline"
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              تصدير CSV
            </Button>
          </div>
        </CardContent>
      </Card>
        </main>
      </div>
    </div>
  );
};

export default Analytics;