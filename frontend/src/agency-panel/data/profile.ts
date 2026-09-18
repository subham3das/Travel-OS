// ─── Agency Profile Data Model & Contracts ────────────────────────────────────

export interface AgencyHeroData {
  agencyId: string;
  agencyName: string;
  category: string;
  logo: string;
  coverImage: string;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  yearsInBusiness: string;
  location: string;
  verificationStatus: 'Verified' | 'Pending' | 'Rejected' | 'Under Review';
  totalPackages: number;
  totalBookings: number;
  description: string;
  website: string;
  phone: string;
  email: string;
}

export interface BusinessInfoData {
  businessName: string;
  legalBusinessName: string;
  gstNumber: string;
  panNumber: string;
  registrationNumber: string;
  businessLicenseNumber: string;
  agencyType: string;
  businessDescription: string;
  languages: string[];
  website: string;
}

export interface ContactInfoData {
  primaryContact: string;
  phone: string;
  alternatePhone: string;
  email: string;
  supportEmail: string;
  officeAddress: string;
  googleMapsLocation: string;
  emergencyContact: string;
}

export interface VerificationItem {
  id: string;
  documentType: string;
  status: 'Verified' | 'Pending' | 'Rejected' | 'Under Review';
  uploadedDate: string;
  documentUrl?: string;
}

export interface DayBusinessHours {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  isHoliday: boolean;
}

export interface SocialLinksData {
  instagram: string;
  facebook: string;
  youtube: string;
  linkedin: string;
  x: string;
  website: string;
}

export interface BankDetailsData {
  accountHolder: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  settlementAccount: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  status: 'Verified' | 'Pending' | 'Expired' | 'Under Review';
  fileUrl: string;
}

export interface PerformanceMetric {
  id: string;
  title: string;
  value: string;
  growth: string;
  isPositive: boolean;
  type: 'packages' | 'trips' | 'bookings' | 'revenue' | 'travelers' | 'rating';
}

// ─── Settings Data Model ─────────────────────────────────────────────────────

export interface GeneralSettingsData {
  agencyName: string;
  businessDescription: string;
  timezone: string;
  language: string;
  currency: string;
  dateFormat: string;
  profileVisibility: 'Public' | 'Private' | 'Unlisted';
}

export interface BookingSettingsData {
  bookingApproval: 'Automatic' | 'Manual';
  minTravelers: number;
  maxTravelers: number;
  bookingDeadlineDays: number;
  waitlistEnabled: boolean;
  cancellationPolicy: string;
  refundPolicy: string;
}

export interface PaymentSettingsData {
  gstNumber: string;
  gstPercentage: number;
  invoicePrefix: string;
  settlementAccount: string;
  upiId: string;
  defaultCurrency: string;
  gatewayStatus: 'Connected' | 'Not Connected' | 'Coming Soon';
}

export interface NotificationSettingsData {
  bookingNotifications: boolean;
  tripNotifications: boolean;
  paymentNotifications: boolean;
  refundNotifications: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export interface TripDefaultsData {
  defaultCheckInTime: string;
  defaultCheckOutTime: string;
  emergencyContact: string;
  pickupInstructions: string;
  termsAndConditions: string;
}

export interface SecurityData {
  twoFactorAuthStatus: 'Enabled' | 'Disabled' | 'Coming Soon';
  activeDevicesCount: number;
  currentSessions: { device: string; ip: string; location: string; lastActive: string }[];
}

export interface IntegrationItem {
  id: string;
  name: string;
  category: string;
  status: 'Connected' | 'Not Connected' | 'Coming Soon';
  iconName: string;
}

export interface AboutData {
  version: string;
  privacyPolicyUrl: string;
  termsUrl: string;
  helpCenterUrl: string;
  supportContact: string;
}

export interface AgencySettingsData {
  general: GeneralSettingsData;
  booking: BookingSettingsData;
  payment: PaymentSettingsData;
  notification: NotificationSettingsData;
  tripDefaults: TripDefaultsData;
  security: SecurityData;
  integrations: IntegrationItem[];
  about: AboutData;
}

export interface CompleteAgencyProfile {
  hero: AgencyHeroData;
  business: BusinessInfoData;
  contact: ContactInfoData;
  verifications: VerificationItem[];
  businessHours: DayBusinessHours[];
  social: SocialLinksData;
  bank: BankDetailsData;
  documents: DocumentItem[];
  teamMemberCount: number;
  performanceSnapshot: PerformanceMetric[];
  settings: AgencySettingsData;
}

export const INITIAL_AGENCY_PROFILE: CompleteAgencyProfile = {
  hero: {
    agencyId: '',
    agencyName: 'Loading Agency...',
    category: 'Tour Operator',
    logo: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    isVerified: false,
    rating: 4.8,
    reviewCount: 0,
    yearsInBusiness: 'Verified Partner Agency',
    location: '',
    verificationStatus: 'Pending',
    totalPackages: 0,
    totalBookings: 0,
    description: '',
    website: '',
    phone: '',
    email: '',
  },
  business: {
    businessName: '',
    legalBusinessName: '',
    gstNumber: '',
    panNumber: '',
    registrationNumber: '',
    businessLicenseNumber: '',
    agencyType: 'Tour Operator & Destination Management',
    businessDescription: '',
    languages: ['English', 'Hindi'],
    website: '',
  },
  contact: {
    primaryContact: '',
    phone: '',
    alternatePhone: '',
    email: '',
    supportEmail: '',
    officeAddress: '',
    googleMapsLocation: '',
    emergencyContact: '',
  },
  verifications: [],
  businessHours: [
    { day: 'Monday', isOpen: true, openTime: '09:00 AM', closeTime: '07:00 PM', isHoliday: false },
    { day: 'Tuesday', isOpen: true, openTime: '09:00 AM', closeTime: '07:00 PM', isHoliday: false },
    { day: 'Wednesday', isOpen: true, openTime: '09:00 AM', closeTime: '07:00 PM', isHoliday: false },
    { day: 'Thursday', isOpen: true, openTime: '09:00 AM', closeTime: '07:00 PM', isHoliday: false },
    { day: 'Friday', isOpen: true, openTime: '09:00 AM', closeTime: '07:00 PM', isHoliday: false },
    { day: 'Saturday', isOpen: true, openTime: '10:00 AM', closeTime: '05:00 PM', isHoliday: false },
    { day: 'Sunday', isOpen: false, openTime: 'Closed', closeTime: 'Closed', isHoliday: true },
  ],
  social: {
    instagram: '',
    facebook: '',
    youtube: '',
    linkedin: '',
    x: '',
    website: '',
  },
  bank: {
    accountHolder: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',
    settlementAccount: 'Primary Settlement Account',
  },
  documents: [],
  teamMemberCount: 1,
  performanceSnapshot: [
    { id: 'p-packages', title: 'Packages', value: '0', growth: '0 Active', isPositive: true, type: 'packages' },
    { id: 'p-trips', title: 'Active Trips', value: '0', growth: '0 Scheduled', isPositive: true, type: 'trips' },
    { id: 'p-bookings', title: 'Bookings', value: '0', growth: '0 Bookings', isPositive: true, type: 'bookings' },
    { id: 'p-revenue', title: 'Revenue', value: '₹0', growth: '₹0', isPositive: true, type: 'revenue' },
    { id: 'p-travelers', title: 'Travelers', value: '0', growth: '0 Travelers', isPositive: true, type: 'travelers' },
    { id: 'p-rating', title: 'Avg. Rating', value: '4.8', growth: 'Top Rated', isPositive: true, type: 'rating' },
  ],
  settings: {
    general: {
      agencyName: '',
      businessDescription: '',
      timezone: '(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi',
      language: 'English (US)',
      currency: 'INR (₹)',
      dateFormat: 'DD/MM/YYYY',
      profileVisibility: 'Public',
    },
    booking: {
      bookingApproval: 'Automatic',
      minTravelers: 1,
      maxTravelers: 24,
      bookingDeadlineDays: 3,
      waitlistEnabled: true,
      cancellationPolicy: '100% refund up to 7 days before departure. 50% refund up to 48 hours before departure.',
      refundPolicy: 'Refunds processed within 3-5 business days to original payment method.',
    },
    payment: {
      gstNumber: '',
      gstPercentage: 5,
      invoicePrefix: 'INV-ATP-2026',
      settlementAccount: 'Primary Settlement Account',
      upiId: '',
      defaultCurrency: 'INR',
      gatewayStatus: 'Connected',
    },
    notification: {
      bookingNotifications: true,
      tripNotifications: true,
      paymentNotifications: true,
      refundNotifications: true,
      pushNotifications: true,
      emailNotifications: true,
      smsNotifications: false,
    },
    tripDefaults: {
      defaultCheckInTime: '12:00 PM',
      defaultCheckOutTime: '10:00 AM',
      emergencyContact: '',
      pickupInstructions: 'Report to designated airport or railway station terminal 30 minutes prior to departure.',
      termsAndConditions: 'All travelers must possess valid government-issued photo ID.',
    },
    security: {
      twoFactorAuthStatus: 'Coming Soon',
      activeDevicesCount: 1,
      currentSessions: [
        {
          device: 'Current Web Session',
          ip: '127.0.0.1',
          location: 'India',
          lastActive: 'Active Now',
        },
      ],
    },
    integrations: [
      { id: 'gmaps', name: 'Google Maps API', category: 'Location & Maps', status: 'Connected', iconName: 'MapPin' },
      { id: 'whatsapp', name: 'WhatsApp Business API', category: 'Customer Messaging', status: 'Connected', iconName: 'MessageSquare' },
      { id: 'gcal', name: 'Google Calendar Sync', category: 'Schedule & Calendar', status: 'Connected', iconName: 'Calendar' },
      { id: 'email', name: 'ApnaTrip Mail Dispatcher', category: 'Email Dispatch', status: 'Connected', iconName: 'Mail' },
      { id: 'pg', name: 'Payment Gateway (ApnaTrip Pay)', category: 'Payment Processing', status: 'Connected', iconName: 'CreditCard' },
    ],
    about: {
      version: 'v2.4.0-build.104',
      privacyPolicyUrl: 'https://apnatrip.in/privacy',
      termsUrl: 'https://apnatrip.in/terms',
      helpCenterUrl: 'https://apnatrip.in/help',
      supportContact: 'support@apnatrip.in',
    },
  },
};
