import { Router } from 'express';
import { body, param, query } from 'express-validator';
import fileController from '@/controllers/fileController';
import fileUploadService from '@/services/fileUploadService';
import { authenticateToken } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validation';

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Upload single file
router.post(
  '/upload',
  fileUploadService.single('file'),
  fileController.uploadSingle
);

// Upload multiple files
router.post(
  '/bulk-upload',
  fileUploadService.multiple('files', 10),
  fileController.uploadMultiple
);

// Get file by ID
router.get(
  '/:id',
  [
    param('id').isString().notEmpty().withMessage('File ID is required'),
  ],
  validateRequest,
  fileController.getFile
);

// Download file
router.get(
  '/:id/download',
  [
    param('id').isString().notEmpty().withMessage('File ID is required'),
  ],
  validateRequest,
  fileController.downloadFile
);

// Get file URL (for private access)
router.get(
  '/:id/url',
  [
    param('id').isString().notEmpty().withMessage('File ID is required'),
    query('expires').optional().isInt({ min: 60, max: 86400 }).withMessage('Expires must be between 60 and 86400 seconds'),
  ],
  validateRequest,
  fileController.getFileUrl
);

// Delete file
router.delete(
  '/:id',
  [
    param('id').isString().notEmpty().withMessage('File ID is required'),
  ],
  validateRequest,
  fileController.deleteFile
);

// Get user files with pagination
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  ],
  validateRequest,
  fileController.getUserFiles
);

// Process image (resize, optimize)
router.post(
  '/:id/process',
  [
    param('id').isString().notEmpty().withMessage('File ID is required'),
    body('width').optional().isInt({ min: 1, max: 4000 }).withMessage('Width must be between 1 and 4000'),
    body('height').optional().isInt({ min: 1, max: 4000 }).withMessage('Height must be between 1 and 4000'),
    body('quality').optional().isInt({ min: 1, max: 100 }).withMessage('Quality must be between 1 and 100'),
    body('format').optional().isIn(['jpeg', 'png', 'webp']).withMessage('Format must be jpeg, png, or webp'),
  ],
  validateRequest,
  fileController.processImage
);

// Generate thumbnail
router.post(
  '/:id/thumbnail',
  [
    param('id').isString().notEmpty().withMessage('File ID is required'),
    body('size').optional().isInt({ min: 50, max: 1000 }).withMessage('Size must be between 50 and 1000'),
  ],
  validateRequest,
  fileController.generateThumbnail
);

export default router;
