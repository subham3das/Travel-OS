import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { AgencyModel } from '../models/agency.model.js';
import { TokenUtil } from '../utils/token.util.js';
import { ResponseUtil } from '../utils/response.util.js';
import { HTTP_STATUS } from '../constants/http.constant.js';
import { agencyAuthService } from '../services/agencyAuth.service.js';

export class AgencyAuthController {
  /**
   * POST /api/agencies/auth/login
   * Authenticates agency using email & bcrypt password comparison
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

      // Find agency by primary email, owner email, or loginEmail
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
      if (agency.status === 'SUSPENDED') {
        ResponseUtil.error(
          res,
          'Your agency account has been suspended. Please contact support@apnatrip.com for assistance.',
          HTTP_STATUS.FORBIDDEN
        );
        return;
      }

      const isApproved =
        agency.verificationStatus === 'APPROVED' ||
        agency.verificationStatus === 'VERIFIED' ||
        agency.status === 'ACTIVE';

      if (!isApproved) {
        ResponseUtil.error(
          res,
          `Your agency verification status is "${agency.verificationStatus}". You will receive your login credentials via email once your application is approved.`,
          HTTP_STATUS.FORBIDDEN
        );
        return;
      }

      // Verify Password Hash with bcrypt
      if (agency.passwordHash) {
        const isPasswordValid = await bcrypt.compare(password.trim(), agency.passwordHash);
        if (!isPasswordValid) {
          ResponseUtil.error(res, 'Invalid password. Please enter the temporary password sent to your email.', HTTP_STATUS.UNAUTHORIZED);
          return;
        }
      }

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
        isActive: agency.status === 'ACTIVE',
        createdAt: agency.createdAt ? new Date(agency.createdAt).toISOString() : new Date().toISOString(),
      };

      const mustChangePassword = agency.passwordChanged === false;

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
        verificationStatus: agency.verificationStatus || 'APPROVED',
        status: agency.status || 'ACTIVE',
        passwordChanged: agency.passwordChanged !== false,
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
          mustChangePassword,
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
      if (!agency) {
        ResponseUtil.error(res, 'Agency context not found.', HTTP_STATUS.UNAUTHORIZED);
        return;
      }

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
        passwordChanged: agency.passwordChanged !== false,
        rating: agency.rating || 0,
        reviewCount: (agency as any).reviewCount || 0,
        totalPackages: (agency as any).totalPackages || 0,
        totalBookings: agency.totalBookings || 0,
        createdAt: agency.createdAt,
        updatedAt: agency.updatedAt,
      };

      ResponseUtil.success(res, { agency: agencyData }, 'Agency profile retrieved successfully.');
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
