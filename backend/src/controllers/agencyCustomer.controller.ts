import { Request, Response } from 'express';
import { AgencyCustomerService } from '../services/agencyCustomer.service.js';
import { ResponseUtil } from '../utils/response.util.js';

export class AgencyCustomerController {
  static async getCustomers(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!agencyId) return ResponseUtil.error(res, 'Agency context missing', 401);

      const result = await AgencyCustomerService.getAgencyCustomers(agencyId.toString(), req.query as any);
      return ResponseUtil.success(res, result, 'Customers fetched successfully');
    } catch (error: any) {
      console.error('[AgencyCustomerController.getCustomers] Error:', error);
      return ResponseUtil.error(res, error.message || 'Failed to fetch customers', 500);
    }
  }

  static async getCustomerStats(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!agencyId) return ResponseUtil.error(res, 'Agency context missing', 401);

      const stats = await AgencyCustomerService.getCustomerStats(agencyId.toString());
      return ResponseUtil.success(res, stats, 'Customer statistics fetched successfully');
    } catch (error: any) {
      console.error('[AgencyCustomerController.getCustomerStats] Error:', error);
      return ResponseUtil.error(res, error.message || 'Failed to fetch customer stats', 500);
    }
  }

  static async getCustomerById(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!agencyId) return ResponseUtil.error(res, 'Agency context missing', 401);

      const customer = await AgencyCustomerService.getCustomerById(agencyId.toString(), String(req.params.id));
      return ResponseUtil.success(res, customer, 'Customer dossier fetched successfully');
    } catch (error: any) {
      console.error('[AgencyCustomerController.getCustomerById] Error:', error);
      return ResponseUtil.error(res, error.message || 'Failed to fetch customer', 404);
    }
  }

  static async addNote(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!agencyId) return ResponseUtil.error(res, 'Agency context missing', 401);

      const note = await AgencyCustomerService.addCustomerNote(
        agencyId.toString(),
        String(req.params.id),
        req.body.noteText,
        req.body.author || 'Agency Staff'
      );
      return ResponseUtil.success(res, note, 'Customer note added successfully', 201);
    } catch (error: any) {
      console.error('[AgencyCustomerController.addNote] Error:', error);
      return ResponseUtil.error(res, error.message || 'Failed to add note', 500);
    }
  }

  static async editNote(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!agencyId) return ResponseUtil.error(res, 'Agency context missing', 401);

      const notes = await AgencyCustomerService.editCustomerNote(
        agencyId.toString(),
        String(req.params.id),
        String(req.params.noteId),
        req.body.noteText
      );
      return ResponseUtil.success(res, notes, 'Customer note updated successfully');
    } catch (error: any) {
      console.error('[AgencyCustomerController.editNote] Error:', error);
      return ResponseUtil.error(res, error.message || 'Failed to edit note', 500);
    }
  }

  static async deleteNote(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!agencyId) return ResponseUtil.error(res, 'Agency context missing', 401);

      const result = await AgencyCustomerService.deleteCustomerNote(
        agencyId.toString(),
        String(req.params.id),
        String(req.params.noteId)
      );
      return ResponseUtil.success(res, result, 'Customer note deleted successfully');
    } catch (error: any) {
      console.error('[AgencyCustomerController.deleteNote] Error:', error);
      return ResponseUtil.error(res, error.message || 'Failed to delete note', 500);
    }
  }
}
