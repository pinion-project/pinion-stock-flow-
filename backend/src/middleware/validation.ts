import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiResponse } from '@/types/common';
import logger from '@/utils/logger';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      logger.warn('Validation error:', { errors: errorDetails, body: req.body });

      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorDetails,
      } as ApiResponse);
      return;
    }

    next();
  };
};

export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.query, { abortEarly: false });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      logger.warn('Query validation error:', { errors: errorDetails, query: req.query });

      res.status(400).json({
        success: false,
        message: 'Query validation failed',
        errors: errorDetails,
      } as ApiResponse);
      return;
    }

    next();
  };
};

// Express-validator based validation middleware
export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  // This is a placeholder - express-validator validation is handled in routes
  next();
};
