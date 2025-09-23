import { Router } from 'express';
import { SupplierController } from '@/controllers/supplierController';
import { authenticateToken, requireRole } from '@/middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get all suppliers
router.get('/', SupplierController.getSuppliers);

// Get supplier by ID
router.get('/:id', SupplierController.getSupplierById);

// Get supplier products
router.get('/:id/products', SupplierController.getSupplierProducts);

// Get supplier performance
router.get('/:id/performance', SupplierController.getSupplierPerformance);

// Create new supplier
router.post('/', requireRole(['GENERAL_MANAGER', 'PURCHASING_MANAGER']), SupplierController.createSupplier);

// Update supplier
router.put('/:id', requireRole(['GENERAL_MANAGER', 'PURCHASING_MANAGER']), SupplierController.updateSupplier);

// Delete supplier
router.delete('/:id', requireRole(['GENERAL_MANAGER']), SupplierController.deleteSupplier);

export default router;
