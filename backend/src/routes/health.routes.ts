import { Router, Request, Response } from 'express';
import { dbConnection } from '../config/db.config.js';
import { envConfig } from '../config/env.config.js';
import { HTTP_STATUS } from '../constants/http.constant.js';

const router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: System Health & Telemetry Probe
 *     description: Returns the real-time operational status, database connectivity, Cloudinary configuration, uptime, memory, and system metadata.
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: System is healthy and operational
 *       503:
 *         description: System is unhealthy (database disconnected)
 */
router.get('/', (_req: Request, res: Response) => {
  const dbStatus = dbConnection.getStatus();
  const uptimeSeconds = process.uptime();
  const memoryUsage = process.memoryUsage();
  const isDbHealthy = dbStatus.isConnected;

  const healthData = {
    status: isDbHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: {
      mode: envConfig.NODE_ENV,
      appName: envConfig.APP_NAME,
      apiPrefix: envConfig.API_PREFIX,
      clientUrl: envConfig.CLIENT_URL,
      adminUrl: envConfig.ADMIN_URL,
    },
    database: {
      status: isDbHealthy ? 'connected' : 'disconnected',
      readyState: dbStatus.readyState,
      readyStateLabel: dbStatus.readyStateLabel,
      clusterHost: dbStatus.host || 'unknown',
      databaseName: dbStatus.name || 'unknown',
      connectionUri: dbStatus.maskedUri,
    },
    cloudinary: {
      status: envConfig.CLOUDINARY_CLOUD_NAME ? 'configured' : 'unconfigured',
      cloudName: envConfig.CLOUDINARY_CLOUD_NAME,
    },
    system: {
      uptimeSeconds: Math.round(uptimeSeconds),
      uptimeFormatted: `${Math.floor(uptimeSeconds / 3600)}h ${Math.floor((uptimeSeconds % 3600) / 60)}m ${Math.floor(uptimeSeconds % 60)}s`,
      memoryUsageMB: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024),
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      },
      nodeVersion: process.version,
      pid: process.pid,
      platform: process.platform,
    },
  };

  const httpCode = isDbHealthy ? HTTP_STATUS.OK : HTTP_STATUS.SERVICE_UNAVAILABLE;

  return res.status(httpCode).json({
    success: isDbHealthy,
    message: isDbHealthy
      ? 'System is fully healthy and operational'
      : 'System is degraded: Database connection is unavailable',
    data: healthData,
  });
});

export default router;
