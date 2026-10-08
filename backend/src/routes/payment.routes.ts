import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller.js';
import { authenticate, optionalAuthenticate } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * Public Webhook Route (Signature verified cryptographically inside handler)
 */
router.post('/webhook', (req, res, next) => paymentController.handleWebhook(req, res, next));

/**
 * Customer / Authenticated Payment Endpoints
 */
router.post('/create-order', authenticate, (req, res, next) => paymentController.createOrder(req, res, next));
router.post('/verify', authenticate, (req, res, next) => paymentController.verifyPayment(req, res, next));

/**
 * Invoices
 */
router.get('/invoices/:invoiceNumber', optionalAuthenticate, (req, res, next) =>
  paymentController.getInvoice(req, res, next)
);

/**
 * Payments Query & Details (Admin & Agency)
 */
router.get('/', authenticate, (req, res, next) => paymentController.getPayments(req, res, next));
router.get('/:id', authenticate, (req, res, next) => paymentController.getPaymentById(req, res, next));

export default router;
