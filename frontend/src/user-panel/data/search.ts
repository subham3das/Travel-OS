export interface SearchResultItem {
  id: string;
  type: 'destination' | 'package' | 'agency' | 'car' | 'traveler' | 'booking' | 'trip' | 'message';
  title: string;
  subtitle: string;
  image: string;
  imageUrl?: string;
  route: string;
  targetUrl: string;
  slug?: string;
  rating?: number;
  badge?: string;
  extraInfo?: string;
  rawPrice?: number;
  metadata?: Record<string, any>;
}

export interface GroupedSearchResults {
  destinations: SearchResultItem[];
  packages: SearchResultItem[];
  agencies: SearchResultItem[];
  cars: SearchResultItem[];
  travelers: SearchResultItem[];
  bookings: SearchResultItem[];
  trips: SearchResultItem[];
  messages: SearchResultItem[];
  totalCount: number;
}

export interface FilterState {
  minBudget: number;
  maxBudget: number;
  selectedDestinations: string[];
  selectedDurations: string[];
  selectedTravelTypes: string[];
  selectedAdventureTypes?: string[];
  adventureType?: string;
  minRating: number;
  verifiedOnly: boolean;
  selectedMonths: string[];
  sortBy: 'popularity' | 'price_low' | 'price_high' | 'rating' | 'newest';
}

export const DEFAULT_FILTER_STATE: FilterState = {
  minBudget: 5000,
  maxBudget: 150000,
  selectedDestinations: [],
  selectedDurations: [],
  selectedTravelTypes: [],
  selectedAdventureTypes: [],
  adventureType: undefined,
  minRating: 0,
  verifiedOnly: false,
  selectedMonths: [],
  sortBy: 'popularity',
};

export const isFilterActive = (filters: FilterState): boolean => {
  return (
    filters.minBudget > 5000 ||
    filters.maxBudget < 150000 ||
    filters.selectedDestinations.length > 0 ||
    filters.selectedDurations.length > 0 ||
    filters.selectedTravelTypes.length > 0 ||
    (filters.selectedAdventureTypes && filters.selectedAdventureTypes.length > 0) ||
    Boolean(filters.adventureType) ||
    filters.minRating > 0 ||
    filters.verifiedOnly ||
    filters.selectedMonths.length > 0 ||
    filters.sortBy !== 'popularity'
  );
};

export const parsePrice = (priceStr?: string): number => {
  if (!priceStr) return 0;
  const cleaned = priceStr.replace(/[^0-9]/g, '');
  return parseInt(cleaned, 10) || 0;
};
