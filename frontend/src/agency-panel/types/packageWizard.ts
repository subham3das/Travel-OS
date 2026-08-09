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

export type TripDifficulty = 'Easy' | 'Moderate' | 'Difficult';

export type PackageVisibility = 'Draft' | 'Publish Later';

export interface Step1BasicInfo {
  packageName: string;
  shortDescription: string;
  packageType: PackageType | null;
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
  minTravelers: number;
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
  minimumTravelers: number;
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

export interface PackageWizardDraft {
  currentStep: number;
  isComplete: boolean;
  step1: Step1BasicInfo;
  step2: Step2DestinationInfo;
  step3: Step3PricingInfo;
  stepDepartures: StepDeparturesInfo;
  step4: Step4ItineraryInfo;
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
  minimumTravelers: 8,
  maximumTravelers: 20,
  bookedTravelers: 0,
  availableSeats: 20,
  status: 'Upcoming',
  returnDate: '2026-09-16',
  returnTime: '09:00',
};

export const INITIAL_WIZARD_DRAFT: PackageWizardDraft = {
  currentStep: 1,
  isComplete: false,
  step1: {
    packageName: 'Ladakh Adventure Expedition',
    shortDescription: 'High-altitude motorable mountain pass trail & starlit lake camping.',
    packageType: 'Adventure',
    tripDifficulty: 'Difficult',
    visibility: 'Draft',
  },
  step2: {
    primaryDestination: 'Leh, Pangong Tso',
    destinationsCovered: ['Leh', 'Nubra Valley', 'Pangong Tso'],
    durationPreset: '7 Days / 6 Nights',
    days: 7,
    nights: 6,
    seasons: ['Summer'],
    bestMonths: ['Jun', 'Jul', 'Aug', 'Sep'],
    pickupCity: 'Leh Airport',
    dropOffCity: 'Leh Airport',
    meetingPoint: 'Leh Airport Terminal 1',
    travelModes: ['Flight', 'Private Vehicle'],
  },
  step3: {
    pricingModel: 'Price Per Person',
    originalPrice: 24999,
    discountedPrice: 18999,
    minTravelers: 8,
    maxTravelers: 20,
    recommendedGroupSize: 12,
    paymentType: 'Full Payment',
    advanceAmount: 5000,
    inclusions: ['GST Included', 'Permit Charges'],
    extraCharges: {
      singleOccupancy: true,
      childPrice: false,
      extraBed: true,
      peakSeasonSurcharge: false,
    },
    allowCouponCodes: true,
    cancellationPolicy: 'Moderate',
  },
  stepDepartures: {
    departures: [INITIAL_DEPARTURE_ITEM],
  },
  step4: {
    days: INITIAL_ITINERARY_DAYS,
    activeDayId: INITIAL_ITINERARY_DAYS[0]?.id || 'day-1',
  },
  step5: {
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    galleryImages: INITIAL_GALLERY_IMAGES,
    videos: INITIAL_VIDEOS,
    imageCategories: ['Scenic Views'],
    previewIndex: 0,
  },
  step6: {
    includedItems: ['hotel_stay', 'breakfast_dinner', 'permits', 'first_aid', 'guide'],
    customIncludedItems: ['Oxygen Cylinder Support'],
    excludedItems: ['airfare', 'personal_expenses', 'travel_insurance'],
    customExcludedItems: ['Camel Safari Fee'],
    packingItems: ['warm_jacket', 'sunscreen', 'trekking_shoes'],
    customPackingItems: [],
    optionalAddOns: [
      { id: 'room_upgrade', enabled: true, price: 2000 },
      { id: 'airport_pickup_upgrade', enabled: false, price: 1200 },
    ],
    importantNotes: '',
  },
  step7: {
    cancellationPolicy: 'Moderate',
    customCancellationRules: [
      { id: 'rule-1', daysBeforeDeparture: '30+ Days', refundPercentage: 100 },
      { id: 'rule-2', daysBeforeDeparture: '15-29 Days', refundPercentage: 50 },
      { id: 'rule-3', daysBeforeDeparture: 'Less than 15 Days', refundPercentage: 0 },
    ],
    bookingTerms: [
      'Valid Government ID Required',
      'Booking is Non-transferable',
      'Package Subject to Weather',
      'Schedule may change due to local conditions',
      'Travelers must follow guide instructions',
      'No Illegal Activities',
    ],
    refundProcessing: 'Instant Refund',
    requiredDocuments: ['passport', 'driving_license', 'passport_photos'],
    customDocuments: [],
    healthSafety: [
      'High Altitude Warning',
      'Fitness Required',
      'Oxygen Available',
      'Emergency Support',
      'Travel Insurance Recommended',
      'Medical Disclosure Required',
    ],
    faqs: INITIAL_FAQS,
    emergencyContact: {
      phone: '+91 98765 43210',
      alternatePhone: '+91 91234 56789',
      email: 'support@mountroam.com',
      is24x7: true,
    },
    legalConfirmed: true,
  },
  step8: {
    seoSettings: {
      slug: 'ladakh-adventure-expedition',
      metaTitle: 'Ladakh Adventure Expedition – 7 Days Trip',
      metaDescription: "Explore Ladakh's stunning landscapes, lakes, and mountains with MountRoam Adventures.",
      keywords: 'ladakh, adventure, leh, nubra, pangong, travel',
    },
    publishMode: 'Draft',
    scheduleEnabled: false,
    publishDate: '',
    publishTime: '09:00',
    timezone: 'Asia/Kolkata (IST)',
    visibilityTargets: ['Website', 'Mobile App', 'Featured Packages', 'Homepage'],
    finalAgreement: true,
  },
};

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
  { step: 6, title: 'Gallery & Media' },
  { step: 7, title: 'Inclusions & Exclusions' },
  { step: 8, title: 'Policies, FAQs & Rules' },
  { step: 9, title: 'Preview & Publish' },
];
