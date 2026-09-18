import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { AgencyModel, IAgency } from '../models/agency.model.js';
import { envConfig } from '../config/env.config.js';
import { mailService } from './mail.service.js';
import { AuditLoggerService } from './auditLogger.service.js';
import { logger } from '../config/logger.config.js';

export class AgencyAuthService {
  // In-memory rate limiting tracking structures
  private static emailResetAttempts = new Map<string, number[]>();
  private static ipResetAttempts = new Map<string, number[]>();

  /**
   * Helper method to enforce rate limits: max `limit` calls per `windowMs`
   */
  private checkRateLimit(key: string, map: Map<string, number[]>, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const timestamps = (map.get(key) || []).filter((time) => now - time < windowMs);

    if (timestamps.length >= limit) {
      return false;
    }

    timestamps.push(now);
    map.set(key, timestamps);
    return true;
  }

  /**
   * Initiates the secure password reset flow for an agency.
   * Uses SHA-256 hashed single-use tokens and 15-minute expiration.
   * Protects against email enumeration attacks.
   */
  public async forgotPassword(email: string, clientIp: string = '127.0.0.1'): Promise<{ success: boolean; message: string }> {
    const cleanEmail = email.trim().toLowerCase();
    const genericSuccessMessage = "If an account exists with this email, we've sent password reset instructions.";

    // 1. Enforce Rate Limiting (5 requests per email per hour & 5 requests per IP per hour)
    const isEmailAllowed = this.checkRateLimit(`agency_email:${cleanEmail}`, AgencyAuthService.emailResetAttempts, 5, 60 * 60 * 1000);
    const isIpAllowed = this.checkRateLimit(`agency_ip:${clientIp}`, AgencyAuthService.ipResetAttempts, 5, 60 * 60 * 1000);

    if (!isEmailAllowed || !isIpAllowed) {
      const error: any = new Error('Too many password reset requests. Please try again after 1 hour.');
      error.statusCode = 429;
      throw error;
    }

    // 2. Find Agency by email, owner.email, or loginEmail
    const agency: IAgency | null = await AgencyModel.findOne({
      $or: [{ email: cleanEmail }, { 'owner.email': cleanEmail }, { loginEmail: cleanEmail }],
      isDeleted: false,
    });

    // 3. Anti-Enumeration: If agency doesn't exist, return generic message without revealing existence
    if (!agency) {
      logger.info(`[AgencyAuth] Password reset requested for non-existent email: ${cleanEmail} from IP: ${clientIp}`);
      return {
        success: true,
        message: genericSuccessMessage,
      };
    }

    // 4. Generate cryptographically secure random token (32 bytes = 64 hex chars)
    const rawToken = crypto.randomBytes(32).toString('hex');

    // 5. Hash token using SHA-256 for secure DB storage (never store raw tokens)
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    // 6. Set 15-minute expiration
    const resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

    agency.resetPasswordToken = hashedToken;
    agency.resetPasswordExpires = resetPasswordExpires;
    await agency.save();

    // 7. Construct password reset URL
    const frontendUrl = envConfig.FRONTEND_URL || envConfig.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/agency/reset-password?token=${rawToken}`;

    const agencyDisplayName =
      agency.agencyDisplayName ||
      agency.legalBusinessName ||
      agency.name ||
      agency.owner?.name ||
      agency.ownerName ||
      'Partner';

    const targetEmail = agency.loginEmail || agency.email || agency.owner?.email || cleanEmail;

    // 8. Dispatch Professional HTML Email via background task
    mailService
      .sendAgencyPasswordResetEmail(targetEmail, agencyDisplayName, resetUrl)
      .catch((err) => {
        logger.error(`[AgencyAuth] Failed to dispatch password reset email to ${targetEmail}:`, err);
      });

    // 9. Write Security Audit Log
    await AuditLoggerService.log({
      actor: {
        id: agency._id.toString(),
        name: agency.name,
        email: targetEmail,
        role: 'Agency',
      },
      module: 'AgencyAuth',
      action: 'Password reset requested',
      eventType: 'SECURITY_PASSWORD_RESET_REQUESTED',
      description: `Password reset link generated and dispatched for agency "${agency.name}" (${agency.agencyId || agency.applicationId})`,
      ipAddress: clientIp,
      severity: 'Low',
      status: 'Success',
      metadata: {
        agencyId: agency.agencyId,
        applicationId: agency.applicationId,
        email: cleanEmail,
      },
    });

    return {
      success: true,
      message: genericSuccessMessage,
    };
  }

  /**
   * Completes the password reset process using the raw token.
   * Validates token hash, expiration, password complexity, updates password,
   * invalidates active JWT sessions, and records audit trail.
   */
  public async resetPassword(
    data: { token: string; password: string; confirmPassword?: string },
    clientIp: string = '127.0.0.1'
  ): Promise<{ success: boolean; message: string }> {
    const { token, password } = data;

    if (!token || typeof token !== 'string' || token.trim() === '') {
      const error: any = new Error('Password reset token is required.');
      error.statusCode = 400;
      throw error;
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      const error: any = new Error('Password must be at least 8 characters long.');
      error.statusCode = 400;
      throw error;
    }

    // 1. Hash the incoming token with SHA-256 to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token.trim()).digest('hex');

    // 2. Find agency with matching hashed token and valid expiration
    const agency: IAgency | null = await AgencyModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
      isDeleted: false,
    });

    if (!agency) {
      const error: any = new Error('Reset link has expired or is invalid.');
      error.statusCode = 400;
      throw error;
    }

    // 3. Hash new password using bcrypt
    const passwordHash = await bcrypt.hash(password.trim(), 12);

    // 4. Update agency record, invalidate sessions, and clear single-use token
    agency.passwordHash = passwordHash;
    agency.passwordChanged = true;
    agency.passwordChangedAt = new Date();
    agency.resetPasswordToken = undefined;
    agency.resetPasswordExpires = undefined;
    agency.tokenVersion = (agency.tokenVersion || 0) + 1;
    agency.lastLogin = new Date();

    await agency.save();

    // 5. Write Security Audit Log
    await AuditLoggerService.log({
      actor: {
        id: agency._id.toString(),
        name: agency.name,
        email: agency.loginEmail || agency.email,
        role: 'Agency',
      },
      module: 'AgencyAuth',
      action: 'Password reset completed',
      eventType: 'SECURITY_PASSWORD_RESET_COMPLETED',
      description: `Password reset completed successfully for agency "${agency.name}" (${agency.agencyId || agency.applicationId})`,
      ipAddress: clientIp,
      severity: 'Medium',
      status: 'Success',
      metadata: {
        agencyId: agency.agencyId,
        applicationId: agency.applicationId,
        email: agency.loginEmail || agency.email,
      },
    });

    return {
      success: true,
      message: 'Password reset successful. Please log in with your new password.',
    };
  }
}

export const agencyAuthService = new AgencyAuthService();
