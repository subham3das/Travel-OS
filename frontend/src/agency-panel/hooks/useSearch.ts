import { useState, useCallback } from 'react';
import { useDebounce } from './useDebounce';

export function useSearch(initialQuery: string = '', delayMs: number = 300) {
  const [query, setQuery] = useState(initialQuery);
  const [history, setHistory] = useState<string[]>([]);
  const debouncedQuery = useDebounce(query, delayMs);

  const handleClear = useCallback(() => {
    setQuery('');
  }, []);

  const addHistory = useCallback((term: string) => {
    if (!term.trim()) return;
    setHistory((prev) => Array.from(new Set([term.trim(), ...prev])).slice(0, 5));
  }, []);

  return {
    query,
    debouncedQuery,
    setQuery,
    clearSearch: handleClear,
    history,
    addHistory,
  };
}

export default useSearch;
