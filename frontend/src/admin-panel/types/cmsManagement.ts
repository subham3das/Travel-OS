// ─── Super Admin CMS & Content/Campaign Management Types ───────────────────────

export type CMSCategoryTab =
  | 'banners'
  | 'announcements'
  | 'discovery'
  | 'destinations'
  | 'agencies'
  | 'trips'
  | 'campaigns'
  | 'popups'
  | 'seo';

export type ContentStatus = 'draft' | 'scheduled' | 'published' | 'expired' | 'archived';
export type BannerTargetType = 'Package' | 'Agency' | 'Destination' | 'Car Rental' | 'External';

export interface BannerVersion {
  version: number;
  title: string;
  subtitle?: string;
  desktopImage: string;
  mobileImage?: string;
  targetType: BannerTargetType;
  targetId?: string;
  externalUrl?: string;
  ctaText?: string;
  savedBy: string;
  savedAt: string;
}

export interface HeroBannerItem {
  id: string;
  bannerId?: string;
  title: string;
  subtitle?: string;
  ctaText: string;
  targetType: BannerTargetType;
  targetId?: string;
  externalUrl?: string;
  desktopImage: string;
  mobileImage?: string;
  startDate?: string;
  endDate?: string;
  priority: number;
  isEnabled: boolean;
  status: ContentStatus;
  version?: number;
  versionHistory?: BannerVersion[];
}

export type AnnouncementType = 'info' | 'warning' | 'alert' | 'success';
export type AnnouncementTargetType = 'Package' | 'Agency' | 'Destination' | 'External' | 'None';
export type AnnouncementPlacement = 'all' | 'home_only' | 'mobile_only';

export interface PlatformAnnouncementItem {
  id: string;
  announcementId?: string;
  title: string;
  description?: string;
  type: AnnouncementType;
  bgColor?: string;
  textColor?: string;
  targetType?: AnnouncementTargetType;
  targetId?: string;
  linkUrl?: string;
  ctaText?: string;
  placement?: AnnouncementPlacement;
  isPinned?: boolean;
  isDismissible?: boolean;
  priority: number;
  startDate?: string;
  endDate?: string;
  status: ContentStatus;
  isEnabled: boolean;
}

export interface TrendingDestinationItem {
  id: string;
  name: string;
  destinationName?: string;
  country: string;
  region?: string;
  description?: string;
  imageUrl: string;
  priority: number;
  isTrending: boolean;
  isEnabled: boolean;
}

export interface FeaturedAgencyItem {
  id: string;
  agencyDocId?: string;
  agencyId: string;
  agencyName: string;
  agencyLogo?: string;
  rating?: number;
  isVerified?: boolean;
  featuredBadge?: string;
  featuredUntil?: string;
  priority: number;
  isEnabled: boolean;
}

export interface FeaturedTripItem {
  id: string;
  packageDocId?: string;
  packageId: string;
  tripTitle: string;
  agencyName?: string;
  bannerImage: string;
  price?: number;
  duration?: string;
  destination?: string;
  discountBadge?: string;
  priority: number;
  featuredUntil?: string;
  isEnabled: boolean;
}

export type CampaignType = 'Discount' | 'Festival' | 'Seasonal' | 'Referral';

export interface PromotionalCampaignItem {
  id: string;
  campaignId?: string;
  title: string;
  slug?: string;
  description?: string;
  campaignType: CampaignType;
  bannerImage: string;
  landingUrl?: string;
  couponId?: string;
  couponCode?: string;
  discountPercentage?: number;
  startDate?: string;
  endDate?: string;
  status: ContentStatus;
  priority: number;
  isEnabled: boolean;
}

export type PopupFrequency = 'once_per_session' | 'always_show' | 'once_per_user';
export type PopupMediaType = 'image' | 'video';

export interface PromoPopupItem {
  id: string;
  popupId?: string;
  title: string;
  description?: string;
  mediaType: PopupMediaType;
  imageUrl: string;
  mediaUrl?: string;
  buttonText: string;
  buttonLink?: string;
  targetType?: string;
  targetId?: string;
  hasCloseButton: boolean;
  delaySeconds: number;
  frequency: PopupFrequency;
  priority?: number;
  startDate?: string;
  endDate?: string;
  status?: ContentStatus;
  isEnabled: boolean;
}

export type CMSSEOPageKey =
  | 'home'
  | 'destination'
  | 'package'
  | 'agency'
  | 'car-rental'
  | 'about'
  | 'privacy'
  | 'terms'
  | 'contact';

export interface HomepageSEOData {
  pageKey?: CMSSEOPageKey;
  title: string;
  description: string;
  keywords: string[] | string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  robots?: string;
}

export interface CMSKPIStats {
  publishedBanners: { value: number; label: string; growth: string; subtitle: string };
  liveAnnouncements: { value: number; label: string; growth: string; subtitle: string };
  publishedCampaigns: { value: number; label: string; growth: string; subtitle: string };
  publishedPopups: { value: number; label: string; growth: string; subtitle: string };
  activeCoupons: { value: number; label: string; growth: string; subtitle: string };
  totalShowcases: { value: number; label: string; growth: string; subtitle: string };
}

export interface CMSScheduledItem {
  id: string;
  title: string;
  category: string;
  startDate: string;
  endDate: string;
  status: ContentStatus;
}

export interface CMSRecentChangeItem {
  id: string;
  adminName: string;
  adminAvatar: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface SearchDatabaseResult {
  packages: Array<{
    id: string;
    packageId: string;
    title: string;
    destination: string;
    price: number;
    imageUrl: string;
    agencyName: string;
  }>;
  agencies: Array<{
    id: string;
    agencyId: string;
    name: string;
    rating: number;
    logo: string;
    isVerified: boolean;
  }>;
  destinations: Array<{
    name: string;
    imageUrl: string;
  }>;
  coupons: Array<{
    id: string;
    code: string;
    discountText: string;
  }>;
}

export type CMSSelectionType = 'packages' | 'agencies' | 'destinations' | 'trips' | 'vehicles';

export interface CMSSelectItem {
  id: string;
  name: string;
  title?: string;
  packageId?: string;
  agencyId?: string;
  tripId?: string;
  agencyName?: string;
  ownerName?: string;
  destination?: string;
  destinationCountry?: string;
  category?: string;
  city?: string;
  country?: string;
  region?: string;
  duration?: string;
  price?: number;
  dailyPrice?: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  bookingsCount?: number;
  packageCount?: number;
  travelerCount?: number;
  capacity?: number;
  coverImage?: string;
  logo?: string;
  status?: string;
  isFeatured?: boolean;
  updatedAt?: string;
  createdAt?: string;
  departureDate?: string;
  raw?: any;
}

export interface CMSSelectResponse {
  items: CMSSelectItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}
