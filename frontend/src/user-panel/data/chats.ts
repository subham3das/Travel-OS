export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  type: 'text' | 'image' | 'document' | 'system';
  text: string;
  attachmentUrl?: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  systemMessageType?: 'booking' | 'documents' | 'pickup' | 'hotel' | 'reminder';
}

export interface ChatConversation {
  id: string;
  agencyId: string;
  agencyName: string;
  agencyLogo: string;
  isVerified: boolean;
  isOnline: boolean;
  category: 'agencies' | 'support' | 'bookings';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  bookingId?: string;
  packageName?: string;
  destinationName?: string;
  travelDates?: string;
  tripId?: string;
  messages: ChatMessage[];
}

export const INITIAL_CHATS: ChatConversation[] = [
  {
    id: 'chat-001',
    agencyId: 'agency-001',
    agencyName: 'Himalayan Explorers',
    agencyLogo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=200&auto=format&fit=crop',
    isVerified: true,
    isOnline: true,
    category: 'agencies',
    lastMessage: 'Pickup location has been updated.',
    lastMessageTime: '10:42 AM',
    unreadCount: 2,
    bookingId: 'APTR12345',
    packageName: 'Magical Meghalaya (5N/6D)',
    destinationName: 'Meghalaya',
    travelDates: '15 Oct – 20 Oct, 2025',
    tripId: 'trip-001',
    messages: [
      {
        id: 'm1',
        senderId: 'agency-001',
        senderName: 'Himalayan Explorers',
        type: 'text',
        text: 'Hello Subham! Welcome to Himalayan Explorers. We are excited to guide your Meghalaya expedition!',
        timestamp: '10:30 AM',
        status: 'read',
      },
      {
        id: 'm2',
        senderId: 'system',
        senderName: 'System',
        type: 'system',
        text: '🎉 Booking APTR12345 has been confirmed by Himalayan Explorers.',
        timestamp: '10:32 AM',
        status: 'read',
        systemMessageType: 'booking',
      },
      {
        id: 'm3',
        senderId: 'user-001',
        senderName: 'Subham Das',
        type: 'text',
        text: 'Thank you! Could you confirm the exact pickup location in Guwahati?',
        timestamp: '10:38 AM',
        status: 'read',
      },
      {
        id: 'm4',
        senderId: 'agency-001',
        senderName: 'Himalayan Explorers',
        type: 'text',
        text: 'Pickup location has been updated. Our driver Ramesh Sangma will meet you right outside Guwahati Railway Station Gate 1.',
        timestamp: '10:42 AM',
        status: 'read',
      },
    ],
  },
  {
    id: 'chat-002',
    agencyId: 'agency-002',
    agencyName: 'North Wanderers',
    agencyLogo: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=200&auto=format&fit=crop',
    isVerified: true,
    isOnline: true,
    category: 'agencies',
    lastMessage: "Hi Subham! Here's the itinerary for your trip.",
    lastMessageTime: 'Yesterday',
    unreadCount: 1,
    bookingId: 'APTR67890',
    packageName: 'Spiti Valley Motorbike Trek',
    destinationName: 'Spiti Valley',
    travelDates: '01 Nov – 07 Nov, 2025',
    tripId: 'trip-001',
    messages: [
      {
        id: 'm10',
        senderId: 'agency-002',
        senderName: 'North Wanderers',
        type: 'text',
        text: "Hi Subham! Here's the itinerary for your trip.",
        timestamp: 'Yesterday',
        status: 'read',
      },
    ],
  },
  {
    id: 'chat-003',
    agencyId: 'agency-003',
    agencyName: 'Wanderlust Trails',
    agencyLogo: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=200&auto=format&fit=crop',
    isVerified: true,
    isOnline: true,
    category: 'agencies',
    lastMessage: 'Thank you! We look forward to hosting you.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    bookingId: 'APTR54321',
    packageName: 'Kerala Backwaters & Munnar',
    destinationName: 'Kerala',
    travelDates: '12 Dec – 18 Dec, 2025',
    messages: [
      {
        id: 'm20',
        senderId: 'agency-003',
        senderName: 'Wanderlust Trails',
        type: 'text',
        text: 'Thank you! We look forward to hosting you.',
        timestamp: 'Yesterday',
        status: 'read',
      },
    ],
  },
  {
    id: 'chat-004',
    agencyId: 'support-001',
    agencyName: 'ApnaTrip Support',
    agencyLogo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    isVerified: true,
    isOnline: true,
    category: 'support',
    lastMessage: 'How can we help you today?',
    lastMessageTime: 'Mon',
    unreadCount: 3,
    messages: [
      {
        id: 'm30',
        senderId: 'support-001',
        senderName: 'ApnaTrip Support',
        type: 'text',
        text: 'How can we help you today?',
        timestamp: 'Mon',
        status: 'read',
      },
    ],
  },
  {
    id: 'chat-005',
    agencyId: 'agency-004',
    agencyName: 'Adventure Kingdom',
    agencyLogo: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=200&auto=format&fit=crop',
    isVerified: true,
    isOnline: false,
    category: 'bookings',
    lastMessage: 'Your documents are confirmed.',
    lastMessageTime: 'Sun',
    unreadCount: 0,
    bookingId: 'APTR11223',
    packageName: 'Kedarkantha Winter Trek',
    destinationName: 'Uttarakhand',
    travelDates: '20 Dec – 25 Dec, 2025',
    messages: [
      {
        id: 'm40',
        senderId: 'agency-004',
        senderName: 'Adventure Kingdom',
        type: 'text',
        text: 'Your documents are confirmed.',
        timestamp: 'Sun',
        status: 'read',
      },
    ],
  },
];

let chatsStore = [...INITIAL_CHATS];

export const getChats = (): ChatConversation[] => {
  return chatsStore;
};

export const getChatById = (id: string): ChatConversation | undefined => {
  return chatsStore.find((c) => c.id === id || c.agencyId === id);
};

export const sendMessage = (chatId: string, text: string): ChatMessage => {
  const newMsg: ChatMessage = {
    id: `m-${Date.now()}`,
    senderId: 'user-001',
    senderName: 'Subham Das',
    type: 'text',
    text,
    timestamp: 'Just now',
    status: 'sent',
  };

  chatsStore = chatsStore.map((c) => {
    if (c.id === chatId) {
      return {
        ...c,
        lastMessage: text,
        lastMessageTime: 'Just now',
        messages: [...c.messages, newMsg],
      };
    }
    return c;
  });

  return newMsg;
};

export const markChatRead = (chatId: string): void => {
  chatsStore = chatsStore.map((c) => (c.id === chatId ? { ...c, unreadCount: 0 } : c));
};
