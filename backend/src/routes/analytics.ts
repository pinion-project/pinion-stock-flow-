import { Router } from 'express';
import { AnalyticsController } from '@/controllers/analyticsController';
import { authenticateToken } from '@/middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get dashboard metrics
router.get('/dashboard', AnalyticsController.getDashboardMetrics);

// Get inventory analytics
router.get('/inventory', AnalyticsController.getInventoryAnalytics);

// Get warehouse analytics
router.get('/warehouse', AnalyticsController.getWarehouseAnalytics);

// Get financial analytics
router.get('/financial', AnalyticsController.getFinancialAnalytics);

export default router;
