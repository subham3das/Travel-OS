// ─── Agency Inbox & Chat Type Definitions ───────────────────────────────────

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';
export type MessageType = 'text' | 'image' | 'pdf' | 'document' | 'location' | 'voice';
export type ConversationFilter =
  | 'All'
  | 'Unread'
  | 'Bookings'
  | 'Upcoming Trips'
  | 'Completed Trips'
  | 'VIP Customers'
  | 'VIP'
  | 'Archived';

export interface MessageAttachment {
  type: 'image' | 'pdf' | 'document';
  url: string;
  fileName?: string;
  fileSize?: string;
  publicId?: string;
  mimeType?: string;
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

export interface ConversationsResponse {
  conversations: Conversation[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  unreadCount: number;
}

export interface MessagesResponse {
  messages: ChatMessage[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
