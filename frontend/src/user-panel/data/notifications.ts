export type NotificationCategory = 'all' | 'bookings' | 'community' | 'agency' | 'offers';

export interface NotificationItem {
  id: string;
  type:
    | 'booking_confirmed'
    | 'payment_successful'
    | 'host_assigned'
    | 'guide_assigned'
    | 'vehicle_assigned'
    | 'hotel_assigned'
    | 'meeting_point_updated'
    | 'departure_reminder'
    | 'trip_started'
    | 'trip_update'
    | 'trip_completed'
    | 'review_requested'
    | 'message_received'
    | 'like'
    | 'comment';
  category: 'bookings' | 'community' | 'agency' | 'offers';
  title: string;
  description: string;
  highlightText?: string;
  timestamp: string;
  section: 'Today' | 'Yesterday' | 'This Week' | 'Earlier';
  isRead: boolean;
  thumbnailUrl?: string;
  avatarUrl?: string;
  iconType: 'check' | 'heart' | 'message' | 'star' | 'file' | 'user' | 'bell' | 'truck' | 'building' | 'map' | 'shield' | 'megaphone' | 'camera' | 'calendar';
  iconBgColor: string;
  actionRoute: string;
  tripId?: string;
}

export let INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    type: 'booking_confirmed',
    category: 'bookings',
    title: 'Booking Confirmed',
    description: 'Your booking for Magical Meghalaya (5N/6D) is confirmed by Wander North Travel.',
    highlightText: 'Magical Meghalaya',
    timestamp: '10:30 AM',
    section: 'Today',
    isRead: false,
    iconType: 'check',
    iconBgColor: 'bg-emerald-500 text-white',
    actionRoute: '/trips/trip-001',
    tripId: 'trip-001',
  },
  {
    id: 'n2',
    type: 'payment_successful',
    category: 'bookings',
    title: 'Payment Successful',
    description: 'Payment of ₹45,000 received. Transaction ID: TXN-9988112233.',
    highlightText: '₹45,000 Paid',
    timestamp: '10:28 AM',
    section: 'Today',
    isRead: false,
    iconType: 'check',
    iconBgColor: 'bg-emerald-600 text-white',
    actionRoute: '/booking/checkout/BK-2025-0012',
    tripId: 'trip-001',
  },
  {
    id: 'n3',
    type: 'host_assigned',
    category: 'agency',
    title: 'Trip Host Assigned',
    description: 'Subham Das (Operations Director) has been assigned as your lead trip host.',
    highlightText: 'Subham Das',
    timestamp: '09:45 AM',
    section: 'Today',
    isRead: false,
    iconType: 'user',
    iconBgColor: 'bg-[#583BE8] text-white',
    actionRoute: '/trips/trip-001',
    tripId: 'trip-001',
  },
  {
    id: 'n4',
    type: 'guide_assigned',
    category: 'agency',
    title: 'Tour Guide Assigned',
    description: 'Ramesh Sangma (Senior Eco Guide) assigned for your Shillong & Cherrapunji excursions.',
    highlightText: 'Ramesh Sangma',
    timestamp: '09:00 AM',
    section: 'Today',
    isRead: false,
    iconType: 'shield',
    iconBgColor: 'bg-purple-600 text-white',
    actionRoute: '/trips/trip-001',
    tripId: 'trip-001',
  },
  {
    id: 'n5',
    type: 'vehicle_assigned',
    category: 'agency',
    title: 'Transport Vehicle Assigned',
    description: 'Toyota Innova Crysta (AS-06-AB-8921) assigned with driver Bikram Teron.',
    highlightText: 'Toyota Innova Crysta',
    timestamp: 'Yesterday',
    section: 'Yesterday',
    isRead: true,
    iconType: 'truck',
    iconBgColor: 'bg-amber-500 text-white',
    actionRoute: '/trips/trip-001',
    tripId: 'trip-001',
  },
  {
    id: 'n6',
    type: 'hotel_assigned',
    category: 'agency',
    title: 'Hotel Vouchers Ready',
    description: 'Pine Brook Eco Resort & Spa confirmed for 2 travelers.',
    highlightText: 'Pine Brook Resort',
    timestamp: 'Yesterday',
    section: 'Yesterday',
    isRead: true,
    iconType: 'building',
    iconBgColor: 'bg-blue-500 text-white',
    actionRoute: '/trips/trip-001',
    tripId: 'trip-001',
  },
  {
    id: 'n7',
    type: 'meeting_point_updated',
    category: 'agency',
    title: 'Meeting Point Updated',
    description: 'Meeting point confirmed at Guwahati Airport Terminal 1 Exit Gate 3 at 08:30 AM.',
    highlightText: 'Guwahati Airport Gate 3',
    timestamp: '2 days ago',
    section: 'This Week',
    isRead: true,
    iconType: 'map',
    iconBgColor: 'bg-sky-500 text-white',
    actionRoute: '/trips/trip-001',
    tripId: 'trip-001',
  },
  {
    id: 'n8',
    type: 'review_requested',
    category: 'agency',
    title: 'Review Requested',
    description: 'How was your recent Meghalaya adventure? Leave a review to earn travel badges!',
    highlightText: 'Rate Trip',
    timestamp: '3 days ago',
    section: 'This Week',
    isRead: true,
    iconType: 'star',
    iconBgColor: 'bg-[#FF4D6D] text-white',
    actionRoute: '/trips/trip-001/review',
    tripId: 'trip-001',
  },
];

export const getNotifications = (): NotificationItem[] => INITIAL_NOTIFICATIONS;

export const markAsRead = (id: string) => {
  INITIAL_NOTIFICATIONS = INITIAL_NOTIFICATIONS.map((n) =>
    n.id === id ? { ...n, isRead: true } : n
  );
};

export const markAllAsRead = () => {
  INITIAL_NOTIFICATIONS = INITIAL_NOTIFICATIONS.map((n) => ({ ...n, isRead: true }));
};
