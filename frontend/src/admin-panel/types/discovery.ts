export type OverrideTargetType = 'PACKAGE' | 'AGENCY';

export type OverrideBadgeOption =
  | 'Normal'
  | 'Trending'
  | 'Popular'
  | 'Featured'
  | 'Most Popular'
  | "Editor's Pick"
  | 'Hidden Gem'
  | 'Premium'
  | 'Festival Featured'
  | 'Homepage Hero'
  | 'Explore Hero'
  | 'Recommended'
  | 'Premium Partner'
  | "Editor's Choice";

export interface AdminDiscoveryOverride {
  _id: string;
  targetType: OverrideTargetType;
  targetId: string;
  sectionId: string;
  overrideBadge: string;
  priority: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  notes?: string;
  createdAdmin?: string;
  targetDetails?: {
    title?: string;
    name?: string;
    destination?: string;
    price?: number;
    coverImage?: string;
    rating?: number;
    logo?: string;
    companyName?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AdminSectionConfig {
  _id: string;
  sectionId: string;
  title: string;
  subtitle: string;
  emoji?: string;
  type: 'package' | 'agency' | 'destination' | 'car_rental';
  isEnabled: boolean;
  showOnHome: boolean;
  showOnExplore: boolean;
  order: number;
  minItems: number;
  maxItems: number;
  rankingRule?: string;
  categoryFilter?: string;
  impressions?: number;
  clicks?: number;
}
