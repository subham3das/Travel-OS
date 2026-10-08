import { Request, Response, NextFunction } from 'express';
import { adminKycService } from '../services/adminKyc.service.js';

export class AdminKycController {
  public async getKyc(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId as string;
      const adminUser = (req as any).admin;
      const result = await adminKycService.getKycAndMembership(userId, adminUser);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  public async approveKyc(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId as string;
      const { notes } = req.body;
      const adminUser = (req as any).admin;
      const result = await adminKycService.approveKyc(userId, notes, adminUser);
      return res.status(200).json({
        success: true,
        message: 'KYC verification successfully approved',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  public async rejectKyc(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId as string;
      const { reason, internalNote, sendNotification } = req.body;
      const adminUser = (req as any).admin;
      const result = await adminKycService.rejectKyc(
        userId,
        reason,
        internalNote,
        sendNotification !== false,
        adminUser
      );
      return res.status(200).json({
        success: true,
        message: 'KYC verification rejected',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  public async requestReupload(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId as string;
      const { reason, internalNote } = req.body;
      const adminUser = (req as any).admin;
      const result = await adminKycService.requestReupload(userId, reason, internalNote, adminUser);
      return res.status(200).json({
        success: true,
        message: 'Document re-upload request sent to traveler',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  public async revokeKyc(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId as string;
      const { reason } = req.body;
      const adminUser = (req as any).admin;
      const result = await adminKycService.revokeKyc(userId, reason, adminUser);
      return res.status(200).json({
        success: true,
        message: 'KYC verification revoked',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  public async renewKyc(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId as string;
      const adminUser = (req as any).admin;
      const result = await adminKycService.renewKyc(userId, adminUser);
      return res.status(200).json({
        success: true,
        message: 'KYC verification renewed',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  public async unsuspendKyc(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId as string;
      const adminUser = (req as any).admin;
      const result = await adminKycService.unsuspendKyc(userId, adminUser);
      return res.status(200).json({
        success: true,
        message: 'KYC status unsuspended',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  public async approveDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId as string;
      const docId = req.params.docId as string;
      const adminUser = (req as any).admin;
      const result = await adminKycService.approveDocument(userId, docId, adminUser);
      return res.status(200).json({
        success: true,
        message: 'Document approved successfully',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  public async rejectDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId as string;
      const docId = req.params.docId as string;
      const { reason } = req.body;
      const adminUser = (req as any).admin;
      const result = await adminKycService.rejectDocument(userId, docId, reason, adminUser);
      return res.status(200).json({
        success: true,
        message: 'Document rejected successfully',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  public async requestDocumentReupload(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId as string;
      const docId = req.params.docId as string;
      const { reason } = req.body;
      const adminUser = (req as any).admin;
      const result = await adminKycService.requestDocumentReupload(userId, docId, reason, adminUser);
      return res.status(200).json({
        success: true,
        message: 'Document re-upload requested successfully',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }
}

export const adminKycController = new AdminKycController();
