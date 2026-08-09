import { useState, useEffect } from 'react';
import { searchItems, GroupedSearchResults, FilterState, DEFAULT_FILTER_STATE } from '../data/search';

export const useSearch = (initialQuery: string = '', initialFilters: FilterState = DEFAULT_FILTER_STATE) => {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GroupedSearchResults>({
    destinations: [],
    packages: [],
    agencies: [],
    bookings: [],
    trips: [],
    messages: [],
    totalCount: 0,
  });

  // 300ms debounce for text query
  useEffect(() => {
    setLoading(true);
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    const res = searchItems(debouncedQuery, filters);
    setResults(res);
    setLoading(false);
  }, [debouncedQuery, filters]);

  return {
    query,
    setQuery,
    filters,
    setFilters,
    results,
    loading,
  };
};
