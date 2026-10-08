import { Request, Response } from 'express';
import { sellerPaymentProfileService } from '../services/sellerPaymentProfile.service.js';
import { ResponseUtil } from '../utils/response.util.js';
import { BadRequestError } from '../utils/errors.util.js';

export class SellerPaymentProfileController {
  /**
   * 1. Get Logged-in Seller's Payment Profile
   */
  public getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const sellerId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!sellerId) {
        throw new BadRequestError('Seller identity not found in request context.');
      }
      const sellerType = (req.query.sellerType as any) || 'Agency';
      const profile = await sellerPaymentProfileService.getProfile(sellerId, sellerType);
      ResponseUtil.success(res, profile, 'Seller payment profile retrieved successfully');
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to retrieve payment profile', error.statusCode || 500);
    }
  };

  /**
   * 2. Submit Payout Account Details (IFSC, Bank Account, Business info)
   */
  public submitProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const sellerId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!sellerId) {
        throw new BadRequestError('Seller identity not found in request context.');
      }
      const sellerType = (req.body.sellerType as any) || 'Agency';
      const profile = await sellerPaymentProfileService.submitProfile(
        sellerId,
        sellerType,
        req.body,
        (req as any).user || (req as any).agency
      );
      ResponseUtil.success(res, profile, 'Payout bank details submitted and verified successfully', 201);
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to submit payment details', error.statusCode || 400);
    }
  };

  /**
   * 3. Skip Payment Setup For Now
   */
  public skipProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const sellerId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!sellerId) {
        throw new BadRequestError('Seller identity not found in request context.');
      }
      const sellerType = (req.body.sellerType as any) || 'Agency';
      const result = await sellerPaymentProfileService.skipProfile(sellerId, sellerType);
      ResponseUtil.success(res, result, 'Payment setup skipped for now');
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to skip payment setup', error.statusCode || 500);
    }
  };

  /**
   * 4. Lookup Bank and Branch Details by IFSC code
   */
  public lookupIFSC = async (req: Request, res: Response): Promise<void> => {
    try {
      const code = String(req.params.code || '').trim().toUpperCase();
      if (!code || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(code)) {
        throw new BadRequestError('Invalid IFSC code format (must be 11 characters, e.g. HDFC0001234)');
      }
      const details = await sellerPaymentProfileService.lookupIFSC(code);
      ResponseUtil.success(res, details, 'Bank details resolved from IFSC');
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to resolve IFSC code', error.statusCode || 400);
    }
  };

  /**
   * 5. Admin: List All Seller Payment Profiles
   */
  public adminGetSellerProfiles = async (req: Request, res: Response): Promise<void> => {
    try {
      const { status, sellerType, search, page, limit } = req.query;
      const result = await sellerPaymentProfileService.getSellerProfiles({
        status: status as string,
        sellerType: sellerType as string,
        search: search as string,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 20,
      });
      ResponseUtil.success(res, result, 'Seller profiles retrieved successfully');
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to list seller profiles', 500);
    }
  };

  /**
   * 6. Admin: Approve Seller Payment Profile
   */
  public adminApproveProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const profileId = String(req.params.id);
      const admin = (req as any).user;
      const result = await sellerPaymentProfileService.adminApproveProfile(profileId, admin);
      ResponseUtil.success(res, result, 'Seller payment profile approved successfully');
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to approve seller profile', error.statusCode || 400);
    }
  };

  /**
   * 7. Admin: Reject Seller Payment Profile
   */
  public adminRejectProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const profileId = String(req.params.id);
      const admin = (req as any).user;
      const { reason } = req.body;
      if (!reason) {
        throw new BadRequestError('Rejection reason is required.');
      }
      const result = await sellerPaymentProfileService.adminRejectProfile(profileId, reason, admin);
      ResponseUtil.success(res, result, 'Seller payment profile rejected');
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to reject seller profile', error.statusCode || 400);
    }
  };

  /**
   * 8. Admin: Re-sync Profile with Razorpay Route
   */
  public adminResyncProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const profileId = String(req.params.id);
      const admin = (req as any).user;
      const result = await sellerPaymentProfileService.adminResyncProfile(profileId, admin);
      ResponseUtil.success(res, result, 'Seller payment profile synchronized with Razorpay Route');
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to resync seller profile', error.statusCode || 400);
    }
  };

  /**
   * 9. Save Draft Progress for Guided Setup Wizard
   */
  public saveDraftStep = async (req: Request, res: Response): Promise<void> => {
    try {
      const sellerId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!sellerId) {
        throw new BadRequestError('Seller identity not found in request context.');
      }
      const sellerType = (req.body.sellerType as any) || 'Agency';
      const step = Number(req.body.step) || 1;
      const result = await sellerPaymentProfileService.saveDraftStep(
        sellerId,
        sellerType,
        step,
        req.body,
        (req as any).user || (req as any).agency
      );
      ResponseUtil.success(res, result, 'Setup wizard draft progress saved');
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to save draft progress', error.statusCode || 400);
    }
  };

  /**
   * 10. Request Payout Account Replacement (Locked Account Workflow)
   */
  public requestAccountReplacement = async (req: Request, res: Response): Promise<void> => {
    try {
      const sellerId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!sellerId) {
        throw new BadRequestError('Seller identity not found in request context.');
      }
      const sellerType = (req.body.sellerType as any) || 'Agency';
      const result = await sellerPaymentProfileService.requestPayoutAccountChange(
        sellerId,
        sellerType,
        req.body,
        (req as any).user || (req as any).agency
      );
      ResponseUtil.success(res, result, 'Payout account replacement requested successfully');
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to request account replacement', error.statusCode || 400);
    }
  };

  /**
   * 11. Admin: Approve Payout Account Replacement
   */
  public adminApproveReplacement = async (req: Request, res: Response): Promise<void> => {
    try {
      const sellerId = String(req.params.sellerId);
      const sellerType = (req.body.sellerType as any) || 'Agency';
      const admin = (req as any).user;
      const result = await sellerPaymentProfileService.approvePayoutAccountChange(sellerId, sellerType, admin);
      ResponseUtil.success(res, result, 'Payout account replacement approved and switched');
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to approve account replacement', error.statusCode || 400);
    }
  };

  /**
   * 12. Admin: Reject Payout Account Replacement
   */
  public adminRejectReplacement = async (req: Request, res: Response): Promise<void> => {
    try {
      const sellerId = String(req.params.sellerId);
      const sellerType = (req.body.sellerType as any) || 'Agency';
      const reason = req.body.reason || 'Account details rejected by administrator';
      const admin = (req as any).user;
      const result = await sellerPaymentProfileService.rejectPayoutAccountChange(sellerId, sellerType, reason, admin);
      ResponseUtil.success(res, result, 'Payout account replacement rejected');
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to reject account replacement', error.statusCode || 400);
    }
  };

  /**
   * 13. Retry Route entity provisioning
   */
  public retryProvisioning = async (req: Request, res: Response): Promise<void> => {
    try {
      const sellerId = req.params.sellerId || (req as any).agency?._id || (req as any).user?.agencyId;
      if (!sellerId) {
        throw new BadRequestError('Seller identity not found in request context.');
      }
      const sellerType = (req.query.sellerType as any) || (req.body.sellerType as any) || 'Agency';
      const result = await sellerPaymentProfileService.retryProfileProvisioning(sellerId, sellerType);
      ResponseUtil.success(res, result, 'Provisioning retry executed');
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to retry provisioning', error.statusCode || 400);
    }
  };

  /**
   * 14. Admin: Place Temporary Payout Hold (Phase 16)
   */
  public placePayoutHold = async (req: Request, res: Response): Promise<void> => {
    try {
      const sellerId = String(req.params.sellerId);
      const { reason } = req.body;
      if (!reason) {
        throw new BadRequestError('reason is required to place a payout hold.');
      }
      const admin = (req as any).user;
      const result = await sellerPaymentProfileService.placePayoutHold(sellerId, reason, admin);
      ResponseUtil.success(res, result, 'Payout hold placed successfully');
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to place payout hold', error.statusCode || 400);
    }
  };

  /**
   * 15. Admin: Release Temporary Payout Hold (Phase 16)
   */
  public releasePayoutHold = async (req: Request, res: Response): Promise<void> => {
    try {
      const sellerId = String(req.params.sellerId);
      const { reason } = req.body;
      const admin = (req as any).user;
      const result = await sellerPaymentProfileService.releasePayoutHold(sellerId, reason || 'Released by admin', admin);
      ResponseUtil.success(res, result, 'Payout hold released successfully');
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to release payout hold', error.statusCode || 400);
    }
  };
}

export const sellerPaymentProfileController = new SellerPaymentProfileController();
