// ─── Global Foundation: Pagination Utility ──────────────────────────────────

export interface PaginationState {
  page: number;
  pageSize: number;
}

export const paginateArray = <T>(
  items: T[],
  page: number,
  pageSize: number
): {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
} => {
  const total = items.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedItems = items.slice(startIndex, startIndex + pageSize);

  return {
    items: paginatedItems,
    total,
    page: currentPage,
    pageSize,
    totalPages,
    hasMore: currentPage < totalPages,
  };
};
