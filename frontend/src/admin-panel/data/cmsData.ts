import {
  CMSKPIStats,
  CMSContentTreeItem,
  CMSSectionItem,
  CMSHeroBannerData,
  CMSScheduledTimelineItem,
  CMSVersionHistoryItem,
  CMSMediaUsageItem,
  CMSContentActivityItem,
} from '../types/cmsManagement';

export const initialCMSKPIStats: CMSKPIStats = {
  publishedPages: {
    id: 'publishedPages',
    title: 'Published Pages',
    value: '156',
    growth: '12.5%',
    isPositive: true,
    comparison: 'vs last 30 days',
    iconType: 'pages',
    sparklineColor: '#6356E5',
  },
  draftContent: {
    id: 'draftContent',
    title: 'Draft Content',
    value: '28',
    growth: '4.6%',
    isPositive: true,
    comparison: 'vs last 30 days',
    iconType: 'draft',
    sparklineColor: '#F97316',
  },
  scheduledContent: {
    id: 'scheduledContent',
    title: 'Scheduled Content',
    value: '14',
    growth: '8.2%',
    isPositive: true,
    comparison: 'vs last 30 days',
    iconType: 'scheduled',
    sparklineColor: '#3B82F6',
  },
  activeBanners: {
    id: 'activeBanners',
    title: 'Active Banners',
    value: '32',
    growth: '15.3%',
    isPositive: true,
    comparison: 'vs last 30 days',
    iconType: 'banners',
    sparklineColor: '#10B981',
  },
  totalMediaFiles: {
    id: 'totalMediaFiles',
    title: 'Total Media Files',
    value: '2,845',
    growth: '10.1%',
    isPositive: true,
    comparison: 'vs last 30 days',
    iconType: 'media',
    sparklineColor: '#8B5CF6',
  },
  lastPublished: {
    id: 'lastPublished',
    title: 'Last Published',
    value: '2 mins ago',
    growth: 'By Neha Sharma',
    isPositive: true,
    comparison: 'By Neha Sharma',
    iconType: 'clock',
    sparklineColor: '#F97316',
  },
};

export const initialContentTree: CMSContentTreeItem[] = [
  {
    id: 'homepage',
    label: 'Homepage',
    iconType: 'home',
    count: 12,
    isFolder: true,
    isOpen: true,
    status: 'published',
    children: [
      { id: 'home-hero', label: 'Hero Banners', iconType: 'file', count: 6, status: 'published' },
      { id: 'home-sections', label: 'Featured Sections', iconType: 'file', count: 8, status: 'published' },
    ],
  },
  {
    id: 'destinations',
    label: 'Destinations',
    iconType: 'map',
    count: 24,
    isFolder: true,
    isOpen: false,
    status: 'published',
    children: [
      { id: 'dest-featured', label: 'Featured Destinations', iconType: 'file', count: 12, status: 'published' },
      { id: 'dest-categories', label: 'Regional Collections', iconType: 'file', count: 12, status: 'published' },
    ],
  },
  {
    id: 'packages',
    label: 'Packages',
    iconType: 'package',
    count: 18,
    isFolder: true,
    isOpen: false,
    status: 'published',
    children: [
      { id: 'pkg-curated', label: 'Curated Deals', iconType: 'file', count: 10, status: 'published' },
      { id: 'pkg-seasonal', label: 'Seasonal Packages', iconType: 'file', count: 8, status: 'published' },
    ],
  },
  {
    id: 'blogs',
    label: 'Blogs & Articles',
    iconType: 'blog',
    count: 56,
    isFolder: true,
    isOpen: false,
    status: 'published',
    children: [
      { id: 'blog-travel-guides', label: 'Travel Guides', iconType: 'file', count: 32, status: 'published' },
      { id: 'blog-insider-tips', label: 'Insider Tips', iconType: 'file', count: 24, status: 'published' },
    ],
  },
  {
    id: 'promotions',
    label: 'Promotions',
    iconType: 'tag',
    count: 15,
    isFolder: true,
    isOpen: false,
    status: 'published',
  },
  {
    id: 'faqs',
    label: 'FAQs',
    iconType: 'faq',
    count: 22,
    isFolder: true,
    isOpen: false,
    status: 'published',
  },
  {
    id: 'policies',
    label: 'Policies & Pages',
    iconType: 'file',
    count: 8,
    isFolder: true,
    isOpen: true,
    status: 'published',
    children: [
      { id: 'policy-terms', label: 'Terms & Conditions', iconType: 'file', status: 'published' },
      { id: 'policy-privacy', label: 'Privacy Policy', iconType: 'file', status: 'published' },
      { id: 'policy-cancellation', label: 'Cancellation Policy', iconType: 'file', status: 'published' },
    ],
  },
  {
    id: 'footer',
    label: 'Footer Content',
    iconType: 'footer',
    count: 6,
    status: 'published',
  },
  {
    id: 'seo',
    label: 'SEO & Metadata',
    iconType: 'seo',
    count: 14,
    status: 'published',
  },
  {
    id: 'media',
    label: 'Media Library',
    iconType: 'media',
    count: 2845,
    status: 'published',
  },
];

export const initialHeroBanner: CMSHeroBannerData = {
  title: 'Explore the World with Travel OS 🌍',
  subtitle: 'Discover amazing destinations at unbeatable prices',
  ctaText: 'Explore Packages',
  ctaLink: '/packages',
  buttonStyle: 'Primary',
  buttonColor: '#6356E5',
  imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
};

export const initialCMSSections: CMSSectionItem[] = [
  { id: 'hero', name: 'Hero Banner', icon: 'Sparkles', isEnabled: true, isLocked: true },
  { id: 'search', name: 'Search Section', icon: 'Search', isEnabled: true },
  { id: 'destinations', name: 'Featured Destinations', icon: 'MapPin', isEnabled: true },
  { id: 'packages', name: 'Popular Packages', icon: 'Package', isEnabled: true },
  { id: 'why-us', name: 'Why Travel OS', icon: 'ShieldCheck', isEnabled: true },
  { id: 'categories', name: 'Top Categories', icon: 'Grid', isEnabled: true },
  { id: 'offers', name: 'Offers & Deals', icon: 'Tag', isEnabled: true },
  { id: 'testimonials', name: 'Testimonials', icon: 'MessageSquare', isEnabled: true },
  { id: 'blog', name: 'Blog Section', icon: 'FileText', isEnabled: true },
  { id: 'newsletter', name: 'Newsletter', icon: 'Mail', isEnabled: true },
];

export const initialScheduledTimeline: CMSScheduledTimelineItem[] = [
  { id: 'sch-1', date: 'May 15, 2024', time: '10:00 AM', title: 'Summer Sale Banner', type: 'Banner', status: 'Scheduled' },
  { id: 'sch-2', date: 'May 16, 2024', time: '09:00 AM', title: 'New Destination Section', type: 'Section', status: 'Scheduled' },
  { id: 'sch-3', date: 'May 18, 2024', time: '08:00 AM', title: 'Weekend Offer Banner', type: 'Banner', status: 'Scheduled' },
  { id: 'sch-4', date: 'May 20, 2024', time: '10:00 AM', title: 'Blog: Travel Tips', type: 'Blog', status: 'Scheduled' },
];

export const initialContentActivity: CMSContentActivityItem[] = [
  {
    id: 'act-1',
    author: 'Neha Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop',
    action: 'Updated hero banner image',
    timeAgo: '2 mins ago',
  },
  {
    id: 'act-2',
    author: 'Arjun Mehta',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop',
    action: 'Published new blog: 10 Places to Visit',
    timeAgo: '15 mins ago',
  },
  {
    id: 'act-3',
    author: 'Rajat Verma',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120&auto=format&fit=crop',
    action: 'Added new destination: Georgia',
    timeAgo: '45 mins ago',
  },
  {
    id: 'act-4',
    author: 'Pooja Nair',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop',
    action: 'Updated footer content',
    timeAgo: '1 hour ago',
  },
];

export const initialVersionHistory: CMSVersionHistoryItem[] = [
  { id: 'v12.4', version: 'Version 12.4', date: 'May 12, 2024', time: '10:30 AM', author: 'Neha Sharma', status: 'Published' },
  { id: 'v12.3', version: 'Version 12.3', date: 'May 11, 2024', time: '04:15 PM', author: 'Arjun Mehta' },
  { id: 'v12.2', version: 'Version 12.2', date: 'May 10, 2024', time: '11:20 AM', author: 'Rajat Verma' },
  { id: 'v12.1', version: 'Version 12.1', date: 'May 09, 2024', time: '09:45 AM', author: 'Neha Sharma' },
];

export const initialMediaUsage: CMSMediaUsageItem[] = [
  { category: 'Images', count: 1932, percentage: 67.9, color: '#6356E5' },
  { category: 'Videos', count: 456, percentage: 16.0, color: '#10B981' },
  { category: 'Documents', count: 245, percentage: 8.6, color: '#F97316' },
  { category: 'Icons', count: 134, percentage: 4.7, color: '#06B6D4' },
  { category: 'Others', count: 78, percentage: 2.8, color: '#94A3B8' },
];
