import { useState, useEffect } from 'react';
import { GroupedSearchResults, FilterState, DEFAULT_FILTER_STATE } from '../data/search';
import { marketplaceService } from '../services/marketplace.service';

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
    let isMounted = true;
    setLoading(true);

    marketplaceService
      .search(debouncedQuery, filters)
      .then((res) => {
        if (isMounted) {
          setResults(res);
        }
      })
      .catch((err) => {
        console.warn('Search API failed:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
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
