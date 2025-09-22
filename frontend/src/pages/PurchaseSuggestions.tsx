import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, ShoppingCart, TrendingUp, AlertTriangle, Plus, Eye, FileText, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Permission, UserRole } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

interface PurchaseSuggestion {
  id: string;
  productName: string;
  sku: string;
  category: string;
  warehouse: string;
  currentStock: number;
  minStock: number;
  suggestedQuantity: number;
  lastSaleRate: number; // وحدات في اليوم
  daysUntilStockout: number;
  supplier: string;
  unitPrice: number;
  totalCost: number;
  priority: "high" | "medium" | "low";
  reason: string;
}

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplier: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  totalAmount: number;
  status: "draft" | "pending" | "approved" | "ordered";
  createdAt: string;
  notes: string;
}

const PurchaseSuggestions: React.FC = () => {
  const navigate = useNavigate();
  const { hasPermission, user } = useAuth();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");

  // Check user roles
  const isGeneralManager = user?.role === UserRole.GENERAL_MANAGER;
  const isWarehouseManager = user?.role === UserRole.WAREHOUSE_MANAGER;
  const isPurchasingManager = user?.role === UserRole.PURCHASING_MANAGER;

  const suggestions: PurchaseSuggestion[] = [
    {
      id: "1",
      productName: "لابتوب ديل XPS 13",
      sku: "DELL-XPS13-001",
      category: "إلكترونيات",
      warehouse: "المخزن الرئيسي",
      currentStock: 2,
      minStock: 5,
      suggestedQuantity: 10,
      lastSaleRate: 0.8,
      daysUntilStockout: 3,
      supplier: "شركة التكنولوجيا المتقدمة",
      unitPrice: 25000,
      totalCost: 250000,
      priority: "high",
      reason: "مخزون منخفض - معدل بيع عالي"
    },
    {
      id: "2",
      productName: "كرسي مكتب مريح",
      sku: "CHAIR-ERG-001",
      category: "أثاث مكتبي",
      warehouse: "المخزن المسطح",
      currentStock: 8,
      minStock: 15,
      suggestedQuantity: 20,
      lastSaleRate: 1.2,
      daysUntilStockout: 7,
      supplier: "مصنع الأثاث الحديث",
      unitPrice: 1500,
      totalCost: 30000,
      priority: "medium",
      reason: "تحت الحد الأدنى - طلب متزايد"
    },
    {
      id: "3",
      productName: "حديد تسليح 12 مم",
      sku: "STEEL-12MM-001",
      category: "مواد بناء",
      warehouse: "مخزن الدرفلة",
      currentStock: 50,
      minStock: 100,
      suggestedQuantity: 200,
      lastSaleRate: 15,
      daysUntilStockout: 4,
      supplier: "مصانع الحديد والصلب",
      unitPrice: 800,
      totalCost: 160000,
      priority: "high",
      reason: "مخزون حرج - معدل استهلاك عالي"
    },
    {
      id: "4",
      productName: "أسمنت بورتلاندي",
      sku: "CEMENT-PORT-001",
      category: "مواد بناء",
      warehouse: "مخزن العربية للأسمنت",
      currentStock: 25,
      minStock: 50,
      suggestedQuantity: 100,
      lastSaleRate: 8,
      daysUntilStockout: 3,
      supplier: "العربية للأسمنت",
      unitPrice: 120,
      totalCost: 12000,
      priority: "high",
      reason: "مخزون منخفض جداً"
    },
    {
      id: "5",
      productName: "طابعة HP LaserJet",
      sku: "HP-LJ-P1102",
      category: "إلكترونيات",
      warehouse: "المخزن الرئيسي",
      currentStock: 12,
      minStock: 10,
      suggestedQuantity: 15,
      lastSaleRate: 0.5,
      daysUntilStockout: 24,
      supplier: "شركة التكنولوجيا المتقدمة",
      unitPrice: 3500,
      totalCost: 52500,
      priority: "low",
      reason: "إعادة تخزين وقائية"
    }
  ];

  // Filter suggestions based on user role
  const getAccessibleSuggestions = () => {
    if (isWarehouseManager) {
      // Warehouse managers see suggestions for their assigned warehouse only
      const warehouseMapping: { [key: string]: string } = {
        'warehouse_manager_1': 'المخزن الرئيسي',
        'warehouse_manager_2': 'المخزن المسطح',
        'warehouse_manager_3': 'مخزن الدرفلة',
        'warehouse_manager_4': 'مخزن ستيل',
        'warehouse_manager_5': 'مخزن العربية للأسمنت',
        'warehouse_manager_6': 'مخزن غبور'
      };
      
      const userWarehouse = warehouseMapping[user?.username || ''];
      return userWarehouse ? suggestions.filter(suggestion => suggestion.warehouse === userWarehouse) : [];
    }
    // General Manager and Purchasing Manager see all suggestions
    return suggestions;
  };

  const accessibleSuggestions = getAccessibleSuggestions();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high": return "عاجل";
      case "medium": return "متوسط";
      case "low": return "منخفض";
      default: return "غير محدد";
    }
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === accessibleSuggestions.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(accessibleSuggestions.map(s => s.id));
    }
  };

  const getSelectedTotal = () => {
    return accessibleSuggestions
      .filter(s => selectedItems.includes(s.id))
      .reduce((total, s) => total + s.totalCost, 0);
  };

  const createPurchaseOrder = () => {
    const selectedSuggestions = accessibleSuggestions.filter(s => selectedItems.includes(s.id));
    
    // تجميع العناصر حسب المورد
    const supplierGroups = selectedSuggestions.reduce((groups, suggestion) => {
      if (!groups[suggestion.supplier]) {
        groups[suggestion.supplier] = [];
      }
      groups[suggestion.supplier].push(suggestion);
      return groups;
    }, {} as Record<string, PurchaseSuggestion[]>);

    // إنشاء طلب شراء لكل مورد
    Object.entries(supplierGroups).forEach(([supplier, items]) => {
      const order: PurchaseOrder = {
        id: `PO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        orderNumber: `PO-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
        supplier,
        items: items.map(item => ({
          productId: item.id,
          productName: item.productName,
          quantity: item.suggestedQuantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalCost
        })),
        totalAmount: items.reduce((total, item) => total + item.totalCost, 0),
        status: "draft",
        createdAt: new Date().toISOString(),
        notes: orderNotes
      };
      
      console.log('تم إنشاء طلب شراء:', order);
    });

    setIsCreateOrderOpen(false);
    setSelectedItems([]);
    setOrderNotes("");
    alert(`تم إنشاء ${Object.keys(supplierGroups).length} طلب شراء بنجاح!`);
  };

  const highPriorityCount = accessibleSuggestions.filter(s => s.priority === "high").length;
  const totalSuggestedValue = accessibleSuggestions.reduce((total, s) => total + s.totalCost, 0);
  const criticalItems = accessibleSuggestions.filter(s => s.daysUntilStockout <= 5).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">اقتراحات الشراء</h1>
          <p className="text-gray-600 mt-2">
            {(isGeneralManager || isPurchasingManager) 
              ? "توصيات ذكية لإعادة التخزين بناءً على معدلات البيع والمخزون الحالي من جميع المخازن"
              : "توصيات ذكية لإعادة التخزين بناءً على معدلات البيع والمخزون الحالي لمخزنك"
            }
          </p>
          {isPurchasingManager && (
            <div className="flex items-center gap-2 mt-2 text-blue-600">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">مدير مشتريات - عرض اقتراحات جميع المخازن</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {hasPermission(Permission.CREATE_PURCHASE_ORDERS) && (
            <Button 
              onClick={() => setIsCreateOrderOpen(true)}
              disabled={selectedItems.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <ShoppingCart className="w-4 h-4 ml-2" />
              إنشاء طلب شراء ({selectedItems.length})
            </Button>
          )}
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الاقتراحات</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accessibleSuggestions.length}</div>
            <p className="text-xs text-muted-foreground">منتج يحتاج إعادة تخزين</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">عاجل</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{highPriorityCount}</div>
            <p className="text-xs text-muted-foreground">منتج يحتاج تدخل فوري</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">حرج</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{criticalItems}</div>
            <p className="text-xs text-muted-foreground">منتج سينفد خلال 5 أيام</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">القيمة المقترحة</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSuggestedValue.toLocaleString()} ج.م</div>
            <p className="text-xs text-muted-foreground">إجمالي قيمة الاقتراحات</p>
          </CardContent>
        </Card>
      </div>

      {/* جدول الاقتراحات */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>قائمة اقتراحات الشراء</CardTitle>
              <CardDescription>اختر المنتجات التي تريد إنشاء طلب شراء لها</CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={handleSelectAll}
            >
              {selectedItems.length === accessibleSuggestions.length ? "إلغاء تحديد الكل" : "تحديد الكل"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">اختيار</TableHead>
                <TableHead>المنتج</TableHead>
                <TableHead>المخزن</TableHead>
                <TableHead>المخزون الحالي</TableHead>
                <TableHead>الكمية المقترحة</TableHead>
                <TableHead>أيام حتى النفاد</TableHead>
                <TableHead>المورد</TableHead>
                <TableHead>التكلفة الإجمالية</TableHead>
                <TableHead>الأولوية</TableHead>
                <TableHead>السبب</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accessibleSuggestions.map((suggestion) => (
                <TableRow key={suggestion.id} className={selectedItems.includes(suggestion.id) ? "bg-blue-50" : ""}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(suggestion.id)}
                      onChange={() => handleSelectItem(suggestion.id)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{suggestion.productName}</div>
                      <div className="text-sm text-gray-500">{suggestion.sku}</div>
                      <Badge variant="outline" className="mt-1">{suggestion.category}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>{suggestion.warehouse}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={suggestion.currentStock <= suggestion.minStock ? "text-red-600 font-medium" : ""}>
                        {suggestion.currentStock}
                      </span>
                      <span className="text-gray-400">/</span>
                      <span className="text-sm text-gray-500">{suggestion.minStock}</span>
                    </div>
                    <Progress 
                      value={(suggestion.currentStock / suggestion.minStock) * 100} 
                      className="w-16 h-2 mt-1"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{suggestion.suggestedQuantity}</TableCell>
                  <TableCell>
                    <Badge className={suggestion.daysUntilStockout <= 5 ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}>
                      {suggestion.daysUntilStockout} يوم
                    </Badge>
                  </TableCell>
                  <TableCell>{suggestion.supplier}</TableCell>
                  <TableCell className="font-medium">{suggestion.totalCost.toLocaleString()} ج.م</TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(suggestion.priority)}>
                      {getPriorityText(suggestion.priority)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{suggestion.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* نافذة إنشاء طلب الشراء */}
      <Dialog open={isCreateOrderOpen} onOpenChange={setIsCreateOrderOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>إنشاء طلب شراء</DialogTitle>
            <DialogDescription>
              سيتم إنشاء طلبات شراء منفصلة لكل مورد من الموردين المحددين
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">ملخص الطلب:</h4>
              <div className="space-y-1 text-sm">
                <div>عدد المنتجات: {selectedItems.length}</div>
                <div>إجمالي التكلفة: {getSelectedTotal().toLocaleString()} ج.م</div>
                <div>عدد الموردين: {new Set(accessibleSuggestions.filter(s => selectedItems.includes(s.id)).map(s => s.supplier)).size}</div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="order-notes">ملاحظات الطلب</Label>
              <Textarea
                id="order-notes"
                placeholder="أدخل أي ملاحظات إضافية للطلب..."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 text-blue-800">المنتجات المحددة:</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {accessibleSuggestions
                  .filter(s => selectedItems.includes(s.id))
                  .map(suggestion => (
                    <div key={suggestion.id} className="flex justify-between items-center text-sm">
                      <span>{suggestion.productName}</span>
                      <span className="font-medium">{suggestion.suggestedQuantity} × {suggestion.unitPrice.toLocaleString()} = {suggestion.totalCost.toLocaleString()} ج.م</span>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsCreateOrderOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={createPurchaseOrder} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 ml-2" />
              إنشاء طلبات الشراء
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchaseSuggestions;