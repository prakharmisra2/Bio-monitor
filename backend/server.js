require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const { testConnection } = require('./src/config/database');
const { initializeSocket } = require('./src/config/socket');
const alertService = require('./src/services/alertService');
const dataRetentionService = require('./src/services/dataRetentionService');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);

// ============================================
// START SERVER
// ============================================

const startServer = async () => {
  try {
    // Test database connection
    logger.info('Testing database connection...');
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      logger.error('Failed to connect to database');
      process.exit(1);
    }

    logger.info('Database connected successfully');

    // Start services
    logger.info('Starting background services...');
    
    // Start alert monitoring service
    alertService.start();
    
    // Start data retention service
    dataRetentionService.start();

    // Start server
    server.listen(PORT, () => {
      logger.info(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║           BIO-MONITOR API SERVER STARTED             ║
║                                                       ║
║  Environment: ${process.env.NODE_ENV?.toUpperCase().padEnd(15)} ║
║  Port: ${PORT.toString().padEnd(43)} ║
║  API Version: ${(process.env.API_VERSION || 'v1').padEnd(38)} ║
║                                                       ║
║  Database: Connected                                  ║
║  Socket.IO: Active                                    ║
║  Alert Service: Running                               ║
║  Data Retention: Running                              ║
║                                                       ║
║  Health Check: http://localhost:${PORT}/health         ║
║  API Docs: http://localhost:${PORT}/api/v1            ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
      `);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  // Stop accepting new connections
  server.close(() => {
    logger.info('HTTP server closed');
  });

  // Stop background services
  alertService.stop();
  dataRetentionService.stop();

  // Close Socket.IO connections
  if (io) {
    io.close(() => {
      logger.info('Socket.IO closed');
    });
  }

  // Give ongoing operations time to complete
  setTimeout(() => {
    logger.info('Graceful shutdown completed');
    process.exit(0);
  }, 5000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});

// Start the server
startServer();