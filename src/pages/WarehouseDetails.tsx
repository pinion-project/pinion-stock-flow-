import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  User,
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Truck,
  BarChart3,
  Activity
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  minStock: number;
  maxStock: number;
  category: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastUpdated: string;
}

interface WarehouseData {
  id: string;
  name: string;
  location: string;
  address: string;
  capacity: number;
  currentStock: number;
  manager: string;
  managerEmail: string;
  phone: string;
  createdAt: string;
  status: 'active' | 'inactive' | 'maintenance';
  products: Product[];
  recentActivities: Array<{
    id: string;
    type: 'in' | 'out' | 'transfer';
    product: string;
    quantity: number;
    timestamp: string;
    user: string;
  }>;
  performance: {
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
    monthlyTrend: number;
  };
}

// دوال مساعدة لجلب بيانات كل مخزن
const getWarehouseProducts = (warehouseId: string): Product[] => {
  const productsByWarehouse: { [key: string]: Product[] } = {
    "1": [ // المخزن الرئيسي
      {
        id: '1',
        name: 'لابتوب ديل XPS 13',
        sku: 'DELL-XPS13-001',
        quantity: 45,
        minStock: 10,
        maxStock: 100,
        category: 'إلكترونيات',
        status: 'in_stock',
        lastUpdated: '2024-01-20'
      },
      {
        id: '2',
        name: 'ماوس لوجيتك MX Master',
        sku: 'LOG-MX-002',
        quantity: 8,
        minStock: 15,
        maxStock: 50,
        category: 'ملحقات',
        status: 'low_stock',
        lastUpdated: '2024-01-19'
      },
      {
        id: '3',
        name: 'شاشة سامسونج 27 بوصة',
        sku: 'SAM-MON-003',
        quantity: 0,
        minStock: 5,
        maxStock: 30,
        category: 'شاشات',
        status: 'out_of_stock',
        lastUpdated: '2024-01-18'
      }
    ],
    "2": [ // المخزن المسطح
      {
        id: '4',
        name: 'حديد مسطح 10مم',
        sku: 'STEEL-FLAT-10',
        quantity: 120,
        minStock: 50,
        maxStock: 200,
        category: 'حديد مسطح',
        status: 'in_stock',
        lastUpdated: '2024-01-20'
      },
      {
        id: '5',
        name: 'حديد مسطح 12مم',
        sku: 'STEEL-FLAT-12',
        quantity: 25,
        minStock: 30,
        maxStock: 150,
        category: 'حديد مسطح',
        status: 'low_stock',
        lastUpdated: '2024-01-19'
      }
    ],
    "3": [ // مخزن الدرفلة
      {
        id: '6',
        name: 'حديد تسليح 16مم',
        sku: 'REBAR-16MM',
        quantity: 80,
        minStock: 40,
        maxStock: 120,
        category: 'حديد تسليح',
        status: 'in_stock',
        lastUpdated: '2024-01-20'
      },
      {
        id: '7',
        name: 'حديد تسليح 20مم',
        sku: 'REBAR-20MM',
        quantity: 15,
        minStock: 25,
        maxStock: 100,
        category: 'حديد تسليح',
        status: 'low_stock',
        lastUpdated: '2024-01-18'
      }
    ],
    "4": [ // مخزن ستيل
      {
        id: '8',
        name: 'صاج مجلفن 2مم',
        sku: 'GALV-SHEET-2',
        quantity: 200,
        minStock: 100,
        maxStock: 300,
        category: 'صاج',
        status: 'in_stock',
        lastUpdated: '2024-01-20'
      }
    ],
    "5": [ // مخزن العربية للأسمنت
      {
        id: '9',
        name: 'أسمنت بورتلاندي',
        sku: 'CEMENT-PORT-50',
        quantity: 500,
        minStock: 200,
        maxStock: 1000,
        category: 'أسمنت',
        status: 'in_stock',
        lastUpdated: '2024-01-19'
      }
    ],
    "6": [ // مخزن غبور
      {
        id: '10',
        name: 'قطع غيار سيارات',
        sku: 'AUTO-PARTS-001',
        quantity: 150,
        minStock: 50,
        maxStock: 200,
        category: 'قطع غيار',
        status: 'in_stock',
        lastUpdated: '2024-01-20'
      }
    ]
  };
  return productsByWarehouse[warehouseId] || [];
};

const getWarehouseActivities = (warehouseId: string) => {
  const activitiesByWarehouse: { [key: string]: any[] } = {
    "1": [
      {
        id: '1',
        type: 'in',
        product: 'لابتوب ديل XPS 13',
        quantity: 20,
        timestamp: '2024-01-20 14:30',
        user: 'محمد أحمد'
      },
      {
        id: '2',
        type: 'out',
        product: 'ماوس لوجيتك MX Master',
        quantity: 5,
        timestamp: '2024-01-20 11:15',
        user: 'فاطمة علي'
      }
    ],
    "2": [
      {
        id: '3',
        type: 'in',
        product: 'حديد مسطح 10مم',
        quantity: 50,
        timestamp: '2024-01-20 10:00',
        user: 'أحمد محمد'
      }
    ],
    "3": [
      {
        id: '4',
        type: 'transfer',
        product: 'حديد تسليح 16مم',
        quantity: 30,
        timestamp: '2024-01-19 16:45',
        user: 'خالد محمد'
      }
    ]
  };
  return activitiesByWarehouse[warehouseId] || [];
};

const getWarehousePerformance = (warehouseId: string) => {
  const performanceByWarehouse: { [key: string]: any } = {
    "1": { totalOrders: 156, completedOrders: 142, pendingOrders: 14, monthlyTrend: 12.5 },
    "2": { totalOrders: 89, completedOrders: 82, pendingOrders: 7, monthlyTrend: 8.3 },
    "3": { totalOrders: 67, completedOrders: 61, pendingOrders: 6, monthlyTrend: 15.2 },
    "4": { totalOrders: 45, completedOrders: 40, pendingOrders: 5, monthlyTrend: 10.1 },
    "5": { totalOrders: 23, completedOrders: 20, pendingOrders: 3, monthlyTrend: 5.7 },
    "6": { totalOrders: 78, completedOrders: 72, pendingOrders: 6, monthlyTrend: 9.4 }
  };
  return performanceByWarehouse[warehouseId] || { totalOrders: 0, completedOrders: 0, pendingOrders: 0, monthlyTrend: 0 };
};

const WarehouseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // بيانات المخازن المتاحة - يجب أن تتطابق مع البيانات في صفحة المخازن
  const warehousesData = [
    {
      id: "1",
      name: "المخزن الرئيسي",
      location: "القاهرة",
      address: "شارع النصر، مدينة نصر، القاهرة",
      manager: "أحمد محمد علي",
      managerEmail: "main.warehouse@pinion-egypt.com",
      phone: "+20 12 3456 7890",
      capacity: 10000,
      currentStock: 7500,
      status: "active" as const,
      createdAt: "2020-01-15"
    },
    {
      id: "2",
      name: "المخزن المسطح",
      location: "الإسكندرية",
      address: "طريق الكورنيش، الإسكندرية",
      manager: "فاطمة حسن محمود",
      managerEmail: "flat.warehouse@pinion-egypt.com",
      phone: "+20 10 9876 5432",
      capacity: 5000,
      currentStock: 3200,
      status: "active" as const,
      createdAt: "2021-03-10"
    },
    {
      id: "3",
      name: "مخزن الدرفلة",
      location: "طنطا",
      address: "شارع الجمهورية، طنطا، الغربية",
      manager: "محمد أحمد السيد",
      managerEmail: "rolling.warehouse@pinion-egypt.com",
      phone: "+20 11 2468 1357",
      capacity: 3000,
      currentStock: 2100,
      status: "active" as const,
      createdAt: "2022-06-20"
    },
    {
      id: "4",
      name: "مخزن ستيل",
      location: "القاهرة",
      address: "المنطقة الصناعية، العبور، القاهرة",
      manager: "سارة عبد الرحمن",
      managerEmail: "steel.warehouse@pinion-egypt.com",
      phone: "+20 15 7531 9642",
      capacity: 2000,
      currentStock: 1800,
      status: "active" as const,
      createdAt: "2023-02-14"
    },
    {
      id: "5",
      name: "مخزن العربية للأسمنت",
      location: "أسوان",
      address: "شارع السد العالي، أسوان",
      manager: "عبد الله محمد نور",
      managerEmail: "cement.warehouse@pinion-egypt.com",
      phone: "+20 12 8642 9753",
      capacity: 1500,
      currentStock: 450,
      status: "active" as const,
      createdAt: "2023-08-05"
    },
    {
      id: "6",
      name: "مخزن غبور",
      location: "الجيزة",
      address: "شارع الهرم، الجيزة",
      manager: "خالد أحمد محمد",
      managerEmail: "ghabbour.warehouse@pinion-egypt.com",
      phone: "+20 12 5555 7777",
      capacity: 4000,
      currentStock: 2800,
      status: "active" as const,
      createdAt: "2023-10-01"
    }
  ];

  // العثور على المخزن المطلوب بناءً على المعرف
  const selectedWarehouse = warehousesData.find(w => w.id === id);
  
  // إذا لم يتم العثور على المخزن، استخدم المخزن الأول كافتراضي
  const currentWarehouse = selectedWarehouse || warehousesData[0];

  const warehouseData: WarehouseData = {
    id: currentWarehouse.id,
    name: currentWarehouse.name,
    location: currentWarehouse.location,
    address: currentWarehouse.address,
    capacity: currentWarehouse.capacity,
    currentStock: currentWarehouse.currentStock,
    manager: currentWarehouse.manager,
    managerEmail: currentWarehouse.managerEmail,
    phone: currentWarehouse.phone,
    createdAt: currentWarehouse.createdAt,
    status: currentWarehouse.status,
    products: getWarehouseProducts(currentWarehouse.id),
    recentActivities: getWarehouseActivities(currentWarehouse.id),
    performance: getWarehousePerformance(currentWarehouse.id)
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />نشط</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><AlertTriangle className="w-3 h-3 mr-1" />غير نشط</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><Clock className="w-3 h-3 mr-1" />صيانة</Badge>;
      default:
        return null;
    }
  };

  const getProductStatusBadge = (status: string) => {
    switch (status) {
      case 'in_stock':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">متوفر</Badge>;
      case 'low_stock':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">مخزون منخفض</Badge>;
      case 'out_of_stock':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">نفد المخزون</Badge>;
      default:
        return null;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'in':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'out':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'transfer':
        return <Truck className="w-4 h-4 text-blue-600" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const capacityPercentage = (warehouseData.currentStock / warehouseData.capacity) * 100;

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4 space-x-reverse">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 space-x-reverse"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">العودة</span>
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{warehouseData.name}</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">تفاصيل المخزن الشاملة</p>
          </div>
        </div>
        {getStatusBadge(warehouseData.status)}
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">معلومات أساسية</CardTitle>
            <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-3">
              <div className="flex items-start space-x-2 space-x-reverse">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs sm:text-sm font-medium">{warehouseData.location}</p>
                  <p className="text-xs text-gray-500 break-words">{warehouseData.address}</p>
                </div>
              </div>
              <div className="flex items-start space-x-2 space-x-reverse">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs sm:text-sm font-medium">تاريخ الإنشاء</p>
                  <p className="text-xs text-gray-500">{new Date(warehouseData.createdAt).toLocaleDateString('ar-SA')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">المسؤول عن المخزن</CardTitle>
            <User className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-2">
              <p className="text-base sm:text-lg font-semibold break-words">{warehouseData.manager}</p>
              <p className="text-xs sm:text-sm text-gray-600 break-all">{warehouseData.managerEmail}</p>
              <p className="text-xs sm:text-sm text-gray-600">{warehouseData.phone}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">السعة والاستخدام</CardTitle>
            <Package className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span>المخزون الحالي</span>
                  <span>{warehouseData.currentStock.toLocaleString()} / {warehouseData.capacity.toLocaleString()}</span>
                </div>
                <Progress value={capacityPercentage} className="mt-2" />
                <p className="text-xs text-gray-500 mt-1">{capacityPercentage.toFixed(1)}% من السعة الإجمالية</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center space-x-2 space-x-reverse text-base sm:text-lg">
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>مؤشرات الأداء</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
              <p className="text-lg sm:text-2xl font-bold text-blue-600">{warehouseData.performance.totalOrders}</p>
              <p className="text-xs sm:text-sm text-gray-600">إجمالي الطلبات</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
              <p className="text-lg sm:text-2xl font-bold text-green-600">{warehouseData.performance.completedOrders}</p>
              <p className="text-xs sm:text-sm text-gray-600">طلبات مكتملة</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-yellow-50 rounded-lg">
              <p className="text-lg sm:text-2xl font-bold text-yellow-600">{warehouseData.performance.pendingOrders}</p>
              <p className="text-xs sm:text-sm text-gray-600">طلبات معلقة</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg">
              <p className="text-lg sm:text-2xl font-bold text-purple-600">+{warehouseData.performance.monthlyTrend}%</p>
              <p className="text-xs sm:text-sm text-gray-600">نمو شهري</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Products */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">المنتجات المتاحة</CardTitle>
            <CardDescription className="text-xs sm:text-sm">قائمة بالمنتجات الموجودة في هذا المخزن</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              {warehouseData.products.map((product) => (
                <div key={product.id} className="flex items-start justify-between p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h4 className="font-medium text-sm sm:text-base truncate">{product.name}</h4>
                      {getProductStatusBadge(product.status)}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 break-words">{product.sku} • {product.category}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 sm:space-x-reverse mt-2 gap-1 sm:gap-0">
                      <span className="text-xs sm:text-sm">الكمية: <span className="font-medium">{product.quantity}</span></span>
                      <span className="text-xs sm:text-sm text-gray-500">الحد الأدنى: {product.minStock}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">الأنشطة الأخيرة</CardTitle>
            <CardDescription className="text-xs sm:text-sm">آخر العمليات التي تمت في المخزن</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              {warehouseData.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 space-x-reverse p-3 border rounded-lg">
                  <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                      <p className="font-medium text-sm sm:text-base truncate">{activity.product}</p>
                      <span className="text-xs sm:text-sm text-gray-500">{activity.timestamp}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {activity.type === 'in' && 'إدخال'}
                      {activity.type === 'out' && 'إخراج'}
                      {activity.type === 'transfer' && 'نقل'}
                      {' '}{activity.quantity} وحدة • بواسطة {activity.user}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WarehouseDetails;