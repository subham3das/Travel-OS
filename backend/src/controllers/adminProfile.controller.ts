import { Request, Response } from 'express';
import { adminProfileService } from '../services/adminProfile.service.js';
import { asyncHandler } from '../utils/asyncHandler.util.js';
import { ResponseUtil } from '../utils/response.util.js';
import { HTTP_STATUS } from '../constants/http.constant.js';
import { UnauthorizedError } from '../utils/errors.util.js';

export class AdminProfileController {
  private getAdminId(req: Request): string {
    const adminId = (req.admin as any)?._id?.toString() || req.user?.userId || req.user?.adminId;
    if (!adminId) {
      throw new UnauthorizedError('Administrator authentication required.');
    }
    return adminId;
  }

  /**
   * Get Current Authenticated Administrator Profile from MongoDB
   */
  public getProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const adminId = this.getAdminId(req);
    const profile = await adminProfileService.getProfile(adminId);
    ResponseUtil.success(res, profile, 'Administrator profile retrieved successfully', HTTP_STATUS.OK);
  });

  /**
   * Update Profile Personal Info
   */
  public updateProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const adminId = this.getAdminId(req);
    const updated = await adminProfileService.updateProfile(adminId, req.body);
    ResponseUtil.success(res, updated, 'Administrator profile updated successfully', HTTP_STATUS.OK);
  });

  /**
   * Change Administrator Password (PUT /api/admin/profile/change-password)
   */
  public changePassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const adminId = this.getAdminId(req);
    const { currentPassword, newPassword } = req.body;
    await adminProfileService.changePassword(adminId, currentPassword, newPassword, {
      ipAddress: req.ip || (req.headers['x-forwarded-for'] as string) || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Web Browser',
      device: req.headers['user-agent']?.includes('Mobile') ? 'Mobile' : 'Desktop',
    });
    ResponseUtil.success(res, null, 'Password changed successfully', HTTP_STATUS.OK);
  });

  /**
   * Update Account Preferences (PATCH /api/admin/profile/preferences)
   */
  public updatePreferences = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const adminId = this.getAdminId(req);
    const preferences = await adminProfileService.updatePreferences(adminId, req.body, {
      ipAddress: req.ip || (req.headers['x-forwarded-for'] as string) || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Web Browser',
      device: req.headers['user-agent']?.includes('Mobile') ? 'Mobile' : 'Desktop',
    });
    ResponseUtil.success(res, preferences, 'Account preferences updated successfully', HTTP_STATUS.OK);
  });

  /**
   * Terminate a Specific Active Session
   */
  public terminateSession = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const adminId = this.getAdminId(req);
    const sessionId = String(req.params.sessionId);
    await adminProfileService.terminateSession(adminId, sessionId);
    ResponseUtil.success(res, null, 'Session terminated successfully', HTTP_STATUS.OK);
  });
}

export const adminProfileController = new AdminProfileController();
