import { DESTINATIONS_DATA } from './destinations';
import { agenciesData } from './agencies';
import { packagesData } from './packages';
import { TRIPS_DATA, USER_BOOKINGS_DATA } from './trips';
import { INITIAL_CHATS } from './chats';
import { Agency } from '../types/agency';
import { TourPackage } from '../types/package';

export interface SearchResultItem {
  id: string;
  type: 'destination' | 'package' | 'agency' | 'booking' | 'trip' | 'message';
  title: string;
  subtitle: string;
  image: string;
  rating?: number;
  badge?: string;
  targetUrl: string;
  extraInfo?: string;
  rawPrice?: number;
}

export interface GroupedSearchResults {
  destinations: SearchResultItem[];
  packages: SearchResultItem[];
  agencies: SearchResultItem[];
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

export const getAllSearchableItems = (): SearchResultItem[] => {
  const destItems: SearchResultItem[] = DESTINATIONS_DATA.map((d) => ({
    id: d.id,
    type: 'destination',
    title: d.name,
    subtitle: `${d.state} • ${d.region}`,
    image: d.heroImage,
    rating: d.rating,
    badge: 'Destination',
    targetUrl: `/destination/${d.id}`,
    extraInfo: d.tagline,
    rawPrice: parsePrice(d.startingPrice),
  }));

  const agencyItems: SearchResultItem[] = agenciesData.map((a: Agency) => ({
    id: a.id,
    type: 'agency',
    title: a.name,
    subtitle: `${a.location} • ${a.yearsExperience}+ yrs exp`,
    image: a.logo,
    rating: a.rating,
    badge: a.isVerified ? 'Verified Agency' : 'Agency',
    targetUrl: `/agencies/${a.id}`,
    extraInfo: `${a.tripsCompleted} Trips`,
    rawPrice: parsePrice(a.startingPrice),
  }));

  const packageItems: SearchResultItem[] = packagesData.map((p: TourPackage) => ({
    id: p.id,
    type: 'package',
    title: p.title,
    subtitle: `${p.duration} • by ${p.agencyName}`,
    image: p.coverImage,
    rating: typeof p.rating === 'number' ? p.rating : parseFloat(p.rating),
    badge: p.price,
    targetUrl: `/package/${p.id}`,
    extraInfo: `From ${p.price}`,
    rawPrice: parsePrice(p.price),
  }));

  const bookingItems: SearchResultItem[] = USER_BOOKINGS_DATA.map((b) => ({
    id: b.id,
    type: 'booking',
    title: `Booking: ${b.packageName}`,
    subtitle: `Booking ID: ${b.id} • ${b.departureDate}`,
    image: b.coverImage,
    badge: b.bookingStatus,
    targetUrl: `/trips`,
    extraInfo: `₹${b.totalAmount.toLocaleString()} Paid`,
  }));

  const tripItems: SearchResultItem[] = TRIPS_DATA.map((t) => ({
    id: t.id,
    type: 'trip',
    title: `Trip: ${t.title}`,
    subtitle: `${t.locations} • Host: ${t.tripHost.name}`,
    image: t.coverImage,
    badge: t.status,
    targetUrl: `/trips/${t.id}`,
    extraInfo: `${t.duration}`,
  }));

  const messageItems: SearchResultItem[] = INITIAL_CHATS.map((c) => ({
    id: c.id,
    type: 'message',
    title: `Chat with ${c.agencyName}`,
    subtitle: c.lastMessage,
    image: c.agencyLogo,
    badge: `${c.unreadCount} Unread`,
    targetUrl: `/chat/${c.id}`,
    extraInfo: c.lastMessageTime,
  }));

  return [...destItems, ...agencyItems, ...packageItems, ...bookingItems, ...tripItems, ...messageItems];
};

export const searchItems = (
  query: string,
  filters: FilterState = DEFAULT_FILTER_STATE
): GroupedSearchResults => {
  const q = query.trim().toLowerCase();
  const allItems = getAllSearchableItems();

  let matched = allItems;

  if (q) {
    matched = matched.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        (item.extraInfo && item.extraInfo.toLowerCase().includes(q))
    );
  }

  if (filters.minBudget > 5000 || filters.maxBudget < 150000) {
    matched = matched.filter((item) => {
      if (!item.rawPrice) return true;
      return item.rawPrice >= filters.minBudget && item.rawPrice <= filters.maxBudget;
    });
  }

  if (filters.selectedDestinations.length > 0) {
    matched = matched.filter((item) =>
      filters.selectedDestinations.some(
        (dest) =>
          item.title.toLowerCase().includes(dest.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(dest.toLowerCase())
      )
    );
  }

  if (filters.minRating > 0) {
    matched = matched.filter((item) => (item.rating || 0) >= filters.minRating);
  }

  if (filters.verifiedOnly) {
    matched = matched.filter((item) => item.type !== 'agency' || item.badge?.includes('Verified'));
  }

  if (filters.sortBy === 'price_low') {
    matched.sort((a, b) => (a.rawPrice || 0) - (b.rawPrice || 0));
  } else if (filters.sortBy === 'price_high') {
    matched.sort((a, b) => (b.rawPrice || 0) - (a.rawPrice || 0));
  } else if (filters.sortBy === 'rating') {
    matched.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  const destinations = matched.filter((i) => i.type === 'destination');
  const packagesResults = matched.filter((i) => i.type === 'package');
  const agencies = matched.filter((i) => i.type === 'agency');
  const bookings = matched.filter((i) => i.type === 'booking');
  const trips = matched.filter((i) => i.type === 'trip');
  const messages = matched.filter((i) => i.type === 'message');

  return {
    destinations,
    packages: packagesResults,
    agencies,
    bookings,
    trips,
    messages,
    totalCount: matched.length,
  };
};
