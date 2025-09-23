import { Router } from 'express';
import { TransactionController } from '@/controllers/transactionController';
import { authenticateToken, requireWarehouseAccess } from '@/middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get all transactions
router.get('/', TransactionController.getTransactions);

// Get transaction statistics
router.get('/stats', TransactionController.getTransactionStats);

// Get transaction by ID
router.get('/:id', TransactionController.getTransactionById);

// Update transaction
router.put('/:id', TransactionController.updateTransaction);

// Cancel transaction
router.put('/:id/cancel', TransactionController.cancelTransaction);

// Bulk create transactions
router.post('/bulk', TransactionController.bulkCreateTransactions);

export default router;
