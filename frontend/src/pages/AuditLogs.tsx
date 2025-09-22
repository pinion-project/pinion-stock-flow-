import { useState } from "react";
import { Search, Filter, Download, Eye, Calendar, User, Activity, AlertTriangle, CheckCircle, XCircle, Clock, FileText, Database, Shield, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Permission } from "@/types/auth";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/navigation/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface AuditLog {
  id: string;
  timestamp: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  action: string;
  category: "authentication" | "inventory" | "users" | "system" | "data" | "security";
  resource: string;
  resourceId?: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  status: "success" | "failed" | "warning";
  changes?: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
}

const AuditLogs = () => {
  const { hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterUser, setFilterUser] = useState("all");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>();

  // بيانات وهمية لسجلات التدقيق
  const auditLogs: AuditLog[] = [
    {
      id: "1",
      timestamp: "2024-01-15T14:30:00Z",
      user: {
        id: "1",
        name: "أحمد محمد علي",
        email: "ahmed.mohamed@pinion-egypt.com"
      },
      action: "تسجيل دخول",
      category: "authentication",
      resource: "النظام",
      details: "تسجيل دخول ناجح إلى النظام",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      status: "success"
    },
    {
      id: "2",
      timestamp: "2024-01-15T14:25:00Z",
      user: {
        id: "2",
        name: "فاطمة حسن محمود",
        email: "fatma.hassan@pinion-egypt.com"
      },
      action: "إضافة منتج",
      category: "inventory",
      resource: "المنتجات",
      resourceId: "PRD-001",
      details: "إضافة منتج جديد: لابتوب ديل XPS 13",
      ipAddress: "192.168.1.101",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      status: "success",
      changes: [
        { field: "اسم المنتج", oldValue: "", newValue: "لابتوب ديل XPS 13" },
        { field: "الكمية", oldValue: "", newValue: "50" },
        { field: "السعر", oldValue: "", newValue: "25000" }
      ]
    },
    {
      id: "3",
      timestamp: "2024-01-15T14:20:00Z",
      user: {
        id: "3",
        name: "محمد أحمد السيد",
        email: "mohamed.ahmed@pinion-egypt.com"
      },
      action: "تعديل مستخدم",
      category: "users",
      resource: "المستخدمين",
      resourceId: "USR-005",
      details: "تعديل صلاحيات المستخدم سارة عبد الرحمن",
      ipAddress: "192.168.1.102",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      status: "success",
      changes: [
        { field: "الدور", oldValue: "موظف", newValue: "مدير" },
        { field: "الصلاحيات", oldValue: "قراءة، كتابة", newValue: "قراءة، كتابة، إدارة المخزن" }
      ]
    },
    {
      id: "4",
      timestamp: "2024-01-15T14:15:00Z",
      user: {
        id: "4",
        name: "سارة عبد الرحمن",
        email: "sara.abdelrahman@pinion-egypt.com"
      },
      action: "محاولة تسجيل دخول فاشلة",
      category: "authentication",
      resource: "النظام",
      details: "محاولة تسجيل دخول بكلمة مرور خاطئة",
      ipAddress: "192.168.1.103",
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
      status: "failed"
    },
    {
      id: "5",
      timestamp: "2024-01-15T14:10:00Z",
      user: {
        id: "1",
        name: "أحمد محمد علي",
        email: "ahmed.mohamed@company.com"
      },
      action: "نسخ احتياطي للبيانات",
      category: "system",
      resource: "قاعدة البيانات",
      details: "إنشاء نسخة احتياطية يومية للبيانات",
      ipAddress: "192.168.1.100",
      userAgent: "System/Automated",
      status: "success"
    },
    {
      id: "6",
      timestamp: "2024-01-15T14:05:00Z",
      user: {
        id: "2",
        name: "فاطمة حسن محمود",
        email: "fatma.hassan@company.com"
      },
      action: "تصدير تقرير",
      category: "data",
      resource: "التقارير",
      resourceId: "RPT-INV-001",
      details: "تصدير تقرير المخزون الشهري",
      ipAddress: "192.168.1.101",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      status: "success"
    },
    {
      id: "7",
      timestamp: "2024-01-15T14:00:00Z",
      user: {
        id: "5",
        name: "عبد الله محمد نور",
        email: "abdullah.mohamed@pinion-egypt.com"
      },
      action: "محاولة وصول غير مصرح",
      category: "security",
      resource: "إعدادات النظام",
      details: "محاولة الوصول إلى إعدادات النظام بدون صلاحية",
      ipAddress: "192.168.1.104",
      userAgent: "Mozilla/5.0 (Android 13; Mobile; rv:109.0) Gecko/109.0 Firefox/109.0",
      status: "failed"
    },
    {
      id: "8",
      timestamp: "2024-01-15T13:55:00Z",
      user: {
        id: "3",
        name: "محمد أحمد السيد",
        email: "mohamed.ahmed@company.com"
      },
      action: "حذف منتج",
      category: "inventory",
      resource: "المنتجات",
      resourceId: "PRD-099",
      details: "حذف منتج منتهي الصلاحية: كاميرا كانون القديمة",
      ipAddress: "192.168.1.102",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      status: "warning",
      changes: [
        { field: "الحالة", oldValue: "نشط", newValue: "محذوف" },
        { field: "سبب الحذف", oldValue: "", newValue: "منتهي الصلاحية" }
      ]
    }
  ];

  const users = [
    { id: "1", name: "أحمد محمد علي" },
    { id: "2", name: "فاطمة حسن محمود" },
    { id: "3", name: "محمد أحمد السيد" },
    { id: "4", name: "سارة عبد الرحمن" },
    { id: "5", name: "عبد الله محمد نور" }
  ];

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || log.category === filterCategory;
    const matchesStatus = filterStatus === "all" || log.status === filterStatus;
    const matchesUser = filterUser === "all" || log.user.id === filterUser;
    
    let matchesDate = true;
    if (dateRange?.from && dateRange?.to) {
      const logDate = new Date(log.timestamp);
      matchesDate = logDate >= dateRange.from && logDate <= dateRange.to;
    }
    
    return matchesSearch && matchesCategory && matchesStatus && matchesUser && matchesDate;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "authentication":
        return <Shield className="w-4 h-4" />;
      case "inventory":
        return <Database className="w-4 h-4" />;
      case "users":
        return <User className="w-4 h-4" />;
      case "system":
        return <Settings className="w-4 h-4" />;
      case "data":
        return <FileText className="w-4 h-4" />;
      case "security":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "authentication":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">المصادقة</Badge>;
      case "inventory":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">المخزون</Badge>;
      case "users":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">المستخدمين</Badge>;
      case "system":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">النظام</Badge>;
      case "data":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">البيانات</Badge>;
      case "security":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">الأمان</Badge>;
      default:
        return <Badge variant="secondary">{category}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 ml-1" />
            نجح
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="w-3 h-3 ml-1" />
            فشل
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <AlertTriangle className="w-3 h-3 ml-1" />
            تحذير
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('ar-EG'),
      time: date.toLocaleTimeString('ar-EG', { hour12: false })
    };
  };

  const handleExportLogs = () => {
    // هنا يتم تصدير السجلات
    toast.success("تم تصدير السجلات بنجاح");
  };

  const LogDetailsDialog = ({ log }: { log: AuditLog | null }) => {
    if (!log) return null;

    const { date, time } = formatTimestamp(log.timestamp);

    return (
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getCategoryIcon(log.category)}
            تفاصيل سجل التدقيق
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* معلومات أساسية */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">الإجراء</div>
              <div className="font-medium">{log.action}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">الحالة</div>
              <div>{getStatusBadge(log.status)}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">التاريخ</div>
              <div>{date}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">الوقت</div>
              <div>{time}</div>
            </div>
          </div>

          <Separator />

          {/* معلومات المستخدم */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-muted-foreground">معلومات المستخدم</div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarImage src={log.user.avatar} />
                <AvatarFallback>{getInitials(log.user.name)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{log.user.name}</div>
                <div className="text-sm text-muted-foreground">{log.user.email}</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* تفاصيل الإجراء */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-muted-foreground">تفاصيل الإجراء</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">الفئة</div>
                <div>{getCategoryBadge(log.category)}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">المورد</div>
                <div>{log.resource}</div>
              </div>
              {log.resourceId && (
                <div className="space-y-2 col-span-2">
                  <div className="text-sm font-medium text-muted-foreground">معرف المورد</div>
                  <div className="font-mono text-sm bg-muted px-2 py-1 rounded">{log.resourceId}</div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">الوصف</div>
              <div className="p-3 bg-muted/50 rounded-lg">{log.details}</div>
            </div>
          </div>

          {/* التغييرات */}
          {log.changes && log.changes.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="text-sm font-medium text-muted-foreground">التغييرات المطبقة</div>
                <div className="space-y-2">
                  {log.changes.map((change, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="font-medium text-sm mb-2">{change.field}</div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground mb-1">القيمة السابقة:</div>
                          <div className="bg-red-50 text-red-800 px-2 py-1 rounded font-mono">
                            {change.oldValue || "(فارغ)"}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">القيمة الجديدة:</div>
                          <div className="bg-green-50 text-green-800 px-2 py-1 rounded font-mono">
                            {change.newValue || "(فارغ)"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* معلومات تقنية */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-muted-foreground">المعلومات التقنية</div>
            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">عنوان IP</div>
                <div className="font-mono text-sm bg-muted px-2 py-1 rounded">{log.ipAddress}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">متصفح المستخدم</div>
                <div className="font-mono text-xs bg-muted px-2 py-1 rounded break-all">{log.userAgent}</div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
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
                <h1 className="text-3xl font-bold text-foreground">سجلات التدقيق</h1>
                <p className="text-muted-foreground mt-1">
                  تتبع جميع العمليات والأنشطة في النظام
                </p>
              </div>
              {hasPermission(Permission.VIEW_AUDIT_LOGS) && (
                <Button onClick={handleExportLogs}>
                  <Download className="w-4 h-4 ml-2" />
                  تصدير السجلات
                </Button>
              )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">إجمالي السجلات</p>
                      <p className="text-2xl font-bold">{auditLogs.length}</p>
                    </div>
                    <Activity className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">العمليات الناجحة</p>
                      <p className="text-2xl font-bold text-green-600">
                        {auditLogs.filter(log => log.status === "success").length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">العمليات الفاشلة</p>
                      <p className="text-2xl font-bold text-red-600">
                        {auditLogs.filter(log => log.status === "failed").length}
                      </p>
                    </div>
                    <XCircle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">التحذيرات</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {auditLogs.filter(log => log.status === "warning").length}
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="البحث في السجلات..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pr-10"
                      />
                    </div>
                  </div>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder="تصفية حسب الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الفئات</SelectItem>
                      <SelectItem value="authentication">المصادقة</SelectItem>
                      <SelectItem value="inventory">المخزون</SelectItem>
                      <SelectItem value="users">المستخدمين</SelectItem>
                      <SelectItem value="system">النظام</SelectItem>
                      <SelectItem value="data">البيانات</SelectItem>
                      <SelectItem value="security">الأمان</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder="تصفية حسب الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="success">نجح</SelectItem>
                      <SelectItem value="failed">فشل</SelectItem>
                      <SelectItem value="warning">تحذير</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterUser} onValueChange={setFilterUser}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder="تصفية حسب المستخدم" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع المستخدمين</SelectItem>
                      {users.map(user => (
                        <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Audit Logs Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  سجلات التدقيق ({filteredLogs.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>التاريخ والوقت</TableHead>
                        <TableHead>المستخدم</TableHead>
                        <TableHead>الإجراء</TableHead>
                        <TableHead>الفئة</TableHead>
                        <TableHead>المورد</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>عنوان IP</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs.map((log) => {
                        const { date, time } = formatTimestamp(log.timestamp);
                        return (
                          <TableRow key={log.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <div>
                                  <div className="font-medium text-sm">{date}</div>
                                  <div className="text-xs text-muted-foreground">{time}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={log.user.avatar} />
                                  <AvatarFallback className="text-xs">
                                    {getInitials(log.user.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-sm">{log.user.name}</div>
                                  <div className="text-xs text-muted-foreground">{log.user.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{log.action}</div>
                              <div className="text-sm text-muted-foreground truncate max-w-48">
                                {log.details}
                              </div>
                            </TableCell>
                            <TableCell>{getCategoryBadge(log.category)}</TableCell>
                            <TableCell>
                              <div>{log.resource}</div>
                              {log.resourceId && (
                                <div className="text-xs text-muted-foreground font-mono">
                                  {log.resourceId}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>{getStatusBadge(log.status)}</TableCell>
                            <TableCell>
                              <div className="font-mono text-sm">{log.ipAddress}</div>
                            </TableCell>
                            <TableCell>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedLog(log)}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <LogDetailsDialog log={selectedLog} />
                              </Dialog>
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
    </div>
  );
};

export default AuditLogs;