import { useState } from 'react';
import { GenericFilterState, filterArray } from '../utils/filters';

export function useFilters<T>(
  items: T[],
  initialFilters: GenericFilterState = { searchQuery: '', status: 'All' },
  searchFields: (keyof T)[] = ['name' as keyof T, 'title' as keyof T]
) {
  const [filters, setFilters] = useState<GenericFilterState>(initialFilters);

  const filteredItems = filterArray(items, filters, searchFields);

  const updateFilter = (key: keyof GenericFilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return {
    filters,
    filteredItems,
    setFilters,
    updateFilter,
    resetFilters,
  };
}

export default useFilters;
