import { useState } from 'react';
import { SortOption, sortArray } from '../utils/sorting';

export function useSorting<T>(
  items: T[],
  initialSort: SortOption = 'Newest',
  dateField: keyof T = 'createdAt' as keyof T,
  titleField: keyof T = 'name' as keyof T
) {
  const [sortBy, setSortBy] = useState<SortOption>(initialSort);

  const sortedItems = sortArray(items, sortBy, dateField, titleField);

  return {
    sortBy,
    setSortBy,
    sortedItems,
  };
}

export default useSorting;
