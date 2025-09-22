import { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Users as UsersIcon, Shield, Mail, Phone, Eye, UserCheck, UserX } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "manager" | "employee" | "viewer";
  department: string;
  warehouse: string;
  status: "active" | "inactive" | "suspended";
  lastLogin: string;
  joinDate: string;
  avatar?: string;
  permissions: string[];
}

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");

  // بيانات وهمية للمستخدمين
  const users: User[] = [
    {
      id: "1",
      name: "أحمد محمد علي",
      email: "ahmed.mohamed@pinion-egypt.com",
      phone: "+20 12 3456 7890",
      role: "admin",
      department: "تكنولوجيا المعلومات",
      warehouse: "المخزن الرئيسي",
      status: "active",
      lastLogin: "2024-01-15 14:30",
      joinDate: "2020-01-15",
      permissions: ["read", "write", "delete", "admin", "manage_warehouse", "manage_users", "view_reports", "export_data"]
    },
    {
      id: "2",
      name: "فاطمة حسن محمود",
      email: "fatma.hassan@pinion-egypt.com",
      phone: "+20 10 9876 5432",
      role: "manager",
      department: "إدارة المخازن",
      warehouse: "المخزن المسطح",
      status: "active",
      lastLogin: "2024-01-15 12:15",
      joinDate: "2021-03-10",
      permissions: ["read", "write", "manage_warehouse"]
    },
    {
      id: "3",
      name: "محمد أحمد السيد",
      email: "mohamed.ahmed@pinion-egypt.com",
      phone: "+20 11 2468 1357",
      role: "manager",
      department: "إدارة المخازن",
      warehouse: "مخزن الدرفلة",
      status: "active",
      lastLogin: "2024-01-15 10:45",
      joinDate: "2022-06-20",
      permissions: ["read", "write", "manage_warehouse"]
    },
    {
      id: "4",
      name: "سارة عبد الرحمن",
      email: "sara.abdelrahman@pinion-egypt.com",
      phone: "+20 15 7531 9642",
      role: "employee",
      department: "المخزون",
      warehouse: "مخزن ستيل",
      status: "active",
      lastLogin: "2024-01-15 09:20",
      joinDate: "2023-02-14",
      permissions: ["read", "write"]
    },
    {
      id: "5",
      name: "عبد الله محمد نور",
      email: "abdullah.mohamed@pinion-egypt.com",
      phone: "+20 12 8642 9753",
      role: "employee",
      department: "المخزون",
      warehouse: "مخزن العربية للأسمنت",
      status: "suspended",
      lastLogin: "2024-01-10 16:30",
      joinDate: "2023-08-05",
      permissions: ["read"]
    },
    {
      id: "6",
      name: "نور الدين أحمد",
      email: "noureldeen.ahmed@pinion-egypt.com",
      phone: "+20 10 1234 5678",
      role: "viewer",
      department: "المحاسبة",
      warehouse: "المخزن الرئيسي - القاهرة",
      status: "active",
      lastLogin: "2024-01-14 11:00",
      joinDate: "2023-11-01",
      permissions: ["read"]
    },
    {
      id: "7",
      name: "مريم سعد الدين",
      email: "mariam.saad@pinion-egypt.com",
      phone: "+20 11 9876 5432",
      role: "employee",
      department: "المبيعات",
      warehouse: "المخزن المسطح",
      status: "inactive",
      lastLogin: "2024-01-05 08:45",
      joinDate: "2022-09-15",
      permissions: ["read", "write"]
    }
  ];

  const departments = ["تكنولوجيا المعلومات", "إدارة المخازن", "المخزون", "المحاسبة", "المبيعات", "الموارد البشرية"];
  const warehouses = ["المخزن الرئيسي", "المخزن المسطح", "مخزن الدرفلة", "مخزن ستيل", "مخزن العربية للأسمنت", "مخزن غبور"];
  const allPermissions = [
    { id: "read", label: "قراءة البيانات" },
    { id: "write", label: "كتابة وتعديل البيانات" },
    { id: "delete", label: "حذف البيانات" },
    { id: "manage_warehouse", label: "إدارة المخازن" },
    { id: "manage_users", label: "إدارة المستخدمين" },
    { id: "view_reports", label: "عرض التقارير" },
    { id: "export_data", label: "تصدير البيانات" },
    { id: "admin", label: "صلاحيات المدير العام" }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    const matchesDepartment = filterDepartment === "all" || user.department === filterDepartment;
    return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">مدير عام</Badge>;
      case "manager":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">مدير</Badge>;
      case "employee":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">موظف</Badge>;
      case "viewer":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">مشاهد</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">نشط</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">غير نشط</Badge>;
      case "suspended":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">موقوف</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const UserDialog = ({ user, isOpen, onClose, mode }: {
    user: User | null;
    isOpen: boolean;
    onClose: () => void;
    mode: "add" | "edit" | "view";
  }) => {
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(user?.permissions || []);

    const handlePermissionChange = (permissionId: string, checked: boolean) => {
      if (checked) {
        setSelectedPermissions([...selectedPermissions, permissionId]);
      } else {
        setSelectedPermissions(selectedPermissions.filter(p => p !== permissionId));
      }
    };

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {mode === "add" && "إضافة مستخدم جديد"}
              {mode === "edit" && "تعديل بيانات المستخدم"}
              {mode === "view" && "تفاصيل المستخدم"}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">البيانات الأساسية</TabsTrigger>
              <TabsTrigger value="work">بيانات العمل</TabsTrigger>
              <TabsTrigger value="permissions">الصلاحيات</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم الكامل</Label>
                  <Input
                    id="name"
                    defaultValue={user?.name || ""}
                    disabled={mode === "view"}
                    placeholder="أدخل الاسم الكامل"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user?.email || ""}
                    disabled={mode === "view"}
                    placeholder="أدخل البريد الإلكتروني"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    defaultValue={user?.phone || ""}
                    disabled={mode === "view"}
                    placeholder="أدخل رقم الهاتف"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">الحالة</Label>
                  <Select defaultValue={user?.status || ""} disabled={mode === "view"}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="inactive">غير نشط</SelectItem>
                      <SelectItem value="suspended">موقوف</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="work" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">الدور الوظيفي</Label>
                  <Select defaultValue={user?.role || ""} disabled={mode === "view"}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الدور الوظيفي" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">مدير عام</SelectItem>
                      <SelectItem value="manager">مدير</SelectItem>
                      <SelectItem value="employee">موظف</SelectItem>
                      <SelectItem value="viewer">مشاهد</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">القسم</Label>
                  <Select defaultValue={user?.department || ""} disabled={mode === "view"}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر القسم" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="warehouse">المخزن المسؤول عنه</Label>
                <Select defaultValue={user?.warehouse || ""} disabled={mode === "view"}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المخزن" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map(warehouse => (
                      <SelectItem key={warehouse} value={warehouse}>{warehouse}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {mode === "view" && user && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label>تاريخ الانضمام</Label>
                    <div className="text-sm text-muted-foreground">
                      {new Date(user.joinDate).toLocaleDateString('ar-EG')}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>آخر تسجيل دخول</Label>
                    <div className="text-sm text-muted-foreground">
                      {user.lastLogin}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="permissions" className="space-y-4">
              <div className="space-y-4">
                <Label>الصلاحيات المتاحة</Label>
                <div className="grid grid-cols-2 gap-4">
                  {allPermissions.map(permission => (
                    <div key={permission.id} className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox
                        id={permission.id}
                        checked={selectedPermissions.includes(permission.id)}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(permission.id, checked as boolean)
                        }
                        disabled={mode === "view"}
                      />
                      <Label htmlFor={permission.id} className="text-sm">
                        {permission.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          {mode !== "view" && (
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={onClose}>
                إلغاء
              </Button>
              <Button>
                {mode === "add" ? "إضافة المستخدم" : "حفظ التغييرات"}
              </Button>
            </div>
          )}
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
                <h1 className="text-3xl font-bold text-foreground">إدارة المستخدمين</h1>
                <p className="text-muted-foreground mt-1">
                  إدارة المستخدمين وصلاحياتهم في النظام
                </p>
              </div>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة مستخدم جديد
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">إجمالي المستخدمين</p>
                      <p className="text-2xl font-bold">{users.length}</p>
                    </div>
                    <UsersIcon className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">المستخدمين النشطين</p>
                      <p className="text-2xl font-bold text-green-600">
                        {users.filter(u => u.status === "active").length}
                      </p>
                    </div>
                    <UserCheck className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">المديرين</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {users.filter(u => u.role === "admin" || u.role === "manager").length}
                      </p>
                    </div>
                    <Shield className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">المستخدمين المعلقين</p>
                      <p className="text-2xl font-bold text-red-600">
                        {users.filter(u => u.status === "suspended").length}
                      </p>
                    </div>
                    <UserX className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Search */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="البحث في المستخدمين..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pr-10"
                      />
                    </div>
                  </div>
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="تصفية حسب الدور" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأدوار</SelectItem>
                      <SelectItem value="admin">مدير عام</SelectItem>
                      <SelectItem value="manager">مدير</SelectItem>
                      <SelectItem value="employee">موظف</SelectItem>
                      <SelectItem value="viewer">مشاهد</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="تصفية حسب الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="inactive">غير نشط</SelectItem>
                      <SelectItem value="suspended">موقوف</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="تصفية حسب القسم" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأقسام</SelectItem>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UsersIcon className="w-5 h-5" />
                  قائمة المستخدمين ({filteredUsers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>المستخدم</TableHead>
                        <TableHead>البريد الإلكتروني</TableHead>
                        <TableHead>الهاتف</TableHead>
                        <TableHead>الدور</TableHead>
                        <TableHead>القسم</TableHead>
                        <TableHead>المخزن</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>آخر تسجيل دخول</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  انضم في {new Date(user.joinDate).toLocaleDateString('ar-EG')}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              {user.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              {user.phone}
                            </div>
                          </TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell>{user.department}</TableCell>
                          <TableCell className="max-w-32 truncate">{user.warehouse}</TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {user.lastLogin}
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
                                    setSelectedUser(user);
                                    setIsViewDialogOpen(true);
                                  }}
                                >
                                  <Eye className="w-4 h-4 ml-2" />
                                  عرض التفاصيل
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setIsEditDialogOpen(true);
                                  }}
                                >
                                  <Edit className="w-4 h-4 ml-2" />
                                  تعديل
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="w-4 h-4 ml-2" />
                                  حذف
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Dialogs */}
      <UserDialog
        user={null}
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        mode="add"
      />
      <UserDialog
        user={selectedUser}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedUser(null);
        }}
        mode="edit"
      />
      <UserDialog
        user={selectedUser}
        isOpen={isViewDialogOpen}
        onClose={() => {
          setIsViewDialogOpen(false);
          setSelectedUser(null);
        }}
        mode="view"
      />
    </div>
  );
};

export default Users;