import { Router } from 'express';
import { body, param, query } from 'express-validator';
import supplierController from '@/controllers/supplierController';
import { authenticateToken } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validation';

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Create supplier
router.post(
  '/',
  [
    body('name').isString().notEmpty().withMessage('Name is required'),
    body('nameEn').optional().isString().withMessage('English name must be a string'),
    body('code').isString().notEmpty().withMessage('Code is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').isString().notEmpty().withMessage('Phone is required'),
    body('address').isString().notEmpty().withMessage('Address is required'),
    body('city').isString().notEmpty().withMessage('City is required'),
    body('governorate').isString().notEmpty().withMessage('Governorate is required'),
    body('country').optional().isString().withMessage('Country must be a string'),
    body('taxNumber').optional().isString().withMessage('Tax number must be a string'),
    body('website').optional().isURL().withMessage('Website must be a valid URL'),
    body('contactPerson').isString().notEmpty().withMessage('Contact person is required'),
    body('notes').optional().isString().withMessage('Notes must be a string'),
  ],
  validateRequest,
  supplierController.createSupplier
);

// Get suppliers
router.get(
  '/',
  [
    query('search').optional().isString().withMessage('Search query must be a string'),
    query('city').optional().isString().withMessage('City must be a string'),
    query('governorate').optional().isString().withMessage('Governorate must be a string'),
    query('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  ],
  validateRequest,
  supplierController.getSuppliers
);

// Get supplier by ID
router.get(
  '/:id',
  [
    param('id').isString().notEmpty().withMessage('Supplier ID is required'),
  ],
  validateRequest,
  supplierController.getSupplierById
);

// Update supplier
router.put(
  '/:id',
  [
    param('id').isString().notEmpty().withMessage('Supplier ID is required'),
    body('name').optional().isString().notEmpty().withMessage('Name must be a non-empty string'),
    body('nameEn').optional().isString().withMessage('English name must be a string'),
    body('code').optional().isString().notEmpty().withMessage('Code must be a non-empty string'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('phone').optional().isString().notEmpty().withMessage('Phone must be a non-empty string'),
    body('address').optional().isString().notEmpty().withMessage('Address must be a non-empty string'),
    body('city').optional().isString().notEmpty().withMessage('City must be a non-empty string'),
    body('governorate').optional().isString().notEmpty().withMessage('Governorate must be a non-empty string'),
    body('country').optional().isString().withMessage('Country must be a string'),
    body('taxNumber').optional().isString().withMessage('Tax number must be a string'),
    body('website').optional().isURL().withMessage('Website must be a valid URL'),
    body('contactPerson').optional().isString().notEmpty().withMessage('Contact person must be a non-empty string'),
    body('notes').optional().isString().withMessage('Notes must be a string'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  ],
  validateRequest,
  supplierController.updateSupplier
);

// Delete supplier
router.delete(
  '/:id',
  [
    param('id').isString().notEmpty().withMessage('Supplier ID is required'),
  ],
  validateRequest,
  supplierController.deleteSupplier
);

// Get supplier performance
router.get(
  '/:id/performance',
  [
    param('id').isString().notEmpty().withMessage('Supplier ID is required'),
  ],
  validateRequest,
  supplierController.getSupplierPerformance
);

// Get supplier products
router.get(
  '/:id/products',
  [
    param('id').isString().notEmpty().withMessage('Supplier ID is required'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  ],
  validateRequest,
  supplierController.getSupplierProducts
);

// Send message to supplier
router.post(
  '/:id/contact',
  [
    param('id').isString().notEmpty().withMessage('Supplier ID is required'),
    body('subject').isString().notEmpty().withMessage('Subject is required'),
    body('message').isString().notEmpty().withMessage('Message is required'),
  ],
  validateRequest,
  supplierController.sendMessageToSupplier
);

// Get supplier statistics
router.get(
  '/stats/overview',
  supplierController.getSupplierStatistics
);

// Search suppliers
router.get(
  '/search',
  [
    query('q').isString().notEmpty().withMessage('Search query is required'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  ],
  validateRequest,
  supplierController.searchSuppliers
);

// Get supplier contact information
router.get(
  '/:id/contact-info',
  [
    param('id').isString().notEmpty().withMessage('Supplier ID is required'),
  ],
  validateRequest,
  supplierController.getSupplierContactInfo
);

export default router;
