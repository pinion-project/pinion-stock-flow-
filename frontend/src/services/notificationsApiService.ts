import apiService from '@/services/apiService';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'inventory' | 'system' | 'user' | 'report' | 'general';
  createdAt: string;
  read: boolean;
  starred?: boolean;
  archived?: boolean;
}

export interface NotificationSettingsDTO {
  emailNotifications: boolean;
  pushNotifications: boolean;
  lowStockAlerts: boolean;
  systemUpdates: boolean;
}

class NotificationsApiService {
  public async list(params?: { page?: number; limit?: number; type?: string; category?: string; read?: boolean }): Promise<NotificationItem[]> {
    const res = await apiService.get<NotificationItem[]>('/notifications', params as any);
    if (res.success && res.data) return res.data;
    throw new Error(res.message || 'Failed to fetch notifications');
  }

  public async markRead(id: string): Promise<void> {
    const res = await apiService.put(`/notifications/${id}/read`);
    if (!res.success) throw new Error(res.message || 'Failed to mark as read');
  }

  public async markUnread(id: string): Promise<void> {
    const res = await apiService.put(`/notifications/${id}/unread`);
    if (!res.success) throw new Error(res.message || 'Failed to mark as unread');
  }

  public async delete(id: string): Promise<void> {
    const res = await apiService.delete(`/notifications/${id}`);
    if (!res.success) throw new Error(res.message || 'Failed to delete notification');
  }

  public async markAllRead(): Promise<void> {
    const res = await apiService.put('/notifications/read-all');
    if (!res.success) throw new Error(res.message || 'Failed to mark all as read');
  }

  public async getSettings(): Promise<NotificationSettingsDTO> {
    const res = await apiService.get<NotificationSettingsDTO>('/notifications/settings');
    if (res.success && res.data) return res.data;
    throw new Error(res.message || 'Failed to get notification settings');
  }

  public async updateSettings(settings: NotificationSettingsDTO): Promise<NotificationSettingsDTO> {
    const res = await apiService.put<NotificationSettingsDTO>('/notifications/settings', settings);
    if (res.success && res.data) return res.data;
    throw new Error(res.message || 'Failed to update notification settings');
  }
}

export default new NotificationsApiService(); 