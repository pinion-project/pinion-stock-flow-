import { Router } from 'express';
import { InventoryController } from '@/controllers/inventoryController';
import { authenticateToken, requireRole } from '@/middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get inventory levels
router.get('/', InventoryController.getInventoryLevels);

// Get inventory movements
router.get('/movements', InventoryController.getInventoryMovements);

// Get low stock alerts
router.get('/low-stock', InventoryController.getLowStockAlerts);

// Record inventory transaction
router.post('/transactions', requireRole(['GENERAL_MANAGER', 'WAREHOUSE_MANAGER']), InventoryController.recordTransaction);

// Adjust inventory levels
router.put('/adjust', requireRole(['GENERAL_MANAGER', 'WAREHOUSE_MANAGER']), InventoryController.adjustInventory);

// Transfer stock between warehouses
router.post('/transfer', requireRole(['GENERAL_MANAGER', 'WAREHOUSE_MANAGER']), InventoryController.transferStock);

export default router;
