import { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Package, AlertTriangle, Download, Upload, Eye, BarChart3, TrendingUp, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/navigation/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Permission, UserRole } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  subcategory?: string;
  warehouse: string;
  quantity: number;
  minStock: number;
  purchasePrice: number;
  salePrice: number;
  unitPrice: number;
  totalValue: number;
  supplier?: string;
  brand?: string;
  description?: string;
  status: "in-stock" | "low-stock" | "out-of-stock";
  lastUpdated: string;
  profitMargin?: number;
}

const Products = () => {
  const navigate = useNavigate();
  const { hasPermission, user, hasRole } = useAuth();
  
  // التحقق من الأدوار
  const isGeneralManager = user?.role === UserRole.GENERAL_MANAGER;
  const isWarehouseManager = user?.role === UserRole.WAREHOUSE_MANAGER;
  const isPurchasingManager = user?.role === UserRole.PURCHASING_MANAGER;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedSupplier, setSelectedSupplier] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    category: "",
    subcategory: "",
    warehouse: "",
    quantity: 0,
    purchasePrice: 0,
    salePrice: 0,
    supplier: "",
    brand: "",
    description: ""
  });

  // ربط معرفات المخازن بأسمائها
  const warehouseIdToName: Record<string, string> = {
    'warehouse_1': 'المخزن الرئيسي',
    'warehouse_2': 'المخزن المسطح',
    'warehouse_3': 'مخزن الدرفلة',
    'warehouse_4': 'مخزن ستيل',
    'warehouse_5': 'مخزن العربية للأسمنت',
    'warehouse_6': 'مخزن غبور'
  };

  // الحصول على اسم المخزن المخصص لمدير المخزن
  const getUserWarehouseName = (): string | null => {
    if (user?.role === UserRole.WAREHOUSE_MANAGER && user?.warehouseId) {
      return warehouseIdToName[user.warehouseId] || null;
    }
    return null;
  };

  const products: Product[] = [
    {
      id: "1",
      name: "لابتوب ديل XPS 13",
      sku: "DELL-XPS-001",
      category: "إلكترونيات",
      subcategory: "أجهزة كمبيوتر",
      warehouse: "المخزن الرئيسي",
      quantity: 25,
      minStock: 10,
      purchasePrice: 22000,
      salePrice: 28000,
      unitPrice: 25000,
      totalValue: 625000,
      supplier: "شركة التكنولوجيا المتقدمة",
      brand: "Dell",
      description: "لابتوب عالي الأداء مع معالج Intel Core i7",
      status: "in-stock",
      lastUpdated: "2024-01-15",
      profitMargin: 27.3
    },
    {
      id: "2",
      name: "هاتف آيفون 15",
      sku: "APPLE-IP15-001",
      category: "إلكترونيات",
      subcategory: "هواتف ذكية",
      warehouse: "المخزن المسطح",
      quantity: 5,
      minStock: 15,
      purchasePrice: 42000,
      salePrice: 48000,
      unitPrice: 45000,
      totalValue: 225000,
      supplier: "موزع أبل المعتمد",
      brand: "Apple",
      description: "أحدث إصدار من هواتف آيفون بكاميرا محسنة",
      status: "low-stock",
      lastUpdated: "2024-01-14",
      profitMargin: 14.3
    },
    {
      id: "3",
      name: "كرسي مكتب مريح",
      sku: "CHAIR-ERG-001",
      category: "أثاث مكتبي",
      subcategory: "كراسي",
      warehouse: "مخزن الدرفلة",
      quantity: 0,
      minStock: 5,
      purchasePrice: 2800,
      salePrice: 4200,
      unitPrice: 3500,
      totalValue: 0,
      supplier: "مصنع الأثاث الحديث",
      brand: "ErgoMax",
      description: "كرسي مكتب بتصميم مريح ودعم قطني",
      status: "out-of-stock",
      lastUpdated: "2024-01-13",
      profitMargin: 50.0
    },
    {
      id: "4",
      name: "طابعة HP LaserJet",
      sku: "HP-LJ-001",
      category: "إلكترونيات",
      subcategory: "طابعات",
      warehouse: "مخزن ستيل",
      quantity: 12,
      minStock: 8,
      purchasePrice: 7200,
      salePrice: 9800,
      unitPrice: 8500,
      totalValue: 102000,
      supplier: "شركة المعدات المكتبية",
      brand: "HP",
      description: "طابعة ليزر عالية السرعة للاستخدام المكتبي",
      status: "in-stock",
      lastUpdated: "2024-01-12",
      profitMargin: 36.1
    },
    {
      id: "5",
      name: "حديد تسليح 12 مم",
      sku: "STEEL-RB-12",
      category: "مواد بناء",
      subcategory: "حديد تسليح",
      warehouse: "مخزن ستيل",
      quantity: 500,
      minStock: 100,
      purchasePrice: 18,
      salePrice: 22,
      unitPrice: 20,
      totalValue: 10000,
      supplier: "مصانع الحديد والصلب",
      brand: "عز الدخيلة",
      description: "حديد تسليح عالي الجودة قطر 12 مم",
      status: "in-stock",
      lastUpdated: "2024-01-16",
      profitMargin: 22.2
    },
    {
      id: "6",
      name: "أسمنت بورتلاندي",
      sku: "CEMENT-PORT-50",
      category: "مواد بناء",
      subcategory: "أسمنت",
      warehouse: "مخزن العربية للأسمنت",
      quantity: 200,
      minStock: 50,
      purchasePrice: 180,
      salePrice: 220,
      unitPrice: 200,
      totalValue: 40000,
      supplier: "العربية للأسمنت",
      brand: "العربية",
      description: "أسمنت بورتلاندي عادي كيس 50 كجم",
      status: "in-stock",
      lastUpdated: "2024-01-16",
      profitMargin: 22.2
    }
  ];

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "اسم المنتج,رمز SKU,الفئة,المخزن,الكمية,الحد الأدنى,سعر الوحدة,القيمة الإجمالية,الحالة,آخر تحديث\n" +
      filteredProducts.map(product => 
        `${product.name},${product.sku},${product.category},${product.warehouse},${product.quantity},${product.minStock},${product.unitPrice},${product.totalValue},${product.status},${product.lastUpdated}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "products.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // تصفية المنتجات حسب دور المستخدم
  const getAccessibleProducts = () => {
    if (user?.role === UserRole.WAREHOUSE_MANAGER) {
      const userWarehouseName = getUserWarehouseName();
      if (userWarehouseName) {
        // مدير المخزن يرى منتجات مخزنه فقط
        return products.filter(product => product.warehouse === userWarehouseName);
      }
      return [];
    }
    // المدير العام ومدير المشتريات يرون جميع المنتجات
    return products;
  };

  const accessibleProducts = getAccessibleProducts();

  const filteredProducts = accessibleProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWarehouse = selectedWarehouse === "all" || product.warehouse === selectedWarehouse;
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || product.status === selectedStatus;
    const matchesSupplier = selectedSupplier === "all" || product.supplier === selectedSupplier;
    
    return matchesSearch && matchesWarehouse && matchesCategory && matchesStatus && matchesSupplier;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-stock":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">متوفر</Badge>;
      case "low-stock":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">مخزون منخفض</Badge>;
      case "out-of-stock":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">نفد المخزون</Badge>;
      default:
        return <Badge>غير محدد</Badge>;
    }
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
              <h1 className="text-3xl font-bold text-foreground">إدارة المنتجات</h1>
              <p className="text-muted-foreground">
                {isWarehouseManager 
                  ? "تتبع وإدارة منتجات مخزنك" 
                  : "تتبع وإدارة جميع المنتجات في جميع المخازن"
                }
              </p>
              {isPurchasingManager && (
                <div className="flex items-center gap-2 mt-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-600 font-medium">مدير مشتريات - عرض جميع المنتجات</span>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              {hasPermission(Permission.MANAGE_PRODUCTS) && (
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90">
                      <Plus className="w-4 h-4 ml-2" />
                      إضافة منتج جديد
                    </Button>
                  </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>إضافة منتج جديد</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="product-name">اسم المنتج</Label>
                      <Input 
                        id="product-name" 
                        placeholder="أدخل اسم المنتج" 
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="product-sku">رمز SKU</Label>
                      <Input 
                        id="product-sku" 
                        placeholder="أدخل رمز SKU" 
                        value={newProduct.sku}
                        onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="product-category">الفئة</Label>
                      <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الفئة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="إلكترونيات">إلكترونيات</SelectItem>
                          <SelectItem value="أثاث مكتبي">أثاث مكتبي</SelectItem>
                          <SelectItem value="مواد بناء">مواد بناء</SelectItem>
                          <SelectItem value="عدة">عدة</SelectItem>
                          <SelectItem value="مستهلكات">مستهلكات</SelectItem>
                          <SelectItem value="خامات">خامات</SelectItem>
                          <SelectItem value="أصول ثابتة">أصول ثابتة</SelectItem>
                          <SelectItem value="ملابس">ملابس</SelectItem>
                          <SelectItem value="كتب">كتب</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="product-subcategory">الفئة الفرعية</Label>
                      <Input 
                        id="product-subcategory" 
                        placeholder="أدخل الفئة الفرعية" 
                        value={newProduct.subcategory}
                        onChange={(e) => setNewProduct({...newProduct, subcategory: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="product-warehouse">المخزن</Label>
                      <Select value={newProduct.warehouse} onValueChange={(value) => setNewProduct({...newProduct, warehouse: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المخزن" />
                        </SelectTrigger>
                        <SelectContent>
                          {user?.role === UserRole.WAREHOUSE_MANAGER ? (
                            // مدير المخزن يرى مخزنه فقط
                            getUserWarehouseName() && (
                              <SelectItem value={getUserWarehouseName()!}>{getUserWarehouseName()}</SelectItem>
                            )
                          ) : (
                            // المدير العام ومدير المشتريات يرون جميع المخازن
                            <>
                              <SelectItem value="المخزن الرئيسي">المخزن الرئيسي</SelectItem>
                              <SelectItem value="المخزن المسطح">المخزن المسطح</SelectItem>
                              <SelectItem value="مخزن الدرفلة">مخزن الدرفلة</SelectItem>
                              <SelectItem value="مخزن ستيل">مخزن ستيل</SelectItem>
                              <SelectItem value="مخزن العربية للأسمنت">مخزن العربية للأسمنت</SelectItem>
                              <SelectItem value="مخزن غبور">مخزن غبور</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    {hasPermission(Permission.VIEW_SUPPLIER_INFO) && (
                      <div className="grid gap-2">
                        <Label htmlFor="product-supplier">المورد</Label>
                        <Input 
                          id="product-supplier" 
                          placeholder="أدخل اسم المورد" 
                          value={newProduct.supplier}
                          onChange={(e) => setNewProduct({...newProduct, supplier: e.target.value})}
                        />
                      </div>
                    )}
                    <div className="grid gap-2">
                      <Label htmlFor="product-brand">العلامة التجارية</Label>
                      <Input 
                        id="product-brand" 
                        placeholder="أدخل العلامة التجارية" 
                        value={newProduct.brand}
                        onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="product-quantity">الكمية</Label>
                      <Input 
                        id="product-quantity" 
                        type="number" 
                        placeholder="أدخل الكمية" 
                        value={newProduct.quantity}
                        onChange={(e) => setNewProduct({...newProduct, quantity: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    {hasPermission(Permission.VIEW_PURCHASE_PRICES) && (
                      <div className="grid gap-2">
                        <Label htmlFor="product-purchase-price">سعر الشراء</Label>
                        <Input 
                          id="product-purchase-price" 
                          type="number" 
                          placeholder="أدخل سعر الشراء" 
                          value={newProduct.purchasePrice}
                          onChange={(e) => setNewProduct({...newProduct, purchasePrice: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                    )}
                    {hasPermission(Permission.VIEW_SALE_PRICES) && (
                      <div className="grid gap-2">
                        <Label htmlFor="product-sale-price">سعر البيع</Label>
                        <Input 
                          id="product-sale-price" 
                          type="number" 
                          placeholder="أدخل سعر البيع" 
                          value={newProduct.salePrice}
                          onChange={(e) => setNewProduct({...newProduct, salePrice: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                    )}
                    <div className="grid gap-2">
                      <Label htmlFor="product-description">الوصف</Label>
                      <Textarea 
                        id="product-description" 
                        placeholder="أدخل وصف المنتج" 
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => {
                      setIsAddDialogOpen(false);
                      setNewProduct({
                        name: "",
                        sku: "",
                        category: "",
                        subcategory: "",
                        warehouse: "",
                        quantity: 0,
                        purchasePrice: 0,
                        salePrice: 0,
                        supplier: "",
                        brand: "",
                        description: ""
                      });
                    }}>
                      إلغاء
                    </Button>
                    <Button onClick={() => {
                      // هنا يمكن إضافة منطق حفظ المنتج
                      console.log('إضافة منتج جديد:', newProduct);
                      setIsAddDialogOpen(false);
                      setNewProduct({
                        name: "",
                        sku: "",
                        category: "",
                        subcategory: "",
                        warehouse: "",
                        quantity: 0,
                        purchasePrice: 0,
                        salePrice: 0,
                        supplier: "",
                        brand: "",
                        description: ""
                      });
                    }}>
                      إضافة المنتج
                    </Button>
                  </div>
                </DialogContent>
                </Dialog>
              )}
              
              {(hasPermission(Permission.VIEW_ALL_PRODUCTS) || hasPermission(Permission.MANAGE_PRODUCTS)) && (
                <Button variant="outline" onClick={handleExport}>
                  <Download className="w-4 h-4 ml-2" />
                  تصدير البيانات
                </Button>
              )}
              
              {hasPermission(Permission.MANAGE_PRODUCTS) && (
                <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Upload className="w-4 h-4 ml-2" />
                      استيراد البيانات
                    </Button>
                  </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>استيراد المنتجات</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="file">اختر ملف CSV</Label>
                      <Input id="file" type="file" accept=".csv" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>تأكد من أن الملف يحتوي على الأعمدة التالية:</p>
                      <ul className="list-disc list-inside mt-2">
                        <li>اسم المنتج</li>
                        <li>رمز SKU</li>
                        <li>الفئة</li>
                        <li>المخزن</li>
                        <li>الكمية</li>
                        <li>سعر الوحدة</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                      إلغاء
                    </Button>
                    <Button onClick={() => setIsImportDialogOpen(false)}>
                      استيراد
                    </Button>
                  </div>
                </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">إجمالي المنتجات</p>
                    <p className="text-2xl font-bold">1,245</p>
                  </div>
                  <Package className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            {hasPermission(Permission.VIEW_TOTAL_VALUES) && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">قيمة المخزون</p>
                      <p className="text-2xl font-bold">2.8M ج.م</p>
                    </div>
                    <Package className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">مخزون منخفض</p>
                    <p className="text-2xl font-bold text-yellow-600">23</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">نفد المخزون</p>
                    <p className="text-2xl font-bold text-red-600">5</p>
                  </div>
                  <Package className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="البحث عن منتج أو رمز SKU..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10"
                    />
                  </div>
                </div>
                <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="اختر المخزن" />
                  </SelectTrigger>
                  <SelectContent>
                    {user?.role === UserRole.WAREHOUSE_MANAGER ? (
                      // مدير المخزن يرى مخزنه فقط
                      getUserWarehouseName() && (
                        <SelectItem value={getUserWarehouseName()!}>{getUserWarehouseName()}</SelectItem>
                      )
                    ) : (
                      // المدير العام ومدير المشتريات يرون جميع المخازن
                      <>
                        <SelectItem value="all">جميع المخازن</SelectItem>
                        <SelectItem value="المخزن الرئيسي">المخزن الرئيسي</SelectItem>
                        <SelectItem value="المخزن المسطح">المخزن المسطح</SelectItem>
                        <SelectItem value="مخزن الدرفلة">مخزن الدرفلة</SelectItem>
                        <SelectItem value="مخزن ستيل">مخزن ستيل</SelectItem>
                        <SelectItem value="مخزن العربية للأسمنت">مخزن العربية للأسمنت</SelectItem>
                        <SelectItem value="مخزن غبور">مخزن غبور</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الفئات</SelectItem>
                    <SelectItem value="إلكترونيات">إلكترونيات</SelectItem>
                    <SelectItem value="أثاث مكتبي">أثاث مكتبي</SelectItem>
                    <SelectItem value="مواد بناء">مواد بناء</SelectItem>
                    <SelectItem value="عدة">عدة</SelectItem>
                    <SelectItem value="مستهلكات">مستهلكات</SelectItem>
                    <SelectItem value="خامات">خامات</SelectItem>
                    <SelectItem value="أصول ثابتة">أصول ثابتة</SelectItem>
                    <SelectItem value="ملابس">ملابس</SelectItem>
                    <SelectItem value="كتب">كتب</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="in-stock">متوفر</SelectItem>
                    <SelectItem value="low-stock">مخزون منخفض</SelectItem>
                    <SelectItem value="out-of-stock">نفد المخزون</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedSupplier || "all"} onValueChange={setSelectedSupplier}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر المورد" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الموردين</SelectItem>
                    <SelectItem value="شركة التكنولوجيا المتقدمة">شركة التكنولوجيا المتقدمة</SelectItem>
                    <SelectItem value="موزع أبل المعتمد">موزع أبل المعتمد</SelectItem>
                    <SelectItem value="مصنع الأثاث الحديث">مصنع الأثاث الحديث</SelectItem>
                    <SelectItem value="شركة المعدات المكتبية">شركة المعدات المكتبية</SelectItem>
                    <SelectItem value="مصانع الحديد والصلب">مصانع الحديد والصلب</SelectItem>
                    <SelectItem value="العربية للأسمنت">العربية للأسمنت</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedWarehouse("all");
                    setSelectedCategory("all");
                    setSelectedStatus("all");
                    setSelectedSupplier("all");
                  }}
                >
                  <Filter className="w-4 h-4 ml-2" />
                  مسح الفلاتر
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Products Table */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">قائمة المنتجات</CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم المنتج</TableHead>
                    <TableHead>رمز SKU</TableHead>
                    <TableHead>الفئة</TableHead>
                    {hasPermission(Permission.VIEW_SUPPLIER_INFO) && <TableHead>المورد</TableHead>}
                    <TableHead>المخزن</TableHead>
                    <TableHead>الكمية</TableHead>
                    {hasPermission(Permission.VIEW_PURCHASE_PRICES) && <TableHead>سعر الشراء</TableHead>}
                    {hasPermission(Permission.VIEW_SALE_PRICES) && <TableHead>سعر البيع</TableHead>}
                    {hasPermission(Permission.VIEW_PROFIT_MARGINS) && <TableHead>هامش الربح</TableHead>}
                    {hasPermission(Permission.VIEW_TOTAL_VALUES) && <TableHead>القيمة الإجمالية</TableHead>}
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProducts.map((product) => {
                    const isLowStock = product.quantity <= product.minStock && product.quantity > 0;
                    const isOutOfStock = product.quantity === 0;
                    
                    return (
                      <TableRow key={product.id} className={isOutOfStock ? "bg-red-50" : isLowStock ? "bg-yellow-50" : ""}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-semibold">{product.name}</div>
                            {product.brand && <div className="text-sm text-muted-foreground">{product.brand}</div>}
                          </div>
                        </TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{product.category}</div>
                            {product.subcategory && <div className="text-sm text-muted-foreground">{product.subcategory}</div>}
                          </div>
                        </TableCell>
                        {hasPermission(Permission.VIEW_SUPPLIER_INFO) && (
                          <TableCell className="text-sm">{product.supplier || '-'}</TableCell>
                        )}
                        <TableCell>{product.warehouse}</TableCell>
                        <TableCell className={isOutOfStock ? "text-red-600 font-bold" : isLowStock ? "text-yellow-600 font-bold" : ""}>
                          {product.quantity.toLocaleString()}
                        </TableCell>
                        {hasPermission(Permission.VIEW_PURCHASE_PRICES) && (
                          <TableCell className="text-green-700 font-medium">{product.purchasePrice.toLocaleString()} ج.م</TableCell>
                        )}
                        {hasPermission(Permission.VIEW_SALE_PRICES) && (
                          <TableCell className="text-blue-700 font-medium">{product.salePrice.toLocaleString()} ج.م</TableCell>
                        )}
                        {hasPermission(Permission.VIEW_PROFIT_MARGINS) && (
                          <TableCell>
                            <Badge variant={product.profitMargin && product.profitMargin > 20 ? "default" : "secondary"} className="text-xs">
                              {product.profitMargin?.toFixed(1)}%
                            </Badge>
                          </TableCell>
                        )}
                        {hasPermission(Permission.VIEW_TOTAL_VALUES) && (
                          <TableCell>{product.totalValue.toLocaleString()} ج.م</TableCell>
                        )}
                        <TableCell>{getStatusBadge(product.status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="ml-2 h-4 w-4" />
                                عرض التفاصيل
                              </DropdownMenuItem>
                              {hasPermission(Permission.MANAGE_PRODUCTS) && (
                                <DropdownMenuItem>
                                  <Edit className="ml-2 h-4 w-4" />
                                  تعديل
                                </DropdownMenuItem>
                              )}
                              {(hasPermission(Permission.VIEW_WAREHOUSE_REPORTS) || hasPermission(Permission.VIEW_PURCHASE_REPORTS)) && (
                                <DropdownMenuItem>
                                  <BarChart3 className="ml-2 h-4 w-4" />
                                  التقارير
                                </DropdownMenuItem>
                              )}
                              {hasPermission(Permission.MANAGE_PRODUCTS) && (
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="ml-2 h-4 w-4" />
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
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 p-4 sm:p-0">
                  <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-right">
                    عرض {((currentPage - 1) * itemsPerPage) + 1} إلى {Math.min(currentPage * itemsPerPage, filteredProducts.length)} من {filteredProducts.length} منتج
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      السابق
                    </Button>
                    <span className="text-xs sm:text-sm whitespace-nowrap">
                      الصفحة {currentPage} من {totalPages}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      التالي
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Products;