import { useState } from "react";
import { Download, Upload, RefreshCw, Calendar, Database, HardDrive, Clock, CheckCircle, XCircle, AlertTriangle, Play, Pause, Settings, Trash2, Eye, FileText, Shield } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/navigation/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface BackupRecord {
  id: string;
  name: string;
  type: "full" | "incremental" | "differential";
  status: "completed" | "running" | "failed" | "scheduled";
  size: string;
  createdAt: string;
  duration: string;
  description?: string;
  location: string;
  checksum: string;
  compressed: boolean;
  encrypted: boolean;
}

interface BackupSchedule {
  id: string;
  name: string;
  type: "full" | "incremental" | "differential";
  frequency: "daily" | "weekly" | "monthly";
  time: string;
  enabled: boolean;
  lastRun?: string;
  nextRun: string;
  retention: number; // days
}

const BackupRestore = () => {
  const [activeTab, setActiveTab] = useState<"backups" | "schedules" | "restore">("backups");
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [selectedBackup, setSelectedBackup] = useState<BackupRecord | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);

  // بيانات وهمية للنسخ الاحتياطية
  const backupRecords: BackupRecord[] = [
    {
      id: "1",
      name: "نسخة احتياطية كاملة - يناير 2024",
      type: "full",
      status: "completed",
      size: "2.5 GB",
      createdAt: "2024-01-15T02:00:00Z",
      duration: "45 دقيقة",
      description: "نسخة احتياطية كاملة شاملة جميع البيانات",
      location: "/backups/full/backup_20240115_020000.bak",
      checksum: "sha256:a1b2c3d4e5f6...",
      compressed: true,
      encrypted: true
    },
    {
      id: "2",
      name: "نسخة احتياطية تزايدية - يناير 14",
      type: "incremental",
      status: "completed",
      size: "150 MB",
      createdAt: "2024-01-14T02:00:00Z",
      duration: "8 دقائق",
      description: "نسخة احتياطية للتغييرات منذ آخر نسخة كاملة",
      location: "/backups/incremental/backup_20240114_020000.bak",
      checksum: "sha256:b2c3d4e5f6g7...",
      compressed: true,
      encrypted: true
    },
    {
      id: "3",
      name: "نسخة احتياطية تفاضلية - يناير 13",
      type: "differential",
      status: "completed",
      size: "800 MB",
      createdAt: "2024-01-13T02:00:00Z",
      duration: "22 دقيقة",
      description: "نسخة احتياطية للتغييرات منذ آخر نسخة تزايدية",
      location: "/backups/differential/backup_20240113_020000.bak",
      checksum: "sha256:c3d4e5f6g7h8...",
      compressed: true,
      encrypted: false
    },
    {
      id: "4",
      name: "نسخة احتياطية طارئة - يناير 12",
      type: "full",
      status: "failed",
      size: "0 MB",
      createdAt: "2024-01-12T14:30:00Z",
      duration: "5 دقائق",
      description: "نسخة احتياطية طارئة قبل التحديث الكبير",
      location: "/backups/emergency/backup_20240112_143000.bak",
      checksum: "",
      compressed: false,
      encrypted: false
    },
    {
      id: "5",
      name: "نسخة احتياطية مجدولة - يناير 11",
      type: "incremental",
      status: "running",
      size: "75 MB",
      createdAt: "2024-01-11T02:00:00Z",
      duration: "جاري...",
      description: "نسخة احتياطية مجدولة يومية",
      location: "/backups/scheduled/backup_20240111_020000.bak",
      checksum: "",
      compressed: true,
      encrypted: true
    }
  ];

  // بيانات وهمية للجدولة
  const backupSchedules: BackupSchedule[] = [
    {
      id: "1",
      name: "نسخة احتياطية يومية",
      type: "incremental",
      frequency: "daily",
      time: "02:00",
      enabled: true,
      lastRun: "2024-01-15T02:00:00Z",
      nextRun: "2024-01-16T02:00:00Z",
      retention: 30
    },
    {
      id: "2",
      name: "نسخة احتياطية أسبوعية كاملة",
      type: "full",
      frequency: "weekly",
      time: "01:00",
      enabled: true,
      lastRun: "2024-01-14T01:00:00Z",
      nextRun: "2024-01-21T01:00:00Z",
      retention: 90
    },
    {
      id: "3",
      name: "نسخة احتياطية شهرية",
      type: "full",
      frequency: "monthly",
      time: "00:00",
      enabled: false,
      nextRun: "2024-02-01T00:00:00Z",
      retention: 365
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 ml-1" />
            مكتملة
          </Badge>
        );
      case "running":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <RefreshCw className="w-3 h-3 ml-1 animate-spin" />
            قيد التشغيل
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="w-3 h-3 ml-1" />
            فشلت
          </Badge>
        );
      case "scheduled":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="w-3 h-3 ml-1" />
            مجدولة
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "full":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">كاملة</Badge>;
      case "incremental":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">تزايدية</Badge>;
      case "differential":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">تفاضلية</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('ar-EG'),
      time: date.toLocaleTimeString('ar-EG', { hour12: false })
    };
  };

  const handleCreateBackup = () => {
    setIsCreatingBackup(true);
    setBackupProgress(0);
    
    // محاكاة عملية إنشاء النسخة الاحتياطية
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCreatingBackup(false);
          toast.success("تم إنشاء النسخة الاحتياطية بنجاح");
          return 100;
        }
        return prev + 10;
      });
    }, 500);
    
    setShowCreateDialog(false);
  };

  const handleRestoreBackup = (backupId: string) => {
    toast.success(`بدء عملية الاستعادة من النسخة الاحتياطية ${backupId}`);
    setShowRestoreDialog(false);
  };

  const handleDeleteBackup = (backupId: string) => {
    toast.success(`تم حذف النسخة الاحتياطية ${backupId}`);
  };

  const handleToggleSchedule = (scheduleId: string, enabled: boolean) => {
    toast.success(`تم ${enabled ? 'تفعيل' : 'إيقاف'} الجدولة`);
  };

  const BackupDetailsDialog = ({ backup }: { backup: BackupRecord | null }) => {
    if (!backup) return null;

    const { date, time } = formatDateTime(backup.createdAt);

    return (
      <DialogContent className="max-w-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            تفاصيل النسخة الاحتياطية
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">اسم النسخة</Label>
              <div className="font-medium">{backup.name}</div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">النوع</Label>
              <div>{getTypeBadge(backup.type)}</div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">الحالة</Label>
              <div>{getStatusBadge(backup.status)}</div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">الحجم</Label>
              <div className="font-medium">{backup.size}</div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">تاريخ الإنشاء</Label>
              <div>{date} - {time}</div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">المدة</Label>
              <div>{backup.duration}</div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-sm font-medium text-muted-foreground">الوصف</Label>
            <div className="p-3 bg-muted/50 rounded-lg">
              {backup.description || "لا يوجد وصف"}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-muted-foreground">الموقع</Label>
            <div className="font-mono text-sm bg-muted px-3 py-2 rounded-lg break-all">
              {backup.location}
            </div>
          </div>

          {backup.checksum && (
            <div className="space-y-3">
              <Label className="text-sm font-medium text-muted-foreground">المجموع الاختباري</Label>
              <div className="font-mono text-xs bg-muted px-3 py-2 rounded-lg break-all">
                {backup.checksum}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4" />
              <span className="text-sm">
                {backup.compressed ? "مضغوطة" : "غير مضغوطة"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="text-sm">
                {backup.encrypted ? "مشفرة" : "غير مشفرة"}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setSelectedBackup(null)}>
            إغلاق
          </Button>
          {backup.status === "completed" && (
            <Button onClick={() => handleRestoreBackup(backup.id)}>
              <Upload className="w-4 h-4 ml-2" />
              استعادة
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    );
  };

  const CreateBackupDialog = () => {
    return (
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>إنشاء نسخة احتياطية جديدة</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="backup-name">اسم النسخة الاحتياطية</Label>
              <Input id="backup-name" placeholder="أدخل اسم النسخة الاحتياطية" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="backup-type">نوع النسخة الاحتياطية</Label>
              <Select defaultValue="full">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">نسخة كاملة</SelectItem>
                  <SelectItem value="incremental">نسخة تزايدية</SelectItem>
                  <SelectItem value="differential">نسخة تفاضلية</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="backup-description">الوصف (اختياري)</Label>
              <Textarea id="backup-description" placeholder="وصف النسخة الاحتياطية" />
            </div>
            
            <div className="flex items-center space-x-2 space-x-reverse">
              <Switch id="compress" defaultChecked />
              <Label htmlFor="compress">ضغط النسخة الاحتياطية</Label>
            </div>
            
            <div className="flex items-center space-x-2 space-x-reverse">
              <Switch id="encrypt" defaultChecked />
              <Label htmlFor="encrypt">تشفير النسخة الاحتياطية</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={handleCreateBackup}>
              <Database className="w-4 h-4 ml-2" />
              إنشاء النسخة الاحتياطية
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
                <h1 className="text-3xl font-bold text-foreground">النسخ الاحتياطي والاستعادة</h1>
                <p className="text-muted-foreground mt-1">
                  إدارة النسخ الاحتياطية واستعادة البيانات
                </p>
              </div>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Database className="w-4 h-4 ml-2" />
                إنشاء نسخة احتياطية
              </Button>
            </div>

            {/* Progress Bar for Active Backup */}
            {isCreatingBackup && (
              <Alert>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>جاري إنشاء النسخة الاحتياطية...</span>
                      <span>{backupProgress}%</span>
                    </div>
                    <Progress value={backupProgress} className="w-full" />
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">إجمالي النسخ</p>
                      <p className="text-2xl font-bold">{backupRecords.length}</p>
                    </div>
                    <Database className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">النسخ المكتملة</p>
                      <p className="text-2xl font-bold text-green-600">
                        {backupRecords.filter(b => b.status === "completed").length}
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
                      <p className="text-sm font-medium text-muted-foreground">الحجم الإجمالي</p>
                      <p className="text-2xl font-bold">3.45 GB</p>
                    </div>
                    <HardDrive className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">الجدولة النشطة</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {backupSchedules.filter(s => s.enabled).length}
                      </p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 space-x-reverse bg-muted p-1 rounded-lg w-fit">
              <Button
                variant={activeTab === "backups" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("backups")}
              >
                النسخ الاحتياطية
              </Button>
              <Button
                variant={activeTab === "schedules" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("schedules")}
              >
                الجدولة
              </Button>
              <Button
                variant={activeTab === "restore" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("restore")}
              >
                الاستعادة
              </Button>
            </div>

            {/* Backups Tab */}
            {activeTab === "backups" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    النسخ الاحتياطية ({backupRecords.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>اسم النسخة</TableHead>
                          <TableHead>النوع</TableHead>
                          <TableHead>الحالة</TableHead>
                          <TableHead>الحجم</TableHead>
                          <TableHead>تاريخ الإنشاء</TableHead>
                          <TableHead>المدة</TableHead>
                          <TableHead>الإجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {backupRecords.map((backup) => {
                          const { date, time } = formatDateTime(backup.createdAt);
                          return (
                            <TableRow key={backup.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{backup.name}</div>
                                  {backup.description && (
                                    <div className="text-sm text-muted-foreground truncate max-w-48">
                                      {backup.description}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>{getTypeBadge(backup.type)}</TableCell>
                              <TableCell>{getStatusBadge(backup.status)}</TableCell>
                              <TableCell className="font-mono">{backup.size}</TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium text-sm">{date}</div>
                                  <div className="text-xs text-muted-foreground">{time}</div>
                                </div>
                              </TableCell>
                              <TableCell>{backup.duration}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedBackup(backup)}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  {backup.status === "completed" && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRestoreBackup(backup.id)}
                                    >
                                      <Upload className="w-4 h-4" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteBackup(backup.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Schedules Tab */}
            {activeTab === "schedules" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    جدولة النسخ الاحتياطية ({backupSchedules.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>اسم الجدولة</TableHead>
                          <TableHead>النوع</TableHead>
                          <TableHead>التكرار</TableHead>
                          <TableHead>الوقت</TableHead>
                          <TableHead>آخر تشغيل</TableHead>
                          <TableHead>التشغيل التالي</TableHead>
                          <TableHead>الاحتفاظ</TableHead>
                          <TableHead>الحالة</TableHead>
                          <TableHead>الإجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {backupSchedules.map((schedule) => {
                          const nextRun = formatDateTime(schedule.nextRun);
                          const lastRun = schedule.lastRun ? formatDateTime(schedule.lastRun) : null;
                          return (
                            <TableRow key={schedule.id}>
                              <TableCell className="font-medium">{schedule.name}</TableCell>
                              <TableCell>{getTypeBadge(schedule.type)}</TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {schedule.frequency === "daily" && "يومي"}
                                  {schedule.frequency === "weekly" && "أسبوعي"}
                                  {schedule.frequency === "monthly" && "شهري"}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-mono">{schedule.time}</TableCell>
                              <TableCell>
                                {lastRun ? (
                                  <div>
                                    <div className="text-sm">{lastRun.date}</div>
                                    <div className="text-xs text-muted-foreground">{lastRun.time}</div>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">لم يتم التشغيل</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="text-sm">{nextRun.date}</div>
                                  <div className="text-xs text-muted-foreground">{nextRun.time}</div>
                                </div>
                              </TableCell>
                              <TableCell>{schedule.retention} يوم</TableCell>
                              <TableCell>
                                <Switch
                                  checked={schedule.enabled}
                                  onCheckedChange={(checked) => handleToggleSchedule(schedule.id, checked)}
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button variant="ghost" size="sm">
                                    <Settings className="w-4 h-4" />
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
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Restore Tab */}
            {activeTab === "restore" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    استعادة البيانات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        تحذير: عملية الاستعادة ستقوم بإستبدال البيانات الحالية. تأكد من إنشاء نسخة احتياطية قبل المتابعة.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {backupRecords
                        .filter(backup => backup.status === "completed")
                        .map((backup) => {
                          const { date, time } = formatDateTime(backup.createdAt);
                          return (
                            <Card key={backup.id} className="cursor-pointer hover:shadow-md transition-shadow">
                              <CardContent className="p-6">
                                <div className="space-y-4">
                                  <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                      <h3 className="font-medium">{backup.name}</h3>
                                      <p className="text-sm text-muted-foreground">{backup.description}</p>
                                    </div>
                                    {getTypeBadge(backup.type)}
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="text-muted-foreground">الحجم: </span>
                                      <span className="font-mono">{backup.size}</span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">المدة: </span>
                                      <span>{backup.duration}</span>
                                    </div>
                                    <div className="col-span-2">
                                      <span className="text-muted-foreground">التاريخ: </span>
                                      <span>{date} - {time}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      onClick={() => handleRestoreBackup(backup.id)}
                                      className="flex-1"
                                    >
                                      <Upload className="w-4 h-4 ml-2" />
                                      استعادة
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setSelectedBackup(backup)}
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
      
      {/* Dialogs */}
      <CreateBackupDialog />
      <Dialog open={!!selectedBackup} onOpenChange={() => setSelectedBackup(null)}>
        <BackupDetailsDialog backup={selectedBackup} />
      </Dialog>
    </div>
  );
};

export default BackupRestore;