// أنواع البيانات للمصادقة والتفويض

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  warehouseId?: string; // للمدير المخزن فقط
  permissions: Permission[];
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  GENERAL_MANAGER = 'general_manager',
  WAREHOUSE_MANAGER = 'warehouse_manager',
  PURCHASING_MANAGER = 'purchasing_manager'
}

export enum Permission {
  // صلاحيات المدير العام
  VIEW_ALL_WAREHOUSES = 'view_all_warehouses',
  MANAGE_ALL_WAREHOUSES = 'manage_all_warehouses',
  MANAGE_USERS = 'manage_users',
  VIEW_SYSTEM_REPORTS = 'view_system_reports',
  MANAGE_SYSTEM_SETTINGS = 'manage_system_settings',
  VIEW_AUDIT_LOGS = 'view_audit_logs',
  MANAGE_BACKUP_RESTORE = 'manage_backup_restore',
  
  // صلاحيات مدير المخزن
  VIEW_OWN_WAREHOUSE = 'view_own_warehouse',
  MANAGE_OWN_WAREHOUSE = 'manage_own_warehouse',
  MANAGE_INVENTORY = 'manage_inventory',
  VIEW_WAREHOUSE_REPORTS = 'view_warehouse_reports',
  MANAGE_PRODUCTS = 'manage_products',
  
  // صلاحيات مدير المشتريات
  VIEW_ALL_PRODUCTS = 'view_all_products',
  MANAGE_PURCHASE_ORDERS = 'manage_purchase_orders',
  VIEW_PURCHASE_SUGGESTIONS = 'view_purchase_suggestions',
  MANAGE_SUPPLIERS = 'manage_suppliers',
  VIEW_PURCHASE_REPORTS = 'view_purchase_reports',
  APPROVE_PURCHASE_ORDERS = 'approve_purchase_orders',
  MANAGE_PRODUCT_PRICING = 'manage_product_pricing',
  
  // صلاحيات البيانات الحساسة
  VIEW_PURCHASE_PRICES = 'view_purchase_prices',
  VIEW_SALE_PRICES = 'view_sale_prices',
  VIEW_PROFIT_MARGINS = 'view_profit_margins',
  VIEW_TOTAL_VALUES = 'view_total_values',
  VIEW_SUPPLIER_INFO = 'view_supplier_info'
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: UserRole) => boolean;
  canAccessWarehouse: (warehouseId: string) => boolean;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  managerId?: string;
  capacity: number;
  currentStock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}