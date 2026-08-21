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
import communityRoutes from './community.routes.js';
import cmsRoutes from './cms.routes.js';
import mediaRoutes from './media.routes.js';
import reportRoutes from './report.routes.js';
import adminRoutes from './admin.routes.js';

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
router.use('/packages', packageRoutes);
router.use('/trips', tripRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);
router.use('/support', supportRoutes);
router.use('/community', communityRoutes);
router.use('/cms', cmsRoutes);
router.use('/media', mediaRoutes);
router.use('/upload', mediaRoutes);
router.use('/reports', reportRoutes);
router.use('/admin', adminRoutes);

export default router;
