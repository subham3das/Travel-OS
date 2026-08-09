// ─── Package Itinerary Builder Data Types ─────────────────────────────────────

export interface Activity {
  id: string;
  time: string;
  title: string;
}

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner';

export type StayType =
  | 'Hotel Grand Himalaya'
  | 'Hotel'
  | 'Homestay'
  | 'Camp'
  | 'Guest House'
  | 'Hostel';

export type TransportType =
  | 'Cab'
  | 'Tempo Traveller'
  | 'Bike'
  | 'Bus'
  | 'Flight'
  | 'Trek';

export interface ItineraryDay {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  activities: Activity[];
  meals: MealType[];
  stay: StayType | string;
  transportation: TransportType[];
  image?: string;
  notes?: string;
}

export interface Step4ItineraryInfo {
  days: ItineraryDay[];
  activeDayId: string;
}

export const MEAL_OPTIONS: MealType[] = ['Breakfast', 'Lunch', 'Dinner'];

export const STAY_OPTIONS: StayType[] = [
  'Hotel Grand Himalaya',
  'Hotel',
  'Homestay',
  'Camp',
  'Guest House',
  'Hostel',
];

export const TRANSPORT_OPTIONS: TransportType[] = [
  'Cab',
  'Tempo Traveller',
  'Bike',
  'Bus',
  'Flight',
  'Trek',
];

export const INITIAL_ITINERARY_DAYS: ItineraryDay[] = [
  {
    id: 'day-1',
    dayNumber: 1,
    title: 'Arrival in Leh',
    description:
      'Arrival at Leh Airport. Hotel check-in. Acclimatization. Evening market visit.',
    activities: [
      { id: 'act-1-1', time: '09:00', title: 'Airport Pickup' },
      { id: 'act-1-2', time: '11:30', title: 'Hotel Check-in' },
      { id: 'act-1-3', time: '13:00', title: 'Lunch' },
      { id: 'act-1-4', time: '17:00', title: 'Leh Market Walk' },
    ],
    meals: ['Breakfast', 'Lunch', 'Dinner'],
    stay: 'Hotel Grand Himalaya',
    transportation: ['Cab'],
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=400&q=80',
    notes: 'Carry warm clothes. Drink enough water.',
  },
  {
    id: 'day-2',
    dayNumber: 2,
    title: 'Leh Local Sightseeing',
    description:
      'Visit Shey Palace, Thiksey Monastery, and Hemis Monastery. Enjoy panoramic sunset views from Shanti Stupa.',
    activities: [
      { id: 'act-2-1', time: '09:00', title: 'Breakfast & Briefing' },
      { id: 'act-2-2', time: '10:30', title: 'Thiksey Monastery Visit' },
      { id: 'act-2-3', time: '14:00', title: 'Lunch at Local Cafe' },
      { id: 'act-2-4', time: '16:00', title: 'Shey Palace Exploration' },
    ],
    meals: ['Breakfast', 'Lunch'],
    stay: 'Hotel Grand Himalaya',
    transportation: ['Cab'],
    notes: 'Monastery entrance fees included in package.',
  },
  {
    id: 'day-3',
    dayNumber: 3,
    title: 'Nubra Valley Excursion',
    description:
      'Drive via Khardung La pass (17,582 ft) to Nubra Valley. Double-humped Camel ride at Hunder sand dunes.',
    activities: [
      { id: 'act-3-1', time: '08:00', title: 'Departure for Nubra' },
      { id: 'act-3-2', time: '12:00', title: 'Khardung La Pass Stop' },
      { id: 'act-3-3', time: '15:00', title: 'Hunder Sand Dunes' },
    ],
    meals: ['Breakfast', 'Dinner'],
    stay: 'Camp',
    transportation: ['Cab', 'Tempo Traveller'],
    notes: 'Keep oxygen cylinder ready in vehicle.',
  },
  {
    id: 'day-4',
    dayNumber: 4,
    title: 'Pangong Lake',
    description:
      'Drive to Pangong Tso lake via Shyok Valley. Overnight stay in lakeside luxury tents.',
    activities: [
      { id: 'act-4-1', time: '09:00', title: 'Drive to Pangong' },
      { id: 'act-4-2', time: '14:00', title: 'Check-in Campsite' },
      { id: 'act-4-3', time: '17:00', title: 'Pangong Lake Sunset Walk' },
    ],
    meals: ['Breakfast', 'Lunch', 'Dinner'],
    stay: 'Camp',
    transportation: ['Cab'],
    notes: 'Temperatures drop significantly at night.',
  },
];
