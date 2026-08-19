import { envConfig } from './env.config.js';

export const jwtConfig = {
  accessSecret: envConfig.JWT_ACCESS_SECRET,
  accessExpiresIn: envConfig.JWT_ACCESS_EXPIRES_IN,
  refreshSecret: envConfig.JWT_REFRESH_SECRET,
  refreshExpiresIn: envConfig.JWT_REFRESH_EXPIRES_IN,
  algorithm: 'HS256' as const,
  issuer: 'TravelOS_AuthService',
  audience: 'TravelOS_ClientApp',
};
