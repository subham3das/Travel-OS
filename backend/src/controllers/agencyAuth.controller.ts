import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { AgencyModel } from '../models/agency.model.js';
import { TokenUtil } from '../utils/token.util.js';
import { ResponseUtil } from '../utils/response.util.js';
import { HTTP_STATUS } from '../constants/http.constant.js';
import { agencyAuthService } from '../services/agencyAuth.service.js';

export class AgencyAuthController {
  /**
   * POST /api/agencies/auth/register-account (STEP 1: Create Account)
   */
  public registerAccount = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await agencyAuthService.registerAccount(req.body);
      ResponseUtil.success(res, result, result.message, HTTP_STATUS.CREATED);
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to create partner account.', error.statusCode || HTTP_STATUS.BAD_REQUEST);
    }
  };

  /**
   * POST /api/agencies/auth/verify-email-otp (STEP 2: Email OTP)
   */
  public verifyEmailOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, otp } = req.body;
      const result = await agencyAuthService.verifyEmailOtp(userId, otp);
      ResponseUtil.success(res, result, result.message, HTTP_STATUS.OK);
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to verify email code.', error.statusCode || HTTP_STATUS.BAD_REQUEST);
    }
  };

  /**
   * POST /api/agencies/auth/resend-email-otp
   */
  public resendEmailOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.body;
      const result = await agencyAuthService.resendEmailOtp(userId);
      ResponseUtil.success(res, result, result.message, HTTP_STATUS.OK);
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to resend email code.', error.statusCode || HTTP_STATUS.BAD_REQUEST);
    }
  };

  /**
   * POST /api/agencies/businesses/create (STEP 6: Create Business)
   */
  public createBusiness = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.agencyUser?.userId) {
        ResponseUtil.error(res, 'Authentication required to create business.', HTTP_STATUS.UNAUTHORIZED);
        return;
      }
      const business = await agencyAuthService.createBusiness(req.agencyUser, req.body);
      ResponseUtil.success(res, { business }, 'Business registered successfully.', HTTP_STATUS.CREATED);
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to register business.', error.statusCode || HTTP_STATUS.BAD_REQUEST);
    }
  };

  /**
   * GET /api/agencies/businesses
   */
  public getMyBusinesses = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.agencyUser?.userId) {
        ResponseUtil.error(res, 'Authentication required.', HTTP_STATUS.UNAUTHORIZED);
        return;
      }
      const businesses = await agencyAuthService.getMyBusinesses(req.agencyUser.userId);
      ResponseUtil.success(res, { businesses }, 'Businesses retrieved successfully.', HTTP_STATUS.OK);
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to fetch businesses.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  /**
   * POST /api/agencies/auth/register (Legacy wrapper)
   */
  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        ownerName,
        businessName,
        businessType = 'agency',
        email,
        phone,
        password,
        city,
        state,
      } = req.body;

      if (!email || typeof email !== 'string' || !email.includes('@')) {
        ResponseUtil.error(res, 'A valid business email address is required.', HTTP_STATUS.BAD_REQUEST);
        return;
      }

      if (!password || typeof password !== 'string' || password.length < 6) {
        ResponseUtil.error(res, 'Password must be at least 6 characters.', HTTP_STATUS.BAD_REQUEST);
        return;
      }

      if (!ownerName || typeof ownerName !== 'string' || !ownerName.trim()) {
        ResponseUtil.error(res, 'Owner or primary contact name is required.', HTTP_STATUS.BAD_REQUEST);
        return;
      }

      if (!businessName || typeof businessName !== 'string' || !businessName.trim()) {
        ResponseUtil.error(res, 'Business / Agency name is required.', HTTP_STATUS.BAD_REQUEST);
        return;
      }

      if (!phone || typeof phone !== 'string' || !phone.trim()) {
        ResponseUtil.error(res, 'Phone number is required.', HTTP_STATUS.BAD_REQUEST);
        return;
      }

      const cleanEmail = email.trim().toLowerCase();
      const cleanPhone = phone.trim();
      const cleanOwnerName = ownerName.trim();
      const cleanBusinessName = businessName.trim();
      const isCarRental = businessType === 'car_rental';

      // Check if agency with this email already exists
      const existing = await AgencyModel.findOne({
        $or: [{ email: cleanEmail }, { loginEmail: cleanEmail }, { 'owner.email': cleanEmail }],
        isDeleted: false,
      });

      if (existing) {
        if (existing.verificationStatus === 'APPROVED' || existing.onboardingStatus === 'APPROVED') {
          ResponseUtil.error(
            res,
            'An active partner account already exists with this email. Please log in directly.',
            HTTP_STATUS.CONFLICT
          );
          return;
        }

        // Account exists in onboarding state: verify password or resume onboarding
        if (existing.passwordHash) {
          const isPasswordValid = await bcrypt.compare(password.trim(), existing.passwordHash);
          if (!isPasswordValid) {
            ResponseUtil.error(
              res,
              'An onboarding account with this email already exists. Please log in with your account password to resume.',
              HTTP_STATUS.CONFLICT
            );
            return;
          }
        }

        const token = TokenUtil.signAccessToken({
          userId: existing._id.toString(),
          agencyId: existing._id.toString(),
          customAgencyId: existing.agencyId,
          email: existing.loginEmail || existing.email,
          userType: 'agency',
          role: 'owner',
        });

        const user = {
          id: `ag-usr-${existing._id.toString().slice(-6)}`,
          agencyId: existing._id.toString(),
          name: existing.owner?.name || existing.ownerName || cleanOwnerName,
          email: cleanEmail,
          phone: cleanPhone,
          role: 'owner',
          isActive: true,
          createdAt: existing.createdAt ? new Date(existing.createdAt).toISOString() : new Date().toISOString(),
        };

        const agencyData = {
          id: existing._id.toString(),
          agencyId: existing.agencyId,
          applicationId: existing.applicationId,
          name: existing.name || cleanBusinessName,
          slug: (existing.name || cleanBusinessName).toLowerCase().replace(/\s+/g, '-'),
          email: cleanEmail,
          phone: cleanPhone,
          country: 'India',
          onboardingStatus: existing.onboardingStatus || 'PAYMENT_PENDING',
          verificationStatus: existing.verificationStatus || 'PENDING',
          status: existing.status || 'PENDING',
          businessTypes: existing.businessTypes || [isCarRental ? 'car_rental' : 'agency'],
          activeBusiness: existing.activeBusiness || (isCarRental ? 'car_rental' : 'agency'),
          timeline: existing.timeline || [],
        };

        ResponseUtil.success(
          res,
          {
            token,
            user,
            agency: agencyData,
            onboardingStatus: agencyData.onboardingStatus,
            resumed: true,
          },
          'Existing onboarding account resumed.',
          HTTP_STATUS.OK
        );
        return;
      }

      // Hash password with bcrypt
      const passwordHash = await bcrypt.hash(password.trim(), 10);

      // Generate Reference Number
      const year = new Date().getFullYear();
      const prefix = isCarRental ? 'CR-REQ' : 'AGY-REQ';
      const applicationId = `${prefix}-${year}-${Math.floor(10000 + Math.random() * 90000)}`;

      const newAgency = await AgencyModel.create({
        applicationId,
        name: cleanBusinessName,
        legalBusinessName: cleanBusinessName,
        agencyDisplayName: cleanBusinessName,
        email: cleanEmail,
        loginEmail: cleanEmail,
        phone: cleanPhone,
        ownerName: cleanOwnerName,
        businessType: isCarRental ? 'Car Rental' : 'Travel Agency',
        businessTypes: [isCarRental ? 'car_rental' : 'agency'],
        activeBusiness: isCarRental ? 'car_rental' : 'agency',
        city: city || 'New Delhi',
        state: state || 'Delhi',
        country: 'India',
        owner: {
          name: cleanOwnerName,
          email: cleanEmail,
          phone: cleanPhone,
        },
        passwordHash,
        passwordChanged: true,
        canLogin: true,
        isActive: true,
        emailVerified: true,
        phoneVerified: true,
        onboardingStatus: 'PAYMENT_PENDING',
        verificationStatus: 'PENDING',
        status: 'PENDING',
        paymentStatus: 'PENDING',
        approvalStatus: 'PENDING',
        timeline: [
          {
            id: `t1-${Date.now()}`,
            title: 'Account Created',
            timestamp: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            completed: true,
            desc: 'Partner account created successfully. Ready for registration fee verification.',
          },
        ],
      });

      const token = TokenUtil.signAccessToken({
        userId: newAgency._id.toString(),
        agencyId: newAgency._id.toString(),
        customAgencyId: newAgency.agencyId,
        email: cleanEmail,
        userType: 'agency',
        role: 'owner',
      });

      const user = {
        id: `ag-usr-${newAgency._id.toString().slice(-6)}`,
        agencyId: newAgency._id.toString(),
        name: cleanOwnerName,
        email: cleanEmail,
        phone: cleanPhone,
        role: 'owner',
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      const agencyData = {
        id: newAgency._id.toString(),
        agencyId: newAgency.agencyId,
        applicationId: newAgency.applicationId,
        name: cleanBusinessName,
        slug: cleanBusinessName.toLowerCase().replace(/\s+/g, '-'),
        email: cleanEmail,
        phone: cleanPhone,
        country: 'India',
        onboardingStatus: 'PAYMENT_PENDING',
        verificationStatus: 'PENDING',
        status: 'PENDING',
        businessTypes: [isCarRental ? 'car_rental' : 'agency'],
        activeBusiness: isCarRental ? 'car_rental' : 'agency',
        timeline: newAgency.timeline,
      };

      ResponseUtil.success(
        res,
        {
          token,
          user,
          agency: agencyData,
          onboardingStatus: 'PAYMENT_PENDING',
        },
        'Partner account created successfully.',
        HTTP_STATUS.CREATED
      );
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Registration failed.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  /**
   * POST /api/agencies/auth/login
   * Authenticates agency using email & bcrypt password comparison.
   * Permits login at any stage of onboarding to resume saved state.
   */
  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || typeof email !== 'string') {
        ResponseUtil.error(res, 'A valid email address is required.', HTTP_STATUS.BAD_REQUEST);
        return;
      }

      if (!password || typeof password !== 'string') {
        ResponseUtil.error(res, 'Password is required.', HTTP_STATUS.BAD_REQUEST);
        return;
      }

      const cleanEmail = email.trim().toLowerCase();

      // 1. Authenticate via SaaS PartnerUser or legacy Agency
      try {
        const saasResult = await agencyAuthService.loginSaaS(cleanEmail, password);
        if (saasResult.requiresVerification) {
          ResponseUtil.success(
            res,
            {
              requiresVerification: true,
              emailVerified: saasResult.emailVerified,
              userId: saasResult.userId,
            },
            'Email verification required before login.',
            HTTP_STATUS.OK
          );
          return;
        }

        ResponseUtil.success(
          res,
          {
            token: saasResult.token,
            user: saasResult.user,
            agency: saasResult.agency,
            businesses: saasResult.businesses,
            activeBusiness: saasResult.agency,
            onboardingStatus: saasResult.agency?.onboardingStatus || 'PAYMENT_PENDING',
          },
          'Partner login successful.',
          HTTP_STATUS.OK
        );
        return;
      } catch (err: any) {
        if (err.statusCode === 401) {
          ResponseUtil.error(res, 'Invalid email or password.', HTTP_STATUS.UNAUTHORIZED);
          return;
        }
      }

      // 2. Fallback: Find agency directly by email
      const agency = await AgencyModel.findOne({
        $or: [{ email: cleanEmail }, { 'owner.email': cleanEmail }, { loginEmail: cleanEmail }],
        isDeleted: false,
      });

      if (!agency) {
        ResponseUtil.error(
          res,
          'No registered agency found with this email. Please check your credentials or register your agency.',
          HTTP_STATUS.NOT_FOUND
        );
        return;
      }

      // Check Verification & Account Status
      if (agency.status === 'SUSPENDED' || agency.onboardingStatus === 'SUSPENDED') {
        ResponseUtil.error(
          res,
          'Your agency account has been suspended. Please contact support@apnatrip.com for assistance.',
          HTTP_STATUS.FORBIDDEN
        );
        return;
      }

      // Verify Password Hash with bcrypt
      if (agency.passwordHash) {
        const isPasswordValid = await bcrypt.compare(password.trim(), agency.passwordHash);
        if (!isPasswordValid) {
          ResponseUtil.error(res, 'Invalid password. Please check your credentials and retry.', HTTP_STATUS.UNAUTHORIZED);
          return;
        }
      }

      const isRejected = agency.status === 'REJECTED' || agency.verificationStatus === 'REJECTED' || agency.onboardingStatus === 'REJECTED';
      const isApproved =
        agency.verificationStatus === 'APPROVED' ||
        agency.verificationStatus === 'VERIFIED' ||
        agency.status === 'ACTIVE' ||
        agency.onboardingStatus === 'APPROVED' ||
        agency.carRentalVerificationStatus === 'APPROVED';

      const currentOnboardingStatus = agency.onboardingStatus || (isApproved ? 'APPROVED' : isRejected ? 'REJECTED' : 'PAYMENT_PENDING');

      // Update Last Login
      agency.lastLogin = new Date();
      await agency.save();

      // Generate Access Token
      const token = TokenUtil.signAccessToken({
        userId: agency._id.toString(),
        agencyId: agency._id.toString(),
        customAgencyId: agency.agencyId,
        email: agency.loginEmail || agency.owner?.email || agency.email,
        userType: 'agency',
        role: 'owner',
      });

      const user = {
        id: `ag-usr-${agency._id.toString().slice(-6)}`,
        agencyId: agency._id.toString(),
        customAgencyId: agency.agencyId,
        name: agency.owner?.name || agency.ownerName || 'Agency Owner',
        email: agency.loginEmail || agency.owner?.email || agency.email,
        phone: agency.owner?.phone || agency.phone || '',
        role: 'owner',
        isActive: agency.status === 'ACTIVE' || true,
        createdAt: agency.createdAt ? new Date(agency.createdAt).toISOString() : new Date().toISOString(),
      };

      const agencyData = {
        id: agency._id.toString(),
        agencyId: agency.agencyId,
        applicationId: agency.applicationId,
        name: agency.agencyDisplayName || agency.legalBusinessName || agency.name,
        slug: (agency.name || 'agency').toLowerCase().replace(/\s+/g, '-'),
        email: agency.loginEmail || agency.email || agency.owner?.email,
        phone: agency.phone || agency.owner?.phone || '',
        country: 'India',
        logo: agency.logo || agency.profile?.logoUrl,
        onboardingStatus: currentOnboardingStatus,
        verificationStatus: agency.verificationStatus || 'PENDING',
        status: agency.status || 'PENDING',
        businessTypes: agency.businessTypes || ['agency'],
        activeBusiness: agency.activeBusiness || (agency.businessTypes?.includes('car_rental') && !agency.businessTypes?.includes('agency') ? 'car_rental' : 'agency'),
        carRentalVerificationStatus: agency.carRentalVerificationStatus || 'NOT_REGISTERED',
        carRentalProfile: agency.carRentalProfile || null,
        passwordChanged: true,
        timeline: agency.timeline || [],
        rating: agency.rating || 0,
        reviewCount: (agency as any).reviewCount || 0,
        totalPackages: (agency as any).totalPackages || 0,
        totalBookings: agency.totalBookings || 0,
        createdAt: agency.createdAt ? new Date(agency.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: agency.updatedAt ? new Date(agency.updatedAt).toISOString() : new Date().toISOString(),
      };

      ResponseUtil.success(
        res,
        {
          token,
          user,
          agency: agencyData,
          onboardingStatus: currentOnboardingStatus,
        },
        'Agency login successful.',
        HTTP_STATUS.OK
      );
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Agency login failed.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  /**
   * POST /api/agencies/auth/change-password
   * Mandatory First Login Password Change & Routine Password Updates
   */
  public changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const agency = req.agency;
      if (!agency) {
        ResponseUtil.error(res, 'Agency context not found.', HTTP_STATUS.UNAUTHORIZED);
        return;
      }

      const { currentPassword, newPassword, confirmPassword } = req.body || {};

      if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
        ResponseUtil.error(res, 'New password must be at least 8 characters long.', HTTP_STATUS.BAD_REQUEST);
        return;
      }

      if (newPassword !== confirmPassword) {
        ResponseUtil.error(res, 'New password and confirm password do not match.', HTTP_STATUS.BAD_REQUEST);
        return;
      }

      // Password Complexity Validation (At least 1 uppercase, 1 lowercase, 1 number, 1 special char)
      const hasUpper = /[A-Z]/.test(newPassword);
      const hasLower = /[a-z]/.test(newPassword);
      const hasDigit = /\d/.test(newPassword);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

      if (!hasUpper || !hasLower || !hasDigit || !hasSpecial) {
        ResponseUtil.error(
          res,
          'New password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.',
          HTTP_STATUS.BAD_REQUEST
        );
        return;
      }

      // Validate Current Password if exists
      if (agency.passwordHash && currentPassword) {
        const isCurrentValid = await bcrypt.compare(currentPassword.trim(), agency.passwordHash);
        if (!isCurrentValid) {
          ResponseUtil.error(res, 'Current password does not match.', HTTP_STATUS.BAD_REQUEST);
          return;
        }
      }

      // Hash and Save New Password
      agency.passwordHash = await bcrypt.hash(newPassword.trim(), 10);
      agency.passwordChanged = true;
      agency.lastLogin = new Date();
      await agency.save();

      // Formatted Agency Response
      const agencyData = {
        id: agency._id.toString(),
        agencyId: agency.agencyId,
        applicationId: agency.applicationId,
        name: agency.agencyDisplayName || agency.legalBusinessName || agency.name,
        slug: (agency.name || 'agency').toLowerCase().replace(/\s+/g, '-'),
        email: agency.loginEmail || agency.email || agency.owner?.email,
        phone: agency.phone || agency.owner?.phone || '',
        country: 'India',
        logo: agency.logo || agency.profile?.logoUrl,
        verificationStatus: agency.verificationStatus,
        status: agency.status,
        passwordChanged: true,
      };

      ResponseUtil.success(
        res,
        { agency: agencyData },
        'Password created and updated successfully! Welcome to ApnaTrip Partner Portal.',
        HTTP_STATUS.OK
      );
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to update password.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  /**
   * GET /api/agencies/auth/me
   * Returns authenticated agency details
   */
  public getMe = async (req: Request, res: Response): Promise<void> => {
    try {
      const agency = req.agency;
      const user = req.agencyUser;
      const userId = user?.userId || agency?.ownerId?.toString() || agency?._id?.toString();

      if (!agency && !user) {
        ResponseUtil.error(res, 'Authentication required.', HTTP_STATUS.UNAUTHORIZED);
        return;
      }

      const businesses = userId ? await agencyAuthService.getMyBusinesses(userId) : agency ? [agency] : [];

      const agencyData = agency
        ? {
            id: agency._id.toString(),
            agencyId: agency.agencyId,
            applicationId: agency.applicationId,
            name: agency.agencyDisplayName || agency.legalBusinessName || agency.name,
            slug: (agency.name || 'agency').toLowerCase().replace(/\s+/g, '-'),
            email: agency.loginEmail || agency.email || agency.owner?.email,
            phone: agency.phone || agency.owner?.phone || '',
            country: 'India',
            logo: agency.logo || agency.profile?.logoUrl,
            onboardingStatus: agency.onboardingStatus || (agency.verificationStatus === 'APPROVED' ? 'APPROVED' : agency.verificationStatus === 'REJECTED' ? 'REJECTED' : agency.paymentStatus === 'PAID' ? 'UNDER_REVIEW' : 'PAYMENT_PENDING'),
            registrationStatus: agency.onboardingStatus || (agency.verificationStatus === 'APPROVED' ? 'APPROVED' : agency.verificationStatus === 'REJECTED' ? 'REJECTED' : agency.paymentStatus === 'PAID' ? 'UNDER_REVIEW' : 'PAYMENT_PENDING'),
            verificationStatus: agency.verificationStatus,
            rejectionReason: agency.rejectionReason,
            paymentStatus: agency.paymentStatus || 'PENDING',
            approvalStatus: agency.approvalStatus || 'PENDING',
            status: agency.status,
            activeBusiness: agency.activeBusiness || 'agency',
            businessTypes: agency.businessTypes || ['agency'],
            passwordChanged: true,
            timeline: agency.timeline || [],
            rating: agency.rating || 0,
            reviewCount: (agency as any).reviewCount || 0,
            totalPackages: (agency as any).totalPackages || 0,
            totalBookings: agency.totalBookings || 0,
            createdAt: agency.createdAt,
            updatedAt: agency.updatedAt,
          }
        : (businesses.length > 0 ? businesses[0] : null);

      ResponseUtil.success(
        res,
        {
          agency: agencyData,
          user: user
            ? {
                id: user.userId,
                name: user.name || agency?.ownerName || 'Partner',
                email: user.email,
                phone: user.phone || agency?.phone || '',
                role: user.role || 'owner',
              }
            : null,
          businesses,
          activeBusiness: agencyData,
        },
        'Agency profile retrieved successfully.'
      );
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to retrieve agency profile.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  /**
   * POST /api/agencies/auth/forgot-password
   * Request password reset link (anti-enumeration & rate-limited)
   */
  public forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body || {};
      const clientIp = req.ip || (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || '127.0.0.1';

      if (!email || typeof email !== 'string' || !email.includes('@')) {
        ResponseUtil.error(res, 'A valid email address is required.', HTTP_STATUS.BAD_REQUEST);
        return;
      }

      const result = await agencyAuthService.forgotPassword(email, clientIp);
      ResponseUtil.success(res, null, result.message, HTTP_STATUS.OK);
    } catch (error: any) {
      const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
      ResponseUtil.error(res, error.message || 'Failed to process password reset request.', statusCode);
    }
  };

  /**
   * POST /api/agencies/auth/reset-password
   * Reset agency password using secure cryptographic token
   */
  public resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token, password, confirmPassword } = req.body || {};
      const clientIp = req.ip || (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || '127.0.0.1';

      if (!token || typeof token !== 'string') {
        ResponseUtil.error(res, 'Password reset token is required.', HTTP_STATUS.BAD_REQUEST);
        return;
      }

      if (!password || typeof password !== 'string' || password.length < 8) {
        ResponseUtil.error(res, 'New password must be at least 8 characters long.', HTTP_STATUS.BAD_REQUEST);
        return;
      }

      if (confirmPassword && password !== confirmPassword) {
        ResponseUtil.error(res, 'Passwords do not match.', HTTP_STATUS.BAD_REQUEST);
        return;
      }

      // Password Complexity Check
      const hasUpper = /[A-Z]/.test(password);
      const hasLower = /[a-z]/.test(password);
      const hasDigit = /\d/.test(password);
      const hasSpecial = /[^A-Za-z0-9]/.test(password);

      if (!hasUpper || !hasLower || !hasDigit || !hasSpecial) {
        ResponseUtil.error(
          res,
          'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.',
          HTTP_STATUS.BAD_REQUEST
        );
        return;
      }

      const result = await agencyAuthService.resetPassword({ token, password, confirmPassword }, clientIp);
      ResponseUtil.success(res, null, result.message, HTTP_STATUS.OK);
    } catch (error: any) {
      const statusCode = error.statusCode || HTTP_STATUS.BAD_REQUEST;
      ResponseUtil.error(res, error.message || 'Failed to reset password.', statusCode);
    }
  };
}

export const agencyAuthController = new AgencyAuthController();
