import { Request, Response } from 'express';
import prisma from '@/config/database';
import { ApiResponse } from '@/types/common';
import logger from '@/utils/logger';

export class AnalyticsController {
  // Get dashboard metrics and KPIs
  static async getDashboardMetrics(req: Request, res: Response): Promise<void> {
    try {
      const { period = '30' } = req.query as { period?: string };
      const days = parseInt(period);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Get various metrics in parallel
      const [
        totalProducts,
        totalWarehouses,
        totalSuppliers,
        totalUsers,
        inventoryStats,
        transactionStats,
        lowStockCount,
        recentTransactions,
      ] = await Promise.all([
        prisma.product.count(),
        prisma.warehouse.count(),
        prisma.supplier.count(),
        prisma.user.count({ where: { isActive: true } }),
        prisma.inventory.aggregate({
          _sum: { quantity: true },
          _count: { id: true },
        }),
        prisma.transaction.aggregate({
          where: {
            createdAt: { gte: startDate },
          },
          _count: { id: true },
          _sum: { totalAmount: true, quantity: true },
        }),
        prisma.inventory.count({
          where: {
            quantity: {
              lte: prisma.inventory.fields.reorderPoint,
            },
          },
        }),
        prisma.transaction.findMany({
          take: 10,
          select: {
            id: true,
            type: true,
            productName: true,
            quantity: true,
            totalAmount: true,
            date: true,
            status: true,
            warehouse: {
              select: {
                name: true,
                code: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
      ]);

      const dashboardData = {
        overview: {
          totalProducts,
          totalWarehouses,
          totalSuppliers,
          totalUsers,
          totalInventoryValue: inventoryStats._sum.quantity || 0,
          totalInventoryItems: inventoryStats._count.id,
        },
        period: `${days} days`,
        transactions: {
          count: transactionStats._count.id,
          totalAmount: transactionStats._sum.totalAmount || 0,
          totalQuantity: transactionStats._sum.quantity || 0,
        },
        alerts: {
          lowStockItems: lowStockCount,
        },
        recentActivity: recentTransactions,
        generatedAt: new Date(),
      };

      res.status(200).json({
        success: true,
        message: 'Dashboard metrics retrieved successfully',
        data: dashboardData,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Get dashboard metrics controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve dashboard metrics',
      } as ApiResponse);
    }
  }

  // Get inventory analytics
  static async getInventoryAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const { warehouseId = '', category = '' } = req.query as {
        warehouseId?: string;
        category?: string;
      };

      const where: any = {};
      if (warehouseId) where.warehouseId = warehouseId;
      if (category) where.product = { category };

      // Get inventory analytics
      const [
        inventoryByCategory,
        inventoryByWarehouse,
        lowStockItems,
        topProducts,
      ] = await Promise.all([
        prisma.inventory.groupBy({
          by: ['productId'],
          where: {
            ...where,
            product: category ? { category } : undefined,
          },
          _sum: { quantity: true },
          _count: { id: true },
          orderBy: { _sum: { quantity: 'desc' } },
          take: 10,
        }),
        prisma.inventory.groupBy({
          by: ['warehouseId'],
          where,
          _sum: { quantity: true },
          _count: { id: true },
          orderBy: { _sum: { quantity: 'desc' } },
        }),
        prisma.inventory.findMany({
          where: {
            ...where,
            quantity: {
              lte: prisma.inventory.fields.reorderPoint,
            },
          },
          include: {
            product: {
              select: {
                name: true,
                sku: true,
                category: true,
              },
            },
            warehouse: {
              select: {
                name: true,
                code: true,
              },
            },
          },
          orderBy: { quantity: 'asc' },
          take: 20,
        }),
        prisma.inventory.findMany({
          where,
          include: {
            product: {
              select: {
                name: true,
                sku: true,
                category: true,
                brand: true,
              },
            },
            warehouse: {
              select: {
                name: true,
                code: true,
              },
            },
          },
          orderBy: { quantity: 'desc' },
          take: 10,
        }),
      ]);

      // Get category names for inventory by category
      const categoryData = await Promise.all(
        inventoryByCategory.map(async (item: any) => {
          const product = await prisma.product.findUnique({
            where: { id: item.productId },
            select: { category: true, name: true },
          });
          return {
            category: product?.category || 'Unknown',
            productName: product?.name || 'Unknown',
            totalQuantity: item._sum.quantity || 0,
            itemCount: item._count.id,
          };
        })
      );

      // Get warehouse names for inventory by warehouse
      const warehouseData = await Promise.all(
        inventoryByWarehouse.map(async (item: any) => {
          const warehouse = await prisma.warehouse.findUnique({
            where: { id: item.warehouseId },
            select: { name: true, code: true },
          });
          return {
            warehouseName: warehouse?.name || 'Unknown',
            warehouseCode: warehouse?.code || 'Unknown',
            totalQuantity: item._sum.quantity || 0,
            itemCount: item._count.id,
          };
        })
      );

      const analyticsData = {
        inventoryByCategory: categoryData,
        inventoryByWarehouse: warehouseData,
        lowStockItems,
        topProducts,
        generatedAt: new Date(),
      };

      res.status(200).json({
        success: true,
        message: 'Inventory analytics retrieved successfully',
        data: analyticsData,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Get inventory analytics controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve inventory analytics',
      } as ApiResponse);
    }
  }

  // Get warehouse performance analytics
  static async getWarehouseAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const { period = '30' } = req.query as { period?: string };
      const days = parseInt(period);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Get warehouse performance data
      const warehouses = await prisma.warehouse.findMany({
        include: {
          _count: {
            select: {
              products: true,
              inventory: true,
              transactions: true,
            },
          },
        },
      });

      const warehouseAnalytics = await Promise.all(
        warehouses.map(async (warehouse: any) => {
          const [transactionStats, inventoryStats] = await Promise.all([
            prisma.transaction.aggregate({
              where: {
                warehouseId: warehouse.id,
                createdAt: { gte: startDate },
              },
              _count: { id: true },
              _sum: { totalAmount: true, quantity: true },
            }),
            prisma.inventory.aggregate({
              where: { warehouseId: warehouse.id },
              _sum: { quantity: true },
              _count: { id: true },
            }),
          ]);

          return {
            warehouse: {
              id: warehouse.id,
              name: warehouse.name,
              code: warehouse.code,
              type: warehouse.type,
              status: warehouse.status,
            },
            capacity: {
              maxVolume: warehouse.maxVolume,
              maxWeight: warehouse.maxWeight,
              currentStock: warehouse.currentStock,
              utilization: warehouse.maxVolume > 0 ? 
                (warehouse.currentStock / warehouse.maxVolume) * 100 : 0,
            },
            performance: {
              totalProducts: warehouse._count.products,
              totalInventoryItems: warehouse._count.inventory,
              totalTransactions: warehouse._count.transactions,
              periodTransactions: transactionStats._count.id,
              periodAmount: transactionStats._sum.totalAmount || 0,
              periodQuantity: transactionStats._sum.quantity || 0,
              totalInventoryValue: inventoryStats._sum.quantity || 0,
            },
          };
        })
      );

      const analyticsData = {
        warehouses: warehouseAnalytics,
        period: `${days} days`,
        generatedAt: new Date(),
      };

      res.status(200).json({
        success: true,
        message: 'Warehouse analytics retrieved successfully',
        data: analyticsData,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Get warehouse analytics controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve warehouse analytics',
      } as ApiResponse);
    }
  }

  // Get financial analytics
  static async getFinancialAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const { period = '30', startDate: startDateParam, endDate: endDateParam } = req.query as {
        period?: string;
        startDate?: string;
        endDate?: string;
      };

      let startDate: Date;
      let endDate: Date;

      if (startDateParam && endDateParam) {
        startDate = new Date(startDateParam);
        endDate = new Date(endDateParam);
      } else {
        const days = parseInt(period);
        startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        endDate = new Date();
      }

      // Get financial analytics
      const [
        purchaseStats,
        saleStats,
        transferStats,
        dailyTransactions,
        topProducts,
      ] = await Promise.all([
        prisma.transaction.aggregate({
          where: {
            type: 'PURCHASE',
            date: { gte: startDate, lte: endDate },
          },
          _count: { id: true },
          _sum: { totalAmount: true, quantity: true },
        }),
        prisma.transaction.aggregate({
          where: {
            type: 'SALE',
            date: { gte: startDate, lte: endDate },
          },
          _count: { id: true },
          _sum: { totalAmount: true, quantity: true },
        }),
        prisma.transaction.aggregate({
          where: {
            type: 'TRANSFER',
            date: { gte: startDate, lte: endDate },
          },
          _count: { id: true },
          _sum: { totalAmount: true, quantity: true },
        }),
        prisma.transaction.groupBy({
          by: ['date'],
          where: {
            date: { gte: startDate, lte: endDate },
          },
          _count: { id: true },
          _sum: { totalAmount: true },
          orderBy: { date: 'asc' },
        }),
        prisma.transaction.groupBy({
          by: ['productId', 'productName'],
          where: {
            date: { gte: startDate, lte: endDate },
          },
          _count: { id: true },
          _sum: { totalAmount: true, quantity: true },
          orderBy: { _sum: { totalAmount: 'desc' } },
          take: 10,
        }),
      ]);

      const financialData = {
        summary: {
          purchases: {
            count: purchaseStats._count.id,
            totalAmount: purchaseStats._sum.totalAmount || 0,
            totalQuantity: purchaseStats._sum.quantity || 0,
          },
          sales: {
            count: saleStats._count.id,
            totalAmount: saleStats._sum.totalAmount || 0,
            totalQuantity: saleStats._sum.quantity || 0,
          },
          transfers: {
            count: transferStats._count.id,
            totalAmount: transferStats._sum.totalAmount || 0,
            totalQuantity: transferStats._sum.quantity || 0,
          },
        },
        dailyTransactions,
        topProducts,
        period: {
          startDate,
          endDate,
        },
        generatedAt: new Date(),
      };

      res.status(200).json({
        success: true,
        message: 'Financial analytics retrieved successfully',
        data: financialData,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Get financial analytics controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve financial analytics',
      } as ApiResponse);
    }
  }
}
