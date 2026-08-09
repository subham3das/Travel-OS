// ─── Agency Panel Staff & Team Management Mock Data ─────────────────────────

export type StaffRole = 'Tour Guide' | 'Assistant Guide' | 'Driver' | 'Coordinator' | 'Photographer';
export type StaffAvailability = 'Available' | 'Busy' | 'On Leave';

export interface AssignedStaffMember {
  id: string;
  role: StaffRole;
  name: string;
  phone: string;
  experienceText: string;
  avatar: string;
  isOnline: boolean;
  isAssigned: boolean;
}

export interface AvailableStaffMember {
  id: string;
  name: string;
  role: StaffRole;
  languages: string[];
  experienceYears: number;
  rating: number;
  reviewCount: number;
  tripsAssignedCount: number;
  availability: StaffAvailability;
  avatar: string;
  phone: string;
  isAssigned?: boolean;
}

export interface AssignedVehicleInfo {
  id: string;
  name: string;
  registrationNumber: string;
  capacityText: string;
  hasAC: boolean;
  driverName: string;
  image: string;
}

export interface TripContact {
  id: string;
  title: string;
  phone: string;
}

export interface TeamInternalNote {
  id: string;
  noteText: string;
  author: string;
  timestampText: string;
  theme: 'purple' | 'amber' | 'blue';
}

export const MOCK_ASSIGNED_TEAM: AssignedStaffMember[] = [
  {
    id: 'ast-1',
    role: 'Tour Guide',
    name: 'Rohit Sharma',
    phone: '+91 98765 43210',
    experienceText: '5 Years Exp.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    isOnline: true,
    isAssigned: true,
  },
  {
    id: 'ast-2',
    role: 'Assistant Guide',
    name: 'Ananya Das',
    phone: '+91 87654 32109',
    experienceText: '3 Years Exp.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    isOnline: true,
    isAssigned: true,
  },
  {
    id: 'ast-3',
    role: 'Driver',
    name: 'Manoj Negi',
    phone: '+91 87654 32108',
    experienceText: '8 Years Exp.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    isOnline: true,
    isAssigned: true,
  },
  {
    id: 'ast-4',
    role: 'Coordinator',
    name: 'Ankit Verma',
    phone: '+91 76543 21098',
    experienceText: '4 Years Exp.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    isOnline: true,
    isAssigned: true,
  },
  {
    id: 'ast-5',
    role: 'Photographer',
    name: 'Vikas Rawat',
    phone: '+91 76543 21098',
    experienceText: '4 Years Exp.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
    isOnline: false,
    isAssigned: false,
  },
];

export const MOCK_AVAILABLE_STAFF: AvailableStaffMember[] = [
  {
    id: 'st-1',
    name: 'Tsering Namgyal',
    role: 'Tour Guide',
    languages: ['Hindi', 'English', 'Ladakhi'],
    experienceYears: 6,
    rating: 4.8,
    reviewCount: 128,
    tripsAssignedCount: 0,
    availability: 'Available',
    phone: '+91 98765 11111',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200',
  },
  {
    id: 'st-2',
    name: 'Pema Dorje',
    role: 'Tour Guide',
    languages: ['Hindi', 'English', 'Tibetan'],
    experienceYears: 4,
    rating: 4.6,
    reviewCount: 96,
    tripsAssignedCount: 1,
    availability: 'Available',
    phone: '+91 98765 22222',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=200',
  },
  {
    id: 'st-3',
    name: 'Sandeep Thapa',
    role: 'Driver',
    languages: ['Hindi', 'Nepali'],
    experienceYears: 10,
    rating: 4.7,
    reviewCount: 210,
    tripsAssignedCount: 0,
    availability: 'Available',
    phone: '+91 98765 33333',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200',
  },
  {
    id: 'st-4',
    name: 'Nabin Rai',
    role: 'Driver',
    languages: ['Hindi', 'Nepali'],
    experienceYears: 7,
    rating: 4.5,
    reviewCount: 132,
    tripsAssignedCount: 1,
    availability: 'Available',
    phone: '+91 98765 44444',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200',
  },
  {
    id: 'st-5',
    name: 'Megha Singh',
    role: 'Coordinator',
    languages: ['Hindi', 'English'],
    experienceYears: 3,
    rating: 4.9,
    reviewCount: 87,
    tripsAssignedCount: 0,
    availability: 'Available',
    phone: '+91 98765 55555',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200',
  },
];

export const MOCK_ASSIGNED_VEHICLE: AssignedVehicleInfo = {
  id: 'veh-1',
  name: 'Tempo Traveller',
  registrationNumber: 'UK 07 PA 1234',
  capacityText: '17+1 Seater',
  hasAC: true,
  driverName: 'Manoj Negi',
  image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300',
};

export const MOCK_TRIP_CONTACTS: TripContact[] = [
  { id: 'c-1', title: 'Emergency Support', phone: '+91 98765 43210' },
  { id: 'c-2', title: 'Agency Office', phone: '+91 76543 21090' },
  { id: 'c-3', title: 'Hotel Contact (Leh)', phone: '+91 94195 67890' },
  { id: 'c-4', title: 'Local Coordinator', phone: '+91 87654 32100' },
];

export const MOCK_TEAM_NOTES: TeamInternalNote[] = [
  {
    id: 'tn-1',
    noteText: 'Rohit is very experienced in high altitude routes.',
    author: 'Ankit Verma',
    timestampText: '10 May, 09:30 AM',
    theme: 'purple',
  },
  {
    id: 'tn-2',
    noteText: 'Driver Manoj has completed this route 15+ times.',
    author: 'Ankit Verma',
    timestampText: '10 May, 09:35 AM',
    theme: 'amber',
  },
  {
    id: 'tn-3',
    noteText: 'Megha will handle all traveler queries and coordination.',
    author: 'Ankit Verma',
    timestampText: '10 May, 09:40 AM',
    theme: 'blue',
  },
];
