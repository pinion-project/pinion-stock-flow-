export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  warehouseId?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  GENERAL_MANAGER = 'GENERAL_MANAGER',
  WAREHOUSE_MANAGER = 'WAREHOUSE_MANAGER',
  PURCHASING_MANAGER = 'PURCHASING_MANAGER'
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export interface JWTPayload {
  userId: string;
  username: string;
  role: UserRole;
  warehouseId?: string;
  iat?: number;
  exp?: number;
}
