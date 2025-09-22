import React, { useState } from "react";
import { Calendar, Download, FileText, TrendingUp, TrendingDown, Package, AlertTriangle, BarChart3, PieChart, Building2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/auth";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/navigation/Sidebar";

interface InventoryReport {
  id: string;
  reportType: "daily" | "weekly" | "monthly" | "quarterly";
  generatedDate: string;
  period: string;
  totalProducts: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  topMovingProducts: {
    name: string;
    quantity: number;
    value: number;
  }[];
  warehousePerformance: {
    warehouse: string;
    totalItems: number;
    value: number;
    efficiency: number;
  }[];
}

interface StockMovement {
  id: string;
  productName: string;
  warehouse: string;
  movementType: "in" | "out";
  quantity: number;
  date: string;
  reason: string;
}

const InventoryReports: React.FC = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<string>("monthly");
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("all");

  // Role checks
  const isGeneralManager = user?.role === UserRole.GENERAL_MANAGER;
  const isWarehouseManager = user?.role === UserRole.WAREHOUSE_MANAGER;
  const isPurchasingManager = user?.role === UserRole.PURCHASING_MANAGER;

  // Get accessible warehouses based on user role
  const getAccessibleWarehouses = () => {
    if (isGeneralManager || isPurchasingManager) {
      return ["المخزن الرئيسي", "المخزن المسطح", "مخزن الدرفلة", "مخزن ستيل", "مخزن العربية للأسمنت"];
    } else if (isWarehouseManager && user?.warehouse) {
      return [user.warehouse];
    }
    return [];
  };

  const accessibleWarehouses = getAccessibleWarehouses();

  // Filter reports based on accessible warehouses
  const getFilteredReports = (reports: InventoryReport[]) => {
    if (isGeneralManager || isPurchasingManager) {
      return reports;
    }
    
    return reports.map(report => ({
      ...report,
      warehousePerformance: report.warehousePerformance.filter(
        perf => accessibleWarehouses.includes(perf.warehouse)
      )
    }));
  };

  const reports: InventoryReport[] = [
    {
      id: "1",
      reportType: "monthly",
      generatedDate: "2024-01-15",
      period: "يناير 2024",
      totalProducts: 1245,
      totalValue: 2850000,
      lowStockItems: 23,
      outOfStockItems: 5,
      topMovingProducts: [
        { name: "لابتوب ديل XPS 13", quantity: 45, value: 1125000 },
        { name: "حديد تسليح 12 مم", quantity: 320, value: 256000 },
        { name: "كرسي مكتب مريح", quantity: 78, value: 117000 }
      ],
      warehousePerformance: [
        { warehouse: "المخزن الرئيسي", totalItems: 456, value: 1200000, efficiency: 92 },
        { warehouse: "المخزن المسطح", totalItems: 234, value: 650000, efficiency: 88 },
        { warehouse: "مخزن الدرفلة", totalItems: 345, value: 780000, efficiency: 85 },
        { warehouse: "مخزن ستيل", totalItems: 210, value: 220000, efficiency: 90 }
      ]
    },
    {
      id: "2",
      reportType: "weekly",
      generatedDate: "2024-01-08",
      period: "الأسبوع الأول - يناير 2024",
      totalProducts: 1240,
      totalValue: 2820000,
      lowStockItems: 18,
      outOfStockItems: 3,
      topMovingProducts: [
        { name: "أسمنت بورتلاندي", quantity: 85, value: 10200 },
        { name: "طابعة HP LaserJet", quantity: 12, value: 42000 },
        { name: "مكتب خشبي", quantity: 25, value: 125000 }
      ],
      warehousePerformance: [
        { warehouse: "المخزن الرئيسي", totalItems: 450, value: 1180000, efficiency: 94 },
        { warehouse: "المخزن المسطح", totalItems: 230, value: 640000, efficiency: 89 },
        { warehouse: "مخزن الدرفلة", totalItems: 340, value: 770000, efficiency: 87 },
        { warehouse: "مخزن ستيل", totalItems: 220, value: 230000, efficiency: 91 }
      ]
    }
  ];

  const stockMovements: StockMovement[] = [
    {
      id: "1",
      productName: "لابتوب ديل XPS 13",
      warehouse: "المخزن الرئيسي",
      movementType: "out",
      quantity: 5,
      date: "2024-01-15",
      reason: "بيع للعملاء"
    },
    {
      id: "2",
      productName: "حديد تسليح 12 مم",
      warehouse: "مخزن الدرفلة",
      movementType: "in",
      quantity: 100,
      date: "2024-01-14",
      reason: "شراء جديد"
    },
    {
      id: "3",
      productName: "كرسي مكتب مريح",
      warehouse: "المخزن المسطح",
      movementType: "out",
      quantity: 8,
      date: "2024-01-13",
      reason: "توزيع على الفروع"
    },
    {
      id: "4",
      productName: "أسمنت بورتلاندي",
      warehouse: "مخزن العربية للأسمنت",
      movementType: "in",
      quantity: 50,
      date: "2024-01-12",
      reason: "إعادة تخزين"
    }
  ];

  // Filter stock movements based on accessible warehouses
  const getFilteredStockMovements = (movements: StockMovement[]) => {
    if (isGeneralManager || isPurchasingManager) {
      return movements;
    }
    return movements.filter(movement => accessibleWarehouses.includes(movement.warehouse));
  };

  const filteredReports = getFilteredReports(reports);
  const filteredStockMovements = getFilteredStockMovements(stockMovements);
  const currentReport = filteredReports.find(r => r.reportType === selectedPeriod) || filteredReports[0];

  const exportReport = (format: "pdf" | "excel") => {
    console.log(`تصدير التقرير بصيغة ${format}`);
    alert(`تم تصدير التقرير بصيغة ${format.toUpperCase()} بنجاح!`);
  };

  const getMovementIcon = (type: "in" | "out") => {
    return type === "in" ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    );
  };

  const getMovementColor = (type: "in" | "out") => {
    return type === "in" ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
            {(isGeneralManager || isPurchasingManager) ? (
              <Shield className="w-8 h-8 text-blue-600" />
            ) : (
              <Building2 className="w-8 h-8 text-green-600" />
            )}
            <h1 className="text-3xl font-bold text-gray-900">
              {(isGeneralManager || isPurchasingManager) ? "تقارير المخزون الشاملة" : "تقارير مخزني"}
            </h1>
          </div>
          <p className="text-gray-600 mt-2">
            {(isGeneralManager || isPurchasingManager) 
              ? "تقارير دورية شاملة عن حالة جميع المخازن والحركات" 
              : `تقارير دورية عن حالة مخزن ${user?.warehouse || 'مخزنك'} والحركات`
            }
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => exportReport("excel")} variant="outline">
            <Download className="w-4 h-4 ml-2" />
            تصدير Excel
          </Button>
          <Button onClick={() => exportReport("pdf")} className="bg-red-600 hover:bg-red-700">
            <FileText className="w-4 h-4 ml-2" />
            تصدير PDF
          </Button>
        </div>
      </div>

      {/* فلاتر التقارير */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Calendar className="w-4 h-4 text-gray-500" />
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="اختر الفترة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">يومي</SelectItem>
              <SelectItem value="weekly">أسبوعي</SelectItem>
              <SelectItem value="monthly">شهري</SelectItem>
              <SelectItem value="quarterly">ربع سنوي</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="اختر المخزن" />
          </SelectTrigger>
          <SelectContent>
            {(isGeneralManager || isPurchasingManager) && (
              <SelectItem value="all">جميع المخازن</SelectItem>
            )}
            {accessibleWarehouses.map((warehouse) => (
              <SelectItem key={warehouse} value={warehouse}>
                {warehouse}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المنتجات</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentReport.totalProducts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">منتج في المخزون</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">القيمة الإجمالية</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentReport.totalValue.toLocaleString()} ج.م</div>
            <p className="text-xs text-muted-foreground">قيمة المخزون الحالي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مخزون منخفض</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{currentReport.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">منتج تحت الحد الأدنى</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">نفد من المخزون</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{currentReport.outOfStockItems}</div>
            <p className="text-xs text-muted-foreground">منتج غير متوفر</p>
          </CardContent>
        </Card>
      </div>

      {/* التبويبات */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="movements">حركات المخزون</TabsTrigger>
          <TabsTrigger value="performance">أداء المخازن</TabsTrigger>
          <TabsTrigger value="trends">الاتجاهات</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* أفضل المنتجات مبيعاً */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  أفضل المنتجات حركة
                </CardTitle>
                <CardDescription>المنتجات الأكثر حركة في الفترة المحددة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentReport.topMovingProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.quantity} وحدة</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{product.value.toLocaleString()} ج.م</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* توزيع المخزون */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-blue-600" />
                  توزيع المخزون حسب الحالة
                </CardTitle>
                <CardDescription>نسب المنتجات حسب حالة المخزون</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>مخزون طبيعي</span>
                    </div>
                    <span className="font-medium">{currentReport.totalProducts - currentReport.lowStockItems - currentReport.outOfStockItems}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>مخزون منخفض</span>
                    </div>
                    <span className="font-medium">{currentReport.lowStockItems}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>نفد من المخزون</span>
                    </div>
                    <span className="font-medium">{currentReport.outOfStockItems}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">حركات المخزون الأخيرة</CardTitle>
              <CardDescription>آخر العمليات على المخزون</CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المنتج</TableHead>
                    <TableHead>المخزن</TableHead>
                    <TableHead>نوع الحركة</TableHead>
                    <TableHead>الكمية</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>السبب</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStockMovements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell className="font-medium">{movement.productName}</TableCell>
                      <TableCell>{movement.warehouse}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getMovementIcon(movement.movementType)}
                          <span className={getMovementColor(movement.movementType)}>
                            {movement.movementType === "in" ? "دخول" : "خروج"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className={getMovementColor(movement.movementType)}>
                        {movement.movementType === "in" ? "+" : "-"}{movement.quantity}
                      </TableCell>
                      <TableCell>{new Date(movement.date).toLocaleDateString('ar-EG')}</TableCell>
                      <TableCell>{movement.reason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>أداء المخازن</CardTitle>
              <CardDescription>مقارنة أداء المخازن المختلفة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {currentReport.warehousePerformance.map((warehouse, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{warehouse.warehouse}</div>
                        <div className="text-sm text-gray-500">
                          {warehouse.totalItems} منتج • {warehouse.value.toLocaleString()} ج.م
                        </div>
                      </div>
                      <Badge className={warehouse.efficiency >= 90 ? "bg-green-100 text-green-800" : warehouse.efficiency >= 80 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}>
                        {warehouse.efficiency}% كفاءة
                      </Badge>
                    </div>
                    <Progress value={warehouse.efficiency} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>اتجاهات المخزون</CardTitle>
              <CardDescription>تحليل الاتجاهات والتوقعات</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">+12%</div>
                    <div className="text-sm text-gray-600">نمو المخزون</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">85%</div>
                    <div className="text-sm text-gray-600">معدل الدوران</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <PieChart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">92%</div>
                    <div className="text-sm text-gray-600">دقة المخزون</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">التوصيات:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• زيادة مخزون المنتجات عالية الطلب</li>
                    <li>• مراجعة مستويات الأمان للمنتجات منخفضة المخزون</li>
                    <li>• تحسين توزيع المنتجات بين المخازن</li>
                    <li>• تطبيق نظام إعادة الطلب التلقائي</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryReports;