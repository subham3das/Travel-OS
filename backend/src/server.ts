import http from 'http';
import { app } from './app.js';
import { envConfig } from './config/env.config.js';
import { dbConnection } from './config/db.config.js';
import { logger } from './config/logger.config.js';
import { socketService } from './services/socket.service.js';

let httpServer: http.Server | null = null;

const startServer = async () => {
  try {
    logger.info('═══════════════════════════════════════════════════════════════');
    logger.info('🚀 Initializing %s Startup Sequence...', envConfig.APP_NAME);
    logger.info('═══════════════════════════════════════════════════════════════');

    // 1. Environment Verification
    logger.info('✓ Environment Loaded [%s]', envConfig.NODE_ENV);

    // 2. Cloudinary Configuration
    logger.info('✓ Cloudinary Configured (%s)', envConfig.CLOUDINARY_CLOUD_NAME);

    // 3. Establish MongoDB Connection BEFORE starting HTTP server
    await dbConnection.connect();

    // 4. Start HTTP Server only after DB is healthy and ready
    httpServer = app.listen(envConfig.PORT, () => {
      logger.info('✓ Express Server Started on port %d', envConfig.PORT);
      logger.info('✓ Routes Loaded (%s)', envConfig.API_PREFIX);
      logger.info('✓ Swagger Docs Ready: http://localhost:%d%s/docs', envConfig.PORT, envConfig.API_PREFIX);
      logger.info('✓ Health Probe Ready: http://localhost:%d%s/health', envConfig.PORT, envConfig.API_PREFIX);
      logger.info('═══════════════════════════════════════════════════════════════');
      logger.info('🌟 All systems operational. Ready to accept incoming traffic.');
      logger.info('═══════════════════════════════════════════════════════════════');
    });

    // 4.1. Initialize Socket.IO Real-time Engine
    socketService.init(httpServer);

    // 5. Graceful Shutdown Handler
    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Initiating graceful shutdown...`);

      if (httpServer) {
        httpServer.close(async () => {
          logger.info('✓ HTTP server closed.');
          await dbConnection.disconnect();
          logger.info('✓ Application terminated gracefully.');
          process.exit(0);
        });
      } else {
        await dbConnection.disconnect();
        process.exit(0);
      }

      // Force exit after 10 seconds if connections hang
      setTimeout(() => {
        logger.error('💥 Forceful shutdown initiated: could not close active connections in time.');
        process.exit(1);
      }, 10000).unref();
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
    logger.error('═══════════════════════════════════════════════════════════════');
    logger.error('❌ FATAL: Backend startup failed. Aborting startup sequence.');
    logger.error('Error: %s', error?.message || error);
    logger.error('═══════════════════════════════════════════════════════════════');
    process.exit(1);
  }
};

startServer();
