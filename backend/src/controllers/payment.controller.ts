import { Request, Response, NextFunction } from 'express';
import { paymentService } from '../services/payment.service.js';
import { InvoiceModel } from '../models/invoice.model.js';
import { NotFoundError, BadRequestError } from '../utils/errors.util.js';
import { logger } from '../config/logger.config.js';

export class PaymentController {
  /**
   * POST /api/payments/create-order
   * Create Razorpay Order for a Pending Booking
   */
  public async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId || (req as any).user?.id || (req as any).user?._id;
      if (!userId) {
        throw new BadRequestError('User authentication required.');
      }

      const { bookingId, notes } = req.body;
      if (!bookingId) {
        throw new BadRequestError('bookingId is required.');
      }

      const orderData = await paymentService.createOrder(userId, { bookingId, notes });

      res.status(200).json({
        success: true,
        data: orderData,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/payments/verify
   * Cryptographically verify Razorpay HMAC signature and confirm booking
   */
  public async verifyPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId || (req as any).user?.id || (req as any).user?._id;
      if (!userId) {
        throw new BadRequestError('User authentication required.');
      }

      const { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      if (!bookingId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        throw new BadRequestError('Missing payment verification parameters (bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature).');
      }

      const result = await paymentService.verifyPayment(userId, {
        bookingId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully and booking confirmed.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/payments/webhook
   * Razorpay Webhook notification receiver
   */
  public async handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const signature = (req.headers['x-razorpay-signature'] as string) || '';
      const rawBody = (req as any).rawBody || JSON.stringify(req.body);

      const result = await paymentService.handleWebhook(rawBody, signature, req.body);

      res.status(200).json(result);
    } catch (error) {
      logger.error('Webhook error: %s', (error as any).message);
      // Return 200/400 appropriately according to Razorpay webhook standards
      res.status(400).json({ success: false, error: (error as any).message });
    }
  }

  /**
   * GET /api/payments
   * List payments with filtering, pagination, and search (Admin / Agency)
   */
  public async getPayments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        status,
        gateway,
        agencyId,
        userId,
        search,
        startDate,
        endDate,
        page,
        limit,
      } = req.query;

      const userRole = (req as any).user?.role;
      const currentAgencyId = (req as any).user?.agencyId;

      // Restrict agency users to their own agency's payments
      const finalAgencyId = userRole === 'agency' || userRole === 'agent' ? currentAgencyId : (agencyId as string);

      const result = await paymentService.getPayments({
        status: status as string,
        gateway: gateway as string,
        agencyId: finalAgencyId,
        userId: userId as string,
        search: search as string,
        startDate: startDate as string,
        endDate: endDate as string,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 20,
      });

      res.status(200).json({
        success: true,
        data: result.payments,
        meta: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/payments/:id
   * Get payment details by ID
   */
  public async getPaymentById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const payment = await paymentService.getPaymentById(id);

      res.status(200).json({
        success: true,
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/payments/invoices/:invoiceNumber
   * Get invoice details
   */
  public async getInvoice(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const invoiceNumber = String(req.params.invoiceNumber);
      const invoice = await InvoiceModel.findOne({ invoiceNumber }).lean();

      if (!invoice) {
        throw new NotFoundError(`Invoice "${invoiceNumber}" not found.`);
      }

      res.status(200).json({
        success: true,
        data: invoice,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const paymentController = new PaymentController();
