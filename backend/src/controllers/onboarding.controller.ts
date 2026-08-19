import { Request, Response } from 'express';
import { onboardingService } from '../services/onboarding.service.js';
import { ResponseUtil } from '../utils/response.util.js';
import { asyncHandler } from '../utils/asyncHandler.util.js';

export class OnboardingController {
  public getStatus = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const status = await onboardingService.getOnboardingStatus(userId);
    return ResponseUtil.success(res, { onboarding: status }, 'Onboarding status fetched successfully');
  });

  public complete = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await onboardingService.completeOnboarding(userId);
    return ResponseUtil.success(res, result, 'Customer onboarding completed successfully');
  });
}

export const onboardingController = new OnboardingController();
