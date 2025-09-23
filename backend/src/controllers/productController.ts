import { Request, Response } from 'express';
import prisma from '@/config/database';
import { ApiResponse, PaginationQuery } from '@/types/common';
import logger from '@/utils/logger';

export class ProductController {
  // Get all products with pagination and filtering
  static async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = 1,
        limit = 20,
        search = '',
        category = '',
        brand = '',
        status = '',
        warehouseId = '',
        lowStock = '',
      } = req.query as PaginationQuery & {
        search?: string;
        category?: string;
        brand?: string;
        status?: string;
        warehouseId?: string;
        lowStock?: string;
      };

      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      // Build where clause
      const where: any = {};
      
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { nameEn: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
          { barcode: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (category) {
        where.category = category;
      }

      if (brand) {
        where.brand = brand;
      }

      if (status) {
        where.status = status;
      }

      if (warehouseId) {
        where.warehouseId = warehouseId;
      }

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take,
          include: {
            warehouse: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
            inventory: {
              select: {
                quantity: true,
                minStock: true,
                maxStock: true,
                reorderPoint: true,
                location: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.product.count({ where }),
      ]);

      // Filter low stock products if requested
      let filteredProducts = products;
      if (lowStock === 'true') {
        filteredProducts = products.filter((product: any) => 
          product.inventory.some((inv: any) => inv.quantity <= inv.reorderPoint)
        );
      }

      const totalPages = Math.ceil(total / take);

      res.status(200).json({
        success: true,
        message: 'Products retrieved successfully',
        data: filteredProducts,
        pagination: {
          page: Number(page),
          limit: take,
          total: filteredProducts.length,
          totalPages,
          hasNext: Number(page) < totalPages,
          hasPrev: Number(page) > 1,
        },
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Get products controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve products',
      } as ApiResponse);
    }
  }

  // Get product by ID
  static async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          warehouse: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          inventory: {
            select: {
              quantity: true,
              minStock: true,
              maxStock: true,
              reorderPoint: true,
              location: true,
            },
          },
          transactions: {
            take: 10,
            select: {
              id: true,
              type: true,
              quantity: true,
              unitPrice: true,
              totalAmount: true,
              date: true,
              status: true,
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Product not found',
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Product retrieved successfully',
        data: product,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Get product by ID controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve product',
      } as ApiResponse);
    }
  }

  // Create new product
  static async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const {
        name,
        nameEn,
        sku,
        barcode,
        category,
        subcategory,
        brand,
        model,
        description,
        unit,
        weight,
        length,
        width,
        height,
        status = 'ACTIVE',
        tags = [],
        images = [],
        warranty,
        expiryDate,
        batchNumber,
        warehouseId,
      } = req.body;

      // Check if SKU already exists
      const existingProduct = await prisma.product.findUnique({
        where: { sku },
      });

      if (existingProduct) {
        res.status(400).json({
          success: false,
          message: 'Product with this SKU already exists',
        } as ApiResponse);
        return;
      }

      // Check if barcode already exists (if provided)
      if (barcode) {
        const barcodeExists = await prisma.product.findUnique({
          where: { barcode },
        });

        if (barcodeExists) {
          res.status(400).json({
            success: false,
            message: 'Product with this barcode already exists',
          } as ApiResponse);
          return;
        }
      }

      // Verify warehouse exists
      const warehouse = await prisma.warehouse.findUnique({
        where: { id: warehouseId },
      });

      if (!warehouse) {
        res.status(400).json({
          success: false,
          message: 'Warehouse not found',
        } as ApiResponse);
        return;
      }

      const product = await prisma.product.create({
        data: {
          name,
          nameEn,
          sku,
          barcode,
          category,
          subcategory,
          brand,
          model,
          description,
          unit,
          weight,
          length,
          width,
          height,
          status,
          tags,
          images,
          warranty,
          expiryDate: expiryDate ? new Date(expiryDate) : null,
          batchNumber,
          warehouseId,
        },
        include: {
          warehouse: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
      });

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Create product controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create product',
      } as ApiResponse);
    }
  }

  // Update product
  static async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Check if product exists
      const existingProduct = await prisma.product.findUnique({
        where: { id },
      });

      if (!existingProduct) {
        res.status(404).json({
          success: false,
          message: 'Product not found',
        } as ApiResponse);
        return;
      }

      // Check if SKU is being changed and if it already exists
      if (updateData.sku && updateData.sku !== existingProduct.sku) {
        const skuExists = await prisma.product.findUnique({
          where: { sku: updateData.sku },
        });

        if (skuExists) {
          res.status(400).json({
            success: false,
            message: 'Product SKU already exists',
          } as ApiResponse);
          return;
        }
      }

      // Check if barcode is being changed and if it already exists
      if (updateData.barcode && updateData.barcode !== existingProduct.barcode) {
        const barcodeExists = await prisma.product.findUnique({
          where: { barcode: updateData.barcode },
        });

        if (barcodeExists) {
          res.status(400).json({
            success: false,
            message: 'Product barcode already exists',
          } as ApiResponse);
          return;
        }
      }

      // Verify warehouse exists if being updated
      if (updateData.warehouseId) {
        const warehouse = await prisma.warehouse.findUnique({
          where: { id: updateData.warehouseId },
        });

        if (!warehouse) {
          res.status(400).json({
            success: false,
            message: 'Warehouse not found',
          } as ApiResponse);
          return;
        }
      }

      // Handle date conversion
      if (updateData.expiryDate) {
        updateData.expiryDate = new Date(updateData.expiryDate);
      }

      const product = await prisma.product.update({
        where: { id },
        data: updateData,
        include: {
          warehouse: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
      });

      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: product,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Update product controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update product',
      } as ApiResponse);
    }
  }

  // Delete product
  static async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Check if product exists
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              inventory: true,
              transactions: true,
            },
          },
        },
      });

      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Product not found',
        } as ApiResponse);
        return;
      }

      // Check if product has associated data
      if (product._count.inventory > 0 || product._count.transactions > 0) {
        res.status(400).json({
          success: false,
          message: 'Cannot delete product with associated inventory or transactions',
        } as ApiResponse);
        return;
      }

      await prisma.product.delete({
        where: { id },
      });

      res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Delete product controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete product',
      } as ApiResponse);
    }
  }

  // Search products
  static async searchProducts(req: Request, res: Response): Promise<void> {
    try {
      const { q, limit = '10' } = req.query as { q: string; limit?: string };

      if (!q || q.trim().length < 2) {
        res.status(400).json({
          success: false,
          message: 'Search query must be at least 2 characters long',
        } as ApiResponse);
        return;
      }

      const products = await prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { nameEn: { contains: q, mode: 'insensitive' } },
            { sku: { contains: q, mode: 'insensitive' } },
            { barcode: { contains: q, mode: 'insensitive' } },
            { brand: { contains: q, mode: 'insensitive' } },
          ],
          status: 'ACTIVE',
        },
        take: parseInt(limit),
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
          warehouse: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          inventory: {
            select: {
              quantity: true,
              minStock: true,
              reorderPoint: true,
            },
          },
        },
        orderBy: { name: 'asc' },
      });

      res.status(200).json({
        success: true,
        message: 'Products found successfully',
        data: products,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Search products controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to search products',
      } as ApiResponse);
    }
  }

  // Get product categories
  static async getProductCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await prisma.product.groupBy({
        by: ['category'],
        _count: {
          id: true,
        },
        orderBy: {
          category: 'asc',
        },
      });

      const categoryData = categories.map((cat: any) => ({
        category: cat.category,
        count: cat._count.id,
      }));

      res.status(200).json({
        success: true,
        message: 'Product categories retrieved successfully',
        data: categoryData,
      } as ApiResponse);
    } catch (error: any) {
      logger.error('Get product categories controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve product categories',
      } as ApiResponse);
    }
  }

  // Get product transaction history
  static async getProductHistory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { page = 1, limit = 20 } = req.query as PaginationQuery;

      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      // Check if product exists
      const product = await prisma.product.findUnique({
        where: { id },
        select: { id: true, name: true, sku: true },
      });

      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Product not found',
        } as ApiResponse);
        return;
      }

      const [transactions, total] = await Promise.all([
        prisma.transaction.findMany({
          where: { productId: id },
          skip,
          take,
          include: {
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
          orderBy: { createdAt: 'desc' },
        }),
        prisma.transaction.count({ where: { productId: id } }),
      ]);

      const totalPages = Math.ceil(total / take);

      res.status(200).json({
        success: true,
        message: 'Product transaction history retrieved successfully',
        data: {
          product,
          transactions,
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
      logger.error('Get product history controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve product history',
      } as ApiResponse);
    }
  }
}
