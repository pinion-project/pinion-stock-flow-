import Joi from 'joi';

export const recordTransactionSchema = Joi.object({
  type: Joi.string().valid('PURCHASE', 'SALE', 'TRANSFER', 'ADJUSTMENT', 'RETURN').required(),
  productId: Joi.string().required(),
  warehouseId: Joi.string().required(),
  quantity: Joi.number().required().min(0.01),
  unitPrice: Joi.number().required().min(0),
  totalAmount: Joi.number().required().min(0),
  referenceNumber: Joi.string().optional().min(1).max(50),
  invoiceNumber: Joi.string().optional().min(1).max(50),
  notes: Joi.string().optional().min(1).max(500),
  fromWarehouseId: Joi.string().optional(),
  toWarehouseId: Joi.string().optional(),
  supplierId: Joi.string().optional(),
  customerId: Joi.string().optional(),
  taxAmount: Joi.number().optional().min(0),
  discountAmount: Joi.number().optional().min(0),
});

export const adjustInventorySchema = Joi.object({
  productId: Joi.string().required(),
  warehouseId: Joi.string().required(),
  newQuantity: Joi.number().required().min(0),
  reason: Joi.string().required().min(5).max(100),
  notes: Joi.string().optional().min(1).max(500),
});

export const transferStockSchema = Joi.object({
  productId: Joi.string().required(),
  fromWarehouseId: Joi.string().required(),
  toWarehouseId: Joi.string().required(),
  quantity: Joi.number().required().min(0.01),
  unitPrice: Joi.number().required().min(0),
  notes: Joi.string().optional().min(1).max(500),
});
