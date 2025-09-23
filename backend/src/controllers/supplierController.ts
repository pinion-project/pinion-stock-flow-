import { Request, Response } from 'express';
import prisma from '@/config/database';
import { ApiResponse, PaginationQuery } from '@/types/common';
import logger from '@/utils/logger';

export class SupplierController {
  // Get all suppliers with pagination and filtering
  static async getSuppliers(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = 1,
        limit = 20,
        search = '',
        city = '',
        governorate = '',
        isActive = '',
      } = req.query as PaginationQuery & {
        search?: string;
        city?: string;
        governorate?: string;
        isActive?: string;
      };

      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      // Build where clause
      const where: any = {};
      
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { nameEn: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (city) {
        where.city = { contains: city, mode: 'insensitive' };
      }

      if (governorate) {
        where.governorate = { contains: governorate, mode: 'insensitive' };
      }

      if (isActive !== '') {
        where.isActive = isActive === 'true';
      }

      const [suppliers, total] = await Promise.all([
        prisma.supplier.findMany({
          where,
          skip,
          take,
          include: {
            _count: {
              select: {
                transactions: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.supplier.count({ where }),
      ]);

      const totalPages = Math.ceil(total / take);

      res.status(200).json({
        success: true,
        message: 'Suppliers retrieved successfully',
        data: suppliers,
        pagination: {
          page: Number(page),
          limit: take,
          total,
          totalPages,
          hasNext: Number(page) < totalPages,
          hasPrev: Number(page) > 1,
        },
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Get suppliers controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve suppliers',
      } as ApiResponse);
    }
  }

  // Get supplier by ID
  static async getSupplierById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const supplier = await prisma.supplier.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              transactions: true,
            },
          },
        },
      });

      if (!supplier) {
        res.status(404).json({
          success: false,
          message: 'Supplier not found',
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Supplier retrieved successfully',
        data: supplier,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Get supplier by ID controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve supplier',
      } as ApiResponse);
    }
  }

  // Create new supplier
  static async createSupplier(req: Request, res: Response): Promise<void> {
    try {
      const {
        name,
        nameEn,
        code,
        email,
        phone,
        address,
        city,
        governorate,
        country = 'Egypt',
        taxNumber,
        website,
        contactPerson,
        notes,
      } = req.body;

      // Check if supplier code already exists
      const existingSupplier = await prisma.supplier.findUnique({
        where: { code },
      });

      if (existingSupplier) {
        res.status(400).json({
          success: false,
          message: 'Supplier with this code already exists',
        } as ApiResponse);
        return;
      }

      const supplier = await prisma.supplier.create({
        data: {
          name,
          nameEn,
          code,
          email,
          phone,
          address,
          city,
          governorate,
          country,
          taxNumber,
          website,
          contactPerson,
          notes,
          isActive: true,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Supplier created successfully',
        data: supplier,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Create supplier controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create supplier',
      } as ApiResponse);
    }
  }

  // Update supplier
  static async updateSupplier(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Check if supplier exists
      const existingSupplier = await prisma.supplier.findUnique({
        where: { id },
      });

      if (!existingSupplier) {
        res.status(404).json({
          success: false,
          message: 'Supplier not found',
        } as ApiResponse);
        return;
      }

      // Check if code is being changed and if it already exists
      if (updateData.code && updateData.code !== existingSupplier.code) {
        const codeExists = await prisma.supplier.findUnique({
          where: { code: updateData.code },
        });

        if (codeExists) {
          res.status(400).json({
            success: false,
            message: 'Supplier code already exists',
          } as ApiResponse);
          return;
        }
      }

      const supplier = await prisma.supplier.update({
        where: { id },
        data: updateData,
      });

      res.status(200).json({
        success: true,
        message: 'Supplier updated successfully',
        data: supplier,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Update supplier controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update supplier',
      } as ApiResponse);
    }
  }

  // Delete supplier
  static async deleteSupplier(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Check if supplier exists
      const supplier = await prisma.supplier.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              transactions: true,
            },
          },
        },
      });

      if (!supplier) {
        res.status(404).json({
          success: false,
          message: 'Supplier not found',
        } as ApiResponse);
        return;
      }

      // Check if supplier has associated transactions
      if (supplier._count.transactions > 0) {
        res.status(400).json({
          success: false,
          message: 'Cannot delete supplier with associated transactions',
        } as ApiResponse);
        return;
      }

      await prisma.supplier.delete({
        where: { id },
      });

      res.status(200).json({
        success: true,
        message: 'Supplier deleted successfully',
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Delete supplier controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete supplier',
      } as ApiResponse);
    }
  }

  // Get supplier products
  static async getSupplierProducts(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { page = 1, limit = 20 } = req.query as PaginationQuery;

      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      // Check if supplier exists
      const supplier = await prisma.supplier.findUnique({
        where: { id },
        select: { id: true, name: true, code: true },
      });

      if (!supplier) {
        res.status(404).json({
          success: false,
          message: 'Supplier not found',
        } as ApiResponse);
        return;
      }

      // Get products associated with this supplier through transactions
      const [transactions, total] = await Promise.all([
        prisma.transaction.findMany({
          where: {
            supplierId: id,
            type: 'PURCHASE',
          },
          skip,
          take,
          select: {
            productId: true,
            productName: true,
            sku: true,
            quantity: true,
            unitPrice: true,
            totalAmount: true,
            date: true,
          },
          orderBy: { date: 'desc' },
        }),
        prisma.transaction.count({
          where: {
            supplierId: id,
            type: 'PURCHASE',
          },
        }),
      ]);

      // Group by product and get latest price
      const productMap = new Map();
      transactions.forEach((transaction: any) => {
        if (!productMap.has(transaction.productId)) {
          productMap.set(transaction.productId, {
            productId: transaction.productId,
            productName: transaction.productName,
            sku: transaction.sku,
            latestPrice: transaction.unitPrice,
            totalQuantity: 0,
            totalAmount: 0,
            lastPurchaseDate: transaction.date,
          });
        }
        
        const product = productMap.get(transaction.productId);
        product.totalQuantity += transaction.quantity;
        product.totalAmount += transaction.totalAmount;
        
        if (transaction.date > product.lastPurchaseDate) {
          product.latestPrice = transaction.unitPrice;
          product.lastPurchaseDate = transaction.date;
        }
      });

      const supplierProducts = Array.from(productMap.values());

      const totalPages = Math.ceil(total / take);

      res.status(200).json({
        success: true,
        message: 'Supplier products retrieved successfully',
        data: {
          supplier,
          products: supplierProducts,
          pagination: {
            page: Number(page),
            limit: take,
            total,
            totalPages,
            hasNext: Number(page) < totalPages,
            hasPrev: Number(page) > 1,
          },
        },
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Get supplier products controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve supplier products',
      } as ApiResponse);
    }
  }

  // Get supplier performance
  static async getSupplierPerformance(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { period = '30' } = req.query as { period?: string };

      const days = parseInt(period);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Check if supplier exists
      const supplier = await prisma.supplier.findUnique({
        where: { id },
        select: { id: true, name: true, code: true },
      });

      if (!supplier) {
        res.status(404).json({
          success: false,
          message: 'Supplier not found',
        } as ApiResponse);
        return;
      }

      // Get supplier performance metrics
      const [transactionStats, recentTransactions] = await Promise.all([
        prisma.transaction.aggregate({
          where: {
            supplierId: id,
            type: 'PURCHASE',
            createdAt: {
              gte: startDate,
            },
          },
          _count: {
            id: true,
          },
          _sum: {
            totalAmount: true,
            quantity: true,
          },
          _avg: {
            unitPrice: true,
          },
        }),
        prisma.transaction.findMany({
          where: {
            supplierId: id,
            type: 'PURCHASE',
          },
          take: 5,
          select: {
            id: true,
            productName: true,
            quantity: true,
            unitPrice: true,
            totalAmount: true,
            date: true,
            status: true,
          },
          orderBy: { date: 'desc' },
        }),
      ]);

      const performanceData = {
        supplier,
        period: `${days} days`,
        metrics: {
          totalTransactions: transactionStats._count.id,
          totalAmount: transactionStats._sum.totalAmount || 0,
          totalQuantity: transactionStats._sum.quantity || 0,
          averagePrice: transactionStats._avg.unitPrice || 0,
        },
        recentTransactions,
        generatedAt: new Date(),
      };

      res.status(200).json({
        success: true,
        message: 'Supplier performance retrieved successfully',
        data: performanceData,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Get supplier performance controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve supplier performance',
      } as ApiResponse);
    }
  }
}
