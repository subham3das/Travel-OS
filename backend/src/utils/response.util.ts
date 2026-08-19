import { Response } from 'express';
import { HTTP_STATUS } from '../constants/http.constant.js';
import { ValidationErrorItem } from './errors.util.js';

export interface PaginationMeta {
  page: number;
  limit: number;
  totalPages: number;
  totalRecords: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ResponseMeta {
  timestamp: string;
  requestId?: string;
  [key: string]: any;
}

export interface SuccessResponsePayload<T = any> {
  success: true;
  message: string;
  data: T;
  pagination?: PaginationMeta;
  meta: ResponseMeta;
}

export interface ErrorResponsePayload {
  success: false;
  message: string;
  errors: ValidationErrorItem[];
  errorCode: string;
  meta: ResponseMeta;
}

export class ResponseUtil {
  public static success<T = any>(
    res: Response,
    data: T = {} as T,
    message = 'Operation completed successfully',
    statusCode: number = HTTP_STATUS.OK,
    metaExtensions: Record<string, any> = {}
  ): Response<SuccessResponsePayload<T>> {
    const payload: SuccessResponsePayload<T> = {
      success: true,
      message,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (res.locals as any)?.requestId || `req_${Date.now()}`,
        ...metaExtensions,
      },
    };
    return res.status(statusCode).json(payload);
  }

  public static paginated<T = any>(
    res: Response,
    data: T[],
    pagination: PaginationMeta,
    message = 'Records fetched successfully',
    statusCode: number = HTTP_STATUS.OK,
    metaExtensions: Record<string, any> = {}
  ): Response<SuccessResponsePayload<T[]>> {
    const payload: SuccessResponsePayload<T[]> = {
      success: true,
      message,
      data,
      pagination,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (res.locals as any)?.requestId || `req_${Date.now()}`,
        ...metaExtensions,
      },
    };
    return res.status(statusCode).json(payload);
  }

  public static error(
    res: Response,
    message = 'An unexpected error occurred',
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    errorCode = 'INTERNAL_SERVER_ERROR',
    errors: ValidationErrorItem[] = [],
    metaExtensions: Record<string, any> = {}
  ): Response<ErrorResponsePayload> {
    const payload: ErrorResponsePayload = {
      success: false,
      message,
      errors,
      errorCode,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (res.locals as any)?.requestId || `req_${Date.now()}`,
        ...metaExtensions,
      },
    };
    return res.status(statusCode).json(payload);
  }
}
