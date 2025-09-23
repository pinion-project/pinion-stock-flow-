import { Request, Response } from 'express';
import prisma from '@/config/database';
import { ApiResponse, PaginationQuery } from '@/types/common';
import logger from '@/utils/logger';

export class InventoryController {
  // Get inventory levels across warehouses
  static async getInventoryLevels(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = 1,
        limit = 20,
        warehouseId = '',
        productId = '',
        lowStock = '',
        category = '',
      } = req.query as PaginationQuery & {
        warehouseId?: string;
        productId?: string;
        lowStock?: string;
        category?: string;
      };

      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      // Build where clause
      const where: any = {};

      if (warehouseId) {
        where.warehouseId = warehouseId;
      }

      if (productId) {
        where.productId = productId;
      }

      if (category) {
        where.product = {
          category: category,
        };
      }

      // Filter low stock items
      if (lowStock === 'true') {
        where.quantity = {
          lte: prisma.inventory.fields.reorderPoint,
        };
      }

      const [inventory, total] = await Promise.all([
        prisma.inventory.findMany({
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
                barcode: true,
                category: true,
                brand: true,
                unit: true,
                status: true,
              },
            },
            warehouse: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
          orderBy: { updatedAt: 'desc' },
        }),
        prisma.inventory.count({ where }),
      ]);

      const totalPages = Math.ceil(total / take);

      res.status(200).json({
        success: true,
        message: 'Inventory levels retrieved successfully',
        data: inventory,
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
      logger.error('Get inventory levels controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve inventory levels',
      } as ApiResponse);
    }
  }

  // Record inventory transaction
  static async recordTransaction(req: Request, res: Response): Promise<void> {
    try {
      const {
        type,
        productId,
        warehouseId,
        quantity,
        unitPrice,
        totalAmount,
        taxAmount = 0,
        discountAmount = 0,
        referenceNumber,
        invoiceNumber,
        notes,
        fromWarehouseId,
        toWarehouseId,
        supplierId,
        customerId,
      } = req.body;

      const userId = req.user?.userId;
      const userName = req.user?.username;

      if (!userId || !userName) {
        res.status(401).json({
          success: false,
          message: 'User authentication required',
        } as ApiResponse);
        return;
      }

      // Verify product exists
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { warehouse: true },
      });

      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Product not found',
        } as ApiResponse);
        return;
      }

      // Verify warehouse exists
      const warehouse = await prisma.warehouse.findUnique({
        where: { id: warehouseId },
      });

      if (!warehouse) {
        res.status(404).json({
          success: false,
          message: 'Warehouse not found',
        } as ApiResponse);
        return;
      }

      // Check inventory availability for outgoing transactions
      if (type === 'SALE' || type === 'TRANSFER') {
        const currentInventory = await prisma.inventory.findUnique({
          where: {
            productId_warehouseId: {
              productId,
              warehouseId: fromWarehouseId || warehouseId,
            },
          },
        });

        if (!currentInventory || currentInventory.quantity < Math.abs(quantity)) {
          res.status(400).json({
            success: false,
            message: 'Insufficient inventory',
          } as ApiResponse);
          return;
        }
      }

      // Create transaction
      const transaction = await prisma.transaction.create({
        data: {
          type,
          date: new Date(),
          productId,
          productName: product.name,
          sku: product.sku,
          quantity,
          unit: product.unit,
          unitPrice,
          totalAmount,
          taxAmount,
          discountAmount,
          warehouseId,
          warehouseName: warehouse.name,
          fromWarehouseId,
          toWarehouseId,
          supplierId,
          customerId,
          userId,
          userName,
          userRole: req.user?.role || '',
          referenceNumber,
          invoiceNumber,
          notes,
          status: 'COMPLETED',
        },
      });

      // Update inventory levels
      await this.updateInventoryLevels(transaction);

      // Get updated transaction with relations
      const updatedTransaction = await prisma.transaction.findUnique({
        where: { id: transaction.id },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
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
            },
          },
        },
      });

      res.status(201).json({
        success: true,
        message: 'Transaction recorded successfully',
        data: updatedTransaction,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Record transaction controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to record transaction',
      } as ApiResponse);
    }
  }

  // Get inventory movements
  static async getInventoryMovements(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = 1,
        limit = 20,
        productId = '',
        warehouseId = '',
        type = '',
        startDate = '',
        endDate = '',
      } = req.query as PaginationQuery & {
        productId?: string;
        warehouseId?: string;
        type?: string;
        startDate?: string;
        endDate?: string;
      };

      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      // Build where clause
      const where: any = {};

      if (productId) {
        where.productId = productId;
      }

      if (warehouseId) {
        where.warehouseId = warehouseId;
      }

      if (type) {
        where.type = type;
      }

      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) {
          where.createdAt.gte = new Date(startDate);
        }
        if (endDate) {
          where.createdAt.lte = new Date(endDate);
        }
      }

      const [movements, total] = await Promise.all([
        prisma.inventoryMovement.findMany({
          where,
          skip,
          take,
          include: {
            transaction: {
              select: {
                id: true,
                type: true,
                referenceNumber: true,
                invoiceNumber: true,
                status: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.inventoryMovement.count({ where }),
      ]);

      const totalPages = Math.ceil(total / take);

      res.status(200).json({
        success: true,
        message: 'Inventory movements retrieved successfully',
        data: movements,
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
      logger.error('Get inventory movements controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve inventory movements',
      } as ApiResponse);
    }
  }

  // Adjust inventory levels
  static async adjustInventory(req: Request, res: Response): Promise<void> {
    try {
      const {
        productId,
        warehouseId,
        newQuantity,
        reason,
        notes,
      } = req.body;

      const userId = req.user?.userId;
      const userName = req.user?.username;

      if (!userId || !userName) {
        res.status(401).json({
          success: false,
          message: 'User authentication required',
        } as ApiResponse);
        return;
      }

      // Get current inventory
      const currentInventory = await prisma.inventory.findUnique({
        where: {
          productId_warehouseId: {
            productId,
            warehouseId,
          },
        },
        include: {
          product: true,
          warehouse: true,
        },
      });

      if (!currentInventory) {
        res.status(404).json({
          success: false,
          message: 'Inventory record not found',
        } as ApiResponse);
        return;
      }

      const quantityDifference = newQuantity - currentInventory.quantity;

      // Create adjustment transaction
      const transaction = await prisma.transaction.create({
        data: {
          type: 'ADJUSTMENT',
          date: new Date(),
          productId,
          productName: currentInventory.product.name,
          sku: currentInventory.product.sku,
          quantity: quantityDifference,
          unit: currentInventory.product.unit,
          unitPrice: 0,
          totalAmount: 0,
          warehouseId,
          warehouseName: currentInventory.warehouse.name,
          userId,
          userName,
          userRole: req.user?.role || '',
          referenceNumber: `ADJ-${Date.now()}`,
          notes: `${reason}${notes ? ` - ${notes}` : ''}`,
          status: 'COMPLETED',
        },
      });

      // Update inventory
      await prisma.inventory.update({
        where: {
          productId_warehouseId: {
            productId,
            warehouseId,
          },
        },
        data: {
          quantity: newQuantity,
        },
      });

      // Create inventory movement record
      await prisma.inventoryMovement.create({
        data: {
          transactionId: transaction.id,
          productId,
          productName: currentInventory.product.name,
          movementType: 'ADJUSTMENT',
          quantity: quantityDifference,
          unit: currentInventory.product.unit,
          warehouseId,
          warehouseName: currentInventory.warehouse.name,
          previousBalance: currentInventory.quantity,
          newBalance: newQuantity,
          unitCost: 0,
          totalCost: 0,
          date: new Date(),
          userId,
          userName,
          reason,
        },
      });

      res.status(200).json({
        success: true,
        message: 'Inventory adjusted successfully',
        data: {
          transaction,
          previousQuantity: currentInventory.quantity,
          newQuantity,
          difference: quantityDifference,
        },
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Adjust inventory controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to adjust inventory',
      } as ApiResponse);
    }
  }

  // Get low stock alerts
  static async getLowStockAlerts(req: Request, res: Response): Promise<void> {
    try {
      const lowStockItems = await prisma.inventory.findMany({
        where: {
          quantity: {
            lte: prisma.inventory.fields.reorderPoint,
          },
        },
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
        },
        orderBy: [
          { quantity: 'asc' },
          { product: { name: 'asc' } },
        ],
      });

      const alertData = lowStockItems.map((item: any) => ({
        ...item,
        stockStatus: item.quantity === 0 ? 'OUT_OF_STOCK' : 
                    item.quantity <= item.minStock ? 'CRITICAL' : 'LOW',
        daysUntilOutOfStock: item.quantity > 0 ? 
          Math.ceil(item.quantity / (item.quantity / 30)) : 0, // Rough calculation
      }));

      res.status(200).json({
        success: true,
        message: 'Low stock alerts retrieved successfully',
        data: alertData,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Get low stock alerts controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve low stock alerts',
      } as ApiResponse);
    }
  }

  // Transfer stock between warehouses
  static async transferStock(req: Request, res: Response): Promise<void> {
    try {
      const {
        productId,
        fromWarehouseId,
        toWarehouseId,
        quantity,
        notes,
      } = req.body;

      const userId = req.user?.userId;
      const userName = req.user?.username;

      if (!userId || !userName) {
        res.status(401).json({
          success: false,
          message: 'User authentication required',
        } as ApiResponse);
        return;
      }

      // Verify product exists
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Product not found',
        } as ApiResponse);
        return;
      }

      // Verify warehouses exist
      const [fromWarehouse, toWarehouse] = await Promise.all([
        prisma.warehouse.findUnique({ where: { id: fromWarehouseId } }),
        prisma.warehouse.findUnique({ where: { id: toWarehouseId } }),
      ]);

      if (!fromWarehouse || !toWarehouse) {
        res.status(404).json({
          success: false,
          message: 'One or both warehouses not found',
        } as ApiResponse);
        return;
      }

      // Check source inventory
      const sourceInventory = await prisma.inventory.findUnique({
        where: {
          productId_warehouseId: {
            productId,
            warehouseId: fromWarehouseId,
          },
        },
      });

      if (!sourceInventory || sourceInventory.quantity < quantity) {
        res.status(400).json({
          success: false,
          message: 'Insufficient inventory in source warehouse',
        } as ApiResponse);
        return;
      }

      // Create transfer transaction
      const transaction = await prisma.transaction.create({
        data: {
          type: 'TRANSFER',
          date: new Date(),
          productId,
          productName: product.name,
          sku: product.sku,
          quantity: -quantity, // Negative for outgoing
          unit: product.unit,
          unitPrice: 0,
          totalAmount: 0,
          warehouseId: fromWarehouseId,
          warehouseName: fromWarehouse.name,
          fromWarehouseId,
          toWarehouseId,
          userId,
          userName,
          userRole: req.user?.role || '',
          referenceNumber: `TRF-${Date.now()}`,
          notes,
          status: 'COMPLETED',
        },
      });

      // Update inventory levels
      await this.updateInventoryLevels(transaction);

      res.status(200).json({
        success: true,
        message: 'Stock transferred successfully',
        data: transaction,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Transfer stock controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to transfer stock',
      } as ApiResponse);
    }
  }

  // Helper method to update inventory levels
  private static async updateInventoryLevels(transaction: any): Promise<void> {
    const { productId, warehouseId, quantity, type, fromWarehouseId, toWarehouseId } = transaction;

    // Update source warehouse inventory (for outgoing transactions)
    if (type === 'SALE' || type === 'TRANSFER') {
      const sourceWarehouseId = fromWarehouseId || warehouseId;
      
      await prisma.inventory.upsert({
        where: {
          productId_warehouseId: {
            productId,
            warehouseId: sourceWarehouseId,
          },
        },
        update: {
          quantity: {
            decrement: Math.abs(quantity),
          },
        },
        create: {
          productId,
          warehouseId: sourceWarehouseId,
          quantity: -Math.abs(quantity),
          minStock: 0,
          maxStock: 1000,
          reorderPoint: 10,
        },
      });
    }

    // Update destination warehouse inventory (for incoming transactions)
    if (type === 'PURCHASE' || type === 'TRANSFER') {
      const destWarehouseId = toWarehouseId || warehouseId;
      
      await prisma.inventory.upsert({
        where: {
          productId_warehouseId: {
            productId,
            warehouseId: destWarehouseId,
          },
        },
        update: {
          quantity: {
            increment: Math.abs(quantity),
          },
        },
        create: {
          productId,
          warehouseId: destWarehouseId,
          quantity: Math.abs(quantity),
          minStock: 0,
          maxStock: 1000,
          reorderPoint: 10,
        },
      });
    }

    // Create inventory movement record
    await prisma.inventoryMovement.create({
      data: {
        transactionId: transaction.id,
        productId,
        productName: transaction.productName,
        movementType: type === 'TRANSFER' ? 'TRANSFER' : 
                     quantity > 0 ? 'IN' : 'OUT',
        quantity: Math.abs(quantity),
        unit: transaction.unit,
        warehouseId: toWarehouseId || warehouseId,
        warehouseName: transaction.warehouseName,
        previousBalance: 0, // This would need to be calculated properly
        newBalance: 0, // This would need to be calculated properly
        unitCost: transaction.unitPrice,
        totalCost: transaction.totalAmount,
        date: new Date(),
        userId: transaction.userId,
        userName: transaction.userName,
      },
    });
  }
}
