// ─── Agency Package Wizard Types ──────────────────────────────────────────────

import { TravelSeason, TravelMode } from '../data/destinations';
import {
  PricingModel,
  PaymentType,
  PricingInclusion,
  CancellationPolicy,
} from '../data/pricing';
import { Step4ItineraryInfo, INITIAL_ITINERARY_DAYS } from './itinerary';
import {
  Step5GalleryInfo,
  INITIAL_GALLERY_IMAGES,
  INITIAL_VIDEOS,
  CategoryTag,
} from './gallery';
import {
  CancellationPolicyType,
  RefundProcessingType,
  CustomCancellationRule,
  FAQItem,
  INITIAL_FAQS,
} from '../data/policies';

export type PackageType =
  | 'Adventure'
  | 'Family'
  | 'Honeymoon'
  | 'Backpacking'
  | 'Religious'
  | 'Wildlife'
  | 'Luxury'
  | 'Weekend Getaway';

export const ADVENTURE_TYPES = [
  'Trekking',
  'Camping',
  'Backpacking',
  'Expedition',
  'Road Trip',
  'Wildlife Safari',
  'Desert Safari',
  'Cycling',
  'River Rafting',
  'Skiing',
  'Snow Adventure',
  'Scuba Diving',
  'Paragliding',
  'General Adventure',
] as const;

export type AdventureType = (typeof ADVENTURE_TYPES)[number];
export const DEFAULT_ADVENTURE_TYPE: AdventureType = 'General Adventure';

export type TripDifficulty = 'Easy' | 'Moderate' | 'Difficult';

export type PackageVisibility = 'Draft' | 'Publish Later';

export interface Step1BasicInfo {
  packageName: string;
  shortDescription: string;
  packageType: PackageType | null;
  adventureType?: AdventureType | string;
  tripDifficulty: TripDifficulty | null;
  visibility: PackageVisibility;
}

export interface Step2DestinationInfo {
  primaryDestination: string;
  destinationsCovered: string[];
  durationPreset: string;
  days: number;
  nights: number;
  seasons: TravelSeason[];
  bestMonths: string[];
  pickupCity: string;
  dropOffCity: string;
  meetingPoint: string;
  travelModes: TravelMode[];
}

export interface Step3PricingInfo {
  pricingModel: PricingModel;
  originalPrice: number;
  discountedPrice: number;
  maxTravelers: number;
  recommendedGroupSize: number;
  paymentType: PaymentType;
  advanceAmount: number;
  inclusions: PricingInclusion[];
  extraCharges: {
    singleOccupancy: boolean;
    childPrice: boolean;
    extraBed: boolean;
    peakSeasonSurcharge: boolean;
  };
  allowCouponCodes: boolean;
  cancellationPolicy: CancellationPolicy;
}

export type DepartureScheduleStatus =
  | 'Upcoming'
  | 'Sold Out'
  | 'Cancelled'
  | 'Completed'
  | 'Booking Closed';

export interface DepartureScheduleItem {
  id: string;
  departureDate: string; // e.g. "2026-09-10"
  departureTime: string; // e.g. "09:00"
  timezone: string; // "IST (UTC+5:30)"
  pickupLocation: string;
  reportingTime: string;
  bookingClosingDate: string; // "2026-09-05"
  bookingClosingTime: string; // "23:59"
  maximumTravelers: number;
  bookedTravelers: number;
  availableSeats: number;
  status: DepartureScheduleStatus;
  returnDate: string; // Auto-calculated
  returnTime: string; // Default to departureTime
}

export interface StepDeparturesInfo {
  departures: DepartureScheduleItem[];
}

export interface AddOnState {
  id: string;
  enabled: boolean;
  price: number;
}

export interface Step6InclusionsInfo {
  includedItems: string[];
  customIncludedItems: string[];
  excludedItems: string[];
  customExcludedItems: string[];
  packingItems: string[];
  customPackingItems: string[];
  optionalAddOns: AddOnState[];
  importantNotes: string;
}

export interface Step7PoliciesInfo {
  cancellationPolicy: CancellationPolicyType;
  customCancellationRules: CustomCancellationRule[];
  bookingTerms: string[];
  refundProcessing: RefundProcessingType;
  requiredDocuments: string[];
  customDocuments: string[];
  healthSafety: string[];
  faqs: FAQItem[];
  emergencyContact: {
    phone: string;
    alternatePhone: string;
    email: string;
    is24x7: boolean;
  };
  whatsappGroupLink?: string;
  legalConfirmed: boolean;
}

export type PublishMode = 'Draft' | 'Private' | 'Public';

export interface Step8PublishInfo {
  seoSettings: {
    slug: string;
    metaTitle: string;
    metaDescription: string;
    keywords: string;
  };
  publishMode: PublishMode;
  scheduleEnabled: boolean;
  publishDate: string;
  publishTime: string;
  timezone: string;
  visibilityTargets: string[];
  finalAgreement: boolean;
}

export interface PackageHotelEntry {
  id: string;
  hotelName: string;
  hotelImages: string[];
  category: string;
  address: string;
  city: string;
  amenities: string[];
  roomType: string;
  checkIn: string;
  checkOut: string;
  shortDescription: string;
  dayRange?: string;
}

export interface StepAccommodationInfo {
  accommodationConfirmed: boolean;
  hotels: PackageHotelEntry[];
}

export interface PackageWizardDraft {
  draftId?: string;
  packageId?: string;
  status?: string;
  whatsappGroupLink?: string;
  currentStep: number;
  isComplete: boolean;
  step1: Step1BasicInfo;
  step2: Step2DestinationInfo;
  step3: Step3PricingInfo;
  stepDepartures: StepDeparturesInfo;
  step4: Step4ItineraryInfo;
  stepAccommodation: StepAccommodationInfo;
  step5: Step5GalleryInfo;
  step6: Step6InclusionsInfo;
  step7: Step7PoliciesInfo;
  step8: Step8PublishInfo;
}

export const INITIAL_DEPARTURE_ITEM: DepartureScheduleItem = {
  id: 'dep-101',
  departureDate: '2026-09-10',
  departureTime: '09:00',
  timezone: 'Asia/Kolkata (IST)',
  pickupLocation: 'Leh Airport (IXL)',
  reportingTime: '07:30 AM',
  bookingClosingDate: '2026-09-05',
  bookingClosingTime: '23:59',
  maximumTravelers: 20,
  bookedTravelers: 0,
  availableSeats: 20,
  status: 'Upcoming',
  returnDate: '2026-09-16',
  returnTime: '09:00',
};

export const EMPTY_WIZARD_DRAFT: PackageWizardDraft = {
  currentStep: 1,
  isComplete: false,
  step1: {
    packageName: '',
    shortDescription: '',
    packageType: null,
    adventureType: 'General Adventure',
    tripDifficulty: null,
    visibility: 'Draft',
  },
  step2: {
    primaryDestination: '',
    destinationsCovered: [],
    durationPreset: '3 Days / 2 Nights',
    days: 3,
    nights: 2,
    seasons: [],
    bestMonths: [],
    pickupCity: '',
    dropOffCity: '',
    meetingPoint: '',
    travelModes: [],
  },
  step3: {
    pricingModel: 'Price Per Person',
    originalPrice: 0,
    discountedPrice: 0,
    maxTravelers: 20,
    recommendedGroupSize: 10,
    paymentType: 'Full Payment',
    advanceAmount: 0,
    inclusions: [],
    extraCharges: {
      singleOccupancy: false,
      childPrice: false,
      extraBed: false,
      peakSeasonSurcharge: false,
    },
    allowCouponCodes: true,
    cancellationPolicy: 'Moderate',
  },
  stepDepartures: {
    departures: [],
  },
  step4: {
    days: [],
    activeDayId: '',
  },
  stepAccommodation: {
    accommodationConfirmed: false,
    hotels: [],
  },
  step5: {
    coverImage: '',
    galleryImages: [],
    videos: [],
    imageCategories: [],
    previewIndex: 0,
  },
  step6: {
    includedItems: [],
    customIncludedItems: [],
    excludedItems: [],
    customExcludedItems: [],
    packingItems: [],
    customPackingItems: [],
    optionalAddOns: [],
    importantNotes: '',
  },
  step7: {
    cancellationPolicy: 'Moderate',
    customCancellationRules: [],
    bookingTerms: [],
    refundProcessing: '3-5 Business Days',
    requiredDocuments: [],
    customDocuments: [],
    healthSafety: [],
    faqs: [],
    emergencyContact: {
      phone: '',
      alternatePhone: '',
      email: '',
      is24x7: false,
    },
    whatsappGroupLink: '',
    legalConfirmed: false,
  },
  step8: {
    seoSettings: {
      slug: '',
      metaTitle: '',
      metaDescription: '',
      keywords: '',
    },
    publishMode: 'Draft',
    scheduleEnabled: false,
    publishDate: '',
    publishTime: '09:00',
    timezone: 'Asia/Kolkata (IST)',
    visibilityTargets: ['Website'],
    finalAgreement: false,
  },
};

export const INITIAL_WIZARD_DRAFT: PackageWizardDraft = EMPTY_WIZARD_DRAFT;

export interface WizardStepMeta {
  step: number;
  title: string;
}

export const WIZARD_STEPS: WizardStepMeta[] = [
  { step: 1, title: 'Basic Information' },
  { step: 2, title: 'Destination & Duration' },
  { step: 3, title: 'Pricing & Capacity' },
  { step: 4, title: 'Departure Schedule' },
  { step: 5, title: 'Itinerary' },
  { step: 6, title: 'Accommodation (Optional)' },
  { step: 7, title: 'Gallery & Media' },
  { step: 8, title: 'Inclusions & Exclusions' },
  { step: 9, title: 'Policies, FAQs & Rules' },
  { step: 10, title: 'Preview & Publish' },
];
