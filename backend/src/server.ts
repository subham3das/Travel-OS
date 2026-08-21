import { app } from './app.js';
import { envConfig } from './config/env.config.js';
import { dbConnection } from './config/db.config.js';
import { logger } from './config/logger.config.js';

const startServer = async () => {
  try {
    // 1. Start HTTP Server
    const server = app.listen(envConfig.PORT, () => {
      logger.info('═══════════════════════════════════════════════════════════════');
      logger.info(`🚀 ${envConfig.APP_NAME} running on port ${envConfig.PORT} [${envConfig.NODE_ENV}]`);
      logger.info(`🌐 Health Probe:  http://localhost:${envConfig.PORT}${envConfig.API_PREFIX}/health`);
      logger.info(`📚 Swagger Docs:  http://localhost:${envConfig.PORT}${envConfig.API_PREFIX}/docs`);
      logger.info('═══════════════════════════════════════════════════════════════');
    });

    // 2. Establish MongoDB Connection
    dbConnection.connect().catch((err) => {
      logger.error('MongoDB initial connection attempt failed: %s', err.message);
    });

    // 3. Graceful Shutdown Signals
    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        logger.info('HTTP server closed.');
        await dbConnection.disconnect();
        process.exit(0);
      });

      // Force close after 10s
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('uncaughtException', (err) => {
      logger.error('💥 Uncaught Exception:', err);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
    });
  } catch (error: any) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
