export interface TripUpdateItem {
  id: string;
  type: 'success' | 'info' | 'transport' | 'hotel' | 'document';
  title: string;
  description: string;
  timestamp: string;
  iconName: string;
}

export interface ProgressStepItem {
  id: string;
  label: string;
  status: 'completed' | 'current' | 'upcoming';
}

export interface TripStatusData {
  tripId: string;
  status: 'confirmed' | 'documents_ready' | 'agency_preparing' | 'pickup_assigned' | 'trip_started' | 'trip_completed' | 'cancelled';
  statusBadge: string;
  currentStep: string;
  nextStep: string;
  countdownText: string;
  steps: ProgressStepItem[];
  updates: TripUpdateItem[];
  reminder?: {
    title: string;
    details: string[];
  };
  lastUpdated: string;
}

export const TRIP_STATUS_DATA: TripStatusData[] = [
  {
    tripId: 'trip-001',
    status: 'agency_preparing',
    statusBadge: 'Upcoming',
    currentStep: 'Booking Confirmed',
    nextStep: 'Agency Preparing',
    countdownText: 'Trip starts in 8 Days',
    steps: [
      { id: 's1', label: 'Booking Confirmed', status: 'completed' },
      { id: 's2', label: 'Documents Ready', status: 'completed' },
      { id: 's3', label: 'Agency Preparing', status: 'current' },
      { id: 's4', label: 'Pickup Tomorrow', status: 'upcoming' },
      { id: 's5', label: 'Trip Started', status: 'upcoming' },
      { id: 's6', label: 'Trip Completed', status: 'upcoming' },
    ],
    updates: [
      {
        id: 'u4',
        type: 'hotel',
        title: 'Hotel booking confirmed',
        description: 'Pine Brook Resort, Shillong confirmed room booking for 2 travelers.',
        timestamp: 'Today • 12:15 PM',
        iconName: 'hotel',
      },
      {
        id: 'u3',
        type: 'transport',
        title: 'Pickup location confirmed',
        description: 'Driver Ramesh Sangma assigned with Toyota Innova Crysta at Guwahati Airport (GAU).',
        timestamp: 'Today • 10:30 AM',
        iconName: 'transport',
      },
      {
        id: 'u2',
        type: 'document',
        title: 'Travel documents uploaded',
        description: 'All 6 travel vouchers & tickets have been uploaded by Wander North Travel.',
        timestamp: 'Yesterday',
        iconName: 'document',
      },
      {
        id: 'u1',
        type: 'success',
        title: 'Booking confirmed successfully',
        description: 'Payment of ₹45,000 received. Booking ID: AT-784512.',
        timestamp: '2 days ago',
        iconName: 'success',
      },
    ],
    reminder: {
      title: 'Important Travel Reminder',
      details: [
        'Carry your original Government photo ID proof (Aadhaar / Passport / Voter ID).',
        'Reach Guwahati Airport pickup point 30 minutes prior to scheduled time.',
        'Keep raincoats and warm layers accessible for Meghalaya weather.',
      ],
    },
    lastUpdated: '10 mins ago',
  },
];

export const getTripStatusByTripId = (tripId: string): TripStatusData => {
  return TRIP_STATUS_DATA.find((s) => s.tripId === tripId) || TRIP_STATUS_DATA[0];
};
