// ─── Agency Bookings & Booking Groups Repository ───────────────────────────────

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REFUNDED' | 'COMPLETED';

export type PaymentStatus = 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'REFUNDED';

export type TripEligibility = 'ELIGIBLE' | 'NOT_ELIGIBLE';

export type BookingGroupStatus =
  | 'OPEN'
  | 'READY_FOR_TRIP'
  | 'MINIMUM_NOT_REACHED'
  | 'MOVED_TO_TRIP'
  | 'CANCELLED';

export type TripReadyReason =
  | 'CAPACITY_REACHED'
  | 'BOOKING_DEADLINE_EXPIRED'
  | 'MANUAL';

export interface TravelPartner {
  id: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  dob?: string;
  phone?: string;
  email?: string;
  idProofType?: string;
  idProofNumber?: string;
  emergencyContact?: string;
  medicalNotes?: string;
  isPrimary?: boolean;
}

export interface BookingOwnerInfo extends TravelPartner {
  isPrimary: true;
}

export interface TravelerInfo {
  name: string;
  phone: string;
  email: string;
  emergencyPhone?: string;
  idProofType?: string;
}

export interface BookingTimelineItem {
  title: string;
  timestamp?: string;
  completed: boolean;
  active?: boolean;
}

export interface PaymentHistoryItem {
  id: string;
  amount: number;
  date: string;
  method: string;
  reference: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
}

export interface AgencyBooking {
  id: string; // e.g. BK-2024-00568
  packageId: string;
  packageName: string;
  coverImage: string;
  departureDate: string;
  returnDate: string;
  bookingDate: string;
  travelerCount: number; // owner + partners length
  packagePrice: number; // e.g. 18999 per traveler
  totalAmount: number; // packagePrice * travelerCount
  amountPaid: number;
  remainingAmount: number; // totalAmount - amountPaid
  dueDate: string;
  owner: BookingOwnerInfo;
  partners: TravelPartner[];
  traveler: TravelerInfo; // fallback alias
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  tripEligibility: TripEligibility; // Computed: CONFIRMED + PAID -> ELIGIBLE
  specialRequests?: string;
  timeline: BookingTimelineItem[];
  paymentHistory: PaymentHistoryItem[];
  assignedTripId?: string;
  assignedTripName?: string;
}

export interface BookingGroup {
  groupId: string; // e.g. GRP-pkg-ladakh-1-2024-06-15
  packageId: string;
  packageName: string;
  coverImage: string;
  departureDate: string;
  returnDate: string;
  minTravelers: number;
  maxCapacity: number;
  confirmedTravelerCount: number;
  fullyPaidTravelerCount: number;
  pendingPaymentTravelerCount: number;
  totalBookingsCount: number;
  pendingCount: number;
  cancelledCount: number;
  deadlineDate: string;
  deadlineText: string;
  isDeadlineExpired: boolean;
  groupStatus: BookingGroupStatus;
  tripReadyReason?: TripReadyReason;
  assignedTripId?: string;
  expectedRevenue: number;
  bookings: AgencyBooking[];
}

export function computeTripEligibility(
  bookingStatus: BookingStatus,
  paymentStatus: PaymentStatus
): TripEligibility {
  return bookingStatus === 'CONFIRMED' && paymentStatus === 'PAID' ? 'ELIGIBLE' : 'NOT_ELIGIBLE';
}

export const MOCK_AGENCY_BOOKINGS: AgencyBooking[] = [
  // ── Group 0: Magical Meghalaya Tour (20 May 2025) ──
  {
    id: 'BK-2025-0012',
    packageId: 'package-001',
    packageName: 'Magical Meghalaya Tour',
    coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
    departureDate: '20 May 2025',
    returnDate: '25 May 2025',
    bookingDate: '12 May 2025',
    travelerCount: 2,
    packagePrice: 22500,
    totalAmount: 45000,
    amountPaid: 45000,
    remainingAmount: 0,
    dueDate: '18 May 2025',
    owner: {
      id: 'cust-1',
      name: 'Subham Das',
      gender: 'Male',
      age: 32,
      phone: '+91 98765 43210',
      email: 'subhamdas@gmail.com',
      idProofType: 'Aadhaar Card',
      idProofNumber: '9988-7766-5544',
      emergencyContact: '+91 98765 00000',
      isPrimary: true,
    },
    partners: [
      {
        id: 'TP-100',
        name: 'Rahul Sharma',
        gender: 'Male',
        age: 30,
        phone: '+91 98765 11111',
        email: 'rahulsharma@gmail.com',
        idProofType: 'Aadhaar Card',
        idProofNumber: '1122-3344-5566',
        emergencyContact: '+91 98765 00000',
      },
    ],
    traveler: {
      name: 'Subham Das',
      phone: '+91 98765 43210',
      email: 'subhamdas@gmail.com',
      emergencyPhone: '+91 98765 00000',
      idProofType: 'Aadhaar Card',
    },
    bookingStatus: 'CONFIRMED',
    paymentStatus: 'PAID',
    tripEligibility: 'ELIGIBLE',
    specialRequests: 'Pure Vegetarian meals preferred',
    assignedTripId: 'trip-001',
    assignedTripName: 'Meghalaya Adventure & Living Root Trail',
    timeline: [
      { title: 'Booking Placed', timestamp: '12 May 2025, 10:30 AM', completed: true },
      { title: 'Payment Confirmed (₹45,000)', timestamp: '12 May 2025, 10:32 AM', completed: true },
      { title: 'Documents Verified', timestamp: '13 May 2025, 02:15 PM', completed: true },
      { title: 'Moved to Active Trip', timestamp: '14 May 2025, 09:00 AM', completed: true, active: true },
    ],
    paymentHistory: [
      { id: 'PAY-1', amount: 45000, date: '12 May 2025', method: 'UPI Online', reference: 'TXN-9988112233', status: 'SUCCESS' },
    ],
  },
  // ── Group 1: Ladakh Adventure Expedition (15 Jun 2024) ──
  {
    id: 'BK-2024-00568',
    packageId: 'pkg-ladakh-1',
    packageName: 'Ladakh Adventure Expedition',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80',
    departureDate: '15 Jun 2024',
    returnDate: '21 Jun 2024',
    bookingDate: '02 May 2024',
    travelerCount: 4,
    packagePrice: 18999,
    totalAmount: 75996,
    amountPaid: 75996,
    remainingAmount: 0,
    dueDate: '10 Jun 2024',
    owner: {
      id: 'TP-101',
      name: 'Rohit Sharma',
      gender: 'Male',
      age: 32,
      phone: '+91 98765 43210',
      email: 'rohit.sharma@example.com',
      idProofType: 'Aadhaar Card',
      idProofNumber: '9988-7766-5544',
      emergencyContact: '+91 98765 00000',
      isPrimary: true,
    },
    partners: [
      {
        id: 'TP-102',
        name: 'Rahul Das',
        gender: 'Male',
        age: 26,
        phone: '+91 98765 11111',
        email: 'rahul.das@example.com',
        idProofType: 'Aadhaar Card',
        idProofNumber: '1122-3344-5566',
        emergencyContact: '+91 98765 00000',
        medicalNotes: 'No medical conditions',
      },
      {
        id: 'TP-103',
        name: 'Aman Sharma',
        gender: 'Male',
        age: 28,
        phone: '+91 98765 22222',
        idProofType: 'Driving License',
        idProofNumber: 'DL-0420119982',
        emergencyContact: '+91 98765 00000',
      },
      {
        id: 'TP-104',
        name: 'Priya Singh',
        gender: 'Female',
        age: 24,
        phone: '+91 98765 33333',
        idProofType: 'Passport',
        idProofNumber: 'Z8899221',
        emergencyContact: '+91 98765 00000',
        medicalNotes: 'Vegetarian meal preference',
      },
    ],
    traveler: {
      name: 'Rohit Sharma',
      phone: '+91 98765 43210',
      email: 'rohit.sharma@example.com',
      emergencyPhone: '+91 98765 00000',
      idProofType: 'Aadhaar Card',
    },
    bookingStatus: 'CONFIRMED',
    paymentStatus: 'PAID',
    tripEligibility: 'ELIGIBLE',
    specialRequests: 'Vegetarian meals required for group.',
    timeline: [
      { title: 'Booking Created', timestamp: '02 May 2024, 10:30 AM', completed: true },
      { title: 'Full Payment Received', timestamp: '02 May 2024, 10:35 AM', completed: true },
      { title: 'Confirmed & Eligible for Trip', timestamp: '02 May 2024, 11:00 AM', completed: true, active: true },
    ],
    paymentHistory: [
      {
        id: 'PAY-1001',
        amount: 75996,
        date: '02 May 2024',
        method: 'UPI (Razorpay)',
        reference: 'TXN-99882211',
        status: 'SUCCESS',
      },
    ],
  },
  {
    id: 'BK-2024-00569',
    packageId: 'pkg-ladakh-1',
    packageName: 'Ladakh Adventure Expedition',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80',
    departureDate: '15 Jun 2024',
    returnDate: '21 Jun 2024',
    bookingDate: '03 May 2024',
    travelerCount: 6,
    packagePrice: 18999,
    totalAmount: 113994,
    amountPaid: 113994,
    remainingAmount: 0,
    dueDate: '10 Jun 2024',
    owner: {
      id: 'TP-201',
      name: 'Priya Mehta',
      gender: 'Female',
      age: 29,
      phone: '+91 98111 55443',
      email: 'priya.m@example.com',
      idProofType: 'Passport',
      idProofNumber: 'P7788112',
      isPrimary: true,
    },
    partners: [
      { id: 'TP-202', name: 'Simran Mehta', gender: 'Female', age: 27, phone: '+91 98111 00001' },
      { id: 'TP-203', name: 'Siddharth Rao', gender: 'Male', age: 30, phone: '+91 98111 00002' },
      { id: 'TP-204', name: 'Divya Iyer', gender: 'Female', age: 28, phone: '+91 98111 00003' },
      { id: 'TP-205', name: 'Kunal Kapoor', gender: 'Male', age: 31, phone: '+91 98111 00004' },
      { id: 'TP-206', name: 'Rohan Sharma', gender: 'Male', age: 29, phone: '+91 98111 00005' },
    ],
    traveler: {
      name: 'Priya Mehta',
      phone: '+91 98111 55443',
      email: 'priya.m@example.com',
    },
    bookingStatus: 'CONFIRMED',
    paymentStatus: 'PAID',
    tripEligibility: 'ELIGIBLE',
    timeline: [
      { title: 'Booking Created', timestamp: '03 May 2024', completed: true },
      { title: 'Full Payment Received', timestamp: '03 May 2024', completed: true },
      { title: 'Confirmed & Eligible for Trip', timestamp: '03 May 2024', completed: true, active: true },
    ],
    paymentHistory: [
      {
        id: 'PAY-1002',
        amount: 113994,
        date: '03 May 2024',
        method: 'Credit Card',
        reference: 'TXN-44332211',
        status: 'SUCCESS',
      },
    ],
  },
  {
    id: 'BK-2024-00570',
    packageId: 'pkg-ladakh-1',
    packageName: 'Ladakh Adventure Expedition',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80',
    departureDate: '15 Jun 2024',
    returnDate: '21 Jun 2024',
    bookingDate: '04 May 2024',
    travelerCount: 10,
    packagePrice: 18999,
    totalAmount: 189990,
    amountPaid: 189990,
    remainingAmount: 0,
    dueDate: '10 Jun 2024',
    owner: {
      id: 'TP-301',
      name: 'Arjun Kapoor',
      gender: 'Male',
      age: 34,
      phone: '+91 97777 88899',
      email: 'arjun.k@example.com',
      isPrimary: true,
    },
    partners: [
      { id: 'TP-302', name: 'Varun Dhawan', gender: 'Male', age: 33 },
      { id: 'TP-303', name: 'Kriti Sanon', gender: 'Female', age: 31 },
      { id: 'TP-304', name: 'Shraddha Kapoor', gender: 'Female', age: 32 },
      { id: 'TP-305', name: 'Aditya Roy', gender: 'Male', age: 35 },
      { id: 'TP-306', name: 'Vicky Kaushal', gender: 'Male', age: 34 },
      { id: 'TP-307', name: 'Katrina Kaif', gender: 'Female', age: 36 },
      { id: 'TP-308', name: 'Ranbir Kapoor', gender: 'Male', age: 37 },
      { id: 'TP-309', name: 'Alia Bhatt', gender: 'Female', age: 30 },
      { id: 'TP-310', name: 'Ranveer Singh', gender: 'Male', age: 35 },
    ],
    traveler: {
      name: 'Arjun Kapoor',
      phone: '+91 97777 88899',
      email: 'arjun.k@example.com',
    },
    bookingStatus: 'CONFIRMED',
    paymentStatus: 'PAID',
    tripEligibility: 'ELIGIBLE',
    timeline: [
      { title: 'Booking Created', timestamp: '04 May 2024', completed: true },
      { title: 'Full Payment Received', timestamp: '04 May 2024', completed: true },
      { title: 'Confirmed & Eligible for Trip', timestamp: '04 May 2024', completed: true, active: true },
    ],
    paymentHistory: [
      {
        id: 'PAY-1003',
        amount: 189990,
        date: '04 May 2024',
        method: 'Net Banking',
        reference: 'TXN-77889900',
        status: 'SUCCESS',
      },
    ],
  },

  // ── Group 2: Meghalaya Explorer (22 Jun 2024) ──
  {
    id: 'BK-2024-00567',
    packageId: 'pkg-meghalaya-2',
    packageName: 'Meghalaya Explorer',
    coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=500&q=80',
    departureDate: '22 Jun 2024',
    returnDate: '26 Jun 2024',
    bookingDate: '01 May 2024',
    travelerCount: 8,
    packagePrice: 17999,
    totalAmount: 143992,
    amountPaid: 143992,
    remainingAmount: 0,
    dueDate: '15 Jun 2024',
    owner: {
      id: 'TP-401',
      name: 'Ananya Das',
      gender: 'Female',
      age: 26,
      phone: '+91 91234 56789',
      email: 'ananya.das@example.com',
      emergencyContact: '+91 91234 00000',
      idProofType: 'Passport',
      isPrimary: true,
    },
    partners: [
      { id: 'TP-402', name: 'Riya Das', gender: 'Female', age: 24 },
      { id: 'TP-403', name: 'Tania Sen', gender: 'Female', age: 26 },
      { id: 'TP-404', name: 'Sourav Paul', gender: 'Male', age: 27 },
      { id: 'TP-405', name: 'Debashis Roy', gender: 'Male', age: 28 },
      { id: 'TP-406', name: 'Sanchari Ghosh', gender: 'Female', age: 25 },
      { id: 'TP-407', name: 'Subhadip Chatterjee', gender: 'Male', age: 27 },
      { id: 'TP-408', name: 'Mousumi Dutta', gender: 'Female', age: 26 },
    ],
    traveler: {
      name: 'Ananya Das',
      phone: '+91 91234 56789',
      email: 'ananya.das@example.com',
      emergencyPhone: '+91 91234 00000',
      idProofType: 'Passport',
    },
    bookingStatus: 'CONFIRMED',
    paymentStatus: 'PAID',
    tripEligibility: 'ELIGIBLE',
    specialRequests: 'Need airport pickup at Guwahati 10:00 AM.',
    timeline: [
      { title: 'Booking Created', timestamp: '01 May 2024', completed: true },
      { title: 'Full Payment Received', timestamp: '01 May 2024', completed: true },
      { title: 'Confirmed & Eligible for Trip', timestamp: '01 May 2024', completed: true, active: true },
    ],
    paymentHistory: [
      {
        id: 'PAY-1004',
        amount: 143992,
        date: '01 May 2024',
        method: 'UPI',
        reference: 'TXN-11223344',
        status: 'SUCCESS',
      },
    ],
  },
  {
    id: 'BK-2024-00572',
    packageId: 'pkg-meghalaya-2',
    packageName: 'Meghalaya Explorer',
    coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=500&q=80',
    departureDate: '22 Jun 2024',
    returnDate: '26 Jun 2024',
    bookingDate: '02 May 2024',
    travelerCount: 10,
    packagePrice: 17999,
    totalAmount: 179990,
    amountPaid: 50000,
    remainingAmount: 129990,
    dueDate: '15 Jun 2024',
    owner: {
      id: 'TP-501',
      name: 'Rajesh Nair',
      gender: 'Male',
      age: 38,
      phone: '+91 93333 44455',
      email: 'rajesh.n@example.com',
      isPrimary: true,
    },
    partners: [
      { id: 'TP-502', name: 'Sunita Nair', gender: 'Female', age: 36 },
      { id: 'TP-503', name: 'Aarav Nair', gender: 'Male', age: 10 },
      { id: 'TP-504', name: 'Diya Nair', gender: 'Female', age: 8 },
      { id: 'TP-505', name: 'Kamesh Menon', gender: 'Male', age: 40 },
      { id: 'TP-506', name: 'Latha Menon', gender: 'Female', age: 38 },
      { id: 'TP-507', name: 'Gautam Pillai', gender: 'Male', age: 42 },
      { id: 'TP-508', name: 'Maya Pillai', gender: 'Female', age: 39 },
      { id: 'TP-509', name: 'Nikhil Menon', gender: 'Male', age: 14 },
      { id: 'TP-510', name: 'Anushree Menon', gender: 'Female', age: 12 },
    ],
    traveler: {
      name: 'Rajesh Nair',
      phone: '+91 93333 44455',
      email: 'rajesh.n@example.com',
    },
    bookingStatus: 'CONFIRMED',
    paymentStatus: 'PARTIALLY_PAID',
    tripEligibility: 'NOT_ELIGIBLE',
    timeline: [
      { title: 'Booking Created', timestamp: '02 May 2024', completed: true },
      { title: 'Advance Paid (₹50,000)', timestamp: '02 May 2024', completed: true },
      { title: 'Pending Remaining (₹1,29,990)', timestamp: 'Due 15 Jun 2024', completed: false, active: true },
    ],
    paymentHistory: [
      {
        id: 'PAY-1005',
        amount: 50000,
        date: '02 May 2024',
        method: 'Debit Card',
        reference: 'TXN-55667788',
        status: 'SUCCESS',
      },
    ],
  },

  // ── Group 3: Rishikesh Rafting (01 Jul 2024) ──
  {
    id: 'BK-2024-00575',
    packageId: 'pkg-rishikesh-7',
    packageName: 'Rishikesh Rafting & Camping Weekend',
    coverImage: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=500&q=80',
    departureDate: '01 Jul 2024',
    returnDate: '03 Jul 2024',
    bookingDate: '10 May 2024',
    travelerCount: 4,
    packagePrice: 7999,
    totalAmount: 31996,
    amountPaid: 31996,
    remainingAmount: 0,
    dueDate: '25 Jun 2024',
    owner: {
      id: 'TP-601',
      name: 'Karan Kapoor',
      gender: 'Male',
      age: 25,
      phone: '+91 98111 22334',
      email: 'karan.k@example.com',
      isPrimary: true,
    },
    partners: [
      { id: 'TP-602', name: 'Manish Verma', gender: 'Male', age: 26 },
      { id: 'TP-603', name: 'Sameer Gupta', gender: 'Male', age: 25 },
      { id: 'TP-604', name: 'Akash Sharma', gender: 'Male', age: 26 },
    ],
    traveler: {
      name: 'Karan Kapoor',
      phone: '+91 98111 22334',
      email: 'karan.k@example.com',
    },
    bookingStatus: 'CONFIRMED',
    paymentStatus: 'PAID',
    tripEligibility: 'ELIGIBLE',
    timeline: [
      { title: 'Booking Created', timestamp: '10 May 2024', completed: true },
      { title: 'Confirmed & Eligible', timestamp: '10 May 2024', completed: true, active: true },
    ],
    paymentHistory: [
      {
        id: 'PAY-1006',
        amount: 31996,
        date: '10 May 2024',
        method: 'UPI',
        reference: 'TXN-99001122',
        status: 'SUCCESS',
      },
    ],
  },

  // ── Group 4: Spiti Valley Road Trip (10 Jul 2024) ──
  {
    id: 'BK-2024-00566',
    packageId: 'pkg-spiti-3',
    packageName: 'Spiti Valley Road Trip',
    coverImage: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=500&q=80',
    departureDate: '10 Jul 2024',
    returnDate: '16 Jul 2024',
    bookingDate: '30 Apr 2024',
    travelerCount: 6,
    packagePrice: 18499,
    totalAmount: 110994,
    amountPaid: 110994,
    remainingAmount: 0,
    dueDate: '05 Jul 2024',
    owner: {
      id: 'TP-701',
      name: 'Vikram Patel',
      gender: 'Male',
      age: 31,
      phone: '+91 99887 76655',
      email: 'vikram.p@example.com',
      idProofType: 'Driving License',
      idProofNumber: 'DL-PATEL-8899',
      isPrimary: true,
    },
    partners: [
      { id: 'TP-702', name: 'Nilesh Patel', gender: 'Male', age: 33 },
      { id: 'TP-703', name: 'Harsh Shah', gender: 'Male', age: 30 },
      { id: 'TP-704', name: 'Jignesh Desai', gender: 'Male', age: 32 },
      { id: 'TP-705', name: 'Parth Trivedi', gender: 'Male', age: 29 },
      { id: 'TP-706', name: 'Bhavesh Joshi', gender: 'Male', age: 34 },
    ],
    traveler: {
      name: 'Vikram Patel',
      phone: '+91 99887 76655',
      email: 'vikram.p@example.com',
      idProofType: 'Driving License',
    },
    bookingStatus: 'CONFIRMED',
    paymentStatus: 'PAID',
    tripEligibility: 'ELIGIBLE',
    specialRequests: 'Single room occupancy confirmed.',
    timeline: [
      { title: 'Booking Created', timestamp: '30 Apr 2024', completed: true },
      { title: 'Confirmed', timestamp: '30 Apr 2024', completed: true, active: true },
    ],
    paymentHistory: [
      {
        id: 'PAY-1007',
        amount: 110994,
        date: '30 Apr 2024',
        method: 'Net Banking',
        reference: 'TXN-33445566',
        status: 'SUCCESS',
      },
    ],
  },
  {
    id: 'BK-2024-00574',
    packageId: 'pkg-spiti-3',
    packageName: 'Spiti Valley Road Trip',
    coverImage: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=500&q=80',
    departureDate: '10 Jul 2024',
    returnDate: '16 Jul 2024',
    bookingDate: '01 May 2024',
    travelerCount: 6,
    packagePrice: 18499,
    totalAmount: 110994,
    amountPaid: 110994,
    remainingAmount: 0,
    dueDate: '05 Jul 2024',
    owner: {
      id: 'TP-801',
      name: 'Kavita Joshi',
      gender: 'Female',
      age: 28,
      phone: '+91 98888 77766',
      email: 'kavita.j@example.com',
      isPrimary: true,
    },
    partners: [
      { id: 'TP-802', name: 'Sneha Joshi', gender: 'Female', age: 26 },
      { id: 'TP-803', name: 'Pooja Agarwal', gender: 'Female', age: 27 },
      { id: 'TP-804', name: 'Swati Bansal', gender: 'Female', age: 29 },
      { id: 'TP-805', name: 'Megha Khandelwal', gender: 'Female', age: 28 },
      { id: 'TP-806', name: 'Aditi Jain', gender: 'Female', age: 27 },
    ],
    traveler: {
      name: 'Kavita Joshi',
      phone: '+91 98888 77766',
      email: 'kavita.j@example.com',
    },
    bookingStatus: 'CONFIRMED',
    paymentStatus: 'PAID',
    tripEligibility: 'ELIGIBLE',
    timeline: [
      { title: 'Booking Created', timestamp: '01 May 2024', completed: true },
      { title: 'Confirmed', timestamp: '01 May 2024', completed: true, active: true },
    ],
    paymentHistory: [
      {
        id: 'PAY-1008',
        amount: 110994,
        date: '01 May 2024',
        method: 'Credit Card',
        reference: 'TXN-77665544',
        status: 'SUCCESS',
      },
    ],
  },

  // ── Group 5: Tawang Monastery Trail (05 Aug 2024) ──
  {
    id: 'BK-2024-00565',
    packageId: 'pkg-tawang-4',
    packageName: 'Tawang Monastery Trail',
    coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=500&q=80',
    departureDate: '05 Aug 2024',
    returnDate: '11 Aug 2024',
    bookingDate: '28 Apr 2024',
    travelerCount: 15,
    packagePrice: 19999,
    totalAmount: 299985,
    amountPaid: 299985,
    remainingAmount: 0,
    dueDate: '30 Jul 2024',
    owner: {
      id: 'TP-901',
      name: 'Neha Singh',
      gender: 'Female',
      age: 30,
      phone: '+91 87654 32109',
      email: 'neha.s@example.com',
      isPrimary: true,
    },
    partners: [
      { id: 'TP-902', name: 'Amitabh Singh', gender: 'Male', age: 32 },
      { id: 'TP-903', name: 'Jaya Singh', gender: 'Female', age: 58 },
      { id: 'TP-904', name: 'Abhishek Singh', gender: 'Male', age: 34 },
      { id: 'TP-905', name: 'Aishwarya Singh', gender: 'Female', age: 33 },
      { id: 'TP-906', name: 'Aaradhya Singh', gender: 'Female', age: 10 },
      { id: 'TP-907', name: 'Shweta Singh', gender: 'Female', age: 36 },
      { id: 'TP-908', name: 'Nikhil Nanda', gender: 'Male', age: 38 },
      { id: 'TP-909', name: 'Navya Nanda', gender: 'Female', age: 16 },
      { id: 'TP-910', name: 'Agastya Nanda', gender: 'Male', age: 14 },
      { id: 'TP-911', name: 'Rohan Rathore', gender: 'Male', age: 35 },
      { id: 'TP-912', name: 'Sonal Rathore', gender: 'Female', age: 33 },
      { id: 'TP-913', name: 'Kabir Rathore', gender: 'Male', age: 7 },
      { id: 'TP-914', name: 'Myra Rathore', gender: 'Female', age: 5 },
      { id: 'TP-915', name: 'Siddharth Varma', gender: 'Male', age: 37 },
    ],
    traveler: {
      name: 'Neha Singh',
      phone: '+91 87654 32109',
      email: 'neha.s@example.com',
    },
    bookingStatus: 'CONFIRMED',
    paymentStatus: 'PAID',
    tripEligibility: 'ELIGIBLE',
    assignedTripId: 'TRIP-2024-005',
    assignedTripName: 'Tawang Monastery Trail',
    timeline: [
      { title: 'Booking Created', timestamp: '28 Apr 2024', completed: true },
      { title: 'Confirmed', timestamp: '29 Apr 2024', completed: true },
      { title: 'Trip Assigned (TRIP-2024-005)', timestamp: '01 May 2024', completed: true, active: true },
    ],
    paymentHistory: [
      {
        id: 'PAY-1009',
        amount: 299985,
        date: '28 Apr 2024',
        method: 'Net Banking',
        reference: 'TXN-88776655',
        status: 'SUCCESS',
      },
    ],
  },
  // ── Group 6: Solo Booked Package Demo (18 Aug 2024) ──
  {
    id: 'BK-2024-SOLO-901',
    packageId: 'pkg-solo-kashmir-8',
    packageName: 'Kashmir Paradise Solo Expedition',
    coverImage: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=500&q=80',
    departureDate: '18 Aug 2024',
    returnDate: '24 Aug 2024',
    bookingDate: '05 May 2024',
    travelerCount: 1,
    packagePrice: 22499,
    totalAmount: 22499,
    amountPaid: 22499,
    remainingAmount: 0,
    dueDate: '15 Aug 2024',
    owner: {
      id: 'TP-SOLO-101',
      name: 'Siddharth Varma',
      gender: 'Male',
      age: 29,
      phone: '+91 98990 11223',
      email: 'siddharth.v@example.com',
      idProofType: 'Aadhaar Card',
      idProofNumber: '9988-1122-3344',
      emergencyContact: '+91 98990 00000',
      isPrimary: true,
    },
    partners: [], // Solo Traveler - 0 partners!
    traveler: {
      name: 'Siddharth Varma',
      phone: '+91 98990 11223',
      email: 'siddharth.v@example.com',
      idProofType: 'Aadhaar Card',
    },
    bookingStatus: 'CONFIRMED',
    paymentStatus: 'PAID',
    tripEligibility: 'ELIGIBLE',
    specialRequests: 'Single room occupancy requested.',
    timeline: [
      { title: 'Solo Booking Created', timestamp: '05 May 2024', completed: true },
      { title: 'Full Payment Received', timestamp: '05 May 2024', completed: true },
      { title: 'Confirmed & Eligible for Trip', timestamp: '05 May 2024', completed: true, active: true },
    ],
    paymentHistory: [
      {
        id: 'PAY-SOLO-1',
        amount: 22499,
        date: '05 May 2024',
        method: 'UPI',
        reference: 'TXN-SOLO-9911',
        status: 'SUCCESS',
      },
    ],
  },
];

export const INITIAL_BOOKING_GROUPS: BookingGroup[] = [
  // Group 1: Capacity Reached (20/20) & All Fully Paid -> READY_FOR_TRIP
  {
    groupId: 'GRP-pkg-ladakh-1-15jun2024',
    packageId: 'pkg-ladakh-1',
    packageName: 'Ladakh Adventure Expedition',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80',
    departureDate: '15 Jun 2024',
    returnDate: '21 Jun 2024',
    minTravelers: 8,
    maxCapacity: 20,
    confirmedTravelerCount: 20,
    fullyPaidTravelerCount: 20,
    pendingPaymentTravelerCount: 0,
    totalBookingsCount: 3,
    pendingCount: 0,
    cancelledCount: 0,
    deadlineDate: '10 Jun 2024',
    deadlineText: 'Booking Closed (Capacity Reached)',
    isDeadlineExpired: true,
    groupStatus: 'READY_FOR_TRIP',
    tripReadyReason: 'CAPACITY_REACHED',
    expectedRevenue: 379980,
    bookings: MOCK_AGENCY_BOOKINGS.filter((b) => b.packageId === 'pkg-ladakh-1'),
  },

  // Group 2: Deadline Expired (18 >= 8), but 1 booking partially paid -> NOT READY / CANNOT CREATE TRIP
  {
    groupId: 'GRP-pkg-meghalaya-2-22jun2024',
    packageId: 'pkg-meghalaya-2',
    packageName: 'Meghalaya Explorer',
    coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=500&q=80',
    departureDate: '22 Jun 2024',
    returnDate: '26 Jun 2024',
    minTravelers: 8,
    maxCapacity: 20,
    confirmedTravelerCount: 18,
    fullyPaidTravelerCount: 8,
    pendingPaymentTravelerCount: 10,
    totalBookingsCount: 2,
    pendingCount: 0,
    cancelledCount: 0,
    deadlineDate: '15 Jun 2024',
    deadlineText: 'Booking Closed (Deadline Expired)',
    isDeadlineExpired: true,
    groupStatus: 'OPEN',
    tripReadyReason: undefined,
    expectedRevenue: 323982,
    bookings: MOCK_AGENCY_BOOKINGS.filter((b) => b.packageId === 'pkg-meghalaya-2'),
  },

  // Group 3: Deadline Expired & Below Minimum (4 < 8) -> MINIMUM_NOT_REACHED
  {
    groupId: 'GRP-pkg-rishikesh-7-01jul2024',
    packageId: 'pkg-rishikesh-7',
    packageName: 'Rishikesh Rafting & Camping Weekend',
    coverImage: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=500&q=80',
    departureDate: '01 Jul 2024',
    returnDate: '03 Jul 2024',
    minTravelers: 8,
    maxCapacity: 20,
    confirmedTravelerCount: 4,
    fullyPaidTravelerCount: 4,
    pendingPaymentTravelerCount: 0,
    totalBookingsCount: 1,
    pendingCount: 0,
    cancelledCount: 0,
    deadlineDate: '25 Jun 2024',
    deadlineText: 'Deadline Expired (Below Minimum)',
    isDeadlineExpired: true,
    groupStatus: 'MINIMUM_NOT_REACHED',
    expectedRevenue: 31996,
    bookings: MOCK_AGENCY_BOOKINGS.filter((b) => b.packageId === 'pkg-rishikesh-7'),
  },

  // Group 4: Open Active (12/20, min 8) -> OPEN
  {
    groupId: 'GRP-pkg-spiti-3-10jul2024',
    packageId: 'pkg-spiti-3',
    packageName: 'Spiti Valley Road Trip',
    coverImage: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=500&q=80',
    departureDate: '10 Jul 2024',
    returnDate: '16 Jul 2024',
    minTravelers: 8,
    maxCapacity: 20,
    confirmedTravelerCount: 12,
    fullyPaidTravelerCount: 12,
    pendingPaymentTravelerCount: 0,
    totalBookingsCount: 2,
    pendingCount: 0,
    cancelledCount: 0,
    deadlineDate: '05 Jul 2024',
    deadlineText: 'Ends in 3 Days',
    isDeadlineExpired: false,
    groupStatus: 'OPEN',
    expectedRevenue: 221988,
    bookings: MOCK_AGENCY_BOOKINGS.filter((b) => b.packageId === 'pkg-spiti-3'),
  },

  // Group 5: Moved to Trip -> MOVED_TO_TRIP
  {
    groupId: 'GRP-pkg-tawang-4-05aug2024',
    packageId: 'pkg-tawang-4',
    packageName: 'Tawang Monastery Trail',
    coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=500&q=80',
    departureDate: '05 Aug 2024',
    returnDate: '11 Aug 2024',
    minTravelers: 8,
    maxCapacity: 20,
    confirmedTravelerCount: 15,
    fullyPaidTravelerCount: 15,
    pendingPaymentTravelerCount: 0,
    totalBookingsCount: 1,
    pendingCount: 0,
    cancelledCount: 0,
    deadlineDate: '30 Jul 2024',
    deadlineText: 'Booking Closed',
    isDeadlineExpired: true,
    groupStatus: 'MOVED_TO_TRIP',
    assignedTripId: 'TRIP-2024-005',
    expectedRevenue: 299985,
    bookings: MOCK_AGENCY_BOOKINGS.filter((b) => b.packageId === 'pkg-tawang-4'),
  },

  // Group 6: Solo Booked Package Demo
  {
    groupId: 'GRP-pkg-solo-kashmir-8-18aug2024',
    packageId: 'pkg-solo-kashmir-8',
    packageName: 'Kashmir Paradise Solo Expedition',
    coverImage: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=500&q=80',
    departureDate: '18 Aug 2024',
    returnDate: '24 Aug 2024',
    minTravelers: 1,
    maxCapacity: 10,
    confirmedTravelerCount: 1,
    fullyPaidTravelerCount: 1,
    pendingPaymentTravelerCount: 0,
    totalBookingsCount: 1,
    pendingCount: 0,
    cancelledCount: 0,
    deadlineDate: '15 Aug 2024',
    deadlineText: 'Ends in 5 Days',
    isDeadlineExpired: false,
    groupStatus: 'OPEN',
    expectedRevenue: 22499,
    bookings: MOCK_AGENCY_BOOKINGS.filter((b) => b.packageId === 'pkg-solo-kashmir-8'),
  },
];
