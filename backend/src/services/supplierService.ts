import prisma from '@/config/database';
import logger from '@/utils/logger';
import notificationService from './notificationService';

export interface CreateSupplierData {
  name: string;
  nameEn?: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  governorate: string;
  country?: string;
  taxNumber?: string;
  website?: string;
  contactPerson: string;
  notes?: string;
}

export interface UpdateSupplierData {
  name?: string;
  nameEn?: string;
  code?: string;  // Add code field
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  governorate?: string;
  country?: string;
  taxNumber?: string;
  website?: string;
  contactPerson?: string;
  notes?: string;
  isActive?: boolean;
}

export interface SupplierPerformance {
  supplierId: string;
  supplierName: string;
  totalOrders: number;
  totalValue: number;
  averageOrderValue: number;
  onTimeDeliveryRate: number;
  qualityScore: number;
  responseTime: number;
  lastOrderDate: Date | null;
  paymentTerms: string;
  reliabilityScore: number;
  costEffectiveness: number;
  overallRating: number;
}

class SupplierService {
  // Create supplier
  public async createSupplier(data: CreateSupplierData): Promise<any> {
    try {
      // Check if supplier code already exists
      const existingSupplier = await prisma.supplier.findUnique({
        where: { code: data.code }
      });

      if (existingSupplier) {
        throw new Error('Supplier code already exists');
      }

      const supplier = await prisma.supplier.create({
        data: {
          name: data.name,
          nameEn: data.nameEn,
          code: data.code,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          governorate: data.governorate,
          country: data.country || 'Egypt',
          taxNumber: data.taxNumber,
          website: data.website,
          contactPerson: data.contactPerson,
          notes: data.notes,
          isActive: true
        }
      });

      logger.info(`Supplier created: ${supplier.name} (${supplier.code})`);
      return supplier;
    } catch (error) {
      logger.error('Error creating supplier:', error);
      throw error;
    }
  }

  // Get suppliers with filtering and pagination
  public async getSuppliers(filters: {
    search?: string;
    city?: string;
    governorate?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  } = {}) {
    try {
      const {
        search,
        city,
        governorate,
        isActive,
        page = 1,
        limit = 20
      } = filters;

      const skip = (page - 1) * limit;

      const whereClause: any = {};
      if (search) {
        whereClause.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { nameEn: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ];
      }
      if (city) whereClause.city = city;
      if (governorate) whereClause.governorate = governorate;
      if (isActive !== undefined) whereClause.isActive = isActive;

      const [suppliers, total] = await Promise.all([
        prisma.supplier.findMany({
          where: whereClause,
          orderBy: { name: 'asc' },
          skip,
          take: limit
        }),
        prisma.supplier.count({ where: whereClause })
      ]);

      return {
        suppliers,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      };
    } catch (error) {
      logger.error('Error getting suppliers:', error);
      throw error;
    }
  }

  // Get supplier by ID
  public async getSupplierById(id: string): Promise<any> {
    try {
      const supplier = await prisma.supplier.findUnique({
        where: { id },
        include: {
          transactions: {
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
              product: { select: { name: true, sku: true } },
              warehouse: { select: { name: true } }
            }
          }
        }
      });

      if (!supplier) {
        throw new Error('Supplier not found');
      }

      return supplier;
    } catch (error) {
      logger.error('Error getting supplier:', error);
      throw error;
    }
  }

  // Update supplier
  public async updateSupplier(id: string, data: UpdateSupplierData): Promise<any> {
    try {
      const supplier = await prisma.supplier.findUnique({
        where: { id }
      });

      if (!supplier) {
        throw new Error('Supplier not found');
      }

      // Check if new code conflicts with existing supplier
      if (data.code && data.code !== supplier.code) {
        const existingSupplier = await prisma.supplier.findUnique({
          where: { code: data.code }
        });

        if (existingSupplier) {
          throw new Error('Supplier code already exists');
        }
      }

      const updatedSupplier = await prisma.supplier.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date()
        }
      });

      logger.info(`Supplier updated: ${updatedSupplier.name} (${updatedSupplier.code})`);
      return updatedSupplier;
    } catch (error) {
      logger.error('Error updating supplier:', error);
      throw error;
    }
  }

  // Delete supplier (soft delete)
  public async deleteSupplier(id: string): Promise<void> {
    try {
      const supplier = await prisma.supplier.findUnique({
        where: { id }
      });

      if (!supplier) {
        throw new Error('Supplier not found');
      }

      // Check if supplier has transactions
      const transactionCount = await prisma.transaction.count({
        where: { supplierId: id }
      });

      if (transactionCount > 0) {
        // Soft delete - deactivate instead of hard delete
        await prisma.supplier.update({
          where: { id },
          data: { isActive: false }
        });
        logger.info(`Supplier deactivated: ${supplier.name} (${supplier.code})`);
      } else {
        // Hard delete if no transactions
        await prisma.supplier.delete({
          where: { id }
        });
        logger.info(`Supplier deleted: ${supplier.name} (${supplier.code})`);
      }
    } catch (error) {
      logger.error('Error deleting supplier:', error);
      throw error;
    }
  }

  // Get supplier performance
  public async getSupplierPerformance(supplierId?: string): Promise<SupplierPerformance[]> {
    try {
      const whereClause = supplierId ? { supplierId } : {};

      const suppliers = await prisma.supplier.findMany({
        where: supplierId ? { id: supplierId } : { isActive: true },
        include: {
          transactions: {
            where: {
              type: 'PURCHASE',
              date: {
                gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // Last year
              }
            }
          }
        }
      });

      const performanceData = suppliers.map(supplier => {
        const transactions = supplier.transactions;
        const totalOrders = transactions.length;
        const totalValue = transactions.reduce((sum, t) => sum + t.totalAmount, 0);
        const averageOrderValue = totalOrders > 0 ? totalValue / totalOrders : 0;
        
        // Calculate on-time delivery rate (simplified)
        const onTimeDeliveries = transactions.filter(t => 
          t.status === 'COMPLETED' && 
          t.date <= (t as any).expectedDate
        ).length;
        const onTimeDeliveryRate = totalOrders > 0 ? (onTimeDeliveries / totalOrders) * 100 : 0;

        // Calculate quality score (simplified - based on return rate)
        const returnedOrders = transactions.filter(t => t.status === 'RETURNED').length;
        const qualityScore = totalOrders > 0 ? Math.max(0, 100 - (returnedOrders / totalOrders) * 100) : 100;

        // Calculate response time (simplified)
        const responseTime = 24; // Placeholder - would be calculated from actual data

        // Calculate reliability score
        const reliabilityScore = (onTimeDeliveryRate + qualityScore) / 2;

        // Calculate cost effectiveness (simplified)
        const costEffectiveness = 85; // Placeholder - would be calculated from market data

        // Calculate overall rating
        const overallRating = (reliabilityScore + costEffectiveness) / 2;

        return {
          supplierId: supplier.id,
          supplierName: supplier.name,
          totalOrders,
          totalValue,
          averageOrderValue: Math.round(averageOrderValue * 100) / 100,
          onTimeDeliveryRate: Math.round(onTimeDeliveryRate * 100) / 100,
          qualityScore: Math.round(qualityScore * 100) / 100,
          responseTime,
          lastOrderDate: totalOrders > 0 ? transactions[0].date : null,
          paymentTerms: '30 days', // Placeholder
          reliabilityScore: Math.round(reliabilityScore * 100) / 100,
          costEffectiveness,
          overallRating: Math.round(overallRating * 100) / 100
        };
      });

      return performanceData.sort((a, b) => b.overallRating - a.overallRating);
    } catch (error) {
      logger.error('Error getting supplier performance:', error);
      throw error;
    }
  }

  // Get supplier products
  public async getSupplierProducts(supplierId: string, page: number = 1, limit: number = 20): Promise<any> {
    try {
      const skip = (page - 1) * limit;

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where: {
            transactions: {
              some: {
                supplierId: supplierId
              }
            }
          },
          include: {
            inventory: {
              include: {
                warehouse: { select: { name: true } }
              }
            }
          },
          orderBy: { name: 'asc' },
          skip,
          take: limit
        }),
        prisma.product.count({
          where: {
            transactions: {
              some: {
                supplierId: supplierId
              }
            }
          }
        })
      ]);

      return {
        products,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      };
    } catch (error) {
      logger.error('Error getting supplier products:', error);
      throw error;
    }
  }

  // Send message to supplier
  public async sendMessageToSupplier(supplierId: string, subject: string, message: string, sentBy: string): Promise<void> {
    try {
      const supplier = await prisma.supplier.findUnique({
        where: { id: supplierId }
      });

      if (!supplier) {
        throw new Error('Supplier not found');
      }

      // In a real implementation, this would send an email or SMS
      logger.info(`Message sent to supplier ${supplier.name}: ${subject}`);

      // Create notification for the sender
      await notificationService.createNotification({
        userId: sentBy,
        title: 'رسالة مرسلة للمورد',
        message: `تم إرسال رسالة إلى ${supplier.name}: ${subject}`,
        type: 'SUCCESS',
        category: 'SYSTEM',
        data: {
          supplierId,
          supplierName: supplier.name,
          subject,
          message
        }
      });
    } catch (error) {
      logger.error('Error sending message to supplier:', error);
      throw error;
    }
  }

  // Get supplier statistics
  public async getSupplierStatistics(): Promise<any> {
    try {
      const [
        totalSuppliers,
        activeSuppliers,
        inactiveSuppliers,
        suppliersWithTransactions,
        topSuppliers,
        suppliersByCity,
        suppliersByGovernorate
      ] = await Promise.all([
        prisma.supplier.count(),
        prisma.supplier.count({ where: { isActive: true } }),
        prisma.supplier.count({ where: { isActive: false } }),
        prisma.supplier.count({
          where: {
            transactions: {
              some: {}
            }
          }
        }),
        prisma.supplier.findMany({
          include: {
            _count: {
              select: { transactions: true }
            }
          },
          orderBy: {
            transactions: {
              _count: 'desc'
            }
          },
          take: 5
        }),
        prisma.supplier.groupBy({
          by: ['city'],
          _count: { city: true },
          orderBy: { _count: { city: 'desc' } }
        }),
        prisma.supplier.groupBy({
          by: ['governorate'],
          _count: { governorate: true },
          orderBy: { _count: { governorate: 'desc' } }
        })
      ]);

      return {
        totalSuppliers,
        activeSuppliers,
        inactiveSuppliers,
        suppliersWithTransactions,
        topSuppliers: topSuppliers.map(s => ({
          id: s.id,
          name: s.name,
          code: s.code,
          transactionCount: s._count.transactions
        })),
        suppliersByCity: suppliersByCity.map(s => ({
          city: s.city,
          count: s._count.city
        })),
        suppliersByGovernorate: suppliersByGovernorate.map(s => ({
          governorate: s.governorate,
          count: s._count.governorate
        }))
      };
    } catch (error) {
      logger.error('Error getting supplier statistics:', error);
      throw error;
    }
  }

  // Search suppliers
  public async searchSuppliers(query: string, limit: number = 10): Promise<any[]> {
    try {
      const suppliers = await prisma.supplier.findMany({
        where: {
          AND: [
            { isActive: true },
            {
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { nameEn: { contains: query, mode: 'insensitive' } },
                { code: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } }
              ]
            }
          ]
        },
        select: {
          id: true,
          name: true,
          nameEn: true,
          code: true,
          email: true,
          phone: true,
          city: true,
          governorate: true
        },
        take: limit,
        orderBy: { name: 'asc' }
      });

      return suppliers;
    } catch (error) {
      logger.error('Error searching suppliers:', error);
      throw error;
    }
  }

  // Get supplier contact information
  public async getSupplierContactInfo(supplierId: string): Promise<any> {
    try {
      const supplier = await prisma.supplier.findUnique({
        where: { id: supplierId },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          city: true,
          governorate: true,
          country: true,
          website: true,
          contactPerson: true
        }
      });

      if (!supplier) {
        throw new Error('Supplier not found');
      }

      return supplier;
    } catch (error) {
      logger.error('Error getting supplier contact info:', error);
      throw error;
    }
  }
}

export default new SupplierService();
