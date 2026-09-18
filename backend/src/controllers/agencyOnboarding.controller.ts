import { Request, Response, NextFunction } from 'express';
import { agencyOnboardingService } from '../services/agencyOnboarding.service.js';
import { ResponseUtil } from '../utils/response.util.js';
import { HTTP_STATUS } from '../constants/http.constant.js';
import {
  AgencySaveDraftSchema,
  AgencySubmitOnboardingSchema,
  AgencyReuploadDocumentsSchema,
} from '../validations/agencyOnboarding.validation.js';

export class AgencyOnboardingController {
  /**
   * POST /api/agencies/onboarding/draft
   * Auto-save or update registration draft
   */
  public async saveDraft(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = AgencySaveDraftSchema.parse(req.body);
      const context = {
        ip: req.ip || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
      };

      const result = await agencyOnboardingService.saveDraft(validated, context);
      ResponseUtil.success(res, result, 'Registration draft saved successfully', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/agencies/onboarding/draft/:idOrEmail
   * Retrieve saved draft state
   */
  public async getDraft(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const idOrEmail = String(req.params.idOrEmail);
      const draft = await agencyOnboardingService.getDraft(idOrEmail);
      ResponseUtil.success(res, draft, 'Registration draft retrieved successfully', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/agencies/onboarding/submit
   * Submit complete onboarding application
   */
  public async submitOnboarding(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = AgencySubmitOnboardingSchema.parse(req.body);
      const context = {
        ip: req.ip || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
      };

      const result = await agencyOnboardingService.submitOnboarding(validated, context);
      ResponseUtil.success(
        res,
        result,
        'Agency onboarding application submitted successfully',
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/agencies/onboarding/status/:idOrEmail
   * Fetch live application verification status
   */
  public async getVerificationStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const idOrEmail = String(req.params.idOrEmail);
      const status = await agencyOnboardingService.getVerificationStatus(idOrEmail);
      ResponseUtil.success(res, status, 'Verification status fetched successfully', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/agencies/onboarding/requested-documents/:idOrEmail
   * Fetch specific documents requested for re-upload
   */
  public async getRequestedDocuments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const idOrEmail = String(req.params.idOrEmail);
      const data = await agencyOnboardingService.getRequestedDocuments(idOrEmail);
      ResponseUtil.success(res, data, 'Requested documents fetched successfully', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/agencies/onboarding/reupload-docs OR /reupload-documents
   * Re-upload requested missing documents
   */
  public async reuploadDocuments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = AgencyReuploadDocumentsSchema.parse(req.body);
      const context = {
        ip: req.ip || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
      };

      const result = await agencyOnboardingService.reuploadDocuments(validated, context);
      ResponseUtil.success(
        res,
        result,
        'Requested documents uploaded successfully',
        HTTP_STATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }
}

export const agencyOnboardingController = new AgencyOnboardingController();
