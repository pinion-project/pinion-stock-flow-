// قاعدة بيانات الموردين المصريين
// Egyptian Suppliers Database

export interface Supplier {
  id: string;
  name: string;
  nameEn: string;
  commercialName?: string;
  taxNumber: string;
  commercialRegister: string;
  
  // معلومات الاتصال
  contactInfo: {
    phone: string;
    mobile: string;
    email: string;
    website?: string;
    fax?: string;
  };
  
  // العنوان
  address: {
    street: string;
    area: string;
    city: string;
    governorate: string;
    postalCode?: string;
    country: string;
  };
  
  // معلومات الأعمال
  businessInfo: {
    type: 'manufacturer' | 'distributor' | 'wholesaler' | 'importer' | 'retailer';
    industry: string;
    establishedYear: number;
    employeeCount?: number;
    annualRevenue?: number;
    certifications: string[];
  };
  
  // معلومات التعامل
  tradingInfo: {
    paymentTerms: string;
    creditLimit: number;
    currency: string;
    deliveryTerms: string;
    leadTime: number; // بالأيام
    minimumOrder?: number;
    discountRate?: number;
  };
  
  // تقييم الأداء
  performance: {
    rating: number; // من 1 إلى 5
    onTimeDelivery: number; // نسبة مئوية
    qualityScore: number; // من 1 إلى 10
    totalOrders: number;
    totalValue: number;
    lastOrderDate?: string;
  };
  
  // معلومات التتبع
  status: 'active' | 'inactive' | 'suspended' | 'blacklisted';
  createdAt: string;
  updatedAt: string;
  
  // معلومات إضافية
  notes?: string;
  tags: string[];
  contactPerson: {
    name: string;
    position: string;
    phone: string;
    email: string;
  };
  
  // المنتجات المتاحة
  productCategories: string[];
  brands: string[];
}

// قاعدة بيانات الموردين المصريين
export const SUPPLIERS_DATABASE: Supplier[] = [
  {
    id: 'SUP_001',
    name: 'شركة التكنولوجيا المتقدمة للحاسبات',
    nameEn: 'Advanced Technology Computer Company',
    commercialName: 'تك كمبيوتر',
    taxNumber: '100-123-456',
    commercialRegister: '12345',
    contactInfo: {
      phone: '+20 2 2345 6789',
      mobile: '+20 10 1234 5678',
      email: 'info@advtech-eg.com',
      website: 'www.advtech-eg.com',
      fax: '+20 2 2345 6790'
    },
    address: {
      street: '15 شارع التحرير',
      area: 'وسط البلد',
      city: 'القاهرة',
      governorate: 'القاهرة',
      postalCode: '11511',
      country: 'مصر'
    },
    businessInfo: {
      type: 'distributor',
      industry: 'تكنولوجيا المعلومات',
      establishedYear: 2010,
      employeeCount: 45,
      annualRevenue: 25000000,
      certifications: ['ISO 9001:2015', 'Dell Authorized Partner', 'HP Gold Partner']
    },
    tradingInfo: {
      paymentTerms: 'نقدي أو آجل 30 يوم',
      creditLimit: 500000,
      currency: 'EGP',
      deliveryTerms: 'تسليم مجاني داخل القاهرة الكبرى',
      leadTime: 7,
      minimumOrder: 10000,
      discountRate: 5
    },
    performance: {
      rating: 4.5,
      onTimeDelivery: 92,
      qualityScore: 9,
      totalOrders: 156,
      totalValue: 8750000,
      lastOrderDate: '2024-01-10'
    },
    status: 'active',
    createdAt: '2023-06-15',
    updatedAt: '2024-01-20',
    notes: 'مورد موثوق للأجهزة الإلكترونية، خدمة عملاء ممتازة',
    tags: ['إلكترونيات', 'كمبيوتر', 'لابتوب', 'موثوق'],
    contactPerson: {
      name: 'أحمد محمد السيد',
      position: 'مدير المبيعات',
      phone: '+20 10 1234 5678',
      email: 'ahmed.sales@advtech-eg.com'
    },
    productCategories: ['أجهزة كمبيوتر', 'لابتوب', 'ملحقات كمبيوتر'],
    brands: ['Dell', 'HP', 'Lenovo', 'Asus']
  },
  
  {
    id: 'SUP_002',
    name: 'الشركة المصرية لتوزيع الهواتف الذكية',
    nameEn: 'Egyptian Smart Phones Distribution Company',
    commercialName: 'موبايل مصر',
    taxNumber: '100-234-567',
    commercialRegister: '23456',
    contactInfo: {
      phone: '+20 2 3456 7890',
      mobile: '+20 11 2345 6789',
      email: 'sales@mobilemisr.com',
      website: 'www.mobilemisr.com'
    },
    address: {
      street: '25 شارع الجمهورية',
      area: 'العتبة',
      city: 'القاهرة',
      governorate: 'القاهرة',
      postalCode: '11513',
      country: 'مصر'
    },
    businessInfo: {
      type: 'distributor',
      industry: 'الاتصالات والهواتف الذكية',
      establishedYear: 2015,
      employeeCount: 28,
      annualRevenue: 18000000,
      certifications: ['Samsung Authorized Distributor', 'Xiaomi Official Partner']
    },
    tradingInfo: {
      paymentTerms: 'نقدي أو آجل 15 يوم',
      creditLimit: 300000,
      currency: 'EGP',
      deliveryTerms: 'تسليم خلال 24 ساعة',
      leadTime: 5,
      minimumOrder: 5000,
      discountRate: 3
    },
    performance: {
      rating: 4.2,
      onTimeDelivery: 88,
      qualityScore: 8.5,
      totalOrders: 89,
      totalValue: 4250000,
      lastOrderDate: '2024-01-15'
    },
    status: 'active',
    createdAt: '2023-08-20',
    updatedAt: '2024-01-18',
    tags: ['هواتف', 'سامسونج', 'شاومي', 'توزيع'],
    contactPerson: {
      name: 'فاطمة أحمد علي',
      position: 'مديرة التسويق',
      phone: '+20 11 2345 6789',
      email: 'fatma.marketing@mobilemisr.com'
    },
    productCategories: ['هواتف ذكية', 'ملحقات الهواتف', 'أجهزة لوحية'],
    brands: ['Samsung', 'Xiaomi', 'Oppo', 'Realme']
  },
  
  {
    id: 'SUP_003',
    name: 'شركة عز الدخيلة للصلب - الإسكندرية',
    nameEn: 'Ezz Steel Alexandria',
    commercialName: 'عز ستيل',
    taxNumber: '100-345-678',
    commercialRegister: '34567',
    contactInfo: {
      phone: '+20 3 4567 8901',
      mobile: '+20 12 3456 7890',
      email: 'sales@ezzsteel.com',
      website: 'www.ezzsteel.com',
      fax: '+20 3 4567 8902'
    },
    address: {
      street: 'المنطقة الصناعية',
      area: 'برج العرب الجديدة',
      city: 'الإسكندرية',
      governorate: 'الإسكندرية',
      postalCode: '21934',
      country: 'مصر'
    },
    businessInfo: {
      type: 'manufacturer',
      industry: 'صناعة الحديد والصلب',
      establishedYear: 1999,
      employeeCount: 8500,
      annualRevenue: 2500000000,
      certifications: ['ISO 9001:2015', 'ISO 14001:2015', 'OHSAS 18001']
    },
    tradingInfo: {
      paymentTerms: 'آجل 45 يوم أو خصم نقدي 2%',
      creditLimit: 2000000,
      currency: 'EGP',
      deliveryTerms: 'تسليم على الرصيف',
      leadTime: 3,
      minimumOrder: 100000,
      discountRate: 8
    },
    performance: {
      rating: 4.8,
      onTimeDelivery: 95,
      qualityScore: 9.5,
      totalOrders: 245,
      totalValue: 45000000,
      lastOrderDate: '2024-01-18'
    },
    status: 'active',
    createdAt: '2023-01-10',
    updatedAt: '2024-01-19',
    notes: 'أكبر منتج للحديد في مصر، جودة عالية وأسعار تنافسية',
    tags: ['حديد', 'صلب', 'تسليح', 'مصنع'],
    contactPerson: {
      name: 'محمد حسن إبراهيم',
      position: 'مدير المبيعات الإقليمي',
      phone: '+20 12 3456 7890',
      email: 'mohamed.sales@ezzsteel.com'
    },
    productCategories: ['حديد تسليح', 'صلب مسطح', 'أسياخ حديد'],
    brands: ['عز الدخيلة']
  },
  
  {
    id: 'SUP_004',
    name: 'الشركة العربية للأسمنت - هوكسيم',
    nameEn: 'Arabian Cement Company - Holcim',
    commercialName: 'العربية للأسمنت',
    taxNumber: '100-456-789',
    commercialRegister: '45678',
    contactInfo: {
      phone: '+20 2 5678 9012',
      mobile: '+20 10 9876 5432',
      email: 'info@arabiancement.com',
      website: 'www.arabiancement.com'
    },
    address: {
      street: 'طريق السويس الصحراوي كيلو 37',
      area: 'المعادي الجديدة',
      city: 'القاهرة',
      governorate: 'القاهرة',
      postalCode: '11728',
      country: 'مصر'
    },
    businessInfo: {
      type: 'manufacturer',
      industry: 'صناعة الأسمنت',
      establishedYear: 1997,
      employeeCount: 1200,
      annualRevenue: 800000000,
      certifications: ['ISO 9001:2015', 'ISO 14001:2015', 'المواصفة المصرية 373']
    },
    tradingInfo: {
      paymentTerms: 'آجل 30 يوم',
      creditLimit: 1500000,
      currency: 'EGP',
      deliveryTerms: 'تسليم بالشاحنات',
      leadTime: 2,
      minimumOrder: 50000,
      discountRate: 5
    },
    performance: {
      rating: 4.6,
      onTimeDelivery: 93,
      qualityScore: 9.2,
      totalOrders: 178,
      totalValue: 28500000,
      lastOrderDate: '2024-01-19'
    },
    status: 'active',
    createdAt: '2023-03-05',
    updatedAt: '2024-01-20',
    tags: ['أسمنت', 'بناء', 'هولسيم', 'مصنع'],
    contactPerson: {
      name: 'سارة محمود أحمد',
      position: 'مديرة حسابات العملاء الكبار',
      phone: '+20 10 9876 5432',
      email: 'sara.accounts@arabiancement.com'
    },
    productCategories: ['أسمنت بورتلاند', 'أسمنت مقاوم', 'أسمنت أبيض'],
    brands: ['العربية للأسمنت', 'Holcim']
  },
  
  {
    id: 'SUP_005',
    name: 'مجموعة غبور للسيارات',
    nameEn: 'GB Auto Group',
    commercialName: 'غبور أوتو',
    taxNumber: '100-567-890',
    commercialRegister: '56789',
    contactInfo: {
      phone: '+20 2 6789 0123',
      mobile: '+20 12 8765 4321',
      email: 'parts@gbauto.com',
      website: 'www.gbauto.com'
    },
    address: {
      street: 'طريق الإسماعيلية الصحراوي كيلو 7',
      area: 'مدينة العبور',
      city: 'القليوبية',
      governorate: 'القليوبية',
      postalCode: '13621',
      country: 'مصر'
    },
    businessInfo: {
      type: 'distributor',
      industry: 'السيارات وقطع الغيار',
      establishedYear: 1999,
      employeeCount: 3500,
      annualRevenue: 1200000000,
      certifications: ['Toyota Authorized Dealer', 'Hyundai Official Partner']
    },
    tradingInfo: {
      paymentTerms: 'نقدي أو آجل 21 يوم',
      creditLimit: 800000,
      currency: 'EGP',
      deliveryTerms: 'تسليم مجاني للكميات الكبيرة',
      leadTime: 7,
      minimumOrder: 15000,
      discountRate: 12
    },
    performance: {
      rating: 4.4,
      onTimeDelivery: 89,
      qualityScore: 8.8,
      totalOrders: 134,
      totalValue: 12500000,
      lastOrderDate: '2024-01-12'
    },
    status: 'active',
    createdAt: '2023-05-12',
    updatedAt: '2024-01-15',
    tags: ['سيارات', 'قطع غيار', 'تويوتا', 'هيونداي'],
    contactPerson: {
      name: 'خالد عبد الرحمن محمد',
      position: 'مدير قطع الغيار',
      phone: '+20 12 8765 4321',
      email: 'khaled.parts@gbauto.com'
    },
    productCategories: ['قطع غيار أصلية', 'زيوت ومواد تشحيم', 'إطارات'],
    brands: ['Toyota', 'Hyundai', 'Mazda', 'Chery']
  },
  
  {
    id: 'SUP_006',
    name: 'شركة النصر للغزل والنسيج والملابس الجاهزة',
    nameEn: 'El Nasr Spinning Weaving & Ready Made Garments',
    commercialName: 'النصر للنسيج',
    taxNumber: '100-678-901',
    commercialRegister: '67890',
    contactInfo: {
      phone: '+20 3 7890 1234',
      mobile: '+20 11 7654 3210',
      email: 'sales@elnasrtextile.com',
      website: 'www.elnasrtextile.com'
    },
    address: {
      street: 'شارع الصناعة',
      area: 'كفر الدوار',
      city: 'كفر الدوار',
      governorate: 'البحيرة',
      postalCode: '22910',
      country: 'مصر'
    },
    businessInfo: {
      type: 'manufacturer',
      industry: 'النسيج والملابس الجاهزة',
      establishedYear: 1960,
      employeeCount: 2800,
      annualRevenue: 450000000,
      certifications: ['OEKO-TEX Standard 100', 'GOTS Certified', 'ISO 9001:2015']
    },
    tradingInfo: {
      paymentTerms: 'آجل 45 يوم أو خصم نقدي 3%',
      creditLimit: 600000,
      currency: 'EGP',
      deliveryTerms: 'تسليم بالشاحنات المبردة',
      leadTime: 5,
      minimumOrder: 20000,
      discountRate: 15
    },
    performance: {
      rating: 4.3,
      onTimeDelivery: 91,
      qualityScore: 8.7,
      totalOrders: 98,
      totalValue: 6750000,
      lastOrderDate: '2024-01-16'
    },
    status: 'active',
    createdAt: '2023-07-08',
    updatedAt: '2024-01-17',
    tags: ['نسيج', 'قطن', 'ملابس', 'غزل'],
    contactPerson: {
      name: 'نادية حسن محمود',
      position: 'مديرة التصدير والمبيعات',
      phone: '+20 11 7654 3210',
      email: 'nadia.export@elnasrtextile.com'
    },
    productCategories: ['أقمشة قطنية', 'ملابس جاهزة', 'خيوط غزل'],
    brands: ['النصر للنسيج', 'Egyptian Cotton']
  },
  
  {
    id: 'SUP_007',
    name: 'شركة الأهرام للصناعات الغذائية',
    nameEn: 'Al Ahram Food Industries Company',
    commercialName: 'الأهرام فود',
    taxNumber: '100-789-012',
    commercialRegister: '78901',
    contactInfo: {
      phone: '+20 2 8901 2345',
      mobile: '+20 10 5432 1098',
      email: 'orders@ahramfood.com',
      website: 'www.ahramfood.com'
    },
    address: {
      street: 'المنطقة الصناعية الثالثة',
      area: 'مدينة السادات',
      city: 'السادات',
      governorate: 'المنوفية',
      postalCode: '32897',
      country: 'مصر'
    },
    businessInfo: {
      type: 'manufacturer',
      industry: 'الصناعات الغذائية',
      establishedYear: 1985,
      employeeCount: 650,
      annualRevenue: 320000000,
      certifications: ['HACCP', 'ISO 22000:2018', 'Halal Certified']
    },
    tradingInfo: {
      paymentTerms: 'آجل 30 يوم',
      creditLimit: 400000,
      currency: 'EGP',
      deliveryTerms: 'تسليم بالشاحنات المبردة',
      leadTime: 3,
      minimumOrder: 25000,
      discountRate: 7
    },
    performance: {
      rating: 4.1,
      onTimeDelivery: 87,
      qualityScore: 8.3,
      totalOrders: 67,
      totalValue: 3850000,
      lastOrderDate: '2024-01-17'
    },
    status: 'active',
    createdAt: '2023-09-22',
    updatedAt: '2024-01-18',
    tags: ['غذاء', 'أرز', 'معلبات', 'حلال'],
    contactPerson: {
      name: 'عمرو سعد الدين',
      position: 'مدير المبيعات والتوزيع',
      phone: '+20 10 5432 1098',
      email: 'amr.sales@ahramfood.com'
    },
    productCategories: ['أرز', 'معلبات', 'مواد غذائية مجففة'],
    brands: ['الأهرام', 'Golden Rice']
  },
  
  {
    id: 'SUP_008',
    name: 'شركة الإسكندرية للكيماويات والأدوية',
    nameEn: 'Alexandria Chemicals & Pharmaceuticals Company',
    commercialName: 'أليكس كيم',
    taxNumber: '100-890-123',
    commercialRegister: '89012',
    contactInfo: {
      phone: '+20 3 9012 3456',
      mobile: '+20 12 6543 2109',
      email: 'sales@alexchem.com',
      website: 'www.alexchem.com',
      fax: '+20 3 9012 3457'
    },
    address: {
      street: 'المنطقة الصناعية الأولى',
      area: 'برج العرب',
      city: 'الإسكندرية',
      governorate: 'الإسكندرية',
      postalCode: '21932',
      country: 'مصر'
    },
    businessInfo: {
      type: 'manufacturer',
      industry: 'الكيماويات والأدوية',
      establishedYear: 1978,
      employeeCount: 420,
      annualRevenue: 180000000,
      certifications: ['ISO 9001:2015', 'GMP Certified', 'FDA Approved']
    },
    tradingInfo: {
      paymentTerms: 'نقدي أو آجل 60 يوم',
      creditLimit: 750000,
      currency: 'EGP',
      deliveryTerms: 'تسليم بشاحنات متخصصة',
      leadTime: 10,
      minimumOrder: 30000,
      discountRate: 6
    },
    performance: {
      rating: 4.7,
      onTimeDelivery: 94,
      qualityScore: 9.1,
      totalOrders: 89,
      totalValue: 8950000,
      lastOrderDate: '2024-01-08'
    },
    status: 'active',
    createdAt: '2023-04-18',
    updatedAt: '2024-01-10',
    notes: 'مورد متخصص في الكيماويات الصناعية، التزام عالي بمعايير الأمان',
    tags: ['كيماويات', 'أدوية', 'صناعي', 'آمن'],
    contactPerson: {
      name: 'دكتور أحمد فتحي السيد',
      position: 'مدير المبيعات التقنية',
      phone: '+20 12 6543 2109',
      email: 'ahmed.technical@alexchem.com'
    },
    productCategories: ['أحماض صناعية', 'مذيبات', 'مواد كيميائية متخصصة'],
    brands: ['أليكس كيم', 'Alexandria Chem']
  }
];

// دوال مساعدة
export const getSupplierById = (id: string): Supplier | undefined => {
  return SUPPLIERS_DATABASE.find(supplier => supplier.id === id);
};

export const getSuppliersByCategory = (category: string): Supplier[] => {
  return SUPPLIERS_DATABASE.filter(supplier => 
    supplier.productCategories.some(cat => cat.includes(category))
  );
};

export const getActiveSuppliers = (): Supplier[] => {
  return SUPPLIERS_DATABASE.filter(supplier => supplier.status === 'active');
};

export const getTopRatedSuppliers = (minRating: number = 4.0): Supplier[] => {
  return SUPPLIERS_DATABASE
    .filter(supplier => supplier.performance.rating >= minRating)
    .sort((a, b) => b.performance.rating - a.performance.rating);
};

export const searchSuppliers = (query: string): Supplier[] => {
  const searchTerm = query.toLowerCase();
  return SUPPLIERS_DATABASE.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm) ||
    supplier.nameEn.toLowerCase().includes(searchTerm) ||
    supplier.commercialName?.toLowerCase().includes(searchTerm) ||
    supplier.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};

export const getSuppliersByGovernorate = (governorate: string): Supplier[] => {
  return SUPPLIERS_DATABASE.filter(supplier => 
    supplier.address.governorate === governorate
  );
};