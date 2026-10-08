import { Request, Response, NextFunction } from 'express';
import { subscriptionService } from '../services/subscription.service.js';
import { ResponseUtil } from '../utils/response.util.js';
import { HTTP_STATUS } from '../constants/http.constant.js';
import { logger } from '../config/logger.config.js';

export class SubscriptionController {
  /**
   * POST /api/subscriptions/create-order
   * Create Razorpay order for partner subscription checkout
   */
  public async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { businessType, partnerName, email, phone, couponCode } = req.body;
      const order = await subscriptionService.createSubscriptionOrder({
        businessType,
        partnerName,
        email,
        phone,
        couponCode,
      });

      ResponseUtil.success(res, order, 'Subscription order generated successfully', HTTP_STATUS.CREATED);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/subscriptions/create-order (AUTHENTICATED)
   * Creates Razorpay order using identity from agency JWT session.
   * Partner must be logged in — details pre-filled from req.agency.
   */
  public async createAuthenticatedOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const agency = req.agency!;
      const businessType = (req.body.businessType || 'agency') as 'agency' | 'car_rental';
      const couponCode = req.body.couponCode;
      const draftId = req.body.draftId;

      const partnerName = agency.owner?.name || agency.ownerName || agency.name || '';
      const email = agency.owner?.email || agency.email || '';
      const phone = agency.owner?.phone || agency.phone || '';

      logger.info('💳 [HTTP ORDER] POST /api/subscriptions/create-order: agencyId=%s, draftId=%s, businessType=%s',
        agency._id, draftId, businessType
      );

      const order = await subscriptionService.createSubscriptionOrder({
        businessType,
        partnerName,
        email,
        phone,
        couponCode,
        draftId,
        agencyId: agency._id.toString(),
      });

      ResponseUtil.success(res, order, 'Subscription order generated successfully', HTTP_STATUS.CREATED);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/subscriptions/verify-payment
   * Verify Razorpay signature & activate partner subscription
   */
  public async verifyPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { subscriptionId, orderId, paymentId, signature, draftId } = req.body;
      const agencyId = req.agency?._id?.toString();

      logger.info('🔐 [HTTP VERIFY] POST /api/subscriptions/verify-payment: subId=%s, orderId=%s, payId=%s, draftId=%s, agencyId=%s',
        subscriptionId, orderId, paymentId, draftId, agencyId
      );
      const result = await subscriptionService.verifySubscriptionPayment({
        subscriptionId,
        orderId,
        paymentId,
        signature,
        agencyId,
        draftId,
      });

      ResponseUtil.success(res, result, result.message, HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/subscriptions/:id
   * Get subscription details
   */
  public async getSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : String(req.params.id);
      const subscription = await subscriptionService.getSubscriptionById(id);
      ResponseUtil.success(res, subscription, 'Subscription retrieved successfully', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/subscriptions/invoice/:invoiceId
   * Get tax invoice details
   */
  public async getInvoice(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const invoiceId = Array.isArray(req.params.invoiceId) ? req.params.invoiceId[0] : String(req.params.invoiceId);
      const invoice = await subscriptionService.getInvoice(invoiceId);
      ResponseUtil.success(res, invoice, 'Invoice retrieved successfully', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/subscriptions/stats
   * Admin: Get subscription stats
   */
  public async adminGetStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await subscriptionService.adminGetSubscriptionStats();
      ResponseUtil.success(res, stats, 'Subscription stats retrieved successfully', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }
}

export const subscriptionController = new SubscriptionController();
