import { Router } from 'express';
import { carBookingController } from '../controllers/carBooking.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authenticateAgency } from '../middlewares/agencyAuth.middleware.js';

const router = Router();

/**
 * Dedicated Owner Cancellation: POST /api/car-bookings/owner/cancel
 */
router.post('/owner/cancel', (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    authenticateAgency(req, res, (err) => {
      if (!err && req.agency) {
        return carBookingController.ownerCancel(req, res).catch(next);
      }
      authenticate(req, res, () => carBookingController.ownerCancel(req, res).catch(next));
    });
  } else {
    carBookingController.ownerCancel(req, res).catch(next);
  }
});

// All customer car booking routes require authentication
router.use(authenticate);

router.post('/', (req, res, next) => carBookingController.createBooking(req, res).catch(next));
router.post('/rentals', (req, res, next) => carBookingController.createRentalBooking(req, res).catch(next));
router.post('/rentals/:id/checkin', (req, res, next) => carBookingController.rentalPickupCheckIn(req, res).catch(next));
router.post('/rentals/:id/checkout', (req, res, next) => carBookingController.rentalReturnCheckOut(req, res).catch(next));
router.post('/rentals/:id/refund-deposit', (req, res, next) => carBookingController.refundSecurityDeposit(req, res).catch(next));
router.get('/me', (req, res, next) => carBookingController.getMyBookings(req, res).catch(next));
router.get('/:id', (req, res, next) => carBookingController.getBookingById(req, res).catch(next));
router.get('/:id/receipt', (req, res, next) => carBookingController.getBookingById(req, res).catch(next));
router.post('/:id/pay', (req, res, next) => carBookingController.payBooking(req, res).catch(next));
router.post('/:id/cancel', (req, res, next) => carBookingController.cancelBooking(req, res).catch(next));
router.post('/:id/verify-start', (req, res, next) => carBookingController.verifyRideStart(req, res).catch(next));
router.post('/:id/confirm', (req, res, next) => carBookingController.verifyRideStart(req, res).catch(next));
router.post('/:id/verify-pickup', (req, res, next) => carBookingController.verifyRideStart(req, res).catch(next));
router.post('/:id/verify-close', (req, res, next) => carBookingController.verifyRideClose(req, res).catch(next));
router.post('/:id/return', (req, res, next) => carBookingController.verifyRideClose(req, res).catch(next));
router.post('/:id/review', (req, res, next) => carBookingController.submitReview(req, res).catch(next));

export default router;
