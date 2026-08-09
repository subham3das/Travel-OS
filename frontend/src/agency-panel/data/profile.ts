// ─── Agency Profile Data Model & Mock Data ──────────────────────────────────────

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
  verificationStatus: 'Verified' | 'Pending' | 'Rejected';
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
  status: 'Verified' | 'Pending' | 'Rejected';
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
  status: 'Verified' | 'Pending' | 'Expired';
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

// ── Backend API Ready Contracts ──────────────────────────────────────────────
// GET  /api/agency/settings
// PUT  /api/agency/settings
// PUT  /api/agency/settings/security
// PUT  /api/agency/settings/notifications

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

export const MOCK_AGENCY_PROFILE: CompleteAgencyProfile = {
  hero: {
    agencyId: 'ag-78901',
    agencyName: 'Wander Horizons',
    category: 'Adventure Travel Agency',
    logo: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    isVerified: true,
    rating: 4.8,
    reviewCount: 126,
    yearsInBusiness: '5+ Years in Business',
    location: 'Dibrugarh, Assam',
    verificationStatus: 'Verified',
    totalPackages: 12,
    totalBookings: 186,
    description: 'Premier eco-adventure tour operator specializing in Himalayan treks and Northeast India expeditions.',
    website: 'https://wanderhorizons.com',
    phone: '+91 98765 43210',
    email: 'contact@wanderhorizons.com',
  },
  business: {
    businessName: 'Wander Horizons',
    legalBusinessName: 'Wander Horizons Private Limited',
    gstNumber: '18AABCW1234F1Z9',
    panNumber: 'AABCW1234F',
    registrationNumber: 'REG-2019-89210',
    businessLicenseNumber: 'LIC-TOUR-4402',
    agencyType: 'Tour Operator & Destination Management',
    businessDescription: 'Leading adventure travel agency providing customized high-altitude trekking, cultural tours, and wildlife safaris across North-East India and the Himalayas.',
    languages: ['English', 'Hindi', 'Assamese', 'Bengali'],
    website: 'https://wanderhorizons.com',
  },
  contact: {
    primaryContact: 'Subham Das (Operations Director)',
    phone: '+91 98765 43210',
    alternatePhone: '+91 91234 56789',
    email: 'contact@wanderhorizons.com',
    supportEmail: 'support@wanderhorizons.com',
    officeAddress: 'Building 4, MG Road, Near Circuit House, Dibrugarh, Assam - 786001',
    googleMapsLocation: 'https://maps.google.com/?q=27.4728,94.9120',
    emergencyContact: '+91 98765 99999 (24x7 Helpline)',
  },
  verifications: [
    { id: 'v1', documentType: 'Business License', status: 'Verified', uploadedDate: '12 Jan 2024' },
    { id: 'v2', documentType: 'GST Registration Certificate', status: 'Verified', uploadedDate: '15 Jan 2024' },
    { id: 'v3', documentType: 'PAN Card Verification', status: 'Verified', uploadedDate: '10 Jan 2024' },
    { id: 'v4', documentType: 'Bank Account Settlement', status: 'Verified', uploadedDate: '18 Jan 2024' },
    { id: 'v5', documentType: 'Primary Email & Phone Verification', status: 'Verified', uploadedDate: '01 Jan 2024' },
  ],
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
    instagram: 'https://instagram.com/wanderhorizons',
    facebook: 'https://facebook.com/wanderhorizons',
    youtube: 'https://youtube.com/@wanderhorizons',
    linkedin: 'https://linkedin.com/company/wanderhorizons',
    x: 'https://x.com/wanderhorizons',
    website: 'https://wanderhorizons.com',
  },
  bank: {
    accountHolder: 'Wander Horizons Pvt Ltd',
    bankName: 'HDFC Bank Ltd',
    accountNumber: '50200088991122',
    ifscCode: 'HDFC0001234',
    upiId: 'wanderhorizons@hdfcbank',
    settlementAccount: 'Primary Settlement Account (Active)',
  },
  documents: [
    { id: 'd1', title: 'Business License', fileName: 'business_license_2024.pdf', fileSize: '1.8 MB', uploadDate: '12 Jan 2024', status: 'Verified', fileUrl: '#' },
    { id: 'd2', title: 'GST Certificate', fileName: 'gst_certificate.pdf', fileSize: '1.2 MB', uploadDate: '15 Jan 2024', status: 'Verified', fileUrl: '#' },
    { id: 'd3', title: 'PAN Card', fileName: 'pan_card_wanderhorizons.pdf', fileSize: '850 KB', uploadDate: '10 Jan 2024', status: 'Verified', fileUrl: '#' },
    { id: 'd4', title: 'Travel Insurance Certificate', fileName: 'travel_insurance_policy.pdf', fileSize: '2.4 MB', uploadDate: '20 Feb 2024', status: 'Verified', fileUrl: '#' },
    { id: 'd5', title: 'Government Registration', fileName: 'tourism_registration_assam.pdf', fileSize: '3.1 MB', uploadDate: '05 Mar 2024', status: 'Verified', fileUrl: '#' },
  ],
  teamMemberCount: 8,
  performanceSnapshot: [
    { id: 'p1', title: 'Packages', value: '12', growth: '↑ 12%', isPositive: true, type: 'packages' },
    { id: 'p2', title: 'Active Trips', value: '8', growth: '↑ 8%', isPositive: true, type: 'trips' },
    { id: 'p3', title: 'Bookings', value: '186', growth: '↑ 15%', isPositive: true, type: 'bookings' },
    { id: 'p4', title: 'Revenue', value: '₹12.4L', growth: '↑ 18%', isPositive: true, type: 'revenue' },
    { id: 'p5', title: 'Travelers', value: '248', growth: '↑ 10%', isPositive: true, type: 'travelers' },
    { id: 'p6', title: 'Avg. Rating', value: '4.8', growth: '↑ 5%', isPositive: true, type: 'rating' },
  ],
  settings: {
    general: {
      agencyName: 'Wander Horizons',
      businessDescription: 'Premier eco-adventure tour operator specializing in Himalayan treks and Northeast India expeditions.',
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
      gstNumber: '18AABCW1234F1Z9',
      gstPercentage: 5,
      invoicePrefix: 'INV-WH-2024',
      settlementAccount: 'HDFC Bank ****1122',
      upiId: 'wanderhorizons@hdfcbank',
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
      emergencyContact: '+91 98765 99999',
      pickupInstructions: 'Report to designated airport or railway station terminal 30 minutes prior to departure.',
      termsAndConditions: 'All travelers must possess valid photo ID. Altitude sickness medication recommended for high treks.',
    },
    security: {
      twoFactorAuthStatus: 'Coming Soon',
      activeDevicesCount: 2,
      currentSessions: [
        { device: 'Chrome on Windows 11 (This Device)', ip: '103.24.12.89', location: 'Dibrugarh, India', lastActive: 'Active Now' },
        { device: 'Safari on iPhone 15 Pro', ip: '103.24.12.92', location: 'Guwahati, India', lastActive: '2 hours ago' },
      ],
    },
    integrations: [
      { id: 'gmaps', name: 'Google Maps API', category: 'Location & Maps', status: 'Connected', iconName: 'MapPin' },
      { id: 'whatsapp', name: 'WhatsApp Business API', category: 'Customer Messaging', status: 'Connected', iconName: 'MessageSquare' },
      { id: 'gcal', name: 'Google Calendar Sync', category: 'Schedule & Calendar', status: 'Connected', iconName: 'Calendar' },
      { id: 'email', name: 'Email Provider (SendGrid)', category: 'Email Dispatch', status: 'Connected', iconName: 'Mail' },
      { id: 'pg', name: 'Payment Gateway (Razorpay)', category: 'Payment Processing', status: 'Connected', iconName: 'CreditCard' },
    ],
    about: {
      version: 'v2.4.0-build.87',
      privacyPolicyUrl: 'https://apnatrip.in/privacy',
      termsUrl: 'https://apnatrip.in/terms',
      helpCenterUrl: 'https://apnatrip.in/help',
      supportContact: 'support@apnatrip.in',
    },
  },
};
