import { Router } from 'express';
import { body, param, query } from 'express-validator';
import purchaseOrderController from '@/controllers/purchaseOrderController';
import { authenticateToken } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validation';

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Create purchase order
router.post(
  '/',
  [
    body('supplierId').isString().notEmpty().withMessage('Supplier ID is required'),
    body('warehouseId').isString().notEmpty().withMessage('Warehouse ID is required'),
    body('expectedDate').optional().isISO8601().withMessage('Expected date must be a valid ISO date'),
    body('notes').optional().isString().withMessage('Notes must be a string'),
    body('items').isArray({ min: 1 }).withMessage('Items array is required and must not be empty'),
    body('items.*.productId').isString().notEmpty().withMessage('Product ID is required for each item'),
    body('items.*.quantity').isFloat({ min: 0.01 }).withMessage('Quantity must be a positive number'),
    body('items.*.unitPrice').isFloat({ min: 0 }).withMessage('Unit price must be a non-negative number'),
    body('items.*.notes').optional().isString().withMessage('Item notes must be a string'),
  ],
  validateRequest,
  purchaseOrderController.createPurchaseOrder
);

// Get purchase orders
router.get(
  '/',
  [
    query('status').optional().isIn(['PENDING', 'APPROVED', 'ORDERED', 'PARTIALLY_RECEIVED', 'RECEIVED', 'CANCELLED', 'REJECTED']).withMessage('Invalid status'),
    query('supplierId').optional().isString().withMessage('Supplier ID must be a string'),
    query('warehouseId').optional().isString().withMessage('Warehouse ID must be a string'),
    query('startDate').optional().isISO8601().withMessage('Start date must be a valid ISO date'),
    query('endDate').optional().isISO8601().withMessage('End date must be a valid ISO date'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  ],
  validateRequest,
  purchaseOrderController.getPurchaseOrders
);

// Get purchase order by ID
router.get(
  '/:id',
  [
    param('id').isString().notEmpty().withMessage('Purchase order ID is required'),
  ],
  validateRequest,
  purchaseOrderController.getPurchaseOrderById
);

// Update purchase order
router.put(
  '/:id',
  [
    param('id').isString().notEmpty().withMessage('Purchase order ID is required'),
    body('status').optional().isIn(['PENDING', 'APPROVED', 'ORDERED', 'PARTIALLY_RECEIVED', 'RECEIVED', 'CANCELLED', 'REJECTED']).withMessage('Invalid status'),
    body('expectedDate').optional().isISO8601().withMessage('Expected date must be a valid ISO date'),
    body('receivedDate').optional().isISO8601().withMessage('Received date must be a valid ISO date'),
    body('notes').optional().isString().withMessage('Notes must be a string'),
    body('items').optional().isArray().withMessage('Items must be an array'),
    body('items.*.productId').optional().isString().notEmpty().withMessage('Product ID is required for each item'),
    body('items.*.quantity').optional().isFloat({ min: 0.01 }).withMessage('Quantity must be a positive number'),
    body('items.*.unitPrice').optional().isFloat({ min: 0 }).withMessage('Unit price must be a non-negative number'),
    body('items.*.notes').optional().isString().withMessage('Item notes must be a string'),
  ],
  validateRequest,
  purchaseOrderController.updatePurchaseOrder
);

// Approve purchase order
router.post(
  '/:id/approve',
  [
    param('id').isString().notEmpty().withMessage('Purchase order ID is required'),
  ],
  validateRequest,
  purchaseOrderController.approvePurchaseOrder
);

// Receive purchase order
router.post(
  '/:id/receive',
  [
    param('id').isString().notEmpty().withMessage('Purchase order ID is required'),
    body('receivedItems').isArray({ min: 1 }).withMessage('Received items array is required'),
    body('receivedItems.*.itemId').isString().notEmpty().withMessage('Item ID is required for each received item'),
    body('receivedItems.*.receivedQuantity').isFloat({ min: 0.01 }).withMessage('Received quantity must be a positive number'),
  ],
  validateRequest,
  purchaseOrderController.receivePurchaseOrder
);

// Cancel purchase order
router.post(
  '/:id/cancel',
  [
    param('id').isString().notEmpty().withMessage('Purchase order ID is required'),
    body('reason').isString().notEmpty().withMessage('Cancellation reason is required'),
  ],
  validateRequest,
  purchaseOrderController.cancelPurchaseOrder
);

// Generate purchase suggestions
router.post(
  '/suggestions/generate',
  [
    query('warehouseId').optional().isString().withMessage('Warehouse ID must be a string'),
  ],
  validateRequest,
  purchaseOrderController.generatePurchaseSuggestions
);

// Get purchase suggestions
router.get(
  '/suggestions',
  [
    query('warehouseId').optional().isString().withMessage('Warehouse ID must be a string'),
    query('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).withMessage('Invalid priority'),
    query('status').optional().isIn(['PENDING', 'APPROVED', 'REJECTED', 'IMPLEMENTED']).withMessage('Invalid status'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  ],
  validateRequest,
  purchaseOrderController.getPurchaseSuggestions
);

// Get purchase order reports
router.get(
  '/reports',
  [
    query('startDate').optional().isISO8601().withMessage('Start date must be a valid ISO date'),
    query('endDate').optional().isISO8601().withMessage('End date must be a valid ISO date'),
    query('supplierId').optional().isString().withMessage('Supplier ID must be a string'),
    query('warehouseId').optional().isString().withMessage('Warehouse ID must be a string'),
    query('status').optional().isIn(['PENDING', 'APPROVED', 'ORDERED', 'PARTIALLY_RECEIVED', 'RECEIVED', 'CANCELLED', 'REJECTED']).withMessage('Invalid status'),
  ],
  validateRequest,
  purchaseOrderController.getPurchaseOrderReports
);

export default router;
