import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, AuthContextType, User, LoginCredentials, UserRole, Permission } from '@/types/auth';
import { authService } from '@/services/authService';
import { toast } from 'sonner';

// حالة المصادقة الأولية
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// أنواع الإجراءات
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR_ERROR' };

// مخفض الحالة
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// إنشاء السياق
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// مزود السياق
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // تحقق من الجلسة عند تحميل التطبيق
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const user = await authService.getCurrentUser();
          dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuthStatus();
  }, []);

  // دالة تسجيل الدخول
  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const response = await authService.login(credentials);
      
      // حفظ الرموز المميزة
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
      toast.success('تم تسجيل الدخول بنجاح');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'فشل في تسجيل الدخول';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  // دالة تسجيل الخروج
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    dispatch({ type: 'LOGOUT' });
    toast.success('تم تسجيل الخروج بنجاح');
  };

  // التحقق من الصلاحية
  const hasPermission = (permission: Permission): boolean => {
    if (!state.user) return false;
    return state.user.permissions.includes(permission);
  };

  // التحقق من الدور
  const hasRole = (role: UserRole): boolean => {
    if (!state.user) return false;
    return state.user.role === role;
  };

  // التحقق من إمكانية الوصول للمخزن
  const canAccessWarehouse = (warehouseId: string): boolean => {
    if (!state.user) return false;
    
    // المدير العام يمكنه الوصول لجميع المخازن
    if (state.user.role === UserRole.GENERAL_MANAGER) {
      return true;
    }
    
    // مدير المشتريات يمكنه الوصول لجميع المخازن
    if (state.user.role === UserRole.PURCHASING_MANAGER) {
      return true;
    }
    
    // مدير المخزن يمكنه الوصول لمخزنه فقط
    if (state.user.role === UserRole.WAREHOUSE_MANAGER) {
      return state.user.warehouseId === warehouseId;
    }
    
    return false;
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    hasPermission,
    hasRole,
    canAccessWarehouse
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// خطاف لاستخدام السياق
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};