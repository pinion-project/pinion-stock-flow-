import { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Building2, MapPin, Package, Users, TrendingUp, Eye, Shield, AlertTriangle } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/navigation/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useRealtime } from "@/contexts/RealtimeContext";
import { UserRole, Permission } from "@/types/auth";

interface Warehouse {
  id: string;
  name: string;
  location: string;
  address: string;
  manager: string;
  capacity: number;
  currentStock: number;
  totalProducts: number;
  status: "active" | "inactive" | "maintenance";
  type: "main" | "branch" | "storage";
  phone: string;
  email: string;
  establishedDate: string;
}

const Warehouses = () => {
  const { user, hasPermission, hasRole } = useAuth();
  const { sendUpdate } = useRealtime();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  
  // تحديد ما إذا كان المستخدم مدير عام أم مدير مخزن أم مدير مشتريات
  const isGeneralManager = hasRole(UserRole.GENERAL_MANAGER);
  const isWarehouseManager = hasRole(UserRole.WAREHOUSE_MANAGER);
  const isPurchasingManager = hasRole(UserRole.PURCHASING_MANAGER);

  // بيانات وهمية للمخازن
  const warehouses: Warehouse[] = [
    {
      id: "1",
      name: "المخزن الرئيسي",
      location: "القاهرة",
      address: "شارع النصر، مدينة نصر، القاهرة",
      manager: "أحمد محمد علي",
      capacity: 10000,
      currentStock: 7500,
      totalProducts: 1245,
      status: "active",
      type: "main",
      phone: "+20 12 3456 7890",
      email: "main.warehouse@pinion-egypt.com",
      establishedDate: "2020-01-15"
    },
    {
      id: "2",
      name: "المخزن المسطح",
      location: "الإسكندرية",
      address: "طريق الكورنيش، الإسكندرية",
      manager: "فاطمة حسن محمود",
      capacity: 5000,
      currentStock: 3200,
      totalProducts: 890,
      status: "active",
      type: "branch",
      phone: "+20 10 9876 5432",
      email: "flat.warehouse@pinion-egypt.com",
      establishedDate: "2021-03-10"
    },
    {
      id: "3",
      name: "مخزن الدرفلة",
      location: "طنطا",
      address: "شارع الجمهورية، طنطا، الغربية",
      manager: "محمد أحمد السيد",
      capacity: 3000,
      currentStock: 2100,
      totalProducts: 567,
      status: "active",
      type: "branch",
      phone: "+20 11 2468 1357",
      email: "rolling.warehouse@pinion-egypt.com",
      establishedDate: "2022-06-20"
    },
    {
      id: "4",
      name: "مخزن ستيل",
      location: "القاهرة",
      address: "المنطقة الصناعية، العبور، القاهرة",
      manager: "سارة عبد الرحمن",
      capacity: 2000,
      currentStock: 1800,
      totalProducts: 234,
      status: "active",
      type: "storage",
      phone: "+20 15 7531 9642",
      email: "steel.warehouse@pinion-egypt.com",
      establishedDate: "2023-02-14"
    },
    {
      id: "5",
      name: "مخزن العربية للأسمنت",
      location: "أسوان",
      address: "شارع السد العالي، أسوان",
      manager: "عبد الله محمد نور",
      capacity: 1500,
      currentStock: 450,
      totalProducts: 123,
      status: "active",
      type: "branch",
      phone: "+20 12 8642 9753",
      email: "cement.warehouse@pinion-egypt.com",
      establishedDate: "2023-08-05"
    },
    {
      id: "6",
      name: "مخزن غبور",
      location: "الجيزة",
      address: "شارع الهرم، الجيزة",
      manager: "خالد أحمد محمد",
      capacity: 4000,
      currentStock: 2800,
      totalProducts: 678,
      status: "active",
      type: "branch",
      phone: "+20 12 5555 7777",
      email: "ghabbour.warehouse@pinion-egypt.com",
      establishedDate: "2023-10-01"
    }
  ];

  // تصفية المخازن حسب دور المستخدم
  const getAccessibleWarehouses = () => {
    if (isGeneralManager || isPurchasingManager) {
      // المدير العام ومدير المشتريات يرون جميع المخازن
      return warehouses;
    } else if (isWarehouseManager && user?.assignedWarehouses) {
      // مدير المخزن يرى المخازن المخصصة له فقط
      const assignedWarehouseIds = user.assignedWarehouses.map(w => w.id);
      return warehouses.filter(warehouse => assignedWarehouseIds.includes(warehouse.id));
    }
    return [];
  };

  const accessibleWarehouses = getAccessibleWarehouses();
  
  const filteredWarehouses = accessibleWarehouses.filter(warehouse => {
    const matchesSearch = warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         warehouse.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         warehouse.manager.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || warehouse.status === filterStatus;
    const matchesType = filterType === "all" || warehouse.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">نشط</Badge>;
      case "inactive":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">غير نشط</Badge>;
      case "maintenance":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">صيانة</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "main":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">رئيسي</Badge>;
      case "branch":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">فرع</Badge>;
      case "storage":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">تخزين</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const calculateUtilization = (current: number, capacity: number) => {
    return Math.round((current / capacity) * 100);
  };

  const WarehouseDialog = ({ warehouse, isOpen, onClose, mode }: {
    warehouse: Warehouse | null;
    isOpen: boolean;
    onClose: () => void;
    mode: "add" | "edit" | "view";
  }) => {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {mode === "add" && "إضافة مخزن جديد"}
              {mode === "edit" && "تعديل بيانات المخزن"}
              {mode === "view" && "تفاصيل المخزن"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">اسم المخزن</Label>
                <Input
                  id="name"
                  defaultValue={warehouse?.name || ""}
                  disabled={mode === "view"}
                  placeholder="أدخل اسم المخزن"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">الموقع</Label>
                <Input
                  id="location"
                  defaultValue={warehouse?.location || ""}
                  disabled={mode === "view"}
                  placeholder="أدخل الموقع"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">العنوان التفصيلي</Label>
              <Textarea
                id="address"
                defaultValue={warehouse?.address || ""}
                disabled={mode === "view"}
                placeholder="أدخل العنوان التفصيلي"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="manager">مدير المخزن</Label>
                <Input
                  id="manager"
                  defaultValue={warehouse?.manager || ""}
                  disabled={mode === "view"}
                  placeholder="أدخل اسم المدير"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">نوع المخزن</Label>
                <Select defaultValue={warehouse?.type || ""} disabled={mode === "view"}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع المخزن" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">مخزن رئيسي</SelectItem>
                    <SelectItem value="branch">مخزن فرع</SelectItem>
                    <SelectItem value="storage">مخزن تخزين</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input
                  id="phone"
                  defaultValue={warehouse?.phone || ""}
                  disabled={mode === "view"}
                  placeholder="أدخل رقم الهاتف"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={warehouse?.email || ""}
                  disabled={mode === "view"}
                  placeholder="أدخل البريد الإلكتروني"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">السعة الإجمالية</Label>
                <Input
                  id="capacity"
                  type="number"
                  defaultValue={warehouse?.capacity || ""}
                  disabled={mode === "view"}
                  placeholder="أدخل السعة الإجمالية"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">الحالة</Label>
                <Select defaultValue={warehouse?.status || ""} disabled={mode === "view"}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="inactive">غير نشط</SelectItem>
                    <SelectItem value="maintenance">صيانة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {mode === "view" && warehouse && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label>المخزون الحالي</Label>
                  <div className="text-2xl font-bold text-blue-600">
                    {warehouse.currentStock.toLocaleString()}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>إجمالي المنتجات</Label>
                  <div className="text-2xl font-bold text-green-600">
                    {warehouse.totalProducts.toLocaleString()}
                  </div>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>نسبة الاستخدام</Label>
                  <Progress 
                    value={calculateUtilization(warehouse.currentStock, warehouse.capacity)} 
                    className="h-3"
                  />
                  <div className="text-sm text-muted-foreground text-center">
                    {calculateUtilization(warehouse.currentStock, warehouse.capacity)}% من السعة الإجمالية
                  </div>
                </div>
              </div>
            )}

            {mode !== "view" && (
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={onClose}>
                  إلغاء
                </Button>
                <Button onClick={() => {
                  if (mode === "add") {
                    // إرسال تحديث فوري عند إنشاء مخزن جديد
                    sendUpdate({
                      type: 'warehouse_update',
                      data: {
                        warehouseName: 'مخزن جديد',
                        status: 'active',
                        message: 'تم إنشاء مخزن جديد'
                      },
                      userId: user?.id,
                      warehouseId: 'new-warehouse'
                    });
                  } else {
                    // إرسال تحديث فوري عند تعديل المخزن
                    sendUpdate({
                      type: 'warehouse_update',
                      data: {
                        warehouseName: warehouse?.name || 'مخزن',
                        status: warehouse?.status || 'active',
                        message: 'تم تحديث بيانات المخزن'
                      },
                      userId: user?.id,
                      warehouseId: warehouse?.id
                    });
                  }
                  onClose();
                }}>
                  {mode === "add" ? "إضافة المخزن" : "حفظ التغييرات"}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="flex h-screen bg-background" dir="rtl">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {(isGeneralManager || isPurchasingManager) ? "إدارة المخازن" : "مخازني"}
                </h1>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                  {(isGeneralManager || isPurchasingManager) 
                    ? "إدارة وتتبع جميع المخازن والفروع" 
                    : "إدارة وتتبع المخازن المخصصة لك"
                  }
                </p>
                {isWarehouseManager && (
                  <div className="flex items-center mt-2 text-xs sm:text-sm text-blue-600">
                    <Shield className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                    مدير مخزن - صلاحيات محدودة
                  </div>
                )}
                {isPurchasingManager && (
                  <div className="flex items-center mt-2 text-xs sm:text-sm text-blue-600">
                    <Building2 className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                    مدير مشتريات - عرض جميع المخازن
                  </div>
                )}
              </div>
              {hasPermission(Permission.MANAGE_WAREHOUSES) && (
                <Button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 ml-2" />
                  <span className="hidden sm:inline">إضافة مخزن جديد</span>
                  <span className="sm:hidden">إضافة مخزن</span>
                </Button>
              )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                        {(isGeneralManager || isPurchasingManager) ? "إجمالي المخازن" : "مخازني"}
                      </p>
                      <p className="text-xl sm:text-2xl font-bold">{accessibleWarehouses.length}</p>
                    </div>
                    <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">المخازن النشطة</p>
                      <p className="text-xl sm:text-2xl font-bold text-green-600">
                        {accessibleWarehouses.filter(w => w.status === "active").length}
                      </p>
                    </div>
                    <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">إجمالي السعة</p>
                      <p className="text-xl sm:text-2xl font-bold">
                        {accessibleWarehouses.reduce((sum, w) => sum + w.capacity, 0).toLocaleString()}
                      </p>
                    </div>
                    <Package className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                        {(isGeneralManager || isPurchasingManager) ? "المخزون الحالي" : "السعة المستخدمة"}
                      </p>
                      {(isGeneralManager || isPurchasingManager) ? (
                        <p className="text-xl sm:text-2xl font-bold text-orange-600">
                          {accessibleWarehouses.reduce((sum, w) => sum + w.currentStock, 0).toLocaleString()}
                        </p>
                      ) : (
                        <p className="text-xl sm:text-2xl font-bold text-orange-600">
                          {Math.round((accessibleWarehouses.reduce((sum, w) => sum + w.currentStock, 0) / accessibleWarehouses.reduce((sum, w) => sum + w.capacity, 0)) * 100) || 0}%
                        </p>
                      )}
                    </div>
                    <Users className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Search */}
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 lg:col-span-1">
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="البحث في المخازن..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pr-10"
                      />
                    </div>
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="تصفية حسب الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="inactive">غير نشط</SelectItem>
                      <SelectItem value="maintenance">صيانة</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="تصفية حسب النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأنواع</SelectItem>
                      <SelectItem value="main">مخزن رئيسي</SelectItem>
                      <SelectItem value="branch">مخزن فرع</SelectItem>
                      <SelectItem value="storage">مخزن تخزين</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Warehouses Table */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  قائمة المخازن ({filteredWarehouses.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 sm:p-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>اسم المخزن</TableHead>
                        <TableHead>الموقع</TableHead>
                        <TableHead>المدير</TableHead>
                        <TableHead>النوع</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>السعة</TableHead>
                        <TableHead>المخزون الحالي</TableHead>
                        <TableHead>نسبة الاستخدام</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredWarehouses.map((warehouse) => {
                        const utilization = calculateUtilization(warehouse.currentStock, warehouse.capacity);
                        return (
                          <TableRow key={warehouse.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                {warehouse.name}
                                {utilization > 90 && (
                                  <AlertTriangle className="h-4 w-4 text-red-500" title="المخزن ممتلئ تقريباً" />
                                )}
                                {warehouse.status === "maintenance" && (
                                  <AlertTriangle className="h-4 w-4 text-yellow-500" title="المخزن تحت الصيانة" />
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                {warehouse.location}
                              </div>
                            </TableCell>
                            <TableCell>
                              {isGeneralManager ? warehouse.manager : (
                                <Badge variant="outline" className="text-blue-600">
                                  مخزنك
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{getTypeBadge(warehouse.type)}</TableCell>
                            <TableCell>{getStatusBadge(warehouse.status)}</TableCell>
                            <TableCell>{warehouse.capacity.toLocaleString()}</TableCell>
                            <TableCell>{warehouse.currentStock.toLocaleString()}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress 
                                  value={utilization} 
                                  className={`w-16 h-2 ${
                                    utilization > 90 ? 'text-red-500' : 
                                    utilization > 75 ? 'text-yellow-500' : 'text-green-500'
                                  }`} 
                                />
                                <span className={`text-sm ${
                                  utilization > 90 ? 'text-red-500 font-semibold' : 
                                  utilization > 75 ? 'text-yellow-500' : 'text-muted-foreground'
                                }`}>
                                  {utilization}%
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedWarehouse(warehouse);
                                      setIsViewDialogOpen(true);
                                    }}
                                  >
                                    <Eye className="w-4 h-4 ml-2" />
                                    عرض التفاصيل
                                  </DropdownMenuItem>
                                  {(hasPermission(Permission.MANAGE_WAREHOUSES) || 
                                    (isWarehouseManager && user?.assignedWarehouses?.some(w => w.id === warehouse.id))) && (
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedWarehouse(warehouse);
                                        setIsEditDialogOpen(true);
                                      }}
                                    >
                                      <Edit className="w-4 h-4 ml-2" />
                                      تعديل
                                    </DropdownMenuItem>
                                  )}
                                  {hasPermission(Permission.MANAGE_WAREHOUSES) && (
                                    <DropdownMenuItem className="text-red-600">
                                      <Trash2 className="w-4 h-4 ml-2" />
                                      حذف
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Dialogs */}
      <WarehouseDialog
        warehouse={null}
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        mode="add"
      />
      <WarehouseDialog
        warehouse={selectedWarehouse}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedWarehouse(null);
        }}
        mode="edit"
      />
      <WarehouseDialog
        warehouse={selectedWarehouse}
        isOpen={isViewDialogOpen}
        onClose={() => {
          setIsViewDialogOpen(false);
          setSelectedWarehouse(null);
        }}
        mode="view"
      />
    </div>
  );
};

export default Warehouses;