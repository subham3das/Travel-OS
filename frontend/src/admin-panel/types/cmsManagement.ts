// ─── Super Admin CMS & Content/Campaign Management Types ───────────────────────

export type CMSCategoryTab =
  | 'banners'
  | 'announcements'
  | 'destinations'
  | 'agencies'
  | 'trips'
  | 'campaigns'
  | 'popups'
  | 'sections'
  | 'seo';

export type ContentStatus = 'draft' | 'scheduled' | 'published' | 'expired' | 'active';

export interface HeroBannerItem {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  desktopImage: string;
  mobileImage: string;
  startDate: string;
  endDate: string;
  priority: number;
  isEnabled: boolean;
  status: ContentStatus;
}

export type AnnouncementType = 'info' | 'warning' | 'success' | 'critical';
export type AnnouncementAudience = 'all' | 'customers' | 'agencies' | 'logged_in';
export type AnnouncementLocation = 'homepage' | 'customer_dashboard' | 'agency_dashboard' | 'both';

export interface PlatformAnnouncementItem {
  id: string;
  title: string;
  description: string;
  type: AnnouncementType;
  audience: AnnouncementAudience;
  location: AnnouncementLocation;
  isPinned: boolean;
  isDismissible: boolean;
  requireAck: boolean;
  startDate: string;
  endDate: string;
  status: ContentStatus;
}

export interface TrendingDestinationItem {
  id: string;
  name: string;
  country: string;
  description: string;
  imageUrl: string;
  priority: number;
  isTrending: boolean;
  displayOrder: number;
  isEnabled: boolean;
}

export interface FeaturedAgencyItem {
  id: string;
  agencyName: string;
  agencyLogo: string;
  rating: number;
  isVerified: boolean;
  featuredUntil: string;
  priority: number;
  sortOrder: number;
  isEnabled: boolean;
}

export interface FeaturedTripItem {
  id: string;
  tripTitle: string;
  agencyName: string;
  bannerImage: string;
  discountBadge?: string;
  isTrending: boolean;
  isFeatured: boolean;
  priority: number;
  schedule: string;
  displayOrder: number;
  isEnabled: boolean;
}

export type CampaignApplicableTo = 'homepage' | 'agency' | 'customer' | 'both';

export interface PromotionalCampaignItem {
  id: string;
  title: string;
  description: string;
  bannerImage: string;
  ctaText: string;
  ctaLink: string;
  startDate: string;
  endDate: string;
  status: ContentStatus;
  priority: number;
  applicableTo: CampaignApplicableTo;
}

export type PopupAudience = 'all' | 'first_time' | 'registered' | 'agencies';
export type PopupFrequency = 'once_per_session' | 'always' | 'once_per_user';

export interface PromoPopupItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  hasCloseButton: boolean;
  delaySeconds: number;
  audience: PopupAudience;
  frequency: PopupFrequency;
  isEnabled: boolean;
}

export interface HomepageSectionItem {
  id: string;
  key: string;
  name: string;
  description: string;
  isEnabled: boolean;
  order: number;
}

export interface HomepageSEOData {
  title: string;
  description: string;
  ogImage: string;
  keywords: string;
}

export interface CMSKPIStats {
  publishedContent: { value: number; label: string; growth: string };
  activeCampaigns: { value: number; label: string; growth: string };
  liveAnnouncements: { value: number; label: string; growth: string };
  activeBanners: { value: number; label: string; growth: string };
  scheduledItems: { value: number; label: string; growth: string };
  mediaStorage: { value: string; label: string; growth: string };
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
