import { Router } from 'express';
import { ProductController } from '@/controllers/productController';
import { authenticateToken, requireRole } from '@/middleware/auth';
import { validateCreateProduct, validateUpdateProduct } from '@/validators/productValidator';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get all products
router.get('/', ProductController.getProducts);

// Search products
router.get('/search', ProductController.searchProducts);

// Get product categories
router.get('/categories', ProductController.getProductCategories);

// Get product by ID
router.get('/:id', ProductController.getProductById);

// Get product transaction history
router.get('/:id/history', ProductController.getProductHistory);

// Create new product
router.post('/', requireRole(['GENERAL_MANAGER', 'WAREHOUSE_MANAGER']), validateCreateProduct, ProductController.createProduct);

// Update product
router.put('/:id', requireRole(['GENERAL_MANAGER', 'WAREHOUSE_MANAGER']), validateUpdateProduct, ProductController.updateProduct);

// Delete product
router.delete('/:id', requireRole(['GENERAL_MANAGER']), ProductController.deleteProduct);

export default router;
