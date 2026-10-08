// ─── Car Rental Chat & Messages API Service ──────────────────────────────────
// Mirrors agencyChat.service.ts but calls /agencies/car-rental/conversations/* endpoints.
// All data is scoped to Car Rental vehicle bookings only.

import { agencyApiClient } from './agencyApiClient';
import {
  Conversation,
  ChatMessage,
  ConversationsResponse,
  MessagesResponse,
  ConversationFilter,
} from '../types/inbox';

export class CarRentalChatService {
  /**
   * Fetch paginated car-rental conversations (vehicle booking chats only)
   */
  public async getConversations(
    filter: ConversationFilter = 'All',
    search?: string,
    page: number = 1,
    limit: number = 30
  ): Promise<ConversationsResponse> {
    const res = await agencyApiClient.get<Conversation[]>('/agencies/car-rental/conversations', {
      params: { filter, search: search || undefined, page, limit },
    });

    const conversations = Array.isArray(res.data) ? res.data : [];
    const meta = (res as any).meta || {};

    return {
      conversations,
      pagination: meta.pagination || { total: conversations.length, page, limit, totalPages: 1 },
      unreadCount: meta.unreadCount || 0,
    };
  }

  /**
   * Fetch single car-rental conversation by ID
   */
  public async getConversationById(conversationId: string): Promise<Conversation> {
    const res = await agencyApiClient.get<Conversation>(
      `/agencies/car-rental/conversations/${conversationId}`
    );
    if (!res.data) throw new Error(res.message || 'Conversation not found');
    return res.data;
  }

  /**
   * Fetch messages for a car-rental conversation
   */
  public async getMessages(
    conversationId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<MessagesResponse> {
    const res = await agencyApiClient.get<ChatMessage[]>(
      `/agencies/car-rental/conversations/${conversationId}/messages`,
      { params: { page, limit } }
    );

    const messages = Array.isArray(res.data) ? res.data : [];
    const meta = (res as any).meta || {};

    return {
      messages,
      pagination: meta.pagination || { total: messages.length, page, limit, totalPages: 1 },
    };
  }

  /**
   * Send a message in a car-rental conversation
   */
  public async sendMessage(
    conversationId: string,
    payload: {
      text?: string;
      messageType?: 'text' | 'image' | 'pdf' | 'document' | 'location';
      attachments?: Array<{
        secureUrl: string;
        publicId?: string;
        fileName?: string;
        fileSize?: string;
        mimeType?: string;
        fileType: 'image' | 'pdf' | 'document';
      }>;
    }
  ): Promise<ChatMessage> {
    const res = await agencyApiClient.post<ChatMessage>(
      `/agencies/car-rental/conversations/${conversationId}/messages`,
      payload
    );
    if (!res.data) throw new Error(res.message || 'Failed to send message');
    return res.data;
  }

  /**
   * Mark a car-rental conversation as read
   */
  public async markAsRead(conversationId: string): Promise<{ unreadCount: number }> {
    const res = await agencyApiClient.post<{ unreadCount: number }>(
      `/agencies/car-rental/conversations/${conversationId}/read`
    );
    return res.data || { unreadCount: 0 };
  }

  /**
   * Upload an attachment via car-rental upload endpoint
   */
  public async uploadAttachment(file: File): Promise<{
    secureUrl: string;
    publicId?: string;
    fileName: string;
    fileSize: string;
    mimeType: string;
    fileType: 'image' | 'pdf' | 'document';
  }> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await agencyApiClient.post<any>('/agencies/car-rental/messages/upload', formData);
    if (!res.data || !res.data.secureUrl) {
      throw new Error(res.message || 'Failed to upload attachment');
    }
    return res.data;
  }
}

export const carRentalChatService = new CarRentalChatService();
