import { Router } from 'express';
import { agencyOnboardingController } from '../controllers/agencyOnboarding.controller.js';
import { agencyAuthController } from '../controllers/agencyAuth.controller.js';
import { agencyDashboardController } from '../controllers/agencyDashboard.controller.js';
import { agencyProfileController } from '../controllers/agencyProfile.controller.js';
import { agencyChatController } from '../controllers/agencyChat.controller.js';
import { agencyPackageController } from '../controllers/agencyPackage.controller.js';
import { departureController } from '../controllers/departure.controller.js';
import { AgencyCustomerController } from '../controllers/agencyCustomer.controller.js';
import { AgencyReviewController } from '../controllers/agencyReview.controller.js';
import { AgencyFinanceController } from '../controllers/agencyFinance.controller.js';
import { AgencyAnalyticsController } from '../controllers/agencyAnalytics.controller.js';
import { AgencyNotificationController } from '../controllers/agencyNotification.controller.js';
import { publicAgencyController } from '../controllers/publicAgency.controller.js';
import { carController } from '../controllers/car.controller.js';
import { carBookingController } from '../controllers/carBooking.controller.js';
import { agencyCarRentalController } from '../controllers/agencyCarRental.controller.js';
import { sellerPaymentProfileController } from '../controllers/sellerPaymentProfile.controller.js';
import { settlementController } from '../controllers/settlement.controller.js';
import { refundController } from '../controllers/refund.controller.js';
import { authenticateAgency, requireApprovedAgency } from '../middlewares/agencyAuth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { uploadDocument } from '../middlewares/upload.middleware.js';
import { carRentalChatController } from '../controllers/carRentalChat.controller.js';
import { CarRentalNotificationController } from '../controllers/carRentalNotification.controller.js';
import {
  AgencyForgotPasswordSchema,
  AgencyResetPasswordSchema,
  AgencyChangePasswordSchema,
  PartnerRegisterAccountSchema,
  PartnerVerifyOtpSchema,
  PartnerResendOtpSchema,
  PartnerLoginSchema,
  PartnerCreateBusinessSchema,
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
 * ─── 1. AGENCY & PARTNER AUTHENTICATION ROUTES (SAAS ARCHITECTURE) ─────────
 */
router.post(
  '/auth/register-account',
  validateRequest({ body: PartnerRegisterAccountSchema }),
  agencyAuthController.registerAccount
);
router.post(
  '/auth/verify-email-otp',
  validateRequest({ body: PartnerVerifyOtpSchema }),
  agencyAuthController.verifyEmailOtp
);
router.post(
  '/auth/resend-email-otp',
  validateRequest({ body: PartnerResendOtpSchema }),
  agencyAuthController.resendEmailOtp
);

router.post('/auth/register', agencyAuthController.register);
router.post('/auth/login', validateRequest({ body: PartnerLoginSchema }), agencyAuthController.login);

router.post(
  '/businesses/create',
  authenticateAgency,
  validateRequest({ body: PartnerCreateBusinessSchema }),
  agencyAuthController.createBusiness
);
router.get('/businesses', authenticateAgency, agencyAuthController.getMyBusinesses);

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
router.post('/car-rental/onboard', agencyCarRentalController.onboard);

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
router.get('/packages/stats', authenticateAgency, requireApprovedAgency, agencyPackageController.getPackageStats);
router.get('/packages', authenticateAgency, requireApprovedAgency, agencyPackageController.getPackages);
router.post('/packages', authenticateAgency, requireApprovedAgency, agencyPackageController.createPackage);
router.get('/packages/:id', authenticateAgency, requireApprovedAgency, agencyPackageController.getPackageById);
router.patch('/packages/:id', authenticateAgency, requireApprovedAgency, agencyPackageController.updatePackage);
router.patch('/packages/:id/status', authenticateAgency, requireApprovedAgency, agencyPackageController.updatePackageStatus);
router.post('/packages/:id/duplicate', authenticateAgency, requireApprovedAgency, agencyPackageController.duplicatePackage);
router.delete('/packages/:id', authenticateAgency, requireApprovedAgency, agencyPackageController.deletePackage);

/**
/**
 * ─── 7. STREAMLINED DEPARTURE MANAGEMENT ROUTES ─────────────────────────────
 */
router.get('/departures', authenticateAgency, requireApprovedAgency, departureController.getDepartures);
router.post('/departures', authenticateAgency, requireApprovedAgency, departureController.scheduleDeparture);
router.patch('/departures/:id', authenticateAgency, requireApprovedAgency, departureController.updateDeparture);
router.get('/departures/:id/travelers', authenticateAgency, requireApprovedAgency, departureController.getDepartureTravelers);
router.patch('/departures/:id/start', authenticateAgency, requireApprovedAgency, departureController.startDeparture);
router.patch('/departures/:id/end', authenticateAgency, requireApprovedAgency, departureController.endDeparture);
router.patch('/departures/:id/close', authenticateAgency, requireApprovedAgency, departureController.closeDeparture);
router.patch('/departures/:id/reschedule', authenticateAgency, requireApprovedAgency, departureController.rescheduleDeparture);
router.patch('/departures/:id/cancel', authenticateAgency, requireApprovedAgency, departureController.cancelDeparture);
router.delete('/departures/:id', authenticateAgency, requireApprovedAgency, departureController.cancelDeparture);
router.get('/departures/:id/export/excel', authenticateAgency, requireApprovedAgency, departureController.exportExcel);
router.get('/departures/:id/export/pdf', authenticateAgency, requireApprovedAgency, departureController.exportPdf);

/**
 * ─── 8. AGENCY CUSTOMER CRM & TRAVELER DOSSIER ROUTES ───────────────────────
 */
router.get('/customers', authenticateAgency, requireApprovedAgency, AgencyCustomerController.getCustomers);
router.get('/customers/stats', authenticateAgency, requireApprovedAgency, AgencyCustomerController.getCustomerStats);
router.get('/customers/:id', authenticateAgency, requireApprovedAgency, AgencyCustomerController.getCustomerById);
router.post('/customers/:id/notes', authenticateAgency, requireApprovedAgency, AgencyCustomerController.addNote);
router.put('/customers/:id/notes/:noteId', authenticateAgency, requireApprovedAgency, AgencyCustomerController.editNote);
router.delete('/customers/:id/notes/:noteId', authenticateAgency, requireApprovedAgency, AgencyCustomerController.deleteNote);

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
router.get('/finance', authenticateAgency, requireApprovedAgency, AgencyFinanceController.getOverview);
router.get('/finance/transactions', authenticateAgency, requireApprovedAgency, AgencyFinanceController.getTransactions);
router.get('/finance/transactions/:id', authenticateAgency, requireApprovedAgency, AgencyFinanceController.getTransactionById);
router.post('/finance/request-payout', authenticateAgency, requireApprovedAgency, AgencyFinanceController.requestPayout);

// ─── RAZORPAY ROUTE MARKETPLACE SETTLEMENTS & PAYOUT ONBOARDING ───
router.get('/payment-profile', authenticateAgency, sellerPaymentProfileController.getProfile);
router.post('/payment-profile', authenticateAgency, sellerPaymentProfileController.submitProfile);
router.post('/payment-profile/draft', authenticateAgency, sellerPaymentProfileController.saveDraftStep);
router.post('/payment-profile/replace-request', authenticateAgency, sellerPaymentProfileController.requestAccountReplacement);
router.post('/payment-profile/retry', authenticateAgency, sellerPaymentProfileController.retryProvisioning);
router.post('/payment-profile/skip', authenticateAgency, sellerPaymentProfileController.skipProfile);
router.get('/payment-profile/ifsc/:code', authenticateAgency, sellerPaymentProfileController.lookupIFSC);
router.get('/settlements', authenticateAgency, settlementController.getAgencySettlements);
router.get('/settlements/:id', authenticateAgency, settlementController.getSettlementDetails);
router.get('/refunds', authenticateAgency, refundController.getAgencyRefunds);
router.get('/refunds/booking/:bookingId', authenticateAgency, refundController.getRefundsForBooking);

/**
 * ─── 12. AGENCY ANALYTICS & BUSINESS INTELLIGENCE ROUTES ────────────────────
 */
router.get('/analytics', authenticateAgency, requireApprovedAgency, AgencyAnalyticsController.getAnalytics);

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
 * ─── 14. AGENCY CAR FLEET & RENTAL BOOKINGS ──────────────────────────────────
 */
router.post('/car-rental/register', authenticateAgency, agencyCarRentalController.register);
router.get('/car-rental/profile', authenticateAgency, agencyCarRentalController.getProfile);
router.patch('/car-rental/profile', authenticateAgency, agencyCarRentalController.updateProfile);
router.post('/car-rental/switch-business', authenticateAgency, agencyCarRentalController.switchBusiness);
router.get('/car-rental/dashboard', authenticateAgency, agencyCarRentalController.getDashboardStats);
router.get('/car-rental/calendar', authenticateAgency, agencyCarRentalController.getCalendar);

// Fleet / Vehicles API
router.get('/car-rental/vehicles', authenticateAgency, agencyCarRentalController.getVehicles);
router.post('/car-rental/vehicles', authenticateAgency, agencyCarRentalController.createVehicle);
router.get('/car-rental/vehicles/:id', authenticateAgency, agencyCarRentalController.getVehicleById);
router.patch('/car-rental/vehicles/:id', authenticateAgency, agencyCarRentalController.updateVehicle);
router.delete('/car-rental/vehicles/:id', authenticateAgency, agencyCarRentalController.deleteVehicle);
router.get('/car-rental/fleet-overview', authenticateAgency, agencyCarRentalController.getFleetOverview);

// Vehicle Route-Based Pricing API
router.get('/car-rental/vehicles/:id/routes', authenticateAgency, agencyCarRentalController.getVehicleRoutes);
router.post('/car-rental/vehicles/:id/routes', authenticateAgency, agencyCarRentalController.addVehicleRoute);
router.patch('/car-rental/vehicles/:id/routes/:routeId', authenticateAgency, agencyCarRentalController.updateVehicleRoute);
router.delete('/car-rental/vehicles/:id/routes/:routeId', authenticateAgency, agencyCarRentalController.deleteVehicleRoute);
router.patch('/car-rental/vehicles/:id/routes/:routeId/toggle', authenticateAgency, agencyCarRentalController.toggleVehicleRouteStatus);
router.post('/car-rental/vehicles/:id/routes/:routeId/duplicate', authenticateAgency, agencyCarRentalController.duplicateVehicleRoute);

// Drivers API
router.get('/car-rental/drivers', authenticateAgency, agencyCarRentalController.getDrivers);
router.post('/car-rental/drivers', authenticateAgency, agencyCarRentalController.createDriver);
router.patch('/car-rental/drivers/:id', authenticateAgency, agencyCarRentalController.updateDriver);

// Bookings API
router.get('/car-rental/bookings', authenticateAgency, requireApprovedAgency, agencyCarRentalController.getBookings);
router.patch('/car-rental/bookings/:id/status', authenticateAgency, requireApprovedAgency, agencyCarRentalController.updateBookingStatus);
router.post('/car-rental/bookings/:id/assign-driver', authenticateAgency, requireApprovedAgency, agencyCarRentalController.assignDriver);

// Customers, Analytics & Reviews API
router.get('/car-rental/customers', authenticateAgency, agencyCarRentalController.getCustomers);
router.get('/car-rental/analytics', authenticateAgency, agencyCarRentalController.getAnalytics);
router.get('/car-rental/reviews', authenticateAgency, agencyCarRentalController.getReviews);

// Aliases for /cars and /car-bookings
router.get('/cars', authenticateAgency, agencyCarRentalController.getVehicles);
router.post('/cars', authenticateAgency, agencyCarRentalController.createVehicle);
router.patch('/cars/:id', authenticateAgency, agencyCarRentalController.updateVehicle);
router.delete('/cars/:id', authenticateAgency, agencyCarRentalController.deleteVehicle);

router.get('/car-bookings', authenticateAgency, requireApprovedAgency, agencyCarRentalController.getBookings);
router.patch('/car-bookings/:id/status', authenticateAgency, requireApprovedAgency, agencyCarRentalController.updateBookingStatus);
router.post('/car-bookings/:id/assign-driver', authenticateAgency, requireApprovedAgency, agencyCarRentalController.assignDriver);

/**
 * ─── 16. CAR RENTAL MESSAGING & NOTIFICATIONS ────────────────────────────────
 * All routes scoped to { businessType: 'car_rental' } inside controllers.
 */

// Car Rental Conversations & Chat
router.get('/car-rental/conversations', authenticateAgency, carRentalChatController.getConversations.bind(carRentalChatController));
router.get('/car-rental/conversations/:conversationId', authenticateAgency, carRentalChatController.getConversationById.bind(carRentalChatController));
router.get('/car-rental/conversations/:conversationId/messages', authenticateAgency, carRentalChatController.getMessages.bind(carRentalChatController));
router.post('/car-rental/conversations/:conversationId/messages', authenticateAgency, carRentalChatController.sendMessage.bind(carRentalChatController));
router.post('/car-rental/conversations/:conversationId/read', authenticateAgency, carRentalChatController.markAsRead.bind(carRentalChatController));
router.post('/car-rental/messages/upload', authenticateAgency, uploadDocument('file'), carRentalChatController.uploadAttachment.bind(carRentalChatController));

// Car Rental Notifications
router.get('/car-rental/notifications', authenticateAgency, CarRentalNotificationController.getNotifications);
router.patch('/car-rental/notifications/:id/read', authenticateAgency, CarRentalNotificationController.markAsRead);
router.post('/car-rental/notifications/read-all', authenticateAgency, CarRentalNotificationController.markAllAsRead);
router.post('/car-rental/notifications/clear-read', authenticateAgency, CarRentalNotificationController.clearAllRead);
router.delete('/car-rental/notifications/:id', authenticateAgency, CarRentalNotificationController.deleteNotification);
router.patch('/car-rental/notifications/:id/archive', authenticateAgency, CarRentalNotificationController.archiveNotification);

/**
  * ─── 15. PUBLIC AGENCY PROFILE (FOR TRAVELERS) ──────────────────────────────
  */
router.get('/:id', (req, res, next) => publicAgencyController.getAgencyById(req, res).catch(next));

export default router;
