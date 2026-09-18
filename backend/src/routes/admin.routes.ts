import { Router } from 'express';
import { adminAuthController } from '../controllers/adminAuth.controller.js';
import { adminRolesController } from '../controllers/adminRoles.controller.js';
import { adminProfileController } from '../controllers/adminProfile.controller.js';
import { adminAuditLogsController } from '../controllers/adminAuditLogs.controller.js';
import { adminDashboardController } from '../controllers/adminDashboard.controller.js';
import { adminAgencyRequestController } from '../controllers/adminAgencyRequest.controller.js';
import { adminAgencyDirectoryController } from '../controllers/adminAgencyDirectory.controller.js';
import { adminUserManagementController } from '../controllers/adminUserManagement.controller.js';
import { adminPackageController } from '../controllers/adminPackage.controller.js';
import { adminBookingController } from '../controllers/adminBooking.controller.js';
import { adminPaymentController } from '../controllers/adminPayment.controller.js';
import { adminFinanceController } from '../controllers/adminFinance.controller.js';
import { adminTripController } from '../controllers/adminTrip.controller.js';
import { adminReviewController } from '../controllers/adminReview.controller.js';
import { adminCommunityController } from '../controllers/adminCommunity.controller.js';
import { adminSupportController } from '../controllers/adminSupport.controller.js';
import { adminNotificationController } from '../controllers/adminNotification.controller.js';
import { adminReportController } from '../controllers/adminReport.controller.js';
import { adminCMSController } from '../controllers/adminCMS.controller.js';
import { adminSettingsController } from '../controllers/adminSettings.controller.js';
import { adminGlobalSearchController } from '../controllers/adminGlobalSearch.controller.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { authenticateAdmin, requireSuperAdmin } from '../middlewares/adminAuth.middleware.js';
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
router.get('/finance/top-agencies', authenticateAdmin, adminFinanceController.getTopAgencies);
router.get('/finance/settlements', authenticateAdmin, adminFinanceController.getSettlements);
router.post('/finance/settlements/:id/process', authenticateAdmin, requireSuperAdmin, adminFinanceController.processSettlement);

// ─── LIVE OPERATIONAL TRIPS & TRACKING ───
router.get('/trips/stats', authenticateAdmin, adminTripController.getStats);
router.get('/trips', authenticateAdmin, adminTripController.getTrips);
router.patch('/trips/:id/status', authenticateAdmin, adminTripController.updateTripStatus);
router.post('/trips/:id/broadcast', authenticateAdmin, adminTripController.broadcastAlert);

// ─── REVIEWS & QUALITY MODERATION ───
router.get('/reviews/stats', authenticateAdmin, adminReviewController.getKPIStats);
router.get('/reviews', authenticateAdmin, adminReviewController.getReviews);
router.patch('/reviews/:id/status', authenticateAdmin, adminReviewController.updateStatus);
router.delete('/reviews/:id', authenticateAdmin, requireSuperAdmin, adminReviewController.deleteReview);

// ─── COMMUNITY FORUMS & UGC ───
router.get('/community/stats', authenticateAdmin, adminCommunityController.getKPIStats);
router.get('/community/timeline', authenticateAdmin, adminCommunityController.getActivityTimeline);
router.get('/community/moderation-queue', authenticateAdmin, adminCommunityController.getModerationQueue);
router.get('/community/feed', authenticateAdmin, adminCommunityController.getRecentFeed);
router.post('/community/posts/:id/approve', authenticateAdmin, adminCommunityController.approvePost);
router.post('/community/posts/:id/reject', authenticateAdmin, adminCommunityController.rejectPost);
router.delete('/community/posts/:id', authenticateAdmin, requireSuperAdmin, adminCommunityController.removePost);
router.post('/community/announcements', authenticateAdmin, requireSuperAdmin, adminCommunityController.createAnnouncement);

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
router.get('/reports/geographic', authenticateAdmin, adminReportController.getGeographicData);
router.get('/reports/top-destinations', authenticateAdmin, adminReportController.getTopDestinations);
router.get('/reports/agency-matrix', authenticateAdmin, adminReportController.getAgencyMatrix);
router.get('/reports/category-performance', authenticateAdmin, adminReportController.getCategoryPerformance);
router.get('/reports/ai-insights', authenticateAdmin, adminReportController.getAIInsights);
router.get('/reports/quick-stats', authenticateAdmin, adminReportController.getQuickStats);

// ─── CMS & CONTENT STUDIO ───
router.get('/cms/stats', authenticateAdmin, adminCMSController.getKPIStats);
router.get('/cms/hero-banners', authenticateAdmin, adminCMSController.getHeroBanners);
router.post('/cms/hero-banners', authenticateAdmin, requireSuperAdmin, adminCMSController.createHeroBanner);
router.delete('/cms/hero-banners/:id', authenticateAdmin, requireSuperAdmin, adminCMSController.deleteHeroBanner);
router.get('/cms/announcements', authenticateAdmin, adminCMSController.getAnnouncements);
router.post('/cms/announcements', authenticateAdmin, requireSuperAdmin, adminCMSController.createAnnouncement);

// ─── SYSTEM SETTINGS & FEATURE FLAGS ───
router.get('/settings/stats', authenticateAdmin, adminSettingsController.getKPIStats);
router.get('/settings/general', authenticateAdmin, adminSettingsController.getGeneralSettings);
router.patch('/settings/general', authenticateAdmin, requireSuperAdmin, adminSettingsController.updateGeneralSettings);
router.get('/settings/feature-flags', authenticateAdmin, adminSettingsController.getFeatureFlags);
router.patch('/settings/feature-flags/:id/toggle', authenticateAdmin, requireSuperAdmin, adminSettingsController.toggleFeatureFlag);

// ─── GLOBAL COMMAND SEARCH ───
router.get('/global-search', authenticateAdmin, adminGlobalSearchController.search);

export default router;


