import {
  GlobalSearchResultItem,
  GlobalSearchCategory,
  QuickCommandItem,
  RecentSearchItem,
} from '../types/globalSearch';
import { adminApiClient } from './adminApiClient';

export const initialQuickCommands: QuickCommandItem[] = [
  {
    id: 'cmd-agency',
    title: 'Create Agency',
    description: 'Add a new travel agency',
    iconType: 'agency',
    targetRoute: '/admin/agencies',
    actionType: 'create_agency',
  },
  {
    id: 'cmd-package',
    title: 'New Package',
    description: 'Create a new tour package',
    iconType: 'package',
    targetRoute: '/admin/packages',
    actionType: 'create_package',
  },
  {
    id: 'cmd-booking',
    title: 'New Booking',
    description: 'Create a new booking',
    iconType: 'booking',
    targetRoute: '/admin/bookings',
    actionType: 'create_booking',
  },
  {
    id: 'cmd-report',
    title: 'Create Report',
    description: 'Generate a new report',
    iconType: 'report',
    targetRoute: '/admin/reports',
    actionType: 'create_report',
  },
  {
    id: 'cmd-backup',
    title: 'Backup Now',
    description: 'Create a platform backup',
    iconType: 'backup',
    targetRoute: '/admin/settings',
    actionType: 'trigger_backup',
  },
  {
    id: 'cmd-settings',
    title: 'Platform Settings',
    description: 'Open platform settings',
    iconType: 'settings',
    targetRoute: '/admin/settings',
  },
  {
    id: 'cmd-audit',
    title: 'Audit Logs',
    description: 'View recent audit logs',
    iconType: 'audit',
    targetRoute: '/admin/audit-logs',
  },
  {
    id: 'cmd-support',
    title: 'Support Tickets',
    description: 'View all support tickets',
    iconType: 'support',
    targetRoute: '/admin/support',
  },
];

export const initialRecentSearches: RecentSearchItem[] = [
  { id: 'rec-1', query: 'Wanderlust Holidays', timestamp: '10 mins ago', targetRoute: '/admin/agencies' },
  { id: 'rec-2', query: 'Booking BK-78452', timestamp: '25 mins ago', targetRoute: '/admin/bookings' },
  { id: 'rec-3', query: 'Refund Requests', timestamp: '1 hour ago', targetRoute: '/admin/finance' },
];

export const indexedGlobalSearchResults: GlobalSearchResultItem[] = [];

const RECENT_SEARCHES_STORAGE_KEY = 'apnatrip_admin_recent_searches';

class GlobalSearchService {
  private quickCommands: QuickCommandItem[] = initialQuickCommands;

  public async search(
    query: string,
    category: GlobalSearchCategory = 'all'
  ): Promise<GlobalSearchResultItem[]> {
    const cleanQuery = query.trim();
    if (!cleanQuery) {
      return [];
    }

    try {
      const response = await adminApiClient.get<GlobalSearchResultItem[]>('/global-search', {
        params: { q: cleanQuery },
      });
      if (response.success && response.data) {
        let results = response.data;
        if (category !== 'all') {
          results = results.filter((r) => r.category === category);
        }
        return results;
      }
      return [];
    } catch {
      return [];
    }
  }

  public getQuickCommands(): QuickCommandItem[] {
    return this.quickCommands;
  }

  public getRecentSearches(): RecentSearchItem[] {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return initialRecentSearches;
  }

  public addRecentSearch(query: string, targetRoute?: string): void {
    if (!query.trim()) return;
    const current = this.getRecentSearches();
    const existingFiltered = current.filter(
      (item) => item.query.toLowerCase() !== query.toLowerCase().trim()
    );
    const updated: RecentSearchItem[] = [
      {
        id: `rec-${Date.now()}`,
        query: query.trim(),
        timestamp: 'Just now',
        targetRoute,
      },
      ...existingFiltered,
    ].slice(0, 8);

    try {
      localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  public removeRecentSearch(id: string): RecentSearchItem[] {
    const current = this.getRecentSearches().filter((item) => item.id !== id);
    try {
      localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(current));
    } catch {
      // ignore
    }
    return current;
  }

  public clearAllRecentSearches(): void {
    try {
      localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify([]));
    } catch {
      // ignore
    }
  }
}

export const globalSearchService = new GlobalSearchService();
