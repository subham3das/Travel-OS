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
} from '../utils/errors.util.js';
import { IUser } from '../models/user.model.js';
import { logger } from '../config/logger.config.js';
import { DateUtil } from '../utils/date.util.js';

export class AuthService {
  /**
   * Helper to format public user DTO with progress flags
   */
  public formatUserDTO(user: IUser) {
    return {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar || user.profileImage || '',
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
      onboarding: {
        profileCompleted: user.profileCompleted,
        preferenceCompleted: user.preferenceCompleted,
        notificationsCompleted: user.notificationsCompleted,
        privacyCompleted: user.privacyCompleted,
        onboardingCompleted: user.onboardingCompleted,
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
      throw new ConflictError('An account with this email address already exists');
    }

    // 2. Check duplicate phone
    const existingPhone = await userRepository.findByPhone(payload.phone);
    if (existingPhone) {
      throw new ConflictError('An account with this phone number already exists');
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
    logger.debug('✉️ Email Verification Token generated for %s: %s', newUser.email, verificationToken);

    // 6. Generate Tokens
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
      verificationToken, // Provided for easy development / verification flow
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
      throw new UnauthorizedError('Invalid email or password credentials');
    }

    if (!user.password) {
      throw new UnauthorizedError('This account was created with OAuth. Please log in with Google.');
    }

    const isPasswordValid = await HashUtil.compare(credentials.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password credentials');
    }

    if (user.status !== 'Active') {
      throw new ForbiddenError(`Your account is currently ${user.status}. Please contact customer support.`);
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
   * Forgot Password
   */
  public async forgotPassword(email: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      // Return true to avoid user enumeration attacks
      return { message: 'If an account exists with this email, a password reset link has been dispatched.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    await passwordResetRepository.create({
      userId: user._id as mongoose.Types.ObjectId,
      email: user.email,
      token: resetToken,
      expiresAt: DateUtil.addMinutes(new Date(), 60), // 1 hour
    });

    logger.info('🔒 Password reset token generated for: %s', user.email);
    logger.debug('Password reset token: %s', resetToken);

    return {
      message: 'If an account exists with this email, a password reset link has been dispatched.',
      resetToken, // Returned in dev mode for seamless testing
    };
  }

  /**
   * Reset Password
   */
  public async resetPassword(token: string, newPass: string) {
    const validReset = await passwordResetRepository.findValidToken(token);
    if (!validReset) {
      throw new BadRequestError('Password reset link is invalid or has expired');
    }

    const hashedPassword = await HashUtil.hash(newPass);
    await userRepository.updatePassword(validReset.userId, hashedPassword);
    await passwordResetRepository.markUsed(token);

    // Invalidate all active sessions for security
    await refreshTokenRepository.revokeAllUserTokens(validReset.userId);

    logger.info('✅ Password successfully reset for user: %s', validReset.userId);
    return { message: 'Password has been successfully updated. Please log in with your new password.' };
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
