import { Request, Response } from 'express';
import { travelProfileService } from '../services/travelProfile.service.js';
import { ResponseUtil } from '../utils/response.util.js';
import { asyncHandler } from '../utils/asyncHandler.util.js';

export class TravelProfileController {
  public getProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await travelProfileService.getProfile(userId);
    return ResponseUtil.success(res, result, 'Travel profile retrieved successfully');
  });

  public updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await travelProfileService.updateProfile(userId, req.body);
    return ResponseUtil.success(res, result, 'Travel profile updated successfully');
  });
}

export const travelProfileController = new TravelProfileController();
