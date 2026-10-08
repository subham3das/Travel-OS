# ApnaTrip (TravelOS) — Frontend Application Suite

A high-performance React 18 + Vite + TypeScript frontend powering the multi-portal **ApnaTrip Travel Operating System**.

---

## 1. Multi-Portal Architecture

The frontend codebase is partitioned into three isolated portal suites:

```text
frontend/src/
├── admin-panel/              # Super Admin Command Center & Compliance Workspaces
│   ├── components/super-admin/
│   │   └── users/kyc/        # 🛡️ Dedicated KYC Review Workspace Components
│   └── services/             # Admin API clients (adminKyc.service.ts, etc.)
│
├── agency-panel/             # Multi-Business Agency & Car Rental Operating Center
│   ├── context/              # ActiveBusinessContext (Agency ⇄ Car Rental)
│   └── pages/                # Tour Package Wizard & Dedicated Car Rental Pages
│
├── user-panel/               # Customer / Traveler Progressive Web App
│   ├── components/dashboard/ # TravelProfileDashboardCard (4-State Lifecycle)
│   ├── pages/Profile/        # One-Time Travel Profile & Document Upload
│   └── pages/Home/           # Dynamic Feed with Naturally Reflowing Layout
│
├── components/               # Shared design system components & primitives
├── contexts/                 # Global UI contexts (Theme, Socket, Toast)
└── services/                 # Axios HTTP client with JWT interceptors
```

---

## 2. KYC System Components

### Admin KYC Workspace (`frontend/src/admin-panel/components/super-admin/users/kyc/`)
* **`AdminKycCard.tsx`:** KYC verification header displaying status badge, verification ID, dates, reviewer, risk score (0-100), face match %, document accuracy %, fraud analysis, and government validation gateway.
* **`DocumentSummary.tsx`:** Dynamic counter bar displaying real-time counts for `Uploaded`, `Verified`, `Pending`, `Rejected`, and `Expired` with interactive list filtering.
* **`KycDocumentCard.tsx`:** Interactive review cards with thumbnail previews, masked document numbers (`•••• •••• 4289`), expiry date, country, OCR result, anti-forgery check, and actions (`Preview`, `Approve`, `Reject`, `Re-upload`, `Download`, `Metadata`).
* **`DocumentPreviewModal.tsx`:** Enterprise document inspection stage equipped with:
  * Zoom (+ / - from 50% to 350% scale)
  * 90° clockwise rotation
  * Brightness and Contrast lighting filters for watermark verification
  * Fullscreen toggle
  * Previous / Next document pagination
  * Inline document action decisions (`Approve`, `Reject`, `Request Re-upload`)
* **`KycTimeline.tsx`:** Chronological multi-stage compliance audit trail tracking `Submitted` $\to$ `OCR Completed` $\to$ `Forgery Check` $\to$ `Face Match` $\to$ `Government Validation` $\to$ `Admin Viewed` $\to$ `Approved`.
* **`KycActionBar.tsx`:** State-reactive compliance decision bar that strictly changes actions based on parent KYC status (`Pending`, `Verified`, `Rejected`, `Expired`, `Suspended`).

---

### Traveler App Component (`frontend/src/user-panel/components/dashboard/`)
* **`TravelProfileDashboardCard.tsx`:** State-driven dashboard card implementing the 4-state lifecycle:
  * **State 1 (In Progress):** Completion bar with missing fields counter and "Complete Travel Profile" CTA.
  * **State 2 (Pending Verification):** Compact informational card (~45% height reduction, no promotional fluff) showing pending status, progress, and a clean "Manage" button.
  * **State 3 (Verified):** **Automatically returns `null`**, completely removing the card and allowing the Traveler Home screen to reflow naturally without margin gaps.
  * **State 4 (Rejected):** "Verification Failed" warning with the administrative reason and a direct "Re-upload Documents" CTA.

---

## 3. Development Workflow

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run TypeScript compilation check
npx tsc --noEmit
```

*For complete system specifications and API documentation, refer to [`../docs/KYC_TRAVEL_PROFILE_SPECIFICATION.md`](../docs/KYC_TRAVEL_PROFILE_SPECIFICATION.md).*
