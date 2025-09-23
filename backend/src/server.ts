import { createServer } from 'http';
import app from './app';
import { config } from '@/config';
import logger from '@/utils/logger';
import prisma from '@/config/database';
import notificationService from '@/services/notificationService';
import websocketService from '@/services/websocketService';

const PORT = config.port;

// Create HTTP server
const server = createServer(app);

// Initialize notification service with Socket.io
notificationService.initialize(server);

// Initialize WebSocket service
const io = notificationService['io'];
if (io) {
  websocketService.initialize(io);
} else {
  logger.warn('Socket.io not initialized, WebSocket service not started');
}

// Graceful shutdown
const gracefulShutdown = async () => {
  logger.info('Received shutdown signal, closing server gracefully...');
  
  try {
    await prisma.$disconnect();
    logger.info('Database connection closed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
};

// Handle shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info('Database connected successfully');

    // Start HTTP server with Socket.io
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${config.nodeEnv} mode`);
      logger.info(`Health check available at http://localhost:${PORT}/health`);
      logger.info(`WebSocket server initialized for real-time notifications`);
      logger.info(`WebSocket service initialized for real-time communication`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
