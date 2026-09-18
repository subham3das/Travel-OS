import { Request, Response } from 'express';
import { adminSupportService } from '../services/adminSupport.service.js';

export class AdminSupportController {
  async getKPIStats(req: Request, res: Response) {
    try {
      const stats = await adminSupportService.getKPIStats();
      res.status(200).json({ success: true, data: stats });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch support KPIs' });
    }
  }

  async getTickets(req: Request, res: Response) {
    try {
      const { status, priority, category, search, page, limit } = req.query;
      const tickets = await adminSupportService.getTickets({
        status: status as string,
        priority: priority as string,
        category: category as string,
        search: search as string,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 50,
      });
      res.status(200).json({ success: true, data: tickets });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch support tickets' });
    }
  }

  async getTicketById(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const ticket = await adminSupportService.getTicketById(id);
      if (!ticket) {
        return res.status(404).json({ success: false, message: 'Ticket not found' });
      }
      res.status(200).json({ success: true, data: ticket });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch ticket' });
    }
  }

  async addMessage(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const admin = (req as any).user;
      const ticket = await adminSupportService.addMessage(id, req.body, admin);
      res.status(200).json({ success: true, data: ticket, message: 'Message sent successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to send message' });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { status } = req.body;
      const admin = (req as any).user;
      const ticket = await adminSupportService.updateStatus(id, status, admin);
      res.status(200).json({ success: true, data: ticket, message: 'Ticket status updated' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to update ticket status' });
    }
  }

  async getAnalytics(req: Request, res: Response) {
    try {
      const analytics = await adminSupportService.getAnalytics();
      res.status(200).json({ success: true, data: analytics });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch support analytics' });
    }
  }
}

export const adminSupportController = new AdminSupportController();
