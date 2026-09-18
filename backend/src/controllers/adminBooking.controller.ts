import { Request, Response } from 'express';
import { adminBookingService } from '../services/adminBooking.service.js';

export class AdminBookingController {
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await adminBookingService.getKPIStats();
      res.status(200).json({ success: true, data: stats });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to retrieve booking stats' });
    }
  }

  async getBookings(req: Request, res: Response): Promise<void> {
    try {
      const result = await adminBookingService.getBookings(req.query as any);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to retrieve bookings' });
    }
  }

  async getBookingById(req: Request, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const booking = await adminBookingService.getBookingById(id);
      if (!booking) {
        res.status(404).json({ success: false, message: 'Booking not found' });
        return;
      }
      res.status(200).json({ success: true, data: booking });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to retrieve booking' });
    }
  }

  async updateBooking(req: Request, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const booking = await adminBookingService.updateBooking(id, req.body, (req as any).admin);
      res.status(200).json({ success: true, data: booking, message: 'Booking updated successfully' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || 'Failed to update booking' });
    }
  }

  async cancelBooking(req: Request, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { reason } = req.body;
      const booking = await adminBookingService.cancelBooking(id, reason, (req as any).admin);
      res.status(200).json({ success: true, data: booking, message: 'Booking cancelled and refund initiated' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || 'Failed to cancel booking' });
    }
  }

  async bulkAction(req: Request, res: Response): Promise<void> {
    try {
      const { bookingIds, action } = req.body;
      const result = await adminBookingService.bulkAction(bookingIds, action, (req as any).admin);
      res.status(200).json({ success: true, data: result, message: `Bulk action "${action}" executed successfully` });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || 'Failed to execute bulk booking action' });
    }
  }
}

export const adminBookingController = new AdminBookingController();
