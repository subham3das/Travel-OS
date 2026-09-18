import { Request, Response } from 'express';
import { adminPaymentService } from '../services/adminPayment.service.js';

export class AdminPaymentController {
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await adminPaymentService.getKPIStats();
      res.status(200).json({ success: true, data: stats });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to retrieve payment stats' });
    }
  }

  async getPayments(req: Request, res: Response): Promise<void> {
    try {
      const result = await adminPaymentService.getPayments(req.query as any);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to retrieve payments' });
    }
  }

  async getPaymentById(req: Request, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const payment = await adminPaymentService.getPaymentById(id);
      if (!payment) {
        res.status(404).json({ success: false, message: 'Payment transaction not found' });
        return;
      }
      res.status(200).json({ success: true, data: payment });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to retrieve payment' });
    }
  }

  async refundPayment(req: Request, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { refundAmount, reason } = req.body;
      const payment = await adminPaymentService.refundPayment(id, refundAmount, reason, (req as any).admin);
      res.status(200).json({ success: true, data: payment, message: 'Refund processed successfully' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || 'Failed to process refund' });
    }
  }

  async bulkAction(req: Request, res: Response): Promise<void> {
    try {
      const { paymentIds, action } = req.body;
      const result = await adminPaymentService.bulkAction(paymentIds, action, (req as any).admin);
      res.status(200).json({ success: true, data: result, message: `Bulk action "${action}" executed successfully` });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || 'Failed to execute bulk payment action' });
    }
  }
}

export const adminPaymentController = new AdminPaymentController();
