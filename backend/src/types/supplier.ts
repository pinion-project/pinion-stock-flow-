export interface Supplier {
  id: string;
  name: string;
  nameEn?: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  governorate: string;
  country: string;
  taxNumber?: string;
  website?: string;
  contactPerson: string;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
