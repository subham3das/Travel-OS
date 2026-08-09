// ─── Agency Panel Trip Details & Operations Mock Data ──────────────────────────

export interface TeamMember {
  id: string;
  role: 'Tour Guide' | 'Driver' | 'Coordinator' | 'Vehicle';
  name: string;
  phone?: string;
  type?: string;
  avatar: string;
}

export interface TripTraveler {
  id: string;
  name: string;
  bookingId: string;
  phone: string;
  avatar: string;
  paymentStatus: 'Paid' | 'Pending' | 'Partial';
  checkInStatus: 'Checked In' | 'Pending' | 'Not Arrived';
  emergencyContact: {
    name: string;
    phone: string;
  };
}

export interface ItineraryItem {
  id: string;
  time: string;
  activity: string;
  status?: string;
}

export interface TripAnnouncement {
  id: string;
  message: string;
  dateText: string;
  timeText: string;
}

export interface TripTimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  iconType: 'created' | 'confirmed' | 'assigned' | 'started' | 'completed';
}

export interface InternalNote {
  id: string;
  noteText: string;
  author: string;
  timestampText: string;
}

// ─── Trip Operations Data Model (Backend-ready) ─────────────────────────────
// GET  /api/agency/trips/:id/operations
// PUT  /api/agency/trips/:id/operations
// POST /api/agency/trips/:id/team
// POST /api/agency/trips/:id/vehicle

export interface AssignedTeamMember {
  id: string;
  name: string;
  role: 'Trip Manager' | 'Trip Host' | 'Guide' | 'Driver' | 'Support Staff' | 'Photographer' | 'Medical Staff';
  phone?: string;
  avatar: string;
}

export interface AssignedVehicle {
  id: string;
  name: string;
  registrationNumber: string;
  type: string;
  capacity: number;
  assignedDriver: string;
  status: 'Available' | 'Assigned' | 'Maintenance';
  image: string;
}

export interface HotelInfo {
  hotelName: string;
  address: string;
  checkInTime: string;
  checkOutTime: string;
  roomAllocationNotes: string;
}

export interface EmergencyInfo {
  contactPerson: string;
  contactPhone: string;
  nearestHospital: string;
  nearestPoliceStation: string;
  backupVehicleContact: string;
  additionalNotes: string;
}

export interface OperationsChecklistItem {
  id: 'team' | 'vehicle' | 'hotel' | 'emergency';
  label: string;
  isCompleted: boolean;
}

export interface TripOperationsData {
  teamAssignments: AssignedTeamMember[] | null;
  vehicleAssignments: AssignedVehicle[] | null;
  hotelInformation: HotelInfo | null;
  emergencyInformation: EmergencyInfo | null;
  operationsChecklist: OperationsChecklistItem[];
  completionPercentage: number;
  status: 'Pending Setup' | 'Upcoming';
}

export interface DetailedTripInfo {

  id: string;
  tripId: string;
  packageName: string;
  coverImage: string;
  statusText: string;
  statusCategory: 'Pending Setup' | 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
  dateRangeText: string;
  durationText: string;
  destinationRoute: string;
  travelerCount: number;
  capacity: number;
  totalRevenue: string;
  status: string;
  departureDate: string;
  returnDate: string;
  vehicleName: string;
  guideName: string;
  coordinatorName: string;
  driverName: string;
}

export const MOCK_TRIP_DETAILS: DetailedTripInfo = {
  id: 'trip-1',
  tripId: 'LD-1505-2024',
  packageName: 'Ladakh Expedition',
  coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800',
  statusText: 'Starts Tomorrow',
  statusCategory: 'Upcoming',
  dateRangeText: '15 May – 22 May 2024 (7D / 6N)',
  durationText: '7 Days / 6 Nights',
  destinationRoute: 'Leh, Nubra, Pangong, Tso Moriri',
  travelerCount: 18,
  capacity: 24,
  totalRevenue: '₹2,16,000',
  status: 'Confirmed',
  departureDate: '15 May 2024',
  returnDate: '22 May 2024',
  vehicleName: 'Tempo Traveller',
  guideName: 'Rohit Sharma',
  coordinatorName: 'Ankit Verma',
  driverName: 'Manoj Negi',
};

export const MOCK_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm-1',
    role: 'Tour Guide',
    name: 'Rohit Sharma',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
  },
  {
    id: 'tm-2',
    role: 'Driver',
    name: 'Manoj Negi',
    phone: '+91 87654 32109',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
  },
  {
    id: 'tm-3',
    role: 'Coordinator',
    name: 'Ankit Verma',
    phone: '+91 76543 21098',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
  },
  {
    id: 'tm-4',
    role: 'Vehicle',
    name: 'UK 07 PA 1234',
    type: 'Tempo Traveller',
    avatar: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=200',
  },
];

export const MOCK_TRAVELERS: TripTraveler[] = [
  {
    id: 'tr-1',
    name: 'Priya Nair',
    bookingId: 'BK-1023',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    paymentStatus: 'Paid',
    checkInStatus: 'Pending',
    emergencyContact: {
      name: 'Rohit Nair',
      phone: '+91 76543 21098',
    },
  },
  {
    id: 'tr-2',
    name: 'Arjun Mehta',
    bookingId: 'BK-1024',
    phone: '+91 87654 32109',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    paymentStatus: 'Paid',
    checkInStatus: 'Checked In',
    emergencyContact: {
      name: 'Neha Mehta',
      phone: '+91 99887 77665',
    },
  },
  {
    id: 'tr-3',
    name: 'Sneha Kapoor',
    bookingId: 'BK-1025',
    phone: '+91 76543 21098',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    paymentStatus: 'Pending',
    checkInStatus: 'Pending',
    emergencyContact: {
      name: 'Rohan Kapoor',
      phone: '+91 90000 11122',
    },
  },
];

export const MOCK_ITINERARY: ItineraryItem[] = [
  { id: 'it-1', time: '08:00 AM', activity: 'Leh Airport Pickup' },
  { id: 'it-2', time: '10:30 AM', activity: 'Hotel Check-in' },
  { id: 'it-3', time: '01:00 PM', activity: 'Lunch' },
  { id: 'it-4', time: '04:00 PM', activity: 'Shanti Stupa Visit' },
  { id: 'it-5', time: '07:30 PM', activity: 'Welcome Dinner' },
];

export const MOCK_ANNOUNCEMENTS: TripAnnouncement[] = [
  {
    id: 'anc-1',
    message: 'Bus will depart at 7:00 AM tomorrow.',
    dateText: '11 May',
    timeText: '09:30 AM',
  },
  {
    id: 'anc-2',
    message: 'Carry your ID proof and warm clothes.',
    dateText: '11 May',
    timeText: '08:15 AM',
  },
  {
    id: 'anc-3',
    message: 'Hotel in Nubra changed. Check new details.',
    dateText: '10 May',
    timeText: '06:45 PM',
  },
];

export const MOCK_TRIP_TIMELINE: TripTimelineEvent[] = [
  {
    id: 'tl-1',
    timestamp: '10 May, 10:30 AM',
    title: 'Trip Created',
    iconType: 'created',
  },
  {
    id: 'tl-2',
    timestamp: '12 May, 11:20 AM',
    title: 'Travelers Confirmed',
    iconType: 'confirmed',
  },
  {
    id: 'tl-3',
    timestamp: '14 May, 06:00 PM',
    title: 'Guide & Vehicle Assigned',
    iconType: 'assigned',
  },
];

export const MOCK_INTERNAL_NOTES: InternalNote[] = [
  {
    id: 'note-1',
    noteText: 'Room 203 requested vegetarian meals.',
    author: 'Ankit Verma',
    timestampText: '14 May, 05:30 PM',
  },
  {
    id: 'note-2',
    noteText: 'Priya Nair has asthma. Keep inhaler handy.',
    author: 'Rohit Sharma',
    timestampText: '14 May, 04:10 PM',
  },
];
