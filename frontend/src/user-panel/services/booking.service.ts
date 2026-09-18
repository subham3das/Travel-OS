import { apiClient } from '../../services/apiClient';

export interface CheckoutTraveler {
  name?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  gender?: 'Male' | 'Female' | 'Other' | 'male' | 'female' | 'other';
  dob?: string;
  age?: number;
  idProofType?: string;
  idProofNumber?: string;
  address?: string;
  medicalNotes?: string;
  travelPreferences?: string;
  specialRequests?: string;
  isPrimary?: boolean;
}

export interface CheckoutPayload {
  packageId?: string;
  startDate?: string;
  endDate?: string;
  travelDate?: string;
  returnDate?: string;
  leadTraveler: {
    fullName: string;
    email: string;
    phone: string;
    gender?: string;
    dob?: string;
    idProofType?: string;
    idProofNumber?: string;
    address?: string;
    medicalNotes?: string;
    travelPreferences?: string;
    specialRequests?: string;
  };
  travelers: Array<{
    name: string;
    age?: number;
    gender?: string;
    dob?: string;
    idProofType?: string;
    idProofNumber?: string;
    passportNumber?: string;
    phone?: string;
    email?: string;
    isPrimary?: boolean;
  }>;
  promoCode?: string;
  addOns?: Array<{
    id: string;
    name: string;
    price: number;
    selected?: boolean;
  }>;
  pickupPoint?: string;
  dropPoint?: string;
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phone?: string;
  };
}

export interface CheckoutResult {
  bookingId: string;
  booking: any;
  orderSummary: {
    basePrice: number;
    taxesAndFees: number;
    platformFee: number;
    discountAmount: number;
    grandTotal: number;
    currency: string;
    packageName: string;
  };
}

export interface VerifyPaymentPayload {
  bookingId: string;
  paymentId?: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
}

export interface SavedTraveler {
  _id: string;
  fullName: string;
  gender: 'male' | 'female' | 'other';
  dob: string;
  relationship: string;
  nationality: string;
  passportNumber?: string;
  aadhaarNumber?: string;
}

class BookingService {
  /**
   * Create pending booking and order checkout
   */
  async checkout(payload: CheckoutPayload): Promise<CheckoutResult> {
    const res = await apiClient.post<CheckoutResult>('/bookings/checkout', payload);
    if (!res.data) {
      throw new Error(res.message || 'Checkout failed');
    }
    return res.data;
  }

  /**
   * Verify and confirm payment for booking
   */
  async verifyPayment(payload: VerifyPaymentPayload): Promise<{ booking: any; transactionId: string; status: string }> {
    const res = await apiClient.post<{ booking: any; transactionId: string; status: string }>('/bookings/verify-payment', payload);
    if (!res.data?.booking) {
      throw new Error(res.message || 'Payment verification failed');
    }
    return res.data;
  }

  /**
   * Get all bookings for the authenticated customer
   */
  async getMyBookings(): Promise<any[]> {
    const res = await apiClient.get<{ bookings: any[] }>('/bookings/my');
    return res.data?.bookings || [];
  }

  /**
   * Get booking details by bookingId or _id
   */
  async getBookingById(bookingId: string): Promise<any> {
    const res = await apiClient.get<{ booking: any }>(`/bookings/${bookingId}`);
    if (!res.data?.booking) {
      throw new Error(res.message || 'Booking not found');
    }
    return res.data.booking;
  }

  /**
   * Get saved travelers for quick autofill
   */
  async getSavedTravelers(): Promise<SavedTraveler[]> {
    try {
      const res = await apiClient.get<{ travelers: SavedTraveler[] }>('/travelers');
      return res.data?.travelers || [];
    } catch {
      return [];
    }
  }

  /**
   * Add a new saved traveler
   */
  async addSavedTraveler(traveler: Partial<SavedTraveler>): Promise<SavedTraveler> {
    const res = await apiClient.post<{ traveler: SavedTraveler }>('/travelers', traveler);
    if (!res.data?.traveler) {
      throw new Error(res.message || 'Failed to save traveler');
    }
    return res.data.traveler;
  }
}

export const bookingService = new BookingService();
