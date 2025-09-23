import apiService from '@/services/apiService';

export interface PurchaseOrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface PurchaseOrderDTO {
  id: string;
  supplierId: string;
  warehouseId: string;
  status: 'pending' | 'approved' | 'received' | 'cancelled';
  items: PurchaseOrderItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

class PurchaseOrdersApiService {
  public async list(params?: { page?: number; limit?: number; status?: string; supplierId?: string }): Promise<PurchaseOrderDTO[]> {
    const res = await apiService.get<PurchaseOrderDTO[]>('/purchase-orders', params as any);
    if (res.success && res.data) return res.data;
    throw new Error(res.message || 'Failed to fetch purchase orders');
  }

  public async getById(id: string): Promise<PurchaseOrderDTO> {
    const res = await apiService.get<PurchaseOrderDTO>(`/purchase-orders/${id}`);
    if (res.success && res.data) return res.data;
    throw new Error(res.message || 'Failed to fetch purchase order');
  }

  public async create(body: Omit<PurchaseOrderDTO, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'totalAmount'>): Promise<PurchaseOrderDTO> {
    const res = await apiService.post<PurchaseOrderDTO>('/purchase-orders', body);
    if (res.success && res.data) return res.data;
    throw new Error(res.message || 'Failed to create purchase order');
  }

  public async update(id: string, body: Partial<PurchaseOrderDTO>): Promise<PurchaseOrderDTO> {
    const res = await apiService.put<PurchaseOrderDTO>(`/purchase-orders/${id}`, body);
    if (res.success && res.data) return res.data;
    throw new Error(res.message || 'Failed to update purchase order');
  }

  public async delete(id: string): Promise<void> {
    const res = await apiService.delete(`/purchase-orders/${id}`);
    if (!res.success) throw new Error(res.message || 'Failed to delete purchase order');
  }

  public async approve(id: string): Promise<PurchaseOrderDTO> {
    const res = await apiService.post<PurchaseOrderDTO>(`/purchase-orders/${id}/approve`);
    if (res.success && res.data) return res.data;
    throw new Error(res.message || 'Failed to approve purchase order');
  }

  public async receive(id: string): Promise<PurchaseOrderDTO> {
    const res = await apiService.post<PurchaseOrderDTO>(`/purchase-orders/${id}/receive`);
    if (res.success && res.data) return res.data;
    throw new Error(res.message || 'Failed to mark purchase order as received');
  }

  public async suggestions(): Promise<any[]> {
    const res = await apiService.get<any[]>('/purchase-orders/suggestions');
    if (res.success && res.data) return res.data;
    throw new Error(res.message || 'Failed to fetch suggestions');
  }

  public async reports(params?: { period?: string; supplierId?: string }): Promise<any> {
    const res = await apiService.get<any>('/purchase-orders/reports', params as any);
    if (res.success && res.data) return res.data;
    throw new Error(res.message || 'Failed to fetch reports');
  }
}

export default new PurchaseOrdersApiService(); 