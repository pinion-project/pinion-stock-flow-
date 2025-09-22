import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@/services/authService';
import { JWTPayload } from '@/types/auth';
import logger from '@/utils/logger';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access token required',
      });
      return;
    }

    const payload = AuthService.verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    logger.error('Token verification error:', error);
    res.status(403).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
      return;
    }

    next();
  };
};

export const requireWarehouseAccess = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
    return;
  }

  // General manager and purchasing manager can access all warehouses
  if (req.user.role === 'GENERAL_MANAGER' || req.user.role === 'PURCHASING_MANAGER') {
    next();
    return;
  }

  // Warehouse manager can only access their assigned warehouse
  if (req.user.role === 'WAREHOUSE_MANAGER') {
    const warehouseId = req.params.warehouseId || req.body.warehouseId;
    if (warehouseId && req.user.warehouseId !== warehouseId) {
      res.status(403).json({
        success: false,
        message: 'Access denied to this warehouse',
      });
      return;
    }
  }

  next();
};
