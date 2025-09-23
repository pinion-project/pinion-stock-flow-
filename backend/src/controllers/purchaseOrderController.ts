import { Request, Response } from 'express';
import purchaseOrderService from '@/services/purchaseOrderService';
import logger from '@/utils/logger';
import { validationResult } from 'express-validator';

export class PurchaseOrderController {
  // Create purchase order
  public async createPurchaseOrder(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
        return;
      }

      const { supplierId, warehouseId, expectedDate, notes, items } = req.body;
      const createdBy = req.user?.id;

      if (!createdBy) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      const purchaseOrder = await purchaseOrderService.createPurchaseOrder(
        {
          supplierId,
          warehouseId,
          expectedDate: expectedDate ? new Date(expectedDate) : undefined,
          notes,
          items
        },
        createdBy
      );

      res.status(201).json({
        success: true,
        data: purchaseOrder,
        message: 'Purchase order created successfully',
      });
    } catch (error) {
      logger.error('Error creating purchase order:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create purchase order',
      });
    }
  }

  // Get purchase orders
  public async getPurchaseOrders(req: Request, res: Response): Promise<void> {
    try {
      const {
        status,
        supplierId,
        warehouseId,
        startDate,
        endDate,
        page,
        limit
      } = req.query;

      const filters = {
        status: status as any,
        supplierId: supplierId as string,
        warehouseId: warehouseId as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined
      };

      const result = await purchaseOrderService.getPurchaseOrders(filters);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error getting purchase orders:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get purchase orders',
      });
    }
  }

  // Get purchase order by ID
  public async getPurchaseOrderById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const purchaseOrder = await purchaseOrderService.getPurchaseOrderById(id);

      res.status(200).json({
        success: true,
        data: purchaseOrder,
      });
    } catch (error) {
      logger.error('Error getting purchase order:', error);
      res.status(404).json({
        success: false,
        message: 'Purchase order not found',
      });
    }
  }

  // Update purchase order
  public async updatePurchaseOrder(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
        return;
      }

      const { id } = req.params;
      const { status, expectedDate, receivedDate, notes, items } = req.body;
      const updatedBy = req.user?.id;

      if (!updatedBy) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      const purchaseOrder = await purchaseOrderService.updatePurchaseOrder(
        id,
        {
          status,
          expectedDate: expectedDate ? new Date(expectedDate) : undefined,
          receivedDate: receivedDate ? new Date(receivedDate) : undefined,
          notes,
          items
        },
        updatedBy
      );

      res.status(200).json({
        success: true,
        data: purchaseOrder,
        message: 'Purchase order updated successfully',
      });
    } catch (error) {
      logger.error('Error updating purchase order:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update purchase order',
      });
    }
  }

  // Approve purchase order
  public async approvePurchaseOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const approvedBy = req.user?.id;

      if (!approvedBy) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      const purchaseOrder = await purchaseOrderService.approvePurchaseOrder(id, approvedBy);

      res.status(200).json({
        success: true,
        data: purchaseOrder,
        message: 'Purchase order approved successfully',
      });
    } catch (error) {
      logger.error('Error approving purchase order:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to approve purchase order',
      });
    }
  }

  // Receive purchase order
  public async receivePurchaseOrder(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
        return;
      }

      const { id } = req.params;
      const { receivedItems } = req.body;
      const receivedBy = req.user?.id;

      if (!receivedBy) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      const purchaseOrder = await purchaseOrderService.receivePurchaseOrder(
        id,
        receivedItems,
        receivedBy
      );

      res.status(200).json({
        success: true,
        data: purchaseOrder,
        message: 'Purchase order received successfully',
      });
    } catch (error) {
      logger.error('Error receiving purchase order:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to receive purchase order',
      });
    }
  }

  // Cancel purchase order
  public async cancelPurchaseOrder(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
        return;
      }

      const { id } = req.params;
      const { reason } = req.body;
      const cancelledBy = req.user?.id;

      if (!cancelledBy) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      const purchaseOrder = await purchaseOrderService.cancelPurchaseOrder(
        id,
        reason,
        cancelledBy
      );

      res.status(200).json({
        success: true,
        data: purchaseOrder,
        message: 'Purchase order cancelled successfully',
      });
    } catch (error) {
      logger.error('Error cancelling purchase order:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to cancel purchase order',
      });
    }
  }

  // Generate purchase suggestions
  public async generatePurchaseSuggestions(req: Request, res: Response): Promise<void> {
    try {
      const { warehouseId } = req.query;

      const suggestions = await purchaseOrderService.generatePurchaseSuggestions(
        warehouseId as string
      );

      res.status(200).json({
        success: true,
        data: suggestions,
        message: `${suggestions.length} purchase suggestions generated`,
      });
    } catch (error) {
      logger.error('Error generating purchase suggestions:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate purchase suggestions',
      });
    }
  }

  // Get purchase suggestions
  public async getPurchaseSuggestions(req: Request, res: Response): Promise<void> {
    try {
      const {
        warehouseId,
        priority,
        status,
        page,
        limit
      } = req.query;

      const filters = {
        warehouseId: warehouseId as string,
        priority: priority as any,
        status: status as any,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined
      };

      const result = await purchaseOrderService.getPurchaseSuggestions(filters);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error getting purchase suggestions:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get purchase suggestions',
      });
    }
  }

  // Get purchase order reports
  public async getPurchaseOrderReports(req: Request, res: Response): Promise<void> {
    try {
      const {
        startDate,
        endDate,
        supplierId,
        warehouseId,
        status
      } = req.query;

      // This would implement comprehensive reporting
      const reports = {
        summary: {
          totalOrders: 0,
          totalValue: 0,
          averageOrderValue: 0,
          pendingOrders: 0,
          completedOrders: 0
        },
        bySupplier: [],
        byWarehouse: [],
        byStatus: [],
        trends: []
      };

      res.status(200).json({
        success: true,
        data: reports,
      });
    } catch (error) {
      logger.error('Error getting purchase order reports:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get purchase order reports',
      });
    }
  }
}

export default new PurchaseOrderController();
