// ─── Agency Chat & Messages Live API Service ───────────────────────────────
import { agencyApiClient, AgencyApiResponse } from './agencyApiClient';
import {
  Conversation,
  ChatMessage,
  ConversationsResponse,
  MessagesResponse,
  ConversationFilter,
} from '../types/inbox';

export class AgencyChatService {
  /**
   * Fetch paginated conversations with server-side filtering & search
   */
  public async getConversations(
    filter: ConversationFilter = 'All',
    search?: string,
    page: number = 1,
    limit: number = 30
  ): Promise<ConversationsResponse> {
    const res = await agencyApiClient.get<Conversation[]>('/agency/conversations', {
      params: {
        filter,
        search: search || undefined,
        page,
        limit,
      },
    });

    const conversations = Array.isArray(res.data) ? res.data : [];
    const meta = (res as any).meta || {};

    return {
      conversations,
      pagination: meta.pagination || {
        total: conversations.length,
        page,
        limit,
        totalPages: 1,
      },
      unreadCount: meta.unreadCount || 0,
    };
  }

  /**
   * Fetch single conversation detail by ID
   */
  public async getConversationById(conversationId: string): Promise<Conversation> {
    const res = await agencyApiClient.get<Conversation>(`/agency/conversations/${conversationId}`);
    if (!res.data) {
      throw new Error(res.message || 'Conversation not found');
    }
    return res.data;
  }

  /**
   * Fetch paginated messages for a conversation
   */
  public async getMessages(
    conversationId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<MessagesResponse> {
    const res = await agencyApiClient.get<ChatMessage[]>(
      `/agency/conversations/${conversationId}/messages`,
      {
        params: { page, limit },
      }
    );

    const messages = Array.isArray(res.data) ? res.data : [];
    const meta = (res as any).meta || {};

    return {
      messages,
      pagination: meta.pagination || {
        total: messages.length,
        page,
        limit,
        totalPages: 1,
      },
    };
  }

  /**
   * Send a message to a customer
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
      `/agency/conversations/${conversationId}/messages`,
      payload
    );
    if (!res.data) {
      throw new Error(res.message || 'Failed to send message');
    }
    return res.data;
  }

  /**
   * Mark conversation messages as read
   */
  public async markAsRead(conversationId: string): Promise<{ unreadCount: number }> {
    const res = await agencyApiClient.post<{ unreadCount: number }>(
      `/agency/conversations/${conversationId}/read`
    );
    return res.data || { unreadCount: 0 };
  }

  /**
   * Create staff private note for a customer
   */
  public async createPrivateNote(
    customerId: string,
    note: string,
    bookingId?: string
  ): Promise<{ id: string; note: string; authorName: string; createdAt: string }> {
    const res = await agencyApiClient.post<{
      id: string;
      note: string;
      authorName: string;
      createdAt: string;
    }>(`/agency/customers/${customerId}/private-notes`, {
      note,
      bookingId,
    });
    if (!res.data) {
      throw new Error(res.message || 'Failed to save staff note');
    }
    return res.data;
  }

  /**
   * Update staff private note
   */
  public async updatePrivateNote(noteId: string, note: string): Promise<{ id: string; note: string }> {
    const res = await agencyApiClient.put<{ id: string; note: string }>(
      `/agency/customers/any/private-notes/${noteId}`,
      { note }
    );
    if (!res.data) {
      throw new Error(res.message || 'Failed to update note');
    }
    return res.data;
  }

  /**
   * Delete staff private note
   */
  public async deletePrivateNote(noteId: string): Promise<boolean> {
    const res = await agencyApiClient.delete(`/agency/customers/any/private-notes/${noteId}`);
    return Boolean(res.success);
  }

  /**
   * Upload attachment to Cloudinary via backend
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

    const res = await agencyApiClient.post<any>('/agency/messages/upload', formData);
    if (!res.data || !res.data.secureUrl) {
      throw new Error(res.message || 'Failed to upload attachment');
    }
    return res.data;
  }
}

export const agencyChatService = new AgencyChatService();
