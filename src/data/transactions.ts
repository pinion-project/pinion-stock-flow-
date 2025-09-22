// قاعدة بيانات المعاملات وحركات المخزون الاحترافية
// Professional Transactions and Inventory Movements Database

export interface Transaction {
  id: string;
  type: 'purchase' | 'sale' | 'transfer' | 'adjustment' | 'return';
  date: string;
  time: string;
  
  // معلومات المنتج
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unit: string;
  
  // معلومات مالية
  unitPrice: number; // السعر للوحدة الواحدة
  totalAmount: number; // المبلغ الإجمالي
  currency: 'EGP';
  taxAmount?: number; // ضريبة القيمة المضافة
  discountAmount?: number; // خصم
  
  // معلومات المخزن
  warehouseId: string;
  warehouseName: string;
  fromWarehouseId?: string; // في حالة النقل
  toWarehouseId?: string; // في حالة النقل
  
  // معلومات الطرف الآخر
  supplierId?: string; // في حالة الشراء
  supplierName?: string;
  customerId?: string; // في حالة البيع
  customerName?: string;
  
  // معلومات المستخدم
  userId: string;
  userName: string;
  userRole: string;
  
  // معلومات إضافية
  referenceNumber?: string; // رقم مرجعي
  invoiceNumber?: string; // رقم الفاتورة
  notes?: string;
  status: 'pending' | 'completed' | 'cancelled' | 'returned';
  
  // معلومات التتبع
  createdAt: string;
  updatedAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface InventoryMovement {
  id: string;
  transactionId: string;
  productId: string;
  productName: string;
  
  // تفاصيل الحركة
  movementType: 'in' | 'out' | 'transfer' | 'adjustment';
  quantity: number;
  unit: string;
  
  // معلومات المخزن
  warehouseId: string;
  warehouseName: string;
  location?: string; // موقع داخل المخزن
  
  // الأرصدة
  previousBalance: number; // الرصيد السابق
  newBalance: number; // الرصيد الجديد
  
  // معلومات التكلفة
  unitCost: number;
  totalCost: number;
  
  // معلومات التتبع
  date: string;
  time: string;
  userId: string;
  userName: string;
  reason?: string;
  notes?: string;
}

// بيانات المعاملات الوهمية
export const transactions: Transaction[] = [
  {
    id: 'TXN-2024-001',
    type: 'purchase',
    date: '2024-01-15',
    time: '09:30:00',
    productId: 'PRD-001',
    productName: 'أرز أبيض مصري فاخر',
    sku: 'RICE-EGY-001',
    quantity: 100,
    unit: 'كيس 25 كيلو',
    unitPrice: 850,
    totalAmount: 85000,
    currency: 'EGP',
    taxAmount: 12750,
    warehouseId: 'WH-001',
    warehouseName: 'مخزن القاهرة الرئيسي',
    supplierId: 'SUP-001',
    supplierName: 'شركة الدلتا للأرز',
    userId: 'USR-001',
    userName: 'أحمد محمد علي',
    userRole: 'مدير المشتريات',
    referenceNumber: 'PO-2024-001',
    invoiceNumber: 'INV-001-2024',
    status: 'completed',
    createdAt: '2024-01-15T09:30:00Z',
    updatedAt: '2024-01-15T09:35:00Z',
    approvedBy: 'محمد أحمد السيد',
    approvedAt: '2024-01-15T09:35:00Z'
  },
  {
    id: 'TXN-2024-002',
    type: 'sale',
    date: '2024-01-16',
    time: '14:15:00',
    productId: 'PRD-002',
    productName: 'زيت عباد الشمس',
    sku: 'OIL-SUN-001',
    quantity: 50,
    unit: 'زجاجة 1 لتر',
    unitPrice: 45,
    totalAmount: 2250,
    currency: 'EGP',
    taxAmount: 337.5,
    warehouseId: 'WH-002',
    warehouseName: 'مخزن الإسكندرية',
    customerId: 'CUST-001',
    customerName: 'سوبر ماركت النور',
    userId: 'USR-002',
    userName: 'فاطمة حسن محمد',
    userRole: 'مدير المبيعات',
    referenceNumber: 'SO-2024-001',
    invoiceNumber: 'SINV-001-2024',
    status: 'completed',
    createdAt: '2024-01-16T14:15:00Z',
    updatedAt: '2024-01-16T14:20:00Z'
  },
  {
    id: 'TXN-2024-003',
    type: 'transfer',
    date: '2024-01-17',
    time: '11:00:00',
    productId: 'PRD-003',
    productName: 'سكر أبيض ناعم',
    sku: 'SUGAR-001',
    quantity: 25,
    unit: 'كيس 50 كيلو',
    unitPrice: 0, // لا يوجد سعر في النقل
    totalAmount: 0,
    currency: 'EGP',
    warehouseId: 'WH-001',
    warehouseName: 'مخزن القاهرة الرئيسي',
    fromWarehouseId: 'WH-001',
    toWarehouseId: 'WH-003',
    userId: 'USR-003',
    userName: 'محمود عبد الرحمن',
    userRole: 'مدير المخزن',
    referenceNumber: 'TR-2024-001',
    notes: 'نقل لتلبية الطلب في فرع الجيزة',
    status: 'completed',
    createdAt: '2024-01-17T11:00:00Z',
    updatedAt: '2024-01-17T11:30:00Z'
  },
  {
    id: 'TXN-2024-004',
    type: 'purchase',
    date: '2024-01-18',
    time: '08:45:00',
    productId: 'PRD-004',
    productName: 'معكرونة إيطالية',
    sku: 'PASTA-IT-001',
    quantity: 200,
    unit: 'علبة 500 جرام',
    unitPrice: 12,
    totalAmount: 2400,
    currency: 'EGP',
    taxAmount: 360,
    warehouseId: 'WH-004',
    warehouseName: 'مخزن المنصورة',
    supplierId: 'SUP-002',
    supplierName: 'شركة البحر المتوسط للاستيراد',
    userId: 'USR-004',
    userName: 'سارة أحمد محمود',
    userRole: 'مدير المشتريات',
    referenceNumber: 'PO-2024-002',
    invoiceNumber: 'INV-002-2024',
    status: 'completed',
    createdAt: '2024-01-18T08:45:00Z',
    updatedAt: '2024-01-18T08:50:00Z'
  },
  {
    id: 'TXN-2024-005',
    type: 'adjustment',
    date: '2024-01-19',
    time: '16:20:00',
    productId: 'PRD-005',
    productName: 'شاي أسود فاخر',
    sku: 'TEA-BLK-001',
    quantity: -5,
    unit: 'علبة 100 جرام',
    unitPrice: 0,
    totalAmount: 0,
    currency: 'EGP',
    warehouseId: 'WH-001',
    warehouseName: 'مخزن القاهرة الرئيسي',
    userId: 'USR-005',
    userName: 'عمر حسام الدين',
    userRole: 'مدير المخزن',
    referenceNumber: 'ADJ-2024-001',
    notes: 'تسوية نقص في المخزون بسبب تلف',
    reason: 'تلف المنتج',
    status: 'completed',
    createdAt: '2024-01-19T16:20:00Z',
    updatedAt: '2024-01-19T16:25:00Z'
  }
];

// بيانات حركات المخزون
export const inventoryMovements: InventoryMovement[] = [
  {
    id: 'MOV-2024-001',
    transactionId: 'TXN-2024-001',
    productId: 'PRD-001',
    productName: 'أرز أبيض مصري فاخر',
    movementType: 'in',
    quantity: 100,
    unit: 'كيس 25 كيلو',
    warehouseId: 'WH-001',
    warehouseName: 'مخزن القاهرة الرئيسي',
    location: 'الرف A-1',
    previousBalance: 50,
    newBalance: 150,
    unitCost: 850,
    totalCost: 85000,
    date: '2024-01-15',
    time: '09:30:00',
    userId: 'USR-001',
    userName: 'أحمد محمد علي',
    reason: 'شراء جديد'
  },
  {
    id: 'MOV-2024-002',
    transactionId: 'TXN-2024-002',
    productId: 'PRD-002',
    productName: 'زيت عباد الشمس',
    movementType: 'out',
    quantity: 50,
    unit: 'زجاجة 1 لتر',
    warehouseId: 'WH-002',
    warehouseName: 'مخزن الإسكندرية',
    location: 'الرف B-3',
    previousBalance: 200,
    newBalance: 150,
    unitCost: 35,
    totalCost: 1750,
    date: '2024-01-16',
    time: '14:15:00',
    userId: 'USR-002',
    userName: 'فاطمة حسن محمد',
    reason: 'بيع للعميل'
  },
  {
    id: 'MOV-2024-003',
    transactionId: 'TXN-2024-003',
    productId: 'PRD-003',
    productName: 'سكر أبيض ناعم',
    movementType: 'out',
    quantity: 25,
    unit: 'كيس 50 كيلو',
    warehouseId: 'WH-001',
    warehouseName: 'مخزن القاهرة الرئيسي',
    location: 'الرف C-2',
    previousBalance: 100,
    newBalance: 75,
    unitCost: 1200,
    totalCost: 30000,
    date: '2024-01-17',
    time: '11:00:00',
    userId: 'USR-003',
    userName: 'محمود عبد الرحمن',
    reason: 'نقل إلى مخزن آخر'
  },
  {
    id: 'MOV-2024-004',
    transactionId: 'TXN-2024-003',
    productId: 'PRD-003',
    productName: 'سكر أبيض ناعم',
    movementType: 'in',
    quantity: 25,
    unit: 'كيس 50 كيلو',
    warehouseId: 'WH-003',
    warehouseName: 'مخزن الجيزة',
    location: 'الرف A-5',
    previousBalance: 30,
    newBalance: 55,
    unitCost: 1200,
    totalCost: 30000,
    date: '2024-01-17',
    time: '11:30:00',
    userId: 'USR-003',
    userName: 'محمود عبد الرحمن',
    reason: 'استلام من مخزن آخر'
  },
  {
    id: 'MOV-2024-005',
    transactionId: 'TXN-2024-004',
    productId: 'PRD-004',
    productName: 'معكرونة إيطالية',
    movementType: 'in',
    quantity: 200,
    unit: 'علبة 500 جرام',
    warehouseId: 'WH-004',
    warehouseName: 'مخزن المنصورة',
    location: 'الرف D-1',
    previousBalance: 80,
    newBalance: 280,
    unitCost: 12,
    totalCost: 2400,
    date: '2024-01-18',
    time: '08:45:00',
    userId: 'USR-004',
    userName: 'سارة أحمد محمود',
    reason: 'شراء جديد'
  }
];

// دوال مساعدة
export const getTransactionsByType = (type: Transaction['type']) => {
  return transactions.filter(transaction => transaction.type === type);
};

export const getTransactionsByWarehouse = (warehouseId: string) => {
  return transactions.filter(transaction => 
    transaction.warehouseId === warehouseId || 
    transaction.fromWarehouseId === warehouseId || 
    transaction.toWarehouseId === warehouseId
  );
};

export const getTransactionsByDateRange = (startDate: string, endDate: string) => {
  return transactions.filter(transaction => 
    transaction.date >= startDate && transaction.date <= endDate
  );
};

export const getTransactionsByProduct = (productId: string) => {
  return transactions.filter(transaction => transaction.productId === productId);
};

export const calculateTotalRevenue = () => {
  return transactions
    .filter(t => t.type === 'sale')
    .reduce((sum, t) => sum + t.totalAmount, 0);
};

export const calculateTotalPurchases = () => {
  return transactions
    .filter(t => t.type === 'purchase')
    .reduce((sum, t) => sum + t.totalAmount, 0);
};

export const getInventoryMovementsByWarehouse = (warehouseId: string) => {
  return inventoryMovements.filter(movement => movement.warehouseId === warehouseId);
};

export const getInventoryMovementsByProduct = (productId: string) => {
  return inventoryMovements.filter(movement => movement.productId === productId);
};

export const calculateCurrentStock = (productId: string, warehouseId: string) => {
  const movements = inventoryMovements.filter(m => 
    m.productId === productId && m.warehouseId === warehouseId
  );
  
  if (movements.length === 0) return 0;
  
  // إرجاع آخر رصيد
  const latestMovement = movements.sort((a, b) => 
    new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime()
  )[0];
  
  return latestMovement.newBalance;
};

export const getTransactionStats = () => {
  const totalTransactions = transactions.length;
  const completedTransactions = transactions.filter(t => t.status === 'completed').length;
  const pendingTransactions = transactions.filter(t => t.status === 'pending').length;
  const totalRevenue = calculateTotalRevenue();
  const totalPurchases = calculateTotalPurchases();
  
  return {
    totalTransactions,
    completedTransactions,
    pendingTransactions,
    totalRevenue,
    totalPurchases,
    netProfit: totalRevenue - totalPurchases
  };
};