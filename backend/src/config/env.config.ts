import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  APP_NAME: z.string().default('TravelOS_API'),
  API_PREFIX: z.string().default('/api'),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  ADMIN_URL: z.string().default('http://localhost:5173/admin'),

  // MongoDB Configuration
  MONGODB_URI: z.string().default('mongodb://127.0.0.1:27017/travelos_db'),
  MONGODB_MAX_POOL_SIZE: z.string().default('50').transform((val) => parseInt(val, 10)),

  // JWT Configuration
  JWT_ACCESS_SECRET: z.string().min(16, 'JWT_ACCESS_SECRET must be at least 16 characters').default('travelos_super_secure_access_secret_key_32_chars_min'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().min(16, 'JWT_REFRESH_SECRET must be at least 16 characters').default('travelos_super_secure_refresh_secret_key_32_chars_min'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // Cloudinary Configuration
  CLOUDINARY_CLOUD_NAME: z.string().default('travelos_cloud'),
  CLOUDINARY_API_KEY: z.string().default('123456789012345'),
  CLOUDINARY_API_SECRET: z.string().default('sample_secret'),

  // SMTP Configuration
  SMTP_HOST: z.string().default('smtp.sendgrid.net'),
  SMTP_PORT: z.string().default('587').transform((val) => parseInt(val, 10)),
  SMTP_USER: z.string().default('apikey'),
  SMTP_PASS: z.string().default('sample_pass'),
  EMAIL_FROM_NAME: z.string().default('Travel OS'),
  EMAIL_FROM_ADDRESS: z.string().default('support@travelos.com'),

  // Payment Gateways
  RAZORPAY_KEY_ID: z.string().default('rzp_test_sample'),
  RAZORPAY_KEY_SECRET: z.string().default('sample_secret'),
  STRIPE_SECRET_KEY: z.string().default('sk_test_sample'),
  STRIPE_WEBHOOK_SECRET: z.string().default('whsec_sample'),

  // Rate Limiting & Logging
  RATE_LIMIT_WINDOW_MS: z.string().default('60000').transform((val) => parseInt(val, 10)),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100').transform((val) => parseInt(val, 10)),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']).default('debug'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ FATAL: Invalid environment variables configuration:');
  console.error(JSON.stringify(_env.error.format(), null, 2));
  process.exit(1);
}

export const envConfig = _env.data;
export type EnvConfig = z.infer<typeof envSchema>;
