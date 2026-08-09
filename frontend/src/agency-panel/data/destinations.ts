// ─── Agency Package Wizard Destinations & Duration Mock Data ────────────────

export type TravelSeason = 'Spring' | 'Summer' | 'Monsoon' | 'Autumn' | 'Winter';

export type TravelMode = 'Flight' | 'Bus' | 'Train' | 'Private Vehicle' | 'Trek';

export const POPULAR_DESTINATIONS: string[] = [
  'Leh, Ladakh',
  'Manali, Himachal Pradesh',
  'Goa Beaches',
  'Munnar, Kerala',
  'Srinagar, Kashmir',
  'Interlaken, Switzerland',
  'Singapore City',
  'Jaipur, Rajasthan',
];

export const MOCK_COVERED_DESTINATIONS_SUGGESTIONS: string[] = [
  'Leh',
  'Nubra Valley',
  'Pangong Lake',
  'Khardung La',
  'Zanskar Valley',
  'Tso Moriri',
  'Diskit Monastery',
  'Magnetic Hill',
  'Sangam',
];

export const MOCK_CITIES: string[] = [
  'Leh',
  'Delhi',
  'Mumbai',
  'Manali',
  'Srinagar',
  'Kochi',
  'Bangalore',
  'Chandigarh',
];

export const TRAVEL_SEASONS_CONFIG: { season: TravelSeason; emoji: string }[] = [
  { season: 'Spring', emoji: '🌸' },
  { season: 'Summer', emoji: '☀️' },
  { season: 'Monsoon', emoji: '🌧️' },
  { season: 'Autumn', emoji: '🍁' },
  { season: 'Winter', emoji: '❄️' },
];

export const ALL_MONTHS: string[] = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const DURATION_PRESETS = [
  { label: '3 Days / 2 Nights', days: 3, nights: 2 },
  { label: '5 Days / 4 Nights', days: 5, nights: 4 },
  { label: '7 Days / 6 Nights', days: 7, nights: 6 },
  { label: 'Custom', days: 0, nights: 0 },
];
