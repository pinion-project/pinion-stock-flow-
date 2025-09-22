import { useState } from "react";
import { ArrowRightLeft, TrendingUp, TrendingDown, Package, Search, Calendar, Filter, Plus, Minus, Download, Eye, BarChart3, Shield, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/navigation/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useRealtime } from "@/contexts/RealtimeContext";
import { UserRole, Permission } from "@/types/auth";
import RealtimeUpdates from "@/components/realtime/RealtimeUpdates";
import AlertPanel from "@/components/alerts/AlertPanel";

interface InventoryMovement {
  id: string;
  type: "in" | "out" | "transfer";
  productName: string;
  sku: string;
  quantity: number;
  fromWarehouse?: string;
  toWarehouse?: string;
  warehouse?: string;
  unitPrice: number;
  totalValue: number;
  reason: string;
  date: string;
  time: string;
  performedBy: string;
  status: "completed" | "pending" | "cancelled";
}

const Inventory = () => {
  const navigate = useNavigate();
  const { user, hasPermission, hasRole } = useAuth();
  const { sendUpdate } = useRealtime();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedWarehouse, setSelectedWarehouse] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [isInDialogOpen, setIsInDialogOpen] = useState(false);
  const [isOutDialogOpen, setIsOutDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Role checks
  const isGeneralManager = hasRole(UserRole.GENERAL_MANAGER);
  const isWarehouseManager = hasRole(UserRole.WAREHOUSE_MANAGER);
  const isPurchasingManager = hasRole(UserRole.PURCHASING_MANAGER);

  // Mock inventory movements data
  const allInventoryMovements: InventoryMovement[] = [
    {
      id: "1",
      type: "in",
      productName: "حديد تسليح 12 مم",
      sku: "STEEL-12MM-001",
      quantity: 500,
      warehouse: "المخزن الرئيسي",
      unitPrice: 15.5,
      totalValue: 7750,
      reason: "شراء جديد",
      date: "2024-01-15",
      time: "10:30",
      performedBy: "أحمد محمد",
      status: "completed"
    },
    {
      id: "2",
      type: "out",
      productName: "أسمنت بورتلاندي",
      sku: "CEMENT-PORT-001",
      quantity: 200,
      warehouse: "مخزن العربية للأسمنت",
      unitPrice: 120,
      totalValue: 24000,
      reason: "بيع للعميل",
      date: "2024-01-15",
      time: "14:20",
      performedBy: "فاطمة علي",
      status: "completed"
    },
    {
      id: "3",
      type: "transfer",
      productName: "صاج مجلفن 2 مم",
      sku: "SHEET-GALV-2MM",
      quantity: 100,
      fromWarehouse: "المخزن المسطح",
      toWarehouse: "مخزن الدرفلة",
      unitPrice: 85,
      totalValue: 8500,
      reason: "إعادة توزيع المخزون",
      date: "2024-01-14",
      time: "16:45",
      performedBy: "محمد حسن",
      status: "pending"
    },
    {
      id: "4",
      type: "in",
      productName: "أنابيب PVC 4 بوصة",
      sku: "PVC-PIPE-4IN",
      quantity: 300,
      warehouse: "مخزن ستيل",
      unitPrice: 25,
      totalValue: 7500,
      reason: "توريد جديد",
      date: "2024-01-14",
      time: "09:15",
      performedBy: "سارة أحمد",
      status: "completed"
    },
    {
      id: "5",
      type: "out",
      productName: "كابلات كهربائية 2.5 مم",
      sku: "CABLE-ELEC-2.5",
      quantity: 150,
      warehouse: "مخزن غبور",
      unitPrice: 12,
      totalValue: 1800,
      reason: "مشروع إنشائي",
      date: "2024-01-13",
      time: "11:30",
      performedBy: "خالد محمود",
      status: "completed"
    }
  ];

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

  // Filter inventory movements based on user role and selected filters
  const getFilteredMovements = () => {
    let filteredMovements = allInventoryMovements;

    // Filter by user role
    if (isWarehouseManager) {
      const warehouseMapping: { [key: string]: string } = {
        'warehouse_manager_1': 'المخزن الرئيسي',
        'warehouse_manager_2': 'المخزن المسطح',
        'warehouse_manager_3': 'مخزن الدرفلة',
        'warehouse_manager_4': 'مخزن ستيل',
        'warehouse_manager_5': 'مخزن العربية للأسمنت',
        'warehouse_manager_6': 'مخزن غبور'
      };
      
      const userWarehouse = warehouseMapping[user?.username || ''];
      if (userWarehouse) {
        filteredMovements = filteredMovements.filter(movement => 
          movement.warehouse === userWarehouse || 
          movement.fromWarehouse === userWarehouse || 
          movement.toWarehouse === userWarehouse
        );
      }
    }
    // General Manager and Purchasing Manager see all movements

    // Apply other filters
    if (selectedWarehouse !== 'all') {
      filteredMovements = filteredMovements.filter(movement => 
        movement.warehouse === selectedWarehouse ||
        movement.fromWarehouse === selectedWarehouse ||
        movement.toWarehouse === selectedWarehouse
      );
    }

    if (selectedType !== 'all') {
      filteredMovements = filteredMovements.filter(movement => movement.type === selectedType);
    }

    if (selectedStatus !== 'all') {
      filteredMovements = filteredMovements.filter(movement => movement.status === selectedStatus);
    }

    if (searchTerm) {
      filteredMovements = filteredMovements.filter(movement => 
        movement.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movement.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredMovements;
  };

  const filteredMovements = getFilteredMovements();
  const accessibleWarehouses = getAccessibleWarehouses();

  // Calculate statistics based on filtered movements
  const totalIn = filteredMovements
    .filter(m => m.type === 'in' && m.status === 'completed')
    .reduce((sum, m) => sum + m.totalValue, 0);
  
  const totalOut = filteredMovements
    .filter(m => m.type === 'out' && m.status === 'completed')
    .reduce((sum, m) => sum + m.totalValue, 0);
  
  const pendingTransfers = filteredMovements
    .filter(m => m.type === 'transfer' && m.status === 'pending').length;

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6">
          <RealtimeUpdates />
          <AlertPanel />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                {isGeneralManager || isPurchasingManager ? "إدارة المخزون" : "مخزوني"}
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                {isGeneralManager || isPurchasingManager
                  ? "تتبع حركة المنتجات والمخزون في جميع المخازن" 
                  : "تتبع حركة المنتجات في مخازنك"
                }
              </p>
              {isWarehouseManager && (
                <div className="flex items-center mt-2 text-xs sm:text-sm text-blue-600">
                  <Shield className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                  مدير مخزن - عرض مخازنك فقط
                </div>
              )}
              {isPurchasingManager && (
                <div className="flex items-center mt-2 text-xs sm:text-sm text-green-600">
                  <Shield className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                  مدير مشتريات - عرض جميع المخازن
                </div>
              )}
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" className="flex-1 sm:flex-none">
                <Download className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                <span className="hidden sm:inline">تصدير</span>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">إجمالي الداخل</p>
                    <p className="text-lg sm:text-2xl font-bold text-success">{totalIn.toLocaleString()} ج.م</p>
                  </div>
                  <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-success" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">إجمالي الخارج</p>
                    <p className="text-lg sm:text-2xl font-bold text-destructive">{totalOut.toLocaleString()} ج.م</p>
                  </div>
                  <TrendingDown className="h-6 w-6 sm:h-8 sm:w-8 text-destructive" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">الصافي</p>
                    <p className="text-lg sm:text-2xl font-bold text-success">{(totalIn - totalOut).toLocaleString()} ج.م</p>
                  </div>
                  <Package className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">عمليات نقل معلقة</p>
                    <p className="text-lg sm:text-2xl font-bold text-warning">{pendingTransfers}</p>
                  </div>
                  <ArrowRightLeft className="h-6 w-6 sm:h-8 sm:w-8 text-warning" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-4 sm:mb-6">
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="sm:col-span-2 lg:col-span-1">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="البحث عن منتج أو رمز SKU..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10"
                    />
                  </div>
                </div>
                <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر المخزن" />
                  </SelectTrigger>
                  <SelectContent>
                    {accessibleWarehouses.map(warehouse => (
                      <SelectItem key={warehouse.id} value={warehouse.id === 'all' ? 'all' : warehouse.name}>
                        {warehouse.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="نوع العملية" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع العمليات</SelectItem>
                    <SelectItem value="in">داخل</SelectItem>
                    <SelectItem value="out">خارج</SelectItem>
                    <SelectItem value="transfer">نقل</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="completed">مكتملة</SelectItem>
                    <SelectItem value="pending">معلقة</SelectItem>
                    <SelectItem value="cancelled">ملغية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Table */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">حركة المخزون ({filteredMovements.length} عملية)</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {filteredMovements.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">نوع العملية</TableHead>
                        <TableHead className="text-xs sm:text-sm">المنتج</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden sm:table-cell">رمز SKU</TableHead>
                        <TableHead className="text-xs sm:text-sm">الكمية</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden md:table-cell">المخزن</TableHead>
                        <TableHead className="text-xs sm:text-sm">القيمة الإجمالية</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden lg:table-cell">السبب</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden md:table-cell">التاريخ</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden lg:table-cell">المنفذ</TableHead>
                        <TableHead className="text-xs sm:text-sm">الحالة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMovements.map((movement) => (
                        <TableRow key={movement.id}>
                          <TableCell>
                            <Badge 
                              variant={movement.type === 'in' ? 'default' : movement.type === 'out' ? 'destructive' : 'secondary'}
                              className="text-xs"
                            >
                              {movement.type === 'in' ? 'داخل' : movement.type === 'out' ? 'خارج' : 'نقل'}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium text-xs sm:text-sm">
                            <div className="truncate max-w-[120px] sm:max-w-none">{movement.productName}</div>
                            <div className="text-xs text-muted-foreground sm:hidden">{movement.sku}</div>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs sm:text-sm hidden sm:table-cell">{movement.sku}</TableCell>
                          <TableCell className="text-xs sm:text-sm">{movement.quantity.toLocaleString()}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {movement.type === 'transfer' ? (
                              <div className="text-xs">
                                <div>من: {movement.fromWarehouse}</div>
                                <div>إلى: {movement.toWarehouse}</div>
                              </div>
                            ) : (
                              <div className="text-xs">{movement.warehouse}</div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium text-xs sm:text-sm">{movement.totalValue.toLocaleString()} ج.م</TableCell>
                          <TableCell className="text-xs text-muted-foreground hidden lg:table-cell">{movement.reason}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="text-xs">
                              <div>{movement.date}</div>
                              <div className="text-muted-foreground">{movement.time}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs hidden lg:table-cell">{movement.performedBy}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={movement.status === 'completed' ? 'default' : movement.status === 'pending' ? 'secondary' : 'destructive'}
                              className="text-xs"
                            >
                              {movement.status === 'completed' ? 'مكتملة' : movement.status === 'pending' ? 'معلقة' : 'ملغية'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">لا توجد حركات مخزون تطابق المعايير المحددة</p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Inventory;