// ─── Super Admin CMS (Content Management System) Types ────────────────────────

export interface CMSKPICardItem {
  id: string;
  title: string;
  value: string;
  growth: string;
  isPositive: boolean;
  comparison: string;
  iconType: 'pages' | 'draft' | 'scheduled' | 'banners' | 'media' | 'clock';
  sparklineColor: string;
}

export interface CMSKPIStats {
  publishedPages: CMSKPICardItem;
  draftContent: CMSKPICardItem;
  scheduledContent: CMSKPICardItem;
  activeBanners: CMSKPICardItem;
  totalMediaFiles: CMSKPICardItem;
  lastPublished: CMSKPICardItem;
}

export interface CMSContentTreeItem {
  id: string;
  label: string;
  iconType: 'home' | 'map' | 'package' | 'blog' | 'tag' | 'faq' | 'file' | 'footer' | 'seo' | 'media';
  count?: number;
  isFolder?: boolean;
  isOpen?: boolean;
  status: 'published' | 'draft' | 'scheduled';
  children?: CMSContentTreeItem[];
}

export interface CMSSectionItem {
  id: string;
  name: string;
  icon: string;
  isEnabled: boolean;
  isLocked?: boolean;
}

export interface CMSHeroBannerData {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  buttonStyle: 'Primary' | 'Secondary' | 'Outline';
  buttonColor: string;
  imageUrl: string;
  overlayOpacity?: number;
}

export interface CMSScheduledTimelineItem {
  id: string;
  date: string;
  time: string;
  title: string;
  type: 'Banner' | 'Section' | 'Blog' | 'Page';
  status: 'Scheduled' | 'Pending';
}

export interface CMSVersionHistoryItem {
  id: string;
  version: string;
  date: string;
  time: string;
  author: string;
  status?: 'Published' | 'Draft';
}

export interface CMSMediaUsageItem {
  category: string;
  count: number;
  percentage: number;
  color: string;
}

export interface CMSContentActivityItem {
  id: string;
  author: string;
  avatar: string;
  action: string;
  timeAgo: string;
}
