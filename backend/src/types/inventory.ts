export interface Inventory {
  id: string;
  productId: string;
  warehouseId: string;
  quantity: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}
