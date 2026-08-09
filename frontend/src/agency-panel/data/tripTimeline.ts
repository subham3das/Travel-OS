// ─── Agency Panel Trip Timeline & Live Operations Mock Data & Types ──────────

export type DayLiveStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Delayed' | 'Skipped';
export type TripLiveStatus = 'Pending Setup' | 'Upcoming' | 'Ongoing' | 'Completed' | 'Archived';
export type IncidentCategory = 'Medical Emergency' | 'Vehicle Breakdown' | 'Weather Issue' | 'Lost Luggage' | 'Late Arrival' | 'Other';
export type PhotoCategory = 'Departure' | 'Hotel Check-in' | 'Sightseeing' | 'Group Photos' | 'Other';

export interface TimelineActivity {
  id: string;
  time: string;
  title: string;
  status: DayLiveStatus;
  location?: string;
}

export interface DailyChecklistItem {
  id: string;
  label: string;
  isCompleted: boolean;
}

export interface TimelineDay {
  dayNumber: number;
  dateText: string;
  title: string;
  status: DayLiveStatus;
  guideName: string;
  hotelName: string;
  vehicleName: string;
  pickupTime: string;
  departureTime: string;
  arrivalTime: string;
  meals: string;
  notes: string;
  activities: TimelineActivity[];
  checklist: DailyChecklistItem[];
}

export interface TripIncident {
  id: string;
  timestampText: string;
  category: IncidentCategory;
  description: string;
  isResolved: boolean;
  reportedBy: string;
}

export interface TripNote {
  id: string;
  timestampText: string;
  author: string;
  authorRole: string;
  content: string;
}

export interface TripPhoto {
  id: string;
  url: string;
  caption: string;
  category: PhotoCategory;
  timestampText: string;
}

export interface LiveStats {
  currentDay: number;
  totalDays: number;
  completedDays: number;
  remainingDays: number;
  presentTravelersCount: number;
  totalTravelersCount: number;
  delayedActivitiesCount: number;
  openIncidentsCount: number;
}

// ── Backend API Data Payload Schema (Ready for API integration) ─────────────
// GET  /api/agency/trips/:id/timeline
// POST /api/agency/trips/:id/notes
// POST /api/agency/trips/:id/incidents
// POST /api/agency/trips/:id/photos
// PUT  /api/agency/trips/:id/status

export interface TripTimelineDataPayload {
  tripId: string;
  status: TripLiveStatus;
  liveStats: LiveStats;
  days: TimelineDay[];
  incidents: TripIncident[];
  notes: TripNote[];
  photos: TripPhoto[];
}

// ── Initial Mock Data ────────────────────────────────────────────────────────

export const MOCK_TIMELINE_DAYS: TimelineDay[] = [
  {
    dayNumber: 1,
    dateText: '15 May 2024',
    title: 'Arrival in Leh & Acclimatization',
    status: 'Completed',
    guideName: 'John Smith',
    hotelName: 'The Grand Himalayan Resort',
    vehicleName: 'Tempo Traveller Deluxe (UK 07 PA 1234)',
    pickupTime: '08:00 AM',
    departureTime: '09:00 AM',
    arrivalTime: '11:30 AM',
    meals: 'Breakfast, Lunch, Dinner Included',
    notes: 'Rest essential for high altitude acclimatization. Hydration recommended.',
    activities: [
      { id: 'a1-1', time: '08:00 AM', title: 'Leh Kushok Bakula Rimpoche Airport Pickup', status: 'Completed', location: 'Leh Airport' },
      { id: 'a1-2', time: '10:30 AM', title: 'Hotel Check-in & Briefing Session', status: 'Completed', location: 'Grand Himalayan Resort' },
      { id: 'a1-3', time: '01:00 PM', title: 'Acclimatization Lunch & Orientation', status: 'Completed', location: 'Hotel Dining Hall' },
      { id: 'a1-4', time: '05:00 PM', title: 'Evening Walk to Shanti Stupa', status: 'Completed', location: 'Shanti Stupa, Leh' },
      { id: 'a1-5', time: '07:30 PM', title: 'Welcome Dinner & Staff Introduction', status: 'Completed', location: 'Resort Lawn' },
    ],
    checklist: [
      { id: 'c1-1', label: 'Breakfast Completed', isCompleted: true },
      { id: 'c1-2', label: 'Hotel Checkout', isCompleted: false },
      { id: 'c1-3', label: 'Attendance Verified', isCompleted: true },
      { id: 'c1-4', label: 'Transportation Ready', isCompleted: true },
      { id: 'c1-5', label: 'Destination Reached', isCompleted: true },
      { id: 'c1-6', label: 'Dinner Completed', isCompleted: true },
    ],
  },
  {
    dayNumber: 2,
    dateText: '16 May 2024',
    title: 'Leh Local Sightseeing & Hall of Fame',
    status: 'In Progress',
    guideName: 'Aman Sharma',
    hotelName: 'The Grand Himalayan Resort',
    vehicleName: 'Tempo Traveller Deluxe (UK 07 PA 1234)',
    pickupTime: '08:30 AM',
    departureTime: '09:00 AM',
    arrivalTime: '06:00 PM',
    meals: 'Breakfast, Packaged Lunch, Dinner',
    notes: 'Carry warm layer for Sangam Point windy afternoon.',
    activities: [
      { id: 'a2-1', time: '08:30 AM', title: 'Hotel Pickup & Assembly', status: 'Completed', location: 'Hotel Lobby' },
      { id: 'a2-2', time: '09:30 AM', title: 'Hall of Fame Museum Visit', status: 'Completed', location: 'Leh-Kargil Road' },
      { id: 'a2-3', time: '12:00 PM', title: 'Magnetic Hill Demonstration', status: 'In Progress', location: 'Magnetic Hill' },
      { id: 'a2-4', time: '02:00 PM', title: 'Sangam Point (Zanskar & Indus River Confluence)', status: 'Not Started', location: 'Nimmoo' },
      { id: 'a2-5', time: '04:30 PM', title: 'Gurudwara Pathar Sahib Visit', status: 'Not Started', location: 'Pathar Sahib' },
    ],
    checklist: [
      { id: 'c2-1', label: 'Breakfast Completed', isCompleted: true },
      { id: 'c2-2', label: 'Hotel Checkout', isCompleted: false },
      { id: 'c2-3', label: 'Attendance Verified', isCompleted: true },
      { id: 'c2-4', label: 'Transportation Ready', isCompleted: true },
      { id: 'c2-5', label: 'Destination Reached', isCompleted: false },
      { id: 'c2-6', label: 'Dinner Completed', isCompleted: false },
    ],
  },
  {
    dayNumber: 3,
    dateText: '17 May 2024',
    title: 'Leh to Nubra Valley via Khardung La Pass',
    status: 'Not Started',
    guideName: 'Aman Sharma',
    hotelName: 'Nubra Organic Eco Camps, Hunder',
    vehicleName: 'Tempo Traveller Deluxe (UK 07 PA 1234)',
    pickupTime: '06:30 AM',
    departureTime: '07:00 AM',
    arrivalTime: '03:30 PM',
    meals: 'Breakfast, Lunch at North Pullu, Dinner at Camp',
    notes: 'Highest motorable road pass (17,982 ft). Max 15 min stay at pass recommended.',
    activities: [
      { id: 'a3-1', time: '06:30 AM', title: 'Luggage Loading & Check-out from Leh', status: 'Not Started', location: 'Leh Resort' },
      { id: 'a3-2', time: '09:30 AM', title: 'Khardung La Pass Crossing & Photo Stop', status: 'Not Started', location: 'Khardung La Top' },
      { id: 'a3-3', time: '01:30 PM', title: 'Diskit Monastery & Giant Buddha Visit', status: 'Not Started', location: 'Diskit Village' },
      { id: 'a3-4', time: '04:30 PM', title: 'Hunder Double-Hump Camel Safari', status: 'Not Started', location: 'Hunder Sand Dunes' },
      { id: 'a3-5', time: '07:30 PM', title: 'Bonfire & Cultural Dance Performance', status: 'Not Started', location: 'Nubra Eco Camp' },
    ],
    checklist: [
      { id: 'c3-1', label: 'Breakfast Completed', isCompleted: false },
      { id: 'c3-2', label: 'Hotel Checkout', isCompleted: false },
      { id: 'c3-3', label: 'Attendance Verified', isCompleted: false },
      { id: 'c3-4', label: 'Transportation Ready', isCompleted: false },
      { id: 'c3-5', label: 'Destination Reached', isCompleted: false },
      { id: 'c3-6', label: 'Dinner Completed', isCompleted: false },
    ],
  },
  {
    dayNumber: 4,
    dateText: '18 May 2024',
    title: 'Nubra Valley Excursion & Turtuk Border Village',
    status: 'Not Started',
    guideName: 'John Smith',
    hotelName: 'Nubra Organic Eco Camps, Hunder',
    vehicleName: 'Tempo Traveller Deluxe (UK 07 PA 1234)',
    pickupTime: '07:30 AM',
    departureTime: '08:00 AM',
    arrivalTime: '05:00 PM',
    meals: 'Breakfast, Local Balti Lunch in Turtuk, Dinner',
    notes: 'Turtuk is the last northernmost village of India. Carry original ILP permits.',
    activities: [
      { id: 'a4-1', time: '08:00 AM', title: 'Scenic Drive along Shyok River', status: 'Not Started', location: 'Shyok Valley Route' },
      { id: 'a4-2', time: '11:00 AM', title: 'Turtuk Heritage Village Heritage Walk', status: 'Not Started', location: 'Turtuk Village' },
      { id: 'a4-3', time: '01:00 PM', title: 'Traditional Balti Cuisine Lunch', status: 'Not Started', location: 'Turtuk Apricot Orchards' },
      { id: 'a4-4', time: '03:00 PM', title: 'LOC Viewpoint Visit (Tyakshi)', status: 'Not Started', location: 'Tyakshi Border' },
    ],
    checklist: [
      { id: 'c4-1', label: 'Breakfast Completed', isCompleted: false },
      { id: 'c4-2', label: 'Hotel Checkout', isCompleted: false },
      { id: 'c4-3', label: 'Attendance Verified', isCompleted: false },
      { id: 'c4-4', label: 'Transportation Ready', isCompleted: false },
      { id: 'c4-5', label: 'Destination Reached', isCompleted: false },
      { id: 'c4-6', label: 'Dinner Completed', isCompleted: false },
    ],
  },
  {
    dayNumber: 5,
    dateText: '19 May 2024',
    title: 'Nubra Valley to Pangong Tso via Shyok River',
    status: 'Not Started',
    guideName: 'Aman Sharma',
    hotelName: 'Pangong Wooden Cottages, Spangmik',
    vehicleName: 'Tempo Traveller Deluxe (UK 07 PA 1234)',
    pickupTime: '08:00 AM',
    departureTime: '08:30 AM',
    arrivalTime: '03:00 PM',
    meals: 'Breakfast, Lunch en route, Cottage Dinner',
    notes: 'Cold night expected at Pangong (14,270 ft). Heated blanket arranged in cottages.',
    activities: [
      { id: 'a5-1', time: '08:30 AM', title: 'Departure from Nubra Camp', status: 'Not Started', location: 'Hunder' },
      { id: 'a5-2', time: '12:30 PM', title: 'Tangste Checkpost Verification', status: 'Not Started', location: 'Tangste' },
      { id: 'a5-3', time: '02:30 PM', title: 'First Sight of Pangong Tso Lake', status: 'Not Started', location: 'Pangong Viewpoint' },
      { id: 'a5-4', time: '05:00 PM', title: 'Sunset Photography Session by Lake', status: 'Not Started', location: 'Spangmik Shore' },
    ],
    checklist: [
      { id: 'c5-1', label: 'Breakfast Completed', isCompleted: false },
      { id: 'c5-2', label: 'Hotel Checkout', isCompleted: false },
      { id: 'c5-3', label: 'Attendance Verified', isCompleted: false },
      { id: 'c5-4', label: 'Transportation Ready', isCompleted: false },
      { id: 'c5-5', label: 'Destination Reached', isCompleted: false },
      { id: 'c5-6', label: 'Dinner Completed', isCompleted: false },
    ],
  },
  {
    dayNumber: 6,
    dateText: '20 May 2024',
    title: 'Pangong Lake Sunrise to Leh via Chang La',
    status: 'Not Started',
    guideName: 'John Smith',
    hotelName: 'The Grand Himalayan Resort, Leh',
    vehicleName: 'Tempo Traveller Deluxe (UK 07 PA 1234)',
    pickupTime: '06:00 AM',
    departureTime: '09:00 AM',
    arrivalTime: '04:00 PM',
    meals: 'Breakfast at Lake, Lunch at Karu, Farewell Dinner',
    notes: 'Chang La Pass is second highest pass (17,590 ft). Medical kit ready in bus.',
    activities: [
      { id: 'a6-1', time: '06:00 AM', title: 'Pangong Lake Sunrise Photography', status: 'Not Started', location: 'Spangmik Lake Shore' },
      { id: 'a6-2', time: '09:00 AM', title: 'Check-out & Departure from Pangong', status: 'Not Started', location: 'Pangong Cottages' },
      { id: 'a6-3', time: '12:00 PM', title: 'Chang La Pass Crossing & Hot Tea Stop', status: 'Not Started', location: 'Chang La Top' },
      { id: 'a6-4', time: '02:30 PM', title: 'Thiksey Monastery Visit', status: 'Not Started', location: 'Thiksey Monastery' },
      { id: 'a6-5', time: '08:00 PM', title: 'Farewell Gala Dinner & Memories Share', status: 'Not Started', location: 'Leh Resort' },
    ],
    checklist: [
      { id: 'c6-1', label: 'Breakfast Completed', isCompleted: false },
      { id: 'c6-2', label: 'Hotel Checkout', isCompleted: false },
      { id: 'c6-3', label: 'Attendance Verified', isCompleted: false },
      { id: 'c6-4', label: 'Transportation Ready', isCompleted: false },
      { id: 'c6-5', label: 'Destination Reached', isCompleted: false },
      { id: 'c6-6', label: 'Dinner Completed', isCompleted: false },
    ],
  },
  {
    dayNumber: 7,
    dateText: '21 May 2024',
    title: 'Departure from Leh — Airport Transfer',
    status: 'Not Started',
    guideName: 'John Smith',
    hotelName: 'N/A (Check-out Completed)',
    vehicleName: 'Tempo Traveller Deluxe (UK 07 PA 1234)',
    pickupTime: '06:00 AM',
    departureTime: '06:30 AM',
    arrivalTime: '07:30 AM',
    meals: 'Breakfast Box Provided',
    notes: 'Transfer to Leh airport according to flight schedules.',
    activities: [
      { id: 'a7-1', time: '06:00 AM', title: 'Hotel Checkout & Departure Pack Distribution', status: 'Not Started', location: 'Leh Hotel Lobby' },
      { id: 'a7-2', time: '07:00 AM', title: 'Drop-off at Leh Airport & Final Farewell', status: 'Not Started', location: 'Leh Airport' },
    ],
    checklist: [
      { id: 'c7-1', label: 'Breakfast Completed', isCompleted: false },
      { id: 'c7-2', label: 'Hotel Checkout', isCompleted: false },
      { id: 'c7-3', label: 'Attendance Verified', isCompleted: false },
      { id: 'c7-4', label: 'Transportation Ready', isCompleted: false },
      { id: 'c7-5', label: 'Destination Reached', isCompleted: false },
      { id: 'c7-6', label: 'Dinner Completed', isCompleted: false },
    ],
  },
];

export const MOCK_INCIDENTS: TripIncident[] = [
  {
    id: 'inc-1',
    timestampText: '16 May, 11:15 AM',
    category: 'Weather Issue',
    description: 'Brief dust gust near Magnetic Hill caused 15 min halt. All travelers safe in vehicle.',
    isResolved: true,
    reportedBy: 'Aman Sharma (Guide)',
  },
  {
    id: 'inc-2',
    timestampText: '16 May, 01:45 PM',
    category: 'Medical Emergency',
    description: 'Traveler Priya Singh experienced mild headache/AMS symptom. Oxygen cylinder administered.',
    isResolved: false,
    reportedBy: 'John Smith (Trip Host)',
  },
];

export const MOCK_TRIP_NOTES: TripNote[] = [
  {
    id: 'note-1',
    timestampText: '15 May, 11:45 AM',
    author: 'John Smith',
    authorRole: 'Trip Manager',
    content: 'All 18 travelers checked in safely at Leh hotel. Acclimatization guidelines shared with everyone.',
  },
  {
    id: 'note-2',
    timestampText: '16 May, 09:15 AM',
    author: 'Aman Sharma',
    authorRole: 'Guide',
    content: 'Hall of Fame tour completed smoothly. Group morale is high and enthusiastic!',
  },
  {
    id: 'note-3',
    timestampText: '16 May, 12:30 PM',
    author: 'Rakesh Kumar',
    authorRole: 'Driver',
    content: 'Vehicle UK 07 PA 1234 refueled and tire pressure checked for tomorrow Khardung La steep climb.',
  },
];

export const MOCK_TRIP_PHOTOS: TripPhoto[] = [
  {
    id: 'ph-1',
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600',
    caption: 'Group welcome at Leh Airport',
    category: 'Departure',
    timestampText: '15 May, 08:30 AM',
  },
  {
    id: 'ph-2',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
    caption: 'Evening view from Shanti Stupa',
    category: 'Sightseeing',
    timestampText: '15 May, 05:45 PM',
  },
  {
    id: 'ph-3',
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600',
    caption: 'Hall of Fame War Memorial visit',
    category: 'Sightseeing',
    timestampText: '16 May, 10:15 AM',
  },
  {
    id: 'ph-4',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
    caption: 'Group photo at Magnetic Hill',
    category: 'Group Photos',
    timestampText: '16 May, 12:10 PM',
  },
];
