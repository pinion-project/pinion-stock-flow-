import { LoginCredentials, LoginResponse, User, UserRole, Permission } from '@/types/auth';

// محاكاة قاعدة البيانات للمستخدمين
const mockUsers: User[] = [
  {
    id: '1',
    username: 'general_manager',
    email: 'manager@pinion-egypt.com',
    fullName: 'أحمد محمد المدير العام',
    role: UserRole.GENERAL_MANAGER,
    permissions: [
      Permission.VIEW_ALL_WAREHOUSES,
      Permission.MANAGE_ALL_WAREHOUSES,
      Permission.MANAGE_USERS,
      Permission.VIEW_SYSTEM_REPORTS,
      Permission.MANAGE_SYSTEM_SETTINGS,
      Permission.VIEW_AUDIT_LOGS,
      Permission.MANAGE_BACKUP_RESTORE,
      Permission.VIEW_OWN_WAREHOUSE,
      Permission.MANAGE_OWN_WAREHOUSE,
      Permission.MANAGE_INVENTORY,
      Permission.VIEW_WAREHOUSE_REPORTS,
      Permission.MANAGE_PRODUCTS,
      // صلاحيات البيانات الحساسة للمدير العام
      Permission.VIEW_PURCHASE_PRICES,
      Permission.VIEW_SALE_PRICES,
      Permission.VIEW_PROFIT_MARGINS,
      Permission.VIEW_TOTAL_VALUES,
      Permission.VIEW_SUPPLIER_INFO
    ],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: '2',
    username: 'warehouse_manager_1',
    email: 'warehouse1@pinion-egypt.com',
    fullName: 'سارة أحمد مدير المخزن الأول',
    role: UserRole.WAREHOUSE_MANAGER,
    warehouseId: 'warehouse_1',
    permissions: [
      Permission.VIEW_OWN_WAREHOUSE,
      Permission.MANAGE_OWN_WAREHOUSE,
      Permission.MANAGE_INVENTORY,
      Permission.VIEW_WAREHOUSE_REPORTS,
      Permission.MANAGE_PRODUCTS
    ],
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date()
  },
  {
    id: '3',
    username: 'warehouse_manager_2',
    email: 'warehouse2@pinion-egypt.com',
    fullName: 'محمد علي مدير المخزن الثاني',
    role: UserRole.WAREHOUSE_MANAGER,
    warehouseId: 'warehouse_2',
    permissions: [
      Permission.VIEW_OWN_WAREHOUSE,
      Permission.MANAGE_OWN_WAREHOUSE,
      Permission.MANAGE_INVENTORY,
      Permission.VIEW_WAREHOUSE_REPORTS,
      Permission.MANAGE_PRODUCTS
    ],
    isActive: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date()
  },
  {
    id: '4',
    username: 'warehouse_manager_3',
    email: 'warehouse3@pinion-egypt.com',
    fullName: 'فاطمة محمد مدير مخزن الدرفلة',
    role: UserRole.WAREHOUSE_MANAGER,
    warehouseId: 'warehouse_3',
    permissions: [
      Permission.VIEW_OWN_WAREHOUSE,
      Permission.MANAGE_OWN_WAREHOUSE,
      Permission.MANAGE_INVENTORY,
      Permission.VIEW_WAREHOUSE_REPORTS,
      Permission.MANAGE_PRODUCTS
    ],
    isActive: true,
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date()
  },
  {
    id: '5',
    username: 'warehouse_manager_4',
    email: 'warehouse4@pinion-egypt.com',
    fullName: 'عمر حسن مدير مخزن ستيل',
    role: UserRole.WAREHOUSE_MANAGER,
    warehouseId: 'warehouse_4',
    permissions: [
      Permission.VIEW_OWN_WAREHOUSE,
      Permission.MANAGE_OWN_WAREHOUSE,
      Permission.MANAGE_INVENTORY,
      Permission.VIEW_WAREHOUSE_REPORTS,
      Permission.MANAGE_PRODUCTS
    ],
    isActive: true,
    createdAt: new Date('2024-01-24'),
    updatedAt: new Date()
  },
  {
    id: '6',
    username: 'warehouse_manager_5',
    email: 'warehouse5@pinion-egypt.com',
    fullName: 'نورا أحمد مدير مخزن العربية للأسمنت',
    role: UserRole.WAREHOUSE_MANAGER,
    warehouseId: 'warehouse_5',
    permissions: [
      Permission.VIEW_OWN_WAREHOUSE,
      Permission.MANAGE_OWN_WAREHOUSE,
      Permission.MANAGE_INVENTORY,
      Permission.VIEW_WAREHOUSE_REPORTS,
      Permission.MANAGE_PRODUCTS
    ],
    isActive: true,
    createdAt: new Date('2024-01-26'),
    updatedAt: new Date()
  },
  {
    id: '7',
    username: 'warehouse_manager_6',
    email: 'warehouse6@pinion-egypt.com',
    fullName: 'يوسف علي مدير مخزن غبور',
    role: UserRole.WAREHOUSE_MANAGER,
    warehouseId: 'warehouse_6',
    permissions: [
      Permission.VIEW_OWN_WAREHOUSE,
      Permission.MANAGE_OWN_WAREHOUSE,
      Permission.MANAGE_INVENTORY,
      Permission.VIEW_WAREHOUSE_REPORTS,
      Permission.MANAGE_PRODUCTS
    ],
    isActive: true,
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date()
  },
  {
    id: '8',
    username: 'purchasing_manager',
    email: 'purchasing@pinion-egypt.com',
    fullName: 'خالد أحمد مدير المشتريات',
    role: UserRole.PURCHASING_MANAGER,
    permissions: [
      Permission.VIEW_ALL_PRODUCTS,
      Permission.MANAGE_PURCHASE_ORDERS,
      Permission.VIEW_PURCHASE_SUGGESTIONS,
      Permission.MANAGE_SUPPLIERS,
      Permission.VIEW_PURCHASE_REPORTS,
      Permission.APPROVE_PURCHASE_ORDERS,
      Permission.MANAGE_PRODUCT_PRICING,
      Permission.VIEW_ALL_WAREHOUSES,
      Permission.MANAGE_INVENTORY,
      Permission.VIEW_WAREHOUSE_REPORTS,
      Permission.MANAGE_PRODUCTS,
      // صلاحيات البيانات الحساسة لمدير المشتريات
      Permission.VIEW_PURCHASE_PRICES,
      Permission.VIEW_SALE_PRICES,
      Permission.VIEW_PROFIT_MARGINS,
      Permission.VIEW_TOTAL_VALUES,
      Permission.VIEW_SUPPLIER_INFO
    ],
    isActive: true,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date()
  }
];

// كلمات المرور الافتراضية (في التطبيق الحقيقي، ستكون مشفرة)
const mockPasswords: Record<string, string> = {
  'general_manager': 'admin123',
  'warehouse_manager_1': 'warehouse1',
  'warehouse_manager_2': 'warehouse2',
  'warehouse_manager_3': 'warehouse3',
  'warehouse_manager_4': 'warehouse4',
  'warehouse_manager_5': 'warehouse5',
  'warehouse_manager_6': 'warehouse6',
  'purchasing_manager': 'purchase123'
};

class AuthService {
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // تسجيل الدخول
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    await this.delay(1000); // محاكاة تأخير الشبكة

    const user = mockUsers.find(u => u.username === credentials.username);
    
    if (!user) {
      throw new Error('اسم المستخدم غير موجود');
    }

    if (!user.isActive) {
      throw new Error('الحساب غير مفعل');
    }

    const expectedPassword = mockPasswords[credentials.username];
    if (credentials.password !== expectedPassword) {
      throw new Error('كلمة المرور غير صحيحة');
    }

    // تحديث آخر تسجيل دخول
    user.lastLogin = new Date();
    user.updatedAt = new Date();

    // إنشاء رمز مميز وهمي
    const token = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      user,
      token,
      refreshToken
    };
  }

  // الحصول على المستخدم الحالي
  async getCurrentUser(): Promise<User> {
    await this.delay(500);
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('لا يوجد رمز مصادقة');
    }

    try {
      const payload = this.decodeToken(token);
      const user = mockUsers.find(u => u.id === payload.userId);
      
      if (!user || !user.isActive) {
        throw new Error('المستخدم غير موجود أو غير مفعل');
      }

      return user;
    } catch (error) {
      throw new Error('رمز المصادقة غير صالح');
    }
  }

  // تجديد الرمز المميز
  async refreshToken(): Promise<string> {
    await this.delay(500);
    
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('لا يوجد رمز تجديد');
    }

    try {
      const payload = this.decodeToken(refreshToken);
      const user = mockUsers.find(u => u.id === payload.userId);
      
      if (!user || !user.isActive) {
        throw new Error('المستخدم غير موجود أو غير مفعل');
      }

      return this.generateToken(user);
    } catch (error) {
      throw new Error('رمز التجديد غير صالح');
    }
  }

  // الحصول على جميع المستخدمين (للمدير العام فقط)
  async getAllUsers(): Promise<User[]> {
    await this.delay(800);
    return mockUsers.filter(user => user.isActive);
  }

  // إنشاء مستخدم جديد
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    await this.delay(1000);
    
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockUsers.push(newUser);
    return newUser;
  }

  // تحديث مستخدم
  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    await this.delay(800);
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('المستخدم غير موجود');
    }

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...updates,
      updatedAt: new Date()
    };

    return mockUsers[userIndex];
  }

  // حذف مستخدم (إلغاء تفعيل)
  async deleteUser(userId: string): Promise<void> {
    await this.delay(500);
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('المستخدم غير موجود');
    }

    mockUsers[userIndex].isActive = false;
    mockUsers[userIndex].updatedAt = new Date();
  }

  // إنشاء رمز مميز وهمي
  private generateToken(user: User): string {
    const payload = {
      userId: user.id,
      username: user.username,
      role: user.role,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 ساعة
    };
    return btoa(JSON.stringify(payload));
  }

  // إنشاء رمز تجديد وهمي
  private generateRefreshToken(user: User): string {
    const payload = {
      userId: user.id,
      type: 'refresh',
      exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 أيام
    };
    return btoa(JSON.stringify(payload));
  }

  // فك تشفير الرمز المميز
  private decodeToken(token: string): any {
    try {
      const payload = JSON.parse(atob(token));
      
      // التحقق من انتهاء الصلاحية
      if (payload.exp < Date.now()) {
        throw new Error('انتهت صلاحية الرمز المميز');
      }
      
      return payload;
    } catch (error) {
      throw new Error('رمز مميز غير صالح');
    }
  }
}

export const authService = new AuthService();