import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.util.js';
import { ResponseUtil } from '../utils/response.util.js';
import { HTTP_STATUS, ERROR_CODES } from '../constants/http.constant.js';
import { logger } from '../config/logger.config.js';
import { envConfig } from '../config/env.config.js';

/**
 * 404 Not Found Middleware for unhandled routes
 */
export const notFoundHandler = (req: Request, res: Response, _next: NextFunction): void => {
  logger.warn('Resource Not Found: %s %s', req.method, req.originalUrl);
  ResponseUtil.error(
    res,
    `Route ${req.method} ${req.originalUrl} not found`,
    HTTP_STATUS.NOT_FOUND,
    ERROR_CODES.RESOURCE_NOT_FOUND
  );
};

/**
 * Global Error Handler Middleware
 */
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let errorCode = err.errorCode || ERROR_CODES.INTERNAL_SERVER_ERROR;
  let message = err.message || 'An unexpected internal server error occurred';
  let errors = err.errors || [];

  // Handle Mongoose / MongoDB Duplicate Key Error (Code 11000)
  if (err.code === 11000) {
    statusCode = HTTP_STATUS.CONFLICT;
    errorCode = ERROR_CODES.CONFLICT;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `A record with this ${field} already exists`;
    errors = [{ field, message }];
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = HTTP_STATUS.UNPROCESSABLE_ENTITY;
    errorCode = ERROR_CODES.VALIDATION_ERROR;
    message = 'Validation failed on resource schema';
    errors = Object.values(err.errors || {}).map((e: any) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Handle CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    errorCode = ERROR_CODES.BAD_REQUEST;
    message = `Invalid format for field ${err.path}`;
    errors = [{ field: err.path, message: `Invalid identifier: ${err.value}` }];
  }

  // Handle Mongoose Buffering Timeout / Database Unreachable Error
  if (err.name === 'MongooseError' && err.message?.includes('buffering timed out')) {
    statusCode = HTTP_STATUS.SERVICE_UNAVAILABLE;
    errorCode = ERROR_CODES.SERVICE_UNAVAILABLE;
    message = 'Database service is currently connecting or unreachable. Please ensure your IP address is whitelisted in MongoDB Atlas Network Access.';
    errors = [{ field: 'database', message }];
  }

  // Log error details
  if (statusCode >= 500) {
    logger.error('💥 Unhandled Exception [%s %s]: %s\nStack: %s', req.method, req.originalUrl, err.message, err.stack);
  } else {
    logger.warn('⚠️ Operational Error [%s %s] Status %d: %s', req.method, req.originalUrl, statusCode, message);
  }

  // In production, never expose raw internal stack details
  const metaExtensions: Record<string, any> = {};
  if (envConfig.NODE_ENV === 'development' && err.stack) {
    metaExtensions.stack = err.stack;
  }

  ResponseUtil.error(res, message, statusCode, errorCode, errors, metaExtensions);
};
