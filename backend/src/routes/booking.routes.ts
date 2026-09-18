import { Router } from 'express';
import { bookingController } from '../controllers/booking.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Customer protected booking endpoints
router.post('/checkout', authenticate, (req, res, next) => bookingController.createCheckout(req, res).catch(next));
router.post('/verify-payment', authenticate, (req, res, next) => bookingController.verifyPayment(req, res).catch(next));
router.get('/my', authenticate, (req, res, next) => bookingController.getMyBookings(req, res).catch(next));
router.get('/:id', authenticate, (req, res, next) => bookingController.getBookingById(req, res).catch(next));

export default router;
