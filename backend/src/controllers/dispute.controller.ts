import { Request, Response, NextFunction } from 'express';
import { disputeService } from '../services/dispute.service.js';
import { ResponseUtil } from '../utils/response.util.js';
import { BadRequestError } from '../utils/errors.util.js';

export class DisputeController {
  /**
   * Admin: List Disputes with Filtering & Pagination
   * GET /api/admin/disputes
   */
  public async listDisputes(req: Request, res: Response, next: NextFunction) {
    try {
      const status = req.query.status as string;
      const search = req.query.search as string;
      const limit = parseInt(req.query.limit as string) || 20;
      const page = parseInt(req.query.page as string) || 1;
      const skip = (page - 1) * limit;

      const result = await disputeService.listDisputes({ status, search, limit, skip });
      return ResponseUtil.success(res, result, 'Disputes retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  /**
   * Admin: Open Dispute / Record Chargeback
   * POST /api/admin/disputes
   */
  public async openDispute(req: Request, res: Response, next: NextFunction) {
    try {
      const { paymentId, bookingId, razorpayDisputeId, amount, reason, category, deadline, notes } = req.body;
      if (!paymentId || !amount || !reason) {
        throw new BadRequestError('paymentId, amount, and reason are required.');
      }

      const dispute = await disputeService.openDispute({
        paymentId,
        bookingId,
        razorpayDisputeId,
        amount: Number(amount),
        reason,
        category,
        deadline: deadline ? new Date(deadline) : undefined,
        notes,
      });

      return ResponseUtil.success(res, dispute, 'Dispute recorded successfully');
    } catch (err) {
      next(err);
    }
  }

  /**
   * Admin / Agency: Submit Evidence for Dispute
   * POST /api/admin/disputes/:disputeId/evidence
   */
  public async submitEvidence(req: Request, res: Response, next: NextFunction) {
    try {
      const disputeId = String(req.params.disputeId);
      const { evidence } = req.body;

      if (!evidence || !Array.isArray(evidence) || evidence.length === 0) {
        throw new BadRequestError('evidence array is required with at least one document.');
      }

      const admin = (req as any).admin || (req as any).user;
      const actor = {
        id: admin?._id?.toString(),
        name: admin?.name || admin?.email || 'Super Admin',
        role: 'Super Admin',
      };

      const result = await disputeService.submitEvidence(disputeId, evidence, actor);
      return ResponseUtil.success(res, result, 'Evidence submitted successfully');
    } catch (err) {
      next(err);
    }
  }

  /**
   * Admin: Update Dispute Status
   * PATCH /api/admin/disputes/:disputeId/status
   */
  public async updateDisputeStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const disputeId = String(req.params.disputeId);
      const { status, result, notes } = req.body;
      if (!status) {
        throw new BadRequestError('status is required.');
      }

      const admin = (req as any).admin || (req as any).user;
      const updated = await disputeService.updateDisputeStatus(disputeId, { status, result, notes }, admin);
      return ResponseUtil.success(res, updated, 'Dispute updated successfully');
    } catch (err) {
      next(err);
    }
  }
}

export const disputeController = new DisputeController();
