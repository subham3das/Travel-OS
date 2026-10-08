# ApnaTrip / Travel OS — Product & Technical Roadmap

This document outlines the strategic product vision, architectural phases, and development milestones for **ApnaTrip / Travel OS**.

---

## Strategic Vision

Transform ApnaTrip from a single-vertical agency marketplace into a **unified multi-business travel operating system** where providers manage tour packages, vehicle rental fleets, accommodations, and guided experiences under a single organization account, and travelers seamlessly book interconnected journeys.

---

## Phase Overview & Progress Matrix

| Phase | Focus Area | Status | Milestones Completed |
|---|---|---|---|
| **Phase 1** | **Core Platform & Travel Agency Marketplace** | ✅ **Complete** | Traveler PWA, Agency Onboarding, Package Creation Wizard, Tour Booking Engine, Super Admin Control Center, MongoDB Atlas connection architecture. |
| **Phase 2** | **User-Facing Car Rental Marketplace** | ✅ **Complete** | Dedicated vehicle inspection pages (`/car-rental/:id`), verified booking modal, split-payment token advances (20% upfront), live customer reviews. |
| **Phase 3** | **Multi-Business Provider Architecture** | ✅ **Complete** | Single provider login supporting Agency, Car Rental, or Both; zero-reload workspace switching; independent Super Admin approvals; full Car Rental operational suite. |
| **Phase 3.5** | **Enterprise Traveler Identity & KYC Workspace** | ✅ **Complete** | Backend-driven KYC lifecycle (`NOT_SUBMITTED` $\to$ `VERIFIED`), mathematical document status derivation, Super Admin review workspace with inspection stage, 4-state traveler card, and automated Silver Membership tier unlock. |
| **Phase 4** | **Dynamic Multi-Vertical Bundling & Cross-Selling** | 🟡 **Planned** | Dynamic package packaging (Tour + Vehicle), unified cart checkout, cross-vertical commission settlements, integrated itinerary timelines. |
| **Phase 5** | **Expanded Verticals (Stays & Experiences)** | ⚪ **Future** | Homestays and boutique hotels, local activities and tour guides, corporate B2B travel management. |

---

## Detailed Milestone Descriptions

### Phase 1 — Core Travel Agency Marketplace (Delivered)
- Customer mobile-first PWA with Google OAuth, Traveler Passport, destination discovery.
- Agency operations portal: Package builder with custom itineraries, day-by-day activities, inclusions/exclusions, pricing matrices.
- Departure dispatching and real-time passenger manifests.
- Omnichannel customer chat with Cloudinary file attachments.
- Super Admin governance: KYC document verification, CMS management, financial reports.

### Phase 2 — Production Car Rental Marketplace (Delivered)
- Full-page vehicle inspection views (`/car-rental/:id`) replacing shallow overlay modals.
- Real-time vehicle specifications, inclusions, exclusions, and verified customer reviews.
- Multi-step booking checkout with driver license validation and trip duration calculation.
- Advance token deposit standard (20% advance payment with remaining balance collected on vehicle pickup).

### Phase 3 — Multi-Business Provider Architecture (Delivered)
- **Single Authentication**: One provider account owns multiple business capabilities (`businessTypes: ('agency' | 'car_rental')[]`).
- **Zero-Reload Workspace Switcher**: Header capsule allowing instant toggle between `Travel Agency` and `Car Rental` dashboards.
- **Dedicated Car Rental Operations Suite**:
  - Operational dashboard with fleet utilization and revenue KPIs.
  - Fleet inventory management (add, edit, toggle availability, category filters).
  - Reservations management with inline status transitions (Accept, Reject, Complete).
  - Availability schedule grid mapping vehicle bookings.
  - Chauffeur and crew roster with commercial licenses.
  - Financial telemetry with advance deposits vs remaining balances.
  - Rental brand settings, 24/7 roadside helpline, operating hubs, payout bank accounts.
- **Super Admin Independent Verification**: Agency requests table and drawer support independent verification decisions for Car Rental capabilities without affecting agency status.

### Phase 3.5 — Enterprise Traveler Identity & KYC Workspace (Delivered)
- **Backend-Driven State Machine**: 100% server-governed lifecycle (`NOT_SUBMITTED` $\to$ `PROFILE_COMPLETED` $\to$ `DOCUMENTS_UPLOADED` $\to$ `UNDER_REVIEW` $\to$ `OCR_PROCESSING` $\to$ `ADMIN_REVIEW` $\to$ `VERIFIED` / `REJECTED` / `EXPIRED` / `SUSPENDED`).
- **Mathematical Status Derivation**: Eliminates discrepancies by calculating parent KYC status directly from child document verification states.
- **Document Rules**: Mandatory Aadhaar (Front + Back) or Voter ID (Front only); optional Driving Licence and Passport; Visa excluded.
- **Super Admin Review Workspace**: Telemetry headers (risk score, face match %, doc match %), live `DocumentSummary` counters, masked document review cards, and an enterprise `DocumentPreviewModal` with zoom, rotate, lighting filters, and inline review actions.
- **Traveler App 4-State Lifecycle**: Self-reflowing Home screen where verified card returns `null`, pending displays a ~45% reduced compact card, and rejected displays specific administrative feedback.
- **Automated Membership Unlock**: Upgrades verified travelers from `Free` to `Silver` tier for 1 year, auto-enabling 1-click booking and 5% discounts.
- **Immutable Audit Trail**: Logs every administrative mutation and document decision to `audit_logs`.

### Phase 4 — Dynamic Bundling & Cross-Selling (Next Up)
- **Unified Checkout**: Allow travelers to add a car rental directly to an existing tour package booking.
- **Smart Itinerary Sync**: Automatically suggest vehicle pickup when a traveler arrives at their destination airport or station.
- **Cross-Vertical Ledger**: Reconcile advance deposits, platform commissions, and vendor payouts across bundled orders.

### Phase 5 — Stays & Experiences Expansion (Future)
- Plug-and-play addition of `Stays` and `Experiences` verticals into the existing `ActiveBusinessContext` and `AgencyModel` without altering database foundations.
