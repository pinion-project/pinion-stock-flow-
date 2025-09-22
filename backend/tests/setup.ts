import { config } from 'dotenv';

// Load environment variables for testing
config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/pinion_stock_flow_test';

// Global test timeout
jest.setTimeout(10000);
