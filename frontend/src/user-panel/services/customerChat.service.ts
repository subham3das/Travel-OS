import { apiClient } from '../../services/apiClient';
import { ChatConversation, ChatMessage } from '../data/chats';

class CustomerChatService {
  /**
   * Fetch all conversations for the customer
   */
  public async getConversations(): Promise<ChatConversation[]> {
    try {
      const res = await apiClient.get<{ conversations: ChatConversation[] }>('/chat/conversations');
      return res.data?.conversations || [];
    } catch {
      return [];
    }
  }

  /**
   * Fetch single conversation by ID with message history
   */
  public async getConversationById(id: string): Promise<ChatConversation | null> {
    try {
      const res = await apiClient.get<{ conversation: ChatConversation }>(`/chat/conversations/${encodeURIComponent(id)}`);
      return res.data?.conversation || null;
    } catch {
      return null;
    }
  }

  /**
   * Send a chat message
   */
  public async sendMessage(conversationId: string, text: string): Promise<ChatMessage> {
    const res = await apiClient.post<{ message: ChatMessage }>(`/chat/conversations/${encodeURIComponent(conversationId)}/messages`, {
      text,
    });
    if (!res.data?.message) {
      throw new Error(res.message || 'Failed to send message');
    }
    return res.data.message;
  }
}

export const customerChatService = new CustomerChatService();
