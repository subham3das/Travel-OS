import cors, { CorsOptions } from 'cors';
import { envConfig } from './env.config.js';

const allowedOrigins = [
  envConfig.CLIENT_URL,
  envConfig.ADMIN_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin) || envConfig.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS policy`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'X-Refresh-Token',
    'X-Request-Id',
  ],
  exposedHeaders: ['X-Request-Id', 'X-Total-Count'],
  maxAge: 86400, // 24 hours pre-flight caching
};

export const corsMiddleware = cors(corsOptions);
