import express, { Application } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';

import { envConfig } from './config/env.config.js';
import { corsMiddleware } from './config/cors.config.js';
import { swaggerSpec } from './config/swagger.config.js';
import { requestLogger } from './middlewares/requestLogger.middleware.js';
import { globalRateLimiter } from './middlewares/rateLimiter.middleware.js';
import { notFoundHandler, globalErrorHandler } from './middlewares/error.middleware.js';
import apiRouter from './routes/index.js';

export const createApp = (): Application => {
  const app: Application = express();

  // Trust first proxy for load balancers (e.g. NGINX, Cloudflare)
  app.set('trust proxy', 1);

  // 1. Security Headers
  app.use(
    helmet({
      contentSecurityPolicy: envConfig.NODE_ENV === 'production' ? undefined : false,
      crossOriginEmbedderPolicy: false,
    })
  );

  // 2. CORS Handling
  app.use(corsMiddleware);

  // 3. Rate Limiting
  app.use(globalRateLimiter);

  // 4. Request Compression
  app.use(compression());

  // 5. Request Body Parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // 6. Cookie Parser
  app.use(cookieParser());

  // 7. Request Telemetry & Logger
  app.use(requestLogger);

  // 8. Swagger / OpenAPI Documentation
  app.use(
    `${envConfig.API_PREFIX}/docs`,
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customSiteTitle: 'Travel OS API Documentation',
    })
  );

  // 9. Mount Master API Routes
  app.use(envConfig.API_PREFIX, apiRouter);

  // 10. 404 Not Found Handler for unmapped routes
  app.use(notFoundHandler);

  // 11. Global Centralized Error Handler
  app.use(globalErrorHandler);

  return app;
};

export const app = createApp();
