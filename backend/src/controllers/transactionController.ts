import { Request, Response } from 'express';
import prisma from '@/config/database';
import { ApiResponse, PaginationQuery } from '@/types/common';
import logger from '@/utils/logger';

export class TransactionController {
  // Get all transactions with pagination and filtering
  static async getTransactions(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = 1,
        limit = 20,
        type = '',
        status = '',
        warehouseId = '',
        productId = '',
        userId = '',
        startDate = '',
        endDate = '',
        search = '',
      } = req.query as PaginationQuery & {
        type?: string;
        status?: string;
        warehouseId?: string;
        productId?: string;
        userId?: string;
        startDate?: string;
        endDate?: string;
        search?: string;
      };

      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      // Build where clause
      const where: any = {};

      if (type) {
        where.type = type;
      }

      if (status) {
        where.status = status;
      }

      if (warehouseId) {
        where.warehouseId = warehouseId;
      }

      if (productId) {
        where.productId = productId;
      }

      if (userId) {
        where.userId = userId;
      }

      if (startDate || endDate) {
        where.date = {};
        if (startDate) where.date.gte = new Date(startDate);
        if (endDate) where.date.lte = new Date(endDate);
      }

      if (search) {
        where.OR = [
          { productName: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
          { referenceNumber: { contains: search, mode: 'insensitive' } },
          { invoiceNumber: { contains: search, mode: 'insensitive' } },
          { notes: { contains: search, mode: 'insensitive' } },
        ];
      }

      const [transactions, total] = await Promise.all([
        prisma.transaction.findMany({
          where,
          skip,
          take,
          include: {
            product: {
              select: {
                id: true,
                name: true,
                nameEn: true,
                sku: true,
                category: true,
                brand: true,
                unit: true,
              },
            },
            warehouse: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
            user: {
              select: {
                id: true,
                username: true,
                fullName: true,
                role: true,
              },
            },
            supplier: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
          orderBy: { date: 'desc' },
        }),
        prisma.transaction.count({ where }),
      ]);

      const totalPages = Math.ceil(total / take);

      res.status(200).json({
        success: true,
        message: 'Transactions retrieved successfully',
        data: transactions,
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
      logger.error('Get transactions controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve transactions',
      } as ApiResponse);
    }
  }

  // Get transaction by ID
  static async getTransactionById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const transaction = await prisma.transaction.findUnique({
        where: { id },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              nameEn: true,
              sku: true,
              barcode: true,
              category: true,
              brand: true,
              unit: true,
            },
          },
          warehouse: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          user: {
            select: {
              id: true,
              username: true,
              fullName: true,
              role: true,
            },
          },
          supplier: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          movements: {
            select: {
              id: true,
              movementType: true,
              quantity: true,
              unit: true,
              previousBalance: true,
              newBalance: true,
              unitCost: true,
              totalCost: true,
              date: true,
              reason: true,
            },
          },
        },
      });

      if (!transaction) {
        res.status(404).json({
          success: false,
          message: 'Transaction not found',
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Transaction retrieved successfully',
        data: transaction,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Get transaction by ID controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve transaction',
      } as ApiResponse);
    }
  }

  // Update transaction
  static async updateTransaction(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Check if transaction exists
      const existingTransaction = await prisma.transaction.findUnique({
        where: { id },
      });

      if (!existingTransaction) {
        res.status(404).json({
          success: false,
          message: 'Transaction not found',
        } as ApiResponse);
        return;
      }

      // Don't allow updating completed transactions
      if (existingTransaction.status === 'COMPLETED') {
        res.status(400).json({
          success: false,
          message: 'Cannot update completed transaction',
        } as ApiResponse);
        return;
      }

      const transaction = await prisma.transaction.update({
        where: { id },
        data: updateData,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              nameEn: true,
              sku: true,
            },
          },
          warehouse: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          user: {
            select: {
              id: true,
              username: true,
              fullName: true,
            },
          },
        },
      });

      res.status(200).json({
        success: true,
        message: 'Transaction updated successfully',
        data: transaction,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Update transaction controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update transaction',
      } as ApiResponse);
    }
  }

  // Cancel transaction
  static async cancelTransaction(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      // Check if transaction exists
      const transaction = await prisma.transaction.findUnique({
        where: { id },
        include: {
          product: true,
          warehouse: true,
        },
      });

      if (!transaction) {
        res.status(404).json({
          success: false,
          message: 'Transaction not found',
        } as ApiResponse);
        return;
      }

      if (transaction.status === 'CANCELLED') {
        res.status(400).json({
          success: false,
          message: 'Transaction is already cancelled',
        } as ApiResponse);
        return;
      }

      if (transaction.status === 'COMPLETED') {
        res.status(400).json({
          success: false,
          message: 'Cannot cancel completed transaction',
        } as ApiResponse);
        return;
      }

      // Update transaction status
      await prisma.transaction.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          notes: `${transaction.notes || ''}\nCancelled: ${reason}`.trim(),
        },
      });

      res.status(200).json({
        success: true,
        message: 'Transaction cancelled successfully',
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Cancel transaction controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to cancel transaction',
      } as ApiResponse);
    }
  }

  // Get transaction statistics
  static async getTransactionStats(req: Request, res: Response): Promise<void> {
    try {
      const {
        warehouseId = '',
        startDate = '',
        endDate = '',
        groupBy = 'type',
      } = req.query as {
        warehouseId?: string;
        startDate?: string;
        endDate?: string;
        groupBy?: string;
      };

      const where: any = {};

      if (warehouseId) {
        where.warehouseId = warehouseId;
      }

      if (startDate || endDate) {
        where.date = {};
        if (startDate) where.date.gte = new Date(startDate);
        if (endDate) where.date.lte = new Date(endDate);
      }

      const [typeStats, statusStats, totalStats, recentTransactions] = await Promise.all([
        prisma.transaction.groupBy({
          by: ['type'],
          where,
          _count: {
            id: true,
          },
          _sum: {
            totalAmount: true,
            quantity: true,
          },
        }),
        prisma.transaction.groupBy({
          by: ['status'],
          where,
          _count: {
            id: true,
          },
        }),
        prisma.transaction.aggregate({
          where,
          _count: {
            id: true,
          },
          _sum: {
            totalAmount: true,
            quantity: true,
          },
          _avg: {
            totalAmount: true,
          },
        }),
        prisma.transaction.findMany({
          where,
          take: 5,
          orderBy: { date: 'desc' },
          select: {
            id: true,
            type: true,
            productName: true,
            quantity: true,
            totalAmount: true,
            date: true,
            status: true,
          },
        }),
      ]);

      const stats = {
        summary: {
          totalTransactions: totalStats._count.id,
          totalValue: totalStats._sum.totalAmount || 0,
          totalQuantity: totalStats._sum.quantity || 0,
          averageValue: totalStats._avg.totalAmount || 0,
        },
        byType: typeStats,
        byStatus: statusStats,
        recent: recentTransactions,
      };

      res.status(200).json({
        success: true,
        message: 'Transaction statistics retrieved successfully',
        data: stats,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Get transaction stats controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve transaction statistics',
      } as ApiResponse);
    }
  }

  // Bulk create transactions
  static async bulkCreateTransactions(req: Request, res: Response): Promise<void> {
    try {
      const { transactions } = req.body;

      if (!Array.isArray(transactions) || transactions.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Transactions array is required',
        } as ApiResponse);
        return;
      }

      const results = [];
      const errors = [];

      for (let i = 0; i < transactions.length; i++) {
        try {
          const transactionData = transactions[i];

          // Verify product exists
          const product = await prisma.product.findUnique({
            where: { id: transactionData.productId },
          });

          if (!product) {
            errors.push({
              index: i,
              error: 'Product not found',
              data: transactionData,
            });
            continue;
          }

          // Verify warehouse exists
          const warehouse = await prisma.warehouse.findUnique({
            where: { id: transactionData.warehouseId },
          });

          if (!warehouse) {
            errors.push({
              index: i,
              error: 'Warehouse not found',
              data: transactionData,
            });
            continue;
          }

          // Create transaction
          const transaction = await prisma.transaction.create({
            data: {
              ...transactionData,
              productName: product.name,
              sku: product.sku,
              warehouseName: warehouse.name,
              userId: req.user!.userId,
              userName: req.user!.username,
              userRole: req.user!.role,
              date: transactionData.date ? new Date(transactionData.date) : new Date(),
            },
          });

          results.push(transaction);
        } catch (error: any) {
          errors.push({
            index: i,
            error: error.message,
            data: transactions[i],
          });
        }
      }

      res.status(201).json({
        success: true,
        message: `Bulk transaction creation completed. ${results.length} successful, ${errors.length} failed`,
        data: {
          successful: results,
          errors,
          summary: {
            total: transactions.length,
            successful: results.length,
            failed: errors.length,
          },
        },
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Bulk create transactions controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create bulk transactions',
      } as ApiResponse);
    }
  }
}
