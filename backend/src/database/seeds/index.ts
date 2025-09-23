import prisma from '@/config/database';
import bcrypt from 'bcryptjs';
import logger from '@/utils/logger';

async function main() {
  try {
    logger.info('Starting database seeding...');

    // Create default users
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Create general manager
    const generalManager = await prisma.user.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        username: 'admin',
        email: 'admin@pinion.com',
        fullName: 'أحمد محمد - مدير النظام',
        password: hashedPassword,
        role: 'GENERAL_MANAGER',
        isActive: true,
      },
    });

    // Create warehouse managers
    const warehouseManager1 = await prisma.user.upsert({
      where: { username: 'warehouse_manager' },
      update: {},
      create: {
        username: 'warehouse_manager',
        email: 'warehouse@pinion.com',
        fullName: 'محمد أحمد - مدير المخزن الرئيسي',
        password: hashedPassword,
        role: 'WAREHOUSE_MANAGER',
        isActive: true,
      },
    });

    const warehouseManager2 = await prisma.user.upsert({
      where: { username: 'warehouse_manager2' },
      update: {},
      create: {
        username: 'warehouse_manager2',
        email: 'warehouse2@pinion.com',
        fullName: 'فاطمة علي - مدير مخزن الإسكندرية',
        password: hashedPassword,
        role: 'WAREHOUSE_MANAGER',
        isActive: true,
      },
    });

    // Create purchasing manager
    const purchasingManager = await prisma.user.upsert({
      where: { username: 'purchasing_manager' },
      update: {},
      create: {
        username: 'purchasing_manager',
        email: 'purchasing@pinion.com',
        fullName: 'خالد حسن - مدير المشتريات',
        password: hashedPassword,
        role: 'PURCHASING_MANAGER',
        isActive: true,
      },
    });

    // Create warehouses
    const mainWarehouse = await prisma.warehouse.upsert({
      where: { code: 'MAIN_WH' },
      update: {},
      create: {
        name: 'المخزن الرئيسي - القاهرة',
        nameEn: 'Main Warehouse - Cairo',
        code: 'MAIN_WH',
        type: 'GENERAL',
        status: 'ACTIVE',
        address: 'شارع التحرير، وسط البلد، القاهرة',
        city: 'القاهرة',
        governorate: 'القاهرة',
        maxVolume: 15000,
        maxWeight: 8000,
        currentStock: 0,
        availableSpace: 15000,
        reservedSpace: 0,
        managerId: warehouseManager1.id,
        managerName: warehouseManager1.fullName,
        managerEmail: warehouseManager1.email,
        managerPhone: '+201234567890',
        phone: '+201234567890',
        email: 'warehouse@pinion.com',
        emergencyContact: '+201234567890',
      },
    });

    const alexWarehouse = await prisma.warehouse.upsert({
      where: { code: 'ALEX_WH' },
      update: {},
      create: {
        name: 'مخزن الإسكندرية',
        nameEn: 'Alexandria Warehouse',
        code: 'ALEX_WH',
        type: 'DISTRIBUTION',
        status: 'ACTIVE',
        address: 'الكورنيش، الإسكندرية',
        city: 'الإسكندرية',
        governorate: 'الإسكندرية',
        maxVolume: 10000,
        maxWeight: 5000,
        currentStock: 0,
        availableSpace: 10000,
        reservedSpace: 0,
        managerId: warehouseManager2.id,
        managerName: warehouseManager2.fullName,
        managerEmail: warehouseManager2.email,
        managerPhone: '+201234567891',
        phone: '+201234567891',
        email: 'warehouse2@pinion.com',
        emergencyContact: '+201234567891',
      },
    });

    const gizaWarehouse = await prisma.warehouse.upsert({
      where: { code: 'GIZA_WH' },
      update: {},
      create: {
        name: 'مخزن الجيزة',
        nameEn: 'Giza Warehouse',
        code: 'GIZA_WH',
        type: 'MANUFACTURING',
        status: 'ACTIVE',
        address: '6 أكتوبر، الجيزة',
        city: 'الجيزة',
        governorate: 'الجيزة',
        maxVolume: 12000,
        maxWeight: 6000,
        currentStock: 0,
        availableSpace: 12000,
        reservedSpace: 0,
        managerId: warehouseManager1.id,
        managerName: warehouseManager1.fullName,
        managerEmail: warehouseManager1.email,
        managerPhone: '+201234567892',
        phone: '+201234567892',
        email: 'giza@pinion.com',
        emergencyContact: '+201234567892',
      },
    });

    // Update warehouse managers
    await prisma.user.update({
      where: { id: warehouseManager1.id },
      data: { warehouseId: mainWarehouse.id },
    });
    await prisma.user.update({
      where: { id: warehouseManager2.id },
      data: { warehouseId: alexWarehouse.id },
    });

    // Create suppliers
    const suppliers = [
      {
        name: 'شركة التكنولوجيا المتقدمة',
        nameEn: 'Advanced Technology Co.',
        code: 'TECH001',
        email: 'info@advtech.com',
        phone: '+201111111111',
        address: 'مدينة نصر، القاهرة',
        city: 'القاهرة',
        governorate: 'القاهرة',
        contactPerson: 'أحمد محمود',
        isActive: true,
      },
      {
        name: 'مؤسسة الأجهزة الذكية',
        nameEn: 'Smart Devices Corp.',
        code: 'SMART001',
        email: 'sales@smartdev.com',
        phone: '+201222222222',
        address: 'الزمالك، القاهرة',
        city: 'القاهرة',
        governorate: 'القاهرة',
        contactPerson: 'فاطمة أحمد',
        isActive: true,
      },
      {
        name: 'شركة الإلكترونيات الحديثة',
        nameEn: 'Modern Electronics Ltd.',
        code: 'ELEC001',
        email: 'orders@modernelec.com',
        phone: '+201333333333',
        address: 'الإسكندرية',
        city: 'الإسكندرية',
        governorate: 'الإسكندرية',
        contactPerson: 'محمد علي',
        isActive: true,
      },
    ];

    const createdSuppliers = [];
    for (const supplier of suppliers) {
      const created = await prisma.supplier.upsert({
        where: { code: supplier.code },
        update: {},
        create: supplier,
      });
      createdSuppliers.push(created);
    }

    // Create products
    const products = [
      {
        name: 'لابتوب Dell Inspiron 15',
        nameEn: 'Dell Inspiron 15 Laptop',
        sku: 'DELL-INS-15-001',
        barcode: '1234567890123',
        category: 'أجهزة الكمبيوتر',
        subcategory: 'لابتوب',
        brand: 'Dell',
        model: 'Inspiron 15 3000',
        description: 'لابتوب Dell Inspiron 15 بمعالج Intel Core i5 وذاكرة 8GB RAM',
        unit: 'قطعة',
        weight: 2.5,
        status: 'ACTIVE',
        tags: ['laptop', 'dell', 'computer'],
        images: [],
        warehouseId: mainWarehouse.id,
      },
      {
        name: 'ماوس لاسلكي Logitech',
        nameEn: 'Logitech Wireless Mouse',
        sku: 'LOG-MOUSE-W001',
        barcode: '1234567890124',
        category: 'ملحقات الكمبيوتر',
        subcategory: 'ماوس',
        brand: 'Logitech',
        model: 'M705',
        description: 'ماوس لاسلكي من Logitech بتقنية البلوتوث',
        unit: 'قطعة',
        weight: 0.2,
        status: 'ACTIVE',
        tags: ['mouse', 'wireless', 'logitech'],
        images: [],
        warehouseId: mainWarehouse.id,
      },
      {
        name: 'كيبورد ميكانيكي RGB',
        nameEn: 'RGB Mechanical Keyboard',
        sku: 'KB-MECH-RGB001',
        barcode: '1234567890125',
        category: 'ملحقات الكمبيوتر',
        subcategory: 'كيبورد',
        brand: 'Corsair',
        model: 'K95 RGB',
        description: 'كيبورد ميكانيكي بإضاءة RGB قابلة للتخصيص',
        unit: 'قطعة',
        weight: 1.2,
        status: 'ACTIVE',
        tags: ['keyboard', 'mechanical', 'rgb'],
        images: [],
        warehouseId: mainWarehouse.id,
      },
      {
        name: 'شاشة Samsung 24 بوصة',
        nameEn: 'Samsung 24" Monitor',
        sku: 'SAM-MON-24001',
        barcode: '1234567890126',
        category: 'شاشات',
        subcategory: 'شاشة كمبيوتر',
        brand: 'Samsung',
        model: 'S24F350',
        description: 'شاشة Samsung 24 بوصة Full HD مع تقنية PLS',
        unit: 'قطعة',
        weight: 3.5,
        status: 'ACTIVE',
        tags: ['monitor', 'samsung', 'display'],
        images: [],
        warehouseId: alexWarehouse.id,
      },
      {
        name: 'هارد ديسك خارجي 1TB',
        nameEn: 'External Hard Drive 1TB',
        sku: 'HDD-EXT-1TB001',
        barcode: '1234567890127',
        category: 'تخزين',
        subcategory: 'هارد ديسك خارجي',
        brand: 'Seagate',
        model: 'Expansion 1TB',
        description: 'هارد ديسك خارجي بسعة 1 تيرابايت من Seagate',
        unit: 'قطعة',
        weight: 0.8,
        status: 'ACTIVE',
        tags: ['storage', 'external', 'seagate'],
        images: [],
        warehouseId: gizaWarehouse.id,
      },
      {
        name: 'طابعة HP LaserJet',
        nameEn: 'HP LaserJet Printer',
        sku: 'HP-LASER-001',
        barcode: '1234567890128',
        category: 'طابعات',
        subcategory: 'طابعة ليزر',
        brand: 'HP',
        model: 'LaserJet Pro M404n',
        description: 'طابعة HP LaserJet بتقنية الليزر للاستخدام المكتبي',
        unit: 'قطعة',
        weight: 8.5,
        status: 'ACTIVE',
        tags: ['printer', 'laser', 'hp'],
        images: [],
        warehouseId: mainWarehouse.id,
      },
    ];

    const createdProducts = [];
    for (const product of products) {
      const created = await prisma.product.upsert({
        where: { sku: product.sku },
        update: {},
        create: product,
      });
      createdProducts.push(created);
    }

    // Create inventory records
    const inventoryData = [
      { productId: createdProducts[0].id, warehouseId: mainWarehouse.id, quantity: 25, minStock: 5, maxStock: 50, reorderPoint: 10 },
      { productId: createdProducts[0].id, warehouseId: alexWarehouse.id, quantity: 15, minStock: 3, maxStock: 30, reorderPoint: 8 },
      { productId: createdProducts[1].id, warehouseId: mainWarehouse.id, quantity: 80, minStock: 10, maxStock: 100, reorderPoint: 20 },
      { productId: createdProducts[1].id, warehouseId: gizaWarehouse.id, quantity: 45, minStock: 10, maxStock: 80, reorderPoint: 15 },
      { productId: createdProducts[2].id, warehouseId: mainWarehouse.id, quantity: 0, minStock: 5, maxStock: 30, reorderPoint: 10 }, // Out of stock
      { productId: createdProducts[3].id, warehouseId: mainWarehouse.id, quantity: 12, minStock: 3, maxStock: 25, reorderPoint: 8 },
      { productId: createdProducts[3].id, warehouseId: alexWarehouse.id, quantity: 8, minStock: 3, maxStock: 20, reorderPoint: 6 },
      { productId: createdProducts[4].id, warehouseId: mainWarehouse.id, quantity: 35, minStock: 8, maxStock: 40, reorderPoint: 15 },
      { productId: createdProducts[4].id, warehouseId: gizaWarehouse.id, quantity: 20, minStock: 5, maxStock: 30, reorderPoint: 10 },
      { productId: createdProducts[5].id, warehouseId: mainWarehouse.id, quantity: 6, minStock: 2, maxStock: 15, reorderPoint: 5 },
    ];

    for (const inventory of inventoryData) {
      await prisma.inventory.upsert({
        where: {
          productId_warehouseId: {
            productId: inventory.productId,
            warehouseId: inventory.warehouseId,
          },
        },
        update: {},
        create: inventory,
      });
    }

    // Create sample transactions
    const transactions = [
      {
        type: 'PURCHASE',
        productId: createdProducts[0].id,
        warehouseId: mainWarehouse.id,
        quantity: 20,
        unitPrice: 15000,
        totalAmount: 300000,
        currency: 'EGP',
        userId: purchasingManager.id,
        supplierId: createdSuppliers[0].id,
        referenceNumber: 'PO-2024-001',
        notes: 'شراء دفعة جديدة من اللابتوبات',
        status: 'COMPLETED',
      },
      {
        type: 'SALE',
        productId: createdProducts[1].id,
        warehouseId: mainWarehouse.id,
        quantity: 5,
        unitPrice: 450,
        totalAmount: 2250,
        currency: 'EGP',
        userId: warehouseManager1.id,
        referenceNumber: 'INV-2024-001',
        notes: 'بيع للعميل أحمد محمد',
        status: 'COMPLETED',
      },
      {
        type: 'TRANSFER',
        productId: createdProducts[0].id,
        fromWarehouseId: mainWarehouse.id,
        toWarehouseId: alexWarehouse.id,
        warehouseId: mainWarehouse.id,
        quantity: 5,
        unitPrice: 15000,
        totalAmount: 75000,
        currency: 'EGP',
        userId: generalManager.id,
        referenceNumber: 'TR-2024-001',
        notes: 'نقل من المخزن الرئيسي إلى الإسكندرية',
        status: 'COMPLETED',
      },
    ];

    for (const transaction of transactions) {
      await prisma.transaction.create({
        data: transaction,
      });
    }

    // Create notifications
    const notifications = [
      {
        title: 'مخزون منخفض - كيبورد ميكانيكي',
        message: 'المنتج "كيبورد ميكانيكي RGB" نفد تماماً من المخزن الرئيسي. يرجى إعادة الطلب.',
        type: 'WARNING',
        category: 'INVENTORY',
        userId: generalManager.id,
        isRead: false,
      },
      {
        title: 'تم إكمال عملية النقل',
        message: 'تم نقل 5 قطع من "لابتوب Dell Inspiron 15" من المخزن الرئيسي إلى مخزن الإسكندرية بنجاح.',
        type: 'SUCCESS',
        category: 'INVENTORY',
        userId: generalManager.id,
        isRead: false,
      },
      {
        title: 'طلب شراء جديد',
        message: 'تم إنشاء طلب شراء جديد رقم PO-2024-001 بقيمة 300,000 ج.م من شركة التكنولوجيا المتقدمة.',
        type: 'INFO',
        category: 'SYSTEM',
        userId: purchasingManager.id,
        isRead: true,
      },
      {
        title: 'مبيعات اليوم',
        message: 'تم تسجيل مبيعات بقيمة 2,250 ج.م اليوم في المخزن الرئيسي.',
        type: 'INFO',
        category: 'REPORT',
        userId: warehouseManager1.id,
        isRead: true,
      },
    ];

    for (const notification of notifications) {
      await prisma.notification.create({
        data: notification,
      });
    }

    // Create default settings
    const settings = [
      { key: 'company_name', value: 'Pinion Stock Flow', type: 'string' },
      { key: 'company_name_ar', value: 'بينيون إدارة المخزون', type: 'string' },
      { key: 'currency', value: 'EGP', type: 'string' },
      { key: 'timezone', value: 'Africa/Cairo', type: 'string' },
      { key: 'date_format', value: 'DD/MM/YYYY', type: 'string' },
      { key: 'low_stock_threshold', value: '10', type: 'string' },
      { key: 'auto_backup', value: 'true', type: 'string' },
      { key: 'notification_email', value: 'notifications@pinion.com', type: 'string' },
      { key: 'max_file_size', value: '10485760', type: 'string' },
      { key: 'backup_frequency', value: 'daily', type: 'string' },
    ];

    for (const setting of settings) {
      await prisma.setting.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: setting,
      });
    }

    logger.info('Database seeding completed successfully');
    logger.info(`Created users: ${generalManager.username}, ${warehouseManager1.username}, ${warehouseManager2.username}, ${purchasingManager.username}`);
    logger.info(`Created warehouses: ${mainWarehouse.name}, ${alexWarehouse.name}, ${gizaWarehouse.name}`);
    logger.info(`Created ${createdSuppliers.length} suppliers`);
    logger.info(`Created ${createdProducts.length} products`);
    logger.info(`Created ${inventoryData.length} inventory records`);
    logger.info(`Created ${transactions.length} transactions`);
    logger.info(`Created ${notifications.length} notifications`);
    logger.info(`Created ${settings.length} settings`);

    logger.info('\n=== LOGIN CREDENTIALS ===');
    logger.info('General Manager: admin / admin123');
    logger.info('Warehouse Manager 1: warehouse_manager / admin123');
    logger.info('Warehouse Manager 2: warehouse_manager2 / admin123');
    logger.info('Purchasing Manager: purchasing_manager / admin123');

  } catch (error) {
    logger.error('Database seeding failed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    logger.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
