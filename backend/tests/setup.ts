import { config } from 'dotenv';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const jest: any;

// Load environment variables for testing
config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/pinion_stock_flow_test';

// Mock internal file upload service to avoid importing aws-sdk/uuid in tests
jest.mock('@/services/fileUploadService', () => ({
  __esModule: true,
  default: {
    single: () => (_req: any, _res: any, next: any) => next(),
    multiple: () => (_req: any, _res: any, next: any) => next(),
    fields: () => (_req: any, _res: any, next: any) => next(),
    deleteFile: jest.fn(async () => true),
    getSignedUrl: jest.fn(async () => 'https://example.com/test-url'),
  },
}));

// Mock AWS SDK and multer-s3 to avoid external deps in tests
jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: class {},
  DeleteObjectCommand: class {},
  GetObjectCommand: class {},
}));

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn(async () => 'https://example.com/test-url'),
}));

jest.mock('multer-s3', () => {
  return () => ({
    _isMock: true,
  });
});

// Global test timeout
jest.setTimeout(10000);
