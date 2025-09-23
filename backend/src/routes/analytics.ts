import { Router } from 'express';
import { body, query } from 'express-validator';
import analyticsController from '@/controllers/analyticsController';
import { authenticateToken } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validation';

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Get dashboard metrics
router.get('/dashboard', analyticsController.getDashboardMetrics);

// Get inventory analytics
router.get(
  '/inventory',
  [
    query('warehouseId').optional().isString().withMessage('Warehouse ID must be a string'),
  ],
  validateRequest,
  analyticsController.getInventoryAnalytics
);

// Get warehouse performance
router.get(
  '/warehouse',
  [
    query('warehouseId').optional().isString().withMessage('Warehouse ID must be a string'),
  ],
  validateRequest,
  analyticsController.getWarehousePerformance
);

// Get financial analytics
router.get(
  '/financial',
  [
    query('startDate').optional().isISO8601().withMessage('Start date must be a valid ISO date'),
    query('endDate').optional().isISO8601().withMessage('End date must be a valid ISO date'),
  ],
  validateRequest,
  analyticsController.getFinancialAnalytics
);

// Get forecasting data
router.get(
  '/forecasting',
  [
    query('warehouseId').optional().isString().withMessage('Warehouse ID must be a string'),
  ],
  validateRequest,
  analyticsController.getForecastingData
);

// Get trend analysis
router.get(
  '/trends',
  [
    query('type').optional().isIn(['inventory', 'sales', 'costs', 'profit']).withMessage('Type must be inventory, sales, costs, or profit'),
    query('period').optional().isIn(['7d', '30d', '90d', '1y']).withMessage('Period must be 7d, 30d, 90d, or 1y'),
    query('warehouseId').optional().isString().withMessage('Warehouse ID must be a string'),
  ],
  validateRequest,
  analyticsController.getTrendAnalysis
);

// Generate custom report
router.post(
  '/custom-report',
  [
    body('reportType').isIn(['inventory', 'financial', 'warehouse', 'forecasting']).withMessage('Report type must be inventory, financial, warehouse, or forecasting'),
    body('dateRange').optional().isObject().withMessage('Date range must be an object'),
    body('dateRange.start').optional().isISO8601().withMessage('Start date must be a valid ISO date'),
    body('dateRange.end').optional().isISO8601().withMessage('End date must be a valid ISO date'),
    body('filters').optional().isObject().withMessage('Filters must be an object'),
    body('format').optional().isIn(['json', 'csv', 'pdf']).withMessage('Format must be json, csv, or pdf'),
    body('warehouseId').optional().isString().withMessage('Warehouse ID must be a string'),
  ],
  validateRequest,
  analyticsController.generateCustomReport
);

// Get analytics summary
router.get(
  '/summary',
  [
    query('period').optional().isIn(['7d', '30d', '90d', '1y']).withMessage('Period must be 7d, 30d, 90d, or 1y'),
    query('warehouseId').optional().isString().withMessage('Warehouse ID must be a string'),
  ],
  validateRequest,
  analyticsController.getAnalyticsSummary
);

// Export analytics data
router.get(
  '/export',
  [
    query('type').isIn(['inventory', 'financial', 'warehouse', 'forecasting']).withMessage('Type must be inventory, financial, warehouse, or forecasting'),
    query('format').optional().isIn(['csv', 'xlsx', 'pdf']).withMessage('Format must be csv, xlsx, or pdf'),
    query('warehouseId').optional().isString().withMessage('Warehouse ID must be a string'),
  ],
  validateRequest,
  analyticsController.exportAnalyticsData
);

export default router;
