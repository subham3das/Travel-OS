// ─── Agency Trip Announcements Mock Data & Types ─────────────────────────────

export type AnnouncementType =
  | 'General'
  | 'Schedule Change'
  | 'Meeting Point'
  | 'Hotel Update'
  | 'Transport'
  | 'Meal Update'
  | 'Emergency';

export type AnnouncementStatus = 'Sent' | 'Scheduled' | 'Draft';

export interface TripAnnouncement {
  id: string;
  tripId: string;
  title: string;
  message: string;
  type: AnnouncementType;
  status: AnnouncementStatus;
  author: string;
  createdAt: string; // ISO timestamp
  scheduledAt?: string; // ISO timestamp, only if Scheduled
  deliveryOptions: {
    notifyAllTravelers: boolean;
    pushNotification: boolean;
    saveToTimeline: boolean;
  };
}

// ─── Seed data for recent announcements ──────────────────────────────────────
export const MOCK_ANNOUNCEMENTS_SEED: TripAnnouncement[] = [
  {
    id: 'anc-1',
    tripId: 'LD-1505-2024',
    title: 'Bus Departure Time',
    message: 'Bus will depart at 7:00 AM tomorrow. Please be at the hotel entrance by 6:45 AM.',
    type: 'Schedule Change',
    status: 'Sent',
    author: 'Ankit Verma',
    createdAt: '2024-05-11T09:30:00Z',
    deliveryOptions: {
      notifyAllTravelers: true,
      pushNotification: true,
      saveToTimeline: true,
    },
  },
  {
    id: 'anc-2',
    tripId: 'LD-1505-2024',
    title: 'What to Carry',
    message: 'Carry your ID proof and warm clothes. Temperatures at Pangong drop below 5°C at night.',
    type: 'General',
    status: 'Sent',
    author: 'Ankit Verma',
    createdAt: '2024-05-11T08:15:00Z',
    deliveryOptions: {
      notifyAllTravelers: true,
      pushNotification: true,
      saveToTimeline: false,
    },
  },
  {
    id: 'anc-3',
    tripId: 'LD-1505-2024',
    title: 'Hotel Changed in Nubra',
    message: 'Hotel in Nubra has been changed. New hotel: The Grand Nubra. Check new details on the app.',
    type: 'Hotel Update',
    status: 'Sent',
    author: 'Rohit Sharma',
    createdAt: '2024-05-10T18:45:00Z',
    deliveryOptions: {
      notifyAllTravelers: true,
      pushNotification: true,
      saveToTimeline: true,
    },
  },
  {
    id: 'anc-4',
    tripId: 'LD-1505-2024',
    title: 'Lunch Meeting Point',
    message: 'Lunch tomorrow is arranged at Sindhu Darshan Restaurant, near Leh Town. Report by 12:30 PM.',
    type: 'Meeting Point',
    status: 'Scheduled',
    author: 'Ankit Verma',
    createdAt: '2024-05-10T16:00:00Z',
    scheduledAt: '2024-05-12T07:00:00Z',
    deliveryOptions: {
      notifyAllTravelers: true,
      pushNotification: false,
      saveToTimeline: true,
    },
  },
  {
    id: 'anc-5',
    tripId: 'LD-1505-2024',
    title: 'Emergency Weather Alert',
    message: 'High winds expected near Khardung La. Carry extra layers. Departure may be delayed.',
    type: 'Emergency',
    status: 'Sent',
    author: 'Rohit Sharma',
    createdAt: '2024-05-09T20:00:00Z',
    deliveryOptions: {
      notifyAllTravelers: true,
      pushNotification: true,
      saveToTimeline: true,
    },
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const ANNOUNCEMENT_TYPES: AnnouncementType[] = [
  'General',
  'Schedule Change',
  'Meeting Point',
  'Hotel Update',
  'Transport',
  'Meal Update',
  'Emergency',
];

export const getAnnouncementEmoji = (type: AnnouncementType): string => {
  switch (type) {
    case 'General':       return '📢';
    case 'Schedule Change': return '🕐';
    case 'Meeting Point': return '📍';
    case 'Hotel Update':  return '🏨';
    case 'Transport':     return '🚌';
    case 'Meal Update':   return '🍽️';
    case 'Emergency':     return '🚨';
    default:              return '📢';
  }
};

export const getStatusColor = (status: AnnouncementStatus) => {
  switch (status) {
    case 'Sent':      return 'bg-emerald-100 text-emerald-800';
    case 'Scheduled': return 'bg-amber-100 text-amber-800';
    case 'Draft':     return 'bg-slate-100 text-slate-600';
    default:          return 'bg-slate-100 text-slate-600';
  }
};

export const formatAnnouncementTime = (iso: string): { date: string; time: string } => {
  const d = new Date(iso);
  const date = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const time = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  return { date, time };
};
