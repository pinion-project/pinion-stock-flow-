import { useState } from "react";
import { FileText, Download, Calendar, TrendingUp, Package, Building2, Filter, BarChart3, PieChart, LineChart, Eye, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Permission, User } from "@/types/auth";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/navigation/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Reports = () => {
  const navigate = useNavigate();
  const { hasPermission, user } = useAuth();
  
  const isGeneralManager = user?.role === 'GENERAL_MANAGER';
  const isPurchasingManager = user?.role === 'PURCHASING_MANAGER';
  
  // Get accessible warehouses based on user role
  const getAccessibleWarehouses = () => {
    if (isGeneralManager || isPurchasingManager) {
      return [
        { id: 'all', name: 'جميع المخازن' },
        { id: 'cairo', name: 'المخزن الرئيسي' },
        { id: 'alex', name: 'المخزن المسطح' },
        { id: 'giza', name: 'مخزن الدرفلة' },
        { id: 'tanta', name: 'مخزن ستيل' },
        { id: 'cement', name: 'مخزن العربية للأسمنت' },
        { id: 'ghabbour', name: 'مخزن غبور' }
      ];
    }
    
    // For warehouse managers, show only their assigned warehouse
    const warehouseMapping: { [key: string]: { id: string, name: string } } = {
      'warehouse_manager_1': { id: 'cairo', name: 'المخزن الرئيسي' },
      'warehouse_manager_2': { id: 'alex', name: 'المخزن المسطح' },
      'warehouse_manager_3': { id: 'giza', name: 'مخزن الدرفلة' },
      'warehouse_manager_4': { id: 'tanta', name: 'مخزن ستيل' },
      'warehouse_manager_5': { id: 'cement', name: 'مخزن العربية للأسمنت' },
      'warehouse_manager_6': { id: 'ghabbour', name: 'مخزن غبور' }
    };
    
    const userWarehouse = warehouseMapping[user?.username || ''];
    return userWarehouse ? [userWarehouse] : [];
  };
  
  const accessibleWarehouses = getAccessibleWarehouses();
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedWarehouse, setSelectedWarehouse] = useState("all");
  const [selectedReportType, setSelectedReportType] = useState("all");
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const allReportTypes = [
    {
      title: "تقرير المخزون الشامل",
      description: "تفاصيل كاملة لجميع المنتجات في كافة المخازن",
      icon: Package,
      lastGenerated: "2024-01-15",
      status: "محدث",
      category: "inventory",
      size: "2.3 MB"
    },
    {
      title: "تقرير حركة المخزون",
      description: "تفاصيل جميع عمليات الدخول والخروج والنقل",
      icon: TrendingUp,
      lastGenerated: "2024-01-14",
      status: "محدث",
      category: "movement",
      size: "1.8 MB"
    },
    {
      title: "تقرير أداء المخازن",
      description: "إحصائيات الأداء والكفاءة لكل مخزن",
      icon: Building2,
      lastGenerated: "2024-01-13",
      status: "قديم",
      category: "performance",
      size: "1.2 MB"
    },
    {
      title: "تقرير المنتجات المنخفضة",
      description: "قائمة بالمنتجات التي تحتاج إعادة تعبئة",
      icon: Package,
      lastGenerated: "2024-01-15",
      status: "محدث",
      category: "alerts",
      size: "0.5 MB"
    },
    {
      title: "تقرير التحليلات المالية",
      description: "تحليل مالي شامل للمخزون والتكاليف",
      icon: BarChart3,
      lastGenerated: "2024-01-14",
      status: "محدث",
      category: "financial",
      size: "3.1 MB",
      requiresPermission: Permission.VIEW_TOTAL_VALUES
    },
    {
      title: "تقرير التنبؤات",
      description: "توقعات الطلب والمبيعات المستقبلية",
      icon: LineChart,
      lastGenerated: "2024-01-12",
      status: "قديم",
      category: "forecast",
      size: "1.5 MB"
    }
  ];

  // Filter reports based on user permissions
  const reportTypes = allReportTypes.filter(report => 
    !report.requiresPermission || hasPermission(report.requiresPermission)
  );

  const handleGenerateReport = async (reportType: string) => {
    setIsGenerating(true);
    // محاكاة عملية إنشاء التقرير
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
  };

  const handleExportAll = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "اسم التقرير,الفئة,آخر تحديث,الحالة,الحجم\n" +
      reportTypes.map(report => 
        `${report.title},${report.category},${report.lastGenerated},${report.status},${report.size}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reports_summary.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredReports = reportTypes.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedReportType === "all" || report.category === selectedReportType;
    return matchesSearch && matchesType;
  });

  const allInventoryReport = [
    {
      warehouse: "المخزن الرئيسي",
      totalProducts: 450,
      totalValue: "1,250,000",
      lowStock: 12,
      outOfStock: 3,
      utilizationRate: "78%"
    },
    {
      warehouse: "المخزن المسطح",
      totalProducts: 320,
      totalValue: "890,000",
      lowStock: 8,
      outOfStock: 2,
      utilizationRate: "65%"
    },
    {
      warehouse: "مخزن الدرفلة",
      totalProducts: 380,
      totalValue: "950,000",
      lowStock: 15,
      outOfStock: 5,
      utilizationRate: "85%"
    },
    {
      warehouse: "مخزن ستيل",
      totalProducts: 280,
      totalValue: "720,000",
      lowStock: 6,
      outOfStock: 1,
      utilizationRate: "72%"
    },
    {
      warehouse: "مخزن العربية للأسمنت",
      totalProducts: 350,
      totalValue: "980,000",
      lowStock: 10,
      outOfStock: 2,
      utilizationRate: "68%"
    },
    {
      warehouse: "مخزن غبور",
      totalProducts: 420,
      totalValue: "1,150,000",
      lowStock: 14,
      outOfStock: 4,
      utilizationRate: "82%"
    }
  ];
  
  // Filter inventory report based on user role
  const getFilteredInventoryReport = () => {
    if (isGeneralManager || isPurchasingManager) {
      return allInventoryReport;
    }
    
    // For warehouse managers, show only their assigned warehouse
    const warehouseMapping: { [key: string]: string } = {
      'warehouse_manager_1': 'المخزن الرئيسي',
      'warehouse_manager_2': 'المخزن المسطح',
      'warehouse_manager_3': 'مخزن الدرفلة',
      'warehouse_manager_4': 'مخزن ستيل',
      'warehouse_manager_5': 'مخزن العربية للأسمنت',
      'warehouse_manager_6': 'مخزن غبور'
    };
    
    const userWarehouse = warehouseMapping[user?.username || ''];
    return userWarehouse ? allInventoryReport.filter(item => item.warehouse === userWarehouse) : [];
  };
  
  const inventoryReport = getFilteredInventoryReport();

  const movementReport = [
    {
      date: "2024-01-15",
      totalIn: "450,000",
      totalOut: "320,000",
      transfers: 8,
      netValue: "130,000"
    },
    {
      date: "2024-01-14",
      totalIn: "280,000",
      totalOut: "410,000",
      transfers: 12,
      netValue: "-130,000"
    },
    {
      date: "2024-01-13",
      totalIn: "520,000",
      totalOut: "290,000",
      transfers: 6,
      netValue: "230,000"
    },
    {
      date: "2024-01-12",
      totalIn: "380,000",
      totalOut: "450,000",
      transfers: 9,
      netValue: "-70,000"
    }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">التقارير والتحليلات</h1>
              <p className="text-muted-foreground">تقارير شاملة وتحليلات مفصلة للمخازن</p>
            </div>
            
            <div className="flex gap-3">
              {hasPermission(Permission.VIEW_WAREHOUSE_REPORTS) && (
                <Button variant="outline">
                  <RefreshCw className="w-4 h-4 ml-2" />
                  تحديث البيانات
                </Button>
              )}
              {hasPermission(Permission.VIEW_WAREHOUSE_REPORTS) && (
                <Button variant="outline">
                  <Calendar className="w-4 h-4 ml-2" />
                  تخصيص الفترة
                </Button>
              )}
              {(hasPermission(Permission.VIEW_WAREHOUSE_REPORTS) || hasPermission(Permission.VIEW_PURCHASE_REPORTS)) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90">
                      <Download className="w-4 h-4 ml-2" />
                      تصدير التقارير
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleExportAll}>
                      <FileText className="ml-2 h-4 w-4" />
                      تصدير ملخص التقارير (CSV)
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="ml-2 h-4 w-4" />
                      تصدير جميع التقارير (ZIP)
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <BarChart3 className="ml-2 h-4 w-4" />
                      تصدير الرسوم البيانية (PDF)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Quick Report Generation */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>إنشاء تقرير سريع</CardTitle>
                <div className="flex gap-2">
                  <Input
                    placeholder="البحث في التقارير..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                  <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="نوع التقرير" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع التقارير</SelectItem>
                      <SelectItem value="inventory">تقارير المخزون</SelectItem>
                      <SelectItem value="movement">تقارير الحركة</SelectItem>
                      <SelectItem value="performance">تقارير الأداء</SelectItem>
                      <SelectItem value="financial">التقارير المالية</SelectItem>
                      <SelectItem value="forecast">تقارير التنبؤات</SelectItem>
                      <SelectItem value="alerts">تقارير التنبيهات</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredReports.map((report, index) => {
                  const Icon = report.icon;
                  return (
                    <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <Icon className="h-8 w-8 text-primary" />
                        <Badge variant={report.status === "محدث" ? "default" : "secondary"}>
                          {report.status}
                        </Badge>
                      </div>
                      <h3 className="font-semibold mb-2">{report.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-muted-foreground">
                          آخر تحديث: {report.lastGenerated}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          الحجم: {report.size}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {(hasPermission(Permission.VIEW_WAREHOUSE_REPORTS) || hasPermission(Permission.VIEW_PURCHASE_REPORTS)) && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => navigate(`/reports/${report.category}`)}
                          >
                            <Eye className="w-3 h-3 ml-1" />
                            عرض
                          </Button>
                        )}
                        {(hasPermission(Permission.VIEW_WAREHOUSE_REPORTS) || hasPermission(Permission.VIEW_PURCHASE_REPORTS)) && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleGenerateReport(report.category)}
                            disabled={isGenerating}
                          >
                            <Download className="w-3 h-3 ml-1" />
                            تحميل
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {filteredReports.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>لا توجد تقارير تطابق البحث</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Report Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>فلاتر التقارير المتقدمة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">الفترة الزمنية</label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفترة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">اليوم</SelectItem>
                      <SelectItem value="week">الأسبوع الحالي</SelectItem>
                      <SelectItem value="month">الشهر الحالي</SelectItem>
                      <SelectItem value="quarter">الربع الحالي</SelectItem>
                      <SelectItem value="year">السنة الحالية</SelectItem>
                      <SelectItem value="custom">فترة مخصصة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">المخزن</label>
                  <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المخزن" />
                    </SelectTrigger>
                    <SelectContent>
                      {accessibleWarehouses.map((warehouse) => (
                        <SelectItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">نوع البيانات</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="نوع البيانات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع البيانات</SelectItem>
                      <SelectItem value="products">المنتجات فقط</SelectItem>
                      <SelectItem value="movements">الحركات فقط</SelectItem>
                      <SelectItem value="financial">البيانات المالية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end gap-2">
                  <Button className="flex-1">
                    <Filter className="w-4 h-4 ml-2" />
                    تطبيق الفلاتر
                  </Button>
                  <Button variant="outline">
                    إعادة تعيين
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Dashboard */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>لوحة التحليلات السريعة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 border rounded-lg">
                  <BarChart3 className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">إجمالي التقارير</h3>
                  <p className="text-2xl font-bold text-blue-600">{reportTypes.length}</p>
                  <p className="text-sm text-muted-foreground">تقرير متاح</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">التقارير المحدثة</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {reportTypes.filter(r => r.status === "محدث").length}
                  </p>
                  <p className="text-sm text-muted-foreground">تقرير محدث</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <PieChart className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">حجم البيانات</h3>
                  <p className="text-2xl font-bold text-orange-600">12.4</p>
                  <p className="text-sm text-muted-foreground">ميجابايت</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <LineChart className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">معدل التحديث</h3>
                  <p className="text-2xl font-bold text-purple-600">95%</p>
                  <p className="text-sm text-muted-foreground">دقة البيانات</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Reports */}
          <Tabs defaultValue="inventory" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="inventory" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                تقرير المخزون
              </TabsTrigger>
              <TabsTrigger value="movement" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                تقرير الحركة
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                تقرير الأداء
              </TabsTrigger>
            </TabsList>

            {/* Inventory Report */}
            <TabsContent value="inventory">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>تقرير حالة المخزون</CardTitle>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 ml-2" />
                      تصدير Excel
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>المخزن</TableHead>
                        <TableHead>إجمالي المنتجات</TableHead>
                        {hasPermission(Permission.VIEW_TOTAL_VALUES) && (
                          <TableHead>القيمة الإجمالية</TableHead>
                        )}
                        <TableHead>مخزون منخفض</TableHead>
                        <TableHead>نفد المخزون</TableHead>
                        <TableHead>معدل الاستغلال</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventoryReport.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.warehouse}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-blue-500" />
                              {item.totalProducts}
                            </div>
                          </TableCell>
                          {hasPermission(Permission.VIEW_TOTAL_VALUES) && (
                            <TableCell className="font-semibold text-green-600">{item.totalValue} ج.م</TableCell>
                          )}
                          <TableCell>
                            <Badge variant={item.lowStock > 10 ? "destructive" : "secondary"}>
                              {item.lowStock}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={item.outOfStock > 0 ? "destructive" : "default"}>
                              {item.outOfStock}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{item.utilizationRate}</span>
                              <Progress value={parseInt(item.utilizationRate)} className="w-16" />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Movement Report */}
            <TabsContent value="movement">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>تقرير حركة المخزون اليومية</CardTitle>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 ml-2" />
                      تصدير PDF
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>التاريخ</TableHead>
                        <TableHead>إجمالي الداخل</TableHead>
                        <TableHead>إجمالي الخارج</TableHead>
                        <TableHead>عمليات النقل</TableHead>
                        <TableHead>صافي القيمة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {movementReport.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.date}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-green-600">
                              <TrendingUp className="h-4 w-4" />
                              {item.totalIn} ج.م
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-red-600">
                              <TrendingUp className="h-4 w-4 rotate-180" />
                              {item.totalOut} ج.م
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.transfers}</Badge>
                          </TableCell>
                          <TableCell className="font-semibold">
                            <span className={item.netValue.startsWith('-') ? 'text-red-600' : 'text-green-600'}>
                              {item.netValue} ج.م
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Performance Report */}
            <TabsContent value="performance">
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold mb-2">أفضل مخزن أداءً</h3>
                        <p className="text-2xl font-bold text-success">مخزن الدرفلة</p>
                        <p className="text-sm text-muted-foreground">معدل استغلال 85%</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold mb-2">متوسط دوران المخزون</h3>
                        <p className="text-2xl font-bold text-primary">12.3 مرة/سنة</p>
                        <p className="text-sm text-muted-foreground">تحسن بنسبة 5%</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold mb-2">دقة المخزون</h3>
                        <p className="text-2xl font-bold text-accent">98.2%</p>
                        <p className="text-sm text-muted-foreground">أعلى من المعيار</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>ملخص الأداء الشهري</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">نقاط القوة</h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            <li>• تحسن في سرعة المعالجة بنسبة 15%</li>
                            <li>• انخفاض في نفاد المخزون بنسبة 8%</li>
                            <li>• زيادة في دقة التتبع بنسبة 3%</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">نقاط التحسين</h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            <li>• تحسين التوزيع بين المخازن</li>
                            <li>• تقليل وقت النقل بين المخازن</li>
                            <li>• تحسين التنبؤ بالطلب</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Reports;