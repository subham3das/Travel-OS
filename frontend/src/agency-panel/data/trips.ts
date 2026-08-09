// ─── Agency Panel Trip Management Mock Data ─────────────────────────────────

export type TripStatusCategory = 'Pending Setup' | 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';

export interface AgencyTrip {
  id: string;
  tripId: string;
  packageName: string;
  dayBadge: string;
  departureDate: string;
  returnDate: string;
  dateRangeText: string;
  destinationRoute: string;
  guideName: string;
  travelerCount: number;
  capacity: number;
  vehicleAssigned: string;
  statusCategory: TripStatusCategory;
  statusBadgeText: string;
  badgeColor: 'purple' | 'amber' | 'blue' | 'emerald' | 'rose' | 'slate';
  coverImage: string;
}

export interface TripsQuickStatsData {
  upcomingCount: number;
  totalTravelers: number;
  assignedGuides: number;
  vehiclesAssigned: number;
}

export const MOCK_TRIPS_STATS: TripsQuickStatsData = {
  upcomingCount: 6,
  totalTravelers: 110,
  assignedGuides: 6,
  vehiclesAssigned: 6,
};

export const MOCK_AGENCY_TRIPS: AgencyTrip[] = [
  {
    id: 'trip-pending-1',
    tripId: 'BK-2041-TRIP',
    packageName: 'Spiti Expedition (Newly Moved)',
    dayBadge: '18 May',
    departureDate: '2024-05-18',
    returnDate: '2024-05-25',
    dateRangeText: '18 May – 25 May 2024',
    destinationRoute: 'Shimla, Kaza, Tabo, Chandratal',
    guideName: 'Unassigned (Pending Setup)',
    travelerCount: 14,
    capacity: 18,
    vehicleAssigned: 'Pending Vehicle Assignment',
    statusCategory: 'Pending Setup',
    statusBadgeText: 'Pending Team Assignment',
    badgeColor: 'amber',
    coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=500',
  },
  {
    id: 'trip-1',
    tripId: 'LD-1505-2024',
    packageName: 'Ladakh Adventure',
    dayBadge: '15 May',
    departureDate: '2024-05-15',
    returnDate: '2024-05-22',
    dateRangeText: '15 May – 22 May 2024',
    destinationRoute: 'Leh, Nubra, Pangong, Tso Moriri',
    guideName: 'Rohit Sharma (Tour Guide)',
    travelerCount: 18,
    capacity: 24,
    vehicleAssigned: 'Force Traveller 26-Seater',
    statusCategory: 'Upcoming',
    statusBadgeText: 'Starts Tomorrow',
    badgeColor: 'purple',
    coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500',
  },
  {
    id: 'trip-2',
    tripId: 'MG-2005-2024',
    packageName: 'Meghalaya Explorer',
    dayBadge: '20 May',
    departureDate: '2024-05-20',
    returnDate: '2024-05-25',
    dateRangeText: '20 May – 25 May 2024',
    destinationRoute: 'Shillong, Cherrapunji, Dawki',
    guideName: 'Ankit Verma (Tour Guide)',
    travelerCount: 12,
    capacity: 18,
    vehicleAssigned: 'Urbania 17-Seater Luxury',
    statusCategory: 'Upcoming',
    statusBadgeText: 'Starts in 5 Days',
    badgeColor: 'amber',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500',
  },
  {
    id: 'trip-3',
    tripId: 'SK-2805-2024',
    packageName: 'Sikkim Serenity',
    dayBadge: '28 May',
    departureDate: '2024-05-28',
    returnDate: '2024-06-04',
    dateRangeText: '28 May – 04 Jun 2024',
    destinationRoute: 'Gangtok, Pelling, Lachung',
    guideName: 'Pema Lepcha (Tour Guide)',
    travelerCount: 8,
    capacity: 16,
    vehicleAssigned: 'Mahindra Scorpio-N 4x4',
    statusCategory: 'Upcoming',
    statusBadgeText: 'Starts in 13 Days',
    badgeColor: 'blue',
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500',
  },
  {
    id: 'trip-4',
    tripId: 'KP-0506-2024',
    packageName: 'Kashmir Paradise',
    dayBadge: '05 Jun',
    departureDate: '2024-06-05',
    returnDate: '2024-06-12',
    dateRangeText: '05 Jun – 12 Jun 2024',
    destinationRoute: 'Srinagar, Gulmarg, Pahalgam',
    guideName: 'Imran Dar (Tour Guide)',
    travelerCount: 20,
    capacity: 24,
    vehicleAssigned: 'Tempo Traveller Deluxe',
    statusCategory: 'Upcoming',
    statusBadgeText: 'Starts in 21 Days',
    badgeColor: 'emerald',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500',
  },
  {
    id: 'trip-5',
    tripId: 'HP-0205-2024',
    packageName: 'Himachal Spiti Expedition',
    dayBadge: '02 May',
    departureDate: '2024-05-02',
    returnDate: '2024-05-10',
    dateRangeText: '02 May – 10 May 2024',
    destinationRoute: 'Shimla, Kaza, Tabo, Manali',
    guideName: 'Vikram Thakur (Senior Guide)',
    travelerCount: 16,
    capacity: 16,
    vehicleAssigned: 'Isuzu D-Max 4x4 Batch',
    statusCategory: 'Ongoing',
    statusBadgeText: 'Ongoing (Day 6)',
    badgeColor: 'emerald',
    coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=500',
  },
  {
    id: 'trip-6',
    tripId: 'UK-2504-2024',
    packageName: 'Uttarakhand Chardham Circuit',
    dayBadge: '25 Apr',
    departureDate: '2024-04-25',
    returnDate: '2024-05-05',
    dateRangeText: '25 Apr – 05 May 2024',
    destinationRoute: 'Haridwar, Kedarnath, Badrinath',
    guideName: 'Suresh Rawat (Senior Guide)',
    travelerCount: 24,
    capacity: 24,
    vehicleAssigned: 'Volvo Bus 45-Seater',
    statusCategory: 'Ongoing',
    statusBadgeText: 'Ongoing (Day 9)',
    badgeColor: 'emerald',
    coverImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500',
  },
  {
    id: 'trip-7',
    tripId: 'KL-1004-2024',
    packageName: 'Kerala Backwaters & Hills',
    dayBadge: '10 Apr',
    departureDate: '2024-04-10',
    returnDate: '2024-04-17',
    dateRangeText: '10 Apr – 17 Apr 2024',
    destinationRoute: 'Munnar, Alleppey, Kovalam',
    guideName: 'Arun Pillai (Tour Guide)',
    travelerCount: 14,
    capacity: 14,
    vehicleAssigned: 'Force Urbania Premium',
    statusCategory: 'Completed',
    statusBadgeText: 'Completed',
    badgeColor: 'slate',
    coverImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=500',
  },
  {
    id: 'trip-8',
    tripId: 'RJ-0104-2024',
    packageName: 'Rajasthan Royal Heritage',
    dayBadge: '01 Apr',
    departureDate: '2024-04-01',
    returnDate: '2024-04-08',
    dateRangeText: '01 Apr – 08 Apr 2024',
    destinationRoute: 'Jaipur, Udaipur, Jaisalmer',
    guideName: 'Manish Singh (Tour Guide)',
    travelerCount: 22,
    capacity: 24,
    vehicleAssigned: 'Luxury Tourist Coach',
    statusCategory: 'Completed',
    statusBadgeText: 'Completed',
    badgeColor: 'slate',
    coverImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=500',
  },
];
