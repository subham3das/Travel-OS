// ─── Booking Types ───────────────────────────────────────────────────────────

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'unpaid' | 'partial' | 'paid' | 'refunded';

export interface BookingTraveler {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob?: string;
  passportNumber?: string;
  aadhaarNumber?: string;
}

export interface Booking {
  id: string;
  bookingCode: string;
  agencyId: string;
  packageId: string;
  packageTitle: string;
  userId: string;
  travelerName: string;
  travelerEmail: string;
  travelerPhone: string;
  travelers: BookingTraveler[];
  startDate: string;
  endDate: string;
  groupSize: number;
  totalAmount: number;
  paidAmount: number;
  currency: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
