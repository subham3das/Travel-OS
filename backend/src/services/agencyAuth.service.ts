import crypto from 'crypto';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { AgencyModel, IAgency } from '../models/agency.model.js';
import { PartnerUserModel, IPartnerUser } from '../models/partnerUser.model.js';
import { PartnerOtpModel } from '../models/partnerOtp.model.js';
import { TokenUtil } from '../utils/token.util.js';
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

  /**
   * STEP 1: Register partner user account
   */
  public async registerAccount(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<{ userId: string; email: string; phone: string; message: string; debugOtp?: string }> {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanPhone = data.phone.trim().replace(/^\+91/, '').replace(/\D/g, '');
    const cleanName = data.name.trim();

    // Check unique email & phone
    const existing = await PartnerUserModel.findOne({
      $or: [{ email: cleanEmail }, { phone: cleanPhone }],
    });

    if (existing) {
      if (existing.emailVerified) {
        const error: any = new Error('An active partner account already exists with this email or phone. Please log in.');
        error.statusCode = 409;
        throw error;
      }
      // If unverified, update details & password
      existing.name = cleanName;
      existing.email = cleanEmail;
      existing.phone = cleanPhone;
      existing.passwordHash = await bcrypt.hash(data.password, 10);
      await existing.save();

      // Issue 6-digit email OTP (10 mins)
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpHash = await bcrypt.hash(otp, 8);
      await PartnerOtpModel.deleteMany({ userId: existing._id, type: 'email' });
      await PartnerOtpModel.create({
        userId: existing._id,
        type: 'email',
        identifier: cleanEmail,
        otpHash,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      });

      await mailService.sendPartnerOtpEmail({
        to: cleanEmail,
        recipientName: cleanName,
        otp,
        expiresInMinutes: 10,
      });

      logger.info(`[PartnerAuth] Re-registration: OTP generated for ${cleanEmail}: ${otp}`);

      return {
        userId: existing._id.toString(),
        email: cleanEmail,
        phone: cleanPhone,
        message: 'Account created. Verification code sent to your email.',
        debugOtp: process.env.NODE_ENV !== 'production' ? otp : undefined,
      };
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await PartnerUserModel.create({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      passwordHash,
      emailVerified: false,
      phoneVerified: false,
      role: 'partner',
    });

    // Issue 6-digit email OTP (10 mins)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 8);
    await PartnerOtpModel.create({
      userId: user._id,
      type: 'email',
      identifier: cleanEmail,
      otpHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await mailService.sendPartnerOtpEmail({
      to: cleanEmail,
      recipientName: cleanName,
      otp,
      expiresInMinutes: 10,
    });

    logger.info(`[PartnerAuth] Registration: OTP generated for ${cleanEmail}: ${otp}`);

    return {
      userId: user._id.toString(),
      email: cleanEmail,
      phone: cleanPhone,
      message: 'Account created. Verification code sent to your email.',
      debugOtp: process.env.NODE_ENV !== 'production' ? otp : undefined,
    };
  }

  /**
   * STEP 2: Verify Email OTP -> Auto-Login with JWT
   */
  public async verifyEmailOtp(
    userId: string,
    otp: string
  ): Promise<{
    success: boolean;
    token: string;
    user: any;
    businesses: any[];
    message: string;
  }> {
    const user = await PartnerUserModel.findById(userId);
    if (!user) {
      const error: any = new Error('Partner account not found.');
      error.statusCode = 404;
      throw error;
    }

    const activeOtp = await PartnerOtpModel.findOne({
      userId: user._id,
      type: 'email',
      verified: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!activeOtp) {
      const error: any = new Error('Verification code has expired or was not requested. Please request a new code.');
      error.statusCode = 400;
      throw error;
    }

    const isMatch = await bcrypt.compare(otp.trim(), activeOtp.otpHash);
    if (!isMatch) {
      const error: any = new Error('Invalid 6-digit verification code. Please check and try again.');
      error.statusCode = 400;
      throw error;
    }

    activeOtp.verified = true;
    await activeOtp.save();

    user.emailVerified = true;
    await user.save();

    // Auto Login - immediately issue JWT
    const token = TokenUtil.signAccessToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      phone: user.phone,
      userType: 'agency',
      role: 'owner',
    });

    // Fetch existing businesses owned by this user
    const businesses = await AgencyModel.find({
      ownerId: user._id,
      isDeleted: false,
    }).lean();

    return {
      success: true,
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        emailVerified: user.emailVerified,
        role: user.role,
      },
      businesses,
      message: 'Email verified successfully. You are logged in.',
    };
  }

  /**
   * Resend Email OTP (60s cooldown)
   */
  public async resendEmailOtp(userId: string): Promise<{ success: boolean; message: string; debugOtp?: string }> {
    const user = await PartnerUserModel.findById(userId);
    if (!user) {
      const error: any = new Error('Partner account not found.');
      error.statusCode = 404;
      throw error;
    }

    const latest = await PartnerOtpModel.findOne({
      userId: user._id,
      type: 'email',
    }).sort({ createdAt: -1 });

    if (latest && Date.now() - new Date(latest.lastSentAt).getTime() < 60 * 1000) {
      const secondsLeft = Math.ceil((60 * 1000 - (Date.now() - new Date(latest.lastSentAt).getTime())) / 1000);
      const error: any = new Error(`Please wait ${secondsLeft} seconds before requesting a new code.`);
      error.statusCode = 429;
      throw error;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 8);

    await PartnerOtpModel.deleteMany({ userId: user._id, type: 'email' });
    await PartnerOtpModel.create({
      userId: user._id,
      type: 'email',
      identifier: user.email,
      otpHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      lastSentAt: new Date(),
    });

    await mailService.sendPartnerOtpEmail({
      to: user.email,
      recipientName: user.name,
      otp,
      expiresInMinutes: 10,
    });

    logger.info(`[PartnerAuth] Resend Email OTP for ${user.email}: ${otp}`);

    return {
      success: true,
      message: 'A new 6-digit code has been sent to your email.',
      debugOtp: process.env.NODE_ENV !== 'production' ? otp : undefined,
    };
  }

  /**
   * SaaS Partner Login
   * Checks PartnerUserModel -> if unverified prompts OTP -> returns businesses
   * Fallback to legacy AgencyModel if user is an existing legacy agency
   */
  public async loginSaaS(
    email: string,
    pass: string
  ): Promise<{
    token: string;
    user: any;
    agency?: any;
    businesses: any[];
    requiresVerification?: boolean;
    emailVerified?: boolean;
    phoneVerified?: boolean;
    userId?: string;
  }> {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Check PartnerUserModel
    const partnerUser = await PartnerUserModel.findOne({ email: cleanEmail });
    if (partnerUser) {
      const isPassValid = await bcrypt.compare(pass, partnerUser.passwordHash);
      if (!isPassValid) {
        const error: any = new Error('Invalid email or password.');
        error.statusCode = 401;
        throw error;
      }

      // Check verification - Email OTP only
      if (!partnerUser.emailVerified) {
        return {
          token: '',
          user: null,
          businesses: [],
          requiresVerification: true,
          emailVerified: partnerUser.emailVerified,
          userId: partnerUser._id.toString(),
        };
      }

      const rawBusinesses = await AgencyModel.find({
        ownerId: partnerUser._id,
        isDeleted: false,
      }).lean();

      const businesses = rawBusinesses.map((biz: any) => {
        const isApproved = biz.verificationStatus === 'APPROVED' || biz.status === 'ACTIVE' || biz.carRentalVerificationStatus === 'APPROVED';
        const isRejected = biz.verificationStatus === 'REJECTED' || biz.status === 'REJECTED';
        const onboardingStatus = biz.onboardingStatus || (isApproved ? 'APPROVED' : isRejected ? 'REJECTED' : biz.paymentStatus === 'PAID' ? 'UNDER_REVIEW' : 'PAYMENT_PENDING');
        return { ...biz, onboardingStatus };
      });

      const activeBusiness = businesses[0] || null;

      const token = TokenUtil.signAccessToken({
        userId: partnerUser._id.toString(),
        agencyId: activeBusiness?._id?.toString() || undefined,
        customAgencyId: activeBusiness?.agencyId,
        email: partnerUser.email,
        name: partnerUser.name,
        phone: partnerUser.phone,
        userType: 'agency',
        role: 'owner',
      });

      return {
        token,
        user: {
          id: partnerUser._id.toString(),
          name: partnerUser.name,
          email: partnerUser.email,
          phone: partnerUser.phone,
          emailVerified: partnerUser.emailVerified,
          role: partnerUser.role,
        },
        agency: activeBusiness,
        businesses,
      };
    }

    // 2. Fallback: Legacy AgencyModel
    const legacyAgency = await AgencyModel.findOne({
      $or: [{ email: cleanEmail }, { loginEmail: cleanEmail }, { 'owner.email': cleanEmail }],
      isDeleted: false,
    });

    if (legacyAgency && legacyAgency.passwordHash) {
      const isPassValid = await bcrypt.compare(pass, legacyAgency.passwordHash);
      if (!isPassValid) {
        const error: any = new Error('Invalid email or password.');
        error.statusCode = 401;
        throw error;
      }

      const token = TokenUtil.signAccessToken({
        userId: legacyAgency._id.toString(),
        agencyId: legacyAgency._id.toString(),
        customAgencyId: legacyAgency.agencyId,
        email: legacyAgency.loginEmail || legacyAgency.email,
        name: legacyAgency.owner?.name || legacyAgency.ownerName || legacyAgency.name,
        phone: legacyAgency.owner?.phone || legacyAgency.phone,
        userType: 'agency',
        role: 'owner',
      });

      const user = {
        id: legacyAgency._id.toString(),
        name: legacyAgency.owner?.name || legacyAgency.ownerName || legacyAgency.name,
        email: legacyAgency.email,
        phone: legacyAgency.phone,
        role: 'owner',
        emailVerified: true,
        phoneVerified: true,
      };

      return {
        token,
        user,
        agency: legacyAgency,
        businesses: [legacyAgency],
      };
    }

    const error: any = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  /**
   * STEP 6: Create Business (linked to authenticated user)
   */
  public async createBusiness(
    userContext: { userId: string; name?: string; email?: string; phone?: string },
    data: any
  ): Promise<any> {
    const isCarRental = data.businessType === 'car_rental';
    const year = new Date().getFullYear();
    const prefix = isCarRental ? 'CR-REQ' : 'AGY-REQ';
    const applicationId = `${prefix}-${year}-${Math.floor(10000 + Math.random() * 90000)}`;

    const ownerId = new mongoose.Types.ObjectId(userContext.userId);
    const ownerName = userContext.name || data.ownerName || 'Partner Owner';
    const email = (userContext.email || data.email || '').toLowerCase().trim();
    const phone = userContext.phone || data.phone || '';

    let business = await AgencyModel.findOne({
      $or: [
        { ownerId },
        { email },
        { loginEmail: email },
        { 'owner.email': email },
      ],
      isDeleted: false,
    });

    const businessData: any = {
      ownerId,
      name: (data.name || data.businessName || data.agencyDisplayName || 'My Business').trim(),
      legalBusinessName: data.legalBusinessName || data.name,
      agencyDisplayName: data.agencyDisplayName || data.name,
      email,
      loginEmail: email,
      phone,
      ownerName,
      owner: {
        name: ownerName,
        email,
        phone,
        panNumber: data.panNumber || '',
      },
      businessType: isCarRental ? 'Car Rental' : 'Travel Agency',
      businessTypes: [isCarRental ? 'car_rental' : 'agency'],
      activeBusiness: isCarRental ? 'car_rental' : 'agency',
      businessAddress: data.businessAddress || data.officeAddress,
      city: data.city,
      state: data.state,
      pinCode: data.pinCode,
      country: data.country || 'India',
      gstNumber: data.gstNumber || '',
      panNumber: data.panNumber || '',
      yearEstablished: data.yearEstablished || '',
      registrationNumber: data.registrationNumber || '',
      website: data.website || '',
      carRentalProfile: isCarRental
        ? {
            businessName: data.name,
            ownerName,
            phone,
            email,
            address: data.businessAddress,
            city: data.city,
            state: data.state,
            pinCode: data.pinCode,
            fleetSize: data.fleetSize || 1,
            supportedVehicleServices: data.supportedVehicleServices || ['self_drive_car'],
          }
        : undefined,
    };

    if (business) {
      Object.assign(business, businessData);
      await business.save();
      return business;
    }

    businessData.applicationId = applicationId;
    businessData.paymentStatus = 'PENDING';
    businessData.approvalStatus = 'PENDING';
    businessData.verificationStatus = 'PENDING';
    businessData.status = 'PENDING';
    businessData.onboardingStatus = 'PAYMENT_PENDING';
    businessData.timeline = [
      {
        id: `t-${Date.now()}`,
        title: 'Business Registration Started',
        timestamp: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        completed: true,
        desc: `${isCarRental ? 'Car Rental' : 'Travel Agency'} business profile created. Ready for registration fee.`,
      },
    ];

    const newBusiness = await AgencyModel.create(businessData);
    return newBusiness;
  }

  /**
   * Get all businesses owned by user
   */
  public async getMyBusinesses(userId: string): Promise<any[]> {
    const list = await AgencyModel.find({
      $or: [
        { ownerId: new mongoose.Types.ObjectId(userId) },
        { _id: mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : null },
      ],
      isDeleted: false,
    }).lean();

    return list.map((biz: any) => {
      const isApproved = biz.verificationStatus === 'APPROVED' || biz.status === 'ACTIVE' || biz.carRentalVerificationStatus === 'APPROVED';
      const isRejected = biz.verificationStatus === 'REJECTED' || biz.status === 'REJECTED';
      const onboardingStatus = biz.onboardingStatus || (isApproved ? 'APPROVED' : isRejected ? 'REJECTED' : biz.paymentStatus === 'PAID' ? 'UNDER_REVIEW' : 'PAYMENT_PENDING');
      return { ...biz, onboardingStatus };
    });
  }
}

export const agencyAuthService = new AgencyAuthService();
