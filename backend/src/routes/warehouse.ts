import { Router } from 'express';
import { WarehouseController } from '@/controllers/warehouseController';
import { authenticateToken, requireRole, requireWarehouseAccess } from '@/middleware/auth';
import { validateCreateWarehouse, validateUpdateWarehouse } from '@/validators/warehouseValidator';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get all warehouses (filtered by permissions)
router.get('/', WarehouseController.getWarehouses);

// Get warehouse by ID
router.get('/:id', requireWarehouseAccess, WarehouseController.getWarehouseById);

// Create new warehouse (admin only)
router.post('/', requireRole(['GENERAL_MANAGER']), validateCreateWarehouse, WarehouseController.createWarehouse);

// Update warehouse
router.put('/:id', requireWarehouseAccess, validateUpdateWarehouse, WarehouseController.updateWarehouse);

// Delete warehouse (admin only)
router.delete('/:id', requireRole(['GENERAL_MANAGER']), WarehouseController.deleteWarehouse);

// Get warehouse capacity metrics
router.get('/:id/capacity', requireWarehouseAccess, WarehouseController.getWarehouseCapacity);

// Get warehouse performance metrics
router.get('/:id/performance', requireWarehouseAccess, WarehouseController.getWarehousePerformance);

export default router;
