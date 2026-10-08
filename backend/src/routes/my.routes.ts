import { Router } from 'express';
import { myTripController } from '../controllers/myTrip.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// All /my routes require customer authentication
router.use(authenticate);

// Dedicated single active trip endpoint
router.get('/current-trip', myTripController.getCurrentTrip);

// Package and Car Rental customer bookings endpoints
router.get('/bookings/packages', myTripController.getMyPackageBookings);
router.get('/bookings/car-rentals', myTripController.getMyCarRentalBookings);

export default router;
