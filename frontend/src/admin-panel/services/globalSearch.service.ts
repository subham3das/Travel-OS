import {
  GlobalSearchResultItem,
  GlobalSearchCategory,
  QuickCommandItem,
  RecentSearchItem,
} from '../types/globalSearch';
import {
  indexedGlobalSearchResults,
  initialQuickCommands,
  initialRecentSearches,
} from '../data/globalSearchData';

const RECENT_SEARCHES_STORAGE_KEY = 'apnatrip_admin_recent_searches';

class GlobalSearchService {
  private indexedData: GlobalSearchResultItem[] = indexedGlobalSearchResults;
  private quickCommands: QuickCommandItem[] = initialQuickCommands;

  public search(
    query: string,
    category: GlobalSearchCategory = 'all'
  ): Promise<GlobalSearchResultItem[]> {
    return new Promise((resolve) => {
      const cleanQuery = query.trim().toLowerCase();

      // If query is empty, return default top recommendations
      if (!cleanQuery) {
        const filtered =
          category === 'all'
            ? this.indexedData.slice(0, 10)
            : this.indexedData.filter((item) => item.category === category);
        return setTimeout(() => resolve(filtered), 20);
      }

      // Multi-term fuzzy matching
      const queryTokens = cleanQuery.split(/\s+/).filter(Boolean);

      const results = this.indexedData.filter((item) => {
        // Category check
        if (category !== 'all' && item.category !== category) {
          return false;
        }

        const searchableText = [
          item.title,
          item.subtitle,
          item.details || '',
          item.amount || '',
          item.status || '',
          ...(item.keywords || []),
        ]
          .join(' ')
          .toLowerCase();

        // Must match all query tokens
        return queryTokens.every((token) => searchableText.includes(token));
      });

      setTimeout(() => resolve(results), 40);
    });
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
