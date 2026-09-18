import { agencyApiClient } from './agencyApiClient';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REFUNDED' | 'COMPLETED';
export type PaymentStatus = 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'REFUNDED';
export type TripEligibility = 'ELIGIBLE' | 'NOT_ELIGIBLE';
export type BookingGroupStatus =
  | 'OPEN'
  | 'READY_FOR_TRIP'
  | 'MINIMUM_NOT_REACHED'
  | 'MOVED_TO_TRIP'
  | 'CANCELLED';

export interface TravelPartner {
  id: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  dob?: string;
  phone?: string;
  email?: string;
  idProofType?: string;
  idProofNumber?: string;
  emergencyContact?: string;
  medicalNotes?: string;
  isPrimary?: boolean;
}

export interface BookingOwnerInfo extends TravelPartner {
  isPrimary: true;
}

export interface TravelerInfo {
  name: string;
  phone: string;
  email: string;
}

export interface BookingTimelineItem {
  title: string;
  timestamp?: string;
  completed: boolean;
  active?: boolean;
}

export interface PaymentHistoryItem {
  id: string;
  amount: number;
  date: string;
  method: string;
  reference: string;
  status?: 'SUCCESS' | 'PENDING' | 'FAILED';
}

export interface AgencyBooking {
  id: string;
  bookingId: string;
  packageId: string;
  packageName: string;
  coverImage: string;
  departureDate: string;
  returnDate: string;
  bookingDate: string;
  travelerCount: number;
  packagePrice: number;
  totalAmount: number;
  amountPaid: number;
  remainingAmount: number;
  dueDate: string;
  owner: BookingOwnerInfo;
  partners: TravelPartner[];
  traveler: TravelerInfo;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  tripEligibility: TripEligibility;
  specialRequests?: string;
  timeline: BookingTimelineItem[];
  paymentHistory: PaymentHistoryItem[];
  assignedTripId?: string;
  assignedTripName?: string;
}

export interface BookingGroup {
  groupId: string;
  packageId: string;
  packageName: string;
  coverImage: string;
  departureDate: string;
  returnDate: string;
  minTravelers: number;
  maxCapacity: number;
  confirmedTravelerCount: number;
  fullyPaidTravelerCount: number;
  pendingPaymentTravelerCount: number;
  totalBookingsCount: number;
  pendingCount: number;
  cancelledCount: number;
  deadlineDate: string;
  deadlineText: string;
  isDeadlineExpired: boolean;
  groupStatus: BookingGroupStatus;
  tripReadyReason?: 'CAPACITY_REACHED' | 'BOOKING_DEADLINE_EXPIRED' | 'MANUAL';
  assignedTripId?: string;
  expectedRevenue: number;
  bookings: AgencyBooking[];
}

export interface AgencyBookingSummary {
  total: number;
  confirmed: number;
  confirmedPct: string;
  pending: number;
  pendingPct: string;
  cancelled: number;
  cancelledPct: string;
  tripReady: number;
  minNotReached: number;
}

export interface AgencyBookingsDataResponse {
  bookings: AgencyBooking[];
  groups: BookingGroup[];
  summary: AgencyBookingSummary;
}

class AgencyBookingsService {
  /**
   * 1. Get Live KPI Statistics for Agency Bookings
   */
  public async getBookingStats(): Promise<AgencyBookingSummary> {
    const res = await agencyApiClient.get<AgencyBookingSummary>('/agency/bookings/stats', {
      requiresAuth: true,
    });
    return (
      res.data || {
        total: 0,
        confirmed: 0,
        confirmedPct: '0%',
        pending: 0,
        pendingPct: '0%',
        cancelled: 0,
        cancelledPct: '0%',
        tripReady: 0,
        minNotReached: 0,
      }
    );
  }

  /**
   * 2. Get Live Bookings & Departure Groups from MongoDB
   */
  public async getBookings(): Promise<AgencyBookingsDataResponse> {
    const res = await agencyApiClient.get<AgencyBookingsDataResponse>('/agency/bookings', {
      requiresAuth: true,
    });

    return (
      res.data || {
        bookings: [],
        groups: [],
        summary: {
          total: 0,
          confirmed: 0,
          confirmedPct: '0%',
          pending: 0,
          pendingPct: '0%',
          cancelled: 0,
          cancelledPct: '0%',
          tripReady: 0,
          minNotReached: 0,
        },
      }
    );
  }

  /**
   * 3. Get Single Booking Manifest by ID
   */
  public async getBookingById(bookingId: string): Promise<AgencyBooking> {
    const res = await agencyApiClient.get<AgencyBooking>(`/agency/bookings/${bookingId}`, {
      requiresAuth: true,
    });
    return res.data!;
  }

  /**
   * 4. Confirm Reservation
   */
  public async confirmBooking(bookingId: string): Promise<AgencyBooking> {
    const res = await agencyApiClient.patch<AgencyBooking>(
      `/agency/bookings/${bookingId}/confirm`,
      {},
      { requiresAuth: true }
    );
    return res.data!;
  }

  /**
   * 5. Cancel Reservation
   */
  public async cancelBooking(bookingId: string, reason?: string): Promise<AgencyBooking> {
    const res = await agencyApiClient.patch<AgencyBooking>(
      `/agency/bookings/${bookingId}/cancel`,
      { reason },
      { requiresAuth: true }
    );
    return res.data!;
  }
}

export const agencyBookingsService = new AgencyBookingsService();
