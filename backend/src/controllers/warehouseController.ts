import { Request, Response } from 'express';
import prisma from '@/config/database';
import { ApiResponse, PaginationQuery } from '@/types/common';
import logger from '@/utils/logger';

export class WarehouseController {
  // Get all warehouses with pagination and filtering
  static async getWarehouses(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = 1,
        limit = 20,
        search = '',
        type = '',
        status = '',
        city = '',
      } = req.query as PaginationQuery & {
        search?: string;
        type?: string;
        status?: string;
        city?: string;
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
        ];
      }

      if (type) {
        where.type = type;
      }

      if (status) {
        where.status = status;
      }

      if (city) {
        where.city = { contains: city, mode: 'insensitive' };
      }

      const [warehouses, total] = await Promise.all([
        prisma.warehouse.findMany({
          where,
          skip,
          take,
          include: {
            users: {
              select: {
                id: true,
                username: true,
                fullName: true,
                role: true,
              },
            },
            _count: {
              select: {
                products: true,
                inventory: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.warehouse.count({ where }),
      ]);

      const totalPages = Math.ceil(total / take);

      res.status(200).json({
        success: true,
        message: 'Warehouses retrieved successfully',
        data: warehouses,
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
      logger.error('Get warehouses controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve warehouses',
      } as ApiResponse);
    }
  }

  // Get warehouse by ID
  static async getWarehouseById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const warehouse = await prisma.warehouse.findUnique({
        where: { id },
        include: {
          users: {
            select: {
              id: true,
              username: true,
              fullName: true,
              role: true,
              isActive: true,
            },
          },
          products: {
            take: 10,
            select: {
              id: true,
              name: true,
              sku: true,
              category: true,
              status: true,
            },
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: {
              products: true,
              inventory: true,
              transactions: true,
            },
          },
        },
      });

      if (!warehouse) {
        res.status(404).json({
          success: false,
          message: 'Warehouse not found',
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Warehouse retrieved successfully',
        data: warehouse,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Get warehouse by ID controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve warehouse',
      } as ApiResponse);
    }
  }

  // Create new warehouse
  static async createWarehouse(req: Request, res: Response): Promise<void> {
    try {
      const {
        name,
        nameEn,
        code,
        type,
        address,
        city,
        governorate,
        latitude,
        longitude,
        maxVolume,
        maxWeight,
        managerId,
        managerName,
        managerEmail,
        managerPhone,
        phone,
        fax,
        email,
        website,
        emergencyContact,
      } = req.body;

      // Check if warehouse code already exists
      const existingWarehouse = await prisma.warehouse.findUnique({
        where: { code },
      });

      if (existingWarehouse) {
        res.status(400).json({
          success: false,
          message: 'Warehouse with this code already exists',
        } as ApiResponse);
        return;
      }

      // Verify manager exists
      if (managerId) {
        const manager = await prisma.user.findUnique({
          where: { id: managerId },
        });

        if (!manager) {
          res.status(400).json({
            success: false,
            message: 'Manager not found',
          } as ApiResponse);
          return;
        }
      }

      const warehouse = await prisma.warehouse.create({
        data: {
          name,
          nameEn,
          code,
          type,
          address,
          city,
          governorate,
          latitude,
          longitude,
          maxVolume,
          maxWeight,
          currentStock: 0,
          availableSpace: maxVolume,
          reservedSpace: 0,
          managerId: managerId || '',
          managerName: managerName || '',
          managerEmail: managerEmail || '',
          managerPhone: managerPhone || '',
          phone,
          fax,
          email,
          website,
          emergencyContact,
        },
        include: {
          users: {
            select: {
              id: true,
              username: true,
              fullName: true,
              role: true,
            },
          },
        },
      });

      res.status(201).json({
        success: true,
        message: 'Warehouse created successfully',
        data: warehouse,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Create warehouse controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create warehouse',
      } as ApiResponse);
    }
  }

  // Update warehouse
  static async updateWarehouse(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Check if warehouse exists
      const existingWarehouse = await prisma.warehouse.findUnique({
        where: { id },
      });

      if (!existingWarehouse) {
        res.status(404).json({
          success: false,
          message: 'Warehouse not found',
        } as ApiResponse);
        return;
      }

      // Check if code is being changed and if it already exists
      if (updateData.code && updateData.code !== existingWarehouse.code) {
        const codeExists = await prisma.warehouse.findUnique({
          where: { code: updateData.code },
        });

        if (codeExists) {
          res.status(400).json({
            success: false,
            message: 'Warehouse code already exists',
          } as ApiResponse);
          return;
        }
      }

      // Verify manager exists if being updated
      if (updateData.managerId) {
        const manager = await prisma.user.findUnique({
          where: { id: updateData.managerId },
        });

        if (!manager) {
          res.status(400).json({
            success: false,
            message: 'Manager not found',
          } as ApiResponse);
          return;
        }
      }

      const warehouse = await prisma.warehouse.update({
        where: { id },
        data: updateData,
        include: {
          users: {
            select: {
              id: true,
              username: true,
              fullName: true,
              role: true,
            },
          },
        },
      });

      res.status(200).json({
        success: true,
        message: 'Warehouse updated successfully',
        data: warehouse,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Update warehouse controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update warehouse',
      } as ApiResponse);
    }
  }

  // Delete warehouse
  static async deleteWarehouse(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Check if warehouse exists
      const warehouse = await prisma.warehouse.findUnique({
        where: { id },
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

      if (!warehouse) {
        res.status(404).json({
          success: false,
          message: 'Warehouse not found',
        } as ApiResponse);
        return;
      }

      // Check if warehouse has associated data
      if (warehouse._count.products > 0 || warehouse._count.inventory > 0 || warehouse._count.transactions > 0) {
        res.status(400).json({
          success: false,
          message: 'Cannot delete warehouse with associated products, inventory, or transactions',
        } as ApiResponse);
        return;
      }

      await prisma.warehouse.delete({
        where: { id },
      });

      res.status(200).json({
        success: true,
        message: 'Warehouse deleted successfully',
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Delete warehouse controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete warehouse',
      } as ApiResponse);
    }
  }

  // Get warehouse capacity metrics
  static async getWarehouseCapacity(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const warehouse = await prisma.warehouse.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          code: true,
          maxVolume: true,
          maxWeight: true,
          currentStock: true,
          availableSpace: true,
          reservedSpace: true,
        },
      });

      if (!warehouse) {
        res.status(404).json({
          success: false,
          message: 'Warehouse not found',
        } as ApiResponse);
        return;
      }

      // Calculate capacity percentages
      const volumeUtilization = (warehouse.currentStock / warehouse.maxVolume) * 100;
      const weightUtilization = (warehouse.currentStock / warehouse.maxWeight) * 100;

      const capacityData = {
        ...warehouse,
        volumeUtilization: Math.round(volumeUtilization * 100) / 100,
        weightUtilization: Math.round(weightUtilization * 100) / 100,
        isNearCapacity: volumeUtilization > 80 || weightUtilization > 80,
      };

      res.status(200).json({
        success: true,
        message: 'Warehouse capacity retrieved successfully',
        data: capacityData,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Get warehouse capacity controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve warehouse capacity',
      } as ApiResponse);
    }
  }

  // Get warehouse performance metrics
  static async getWarehousePerformance(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { period = '30' } = req.query as { period?: string };

      const days = parseInt(period);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const warehouse = await prisma.warehouse.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          code: true,
        },
      });

      if (!warehouse) {
        res.status(404).json({
          success: false,
          message: 'Warehouse not found',
        } as ApiResponse);
        return;
      }

      // Get transaction statistics
      const [transactionStats, inventoryStats] = await Promise.all([
        prisma.transaction.aggregate({
          where: {
            warehouseId: id,
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
        }),
        prisma.inventory.aggregate({
          where: {
            warehouseId: id,
          },
          _count: {
            id: true,
          },
          _sum: {
            quantity: true,
          },
        }),
      ]);

      const performanceData = {
        warehouse,
        period: `${days} days`,
        transactions: {
          count: transactionStats._count.id,
          totalAmount: transactionStats._sum.totalAmount || 0,
          totalQuantity: transactionStats._sum.quantity || 0,
        },
        inventory: {
          totalProducts: inventoryStats._count.id,
          totalQuantity: inventoryStats._sum.quantity || 0,
        },
        generatedAt: new Date(),
      };

      res.status(200).json({
        success: true,
        message: 'Warehouse performance retrieved successfully',
        data: performanceData,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Get warehouse performance controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve warehouse performance',
      } as ApiResponse);
    }
  }
}
