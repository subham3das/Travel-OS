import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import profileRoutes from './profile.routes.js';
import travelerRoutes from './traveler.routes.js';
import onboardingRoutes from './onboarding.routes.js';
import userRoutes from './user.routes.js';
import agencyRoutes from './agency.routes.js';
import packageRoutes from './package.routes.js';
import tripRoutes from './trip.routes.js';
import bookingRoutes from './booking.routes.js';
import paymentRoutes from './payment.routes.js';
import supportRoutes from './support.routes.js';
import cmsRoutes from './cms.routes.js';
import mediaRoutes from './media.routes.js';
import reportRoutes from './report.routes.js';
import adminRoutes from './admin.routes.js';
import searchRoutes from './search.routes.js';
import userNotificationRoutes from './userNotification.routes.js';
import reviewRoutes from './review.routes.js';
import carRoutes from './car.routes.js';
import carBookingRoutes from './carBooking.routes.js';
import couponRoutes from './coupon.routes.js';
import subscriptionRoutes from './subscription.routes.js';
import registrationRoutes from './registration.routes.js';
import myRoutes from './my.routes.js';
import discoveryRoutes from './discovery.routes.js';
import adminDiscoveryRoutes from './adminDiscovery.routes.js';
import { discoveryController } from '../controllers/discovery.controller.js';
import { optionalAuthenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Core System & Health Endpoints
router.use('/health', healthRoutes);

// Phase 2: Customer Identity, Profile & Onboarding
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/travelers', travelerRoutes);
router.use('/onboarding', onboardingRoutes);

// Future Phase Modular API Sub-Routers
router.use('/users', userRoutes);
router.use('/agencies', agencyRoutes);
router.use('/agency', agencyRoutes);
router.use('/partner', agencyRoutes);
router.use('/packages', packageRoutes);
router.use('/search', searchRoutes);
router.use('/trips', tripRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);
router.use('/notifications', userNotificationRoutes);
router.use('/support', supportRoutes);
router.use('/chat', supportRoutes);
router.use('/reviews', reviewRoutes);
router.use('/cms', cmsRoutes);
router.use('/media', mediaRoutes);
router.use('/upload', mediaRoutes);
router.use('/reports', reportRoutes);
router.use('/admin', adminRoutes);
router.use('/coupons', couponRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/subscription', subscriptionRoutes);
router.use('/registration', registrationRoutes);
router.use('/my', myRoutes);

// Car Rental Marketplace Module (MVP)
router.use('/cars', carRoutes);
router.use('/car-rental', carRoutes);
router.use('/car-bookings', carBookingRoutes);

// Discovery & Explore Engine
router.get('/explore', optionalAuthenticate, discoveryController.getExploreFeed);
router.get('/homepage', optionalAuthenticate, discoveryController.getHomepageFeed);
router.use('/discovery', discoveryRoutes);
router.use('/admin/discovery', adminDiscoveryRoutes);

export default router;
