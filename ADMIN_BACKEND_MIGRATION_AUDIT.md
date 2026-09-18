# APNATRIP ADMIN PANEL — MASTER ENGINEERING AUDIT & BACKEND MIGRATION BLUEPRINT
**Document Reference:** `ADMIN_BACKEND_MIGRATION_AUDIT.md`  
**Author:** Senior Software Architect, Senior Backend/Frontend Engineer, MongoDB Database Architect  
**Version:** 1.0.0 (Production Master)  
**Status:** PHASE 1 COMPLETED — AWAITING USER APPROVAL TO COMMENCE PHASE 2 MIGRATION  
**Target Environment:** ApnaTrip Monorepo (`frontend/src/admin-panel`, `backend/src`)  

---

# EXECUTIVE SUMMARY

An exhaustive, end-to-end engineering inspection of the entire ApnaTrip Super Admin and Admin Panel has been conducted. Every page, component, drawer, modal, filter bar, table, chart, KPI card, activity stream, and background service was analyzed across all route trees (`/admin/*`, `/super-admin/*`).

### Key Metrics
* **Total Admin Modules Audited:** 20 Modules + Cross-Cutting Global Systems
* **Total Frontend Files Scanned:** 168 TypeScript/React source files
* **Total Backend Files Analyzed:** 54 Controllers, Models, Routes, and Services
* **Current Overall Backend Coverage:** **40.0% Production Ready** (8 Modules 100% Live, 1 Module 25% Live, 11 Modules 0% Mock/LocalStorage)
* **Hardcoded Data Identifiers Isolated:** 18 dedicated mock files, 32 storage keys, over 4,500 lines of static JSON/mock data structures.

---

# MASTER AUDIT SUMMARY DASHBOARD

| Module / Page Route | Primary UI Purpose | Current Status | Backend Coverage % | Primary Data Source |
| :--- | :--- | :---: | :---: | :--- |
| **1. Auth & Login (`/admin/login`, `/admin/reset-password`)** | Super Admin authentication, OTP & password recovery | ✅ Production Ready | **100%** | MongoDB `admins`, `admin_sessions`, `password_resets` |
| **2. Executive Dashboard (`/admin/dashboard`, `/admin`)** | Executive KPI telemetry, real-time revenue & health | ✅ Production Ready | **100%** | MongoDB Aggregations (`bookings`, `payments`, `agencies`, `packages`, `audit_logs`) |
| **3. Agency Verification (`/admin/verification-pending`)** | B2B KYC verification, doc approval & rejection | ✅ Production Ready | **100%** | MongoDB `agencies`, `audit_logs` |
| **4. Agencies Directory (`/admin/agencies`, `/admin/agencies/:id`)** | Agency directory, status toggles & detail inspector | ✅ Production Ready | **100%** | MongoDB `agencies`, `packages`, `bookings` |
| **5. Traveler Users (`/admin/users`)** | Traveler lifecycle, 5-tab inspector, KYC, ban/purge | ✅ Production Ready | **100%** | MongoDB `users`, `bookings`, `payments`, `audit_logs` |
| **6. Roles & RBAC (`/admin/roles`)** | Permissions matrix, role cloning, access requests | ✅ Production Ready | **100%** | MongoDB `roles`, `permissions`, `access_requests`, `admins` |
| **7. Audit Logs (`/admin/audit-logs`)** | SOC 2 security logs, admin action telemetry | ✅ Production Ready | **100%** | MongoDB `audit_logs`, `admins` |
| **8. Admin Profile (`/admin/profile`)** | Admin credentials, session termination, preferences | ✅ Production Ready | **100%** | MongoDB `admins`, `admin_sessions` |
| **9. Packages Management (`/admin/packages`)** | Travel package catalog, approval, pricing & seats | 🔴 Mock / LocalStorage | **0%** | `adminPackageManagement.service.ts` (LocalStorage) |
| **10. Bookings Master (`/admin/bookings`)** | Booking engine, traveler manifests, status updates | 🔴 Mock / LocalStorage | **0%** | `adminBookingManagement.service.ts` (LocalStorage) |
| **11. Payments & Ledger (`/admin/payments`)** | Transaction logs, gateway recon, refunds | 🔴 Mock / LocalStorage | **0%** | `adminPaymentManagement.service.ts` (LocalStorage) |
| **12. Finance & Settlements (`/admin/finance`)** | Financial analytics, payout engine, commissions | 🔴 Mock / LocalStorage | **0%** | `adminFinanceManagement.service.ts` (Static Mock) |
| **13. Live Operational Trips (`/admin/trips`)** | Active itineraries, driver/guide info, SOS alerts | 🔴 Mock / LocalStorage | **0%** | `adminTripManagement.service.ts` (Static Mock) |
| **14. Reviews & Ratings (`/admin/reviews`)** | Customer ratings, sentiment analysis, moderation | 🔴 Mock / LocalStorage | **0%** | `reviewsData.ts` & `adminReviewManagement.service.ts` |
| **15. Community Hub (`/admin/community`)** | Traveler posts, feed moderation, announcements | 🔴 Mock / LocalStorage | **0%** | `communityData.ts` & `adminCommunityManagement.service.ts` |
| **16. Support Desk (`/admin/support`)** | Helpdesk ticketing, conversation workspace | 🔴 Mock / LocalStorage | **0%** | `supportData.ts` & `adminSupportManagement.service.ts` |
| **17. Notifications Center (`/admin/notifications`)** | Broadcast campaigns, device previews, rules | 🔴 Mock / LocalStorage | **0%** | `notificationsData.ts` & `adminNotificationsManagement.service.ts` |
| **18. Business Reports (`/admin/reports`)** | BI analytics, scheduled exports, AI insights | 🔴 Mock / LocalStorage | **0%** | `reportsData.ts` & `adminReportsManagement.service.ts` |
| **19. CMS & Content (`/admin/cms`)** | Hero banners, trending destinations, popups, SEO | 🔴 Mock / LocalStorage | **0%** | `cmsData.ts` & `adminCMSManagement.service.ts` |
| **20. Platform Settings (`/admin/settings`)** | System settings, feature flags, API integrations | 🟡 Partial | **25%** | `settingsData.ts` (General settings partial mock) |
| **Global Services (Search, Header, Activity)** | Command Palette search, header alerts, real-time feed | 🔴 Mock / LocalStorage | **10%** | `globalSearchData.ts`, `headerNotificationsData.ts` |

---

# SECTION 1: DETAILED PAGE-BY-PAGE ENGINEERING AUDIT

---

## PAGE 1: Authentication & Password Recovery (`/admin/login`, `/admin/reset-password`)

### 1. Purpose
Provides secure administrative authentication, multi-factor login verification, forgot password token generation, password reset handling, session creation with IP and User-Agent telemetry, and active token refresh mechanism.

### 2. UI Components
* `AdminLoginCard`: Email/password form with validation, rate-limiting feedback, and remember-me toggle.
* `AdminResetPasswordCard`: Reset token validator, new password input, strength meter, and confirmation state.
* `AdminProtectedRoute`: Route guard verifying JWT integrity and RBAC clearance before rendering children.

### 3. Current Data Source
| Component | Current Source | Status |
| :--- | :--- | :---: |
| Admin Authentication | Backend API (`/api/admin/auth/login`) | ✅ |
| Google OAuth Exchange | Backend API (`/api/admin/auth/google`) | ✅ |
| Password Recovery Dispatch | Backend API (`/api/admin/auth/forgot-password`) | ✅ |
| Password Reset Action | Backend API (`/api/admin/auth/reset-password`) | ✅ |
| Session Token Refresh | Backend API (`/api/admin/auth/refresh`) | ✅ |
| Identity Resolver | Backend API (`/api/admin/auth/me`) | ✅ |

### 4. Hardcoded Data Inventory
* **None.** No dummy credentials, fallback tokens, or mock auth stores remain.

### 5. Existing Backend Resources
* **Model:** `AdminModel` (`backend/src/models/admin.model.ts`), `AdminSessionModel` (`backend/src/models/adminSession.model.ts`), `PasswordResetModel` (`backend/src/models/passwordReset.model.ts`).
* **Controller:** `adminAuthController` (`backend/src/controllers/adminAuth.controller.ts`).
* **Service:** `adminAuthService` (`backend/src/services/adminAuth.service.ts`), `mailService` (`backend/src/services/mail.service.ts`).
* **Routes:** `POST /api/admin/auth/login`, `POST /api/admin/auth/google`, `POST /api/admin/auth/forgot-password`, `POST /api/admin/auth/reset-password`, `POST /api/admin/auth/refresh`, `POST /api/admin/auth/logout`, `GET /api/admin/auth/me`.

### 6. Database Mapping
* MongoDB Collection: `admins`, `admin_sessions`, `password_resets`.

### 7. Final Status
* **Coverage:** **100% Production Ready**

---

## PAGE 2: Executive Dashboard (`/admin/dashboard`, `/admin`)

### 1. Purpose
Acts as the central command center for Super Admins, displaying aggregated platform metrics across GMV, bookings, verified agencies, traveler acquisition, revenue trends, live operational queues, system health, and quick actions.

### 2. UI Components
* `DashboardHeader`: Time-range selector (7d, 30d, 90d, 1y), live status badge, and export summary trigger.
* `DashboardStatsSection`: 8 primary metric KPI cards with delta percentages and sparklines.
* `RevenueOverviewChart`: Recharts dual-axis area chart plotting platform revenue vs GMV over selected timeframe.
* `BookingTrendChart`: Daily and weekly booking volume vs cancellation rate.
* `UserGrowthChart` & `AgencyGrowthChart`: Registration velocity bar charts.
* `RecentActivityTable`: Stream of latest platform events (audits, agency registrations, high-value bookings).
* `LatestTransactionsTable`: Recent payment transactions with status badges and quick receipts.
* `PendingApprovalsQueue`: Agency KYC verification and package approval urgent action queue.
* `SystemHealthWidget`: Database latency, memory utilization, API uptime, and WebSocket health.
* `LiveOperationsDrawer`: Real-time traveler tracking and active trip monitors.

### 3. Current Data Source
| Component | Current Source | Status |
| :--- | :--- | :---: |
| 8 Top KPI Metric Cards | Backend Aggregation (`/api/admin/dashboard/stats`) | ✅ |
| Revenue & GMV Charts | Backend Aggregation (`/api/admin/dashboard/charts`) | ✅ |
| Booking Volume Trends | Backend Aggregation (`/api/admin/dashboard/charts`) | ✅ |
| User & Agency Growth Charts | Backend Aggregation (`/api/admin/dashboard/charts`) | ✅ |
| Recent Platform Activities | Backend Feed (`/api/admin/dashboard/recent-activities`) | ✅ |
| Latest Transactions Feed | Backend Feed (`/api/admin/dashboard/latest-transactions`) | ✅ |
| Pending Approvals Queue | Backend Feed (`/api/admin/dashboard/pending-approvals`) | ✅ |
| Live System Health Status | Backend Telemetry (`/api/admin/dashboard/system-health`) | ✅ |

### 4. Hardcoded Data Inventory
* **None.** Data service `adminDashboard.service.ts` directly consumes 11 live MongoDB endpoints.

### 5. Existing Backend Resources
* **Controller:** `adminDashboardController` (`backend/src/controllers/adminDashboard.controller.ts`).
* **Service:** `adminDashboardService` (`backend/src/services/adminDashboard.service.ts`).
* **Routes:** `GET /api/admin/dashboard/stats`, `GET /api/admin/dashboard/charts`, `GET /api/admin/dashboard/recent-activities`, `GET /api/admin/dashboard/latest-transactions`, `GET /api/admin/dashboard/pending-approvals`, `GET /api/admin/dashboard/system-health`, `GET /api/admin/dashboard/live`, `GET /api/admin/dashboard/active-trips`, `GET /api/admin/dashboard/payment-queue`, `GET /api/admin/dashboard/support-queue`, `GET /api/admin/dashboard/quick-actions`.

### 6. Database Mapping
* MongoDB Collections: `bookings`, `payments`, `agencies`, `packages`, `users`, `audit_logs`.

### 7. Final Status
* **Coverage:** **100% Production Ready**

---

## PAGE 3: Agency Verification & KYC Requests (`/admin/verification-pending`)

### 1. Purpose
Enterprise B2B onboarding verification pipeline where compliance officers review agency business registrations (GST, PAN, Trade License, Incorporation Certificate, Aadhaar, Bank Accounts), request specific document re-uploads with rejection reasons, save internal review notes, and execute single/bulk approvals or rejections.

### 2. UI Components
* `AgencyRequestHeader`: Title, search, and CSV export trigger.
* `AgencyRequestKPIs`: 6 summary cards (Pending, Approved Today, Rejected Today, Under Review, Missing Docs, Avg Approval Time).
* `AgencyRequestFilters`: Tab switcher (All, Pending, Under Review, Needs Docs, Approved, Rejected), search, date picker.
* `AgencyRequestTable`: Sortable columns, agency avatar, owner details, GST/PAN badges, document completeness meter, quick action buttons.
* `AgencyReviewDrawer`: Multi-tab deep inspection (Overview, Business Docs, Bank Details, Review Notes, Audit History).
* `RequestDocumentsModal`: Selective document request modal with checkbox list and custom feedback notes.
* `RejectAgencyModal`: Rejection reason selector with compliance notes.
* `ApproveConfirmModal`: Approval confirmation modal with role assignment and welcome email trigger.

### 3. Current Data Source
| Component | Current Source | Status |
| :--- | :--- | :---: |
| 6 KYC KPI Stats Cards | Backend Aggregation (`/api/admin/agency-requests/stats`) | ✅ |
| Paginated Requests Table | Backend Query (`/api/admin/agency-requests`) | ✅ |
| Agency Detail & Docs Drawer | Backend Query (`/api/admin/agency-requests/:id`) | ✅ |
| Document Selective Approval | Backend Action (`/api/admin/agency-requests/:id/approve-documents`) | ✅ |
| Bank Account Verification | Backend Action (`/api/admin/agency-requests/:id/approve-bank`) | ✅ |
| Request Specific Documents | Backend Action (`/api/admin/agency-requests/:id/request-documents`) | ✅ |
| Final Approval / Rejection | Backend Actions (`/api/admin/agency-requests/:id/approve`, `reject`) | ✅ |
| Compliance Review Notes | Backend Action (`/api/admin/agency-requests/:id/notes`) | ✅ |
| Bulk KYC Actions | Backend Action (`/api/admin/agency-requests/bulk-action`) | ✅ |

### 4. Hardcoded Data Inventory
* **None.** Service `adminAgencyRequest.service.ts` fully connected to backend.

### 5. Existing Backend Resources
* **Model:** `AgencyModel` (`backend/src/models/agency.model.ts`), `AuditLogModel` (`backend/src/models/auditLog.model.ts`).
* **Controller:** `adminAgencyRequestController` (`backend/src/controllers/adminAgencyRequest.controller.ts`).
* **Service:** `adminAgencyRequestService` (`backend/src/services/adminAgencyRequest.service.ts`).

### 6. Database Mapping
* MongoDB Collections: `agencies` (embedded `onboardingData`, `documents`, `bankDetails`, `verificationStatus`), `audit_logs`.

### 7. Final Status
* **Coverage:** **100% Production Ready**

---

## PAGE 4: Approved Agencies Directory (`/admin/agencies`, `/admin/agencies/:id`)

### 1. Purpose
Directory and lifecycle governance of all fully verified travel agencies on the platform. Enables Super Admins to monitor active packages, total bookings, earned revenue, payout status, compliance health, commission tier configuration, and account suspension/termination.

### 2. UI Components
* `AgencyDirectoryHeader`: Search, filter toggle, new agency invitation button, and CSV export.
* `AgencyDirectoryKPIs`: 6 KPI metrics (Total Agencies, Active, Suspended, Total Packages Listed, Total Platform GMV Generated, Average Agency Rating).
* `AgencyDirectoryFilters`: Search query, status dropdown, state/city filter, rating filter.
* `AgencyDirectoryTable`: Paginated table showing agency branding, contact info, total packages, total bookings, lifetime GMV, status pill, and action menu.
* `AgencyDeepInspectorDrawer`: Detailed breakdown of packages, bookings, performance metrics, and audit history.
* `StatusChangeModal`: Suspend / Reactivate / Ban agency modal with mandatory reason logging.

### 3. Current Data Source
| Component | Current Source | Status |
| :--- | :--- | :---: |
| 6 Directory KPI Stats | Backend Aggregation (`/api/admin/agencies/stats`) | ✅ |
| Paginated Agencies Table | Backend Query (`/api/admin/agencies`) | ✅ |
| Single Agency Inspector | Backend Query (`/api/admin/agencies/:id`) | ✅ |
| Status Update (Active/Suspended) | Backend Action (`/api/admin/agencies/:id/status`) | ✅ |
| Bulk Agency Actions | Backend Action (`/api/admin/agencies/bulk-action`) | ✅ |

### 4. Hardcoded Data Inventory
* **None.** Data service `adminAgency.service.ts` fully connected to backend.

### 5. Existing Backend Resources
* **Model:** `AgencyModel` (`backend/src/models/agency.model.ts`).
* **Controller:** `adminAgencyDirectoryController` (`backend/src/controllers/adminAgencyDirectory.controller.ts`).
* **Service:** `adminAgencyDirectoryService` (`backend/src/services/adminAgencyDirectory.service.ts`).

### 6. Database Mapping
* MongoDB Collections: `agencies`, `packages`, `bookings`.

### 7. Final Status
* **Coverage:** **100% Production Ready**

---

## PAGE 5: Traveler Users Management (`/admin/users`)

### 1. Purpose
Complete customer and traveler lifecycle management module. Allows Super Admins to manage registered traveler accounts, inspect detailed traveler profiles, verify traveler KYC documents, view traveler bookings and transaction histories, reset traveler passwords, dispatch direct notifications, and perform bulk account suspensions or permanent GDPR-compliant deletions.

### 2. UI Components
* `AdminUserHeader`: Search, new traveler trigger, CSV export button.
* `UserKPISection`: 6 metric cards (Total Users, Active, New Today, Premium, Suspended, Verified Travelers).
* `UserFilterPanel`: Search input, status dropdown, verification status, membership tier, country/state/city cascaders.
* `UsersTable` & `UserTableRow`: Sortable columns, traveler avatar, email, phone, location, total bookings, total spent, status badge, action dropdown.
* `UserDetailsDrawer`: 5-tab inspector (Overview, Bookings History, Transaction Ledger, Support Tickets, Security & Audit Logs).
* `CreateUserModal`: New user creation form with validation.
* `EditUserModal`: Profile updater modal.
* `UserActionConfirmModal`: Suspension, ban, and deletion confirmation modal.
* `SendNotificationModal`: Direct push/email notification dispatcher modal.
* `UserBulkActionBar`: Sticky bottom bar for bulk status updates, notification broadcast, and bulk export.
* `UserPagination`: Server-side page navigation and limit selector.

### 3. Current Data Source
| Component | Current Source | Status |
| :--- | :--- | :---: |
| 6 User KPI Cards | Backend Aggregation (`/api/admin/users/stats`) | ✅ |
| Paginated Users Table | Backend Query (`/api/admin/users`) | ✅ |
| 5-Tab Traveler Deep Inspector | Backend Query (`/api/admin/users/:id`) | ✅ |
| Create Traveler User | Backend Action (`/api/admin/users`) | ✅ |
| Update Traveler Profile | Backend Action (`/api/admin/users/:id`) | ✅ |
| Delete / Purge User | Backend Action (`/api/admin/users/:id`) | ✅ |
| Bulk Traveler Actions | Backend Action (`/api/admin/users/bulk-action`) | ✅ |
| Reset Traveler Password | Backend Action (`/api/admin/users/:id/reset-password`) | ✅ |
| Send Direct Notification | Backend Action (`/api/admin/users/:id/notifications`) | ✅ |
| Export Travelers CSV | Backend Action (`/api/admin/users/export`) | ✅ |

### 4. Hardcoded Data Inventory
* **None.** All seeded dummy traveler accounts (`arjun.mehta`, `diya.sharma`, etc.) purged from MongoDB Atlas. `adminUserManagement.service.ts` directly consumes live MongoDB endpoints.

### 5. Existing Backend Resources
* **Model:** `UserModel` (`backend/src/models/user.model.ts`), `BookingModel`, `PaymentModel`, `AuditLogModel`.
* **Controller:** `adminUserManagementController` (`backend/src/controllers/adminUserManagement.controller.ts`).
* **Service:** `adminUserManagementService` (`backend/src/services/adminUserManagement.service.ts`).

### 6. Database Mapping
* MongoDB Collections: `users`, `bookings`, `payments`, `audit_logs`.

### 7. Final Status
* **Coverage:** **100% Production Ready**

---

## PAGE 6: Travel Packages Management (`/admin/packages`)

### 1. Purpose
Master marketplace catalog management for all tour packages created by travel agencies. Super Admins review submitted tour packages, approve or reject packages for marketplace publishing, feature packages on the homepage, edit itinerary/pricing details, inspect booking performance, and manage package inventory/seats.

### 2. UI Components
* `AdminPackageHeader`: Title, search, "Add Package" trigger, and CSV export.
* `PackageKPISection`: 6 summary cards (Total Packages, Active Packages, Pending Review, Draft Packages, Sold Out, Featured Packages).
* `PackageFilterPanel`: Search input, category dropdown (Luxury, Adventure, Family, Honeymoon, Budget), status dropdown (Active, Inactive, Archived), approval status (Approved, Pending, Rejected), destination filter, price range slider.
* `PackagesTable` & `PackageTableRow`: Sortable columns, package thumbnail, title, agency name & logo, destination country & flag, duration (Days/Nights), price (original vs current), seats meter, bookings count, rating, approval badge, action menu.
* `PackageDetailsDrawer`: Comprehensive deep drawer (Overview, Itinerary Timeline, Inclusions/Exclusions, Pricing & Tier Breakdown, Recent Bookings, Audit Log).
* `AddPackageModal`: Full multi-step package builder modal.
* `EditPackageModal`: Package updater modal.
* `PackageActionConfirmModal`: Approval / Rejection / Feature toggle confirmation modal.
* `PackageBulkActionBar`: Sticky bottom bar for bulk approval, bulk feature, and bulk archive.
* `PackagePagination`: Page navigation and limits.

### 3. Current Data Source
| Component | Current Source | Status |
| :--- | :--- | :---: |
| 6 Package KPI Stats | LocalStorage / Mock (`initialPackageKPIStats`) | 🔴 |
| Packages Table Data | LocalStorage (`STORAGE_KEY_PACKAGES`) | 🔴 |
| Filter & Search | Frontend In-Memory Array Filtering | 🔴 |
| Package Details Drawer | LocalStorage Item & Dummy Bookings | 🔴 |
| Add / Edit Package | LocalStorage Mutation | 🔴 |
| Package Approval / Rejection | LocalStorage Mutation | 🔴 |
| Feature / Unfeature Toggle | LocalStorage Mutation | 🔴 |
| Bulk Package Actions | LocalStorage Mutation | 🔴 |
| Package Export CSV | Client-side Blob Generator | 🔴 |

### 4. Hardcoded Data Inventory
* **File:** `frontend/src/admin-panel/services/adminPackageManagement.service.ts`
  * `initialPackageKPIStats`: Static object with fake numbers (Total: 5482, Active: 4916, Pending: 124, Draft: 215, Sold Out: 37, Featured: 412).
  * `initialAdminPackages`: Hardcoded array of 10 extensive fake tour packages (Magical Switzerland, Bali Paradise, Golden Triangle Tour, Dubai Extravaganza, etc.) with fake itineraries, fake images, fake inclusions, and fake bookings.
  * `STORAGE_KEY_PACKAGES = 'apnatrip_admin_packages_list'`
  * `STORAGE_KEY_PACKAGE_STATS = 'apnatrip_admin_packages_kpi_stats'`
  * `Action`: Entire mock dataset and LocalStorage handler must be completely removed.

### 5. Existing Backend Resources
* **Model:** `PackageModel` exists at `backend/src/models/package.model.ts` (contains `agencyId`, `title`, `description`, `destinations`, `duration`, `price`, `itinerary`, `inclusions`, `exclusions`, `images`, `status`, `approvalStatus`, `featured`, `seats`).
* **Route:** `backend/src/routes/package.routes.ts` exists as a stub.
* **Agency Package Controller:** Agency panel package controllers exist for agency-side creation.

### 6. Missing Backend Features
* `GET /api/admin/packages/stats`: Aggregates total, active, pending review, draft, sold-out, and featured packages.
* `GET /api/admin/packages`: Server-side paginated package query with search, category, status, approvalStatus, destination, and sorting.
* `GET /api/admin/packages/:id`: Returns full package document populated with agency details, live booking stats, and audit history.
* `POST /api/admin/packages`: Super Admin package creation.
* `PATCH /api/admin/packages/:id`: Update package details, pricing, seats, and content.
* `PATCH /api/admin/packages/:id/approval`: Approve or reject package with review notes.
* `PATCH /api/admin/packages/:id/feature`: Toggle featured flag.
* `DELETE /api/admin/packages/:id`: Delete or archive package.
* `POST /api/admin/packages/bulk-action`: Bulk approve, reject, archive, or feature packages.
* `GET /api/admin/packages/export`: Server-side CSV streaming.

### 7. Database Mapping
* MongoDB Collection: `packages` (referenced to `agencies` collection via `agencyId`).

### 8. Migration Strategy
* **Backend:** Implement `adminPackage.controller.ts`, `adminPackage.service.ts`, validation schemas in `validations/adminPackage.validation.ts`, and register routes in `backend/src/routes/admin.routes.ts`.
* **Frontend:** Refactor `adminPackageManagement.service.ts` to call `adminApiClient` methods targeting `/admin/packages/*`. Remove all LocalStorage references and `initialAdminPackages`.

### 9. Risk Analysis
* **Risk:** Data integrity mismatch between agency-created packages and admin updates.
* **Mitigation:** Strict Mongoose schema validation; ensure `agencyId` populated properly; log all admin approval actions in `audit_logs`.

### 10. Final Status
* **Coverage:** **0% (Requires Full Backend Migration)**

---

## PAGE 7: Master Bookings & Passenger Manifests (`/admin/bookings`)

### 1. Purpose
Central bookings clearinghouse for the entire platform. Super Admins monitor reservation flow, traveler manifests, ticket issuance, booking modifications, cancellations, manual confirmations, payment status reconciliations, and tax invoices.

### 2. UI Components
* `AdminBookingHeader`: Title, search, export manifest trigger, and summary stats.
* `BookingKPISection`: 6 KPI cards (Total Bookings, Confirmed, Pending, Cancelled, Total Revenue, Refunded Amount).
* `BookingFilterPanel`: Search input, booking status dropdown (All, Confirmed, Pending, Cancelled, Completed), payment status (Paid, Partial, Pending, Refunded), agency selector, date range picker.
* `BookingsTable` & `BookingTableRow`: Sortable columns, booking ID, traveler details (name, avatar, phone), package name & thumbnail, agency name, travel dates, passenger count, total amount, booking & payment status badges, action menu.
* `BookingDetailsDrawer`: Deep inspector (Reservation Overview, Passenger Manifest List with IDs/Passports, Price & Tax Breakdown, Payment Details, Agency Info, Modification History).
* `ModifyBookingModal`: Booking date adjustment, seat count modification, and status overrides.
* `BookingActionConfirmModal`: Cancel booking / Refund trigger modal.
* `InvoiceViewModal`: Printable HTML/PDF tax invoice modal with GSTIN and agency breakdown.
* `BookingBulkActionBar`: Bulk confirmation, bulk cancellation, and bulk manifest export.
* `BookingPagination`: Server-side page navigation.

### 3. Current Data Source
| Component | Current Source | Status |
| :--- | :--- | :---: |
| 6 Booking KPI Stats | LocalStorage / Mock (`initialBookingKPIStats`) | 🔴 |
| Bookings Table Data | LocalStorage (`STORAGE_KEY_BOOKINGS`) | 🔴 |
| Filter & Search | Frontend In-Memory Array Filtering | 🔴 |
| Passenger Manifest Drawer | LocalStorage Item & Static Travelers List | 🔴 |
| Modify Booking Details | LocalStorage Mutation | 🔴 |
| Cancel Booking / Refund | LocalStorage Mutation | 🔴 |
| Invoice Generator | Local Mock JSON Template | 🔴 |
| Bulk Booking Actions | LocalStorage Mutation | 🔴 |

### 4. Hardcoded Data Inventory
* **File:** `frontend/src/admin-panel/services/adminBookingManagement.service.ts`
  * `initialBookingKPIStats`: Static object (Total: 18642, Confirmed: 13782, Pending: 1236, Cancelled: 1842, Revenue: ₹24.68 Cr, Refunded: ₹1.32 Cr).
  * `initialAdminBookings`: Hardcoded array of 12 full fake booking objects (`BK-2024-0001`, `BK-2024-0002`, etc.) with mock passenger manifests (`Arjun Mehta`, `Priya Mehta`, passport numbers, phone numbers).
  * `STORAGE_KEY_BOOKINGS = 'apnatrip_admin_bookings_list'`
  * `STORAGE_KEY_BOOKING_STATS = 'apnatrip_admin_bookings_kpi_stats'`
  * `Action`: Remove completely and replace with live backend MongoDB pipeline.

### 5. Existing Backend Resources
* **Model:** `BookingModel` exists at `backend/src/models/booking.model.ts` (contains `userId`, `packageId`, `agencyId`, `travelers`, `totalAmount`, `status`, `paymentStatus`, `startDate`, `endDate`, `specialRequests`).
* **Route:** `backend/src/routes/booking.routes.ts` exists as a stub.

### 6. Missing Backend Features
* `GET /api/admin/bookings/stats`: Live aggregation of total bookings, confirmed, pending, cancelled, GMV, and refunds.
* `GET /api/admin/bookings`: Paginated booking query with search, bookingStatus, paymentStatus, agencyId, dateRange, and sorting.
* `GET /api/admin/bookings/:id`: Full populated booking object (with `User`, `Package`, `Agency`, `Payment`).
* `PATCH /api/admin/bookings/:id`: Admin booking modification (travel dates, passenger details, status).
* `POST /api/admin/bookings/:id/cancel`: Admin-initiated cancellation with automated refund trigger.
* `GET /api/admin/bookings/:id/invoice`: Structured invoice data endpoint.
* `POST /api/admin/bookings/bulk-action`: Bulk status changes and exports.
* `GET /api/admin/bookings/export`: CSV / Excel passenger manifest streamer.

### 7. Database Mapping
* MongoDB Collection: `bookings` (linked to `users`, `packages`, `agencies`, `payments`).

### 8. Migration Strategy
* **Backend:** Implement `adminBooking.controller.ts`, `adminBooking.service.ts`, validation schemas, and register routes in `backend/src/routes/admin.routes.ts`.
* **Frontend:** Refactor `adminBookingManagement.service.ts` to consume live `/admin/bookings/*` endpoints.

### 9. Risk Analysis
* **Risk:** Financial discrepancy if booking cancellation does not sync with payment gateway refund status.
* **Mitigation:** Wrap booking status updates and payment refund records in atomic transactions or strict event flows.

### 10. Final Status
* **Coverage:** **0% (Requires Full Backend Migration)**

---

## PAGE 8: Payments Ledger & Gateway Reconciliation (`/admin/payments`)

### 1. Purpose
Complete transaction ledger, payment gateway reconciliations (Razorpay, Stripe, UPI), settlement tracking, refund management, platform fee audits, GST breakdowns, and dispute resolution.

### 2. UI Components
* `AdminPaymentHeader`: Title, search, reconciliation trigger, export ledger button.
* `PaymentKPISection`: 7 summary cards (Total Transactions, Today's Revenue, Pending Settlements, Successful Payments, Failed Payments, Completed Refunds, Platform Commission).
* `PaymentFilterBar`: Search input, gateway selector (Razorpay, Stripe, Cashfree, UPI), payment method (Credit Card, Net Banking, UPI, Wallet), payment status (Success, Pending, Failed, Refunded), settlement status (Settled, Pending, Processing).
* `PaymentTable` & `PaymentTableRow`: Sortable transaction ID, gateway ID, booking ID, traveler details, agency name, net amount, platform fee, GST amount, payment method, gateway response, settlement status, action menu.
* `PaymentDrawer`: Deep inspection (Transaction Metadata, Gateway Response Payload, Fee Breakdown, Linked Booking & Agency, Refund History).
* `PaymentInvoiceModal`: Printable GST payment receipt.
* `PaymentActionConfirmModal`: Manual refund issuance and dispute mark modal.
* `PaymentBulkActionBar`: Bulk settlement confirmation and reconciliation.
* `PaymentPagination`: Server-side page navigation.

### 3. Current Data Source
| Component | Current Source | Status |
| :--- | :--- | :---: |
| 7 Payment KPI Stats | LocalStorage / Mock (`initialPaymentKPIStats`) | 🔴 |
| Transactions Table | LocalStorage (`STORAGE_KEY_PAYMENTS`) | 🔴 |
| Filter & Search | Frontend In-Memory Array Filtering | 🔴 |
| Payment Detail Drawer | LocalStorage Item & Mock Metadata | 🔴 |
| Process Refund Action | LocalStorage Mutation | 🔴 |
| Reconcile Transactions | LocalStorage Mutation | 🔴 |
| Payment Receipt Modal | Client-side Template Generator | 🔴 |

### 4. Hardcoded Data Inventory
* **File:** `frontend/src/admin-panel/services/adminPaymentManagement.service.ts`
  * `initialPaymentKPIStats`: Static object (Total: 96524, Today: ₹1.68 Cr, Pending Settlements: ₹3.74 Cr, Success: 88421, Failed: 1842, Refunds: 742, Commission: ₹7.68 Cr).
  * `initialAdminPayments`: Hardcoded array of 15 fake transaction items (`TXN-984512`, `pay_PN8xZlYp7m9QxR`, etc.) with mock GST numbers and authorization codes.
  * `STORAGE_KEY_PAYMENTS = 'apnatrip_admin_payments_list'`
  * `STORAGE_KEY_PAYMENT_STATS = 'apnatrip_admin_payments_kpi_stats'`
  * `Action`: Remove completely and replace with live backend MongoDB pipeline.

### 5. Existing Backend Resources
* **Model:** `PaymentModel` exists at `backend/src/models/payment.model.ts` (contains `bookingId`, `userId`, `agencyId`, `amount`, `currency`, `status`, `paymentMethod`, `transactionId`, `gatewayResponse`).
* **Route:** `backend/src/routes/payment.routes.ts` exists as a stub.

### 6. Missing Backend Features
* `GET /api/admin/payments/stats`: Aggregations of total GMV, successful transactions, failed, refunds, platform commissions, and pending settlements.
* `GET /api/admin/payments`: Paginated transaction list with multi-filters and sorting.
* `GET /api/admin/payments/:id`: Populated transaction detail with gateway logs.
* `POST /api/admin/payments/:id/refund`: Admin-initiated partial/full refund endpoint.
* `POST /api/admin/payments/reconcile`: Trigger gateway sync/reconciliation.
* `GET /api/admin/payments/export`: Ledger export to CSV/Excel.

### 7. Database Mapping
* MongoDB Collection: `payments` (referenced to `bookings`, `users`, `agencies`).

### 8. Migration Strategy
* **Backend:** Implement `adminPayment.controller.ts`, `adminPayment.service.ts`, validation schemas, and routes in `backend/src/routes/admin.routes.ts`.
* **Frontend:** Refactor `adminPaymentManagement.service.ts` to call live backend endpoints.

### 9. Risk Analysis
* **Risk:** Inaccurate commission or GST calculations.
* **Mitigation:** Ensure MongoDB aggregations strictly adhere to the standard platform fee (e.g., 10%) and 18% GST rules.

### 10. Final Status
* **Coverage:** **0% (Requires Full Backend Migration)**

---

## PAGE 9: Finance Command Center & Agency Settlements (`/admin/finance`)

### 1. Purpose
Executive financial analytics, revenue tracking, agency payout disbursement engine, commission tier management, platform profitability analysis, and destination revenue distribution.

### 2. UI Components
* `AdminFinanceHeader`: Time-range filter, download financial statement trigger, and payout cycle scheduler.
* `FinanceStats`: 6 financial KPI widgets (GMV, Platform Revenue, Platform Profit, Pending Payouts, Completed Settlements, Refund Total).
* `RevenueOverviewChart`: Multi-line chart of Gross Volume vs Net Platform Earnings over time.
* `CommissionBreakdown`: Pie chart and progress bars showing commission earnings across categories (Luxury, Budget, Adventure, Group Tours).
* `RevenueDestinationChart`: Horizontal bar chart of top revenue-generating destinations.
* `TopPerformingAgencies`: Ranked table of highest-earning travel agencies with payout health badges.
* `FinancialSummary`: Monthly and quarterly financial summary breakdown.
* `RefundAnalytics`: Refund rate vs dispute resolution metrics.
* `SettlementTable`: Agency payout queue table with payout status, bank details, pending balance, and "Release Payout" trigger.
* `SettlementDetailModal`: Payout breakdown modal showing gross bookings, platform fee deduction, TDS deduction, and net disbursement.
* `FinancialTimeline`: Audit stream of financial disbursements.
* `AgencyFinanceSidebar`: Quick inspector for agency financial health.

### 3. Current Data Source
| Component | Current Source | Status |
| :--- | :--- | :---: |
| 6 Finance KPI Widgets | Mock Object (`initialFinanceKPIStats`) | 🔴 |
| Revenue Overview Chart | Mock Points (`initialRevenueTrend`) | 🔴 |
| Commission Breakdown Chart | Mock Array (`initialCommissionBreakdown`) | 🔴 |
| Destination Revenue Chart | Mock Array (`initialDestinationRevenue`) | 🔴 |
| Top Performing Agencies | Mock Array (`initialTopAgencies`) | 🔴 |
| Settlements Table | Mock Array (`initialSettlementsList`) | 🔴 |
| Release Payout Action | Mock Promise Delay | 🔴 |
| Settlement Detail Modal | Mock Data Object | 🔴 |

### 4. Hardcoded Data Inventory
* **File:** `frontend/src/admin-panel/services/adminFinanceManagement.service.ts`
  * `initialFinanceKPIStats`: Static metrics (GMV: ₹24.68 Cr, Revenue: ₹3.74 Cr, Profit: ₹2.18 Cr, Payouts: ₹8.73 Cr, Settlements: ₹15.95 Cr).
  * `initialRevenueTrend`, `initialCommissionBreakdown`, `initialDestinationRevenue`, `initialTopAgencies`, `initialSettlementsList`: 350+ lines of static chart data and fake agency payout records.
  * `Action`: Remove completely; replace with live aggregation pipelines from `payments` and `bookings`.

### 5. Existing Backend Resources
* **Models:** `PaymentModel` (`backend/src/models/payment.model.ts`), `BookingModel` (`backend/src/models/booking.model.ts`), `AgencyModel` (`backend/src/models/agency.model.ts`).

### 6. Missing Backend Features
* `GET /api/admin/finance/stats`: Aggregations of GMV, platform revenue, net profit, pending agency balances, and completed settlements.
* `GET /api/admin/finance/charts`: Time-series revenue, commission breakdown, and top destination revenue data.
* `GET /api/admin/finance/top-agencies`: Aggregation of top agencies by revenue and payout status.
* `GET /api/admin/finance/settlements`: Paginated agency settlement records with bank details and balances.
* `POST /api/admin/finance/settlements/:id/process`: Trigger payout execution and mark settlement as processed.
* `GET /api/admin/finance/summary`: Financial quarter summary and refund analytics.

### 7. Database Mapping
* MongoDB Collections: `payments`, `bookings`, `agencies`.

### 8. Migration Strategy
* **Backend:** Implement `adminFinance.controller.ts` and `adminFinance.service.ts` running MongoDB aggregation pipelines over `payments` and `bookings`.
* **Frontend:** Refactor `adminFinanceManagement.service.ts` to call live backend endpoints.

### 9. Risk Analysis
* **Risk:** Payout balance calculation desynchronization if cancelled bookings are not deducted from agency pending balance.
* **Mitigation:** Calculate agency pending balance dynamically as `SUM(successful_bookings.agencyEarnings) - SUM(processed_settlements) - SUM(refunds)`.

### 10. Final Status
* **Coverage:** **0% (Requires Full Backend Migration)**

---

## PAGE 10: Live Operational Trips & Tracking (`/admin/trips`)

### 1. Purpose
Real-time operational monitoring of currently ongoing tours, upcoming departures, completed itineraries, traveler safety status, guide/driver assignments, weather alerts, and SOS emergency requests.

### 2. UI Components
* `AdminTripsHeader`: Live trip counter, search, "Create Custom Trip" trigger, and emergency broadcast button.
* `TripsKPIStats`: 5 summary widgets (Total Trips, Active Trips, Upcoming Trips, Completed Trips, Cancelled Trips).
* `TripFilterPanel`: Search input, trip status filter (Active, Upcoming, Completed, Delayed, Critical), destination filter, agency filter.
* `TripTable` & `TripTableRow`: Sortable trip ID, package name, destination, agency, traveler count, departure/return dates, live itinerary progress bar, current location badge, emergency status, action menu.
* `TripDetailsDrawer`: Deep drawer (Live GPS/Location Map, Day-by-Day Itinerary Progress, Assigned Tour Guide & Vehicle Info, Traveler Manifest with Emergency Contacts, Incident Log).
* `TripAnalyticsWidgets`: Trip volume trend chart, destination distribution, and status breakdown.
* `CreateTripModal`: Manual custom trip initializer modal.
* `TripBulkActionBar`: Bulk broadcast alert and status updater.
* `TripPagination`: Server-side page navigation.

### 3. Current Data Source
| Component | Current Source | Status |
| :--- | :--- | :---: |
| 5 Trip KPI Stats | Mock Object (`initialTripKPIStats`) | 🔴 |
| Trips Table Data | Mock Array (`initialAdminTrips`) | 🔴 |
| Filter & Search | Frontend In-Memory Array Filtering | 🔴 |
| Trip Details Drawer | Mock Data Object & Static Traveler List | 🔴 |
| Trip Analytics Charts | Mock Static Data Points | 🔴 |
| Create Custom Trip | Mock In-Memory Array Mutation | 🔴 |

### 4. Hardcoded Data Inventory
* **File:** `frontend/src/admin-panel/services/adminTripManagement.service.ts`
  * `initialTripKPIStats`: Static metrics (Total: 4286, Active: 426, Upcoming: 318, Completed: 3152, Cancelled: 97).
  * `initialAdminTrips`: Hardcoded array of 12 fake active trip records (`TRIP-2024-001`, `TRIP-2024-002`, etc.) with mock guide names, vehicle numbers, and GPS coordinates.
  * `Action`: Remove completely; dynamically compute trips from confirmed `bookings` and `packages`.

### 5. Existing Backend Resources
* **Models:** `BookingModel`, `PackageModel`, `AgencyModel`, `UserModel`.
* **Route:** `backend/src/routes/trip.routes.ts` exists as a stub.

### 6. Missing Backend Features
* `GET /api/admin/trips/stats`: Live computed stats based on `startDate` and `endDate` of confirmed bookings.
* `GET /api/admin/trips`: Paginated trip query grouping bookings by package departure date with live status derivation (`Upcoming` if `startDate > now`, `Active` if `startDate <= now <= endDate`, `Completed` if `endDate < now`).
* `GET /api/admin/trips/:id`: Comprehensive trip manifest, itinerary progress, and emergency contact list.
* `PATCH /api/admin/trips/:id/status`: Update operational status (e.g. Delayed, Weather Alert).
* `POST /api/admin/trips/:id/broadcast`: Send emergency push/SMS alert to all travelers on trip.

### 7. Database Mapping
* MongoDB Collections: `bookings` (primary source), `packages`, `agencies`, `users`.

### 8. Migration Strategy
* **Backend:** Implement `adminTrip.controller.ts` and `adminTrip.service.ts` aggregating over `bookings` collection matching confirmed status.
* **Frontend:** Refactor `adminTripManagement.service.ts` to call live backend endpoints.

### 9. Risk Analysis
* **Risk:** Timezone discrepancies affecting trip active/completed status calculations.
* **Mitigation:** Store all timestamps in UTC ISO 8601 strings and perform date boundary comparisons using standard server UTC timestamps.

### 10. Final Status
* **Coverage:** **0% (Requires Full Backend Migration)**

---

## PAGE 11: Reviews & Content Moderation (`/admin/reviews`)

### 1. Purpose
Customer ratings governance, traveler review moderation, sentiment analysis, fake review detection, agency dispute mediation, and verified traveler badge verification.

### 2. UI Components
* `AdminReviewsHeader`: Title, search, export reviews trigger.
* `ReviewKPIStats`: 5 KPI cards (Total Reviews, Average Rating, Verified Reviews %, Pending Moderation, Flagged/Reported Reviews).
* `ReviewFilterSection`: Search input, star rating filter (5★, 4★, 3★, 2★, 1★), sentiment filter (Positive, Neutral, Negative), moderation status (Approved, Pending, Flagged, Hidden), agency filter.
* `ReviewTable` & `ReviewTableRow`: Sortable review ID, traveler avatar & name, package name, agency name, star rating, review text snippet, photo thumbnails, sentiment badge, moderation status, action menu.
* `ReviewDetailsDrawer`: Full review inspector (Full Review Text, Uploaded High-Res Photos, Verified Booking Link, Traveler Profile, Agency Response Thread, AI Sentiment Breakdown, Moderation Action Log).
* `ReviewAnalyticsSection`: Star rating distribution histogram and daily/weekly/monthly review volume trends.
* `ReviewBottomAnalytics`: Sentiment breakdown pie chart, top reported agencies, and top flagged users.
* `ImagePreviewModal`: Fullscreen modal for photo evidence inspection.
* `ReviewPagination`: Server-side page navigation.

### 3. Current Data Source
| Component | Current Source | Status |
| :--- | :--- | :---: |
| 5 Review KPI Stats | Mock Data (`reviewsData.ts`) | 🔴 |
| Reviews Table Data | Mock Array (`initialReviewsData` in `reviewsData.ts`) | 🔴 |
| Rating Distribution Histogram | Mock Object (`initialRatingDistribution`) | 🔴 |
| Review Trend Chart | Mock Points (`initialReviewTrendDaily/Weekly/Monthly`) | 🔴 |
| Sentiment Breakdown Chart | Mock Array (`initialSentimentBreakdown`) | 🔴 |
| Moderation Actions (Approve/Hide/Delete) | Local In-Memory Array Mutation | 🔴 |

### 4. Hardcoded Data Inventory
* **File:** `frontend/src/admin-panel/data/reviewsData.ts`
  * 450+ lines of static fake reviews (`REV-2024-001` to `REV-2024-015`), mock star ratings, and hardcoded sentiment breakdowns.
* **File:** `frontend/src/admin-panel/services/adminReviewManagement.service.ts`
  * In-memory state machine holding `initialReviewsData`.
  * `Action`: Delete `reviewsData.ts` mock data and replace service with real backend API calls.

### 5. Existing Backend Resources
* **Models:** `UserModel`, `PackageModel`, `AgencyModel`, `BookingModel`.
* **Missing Schema:** `ReviewModel` (needs creation at `backend/src/models/review.model.ts`).

### 6. Missing Backend Features
* **New Model:** `ReviewModel` schema (`userId`, `packageId`, `agencyId`, `bookingId`, `rating`, `title`, `comment`, `photos`, `sentiment`, `status`, `agencyReply`, `helpfulVotes`, `flagReason`).
* `GET /api/admin/reviews/stats`: Live review count, avg rating, pending moderation, flagged count.
* `GET /api/admin/reviews`: Paginated reviews with multi-filters and sorting.
* `GET /api/admin/reviews/:id`: Detailed review with populated user, package, and agency info.
* `PATCH /api/admin/reviews/:id/status`: Approve, flag, hide, or restore review.
* `DELETE /api/admin/reviews/:id`: Permanently purge spam/inappropriate review.
* `GET /api/admin/reviews/analytics`: Star distribution and sentiment aggregations.

### 7. Database Mapping
* MongoDB Collection: `reviews` (linked to `users`, `packages`, `agencies`, `bookings`).

### 8. Migration Strategy
* **Backend:** Create `ReviewModel`, implement `adminReview.controller.ts`, `adminReview.service.ts`, validation schemas, and routes.
* **Frontend:** Refactor `adminReviewManagement.service.ts` to call live backend endpoints.

### 9. Risk Analysis
* **Risk:** Inappropriate UGC content or fake reviews appearing without moderation.
* **Mitigation:** Default new reviews to `Pending` or run automated keyword/sentiment checks upon submission.

### 10. Final Status
* **Coverage:** **0% (Requires Full Backend Migration)**

---

## PAGE 12: Community Hub & Traveler UGC Moderation (`/admin/community`)

### 1. Purpose
Governance of traveler social feed, community discussion posts, travel stories, photos/videos, user warnings, spam takedowns, platform-wide community announcements, and engagement analytics.

### 2. UI Components
* `AdminCommunityHeader`: Title, search, "Create Announcement" trigger, and rules configuration modal.
* `CommunityKPIStats`: 5 summary cards (Total Posts, Active Creators, Engagement Rate, Pending Moderation Queue, Flagged Content).
* `CommunityModerationQueue`: Card-based moderation queue for flagged user posts with quick "Approve", "Take Down", or "Warn User" buttons.
* `RecentCommunityFeedTable`: Paginated table of all community posts showing author avatar, post type (Story, Photo, Tip, Question), content snippet, likes, comments, shares, status badge, action menu.
* `CommunityAnalyticsRow`: Post activity timeline chart, engagement funnel stage chart, and content type distribution pie chart.
* `CommunityBottomWidgets`: Trending travel destinations, community health score gauge, and top community creators.
* `CommunityActivitySidebar`: Real-time stream of community likes, comments, and reports.
* `CreateAnnouncementModal`: Rich announcement creator with pinned status and target audience selector.
* `WarnUserModal`: Custom warning dispatcher modal with violation categorization.

### 3. Current Data Source
| Component | Current Source | Status |
| :--- | :--- | :---: |
| 5 Community KPI Stats | Mock Data (`communityData.ts`) | 🔴 |
| Flagged Moderation Queue | Mock Array (`initialModerationQueueData`) | 🔴 |
| Recent Feed Table | Mock Array (`initialRecentFeedData`) | 🔴 |
| Activity Timeline Chart | Mock Points (`initialActivityDaily/Weekly/Monthly`) | 🔴 |
| Engagement Funnel | Mock Array (`initialEngagementFunnel`) | 🔴 |
| Trending Destinations & Creators | Mock Arrays (`initialTrendingDestinations`, `initialTopCreators`) | 🔴 |
| Moderate Post Action | Local In-Memory Array Mutation | 🔴 |
| Create Announcement Action | Local In-Memory Array Mutation | 🔴 |

### 4. Hardcoded Data Inventory
* **File:** `frontend/src/admin-panel/data/communityData.ts`
  * 400+ lines of static fake community posts, mock user warnings, and fake creator rankings.
* **File:** `frontend/src/admin-panel/services/adminCommunityManagement.service.ts`
  * In-memory mock store.
  * `Action`: Delete `communityData.ts` mock data and replace service with real backend API calls.

### 5. Existing Backend Resources
* **Models:** `UserModel`, `AuditLogModel`.
* **Route:** `backend/src/routes/community.routes.ts` exists as a stub.
* **Missing Schema:** `CommunityPostModel` (`backend/src/models/communityPost.model.ts`).

### 6. Missing Backend Features
* **New Model:** `CommunityPostModel` schema (`authorId`, `type`, `title`, `content`, `media`, `likesCount`, `commentsCount`, `sharesCount`, `status`, `flags`, `isPinned`, `isAnnouncement`).
* `GET /api/admin/community/stats`: Live KPI telemetry for community health.
* `GET /api/admin/community/posts`: Paginated posts query with type, status, and search filters.
* `GET /api/admin/community/moderation-queue`: Filtered list of flagged/pending posts.
* `PATCH /api/admin/community/posts/:id/moderate`: Approve, reject, or take down post.
* `POST /api/admin/community/announcements`: Create official platform announcement post.
* `POST /api/admin/community/users/:id/warn`: Issue official compliance warning to traveler.
* `GET /api/admin/community/analytics`: Engagement analytics and trending tags.

### 7. Database Mapping
* MongoDB Collection: `community_posts` (linked to `users`).

### 8. Migration Strategy
* **Backend:** Create `CommunityPostModel`, implement `adminCommunity.controller.ts`, `adminCommunity.service.ts`, validation schemas, and routes.
* **Frontend:** Refactor `adminCommunityManagement.service.ts` to call live backend endpoints.

### 9. Risk Analysis
* **Risk:** High-frequency spam or inappropriate media uploads.
* **Mitigation:** Enforce Cloudinary media moderation and rate-limiting on community endpoints.

### 10. Final Status
* **Coverage:** **0% (Requires Full Backend Migration)**

---

## PAGE 13: Support Desk & Omnichannel Ticketing (`/admin/support`)

### 1. Purpose
Customer support ticketing, dispute resolution workspace, omnichannel conversation thread (Email, In-App Chat, Ticket), SLA breach monitoring, agent ticket assignment, and canned response automation.

### 2. UI Components
* `AdminSupportHeader`: Title, search, SLA countdown status, and "New Ticket" trigger.
* `SupportKPIStats`: 5 summary widgets (Open Tickets, In Progress, Resolved Today, SLA Breach Risk, Avg Response Time).
* `SupportTicketQueue`: Split-pane ticket queue showing ticket ID, customer name & avatar, subject, category (Booking, Refund, Verification, Technical), priority pill (Urgent, High, Medium, Low), SLA timer badge, unread indicator.
* `SupportConversationWorkspace`: Real-time chat workspace displaying full message history, traveler profile sidebar, linked booking card, internal agent private notes tab, attachment previews, canned response selector, and ticket status updater.
* `SupportAnalyticsDashboard`: Ticket volume by category chart, resolution rate meter, and agent performance rankings.

### 3. Current Data Source
| Component | Current Source | Status |
| :--- | :--- | :---: |
| 5 Support KPI Stats | Mock Data (`supportData.ts`) | 🔴 |
| Ticket Queue Data | Mock Array (`initialSupportTickets`) | 🔴 |
| Ticket Conversation Messages | Mock Array (`messages` inside `supportData.ts`) | 🔴 |
| Send Agent Reply Action | Local In-Memory Array Mutation | 🔴 |
| Update Ticket Status & Priority | Local In-Memory Array Mutation | 🔴 |
| Support Analytics Charts | Mock Static Data Points | 🔴 |

### 4. Hardcoded Data Inventory
* **File:** `frontend/src/admin-panel/data/supportData.ts`
  * 380+ lines of static tickets (`TCK-2024-8901` to `TCK-2024-8910`), mock customer complaints, and fake agent replies.
* **File:** `frontend/src/admin-panel/services/adminSupportManagement.service.ts`
  * In-memory mock store.
  * `Action`: Delete `supportData.ts` mock data and replace service with real backend API calls.

### 5. Existing Backend Resources
* **Model:** `SupportTicketModel` exists at `backend/src/models/supportTicket.model.ts` (contains `ticketNumber`, `userId`, `agencyId`, `subject`, `description`, `category`, `priority`, `status`, `assignedTo`, `messages`).
* **Route:** `backend/src/routes/support.routes.ts` exists as a stub.

### 6. Missing Backend Features
* `GET /api/admin/support/stats`: Live ticket metrics (open, in progress, resolved, SLA breach count).
* `GET /api/admin/support/tickets`: Paginated ticket query with category, priority, status, and search.
* `GET /api/admin/support/tickets/:id`: Full populated ticket with message thread and traveler/booking details.
* `POST /api/admin/support/tickets/:id/reply`: Admin reply dispatcher (adds message to thread and emits WebSocket / email event).
* `PATCH /api/admin/support/tickets/:id/status`: Update status (Open, In Progress, Resolved, Closed).
* `PATCH /api/admin/support/tickets/:id/assign`: Assign ticket to specific admin agent.
* `POST /api/admin/support/tickets`: Create new ticket.
* `GET /api/admin/support/analytics`: Resolution rate and category aggregations.

### 7. Database Mapping
* MongoDB Collection: `support_tickets` (linked to `users`, `agencies`, `admins`).

### 8. Migration Strategy
* **Backend:** Implement `adminSupport.controller.ts`, `adminSupport.service.ts`, validation schemas, WebSocket event emission on new replies, and routes.
* **Frontend:** Refactor `adminSupportManagement.service.ts` to call live backend endpoints.

### 9. Risk Analysis
* **Risk:** Agent reply latency or lost customer notifications.
* **Mitigation:** Synchronize WebSocket message delivery with automated fallback transactional email delivery via `mailService`.

### 10. Final Status
* **Coverage:** **0% (Requires Full Backend Migration)**

---

## PAGE 14: Notifications & Marketing Campaigns (`/admin/notifications`)

### 1. Purpose
Omnichannel broadcast notification engine, marketing push campaigns, SMS/Email broadcasts, automated notification trigger rules (Booking Confirmed, Payment Failed, Trip Reminder), device live previews (iOS, Android, Web), and delivery rate analytics.

### 2. UI Components
* `AdminNotificationsHeader`: Title, search, and "New Campaign" trigger.
* `NotificationKPIStats`: 5 KPI cards (Total Sent, Delivery Rate %, Open Rate %, Click Rate %, Active Automated Campaigns).
* `CampaignLibrary`: Grid and table view of all marketing campaigns with status (Draft, Scheduled, Active, Completed), target audience, channel (Push, Email, In-App), delivery stats, and action menu.
* `CampaignBuilder`: Multi-step campaign designer (Campaign Metadata, Audience Segmentation, Message Content with Rich Media, Delivery Schedule).
* `NotificationDevicePreview`: Real-time phone simulator showing how the notification will look on iOS lock screen, Android drawer, and Web desktop banner.
* `NotificationFeedSection`: Live feed of system notifications and alerts.
* `NotificationCenterFiltersBar`: Channel, status, and search filters.
* `NotificationCenterKPIs` & `NotificationBottomAnalytics`: Open rates over time, top performing campaigns, and failure logs.
* `NotificationSmartGroupsSidebar`: Preset customer segment counts (e.g. "Frequent Bookers", "Inactive >30d").
* `NotificationRulesModal`: Automated trigger rule builder.
* `AISummaryModal`: AI-generated copy optimizer modal.

### 3. Current Data Source
| Component | Current Source | Status |
| :--- | :--- | :---: |
| 5 Notification KPI Stats | Mock Data (`notificationsData.ts`) | 🔴 |
| Campaign Library Data | Mock Array (`initialCampaignsData`) | 🔴 |
| Delivery Analytics Charts | Mock Static Objects (`initialNotificationAnalytics`) | 🔴 |
| Create / Schedule Campaign | Local In-Memory Array Mutation | 🔴 |
| Send Instant Broadcast | Local In-Memory Array Mutation | 🔴 |

### 4. Hardcoded Data Inventory
* **File:** `frontend/src/admin-panel/data/notificationsData.ts`
  * 320+ lines of static campaign records (`CMP-2024-001` to `CMP-2024-008`), fake open rates, and hardcoded audience counts.
* **File:** `frontend/src/admin-panel/services/adminNotificationsManagement.service.ts`
  * In-memory mock store.
  * `Action`: Delete `notificationsData.ts` mock data and replace service with real backend API calls.

### 5. Existing Backend Resources
* **Models:** `UserModel`, `AuditLogModel`.
* **Services:** `mailService` (`backend/src/services/mail.service.ts`), `socketService` (`backend/src/services/socket.service.ts`).
* **Missing Schema:** `CampaignModel` (`backend/src/models/campaign.model.ts`).

### 6. Missing Backend Features
* **New Model:** `CampaignModel` schema (`title`, `message`, `type`, `channel`, `audience`, `targetCount`, `sentCount`, `deliveredCount`, `openedCount`, `clickedCount`, `status`, `scheduledFor`, `sentAt`, `rules`).
* `GET /api/admin/notifications/stats`: Live delivery metrics and engagement percentages.
* `GET /api/admin/notifications/campaigns`: Paginated list of campaigns.
* `POST /api/admin/notifications/campaigns`: Create, schedule, or instantly dispatch broadcast campaign.
* `PATCH /api/admin/notifications/campaigns/:id`: Edit scheduled campaign.
* `DELETE /api/admin/notifications/campaigns/:id`: Cancel or delete campaign.
* `GET /api/admin/notifications/analytics`: Time-series engagement rates.

### 7. Database Mapping
* MongoDB Collection: `campaigns` (referenced to `users`).

### 8. Migration Strategy
* **Backend:** Create `CampaignModel`, implement `adminNotifications.controller.ts`, `adminNotifications.service.ts`, background dispatcher job, and routes.
* **Frontend:** Refactor `adminNotificationsManagement.service.ts` to call live backend endpoints.

### 9. Risk Analysis
* **Risk:** Mass email or push spamming if audience segmentation is misconfigured.
* **Mitigation:** Implement preview mode, confirmation step with exact calculated recipient count, and rate-limited batch dispatching.

### 10. Final Status
* **Coverage:** **0% (Requires Full Backend Migration)**

---

## PAGE 15: Business Reports & Intelligence (`/admin/reports`)

### 1. Purpose
Executive business intelligence, financial reports generator, booking heatmaps, agency performance matrix, geographic revenue distribution, scheduled automated PDF/CSV exports, and AI-powered business growth insights.

### 2. UI Components
* `AdminReportsHeader`: Date range filter, category tab switcher, and "Create Custom Report" trigger.
* `ReportKPIStats`: 5 summary widgets (Total Reports Generated, Active Automated Schedules, Data Freshness, Export Storage Used, AI Insights Generated).
* `ReportLibrary`: Catalog of standard report templates (Financial Statements, GST Tax Summary, Agency Performance Scorecards, Traveler Retention Analysis, Cancellation Audit).
* `ReportsAnalyticsWorkspace`: Interactive data studio featuring:
  * Monthly Revenue Trend vs Forecast Chart
  * Weekly Booking Density Heatmap Matrix (7 Days × 24 Hours)
  * Geographic Region Revenue Breakdown Map / Bar Chart
  * Top Destination Performance Table
  * Agency Matrix Bubble Chart (Volume vs Commission vs Rating)
  * Category Performance Breakdown Progress Bars
* `ExecutiveInsightsSidebar`: Curated AI business insights cards with actionable recommendations.
* `CreateCustomReportModal`: Custom query and metric builder modal.

### 3. Current Data Source
| Component | Current Source | Status |
| :--- | :--- | :---: |
| 5 Report KPI Stats | Mock Data (`reportsData.ts`) | 🔴 |
| Report Library Templates | Mock Array (`initialReportLibraryData`) | 🔴 |
| Revenue Forecast Chart | Mock Points (`initialRevenueTrend`) | 🔴 |
| Booking Heatmap Matrix | Mock 2D Array (`initialBookingHeatmapMatrix`) | 🔴 |
| Geographic Revenue Breakdown | Mock Array (`initialGeographicData`) | 🔴 |
| Top Destination Reports | Mock Array (`initialTopDestinations`) | 🔴 |
| Agency Matrix Bubble Chart | Mock Array (`initialAgencyMatrixBubbles`) | 🔴 |
| Executive AI Insights | Mock Array (`initialAIInsights`) | 🔴 |
| Generate & Export Report Action | Mock Progress Bar & Fake Download | 🔴 |

### 4. Hardcoded Data Inventory
* **File:** `frontend/src/admin-panel/data/reportsData.ts`
  * 390+ lines of static chart data, fake AI insights, mock heatmap numbers, and dummy report templates.
* **File:** `frontend/src/admin-panel/services/adminReportsManagement.service.ts`
  * In-memory mock store.
  * `Action`: Delete `reportsData.ts` mock data and replace service with real backend aggregation endpoints.

### 5. Existing Backend Resources
* **Models:** `BookingModel`, `PaymentModel`, `UserModel`, `AgencyModel`, `PackageModel`.
* **Route:** `backend/src/routes/report.routes.ts` exists as a stub.

### 6. Missing Backend Features
* `GET /api/admin/reports/stats`: Report generation counters and data freshness timestamps.
* `GET /api/admin/reports/templates`: List of available report schemas.
* `GET /api/admin/reports/analytics/revenue-trend`: Time-series revenue trend from `payments`.
* `GET /api/admin/reports/analytics/booking-heatmap`: Hourly/daily booking distribution from `bookings`.
* `GET /api/admin/reports/analytics/geographic`: Revenue grouped by traveler state/country.
* `GET /api/admin/reports/analytics/agency-matrix`: Agency booking volume vs rating aggregations.
* `POST /api/admin/reports/generate`: Generate dynamic CSV or JSON report file on demand.

### 7. Database Mapping
* MongoDB Collections: `bookings`, `payments`, `users`, `agencies`, `packages`.

### 8. Migration Strategy
* **Backend:** Implement `adminReport.controller.ts` and `adminReport.service.ts` running high-performance MongoDB aggregation pipelines with `$group`, `$facet`, and `$bucket`.
* **Frontend:** Refactor `adminReportsManagement.service.ts` to call live backend endpoints.

### 9. Risk Analysis
* **Risk:** Heavy aggregation queries slowing down database performance.
* **Mitigation:** Add compound indexes on `bookings.createdAt`, `payments.createdAt`, `payments.status`, and leverage `$project` early in aggregation pipelines.

### 10. Final Status
* **Coverage:** **0% (Requires Full Backend Migration)**

---

## PAGE 16: Content Management System & Hero Banners (`/admin/cms`)

### 1. Purpose
Management of public storefront web and mobile content, hero promotional banners, global platform announcements, featured agencies, curated trending trips, promotional popups, homepage sections order, and storefront SEO metadata.

### 2. UI Components
* `AdminCMSHeader`: Storefront environment switcher, "Live Preview" modal trigger, and "New Content" button.
* `CMSCategorySidebar`: Navigation between CMS modules (Hero Banners, Announcements, Trending Destinations, Featured Agencies, Featured Trips, Promo Campaigns, Popups, Homepage Sections, SEO Config).
* `CMSKPIStats`: 4 summary widgets (Active Banners, Scheduled Items, Total Clicks, SEO Health Score).
* `HeroBannerEditor`: Banner cards list with drag-and-drop order, click-through URLs, target dates, and edit/delete actions.
* `AnnouncementManager`: Storefront marquee banner announcements manager.
* `TrendingDestinationsEditor`: Card grid with destination image, badges, search volume, and visibility toggles.
* `FeaturedAgenciesEditor` & `FeaturedTripsEditor`: Verified agency and package selector for homepage highlight.
* `PromotionalCampaignsEditor` & `PopupManagerEditor`: Timed promotional modal and coupon popup manager.
* `HomepageSectionsEditor`: Dynamic layout ordering of homepage blocks.
* `SEOEditor`: Meta tags, OpenGraph images, Twitter cards, and structured JSON-LD editor.
* `CMSLiveStorefrontPreview`: Embedded mockup previewing storefront appearance with applied CMS data.
* `NewBannerModal`, `NewAnnouncementModal`, `NewCampaignModal`, `NewPopupModal`: Content creators.

### 3. Current Data Source
| Component | Current Source | Status |
| :--- | :--- | :---: |
| 4 CMS KPI Stats | LocalStorage / Mock (`cmsData.ts`) | 🔴 |
| Hero Banners Data | LocalStorage (`CMS_STORAGE_KEY`) | 🔴 |
| Storefront Announcements | LocalStorage (`CMS_STORAGE_KEY`) | 🔴 |
| Trending Destinations | LocalStorage (`CMS_STORAGE_KEY`) | 🔴 |
| Featured Agencies & Trips | LocalStorage (`CMS_STORAGE_KEY`) | 🔴 |
| Popups & Campaigns | LocalStorage (`CMS_STORAGE_KEY`) | 🔴 |
| SEO Metadata Config | LocalStorage (`CMS_STORAGE_KEY`) | 🔴 |
| Content Creation & Editing | LocalStorage Mutations | 🔴 |

### 4. Hardcoded Data Inventory
* **File:** `frontend/src/admin-panel/data/cmsData.ts`
  * 450+ lines of static banner objects, fake promo popups, dummy destination lists, and hardcoded SEO metadata.
* **File:** `frontend/src/admin-panel/services/adminCMSManagement.service.ts`
  * LocalStorage wrapper (`CMS_STORAGE_KEY = 'apnatrip_admin_cms_data_v2'`).
  * `Action`: Delete `cmsData.ts` mock data and replace service with real backend API calls.

### 5. Existing Backend Resources
* **Models:** `PackageModel`, `AgencyModel`, `AuditLogModel`.
* **Route:** `backend/src/routes/cms.routes.ts` exists as a stub.
* **Missing Schema:** `CMSContentModel` (`backend/src/models/cmsContent.model.ts`).

### 6. Missing Backend Features
* **New Model:** `CMSContentModel` schema (`key`, `type`, `title`, `subtitle`, `imageUrl`, `targetUrl`, `badgeText`, `startDate`, `endDate`, `priority`, `isActive`, `metadata`).
* `GET /api/admin/cms/all`: Fetch all CMS blocks categorized.
* `GET /api/admin/cms/:type`: Fetch specific section (banners, announcements, popups, seo).
* `POST /api/admin/cms/:type`: Add new banner/announcement/popup item.
* `PUT /api/admin/cms/:type/:id`: Update item details and images.
* `DELETE /api/admin/cms/:type/:id`: Remove item.
* `PATCH /api/admin/cms/:type/reorder`: Persist drag-and-drop sort order.
* `GET /api/public/cms/homepage`: Public endpoint for storefront frontend to load live banners and sections.

### 7. Database Mapping
* MongoDB Collection: `cms_contents` (referenced to `packages` and `agencies`).

### 8. Migration Strategy
* **Backend:** Create `CMSContentModel`, implement `adminCMS.controller.ts`, `adminCMS.service.ts`, validation schemas, and public storefront endpoints.
* **Frontend:** Refactor `adminCMSManagement.service.ts` to call live backend endpoints.

### 9. Risk Analysis
* **Risk:** Broken banner links or expired promotional popups displaying on the live storefront.
* **Mitigation:** Implement automated expiration filters (`endDate >= now`) in query pipelines.

### 10. Final Status
* **Coverage:** **0% (Requires Full Backend Migration)**

---

## PAGE 17: Roles & RBAC Governance (`/admin/roles`)

### 1. Purpose
Enterprise Role-Based Access Control governance. Super Admins create custom admin roles, configure granular module-by-module permission matrices (View, Create, Edit, Delete, Export, Approve), assign admins to roles, review elevation access requests, track active admin sessions, and terminate suspicious logins.

### 2. UI Components
* `AdminRolesHeader`: Title, search, and "Create Role" trigger.
* `RoleKPISection`: 5 summary cards (Total Admins, Active Roles, Super Admins, Pending Access Requests, Active Sessions).
* `RolesTable`: List of roles with admin count, privilege badge, and duplicate/delete triggers.
* `PermissionMatrix`: Interactive 168-cell matrix where Super Admins toggle checkboxes for each permission on a selected role.
* `AdminsPrivilegeList`: Table of all authorized admins with role assignment dropdowns and status toggles.
* `AccessRequestsQueue`: Table of permission elevation requests with one-click approve/reject actions.
* `ActiveSessionsDrawer`: Real-time session tracker with IP addresses, browser agents, and remote termination buttons.

### 3. Current Data Source
| Component | Current Source | Status |
| :--- | :--- | :---: |
| 5 Role KPI Stats | Backend Aggregation (`/api/admin/roles/dashboard`) | ✅ |
| Roles List & Duplication | Backend API (`/api/admin/roles`) | ✅ |
| 168-Permission Matrix | Backend API (`/api/admin/permissions`, `/roles/:id/permissions`) | ✅ |
| Authorized Admins List | Backend API (`/api/admin/admins`) | ✅ |
| Access Elevation Requests | Backend API (`/api/admin/roles/access-requests`) | ✅ |
| Live Admin Sessions | Backend API (`/api/admin/sessions`, `/sessions/terminate-all`) | ✅ |

### 4. Hardcoded Data Inventory
* **None.** Service `adminRolesManagement.service.ts` and `adminAccessControl.service.ts` are 100% connected to live MongoDB models.

### 5. Existing Backend Resources
* **Models:** `RoleModel` (`backend/src/models/role.model.ts`), `PermissionModel` (`backend/src/models/permission.model.ts`), `AccessRequestModel` (`backend/src/models/accessRequest.model.ts`), `AdminModel`, `AdminSessionModel`, `AdminActivityModel`.
* **Controller:** `adminRolesController` (`backend/src/controllers/adminRoles.controller.ts`).
* **Service:** `adminRolesService` (`backend/src/services/adminRoles.service.ts`).

### 6. Database Mapping
* MongoDB Collections: `roles`, `permissions`, `access_requests`, `admins`, `admin_sessions`, `admin_activities`.

### 7. Final Status
* **Coverage:** **100% Production Ready**

---

## PAGE 18: Audit Logs & SOC Security Telemetry (`/admin/audit-logs`)

### 1. Purpose
Immutable SOC 2 compliance audit trail capturing every administrative action taken across the platform (Logins, KYC Approvals, User Suspensions, Role Modifications, Refund Dispatches, Package Deletions), with IP geolocation, user agents, target entity IDs, and before/after state diffs.

### 2. UI Components
* `AdminAuditHeader`: Title, search query, date filter, and CSV export trigger.
* `AuditKPISection`: 5 summary widgets (Total Audits, High Severity Alerts, Unique Admins Active, Failed Auth Attempts, Avg Response Time).
* `AuditFilterBar`: Category filter (Auth, KYC, Users, Roles, Finance, Packages, Bookings), severity filter (Low, Medium, High, Critical), admin selector, IP search.
* `AuditLogsTable` & `AuditLogRow`: Timestamp, admin name & avatar, action badge, target entity link, severity pill, IP address & location, expandable JSON payload diff viewer.
* `AuditDistributionChart`: Event volume grouped by category and severity over time.
* `SecurityAlertsBanner`: Real-time alerts for suspicious multi-login attempts or unauthorized elevation.

### 3. Current Data Source
| Component | Current Source | Status |
| :--- | :--- | :---: |
| 5 Audit KPI Stats | Backend Aggregation (`/api/admin/audit-logs/stats`) | ✅ |
| Paginated Audit Logs Table | Backend Query (`/api/admin/audit-logs`) | ✅ |
| Log Categories & Top Admins | Backend Aggregation (`/api/admin/audit-logs/categories`, `top-admins`) | ✅ |
| Security Alerts Feed | Backend Aggregation (`/api/admin/audit-logs/security-alerts`) | ✅ |
| Login Heatmap Matrix | Backend Aggregation (`/api/admin/audit-logs/heatmap`) | ✅ |

### 4. Hardcoded Data Inventory
* **None.** Data service `adminAuditLogsManagement.service.ts` directly consumes live MongoDB endpoints.

### 5. Existing Backend Resources
* **Model:** `AuditLogModel` (`backend/src/models/auditLog.model.ts`).
* **Controller:** `adminAuditLogsController` (`backend/src/controllers/adminAuditLogs.controller.ts`).
* **Service:** `adminAuditLogsService` (`backend/src/services/adminAuditLogs.service.ts`), `auditLogger` (`backend/src/services/auditLogger.service.ts`).

### 6. Database Mapping
* MongoDB Collection: `audit_logs` (referenced to `admins` and `users`).

### 7. Final Status
* **Coverage:** **100% Production Ready**

---

## PAGE 19: Global Platform Settings & Feature Flags (`/admin/settings`)

### 1. Purpose
System-wide configuration portal. Super Admins configure general platform settings (Platform Name, Support Email, Currency, Commission Rates, Maintenance Mode), feature flags (AI Trip Planner, Live Chat, Instant Refunds), external API integration keys (Razorpay, Cloudinary, SendGrid, Google Maps), automated database backup triggers, and system performance metrics.

### 2. UI Components
* `AdminSettingsHeader`: Title, search, "Save Changes" trigger.
* `SettingsNavigation`: Sidebar tabs (General, Feature Flags, Payments & Fees, Integrations & APIs, Security & Policies, Backups, System Health).
* `SettingsKPIStats`: 4 summary widgets (Active Feature Flags, API Health Score, Connected Services, Last Backup Timestamp).
* `DynamicSettingsWorkspace`: Form panels for platform metadata, fee sliders, API credentials, and toggle switches.
* `SystemStatusSidebar`: Real-time database latency, memory usage, and background queue workers health.
* `SettingsBottomWidgets`: Connected services health cards and backup timeline log.
* `ConfirmActionModal`: Confirmation modal before enabling Maintenance Mode or resetting API keys.

### 3. Current Data Source
| Component | Current Source | Status |
| :--- | :--- | :---: |
| 4 Settings KPI Stats | Mock Data (`settingsData.ts`) | 🔴 |
| General Platform Settings | Mock Object (`initialGeneralSettings`) | 🔴 |
| Feature Flags List | Mock Array (`initialFeatureFlags`) | 🔴 |
| Connected API Integrations | Mock Array (`initialConnectedServices`) | 🔴 |
| System Health Metrics | Partially Live (`/api/admin/dashboard/system-health`) | 🟡 |
| Update Settings Action | Local In-Memory Object Mutation | 🔴 |

### 4. Hardcoded Data Inventory
* **File:** `frontend/src/admin-panel/data/settingsData.ts`
  * 280+ lines of static feature flags (`feat-1` to `feat-8`), mock API integration keys, and fake backup logs.
* **File:** `frontend/src/admin-panel/services/adminSettingsManagement.service.ts`
  * In-memory mock store.
  * `Action`: Delete `settingsData.ts` mock data and replace service with real backend API calls.

### 5. Existing Backend Resources
* **Models:** `AdminModel.preferences` exists for per-admin settings.
* **Missing Schema:** `SystemSettingsModel` (`backend/src/models/systemSettings.model.ts`).

### 6. Missing Backend Features
* **New Model:** `SystemSettingsModel` schema (`general`, `fees`, `featureFlags`, `integrationsStatus`, `securityPolicies`, `lastBackup`).
* `GET /api/admin/settings`: Fetch current system configuration.
* `PATCH /api/admin/settings/general`: Update general platform metadata and commission rates.
* `PATCH /api/admin/settings/feature-flags/:id`: Toggle specific feature flag.
* `GET /api/admin/settings/integrations`: Check live status of Cloudinary, Razorpay, and SendGrid connections.
* `POST /api/admin/settings/backup`: Trigger manual database backup snapshot.

### 7. Database Mapping
* MongoDB Collection: `system_settings`.

### 8. Migration Strategy
* **Backend:** Create `SystemSettingsModel`, implement `adminSettings.controller.ts`, `adminSettings.service.ts`, and routes in `backend/src/routes/admin.routes.ts`.
* **Frontend:** Refactor `adminSettingsManagement.service.ts` to call live backend endpoints.

### 9. Risk Analysis
* **Risk:** Unauthorized modification of platform commission rates or security policies.
* **Mitigation:** Restrict all `/admin/settings/*` mutation routes strictly to `requireSuperAdmin` middleware and log all changes in `audit_logs`.

### 10. Final Status
* **Coverage:** **25% (Requires Backend Migration for System Settings & Feature Flags)**

---

## PAGE 20: Admin Profile & Active Sessions (`/admin/profile`)

### 1. Purpose
Personal administrator profile management. Allows logged-in admins to view their account metadata, update their display name/phone/avatar, change account passwords, configure personal notification preferences and theme modes, view active browser sessions, and remotely terminate sessions on other devices.

### 2. UI Components
* `AdminProfileHeader`: Avatar, name, role badge, account creation date.
* `ProfileInfoForm`: Display name, email (read-only), phone number, department, bio.
* `ChangePasswordForm`: Current password, new password, confirmation, and strength meter.
* `AdminPreferencesSection`: Theme mode (Dark/Light), email notification toggles, sound alerts.
* `ActiveSessionsList`: Table of active login sessions with device icons, IP addresses, location, and "Terminate Session" buttons.

### 3. Current Data Source
| Component | Current Source | Status |
| :--- | :--- | :---: |
| Profile Information & Avatar | Backend API (`/api/admin/profile`) | ✅ |
| Update Profile Details | Backend Action (`PATCH /api/admin/profile`) | ✅ |
| Change Password | Backend Action (`PUT /api/admin/profile/change-password`) | ✅ |
| Update Admin Preferences | Backend Action (`PATCH /api/admin/profile/preferences`) | ✅ |
| Active Login Sessions List | Backend Query (`GET /api/admin/roles/sessions` & `profile`) | ✅ |
| Terminate Single Session | Backend Action (`DELETE /api/admin/profile/sessions/:id`) | ✅ |

### 4. Hardcoded Data Inventory
* **None.** Service `adminProfileManagement.service.ts` connects directly to live backend endpoints.

### 5. Existing Backend Resources
* **Models:** `AdminModel` (`backend/src/models/admin.model.ts`), `AdminSessionModel` (`backend/src/models/adminSession.model.ts`).
* **Controller:** `adminProfileController` (`backend/src/controllers/adminProfile.controller.ts`).
* **Service:** `adminProfileService` (`backend/src/services/adminProfile.service.ts`).

### 6. Database Mapping
* MongoDB Collections: `admins`, `admin_sessions`.

### 7. Final Status
* **Coverage:** **100% Production Ready**

---

## CROSS-CUTTING GLOBAL ADMIN SERVICES & SHELL COMPONENTS

### 1. Global Command Palette Search (`components/super-admin/search`)
* **Purpose:** Instant global search across all entities (Users, Agencies, Bookings, Packages, Payments, Tickets).
* **Current Data Source:** 🔴 Hardcoded `indexedGlobalSearchResults` in `frontend/src/admin-panel/data/globalSearchData.ts`.
* **Missing Backend API:** `GET /api/admin/global-search?q=:query` (performs fast regex/text index searches across `users`, `agencies`, `packages`, `bookings`).
* **Target Migration:** Implement global search endpoint; purge `globalSearchData.ts`.

### 2. Header Notifications Center (`components/super-admin/notifications/AdminNotificationDropdown.tsx`)
* **Purpose:** Real-time bell notification dropdown in the top navigation bar.
* **Current Data Source:** 🔴 Hardcoded `initialHeaderNotifications` in `frontend/src/admin-panel/data/headerNotificationsData.ts` stored in LocalStorage (`apnatrip_admin_header_notifications`).
* **Missing Backend API:** `GET /api/admin/notifications/header`, `PATCH /api/admin/notifications/header/mark-read`.
* **Target Migration:** Connect to `audit_logs` and `notifications` collections; purge `headerNotificationsData.ts`.

### 3. Live Activity Center Stream (`services/liveActivityCenter.service.ts`)
* **Purpose:** Real-time sliding drawer stream of platform events.
* **Current Data Source:** 🔴 Fallback mock events in `liveActivityCenterData.ts`.
* **Missing Backend Feature:** Connect live activity feed directly to WebSocket `socketService` and `audit_logs`.

---

# SECTION 2: HARDCODED DATA INVENTORY & ASSETS TO REMOVE

The following 18 mock data files and static assets contain dummy datasets and must be completely removed or refactored to zero mock items during Phase 2:

| File Path | Mock Variables / Constants | Content Summary | Action in Phase 2 |
| :--- | :--- | :--- | :--- |
| `frontend/src/admin-panel/services/adminPackageManagement.service.ts` | `initialPackageKPIStats`, `initialAdminPackages`, `STORAGE_KEY_PACKAGES` | 10 fake packages, itineraries, fake bookings | **Delete mock data, replace with live API client** |
| `frontend/src/admin-panel/services/adminBookingManagement.service.ts` | `initialBookingKPIStats`, `initialAdminBookings`, `STORAGE_KEY_BOOKINGS` | 12 fake bookings, fake passenger manifests | **Delete mock data, replace with live API client** |
| `frontend/src/admin-panel/services/adminPaymentManagement.service.ts` | `initialPaymentKPIStats`, `initialAdminPayments`, `STORAGE_KEY_PAYMENTS` | 15 fake transactions, fake gateway IDs | **Delete mock data, replace with live API client** |
| `frontend/src/admin-panel/services/adminFinanceManagement.service.ts` | `initialFinanceKPIStats`, `initialRevenueTrend`, `initialSettlementsList` | 350+ lines of fake financial metrics | **Delete mock data, replace with live API client** |
| `frontend/src/admin-panel/services/adminTripManagement.service.ts` | `initialTripKPIStats`, `initialAdminTrips` | 12 fake operational trips, fake GPS coords | **Delete mock data, replace with live API client** |
| `frontend/src/admin-panel/data/reviewsData.ts` | `initialReviewsData`, `initialRatingDistribution`, `initialReviewKPIStats` | 450+ lines of fake reviews and sentiment | **Delete file completely** |
| `frontend/src/admin-panel/data/communityData.ts` | `initialCommunityKPIStats`, `initialRecentFeedData`, `initialModerationQueueData` | 400+ lines of fake community posts | **Delete file completely** |
| `frontend/src/admin-panel/data/supportData.ts` | `initialSupportKPIStats`, `initialSupportTickets`, `initialSupportAnalytics` | 380+ lines of fake helpdesk tickets | **Delete file completely** |
| `frontend/src/admin-panel/data/notificationsData.ts` | `initialNotificationKPIStats`, `initialCampaignsData` | 320+ lines of fake campaigns | **Delete file completely** |
| `frontend/src/admin-panel/data/reportsData.ts` | `initialReportKPIStats`, `initialReportLibraryData`, `initialBookingHeatmapMatrix` | 390+ lines of fake BI charts | **Delete file completely** |
| `frontend/src/admin-panel/data/cmsData.ts` | `initialHeroBanners`, `initialAnnouncements`, `initialSEOData` | 450+ lines of fake CMS banners | **Delete file completely** |
| `frontend/src/admin-panel/data/settingsData.ts` | `initialSettingsKPIStats`, `initialGeneralSettings`, `initialFeatureFlags` | 280+ lines of fake feature flags | **Delete file completely** |
| `frontend/src/admin-panel/data/globalSearchData.ts` | `indexedGlobalSearchResults`, `initialQuickCommands` | 250+ lines of static search items | **Delete file completely** |
| `frontend/src/admin-panel/data/headerNotificationsData.ts` | `initialHeaderNotifications` | 150+ lines of fake notifications | **Delete file completely** |
| `frontend/src/admin-panel/data/advancedNotificationCenterData.ts` | `initialAdvancedNotifications` | 300+ lines of fake notification logs | **Delete file completely** |
| `frontend/src/admin-panel/data/mockAdminData.ts` | `mockAdminStats` | Legacy fallback object | **Delete file completely** |
| `frontend/src/admin-panel/data/agencyApplications.ts` | `initialAgencyApplications` | Legacy fallback applications | **Delete file completely** |
| `frontend/src/admin-panel/services/adminSharedStore.ts` | `initialAgencyRequestsList`, `initialAgencyRequestStats` | Legacy fallback LocalStorage handlers | **Refactor to pure types / wipe storage** |

---

# SECTION 3: DATABASE ARCHITECTURE & COLLECTION MAPPINGS

### Existing MongoDB Collections (MUST BE REUSED — ZERO DUPLICATION)

1. `admins`: Super admin & admin credentials, roles, email, active sessions, preferences.
2. `admin_sessions`: Active JWT login sessions with IP addresses and user agents.
3. `roles`: RBAC roles (Super Admin, Compliance Officer, Finance Manager, Support Lead, Content Editor).
4. `permissions`: 168 granular permission capabilities matrix.
5. `access_requests`: Elevation requests submitted by admins.
6. `audit_logs`: SOC 2 audit trail records.
7. `agencies`: B2B travel agency business profiles, KYC documents, bank details, verification status, contact details.
8. `users`: B2C traveler accounts, contact info, KYC verification, membership status, preferences.
9. `packages`: Tour packages, itineraries, inclusions, exclusions, pricing, seats, approval status, featured flag.
10. `bookings`: Master traveler bookings, traveler manifests, total amounts, dates, booking/payment status.
11. `payments`: Payment gateway transaction records, amounts, platform commissions, GST, gateway response payloads.
12. `support_tickets`: Customer support tickets, priorities, categories, agent assignments, and message logs.
13. `savedtravelers`: Traveler co-passenger records.
14. `conversations` & `messages`: Live chat threads and attachments.

### Missing Collections to Create in Phase 2

1. `reviews` (`backend/src/models/review.model.ts`):
   * Schema: `userId` (ref: `User`), `packageId` (ref: `Package`), `agencyId` (ref: `Agency`), `bookingId` (ref: `Booking`), `rating` (Number), `title` (String), `comment` (String), `photos` (Array), `sentiment` (String), `status` (Enum: `Approved`, `Pending`, `Flagged`, `Hidden`), `agencyReply` (Object), `helpfulVotes` (Number), `flagReason` (String), timestamps.
2. `community_posts` (`backend/src/models/communityPost.model.ts`):
   * Schema: `authorId` (ref: `User`), `type` (Enum: `Story`, `Photo`, `Tip`, `Question`, `Announcement`), `title` (String), `content` (String), `media` (Array), `likesCount` (Number), `commentsCount` (Number), `status` (Enum: `Approved`, `Pending`, `TakenDown`), `isPinned` (Boolean), `isAnnouncement` (Boolean), timestamps.
3. `campaigns` (`backend/src/models/campaign.model.ts`):
   * Schema: `title` (String), `message` (String), `channel` (Enum: `Push`, `Email`, `InApp`), `audience` (String), `targetCount` (Number), `deliveredCount` (Number), `openedCount` (Number), `clickedCount` (Number), `status` (Enum: `Draft`, `Scheduled`, `Sent`, `Cancelled`), `scheduledFor` (Date), `sentAt` (Date), `rules` (Object), timestamps.
4. `cms_contents` (`backend/src/models/cmsContent.model.ts`):
   * Schema: `type` (Enum: `Banner`, `Announcement`, `Destination`, `Popup`, `SectionOrder`, `SEO`), `title` (String), `subtitle` (String), `imageUrl` (String), `targetUrl` (String), `badgeText` (String), `priority` (Number), `isActive` (Boolean), `startDate` (Date), `endDate` (Date), `metadata` (Object), timestamps.
5. `system_settings` (`backend/src/models/systemSettings.model.ts`):
   * Schema: `general` (Object), `fees` (Object), `featureFlags` (Array), `integrationsStatus` (Object), `securityPolicies` (Object), `lastBackup` (Date), timestamps.

### Duplicate Collections that MUST NOT be Created
* ❌ `admin_packages` (Use `packages` with `approvalStatus`)
* ❌ `admin_bookings` (Use `bookings`)
* ❌ `admin_payments` (Use `payments`)
* ❌ `admin_trips` (Dynamically query `bookings` matching confirmed status)
* ❌ `admin_finance` (Dynamically aggregate over `payments` and `bookings`)
* ❌ `admin_notifications` (Reuse `audit_logs` and `campaigns`)

---

# SECTION 4: MASTER REST API ENDPOINT SPECIFICATION

The following endpoints will be implemented in the backend during Phase 2 to supply 100% real MongoDB data to all admin modules:

### 1. Packages Management (`/api/admin/packages`)
* `GET /api/admin/packages/stats` — Live KPI counters (Total, Active, Pending, Draft, Sold Out, Featured)
* `GET /api/admin/packages` — Paginated package directory with search, category, status, approvalStatus, and sort
* `GET /api/admin/packages/:id` — Full package details with agency info and booking counts
* `POST /api/admin/packages` — Admin package creation
* `PATCH /api/admin/packages/:id` — Update package details
* `PATCH /api/admin/packages/:id/approval` — Approve or reject package
* `PATCH /api/admin/packages/:id/feature` — Toggle featured status
* `DELETE /api/admin/packages/:id` — Delete or archive package
* `POST /api/admin/packages/bulk-action` — Bulk approve, reject, archive, or feature
* `GET /api/admin/packages/export` — Stream CSV export of packages

### 2. Bookings Management (`/api/admin/bookings`)
* `GET /api/admin/bookings/stats` — Live booking KPIs (Total, Confirmed, Pending, Cancelled, GMV, Refunds)
* `GET /api/admin/bookings` — Paginated bookings with search, status, agency, and date filters
* `GET /api/admin/bookings/:id` — Populated booking document with traveler manifest and payments
* `PATCH /api/admin/bookings/:id` — Update booking details or status
* `POST /api/admin/bookings/:id/cancel` — Cancel booking and initiate refund flow
* `GET /api/admin/bookings/:id/invoice` — Generate structured invoice data
* `POST /api/admin/bookings/bulk-action` — Bulk confirmation, cancellation, and export
* `GET /api/admin/bookings/export` — Stream passenger manifests CSV

### 3. Payments Ledger (`/api/admin/payments`)
* `GET /api/admin/payments/stats` — Transaction KPIs, GMV, platform revenue, pending settlements
* `GET /api/admin/payments` — Paginated transaction ledger with search, gateway, method, and status filters
* `GET /api/admin/payments/:id` — Transaction detail with gateway metadata
* `POST /api/admin/payments/:id/refund` — Issue partial or full refund
* `POST /api/admin/payments/reconcile` — Gateway synchronization trigger
* `GET /api/admin/payments/export` — Export payments ledger CSV

### 4. Finance & Settlements (`/api/admin/finance`)
* `GET /api/admin/finance/stats` — Executive financial telemetry (GMV, Revenue, Profit, Pending Payouts)
* `GET /api/admin/finance/charts` — Revenue trend points, commission breakdown, destination revenue
* `GET /api/admin/finance/top-agencies` — Top performing agencies by GMV and payout health
* `GET /api/admin/finance/settlements` — Paginated agency settlement records
* `POST /api/admin/finance/settlements/:id/process` — Release and process agency payout
* `GET /api/admin/finance/summary` — Financial summary and refund analytics

### 5. Live Operational Trips (`/api/admin/trips`)
* `GET /api/admin/trips/stats` — Live operational counts (Active, Upcoming, Completed, Cancelled)
* `GET /api/admin/trips` — Paginated operational trips grouped by package departures
* `GET /api/admin/trips/:id` — Trip details with passenger emergency manifest
* `PATCH /api/admin/trips/:id/status` — Update trip status (e.g. Delayed, Weather Alert)
* `POST /api/admin/trips/:id/broadcast` — Send broadcast alert to trip travelers

### 6. Reviews & Moderation (`/api/admin/reviews`)
* `GET /api/admin/reviews/stats` — Review counts, average rating, pending, and flagged count
* `GET /api/admin/reviews` — Paginated reviews with star rating, sentiment, and moderation status filters
* `GET /api/admin/reviews/:id` — Detailed review with photo attachments and booking link
* `PATCH /api/admin/reviews/:id/status` — Approve, flag, hide, or restore review
* `DELETE /api/admin/reviews/:id` — Delete spam review
* `GET /api/admin/reviews/analytics` — Rating distribution and sentiment analysis

### 7. Community Hub (`/api/admin/community`)
* `GET /api/admin/community/stats` — Community engagement KPIs and moderation queue count
* `GET /api/admin/community/posts` — Paginated community feed posts
* `GET /api/admin/community/moderation-queue` — Filtered list of flagged posts
* `PATCH /api/admin/community/posts/:id/moderate` — Moderate, approve, or take down post
* `POST /api/admin/community/announcements` — Publish official platform announcement
* `POST /api/admin/community/users/:id/warn` — Issue official user warning
* `GET /api/admin/community/analytics` — Community engagement and trending topics

### 8. Support Desk (`/api/admin/support`)
* `GET /api/admin/support/stats` — Support ticket KPIs and SLA breach alerts
* `GET /api/admin/support/tickets` — Paginated ticket queue with search and status filters
* `GET /api/admin/support/tickets/:id` — Full ticket conversation thread and linked traveler
* `POST /api/admin/support/tickets/:id/reply` — Send admin agent reply with WebSocket emission
* `PATCH /api/admin/support/tickets/:id/status` — Update ticket status (Open, In Progress, Resolved, Closed)
* `PATCH /api/admin/support/tickets/:id/assign` — Assign ticket to admin agent
* `GET /api/admin/support/analytics` — Support SLA and category aggregations

### 9. Notifications Engine (`/api/admin/notifications`)
* `GET /api/admin/notifications/stats` — Broadcast metrics and delivery rates
* `GET /api/admin/notifications/campaigns` — Paginated marketing campaigns
* `POST /api/admin/notifications/campaigns` — Create, schedule, or send broadcast campaign
* `PATCH /api/admin/notifications/campaigns/:id` — Edit scheduled campaign
* `DELETE /api/admin/notifications/campaigns/:id` — Cancel campaign
* `GET /api/admin/notifications/analytics` — Engagement timeline and failure rates
* `GET /api/admin/notifications/header` — Live bell notifications for header dropdown
* `PATCH /api/admin/notifications/header/mark-read` — Mark header notifications as read

### 10. Business Reports (`/api/admin/reports`)
* `GET /api/admin/reports/stats` — Reports library counters and data freshness
* `GET /api/admin/reports/templates` — List of available reporting schemas
* `GET /api/admin/reports/analytics/revenue-trend` — Live revenue trend aggregation
* `GET /api/admin/reports/analytics/booking-heatmap` — 24x7 booking density matrix aggregation
* `GET /api/admin/reports/analytics/geographic` — Geographic revenue aggregation
* `GET /api/admin/reports/analytics/agency-matrix` — Agency bubble matrix aggregation
* `POST /api/admin/reports/generate` — Generate dynamic CSV/JSON report file

### 11. Content Management System (`/api/admin/cms`)
* `GET /api/admin/cms/all` — All CMS sections categorized
* `GET /api/admin/cms/:type` — Fetch specific CMS section (banners, announcements, popups, seo)
* `POST /api/admin/cms/:type` — Create new banner/announcement/popup
* `PUT /api/admin/cms/:type/:id` — Update CMS item
* `DELETE /api/admin/cms/:type/:id` — Delete CMS item
* `PATCH /api/admin/cms/:type/reorder` — Persist section order
* `GET /api/public/cms/homepage` — Storefront public CMS endpoint

### 12. Platform Settings & Feature Flags (`/api/admin/settings`)
* `GET /api/admin/settings` — Current platform settings and active feature flags
* `PATCH /api/admin/settings/general` — Update general platform info and commission rates
* `PATCH /api/admin/settings/feature-flags/:id` — Toggle feature flag
* `GET /api/admin/settings/integrations` — Live status of Cloudinary, Razorpay, SendGrid
* `POST /api/admin/settings/backup` — Trigger manual database backup

### 13. Global Search (`/api/admin/global-search`)
* `GET /api/admin/global-search?q=:query` — Multi-entity instant search

---

# SECTION 5: PHASE 2 PRIORITIZED MIGRATION ROADMAP

```mermaid
flowchart TD
    subgraph Batch 1 [Batch 1: Core Commerce Engine]
        B1_1[Packages Management] --> B1_2[Bookings Master & Manifests]
    end

    subgraph Batch 2 [Batch 2: Financial Ledger & Operations]
        B2_1[Payments & Reconciliations] --> B2_2[Finance & Settlements]
        B2_2 --> B2_3[Live Operational Trips]
    end

    subgraph Batch 3 [Batch 3: User Engagement & Support]
        B3_1[Customer Reviews & Moderation] --> B3_2[Community Hub & UGC]
        B3_2 --> B3_3[Support Desk & Ticketing]
    end

    subgraph Batch 4 [Batch 4: Enterprise Intelligence & CMS]
        B4_1[Notifications & Campaigns] --> B4_2[Business Reports & BI]
        B4_2 --> B4_3[CMS & Storefront Content]
        B4_3 --> B4_4[Platform Settings & Feature Flags]
        B4_4 --> B4_5[Global Command Search & Header Alerts]
    end

    Batch 1 --> Batch 2 --> Batch 3 --> Batch 4
```

### Execution Strategy by Batch:

#### **Batch 1: Core Commerce Engine (Packages & Bookings)**
* **Target Pages:** `/admin/packages`, `/admin/bookings`
* **Backend:** Implement `adminPackage` and `adminBooking` controllers, services, routes, and validations.
* **Frontend:** Refactor `adminPackageManagement.service.ts` and `adminBookingManagement.service.ts` to consume live MongoDB endpoints; purge all hardcoded packages and bookings.
* **Verification:** Run test scripts validating live package CRUD, seat updates, booking confirmations, and passenger manifests.

#### **Batch 2: Financial Ledger & Operations (Payments, Finance, Trips)**
* **Target Pages:** `/admin/payments`, `/admin/finance`, `/admin/trips`
* **Backend:** Implement `adminPayment`, `adminFinance`, and `adminTrip` controllers, services, aggregation pipelines, and routes.
* **Frontend:** Refactor `adminPaymentManagement.service.ts`, `adminFinanceManagement.service.ts`, and `adminTripManagement.service.ts`; purge static financial and trip mock data.
* **Verification:** Verify gateway payment logs, refund triggers, agency settlement calculations, and live operational trip derivations.

#### **Batch 3: User Engagement & Support (Reviews, Community, Support)**
* **Target Pages:** `/admin/reviews`, `/admin/community`, `/admin/support`
* **Backend:** Create `ReviewModel` and `CommunityPostModel`; implement controllers, services, WebSocket reply dispatchers, and routes.
* **Frontend:** Refactor `adminReviewManagement.service.ts`, `adminCommunityManagement.service.ts`, and `adminSupportManagement.service.ts`; delete `reviewsData.ts`, `communityData.ts`, `supportData.ts`.
* **Verification:** Verify review moderation, community post takedowns, and live helpdesk conversation message replies.

#### **Batch 4: Enterprise Intelligence, CMS & Platform Governance (Notifications, Reports, CMS, Settings, Search)**
* **Target Pages:** `/admin/notifications`, `/admin/reports`, `/admin/cms`, `/admin/settings`, Global Search & Header.
* **Backend:** Create `CampaignModel`, `CMSContentModel`, and `SystemSettingsModel`; implement controllers, services, BI aggregations, and global search routes.
* **Frontend:** Refactor remaining services; delete `notificationsData.ts`, `reportsData.ts`, `cmsData.ts`, `settingsData.ts`, `globalSearchData.ts`, `headerNotificationsData.ts`.
* **Verification:** Verify broadcast campaign creation, BI charts, live storefront CMS sync, feature flag toggles, and global search.

---

# SECTION 6: RISK ANALYSIS & COMPLIANCE

| Risk Category | Risk Description | Severity | Architectural Mitigation |
| :--- | :--- | :---: | :--- |
| **Data Integrity** | Booking status desync with payment gateway records | High | Use Mongoose atomic transactions for booking cancellations and payment refund records. |
| **Security & RBAC** | Unauthorized access to financial payout triggers or role elevations | Critical | Protect all administrative routes with `authenticateAdmin` and `requireSuperAdmin` middlewares; log all actions in immutable `audit_logs`. |
| **Performance** | Complex BI aggregations and booking heatmaps causing slow database response | Medium | Add compound indexes on `bookings(agencyId, status, createdAt)`, `payments(status, createdAt)`, and `packages(status, approvalStatus)`. |
| **UI Regressions** | Data structure mismatch altering component layout or styles | High | Preserve all existing TypeScript interfaces (`AdminPackageItem`, `AdminBookingItem`, `AdminPaymentItem`, etc.) so frontend components receive identical data shapes. |
| **Cache & Stale Data** | Browser LocalStorage caching outdated mock objects | Medium | Explicitly wipe legacy LocalStorage keys on initial admin application boot. |

---

# SECTION 7: FINAL RECOMMENDATIONS & NEXT STEPS

1. **Strict UI Preservation:** Under no circumstances should any UI layout, Tailwind/CSS class, color palette, icon, animation, or component hierarchy be altered during the migration. Only the underlying data provider changes.
2. **Zero Hardcoded Data Rule:** At the conclusion of Phase 2, no file in `frontend/src/admin-panel` should contain mock constants, fake users, static charts, or LocalStorage state stores.
3. **Continuous Build Verification:** Both `frontend` and `backend` must compile with `0 errors` (`npx tsc --noEmit`) throughout each batch of migration.
4. **Documentation Sync:** Upon migration completion, `MEMORY.md` and `ARCHITECTURE.md` must be updated with all new endpoints and schemas.

---

**AUDIT CONCLUSION:** The master audit is 100% complete and documented. The codebase is fully prepared for Phase 2 backend migration. Awaiting user review and authorization to proceed with **Batch 1 (Packages & Bookings Migration)**.
