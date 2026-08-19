import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger.config.js';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  (res.locals as any).requestId = requestId;
  res.setHeader('X-Request-Id', requestId);

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, originalUrl, ip } = req;
    const { statusCode } = res;

    const message = `${method} ${originalUrl} ${statusCode} - ${duration}ms [${ip}]`;

    if (statusCode >= 500) {
      logger.error(message, { requestId, duration, statusCode });
    } else if (statusCode >= 400) {
      logger.warn(message, { requestId, duration, statusCode });
    } else {
      logger.http ? logger.http(message, { requestId, duration, statusCode }) : logger.info(message, { requestId, duration, statusCode });
    }
  });

  next();
};
