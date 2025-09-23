import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiResponse } from '@/types/common';

// Product creation validation
export const validateCreateProduct = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    name: Joi.string().required().min(2).max(200),
    nameEn: Joi.string().required().min(2).max(200),
    sku: Joi.string().required().min(2).max(50).uppercase(),
    barcode: Joi.string().min(8).max(20).optional(),
    category: Joi.string().required().min(2).max(100),
    subcategory: Joi.string().required().min(2).max(100),
    brand: Joi.string().required().min(2).max(100),
    model: Joi.string().min(1).max(100).optional(),
    description: Joi.string().required().min(10).max(1000),
    unit: Joi.string().required().min(1).max(20),
    weight: Joi.number().positive().optional(),
    length: Joi.number().positive().optional(),
    width: Joi.number().positive().optional(),
    height: Joi.number().positive().optional(),
    status: Joi.string().valid('ACTIVE', 'INACTIVE', 'DISCONTINUED').default('ACTIVE'),
    tags: Joi.array().items(Joi.string().min(1).max(50)).optional().default([]),
    images: Joi.array().items(Joi.string().uri()).optional().default([]),
    warranty: Joi.number().integer().min(0).max(120).optional(),
    expiryDate: Joi.date().greater('now').optional(),
    batchNumber: Joi.string().min(1).max(50).optional(),
    warehouseId: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      error: error.details[0].message,
    } as ApiResponse);
    return;
  }

  next();
};

// Product update validation
export const validateUpdateProduct = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(200).optional(),
    nameEn: Joi.string().min(2).max(200).optional(),
    sku: Joi.string().min(2).max(50).uppercase().optional(),
    barcode: Joi.string().min(8).max(20).optional(),
    category: Joi.string().min(2).max(100).optional(),
    subcategory: Joi.string().min(2).max(100).optional(),
    brand: Joi.string().min(2).max(100).optional(),
    model: Joi.string().min(1).max(100).optional(),
    description: Joi.string().min(10).max(1000).optional(),
    unit: Joi.string().min(1).max(20).optional(),
    weight: Joi.number().positive().optional(),
    length: Joi.number().positive().optional(),
    width: Joi.number().positive().optional(),
    height: Joi.number().positive().optional(),
    status: Joi.string().valid('ACTIVE', 'INACTIVE', 'DISCONTINUED').optional(),
    tags: Joi.array().items(Joi.string().min(1).max(50)).optional(),
    images: Joi.array().items(Joi.string().uri()).optional(),
    warranty: Joi.number().integer().min(0).max(120).optional(),
    expiryDate: Joi.date().optional(),
    batchNumber: Joi.string().min(1).max(50).optional(),
    warehouseId: Joi.string().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      error: error.details[0].message,
    } as ApiResponse);
    return;
  }

  next();
};
