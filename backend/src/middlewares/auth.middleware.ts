import { Request, Response, NextFunction } from 'express';
import { TokenUtil, JwtTokenPayload } from '../utils/token.util.js';
import { UnauthorizedError } from '../utils/errors.util.js';

// Extend Express Request type with authenticated user context
declare global {
  namespace Express {
    interface Request {
      user?: JwtTokenPayload;
    }
  }
}

/**
 * Authentication Middleware (Placeholder ready for Phase 2: Identity & Access)
 */
export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Missing or malformed Authorization header. Expected: Bearer <token>'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = TokenUtil.verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};
