import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, Permission } from '@/types/auth';
import { LoadingSpinner } from '@/components/ui/loading';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: Permission;
  warehouseId?: string;
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPermission,
  warehouseId,
  fallbackPath = '/login'
}) => {
  const { isAuthenticated, isLoading, user, hasRole, hasPermission, canAccessWarehouse } = useAuth();
  const location = useLocation();

  // عرض شاشة التحميل أثناء التحقق من المصادقة
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // إعادة توجيه لصفحة تسجيل الدخول إذا لم يكن مصادق عليه
  if (!isAuthenticated || !user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // التحقق من الدور المطلوب
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert className="max-w-md">
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-center">
            ليس لديك الصلاحية للوصول إلى هذه الصفحة.
            <br />
            الدور المطلوب: {getRoleDisplayName(requiredRole)}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // التحقق من الصلاحية المطلوبة
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert className="max-w-md">
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-center">
            ليس لديك الصلاحية للوصول إلى هذه الصفحة.
            <br />
            الصلاحية المطلوبة: {getPermissionDisplayName(requiredPermission)}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // التحقق من إمكانية الوصول للمخزن
  if (warehouseId && !canAccessWarehouse(warehouseId)) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert className="max-w-md">
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-center">
            ليس لديك الصلاحية للوصول إلى هذا المخزن.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
};

// دالة مساعدة لعرض اسم الدور
function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case UserRole.GENERAL_MANAGER:
      return 'المدير العام';
    case UserRole.WAREHOUSE_MANAGER:
      return 'مدير المخزن';
    default:
      return role;
  }
}

// دالة مساعدة لعرض اسم الصلاحية
function getPermissionDisplayName(permission: Permission): string {
  switch (permission) {
    case Permission.VIEW_ALL_WAREHOUSES:
      return 'عرض جميع المخازن';
    case Permission.MANAGE_ALL_WAREHOUSES:
      return 'إدارة جميع المخازن';
    case Permission.MANAGE_USERS:
      return 'إدارة المستخدمين';
    case Permission.VIEW_SYSTEM_REPORTS:
      return 'عرض تقارير النظام';
    case Permission.MANAGE_SYSTEM_SETTINGS:
      return 'إدارة إعدادات النظام';
    case Permission.VIEW_AUDIT_LOGS:
      return 'عرض سجلات التدقيق';
    case Permission.MANAGE_BACKUP_RESTORE:
      return 'إدارة النسخ الاحتياطي';
    case Permission.VIEW_OWN_WAREHOUSE:
      return 'عرض المخزن الخاص';
    case Permission.MANAGE_OWN_WAREHOUSE:
      return 'إدارة المخزن الخاص';
    case Permission.MANAGE_INVENTORY:
      return 'إدارة المخزون';
    case Permission.VIEW_WAREHOUSE_REPORTS:
      return 'عرض تقارير المخزن';
    case Permission.MANAGE_PRODUCTS:
      return 'إدارة المنتجات';
    default:
      return permission;
  }
}