import { Request, Response } from 'express';
import { AgencyFinanceService } from '../services/agencyFinance.service.js';
import { ResponseUtil } from '../utils/response.util.js';

export class AgencyFinanceController {
  static async getOverview(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!agencyId) return ResponseUtil.error(res, 'Agency context missing', 401);

      const overview = await AgencyFinanceService.getAgencyFinanceOverview(agencyId.toString());
      return ResponseUtil.success(res, overview, 'Finance overview fetched successfully');
    } catch (error: any) {
      console.error('[AgencyFinanceController.getOverview] Error:', error);
      return ResponseUtil.error(res, error.message || 'Failed to fetch finance overview', 500);
    }
  }

  static async getTransactions(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!agencyId) return ResponseUtil.error(res, 'Agency context missing', 401);

      const result = await AgencyFinanceService.getAgencyTransactions(agencyId.toString(), req.query as any);
      return ResponseUtil.success(res, result, 'Transactions fetched successfully');
    } catch (error: any) {
      console.error('[AgencyFinanceController.getTransactions] Error:', error);
      return ResponseUtil.error(res, error.message || 'Failed to fetch transactions', 500);
    }
  }

  static async getTransactionById(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!agencyId) return ResponseUtil.error(res, 'Agency context missing', 401);

      const transaction = await AgencyFinanceService.getTransactionById(agencyId.toString(), String(req.params.id));
      return ResponseUtil.success(res, transaction, 'Transaction details fetched successfully');
    } catch (error: any) {
      console.error('[AgencyFinanceController.getTransactionById] Error:', error);
      return ResponseUtil.error(res, error.message || 'Failed to fetch transaction details', 404);
    }
  }

  static async requestPayout(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!agencyId) return ResponseUtil.error(res, 'Agency context missing', 401);

      const result = await AgencyFinanceService.requestPayout(agencyId.toString(), Number(req.body.amount) || 0);
      return ResponseUtil.success(res, result, 'Payout requested successfully', 201);
    } catch (error: any) {
      console.error('[AgencyFinanceController.requestPayout] Error:', error);
      return ResponseUtil.error(res, error.message || 'Failed to request payout', 500);
    }
  }
}
