# Travel OS — Permanent Development Protocol & Global Rules

**Version**: 2.0 (Production SaaS Standard)  
**Applies To**: Every page, component, controller, service, repository, and screen in Travel OS.

---

## 1. Core Engineering Principles

1. **Travel OS is NOT an MVP**: Everything must behave like a production SaaS platform.
2. **Zero Mock / Dummy Data**:
   - Never use fake arrays, placeholder objects, random statistics, or mock state fallbacks.
   - All data MUST originate from MongoDB Atlas via verified API endpoints.
   - State progression pattern: `Loading` ➔ `Empty State` ➔ `Error Boundary`.
3. **Server-Side Identity Only**:
   - Never trust frontend-supplied user IDs or ownership payloads.
   - Customer: `req.user.userId`
   - Agency: `req.agency.agencyId`
   - Admin: `req.admin.adminId`
4. **MongoDB is the Single Source of Truth**:
   - Relate documents using valid `mongoose.Types.ObjectId`.
   - Maintain referential integrity across collections.
5. **Structured Cloudinary Media Storage**:
   - Every asset upload must store: `url`, `publicId`, `folder`, `uploadedAt`, `mediaType`, `ownerId`, `verificationStatus`.
   - Never store temporary or transient image URLs.
6. **Cross-Panel Synchronization**:
   - Every action (e.g. Booking, Cancellation, KYC Submission, Announcement) must immediately reflect across Customer, Agency, and Super Admin dashboards, notifications, and analytics pipelines.

---

## 2. Mandatory 3-Step Task Workflow

For every task, complete these steps before writing code:

### STEP 1 — Analyze
- Review the complete feature across all layers.
- Read related frontend pages, backend controllers, services, repositories, Mongoose models, routes, middlewares, utilities, validation schemas, and database collections.
- Trace the complete end-to-end data flow. Never guess or assume.

### STEP 2 — Dependency Scan
- Identify all affected touchpoints:
  - Frontend pages & modals
  - Backend REST endpoints
  - MongoDB collections & indexes
  - Cloudinary asset pipelines
  - Authentication & RBAC permissions
  - Notifications & webhooks
  - Dashboards & analytics calculations
  - Financial ledger & activity audit logs
- If a change touches 10 places, update all 10. Never partially implement features.

### STEP 3 — Plan & Verify
- Construct an explicit checklist (Schema ➔ Repo ➔ Service ➔ Controller ➔ Route ➔ Validation ➔ Client ➔ UI ➔ Sync ➔ Tests).
- Ensure TypeScript compiles with **0 errors** (`npx tsc --noEmit`).

---

## 3. UI/UX & Design Language Standards

1. **Design Philosophy**:
   - Aesthetic Benchmark: **Airbnb + Apple + Notion + Linear + Booking.com**.
   - Language: Premium, modern, minimal, soft, spacious, and ultra-clean.
   - Never build generic bootstrap admin tables or unstyled wireframes.
2. **Mobile First & Responsive Desktop**:
   - Mobile: Base width `390px` (thumb-friendly, bottom navigation, floating white cards).
   - Desktop: Full responsive experience (`max-width: 1440px`, centered content `1280px`, top navigation bar, multi-column grid layouts).
   - Never emulate a centered phone frame on desktop.
3. **Visual Tokens & Design Constants**:
   - **Corner Radii**: Cards `24px`, Buttons `18px`, Images `22px`, Inputs `18px`, Chips `999px`.
   - **Colors**:
     - Primary Brand: `#FF4D6D`
     - Background: `#F8F9FC`
     - Card Background: `#FFFFFF`
     - Text Primary: `#111827`
     - Text Secondary: `#6B7280`
     - Status Colors: Success (`#22C55E`), Warning (`#F59E0B`), Error (`#EF4444`).
   - **Shadows**: Extremely soft, ambient shadows only. No harsh dark borders.
   - **Icons**: Lucide Icons exclusively with consistent sizing.
4. **Preservation Rule**:
   - Do NOT redesign pages unless explicitly requested.
   - Preserve existing spacing, typography scale, colors, responsive layouts, and micro-animations.

---

## 4. Coding & Architecture Rules

1. **No Duplicate Architecture**:
   - Never create duplicate services, models, repositories, or API routes.
   - Reuse existing abstractions and services.
2. **Strict Error Handling & HTTP Codes**:
   - Every API returns structured JSON via `ResponseUtil`:
     - `200` OK / `201` Created
     - `400` Bad Request / `401` Unauthorized / `403` Forbidden
     - `404` Not Found / `409` Conflict / `422` Unprocessable Entity
     - `500` Internal Server Error / `503` Service Unavailable
   - Never swallow exceptions or fail silently.
3. **Security Standards**:
   - Prevent IDOR, JWT spoofing, mass assignment, race conditions, and duplicate transactions.
   - Validate inputs on both frontend and backend using Zod schemas. Backend is always the final authority.
4. **Code Quality**:
   - Remove unused imports, dead code, temporary debug statements, and console logs before finishing.
   - Code must pass `npx tsc --noEmit` with **0 errors**.

---

## 5. Permanent Project Documentation

Maintain these three files permanently in the workspace:

1. **`MEMORY.md`**:
   - Update after every completed task.
   - Append-only log containing date, feature name, files changed, database collections, API endpoints, test verifications, and pending improvements.
2. **`ARCHITECTURE.md`**:
   - Maintain the complete architectural map of Customer, Agency, Admin panels, backend services, database schemas, and data pipelines.
3. **`RULES.md`**:
   - Permanent development rules and engineering standards.

---

## 6. Definition of Done Checklist

A task is considered complete ONLY when:
- [x] Feature is fully analyzed across frontend, backend, and database layers.
- [x] All affected pages, endpoints, and dependent dashboards are updated.
- [x] Zero mock or fallback data remains in the implemented flow.
- [x] Server-side identity and authorization are strictly enforced.
- [x] State updates are synchronized across applicable panels and notification channels.
- [x] `MEMORY.md`, `ARCHITECTURE.md`, and `RULES.md` are updated.
- [x] `npx tsc --noEmit` passes with **0 TypeScript errors**.
- [x] End-to-end tests verify both happy paths and error boundaries.

---

## 7. Panel-Scoped Theme Architecture & Isolation Rules (Strict Zero Cross-Panel Leakage)

1. **Strict Theme Isolation Principle**:
   - Each major panel has its own dedicated, isolated theme provider:
     - **Super Admin Panel (`/admin/*`, `/super-admin/*`)**: `SuperAdminThemeProvider` (`super-admin-theme` storage key).
     - **Agency Panel & Onboarding (`/agency/*`)**: `AgencyThemeProvider` (`agency-theme` storage key, default `Light`).
     - **Customer Website & User Portal (`/*`)**: `WebsiteThemeProvider` (`website-theme` storage key).
   - **NEVER** use a single global theme provider or mutate the global `<html>` or `<body>` elements with `.dark` classes.
2. **Dedicated Storage Keys**:
   - Super Admin: `super-admin-theme`
   - Agency: `agency-theme`
   - Website: `website-theme`
   - Never share or overwrite a single `theme` or `apnatrip_theme` key across panels.
3. **DOM Scoping & Root Wrappers**:
   - Super Admin is scoped inside `<div id="super-admin-root" data-panel="super-admin" className="super-admin-root dark">`.
   - Agency is scoped inside `<div id="agency-root" data-panel="agency" className="agency-root">`.
   - Customer Website is scoped inside `<div id="website-root" data-panel="website" className="website-root">`.
   - CSS rules for dark mode MUST be prefixed with `.super-admin-root.dark` or `[data-panel="super-admin"][data-theme="dark"]`. No styles can leak across boundary roots.
4. **Preserve Approved UI Layouts & Spacing**:
   - Theme switching MUST ONLY change colors, borders, text, and surfaces.
   - Never change layout grids, padding, margins, font sizes, icons, borders radius, or component hierarchy during theme updates.
5. **Real-Time OS Synchronization**:
   - In `System` mode, panels independently listen to OS `prefers-color-scheme` updates in real-time without page reload or flicker.
   - Theme changes by authenticated admins persist to backend profile preferences and generate immutable audit logs (`Module: Settings`, `Action: Theme Changed`).

---

## 8. Production Agency Registration & Onboarding Rules (Single Source of Truth)

1. **Single Unified Collection**:
   - Every registration draft, partial step payload, KYC document reference, and submitted application MUST reside exclusively in the `agencies` collection (`AgencyModel`).
   - Never create separate temporary application tables, staging stores, or duplicate document models.
2. **Pre-Approval Isolation Gate**:
   - Submitted registrations remain in `verificationStatus: 'PENDING'` and `status: 'PENDING'`.
   - The active agency account and associated agency user credentials MUST NEVER be activated until explicit approval by the Super Admin via `/api/admin/agency-requests/:id/approve`.
3. **Draft Resumption & Auto-Save**:
   - Multi-step progress (Business Info, Profile Branding, KYC Documents, Bank Settlement) auto-saves to `POST /api/agencies/onboarding/draft` and can be resumed anytime via Application ID or Email.
4. **Zero Client-Side Identity / Mock Bypass**:
   - Application IDs (`ATP-AGY-YYYY-XXXXXX`), timestamps, and compliance scores MUST be generated and calculated server-side.
   - Duplicate checks for business email, GST number, and PAN number are strictly enforced before final submission.
5. **Audit Logging & Transactional Emails**:
   - Every submission, document re-upload, status transition, document request, and approval action MUST create a structured record in `audit_logs` and dispatch relevant transactional emails via `MailService`.

---

## 9. Document-Specific Re-upload & Verification Rules

1. **No Hardcoded Document Lists**:
   - The Super Admin modal MUST dynamically load uploaded documents from `agency.documents` in MongoDB.
2. **Granular Rejection Reasons & Internal Notes**:
   - Every requested document must include a mandatory reason (`Blurry Document`, `Incorrect Information`, `Expired Document`, `Missing Pages`, `Invalid Document`, `Mismatch Found`, `Verification Failed`, `Other` + custom reason) and optional admin-only internal notes.
3. **Strict Whitelist Upload Security in Agency Portal**:
   - The agency can only re-upload files for documents explicitly requested by the Super Admin. Any attempt to upload unrequested documents MUST be rejected by the backend.
   - All previously approved documents MUST remain locked and clearly marked as `Verified & Locked`.
4. **Lifecycle & Status Transitions**:
   - Super Admin request: `agency.verificationStatus` -> `MISSING_DOCS`, target docs -> `Re-upload Requested`.
   - Agency re-upload: target docs -> `Re-upload Submitted`, `agency.verificationStatus` -> `PENDING` (returned to review).
   - Immutable audit logs (`AGENCY_DOCUMENTS_REQUESTED`, `AGENCY_DOCUMENTS_REUPLOADED`) and email notifications must trigger automatically at every stage.

---

## 10. Super Admin Approved Agencies Directory Rules

1. **Direct Read from Source of Truth (`agencies` Collection)**:
   - Approved agencies directory `/admin/agencies` must query directly from `agencies` MongoDB collection (`AgencyModel`).
   - Approved agencies are automatically visible upon approval (`verificationStatus: 'APPROVED' | 'VERIFIED'`). No data duplication or synchronization tables are permitted.
2. **Dynamic Aggregate Calculations**:
   - Top summary KPI cards (`Total Agencies`, `Active Agencies`, `Pending Approval`, `Suspended`, `Rejected`, `Verified`) must calculate live from MongoDB collections using indexed queries and aggregation pipelines. Static or hardcoded mock counters are strictly prohibited.
3. **Backend Filtering, Sorting & Server-Side Pagination**:
   - Multi-field search (`name`, `owner`, `email`, `phone`, `gstNumber`, `city`, `applicationId`), multi-attribute filtering (`status`, `verification`, `businessType`, `state`, `city`, `dateJoined`), and sorting (`newest`, `oldest`, `rating`, `name`) must execute on the database layer.
   - Frontend must never download the entire dataset for client-side pagination.
4. **Lazy-Loaded Comprehensive Inspection Drawer**:
   - Clicking an agency row triggers `GET /api/admin/agencies/:id` to fetch full overview, live KYC documents with preview/download, live packages from `packages` collection, live bookings from `bookings` collection, and activity audit trails.
5. **Secure Administrative Status Management & Bulk Operations**:
   - Status actions (`activate`, `suspend`, `verify`, `reject`, `delete`) and bulk operations must validate permissions on the backend, transition document status in MongoDB, append timeline events to `agency.timeline`, and log structured events in `audit_logs`.

---

## 11. Production Agency Messaging & CRM Customer Inbox Rules

1. **Zero Mock Data Anywhere**:
   - No mock message datasets, fake conversations (`MOCK_CONVERSATIONS`), fake message arrays (`MOCK_MESSAGES`), hardcoded customer names, placeholder attachment links, or simulated unread counters anywhere in the codebase.
   - Every single conversation, chat message, attachment, companion list, emergency contact, and staff private note MUST originate directly from MongoDB.
2. **Multi-Tenant Agency Isolation Is Mandatory**:
   - Agency identity is decided strictly and exclusively by the verified JWT session token (`req.agency._id`).
   - Never trust frontend-supplied agency IDs. Every database query, mutation, and read operation MUST enforce `agencyId = loggedInAgencyId`.
   - No agency shall ever view, search, or message another agency's conversations or customers through URL manipulation, parameter tampering, or API modification.
3. **Normalized Database Architecture (Zero Duplication)**:
   - Reuse existing collections: `Agency`, `User` (Customer), `Booking`, `Package`, `SavedTraveler`, and `AuditLog`.
   - Customer profile details, booking status, package information, and travel companion records must NEVER be duplicated into message documents. Always reference ObjectIDs and populate them on demand.
   - Only dedicated messaging collections are allowed: `conversations`, `messages`, and `agency_private_notes`.
4. **Staff-Only Private Notes**:
   - Private notes written by agency staff are strictly for internal agency use and MUST NEVER be exposed or leaked to travelers or external customer endpoints.
5. **Real-Time Delivery & Presence via Socket.IO**:
   - Handshake authentication via JWT.
   - Scoped room channels: `agency_<agencyId>`, `conversation_<conversationId>`, and `user_<userId>`.
   - Real-time events for message delivery, read receipts (double blue checkmarks), typing status, and online/offline presence detection. No fake presence dots.
6. **Cloud-Native Media Uploads**:
   - All chat attachments (PDF itineraries, vouchers, invoices, photos) must upload directly to Cloudinary and store permanent secure URLs and metadata. Never store local filesystem paths.
7. **UI/UX Preservation**:
   - Maintain 100% of the approved UI layout, spacing, 3-column split view on desktop, full-screen mobile transitions, Framer Motion animations, typography, color tokens (`#583BE8`), and component hierarchy exactly.

---

## 12. Car Rental Marketplace & Vehicle Booking Protocol

1. **Mandatory Inspection Route**:
   - Clicking any vehicle card or "View & Book" button MUST navigate to `/car-rental/:id` (`VehicleDetailsPage.tsx`).
   - Abruptly opening checkout modals directly from the public vehicle catalog is strictly prohibited.
2. **Two-Step Checkout Validation**:
   - Step 1 (Logistics): Pickup location, dropoff location, pickup date & time, return date & time, duration calculation.
   - Step 2 (Driver & Settlement): Primary driver full name, contact information, driver's license number, and payment selection.
3. **Driver's License Requirement**:
   - A valid driver's license number is mandatory for all car bookings. Bookings cannot proceed without it.
4. **Split-Payment & Token Advance Standard**:
   - System must support both 100% full payment and 20% advance token deposit (`pay_on_pickup`).
   - For token bookings, `paymentStatus` is recorded as `partial_advance` and `remainingAmount` is tracked in `CarBookingModel` for collection upon vehicle key release.
5. **Layout Isolation & Viewport Anchoring**:
   - The sticky pricing and checkout action bar on `VehicleDetailsPage` must anchor cleanly to `bottom-0 z-30` with `backdrop-blur-md`.
   - Never render conflicting or overlapping bottom navigation bars on vehicle inspection screens.
6. **Verified Vehicle Reviews**:
   - All reviews must query from and persist to `car_reviews` (`CarReviewModel`) referencing valid `carId` and authenticated `userId`.

---

## 13. Multi-Business Provider Architecture & Database Evolution Protocol

### 1. Unified Business Identity & Single Authentication
1. **Single Authentication System Only**:
   - Strictly prohibit creating a second login screen, a second JWT mechanism, secondary authentication routes, or duplicate provider accounts.
   - One business account can own multiple business capabilities (`businessTypes: ('agency' | 'car_rental')[]`).
2. **Zero-Reload Workspace Switching**:
   - Providers operating multiple business verticals switch operational workspaces inside the agency portal via `BusinessSwitcher` and `ActiveBusinessContext`.
   - Never force a full page reload or session re-authentication to switch vertical views.

### 2. Operational Modularity & Shared Systems
1. **Independent Vertical Tooling**:
   - The Travel Agency vertical (packages, tour bookings, trip dispatch) and Car Rental vertical (fleet inventory, vehicle reservations, chauffeur rosters) operate independently.
2. **Strict Prohibition of Shared System Duplication**:
   - The following systems are platform singletons and must NEVER be re-implemented or duplicated for new business verticals:
     - Authentication & JWT Token Verification
     - Omnichannel Notification Center (Socket.IO + In-App + Email)
     - Messaging & Customer Real-Time Chat (`conversations`, `messages`)
     - Payment & Settlement Systems
     - User Management & Customer Profiles
     - Cloudinary Media Asset Pipeline
     - System Activity & Administrative Audit Logs
     - Roles & Permissions (RBAC)

### 3. Existing Agency Preservation Rule
1. **Zero Breaking Changes**:
   - Existing agencies remain 100% unaffected.
   - Default `businessTypes` to `['agency']` and `carRentalVerificationStatus` to `'NOT_REGISTERED'` to guarantee backwards compatibility.
   - Never mutate or degrade existing travel agency routes, controllers, or database queries.

### 4. Database Immutability & Expansion Rules
1. **Permanent Collection Immutability**:
   - The following core MongoDB collections must NEVER be renamed, deleted, or recreated:
     - `users`
     - `agencies`
     - `packages`
     - `bookings`
     - `notifications`
     - `messages`
     - `payments`
2. **Database Expansion Protocol**:
   - When a new business capability requires persistence:
     - Reuse existing collections whenever possible.
     - Never duplicate existing data models or REST endpoints.
     - Only create new collections when domain logic genuinely requires specialized schemas (`cars`, `car_bookings`, `car_reviews`).
     - Always reference the parent `agencyId` foreign key with proper Mongoose indexes.

### 5. Future Development Compliance
1. Every future feature and commercial vertical must strictly integrate into this multi-business architecture.
2. New business capabilities must extend existing infrastructure rather than introducing parallel systems.

### 6. Partner Onboarding Separation Protocol (One Business at a Time + In-Dashboard Expansion)
1. **Zero Cross-Contamination & No "Both" Option**:
   - Prospective partners register for **one business vertical at a time**. The "Both" option is strictly prohibited on initial onboarding.
   - Car Rental must NEVER appear as an option inside the Travel Agency onboarding wizard or any "Business Type" dropdown.
2. **Dedicated Business Selection Gate**:
   - Partner entry points (`/partner`, `/partner/select-business`, `/partner/select-type`) must offer exactly 2 choices:
     - ① Travel Agency (`/agency/onboarding/business` or `/partner/agency/onboarding`)
     - ② Car Rental Provider (`/partner/car-rental/onboarding`)
3. **In-Dashboard Business Expansion**:
   - Accounts expand into additional verticals from inside the dashboard:
     - Travel Agency dashboard renders "Expand Your Business — Start a Car Rental Business".
     - Car Rental dashboard renders "Expand Your Business — Start a Travel Agency".
   - The unified account owns both verticals under a single identity, single email, and single JWT token.
4. **Conditional Dashboard Switching**:
   - The `BusinessSwitcher` capsule in the header appears **ONLY** after both businesses exist and both are verified.
5. **Standalone Registration Standard**:
   - Standalone car rental partners register via `POST /api/agencies/car-rental/onboard`.
   - The system generates an application tracking ID (`ATP-CR-YYYY-XXXXXX`), securely hashes passwords, sets `businessTypes: ['car_rental']`, and initializes `carRentalVerificationStatus: 'PENDING'`.
6. **Deterministic Post-Login Routing**:
   - Pure car rental partners (`businessTypes === ['car_rental']`) must route immediately to the car rental domain: `/agency/car-rental/dashboard` when approved or `/agency/car-rental/pending` when awaiting verification.
   - Never direct a pure car rental provider into travel agency dashboards or tour package wizards.

### 7. Business Expansion UX & Settings Hub Standards
1. **Soft, Non-Intrusive Onboarding Prompts**:
   - Multi-business expansion prompts on dashboards must use gentle, optional phrasing ("Expand Your Business (Optional)").
   - Prompts must provide two actions: `[Start Now]` to open onboarding/activation, and `[Maybe Later]` to dismiss.
2. **Persistent Banner Dismissal**:
   - When a user clicks `[Maybe Later]`, the preference MUST be stored in persistent client storage (`localStorage`) so the user is never repeatedly nagged across page reloads or subsequent sessions.
3. **Permanent Settings Business Hub**:
   - Providers must always have access to manage their active services and add new verticals (`+ Add Service`) from `AgencySettingsPage.tsx` via `BusinessServicesCard.tsx`, independent of dashboard banner visibility.
4. **Future Verticals Preview**:
   - The Business Services hub must display upcoming platform verticals (Hotels & Resorts, Homestays & Villas, Activities & Experiences, Taxi Network, Local Guides) with disabled "Coming Soon" indicators to convey the ecosystem roadmap.
5. **Mobile-First Workspace Switcher (Bottom Sheet)**:
   - For mobile viewports, the workspace switcher must render a native bottom sheet drawer rather than an overflowing desktop dropdown.
   - It must include a centered drag handle, dim backdrop overlay, card-based workspace selection with checkmarks, and a cancel button. Switching must execute with zero page reloads.

### 8. Admin Car Rental Approval Module Protocol
1. **Queue Isolation**:
   - Car Rental applications MUST be reviewed in their own dedicated queue (`/admin/car-rental-approvals`). Never merge car rental fleet applications into agency tour approvals.
2. **Zero Mock/Dummy Data**:
   - All statistics, queues, vehicle listings, chauffeur rosters, and documents MUST be queried directly from MongoDB collections (`agencies`, `cars`, `audit_logs`, `notifications`). Never use localStorage or hardcoded counts.
3. **Mandatory Action Workflows**:
   - Rejections MUST require a mandatory reason.
   - Request Changes MUST allow selecting specific compliance issues (RC expired, insurance missing, chauffeur license unclear, commercial permit missing, bank details incorrect) with custom applicant instructions.
   - All state transitions MUST generate an audit log (`AuditLoggerService.log`) and dispatch a real in-app notification to the provider.
4. **Non-Breaking Invariance**:
   - Agency approvals (`/admin/verification-pending`) and related services/controllers must NEVER be mutated or broken when updating or deploying car rental approval features.

### 9. Agency Dashboard Car Rental Integration Protocol (Phase 2)
1. **Single Account & Unified Dashboard Shell Invariance**:
   - Do NOT create new accounts, duplicate layouts, or spawn separate dashboard shells.
   - Travel Agency and Car Rental reside within the exact same account and dashboard framework.
2. **Segmented Switcher Requirement**:
   - Inside dashboard headers (`AgencyDashboardPage.tsx` and `AgencyCarRentalDashboardPage.tsx`), under the date card, render the `[ Travel Agency ] [ Car Rental ]` switch.
   - Must feature slight glass effect, 3D pressed tactile feel, animated sliding pill (`layoutId="businessSegmentedPill"`), full responsiveness across 320px–414px+, and instant context switching without page reloads.
3. **Dynamic Sidebar Switching**:
   - The desktop sidebar must automatically transition between Travel Agency navigation items and Car Rental navigation items with smooth slide transitions.
4. **100% Backend-Driven Operation**:
   - All 6 KPI metrics, fleet listings, customer CRM profiles, driver rosters, and analytics telemetry MUST come directly from MongoDB Atlas. Zero dummy or mock data allowed.
5. **Slide-over Detailed Drawers**:
   - Vehicle inspection (`VehicleDetailsDrawer`), Owner inspection (`OwnerProfileDrawer`), and Driver inspection (`DriverDetailsDrawer`) must provide complete compliance and history telemetry in slide-over panels without navigating away from tables.
6. **Zero Travel Agency Regressions**:
   - Packages, bookings, trips, notifications, customer chats, and existing travel agency capabilities must continue functioning completely unchanged.

### 10. Global Search & Deep Linking Protocol
1. **Contract Invariance**:
   - Every search result returned by backend `search.service.ts` MUST include canonical fields: `id`, `type`, `title`, `subtitle`, `route`, `targetUrl`, `slug`, `image`, `imageUrl`, `badge`, `rating`, `metadata`.
   - Frontend search components MUST navigate using `navigate(item.route || item.targetUrl)`. Never invoke `navigate` with an undefined route or reload `/search`.
2. **Canonical Route Schema**:
   - Packages: `/packages/:packageId` (with alias `/packages/:id`, `/package/:id`)
   - Destinations: `/destinations/:destinationId` (with alias `/destinations/:id`, `/destination/:id`)
   - Agencies: `/agency/:agencyId` (with alias `/agency/:id`, `/agencies/:id`)
   - Vehicles/Cars: `/cars/:id` (with alias `/cars/:vehicleId`, `/car/:id`, `/car-rental/:id`)
   - Bookings: `/bookings/:bookingId` (with alias `/booking/:bookingId`, `/bookings/:id`)
   - Public Travelers: `/traveler/:userId` (with alias `/travelers/:userId`, `/traveler/:id`)
   - Trips: `/trips/:tripId` (with alias `/trips/:id`, `/trip/:id`)
   - Messages/Chats: `/chat/:chatId`
3. **Deep Link Resilience**:
   - All destination pages MUST support direct URL access, full page refreshes (F5), and back/forward browser history.
   - Every destination page must implement proper loading, not-found/empty fallback states, and safe ID resolution (`useParams`).

---

## 14. Traveler Identity Verification (KYC) & One-Time Travel Profile Protocol

1. **Backend as Single Source of Truth**:
   - The frontend NEVER derives, infers, or overrides traveler KYC status.
   - Status state machine is strictly owned by `UserKycService` and `TravelProfileService`.
   - State progression: `NOT_SUBMITTED` ➔ `PROFILE_COMPLETED` ➔ `DOCUMENTS_UPLOADED` ➔ `UNDER_REVIEW` ➔ `OCR_PROCESSING` ➔ `ADMIN_REVIEW` ➔ (`VERIFIED` | `REJECTED` | `EXPIRED` | `SUSPENDED`).
2. **Deterministic Parent Status Derivation Formula**:
   - The parent KYC status is calculated deterministically from the document states:
     - If no required documents exist ➔ `NOT_SUBMITTED`
     - If any required document is `REJECTED` ➔ `REJECTED`
     - If any required document is `PENDING` ➔ `PENDING` (Pending Review)
     - If all required documents are `VERIFIED` ➔ `VERIFIED`
     - If validity date has elapsed ➔ `EXPIRED`
3. **Strict Document Collection Standards**:
   - **Mandatory (Choose 1)**:
     - Aadhaar Card: Both Front & Back images required.
     - Voter ID: Front image only.
   - **Optional Supplements**:
     - Driving Licence: Front & Back required (for self-drive car rentals).
     - Passport: Photo & bio page only (for flights and international travel).
   - **Strict Exclusion**:
     - Visa documents are strictly NOT collected or accepted in the traveler verification workspace.
4. **Traveler Dashboard 4-State Contract**:
   - `TravelProfileDashboardCard` must implement 4 clean states:
     - **State 1 (Draft/Incomplete)**: Completion wizard prompt.
     - **State 2 (Under Review)**: Compact pending verification card with ~45% height reduction, reassuring copy, and status timeline.
     - **State 3 (Verified)**: Card returns `null` with ZERO empty wrapper divs or ghost layout shifts. Natural DOM reflow.
     - **State 4 (Rejected)**: Prominent "Verification Failed" warning card displaying the exact rejection reason and one-click re-upload action.
5. **Automatic Silver Membership Upgrade**:
   - Super Admin approval of traveler KYC must atomically upgrade the traveler's membership to **Silver Tier** (`tier: 'SILVER'`, `status: 'ACTIVE'`, `validity: 365 days`).
   - Eliminates repetitive traveler detail requests on subsequent package or car rental bookings.
6. **Super Admin Review Workspace Standard**:
   - Admin reviews traveler KYC directly inside `UserDetailsDrawer.tsx` with zero page transitions.
   - Must render: dynamic header badges, live counter summary bar (`DocumentSummary`), document cards with masked IDs (`•••• •••• 4289`), full modal stage with zoom/rotate/filter tools (`DocumentPreviewModal`), and immutable audit timeline (`KycTimeline`).
   - Granular actions supported: Document Approve, Document Reject (mandatory reason), Request Re-upload, Overall Approve, Overall Reject, and Revoke Verification.