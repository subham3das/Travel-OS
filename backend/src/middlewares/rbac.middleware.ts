import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../utils/errors.util.js';
import { RBAC_ROLES } from '../constants/rbac.constant.js';

/**
 * Role-Based Access Control Middleware (Placeholder ready for Phase 2: RBAC Matrix)
 */
export const requireRoles = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required before checking authorization'));
    }

    // Super Admin always has bypass privilege
    if (req.user.userType === RBAC_ROLES.SUPER_ADMIN || req.user.role === RBAC_ROLES.SUPER_ADMIN) {
      return next();
    }

    const hasRole = allowedRoles.includes(req.user.userType) || (req.user.role && allowedRoles.includes(req.user.role));

    if (!hasRole) {
      return next(new ForbiddenError(`Access denied. Allowed roles: ${allowedRoles.join(', ')}`));
    }

    next();
  };
};

/**
 * Granular Permission Action Checker (Placeholder ready for Phase 2: RBAC Matrix)
 */
export const checkPermission = (moduleName: string, action: string) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    if (req.user.userType === RBAC_ROLES.SUPER_ADMIN || req.user.role === RBAC_ROLES.SUPER_ADMIN) {
      return next();
    }

    // Placeholder: Full matrix check will be implemented in Phase 2
    next();
  };
};
