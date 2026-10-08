# ApnaTrip (TravelOS) — Backend API Service

Enterprise Node.js + Express + TypeScript backend powering the **ApnaTrip Multi-Business Platform** (Tour Packages, Car Rental Fleets, Traveler PWA, and Super Admin Command Center).

---

## 1. Core Modules & Capabilities

- **Authentication & RBAC:** Multi-role JWT authentication supporting Customers, Multi-Business Agency Providers, and Super Admins.
- **Traveler Identity & KYC (`adminKyc.service.ts` / `travelProfile.service.ts`):** Complete backend-driven KYC verification engine with mathematical document status derivation, automated Silver Membership unlocking, and real-time administrative review.
- **Agency Partner Vetting:** Verification pipelines for travel agencies (GST, PAN, bank details) and car rental fleet providers.
- **Car Rental Fleet Operations (`car.service.ts` / `carBooking.service.ts`):** Complete vehicle lifecycle, live booking engine with split token advances, and driver management.
- **Tour Packages & Live Departures (`package.service.ts` / `departure.service.ts`):** Itinerary planning wizard, departure inventory, and passenger manifests.
- **Payments & Settlements:** Razorpay gateway integration for 1-click package bookings and car rentals.
- **Audit Logging & Telemetry:** Immutable audit logs (`audit_logs`) tracking administrative decisions, KYC approvals, and security events.

---

## 2. Directory Layout

```text
backend/src/
├── config/             # MongoDB Atlas, Cloudinary CDN, Socket.IO, logger configs
├── controllers/        # Express request controllers (adminKyc, travelProfile, car, etc.)
├── middlewares/        # JWT auth (user, agency, admin), RBAC, error handlers, Zod validation
├── models/             # 30+ Mongoose models (UserKyc, TravelProfile, User, Agency, Car, etc.)
├── routes/             # Mounted Express routers under /api
├── services/           # Business logic, aggregation pipelines, event side-effects
├── types/              # TypeScript contracts and Express augmentations
├── utils/              # Standardized API response formatters, encryption, token utilities
├── validators/         # Zod schemas for runtime request validation
├── app.ts              # Express application configuration
└── server.ts           # Server bootstrap and WebSocket initialization
```

---

## 3. Traveler KYC & Travel Profile Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/profile/travel-profile` | Fetch traveler profile & completion stats | Traveler JWT |
| `PUT` | `/api/profile/travel-profile` | Save personal profile & upload documents | Traveler JWT |
| `GET` | `/api/admin/users/:userId/kyc` | Fetch full admin KYC review payload | Admin JWT |
| `POST` | `/api/admin/users/:userId/kyc/approve` | Approve overall KYC & auto-unlock Silver Tier | Admin JWT |
| `POST` | `/api/admin/users/:userId/kyc/reject` | Reject KYC with required reason | Admin JWT |
| `POST` | `/api/admin/users/:userId/kyc/request-reupload` | Request traveler document re-upload | Admin JWT |
| `POST` | `/api/admin/users/:userId/kyc/revoke` | Revoke KYC verification | Admin JWT |
| `POST` | `/api/admin/users/:userId/kyc/renew` | Extend KYC validity | Admin JWT |
| `POST` | `/api/admin/users/:userId/kyc/unsuspend` | Restore suspended account | Admin JWT |
| `POST` | `/api/admin/users/:userId/kyc/documents/:docId/approve` | Approve individual document & auto-derive parent status | Admin JWT |
| `POST` | `/api/admin/users/:userId/kyc/documents/:docId/reject` | Reject document & auto-derive status as Rejected | Admin JWT |
| `POST` | `/api/admin/users/:userId/kyc/documents/:docId/request-reupload` | Request re-upload for single document | Admin JWT |

---

## 4. Development & Testing

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Run TypeScript compilation check
npx tsc --noEmit
```

*For detailed architectural and API specifications, see [`BACKEND_SPECIFICATION.md`](BACKEND_SPECIFICATION.md), [`BACKEND_ARCHITECTURE.md`](BACKEND_ARCHITECTURE.md), and [`../docs/KYC_TRAVEL_PROFILE_SPECIFICATION.md`](../docs/KYC_TRAVEL_PROFILE_SPECIFICATION.md).*
