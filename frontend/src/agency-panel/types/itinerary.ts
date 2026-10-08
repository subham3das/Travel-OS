// ─── Package Itinerary Builder Data Types ─────────────────────────────────────

export interface ItineraryPlanItem {
  id: string;
  text: string;
  icon?: string;
  notes?: string;
}

// Backward-compatibility alias for legacy components
export interface Activity {
  id: string;
  time?: string;
  title: string;
}

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner';
export type StayType = string;
export type TransportType = string;

export interface ItineraryDay {
  id: string;
  dayNumber: number;
  title: string;
  description?: string;
  plans: ItineraryPlanItem[];
  // Legacy / optional fields for non-breaking compatibility
  activities?: Activity[];
  meals?: MealType[];
  stay?: StayType;
  transportation?: TransportType[];
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

/**
 * Normalizes any legacy or incoming itinerary array to ensure every day
 * has clean, time-stripped plans: ItineraryPlanItem[].
 */
export function normalizeItineraryDays(rawDays: any[]): ItineraryDay[] {
  if (!Array.isArray(rawDays) || rawDays.length === 0) {
    return INITIAL_ITINERARY_DAYS;
  }

  return rawDays.map((d, index) => {
    const dayNum = d.dayNumber || d.day || index + 1;
    let plans: ItineraryPlanItem[] = [];

    if (Array.isArray(d.plans) && d.plans.length > 0) {
      plans = d.plans.map((p: any, pIdx: number) => {
        const rawText = typeof p === 'string' ? p : p?.text || '';
        const cleanText = rawText.replace(/^\d{1,2}:\d{2}\s*[-–—]?\s*/, '').trim();
        return {
          id: p?.id || `plan-${dayNum}-${pIdx + 1}`,
          text: cleanText || 'Planned Activity',
          icon: p?.icon || '',
          notes: p?.notes || '',
        };
      });
    } else if (Array.isArray(d.activities) && d.activities.length > 0) {
      plans = d.activities.map((a: any, aIdx: number) => {
        const rawText = typeof a === 'string' ? a : a?.title || a?.text || a?.name || '';
        const cleanText = rawText.replace(/^\d{1,2}:\d{2}\s*[-–—]?\s*/, '').trim();
        return {
          id: a?.id || `plan-${dayNum}-${aIdx + 1}`,
          text: cleanText || 'Planned Activity',
        };
      });
    } else {
      plans = [
        { id: `plan-${dayNum}-1`, text: 'Morning Sightseeing' },
        { id: `plan-${dayNum}-2`, text: 'Afternoon Exploration' },
      ];
    }

    return {
      id: d.id || `day-${dayNum}`,
      dayNumber: dayNum,
      title: d.title || `Day ${dayNum}`,
      description: d.description || '',
      plans,
      activities: plans.map((p) => ({ id: p.id, title: p.text })),
      meals: d.meals || [],
      stay: d.stay || 'Hotel',
      transportation: d.transportation || ['Cab'],
      image: d.image || '',
      notes: d.notes || '',
    };
  });
}

export const INITIAL_ITINERARY_DAYS: ItineraryDay[] = [
  {
    id: 'day-1',
    dayNumber: 1,
    title: 'Arrival in Leh',
    description: 'Arrival at Leh Airport, hotel check-in and acclimatization.',
    plans: [
      { id: 'plan-1-1', text: 'Airport pickup' },
      { id: 'plan-1-2', text: 'Hotel check-in' },
      { id: 'plan-1-3', text: 'Rest & acclimatization' },
      { id: 'plan-1-4', text: 'Local market visit' },
    ],
    activities: [
      { id: 'act-1-1', title: 'Airport pickup' },
      { id: 'act-1-2', title: 'Hotel check-in' },
      { id: 'act-1-3', title: 'Rest & acclimatization' },
      { id: 'act-1-4', title: 'Local market visit' },
    ],
    stay: 'Hotel Grand Himalaya',
    meals: ['Breakfast', 'Dinner'],
    transportation: ['Cab'],
  },
  {
    id: 'day-2',
    dayNumber: 2,
    title: 'Nubra Valley',
    description: 'Drive across the world-famous pass to the high altitude desert dunes.',
    plans: [
      { id: 'plan-2-1', text: 'Breakfast' },
      { id: 'plan-2-2', text: 'Khardung La Pass' },
      { id: 'plan-2-3', text: 'Diskit Monastery' },
      { id: 'plan-2-4', text: 'Hunder Sand Dunes' },
      { id: 'plan-2-5', text: 'Camp Stay' },
    ],
    activities: [
      { id: 'act-2-1', title: 'Breakfast' },
      { id: 'act-2-2', title: 'Khardung La Pass' },
      { id: 'act-2-3', title: 'Diskit Monastery' },
      { id: 'act-2-4', title: 'Hunder Sand Dunes' },
      { id: 'act-2-5', title: 'Camp Stay' },
    ],
    stay: 'Camp',
    meals: ['Breakfast', 'Dinner'],
    transportation: ['Cab'],
  },
  {
    id: 'day-3',
    dayNumber: 3,
    title: 'Pangong Tso Lake',
    description: 'Drive along Shyok Valley towards the surreal blue waters of Pangong.',
    plans: [
      { id: 'plan-3-1', text: 'Morning departure via Shyok River' },
      { id: 'plan-3-2', text: 'Scenic photography viewpoints' },
      { id: 'plan-3-3', text: 'Pangong Lake exploration' },
      { id: 'plan-3-4', text: 'Lakeside Camp Check-in & Stargazing' },
    ],
    activities: [
      { id: 'act-3-1', title: 'Morning departure via Shyok River' },
      { id: 'act-3-2', title: 'Scenic photography viewpoints' },
      { id: 'act-3-3', title: 'Pangong Lake exploration' },
      { id: 'act-3-4', title: 'Lakeside Camp Check-in & Stargazing' },
    ],
    stay: 'Lakeside Camp',
    meals: ['Breakfast', 'Lunch', 'Dinner'],
    transportation: ['Cab'],
  },
  {
    id: 'day-4',
    dayNumber: 4,
    title: 'Return to Leh & Departure',
    description: 'Return drive to Leh via Chang La pass with souvenir shopping.',
    plans: [
      { id: 'plan-4-1', text: 'Sunrise over Pangong Lake' },
      { id: 'plan-4-2', text: 'Breakfast at campsite' },
      { id: 'plan-4-3', text: 'Chang La Pass (17,590 ft)' },
      { id: 'plan-4-4', text: 'Airport Transfer or Evening Market Walk' },
    ],
    activities: [
      { id: 'act-4-1', title: 'Sunrise over Pangong Lake' },
      { id: 'act-4-2', title: 'Breakfast at campsite' },
      { id: 'act-4-3', title: 'Chang La Pass (17,590 ft)' },
      { id: 'act-4-4', title: 'Airport Transfer or Evening Market Walk' },
    ],
    stay: 'Hotel',
    meals: ['Breakfast'],
    transportation: ['Cab'],
  },
];
