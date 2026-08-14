// ─── Super Admin Payment Management Interfaces ───────────────────────────────

export type PaymentStatus = 'Success' | 'Failed' | 'Pending' | 'Refunded';
export type SettlementStatus = 'Pending' | 'Settled' | 'Failed' | '—';
export type PaymentGatewayType = 'Razorpay' | 'PhonePe' | 'PayU' | 'Stripe';

export interface PaymentTimelineStep {
  id: string;
  title: string;
  subtitle?: string;
  timestamp?: string;
  status: 'completed' | 'current' | 'upcoming' | 'failed';
}

export interface PaymentActivityLog {
  id: string;
  actor: string;
  role: 'Super Admin' | 'Gateway' | 'Agency' | 'Traveler';
  action: string;
  details: string;
  timestamp: string;
}

export interface AdminPaymentItem {
  id: string;
  transactionId: string; // e.g. TXN-984512
  bookingId: string; // e.g. BK-10455
  paymentDate: string; // e.g. Jun 12, 2024
  paymentTime: string; // e.g. 10:30 AM
  paymentStatus: PaymentStatus;
  settlementStatus: SettlementStatus;
  bookingStatus: 'Confirmed' | 'Pending' | 'Cancelled' | 'Refunded';

  // Traveler Details
  travelerName: string;
  travelerEmail: string;
  travelerPhone: string;
  travelerAvatar: string;

  // Agency Details
  agencyName: string;
  agencyLogo: string;
  isAgencyVerified: boolean;
  settlementAccount: string; // e.g. Wanderlust Holidays (•••• 4321)

  // Package Details
  packageName: string;
  packageThumbnail: string;
  destinationCountry: string;
  destinationRegion: string;
  durationText: string; // e.g. 5D/4N
  travelDatesText: string; // e.g. Jun 15 – Jun 20, 2024
  travelersCountText: string; // e.g. 3 Travelers

  // Financial Breakdown
  totalAmount: string; // e.g. ₹28,999
  platformFee: string; // e.g. ₹2,900
  gstAmount: string; // e.g. ₹4,175
  couponDiscount?: string; // e.g. - ₹2,000
  couponCode?: string; // e.g. DISCOUNT10
  netAmount: string; // e.g. ₹31,074
  agencyEarnings: string; // e.g. ₹26,099
  currency: string; // e.g. INR

  // Gateway Details
  gateway: PaymentGatewayType;
  paymentMethod: string; // e.g. UPI (Google Pay), Card, Netbanking
  gatewayTransactionId: string; // e.g. pay_PN8xZlYp7m9QxR
  paymentReference: string; // e.g. 123456789012
  gatewayResponse: string; // e.g. Authorized, Success, Card Declined
  authorizationCode: string; // e.g. AX12PL09
  paidAt: string; // e.g. Jun 12, 2024 • 10:30 AM
  capturedAt: string; // e.g. Jun 12, 2024 • 10:30 AM

  // Settlement Details
  settlementId?: string; // e.g. SETT-59221
  scheduledSettlementDate?: string; // e.g. Jun 15, 2024
  settlementRemarks?: string;

  // Timeline & Activity
  timeline: PaymentTimelineStep[];
  activities: PaymentActivityLog[];
}

export interface PaymentKPIStats {
  totalTransactions: { count: number; growth: string; isPositive: boolean };
  todayRevenue: { value: string; growth: string; isPositive: boolean; comparison: string };
  pendingSettlements: { value: string; growth: string; isPositive: boolean };
  successfulPayments: { count: number; growth: string; isPositive: boolean };
  failedPayments: { count: number; growth: string; isPositive: boolean };
  completedRefunds: { count: number; growth: string; isPositive: boolean };
  platformCommission: { value: string; growth: string; isPositive: boolean };
}

export interface PaymentFilters {
  paymentStatus: string;
  settlementStatus: string;
  gateway: string;
  paymentMethod: string;
  agency: string;
  destination: string;
  dateRange: string;
  amountRange: string;
  search: string;
}

export interface PaymentSortConfig {
  key: 'transactionId' | 'amount' | 'date' | 'status' | 'settlement' | 'agency';
  direction: 'asc' | 'desc';
}
