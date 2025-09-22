export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  warehouseId?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
