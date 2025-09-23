import apiService from './apiService';
import { LoginCredentials, LoginResponse, User } from '@/types/auth';

class AuthApiService {
  public async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiService.post<LoginResponse>('/auth/login', credentials);
    if (response.success && response.data) {
      apiService.setToken(response.data.token);
      if (response.data.refreshToken) localStorage.setItem('refresh_token', response.data.refreshToken);
      return response.data;
    }
    throw new Error(response.message || 'Login failed');
  }

  public async logout(): Promise<void> {
    try { await apiService.post('/auth/logout'); } catch {}
    apiService.setToken(null);
    localStorage.removeItem('refresh_token');
  }

  public async refreshToken(): Promise<LoginResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) throw new Error('No refresh token');
    const response = await apiService.post<LoginResponse>('/auth/refresh', { refreshToken });
    if (response.success && response.data) {
      apiService.setToken(response.data.token);
      if (response.data.refreshToken) localStorage.setItem('refresh_token', response.data.refreshToken);
      return response.data;
    }
    throw new Error(response.message || 'Token refresh failed');
  }

  public async getCurrentUser(): Promise<User> {
    const response = await apiService.get<User>('/auth/me');
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Failed to get current user');
  }
}

export default new AuthApiService();
