import { useState } from "react";
import { Database, Table, FileText, Download, Upload, RefreshCw, Trash2, Plus, Search, Filter, Settings, AlertTriangle, CheckCircle, XCircle, Eye, Edit, Copy, Archive } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/navigation/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table as UITable, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface DatabaseTable {
  id: string;
  name: string;
  displayName: string;
  recordCount: number;
  size: string;
  lastUpdated: string;
  status: "active" | "maintenance" | "error";
  description: string;
  type: "system" | "business" | "log";
}

interface DataOperation {
  id: string;
  operation: string;
  table: string;
  status: "running" | "completed" | "failed" | "pending";
  progress: number;
  startTime: string;
  endTime?: string;
  recordsProcessed: number;
  totalRecords: number;
  user: string;
}

interface DataExport {
  id: string;
  name: string;
  format: "csv" | "excel" | "json" | "sql";
  tables: string[];
  size: string;
  createdAt: string;
  downloadUrl: string;
  expiresAt: string;
}

const DataManagement = () => {
  const [activeTab, setActiveTab] = useState<"tables" | "operations" | "exports" | "imports">("tables");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedTable, setSelectedTable] = useState<DatabaseTable | null>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);

  // بيانات وهمية للجداول
  const databaseTables: DatabaseTable[] = [
    {
      id: "1",
      name: "users",
      displayName: "المستخدمين",
      recordCount: 1250,
      size: "2.5 MB",
      lastUpdated: "2024-01-15T14:30:00Z",
      status: "active",
      description: "جدول بيانات المستخدمين والموظفين",
      type: "business"
    },
    {
      id: "2",
      name: "products",
      displayName: "المنتجات",
      recordCount: 5680,
      size: "12.8 MB",
      lastUpdated: "2024-01-15T14:25:00Z",
      status: "active",
      description: "جدول بيانات المنتجات والسلع",
      type: "business"
    },
    {
      id: "3",
      name: "warehouses",
      displayName: "المخازن",
      recordCount: 45,
      size: "156 KB",
      lastUpdated: "2024-01-15T14:20:00Z",
      status: "active",
      description: "جدول بيانات المخازن والفروع",
      type: "business"
    },
    {
      id: "4",
      name: "inventory",
      displayName: "المخزون",
      recordCount: 15420,
      size: "45.2 MB",
      lastUpdated: "2024-01-15T14:15:00Z",
      status: "active",
      description: "جدول بيانات المخزون والكميات",
      type: "business"
    },
    {
      id: "5",
      name: "audit_logs",
      displayName: "سجلات التدقيق",
      recordCount: 89650,
      size: "125.6 MB",
      lastUpdated: "2024-01-15T14:35:00Z",
      status: "active",
      description: "سجلات العمليات والأنشطة",
      type: "log"
    },
    {
      id: "6",
      name: "system_config",
      displayName: "إعدادات النظام",
      recordCount: 156,
      size: "45 KB",
      lastUpdated: "2024-01-15T10:00:00Z",
      status: "maintenance",
      description: "إعدادات وتكوينات النظام",
      type: "system"
    },
    {
      id: "7",
      name: "reports",
      displayName: "التقارير",
      recordCount: 2340,
      size: "8.9 MB",
      lastUpdated: "2024-01-15T13:45:00Z",
      status: "active",
      description: "بيانات التقارير المحفوظة",
      type: "business"
    },
    {
      id: "8",
      name: "error_logs",
      displayName: "سجلات الأخطاء",
      recordCount: 1250,
      size: "3.2 MB",
      lastUpdated: "2024-01-15T14:30:00Z",
      status: "error",
      description: "سجلات الأخطاء والمشاكل التقنية",
      type: "log"
    }
  ];

  // بيانات وهمية للعمليات
  const dataOperations: DataOperation[] = [
    {
      id: "1",
      operation: "تنظيف البيانات المكررة",
      table: "products",
      status: "running",
      progress: 65,
      startTime: "2024-01-15T14:30:00Z",
      recordsProcessed: 3692,
      totalRecords: 5680,
      user: "أحمد محمد علي"
    },
    {
      id: "2",
      operation: "أرشفة السجلات القديمة",
      table: "audit_logs",
      status: "completed",
      progress: 100,
      startTime: "2024-01-15T13:00:00Z",
      endTime: "2024-01-15T13:45:00Z",
      recordsProcessed: 25000,
      totalRecords: 25000,
      user: "فاطمة حسن محمود"
    },
    {
      id: "3",
      operation: "تحديث فهارس قاعدة البيانات",
      table: "inventory",
      status: "failed",
      progress: 25,
      startTime: "2024-01-15T12:30:00Z",
      endTime: "2024-01-15T12:35:00Z",
      recordsProcessed: 3855,
      totalRecords: 15420,
      user: "محمد أحمد السيد"
    },
    {
      id: "4",
      operation: "تصدير بيانات المستخدمين",
      table: "users",
      status: "pending",
      progress: 0,
      startTime: "2024-01-15T15:00:00Z",
      recordsProcessed: 0,
      totalRecords: 1250,
      user: "سارة عبد الرحمن"
    }
  ];

  // بيانات وهمية للتصديرات
  const dataExports: DataExport[] = [
    {
      id: "1",
      name: "تصدير المنتجات - يناير 2024",
      format: "excel",
      tables: ["products", "inventory"],
      size: "15.2 MB",
      createdAt: "2024-01-15T14:00:00Z",
      downloadUrl: "/exports/products_jan2024.xlsx",
      expiresAt: "2024-01-22T14:00:00Z"
    },
    {
      id: "2",
      name: "تصدير بيانات المستخدمين",
      format: "csv",
      tables: ["users"],
      size: "2.8 MB",
      createdAt: "2024-01-15T13:30:00Z",
      downloadUrl: "/exports/users_data.csv",
      expiresAt: "2024-01-22T13:30:00Z"
    },
    {
      id: "3",
      name: "نسخة احتياطية JSON",
      format: "json",
      tables: ["products", "warehouses", "inventory"],
      size: "45.6 MB",
      createdAt: "2024-01-15T12:00:00Z",
      downloadUrl: "/exports/backup_data.json",
      expiresAt: "2024-01-22T12:00:00Z"
    }
  ];

  const filteredTables = databaseTables.filter(table => {
    const matchesSearch = table.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         table.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || table.type === filterType;
    const matchesStatus = filterStatus === "all" || table.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 ml-1" />
            نشط
          </Badge>
        );
      case "maintenance":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Settings className="w-3 h-3 ml-1" />
            صيانة
          </Badge>
        );
      case "error":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="w-3 h-3 ml-1" />
            خطأ
          </Badge>
        );
      case "running":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <RefreshCw className="w-3 h-3 ml-1 animate-spin" />
            قيد التشغيل
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 ml-1" />
            مكتمل
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="w-3 h-3 ml-1" />
            فشل
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            <RefreshCw className="w-3 h-3 ml-1" />
            في الانتظار
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "business":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">أعمال</Badge>;
      case "system":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">نظام</Badge>;
      case "log":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">سجلات</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const getFormatBadge = (format: string) => {
    switch (format) {
      case "excel":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Excel</Badge>;
      case "csv":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">CSV</Badge>;
      case "json":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">JSON</Badge>;
      case "sql":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">SQL</Badge>;
      default:
        return <Badge variant="secondary">{format}</Badge>;
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('ar-EG'),
      time: date.toLocaleTimeString('ar-EG', { hour12: false })
    };
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ar-EG').format(num);
  };

  const handleExportData = () => {
    toast.success("تم بدء عملية التصدير");
    setShowExportDialog(false);
  };

  const handleImportData = () => {
    toast.success("تم بدء عملية الاستيراد");
    setShowImportDialog(false);
  };

  const handleOptimizeTable = (tableId: string) => {
    toast.success(`تم بدء تحسين الجدول ${tableId}`);
  };

  const handleCleanupTable = (tableId: string) => {
    toast.success(`تم بدء تنظيف الجدول ${tableId}`);
  };

  const TableDetailsDialog = ({ table }: { table: DatabaseTable | null }) => {
    if (!table) return null;

    const { date, time } = formatDateTime(table.lastUpdated);

    return (
      <DialogContent className="max-w-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Table className="w-5 h-5" />
            تفاصيل الجدول: {table.displayName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">اسم الجدول</Label>
              <div className="font-mono bg-muted px-3 py-2 rounded">{table.name}</div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">الاسم المعروض</Label>
              <div className="font-medium">{table.displayName}</div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">النوع</Label>
              <div>{getTypeBadge(table.type)}</div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">الحالة</Label>
              <div>{getStatusBadge(table.status)}</div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">عدد السجلات</Label>
              <div className="font-medium">{formatNumber(table.recordCount)}</div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">الحجم</Label>
              <div className="font-medium">{table.size}</div>
            </div>
            <div className="space-y-2 col-span-2">
              <Label className="text-sm font-medium text-muted-foreground">آخر تحديث</Label>
              <div>{date} - {time}</div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-sm font-medium text-muted-foreground">الوصف</Label>
            <div className="p-3 bg-muted/50 rounded-lg">
              {table.description}
            </div>
          </div>

          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleOptimizeTable(table.id)}>
              <Settings className="w-4 h-4 ml-2" />
              تحسين الجدول
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleCleanupTable(table.id)}>
              <Trash2 className="w-4 h-4 ml-2" />
              تنظيف البيانات
            </Button>
          </div>
        </div>
      </DialogContent>
    );
  };

  const ExportDialog = () => {
    return (
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>تصدير البيانات</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="export-name">اسم التصدير</Label>
              <Input id="export-name" placeholder="أدخل اسم التصدير" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="export-format">تنسيق التصدير</Label>
              <Select defaultValue="excel">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                  <SelectItem value="csv">CSV (.csv)</SelectItem>
                  <SelectItem value="json">JSON (.json)</SelectItem>
                  <SelectItem value="sql">SQL (.sql)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>الجداول المحددة</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {databaseTables.map(table => (
                  <div key={table.id} className="flex items-center space-x-2 space-x-reverse">
                    <input type="checkbox" id={`table-${table.id}`} className="rounded" />
                    <Label htmlFor={`table-${table.id}`} className="flex-1">
                      {table.displayName} ({formatNumber(table.recordCount)} سجل)
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={handleExportData}>
              <Download className="w-4 h-4 ml-2" />
              تصدير البيانات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const ImportDialog = () => {
    return (
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>استيراد البيانات</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                تحذير: عملية الاستيراد قد تؤثر على البيانات الموجودة. تأكد من إنشاء نسخة احتياطية أولاً.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label htmlFor="import-file">ملف البيانات</Label>
              <Input id="import-file" type="file" accept=".xlsx,.csv,.json,.sql" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="target-table">الجدول المستهدف</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الجدول المستهدف" />
                </SelectTrigger>
                <SelectContent>
                  {databaseTables.map(table => (
                    <SelectItem key={table.id} value={table.name}>
                      {table.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="import-mode">وضع الاستيراد</Label>
              <Select defaultValue="append">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="append">إضافة إلى البيانات الموجودة</SelectItem>
                  <SelectItem value="replace">استبدال البيانات الموجودة</SelectItem>
                  <SelectItem value="update">تحديث البيانات الموجودة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={handleImportData}>
              <Upload className="w-4 h-4 ml-2" />
              استيراد البيانات
            </Button>
          </DialogFooter>
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
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-foreground">إدارة البيانات</h1>
                <p className="text-muted-foreground mt-1">
                  إدارة قواعد البيانات والجداول والعمليات
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowImportDialog(true)}>
                  <Upload className="w-4 h-4 ml-2" />
                  استيراد البيانات
                </Button>
                <Button onClick={() => setShowExportDialog(true)}>
                  <Download className="w-4 h-4 ml-2" />
                  تصدير البيانات
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">إجمالي الجداول</p>
                      <p className="text-2xl font-bold">{databaseTables.length}</p>
                    </div>
                    <Table className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">إجمالي السجلات</p>
                      <p className="text-2xl font-bold">
                        {formatNumber(databaseTables.reduce((sum, table) => sum + table.recordCount, 0))}
                      </p>
                    </div>
                    <Database className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">العمليات النشطة</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {dataOperations.filter(op => op.status === "running").length}
                      </p>
                    </div>
                    <RefreshCw className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">التصديرات المتاحة</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {dataExports.length}
                      </p>
                    </div>
                    <FileText className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="tables">الجداول</TabsTrigger>
                <TabsTrigger value="operations">العمليات</TabsTrigger>
                <TabsTrigger value="exports">التصديرات</TabsTrigger>
                <TabsTrigger value="imports">الاستيرادات</TabsTrigger>
              </TabsList>

              {/* Tables Tab */}
              <TabsContent value="tables" className="space-y-6">
                {/* Filters */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input
                            placeholder="البحث في الجداول..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pr-10"
                          />
                        </div>
                      </div>
                      <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-full lg:w-48">
                          <SelectValue placeholder="تصفية حسب النوع" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">جميع الأنواع</SelectItem>
                          <SelectItem value="business">أعمال</SelectItem>
                          <SelectItem value="system">نظام</SelectItem>
                          <SelectItem value="log">سجلات</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-full lg:w-48">
                          <SelectValue placeholder="تصفية حسب الحالة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">جميع الحالات</SelectItem>
                          <SelectItem value="active">نشط</SelectItem>
                          <SelectItem value="maintenance">صيانة</SelectItem>
                          <SelectItem value="error">خطأ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Tables List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Table className="w-5 h-5" />
                      جداول قاعدة البيانات ({filteredTables.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <UITable>
                        <TableHeader>
                          <TableRow>
                            <TableHead>اسم الجدول</TableHead>
                            <TableHead>النوع</TableHead>
                            <TableHead>الحالة</TableHead>
                            <TableHead>عدد السجلات</TableHead>
                            <TableHead>الحجم</TableHead>
                            <TableHead>آخر تحديث</TableHead>
                            <TableHead>الإجراءات</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredTables.map((table) => {
                            const { date, time } = formatDateTime(table.lastUpdated);
                            return (
                              <TableRow key={table.id}>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{table.displayName}</div>
                                    <div className="text-sm text-muted-foreground font-mono">{table.name}</div>
                                    <div className="text-xs text-muted-foreground mt-1">{table.description}</div>
                                  </div>
                                </TableCell>
                                <TableCell>{getTypeBadge(table.type)}</TableCell>
                                <TableCell>{getStatusBadge(table.status)}</TableCell>
                                <TableCell className="font-mono">{formatNumber(table.recordCount)}</TableCell>
                                <TableCell className="font-mono">{table.size}</TableCell>
                                <TableCell>
                                  <div>
                                    <div className="text-sm">{date}</div>
                                    <div className="text-xs text-muted-foreground">{time}</div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setSelectedTable(table)}
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleOptimizeTable(table.id)}
                                    >
                                      <Settings className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </UITable>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Operations Tab */}
              <TabsContent value="operations" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <RefreshCw className="w-5 h-5" />
                      عمليات البيانات ({dataOperations.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <UITable>
                        <TableHeader>
                          <TableRow>
                            <TableHead>العملية</TableHead>
                            <TableHead>الجدول</TableHead>
                            <TableHead>الحالة</TableHead>
                            <TableHead>التقدم</TableHead>
                            <TableHead>السجلات المعالجة</TableHead>
                            <TableHead>وقت البدء</TableHead>
                            <TableHead>المستخدم</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dataOperations.map((operation) => {
                            const { date, time } = formatDateTime(operation.startTime);
                            return (
                              <TableRow key={operation.id}>
                                <TableCell className="font-medium">{operation.operation}</TableCell>
                                <TableCell>
                                  <Badge variant="outline">{operation.table}</Badge>
                                </TableCell>
                                <TableCell>{getStatusBadge(operation.status)}</TableCell>
                                <TableCell>
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span>{operation.progress}%</span>
                                    </div>
                                    <Progress value={operation.progress} className="w-24" />
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm">
                                    {formatNumber(operation.recordsProcessed)} / {formatNumber(operation.totalRecords)}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <div className="text-sm">{date}</div>
                                    <div className="text-xs text-muted-foreground">{time}</div>
                                  </div>
                                </TableCell>
                                <TableCell>{operation.user}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </UITable>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Exports Tab */}
              <TabsContent value="exports" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="w-5 h-5" />
                      التصديرات المتاحة ({dataExports.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <UITable>
                        <TableHeader>
                          <TableRow>
                            <TableHead>اسم التصدير</TableHead>
                            <TableHead>التنسيق</TableHead>
                            <TableHead>الجداول</TableHead>
                            <TableHead>الحجم</TableHead>
                            <TableHead>تاريخ الإنشاء</TableHead>
                            <TableHead>تاريخ الانتهاء</TableHead>
                            <TableHead>الإجراءات</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dataExports.map((exportItem) => {
                            const createdAt = formatDateTime(exportItem.createdAt);
                            const expiresAt = formatDateTime(exportItem.expiresAt);
                            return (
                              <TableRow key={exportItem.id}>
                                <TableCell className="font-medium">{exportItem.name}</TableCell>
                                <TableCell>{getFormatBadge(exportItem.format)}</TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-1">
                                    {exportItem.tables.map((table, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {table}
                                      </Badge>
                                    ))}
                                  </div>
                                </TableCell>
                                <TableCell className="font-mono">{exportItem.size}</TableCell>
                                <TableCell>
                                  <div>
                                    <div className="text-sm">{createdAt.date}</div>
                                    <div className="text-xs text-muted-foreground">{createdAt.time}</div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <div className="text-sm">{expiresAt.date}</div>
                                    <div className="text-xs text-muted-foreground">{expiresAt.time}</div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm">
                                      <Download className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <Copy className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </UITable>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Imports Tab */}
              <TabsContent value="imports" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      سجل الاستيرادات
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">لا توجد عمليات استيراد</h3>
                      <p className="mt-2 text-muted-foreground">
                        لم يتم تنفيذ أي عمليات استيراد حتى الآن
                      </p>
                      <Button className="mt-4" onClick={() => setShowImportDialog(true)}>
                        <Upload className="w-4 h-4 ml-2" />
                        استيراد البيانات
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      
      {/* Dialogs */}
      <ExportDialog />
      <ImportDialog />
      <Dialog open={!!selectedTable} onOpenChange={() => setSelectedTable(null)}>
        <TableDetailsDialog table={selectedTable} />
      </Dialog>
    </div>
  );
};

export default DataManagement;