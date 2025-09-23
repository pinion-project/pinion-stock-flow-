import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiResponse } from '@/types/common';

// Warehouse creation validation
export const validateCreateWarehouse = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    name: Joi.string().required().min(2).max(100),
    nameEn: Joi.string().required().min(2).max(100),
    code: Joi.string().required().min(2).max(20).uppercase(),
    type: Joi.string().valid('DISTRIBUTION', 'MANUFACTURING', 'RETAIL', 'COLD_STORAGE', 'HAZMAT', 'GENERAL').required(),
    address: Joi.string().required().min(5).max(200),
    city: Joi.string().required().min(2).max(50),
    governorate: Joi.string().required().min(2).max(50),
    latitude: Joi.number().min(-90).max(90).optional(),
    longitude: Joi.number().min(-180).max(180).optional(),
    maxVolume: Joi.number().positive().required(),
    maxWeight: Joi.number().positive().required(),
    managerId: Joi.string().optional(),
    managerName: Joi.string().min(2).max(100).optional(),
    managerEmail: Joi.string().email().optional(),
    managerPhone: Joi.string().min(10).max(20).optional(),
    phone: Joi.string().required().min(10).max(20),
    fax: Joi.string().min(10).max(20).optional(),
    email: Joi.string().email().required(),
    website: Joi.string().uri().optional(),
    emergencyContact: Joi.string().required().min(10).max(20),
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

// Warehouse update validation
export const validateUpdateWarehouse = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    nameEn: Joi.string().min(2).max(100).optional(),
    code: Joi.string().min(2).max(20).uppercase().optional(),
    type: Joi.string().valid('DISTRIBUTION', 'MANUFACTURING', 'RETAIL', 'COLD_STORAGE', 'HAZMAT', 'GENERAL').optional(),
    status: Joi.string().valid('ACTIVE', 'INACTIVE', 'MAINTENANCE', 'EXPANSION').optional(),
    address: Joi.string().min(5).max(200).optional(),
    city: Joi.string().min(2).max(50).optional(),
    governorate: Joi.string().min(2).max(50).optional(),
    latitude: Joi.number().min(-90).max(90).optional(),
    longitude: Joi.number().min(-180).max(180).optional(),
    maxVolume: Joi.number().positive().optional(),
    maxWeight: Joi.number().positive().optional(),
    managerId: Joi.string().optional(),
    managerName: Joi.string().min(2).max(100).optional(),
    managerEmail: Joi.string().email().optional(),
    managerPhone: Joi.string().min(10).max(20).optional(),
    phone: Joi.string().min(10).max(20).optional(),
    fax: Joi.string().min(10).max(20).optional(),
    email: Joi.string().email().optional(),
    website: Joi.string().uri().optional(),
    emergencyContact: Joi.string().min(10).max(20).optional(),
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
