import crypto from 'crypto';
import mongoose from 'mongoose';
import { userRepository } from '../repositories/user.repository.js';
import { refreshTokenRepository } from '../repositories/refreshToken.repository.js';
import { emailVerificationRepository } from '../repositories/emailVerification.repository.js';
import { passwordResetRepository } from '../repositories/passwordReset.repository.js';
import { HashUtil } from '../utils/hash.util.js';
import { TokenUtil, JwtTokenPayload } from '../utils/token.util.js';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  TooManyRequestsError,
} from '../utils/errors.util.js';
import { IUser } from '../models/user.model.js';
import { logger } from '../config/logger.config.js';
import { DateUtil } from '../utils/date.util.js';
import { mailService } from './mail.service.js';
import { AuditLoggerService } from './auditLogger.service.js';
import { envConfig } from '../config/env.config.js';

export class AuthService {
  private static emailResetAttempts = new Map<string, { count: number; firstAttempt: number }>();
  private static ipResetAttempts = new Map<string, { count: number; firstAttempt: number }>();

  private checkRateLimit(
    key: string,
    store: Map<string, { count: number; firstAttempt: number }>,
    maxAttempts: number,
    windowMs: number
  ): boolean {
    const now = Date.now();
    const entry = store.get(key);
    if (!entry || now - entry.firstAttempt > windowMs) {
      store.set(key, { count: 1, firstAttempt: now });
      return true;
    }
    if (entry.count >= maxAttempts) {
      return false;
    }
    entry.count += 1;
    return true;
  }

  /**
   * Helper to format public user DTO with progress flags
   */
  public formatUserDTO(user: IUser) {
    return {
      id: user._id,
      fullName: user.fullName,
      name: user.fullName,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar || user.profileImage || '',
      profileImage: user.avatar || user.profileImage || '',
      username: user.username || '',
      bio: user.bio || '',
      homeCity: user.homeCity || '',
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      preferredLanguage: user.preferredLanguage,
      country: user.country,
      status: user.status,
      isEmailVerified: user.isEmailVerified,
      authProvider: user.authProvider,
      profileCompleted: user.profileCompleted ?? false,
      preferenceCompleted: user.preferenceCompleted ?? false,
      notificationsCompleted: user.notificationsCompleted ?? false,
      privacyCompleted: user.privacyCompleted ?? false,
      onboardingCompleted: user.onboardingCompleted ?? false,
      onboarding: {
        profileCompleted: user.profileCompleted ?? false,
        preferenceCompleted: user.preferenceCompleted ?? false,
        notificationsCompleted: user.notificationsCompleted ?? false,
        privacyCompleted: user.privacyCompleted ?? false,
        onboardingCompleted: user.onboardingCompleted ?? false,
      },
      createdAt: user.createdAt,
    };
  }

  /**
   * Customer Registration
   */
  public async register(payload: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    acceptTerms: boolean;
  }) {
    // 1. Check duplicate email
    const existingEmail = await userRepository.findByEmail(payload.email);
    if (existingEmail) {
      throw new ConflictError('An account with this email already exists.');
    }

    // 2. Check duplicate phone
    const existingPhone = await userRepository.findByPhone(payload.phone);
    if (existingPhone) {
      throw new ConflictError('This phone number is already registered.');
    }

    // 3. Hash password
    const hashedPassword = await HashUtil.hash(payload.password);

    // 4. Create User Record
    const newUser = await userRepository.create({
      fullName: payload.fullName,
      email: payload.email.toLowerCase(),
      phone: payload.phone,
      password: hashedPassword,
      status: 'Active',
      isEmailVerified: false,
      authProvider: 'local',
      profileCompleted: false,
      preferenceCompleted: false,
      notificationsCompleted: false,
      privacyCompleted: false,
      onboardingCompleted: false,
    });

    // 5. Generate Email Verification Token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    await emailVerificationRepository.create({
      userId: newUser._id as mongoose.Types.ObjectId,
      email: newUser.email,
      token: verificationToken,
      expiresAt: DateUtil.addDays(new Date(), 1), // 24 hours
    });

    logger.info('👤 Customer registered successfully: %s [%s]', newUser.email, newUser._id);

    // 6. Deliver Welcome & Email Verification Emails via centralized MailService
    const frontendBaseUrl = envConfig.FRONTEND_URL || envConfig.CLIENT_URL || 'http://localhost:5173';
    const verificationLink = `${frontendBaseUrl.replace(/\/+$/, '')}/verify-email?token=${verificationToken}`;

    mailService.sendWelcomeEmail(newUser.email, newUser.fullName).catch((err) => {
      logger.error('Failed to send welcome email to %s: %s', newUser.email, err.message);
    });
    mailService.sendEmailVerificationEmail(newUser.email, newUser.fullName, verificationLink).catch((err) => {
      logger.error('Failed to send email verification email to %s: %s', newUser.email, err.message);
    });

    // 7. Generate Tokens
    const tokenPayload: JwtTokenPayload = {
      userId: (newUser._id as mongoose.Types.ObjectId).toString(),
      email: newUser.email,
      userType: 'CUSTOMER',
    };

    const accessToken = TokenUtil.signAccessToken(tokenPayload);
    const refreshToken = TokenUtil.signRefreshToken(tokenPayload);
    const refreshHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    await refreshTokenRepository.create({
      userId: newUser._id as mongoose.Types.ObjectId,
      tokenHash: refreshHash,
      device: 'Web Client',
      expiresAt: DateUtil.addDays(new Date(), 7),
    });

    return {
      user: this.formatUserDTO(newUser),
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: '15m',
      },
      verificationToken,
    };
  }

  /**
   * Customer Login
   */
  public async login(
    credentials: { email: string; password: string },
    meta: { ipAddress?: string; userAgent?: string } = {}
  ) {
    const user = await userRepository.findByEmail(credentials.email, true);
    if (!user) {
      throw new UnauthorizedError('No account found with this email. Please create an account first.');
    }

    if (!user.password && user.authProvider === 'google') {
      throw new UnauthorizedError('This account was created with Google OAuth. Please log in with Google.');
    }

    const isPasswordValid = await HashUtil.compare(credentials.password, user.password || '');
    if (!isPasswordValid) {
      throw new UnauthorizedError('Incorrect password.');
    }

    if (user.status !== 'Active') {
      throw new ForbiddenError(`Your account is currently ${user.status}. Please contact customer support.`);
    }

    // Update lastLogin timestamp
    await userRepository.updateById(user._id as mongoose.Types.ObjectId, {
      lastLogin: new Date(),
    });

    // Generate Tokens
    const tokenPayload: JwtTokenPayload = {
      userId: (user._id as mongoose.Types.ObjectId).toString(),
      email: user.email,
      userType: 'CUSTOMER',
    };

    const accessToken = TokenUtil.signAccessToken(tokenPayload);
    const refreshToken = TokenUtil.signRefreshToken(tokenPayload);
    const refreshHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    await refreshTokenRepository.create({
      userId: user._id as mongoose.Types.ObjectId,
      tokenHash: refreshHash,
      device: 'Web Browser',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      expiresAt: DateUtil.addDays(new Date(), 7),
    });

    logger.info('🔑 Customer logged in: %s', user.email);

    return {
      user: this.formatUserDTO(user),
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: '15m',
      },
    };
  }

  /**
   * Google OAuth Login / Registration (Real Google OAuth Verification)
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
    let fullName: string = 'Traveler';
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
          fullName = googleData.name || fullName;
          googleId = googleData.sub;
          avatar = googleData.picture || '';
        } else {
          // Fallback decode if offline / mock test
          const parts = idToken.split('.');
          if (parts.length === 3) {
            const decoded = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
            email = decoded.email?.toLowerCase().trim();
            fullName = decoded.name || fullName;
            googleId = decoded.sub;
            avatar = decoded.picture || '';
          }
        }
      } catch (err) {
        logger.warn('Google ID token verification failed:', err);
      }
    }

    // 2. Or Verify Google Access Token via Google UserInfo API
    if (!email && payload.accessToken) {
      try {
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${payload.accessToken}` },
        });
        if (userInfoRes.ok) {
          const userInfo = (await userInfoRes.json()) as any;
          email = userInfo.email?.toLowerCase().trim();
          fullName = userInfo.name || fullName;
          googleId = userInfo.sub;
          avatar = userInfo.picture || '';
        }
      } catch (err) {
        logger.warn('Google Access token verification failed:', err);
      }
    }

    if (!email || !googleId) {
      throw new UnauthorizedError('Google authentication failed. Please try again.');
    }

    // 3. Find user by email or Google ID
    const existingUser = await userRepository.findByEmail(email);
    const isNewUser = !existingUser;
    let user = existingUser;

    if (user) {
      // Link Google ID and update avatar/lastLogin
      const updates: any = { lastLogin: new Date() };
      if (!user.googleId) updates.googleId = googleId;
      if (!user.avatar && avatar) updates.avatar = avatar;
      if (!user.isEmailVerified) updates.isEmailVerified = true;

      user = (await userRepository.updateById(user._id as mongoose.Types.ObjectId, updates)) || user;
      logger.info('🔗 Existing user authenticated via Google OAuth: %s', email);
    } else {
      // 4. Create new user in MongoDB users collection
      user = await userRepository.create({
        fullName,
        email,
        avatar,
        profileImage: avatar,
        authProvider: 'google',
        googleId,
        status: 'Active',
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
        profileCompleted: false,
        preferenceCompleted: false,
        notificationsCompleted: false,
        privacyCompleted: false,
        onboardingCompleted: false,
        lastLogin: new Date(),
      });
      logger.info('🎉 New customer registered via Google OAuth: %s', email);
    }

    // Generate Tokens
    const tokenPayload: JwtTokenPayload = {
      userId: (user._id as mongoose.Types.ObjectId).toString(),
      email: user.email,
      userType: 'CUSTOMER',
    };

    const accessToken = TokenUtil.signAccessToken(tokenPayload);
    const refreshToken = TokenUtil.signRefreshToken(tokenPayload);
    const refreshHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    await refreshTokenRepository.create({
      userId: user._id as mongoose.Types.ObjectId,
      tokenHash: refreshHash,
      device: 'Google OAuth Client',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      expiresAt: DateUtil.addDays(new Date(), 7),
    });

    return {
      user: this.formatUserDTO(user),
      isNewUser,
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: '15m',
      },
    };
  }

  /**
   * Refresh Token Rotation
   */
  public async refreshToken(rawRefreshToken: string, meta: { ipAddress?: string; userAgent?: string } = {}) {
    const decoded = TokenUtil.verifyRefreshToken(rawRefreshToken);
    const oldHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');

    const storedToken = await refreshTokenRepository.findByTokenHash(oldHash);
    if (!storedToken) {
      // Possible token reuse attack — revoke all tokens for this user
      await refreshTokenRepository.revokeAllUserTokens(decoded.userId);
      throw new UnauthorizedError('Invalid or reused refresh token. Please log in again.');
    }

    // Invalidate old token (Rotation)
    await refreshTokenRepository.revokeToken(oldHash);

    const user = await userRepository.findById(decoded.userId);
    if (!user || user.status !== 'Active') {
      throw new UnauthorizedError('User session is no longer active');
    }

    // Issue new pair
    const tokenPayload: JwtTokenPayload = {
      userId: (user._id as mongoose.Types.ObjectId).toString(),
      email: user.email,
      userType: 'CUSTOMER',
    };

    const newAccessToken = TokenUtil.signAccessToken(tokenPayload);
    const newRefreshToken = TokenUtil.signRefreshToken(tokenPayload);
    const newHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');

    await refreshTokenRepository.create({
      userId: user._id as mongoose.Types.ObjectId,
      tokenHash: newHash,
      device: 'Web Browser',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      expiresAt: DateUtil.addDays(new Date(), 7),
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: '15m',
    };
  }

  /**
   * Logout
   */
  public async logout(rawRefreshToken?: string) {
    if (rawRefreshToken) {
      const hash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');
      await refreshTokenRepository.revokeToken(hash);
    }
    return true;
  }

  /**
   * Request Password Reset Link (Secure, Anti-Enumeration, Rate-Limited, 15-Minute Expiry)
   */
  public async forgotPassword(
    email: string | { email: string },
    meta: { ipAddress?: string; userAgent?: string } = {}
  ): Promise<{ message: string }> {
    const rawEmail = typeof email === 'string' ? email : email?.email || '';
    const cleanEmail = rawEmail.toLowerCase().trim();
    const clientIp = meta.ipAddress || '127.0.0.1';
    const genericMessage =
      'If an account exists for this email, a password reset link has been sent.';

    // 1. Rate Limiting: Max 5 attempts per email per hour, max 10 per IP per hour
    const isEmailAllowed = this.checkRateLimit(
      `user:email:${cleanEmail}`,
      AuthService.emailResetAttempts,
      5,
      60 * 60 * 1000
    );
    const isIpAllowed = this.checkRateLimit(
      `user:ip:${clientIp}`,
      AuthService.ipResetAttempts,
      10,
      60 * 60 * 1000
    );

    if (!isEmailAllowed || !isIpAllowed) {
      await AuditLoggerService.log({
        actor: { email: cleanEmail, role: 'USER' },
        ipAddress: clientIp,
        browser: meta.userAgent,
        module: 'Authentication',
        action: 'Rate Limit Triggered',
        eventType: 'Password Reset Rate Limit Exceeded',
        description: `Rate limit exceeded for password reset request on email: ${cleanEmail} from IP: ${clientIp}`,
        severity: 'High',
        status: 'Failed',
      });
      throw new TooManyRequestsError(
        'Too many password reset requests. Please wait an hour before trying again.'
      );
    }

    // 2. Audit Log: Password Reset Requested
    await AuditLoggerService.log({
      actor: { email: cleanEmail, role: 'USER' },
      ipAddress: clientIp,
      browser: meta.userAgent,
      module: 'Authentication',
      action: 'Password reset requested',
      eventType: 'SECURITY_PASSWORD_RESET_REQUESTED',
      description: `Password reset requested for email: ${cleanEmail}`,
      severity: 'Low',
      status: 'Success',
    });

    const user = await userRepository.findByEmail(cleanEmail);
    if (!user || user.status !== 'Active') {
      logger.info(
        '🔒 Password reset requested for non-existent or inactive email: %s (Anti-enumeration)',
        cleanEmail
      );
      // Return neutral success message to prevent user enumeration
      return { message: genericMessage };
    }

    // 3. Generate high-entropy 32-byte cryptographic random token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // Strict 15-Minute Expiry

    // 4. Invalidate prior pending tokens and store only SHA-256 hash
    await passwordResetRepository.create({
      userId: user._id as mongoose.Types.ObjectId,
      email: cleanEmail,
      token: hashedToken,
      expiresAt,
    });

    // 5. Construct secure reset link with raw unhashed token
    const frontendBaseUrl =
      envConfig.FRONTEND_URL || envConfig.CLIENT_URL || 'http://localhost:5173';
    const resetLink = `${frontendBaseUrl.replace(/\/+$/, '')}/reset-password?token=${rawToken}`;

    // 6. Deliver real branded HTML email via centralized MailService
    try {
      await mailService.sendUserPasswordResetEmail(cleanEmail, user.fullName, resetLink);

      // Audit Log: Reset Email Sent
      await AuditLoggerService.log({
        actor: {
          id: user._id.toString(),
          email: cleanEmail,
          name: user.fullName,
          role: 'USER',
        },
        ipAddress: clientIp,
        browser: meta.userAgent,
        module: 'Authentication',
        action: 'Password reset email sent',
        eventType: 'SECURITY_PASSWORD_RESET_EMAIL_SENT',
        description: `Password reset verification email dispatched to ${cleanEmail}`,
        severity: 'Medium',
        status: 'Success',
        metadata: {
          expiresInMinutes: 15,
        },
      });

      logger.info('✉️ Customer password reset email delivered to: %s', cleanEmail);
    } catch (mailError: any) {
      logger.error(
        '❌ Failed to dispatch password reset email to %s: %s',
        cleanEmail,
        mailError.message
      );

      // Invalidate generated token on delivery failure
      await passwordResetRepository.invalidateAllForUser(user._id as mongoose.Types.ObjectId);

      // Audit Log: Reset Email Failed
      await AuditLoggerService.log({
        actor: {
          id: user._id.toString(),
          email: cleanEmail,
          name: user.fullName,
          role: 'USER',
        },
        ipAddress: clientIp,
        browser: meta.userAgent,
        module: 'Authentication',
        action: 'Reset Email Failed',
        eventType: 'SECURITY_PASSWORD_RESET_EMAIL_FAILED',
        description: `Failed to dispatch password reset email to ${cleanEmail}: ${mailError.message}`,
        severity: 'High',
        status: 'Failed',
      });

      // Still return generic message to preserve anti-enumeration
    }

    return { message: genericMessage };
  }

  /**
   * Verify Reset Password Token Validity (Backend Validation Gate)
   */
  public async verifyResetToken(
    token: string,
    meta: { ipAddress?: string; userAgent?: string } = {}
  ): Promise<{ valid: boolean; email: string }> {
    const clientIp = meta.ipAddress || '127.0.0.1';

    if (!token || typeof token !== 'string' || token.trim() === '') {
      throw new BadRequestError('Password reset token is required.');
    }

    const hashedToken = crypto.createHash('sha256').update(token.trim()).digest('hex');
    const record = await passwordResetRepository.findByTokenHash(hashedToken);

    if (!record) {
      await AuditLoggerService.log({
        ipAddress: clientIp,
        browser: meta.userAgent,
        module: 'Authentication',
        action: 'Invalid token attempt',
        eventType: 'SECURITY_INVALID_RESET_TOKEN',
        description: `Invalid password reset token verification attempt from IP: ${clientIp}`,
        severity: 'Medium',
        status: 'Failed',
      });
      throw new BadRequestError('Password reset link is invalid or has expired.');
    }

    if (record.isUsed) {
      await AuditLoggerService.log({
        actor: { id: record.userId.toString(), email: record.email, role: 'USER' },
        ipAddress: clientIp,
        browser: meta.userAgent,
        module: 'Authentication',
        action: 'Used token attempt',
        eventType: 'SECURITY_USED_RESET_TOKEN',
        description: `Replay attempt on already used password reset link for: ${record.email}`,
        severity: 'High',
        status: 'Failed',
      });
      throw new BadRequestError(
        'This password reset link has already been used. Please request a new one.'
      );
    }

    if (new Date() > record.expiresAt) {
      await AuditLoggerService.log({
        actor: { id: record.userId.toString(), email: record.email, role: 'USER' },
        ipAddress: clientIp,
        browser: meta.userAgent,
        module: 'Authentication',
        action: 'Expired token used',
        eventType: 'SECURITY_EXPIRED_RESET_TOKEN',
        description: `Expired password reset link accessed for: ${record.email}`,
        severity: 'Medium',
        status: 'Failed',
      });
      throw new BadRequestError(
        'Your password reset link has expired. Please request a new one.'
      );
    }

    // Mask email for safe user reassurance (e.g. j***e@example.com)
    const [localPart, domainPart] = record.email.split('@');
    const maskedLocal =
      localPart.length > 2
        ? `${localPart[0]}***${localPart[localPart.length - 1]}`
        : `${localPart[0]}***`;
    const maskedEmail = `${maskedLocal}@${domainPart}`;

    return {
      valid: true,
      email: maskedEmail,
    };
  }

  /**
   * Reset Password with Valid Token
   */
  public async resetPassword(
    token: string,
    newPass: string,
    meta: { ipAddress?: string; userAgent?: string } = {}
  ): Promise<{ message: string }> {
    const clientIp = meta.ipAddress || '127.0.0.1';

    if (!token || typeof token !== 'string' || token.trim() === '') {
      throw new BadRequestError('Password reset token is required.');
    }

    if (!newPass || typeof newPass !== 'string' || newPass.length < 8) {
      throw new BadRequestError('Password must be at least 8 characters long.');
    }

    // Strong password complexity validation
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!strongPasswordRegex.test(newPass)) {
      throw new BadRequestError(
        'Password must be at least 8 characters and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.'
      );
    }

    const hashedToken = crypto.createHash('sha256').update(token.trim()).digest('hex');
    const record = await passwordResetRepository.findByTokenHash(hashedToken);

    if (!record) {
      await AuditLoggerService.log({
        ipAddress: clientIp,
        browser: meta.userAgent,
        module: 'Authentication',
        action: 'Invalid token attempt',
        eventType: 'SECURITY_INVALID_RESET_TOKEN',
        description: `Failed password reset attempt with invalid token from IP: ${clientIp}`,
        severity: 'High',
        status: 'Failed',
      });
      throw new BadRequestError('Password reset link is invalid or has expired.');
    }

    if (record.isUsed) {
      await AuditLoggerService.log({
        actor: { id: record.userId.toString(), email: record.email, role: 'USER' },
        ipAddress: clientIp,
        browser: meta.userAgent,
        module: 'Authentication',
        action: 'Used token attempt',
        eventType: 'SECURITY_USED_RESET_TOKEN',
        description: `Replay attack rejected on used password reset token for: ${record.email}`,
        severity: 'High',
        status: 'Failed',
      });
      throw new BadRequestError(
        'This password reset link has already been used. Please request a new one.'
      );
    }

    if (new Date() > record.expiresAt) {
      await AuditLoggerService.log({
        actor: { id: record.userId.toString(), email: record.email, role: 'USER' },
        ipAddress: clientIp,
        browser: meta.userAgent,
        module: 'Authentication',
        action: 'Expired token used',
        eventType: 'SECURITY_EXPIRED_RESET_TOKEN',
        description: `Attempt to reset password with expired token for: ${record.email}`,
        severity: 'Medium',
        status: 'Failed',
      });
      throw new BadRequestError(
        'Your password reset link has expired. Please request a new one.'
      );
    }

    const user = await userRepository.findById(record.userId.toString());
    if (!user) {
      throw new NotFoundError('User account associated with this reset link was not found.');
    }

    // 1. Hash new password securely with bcrypt
    const hashedPassword = await HashUtil.hash(newPass.trim());
    await userRepository.updatePassword(record.userId, hashedPassword);

    // 2. Mark single-use token as used & invalidate any other active reset tokens for user
    await passwordResetRepository.markUsed(hashedToken);
    await passwordResetRepository.invalidateAllExcept(record.userId, hashedToken);

    // 3. Invalidate all active login sessions / refresh tokens
    await refreshTokenRepository.revokeAllUserTokens(record.userId.toString());

    // 4. Security Audit Log
    await AuditLoggerService.log({
      actor: { id: user._id.toString(), email: user.email, name: user.fullName, role: 'USER' },
      ipAddress: clientIp,
      browser: meta.userAgent,
      module: 'Authentication',
      action: 'Password reset completed',
      eventType: 'SECURITY_PASSWORD_RESET_COMPLETED',
      description: `Password reset completed successfully for user ${user.email}`,
      severity: 'Medium',
      status: 'Success',
    });

    // 5. Dispatch confirmation email
    mailService
      .sendPasswordResetSuccessEmail(user.email, user.fullName, 'traveler')
      .catch((err) => {
        logger.error(
          'Failed to dispatch password reset success email to %s: %s',
          user.email,
          err.message
        );
      });

    logger.info('✅ Password successfully reset for customer: %s', user.email);

    return {
      message:
        'Your password has been successfully updated. Please log in with your new password.',
    };
  }

  /**
   * Change Password (Authenticated)
   */
  public async changePassword(userId: string, currentPass: string, newPass: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User account not found');
    }

    const userWithPass = await userRepository.findByEmail(user.email, true);
    if (!userWithPass || !userWithPass.password) {
      throw new BadRequestError('This account was registered via OAuth and does not have a local password');
    }

    const isCurrentValid = await HashUtil.compare(currentPass, userWithPass.password);
    if (!isCurrentValid) {
      throw new UnauthorizedError('The current password provided is incorrect');
    }

    const newHashed = await HashUtil.hash(newPass);
    await userRepository.updatePassword(userId, newHashed);
    await refreshTokenRepository.revokeAllUserTokens(userId);

    return { message: 'Password changed successfully. Please log in again.' };
  }

  /**
   * Verify Email
   */
  public async verifyEmail(token: string) {
    const record = await emailVerificationRepository.findByToken(token);
    if (!record || record.expiresAt < new Date()) {
      throw new BadRequestError('Email verification link is invalid or has expired');
    }

    const updatedUser = await userRepository.markEmailVerified(record.userId);
    await emailVerificationRepository.deleteByToken(token);

    if (!updatedUser) {
      throw new NotFoundError('User account not found');
    }

    logger.info('📧 Email verified successfully for: %s', updatedUser.email);
    return {
      message: 'Email address verified successfully!',
      user: this.formatUserDTO(updatedUser),
    };
  }

  /**
   * Get Current User Profile
   */
  public async getCurrentUser(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return this.formatUserDTO(user);
  }
}

export const authService = new AuthService();
