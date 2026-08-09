// ─── Global Foundation: Filtering Utility ────────────────────────────────────

export interface GenericFilterState {
  searchQuery: string;
  status: string;
  startDate?: string;
  endDate?: string;
  minPrice?: number;
  maxPrice?: number;
  role?: string;
  rating?: number;
}

export const filterArray = <T>(
  items: T[],
  filters: GenericFilterState,
  searchFields: (keyof T)[] = ['name' as keyof T, 'title' as keyof T, 'id' as keyof T]
): T[] => {
  return items.filter((item) => {
    // Search Query Match
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchesSearch = searchFields.some((field) => {
        const val = item[field];
        return val !== undefined && val !== null && String(val).toLowerCase().includes(q);
      });
      if (!matchesSearch) return false;
    }

    // Status Match
    if (filters.status && filters.status !== 'All') {
      const itemStatus = (item as any).status || (item as any).tripStatus || (item as any).loyaltyBadge;
      if (itemStatus && String(itemStatus).toLowerCase() !== filters.status.toLowerCase()) {
        return false;
      }
    }

    return true;
  });
};
