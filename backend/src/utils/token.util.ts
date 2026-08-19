import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.config.js';
import { UnauthorizedError } from './errors.util.js';

export interface JwtTokenPayload {
  userId: string;
  email: string;
  userType: string;
  role?: string;
  roleId?: string;
  [key: string]: any;
}

export class TokenUtil {
  public static signAccessToken(payload: JwtTokenPayload): string {
    return jwt.sign(payload, jwtConfig.accessSecret, {
      expiresIn: jwtConfig.accessExpiresIn as any,
      algorithm: jwtConfig.algorithm,
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience,
    });
  }

  public static signRefreshToken(payload: JwtTokenPayload): string {
    return jwt.sign(payload, jwtConfig.refreshSecret, {
      expiresIn: jwtConfig.refreshExpiresIn as any,
      algorithm: jwtConfig.algorithm,
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience,
    });
  }

  public static verifyAccessToken(token: string): JwtTokenPayload {
    try {
      return jwt.verify(token, jwtConfig.accessSecret, {
        issuer: jwtConfig.issuer,
        audience: jwtConfig.audience,
      }) as JwtTokenPayload;
    } catch (err: any) {
      throw new UnauthorizedError(`Invalid or expired access token: ${err.message}`);
    }
  }

  public static verifyRefreshToken(token: string): JwtTokenPayload {
    try {
      return jwt.verify(token, jwtConfig.refreshSecret, {
        issuer: jwtConfig.issuer,
        audience: jwtConfig.audience,
      }) as JwtTokenPayload;
    } catch (err: any) {
      throw new UnauthorizedError(`Invalid or expired refresh token: ${err.message}`);
    }
  }
}
