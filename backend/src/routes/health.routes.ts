import { Router, Request, Response } from 'express';
import { dbConnection } from '../config/db.config.js';
import { envConfig } from '../config/env.config.js';
import { ResponseUtil } from '../utils/response.util.js';

const router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: System Health & Telemetry Probe
 *     description: Returns the real-time operational status, database connectivity, uptime, and system metadata.
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: System is healthy and operational
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
router.get('/', (_req: Request, res: Response) => {
  const dbStatus = dbConnection.getStatus();
  const uptimeSeconds = process.uptime();
  const memoryUsage = process.memoryUsage();

  const healthData = {
    status: 'healthy',
    version: '1.0.0',
    environment: envConfig.NODE_ENV,
    appName: envConfig.APP_NAME,
    database: {
      status: dbStatus.isConnected ? 'connected' : 'disconnected',
      readyState: dbStatus.readyState,
      clusterHost: dbStatus.host || 'local',
      databaseName: dbStatus.name || 'travelos_db',
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
    },
  };

  return ResponseUtil.success(res, healthData, 'System is healthy and operational');
});

export default router;
