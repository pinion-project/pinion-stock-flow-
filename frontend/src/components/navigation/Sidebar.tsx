import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Permission } from "@/types/auth";
import { 
  LayoutDashboard, 
  Building2, 
  Package, 
  BarChart3, 
  ArrowRightLeft, 
  Users, 
  Settings,
  ChevronRight,
  Menu,
  X,
  FileText,
  Database,
  User,
  Shield,
  HardDrive,
  Bell,
  ShoppingCart,
  TrendingUp
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

const menuItems = [
  {
    title: "لوحة التحكم",
    icon: LayoutDashboard,
    href: "/dashboard",
    permissions: [] // متاح للجميع
  },
  {
    title: "المنتجات",
    icon: Package,
    href: "/products",
    badge: "1,245",
    permissions: [Permission.MANAGE_PRODUCTS, Permission.VIEW_ALL_PRODUCTS]
  },
  {
    title: "اقتراحات الشراء",
    icon: ShoppingCart,
    href: "/purchase-suggestions",
    badge: "5",
    permissions: [Permission.VIEW_PURCHASE_SUGGESTIONS]
  },
  {
    title: "تقارير المخزون",
    icon: TrendingUp,
    href: "/inventory-reports",
    permissions: [Permission.VIEW_PURCHASE_REPORTS, Permission.VIEW_WAREHOUSE_REPORTS]
  },
  {
    title: "المخازن",
    icon: Building2,
    href: "/warehouses",
    badge: "12",
    permissions: [Permission.VIEW_ALL_WAREHOUSES, Permission.VIEW_OWN_WAREHOUSE]
  },
  {
    title: "المخزون",
    icon: ArrowRightLeft,
    href: "/inventory",
    permissions: [Permission.MANAGE_INVENTORY]
  },
  {
    title: "التقارير",
    icon: FileText,
    href: "/reports",
    permissions: [Permission.VIEW_SYSTEM_REPORTS, Permission.VIEW_WAREHOUSE_REPORTS, Permission.VIEW_PURCHASE_REPORTS]
  },
  {
    title: "التحليلات",
    icon: BarChart3,
    href: "/analytics",
    permissions: [Permission.VIEW_SYSTEM_REPORTS]
  },
  {
    title: "إدارة المستخدمين",
    icon: Users,
    href: "/users",
    permissions: [Permission.MANAGE_USERS]
  },
  {
    title: "الملف الشخصي",
    icon: User,
    href: "/profile",
    permissions: [] // متاح للجميع
  },
  {
    title: "سجلات التدقيق",
    icon: Shield,
    href: "/audit-logs",
    permissions: [Permission.VIEW_AUDIT_LOGS]
  },
  {
    title: "النسخ الاحتياطي",
    icon: HardDrive,
    href: "/backup-restore",
    permissions: [Permission.MANAGE_BACKUP_RESTORE]
  },
  {
    title: "إدارة البيانات",
    icon: Database,
    href: "/data-management",
    permissions: [Permission.MANAGE_SYSTEM_SETTINGS]
  },
  {
    title: "الإشعارات",
    icon: Bell,
    href: "/notifications",
    badge: "5",
    permissions: [] // متاح للجميع
  },
  {
    title: "الإعدادات",
    icon: Settings,
    href: "/settings",
    permissions: [Permission.MANAGE_SYSTEM_SETTINGS]
  }
];

const Sidebar = ({ className }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { hasPermission } = useAuth();

  // تصفية العناصر بناءً على الصلاحيات
  const filteredMenuItems = menuItems.filter(item => {
    // إذا لم تكن هناك صلاحيات مطلوبة، فالعنصر متاح للجميع
    if (item.permissions.length === 0) {
      return true;
    }
    // التحقق من وجود أي من الصلاحيات المطلوبة
    return item.permissions.some(permission => hasPermission(permission));
  });

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-3 right-3 z-50">
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm shadow-md"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className={cn(
        "bg-card border-l border-border shadow-soft transition-all duration-300",
        "lg:translate-x-0 lg:static lg:z-auto",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        "fixed inset-y-0 right-0 z-50 lg:relative lg:inset-auto",
        isCollapsed ? "w-14 sm:w-16" : "w-72 sm:w-64",
        "max-w-[85vw] sm:max-w-none",
        className
      )}>
      {/* Toggle Button */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border">
        {!isCollapsed && (
          <h2 className="text-base sm:text-lg font-semibold text-foreground truncate">القائمة الرئيسية</h2>
        )}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden h-7 w-7 sm:h-8 sm:w-8 p-0"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex h-7 w-7 sm:h-8 sm:w-8 p-0"
          >
            {isCollapsed ? <Menu className="h-3 w-3 sm:h-4 sm:w-4" /> : <X className="h-3 w-3 sm:h-4 sm:w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-2 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto max-h-[calc(100vh-80px)]">
        {filteredMenuItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link key={item.href} to={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start h-10 sm:h-12 transition-all duration-200 text-sm sm:text-base",
                  isCollapsed ? "px-1 sm:px-2" : "px-2 sm:px-4",
                  isActive && "bg-primary text-primary-foreground"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="mr-2 sm:mr-3 text-right flex-1 truncate">{item.title}</span>
                    {item.badge && (
                      <span className="bg-accent text-accent-foreground text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex-shrink-0">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 opacity-50 flex-shrink-0" />
                  </>
                )}
              </Button>
            </Link>
          );
        })}
      </nav>
    </div>
    </>
  );
};

export default Sidebar;