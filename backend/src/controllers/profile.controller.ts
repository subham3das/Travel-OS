import { Request, Response } from 'express';
import { profileService } from '../services/profile.service.js';
import { preferencesService } from '../services/preferences.service.js';
import { ResponseUtil } from '../utils/response.util.js';
import { asyncHandler } from '../utils/asyncHandler.util.js';
import { BadRequestError } from '../utils/errors.util.js';

export class ProfileController {
  public getProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const profile = await profileService.getProfile(userId);
    return ResponseUtil.success(res, { profile }, 'Profile fetched successfully');
  });

  public updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const updated = await profileService.updateProfile(userId, req.body);
    return ResponseUtil.success(res, { profile: updated }, 'Profile updated successfully');
  });

  public uploadPhoto = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    if (!req.file) {
      throw new BadRequestError('No image file provided for upload');
    }

    const result = await profileService.uploadProfilePhoto(
      userId,
      req.file.buffer,
      req.file.mimetype
    );
    return ResponseUtil.success(res, result, result.message);
  });

  public checkUsername = asyncHandler(async (req: Request, res: Response) => {
    const username = Array.isArray(req.params.username) ? req.params.username[0] : req.params.username;
    const result = await profileService.checkUsernameAvailability(String(username));
    return ResponseUtil.success(res, result, result.message);
  });

  public updateTravelPreferences = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await preferencesService.updateTravelPreferences(userId, req.body);
    return ResponseUtil.success(res, result, result.message);
  });

  public updateNotificationPreferences = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await preferencesService.updateNotificationPreferences(userId, req.body);
    return ResponseUtil.success(res, result, result.message);
  });

  public updatePrivacyPreferences = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await preferencesService.updatePrivacyPreferences(userId, req.body);
    return ResponseUtil.success(res, result, result.message);
  });
}

export const profileController = new ProfileController();
