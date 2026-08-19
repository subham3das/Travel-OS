import rateLimit from 'express-rate-limit';
import { envConfig } from '../config/env.config.js';
import { ResponseUtil } from '../utils/response.util.js';
import { HTTP_STATUS, ERROR_CODES } from '../constants/http.constant.js';

export const globalRateLimiter = rateLimit({
  windowMs: envConfig.RATE_LIMIT_WINDOW_MS,
  max: envConfig.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    ResponseUtil.error(
      res,
      'Rate limit threshold exceeded. Please try again after a few moments.',
      HTTP_STATUS.TOO_MANY_REQUESTS,
      ERROR_CODES.RATE_LIMIT_EXCEEDED
    );
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    ResponseUtil.error(
      res,
      'Too many authentication attempts. Please try again after 15 minutes.',
      HTTP_STATUS.TOO_MANY_REQUESTS,
      ERROR_CODES.RATE_LIMIT_EXCEEDED
    );
  },
});
