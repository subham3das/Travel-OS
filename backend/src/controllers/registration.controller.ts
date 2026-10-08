import { Request, Response, NextFunction } from 'express';
import { registrationService } from '../services/registration.service.js';
import { ResponseUtil } from '../utils/response.util.js';
import { HTTP_STATUS } from '../constants/http.constant.js';
import { logger } from '../config/logger.config.js';

export class RegistrationController {
  /**
   * POST /api/registration/draft
   * PATCH /api/registration/draft
   * Save or update ongoing registration draft in MongoDB
   */
  public async saveDraft(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        draftId,
        serviceType,
        businessDetails,
        profileDetails,
        documents,
        bank,
        currentStep,
        coupon,
      } = req.body;

      logger.info('📝 [HTTP DRAFT] %s /api/registration/draft: draftId=%s, step=%s, docs=%d, bankName="%s", accNum="%s"',
        req.method,
        draftId,
        currentStep,
        Array.isArray(documents) ? documents.length : 0,
        bank?.bankName || '',
        bank?.accountNumber || ''
      );

      const userId = (req as any).user?.userId || req.body.userId;

      const result = await registrationService.saveDraft({
        draftId,
        userId,
        serviceType: serviceType || 'agency',
        businessDetails,
        profileDetails,
        documents,
        bank,
        currentStep,
        coupon,
      });

      ResponseUtil.success(res, result, 'Registration draft saved successfully', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/registration/draft
   * Retrieve active registration draft by draftId or email
   */
  public async getDraft(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const draftIdOrEmail = (req.query.draftId as string) || (req.query.email as string) || (req.query.id as string);
      if (!draftIdOrEmail) {
        ResponseUtil.error(res, 'draftId or email query parameter is required', HTTP_STATUS.BAD_REQUEST);
        return;
      }

      const draft = await registrationService.getDraft(draftIdOrEmail);
      if (!draft) {
        ResponseUtil.error(res, 'No active registration draft found', HTTP_STATUS.NOT_FOUND);
        return;
      }

      ResponseUtil.success(res, draft, 'Registration draft retrieved successfully', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/registration/submit
   * Execute transactional post-payment submission
   */
  public async submit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { draftId, subscriptionId, paymentId, orderId } = req.body;
      logger.info('🚀 [HTTP SUBMIT] POST /api/registration/submit received: draftId=%s, subId=%s, payId=%s, orderId=%s',
        draftId, subscriptionId, paymentId, orderId
      );

      const result = await registrationService.submitRegistration({
        draftId,
        subscriptionId,
        paymentId,
        orderId,
      });

      ResponseUtil.success(res, result, result.message, HTTP_STATUS.CREATED);
    } catch (error) {
      next(error);
    }
  }
}

export const registrationController = new RegistrationController();
