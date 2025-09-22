// قاعدة بيانات المنتجات الاحترافية للسوق المصري
// Professional Products Database for Egyptian Market

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
  specifications?: Record<string, string>;
  
  // معلومات المخزون
  warehouseId: string;
  quantity: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  
  // معلومات مالية
  purchasePrice: number; // سعر الشراء
  salePrice: number; // سعر البيع
  wholesalePrice?: number; // سعر الجملة
  retailPrice?: number; // سعر التجزئة
  costPrice: number; // التكلفة الفعلية
  profitMargin: number; // هامش الربح %
  
  // معلومات الوحدة
  unit: string; // الوحدة (قطعة، كيلو، متر، إلخ)
  weight?: number; // الوزن بالكيلو
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  
  // معلومات الموردين
  supplierId: string;
  supplierName: string;
  supplierPrice: number;
  leadTime: number; // مدة التوريد بالأيام
  
  // معلومات التتبع
  status: 'active' | 'inactive' | 'discontinued';
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstock';
  lastPurchaseDate?: string;
  lastSaleDate?: string;
  createdAt: string;
  updatedAt: string;
  
  // معلومات إضافية
  tags: string[];
  images?: string[];
  warranty?: number; // فترة الضمان بالشهور
  expiryDate?: string; // تاريخ انتهاء الصلاحية للمواد الغذائية
  batchNumber?: string;
  location?: string; // موقع المنتج في المخزن
}

// فئات المنتجات الرئيسية
export const PRODUCT_CATEGORIES = {
  ELECTRONICS: 'إلكترونيات',
  CONSTRUCTION: 'مواد البناء',
  AUTOMOTIVE: 'قطع غيار السيارات',
  TEXTILES: 'منسوجات',
  FOOD: 'مواد غذائية',
  CHEMICALS: 'مواد كيميائية',
  MACHINERY: 'معدات وآلات',
  FURNITURE: 'أثاث',
  MEDICAL: 'مستلزمات طبية',
  STATIONERY: 'مكتبية وقرطاسية'
} as const;

// الوحدات المستخدمة
export const UNITS = {
  PIECE: 'قطعة',
  KG: 'كيلو',
  GRAM: 'جرام',
  METER: 'متر',
  CM: 'سم',
  LITER: 'لتر',
  BOX: 'صندوق',
  PACK: 'عبوة',
  ROLL: 'لفة',
  SHEET: 'ورقة'
} as const;

// قاعدة بيانات المنتجات الاحترافية
export const PRODUCTS_DATABASE: Product[] = [
  // إلكترونيات - المخزن الرئيسي
  {
    id: 'PROD_001',
    name: 'لابتوب ديل انسبايرون 15 3000',
    nameEn: 'Dell Inspiron 15 3000',
    sku: 'DELL-INS-15-3000',
    barcode: '1234567890123',
    category: PRODUCT_CATEGORIES.ELECTRONICS,
    subcategory: 'أجهزة كمبيوتر محمولة',
    brand: 'Dell',
    model: 'Inspiron 15 3000',
    description: 'لابتوب ديل انسبايرون 15 بوصة، معالج Intel Core i5، ذاكرة 8 جيجا، قرص صلب 1 تيرا',
    specifications: {
      'المعالج': 'Intel Core i5-1135G7',
      'الذاكرة': '8 GB DDR4',
      'التخزين': '1TB HDD',
      'الشاشة': '15.6 بوصة HD',
      'نظام التشغيل': 'Windows 11 Home'
    },
    warehouseId: '1',
    quantity: 45,
    minStock: 10,
    maxStock: 100,
    reorderPoint: 15,
    purchasePrice: 18500,
    salePrice: 24000,
    wholesalePrice: 22000,
    retailPrice: 24000,
    costPrice: 19200,
    profitMargin: 25.0,
    unit: UNITS.PIECE,
    weight: 2.1,
    dimensions: { length: 35.8, width: 24.7, height: 1.99 },
    supplierId: 'SUP_001',
    supplierName: 'شركة التكنولوجيا المتقدمة',
    supplierPrice: 18500,
    leadTime: 7,
    status: 'active',
    stockStatus: 'in_stock',
    lastPurchaseDate: '2024-01-10',
    lastSaleDate: '2024-01-20',
    createdAt: '2023-12-01',
    updatedAt: '2024-01-20',
    tags: ['لابتوب', 'ديل', 'كمبيوتر', 'مكتبي'],
    warranty: 12,
    location: 'A1-B2-C3'
  },
  {
    id: 'PROD_002',
    name: 'هاتف سامسونج جالاكسي A54',
    nameEn: 'Samsung Galaxy A54',
    sku: 'SAM-GAL-A54-128',
    barcode: '1234567890124',
    category: PRODUCT_CATEGORIES.ELECTRONICS,
    subcategory: 'هواتف ذكية',
    brand: 'Samsung',
    model: 'Galaxy A54',
    description: 'هاتف سامسونج جالاكسي A54 بذاكرة 128 جيجا، كاميرا 50 ميجا بكسل',
    specifications: {
      'الشاشة': '6.4 بوصة Super AMOLED',
      'المعالج': 'Exynos 1380',
      'الذاكرة': '6 GB RAM',
      'التخزين': '128 GB',
      'الكاميرا': '50 MP + 12 MP + 5 MP',
      'البطارية': '5000 mAh'
    },
    warehouseId: '1',
    quantity: 28,
    minStock: 15,
    maxStock: 80,
    reorderPoint: 20,
    purchasePrice: 12500,
    salePrice: 16000,
    wholesalePrice: 14500,
    retailPrice: 16000,
    costPrice: 13000,
    profitMargin: 23.1,
    unit: UNITS.PIECE,
    weight: 0.202,
    dimensions: { length: 15.8, width: 7.67, height: 0.82 },
    supplierId: 'SUP_002',
    supplierName: 'موزع سامسونج المعتمد',
    supplierPrice: 12500,
    leadTime: 5,
    status: 'active',
    stockStatus: 'in_stock',
    lastPurchaseDate: '2024-01-15',
    lastSaleDate: '2024-01-21',
    createdAt: '2023-11-15',
    updatedAt: '2024-01-21',
    tags: ['هاتف', 'سامسونج', 'ذكي', 'أندرويد'],
    warranty: 24,
    location: 'A2-B1-C2'
  },
  
  // مواد البناء - المخزن المسطح
  {
    id: 'PROD_003',
    name: 'حديد تسليح عز الدخيلة 16 مم',
    nameEn: 'Ezz Steel Rebar 16mm',
    sku: 'EZZ-REB-16MM',
    category: PRODUCT_CATEGORIES.CONSTRUCTION,
    subcategory: 'حديد تسليح',
    brand: 'عز الدخيلة',
    description: 'حديد تسليح عز الدخيلة قطر 16 مم، طول 12 متر، مطابق للمواصفات المصرية',
    specifications: {
      'القطر': '16 مم',
      'الطول': '12 متر',
      'الوزن': '18.96 كيلو/عمود',
      'المقاومة': '400 نيوتن/مم²',
      'المعيار': 'المواصفة المصرية 262/2017'
    },
    warehouseId: '2',
    quantity: 850,
    minStock: 200,
    maxStock: 2000,
    reorderPoint: 300,
    purchasePrice: 285,
    salePrice: 320,
    wholesalePrice: 310,
    retailPrice: 320,
    costPrice: 295,
    profitMargin: 8.5,
    unit: 'عمود',
    weight: 18.96,
    dimensions: { length: 1200, width: 1.6, height: 1.6 },
    supplierId: 'SUP_003',
    supplierName: 'شركة عز الدخيلة للصلب',
    supplierPrice: 285,
    leadTime: 3,
    status: 'active',
    stockStatus: 'in_stock',
    lastPurchaseDate: '2024-01-18',
    lastSaleDate: '2024-01-21',
    createdAt: '2023-10-01',
    updatedAt: '2024-01-21',
    tags: ['حديد', 'تسليح', 'بناء', 'عز'],
    location: 'B1-YARD-A'
  },
  {
    id: 'PROD_004',
    name: 'أسمنت العربية بورتلاند 50 كيلو',
    nameEn: 'Arabian Cement Portland 50kg',
    sku: 'ARA-CEM-50KG',
    category: PRODUCT_CATEGORIES.CONSTRUCTION,
    subcategory: 'أسمنت',
    brand: 'العربية للأسمنت',
    description: 'أسمنت بورتلاند عادي من العربية للأسمنت، شكارة 50 كيلو',
    specifications: {
      'النوع': 'بورتلاند عادي',
      'الوزن': '50 كيلو',
      'المقاومة': '42.5 نيوتن/مم²',
      'المعيار': 'المواصفة المصرية 373/2018'
    },
    warehouseId: '5',
    quantity: 1200,
    minStock: 300,
    maxStock: 3000,
    reorderPoint: 500,
    purchasePrice: 165,
    salePrice: 185,
    wholesalePrice: 175,
    retailPrice: 185,
    costPrice: 170,
    profitMargin: 8.8,
    unit: 'شكارة',
    weight: 50,
    dimensions: { length: 60, width: 40, height: 15 },
    supplierId: 'SUP_004',
    supplierName: 'الشركة العربية للأسمنت',
    supplierPrice: 165,
    leadTime: 2,
    status: 'active',
    stockStatus: 'in_stock',
    lastPurchaseDate: '2024-01-19',
    lastSaleDate: '2024-01-21',
    createdAt: '2023-09-15',
    updatedAt: '2024-01-21',
    tags: ['أسمنت', 'بناء', 'العربية', 'بورتلاند'],
    location: 'C1-SHED-B'
  },
  
  // قطع غيار السيارات - مخزن غبور
  {
    id: 'PROD_005',
    name: 'فلتر زيت تويوتا كورولا أصلي',
    nameEn: 'Toyota Corolla Original Oil Filter',
    sku: 'TOY-COR-OILF-OEM',
    barcode: '1234567890125',
    category: PRODUCT_CATEGORIES.AUTOMOTIVE,
    subcategory: 'فلاتر',
    brand: 'Toyota',
    model: 'Corolla 2018-2023',
    description: 'فلتر زيت أصلي لسيارة تويوتا كورولا موديل 2018-2023',
    specifications: {
      'رقم القطعة': '90915-YZZD4',
      'التوافق': 'كورولا 2018-2023',
      'النوع': 'فلتر زيت محرك',
      'المنشأ': 'اليابان'
    },
    warehouseId: '6',
    quantity: 75,
    minStock: 20,
    maxStock: 150,
    reorderPoint: 30,
    purchasePrice: 85,
    salePrice: 120,
    wholesalePrice: 105,
    retailPrice: 120,
    costPrice: 90,
    profitMargin: 33.3,
    unit: UNITS.PIECE,
    weight: 0.3,
    dimensions: { length: 10, width: 10, height: 8 },
    supplierId: 'SUP_005',
    supplierName: 'غبور للسيارات',
    supplierPrice: 85,
    leadTime: 7,
    status: 'active',
    stockStatus: 'in_stock',
    lastPurchaseDate: '2024-01-12',
    lastSaleDate: '2024-01-20',
    createdAt: '2023-11-01',
    updatedAt: '2024-01-20',
    tags: ['فلتر', 'زيت', 'تويوتا', 'كورولا', 'أصلي'],
    warranty: 6,
    location: 'D1-A3-B2'
  },
  
  // منسوجات - مخزن ستيل
  {
    id: 'PROD_006',
    name: 'قماش قطني مصري 100% عرض 150 سم',
    nameEn: 'Egyptian Cotton Fabric 100% Width 150cm',
    sku: 'EGY-COT-150CM',
    category: PRODUCT_CATEGORIES.TEXTILES,
    subcategory: 'أقمشة قطنية',
    brand: 'النصر للغزل والنسيج',
    description: 'قماش قطني مصري خالص 100% عرض 150 سم، جودة عالية للملابس والمفروشات',
    specifications: {
      'التركيب': '100% قطن مصري',
      'العرض': '150 سم',
      'الوزن': '200 جرام/متر²',
      'اللون': 'أبيض خام',
      'المعالجة': 'مقاوم للانكماش'
    },
    warehouseId: '4',
    quantity: 2500,
    minStock: 500,
    maxStock: 5000,
    reorderPoint: 800,
    purchasePrice: 45,
    salePrice: 65,
    wholesalePrice: 55,
    retailPrice: 65,
    costPrice: 48,
    profitMargin: 35.4,
    unit: UNITS.METER,
    weight: 0.3,
    dimensions: { length: 100, width: 150, height: 0.1 },
    supplierId: 'SUP_006',
    supplierName: 'شركة النصر للغزل والنسيج',
    supplierPrice: 45,
    leadTime: 5,
    status: 'active',
    stockStatus: 'in_stock',
    lastPurchaseDate: '2024-01-16',
    lastSaleDate: '2024-01-21',
    createdAt: '2023-12-10',
    updatedAt: '2024-01-21',
    tags: ['قماش', 'قطن', 'مصري', 'نسيج'],
    location: 'E1-ROLL-A'
  },
  
  // مواد غذائية - المخزن الرئيسي
  {
    id: 'PROD_007',
    name: 'أرز مصري أبيض درجة أولى 25 كيلو',
    nameEn: 'Egyptian White Rice Grade A 25kg',
    sku: 'EGY-RICE-25KG',
    category: PRODUCT_CATEGORIES.FOOD,
    subcategory: 'حبوب',
    brand: 'الأهرام للأرز',
    description: 'أرز مصري أبيض درجة أولى، شكارة 25 كيلو، محصول جديد',
    specifications: {
      'النوع': 'أرز أبيض مصري',
      'الدرجة': 'درجة أولى',
      'الوزن': '25 كيلو',
      'المحصول': '2023',
      'نسبة الكسر': 'أقل من 5%'
    },
    warehouseId: '1',
    quantity: 480,
    minStock: 100,
    maxStock: 1000,
    reorderPoint: 150,
    purchasePrice: 420,
    salePrice: 480,
    wholesalePrice: 450,
    retailPrice: 480,
    costPrice: 435,
    profitMargin: 10.3,
    unit: 'شكارة',
    weight: 25,
    dimensions: { length: 80, width: 50, height: 20 },
    supplierId: 'SUP_007',
    supplierName: 'شركة الأهرام للأرز',
    supplierPrice: 420,
    leadTime: 3,
    status: 'active',
    stockStatus: 'in_stock',
    lastPurchaseDate: '2024-01-17',
    lastSaleDate: '2024-01-21',
    createdAt: '2023-11-20',
    updatedAt: '2024-01-21',
    tags: ['أرز', 'مصري', 'غذاء', 'حبوب'],
    expiryDate: '2025-11-20',
    batchNumber: 'AR2023-1120',
    location: 'F1-FOOD-A'
  },
  
  // مواد كيميائية - مخزن الدرفلة
  {
    id: 'PROD_008',
    name: 'حمض الكبريتيك 98% - 25 لتر',
    nameEn: 'Sulfuric Acid 98% - 25L',
    sku: 'H2SO4-98-25L',
    category: PRODUCT_CATEGORIES.CHEMICALS,
    subcategory: 'أحماض',
    brand: 'الإسكندرية للكيماويات',
    description: 'حمض الكبريتيك تركيز 98% للاستخدام الصناعي، عبوة 25 لتر',
    specifications: {
      'التركيز': '98%',
      'الحجم': '25 لتر',
      'النقاوة': 'درجة صناعية',
      'الكثافة': '1.84 جم/سم³',
      'التعبئة': 'عبوة بلاستيك مقاومة'
    },
    warehouseId: '3',
    quantity: 45,
    minStock: 10,
    maxStock: 100,
    reorderPoint: 15,
    purchasePrice: 850,
    salePrice: 1100,
    wholesalePrice: 980,
    retailPrice: 1100,
    costPrice: 890,
    profitMargin: 23.6,
    unit: 'عبوة',
    weight: 46,
    dimensions: { length: 30, width: 30, height: 40 },
    supplierId: 'SUP_008',
    supplierName: 'شركة الإسكندرية للكيماويات',
    supplierPrice: 850,
    leadTime: 10,
    status: 'active',
    stockStatus: 'in_stock',
    lastPurchaseDate: '2024-01-08',
    lastSaleDate: '2024-01-19',
    createdAt: '2023-10-15',
    updatedAt: '2024-01-19',
    tags: ['حمض', 'كبريتيك', 'كيماويات', 'صناعي'],
    expiryDate: '2026-10-15',
    batchNumber: 'H2SO4-2024-001',
    location: 'G1-CHEM-SAFE'
  }
];

// دالة للحصول على المنتجات حسب المخزن
export const getProductsByWarehouse = (warehouseId: string): Product[] => {
  return PRODUCTS_DATABASE.filter(product => product.warehouseId === warehouseId);
};

// دالة للحصول على المنتجات حسب الفئة
export const getProductsByCategory = (category: string): Product[] => {
  return PRODUCTS_DATABASE.filter(product => product.category === category);
};

// دالة للحصول على المنتجات منخفضة المخزون
export const getLowStockProducts = (): Product[] => {
  return PRODUCTS_DATABASE.filter(product => product.quantity <= product.minStock);
};

// دالة للحصول على المنتجات النافدة
export const getOutOfStockProducts = (): Product[] => {
  return PRODUCTS_DATABASE.filter(product => product.quantity === 0);
};

// دالة لحساب إجمالي قيمة المخزون
export const calculateTotalInventoryValue = (products: Product[] = PRODUCTS_DATABASE): number => {
  return products.reduce((total, product) => {
    return total + (product.quantity * product.costPrice);
  }, 0);
};

// دالة للبحث في المنتجات
export const searchProducts = (query: string): Product[] => {
  const searchTerm = query.toLowerCase();
  return PRODUCTS_DATABASE.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.nameEn.toLowerCase().includes(searchTerm) ||
    product.sku.toLowerCase().includes(searchTerm) ||
    product.brand.toLowerCase().includes(searchTerm) ||
    product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};