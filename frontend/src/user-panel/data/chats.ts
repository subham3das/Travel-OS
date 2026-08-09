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
  category: 'agencies' | 'support' | 'bookings' | 'hosts';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  bookingId?: string;
  packageName?: string;
  destinationName?: string;
  travelDates?: string;
  tripId?: string;
  hostPhone?: string;
  messages: ChatMessage[];
}

export let INITIAL_CHATS: ChatConversation[] = [
  {
    id: 'chat-001',
    agencyId: 'agency-001',
    agencyName: 'Wander North Travel',
    agencyLogo: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=200&auto=format&fit=crop',
    isVerified: true,
    isOnline: true,
    category: 'agencies',
    lastMessage: 'Pickup point confirmed at Guwahati Airport Gate 3 at 08:30 AM.',
    lastMessageTime: '10:42 AM',
    unreadCount: 2,
    bookingId: 'BK-2025-0012',
    packageName: 'Magical Meghalaya Tour',
    destinationName: 'Meghalaya',
    travelDates: '20 May – 26 May, 2025',
    tripId: 'trip-001',
    hostPhone: '+91 98765 43210',
    messages: [
      {
        id: 'm1',
        senderId: 'agency-001',
        senderName: 'Wander North Travel',
        type: 'text',
        text: 'Hello Subham! Your Meghalaya trip is confirmed. Our lead host Subham Das and guide Ramesh Sangma will accompany your group.',
        timestamp: '10:30 AM',
        status: 'read',
      },
      {
        id: 'm2',
        senderId: 'agency-001',
        senderName: 'Wander North Travel',
        type: 'text',
        text: 'Pickup point confirmed at Guwahati Airport Gate 3 at 08:30 AM.',
        timestamp: '10:42 AM',
        status: 'read',
      },
    ],
  },
  {
    id: 'chat-002',
    agencyId: 'host-001',
    agencyName: 'Subham Das (Lead Trip Host)',
    agencyLogo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    isVerified: true,
    isOnline: true,
    category: 'hosts',
    lastMessage: 'Hi Subham, I will meet you tomorrow morning at Guwahati Airport.',
    lastMessageTime: '09:15 AM',
    unreadCount: 1,
    bookingId: 'BK-2025-0012',
    packageName: 'Magical Meghalaya Tour',
    destinationName: 'Shillong & Cherrapunji',
    travelDates: '20 May – 26 May, 2025',
    tripId: 'trip-001',
    hostPhone: '+91 98765 43210',
    messages: [
      {
        id: 'hm1',
        senderId: 'host-001',
        senderName: 'Subham Das',
        type: 'text',
        text: 'Hi Subham, I will meet you tomorrow morning at Guwahati Airport.',
        timestamp: '09:15 AM',
        status: 'read',
      },
    ],
  },
  {
    id: 'chat-003',
    agencyId: 'support-001',
    agencyName: 'Travel OS 24x7 Customer Support',
    agencyLogo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    isVerified: true,
    isOnline: true,
    category: 'support',
    lastMessage: 'How can we help you with your upcoming booking BK-2025-0012?',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    bookingId: 'BK-2025-0012',
    packageName: 'Travel OS Concierge',
    destinationName: 'Global Support',
    travelDates: '24x7 Support',
    tripId: 'trip-001',
    hostPhone: '+91 98765 99999',
    messages: [
      {
        id: 'sm1',
        senderId: 'support-001',
        senderName: 'Travel OS Support',
        type: 'text',
        text: 'How can we help you with your upcoming booking BK-2025-0012?',
        timestamp: 'Yesterday',
        status: 'read',
      },
    ],
  },
];

export const getChats = (): ChatConversation[] => INITIAL_CHATS;
export const getChatById = (id: string): ChatConversation =>
  INITIAL_CHATS.find((c) => c.id === id) || INITIAL_CHATS[0];

export const sendMessage = (chatId: string, text: string) => {
  const newMsg: ChatMessage = {
    id: `m-${Date.now()}`,
    senderId: 'user-001',
    senderName: 'Subham Das',
    type: 'text',
    text,
    timestamp: 'Just now',
    status: 'sent',
  };

  INITIAL_CHATS = INITIAL_CHATS.map((c) => {
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
};

export const markChatRead = (chatId: string) => {
  INITIAL_CHATS = INITIAL_CHATS.map((c) => {
    if (c.id === chatId) {
      return { ...c, unreadCount: 0 };
    }
    return c;
  });
};
