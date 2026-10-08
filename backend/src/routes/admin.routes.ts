import { Router } from 'express';
import { adminAuthController } from '../controllers/adminAuth.controller.js';
import { adminRolesController } from '../controllers/adminRoles.controller.js';
import { adminProfileController } from '../controllers/adminProfile.controller.js';
import { adminAuditLogsController } from '../controllers/adminAuditLogs.controller.js';
import { adminDashboardController } from '../controllers/adminDashboard.controller.js';
import { adminAgencyRequestController } from '../controllers/adminAgencyRequest.controller.js';
import { adminCarRentalApprovalController } from '../controllers/adminCarRentalApproval.controller.js';
import { adminAgencyDirectoryController } from '../controllers/adminAgencyDirectory.controller.js';
import { adminUserManagementController } from '../controllers/adminUserManagement.controller.js';
import { adminKycController } from '../controllers/adminKyc.controller.js';
import { adminPackageController } from '../controllers/adminPackage.controller.js';
import { adminBookingController } from '../controllers/adminBooking.controller.js';
import { adminPaymentController } from '../controllers/adminPayment.controller.js';
import { adminFinanceController } from '../controllers/adminFinance.controller.js';
import { adminDepartureController } from '../controllers/adminDeparture.controller.js';
import { adminReviewController } from '../controllers/adminReview.controller.js';
import { adminSupportController } from '../controllers/adminSupport.controller.js';
import { adminNotificationController } from '../controllers/adminNotification.controller.js';
import { adminReportController } from '../controllers/adminReport.controller.js';
import { adminCMSController } from '../controllers/adminCMS.controller.js';
import { adminSettingsController } from '../controllers/adminSettings.controller.js';
import { adminGlobalSearchController } from '../controllers/adminGlobalSearch.controller.js';
import { couponController } from '../controllers/coupon.controller.js';
import { subscriptionController } from '../controllers/subscription.controller.js';
import { sellerPaymentProfileController } from '../controllers/sellerPaymentProfile.controller.js';
import { settlementController } from '../controllers/settlement.controller.js';
import { refundController } from '../controllers/refund.controller.js';
import { disputeController } from '../controllers/dispute.controller.js';
import { webhookObservabilityController } from '../controllers/webhookObservability.controller.js';
import { adminOperationsController } from '../controllers/adminOperations.controller.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { authenticateAdmin, requireSuperAdmin, optionalAdminAuth } from '../middlewares/adminAuth.middleware.js';
import {
  AdminLoginSchema,
  AdminGoogleLoginSchema,
  AdminForgotPasswordSchema,
  AdminResetPasswordSchema,
  CreateAdminSchema,
} from '../validations/adminAuth.validation.js';
import {
  UpdateAdminProfileSchema,
  ChangeAdminPasswordSchema,
  UpdateAdminPreferencesSchema,
} from '../validations/adminProfile.validation.js';
import {
  AgencyRequestQuerySchema,
  ApproveAgencyRequestSchema,
  RejectAgencyRequestSchema,
  RequestDocumentsSchema,
  SaveReviewNotesSchema,
  BulkAgencyActionSchema,
} from '../validations/adminAgencyRequest.validation.js';
import {
  AdminAgencyDirectoryQuerySchema,
  AdminUpdateAgencyStatusSchema,
  AdminBulkAgencyActionSchema,
} from '../validations/adminAgencyDirectory.validation.js';
import {
  AdminUserQuerySchema,
  AdminCreateUserSchema,
  AdminUpdateUserSchema,
  AdminBulkUserActionSchema,
  AdminSendNotificationSchema,
} from '../validations/adminUserManagement.validation.js';
import {
  AdminPackageQuerySchema,
  AdminCreatePackageSchema,
  AdminUpdatePackageSchema,
  AdminPackageApprovalSchema,
  AdminBulkPackageActionSchema,
} from '../validations/adminPackage.validation.js';
import {
  AdminBookingQuerySchema,
  AdminUpdateBookingSchema,
  AdminBulkBookingActionSchema,
} from '../validations/adminBooking.validation.js';
import {
  AdminPaymentQuerySchema,
  AdminRefundPaymentSchema,
  AdminBulkPaymentActionSchema,
} from '../validations/adminPayment.validation.js';

const router = Router();

// ─── AUTHENTICATION ENDPOINTS (Public / Pre-Auth Checked) ───
router.post(
  '/auth/login',
  validateRequest({ body: AdminLoginSchema }),
  adminAuthController.login
);

router.post(
  '/auth/google',
  validateRequest({ body: AdminGoogleLoginSchema }),
  adminAuthController.googleLogin
);

router.post(
  '/auth/forgot-password',
  validateRequest({ body: AdminForgotPasswordSchema }),
  adminAuthController.forgotPassword
);

router.post(
  '/auth/reset-password',
  validateRequest({ body: AdminResetPasswordSchema }),
  adminAuthController.resetPassword
);

router.post('/auth/refresh', adminAuthController.refreshToken);
router.post('/auth/logout', adminAuthController.logout);

// ─── PROTECTED ADMIN IDENTITY & FULL PROFILE ───
router.get('/auth/me', authenticateAdmin, adminAuthController.getMe);
router.get('/profile', authenticateAdmin, adminProfileController.getProfile);
router.patch(
  '/profile',
  authenticateAdmin,
  validateRequest({ body: UpdateAdminProfileSchema }),
  adminProfileController.updateProfile
);
router.put(
  '/profile/change-password',
  authenticateAdmin,
  validateRequest({ body: ChangeAdminPasswordSchema }),
  adminProfileController.changePassword
);
router.patch(
  '/profile/password',
  authenticateAdmin,
  validateRequest({ body: ChangeAdminPasswordSchema }),
  adminProfileController.changePassword
);
router.patch(
  '/profile/preferences',
  authenticateAdmin,
  validateRequest({ body: UpdateAdminPreferencesSchema }),
  adminProfileController.updatePreferences
);
router.delete(
  '/profile/sessions/:sessionId',
  authenticateAdmin,
  adminProfileController.terminateSession
);

// ─── PROTECTED SUPER ADMIN ROLE & RBAC GOVERNANCE ───
router.get('/roles/dashboard', authenticateAdmin, adminRolesController.getDashboard);
router.get('/roles/audit-summary', authenticateAdmin, adminRolesController.getAuditSummary);
router.get('/roles/access-requests', authenticateAdmin, adminRolesController.getAccessRequests);
router.post('/roles/access-requests/:id/status', authenticateAdmin, requireSuperAdmin, adminRolesController.updateAccessRequest);

router.get('/roles', authenticateAdmin, adminRolesController.getRoles);
router.post('/roles', authenticateAdmin, requireSuperAdmin, adminRolesController.createRole);
router.post('/roles/:id/duplicate', authenticateAdmin, requireSuperAdmin, adminRolesController.duplicateRole);
router.delete('/roles/:id', authenticateAdmin, requireSuperAdmin, adminRolesController.deleteRole);
router.post('/roles/:id/assign', authenticateAdmin, requireSuperAdmin, adminRolesController.assignAdmins);

// ─── PERMISSION MATRIX ───
router.get('/permissions', authenticateAdmin, adminRolesController.getPermissions);
router.patch('/roles/:id/permissions', authenticateAdmin, requireSuperAdmin, adminRolesController.updateRolePermission);

// ─── AUTHORIZED ADMINISTRATORS LIST & PRIVILEGE MANAGEMENT ───
router.get('/admins', authenticateAdmin, adminRolesController.getAdminsList);
router.post(
  '/auth/create',
  authenticateAdmin,
  requireSuperAdmin,
  validateRequest({ body: CreateAdminSchema }),
  adminAuthController.createAdmin
);
router.patch('/admins/:id', authenticateAdmin, requireSuperAdmin, adminRolesController.updateAdmin);

// ─── LIVE SESSIONS & REAL-TIME ACTIVITY ───
router.get('/sessions', authenticateAdmin, adminRolesController.getSessions);
router.post('/sessions/terminate-all', authenticateAdmin, requireSuperAdmin, adminRolesController.terminateAllSessions);
router.get('/activity', authenticateAdmin, adminRolesController.getActivity);

// ─── AUDIT LOGS & SOC SECURITY OPERATIONS ───
router.get('/audit-logs/stats', authenticateAdmin, adminAuditLogsController.getKPIStats);
router.get('/audit-logs/categories', authenticateAdmin, adminAuditLogsController.getCategories);
router.get('/audit-logs/distribution', authenticateAdmin, adminAuditLogsController.getDistribution);
router.get('/audit-logs/top-admins', authenticateAdmin, adminAuditLogsController.getTopAdmins);
router.get('/audit-logs/security-alerts', authenticateAdmin, adminAuditLogsController.getSecurityAlerts);
router.get('/audit-logs/heatmap', authenticateAdmin, adminAuditLogsController.getLoginHeatmap);
router.get('/audit-logs/:id', authenticateAdmin, adminAuditLogsController.getAuditLogById);
router.get('/audit-logs', authenticateAdmin, adminAuditLogsController.getAuditLogs);

// ─── DASHBOARD COMMAND CENTER ENDPOINTS ───
router.get('/dashboard/stats', authenticateAdmin, adminDashboardController.getStats);
router.get('/dashboard/charts', authenticateAdmin, adminDashboardController.getCharts);
router.get('/dashboard/recent-activities', authenticateAdmin, adminDashboardController.getRecentActivities);
router.get('/dashboard/latest-transactions', authenticateAdmin, adminDashboardController.getLatestTransactions);
router.get('/dashboard/pending-approvals', authenticateAdmin, adminDashboardController.getPendingApprovals);
router.get('/dashboard/system-health', authenticateAdmin, adminDashboardController.getSystemHealth);
router.get('/dashboard/live', authenticateAdmin, adminDashboardController.getLive);
router.get('/dashboard/active-trips', authenticateAdmin, adminDashboardController.getActiveTrips);
router.get('/dashboard/payment-queue', authenticateAdmin, adminDashboardController.getPaymentQueue);
router.get('/dashboard/support-queue', authenticateAdmin, adminDashboardController.getSupportQueue);
router.get('/dashboard/quick-actions', authenticateAdmin, adminDashboardController.getQuickActions);

// ─── AGENCY VERIFICATION & REGISTRATION REQUESTS ───
router.get('/agency-requests/stats', authenticateAdmin, adminAgencyRequestController.getStats);
router.get('/agency-requests/export', authenticateAdmin, adminAgencyRequestController.exportCsv);
router.get(
  '/agency-requests',
  authenticateAdmin,
  validateRequest({ query: AgencyRequestQuerySchema }),
  adminAgencyRequestController.getRequests
);
router.get('/agency-requests/:id', authenticateAdmin, adminAgencyRequestController.getRequestById);
router.post(
  '/agency-requests/:id/notes',
  authenticateAdmin,
  validateRequest({ body: SaveReviewNotesSchema }),
  adminAgencyRequestController.saveNotes
);
router.put(
  '/agency-requests/:id/approve',
  authenticateAdmin,
  validateRequest({ body: ApproveAgencyRequestSchema }),
  adminAgencyRequestController.approve
);
router.put(
  '/agency-requests/:id/approve-car-rental',
  authenticateAdmin,
  adminAgencyRequestController.approveCarRental
);
router.put(
  '/agency-requests/:id/reject-car-rental',
  authenticateAdmin,
  adminAgencyRequestController.rejectCarRental
);
router.put(
  '/agency-requests/:id/approve-documents',
  authenticateAdmin,
  adminAgencyRequestController.approveDocuments
);
router.post(
  '/agency-requests/:id/approve-documents',
  authenticateAdmin,
  adminAgencyRequestController.approveDocuments
);
router.put(
  '/agency-requests/:id/approve-bank',
  authenticateAdmin,
  adminAgencyRequestController.approveBankDetails
);
router.post(
  '/agency-requests/:id/approve-bank',
  authenticateAdmin,
  adminAgencyRequestController.approveBankDetails
);
router.put(
  '/agency-requests/:id/reject',
  authenticateAdmin,
  validateRequest({ body: RejectAgencyRequestSchema }),
  adminAgencyRequestController.reject
);
router.put(
  '/agency-requests/:id/request-docs',
  authenticateAdmin,
  adminAgencyRequestController.requestDocs
);
router.post(
  '/agency-requests/:id/request-documents',
  authenticateAdmin,
  adminAgencyRequestController.requestDocs
);
router.get(
  '/agency-requests/:id/requested-documents',
  authenticateAdmin,
  adminAgencyRequestController.getRequestedDocuments
);
router.post(
  '/agency-requests/bulk-action',
  authenticateAdmin,
  validateRequest({ body: BulkAgencyActionSchema }),
  adminAgencyRequestController.bulkAction
);

// ─── CAR RENTAL VERIFICATION & APPROVAL REQUESTS ───
router.get('/car-rental-requests/stats', authenticateAdmin, adminCarRentalApprovalController.getStats);
router.get('/car-rental-requests/export', authenticateAdmin, adminCarRentalApprovalController.exportCsv);
router.get('/car-rental-requests', authenticateAdmin, adminCarRentalApprovalController.getRequests);
router.get('/car-rental-requests/:id', authenticateAdmin, adminCarRentalApprovalController.getRequestById);
router.post('/car-rental-requests/:id/notes', authenticateAdmin, adminCarRentalApprovalController.saveNotes);
router.put('/car-rental-requests/:id/approve', authenticateAdmin, adminCarRentalApprovalController.approve);
router.put('/car-rental-requests/:id/reject', authenticateAdmin, adminCarRentalApprovalController.reject);
router.put('/car-rental-requests/:id/request-changes', authenticateAdmin, adminCarRentalApprovalController.requestChanges);
router.put('/car-rental-requests/:id/suspend', authenticateAdmin, adminCarRentalApprovalController.suspend);
router.put('/car-rental-requests/:id/reopen', authenticateAdmin, adminCarRentalApprovalController.reopen);
router.put('/car-rental-requests/:id/approve-documents', authenticateAdmin, adminCarRentalApprovalController.approveDocuments);
router.post('/car-rental-requests/bulk-action', authenticateAdmin, adminCarRentalApprovalController.bulkAction);
router.get('/car-rental-routes', authenticateAdmin, adminCarRentalApprovalController.getAllRoutes);
router.patch('/car-rental-routes/:routeId/status', authenticateAdmin, adminCarRentalApprovalController.setRouteStatus);

// ─── CAR & BIKE RENTAL MANAGEMENT (SELF-DRIVE) ───
router.get('/car-rental-admin/vehicles', authenticateAdmin, adminCarRentalApprovalController.getRentalVehicles);
router.patch('/car-rental-admin/vehicles/:id/status', authenticateAdmin, adminCarRentalApprovalController.setRentalVehicleStatus);
router.get('/car-rental-admin/bookings', authenticateAdmin, adminCarRentalApprovalController.getRentalBookings);
router.get('/car-rental-admin/analytics', authenticateAdmin, adminCarRentalApprovalController.getRentalAnalytics);


// ─── APPROVED AGENCIES DIRECTORY & COMPREHENSIVE MANAGEMENT ───
router.get('/agencies/stats', authenticateAdmin, adminAgencyDirectoryController.getSummaryStats);
router.get(
  '/agencies',
  authenticateAdmin,
  validateRequest({ query: AdminAgencyDirectoryQuerySchema }),
  adminAgencyDirectoryController.getAgencies
);
router.get('/agencies/:id', authenticateAdmin, adminAgencyDirectoryController.getAgencyDetails);
router.patch(
  '/agencies/:id/status',
  authenticateAdmin,
  validateRequest({ body: AdminUpdateAgencyStatusSchema }),
  adminAgencyDirectoryController.updateStatus
);
router.post(
  '/agencies/bulk-action',
  authenticateAdmin,
  validateRequest({ body: AdminBulkAgencyActionSchema }),
  adminAgencyDirectoryController.bulkAction
);

// ─── TRAVELER USERS COMPREHENSIVE PRODUCTION MANAGEMENT ───
router.get('/users/stats', authenticateAdmin, adminUserManagementController.getSummaryStats);
router.get('/users/export', authenticateAdmin, validateRequest({ query: AdminUserQuerySchema }), adminUserManagementController.exportUsers);
router.get(
  '/users',
  authenticateAdmin,
  validateRequest({ query: AdminUserQuerySchema }),
  adminUserManagementController.getUsers
);
router.get('/users/:id', authenticateAdmin, adminUserManagementController.getUserDetails);
router.post(
  '/users',
  authenticateAdmin,
  validateRequest({ body: AdminCreateUserSchema }),
  adminUserManagementController.createUser
);
router.patch(
  '/users/:id',
  authenticateAdmin,
  validateRequest({ body: AdminUpdateUserSchema }),
  adminUserManagementController.updateUser
);
router.delete('/users/:id', authenticateAdmin, adminUserManagementController.deleteUser);
router.post(
  '/users/bulk-action',
  authenticateAdmin,
  validateRequest({ body: AdminBulkUserActionSchema }),
  adminUserManagementController.bulkUserAction
);
router.post('/users/:id/reset-password', authenticateAdmin, adminUserManagementController.resetPassword);
router.post(
  '/users/:id/notifications',
  authenticateAdmin,
  validateRequest({ body: AdminSendNotificationSchema }),
  adminUserManagementController.sendNotification
);

// ─── TRAVELER USER KYC VERIFICATION WORKSPACE ───
router.get('/users/:userId/kyc', authenticateAdmin, adminKycController.getKyc);
router.post('/users/:userId/kyc/approve', authenticateAdmin, adminKycController.approveKyc);
router.post('/users/:userId/kyc/reject', authenticateAdmin, adminKycController.rejectKyc);
router.post('/users/:userId/kyc/request-reupload', authenticateAdmin, adminKycController.requestReupload);
router.post('/users/:userId/kyc/revoke', authenticateAdmin, adminKycController.revokeKyc);
router.post('/users/:userId/kyc/renew', authenticateAdmin, adminKycController.renewKyc);
router.post('/users/:userId/kyc/unsuspend', authenticateAdmin, adminKycController.unsuspendKyc);
router.post('/users/:userId/kyc/documents/:docId/approve', authenticateAdmin, adminKycController.approveDocument);
router.post('/users/:userId/kyc/documents/:docId/reject', authenticateAdmin, adminKycController.rejectDocument);
router.post('/users/:userId/kyc/documents/:docId/request-reupload', authenticateAdmin, adminKycController.requestDocumentReupload);


// ─── PACKAGES MASTER MANAGEMENT ───
router.get('/packages/stats', authenticateAdmin, adminPackageController.getStats);
router.get(
  '/packages',
  authenticateAdmin,
  validateRequest({ query: AdminPackageQuerySchema }),
  adminPackageController.getPackages
);
router.get('/packages/:id', authenticateAdmin, adminPackageController.getPackageById);
router.post(
  '/packages',
  authenticateAdmin,
  validateRequest({ body: AdminCreatePackageSchema }),
  adminPackageController.createPackage
);
router.patch(
  '/packages/:id',
  authenticateAdmin,
  validateRequest({ body: AdminUpdatePackageSchema }),
  adminPackageController.updatePackage
);
router.patch(
  '/packages/:id/approval',
  authenticateAdmin,
  validateRequest({ body: AdminPackageApprovalSchema }),
  adminPackageController.updateApproval
);
router.patch('/packages/:id/feature', authenticateAdmin, adminPackageController.toggleFeatured);
router.patch('/packages/:id/status', authenticateAdmin, adminPackageController.updateStatus);
router.patch('/packages/:id/flags', authenticateAdmin, adminPackageController.updateFlags);
router.delete('/packages/:id', authenticateAdmin, adminPackageController.deletePackage);
router.post(
  '/packages/bulk-action',
  authenticateAdmin,
  validateRequest({ body: AdminBulkPackageActionSchema }),
  adminPackageController.bulkAction
);

// ─── BOOKINGS & PASSENGER MANIFESTS ───
router.get('/bookings/stats', authenticateAdmin, adminBookingController.getStats);
router.get(
  '/bookings',
  authenticateAdmin,
  validateRequest({ query: AdminBookingQuerySchema }),
  adminBookingController.getBookings
);
router.get('/bookings/:id', authenticateAdmin, adminBookingController.getBookingById);
router.patch(
  '/bookings/:id',
  authenticateAdmin,
  validateRequest({ body: AdminUpdateBookingSchema }),
  adminBookingController.updateBooking
);
router.post('/bookings/:id/cancel', authenticateAdmin, adminBookingController.cancelBooking);
router.post(
  '/bookings/bulk-action',
  authenticateAdmin,
  validateRequest({ body: AdminBulkBookingActionSchema }),
  adminBookingController.bulkAction
);

// ─── PAYMENTS & TRANSACTION LEDGER ───
router.get('/payments/stats', authenticateAdmin, adminPaymentController.getStats);
router.get(
  '/payments',
  authenticateAdmin,
  validateRequest({ query: AdminPaymentQuerySchema }),
  adminPaymentController.getPayments
);
router.get('/payments/:id', authenticateAdmin, adminPaymentController.getPaymentById);
router.post(
  '/payments/:id/refund',
  authenticateAdmin,
  validateRequest({ body: AdminRefundPaymentSchema }),
  adminPaymentController.refundPayment
);
router.post(
  '/payments/bulk-action',
  authenticateAdmin,
  validateRequest({ body: AdminBulkPaymentActionSchema }),
  adminPaymentController.bulkAction
);

// ─── FINANCE COMMAND CENTER & SETTLEMENTS ───
router.get('/finance/stats', authenticateAdmin, adminFinanceController.getStats);
router.get('/finance/charts', authenticateAdmin, adminFinanceController.getRevenueOverview);
router.get('/finance/commission-breakdown', authenticateAdmin, adminFinanceController.getCommissionBreakdown);
router.get('/finance/destinations', authenticateAdmin, adminFinanceController.getDestinationRevenue);
router.get('/finance/top-agencies', authenticateAdmin, adminFinanceController.getTopAgencies);
router.get('/finance/summary', authenticateAdmin, adminFinanceController.getFinancialSummary);
router.get('/finance/refunds', authenticateAdmin, adminFinanceController.getRefundAnalytics);
router.get('/finance/settlements', authenticateAdmin, adminFinanceController.getSettlements);
router.get('/finance/timeline', authenticateAdmin, adminFinanceController.getFinancialTimeline);
router.get('/finance/agency/:id', authenticateAdmin, adminFinanceController.getAgencySidebar);
router.post('/finance/settlements/:id/process', authenticateAdmin, requireSuperAdmin, adminFinanceController.processSettlement);

// ─── RAZORPAY ROUTE MARKETPLACE SETTLEMENTS & RECONCILIATION ───
router.get('/settlements/overview', authenticateAdmin, settlementController.getAdminSettlements);
router.get('/settlements/monitoring', authenticateAdmin, settlementController.getOperationalMonitoring);
router.get('/settlements/audit-logs', authenticateAdmin, settlementController.getAuditLogs);
router.post('/settlements/reconcile', authenticateAdmin, requireSuperAdmin, settlementController.runReconciliation);
router.post('/settlements/transfers/:transferId/retry', authenticateAdmin, requireSuperAdmin, settlementController.retryTransfer);
router.post('/settlements/:settlementId/adjust', authenticateAdmin, requireSuperAdmin, settlementController.recordAdjustment);

// ─── SELLER PAYOUT ONBOARDING REVIEW & RECOVERY ───
router.get('/sellers/onboarding', authenticateAdmin, sellerPaymentProfileController.adminGetSellerProfiles);
router.patch('/sellers/onboarding/:id/approve', authenticateAdmin, requireSuperAdmin, sellerPaymentProfileController.adminApproveProfile);
router.patch('/sellers/onboarding/:id/reject', authenticateAdmin, requireSuperAdmin, sellerPaymentProfileController.adminRejectProfile);
router.post('/sellers/onboarding/:id/sync', authenticateAdmin, requireSuperAdmin, sellerPaymentProfileController.adminResyncProfile);
router.post('/sellers/payment-profile/:sellerId/replace-approve', authenticateAdmin, requireSuperAdmin, sellerPaymentProfileController.adminApproveReplacement);
router.post('/sellers/payment-profile/:sellerId/replace-reject', authenticateAdmin, requireSuperAdmin, sellerPaymentProfileController.adminRejectReplacement);
router.post('/sellers/payment-profile/:sellerId/retry', authenticateAdmin, requireSuperAdmin, sellerPaymentProfileController.retryProvisioning);
router.post('/sellers/payment-profile/:sellerId/hold', authenticateAdmin, requireSuperAdmin, sellerPaymentProfileController.placePayoutHold);
router.post('/sellers/payment-profile/:sellerId/release-hold', authenticateAdmin, requireSuperAdmin, sellerPaymentProfileController.releasePayoutHold);

// ─── REFUNDS & COMMISSION REVERSAL ───
router.post('/refunds/initiate', authenticateAdmin, requireSuperAdmin, refundController.initiateAdminRefund);
router.get('/refunds/booking/:bookingId', authenticateAdmin, refundController.getRefundsForBooking);

// ─── CHARGEBACKS & DISPUTES WORKSPACE ───
router.get('/disputes', authenticateAdmin, disputeController.listDisputes);
router.post('/disputes', authenticateAdmin, requireSuperAdmin, disputeController.openDispute);
router.post('/disputes/:disputeId/evidence', authenticateAdmin, disputeController.submitEvidence);
router.patch('/disputes/:disputeId/status', authenticateAdmin, requireSuperAdmin, disputeController.updateDisputeStatus);

// ─── WEBHOOK OBSERVABILITY & DEAD LETTER QUEUE (DLQ) ───
router.get('/webhooks/logs', authenticateAdmin, webhookObservabilityController.getWebhookLogs);
router.get('/webhooks/dlq', authenticateAdmin, webhookObservabilityController.getDLQItems);
router.post('/webhooks/replay/:eventId', authenticateAdmin, requireSuperAdmin, webhookObservabilityController.replayWebhook);
router.post('/webhooks/dlq/replay-batch', authenticateAdmin, requireSuperAdmin, webhookObservabilityController.replayBatch);
router.post('/webhooks/dlq/:eventId/resolve', authenticateAdmin, requireSuperAdmin, webhookObservabilityController.resolveDLQItem);

// ─── PAYMENT OPERATIONS & CENTRALIZED RETRY ENGINE (PHASE 6, 7 & 9) ───
router.get('/operations/metrics', authenticateAdmin, adminOperationsController.getMetrics);
router.get('/operations/search', authenticateAdmin, adminOperationsController.search);
router.get('/finance/global-search', authenticateAdmin, adminOperationsController.search);
router.get('/operations/retry-queue', authenticateAdmin, adminOperationsController.getRetryQueue);
router.post('/operations/retry-queue/:retryId/retry', authenticateAdmin, requireSuperAdmin, adminOperationsController.triggerManualRetry);
router.post('/operations/retry-queue/:retryId/cancel', authenticateAdmin, requireSuperAdmin, adminOperationsController.cancelRetry);
router.post('/operations/transfers/:transferId/retry', authenticateAdmin, requireSuperAdmin, adminOperationsController.retryTransfer);
router.post('/operations/refunds/:refundId/retry', authenticateAdmin, requireSuperAdmin, adminOperationsController.retryRefund);
router.post('/operations/settlements/:settlementId/sync', authenticateAdmin, requireSuperAdmin, adminOperationsController.retrySettlementSync);
router.post('/operations/webhooks/replay/:eventId', authenticateAdmin, requireSuperAdmin, adminOperationsController.replayWebhook);
router.post('/operations/dlq/:eventId/archive', authenticateAdmin, requireSuperAdmin, adminOperationsController.archiveDLQItem);
router.post('/operations/sellers/:sellerId/hold', authenticateAdmin, requireSuperAdmin, adminOperationsController.placePayoutHold);
router.post('/operations/sellers/:sellerId/release-hold', authenticateAdmin, requireSuperAdmin, adminOperationsController.releasePayoutHold);

// ─── PLATFORM DEPARTURES MONITORING ───
router.get('/departures/stats', authenticateAdmin, adminDepartureController.getStats);
router.get('/departures', authenticateAdmin, adminDepartureController.getDepartures);
router.get('/departures/:id', authenticateAdmin, adminDepartureController.getDepartureById);

// ─── REVIEWS & QUALITY MODERATION ───
router.get('/reviews/stats', authenticateAdmin, adminReviewController.getKPIStats);
router.get('/reviews/distribution', authenticateAdmin, adminReviewController.getRatingDistribution);
router.get('/reviews/trends', authenticateAdmin, adminReviewController.getReviewTrends);
router.get('/reviews/sentiment', authenticateAdmin, adminReviewController.getSentimentBreakdown);
router.get('/reviews/moderation', authenticateAdmin, adminReviewController.getRecentModeration);
router.get('/reviews/reported-agencies', authenticateAdmin, adminReviewController.getReportedAgencies);
router.get('/reviews/reported-travelers', authenticateAdmin, adminReviewController.getReportedTravelers);
router.get('/reviews', authenticateAdmin, adminReviewController.getReviews);
router.patch('/reviews/:id/status', authenticateAdmin, adminReviewController.updateStatus);
router.delete('/reviews/:id', authenticateAdmin, requireSuperAdmin, adminReviewController.deleteReview);

// ─── SUPPORT TICKETS & OMNICHANNEL HELPDESK ───
router.get('/support/stats', authenticateAdmin, adminSupportController.getKPIStats);
router.get('/support/tickets', authenticateAdmin, adminSupportController.getTickets);
router.get('/support/tickets/:id', authenticateAdmin, adminSupportController.getTicketById);
router.post('/support/tickets/:id/messages', authenticateAdmin, adminSupportController.addMessage);
router.patch('/support/tickets/:id/status', authenticateAdmin, adminSupportController.updateStatus);
router.get('/support/analytics', authenticateAdmin, adminSupportController.getAnalytics);

// ─── NOTIFICATIONS & MARKETING CAMPAIGNS ───
router.get('/notifications/stats', authenticateAdmin, adminNotificationController.getKPIStats);
router.get('/notifications/campaigns', authenticateAdmin, adminNotificationController.getCampaigns);
router.post('/notifications/campaigns', authenticateAdmin, requireSuperAdmin, adminNotificationController.createCampaign);
router.delete('/notifications/campaigns/:id', authenticateAdmin, requireSuperAdmin, adminNotificationController.deleteCampaign);
router.get('/notifications/header', authenticateAdmin, adminNotificationController.getHeaderNotifications);
router.get('/notifications/feed', authenticateAdmin, adminNotificationController.getFeedNotifications);
router.post('/notifications/feed', authenticateAdmin, requireSuperAdmin, adminNotificationController.createFeedNotification);
router.get('/notifications/unread-count', authenticateAdmin, adminNotificationController.getUnreadCount);
router.patch('/notifications/:id/read', authenticateAdmin, adminNotificationController.markAsRead);
router.post('/notifications/read-all', authenticateAdmin, adminNotificationController.markAllAsRead);
router.delete('/notifications/:id', authenticateAdmin, adminNotificationController.deleteNotification);
router.post('/notifications/bulk/read', authenticateAdmin, adminNotificationController.bulkMarkAsRead);
router.post('/notifications/bulk/archive', authenticateAdmin, adminNotificationController.bulkArchive);
router.post('/notifications/bulk/delete', authenticateAdmin, adminNotificationController.bulkDelete);

// ─── BI REPORTS & ANALYTICS STUDIO ───
router.get('/reports/stats', authenticateAdmin, adminReportController.getKPIStats);
router.get('/reports/library', authenticateAdmin, adminReportController.getLibrary);
router.get('/reports/revenue-trend', authenticateAdmin, adminReportController.getRevenueTrend);
router.get('/reports/booking-heatmap', authenticateAdmin, adminReportController.getBookingHeatmap);
router.get('/reports/booking-funnel', authenticateAdmin, adminReportController.getBookingFunnel);
router.get('/reports/top-destinations', authenticateAdmin, adminReportController.getTopDestinations);
router.get('/reports/agency-matrix', authenticateAdmin, adminReportController.getAgencyMatrix);
router.get('/reports/category-performance', authenticateAdmin, adminReportController.getCategoryPerformance);
router.get('/reports/ai-insights', authenticateAdmin, adminReportController.getAIInsights);
router.get('/reports/quick-stats', authenticateAdmin, adminReportController.getQuickStats);
router.get('/reports/package-analytics', authenticateAdmin, adminReportController.getPackageAnalytics);
router.get('/reports/departure-analytics', authenticateAdmin, adminReportController.getDepartureAnalytics);
router.get('/reports/booking-analytics', authenticateAdmin, adminReportController.getBookingAnalytics);
router.get('/reports/agency-analytics', authenticateAdmin, adminReportController.getAgencyAnalytics);

// ─── CMS & CONTENT STUDIO ───
router.get('/cms/stats', authenticateAdmin, adminCMSController.getKPIStats);
router.get('/cms/search', authenticateAdmin, adminCMSController.searchDatabase);
router.get('/cms/audit-logs', authenticateAdmin, adminCMSController.getAuditLogs);
router.get('/cms/scheduled', authenticateAdmin, adminCMSController.getScheduledItems);
router.get('/cms/media', authenticateAdmin, adminCMSController.getMediaLibrary);
router.post('/cms/media', authenticateAdmin, requireSuperAdmin, adminCMSController.addMediaLibraryItem);

// Hero Banners
router.get('/cms/hero-banners', authenticateAdmin, adminCMSController.getHeroBanners);
router.post('/cms/hero-banners', authenticateAdmin, requireSuperAdmin, adminCMSController.createHeroBanner);
router.patch('/cms/hero-banners/:id', authenticateAdmin, requireSuperAdmin, adminCMSController.updateHeroBanner);
router.patch('/cms/hero-banners/:id/toggle', authenticateAdmin, requireSuperAdmin, adminCMSController.toggleHeroBanner);
router.post('/cms/hero-banners/:id/restore', authenticateAdmin, requireSuperAdmin, adminCMSController.restoreHeroBannerVersion);
router.delete('/cms/hero-banners/:id', authenticateAdmin, requireSuperAdmin, adminCMSController.deleteHeroBanner);

// Announcements
router.get('/cms/announcements', authenticateAdmin, adminCMSController.getAnnouncements);
router.post('/cms/announcements', authenticateAdmin, requireSuperAdmin, adminCMSController.createAnnouncement);
router.patch('/cms/announcements/:id', authenticateAdmin, requireSuperAdmin, adminCMSController.updateAnnouncement);
router.delete('/cms/announcements/:id', authenticateAdmin, requireSuperAdmin, adminCMSController.deleteAnnouncement);

// Featured Agencies
router.get('/cms/featured-agencies', authenticateAdmin, adminCMSController.getFeaturedAgencies);
router.post('/cms/featured-agencies', authenticateAdmin, requireSuperAdmin, adminCMSController.featureAgency);
router.patch('/cms/featured-agencies/:id', authenticateAdmin, requireSuperAdmin, adminCMSController.updateFeaturedAgency);
router.delete('/cms/featured-agencies/:id', authenticateAdmin, requireSuperAdmin, adminCMSController.unfeatureAgency);

// Featured Trips
router.get('/cms/featured-trips', authenticateAdmin, adminCMSController.getFeaturedTrips);
router.post('/cms/featured-trips', authenticateAdmin, requireSuperAdmin, adminCMSController.featureTrip);
router.patch('/cms/featured-trips/:id', authenticateAdmin, requireSuperAdmin, adminCMSController.updateFeaturedTrip);
router.delete('/cms/featured-trips/:id', authenticateAdmin, requireSuperAdmin, adminCMSController.unfeatureTrip);

// Trending Destinations
router.get('/cms/trending-destinations', authenticateAdmin, adminCMSController.getTrendingDestinations);
router.get('/cms/trending-destinations/suggestions', authenticateAdmin, adminCMSController.getDestinationSuggestions);
router.post('/cms/trending-destinations', authenticateAdmin, requireSuperAdmin, adminCMSController.createTrendingDestination);
router.patch('/cms/trending-destinations/:id', authenticateAdmin, requireSuperAdmin, adminCMSController.updateTrendingDestination);
router.delete('/cms/trending-destinations/:id', authenticateAdmin, requireSuperAdmin, adminCMSController.deleteTrendingDestination);

// Campaigns
router.get('/cms/campaigns', authenticateAdmin, adminCMSController.getCampaigns);
router.post('/cms/campaigns', authenticateAdmin, requireSuperAdmin, adminCMSController.createCampaign);
router.patch('/cms/campaigns/:id', authenticateAdmin, requireSuperAdmin, adminCMSController.updateCampaign);
router.delete('/cms/campaigns/:id', authenticateAdmin, requireSuperAdmin, adminCMSController.deleteCampaign);

// Popups
router.get('/cms/popups', authenticateAdmin, adminCMSController.getPopups);
router.post('/cms/popups', authenticateAdmin, requireSuperAdmin, adminCMSController.createPopup);
router.patch('/cms/popups/:id', authenticateAdmin, requireSuperAdmin, adminCMSController.updatePopup);
router.delete('/cms/popups/:id', authenticateAdmin, requireSuperAdmin, adminCMSController.deletePopup);

// SEO
router.get('/cms/seo/all', authenticateAdmin, adminCMSController.getAllSEO);
router.get('/cms/seo/:pageKey', authenticateAdmin, adminCMSController.getSEO);
router.put('/cms/seo/:pageKey', authenticateAdmin, requireSuperAdmin, adminCMSController.saveSEO);

// CMS Selectors & Bulk Featuring
router.get('/cms/select/packages', optionalAdminAuth, adminCMSController.selectPackages);
router.get('/cms/select/agencies', optionalAdminAuth, adminCMSController.selectAgencies);
router.get('/cms/select/destinations', optionalAdminAuth, adminCMSController.selectDestinations);
router.get('/cms/select/trips', optionalAdminAuth, adminCMSController.selectTrips);
router.get('/cms/select/vehicles', optionalAdminAuth, adminCMSController.selectVehicles);
router.post('/cms/featured-trips/bulk', optionalAdminAuth, adminCMSController.bulkFeatureTrips);
router.post('/cms/featured-agencies/bulk', optionalAdminAuth, adminCMSController.bulkFeatureAgencies);
router.post('/cms/trending-destinations/bulk', optionalAdminAuth, adminCMSController.bulkCreateTrendingDestinations);

// ─── SYSTEM SETTINGS & FEATURE FLAGS ───
router.get('/settings/stats', authenticateAdmin, adminSettingsController.getKPIStats);
router.get('/settings/general', authenticateAdmin, adminSettingsController.getGeneralSettings);
router.patch('/settings/general', authenticateAdmin, requireSuperAdmin, adminSettingsController.updateGeneralSettings);
router.get('/settings/feature-flags', authenticateAdmin, adminSettingsController.getFeatureFlags);
router.patch('/settings/feature-flags/:id/toggle', authenticateAdmin, requireSuperAdmin, adminSettingsController.toggleFeatureFlag);
router.get('/settings/commission', authenticateAdmin, adminSettingsController.getCommissionSettings);
router.patch('/settings/commission', authenticateAdmin, requireSuperAdmin, adminSettingsController.updateCommissionSettings);

// ─── GLOBAL COMMAND SEARCH ───
router.get('/global-search', authenticateAdmin, adminGlobalSearchController.search);

// ─── COUPON MANAGEMENT & CAMPAIGNS ───
router.get('/coupons/stats', authenticateAdmin, couponController.adminGetStats.bind(couponController));
router.get('/coupons/analytics', authenticateAdmin, couponController.adminGetAnalytics.bind(couponController));
router.get('/coupons/export', authenticateAdmin, couponController.adminExportCoupons.bind(couponController));
router.get('/coupons', authenticateAdmin, couponController.adminListCoupons.bind(couponController));
router.post('/coupons', authenticateAdmin, couponController.adminCreateCoupon.bind(couponController));
router.patch('/coupons/:id', authenticateAdmin, couponController.adminUpdateCoupon.bind(couponController));
router.delete('/coupons/:id', authenticateAdmin, couponController.adminDeleteCoupon.bind(couponController));

// ─── PARTNER SUBSCRIPTIONS ───
router.get('/subscriptions/stats', authenticateAdmin, subscriptionController.adminGetStats.bind(subscriptionController));

export default router;


