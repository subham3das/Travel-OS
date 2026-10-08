import { TravelPackage } from '../components/home/PackageCard';
import { TravelAgency } from '../components/explore/AgencyCard';

export type DiscoverySectionType = 'package' | 'agency' | 'destination' | 'car_rental';

export interface DiscoveryDestinationItem {
  id: string;
  name: string;
  country: string;
  region?: string;
  description?: string;
  imageUrl: string;
  rating?: number;
  reviewsCount?: number;
}

export interface DiscoveryCarItem {
  id: string;
  _id: string;
  name: string;
  type: string;
  category: string;
  city: string;
  price: string;
  numericPrice: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  specs: {
    seats: number;
    fuel: string;
    transmission: string;
  };
  isVerified: boolean;
  agencyName: string;
}

export interface DiscoverySection {
  id: string;
  sectionId: string;
  title: string;
  subtitle: string;
  emoji?: string;
  type: DiscoverySectionType;
  order: number;
  totalCount: number;
  hasMore: boolean;
  viewAllLink?: string;
  items: any[];
}

export interface ExploreFeedResponse {
  sections: DiscoverySection[];
  categories: string[];
  adventureTypes?: string[];
}

export interface HomepageFeedResponse {
  heroBanners: {
    id: string;
    _id: string;
    title: string;
    subtitle?: string;
    ctaText: string;
    desktopImage: string;
    mobileImage?: string;
    targetType?: string;
    targetId?: string;
    externalUrl?: string;
    priority?: number;
  }[];
  announcements: {
    id: string;
    _id: string;
    message: string;
    linkText?: string;
    linkUrl?: string;
    bgColor?: string;
    textColor?: string;
    isPinned?: boolean;
  }[];
  popup?: {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    ctaText?: string;
    ctaUrl?: string;
    frequency?: string;
    delaySeconds?: number;
  };
  seo?: {
    title: string;
    description: string;
    keywords?: string;
    ogImage?: string;
  };
  sections: DiscoverySection[];
}
