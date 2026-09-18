import crypto from 'crypto';
import mongoose from 'mongoose';
import { adminRepository } from '../repositories/admin.repository.js';
import { refreshTokenRepository } from '../repositories/refreshToken.repository.js';
import { IAdmin, AdminRole, AdminAuthProvider } from '../models/admin.model.js';
import { TokenUtil, JwtTokenPayload } from '../utils/token.util.js';
import { HashUtil } from '../utils/hash.util.js';
import { DateUtil } from '../utils/date.util.js';
import {
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  NotFoundError,
  BadRequestError,
  TooManyRequestsError,
  InternalServerError,
} from '../utils/errors.util.js';
import { logger } from '../config/logger.config.js';
import { envConfig } from '../config/env.config.js';
import { AuditLoggerService } from './auditLogger.service.js';
import { PasswordResetModel } from '../models/passwordReset.model.js';
import { AdminSessionModel } from '../models/adminSession.model.js';
import { mailService } from './mail.service.js';

export interface AdminDTO {
  id: string;
  fullName: string;
  name: string;
  email: string;
  role: AdminRole;
  permissions: string[];
  avatar?: string;
  profileImage?: string;
  isActive: boolean;
  isSuperAdmin: boolean;
  authProvider: AdminAuthProvider;
  lastLogin?: string;
  createdAt: string;
}

export class AdminAuthService {
  /**
   * Format Admin document into a safe DTO without sensitive fields
   */
  public formatAdminDTO(admin: IAdmin): AdminDTO {
    const adminObj = admin.toObject ? admin.toObject() : admin;
    return {
      id: (adminObj._id as mongoose.Types.ObjectId).toString(),
      fullName: adminObj.fullName,
      name: adminObj.fullName,
      email: adminObj.email,
      role: adminObj.role,
      permissions: adminObj.permissions || ['ALL'],
      avatar: adminObj.profileImage || '',
      profileImage: adminObj.profileImage || '',
      isActive: adminObj.isActive,
      isSuperAdmin: adminObj.isSuperAdmin,
      authProvider: adminObj.authProvider,
      lastLogin: adminObj.lastLogin ? new Date(adminObj.lastLogin).toISOString() : undefined,
      createdAt: adminObj.createdAt ? new Date(adminObj.createdAt).toISOString() : new Date().toISOString(),
    };
  }

  /**
   * Super Admin Email + Password Login
   */
  public async login(
    credentials: { email: string; password: string },
    meta: { ipAddress?: string; userAgent?: string } = {}
  ) {
    const cleanEmail = credentials.email.toLowerCase().trim();

    // 1. Check if email exists in Admin collection
    const admin = await adminRepository.findByEmail(cleanEmail, true);
    if (!admin) {
      await AuditLoggerService.log({
        module: 'Authentication',
        action: 'Failed Super Admin login attempt',
        eventType: 'Failed Login Attempt',
        description: `Unrecognized administrator email attempted login: ${cleanEmail}`,
        severity: 'High',
        status: 'Failed',
        ipAddress: meta.ipAddress,
        browser: meta.userAgent,
      });
      throw new UnauthorizedError('This email is not registered as a Super Admin.');
    }

    // 2. Check active status
    if (!admin.isActive || admin.isDeleted) {
      await AuditLoggerService.log({
        actor: {
          id: admin._id?.toString(),
          name: admin.fullName,
          email: admin.email,
          role: admin.role,
        },
        module: 'Authentication',
        action: 'Disabled administrator login attempt',
        eventType: 'Unauthorized Access',
        description: `Disabled administrator account attempted login: ${admin.email}`,
        severity: 'Critical',
        status: 'Failed',
        ipAddress: meta.ipAddress,
        browser: meta.userAgent,
      });
      throw new ForbiddenError('Your administrator account has been disabled.');
    }

    // 3. Check password presence (for Google-only admins)
    if (!admin.password) {
      throw new UnauthorizedError('This admin account is configured for Google Sign-In only.');
    }

    // 4. Verify password with bcrypt
    const isPasswordValid = await HashUtil.compare(credentials.password, admin.password);
    if (!isPasswordValid) {
      await AuditLoggerService.log({
        actor: {
          id: admin._id?.toString(),
          name: admin.fullName,
          email: admin.email,
          role: admin.role,
        },
        module: 'Authentication',
        action: 'Failed password verification',
        eventType: 'Failed Login Attempt',
        description: `Incorrect password entered for administrator: ${admin.email}`,
        severity: 'High',
        status: 'Failed',
        ipAddress: meta.ipAddress,
        browser: meta.userAgent,
      });
      throw new UnauthorizedError('Incorrect email or password.');
    }

    // 5. Update last login timestamp
    await adminRepository.updateLastLogin(admin._id as mongoose.Types.ObjectId);

    // 6. Generate Admin JWT Tokens
    const tokenPayload: JwtTokenPayload = {
      userId: (admin._id as mongoose.Types.ObjectId).toString(),
      adminId: (admin._id as mongoose.Types.ObjectId).toString(),
      email: admin.email,
      role: admin.role,
      userType: 'ADMIN',
      isSuperAdmin: admin.isSuperAdmin,
      permissions: admin.permissions || ['ALL'],
    };

    const accessToken = TokenUtil.signAccessToken(tokenPayload);
    const refreshToken = TokenUtil.signRefreshToken(tokenPayload);
    const refreshHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    await refreshTokenRepository.create({
      userId: admin._id as mongoose.Types.ObjectId,
      tokenHash: refreshHash,
      device: 'Admin Portal Web',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      expiresAt: DateUtil.addDays(new Date(), 7),
    });

    // 7. Record Successful Login Audit Log
    await AuditLoggerService.log({
      actor: {
        id: admin._id?.toString(),
        name: admin.fullName,
        email: admin.email,
        role: admin.role,
        profileImage: admin.profileImage,
      },
      module: 'Authentication',
      action: 'Super Admin Logged In',
      eventType: 'Admin Login',
      description: `Administrator ${admin.fullName} authenticated successfully via credentials`,
      severity: 'Low',
      status: 'Success',
      ipAddress: meta.ipAddress,
      browser: meta.userAgent,
    });

    logger.info('🛡️ Super Admin logged in: %s [%s]', admin.email, admin._id);

    return {
      admin: this.formatAdminDTO(admin),
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: '15m',
      },
    };
  }

  /**
   * Super Admin Google Workspace Login (Strict: Never auto-creates admin accounts)
   */
  public async googleLogin(
    payload: {
      credential?: string;
      idToken?: string;
      accessToken?: string;
    },
    meta: { ipAddress?: string; userAgent?: string } = {}
  ) {
    let email: string | undefined;
    let googleId: string | undefined;
    let avatar: string = '';

    const idToken = payload.credential || payload.idToken;

    // 1. Verify Google ID Token via Google TokenInfo API
    if (idToken) {
      try {
        const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
        if (googleRes.ok) {
          const googleData = (await googleRes.json()) as any;
          email = googleData.email?.toLowerCase().trim();
          googleId = googleData.sub;
          avatar = googleData.picture || '';
        } else {
          // Fallback decode if offline
          const parts = idToken.split('.');
          if (parts.length === 3) {
            const decoded = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
            email = decoded.email?.toLowerCase().trim();
            googleId = decoded.sub;
            avatar = decoded.picture || '';
          }
        }
      } catch (err) {
        logger.warn('Admin Google ID token verification failed:', err);
      }
    }

    // 2. Verify Google Access Token via UserInfo API
    if (!email && payload.accessToken) {
      try {
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${payload.accessToken}` },
        });
        if (userInfoRes.ok) {
          const userInfo = (await userInfoRes.json()) as any;
          email = userInfo.email?.toLowerCase().trim();
          googleId = userInfo.sub;
          avatar = userInfo.picture || '';
        }
      } catch (err) {
        logger.warn('Admin Google Access token verification failed:', err);
      }
    }

    if (!email) {
      throw new UnauthorizedError('Google authentication failed. Please try again.');
    }

    // 3. Search Admin Collection ONLY (Do NOT create if missing)
    const admin = await adminRepository.findByEmail(email);
    if (!admin) {
      throw new UnauthorizedError('This Google account is not registered as a Super Admin.');
    }

    // 4. Check active status
    if (!admin.isActive || admin.isDeleted) {
      throw new ForbiddenError('Your administrator account has been disabled.');
    }

    // 5. Update googleId & authProvider if first Google sign-in
    const updateData: Partial<IAdmin> = {
      lastLogin: new Date(),
    };
    if (!admin.googleId && googleId) {
      updateData.googleId = googleId;
    }
    if (admin.authProvider === 'credentials') {
      updateData.authProvider = 'both';
    }
    if (!admin.profileImage && avatar) {
      updateData.profileImage = avatar;
    }

    await adminRepository.updateById(admin._id as mongoose.Types.ObjectId, updateData);

    // 6. Generate Admin JWT Tokens
    const tokenPayload: JwtTokenPayload = {
      userId: (admin._id as mongoose.Types.ObjectId).toString(),
      adminId: (admin._id as mongoose.Types.ObjectId).toString(),
      email: admin.email,
      role: admin.role,
      userType: 'ADMIN',
      isSuperAdmin: admin.isSuperAdmin,
      permissions: admin.permissions || ['ALL'],
    };

    const accessToken = TokenUtil.signAccessToken(tokenPayload);
    const refreshToken = TokenUtil.signRefreshToken(tokenPayload);
    const refreshHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    await refreshTokenRepository.create({
      userId: admin._id as mongoose.Types.ObjectId,
      tokenHash: refreshHash,
      device: 'Admin Portal Web (Google SSO)',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      expiresAt: DateUtil.addDays(new Date(), 7),
    });

    logger.info('🛡️ Super Admin logged in via Google SSO: %s [%s]', admin.email, admin._id);

    return {
      admin: this.formatAdminDTO(admin),
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: '15m',
      },
    };
  }

  /**
   * Get Current Authenticated Administrator Profile
   */
  public async getMe(adminId: string): Promise<AdminDTO> {
    const admin = await adminRepository.findById(adminId);
    if (!admin || !admin.isActive || admin.isDeleted) {
      throw new UnauthorizedError('Administrator session invalid or account inactive.');
    }
    return this.formatAdminDTO(admin);
  }

  /**
   * Refresh Admin Access Token
   */
  public async refreshToken(refreshTokenStr: string) {
    const decoded = TokenUtil.verifyRefreshToken(refreshTokenStr);
    if (decoded.userType !== 'ADMIN') {
      throw new UnauthorizedError('Invalid token user type for admin session.');
    }

    const refreshHash = crypto.createHash('sha256').update(refreshTokenStr).digest('hex');
    const existingToken = await refreshTokenRepository.findByTokenHash(refreshHash);

    if (!existingToken || existingToken.isRevoked) {
      throw new UnauthorizedError('Refresh token has expired or been revoked.');
    }

    const admin = await adminRepository.findById(decoded.userId);
    if (!admin || !admin.isActive || admin.isDeleted) {
      throw new UnauthorizedError('Administrator account inactive.');
    }

    const newPayload: JwtTokenPayload = {
      userId: (admin._id as mongoose.Types.ObjectId).toString(),
      adminId: (admin._id as mongoose.Types.ObjectId).toString(),
      email: admin.email,
      role: admin.role,
      userType: 'ADMIN',
      isSuperAdmin: admin.isSuperAdmin,
      permissions: admin.permissions || ['ALL'],
    };

    const newAccessToken = TokenUtil.signAccessToken(newPayload);

    return {
      accessToken: newAccessToken,
      expiresIn: '15m',
    };
  }

  /**
   * Super Admin Logout (Revoke Refresh Token)
   */
  public async logout(refreshTokenStr?: string): Promise<void> {
    if (refreshTokenStr) {
      const refreshHash = crypto.createHash('sha256').update(refreshTokenStr).digest('hex');
      await refreshTokenRepository.revokeToken(refreshHash);
    }
  }

  // In-memory sliding window rate limiter stores
  private static emailResetAttempts = new Map<string, number[]>();
  private static ipResetAttempts = new Map<string, number[]>();

  private checkRateLimit(key: string, map: Map<string, number[]>, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const times = (map.get(key) || []).filter((ts) => now - ts < windowMs);
    if (times.length >= limit) {
      return false;
    }
    times.push(now);
    map.set(key, times);
    return true;
  }

  /**
   * Super Admin Forgot Password (POST /api/admin/auth/forgot-password)
   * Real SMTP delivery via Nodemailer, anti-enumeration protection, and strict rate limits
   */
  public async forgotPassword(
    email: string,
    meta: { ipAddress?: string; userAgent?: string; sessionId?: string; device?: string } = {}
  ): Promise<{ success: boolean; message: string }> {
    const cleanEmail = email.toLowerCase().trim();
    const clientIp = meta.ipAddress || '127.0.0.1';

    // 1. Rate Limiting Check (Max 3 per hour per email, max 5 per hour per IP)
    const isEmailAllowed = this.checkRateLimit(`email:${cleanEmail}`, AdminAuthService.emailResetAttempts, 3, 60 * 60 * 1000);
    const isIpAllowed = this.checkRateLimit(`ip:${clientIp}`, AdminAuthService.ipResetAttempts, 5, 60 * 60 * 1000);

    if (!isEmailAllowed || !isIpAllowed) {
      await AuditLoggerService.log({
        actor: {
          email: cleanEmail,
          role: 'ADMIN',
        },
        sessionId: meta.sessionId,
        ipAddress: clientIp,
        browser: meta.userAgent,
        device: meta.device || 'Desktop',
        module: 'Authentication',
        action: 'Rate Limit Triggered',
        eventType: 'Password Reset Rate Limit Exceeded',
        description: `Rate limit triggered for password reset request on email: ${cleanEmail} from IP: ${clientIp}`,
        severity: 'High',
        status: 'Failed',
      });
      throw new TooManyRequestsError('Too many password reset requests. Please wait an hour before trying again.');
    }

    // 2. Audit Log: Password Reset Requested
    await AuditLoggerService.log({
      actor: { email: cleanEmail, role: 'ADMIN' },
      sessionId: meta.sessionId,
      ipAddress: clientIp,
      browser: meta.userAgent,
      device: meta.device || 'Desktop',
      module: 'Authentication',
      action: 'Password Reset Requested',
      eventType: 'Admin Password Reset Initiated',
      description: `Password reset requested for email: ${cleanEmail}`,
      severity: 'Low',
      status: 'Success',
    });

    const admin = await adminRepository.findByEmail(cleanEmail);
    if (!admin || !admin.isActive || admin.isDeleted) {
      logger.warn('Password reset requested for non-existent or inactive admin email: %s', cleanEmail);
      // Prevent account enumeration: return neutral success message without sending email or throwing 404
      return {
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.',
      };
    }

    // 3. Generate high-entropy 32-byte cryptographic token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // 4. Invalidate prior pending tokens and store only SHA-256 hash
    await PasswordResetModel.deleteMany({ email: cleanEmail });
    await PasswordResetModel.create({
      userId: admin._id,
      email: cleanEmail,
      token: hashedToken,
      expiresAt,
    });

    // 5. Construct secure reset link
    const frontendBaseUrl = envConfig.FRONTEND_URL || envConfig.CLIENT_URL || 'http://localhost:5173';
    const resetLink = `${frontendBaseUrl.replace(/\/+$/, '')}/admin/reset-password?token=${rawToken}`;

    // 6. Deliver real email via MailService (Nodemailer)
    try {
      await mailService.sendPasswordResetEmail(cleanEmail, admin.fullName, resetLink);

      // Audit Log: Reset Email Sent
      await AuditLoggerService.log({
        actor: {
          id: admin._id.toString(),
          name: admin.fullName,
          email: admin.email,
          role: admin.role,
          profileImage: admin.profileImage,
        },
        sessionId: meta.sessionId,
        ipAddress: clientIp,
        browser: meta.userAgent,
        device: meta.device || 'Desktop',
        module: 'Authentication',
        action: 'Reset Email Sent',
        eventType: 'Admin Password Reset Email Delivered',
        description: `Password reset verification email dispatched to ${cleanEmail}`,
        severity: 'Medium',
        status: 'Success',
        metadata: {
          expiresInMinutes: 15,
        },
      });

      logger.info('🛡️ Admin password reset email delivered to: %s', cleanEmail);

      return {
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.',
      };
    } catch (mailError: any) {
      logger.error('❌ Failed to dispatch password reset email to %s: %s', cleanEmail, mailError.message);

      // Delete generated token so dead links are not kept
      await PasswordResetModel.deleteMany({ email: cleanEmail });

      // Audit Log: Reset Email Failed
      await AuditLoggerService.log({
        actor: {
          id: admin._id.toString(),
          name: admin.fullName,
          email: admin.email,
          role: admin.role,
        },
        sessionId: meta.sessionId,
        ipAddress: clientIp,
        browser: meta.userAgent,
        device: meta.device || 'Desktop',
        module: 'Authentication',
        action: 'Reset Email Failed',
        eventType: 'Admin Password Reset Email Delivery Failed',
        description: `Failed to dispatch password reset email to ${cleanEmail}: ${mailError.message}`,
        severity: 'High',
        status: 'Failed',
      });

      throw new InternalServerError('Unable to send verification email. Please try again in a few moments.');
    }
  }

  /**
   * Super Admin Reset Password (POST /api/admin/auth/reset-password)
   * Verifies hashed token, validates expiration/usage, updates password with bcrypt, revokes sessions, logs audit
   */
  public async resetPassword(
    token: string,
    newPassword: string,
    meta: { ipAddress?: string; userAgent?: string; sessionId?: string; device?: string } = {}
  ): Promise<{ success: boolean; message: string }> {
    const clientIp = meta.ipAddress || '127.0.0.1';

    if (!token || typeof token !== 'string') {
      await AuditLoggerService.log({
        sessionId: meta.sessionId,
        ipAddress: clientIp,
        browser: meta.userAgent,
        device: meta.device || 'Desktop',
        module: 'Authentication',
        action: 'Invalid Token Used',
        eventType: 'Password Reset Token Missing',
        description: 'Password reset attempted with missing or malformed token',
        severity: 'High',
        status: 'Failed',
      });
      throw new BadRequestError('Invalid or missing password reset token.');
    }

    // 1. Hash the incoming raw token with SHA-256
    const hashedToken = crypto.createHash('sha256').update(token.trim()).digest('hex');

    // 2. Find token document in PasswordResetModel
    const resetDoc = await PasswordResetModel.findOne({ token: hashedToken });
    if (!resetDoc) {
      await AuditLoggerService.log({
        sessionId: meta.sessionId,
        ipAddress: clientIp,
        browser: meta.userAgent,
        device: meta.device || 'Desktop',
        module: 'Authentication',
        action: 'Invalid Token Used',
        eventType: 'Password Reset Token Not Found',
        description: 'Password reset attempted with an unrecognized or altered token',
        severity: 'High',
        status: 'Failed',
      });
      throw new BadRequestError('Invalid or expired password reset link. Please request a new link.');
    }

    // 3. Verify token expiration
    if (resetDoc.expiresAt < new Date()) {
      await AuditLoggerService.log({
        actor: { email: resetDoc.email, role: 'ADMIN' },
        sessionId: meta.sessionId,
        ipAddress: clientIp,
        browser: meta.userAgent,
        device: meta.device || 'Desktop',
        module: 'Authentication',
        action: 'Expired Token Used',
        eventType: 'Password Reset Token Expired',
        description: `Password reset attempted with expired token for ${resetDoc.email}`,
        severity: 'High',
        status: 'Failed',
      });
      await PasswordResetModel.deleteMany({ email: resetDoc.email });
      throw new BadRequestError('Password reset link has expired. Please request a new link.');
    }

    // 4. Verify admin existence
    const admin = await adminRepository.findByEmail(resetDoc.email);
    if (!admin || !admin.isActive || admin.isDeleted) {
      throw new NotFoundError('Administrator account associated with this token is inactive or not found.');
    }

    // 5. Hash new password with bcrypt
    const passwordHash = await HashUtil.hash(newPassword);

    // 6. Update admin in MongoDB
    admin.password = passwordHash;
    admin.passwordChangedAt = new Date();
    await admin.save();

    // 7. Invalidate the reset token
    await PasswordResetModel.deleteMany({ email: resetDoc.email });

    // 8. Revoke all existing sessions and refresh tokens
    await refreshTokenRepository.revokeAllUserTokens(admin._id);
    await AdminSessionModel.updateMany(
      { adminId: admin._id },
      { $set: { isActive: false } }
    );

    // 9. Centralized Immutable Audit Log
    await AuditLoggerService.log({
      actor: {
        id: admin._id.toString(),
        name: admin.fullName,
        email: admin.email,
        role: admin.role,
        profileImage: admin.profileImage,
      },
      sessionId: meta.sessionId,
      ipAddress: clientIp,
      browser: meta.userAgent,
      device: meta.device || 'Desktop',
      module: 'Authentication',
      action: 'Password Successfully Reset',
      eventType: 'Admin Password Reset Complete',
      description: `Administrator ${admin.fullName} (${admin.email}) successfully reset account password and revoked prior sessions`,
      severity: 'Medium',
      status: 'Success',
      changes: [{ field: 'Password', before: '••••••••', after: '••••••••' }],
    });

    logger.info('🔑 Admin password reset completed successfully for: %s', admin.email);

    return {
      success: true,
      message: 'Your password has been reset successfully. Please log in with your new credentials.',
    };
  }

  /**
   * Internal Admin Creation (Protected: Only Super Admins can invoke this)
   */
  public async createAdmin(newAdminData: {
    fullName: string;
    email: string;
    password?: string;
    role?: AdminRole;
    permissions?: string[];
    authProvider?: AdminAuthProvider;
    profileImage?: string;
  }): Promise<AdminDTO> {
    const cleanEmail = newAdminData.email.toLowerCase().trim();

    const existing = await adminRepository.findByEmail(cleanEmail);
    if (existing) {
      throw new ConflictError('An administrator with this email already exists.');
    }

    let passwordHash: string | undefined;
    if (newAdminData.password) {
      passwordHash = await HashUtil.hash(newAdminData.password);
    }

    const role = newAdminData.role || 'ADMIN';
    const isSuperAdmin = role === 'SUPER_ADMIN';

    const admin = await adminRepository.create({
      fullName: newAdminData.fullName.trim(),
      email: cleanEmail,
      password: passwordHash,
      role,
      isSuperAdmin,
      permissions: newAdminData.permissions || (isSuperAdmin ? ['ALL'] : ['DASHBOARD_VIEW']),
      authProvider: newAdminData.authProvider || (passwordHash ? 'credentials' : 'google'),
      profileImage: newAdminData.profileImage,
      isActive: true,
    });

    logger.info('🛡️ New Admin created: %s [%s] with role %s', admin.email, admin._id, admin.role);

    return this.formatAdminDTO(admin);
  }
}

export const adminAuthService = new AdminAuthService();
