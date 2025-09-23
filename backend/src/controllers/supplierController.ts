import { Request, Response } from 'express';
import supplierService from '@/services/supplierService';
import logger from '@/utils/logger';
import { validationResult } from 'express-validator';

export class SupplierController {
  // Create supplier
  public async createSupplier(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
        return;
      }

      const {
        name,
        nameEn,
        code,
        email,
        phone,
        address,
        city,
        governorate,
        country,
        taxNumber,
        website,
        contactPerson,
        notes
      } = req.body;

      const supplier = await supplierService.createSupplier({
        name,
        nameEn,
        code,
        email,
        phone,
        address,
        city,
        governorate,
        country,
        taxNumber,
        website,
        contactPerson,
        notes
      });

      res.status(201).json({
        success: true,
        data: supplier,
        message: 'Supplier created successfully',
      });
    } catch (error) {
      logger.error('Error creating supplier:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create supplier',
      });
    }
  }

  // Get suppliers
  public async getSuppliers(req: Request, res: Response): Promise<void> {
    try {
      const {
        search,
        city,
        governorate,
        isActive,
        page,
        limit
      } = req.query;

      const filters = {
        search: search as string,
        city: city as string,
        governorate: governorate as string,
        isActive: isActive ? isActive === 'true' : undefined,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined
      };

      const result = await supplierService.getSuppliers(filters);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error getting suppliers:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get suppliers',
      });
    }
  }

  // Get supplier by ID
  public async getSupplierById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const supplier = await supplierService.getSupplierById(id);

      res.status(200).json({
        success: true,
        data: supplier,
      });
    } catch (error) {
      logger.error('Error getting supplier:', error);
      res.status(404).json({
        success: false,
        message: 'Supplier not found',
      });
    }
  }

  // Update supplier
  public async updateSupplier(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
        return;
      }

      const { id } = req.params;
      const {
        name,
        nameEn,
        code,
        email,
        phone,
        address,
        city,
        governorate,
        country,
        taxNumber,
        website,
        contactPerson,
        notes,
        isActive
      } = req.body;

      const supplier = await supplierService.updateSupplier(id, {
        name,
        nameEn,
        code,
        email,
        phone,
        address,
        city,
        governorate,
        country,
        taxNumber,
        website,
        contactPerson,
        notes,
        isActive
      });

      res.status(200).json({
        success: true,
        data: supplier,
        message: 'Supplier updated successfully',
      });
    } catch (error) {
      logger.error('Error updating supplier:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update supplier',
      });
    }
  }

  // Delete supplier
  public async deleteSupplier(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await supplierService.deleteSupplier(id);

      res.status(200).json({
        success: true,
        message: 'Supplier deleted successfully',
      });
    } catch (error) {
      logger.error('Error deleting supplier:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete supplier',
      });
    }
  }

  // Get supplier performance
  public async getSupplierPerformance(req: Request, res: Response): Promise<void> {
    try {
      const { supplierId } = req.query;

      const performance = await supplierService.getSupplierPerformance(
        supplierId as string
      );

      res.status(200).json({
        success: true,
        data: performance,
      });
    } catch (error) {
      logger.error('Error getting supplier performance:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get supplier performance',
      });
    }
  }

  // Get supplier products
  public async getSupplierProducts(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { page, limit } = req.query;

      const result = await supplierService.getSupplierProducts(
        id,
        page ? parseInt(page as string) : 1,
        limit ? parseInt(limit as string) : 20
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error getting supplier products:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get supplier products',
      });
    }
  }

  // Send message to supplier
  public async sendMessageToSupplier(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
        return;
      }

      const { id } = req.params;
      const { subject, message } = req.body;
      const sentBy = req.user?.id;

      if (!sentBy) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      await supplierService.sendMessageToSupplier(id, subject, message, sentBy);

      res.status(200).json({
        success: true,
        message: 'Message sent to supplier successfully',
      });
    } catch (error) {
      logger.error('Error sending message to supplier:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send message to supplier',
      });
    }
  }

  // Get supplier statistics
  public async getSupplierStatistics(req: Request, res: Response): Promise<void> {
    try {
      const statistics = await supplierService.getSupplierStatistics();

      res.status(200).json({
        success: true,
        data: statistics,
      });
    } catch (error) {
      logger.error('Error getting supplier statistics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get supplier statistics',
      });
    }
  }

  // Search suppliers
  public async searchSuppliers(req: Request, res: Response): Promise<void> {
    try {
      const { q, limit } = req.query;

      if (!q) {
        res.status(400).json({
          success: false,
          message: 'Search query is required',
        });
        return;
      }

      const suppliers = await supplierService.searchSuppliers(
        q as string,
        limit ? parseInt(limit as string) : 10
      );

      res.status(200).json({
        success: true,
        data: suppliers,
      });
    } catch (error) {
      logger.error('Error searching suppliers:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to search suppliers',
      });
    }
  }

  // Get supplier contact information
  public async getSupplierContactInfo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const contactInfo = await supplierService.getSupplierContactInfo(id);

      res.status(200).json({
        success: true,
        data: contactInfo,
      });
    } catch (error) {
      logger.error('Error getting supplier contact info:', error);
      res.status(404).json({
        success: false,
        message: 'Supplier not found',
      });
    }
  }
}

export default new SupplierController();
