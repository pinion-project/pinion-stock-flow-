import prisma from '@/config/database';
import logger from '@/utils/logger';
import notificationService from './notificationService';
import { PurchaseOrderStatus, SuggestionPriority, SuggestionStatus } from '@prisma/client';

export interface CreatePurchaseOrderData {
  supplierId: string;
  warehouseId: string;
  expectedDate?: Date;
  notes?: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    notes?: string;
  }[];
}

export interface UpdatePurchaseOrderData {
  status?: PurchaseOrderStatus;
  expectedDate?: Date;
  receivedDate?: Date;
  notes?: string;
  items?: {
    id?: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    notes?: string;
  }[];
}

export interface PurchaseSuggestionData {
  productId: string;
  warehouseId: string;
  currentStock: number;
  minStock: number;
  suggestedQuantity: number;
  reason: string;
  priority: SuggestionPriority;
}

class PurchaseOrderService {
  // Create purchase order
  public async createPurchaseOrder(data: CreatePurchaseOrderData, createdBy: string): Promise<any> {
    try {
      // Generate order number
      const orderNumber = await this.generateOrderNumber();

      // Get supplier and warehouse info
      const [supplier, warehouse] = await Promise.all([
        prisma.supplier.findUnique({ where: { id: data.supplierId } }),
        prisma.warehouse.findUnique({ where: { id: data.warehouseId } })
      ]);

      if (!supplier || !warehouse) {
        throw new Error('Supplier or warehouse not found');
      }

      // Calculate total amount
      const totalAmount = data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

      // Create purchase order
      const purchaseOrder = await prisma.purchaseOrder.create({
        data: {
          orderNumber,
          supplierId: data.supplierId,
          warehouseId: data.warehouseId,
          orderDate: new Date(),
          expectedDate: data.expectedDate,
          totalAmount,
          notes: data.notes,
          createdBy,
          status: 'PENDING',
          items: {
            create: data.items.map(item => ({
              productId: item.productId,
              productName: '', // Will be filled by trigger or manually
              sku: '', // Will be filled by trigger or manually
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.quantity * item.unitPrice,
              notes: item.notes,
            }))
          }
        },
        include: {
          supplier: true,
          warehouse: true,
          items: {
            include: {
              product: true
            }
          }
        }
      });

      // Update product names and SKUs
      await this.updateOrderItemDetails(purchaseOrder.id);

      // Send notification to warehouse managers
      await this.notifyPurchaseOrderCreated(purchaseOrder);

      logger.info(`Purchase order created: ${purchaseOrder.orderNumber}`);
      return purchaseOrder;
    } catch (error) {
      logger.error('Error creating purchase order:', error);
      throw error;
    }
  }

  // Get purchase orders with filtering and pagination
  public async getPurchaseOrders(filters: {
    status?: PurchaseOrderStatus;
    supplierId?: string;
    warehouseId?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  } = {}) {
    try {
      const {
        status,
        supplierId,
        warehouseId,
        startDate,
        endDate,
        page = 1,
        limit = 20
      } = filters;

      const skip = (page - 1) * limit;

      const whereClause: any = {};
      if (status) whereClause.status = status;
      if (supplierId) whereClause.supplierId = supplierId;
      if (warehouseId) whereClause.warehouseId = warehouseId;
      if (startDate || endDate) {
        whereClause.orderDate = {};
        if (startDate) whereClause.orderDate.gte = startDate;
        if (endDate) whereClause.orderDate.lte = endDate;
      }

      const [purchaseOrders, total] = await Promise.all([
        prisma.purchaseOrder.findMany({
          where: whereClause,
          include: {
            supplier: { select: { id: true, name: true, email: true } },
            warehouse: { select: { id: true, name: true } },
            items: {
              include: {
                product: { select: { id: true, name: true, sku: true } }
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit
        }),
        prisma.purchaseOrder.count({ where: whereClause })
      ]);

      return {
        purchaseOrders,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      };
    } catch (error) {
      logger.error('Error getting purchase orders:', error);
      throw error;
    }
  }

  // Get purchase order by ID
  public async getPurchaseOrderById(id: string): Promise<any> {
    try {
      const purchaseOrder = await prisma.purchaseOrder.findUnique({
        where: { id },
        include: {
          supplier: true,
          warehouse: true,
          items: {
            include: {
              product: true
            }
          }
        }
      });

      if (!purchaseOrder) {
        throw new Error('Purchase order not found');
      }

      return purchaseOrder;
    } catch (error) {
      logger.error('Error getting purchase order:', error);
      throw error;
    }
  }

  // Update purchase order
  public async updatePurchaseOrder(id: string, data: UpdatePurchaseOrderData, updatedBy: string): Promise<any> {
    try {
      const purchaseOrder = await prisma.purchaseOrder.findUnique({
        where: { id },
        include: { items: true }
      });

      if (!purchaseOrder) {
        throw new Error('Purchase order not found');
      }

      // Update items if provided
      if (data.items) {
        await this.updatePurchaseOrderItems(id, data.items);
      }

      // Update purchase order
      const updatedOrder = await prisma.purchaseOrder.update({
        where: { id },
        data: {
          status: data.status,
          expectedDate: data.expectedDate,
          receivedDate: data.receivedDate,
          notes: data.notes,
          updatedAt: new Date()
        },
        include: {
          supplier: true,
          warehouse: true,
          items: {
            include: {
              product: true
            }
          }
        }
      });

      // Send notification if status changed
      if (data.status && data.status !== purchaseOrder.status) {
        await this.notifyPurchaseOrderStatusChange(updatedOrder);
      }

      logger.info(`Purchase order updated: ${updatedOrder.orderNumber}`);
      return updatedOrder;
    } catch (error) {
      logger.error('Error updating purchase order:', error);
      throw error;
    }
  }

  // Approve purchase order
  public async approvePurchaseOrder(id: string, approvedBy: string): Promise<any> {
    try {
      const purchaseOrder = await prisma.purchaseOrder.findUnique({
        where: { id }
      });

      if (!purchaseOrder) {
        throw new Error('Purchase order not found');
      }

      if (purchaseOrder.status !== 'PENDING') {
        throw new Error('Only pending purchase orders can be approved');
      }

      const updatedOrder = await prisma.purchaseOrder.update({
        where: { id },
        data: {
          status: 'APPROVED',
          approvedBy,
          approvedAt: new Date()
        },
        include: {
          supplier: true,
          warehouse: true,
          items: {
            include: {
              product: true
            }
          }
        }
      });

      // Send notification
      await this.notifyPurchaseOrderStatusChange(updatedOrder);

      logger.info(`Purchase order approved: ${updatedOrder.orderNumber}`);
      return updatedOrder;
    } catch (error) {
      logger.error('Error approving purchase order:', error);
      throw error;
    }
  }

  // Receive purchase order
  public async receivePurchaseOrder(id: string, receivedItems: {
    itemId: string;
    receivedQuantity: number;
  }[], receivedBy: string): Promise<any> {
    try {
      const purchaseOrder = await prisma.purchaseOrder.findUnique({
        where: { id },
        include: { items: true }
      });

      if (!purchaseOrder) {
        throw new Error('Purchase order not found');
      }

      if (!['APPROVED', 'ORDERED', 'PARTIALLY_RECEIVED'].includes(purchaseOrder.status)) {
        throw new Error('Purchase order must be approved or ordered to receive items');
      }

      // Update received quantities
      for (const receivedItem of receivedItems) {
        await prisma.purchaseOrderItem.update({
          where: { id: receivedItem.itemId },
          data: {
            receivedQuantity: {
              increment: receivedItem.receivedQuantity
            }
          }
        });
      }

      // Check if all items are fully received
      const allItems = await prisma.purchaseOrderItem.findMany({
        where: { purchaseOrderId: id }
      });

      const isFullyReceived = allItems.every(item => 
        item.receivedQuantity >= item.quantity
      );

      const isPartiallyReceived = allItems.some(item => 
        item.receivedQuantity > 0 && item.receivedQuantity < item.quantity
      );

      let newStatus: PurchaseOrderStatus = 'PARTIALLY_RECEIVED';
      if (isFullyReceived) {
        newStatus = 'RECEIVED';
      } else if (!isPartiallyReceived) {
        newStatus = 'ORDERED';
      }

      // Update purchase order status
      const updatedOrder = await prisma.purchaseOrder.update({
        where: { id },
        data: {
          status: newStatus,
          receivedDate: newStatus === 'RECEIVED' ? new Date() : undefined
        },
        include: {
          supplier: true,
          warehouse: true,
          items: {
            include: {
              product: true
            }
          }
        }
      });

      // Create inventory transactions for received items
      await this.createInventoryTransactions(updatedOrder, receivedItems);

      // Send notification
      await this.notifyPurchaseOrderStatusChange(updatedOrder);

      logger.info(`Purchase order received: ${updatedOrder.orderNumber}`);
      return updatedOrder;
    } catch (error) {
      logger.error('Error receiving purchase order:', error);
      throw error;
    }
  }

  // Cancel purchase order
  public async cancelPurchaseOrder(id: string, reason: string, cancelledBy: string): Promise<any> {
    try {
      const purchaseOrder = await prisma.purchaseOrder.findUnique({
        where: { id }
      });

      if (!purchaseOrder) {
        throw new Error('Purchase order not found');
      }

      if (['RECEIVED', 'CANCELLED'].includes(purchaseOrder.status)) {
        throw new Error('Cannot cancel received or already cancelled purchase order');
      }

      const updatedOrder = await prisma.purchaseOrder.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          notes: reason
        },
        include: {
          supplier: true,
          warehouse: true,
          items: {
            include: {
              product: true
            }
          }
        }
      });

      // Send notification
      await this.notifyPurchaseOrderStatusChange(updatedOrder);

      logger.info(`Purchase order cancelled: ${updatedOrder.orderNumber}`);
      return updatedOrder;
    } catch (error) {
      logger.error('Error cancelling purchase order:', error);
      throw error;
    }
  }

  // Generate purchase suggestions
  public async generatePurchaseSuggestions(warehouseId?: string): Promise<any[]> {
    try {
      const whereClause = warehouseId ? { warehouseId } : {};

      // Get inventory items that are at or below reorder point
      const lowStockItems = await prisma.inventory.findMany({
        where: {
          ...whereClause,
          quantity: {
            lte: prisma.inventory.fields.reorderPoint
          }
        },
        include: {
          product: true,
          warehouse: true
        }
      });

      const suggestions = await Promise.all(
        lowStockItems.map(async (item) => {
          // Calculate suggested quantity (reorder point + safety stock)
          const suggestedQuantity = Math.max(
            item.reorderPoint - item.quantity + (item.maxStock * 0.1), // 10% safety stock
            1
          );

          // Determine priority based on how low the stock is
          let priority: SuggestionPriority = 'LOW';
          const stockRatio = item.quantity / item.reorderPoint;
          if (stockRatio <= 0.1) priority = 'URGENT';
          else if (stockRatio <= 0.3) priority = 'HIGH';
          else if (stockRatio <= 0.5) priority = 'MEDIUM';

          // Create or update suggestion
          const suggestion = await prisma.purchaseSuggestion.upsert({
            where: {
              productId_warehouseId: {
                productId: item.productId,
                warehouseId: item.warehouseId
              }
            },
            update: {
              currentStock: item.quantity,
              suggestedQuantity,
              priority,
              status: 'PENDING'
            },
            create: {
              productId: item.productId,
              warehouseId: item.warehouseId,
              currentStock: item.quantity,
              minStock: item.reorderPoint,
              suggestedQuantity,
              reason: `Stock level (${item.quantity}) is at or below reorder point (${item.reorderPoint})`,
              priority,
              status: 'PENDING'
            },
            include: {
              product: true,
              warehouse: true
            }
          });

          return suggestion;
        })
      );

      logger.info(`Generated ${suggestions.length} purchase suggestions`);
      return suggestions;
    } catch (error) {
      logger.error('Error generating purchase suggestions:', error);
      throw error;
    }
  }

  // Get purchase suggestions
  public async getPurchaseSuggestions(filters: {
    warehouseId?: string;
    priority?: SuggestionPriority;
    status?: SuggestionStatus;
    page?: number;
    limit?: number;
  } = {}) {
    try {
      const {
        warehouseId,
        priority,
        status,
        page = 1,
        limit = 20
      } = filters;

      const skip = (page - 1) * limit;

      const whereClause: any = {};
      if (warehouseId) whereClause.warehouseId = warehouseId;
      if (priority) whereClause.priority = priority;
      if (status) whereClause.status = status;

      const [suggestions, total] = await Promise.all([
        prisma.purchaseSuggestion.findMany({
          where: whereClause,
          include: {
            product: true,
            warehouse: true
          },
          orderBy: [
            { priority: 'desc' },
            { createdAt: 'desc' }
          ],
          skip,
          take: limit
        }),
        prisma.purchaseSuggestion.count({ where: whereClause })
      ]);

      return {
        suggestions,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      };
    } catch (error) {
      logger.error('Error getting purchase suggestions:', error);
      throw error;
    }
  }

  // Helper methods
  private async generateOrderNumber(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    const prefix = `PO${year}${month}${day}`;
    
    const lastOrder = await prisma.purchaseOrder.findFirst({
      where: {
        orderNumber: {
          startsWith: prefix
        }
      },
      orderBy: { orderNumber: 'desc' }
    });

    let sequence = 1;
    if (lastOrder) {
      const lastSequence = parseInt(lastOrder.orderNumber.substring(prefix.length));
      sequence = lastSequence + 1;
    }

    return `${prefix}${String(sequence).padStart(4, '0')}`;
  }

  private async updateOrderItemDetails(purchaseOrderId: string): Promise<void> {
    const items = await prisma.purchaseOrderItem.findMany({
      where: { purchaseOrderId },
      include: { product: true }
    });

    for (const item of items) {
      await prisma.purchaseOrderItem.update({
        where: { id: item.id },
        data: {
          productName: item.product.name,
          sku: item.product.sku
        }
      });
    }
  }

  private async updatePurchaseOrderItems(purchaseOrderId: string, items: any[]): Promise<void> {
    // Delete existing items
    await prisma.purchaseOrderItem.deleteMany({
      where: { purchaseOrderId }
    });

    // Create new items
    await prisma.purchaseOrderItem.createMany({
      data: items.map(item => ({
        purchaseOrderId,
        productId: item.productId,
        productName: '', // Will be filled
        sku: '', // Will be filled
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.quantity * item.unitPrice,
        notes: item.notes
      }))
    });

    // Update product details
    await this.updateOrderItemDetails(purchaseOrderId);
  }

  private async createInventoryTransactions(purchaseOrder: any, receivedItems: any[]): Promise<void> {
    // This would create inventory transactions for received items
    // Implementation depends on your transaction system
    logger.info('Creating inventory transactions for received items');
  }

  private async notifyPurchaseOrderCreated(purchaseOrder: any): Promise<void> {
    // Get warehouse managers
    const managers = await prisma.user.findMany({
      where: {
        warehouseId: purchaseOrder.warehouseId,
        role: 'WAREHOUSE_MANAGER',
        isActive: true
      }
    });

    const notifications = managers.map(manager => ({
      userId: manager.id,
      title: 'طلب شراء جديد',
      message: `تم إنشاء طلب شراء جديد ${purchaseOrder.orderNumber} من ${purchaseOrder.supplier.name}`,
      type: 'INFO' as const,
      category: 'INVENTORY' as const,
      data: {
        purchaseOrderId: purchaseOrder.id,
        orderNumber: purchaseOrder.orderNumber,
        supplierName: purchaseOrder.supplier.name
      }
    }));

    await notificationService.createBulkNotifications(notifications);
  }

  private async notifyPurchaseOrderStatusChange(purchaseOrder: any): Promise<void> {
    // Get warehouse managers
    const managers = await prisma.user.findMany({
      where: {
        warehouseId: purchaseOrder.warehouseId,
        role: 'WAREHOUSE_MANAGER',
        isActive: true
      }
    });

    const statusMessages: Record<string, string> = {
      PENDING: 'في انتظار الموافقة',
      APPROVED: 'تمت الموافقة',
      ORDERED: 'تم الطلب',
      PARTIALLY_RECEIVED: 'تم استلام جزئي',
      RECEIVED: 'تم الاستلام بالكامل',
      CANCELLED: 'تم الإلغاء',
      REJECTED: 'تم الرفض'
    };

    const notifications = managers.map(manager => ({
      userId: manager.id,
      title: 'تحديث حالة طلب الشراء',
      message: `طلب الشراء ${purchaseOrder.orderNumber} - ${statusMessages[purchaseOrder.status] || 'حالة غير معروفة'}`,
      type: 'INFO' as const,
      category: 'INVENTORY' as const,
      data: {
        purchaseOrderId: purchaseOrder.id,
        orderNumber: purchaseOrder.orderNumber,
        status: purchaseOrder.status
      }
    }));

    await notificationService.createBulkNotifications(notifications);
  }
}

export default new PurchaseOrderService();
