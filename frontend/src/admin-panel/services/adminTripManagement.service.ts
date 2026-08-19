import {
  AdminTripItem,
  TripKPIStats,
  TripFilters,
  TripActivityChartPoint,
  TripStatusBreakdownItem,
  DestinationTripItem,
  TopAgencyTripItem,
  MonthlyTripSummaryData,
  TripAlertItem,
} from '../types/tripManagement';

export const initialTripKPIStats: TripKPIStats = {
  totalTrips: {
    id: 'totalTrips',
    title: 'Total Trips',
    value: '4,286',
    growth: '8.2%',
    isPositive: true,
    comparison: 'from last 30 days',
    iconType: 'total',
    sparklineColor: '#6356E5',
  },
  activeTrips: {
    id: 'activeTrips',
    title: 'Active Trips',
    value: '426',
    growth: '12.6%',
    isPositive: true,
    comparison: 'from last 30 days',
    iconType: 'active',
    sparklineColor: '#10B981',
  },
  upcomingTrips: {
    id: 'upcomingTrips',
    title: 'Upcoming Trips',
    value: '318',
    growth: '7.4%',
    isPositive: true,
    comparison: 'from last 30 days',
    iconType: 'upcoming',
    sparklineColor: '#3B82F6',
  },
  completedTrips: {
    id: 'completedTrips',
    title: 'Completed Trips',
    value: '3,152',
    growth: '9.8%',
    isPositive: true,
    comparison: 'from last 30 days',
    iconType: 'completed',
    sparklineColor: '#10B981',
  },
  cancelledTrips: {
    id: 'cancelledTrips',
    title: 'Cancelled Trips',
    value: '97',
    growth: '6.3%',
    isPositive: false,
    comparison: 'from last 30 days',
    iconType: 'cancelled',
    sparklineColor: '#EF4444',
  },
  travelersOnTrip: {
    id: 'travelersOnTrip',
    title: 'Travelers On Trip',
    value: '9,842',
    growth: '10.2%',
    isPositive: true,
    comparison: 'from last 30 days',
    iconType: 'travelers',
    sparklineColor: '#8B5CF6',
  },
  guidesAssigned: {
    id: 'guidesAssigned',
    title: 'Guides Assigned',
    value: '512',
    growth: '8.7%',
    isPositive: true,
    comparison: 'from last 30 days',
    iconType: 'guides',
    sparklineColor: '#F59E0B',
  },
  avgRating: {
    id: 'avgRating',
    title: 'Avg Trip Rating',
    value: '4.8 ★',
    growth: '0.3',
    isPositive: true,
    comparison: 'from last 30 days',
    iconType: 'rating',
    sparklineColor: '#3B82F6',
  },
};

export const initialTripsData: AdminTripItem[] = [
  {
    id: 'TRIP-24081',
    packageName: 'Meghalaya Explorer',
    packageImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=300&auto=format&fit=crop',
    destination: 'Meghalaya',
    destinationState: 'Meghalaya',
    destinationCity: 'Cherrapunji',
    agencyId: 'AGY-1001',
    agencyName: 'Mountain Trails',
    agencyLogo: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=150&auto=format&fit=crop',
    guide: {
      id: 'g-1',
      name: 'Rahul Das',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
      phone: '+91 98765 43210',
      isOnline: true,
    },
    departureDate: '14 Jun, 2024',
    departureTime: '08:00 AM',
    returnDate: '19 Jun, 2024',
    returnTime: '06:00 PM',
    duration: '6D / 5N',
    travelersCount: 18,
    maxCapacity: 20,
    vehicle: 'Tempo Traveller (AS 01 AB 1234)',
    vehicleType: 'Tempo Traveller',
    status: 'Running',
    progress: 62,
    rating: 4.9,
    tripType: 'Group Tour',
    revenue: '₹4,32,000',
    heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
    liveStats: {
      travelersCheckedIn: 12,
      totalTravelers: 16,
      seatsFilledPercentage: 75,
      currentLocation: 'Cherrapunji, Meghalaya',
      etaNextStop: '2h 15m',
      weather: 'Cloudy',
      weatherTemp: '22°C',
      checkpointsCovered: 4,
      totalCheckpoints: 7,
      distanceRemaining: '145 km',
      safetyStatus: 'Normal',
    },
    timeline: [
      { id: 'tl-1', title: 'Trip Created', time: '10 Jun, 2024 10:30 AM', status: 'completed' },
      { id: 'tl-2', title: 'Guide Assigned', time: '11 Jun, 2024 09:15 AM', status: 'completed' },
      { id: 'tl-3', title: 'Travelers Checked In', time: '14 Jun, 2024 06:30 AM', status: 'completed' },
      { id: 'tl-4', title: 'Journey Started', time: '14 Jun, 2024 08:45 AM', status: 'active' },
      { id: 'tl-5', title: 'Reached Destination', time: '14 Jun, 2024 01:30 PM', status: 'completed' },
      { id: 'tl-6', title: 'Activities Completed', time: '-', status: 'pending' },
      { id: 'tl-7', title: 'Return Journey', time: '-', status: 'pending' },
      { id: 'tl-8', title: 'Trip Completed', time: '-', status: 'pending' },
    ],
  },
  {
    id: 'TRIP-24080',
    packageName: 'Ladakh Adventure',
    packageImage: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=300&auto=format&fit=crop',
    destination: 'Ladakh',
    destinationState: 'Ladakh',
    destinationCity: 'Leh',
    agencyId: 'AGY-1002',
    agencyName: 'Wanderlust Holidays',
    agencyLogo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=150&auto=format&fit=crop',
    guide: {
      id: 'g-2',
      name: 'Tenzin Norbu',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
      phone: '+91 98451 23456',
      isOnline: true,
    },
    departureDate: '18 Jun, 2024',
    departureTime: '06:00 AM',
    returnDate: '25 Jun, 2024',
    returnTime: '04:00 PM',
    duration: '8D / 7N',
    travelersCount: 14,
    maxCapacity: 16,
    vehicle: 'Innova Crysta (JK 10 A 5566)',
    vehicleType: 'Innova Crysta',
    status: 'Upcoming',
    progress: 12,
    rating: null,
    tripType: 'Road Trip',
    revenue: '₹6,80,000',
    heroImage: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=800&auto=format&fit=crop',
    liveStats: {
      travelersCheckedIn: 0,
      totalTravelers: 14,
      seatsFilledPercentage: 88,
      currentLocation: 'Leh Airport Pick-up Point',
      etaNextStop: 'Starting in 4 days',
      weather: 'Sunny & Cold',
      weatherTemp: '14°C',
      checkpointsCovered: 1,
      totalCheckpoints: 8,
      distanceRemaining: '450 km',
      safetyStatus: 'Normal',
    },
    timeline: [
      { id: 'tl-1', title: 'Trip Created', time: '08 Jun, 2024 11:00 AM', status: 'completed' },
      { id: 'tl-2', title: 'Guide Assigned', time: '10 Jun, 2024 02:30 PM', status: 'completed' },
      { id: 'tl-3', title: 'Vehicle Inspection Passed', time: '12 Jun, 2024 10:00 AM', status: 'completed' },
      { id: 'tl-4', title: 'Awaiting Departure', time: '18 Jun, 2024', status: 'active' },
    ],
  },
  {
    id: 'TRIP-24079',
    packageName: 'Goa Beach Escape',
    packageImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=300&auto=format&fit=crop',
    destination: 'Goa',
    destinationState: 'Goa',
    destinationCity: 'Panaji',
    agencyId: 'AGY-1003',
    agencyName: 'Goa Getaways',
    agencyLogo: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=150&auto=format&fit=crop',
    guide: {
      id: 'g-3',
      name: 'Amit Verma',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
      phone: '+91 97654 32190',
      isOnline: false,
    },
    departureDate: '12 Jun, 2024',
    departureTime: '09:00 AM',
    returnDate: '16 Jun, 2024',
    returnTime: '08:00 PM',
    duration: '5D / 4N',
    travelersCount: 22,
    maxCapacity: 24,
    vehicle: 'Mini Bus (GA 03 X 9876)',
    vehicleType: 'Mini Bus',
    status: 'Completed',
    progress: 100,
    rating: 4.7,
    tripType: 'Weekend Getaway',
    revenue: '₹3,96,000',
    heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop',
    liveStats: {
      travelersCheckedIn: 22,
      totalTravelers: 22,
      seatsFilledPercentage: 100,
      currentLocation: 'Goa Airport (Dropped)',
      etaNextStop: 'Trip Completed',
      weather: 'Tropical Sunny',
      weatherTemp: '30°C',
      checkpointsCovered: 6,
      totalCheckpoints: 6,
      distanceRemaining: '0 km',
      safetyStatus: 'Normal',
    },
    timeline: [
      { id: 'tl-1', title: 'Trip Created', time: '05 Jun, 2024', status: 'completed' },
      { id: 'tl-2', title: 'Journey Started', time: '12 Jun, 2024 09:15 AM', status: 'completed' },
      { id: 'tl-3', title: 'All Excursions Finished', time: '15 Jun, 2024 07:00 PM', status: 'completed' },
      { id: 'tl-4', title: 'Trip Completed & Feedback Collected', time: '16 Jun, 2024 08:30 PM', status: 'completed' },
    ],
  },
  {
    id: 'TRIP-24078',
    packageName: 'Kashmir Wonderland',
    packageImage: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=300&auto=format&fit=crop',
    destination: 'Kashmir',
    destinationState: 'Jammu & Kashmir',
    destinationCity: 'Gulmarg',
    agencyId: 'AGY-1004',
    agencyName: 'Kashmir Trips',
    agencyLogo: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=150&auto=format&fit=crop',
    guide: {
      id: 'g-4',
      name: 'Irfan Ahmad',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop',
      phone: '+91 94190 87654',
      isOnline: true,
    },
    departureDate: '10 Jun, 2024',
    departureTime: '07:30 AM',
    returnDate: '17 Jun, 2024',
    returnTime: '05:00 PM',
    duration: '8D / 7N',
    travelersCount: 16,
    maxCapacity: 18,
    vehicle: 'Tempo Traveller (JK 01 C 4321)',
    vehicleType: 'Tempo Traveller',
    status: 'Running',
    progress: 48,
    rating: 4.8,
    tripType: 'Group Tour',
    revenue: '₹5,76,000',
    heroImage: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=800&auto=format&fit=crop',
    liveStats: {
      travelersCheckedIn: 16,
      totalTravelers: 16,
      seatsFilledPercentage: 89,
      currentLocation: 'Pahalgam Valley Viewpoint',
      etaNextStop: '1h 40m to Srinagar Houseboat',
      weather: 'Pleasant & Mild',
      weatherTemp: '19°C',
      checkpointsCovered: 4,
      totalCheckpoints: 8,
      distanceRemaining: '210 km',
      safetyStatus: 'Normal',
    },
    timeline: [
      { id: 'tl-1', title: 'Trip Created', time: '01 Jun, 2024', status: 'completed' },
      { id: 'tl-2', title: 'Travelers Boarded Srinagar', time: '10 Jun, 2024 08:00 AM', status: 'completed' },
      { id: 'tl-3', title: 'Gulmarg Gondola Excursion', time: '12 Jun, 2024 02:00 PM', status: 'completed' },
      { id: 'tl-4', title: 'Pahalgam En Route', time: '14 Jun, 2024', status: 'active' },
    ],
  },
  {
    id: 'TRIP-24077',
    packageName: 'Kerala Backwaters',
    packageImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=300&auto=format&fit=crop',
    destination: 'Kerala',
    destinationState: 'Kerala',
    destinationCity: 'Alleppey',
    agencyId: 'AGY-1005',
    agencyName: 'Kerala Holidays',
    agencyLogo: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=150&auto=format&fit=crop',
    guide: {
      id: 'g-5',
      name: 'Sreejith Nair',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150&auto=format&fit=crop',
      phone: '+91 94471 23456',
      isOnline: false,
    },
    departureDate: '05 Jun, 2024',
    departureTime: '10:00 AM',
    returnDate: '09 Jun, 2024',
    returnTime: '06:30 PM',
    duration: '5D / 4N',
    travelersCount: 12,
    maxCapacity: 14,
    vehicle: 'Innova Crysta (KL 04 K 8899)',
    vehicleType: 'Innova Crysta',
    status: 'Completed',
    progress: 100,
    rating: 4.6,
    tripType: 'Private Tour',
    revenue: '₹3,24,000',
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop',
    liveStats: {
      travelersCheckedIn: 12,
      totalTravelers: 12,
      seatsFilledPercentage: 86,
      currentLocation: 'Cochin Airport (Completed)',
      etaNextStop: 'Trip Completed',
      weather: 'Light Rain',
      weatherTemp: '27°C',
      checkpointsCovered: 5,
      totalCheckpoints: 5,
      distanceRemaining: '0 km',
      safetyStatus: 'Normal',
    },
    timeline: [
      { id: 'tl-1', title: 'Trip Created', time: '28 May, 2024', status: 'completed' },
      { id: 'tl-2', title: 'Houseboat Check-in', time: '05 Jun, 2024 12:30 PM', status: 'completed' },
      { id: 'tl-3', title: 'Munnar Tea Plantations', time: '07 Jun, 2024 04:00 PM', status: 'completed' },
      { id: 'tl-4', title: 'Trip Successfully Concluded', time: '09 Jun, 2024 07:00 PM', status: 'completed' },
    ],
  },
  {
    id: 'TRIP-24076',
    packageName: 'Andaman Island',
    packageImage: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=300&auto=format&fit=crop',
    destination: 'Andaman',
    destinationState: 'Andaman & Nicobar',
    destinationCity: 'Havelock',
    agencyId: 'AGY-1006',
    agencyName: 'Island Escapes',
    agencyLogo: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=150&auto=format&fit=crop',
    guide: {
      id: 'g-6',
      name: 'Vikram Singh',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=150&auto=format&fit=crop',
      phone: '+91 94342 98765',
      isOnline: true,
    },
    departureDate: '22 Jun, 2024',
    departureTime: '07:00 AM',
    returnDate: '29 Jun, 2024',
    returnTime: '03:00 PM',
    duration: '8D / 7N',
    travelersCount: 15,
    maxCapacity: 18,
    vehicle: 'Mini Bus (AN 01 T 2345)',
    vehicleType: 'Mini Bus',
    status: 'Upcoming',
    progress: 8,
    rating: null,
    tripType: 'Group Tour',
    revenue: '₹6,45,000',
    heroImage: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=800&auto=format&fit=crop',
    liveStats: {
      travelersCheckedIn: 0,
      totalTravelers: 15,
      seatsFilledPercentage: 83,
      currentLocation: 'Port Blair Ferry Terminal',
      etaNextStop: 'Starting in 8 days',
      weather: 'Coastal Breeze',
      weatherTemp: '28°C',
      checkpointsCovered: 0,
      totalCheckpoints: 7,
      distanceRemaining: '380 km (Ferry + Land)',
      safetyStatus: 'Normal',
    },
    timeline: [
      { id: 'tl-1', title: 'Trip Created', time: '10 Jun, 2024', status: 'completed' },
      { id: 'tl-2', title: 'Ferry Tickets & Permits Issued', time: '13 Jun, 2024', status: 'completed' },
      { id: 'tl-3', title: 'Pre-Trip Briefing Scheduled', time: '21 Jun, 2024', status: 'pending' },
    ],
  },
  {
    id: 'TRIP-24075',
    packageName: 'Spiti Expedition',
    packageImage: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=300&auto=format&fit=crop',
    destination: 'Himachal',
    destinationState: 'Himachal Pradesh',
    destinationCity: 'Kaza',
    agencyId: 'AGY-1001',
    agencyName: 'Mountain Trails',
    agencyLogo: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=150&auto=format&fit=crop',
    guide: {
      id: 'g-1',
      name: 'Rahul Das',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
      phone: '+91 98765 43210',
      isOnline: false,
    },
    departureDate: '08 Jun, 2024',
    departureTime: '05:30 AM',
    returnDate: '16 Jun, 2024',
    returnTime: '07:00 PM',
    duration: '9D / 8N',
    travelersCount: 10,
    maxCapacity: 12,
    vehicle: 'Bolero 4x4 (HP 01 S 9988)',
    vehicleType: 'Bolero',
    status: 'Cancelled',
    progress: 0,
    rating: null,
    tripType: 'Trekking',
    revenue: '₹3,80,000',
    heroImage: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=800&auto=format&fit=crop',
    liveStats: {
      travelersCheckedIn: 0,
      totalTravelers: 10,
      seatsFilledPercentage: 83,
      currentLocation: 'Manali Basecamp',
      etaNextStop: 'Trip Cancelled Due to Landslide',
      weather: 'Heavy Rainfall',
      weatherTemp: '12°C',
      checkpointsCovered: 0,
      totalCheckpoints: 9,
      distanceRemaining: '0 km',
      safetyStatus: 'Alert',
    },
    timeline: [
      { id: 'tl-1', title: 'Trip Created', time: '25 May, 2024', status: 'completed' },
      { id: 'tl-2', title: 'Weather Warning Issued by IMD', time: '06 Jun, 2024', status: 'completed' },
      { id: 'tl-3', title: 'Safety Cancellation Approved', time: '07 Jun, 2024 04:00 PM', status: 'completed' },
      { id: 'tl-4', title: '100% Refunds Initiated', time: '08 Jun, 2024', status: 'completed' },
    ],
  },
  {
    id: 'TRIP-24074',
    packageName: 'Rajasthan Royal',
    packageImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=300&auto=format&fit=crop',
    destination: 'Rajasthan',
    destinationState: 'Rajasthan',
    destinationCity: 'Udaipur',
    agencyId: 'AGY-1007',
    agencyName: 'Royal Roads',
    agencyLogo: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=150&auto=format&fit=crop',
    guide: {
      id: 'g-7',
      name: 'Manish Kumar',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop',
      phone: '+91 98290 12345',
      isOnline: false,
    },
    departureDate: '01 Jun, 2024',
    departureTime: '08:30 AM',
    returnDate: '07 Jun, 2024',
    returnTime: '06:00 PM',
    duration: '7D / 6N',
    travelersCount: 20,
    maxCapacity: 22,
    vehicle: 'Tempo Traveller (RJ 14 T 7711)',
    vehicleType: 'Tempo Traveller',
    status: 'Completed',
    progress: 100,
    rating: 4.9,
    tripType: 'Group Tour',
    revenue: '₹4,80,000',
    heroImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=800&auto=format&fit=crop',
    liveStats: {
      travelersCheckedIn: 20,
      totalTravelers: 20,
      seatsFilledPercentage: 91,
      currentLocation: 'Jaipur (Completed)',
      etaNextStop: 'Trip Completed',
      weather: 'Hot & Clear',
      weatherTemp: '36°C',
      checkpointsCovered: 7,
      totalCheckpoints: 7,
      distanceRemaining: '0 km',
      safetyStatus: 'Normal',
    },
    timeline: [
      { id: 'tl-1', title: 'Trip Created', time: '20 May, 2024', status: 'completed' },
      { id: 'tl-2', title: 'Jaipur Fort Tour Finished', time: '02 Jun, 2024', status: 'completed' },
      { id: 'tl-3', title: 'Jodhpur Desert Camp', time: '04 Jun, 2024', status: 'completed' },
      { id: 'tl-4', title: 'Trip Completed with 5-Star Reviews', time: '07 Jun, 2024', status: 'completed' },
    ],
  },
  {
    id: 'TRIP-24073',
    packageName: 'North East Circuit',
    packageImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=300&auto=format&fit=crop',
    destination: 'Assam',
    destinationState: 'Assam',
    destinationCity: 'Kaziranga',
    agencyId: 'AGY-1008',
    agencyName: 'NorthEast Explorers',
    agencyLogo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=150&auto=format&fit=crop',
    guide: {
      id: 'g-8',
      name: 'Pema Lhamu',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
      phone: '+91 94350 44556',
      isOnline: true,
    },
    departureDate: '15 Jun, 2024',
    departureTime: '06:30 AM',
    returnDate: '21 Jun, 2024',
    returnTime: '05:30 PM',
    duration: '7D / 6N',
    travelersCount: 18,
    maxCapacity: 20,
    vehicle: 'Innova Crysta (AS 01 C 3344)',
    vehicleType: 'Innova Crysta',
    status: 'Running',
    progress: 71,
    rating: 4.8,
    tripType: 'Group Tour',
    revenue: '₹5,20,000',
    heroImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop',
    liveStats: {
      travelersCheckedIn: 18,
      totalTravelers: 18,
      seatsFilledPercentage: 90,
      currentLocation: 'Kaziranga National Park Central Range',
      etaNextStop: '45m to Orchid Village Resort',
      weather: 'Lush & Sunny',
      weatherTemp: '26°C',
      checkpointsCovered: 5,
      totalCheckpoints: 7,
      distanceRemaining: '110 km',
      safetyStatus: 'Normal',
    },
    timeline: [
      { id: 'tl-1', title: 'Trip Created', time: '02 Jun, 2024', status: 'completed' },
      { id: 'tl-2', title: 'Guwahati Airport Pickup', time: '15 Jun, 2024 07:00 AM', status: 'completed' },
      { id: 'tl-3', title: 'Jeep Safari Finished', time: '16 Jun, 2024 03:00 PM', status: 'completed' },
      { id: 'tl-4', title: 'Majuli Island Ferry', time: '18 Jun, 2024', status: 'active' },
    ],
  },
  {
    id: 'TRIP-24072',
    packageName: 'Dehradun Escape',
    packageImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=300&auto=format&fit=crop',
    destination: 'Uttarakhand',
    destinationState: 'Uttarakhand',
    destinationCity: 'Mussoorie',
    agencyId: 'AGY-1009',
    agencyName: 'Himalayan Treks',
    agencyLogo: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=150&auto=format&fit=crop',
    guide: {
      id: 'g-9',
      name: 'Ankit Rawat',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
      phone: '+91 98970 65432',
      isOnline: true,
    },
    departureDate: '20 Jun, 2024',
    departureTime: '09:00 AM',
    returnDate: '24 Jun, 2024',
    returnTime: '06:00 PM',
    duration: '5D / 4N',
    travelersCount: 11,
    maxCapacity: 14,
    vehicle: 'Bolero (UK 07 Z 1122)',
    vehicleType: 'Bolero',
    status: 'Delayed',
    progress: 35,
    rating: 4.5,
    tripType: 'Weekend Getaway',
    revenue: '₹2,64,000',
    heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
    liveStats: {
      travelersCheckedIn: 11,
      totalTravelers: 11,
      seatsFilledPercentage: 78,
      currentLocation: 'Mussoorie Bypass (Traffic Congestion)',
      etaNextStop: '3h 30m (Delayed by 1h 15m)',
      weather: 'Chilly Fog',
      weatherTemp: '16°C',
      checkpointsCovered: 2,
      totalCheckpoints: 6,
      distanceRemaining: '85 km',
      safetyStatus: 'Caution',
    },
    timeline: [
      { id: 'tl-1', title: 'Trip Created', time: '10 Jun, 2024', status: 'completed' },
      { id: 'tl-2', title: 'Boarding at Dehradun Station', time: '20 Jun, 2024 09:30 AM', status: 'completed' },
      { id: 'tl-3', title: 'Hill Road Traffic Delay Notified', time: '20 Jun, 2024 01:15 PM', status: 'active' },
    ],
  },
];

// Additional trips to populate realistic 40+ database
const extraDestinations = [
  { name: 'Varanasi Spiritual Tour', dest: 'Uttar Pradesh', city: 'Varanasi', type: 'Group Tour', price: 280000, img: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=300&auto=format&fit=crop' },
  { name: 'Rann of Kutch Odyssey', dest: 'Gujarat', city: 'Bhuj', type: 'Road Trip', price: 420000, img: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=300&auto=format&fit=crop' },
  { name: 'Hampi Heritage Trail', dest: 'Karnataka', city: 'Hampi', type: 'Group Tour', price: 310000, img: 'https://images.unsplash.com/photo-1600100397608-f010f4438317?q=80&w=300&auto=format&fit=crop' },
  { name: 'Pondicherry French Riviera', dest: 'Pondicherry', city: 'White Town', type: 'Weekend Getaway', price: 240000, img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop' },
  { name: 'Coorg Coffee Highlands', dest: 'Karnataka', city: 'Madikeri', type: 'Private Tour', price: 350000, img: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=300&auto=format&fit=crop' },
  { name: 'Darjeeling Himalayan Toy Train', dest: 'West Bengal', city: 'Darjeeling', type: 'Group Tour', price: 390000, img: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=300&auto=format&fit=crop' },
  { name: 'Ooty Nilgiri Mountain Escapade', dest: 'Tamil Nadu', city: 'Ooty', type: 'Weekend Getaway', price: 260000, img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=300&auto=format&fit=crop' },
  { name: 'Sundarbans Mangrove Safari', dest: 'West Bengal', city: 'Gosaba', type: 'Trekking', price: 330000, img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=300&auto=format&fit=crop' },
  { name: 'Amritsar Golden Heritage', dest: 'Punjab', city: 'Amritsar', type: 'Group Tour', price: 220000, img: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=300&auto=format&fit=crop' },
  { name: 'Rishikesh Rafting & Camping', dest: 'Uttarakhand', city: 'Rishikesh', type: 'Weekend Getaway', price: 190000, img: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=300&auto=format&fit=crop' },
];

for (let i = 11; i <= 45; i++) {
  const meta = extraDestinations[i % extraDestinations.length];
  const statuses: ('Running' | 'Upcoming' | 'Completed' | 'Cancelled' | 'Delayed')[] = ['Running', 'Upcoming', 'Completed', 'Completed', 'Upcoming', 'Running', 'Delayed'];
  const status = statuses[i % statuses.length];
  const progress = status === 'Completed' ? 100 : status === 'Cancelled' ? 0 : status === 'Running' ? 40 + (i * 3) % 55 : (i * 4) % 25;
  const rating = status === 'Completed' || status === 'Running' ? Number((4.3 + (i % 7) * 0.1).toFixed(1)) : null;

  initialTripsData.push({
    id: `TRIP-${24072 - (i - 10)}`,
    packageName: `${meta.name}`,
    packageImage: meta.img,
    destination: meta.dest,
    destinationState: meta.dest,
    destinationCity: meta.city,
    agencyId: `AGY-100${(i % 6) + 1}`,
    agencyName: ['Mountain Trails', 'Wanderlust Holidays', 'Goa Getaways', 'Kashmir Trips', 'Kerala Holidays', 'Royal Roads'][i % 6],
    agencyLogo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=150&auto=format&fit=crop',
    guide: {
      id: `g-${i}`,
      name: ['Rahul Das', 'Tenzin Norbu', 'Amit Verma', 'Irfan Ahmad', 'Sreejith Nair', 'Vikram Singh', 'Manish Kumar', 'Pema Lhamu', 'Ankit Rawat'][i % 9],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
      phone: `+91 98${Math.floor(10000000 + Math.random() * 89999999)}`,
      isOnline: i % 2 === 0,
    },
    departureDate: `${(i % 28) + 1} Jun, 2024`,
    departureTime: '08:00 AM',
    returnDate: `${((i + 5) % 28) + 1} Jun, 2024`,
    returnTime: '06:00 PM',
    duration: '6D / 5N',
    travelersCount: 12 + (i % 12),
    maxCapacity: 20,
    vehicle: ['Tempo Traveller', 'Innova Crysta', 'Mini Bus', 'Bolero'][i % 4] + ` (DL 0${(i % 9) + 1} XY ${1000 + i})`,
    vehicleType: (['Tempo Traveller', 'Innova Crysta', 'Mini Bus', 'Bolero'] as const)[i % 4],
    status,
    progress,
    rating,
    tripType: meta.type as any,
    revenue: `₹${((meta.price * (12 + (i % 8))) / 100000).toFixed(1)} L`,
    heroImage: meta.img,
    liveStats: {
      travelersCheckedIn: Math.floor((12 + (i % 12)) * (progress / 100)),
      totalTravelers: 12 + (i % 12),
      seatsFilledPercentage: Math.round(((12 + (i % 12)) / 20) * 100),
      currentLocation: `${meta.city}, ${meta.dest}`,
      etaNextStop: status === 'Running' ? '2h 10m' : status === 'Completed' ? 'Trip Ended' : 'Awaiting Departure',
      weather: 'Partly Sunny',
      weatherTemp: '24°C',
      checkpointsCovered: Math.floor((progress / 100) * 6),
      totalCheckpoints: 6,
      distanceRemaining: status === 'Running' ? '95 km' : '0 km',
      safetyStatus: 'Normal',
    },
    timeline: [
      { id: 'tl-1', title: 'Trip Scheduled', time: `${i} May, 2024`, status: 'completed' },
      { id: 'tl-2', title: 'Guide & Fleet Assigned', time: `${i + 2} May, 2024`, status: 'completed' },
      { id: 'tl-3', title: 'Operational Route Synchronized', time: `${(i % 28) + 1} Jun, 2024`, status: status === 'Running' ? 'active' : status === 'Completed' ? 'completed' : 'pending' },
    ],
  });
}

// ── Analytics & Widget Initial Data ──
export const initialTripActivityDaily: TripActivityChartPoint[] = [
  { date: 'Jun 1', label: 'Jun 1', trips: 142, travelers: 2450, revenue: 3800000 },
  { date: 'Jun 2', label: 'Jun 2', trips: 165, travelers: 2900, revenue: 4200000 },
  { date: 'Jun 3', label: 'Jun 3', trips: 180, travelers: 3150, revenue: 4900000 },
  { date: 'Jun 4', label: 'Jun 4', trips: 210, travelers: 3800, revenue: 5600000 },
  { date: 'Jun 5', label: 'Jun 5', trips: 195, travelers: 3400, revenue: 5100000 },
  { date: 'Jun 6', label: 'Jun 6', trips: 235, travelers: 4200, revenue: 6400000 },
  { date: 'Jun 7', label: 'Jun 7', trips: 220, travelers: 3950, revenue: 5900000 },
  { date: 'Jun 8', label: 'Jun 8', trips: 250, travelers: 4600, revenue: 7100000 },
  { date: 'Jun 9', label: 'Jun 9', trips: 205, travelers: 3600, revenue: 5400000 },
  { date: 'Jun 10', label: 'Jun 10', trips: 270, travelers: 4950, revenue: 7800000 },
  { date: 'Jun 11', label: 'Jun 11', trips: 240, travelers: 4300, revenue: 6800000 },
  { date: 'Jun 12', label: 'Jun 12', trips: 310, travelers: 5800, revenue: 8900000 },
];

export const initialTripStatusBreakdown: TripStatusBreakdownItem[] = [
  { name: 'Completed', count: 3152, percentage: 73.5, color: '#10B981' },
  { name: 'Running', count: 426, percentage: 9.9, color: '#6356E5' },
  { name: 'Upcoming', count: 318, percentage: 7.4, color: '#3B82F6' },
  { name: 'Delayed', count: 293, percentage: 6.8, color: '#F59E0B' },
  { name: 'Cancelled', count: 97, percentage: 2.4, color: '#EF4444' },
];

export const initialDestinationTrips: DestinationTripItem[] = [
  { destination: 'Ladakh', tripsCount: 840, travelersCount: 12400, percentage: 100 },
  { destination: 'Meghalaya', tripsCount: 710, travelersCount: 10200, percentage: 84 },
  { destination: 'Goa', tripsCount: 620, travelersCount: 9800, percentage: 74 },
  { destination: 'Kashmir', tripsCount: 540, travelersCount: 8100, percentage: 64 },
  { destination: 'Kerala', tripsCount: 480, travelersCount: 7200, percentage: 57 },
  { destination: 'Andaman', tripsCount: 390, travelersCount: 5900, percentage: 46 },
];

export const initialTopTripAgencies: TopAgencyTripItem[] = [
  { id: 'AGY-1001', agencyName: 'Mountain Trails', agencyLogo: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=150&auto=format&fit=crop', trips: 542, travelers: 8940, revenue: '₹1.84 Cr', rating: 4.9, growth: '24.5%', isGrowthPositive: true },
  { id: 'AGY-1002', agencyName: 'Wanderlust Holidays', agencyLogo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=150&auto=format&fit=crop', trips: 486, travelers: 7820, revenue: '₹1.62 Cr', rating: 4.8, growth: '18.2%', isGrowthPositive: true },
  { id: 'AGY-1003', agencyName: 'Goa Getaways', agencyLogo: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=150&auto=format&fit=crop', trips: 412, travelers: 6940, revenue: '₹1.35 Cr', rating: 4.7, growth: '16.4%', isGrowthPositive: true },
  { id: 'AGY-1004', agencyName: 'Kashmir Trips', agencyLogo: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=150&auto=format&fit=crop', trips: 368, travelers: 5800, revenue: '₹1.22 Cr', rating: 4.8, growth: '14.1%', isGrowthPositive: true },
  { id: 'AGY-1005', agencyName: 'Kerala Holidays', agencyLogo: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=150&auto=format&fit=crop', trips: 320, travelers: 4950, revenue: '₹1.08 Cr', rating: 4.6, growth: '11.8%', isGrowthPositive: true },
];

export const initialMonthlyTripSummary: MonthlyTripSummaryData = {
  tripsStarted: '1,248',
  tripsCompleted: '1,180',
  avgDuration: '5.8 Days',
  occupancy: '86.4%',
  avgRating: '4.82 / 5',
  tripSuccessRate: '98.2%',
};

export const initialTripAlerts: TripAlertItem[] = [
  { id: 'alt-1', tripId: 'TRIP-24072', title: 'Trip delayed by 1h 15m', description: 'Hill bypass congestion in Mussoorie. Driver adjusted schedule.', time: '18 mins ago', type: 'delay', severity: 'medium' },
  { id: 'alt-2', tripId: 'TRIP-24075', title: 'Landslide Warning Flagged', description: 'IMD red alert issued for Rohtang pass. Trip safely cancelled.', time: '2 hours ago', type: 'weather', severity: 'high' },
  { id: 'alt-3', tripId: 'TRIP-24078', title: 'Vehicle Replaced Smoothly', description: 'Backup Innova deployed at Gulmarg stop within 25 minutes.', time: '4 hours ago', type: 'vehicle', severity: 'low' },
  { id: 'alt-4', tripId: 'TRIP-24081', title: 'Guide Checked In at Cherrapunji', description: 'Rahul Das confirmed all 16 travelers arrived safely at Eco Park.', time: '5 hours ago', type: 'guide', severity: 'low' },
];

class AdminTripManagementService {
  private trips: AdminTripItem[] = initialTripsData;
  private kpiStats: TripKPIStats = initialTripKPIStats;

  public async getKPIStats(): Promise<TripKPIStats> {
    return new Promise((resolve) => setTimeout(() => resolve(this.kpiStats), 50));
  }

  public async getTrips(filters?: Partial<TripFilters>): Promise<AdminTripItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let result = [...this.trips];

        if (filters) {
          if (filters.status && filters.status !== 'All Status' && filters.status !== 'all') {
            result = result.filter((t) => t.status.toLowerCase() === filters.status?.toLowerCase());
          }
          if (filters.agency && filters.agency !== 'All Agencies' && filters.agency !== 'all') {
            result = result.filter((t) => t.agencyName.toLowerCase().includes(filters.agency!.toLowerCase()));
          }
          if (filters.destination && filters.destination !== 'All Destinations' && filters.destination !== 'all') {
            result = result.filter((t) => t.destination.toLowerCase().includes(filters.destination!.toLowerCase()));
          }
          if (filters.guide && filters.guide !== 'All Guides' && filters.guide !== 'all') {
            result = result.filter((t) => t.guide.name.toLowerCase().includes(filters.guide!.toLowerCase()));
          }
          if (filters.tripType && filters.tripType !== 'All Types' && filters.tripType !== 'all') {
            result = result.filter((t) => t.tripType.toLowerCase() === filters.tripType?.toLowerCase());
          }
          if (filters.city && filters.city !== 'All Cities' && filters.city !== 'all') {
            result = result.filter((t) => t.destinationCity.toLowerCase().includes(filters.city!.toLowerCase()));
          }
          if (filters.state && filters.state !== 'All States' && filters.state !== 'all') {
            result = result.filter((t) => t.destinationState.toLowerCase().includes(filters.state!.toLowerCase()));
          }
          if (filters.search && filters.search.trim() !== '') {
            const q = filters.search.toLowerCase();
            result = result.filter(
              (t) =>
                t.id.toLowerCase().includes(q) ||
                t.packageName.toLowerCase().includes(q) ||
                t.destination.toLowerCase().includes(q) ||
                t.agencyName.toLowerCase().includes(q) ||
                t.guide.name.toLowerCase().includes(q) ||
                t.vehicle.toLowerCase().includes(q)
            );
          }
        }

        resolve(result);
      }, 50);
    });
  }

  public async getTripById(id: string): Promise<AdminTripItem | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const found = this.trips.find((t) => t.id === id) || null;
        resolve(found);
      }, 30);
    });
  }

  public async cancelTrip(id: string): Promise<boolean> {
    this.trips = this.trips.map((t) =>
      t.id === id ? { ...t, status: 'Cancelled' as const, progress: 0 } : t
    );
    return true;
  }

  public async assignGuide(tripId: string, guideName: string): Promise<boolean> {
    this.trips = this.trips.map((t) =>
      t.id === tripId
        ? {
            ...t,
            guide: {
              ...t.guide,
              name: guideName,
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
              isOnline: true,
            },
          }
        : t
    );
    return true;
  }

  public async createTrip(newTrip: Partial<AdminTripItem>): Promise<AdminTripItem> {
    const created: AdminTripItem = {
      id: `TRIP-${Math.floor(24090 + Math.random() * 1000)}`,
      packageName: newTrip.packageName || 'Custom Expedition',
      packageImage: newTrip.packageImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=300&auto=format&fit=crop',
      destination: newTrip.destination || 'Himachal',
      destinationState: newTrip.destinationState || 'Himachal Pradesh',
      destinationCity: newTrip.destinationCity || 'Manali',
      agencyId: newTrip.agencyId || 'AGY-1001',
      agencyName: newTrip.agencyName || 'Mountain Trails',
      agencyLogo: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=150&auto=format&fit=crop',
      guide: newTrip.guide || {
        id: 'g-new',
        name: 'Rahul Das',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
        phone: '+91 98765 43210',
        isOnline: true,
      },
      departureDate: newTrip.departureDate || '25 Jun, 2024',
      departureTime: newTrip.departureTime || '08:00 AM',
      returnDate: newTrip.returnDate || '30 Jun, 2024',
      returnTime: newTrip.returnTime || '06:00 PM',
      duration: newTrip.duration || '6D / 5N',
      travelersCount: newTrip.travelersCount || 16,
      maxCapacity: newTrip.maxCapacity || 20,
      vehicle: newTrip.vehicle || 'Tempo Traveller (DL 01 AB 9988)',
      vehicleType: newTrip.vehicleType || 'Tempo Traveller',
      status: (newTrip.status as any) || 'Upcoming',
      progress: 0,
      rating: null,
      tripType: newTrip.tripType || 'Group Tour',
      revenue: newTrip.revenue || '₹3,84,000',
      heroImage: newTrip.packageImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
      liveStats: {
        travelersCheckedIn: 0,
        totalTravelers: newTrip.travelersCount || 16,
        seatsFilledPercentage: 80,
        currentLocation: 'Basecamp Point',
        etaNextStop: 'Scheduled Departure',
        weather: 'Clear',
        weatherTemp: '24°C',
        checkpointsCovered: 0,
        totalCheckpoints: 6,
        distanceRemaining: '180 km',
        safetyStatus: 'Normal',
      },
      timeline: [
        { id: 'tl-1', title: 'Trip Created by Admin', time: 'Just now', status: 'completed' },
        { id: 'tl-2', title: 'Guide Assigned', time: 'Just now', status: 'completed' },
      ],
    };

    this.trips = [created, ...this.trips];
    return created;
  }

  public async getActivityChartData(): Promise<TripActivityChartPoint[]> {
    return new Promise((resolve) => setTimeout(() => resolve(initialTripActivityDaily), 50));
  }

  public async getStatusBreakdown(): Promise<TripStatusBreakdownItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(initialTripStatusBreakdown), 50));
  }

  public async getDestinationTrips(): Promise<DestinationTripItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(initialDestinationTrips), 50));
  }

  public async getTopAgencies(): Promise<TopAgencyTripItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(initialTopTripAgencies), 50));
  }

  public async getMonthlySummary(): Promise<MonthlyTripSummaryData> {
    return new Promise((resolve) => setTimeout(() => resolve(initialMonthlyTripSummary), 50));
  }

  public async getTripAlerts(): Promise<TripAlertItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(initialTripAlerts), 50));
  }
}

export const adminTripManagementService = new AdminTripManagementService();
