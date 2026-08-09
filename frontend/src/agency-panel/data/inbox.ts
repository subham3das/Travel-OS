// ─── Agency Panel Customer Inbox & DM Center Data Model & Mock Data ──────────

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';
export type MessageType = 'text' | 'image' | 'pdf' | 'location' | 'voice';
export type ConversationFilter = 'All' | 'Unread' | 'Bookings' | 'Upcoming Trips' | 'Completed Trips' | 'VIP Customers';

export interface MessageAttachment {
  type: 'image' | 'pdf';
  url: string;
  fileName?: string;
  fileSize?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: 'agency' | 'customer';
  text: string;
  timestampText: string;
  status: MessageStatus;
  type: MessageType;
  attachment?: MessageAttachment;
  templateType?: string;
}

export interface ConversationCompanion {
  id: string;
  name: string;
  relationship: string;
  avatar: string;
}

export interface ConversationCustomerInfo {
  customerId: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;
  bookingId: string;
  packageName: string;
  departureDate: string;
  paymentStatus: 'Paid' | 'Pending' | 'Partial';
  isVIP: boolean;
  tripStatus: 'Upcoming' | 'Ongoing' | 'Completed';
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  companions: ConversationCompanion[];
  privateNotes: string[];
}

export interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  bookingId: string;
  tripName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  customerInfo: ConversationCustomerInfo;
}

// ── Backend Ready API Schema Interfaces ──────────────────────────────────────
// GET  /api/agency/messages
// GET  /api/agency/messages/:conversationId
// POST /api/agency/messages/send
// GET  /api/agency/customers/:id/messages

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    customerId: 'cust-1',
    customerName: 'Subham Das',
    customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    bookingId: 'BK-2024-00568',
    tripName: 'Ladakh Expedition 2024',
    lastMessage: 'Pickup location has been updated. Looking forward to May 15!',
    lastMessageTime: '10:42 AM',
    unreadCount: 2,
    isOnline: true,
    customerInfo: {
      customerId: 'cust-1',
      name: 'Subham Das',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      phone: '+91 98765 43210',
      email: 'subhamdas@gmail.com',
      bookingId: 'BK-2024-00568',
      packageName: 'Ladakh Expedition 7D/6N',
      departureDate: '15 May 2024',
      paymentStatus: 'Paid',
      isVIP: true,
      tripStatus: 'Upcoming',
      emergencyContact: {
        name: 'Rohit Das',
        relationship: 'Brother',
        phone: '+91 98765 00000',
      },
      companions: [
        { id: 'cmp-1', name: 'Rahul Sharma', relationship: 'Friend', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200' },
        { id: 'cmp-2', name: 'Priya Sharma', relationship: 'Partner', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' },
        { id: 'cmp-3', name: 'Aman Das', relationship: 'Family Member', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200' },
      ],
      privateNotes: [
        'Vegetarian meals requested for all 4 group travelers.',
        'VIP Customer — front row seat allocation in tempo traveller.',
        'Requested early check-in at Leh resort.',
      ],
    },
  },
  {
    id: 'conv-2',
    customerId: 'cust-2',
    customerName: 'Priya Sharma',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
    bookingId: 'BK-2025-01123',
    tripName: 'Meghalaya Backpacking',
    lastMessage: 'Hi Subham! Here is the detailed itinerary for your trip.',
    lastMessageTime: 'Yesterday',
    unreadCount: 1,
    isOnline: true,
    customerInfo: {
      customerId: 'cust-2',
      name: 'Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
      phone: '+91 91234 56789',
      email: 'priya.sharma@gmail.com',
      bookingId: 'BK-2025-01123',
      packageName: 'Meghalaya Backpacking 6D/5N',
      departureDate: '05 Dec 2025',
      paymentStatus: 'Paid',
      isVIP: false,
      tripStatus: 'Completed',
      emergencyContact: {
        name: 'Sanjay Sharma',
        relationship: 'Father',
        phone: '+91 98111 22334',
      },
      companions: [],
      privateNotes: [
        'Solo female traveler — assigned single room accommodation.',
      ],
    },
  },
  {
    id: 'conv-3',
    customerId: 'cust-3',
    customerName: 'Rahul Verma',
    customerAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300',
    bookingId: 'BK-2025-00987',
    tripName: 'Kashmir Escape 6D',
    lastMessage: 'Thank you! We look forward to hosting you.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    isOnline: false,
    customerInfo: {
      customerId: 'cust-3',
      name: 'Rahul Verma',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300',
      phone: '+91 99887 76655',
      email: 'rahul.verma@gmail.com',
      bookingId: 'BK-2025-00987',
      packageName: 'Kashmir Escape 6D/5N',
      departureDate: '10 Nov 2025',
      paymentStatus: 'Paid',
      isVIP: false,
      tripStatus: 'Completed',
      emergencyContact: {
        name: 'Neha Verma',
        relationship: 'Spouse',
        phone: '+91 99887 00000',
      },
      companions: [
        { id: 'cmp-4', name: 'Neha Verma', relationship: 'Partner', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200' },
      ],
      privateNotes: [
        'Requested quiet room away from main elevator.',
      ],
    },
  },
  {
    id: 'conv-4',
    customerId: 'cust-4',
    customerName: 'Ananya Iyer',
    customerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300',
    bookingId: 'BK-2025-00765',
    tripName: 'Goa Fun Escape',
    lastMessage: 'Can you please resend my payment receipt and flight voucher?',
    lastMessageTime: 'Mon',
    unreadCount: 3,
    isOnline: true,
    customerInfo: {
      customerId: 'cust-4',
      name: 'Ananya Iyer',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300',
      phone: '+91 90001 23456',
      email: 'ananya.iyer@gmail.com',
      bookingId: 'BK-2025-00765',
      packageName: 'Goa Fun Escape 4D/3N',
      departureDate: '15 Oct 2025',
      paymentStatus: 'Paid',
      isVIP: false,
      tripStatus: 'Completed',
      emergencyContact: {
        name: 'Kavita Iyer',
        relationship: 'Mother',
        phone: '+91 90001 00000',
      },
      companions: [],
      privateNotes: [
        'Requested late check-out flexibility.',
      ],
    },
  },
  {
    id: 'conv-5',
    customerId: 'cust-5',
    customerName: 'Aman Gupta',
    customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
    bookingId: 'BK-2025-00432',
    tripName: 'Spiti Valley Biking',
    lastMessage: 'We have received your payment. Invoice attached.',
    lastMessageTime: 'Sat',
    unreadCount: 0,
    isOnline: false,
    customerInfo: {
      customerId: 'cust-5',
      name: 'Aman Gupta',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
      phone: '+91 87654 32109',
      email: 'aman.gupta@gmail.com',
      bookingId: 'BK-2025-00432',
      packageName: 'Spiti Valley Biking 7D',
      departureDate: '10 Jul 2025',
      paymentStatus: 'Paid',
      isVIP: false,
      tripStatus: 'Completed',
      emergencyContact: {
        name: 'Vikram Gupta',
        relationship: 'Brother',
        phone: '+91 87654 00000',
      },
      companions: [
        { id: 'cmp-5', name: 'Rohan Gupta', relationship: 'Brother', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200' },
      ],
      privateNotes: [
        'Senior Citizen assistance required for parent companion.',
      ],
    },
  },
];

export const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  'conv-1': [
    {
      id: 'm1-1',
      conversationId: 'conv-1',
      sender: 'customer',
      text: 'Hello! Excited for the Ladakh Expedition starting May 15.',
      timestampText: 'Yesterday 09:30 AM',
      status: 'read',
      type: 'text',
    },
    {
      id: 'm1-2',
      conversationId: 'conv-1',
      sender: 'agency',
      text: 'Welcome Subham! We are thrilled to host your group. Here is your trip itinerary document.',
      timestampText: 'Yesterday 09:35 AM',
      status: 'read',
      type: 'pdf',
      attachment: {
        type: 'pdf',
        url: '#',
        fileName: 'Ladakh_Expedition_Detailed_Itinerary.pdf',
        fileSize: '2.4 MB',
      },
    },
    {
      id: 'm1-3',
      conversationId: 'conv-1',
      sender: 'customer',
      text: 'Thank you! Can you confirm if all 4 of our seats in the Traveller bus are together?',
      timestampText: 'Yesterday 10:15 AM',
      status: 'read',
      type: 'text',
    },
    {
      id: 'm1-4',
      conversationId: 'conv-1',
      sender: 'agency',
      text: 'Yes absolutely! As a VIP customer, we have reserved front seats 12A, 12B, 12C, and 12D for your group.',
      timestampText: 'Yesterday 10:20 AM',
      status: 'read',
      type: 'text',
    },
    {
      id: 'm1-5',
      conversationId: 'conv-1',
      sender: 'customer',
      text: 'Pickup location has been updated. Looking forward to May 15!',
      timestampText: '10:42 AM',
      status: 'read',
      type: 'text',
    },
  ],
  'conv-2': [
    {
      id: 'm2-1',
      conversationId: 'conv-2',
      sender: 'agency',
      text: 'Hi Priya! Here is the detailed itinerary for your Meghalaya trip.',
      timestampText: 'Yesterday 04:00 PM',
      status: 'read',
      type: 'text',
    },
    {
      id: 'm2-2',
      conversationId: 'conv-2',
      sender: 'customer',
      text: 'Thanks! Is single room confirmed for all nights?',
      timestampText: 'Yesterday 04:30 PM',
      status: 'read',
      type: 'text',
    },
  ],
  'conv-3': [
    {
      id: 'm3-1',
      conversationId: 'conv-3',
      sender: 'customer',
      text: 'Payment completed for Kashmir booking BK-2025-00987.',
      timestampText: 'Yesterday',
      status: 'read',
      type: 'text',
    },
    {
      id: 'm3-2',
      conversationId: 'conv-3',
      sender: 'agency',
      text: 'Thank you! We look forward to hosting you.',
      timestampText: 'Yesterday',
      status: 'read',
      type: 'text',
    },
  ],
  'conv-4': [
    {
      id: 'm4-1',
      conversationId: 'conv-4',
      sender: 'customer',
      text: 'Can you please resend my payment receipt and flight voucher?',
      timestampText: 'Mon',
      status: 'read',
      type: 'text',
    },
  ],
  'conv-5': [
    {
      id: 'm5-1',
      conversationId: 'conv-5',
      sender: 'agency',
      text: 'We have received your payment. Invoice attached.',
      timestampText: 'Sat',
      status: 'read',
      type: 'pdf',
      attachment: {
        type: 'pdf',
        url: '#',
        fileName: 'Invoice_BK_2025_00432.pdf',
        fileSize: '1.2 MB',
      },
    },
  ],
};
