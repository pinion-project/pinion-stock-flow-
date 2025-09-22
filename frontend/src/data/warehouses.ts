// قاعدة بيانات المخازن المصرية المحسنة
// Enhanced Egyptian Warehouses Database

export interface WarehouseManager {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: number; // بالسنوات
  certifications: string[];
  joinDate: string;
  department: string;
}

export interface WarehouseLocation {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  address: {
    street: string;
    area: string;
    city: string;
    governorate: string;
    postalCode?: string;
    country: string;
  };
  accessibility: {
    nearestPort?: string;
    nearestAirport?: string;
    majorRoads: string[];
    publicTransport: boolean;
  };
}

export interface WarehouseFacilities {
  totalArea: number; // بالمتر المربع
  storageArea: number;
  officeArea: number;
  loadingDocks: number;
  parkingSpaces: number;
  securitySystems: string[];
  climateControl: boolean;
  fireProtection: string[];
  powerBackup: boolean;
  internetConnectivity: string;
}

export interface WarehouseOperations {
  workingHours: {
    weekdays: string;
    weekends: string;
    holidays: string;
  };
  shiftPattern: string;
  staffCount: {
    management: number;
    warehouse: number;
    security: number;
    maintenance: number;
  };
  equipmentList: string[];
  safetyProtocols: string[];
}

export interface WarehouseFinancials {
  monthlyRent?: number;
  operatingCosts: {
    utilities: number;
    maintenance: number;
    security: number;
    insurance: number;
    staff: number;
  };
  revenue: {
    monthly: number;
    yearly: number;
  };
  profitMargin: number;
  currency: string;
}

export interface WarehousePerformance {
  utilizationRate: number; // نسبة مئوية
  turnoverRate: number; // مرات في السنة
  accuracyRate: number; // نسبة مئوية
  onTimeDelivery: number; // نسبة مئوية
  customerSatisfaction: number; // من 1 إلى 10
  safetyRecord: {
    daysWithoutIncident: number;
    totalIncidents: number;
    lastIncidentDate?: string;
  };
}

export interface Warehouse {
  id: string;
  name: string;
  nameEn: string;
  code: string;
  type: 'distribution' | 'manufacturing' | 'retail' | 'cold_storage' | 'hazmat' | 'general';
  status: 'active' | 'inactive' | 'maintenance' | 'expansion';
  
  // معلومات أساسية
  establishedDate: string;
  licenseNumber: string;
  taxNumber: string;
  
  // الإدارة
  manager: WarehouseManager;
  
  // الموقع
  location: WarehouseLocation;
  
  // المرافق
  facilities: WarehouseFacilities;
  
  // العمليات
  operations: WarehouseOperations;
  
  // السعة والمخزون
  capacity: {
    maxVolume: number; // بالمتر المكعب
    maxWeight: number; // بالطن
    currentStock: number;
    availableSpace: number;
    reservedSpace: number;
  };
  
  // المنتجات والفئات
  productCategories: string[];
  specializations: string[];
  
  // الأداء المالي
  financials: WarehouseFinancials;
  
  // مؤشرات الأداء
  performance: WarehousePerformance;
  
  // معلومات الاتصال
  contactInfo: {
    phone: string;
    fax?: string;
    email: string;
    website?: string;
    emergencyContact: string;
  };
  
  // الشهادات والتراخيص
  certifications: string[];
  
  // معلومات إضافية
  notes?: string;
  tags: string[];
  
  // تواريخ التتبع
  createdAt: string;
  updatedAt: string;
  lastInspectionDate: string;
  nextInspectionDate: string;
}

// قاعدة بيانات المخازن المصرية المحسنة
export const WAREHOUSES_DATABASE: Warehouse[] = [
  {
    id: 'WH_001',
    name: 'مخزن القاهرة المركزي للتكنولوجيا',
    nameEn: 'Cairo Central Technology Warehouse',
    code: 'CCT-001',
    type: 'distribution',
    status: 'active',
    establishedDate: '2020-03-15',
    licenseNumber: 'WH-CAI-2020-001',
    taxNumber: '200-123-456',
    
    manager: {
      id: 'MGR_001',
      name: 'أحمد محمد السيد',
      email: 'ahmed.manager@pinion-egypt.com',
      phone: '+20 10 1234 5678',
      position: 'مدير المخزن الرئيسي',
      experience: 8,
      certifications: ['إدارة المخازن المعتمدة', 'ISO 9001 Lead Auditor'],
      joinDate: '2020-03-15',
      department: 'إدارة المخازن'
    },
    
    location: {
      coordinates: {
        latitude: 30.0444,
        longitude: 31.2357
      },
      address: {
        street: '15 شارع التحرير',
        area: 'وسط البلد',
        city: 'القاهرة',
        governorate: 'القاهرة',
        postalCode: '11511',
        country: 'مصر'
      },
      accessibility: {
        nearestPort: 'ميناء الإسكندرية',
        nearestAirport: 'مطار القاهرة الدولي',
        majorRoads: ['طريق القاهرة الإسكندرية الصحراوي', 'الطريق الدائري'],
        publicTransport: true
      }
    },
    
    facilities: {
      totalArea: 5000,
      storageArea: 4200,
      officeArea: 300,
      loadingDocks: 8,
      parkingSpaces: 25,
      securitySystems: ['كاميرات مراقبة', 'أنظمة إنذار', 'حراسة 24/7'],
      climateControl: true,
      fireProtection: ['رشاشات أوتوماتيكية', 'طفايات حريق', 'أنظمة إنذار دخان'],
      powerBackup: true,
      internetConnectivity: 'فايبر أوبتيك عالي السرعة'
    },
    
    operations: {
      workingHours: {
        weekdays: '8:00 ص - 6:00 م',
        weekends: '9:00 ص - 2:00 م',
        holidays: 'مغلق'
      },
      shiftPattern: 'وردية واحدة',
      staffCount: {
        management: 3,
        warehouse: 15,
        security: 6,
        maintenance: 2
      },
      equipmentList: ['رافعات شوكية', 'أنظمة نقل', 'ماسحات باركود', 'أجهزة كمبيوتر محمولة'],
      safetyProtocols: ['تدريب السلامة الشهري', 'فحص المعدات الأسبوعي', 'خطة الطوارئ']
    },
    
    capacity: {
      maxVolume: 8000,
      maxWeight: 500,
      currentStock: 6500,
      availableSpace: 1500,
      reservedSpace: 200
    },
    
    productCategories: ['أجهزة كمبيوتر', 'لابتوب', 'ملحقات إلكترونية', 'هواتف ذكية'],
    specializations: ['تخزين الإلكترونيات', 'التحكم في درجة الحرارة'],
    
    financials: {
      monthlyRent: 45000,
      operatingCosts: {
        utilities: 8000,
        maintenance: 5000,
        security: 12000,
        insurance: 3000,
        staff: 35000
      },
      revenue: {
        monthly: 125000,
        yearly: 1500000
      },
      profitMargin: 18.5,
      currency: 'EGP'
    },
    
    performance: {
      utilizationRate: 81.25,
      turnoverRate: 12,
      accuracyRate: 99.2,
      onTimeDelivery: 94.5,
      customerSatisfaction: 8.7,
      safetyRecord: {
        daysWithoutIncident: 245,
        totalIncidents: 2,
        lastIncidentDate: '2023-05-15'
      }
    },
    
    contactInfo: {
      phone: '+20 2 2345 6789',
      fax: '+20 2 2345 6790',
      email: 'cairo.tech@pinion-egypt.com',
      website: 'www.pinion-egypt.com/warehouses/cairo-tech',
      emergencyContact: '+20 10 1234 5678'
    },
    
    certifications: ['ISO 9001:2015', 'OHSAS 18001', 'تراخيص وزارة التجارة'],
    tags: ['تكنولوجيا', 'إلكترونيات', 'مركزي', 'القاهرة'],
    
    createdAt: '2020-03-15',
    updatedAt: '2024-01-20',
    lastInspectionDate: '2023-12-15',
    nextInspectionDate: '2024-06-15'
  },
  
  {
    id: 'WH_002',
    name: 'مخزن الإسكندرية للهواتف الذكية',
    nameEn: 'Alexandria Smart Phones Warehouse',
    code: 'ASP-002',
    type: 'retail',
    status: 'active',
    establishedDate: '2021-07-10',
    licenseNumber: 'WH-ALX-2021-002',
    taxNumber: '200-234-567',
    
    manager: {
      id: 'MGR_002',
      name: 'فاطمة أحمد علي',
      email: 'fatma.manager@pinion-egypt.com',
      phone: '+20 11 2345 6789',
      position: 'مديرة مخزن التجزئة',
      experience: 6,
      certifications: ['إدارة التجزئة المعتمدة', 'خدمة العملاء المتقدمة'],
      joinDate: '2021-07-10',
      department: 'إدارة التجزئة'
    },
    
    location: {
      coordinates: {
        latitude: 31.2001,
        longitude: 29.9187
      },
      address: {
        street: '25 شارع الجمهورية',
        area: 'العتبة',
        city: 'الإسكندرية',
        governorate: 'الإسكندرية',
        postalCode: '21513',
        country: 'مصر'
      },
      accessibility: {
        nearestPort: 'ميناء الإسكندرية',
        nearestAirport: 'مطار برج العرب الدولي',
        majorRoads: ['طريق الإسكندرية القاهرة الصحراوي', 'الكورنيش'],
        publicTransport: true
      }
    },
    
    facilities: {
      totalArea: 3200,
      storageArea: 2800,
      officeArea: 200,
      loadingDocks: 4,
      parkingSpaces: 15,
      securitySystems: ['كاميرات مراقبة', 'أنظمة إنذار'],
      climateControl: true,
      fireProtection: ['طفايات حريق', 'أنظمة إنذار دخان'],
      powerBackup: true,
      internetConnectivity: 'ADSL عالي السرعة'
    },
    
    operations: {
      workingHours: {
        weekdays: '9:00 ص - 7:00 م',
        weekends: '10:00 ص - 4:00 م',
        holidays: '10:00 ص - 2:00 م'
      },
      shiftPattern: 'وردية واحدة',
      staffCount: {
        management: 2,
        warehouse: 8,
        security: 4,
        maintenance: 1
      },
      equipmentList: ['رافعات يدوية', 'ماسحات باركود', 'أجهزة لوحية'],
      safetyProtocols: ['تدريب السلامة الشهري', 'فحص المعدات الأسبوعي']
    },
    
    capacity: {
      maxVolume: 4500,
      maxWeight: 200,
      currentStock: 3800,
      availableSpace: 700,
      reservedSpace: 100
    },
    
    productCategories: ['هواتف ذكية', 'ملحقات الهواتف', 'أجهزة لوحية'],
    specializations: ['تخزين الإلكترونيات الصغيرة', 'خدمة العملاء السريعة'],
    
    financials: {
      monthlyRent: 28000,
      operatingCosts: {
        utilities: 5000,
        maintenance: 3000,
        security: 8000,
        insurance: 2000,
        staff: 22000
      },
      revenue: {
        monthly: 85000,
        yearly: 1020000
      },
      profitMargin: 15.2,
      currency: 'EGP'
    },
    
    performance: {
      utilizationRate: 84.4,
      turnoverRate: 15,
      accuracyRate: 98.8,
      onTimeDelivery: 92.1,
      customerSatisfaction: 8.3,
      safetyRecord: {
        daysWithoutIncident: 180,
        totalIncidents: 1,
        lastIncidentDate: '2023-07-20'
      }
    },
    
    contactInfo: {
      phone: '+20 3 3456 7890',
      email: 'alexandria.mobile@pinion-egypt.com',
      website: 'www.pinion-egypt.com/warehouses/alexandria-mobile',
      emergencyContact: '+20 11 2345 6789'
    },
    
    certifications: ['تراخيص وزارة التجارة', 'شهادة السلامة المهنية'],
    tags: ['هواتف', 'تجزئة', 'الإسكندرية', 'سريع'],
    
    createdAt: '2021-07-10',
    updatedAt: '2024-01-18',
    lastInspectionDate: '2023-11-20',
    nextInspectionDate: '2024-05-20'
  },
  
  {
    id: 'WH_003',
    name: 'مخزن الصلب والحديد - العاشر من رمضان',
    nameEn: '10th of Ramadan Steel & Iron Warehouse',
    code: 'RSI-003',
    type: 'manufacturing',
    status: 'active',
    establishedDate: '2019-01-20',
    licenseNumber: 'WH-10R-2019-003',
    taxNumber: '200-345-678',
    
    manager: {
      id: 'MGR_003',
      name: 'محمد حسن إبراهيم',
      email: 'mohamed.manager@pinion-egypt.com',
      phone: '+20 12 3456 7890',
      position: 'مدير مخزن الصناعات الثقيلة',
      experience: 12,
      certifications: ['إدارة المواد الثقيلة', 'السلامة الصناعية', 'ISO 14001'],
      joinDate: '2019-01-20',
      department: 'الصناعات الثقيلة'
    },
    
    location: {
      coordinates: {
        latitude: 30.3254,
        longitude: 31.7456
      },
      address: {
        street: 'المنطقة الصناعية الثانية',
        area: 'مدينة العاشر من رمضان',
        city: 'العاشر من رمضان',
        governorate: 'الشرقية',
        postalCode: '44629',
        country: 'مصر'
      },
      accessibility: {
        nearestPort: 'ميناء دمياط',
        nearestAirport: 'مطار القاهرة الدولي',
        majorRoads: ['طريق القاهرة الإسماعيلية الصحراوي', 'طريق العاشر من رمضان'],
        publicTransport: false
      }
    },
    
    facilities: {
      totalArea: 12000,
      storageArea: 10500,
      officeArea: 500,
      loadingDocks: 12,
      parkingSpaces: 40,
      securitySystems: ['كاميرات مراقبة', 'أنظمة إنذار', 'حراسة مسلحة 24/7'],
      climateControl: false,
      fireProtection: ['رشاشات أوتوماتيكية', 'طفايات حريق صناعية', 'فرق إطفاء متخصصة'],
      powerBackup: true,
      internetConnectivity: 'إنترنت صناعي'
    },
    
    operations: {
      workingHours: {
        weekdays: '6:00 ص - 6:00 م',
        weekends: '8:00 ص - 2:00 م',
        holidays: 'مغلق'
      },
      shiftPattern: 'ورديتان',
      staffCount: {
        management: 4,
        warehouse: 25,
        security: 8,
        maintenance: 5
      },
      equipmentList: ['رافعات شوكية ثقيلة', 'رافعات علوية', 'أنظمة نقل صناعية', 'معدات قياس الوزن'],
      safetyProtocols: ['تدريب السلامة الأسبوعي', 'فحص المعدات اليومي', 'خطة الطوارئ الصناعية']
    },
    
    capacity: {
      maxVolume: 15000,
      maxWeight: 2000,
      currentStock: 12500,
      availableSpace: 2500,
      reservedSpace: 500
    },
    
    productCategories: ['حديد تسليح', 'صلب مسطح', 'أسياخ حديد', 'مواد بناء معدنية'],
    specializations: ['تخزين المواد الثقيلة', 'معالجة الصلب', 'التحكم في الجودة'],
    
    financials: {
      monthlyRent: 85000,
      operatingCosts: {
        utilities: 15000,
        maintenance: 12000,
        security: 18000,
        insurance: 8000,
        staff: 65000
      },
      revenue: {
        monthly: 285000,
        yearly: 3420000
      },
      profitMargin: 22.8,
      currency: 'EGP'
    },
    
    performance: {
      utilizationRate: 83.3,
      turnoverRate: 8,
      accuracyRate: 99.5,
      onTimeDelivery: 96.2,
      customerSatisfaction: 9.1,
      safetyRecord: {
        daysWithoutIncident: 320,
        totalIncidents: 1,
        lastIncidentDate: '2023-02-10'
      }
    },
    
    contactInfo: {
      phone: '+20 55 4567 8901',
      fax: '+20 55 4567 8902',
      email: 'ramadan.steel@pinion-egypt.com',
      website: 'www.pinion-egypt.com/warehouses/ramadan-steel',
      emergencyContact: '+20 12 3456 7890'
    },
    
    certifications: ['ISO 9001:2015', 'ISO 14001:2015', 'OHSAS 18001', 'تراخيص الصناعات الثقيلة'],
    tags: ['حديد', 'صلب', 'صناعي', 'ثقيل', 'العاشر من رمضان'],
    
    createdAt: '2019-01-20',
    updatedAt: '2024-01-19',
    lastInspectionDate: '2023-10-15',
    nextInspectionDate: '2024-04-15'
  },
  
  {
    id: 'WH_004',
    name: 'مخزن الأسمنت والمواد الإنشائية - السويس',
    nameEn: 'Suez Cement & Construction Materials Warehouse',
    code: 'SCC-004',
    type: 'manufacturing',
    status: 'active',
    establishedDate: '2018-11-05',
    licenseNumber: 'WH-SUZ-2018-004',
    taxNumber: '200-456-789',
    
    manager: {
      id: 'MGR_004',
      name: 'سارة محمود أحمد',
      email: 'sara.manager@pinion-egypt.com',
      phone: '+20 10 9876 5432',
      position: 'مديرة مخزن مواد البناء',
      experience: 9,
      certifications: ['إدارة مواد البناء', 'مراقبة الجودة', 'السلامة البيئية'],
      joinDate: '2018-11-05',
      department: 'مواد البناء'
    },
    
    location: {
      coordinates: {
        latitude: 29.9668,
        longitude: 32.5498
      },
      address: {
        street: 'طريق السويس الصحراوي كيلو 37',
        area: 'المنطقة الصناعية',
        city: 'السويس',
        governorate: 'السويس',
        postalCode: '43728',
        country: 'مصر'
      },
      accessibility: {
        nearestPort: 'ميناء السويس',
        nearestAirport: 'مطار القاهرة الدولي',
        majorRoads: ['طريق السويس الصحراوي', 'طريق القاهرة السويس'],
        publicTransport: false
      }
    },
    
    facilities: {
      totalArea: 18000,
      storageArea: 16000,
      officeArea: 800,
      loadingDocks: 16,
      parkingSpaces: 60,
      securitySystems: ['كاميرات مراقبة', 'أنظمة إنذار', 'حراسة 24/7'],
      climateControl: false,
      fireProtection: ['رشاشات مياه', 'طفايات حريق', 'أنظمة إنذار'],
      powerBackup: true,
      internetConnectivity: 'إنترنت صناعي عالي السرعة'
    },
    
    operations: {
      workingHours: {
        weekdays: '6:00 ص - 8:00 م',
        weekends: '8:00 ص - 4:00 م',
        holidays: 'مغلق'
      },
      shiftPattern: 'ورديتان',
      staffCount: {
        management: 5,
        warehouse: 35,
        security: 10,
        maintenance: 8
      },
      equipmentList: ['رافعات شوكية ثقيلة', 'ناقلات حزامية', 'صوامع تخزين', 'معدات قياس'],
      safetyProtocols: ['تدريب السلامة الأسبوعي', 'فحص المعدات اليومي', 'مراقبة الغبار']
    },
    
    capacity: {
      maxVolume: 25000,
      maxWeight: 5000,
      currentStock: 20000,
      availableSpace: 5000,
      reservedSpace: 1000
    },
    
    productCategories: ['أسمنت بورتلاند', 'أسمنت مقاوم', 'مواد إنشائية', 'خرسانة جاهزة'],
    specializations: ['تخزين الأسمنت', 'مراقبة الرطوبة', 'التحكم في الجودة'],
    
    financials: {
      monthlyRent: 125000,
      operatingCosts: {
        utilities: 22000,
        maintenance: 18000,
        security: 25000,
        insurance: 12000,
        staff: 95000
      },
      revenue: {
        monthly: 425000,
        yearly: 5100000
      },
      profitMargin: 25.3,
      currency: 'EGP'
    },
    
    performance: {
      utilizationRate: 80.0,
      turnoverRate: 6,
      accuracyRate: 99.8,
      onTimeDelivery: 97.5,
      customerSatisfaction: 9.3,
      safetyRecord: {
        daysWithoutIncident: 450,
        totalIncidents: 0
      }
    },
    
    contactInfo: {
      phone: '+20 62 5678 9012',
      fax: '+20 62 5678 9013',
      email: 'suez.cement@pinion-egypt.com',
      website: 'www.pinion-egypt.com/warehouses/suez-cement',
      emergencyContact: '+20 10 9876 5432'
    },
    
    certifications: ['ISO 9001:2015', 'ISO 14001:2015', 'المواصفة المصرية 373', 'تراخيص البيئة'],
    tags: ['أسمنت', 'بناء', 'صناعي', 'السويس', 'جودة عالية'],
    
    createdAt: '2018-11-05',
    updatedAt: '2024-01-20',
    lastInspectionDate: '2023-12-01',
    nextInspectionDate: '2024-06-01'
  },
  
  {
    id: 'WH_005',
    name: 'مخزن قطع غيار السيارات - مدينة نصر',
    nameEn: 'Nasr City Auto Parts Warehouse',
    code: 'NAP-005',
    type: 'distribution',
    status: 'active',
    establishedDate: '2020-09-12',
    licenseNumber: 'WH-NSR-2020-005',
    taxNumber: '200-567-890',
    
    manager: {
      id: 'MGR_005',
      name: 'خالد عبد الرحمن محمد',
      email: 'khaled.manager@pinion-egypt.com',
      phone: '+20 12 8765 4321',
      position: 'مدير مخزن قطع الغيار',
      experience: 7,
      certifications: ['إدارة قطع الغيار', 'خدمة العملاء التقنية', 'Toyota Certified'],
      joinDate: '2020-09-12',
      department: 'قطع الغيار'
    },
    
    location: {
      coordinates: {
        latitude: 30.0626,
        longitude: 31.3219
      },
      address: {
        street: 'طريق الإسماعيلية الصحراوي كيلو 7',
        area: 'مدينة نصر',
        city: 'القاهرة',
        governorate: 'القاهرة',
        postalCode: '11371',
        country: 'مصر'
      },
      accessibility: {
        nearestPort: 'ميناء الإسكندرية',
        nearestAirport: 'مطار القاهرة الدولي',
        majorRoads: ['طريق الإسماعيلية الصحراوي', 'الطريق الدائري الأوسطي'],
        publicTransport: true
      }
    },
    
    facilities: {
      totalArea: 4500,
      storageArea: 3800,
      officeArea: 350,
      loadingDocks: 6,
      parkingSpaces: 30,
      securitySystems: ['كاميرات مراقبة', 'أنظمة إنذار', 'حراسة ليلية'],
      climateControl: true,
      fireProtection: ['طفايات حريق متخصصة', 'أنظمة إنذار دخان'],
      powerBackup: true,
      internetConnectivity: 'فايبر أوبتيك'
    },
    
    operations: {
      workingHours: {
        weekdays: '8:00 ص - 7:00 م',
        weekends: '9:00 ص - 3:00 م',
        holidays: 'مغلق'
      },
      shiftPattern: 'وردية واحدة',
      staffCount: {
        management: 3,
        warehouse: 12,
        security: 4,
        maintenance: 2
      },
      equipmentList: ['رافعات شوكية', 'أنظمة تخزين عمودية', 'ماسحات باركود', 'أجهزة فحص قطع الغيار'],
      safetyProtocols: ['تدريب السلامة الشهري', 'فحص المعدات الأسبوعي', 'إجراءات الطوارئ']
    },
    
    capacity: {
      maxVolume: 6500,
      maxWeight: 350,
      currentStock: 5200,
      availableSpace: 1300,
      reservedSpace: 150
    },
    
    productCategories: ['قطع غيار أصلية', 'زيوت ومواد تشحيم', 'إطارات', 'بطاريات'],
    specializations: ['قطع غيار السيارات اليابانية', 'الخدمة السريعة', 'الضمان الشامل'],
    
    financials: {
      monthlyRent: 38000,
      operatingCosts: {
        utilities: 6500,
        maintenance: 4000,
        security: 9000,
        insurance: 3500,
        staff: 28000
      },
      revenue: {
        monthly: 145000,
        yearly: 1740000
      },
      profitMargin: 19.7,
      currency: 'EGP'
    },
    
    performance: {
      utilizationRate: 80.0,
      turnoverRate: 18,
      accuracyRate: 98.9,
      onTimeDelivery: 93.8,
      customerSatisfaction: 8.5,
      safetyRecord: {
        daysWithoutIncident: 195,
        totalIncidents: 1,
        lastIncidentDate: '2023-06-25'
      }
    },
    
    contactInfo: {
      phone: '+20 2 6789 0123',
      email: 'nasr.autoparts@pinion-egypt.com',
      website: 'www.pinion-egypt.com/warehouses/nasr-autoparts',
      emergencyContact: '+20 12 8765 4321'
    },
    
    certifications: ['Toyota Authorized Parts', 'Hyundai Official Partner', 'تراخيص وزارة التجارة'],
    tags: ['قطع غيار', 'سيارات', 'توزيع', 'مدينة نصر'],
    
    createdAt: '2020-09-12',
    updatedAt: '2024-01-15',
    lastInspectionDate: '2023-11-10',
    nextInspectionDate: '2024-05-10'
  },
  
  {
    id: 'WH_006',
    name: 'مخزن النسيج والملابس الجاهزة - المحلة الكبرى',
    nameEn: 'El Mahalla Textile & Ready Made Garments Warehouse',
    code: 'MTG-006',
    type: 'manufacturing',
    status: 'active',
    establishedDate: '2019-05-18',
    licenseNumber: 'WH-MHL-2019-006',
    taxNumber: '200-678-901',
    
    manager: {
      id: 'MGR_006',
      name: 'نادية حسن محمود',
      email: 'nadia.manager@pinion-egypt.com',
      phone: '+20 11 7654 3210',
      position: 'مديرة مخزن النسيج',
      experience: 11,
      certifications: ['إدارة صناعة النسيج', 'مراقبة الجودة النسيجية', 'OEKO-TEX'],
      joinDate: '2019-05-18',
      department: 'النسيج والملابس'
    },
    
    location: {
      coordinates: {
        latitude: 30.9718,
        longitude: 31.1669
      },
      address: {
        street: 'شارع الصناعة',
        area: 'المنطقة الصناعية',
        city: 'المحلة الكبرى',
        governorate: 'الغربية',
        postalCode: '31951',
        country: 'مصر'
      },
      accessibility: {
        nearestPort: 'ميناء الإسكندرية',
        nearestAirport: 'مطار القاهرة الدولي',
        majorRoads: ['طريق القاهرة الإسكندرية الزراعي', 'طريق المحلة طنطا'],
        publicTransport: true
      }
    },
    
    facilities: {
      totalArea: 8500,
      storageArea: 7200,
      officeArea: 600,
      loadingDocks: 10,
      parkingSpaces: 35,
      securitySystems: ['كاميرات مراقبة', 'أنظمة إنذار', 'حراسة 24/7'],
      climateControl: true,
      fireProtection: ['رشاشات أوتوماتيكية', 'طفايات حريق', 'أنظمة إنذار دخان'],
      powerBackup: true,
      internetConnectivity: 'إنترنت عالي السرعة'
    },
    
    operations: {
      workingHours: {
        weekdays: '7:00 ص - 5:00 م',
        weekends: '8:00 ص - 2:00 م',
        holidays: 'مغلق'
      },
      shiftPattern: 'وردية واحدة',
      staffCount: {
        management: 4,
        warehouse: 20,
        security: 6,
        maintenance: 3
      },
      equipmentList: ['رافعات شوكية', 'أنظمة تعليق الملابس', 'ماسحات باركود', 'معدات فحص الجودة'],
      safetyProtocols: ['تدريب السلامة الشهري', 'فحص المعدات الأسبوعي', 'مراقبة الرطوبة']
    },
    
    capacity: {
      maxVolume: 10000,
      maxWeight: 400,
      currentStock: 8500,
      availableSpace: 1500,
      reservedSpace: 200
    },
    
    productCategories: ['أقمشة قطنية', 'ملابس جاهزة', 'خيوط غزل', 'منسوجات منزلية'],
    specializations: ['القطن المصري', 'الملابس عالية الجودة', 'التصدير'],
    
    financials: {
      monthlyRent: 55000,
      operatingCosts: {
        utilities: 12000,
        maintenance: 8000,
        security: 15000,
        insurance: 5000,
        staff: 48000
      },
      revenue: {
        monthly: 195000,
        yearly: 2340000
      },
      profitMargin: 21.5,
      currency: 'EGP'
    },
    
    performance: {
      utilizationRate: 85.0,
      turnoverRate: 10,
      accuracyRate: 99.1,
      onTimeDelivery: 95.3,
      customerSatisfaction: 8.9,
      safetyRecord: {
        daysWithoutIncident: 280,
        totalIncidents: 1,
        lastIncidentDate: '2023-04-12'
      }
    },
    
    contactInfo: {
      phone: '+20 40 7890 1234',
      fax: '+20 40 7890 1235',
      email: 'mahalla.textile@pinion-egypt.com',
      website: 'www.pinion-egypt.com/warehouses/mahalla-textile',
      emergencyContact: '+20 11 7654 3210'
    },
    
    certifications: ['OEKO-TEX Standard 100', 'GOTS Certified', 'ISO 9001:2015', 'تراخيص التصدير'],
    tags: ['نسيج', 'قطن', 'ملابس', 'المحلة', 'تصدير'],
    
    createdAt: '2019-05-18',
    updatedAt: '2024-01-17',
    lastInspectionDate: '2023-10-25',
    nextInspectionDate: '2024-04-25'
  }
];

// دوال مساعدة
export const getWarehouseById = (id: string): Warehouse | undefined => {
  return WAREHOUSES_DATABASE.find(warehouse => warehouse.id === id);
};

export const getWarehousesByType = (type: string): Warehouse[] => {
  return WAREHOUSES_DATABASE.filter(warehouse => warehouse.type === type);
};

export const getWarehousesByGovernorate = (governorate: string): Warehouse[] => {
  return WAREHOUSES_DATABASE.filter(warehouse => 
    warehouse.location.address.governorate === governorate
  );
};

export const getActiveWarehouses = (): Warehouse[] => {
  return WAREHOUSES_DATABASE.filter(warehouse => warehouse.status === 'active');
};

export const getWarehousesByCategory = (category: string): Warehouse[] => {
  return WAREHOUSES_DATABASE.filter(warehouse => 
    warehouse.productCategories.some(cat => cat.includes(category))
  );
};

export const searchWarehouses = (query: string): Warehouse[] => {
  const searchTerm = query.toLowerCase();
  return WAREHOUSES_DATABASE.filter(warehouse => 
    warehouse.name.toLowerCase().includes(searchTerm) ||
    warehouse.nameEn.toLowerCase().includes(searchTerm) ||
    warehouse.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};

export const getTopPerformingWarehouses = (minRating: number = 8.0): Warehouse[] => {
  return WAREHOUSES_DATABASE
    .filter(warehouse => warehouse.performance.customerSatisfaction >= minRating)
    .sort((a, b) => b.performance.customerSatisfaction - a.performance.customerSatisfaction);
};

export const getWarehouseUtilization = (): { id: string; name: string; utilization: number }[] => {
  return WAREHOUSES_DATABASE.map(warehouse => ({
    id: warehouse.id,
    name: warehouse.name,
    utilization: warehouse.performance.utilizationRate
  }));
};