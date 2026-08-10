// Backend-Ready Interfaces for Booking Checkout API Integration

export interface LeadTraveler {
  fullName: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  idProofType: string;
  idProofNumber: string;
  address?: string;
  medicalNotes?: string;
  travelPreferences?: string;
  specialRequests?: string;
}

export interface AdditionalTraveler {
  id: string;
  fullName: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  idProofType: string;
  idProofNumber: string;
  emergencyContact: string;
  type?: 'Adult' | 'Child';
}

export interface EmergencyContactInfo {
  name: string;
  relationship: string;
  phone: string;
}

export interface TravelerSectionData {
  leadTraveler: LeadTraveler;
  additionalTravelers: AdditionalTraveler[];
  emergencyContact: EmergencyContactInfo;
  medicalNotes: string;
  travelPreferences: string;
  specialRequests: string;
}

export interface BookingSummaryData {
  pickupPoint: string;
  dropPoint: string;
  tripDuration: string;
  departureDate: string;
  returnDate: string;
  includedServices: string[];
  excludedServices: string[];
  cancellationPolicy: string;
  termsAccepted: boolean;
}

export interface PromoCodeData {
  code: string;
  discountAmount: number;
  isApplied: boolean;
  message?: string;
}

export interface PaymentSummaryData {
  basePricePerPerson: number;
  travelerCount: number;
  packageTotal: number;
  platformFees: number;
  insurancePrice: number;
  discountAmount: number;
  taxes: number;
  totalPayable: number;
}

export interface InvoicePreview {
  invoiceNumber: string;
  transactionPreviewId: string;
  issueDate: string;
  status: 'DRAFT' | 'PENDING' | 'PAID';
}

export interface StepCompletionStatus {
  travelerDetails: boolean;
  review: boolean;
  termsAccepted: boolean;
}

export interface CollapsedSectionsState {
  travelerDetails: boolean;
  review: boolean;
}

export interface FullCheckoutState {
  packageId: string;
  travelerDetails: TravelerSectionData;
  bookingSummary: BookingSummaryData;
  promoCode: PromoCodeData;
  paymentSummary: PaymentSummaryData;
  invoice: InvoicePreview;
  paymentStatus: 'idle' | 'processing' | 'success' | 'failed';
  stepCompletion: StepCompletionStatus;
  collapsedSections: CollapsedSectionsState;
}

// -----------------------------------------------------------------------------
// API Endpoints Specification (Backend Ready)
// -----------------------------------------------------------------------------

// GET /api/booking/checkout/:packageId
export interface GetCheckoutDetailsResponse {
  success: boolean;
  data: {
    packageId: string;
    title: string;
    agencyName: string;
    agencyVerified: boolean;
    coverImage: string;
    pricePerPerson: number;
    duration: string;
    pickupPoint: string;
    dropPoint: string;
    departureDate: string;
    returnDate: string;
    includedServices: string[];
    excludedServices: string[];
    cancellationPolicy: string;
  };
}

// POST /api/booking/travelers
export interface PostTravelersRequest {
  packageId: string;
  travelerDetails: TravelerSectionData;
}

export interface PostTravelersResponse {
  success: boolean;
  validated: boolean;
  travelerDetailsId: string;
  message: string;
}

// POST /api/booking/review
export interface PostReviewRequest {
  packageId: string;
  travelerDetailsId: string;
  promoCode?: string;
  isInsuranceSelected: boolean;
  termsAccepted: boolean;
}

export interface PostReviewResponse {
  success: boolean;
  reviewId: string;
  updatedPaymentSummary: PaymentSummaryData;
  message: string;
}

// POST /api/booking/payment
export interface PostPaymentRequest {
  packageId: string;
  travelerDetailsId: string;
  reviewId: string;
  paymentMethod: 'razorpay' | 'upi' | 'card' | 'netbanking';
  totalAmount: number;
}

export interface PostPaymentResponse {
  success: boolean;
  bookingId: string;
  transactionId: string;
  invoiceUrl: string;
  status: 'CONFIRMED' | 'PENDING';
}
