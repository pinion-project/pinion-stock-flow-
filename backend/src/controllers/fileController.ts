import { Request, Response } from 'express';
import fileUploadService from '@/services/fileUploadService';
import logger from '@/utils/logger';
import { validationResult } from 'express-validator';
import path from 'path';

export class FileController {
  // Upload single file
  public async uploadSingle(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'No file uploaded',
        });
        return;
      }

      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      // Validate file
      const validation = fileUploadService.validateFile(req.file);
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          message: 'File validation failed',
          errors: validation.errors,
        });
        return;
      }

      // Save file info to database
      const fileRecord = await fileUploadService.saveFileInfo(req.file, userId);

      res.status(201).json({
        success: true,
        data: fileRecord,
        message: 'File uploaded successfully',
      });
    } catch (error) {
      logger.error('Error uploading file:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload file',
      });
    }
  }

  // Upload multiple files
  public async uploadMultiple(req: Request, res: Response): Promise<void> {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        res.status(400).json({
          success: false,
          message: 'No files uploaded',
        });
        return;
      }

      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      // Validate all files
      const validationErrors: string[] = [];
      req.files.forEach((file, index) => {
        const validation = fileUploadService.validateFile(file);
        if (!validation.isValid) {
          validationErrors.push(`File ${index + 1}: ${validation.errors.join(', ')}`);
        }
      });

      if (validationErrors.length > 0) {
        res.status(400).json({
          success: false,
          message: 'File validation failed',
          errors: validationErrors,
        });
        return;
      }

      // Save files info to database
      const fileRecords = await fileUploadService.bulkUpload(req.files, userId);

      res.status(201).json({
        success: true,
        data: fileRecords,
        message: `${fileRecords.length} files uploaded successfully`,
      });
    } catch (error) {
      logger.error('Error uploading files:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload files',
      });
    }
  }

  // Get file by ID
  public async getFile(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const file = await fileUploadService.getFile(id);

      res.status(200).json({
        success: true,
        data: file,
      });
    } catch (error) {
      logger.error('Error getting file:', error);
      res.status(404).json({
        success: false,
        message: 'File not found',
      });
    }
  }

  // Download file
  public async downloadFile(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const file = await fileUploadService.getFile(id);
      const fileUrl = await fileUploadService.getSignedUrl(id);

      if (process.env.NODE_ENV === 'production') {
        // Redirect to signed URL for S3 files
        res.redirect(fileUrl);
      } else {
        // Serve local file
        res.download(file.path, file.originalName);
      }
    } catch (error) {
      logger.error('Error downloading file:', error);
      res.status(404).json({
        success: false,
        message: 'File not found',
      });
    }
  }

  // Delete file
  public async deleteFile(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await fileUploadService.deleteFile(id);

      res.status(200).json({
        success: true,
        message: 'File deleted successfully',
      });
    } catch (error) {
      logger.error('Error deleting file:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete file',
      });
    }
  }

  // Get user files
  public async getUserFiles(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      const result = await fileUploadService.getUserFiles(userId, page, limit);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error getting user files:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user files',
      });
    }
  }

  // Get file URL (for private access)
  public async getFileUrl(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const expiresIn = parseInt(req.query.expires as string) || 3600;

      const file = await fileUploadService.getFile(id);
      const fileUrl = await fileUploadService.getSignedUrl(id, expiresIn);

      res.status(200).json({
        success: true,
        data: {
          url: fileUrl,
          filename: file.originalName,
          mimeType: file.mimeType,
          size: file.size,
          expiresIn,
        },
      });
    } catch (error) {
      logger.error('Error getting file URL:', error);
      res.status(404).json({
        success: false,
        message: 'File not found',
      });
    }
  }

  // Process image (resize, optimize)
  public async processImage(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { width, height, quality, format } = req.body;

      const file = await fileUploadService.getFile(id);

      if (!file.mimeType.startsWith('image/')) {
        res.status(400).json({
          success: false,
          message: 'File is not an image',
        });
        return;
      }

      const outputPath = file.path.replace(/\.[^/.]+$/, `_processed.${format || 'jpeg'}`);
      const processedPath = await fileUploadService.processImage(file.path, outputPath, {
        width: width ? parseInt(width) : undefined,
        height: height ? parseInt(height) : undefined,
        quality: quality ? parseInt(quality) : undefined,
        format: format || 'jpeg',
      });

      // Save processed file info
      const processedFile = await fileUploadService.saveFileInfo({
        fieldname: 'file',
        originalname: file.originalName.replace(/\.[^/.]+$/, `_processed.${format || 'jpeg'}`),
        encoding: '7bit',
        mimetype: `image/${format || 'jpeg'}`,
        size: 0, // Will be updated
        filename: path.basename(processedPath),
        path: processedPath,
        stream: null as any,
        destination: path.dirname(processedPath),
        buffer: null as any,
      } as Express.Multer.File, req.user?.id || 'system');

      res.status(200).json({
        success: true,
        data: processedFile,
        message: 'Image processed successfully',
      });
    } catch (error) {
      logger.error('Error processing image:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process image',
      });
    }
  }

  // Generate thumbnail
  public async generateThumbnail(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { size } = req.body;

      const file = await fileUploadService.getFile(id);

      if (!file.mimeType.startsWith('image/')) {
        res.status(400).json({
          success: false,
          message: 'File is not an image',
        });
        return;
      }

      const thumbnailPath = file.path.replace(/\.[^/.]+$/, '_thumb.jpeg');
      const processedPath = await fileUploadService.generateThumbnail(
        file.path,
        thumbnailPath,
        size ? parseInt(size) : 200
      );

      // Save thumbnail file info
      const thumbnailFile = await fileUploadService.saveFileInfo({
        fieldname: 'file',
        originalname: file.originalName.replace(/\.[^/.]+$/, '_thumb.jpeg'),
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 0, // Will be updated
        filename: path.basename(processedPath),
        path: processedPath,
        stream: null as any,
        destination: path.dirname(processedPath),
        buffer: null as any,
      } as Express.Multer.File, req.user?.id || 'system');

      res.status(200).json({
        success: true,
        data: thumbnailFile,
        message: 'Thumbnail generated successfully',
      });
    } catch (error) {
      logger.error('Error generating thumbnail:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate thumbnail',
      });
    }
  }
}

export default new FileController();
