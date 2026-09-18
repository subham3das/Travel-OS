import { Request, Response, NextFunction } from 'express';
import { TokenUtil, JwtTokenPayload } from '../utils/token.util.js';
import { adminRepository } from '../repositories/admin.repository.js';
import { IAdmin } from '../models/admin.model.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.util.js';

declare global {
  namespace Express {
    interface Request {
      admin?: IAdmin;
    }
  }
}

/**
 * Authentication Middleware for Super Admin and Administrator API Endpoints.
 * Strictly verifies that the request includes a valid Admin JWT and that the admin exists and is active in MongoDB.
 */
export const authenticateAdmin = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Missing or malformed Authorization header. Expected: Bearer <token>'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded: JwtTokenPayload = TokenUtil.verifyAccessToken(token);

    // Enforce Admin token type isolation
    if (decoded.userType !== 'ADMIN') {
      return next(new ForbiddenError('Access denied: Super Admin privileges required.'));
    }

    // Verify admin active state directly from MongoDB
    const admin = await adminRepository.findById(decoded.userId || decoded.adminId);
    if (!admin || !admin.isActive || admin.isDeleted) {
      return next(new UnauthorizedError('Administrator session invalid or account inactive.'));
    }

    req.user = decoded;
    req.admin = admin;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware requiring Super Admin role
 */
export const requireSuperAdmin = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.admin) {
    return next(new UnauthorizedError('Admin authentication required.'));
  }

  if (!req.admin.isSuperAdmin && req.admin.role !== 'SUPER_ADMIN') {
    return next(new ForbiddenError('Access denied: Super Administrator privilege required.'));
  }

  next();
};

/**
 * Middleware requiring specific Admin permission
 */
export const requireAdminPermission = (requiredPermission: string) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.admin) {
      return next(new UnauthorizedError('Admin authentication required.'));
    }

    const permissions = req.admin.permissions || [];
    const hasPermission =
      req.admin.isSuperAdmin ||
      permissions.includes('ALL') ||
      permissions.includes(requiredPermission);

    if (!hasPermission) {
      return next(
        new ForbiddenError(`Access denied: Missing required permission '${requiredPermission}'.`)
      );
    }

    next();
  };
};
