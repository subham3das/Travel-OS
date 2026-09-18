import { Router } from 'express';
import { agencyOnboardingController } from '../controllers/agencyOnboarding.controller.js';
import { agencyAuthController } from '../controllers/agencyAuth.controller.js';
import { agencyDashboardController } from '../controllers/agencyDashboard.controller.js';
import { agencyProfileController } from '../controllers/agencyProfile.controller.js';
import { agencyChatController } from '../controllers/agencyChat.controller.js';
import { agencyPackageController } from '../controllers/agencyPackage.controller.js';
import { agencyBookingController } from '../controllers/agencyBooking.controller.js';
import { AgencyTripController } from '../controllers/agencyTrip.controller.js';
import { AgencyCustomerController } from '../controllers/agencyCustomer.controller.js';
import { AgencyReviewController } from '../controllers/agencyReview.controller.js';
import { AgencyFinanceController } from '../controllers/agencyFinance.controller.js';
import { AgencyAnalyticsController } from '../controllers/agencyAnalytics.controller.js';
import { AgencyNotificationController } from '../controllers/agencyNotification.controller.js';
import { publicAgencyController } from '../controllers/publicAgency.controller.js';
import { authenticateAgency } from '../middlewares/agencyAuth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { uploadDocument } from '../middlewares/upload.middleware.js';
import {
  AgencyForgotPasswordSchema,
  AgencyResetPasswordSchema,
  AgencyChangePasswordSchema,
} from '../validations/agencyAuth.validation.js';
import {
  GetConversationsQuerySchema,
  GetMessagesQuerySchema,
  SendMessageSchema,
  CreateAgencyPrivateNoteSchema,
  UpdateAgencyPrivateNoteSchema,
} from '../validations/agencyChat.validation.js';

const router = Router();

/**
 * ─── 0. PUBLIC AGENCY DIRECTORY ROUTES (FOR TRAVELERS) ───────────────────────
 */
router.get('/', (req, res, next) => publicAgencyController.getAgencies(req, res).catch(next));

/**
 * ─── 1. AGENCY AUTHENTICATION ROUTES ─────────────────────────────────────────
 */
router.post('/auth/login', agencyAuthController.login);
router.post(
  '/auth/forgot-password',
  validateRequest({ body: AgencyForgotPasswordSchema }),
  agencyAuthController.forgotPassword
);
router.post(
  '/auth/reset-password',
  validateRequest({ body: AgencyResetPasswordSchema }),
  agencyAuthController.resetPassword
);
router.get('/auth/me', authenticateAgency, agencyAuthController.getMe);
router.post(
  '/auth/change-password',
  authenticateAgency,
  validateRequest({ body: AgencyChangePasswordSchema }),
  agencyAuthController.changePassword
);

/**
 * ─── 2. AGENCY DASHBOARD & ANALYTICS ROUTES ──────────────────────────────────
 */
router.get('/dashboard', authenticateAgency, agencyDashboardController.getDashboard);
router.get('/dashboard/recent-bookings', authenticateAgency, agencyDashboardController.getRecentBookings);
router.get('/dashboard/upcoming-departures', authenticateAgency, agencyDashboardController.getUpcomingDepartures);

/**
 * ─── 3. AGENCY ONBOARDING & REGISTRATION ROUTES ─────────────────────────────
 */
router.post('/onboarding/draft', agencyOnboardingController.saveDraft);
router.get('/onboarding/draft/:idOrEmail', agencyOnboardingController.getDraft);
router.post('/onboarding/submit', agencyOnboardingController.submitOnboarding);
router.get('/onboarding/status/:idOrEmail', agencyOnboardingController.getVerificationStatus);
router.get('/onboarding/requested-documents/:idOrEmail', agencyOnboardingController.getRequestedDocuments);
router.post('/onboarding/reupload-docs', agencyOnboardingController.reuploadDocuments);
router.post('/onboarding/reupload-documents', agencyOnboardingController.reuploadDocuments);

/**
 * ─── 4. AGENCY PROFILE & SETTINGS ROUTES ─────────────────────────────────────
 */
router.get('/profile', authenticateAgency, agencyProfileController.getProfile);
router.patch('/profile', authenticateAgency, agencyProfileController.updateProfile);
router.get('/profile/settings', authenticateAgency, agencyProfileController.getSettings);
router.put('/profile/settings', authenticateAgency, agencyProfileController.updateSettings);

/**
 * ─── 5. AGENCY MESSAGING & CUSTOMER INBOX ROUTES ────────────────────────────
 */
router.get(
  '/conversations',
  authenticateAgency,
  validateRequest({ query: GetConversationsQuerySchema }),
  agencyChatController.getConversations
);

router.get(
  '/conversations/:conversationId',
  authenticateAgency,
  agencyChatController.getConversationById
);

router.get(
  '/conversations/:conversationId/messages',
  authenticateAgency,
  validateRequest({ query: GetMessagesQuerySchema }),
  agencyChatController.getMessages
);

router.post(
  '/conversations/:conversationId/messages',
  authenticateAgency,
  validateRequest({ body: SendMessageSchema }),
  agencyChatController.sendMessage
);

router.post(
  '/conversations/:conversationId/read',
  authenticateAgency,
  agencyChatController.markAsRead
);

router.post(
  '/customers/:customerId/private-notes',
  authenticateAgency,
  validateRequest({ body: CreateAgencyPrivateNoteSchema }),
  agencyChatController.createPrivateNote
);

router.put(
  '/customers/:customerId/private-notes/:id',
  authenticateAgency,
  validateRequest({ body: UpdateAgencyPrivateNoteSchema }),
  agencyChatController.updatePrivateNote
);

router.delete(
  '/customers/:customerId/private-notes/:id',
  authenticateAgency,
  agencyChatController.deletePrivateNote
);

router.post(
  '/messages/upload',
  authenticateAgency,
  uploadDocument('file'),
  agencyChatController.uploadAttachment
);

/**
 * ─── 6. AGENCY PACKAGES MANAGEMENT ROUTES ───────────────────────────────────
 */
router.get('/packages/stats', authenticateAgency, agencyPackageController.getPackageStats);
router.get('/packages', authenticateAgency, agencyPackageController.getPackages);
router.post('/packages', authenticateAgency, agencyPackageController.createPackage);
router.get('/packages/:id', authenticateAgency, agencyPackageController.getPackageById);
router.patch('/packages/:id', authenticateAgency, agencyPackageController.updatePackage);
router.patch('/packages/:id/status', authenticateAgency, agencyPackageController.updatePackageStatus);
router.post('/packages/:id/duplicate', authenticateAgency, agencyPackageController.duplicatePackage);
router.delete('/packages/:id', authenticateAgency, agencyPackageController.deletePackage);

/**
 * ─── 7. AGENCY BOOKINGS & DEPARTURES ROUTES ─────────────────────────────────
 */
router.get('/bookings/stats', authenticateAgency, agencyBookingController.getBookingStats);
router.get('/bookings', authenticateAgency, agencyBookingController.getBookings);
router.get('/bookings/:id', authenticateAgency, agencyBookingController.getBookingById);
router.patch('/bookings/:id/confirm', authenticateAgency, agencyBookingController.confirmBooking);
router.patch('/bookings/:id/cancel', authenticateAgency, agencyBookingController.cancelBooking);

/**
 * ─── 8. AGENCY OPERATIONAL TRIPS & DISPATCH ROUTES ──────────────────────────
 */
router.get('/trips', authenticateAgency, AgencyTripController.getTrips);
router.get('/trips/:id', authenticateAgency, AgencyTripController.getTripById);
router.patch('/trips/:id/team', authenticateAgency, AgencyTripController.updateTripTeam);
router.patch('/trips/:id/vehicle', authenticateAgency, AgencyTripController.updateTripVehicle);
router.patch('/trips/:id/hotel', authenticateAgency, AgencyTripController.updateTripHotel);
router.patch('/trips/:id/emergency', authenticateAgency, AgencyTripController.updateTripEmergency);
router.patch('/trips/:id/status', authenticateAgency, AgencyTripController.updateTripStatus);
router.patch('/trips/:id/travelers/:travelerId/attendance', authenticateAgency, AgencyTripController.updateTravelerAttendance);
router.post('/trips/:id/travelers/check-in-all', authenticateAgency, AgencyTripController.checkInAllTravelers);
router.post('/trips/:id/announcements', authenticateAgency, AgencyTripController.createAnnouncement);
router.post('/trips/:id/incidents', authenticateAgency, AgencyTripController.addIncident);
router.patch('/trips/:id/incidents/:incidentId/toggle', authenticateAgency, AgencyTripController.toggleResolveIncident);
router.post('/trips/:id/notes', authenticateAgency, AgencyTripController.addNote);
router.post('/trips/:id/photos', authenticateAgency, AgencyTripController.addPhoto);
router.patch('/trips/:id/days/:dayNumber/status', authenticateAgency, AgencyTripController.updateTimelineDayStatus);

/**
 * ─── 9. AGENCY CUSTOMER CRM & TRAVELER DOSSIER ROUTES ───────────────────────
 */
router.get('/customers', authenticateAgency, AgencyCustomerController.getCustomers);
router.get('/customers/stats', authenticateAgency, AgencyCustomerController.getCustomerStats);
router.get('/customers/:id', authenticateAgency, AgencyCustomerController.getCustomerById);
router.post('/customers/:id/notes', authenticateAgency, AgencyCustomerController.addNote);
router.put('/customers/:id/notes/:noteId', authenticateAgency, AgencyCustomerController.editNote);
router.delete('/customers/:id/notes/:noteId', authenticateAgency, AgencyCustomerController.deleteNote);

/**
 * ─── 10. AGENCY REVIEWS & REPUTATION CENTER ROUTES ──────────────────────────
 */
router.get('/reviews', authenticateAgency, AgencyReviewController.getReviews);
router.get('/reviews/stats', authenticateAgency, AgencyReviewController.getReviewStats);
router.post('/reviews/:id/reply', authenticateAgency, AgencyReviewController.replyToReview);
router.patch('/reviews/:id/flag', authenticateAgency, AgencyReviewController.flagReview);

/**
 * ─── 11. AGENCY FINANCIAL COMMAND CENTER & SETTLEMENT ROUTES ────────────────
 */
router.get('/finance', authenticateAgency, AgencyFinanceController.getOverview);
router.get('/finance/transactions', authenticateAgency, AgencyFinanceController.getTransactions);
router.get('/finance/transactions/:id', authenticateAgency, AgencyFinanceController.getTransactionById);
router.post('/finance/request-payout', authenticateAgency, AgencyFinanceController.requestPayout);

/**
 * ─── 12. AGENCY ANALYTICS & BUSINESS INTELLIGENCE ROUTES ────────────────────
 */
router.get('/analytics', authenticateAgency, AgencyAnalyticsController.getAnalytics);

/**
 * ─── 13. AGENCY NOTIFICATIONS & ACTIVITY INBOX ROUTES ────────────────────────
 */
router.get('/notifications', authenticateAgency, AgencyNotificationController.getNotifications);
router.patch('/notifications/:id/read', authenticateAgency, AgencyNotificationController.markAsRead);
router.post('/notifications/read-all', authenticateAgency, AgencyNotificationController.markAllAsRead);
router.post('/notifications/clear-read', authenticateAgency, AgencyNotificationController.clearAllRead);
router.delete('/notifications/:id', authenticateAgency, AgencyNotificationController.deleteNotification);
router.patch('/notifications/:id/archive', authenticateAgency, AgencyNotificationController.archiveNotification);

/**
  * ─── 14. PUBLIC AGENCY PROFILE (FOR TRAVELERS) ──────────────────────────────
  */
router.get('/:id', (req, res, next) => publicAgencyController.getAgencyById(req, res).catch(next));

export default router;
