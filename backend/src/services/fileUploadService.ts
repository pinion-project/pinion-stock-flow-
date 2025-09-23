import { S3Client, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import multer from 'multer';
import multerS3 from 'multer-s3';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import prisma from '@/config/database';
import logger from '@/utils/logger';

// Configure AWS S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

// File upload configuration
const uploadConfig = {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req: any, file: Express.Multer.File, cb: any) => {
    // Allowed file types
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'application/zip',
      'application/x-rar-compressed',
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'), false);
    }
  },
};

// S3 upload configuration
const s3Upload = multerS3({
  s3: s3Client,
  bucket: process.env.AWS_S3_BUCKET || 'pinion-stock-flow-files',
  acl: 'private',
  key: (req: any, file: Express.Multer.File, cb: any) => {
    const fileId = uuidv4();
    const fileExtension = path.extname(file.originalname);
    const fileName = `${fileId}${fileExtension}`;
    const folder = getFileFolder(file.mimetype);
    cb(null, `${folder}/${fileName}`);
  },
  metadata: (req: any, file: Express.Multer.File, cb: any) => {
    cb(null, {
      fieldName: file.fieldname,
      originalName: file.originalname,
      uploadedBy: req.user?.id || 'anonymous',
    });
  },
});

// Local storage configuration (for development)
const localStorage = multer.diskStorage({
  destination: (req: any, file: Express.Multer.File, cb: any) => {
    const folder = getFileFolder(file.mimetype);
    const uploadPath = path.join(process.cwd(), 'uploads', folder);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req: any, file: Express.Multer.File, cb: any) => {
    const fileId = uuidv4();
    const fileExtension = path.extname(file.originalname);
    const fileName = `${fileId}${fileExtension}`;
    cb(null, fileName);
  },
});

// Get file folder based on MIME type
function getFileFolder(mimetype: string): string {
  if (mimetype.startsWith('image/')) {
    return 'images';
  } else if (mimetype === 'application/pdf') {
    return 'documents';
  } else if (mimetype.includes('word') || mimetype.includes('excel') || mimetype.includes('spreadsheet')) {
    return 'documents';
  } else if (mimetype === 'text/csv') {
    return 'data';
  } else if (mimetype.includes('zip') || mimetype.includes('rar')) {
    return 'archives';
  } else {
    return 'misc';
  }
}

// Create multer instance based on environment
const upload = multer({
  storage: process.env.NODE_ENV === 'production' ? s3Upload : localStorage,
  ...uploadConfig,
});

class FileUploadService {
  // Single file upload
  public single(fieldName: string) {
    return upload.single(fieldName);
  }

  // Multiple files upload
  public multiple(fieldName: string, maxCount: number = 10) {
    return upload.array(fieldName, maxCount);
  }

  // Fields upload (multiple fields with different names)
  public fields(fields: Array<{ name: string; maxCount: number }>) {
    return upload.fields(fields);
  }

  // Process and save file information to database
  public async saveFileInfo(file: Express.Multer.File, userId: string, metadata?: any) {
    try {
      const fileRecord = await prisma.file.create({
        data: {
          filename: (file as any).filename || (file as any).key || file.filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          path: (file as any).path || (file as any).location || file.path,
          uploadedBy: userId,
        },
      });

      logger.info(`File saved to database: ${fileRecord.id}`);
      return fileRecord;
    } catch (error) {
      logger.error('Error saving file info to database:', error);
      throw error;
    }
  }

  // Process image with Sharp (resize, optimize)
  public async processImage(inputPath: string, outputPath: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
  } = {}) {
    try {
      const {
        width = 800,
        height = 600,
        quality = 80,
        format = 'jpeg'
      } = options;

      await sharp(inputPath)
        .resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality })
        .toFile(outputPath);

      logger.info(`Image processed: ${outputPath}`);
      return outputPath;
    } catch (error) {
      logger.error('Error processing image:', error);
      throw error;
    }
  }

  // Generate thumbnail for images
  public async generateThumbnail(inputPath: string, outputPath: string, size: number = 200) {
    try {
      await sharp(inputPath)
        .resize(size, size, {
          fit: 'cover',
          position: 'center',
        })
        .jpeg({ quality: 70 })
        .toFile(outputPath);

      logger.info(`Thumbnail generated: ${outputPath}`);
      return outputPath;
    } catch (error) {
      logger.error('Error generating thumbnail:', error);
      throw error;
    }
  }

  // Get file from S3 or local storage
  public async getFile(fileId: string) {
    try {
      const file = await prisma.file.findUnique({
        where: { id: fileId },
      });

      if (!file) {
        throw new Error('File not found');
      }

      return file;
    } catch (error) {
      logger.error('Error getting file:', error);
      throw error;
    }
  }

  // Delete file from storage and database
  public async deleteFile(fileId: string) {
    try {
      const file = await prisma.file.findUnique({
        where: { id: fileId },
      });

      if (!file) {
        throw new Error('File not found');
      }

      // Delete from S3 if in production
      if (process.env.NODE_ENV === 'production') {
        const key = file.path.replace(`https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/`, '');
        await s3Client.send(new DeleteObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET!,
          Key: key,
        }));
      } else {
        // Delete from local storage
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      }

      // Delete from database
      await prisma.file.delete({
        where: { id: fileId },
      });

      logger.info(`File deleted: ${fileId}`);
    } catch (error) {
      logger.error('Error deleting file:', error);
      throw error;
    }
  }

  // Get signed URL for private file access
  public async getSignedUrl(fileId: string, expiresIn: number = 3600) {
    try {
      const file = await this.getFile(fileId);

      if (process.env.NODE_ENV === 'production') {
        const key = file.path.replace(`https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/`, '');
        const signedUrl = await getSignedUrl(s3Client, new GetObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET!,
          Key: key,
        }), { expiresIn });

        return signedUrl;
      } else {
        // Return local file path for development
        return file.path;
      }
    } catch (error) {
      logger.error('Error generating signed URL:', error);
      throw error;
    }
  }

  // Get user files with pagination
  public async getUserFiles(userId: string, page: number = 1, limit: number = 20) {
    try {
      const skip = (page - 1) * limit;

      const [files, total] = await Promise.all([
        prisma.file.findMany({
          where: { uploadedBy: userId },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.file.count({ where: { uploadedBy: userId } }),
      ]);

      return {
        files,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      };
    } catch (error) {
      logger.error('Error getting user files:', error);
      throw error;
    }
  }

  // Bulk upload files
  public async bulkUpload(files: Express.Multer.File[], userId: string) {
    try {
      const fileRecords = await Promise.all(
        files.map(file => this.saveFileInfo(file, userId))
      );

      logger.info(`Bulk upload completed: ${fileRecords.length} files`);
      return fileRecords;
    } catch (error) {
      logger.error('Error in bulk upload:', error);
      throw error;
    }
  }

  // Validate file size and type
  public validateFile(file: Express.Multer.File, maxSize: number = 10 * 1024 * 1024) {
    const errors: string[] = [];

    if (file.size > maxSize) {
      errors.push(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      errors.push('File type not allowed');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export default new FileUploadService();
