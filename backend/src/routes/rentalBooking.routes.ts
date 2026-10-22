import { Router } from 'express';
import { rentalBookingController } from '../controllers/rentalBooking.controller.js';
import { authenticate, optionalAuthenticate } from '../middlewares/auth.middleware.js';
import { authenticateAgency } from '../middlewares/agencyAuth.middleware.js';

const router = Router();

/**
 * 1. POST /api/rental/book - Create Rental Booking
 */
router.post('/book', authenticate, (req, res, next) => rentalBookingController.book(req, res, next));

/**
 * 2. POST /api/rental/payment - Create Razorpay order or verify payment
 */
router.post('/payment', authenticate, (req, res, next) => rentalBookingController.payment(req, res, next));

/**
 * 3. POST /api/rental/confirm - Owner verifies pickup confirmation code
 */
router.post(['/confirm', '/verify-pickup', '/pickup/confirm'], (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    authenticateAgency(req, res, (err) => {
      if (!err && req.agency) {
        return rentalBookingController.confirm(req, res, next);
      }
      authenticate(req, res, () => rentalBookingController.confirm(req, res, next));
    });
  } else {
    rentalBookingController.confirm(req, res, next);
  }
});

/**
 * 4. POST /api/rental/return - Owner verifies vehicle return code
 */
router.post(['/return', '/verify-return'], (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    authenticateAgency(req, res, (err) => {
      if (!err && req.agency) {
        return rentalBookingController.returnVehicle(req, res, next);
      }
      authenticate(req, res, () => rentalBookingController.returnVehicle(req, res, next));
    });
  } else {
    rentalBookingController.returnVehicle(req, res, next);
  }
});

/**
 * 5. GET /api/rental/my-bookings - Customer fetches their rental bookings
 */
router.get('/my-bookings', authenticate, (req, res, next) => rentalBookingController.myBookings(req, res, next));

/**
 * 6. GET /api/rental/agency-bookings - Agency fetches rental bookings
 */
router.get('/agency-bookings', authenticateAgency, (req, res, next) =>
  rentalBookingController.agencyBookings(req, res, next)
);

/**
 * 6b. POST /api/rental/owner/cancel - Dedicated Owner Cancellation
 */
router.post('/owner/cancel', (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    authenticateAgency(req, res, (err) => {
      if (!err && req.agency) {
        return rentalBookingController.ownerCancel(req, res, next);
      }
      authenticate(req, res, () => rentalBookingController.ownerCancel(req, res, next));
    });
  } else {
    rentalBookingController.ownerCancel(req, res, next);
  }
});

/**
 * 7. GET /api/rental/:id - Get details of a single rental booking
 */
router.get('/:id', optionalAuthenticate, (req, res, next) => rentalBookingController.getBooking(req, res, next));

/**
 * 8. POST /api/rental/:id/cancel and POST /api/rental/cancel - Cancel rental booking
 */
router.post(['/:id/cancel', '/cancel'], (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    authenticateAgency(req, res, (err) => {
      if (!err && req.agency) {
        return rentalBookingController.cancel(req, res, next);
      }
      authenticate(req, res, () => rentalBookingController.cancel(req, res, next));
    });
  } else {
    authenticate(req, res, () => rentalBookingController.cancel(req, res, next));
  }
});

export default router;
