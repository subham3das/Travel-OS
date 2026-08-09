import { useState, useMemo } from 'react';
import { paginateArray } from '../utils/pagination';

export function usePagination<T>(items: T[], initialPageSize: number = 10) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const paginatedResult = useMemo(() => {
    return paginateArray(items, page, pageSize);
  }, [items, page, pageSize]);

  return {
    page: paginatedResult.page,
    pageSize,
    totalPages: paginatedResult.totalPages,
    total: paginatedResult.total,
    items: paginatedResult.items,
    hasMore: paginatedResult.hasMore,
    setPage,
    setPageSize,
    nextPage: () => setPage((p) => Math.min(p + 1, paginatedResult.totalPages)),
    prevPage: () => setPage((p) => Math.max(p - 1, 1)),
  };
}

export default usePagination;
