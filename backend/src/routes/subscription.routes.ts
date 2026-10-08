import { Router } from 'express';
import { subscriptionController } from '../controllers/subscription.controller.js';
import { authenticateAdmin } from '../middlewares/adminAuth.middleware.js';
import { authenticateAgency } from '../middlewares/agencyAuth.middleware.js';

const router = Router();

// Partner Subscription Checkout Flow
// Authenticated: partner is logged in after registration
router.post('/create-order', authenticateAgency, subscriptionController.createAuthenticatedOrder.bind(subscriptionController));
router.post('/create', authenticateAgency, subscriptionController.createAuthenticatedOrder.bind(subscriptionController));
router.post('/verify-payment', authenticateAgency, subscriptionController.verifyPayment.bind(subscriptionController));
router.post('/payment', authenticateAgency, subscriptionController.verifyPayment.bind(subscriptionController));
router.get('/invoice/:invoiceId', subscriptionController.getInvoice.bind(subscriptionController));
router.get('/:id', subscriptionController.getSubscription.bind(subscriptionController));

// Admin Subscription Analytics
router.get('/admin/stats', authenticateAdmin, subscriptionController.adminGetStats.bind(subscriptionController));

export default router;
