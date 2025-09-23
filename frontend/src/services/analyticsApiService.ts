import apiService from '@/services/apiService';

export interface DashboardMetrics {
  totalProducts: number;
  totalWarehouses: number;
  lowStockCount: number;
  totalInventoryValue: number;
  totalTransactions: number;
}

export interface InventoryAnalytics {
  warehouseId?: string;
  itemsInStock: number;
  lowStockItems: number;
  movementsLast30Days: number;
}

export interface WarehousePerformance {
  warehouseId: string;
  throughput: number;
  utilization: number;
  accuracy: number;
}

export interface FinancialAnalytics {
  revenue: number;
  expenses: number;
  profit: number;
}

class AnalyticsApiService {
  public async getDashboard(params?: { period?: string; warehouseId?: string }): Promise<DashboardMetrics> {
    const res = await apiService.get<DashboardMetrics>('/analytics/dashboard', params as any);
    if (res.success && res.data) return res.data;
    throw new Error(res.message || 'Failed to fetch dashboard metrics');
  }

  public async getInventory(params?: { period?: string; warehouseId?: string }): Promise<InventoryAnalytics> {
    const res = await apiService.get<InventoryAnalytics>('/analytics/inventory', params as any);
    if (res.success && res.data) return res.data;
    throw new Error(res.message || 'Failed to fetch inventory analytics');
  }

  public async getWarehouse(params?: { warehouseId: string; period?: string }): Promise<WarehousePerformance> {
    const res = await apiService.get<WarehousePerformance>('/analytics/warehouse', params as any);
    if (res.success && res.data) return res.data;
    throw new Error(res.message || 'Failed to fetch warehouse performance');
  }

  public async getFinancial(params?: { period?: string }): Promise<FinancialAnalytics> {
    const res = await apiService.get<FinancialAnalytics>('/analytics/financial', params as any);
    if (res.success && res.data) return res.data;
    throw new Error(res.message || 'Failed to fetch financial analytics');
  }

  public async getTrends(params?: { period?: string; metric?: string }): Promise<any> {
    const res = await apiService.get<any>('/analytics/trends', params as any);
    if (res.success && res.data) return res.data;
    throw new Error(res.message || 'Failed to fetch trends');
  }

  public async getForecasting(params?: { period?: string; itemId?: string }): Promise<any> {
    const res = await apiService.get<any>('/analytics/forecasting', params as any);
    if (res.success && res.data) return res.data;
    throw new Error(res.message || 'Failed to fetch forecasting');
  }

  public async createCustomReport(body: { name: string; filters: Record<string, any> }): Promise<{ reportId: string }> {
    const res = await apiService.post<{ reportId: string }>('/analytics/custom-report', body);
    if (res.success && res.data) return res.data;
    throw new Error(res.message || 'Failed to create custom report');
  }
}

export default new AnalyticsApiService(); 