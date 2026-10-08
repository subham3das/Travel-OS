import { Request, Response, NextFunction } from 'express';
import { refundService } from '../services/refund.service.js';
import { ResponseUtil } from '../utils/response.util.js';
import { BadRequestError } from '../utils/errors.util.js';

export class RefundController {
  /**
   * Admin: Initiate Full or Partial Refund with Proportional Commission Reversal
   * POST /api/admin/refunds/initiate
   */
  public async initiateAdminRefund(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookingId, paymentId, refundAmount, reason, notes } = req.body;
      if (!bookingId || !reason) {
        throw new BadRequestError('bookingId and reason are required fields.');
      }

      const admin = (req as any).admin || (req as any).user;

      const refund = await refundService.initiateRefund({
        bookingId,
        paymentId,
        refundAmount: refundAmount ? Number(refundAmount) : undefined,
        reason,
        notes,
        initiatedBy: 'ADMIN',
        initiatorId: admin?._id?.toString(),
        initiatorEmail: admin?.email,
        idempotencyKey: req.headers['x-idempotency-key'] as string,
      });

      return ResponseUtil.success(res, refund, 'Refund processed successfully');
    } catch (err) {
      next(err);
    }
  }

  /**
   * Admin / Agency: List Refunds for a Booking
   * GET /api/admin/refunds/booking/:bookingId
   * GET /api/agency/refunds/booking/:bookingId
   */
  public async getRefundsForBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const bookingId = String(req.params.bookingId);
      const refunds = await refundService.getRefundsForBooking(bookingId);
      return ResponseUtil.success(res, refunds, 'Refunds retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  /**
   * Agency: List My Agency Refunds
   * GET /api/agency/refunds
   */
  public async getAgencyRefunds(req: Request, res: Response, next: NextFunction) {
    try {
      const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!agencyId) {
        throw new BadRequestError('Agency context not found');
      }

      const limit = parseInt(req.query.limit as string) || 50;
      const page = parseInt(req.query.page as string) || 1;
      const skip = (page - 1) * limit;

      const result = await refundService.getRefundsForSeller(agencyId.toString(), limit, skip);
      return ResponseUtil.success(res, result, 'Agency refunds retrieved');
    } catch (err) {
      next(err);
    }
  }
}

export const refundController = new RefundController();
