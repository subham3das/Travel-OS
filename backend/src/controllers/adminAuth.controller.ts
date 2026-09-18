import { Request, Response } from 'express';
import { adminAuthService } from '../services/adminAuth.service.js';
import { asyncHandler } from '../utils/asyncHandler.util.js';
import { ResponseUtil } from '../utils/response.util.js';
import { HTTP_STATUS } from '../constants/http.constant.js';

export class AdminAuthController {
  /**
   * Super Admin Email + Password Login
   */
  public login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const meta = {
      ipAddress: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
    };

    const result = await adminAuthService.login(req.body, meta);
    ResponseUtil.success(res, result, 'Super Admin login successful', HTTP_STATUS.OK);
  });

  /**
   * Super Admin Google Workspace SSO Login
   */
  public googleLogin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const meta = {
      ipAddress: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
    };

    const result = await adminAuthService.googleLogin(req.body, meta);
    ResponseUtil.success(res, result, 'Google Admin login successful', HTTP_STATUS.OK);
  });

  /**
   * Get Current Authenticated Administrator Profile
   */
  public getMe = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const adminId = (req.admin as any)?._id?.toString() || req.user?.userId || req.user?.adminId;
    const admin = await adminAuthService.getMe(adminId);
    ResponseUtil.success(res, { admin }, 'Admin profile retrieved successfully', HTTP_STATUS.OK);
  });

  /**
   * Refresh Admin JWT Access Token
   */
  public refreshToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;
    const result = await adminAuthService.refreshToken(refreshToken);
    ResponseUtil.success(res, result, 'Admin access token refreshed', HTTP_STATUS.OK);
  });

  /**
   * Super Admin Logout
   */
  public logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;
    await adminAuthService.logout(refreshToken);
    ResponseUtil.success(res, null, 'Logged out successfully', HTTP_STATUS.OK);
  });

  /**
   * Super Admin Forgot Password
   */
  public forgotPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    const meta = {
      ipAddress: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
    };

    const result = await adminAuthService.forgotPassword(email, meta);
    ResponseUtil.success(res, result, 'Password reset verification dispatched', HTTP_STATUS.OK);
  });

  /**
   * Super Admin Reset Password
   */
  public resetPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { token, newPassword } = req.body;
    const meta = {
      ipAddress: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
    };

    const result = await adminAuthService.resetPassword(token, newPassword, meta);
    ResponseUtil.success(res, result, 'Password reset successful', HTTP_STATUS.OK);
  });

  /**
   * Create New Admin (Super Admin only)
   */
  public createAdmin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const admin = await adminAuthService.createAdmin(req.body);
    ResponseUtil.success(res, { admin }, 'Administrator account created successfully', HTTP_STATUS.CREATED);
  });
}

export const adminAuthController = new AdminAuthController();
