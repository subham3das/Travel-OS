// ─── Agency Panel Trip Travelers Mock Data ────────────────────────────────────

export type PaymentStatus = 'Payment Complete' | 'Payment Pending' | 'Partial';
export type CheckInStatus = 'Checked In' | 'Not Checked In';
export type VerificationStatus = 'Verified' | 'Unverified';

export interface TripTravelerRecord {
  id: string;
  bookingId: string;
  name: string;
  gender?: 'Male' | 'Female' | 'Other';
  age?: number;
  phone: string;
  email?: string;
  avatar: string;
  travelerCount: number;
  seatNumbers: string[];
  roleInBooking?: 'Primary Traveler' | 'Travel Partner';
  primaryTravelerName?: string;
  paymentStatus: PaymentStatus;
  checkInStatus: CheckInStatus;
  verificationStatus: VerificationStatus;
  hasMedicalNotes: boolean;
  medicalNotesText?: string;
  emergencyContact: {
    name: string;
    phone: string;
  };
}

export interface TripTravelGroup {
  groupId: string; // e.g. "TG-BK-2024-00568"
  bookingId: string; // "BK-2024-00568"
  groupName: string; // e.g. "Travel Group #1"
  groupCategory: 'Family' | 'Friends' | 'Solo' | 'Group';
  paymentStatus: 'Payment Complete' | 'Payment Pending';
  primaryTraveler: TripTravelerRecord;
  companions: TripTravelerRecord[];
  totalTravelersCount: number;
}

export interface QuickContact {
  id: string;
  label: string;
  sublabel: string;
  phone: string;
  iconType: 'phone' | 'person' | 'hotel';
}

export const MOCK_TRIP_TRAVELERS: TripTravelerRecord[] = [
  {
    id: 'tv-1',
    bookingId: 'BK-2024-00568',
    name: 'Rohit Sharma',
    gender: 'Male',
    age: 32,
    phone: '+91 98765 43210',
    email: 'rohit.sharma@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    travelerCount: 4,
    seatNumbers: ['12A'],
    roleInBooking: 'Primary Traveler',
    paymentStatus: 'Payment Complete',
    checkInStatus: 'Checked In',
    verificationStatus: 'Verified',
    hasMedicalNotes: false,
    emergencyContact: { name: 'Rohit Sharma', phone: '+91 98765 00000' },
  },
  {
    id: 'tv-1b',
    bookingId: 'BK-2024-00568',
    name: 'Rahul Das',
    gender: 'Male',
    age: 26,
    phone: '+91 98765 11111',
    email: 'rahul.das@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    travelerCount: 4,
    seatNumbers: ['12B'],
    roleInBooking: 'Travel Partner',
    primaryTravelerName: 'Rohit Sharma',
    paymentStatus: 'Payment Complete',
    checkInStatus: 'Checked In',
    verificationStatus: 'Verified',
    hasMedicalNotes: false,
    emergencyContact: { name: 'Rohit Sharma', phone: '+91 98765 00000' },
  },
  {
    id: 'tv-1c',
    bookingId: 'BK-2024-00568',
    name: 'Aman Sharma',
    gender: 'Male',
    age: 28,
    phone: '+91 98765 22222',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200',
    travelerCount: 4,
    seatNumbers: ['12C'],
    roleInBooking: 'Travel Partner',
    primaryTravelerName: 'Rohit Sharma',
    paymentStatus: 'Payment Complete',
    checkInStatus: 'Not Checked In',
    verificationStatus: 'Verified',
    hasMedicalNotes: false,
    emergencyContact: { name: 'Rohit Sharma', phone: '+91 98765 00000' },
  },
  {
    id: 'tv-1d',
    bookingId: 'BK-2024-00568',
    name: 'Priya Singh',
    gender: 'Female',
    age: 24,
    phone: '+91 98765 33333',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200',
    travelerCount: 4,
    seatNumbers: ['12D'],
    roleInBooking: 'Travel Partner',
    primaryTravelerName: 'Rohit Sharma',
    paymentStatus: 'Payment Complete',
    checkInStatus: 'Not Checked In',
    verificationStatus: 'Verified',
    hasMedicalNotes: true,
    medicalNotesText: 'Mild motion sickness, carries medication',
    emergencyContact: { name: 'Rohit Sharma', phone: '+91 98765 00000' },
  },
  {
    id: 'tv-2',
    bookingId: 'BK-2024-00569',
    name: 'Priya Mehta',
    gender: 'Female',
    age: 29,
    phone: '+91 98111 55443',
    email: 'priya.m@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    travelerCount: 2,
    seatNumbers: ['14C'],
    roleInBooking: 'Primary Traveler',
    paymentStatus: 'Payment Complete',
    checkInStatus: 'Not Checked In',
    verificationStatus: 'Verified',
    hasMedicalNotes: false,
    emergencyContact: { name: 'Neha Mehta', phone: '+91 99887 77665' },
  },
  {
    id: 'tv-2b',
    bookingId: 'BK-2024-00569',
    name: 'Simran Mehta',
    gender: 'Female',
    age: 27,
    phone: '+91 98111 00001',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    travelerCount: 2,
    seatNumbers: ['14D'],
    roleInBooking: 'Travel Partner',
    primaryTravelerName: 'Priya Mehta',
    paymentStatus: 'Payment Complete',
    checkInStatus: 'Not Checked In',
    verificationStatus: 'Verified',
    hasMedicalNotes: false,
    emergencyContact: { name: 'Priya Mehta', phone: '+91 98111 55443' },
  },
  {
    id: 'tv-3',
    bookingId: 'BK-2024-00566',
    name: 'Vikram Patel',
    gender: 'Male',
    age: 31,
    phone: '+91 99887 76655',
    email: 'vikram.p@example.com',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
    travelerCount: 1,
    seatNumbers: ['16A'],
    roleInBooking: 'Primary Traveler',
    paymentStatus: 'Payment Complete',
    checkInStatus: 'Checked In',
    verificationStatus: 'Verified',
    hasMedicalNotes: false,
    emergencyContact: { name: 'Nilesh Patel', phone: '+91 99887 00000' },
  },
];

export const MOCK_TRIP_TRAVEL_GROUPS: TripTravelGroup[] = [
  {
    groupId: 'TG-BK-2024-00568',
    bookingId: 'BK-2024-00568',
    groupName: 'Travel Group #1',
    groupCategory: 'Family',
    paymentStatus: 'Payment Complete',
    primaryTraveler: MOCK_TRIP_TRAVELERS[0],
    companions: [MOCK_TRIP_TRAVELERS[1], MOCK_TRIP_TRAVELERS[2], MOCK_TRIP_TRAVELERS[3]],
    totalTravelersCount: 4,
  },
  {
    groupId: 'TG-BK-2024-00569',
    bookingId: 'BK-2024-00569',
    groupName: 'Travel Group #2',
    groupCategory: 'Friends',
    paymentStatus: 'Payment Complete',
    primaryTraveler: MOCK_TRIP_TRAVELERS[4],
    companions: [MOCK_TRIP_TRAVELERS[5]],
    totalTravelersCount: 2,
  },
  {
    groupId: 'TG-BK-2024-00566',
    bookingId: 'BK-2024-00566',
    groupName: 'Solo Traveler',
    groupCategory: 'Solo',
    paymentStatus: 'Payment Complete',
    primaryTraveler: MOCK_TRIP_TRAVELERS[6],
    companions: [],
    totalTravelersCount: 1,
  },
];

export const MOCK_QUICK_CONTACTS: QuickContact[] = [
  {
    id: 'qc-1',
    label: 'Emergency Call',
    sublabel: '24/7 Support',
    phone: '+91 98765 43210',
    iconType: 'phone',
  },
  {
    id: 'qc-2',
    label: 'Trip Coordinator',
    sublabel: 'Ankit Verma',
    phone: '+91 87654 32100',
    iconType: 'person',
  },
  {
    id: 'qc-3',
    label: 'Hotel Contact',
    sublabel: 'Leh Hotel',
    phone: '+91 94195 67890',
    iconType: 'hotel',
  },
];
