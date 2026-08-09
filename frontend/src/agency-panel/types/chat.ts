// ─── Chat Types ──────────────────────────────────────────────────────────────

export type ChatMessageType = 'text' | 'image' | 'document' | 'system';
export type ChatMessageStatus = 'sent' | 'delivered' | 'read';

export interface AgencyChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: 'agency' | 'traveler' | 'system';
  type: ChatMessageType;
  text: string;
  attachmentUrl?: string;
  status: ChatMessageStatus;
  timestamp: string;
}

export interface AgencyConversation {
  id: string;
  agencyId: string;
  userId: string;
  travelerName: string;
  travelerAvatar?: string;
  bookingId?: string;
  packageTitle?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  messages: AgencyChatMessage[];
}
