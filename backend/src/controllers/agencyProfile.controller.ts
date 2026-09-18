import { Request, Response, NextFunction } from 'express';
import { agencyProfileService } from '../services/agencyProfile.service.js';
import { UnauthorizedError } from '../utils/errors.util.js';

export class AgencyProfileController {
  /**
   * GET /api/agencies/profile
   * Returns authenticated agency profile details with live metrics
   */
  public async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.agency) {
        throw new UnauthorizedError('Agency partner authentication required.');
      }

      const profile = await agencyProfileService.getProfile(req.agency._id);

      res.status(200).json({
        success: true,
        data: profile,
        message: 'Agency profile retrieved successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/agencies/profile
   * Updates authenticated agency branding, business, contact, or bank details
   */
  public async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.agency) {
        throw new UnauthorizedError('Agency partner authentication required.');
      }

      const updatedProfile = await agencyProfileService.updateProfile(req.agency._id, req.body);

      res.status(200).json({
        success: true,
        data: updatedProfile,
        message: 'Agency profile updated successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/agencies/profile/settings
   * Returns agency system and operation settings
   */
  public async getSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.agency) {
        throw new UnauthorizedError('Agency partner authentication required.');
      }

      const settings = await agencyProfileService.getSettings(req.agency._id);

      res.status(200).json({
        success: true,
        data: settings,
        message: 'Agency settings retrieved successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/agencies/profile/settings
   * Updates agency system and operation settings
   */
  public async updateSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.agency) {
        throw new UnauthorizedError('Agency partner authentication required.');
      }

      const updatedSettings = await agencyProfileService.updateSettings(req.agency._id, req.body);

      res.status(200).json({
        success: true,
        data: updatedSettings,
        message: 'Agency settings updated successfully.',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const agencyProfileController = new AgencyProfileController();
