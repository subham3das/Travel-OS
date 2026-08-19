// ─── Super Admin Global Search Command Center Types ─────────────────────────

export type GlobalSearchCategory =
  | 'all'
  | 'users'
  | 'agencies'
  | 'bookings'
  | 'packages'
  | 'payments'
  | 'trips'
  | 'support'
  | 'reports'
  | 'cms'
  | 'settings'
  | 'reviews';

export interface GlobalSearchResultItem {
  id: string;
  category: GlobalSearchCategory;
  title: string;
  subtitle: string;
  details?: string;
  status?: string;
  statusColor?: 'emerald' | 'amber' | 'rose' | 'blue' | 'purple' | 'slate';
  amount?: string;
  avatar?: string;
  iconType?: string;
  targetRoute: string;
  actionLabel: string;
  keywords?: string[];
}

export interface QuickCommandItem {
  id: string;
  title: string;
  description: string;
  iconType:
    | 'agency'
    | 'package'
    | 'booking'
    | 'report'
    | 'backup'
    | 'settings'
    | 'audit'
    | 'support';
  targetRoute: string;
  actionType?: string;
}

export interface RecentSearchItem {
  id: string;
  query: string;
  timestamp: string;
  targetRoute?: string;
}
