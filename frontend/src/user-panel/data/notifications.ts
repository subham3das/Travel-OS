export type NotificationCategory = 'all' | 'bookings' | 'community' | 'agency' | 'offers';

export interface NotificationItem {
  id: string;
  type: 'booking' | 'like' | 'comment' | 'badge' | 'documents' | 'follow' | 'agency' | 'helpful' | 'trip' | 'offer';
  category: 'bookings' | 'community' | 'agency' | 'offers';
  title: string;
  description: string;
  highlightText?: string;
  timestamp: string;
  section: 'Today' | 'Yesterday' | 'This Week' | 'Earlier';
  isRead: boolean;
  thumbnailUrl?: string;
  avatarUrl?: string;
  iconType: 'check' | 'heart' | 'message' | 'star' | 'file' | 'user' | 'megaphone' | 'camera' | 'calendar' | 'bell';
  iconBgColor: string;
  actionRoute: string;
  tripId?: string;
  postId?: string;
  userId?: string;
}

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    type: 'booking',
    category: 'bookings',
    title: 'Booking Confirmed',
    description: 'Your booking for Magical Meghalaya (5N/6D) is confirmed.',
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
    type: 'like',
    category: 'community',
    title: 'Rahul liked your story',
    description: 'Rahul Sharma liked your travel story "Sunset at Shillong".',
    timestamp: '09:15 AM',
    section: 'Today',
    isRead: false,
    thumbnailUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=200&auto=format&fit=crop',
    iconType: 'heart',
    iconBgColor: 'bg-[#FF4D6D] text-white',
    actionRoute: '/community/post/post-001',
    postId: 'post-001',
  },
  {
    id: 'n3',
    type: 'comment',
    category: 'community',
    title: 'Aman commented on your post',
    description: '"Amazing photos! Which camera did you use?"',
    timestamp: '08:45 AM',
    section: 'Today',
    isRead: false,
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=200&auto=format&fit=crop',
    iconType: 'message',
    iconBgColor: 'bg-[#6356E5] text-white',
    actionRoute: '/community/post/post-001',
    postId: 'post-001',
  },
  {
    id: 'n4',
    type: 'badge',
    category: 'community',
    title: 'You unlocked a new badge!',
    description: 'Congratulations! You unlocked "Trusted Reviewer" badge.',
    timestamp: '07:30 AM',
    section: 'Today',
    isRead: true,
    iconType: 'star',
    iconBgColor: 'bg-amber-400 text-white',
    actionRoute: '/profile',
  },
  {
    id: 'n5',
    type: 'documents',
    category: 'bookings',
    title: 'Travel documents uploaded',
    description: 'Your travel documents for Magical Meghalaya are now available.',
    highlightText: 'Magical Meghalaya',
    timestamp: 'Yesterday, 8:20 PM',
    section: 'Yesterday',
    isRead: true,
    iconType: 'file',
    iconBgColor: 'bg-blue-500 text-white',
    actionRoute: '/trips/trip-001/documents',
    tripId: 'trip-001',
  },
  {
    id: 'n6',
    type: 'follow',
    category: 'community',
    title: 'Priya started following you',
    description: 'Priya Verma is now following you.',
    timestamp: 'Yesterday, 6:10 PM',
    section: 'Yesterday',
    isRead: true,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    iconType: 'user',
    iconBgColor: 'bg-emerald-500 text-white',
    actionRoute: '/community/user/user-002',
    userId: 'user-002',
  },
  {
    id: 'n7',
    type: 'agency',
    category: 'agency',
    title: 'Agency update',
    description: 'Himalayan Explorers updated the pickup location for your trip.',
    timestamp: 'Yesterday, 4:05 PM',
    section: 'Yesterday',
    isRead: true,
    iconType: 'megaphone',
    iconBgColor: 'bg-orange-500 text-white',
    actionRoute: '/trips/trip-001',
    tripId: 'trip-001',
  },
  {
    id: 'n8',
    type: 'helpful',
    category: 'community',
    title: 'Your review reached 20 helpful votes!',
    description: 'Great job! Your review for "Zostel Gangtok" is helping other travelers.',
    timestamp: '2 days ago',
    section: 'This Week',
    isRead: true,
    iconType: 'camera',
    iconBgColor: 'bg-teal-500 text-white',
    actionRoute: '/profile',
  },
  {
    id: 'n9',
    type: 'trip',
    category: 'bookings',
    title: 'Trip starts tomorrow',
    description: 'Your trip to Magical Meghalaya starts tomorrow. Pack your bags! ✈️',
    highlightText: 'Magical Meghalaya',
    timestamp: '3 days ago',
    section: 'This Week',
    isRead: true,
    iconType: 'calendar',
    iconBgColor: 'bg-[#6356E5] text-white',
    actionRoute: '/trips/trip-001',
    tripId: 'trip-001',
  },
  {
    id: 'n10',
    type: 'offer',
    category: 'offers',
    title: 'Weekend special offer!',
    description: 'Get up to 20% OFF on selected packages for a limited time only.',
    timestamp: '5 days ago',
    section: 'Earlier',
    isRead: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=200&auto=format&fit=crop',
    iconType: 'bell',
    iconBgColor: 'bg-slate-200 text-slate-600',
    actionRoute: '/search',
  },
];

let notificationsStore = [...INITIAL_NOTIFICATIONS];

export const getNotifications = (): NotificationItem[] => {
  return notificationsStore;
};

export const markAsRead = (id: string): void => {
  notificationsStore = notificationsStore.map((n) => (n.id === id ? { ...n, isRead: true } : n));
};

export const deleteNotification = (id: string): void => {
  notificationsStore = notificationsStore.filter((n) => n.id !== id);
};

export const markAllAsRead = (): void => {
  notificationsStore = notificationsStore.map((n) => ({ ...n, isRead: true }));
};
