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
        fullName: 'مدير النظام',
        password: hashedPassword,
        role: 'GENERAL_MANAGER',
        isActive: true,
      },
    });

    // Create warehouse manager
    const warehouseManager = await prisma.user.upsert({
      where: { username: 'warehouse_manager' },
      update: {},
      create: {
        username: 'warehouse_manager',
        email: 'warehouse@pinion.com',
        fullName: 'مدير المخزن',
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
        fullName: 'مدير المشتريات',
        password: hashedPassword,
        role: 'PURCHASING_MANAGER',
        isActive: true,
      },
    });

    // Create default warehouse
    const warehouse = await prisma.warehouse.upsert({
      where: { code: 'MAIN_WH' },
      update: {},
      create: {
        name: 'المخزن الرئيسي',
        nameEn: 'Main Warehouse',
        code: 'MAIN_WH',
        type: 'GENERAL',
        status: 'ACTIVE',
        address: 'شارع التحرير، القاهرة',
        city: 'القاهرة',
        governorate: 'القاهرة',
        maxVolume: 10000,
        maxWeight: 5000,
        currentStock: 0,
        availableSpace: 10000,
        reservedSpace: 0,
        managerId: warehouseManager.id,
        managerName: warehouseManager.fullName,
        managerEmail: warehouseManager.email,
        managerPhone: '+201234567890',
        phone: '+201234567890',
        email: 'warehouse@pinion.com',
        emergencyContact: '+201234567890',
      },
    });

    // Update warehouse manager with warehouse ID
    await prisma.user.update({
      where: { id: warehouseManager.id },
      data: { warehouseId: warehouse.id },
    });

    // Create default settings
    const settings = [
      { key: 'company_name', value: 'Pinion Stock Flow', type: 'string' },
      { key: 'company_name_ar', value: 'بينيون إدارة المخزون', type: 'string' },
      { key: 'currency', value: 'EGP', type: 'string' },
      { key: 'timezone', value: 'Africa/Cairo', type: 'string' },
      { key: 'date_format', value: 'DD/MM/YYYY', type: 'string' },
      { key: 'low_stock_threshold', value: '10', type: 'number' },
      { key: 'auto_backup', value: 'true', type: 'boolean' },
    ];

    for (const setting of settings) {
      await prisma.setting.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: setting,
      });
    }

    logger.info('Database seeding completed successfully');
    logger.info(`Created users: ${generalManager.username}, ${warehouseManager.username}, ${purchasingManager.username}`);
    logger.info(`Created warehouse: ${warehouse.name}`);
    logger.info(`Created ${settings.length} settings`);

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
