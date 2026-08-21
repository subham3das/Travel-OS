import { HTTP_STATUS, ERROR_CODES } from '../constants/http.constant.js';

export interface ValidationErrorItem {
  field?: string;
  message: string;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly isOperational: boolean;
  public readonly errors: ValidationErrorItem[];

  constructor(
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    errorCode: string = ERROR_CODES.INTERNAL_SERVER_ERROR,
    errors: ValidationErrorItem[] = [],
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errors = errors;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request', errors: ValidationErrorItem[] = []) {
    super(message, HTTP_STATUS.BAD_REQUEST, ERROR_CODES.BAD_REQUEST, errors);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(message, HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden access — insufficient permissions') {
    super(message, HTTP_STATUS.FORBIDDEN, ERROR_CODES.FORBIDDEN);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Requested resource not found') {
    super(message, HTTP_STATUS.NOT_FOUND, ERROR_CODES.RESOURCE_NOT_FOUND);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict with existing resource') {
    super(message, HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed on request payload', errors: ValidationErrorItem[] = []) {
    super(message, HTTP_STATUS.UNPROCESSABLE_ENTITY, ERROR_CODES.VALIDATION_ERROR, errors);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message = 'Too many requests, please slow down') {
    super(message, HTTP_STATUS.TOO_MANY_REQUESTS, ERROR_CODES.RATE_LIMIT_EXCEEDED);
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal Server Error') {
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_SERVER_ERROR);
  }
}
