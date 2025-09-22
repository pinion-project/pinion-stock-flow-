export interface Product {
  id: string;
  name: string;
  nameEn: string;
  sku: string;
  barcode?: string;
  category: string;
  subcategory: string;
  brand: string;
  model?: string;
  description: string;
  unit: string;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  status: string;
  tags: string[];
  images: string[];
  warranty?: number;
  expiryDate?: Date;
  batchNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}
