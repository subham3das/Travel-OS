// ─── Global Foundation: Sorting Utility ──────────────────────────────────────

export type SortOption =
  | 'Newest'
  | 'Oldest'
  | 'Highest Rating'
  | 'Lowest Rating'
  | 'Highest Revenue'
  | 'Alphabetical';

export const sortArray = <T>(
  items: T[],
  sortBy: SortOption,
  dateField: keyof T = 'createdAt' as keyof T,
  titleField: keyof T = 'name' as keyof T,
  ratingField: keyof T = 'rating' as keyof T,
  revenueField: keyof T = 'revenue' as keyof T
): T[] => {
  const sorted = [...items];

  switch (sortBy) {
    case 'Newest':
      return sorted.sort((a, b) => {
        const dA = new Date(String(a[dateField] || '')).getTime();
        const dB = new Date(String(b[dateField] || '')).getTime();
        return dB - dA;
      });

    case 'Oldest':
      return sorted.sort((a, b) => {
        const dA = new Date(String(a[dateField] || '')).getTime();
        const dB = new Date(String(b[dateField] || '')).getTime();
        return dA - dB;
      });

    case 'Highest Rating':
      return sorted.sort((a, b) => (Number(b[ratingField]) || 0) - (Number(a[ratingField]) || 0));

    case 'Lowest Rating':
      return sorted.sort((a, b) => (Number(a[ratingField]) || 0) - (Number(b[ratingField]) || 0));

    case 'Highest Revenue':
      return sorted.sort((a, b) => (Number(b[revenueField]) || 0) - (Number(a[revenueField]) || 0));

    case 'Alphabetical':
      return sorted.sort((a, b) => String(a[titleField] || '').localeCompare(String(b[titleField] || '')));

    default:
      return sorted;
  }
};
