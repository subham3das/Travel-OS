# ApnaTrip / Travel OS — Master Project Structure

This document outlines the complete organizational structure of the ApnaTrip platform, detailing the backend, frontend panels, multi-business architecture, and database mapping.

---

## 1. High-Level Repository Layout

```text
APNA_TRIPV4/
├── backend/                  # Node.js + Express + TypeScript Backend
│   ├── src/
│   │   ├── config/           # Database, environment, Cloudinary, socket configurations
│   │   ├── controllers/      # 50+ REST controllers handling HTTP requests
│   │   ├── middlewares/      # JWT auth, RBAC, error handling, validation middlewares
│   │   ├── models/           # 30+ Mongoose models mapping to MongoDB Atlas
│   │   ├── routes/           # Express router definitions mounted under /api
│   │   ├── services/         # Business logic, aggregation pipelines, cross-system events
│   │   ├── types/            # TypeScript interfaces, custom Express augmentations
│   │   ├── utils/            # Reusable response builders, token handlers, email templates
│   │   ├── validators/       # Zod schemas for runtime request payload validation
│   │   ├── app.ts            # Express application setup and middleware pipeline
│   │   └── server.ts         # HTTP server, WebSocket initialization, graceful shutdown
│   └── scripts/              # Integration test suites and MongoDB seeding scripts
│
├── frontend/                 # React 18 + Vite + TypeScript Frontend
│   └── src/
│       ├── admin-panel/      # Super Admin Control Center
│       ├── agency-panel/     # Agency & Car Rental Multi-Business Portal
│       ├── user-panel/       # Customer / Traveler Progressive Web App
│       ├── components/       # Shared UI primitives (buttons, modals, badges, inputs)
│       ├── contexts/         # Platform-wide React contexts (Toast, Theme, Socket)
│       ├── hooks/            # Reusable custom React hooks
│       ├── services/         # Axios API clients for backend communication
│       └── types/            # Frontend TypeScript type declarations
│
├── graphify-out/             # Knowledge Graph Artifacts & Visualizations
│   ├── graph.html            # Interactive 2D/3D knowledge graph viewer
│   ├── graph.json            # GraphRAG nodes, edges, and community clusters
│   └── GRAPH_REPORT.md       # Architectural audit trail and community hubs
│
├── ARCHITECTURE.md           # Master System Architecture Blueprint
├── RULES.md                  # Permanent Development Protocol & Global Rules
├── MEMORY.md                 # Permanent Development History & Milestones
├── PROJECT_STRUCTURE.md      # This file: Directory & Module Layout
├── DEVELOPMENT_GUIDE.md      # Engineer Handbook & Contribution Guide
└── ROADMAP.md                # Strategic Product & Technical Roadmap
```

---

## 2. Multi-Business Agency Panel Structure

The Agency Panel supports both **Travel Agency** and **Car Rental** operations under a single unified provider authentication:

```text
frontend/src/agency-panel/
├── components/
│   ├── common/               # Loading states, error states, empty screens
│   ├── customers/            # Customer CRM cards and companion tables
│   ├── dashboard/            # Navigation, headers, telemetry widgets
│   │   ├── BusinessSwitcher.tsx      # Vertical switcher (Agency ⇄ Car Rental)
│   │   ├── DashboardHeader.tsx       # Header with notification bells & switcher
│   │   ├── DesktopSidebar.tsx        # Dynamic vertical-adapted sidebar
│   │   ├── BottomNavigation.tsx      # Dynamic mobile navigation bar
│   │   └── StatCard.tsx              # KPI metric cards
│   ├── inbox/                # Customer messaging chat drawers and message items
│   ├── packages/             # Tour package cards, filter bars, status chips
│   └── trips/                # Live departure manifests, vehicle & team assignment
│
├── context/
│   ├── ActiveBusinessContext.tsx     # Central multi-business vertical state
│   ├── AgencyAuthContext.tsx         # Primary agency provider authentication
│   └── AgencyThemeContext.tsx        # Isolated styling and theme variables
│
├── pages/
│   ├── auth/                 # Agency login, signup, password reset
│   ├── onboarding/           # Business registration & verification stepper
│   ├── dashboard/            # Travel Agency operations dashboard
│   ├── packages/             # Tour package catalog & management
│   ├── PackageCreate/        # Multi-step package creation wizard
│   ├── bookings/             # Tour package booking management
│   ├── trips/                # Live departure operations & manifests
│   ├── customers/            # Customer CRM profiles & history
│   ├── inbox/                # Real-time customer chat inbox
│   ├── analytics/            # Travel agency revenue & bookings telemetry
│   ├── finance/              # Agency payouts and bank details
│   ├── profile/              # Agency corporate profile & KYC docs
│   │
│   └── car-rental/           # 🚗 DEDICATED CAR RENTAL VERTICAL PAGES
│       ├── AgencyCarRentalActivatePage.tsx   # Initial fleet registration flow
│       ├── AgencyCarRentalPendingPage.tsx    # Vertical verification tracking
│       ├── AgencyCarRentalDashboardPage.tsx  # Fleet operational dashboard
│       ├── AgencyCarRentalCarsPage.tsx       # Vehicle catalog CRUD & toggles
│       ├── AgencyCarRentalBookingsPage.tsx   # Car reservations & actions
│       ├── AgencyCarRentalCalendarPage.tsx   # Availability schedule grid
│       ├── AgencyCarRentalDriversPage.tsx    # Chauffeur directory & licenses
│       ├── AgencyCarRentalAnalyticsPage.tsx  # Fleet yield & occupancy analytics
│       └── AgencyCarRentalSettingsPage.tsx   # Rental hubs & payout accounts
│
├── routes/
│   ├── AgencyRoutes.tsx              # All /agency/* routes wrapped in context
│   └── AgencyProtectedRoute.tsx      # Route guard verifying agency JWT
│
└── services/
    ├── agencyApiClient.ts            # Base Axios client with JWT interceptors
    ├── agencyCarRental.service.ts    # Car rental vertical API methods
    └── agencyPackage.service.ts      # Package creation and management APIs
```

---

## 3. Super Admin Panel Structure

The Super Admin panel governs independent approvals for both Travel Agency and Car Rental operations:

```text
frontend/src/admin-panel/
├── components/
│   ├── layout/               # Admin topbar, navigation sidebar, breadcrumbs
│   └── super-admin/
│       ├── users/
│       │   ├── UserDetailsDrawer.tsx         # Comprehensive user inspection drawer
│       │   └── kyc/                          # 🛡️ KYC Verification Workspace Components
│       │       ├── AdminKycCard.tsx          # Telemetry, risk score, fraud check header
│       │       ├── DocumentSummary.tsx       # Live counters (Uploaded, Verified, Pending...)
│       │       ├── KycDocumentCard.tsx       # Masked docs, review buttons, metadata drawer
│       │       ├── DocumentPreviewModal.tsx  # Zoom, rotate, lighting filters, inline review
│       │       ├── KycTimeline.tsx           # Multi-stage compliance audit trail
│       │       ├── KycActionBar.tsx          # State-driven compliance action bar
│       │       ├── KycStatusBadge.tsx        # Styled status indicator badges
│       │       └── MembershipCard.tsx        # Tier benefits & renewal details
│       ├── agency-requests/
│       │   ├── AgencyRequestTableRow.tsx     # Rows with multi-business pills
│       │   ├── AgencyRequestDrawer.tsx       # Independent Agency & Car Rental review
│       │   └── AgencyRequestFilterBar.tsx    # Filter by vertical & status
│       ├── analytics/        # Platform-wide revenue & commission graphs
│       └── cms/              # Homepage hero banners, curated collections
│
├── pages/
│   ├── dashboard/            # Global platform command center
│   ├── agencies/             # Verified agency registry & management
│   ├── requests/             # Verification queue for new applications
│   ├── packages/             # Platform package moderation
│   └── settings/             # Commission rates and system toggles
│
└── services/
    ├── adminKyc.service.ts           # Traveler KYC workspace review & decisions
    ├── adminAgencyRequest.service.ts # Independent agency & car rental approvals
    └── adminApiClient.ts             # Admin authenticated API client
```

---

## 4. User Panel (Traveler PWA) Structure

```text
frontend/src/user-panel/
├── components/
│   ├── dashboard/
│   │   └── TravelProfileDashboardCard.tsx # 4-state lifecycle card (auto-hides on verified)
│   ├── carRental/            # Vehicle cards, search filters, booking modals
│   ├── explore/              # Curated collections, destination pills
│   ├── packages/             # Package details, itinerary timelines
│   └── common/               # Sticky action bars, search headers
│
├── pages/
│   ├── Home/                 # Homepage with multi-vertical discovery & reflowing layout
│   ├── CarRental/
│   │   ├── CarRentalPage.tsx       # Public vehicle marketplace & filters
│   │   └── VehicleDetailsPage.tsx  # Dedicated inspection & verified booking
│   ├── Packages/             # Package exploration & booking
│   ├── Profile/              # One-Time Travel Profile, Aadhaar/Voter ID uploads, companions
│   └── Chat/                 # Customer chat with agencies & fleet partners
│
└── services/
    ├── travelProfile.service.ts # Travel profile CRUD, missing fields, doc re-upload sync
    ├── carRental.service.ts     # Public car search, vehicle reviews, bookings
    └── package.service.ts       # Package discovery and booking APIs
```

---

## 5. Database Schema & Multi-Business Relational Mapping

All collections reside in **MongoDB Atlas (`travelos_db`)**:

| Collection | Model File | Purpose & Multi-Business Relationship |
|---|---|---|
| `users` | `user.model.ts` | Platform customers, travelers, and agency owners (`isKycVerified`, `membership`) |
| `travel_profiles` | `travelProfile.model.ts` | One-time personal profile, Aadhaar/Voter ID/DL/Passport files, `verificationStatus` |
| `user_kycs` | `userKyc.model.ts` | Compliance workspace record, risk telemetry, multi-stage timeline, document decisions |
| `agencies` | `agency.model.ts` | **Root Business Account**: Stores corporate identity, `businessTypes: ['agency', 'car_rental']`, `activeBusiness`, `carRentalVerificationStatus`, and `carRentalProfile` |
| `packages` | `package.model.ts` | Tour packages created by travel agencies (`agencyId`) |
| `bookings` | `booking.model.ts` | Tour package reservations placed by travelers |
| `cars` | `car.model.ts` | Vehicles owned and managed by rental providers (`agencyId`) |
| `car_bookings` | `carBooking.model.ts` | Vehicle reservations with split token advance payments |
| `car_reviews` | `carReview.model.ts` | Verified vehicle customer ratings and reviews |
| `saved_travelers` | `savedTraveler.model.ts` | Companion profiles, passport numbers, dietary flags, emergency contacts |
| `conversations` | `conversation.model.ts` | **Shared**: Customer chat threads linking to `agencyId` |
| `messages` | `message.model.ts` | **Shared**: Individual real-time chat messages and media |
| `notifications` | `notification.model.ts` | **Shared**: In-app and push notification records (KYC approved/rejected alerts) |
| `audit_logs` | `auditLog.model.ts` | **Shared**: Immutable administrative actions, KYC decisions, timeline history |
