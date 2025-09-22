// قاعدة بيانات المستخدمين والموظفين المصريين المحسنة
// Enhanced Egyptian Users & Employees Database

export interface UserPersonalInfo {
  firstName: string;
  lastName: string;
  fullName: string;
  nationalId: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  nationality: string;
  religion?: string;
}

export interface UserContactInfo {
  email: string;
  phone: string;
  mobile: string;
  alternativePhone?: string;
  address: {
    street: string;
    area: string;
    city: string;
    governorate: string;
    postalCode?: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface UserEmploymentInfo {
  employeeId: string;
  position: string;
  department: string;
  directManager?: string;
  hireDate: string;
  contractType: 'permanent' | 'temporary' | 'contract' | 'internship';
  workLocation: string;
  workSchedule: {
    type: 'full_time' | 'part_time' | 'shift_work';
    hoursPerWeek: number;
    workingDays: string[];
    startTime: string;
    endTime: string;
  };
  probationPeriod?: {
    duration: number; // بالأشهر
    endDate: string;
    status: 'active' | 'completed' | 'extended';
  };
}

export interface UserSalaryInfo {
  basicSalary: number;
  allowances: {
    transportation: number;
    meals: number;
    housing?: number;
    medical: number;
    other: number;
  };
  deductions: {
    tax: number;
    socialInsurance: number;
    other: number;
  };
  netSalary: number;
  currency: string;
  paymentMethod: 'bank_transfer' | 'cash' | 'check';
  bankAccount?: {
    bankName: string;
    accountNumber: string;
    iban?: string;
  };
}

export interface UserEducationInfo {
  degree: string;
  major: string;
  university: string;
  graduationYear: number;
  grade?: string;
  additionalCertifications: {
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
  }[];
}

export interface UserPerformanceInfo {
  lastReviewDate: string;
  nextReviewDate: string;
  overallRating: number; // من 1 إلى 5
  strengths: string[];
  areasForImprovement: string[];
  goals: {
    description: string;
    targetDate: string;
    status: 'pending' | 'in_progress' | 'completed';
  }[];
  trainingCompleted: {
    name: string;
    completionDate: string;
    score?: number;
  }[];
}

export interface UserSystemAccess {
  username: string;
  role: 'admin' | 'warehouse_manager' | 'inventory_manager' | 'purchasing_manager' | 'sales_manager' | 'employee' | 'viewer';
  permissions: string[];
  accessLevel: number; // من 1 إلى 10
  lastLogin?: string;
  loginCount: number;
  accountStatus: 'active' | 'inactive' | 'suspended' | 'locked';
  passwordLastChanged: string;
  twoFactorEnabled: boolean;
}

export interface User {
  id: string;
  
  // معلومات شخصية
  personalInfo: UserPersonalInfo;
  
  // معلومات الاتصال
  contactInfo: UserContactInfo;
  
  // معلومات الوظيفة
  employmentInfo: UserEmploymentInfo;
  
  // معلومات الراتب
  salaryInfo: UserSalaryInfo;
  
  // معلومات التعليم
  educationInfo: UserEducationInfo;
  
  // معلومات الأداء
  performanceInfo: UserPerformanceInfo;
  
  // صلاحيات النظام
  systemAccess: UserSystemAccess;
  
  // معلومات إضافية
  profilePicture?: string;
  notes?: string;
  tags: string[];
  
  // تواريخ التتبع
  createdAt: string;
  updatedAt: string;
  
  // حالة الموظف
  status: 'active' | 'inactive' | 'on_leave' | 'terminated';
  terminationDate?: string;
  terminationReason?: string;
}

// قاعدة بيانات المستخدمين المصريين المحسنة
export const USERS_DATABASE: User[] = [
  {
    id: 'USR_001',
    personalInfo: {
      firstName: 'أحمد',
      lastName: 'محمد السيد',
      fullName: 'أحمد محمد السيد',
      nationalId: '29012011234567',
      dateOfBirth: '1990-12-01',
      gender: 'male',
      maritalStatus: 'married',
      nationality: 'مصري',
      religion: 'مسلم'
    },
    contactInfo: {
      email: 'ahmed.manager@pinion-egypt.com',
      phone: '+20 2 2345 6789',
      mobile: '+20 10 1234 5678',
      address: {
        street: '25 شارع النيل',
        area: 'المعادي',
        city: 'القاهرة',
        governorate: 'القاهرة',
        postalCode: '11728',
        country: 'مصر'
      },
      emergencyContact: {
        name: 'فاطمة أحمد السيد',
        relationship: 'زوجة',
        phone: '+20 11 9876 5432'
      }
    },
    employmentInfo: {
      employeeId: 'EMP_001',
      position: 'مدير المخزن الرئيسي',
      department: 'إدارة المخازن',
      hireDate: '2020-03-15',
      contractType: 'permanent',
      workLocation: 'مخزن القاهرة المركزي',
      workSchedule: {
        type: 'full_time',
        hoursPerWeek: 48,
        workingDays: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'السبت'],
        startTime: '08:00',
        endTime: '18:00'
      }
    },
    salaryInfo: {
      basicSalary: 15000,
      allowances: {
        transportation: 800,
        meals: 600,
        housing: 2000,
        medical: 500,
        other: 300
      },
      deductions: {
        tax: 1200,
        socialInsurance: 1100,
        other: 200
      },
      netSalary: 16700,
      currency: 'EGP',
      paymentMethod: 'bank_transfer',
      bankAccount: {
        bankName: 'البنك الأهلي المصري',
        accountNumber: '1234567890123456',
        iban: 'EG380003001234567890123456789'
      }
    },
    educationInfo: {
      degree: 'بكالوريوس',
      major: 'إدارة الأعمال',
      university: 'جامعة القاهرة',
      graduationYear: 2012,
      grade: 'جيد جداً',
      additionalCertifications: [
        {
          name: 'إدارة المخازن المعتمدة',
          issuer: 'معهد الإدارة العامة',
          issueDate: '2018-06-15',
          expiryDate: '2025-06-15'
        },
        {
          name: 'ISO 9001 Lead Auditor',
          issuer: 'BSI Group',
          issueDate: '2019-09-20',
          expiryDate: '2026-09-20'
        }
      ]
    },
    performanceInfo: {
      lastReviewDate: '2023-12-15',
      nextReviewDate: '2024-12-15',
      overallRating: 4.5,
      strengths: ['القيادة الفعالة', 'إدارة الوقت', 'حل المشكلات'],
      areasForImprovement: ['التكنولوجيا الحديثة', 'اللغة الإنجليزية'],
      goals: [
        {
          description: 'تحسين كفاءة المخزن بنسبة 15%',
          targetDate: '2024-06-30',
          status: 'in_progress'
        },
        {
          description: 'الحصول على شهادة Six Sigma',
          targetDate: '2024-12-31',
          status: 'pending'
        }
      ],
      trainingCompleted: [
        {
          name: 'إدارة المخازن الحديثة',
          completionDate: '2023-08-20',
          score: 92
        },
        {
          name: 'السلامة المهنية',
          completionDate: '2023-10-15',
          score: 88
        }
      ]
    },
    systemAccess: {
      username: 'ahmed.manager',
      role: 'warehouse_manager',
      permissions: ['warehouse_management', 'inventory_view', 'reports_generate', 'staff_management'],
      accessLevel: 8,
      lastLogin: '2024-01-20T08:30:00Z',
      loginCount: 1247,
      accountStatus: 'active',
      passwordLastChanged: '2023-11-15',
      twoFactorEnabled: true
    },
    profilePicture: '/images/profiles/ahmed_manager.jpg',
    notes: 'موظف متميز، يتمتع بخبرة واسعة في إدارة المخازن',
    tags: ['مدير', 'خبير', 'قيادي', 'موثوق'],
    createdAt: '2020-03-15',
    updatedAt: '2024-01-20',
    status: 'active'
  },
  
  {
    id: 'USR_002',
    personalInfo: {
      firstName: 'فاطمة',
      lastName: 'أحمد علي',
      fullName: 'فاطمة أحمد علي',
      nationalId: '29205021234568',
      dateOfBirth: '1992-05-20',
      gender: 'female',
      maritalStatus: 'single',
      nationality: 'مصرية',
      religion: 'مسلمة'
    },
    contactInfo: {
      email: 'fatma.manager@pinion-egypt.com',
      phone: '+20 3 3456 7890',
      mobile: '+20 11 2345 6789',
      address: {
        street: '12 شارع سعد زغلول',
        area: 'محطة الرمل',
        city: 'الإسكندرية',
        governorate: 'الإسكندرية',
        postalCode: '21131',
        country: 'مصر'
      },
      emergencyContact: {
        name: 'أحمد علي محمد',
        relationship: 'والد',
        phone: '+20 12 8765 4321'
      }
    },
    employmentInfo: {
      employeeId: 'EMP_002',
      position: 'مديرة مخزن التجزئة',
      department: 'إدارة التجزئة',
      hireDate: '2021-07-10',
      contractType: 'permanent',
      workLocation: 'مخزن الإسكندرية للهواتف',
      workSchedule: {
        type: 'full_time',
        hoursPerWeek: 45,
        workingDays: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
        startTime: '09:00',
        endTime: '18:00'
      }
    },
    salaryInfo: {
      basicSalary: 12000,
      allowances: {
        transportation: 600,
        meals: 500,
        medical: 400,
        other: 200
      },
      deductions: {
        tax: 900,
        socialInsurance: 850,
        other: 150
      },
      netSalary: 11800,
      currency: 'EGP',
      paymentMethod: 'bank_transfer',
      bankAccount: {
        bankName: 'بنك الإسكندرية',
        accountNumber: '2345678901234567',
        iban: 'EG210003002345678901234567890'
      }
    },
    educationInfo: {
      degree: 'بكالوريوس',
      major: 'التجارة - إدارة أعمال',
      university: 'جامعة الإسكندرية',
      graduationYear: 2014,
      grade: 'امتياز',
      additionalCertifications: [
        {
          name: 'إدارة التجزئة المعتمدة',
          issuer: 'الأكاديمية العربية للعلوم والتكنولوجيا',
          issueDate: '2020-03-10',
          expiryDate: '2027-03-10'
        },
        {
          name: 'خدمة العملاء المتقدمة',
          issuer: 'معهد خدمة العملاء المصري',
          issueDate: '2021-01-15'
        }
      ]
    },
    performanceInfo: {
      lastReviewDate: '2023-11-20',
      nextReviewDate: '2024-11-20',
      overallRating: 4.2,
      strengths: ['التواصل الفعال', 'خدمة العملاء', 'إدارة الفريق'],
      areasForImprovement: ['التحليل المالي', 'إدارة المشاريع'],
      goals: [
        {
          description: 'زيادة رضا العملاء إلى 95%',
          targetDate: '2024-08-31',
          status: 'in_progress'
        },
        {
          description: 'تطوير نظام إدارة المخزون',
          targetDate: '2024-10-31',
          status: 'pending'
        }
      ],
      trainingCompleted: [
        {
          name: 'إدارة خدمة العملاء',
          completionDate: '2023-05-12',
          score: 95
        },
        {
          name: 'تقنيات البيع الحديثة',
          completionDate: '2023-09-08',
          score: 89
        }
      ]
    },
    systemAccess: {
      username: 'fatma.manager',
      role: 'warehouse_manager',
      permissions: ['warehouse_management', 'inventory_view', 'customer_service', 'sales_reports'],
      accessLevel: 7,
      lastLogin: '2024-01-18T09:15:00Z',
      loginCount: 892,
      accountStatus: 'active',
      passwordLastChanged: '2023-12-01',
      twoFactorEnabled: true
    },
    profilePicture: '/images/profiles/fatma_manager.jpg',
    notes: 'موظفة متميزة في خدمة العملاء وإدارة التجزئة',
    tags: ['مديرة', 'خدمة عملاء', 'تجزئة', 'متميزة'],
    createdAt: '2021-07-10',
    updatedAt: '2024-01-18',
    status: 'active'
  },
  
  {
    id: 'USR_003',
    personalInfo: {
      firstName: 'محمد',
      lastName: 'حسن إبراهيم',
      fullName: 'محمد حسن إبراهيم',
      nationalId: '28508151234569',
      dateOfBirth: '1985-08-15',
      gender: 'male',
      maritalStatus: 'married',
      nationality: 'مصري',
      religion: 'مسلم'
    },
    contactInfo: {
      email: 'mohamed.manager@pinion-egypt.com',
      phone: '+20 55 4567 8901',
      mobile: '+20 12 3456 7890',
      address: {
        street: '8 شارع الجمهورية',
        area: 'مدينة العاشر من رمضان',
        city: 'العاشر من رمضان',
        governorate: 'الشرقية',
        postalCode: '44629',
        country: 'مصر'
      },
      emergencyContact: {
        name: 'نادية حسن محمود',
        relationship: 'زوجة',
        phone: '+20 11 7654 3210'
      }
    },
    employmentInfo: {
      employeeId: 'EMP_003',
      position: 'مدير مخزن الصناعات الثقيلة',
      department: 'الصناعات الثقيلة',
      hireDate: '2019-01-20',
      contractType: 'permanent',
      workLocation: 'مخزن الصلب والحديد',
      workSchedule: {
        type: 'shift_work',
        hoursPerWeek: 48,
        workingDays: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'السبت'],
        startTime: '06:00',
        endTime: '18:00'
      }
    },
    salaryInfo: {
      basicSalary: 18000,
      allowances: {
        transportation: 1000,
        meals: 800,
        housing: 2500,
        medical: 600,
        other: 500
      },
      deductions: {
        tax: 1500,
        socialInsurance: 1350,
        other: 250
      },
      netSalary: 20300,
      currency: 'EGP',
      paymentMethod: 'bank_transfer',
      bankAccount: {
        bankName: 'بنك مصر',
        accountNumber: '3456789012345678',
        iban: 'EG120003003456789012345678901'
      }
    },
    educationInfo: {
      degree: 'بكالوريوس',
      major: 'هندسة ميكانيكية',
      university: 'جامعة الزقازيق',
      graduationYear: 2008,
      grade: 'جيد جداً',
      additionalCertifications: [
        {
          name: 'إدارة المواد الثقيلة',
          issuer: 'نقابة المهندسين المصرية',
          issueDate: '2015-04-20',
          expiryDate: '2025-04-20'
        },
        {
          name: 'السلامة الصناعية',
          issuer: 'وزارة القوى العاملة',
          issueDate: '2017-11-10',
          expiryDate: '2024-11-10'
        },
        {
          name: 'ISO 14001 Environmental Management',
          issuer: 'TUV Rheinland',
          issueDate: '2020-02-15',
          expiryDate: '2026-02-15'
        }
      ]
    },
    performanceInfo: {
      lastReviewDate: '2023-10-15',
      nextReviewDate: '2024-10-15',
      overallRating: 4.7,
      strengths: ['الخبرة التقنية', 'إدارة المخاطر', 'القيادة الصناعية'],
      areasForImprovement: ['التقنيات الرقمية', 'إدارة التكاليف'],
      goals: [
        {
          description: 'تقليل الحوادث الصناعية إلى الصفر',
          targetDate: '2024-12-31',
          status: 'in_progress'
        },
        {
          description: 'تحسين كفاءة الطاقة بنسبة 20%',
          targetDate: '2024-09-30',
          status: 'pending'
        }
      ],
      trainingCompleted: [
        {
          name: 'إدارة السلامة الصناعية المتقدمة',
          completionDate: '2023-03-25',
          score: 96
        },
        {
          name: 'تقنيات التصنيع الحديثة',
          completionDate: '2023-07-18',
          score: 91
        }
      ]
    },
    systemAccess: {
      username: 'mohamed.manager',
      role: 'warehouse_manager',
      permissions: ['warehouse_management', 'safety_management', 'equipment_control', 'industrial_reports'],
      accessLevel: 9,
      lastLogin: '2024-01-19T06:45:00Z',
      loginCount: 1456,
      accountStatus: 'active',
      passwordLastChanged: '2023-10-20',
      twoFactorEnabled: true
    },
    profilePicture: '/images/profiles/mohamed_manager.jpg',
    notes: 'خبير في الصناعات الثقيلة، سجل أمان ممتاز',
    tags: ['مدير', 'صناعي', 'خبير', 'أمان'],
    createdAt: '2019-01-20',
    updatedAt: '2024-01-19',
    status: 'active'
  },
  
  {
    id: 'USR_004',
    personalInfo: {
      firstName: 'سارة',
      lastName: 'محمود أحمد',
      fullName: 'سارة محمود أحمد',
      nationalId: '29110101234570',
      dateOfBirth: '1991-10-10',
      gender: 'female',
      maritalStatus: 'married',
      nationality: 'مصرية',
      religion: 'مسلمة'
    },
    contactInfo: {
      email: 'sara.manager@pinion-egypt.com',
      phone: '+20 62 5678 9012',
      mobile: '+20 10 9876 5432',
      address: {
        street: '15 شارع الجلاء',
        area: 'الأربعين',
        city: 'السويس',
        governorate: 'السويس',
        postalCode: '43511',
        country: 'مصر'
      },
      emergencyContact: {
        name: 'محمود أحمد علي',
        relationship: 'والد',
        phone: '+20 12 5432 1098'
      }
    },
    employmentInfo: {
      employeeId: 'EMP_004',
      position: 'مديرة مخزن مواد البناء',
      department: 'مواد البناء',
      hireDate: '2018-11-05',
      contractType: 'permanent',
      workLocation: 'مخزن الأسمنت والمواد الإنشائية',
      workSchedule: {
        type: 'full_time',
        hoursPerWeek: 50,
        workingDays: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'السبت'],
        startTime: '06:00',
        endTime: '20:00'
      }
    },
    salaryInfo: {
      basicSalary: 16000,
      allowances: {
        transportation: 900,
        meals: 700,
        housing: 2200,
        medical: 550,
        other: 400
      },
      deductions: {
        tax: 1300,
        socialInsurance: 1200,
        other: 200
      },
      netSalary: 18050,
      currency: 'EGP',
      paymentMethod: 'bank_transfer',
      bankAccount: {
        bankName: 'البنك التجاري الدولي',
        accountNumber: '4567890123456789',
        iban: 'EG030003004567890123456789012'
      }
    },
    educationInfo: {
      degree: 'بكالوريوس',
      major: 'هندسة مدنية',
      university: 'جامعة قناة السويس',
      graduationYear: 2013,
      grade: 'امتياز مع مرتبة الشرف',
      additionalCertifications: [
        {
          name: 'إدارة مواد البناء',
          issuer: 'نقابة المهندسين المصرية',
          issueDate: '2016-08-12',
          expiryDate: '2026-08-12'
        },
        {
          name: 'مراقبة الجودة في البناء',
          issuer: 'الهيئة المصرية العامة للمواصفات والجودة',
          issueDate: '2018-05-20',
          expiryDate: '2025-05-20'
        },
        {
          name: 'السلامة البيئية',
          issuer: 'وزارة البيئة المصرية',
          issueDate: '2019-12-08',
          expiryDate: '2026-12-08'
        }
      ]
    },
    performanceInfo: {
      lastReviewDate: '2023-12-01',
      nextReviewDate: '2024-12-01',
      overallRating: 4.6,
      strengths: ['إدارة الجودة', 'التخطيط الاستراتيجي', 'حل المشكلات التقنية'],
      areasForImprovement: ['إدارة الموارد البشرية', 'التسويق'],
      goals: [
        {
          description: 'تحقيق معدل جودة 99.5%',
          targetDate: '2024-06-30',
          status: 'in_progress'
        },
        {
          description: 'تطوير نظام إدارة المخزون الذكي',
          targetDate: '2024-11-30',
          status: 'pending'
        }
      ],
      trainingCompleted: [
        {
          name: 'إدارة الجودة الشاملة',
          completionDate: '2023-04-15',
          score: 94
        },
        {
          name: 'تقنيات البناء الحديثة',
          completionDate: '2023-08-22',
          score: 97
        }
      ]
    },
    systemAccess: {
      username: 'sara.manager',
      role: 'warehouse_manager',
      permissions: ['warehouse_management', 'quality_control', 'construction_materials', 'environmental_reports'],
      accessLevel: 8,
      lastLogin: '2024-01-20T06:30:00Z',
      loginCount: 1123,
      accountStatus: 'active',
      passwordLastChanged: '2023-11-25',
      twoFactorEnabled: true
    },
    profilePicture: '/images/profiles/sara_manager.jpg',
    notes: 'مهندسة متميزة، خبيرة في مواد البناء ومراقبة الجودة',
    tags: ['مديرة', 'مهندسة', 'جودة', 'بناء'],
    createdAt: '2018-11-05',
    updatedAt: '2024-01-20',
    status: 'active'
  },
  
  {
    id: 'USR_005',
    personalInfo: {
      firstName: 'خالد',
      lastName: 'عبد الرحمن محمد',
      fullName: 'خالد عبد الرحمن محمد',
      nationalId: '28703251234571',
      dateOfBirth: '1987-03-25',
      gender: 'male',
      maritalStatus: 'married',
      nationality: 'مصري',
      religion: 'مسلم'
    },
    contactInfo: {
      email: 'khaled.manager@pinion-egypt.com',
      phone: '+20 2 6789 0123',
      mobile: '+20 12 8765 4321',
      address: {
        street: '30 شارع عباس العقاد',
        area: 'مدينة نصر',
        city: 'القاهرة',
        governorate: 'القاهرة',
        postalCode: '11371',
        country: 'مصر'
      },
      emergencyContact: {
        name: 'مريم خالد أحمد',
        relationship: 'زوجة',
        phone: '+20 11 4321 0987'
      }
    },
    employmentInfo: {
      employeeId: 'EMP_005',
      position: 'مدير مخزن قطع الغيار',
      department: 'قطع الغيار',
      hireDate: '2020-09-12',
      contractType: 'permanent',
      workLocation: 'مخزن قطع غيار السيارات',
      workSchedule: {
        type: 'full_time',
        hoursPerWeek: 48,
        workingDays: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'السبت'],
        startTime: '08:00',
        endTime: '19:00'
      }
    },
    salaryInfo: {
      basicSalary: 14000,
      allowances: {
        transportation: 750,
        meals: 600,
        medical: 450,
        other: 300
      },
      deductions: {
        tax: 1100,
        socialInsurance: 1000,
        other: 150
      },
      netSalary: 13850,
      currency: 'EGP',
      paymentMethod: 'bank_transfer',
      bankAccount: {
        bankName: 'بنك القاهرة',
        accountNumber: '5678901234567890',
        iban: 'EG240003005678901234567890123'
      }
    },
    educationInfo: {
      degree: 'دبلوم',
      major: 'هندسة السيارات',
      university: 'المعهد العالي للتكنولوجيا',
      graduationYear: 2009,
      grade: 'جيد جداً',
      additionalCertifications: [
        {
          name: 'إدارة قطع الغيار',
          issuer: 'غرفة صناعة السيارات المصرية',
          issueDate: '2018-02-10',
          expiryDate: '2025-02-10'
        },
        {
          name: 'خدمة العملاء التقنية',
          issuer: 'معهد خدمة العملاء المصري',
          issueDate: '2019-07-15'
        },
        {
          name: 'Toyota Certified Technician',
          issuer: 'Toyota Motor Corporation',
          issueDate: '2021-03-20',
          expiryDate: '2026-03-20'
        }
      ]
    },
    performanceInfo: {
      lastReviewDate: '2023-11-10',
      nextReviewDate: '2024-11-10',
      overallRating: 4.3,
      strengths: ['المعرفة التقنية', 'خدمة العملاء', 'إدارة المخزون'],
      areasForImprovement: ['القيادة', 'التخطيط الاستراتيجي'],
      goals: [
        {
          description: 'تحسين وقت الاستجابة للعملاء',
          targetDate: '2024-05-31',
          status: 'in_progress'
        },
        {
          description: 'زيادة مبيعات قطع الغيار بنسبة 25%',
          targetDate: '2024-12-31',
          status: 'pending'
        }
      ],
      trainingCompleted: [
        {
          name: 'تقنيات السيارات الحديثة',
          completionDate: '2023-06-12',
          score: 90
        },
        {
          name: 'إدارة المخزون الذكي',
          completionDate: '2023-09-28',
          score: 87
        }
      ]
    },
    systemAccess: {
      username: 'khaled.manager',
      role: 'warehouse_manager',
      permissions: ['warehouse_management', 'auto_parts', 'customer_service', 'technical_support'],
      accessLevel: 7,
      lastLogin: '2024-01-15T08:45:00Z',
      loginCount: 756,
      accountStatus: 'active',
      passwordLastChanged: '2023-12-10',
      twoFactorEnabled: false
    },
    profilePicture: '/images/profiles/khaled_manager.jpg',
    notes: 'خبير في قطع غيار السيارات، خدمة عملاء ممتازة',
    tags: ['مدير', 'سيارات', 'تقني', 'خدمة عملاء'],
    createdAt: '2020-09-12',
    updatedAt: '2024-01-15',
    status: 'active'
  },
  
  {
    id: 'USR_006',
    personalInfo: {
      firstName: 'نادية',
      lastName: 'حسن محمود',
      fullName: 'نادية حسن محمود',
      nationalId: '28912151234572',
      dateOfBirth: '1989-12-15',
      gender: 'female',
      maritalStatus: 'married',
      nationality: 'مصرية',
      religion: 'مسلمة'
    },
    contactInfo: {
      email: 'nadia.manager@pinion-egypt.com',
      phone: '+20 40 7890 1234',
      mobile: '+20 11 7654 3210',
      address: {
        street: '22 شارع الجمهورية',
        area: 'وسط البلد',
        city: 'المحلة الكبرى',
        governorate: 'الغربية',
        postalCode: '31951',
        country: 'مصر'
      },
      emergencyContact: {
        name: 'حسن محمود علي',
        relationship: 'والد',
        phone: '+20 10 3210 9876'
      }
    },
    employmentInfo: {
      employeeId: 'EMP_006',
      position: 'مديرة مخزن النسيج',
      department: 'النسيج والملابس',
      hireDate: '2019-05-18',
      contractType: 'permanent',
      workLocation: 'مخزن النسيج والملابس الجاهزة',
      workSchedule: {
        type: 'full_time',
        hoursPerWeek: 45,
        workingDays: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
        startTime: '07:00',
        endTime: '17:00'
      }
    },
    salaryInfo: {
      basicSalary: 13500,
      allowances: {
        transportation: 700,
        meals: 550,
        medical: 400,
        other: 250
      },
      deductions: {
        tax: 1050,
        socialInsurance: 950,
        other: 100
      },
      netSalary: 13300,
      currency: 'EGP',
      paymentMethod: 'bank_transfer',
      bankAccount: {
        bankName: 'بنك الأهلي المصري',
        accountNumber: '6789012345678901',
        iban: 'EG350003006789012345678901234'
      }
    },
    educationInfo: {
      degree: 'بكالوريوس',
      major: 'هندسة النسيج',
      university: 'جامعة الإسكندرية',
      graduationYear: 2011,
      grade: 'جيد جداً',
      additionalCertifications: [
        {
          name: 'إدارة صناعة النسيج',
          issuer: 'اتحاد الصناعات المصرية',
          issueDate: '2017-09-25',
          expiryDate: '2024-09-25'
        },
        {
          name: 'مراقبة الجودة النسيجية',
          issuer: 'الهيئة المصرية العامة للمواصفات والجودة',
          issueDate: '2018-11-12',
          expiryDate: '2025-11-12'
        },
        {
          name: 'OEKO-TEX Standard 100',
          issuer: 'OEKO-TEX Association',
          issueDate: '2020-06-08',
          expiryDate: '2025-06-08'
        }
      ]
    },
    performanceInfo: {
      lastReviewDate: '2023-10-25',
      nextReviewDate: '2024-10-25',
      overallRating: 4.4,
      strengths: ['إدارة الجودة', 'التصدير', 'تطوير المنتجات'],
      areasForImprovement: ['التسويق الرقمي', 'إدارة التكاليف'],
      goals: [
        {
          description: 'زيادة صادرات النسيج بنسبة 30%',
          targetDate: '2024-08-31',
          status: 'in_progress'
        },
        {
          description: 'تطوير خط إنتاج جديد للملابس العضوية',
          targetDate: '2024-12-31',
          status: 'pending'
        }
      ],
      trainingCompleted: [
        {
          name: 'تقنيات النسيج المتقدمة',
          completionDate: '2023-02-18',
          score: 93
        },
        {
          name: 'إدارة التصدير',
          completionDate: '2023-07-05',
          score: 89
        }
      ]
    },
    systemAccess: {
      username: 'nadia.manager',
      role: 'warehouse_manager',
      permissions: ['warehouse_management', 'textile_quality', 'export_management', 'production_planning'],
      accessLevel: 8,
      lastLogin: '2024-01-17T07:20:00Z',
      loginCount: 967,
      accountStatus: 'active',
      passwordLastChanged: '2023-10-30',
      twoFactorEnabled: true
    },
    profilePicture: '/images/profiles/nadia_manager.jpg',
    notes: 'خبيرة في صناعة النسيج والتصدير، جودة عالية',
    tags: ['مديرة', 'نسيج', 'تصدير', 'جودة'],
    createdAt: '2019-05-18',
    updatedAt: '2024-01-17',
    status: 'active'
  }
];

// دوال مساعدة
export const getUserById = (id: string): User | undefined => {
  return USERS_DATABASE.find(user => user.id === id);
};

export const getUsersByRole = (role: string): User[] => {
  return USERS_DATABASE.filter(user => user.systemAccess.role === role);
};

export const getUsersByDepartment = (department: string): User[] => {
  return USERS_DATABASE.filter(user => user.employmentInfo.department === department);
};

export const getActiveUsers = (): User[] => {
  return USERS_DATABASE.filter(user => user.status === 'active');
};

export const getUsersByGovernorate = (governorate: string): User[] => {
  return USERS_DATABASE.filter(user => 
    user.contactInfo.address.governorate === governorate
  );
};

export const searchUsers = (query: string): User[] => {
  const searchTerm = query.toLowerCase();
  return USERS_DATABASE.filter(user => 
    user.personalInfo.fullName.toLowerCase().includes(searchTerm) ||
    user.contactInfo.email.toLowerCase().includes(searchTerm) ||
    user.employmentInfo.position.toLowerCase().includes(searchTerm) ||
    user.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};

export const getTopPerformers = (minRating: number = 4.0): User[] => {
  return USERS_DATABASE
    .filter(user => user.performanceInfo.overallRating >= minRating)
    .sort((a, b) => b.performanceInfo.overallRating - a.performanceInfo.overallRating);
};

export const getUsersWithUpcomingReviews = (daysAhead: number = 30): User[] => {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + daysAhead);
  
  return USERS_DATABASE.filter(user => {
    const reviewDate = new Date(user.performanceInfo.nextReviewDate);
    return reviewDate <= targetDate;
  });
};

export const getUserSalaryStatistics = () => {
  const salaries = USERS_DATABASE.map(user => user.salaryInfo.netSalary);
  return {
    average: salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length,
    min: Math.min(...salaries),
    max: Math.max(...salaries),
    total: salaries.reduce((sum, salary) => sum + salary, 0)
  };
};