import swaggerJSDoc from 'swagger-jsdoc';
import { envConfig } from './env.config.js';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Travel OS — Enterprise Backend REST API',
    version: '1.0.0',
    description:
      'Official REST API documentation and contract specifications for Travel OS (Customer Marketplace, Agency Portal, and Super Admin Management).',
    contact: {
      name: 'Travel OS Engineering Team',
      email: 'engineering@travelos.com',
    },
    license: {
      name: 'Proprietary',
    },
  },
  servers: [
    {
      url: `http://localhost:${envConfig.PORT}${envConfig.API_PREFIX}`,
      description: 'Local Development Server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Provide JWT Access Token in format: Bearer <token>',
      },
    },
    schemas: {
      StandardSuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Operation completed successfully' },
          data: { type: 'object' },
          meta: {
            type: 'object',
            properties: {
              timestamp: { type: 'string', example: '2026-08-19T14:40:00.000Z' },
              requestId: { type: 'string', example: 'req_8f3d1b9e-01' },
            },
          },
        },
      },
      StandardErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Validation failed on request payload' },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string', example: 'email' },
                message: { type: 'string', example: 'Email must be valid format' },
              },
            },
          },
          errorCode: { type: 'string', example: 'VALIDATION_ERROR' },
          meta: {
            type: 'object',
            properties: {
              timestamp: { type: 'string', example: '2026-08-19T14:40:00.000Z' },
              requestId: { type: 'string', example: 'req_8f3d1b9e-02' },
            },
          },
        },
      },
      HealthResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          status: { type: 'string', example: 'healthy' },
          version: { type: 'string', example: '1.0.0' },
          environment: { type: 'string', example: 'development' },
          database: { type: 'string', example: 'connected' },
          uptime: { type: 'number', example: 14.52 },
          timestamp: { type: 'string', example: '2026-08-19T22:00:00.000Z' },
        },
      },
    },
  },
};

const swaggerOptions: swaggerJSDoc.Options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/routes/**/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
