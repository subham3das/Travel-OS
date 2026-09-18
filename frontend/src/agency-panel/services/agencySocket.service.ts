import { io, Socket } from 'socket.io-client';
import { agencyApiClient } from './agencyApiClient';
import { ChatMessage } from '../types/inbox';

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace('/api', '')
    : 'http://localhost:5000');

class AgencySocketService {
  private static instance: AgencySocketService;
  private socket: Socket | null = null;

  private constructor() {}

  public static getInstance(): AgencySocketService {
    if (!AgencySocketService.instance) {
      AgencySocketService.instance = new AgencySocketService();
    }
    return AgencySocketService.instance;
  }

  public connect(): Socket {
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    const token = agencyApiClient.getAccessToken();

    this.socket = io(BACKEND_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    this.socket.on('connect', () => {
      console.log('⚡ Agency Real-time Socket connected:', this.socket?.id);
    });

    this.socket.on('connect_error', (err) => {
      console.warn('Agency socket connection error:', err.message);
    });

    return this.socket;
  }

  public getSocket(): Socket | null {
    if (!this.socket) {
      return this.connect();
    }
    return this.socket;
  }

  public joinConversation(conversationId: string) {
    if (!conversationId) return;
    const s = this.getSocket();
    s?.emit('join_conversation', conversationId);
  }

  public leaveConversation(conversationId: string) {
    if (!conversationId) return;
    const s = this.getSocket();
    s?.emit('leave_conversation', conversationId);
  }

  public emitTyping(conversationId: string, senderName: string) {
    if (!conversationId) return;
    const s = this.getSocket();
    s?.emit('typing', { conversationId, senderName, senderType: 'agency' });
  }

  public emitStopTyping(conversationId: string) {
    if (!conversationId) return;
    const s = this.getSocket();
    s?.emit('stop_typing', { conversationId, senderType: 'agency' });
  }

  public onNewMessage(callback: (msg: ChatMessage) => void) {
    const s = this.getSocket();
    s?.on('new_message', callback);
    return () => {
      s?.off('new_message', callback);
    };
  }

  public onMessageRead(callback: (data: { conversationId: string; readBy?: string }) => void) {
    const s = this.getSocket();
    s?.on('message_read', callback);
    return () => {
      s?.off('message_read', callback);
    };
  }

  public onConversationUpdated(callback: (data: any) => void) {
    const s = this.getSocket();
    s?.on('conversation_updated', callback);
    return () => {
      s?.off('conversation_updated', callback);
    };
  }

  public onCustomerPresence(
    onOnline: (data: { customerId: string }) => void,
    onOffline: (data: { customerId: string }) => void
  ) {
    const s = this.getSocket();
    s?.on('customer_online', onOnline);
    s?.on('customer_offline', onOffline);
    return () => {
      s?.off('customer_online', onOnline);
      s?.off('customer_offline', onOffline);
    };
  }

  public onTyping(callback: (data: { conversationId: string; senderName: string; senderType: string }) => void) {
    const s = this.getSocket();
    s?.on('typing', callback);
    return () => {
      s?.off('typing', callback);
    };
  }

  public onStopTyping(callback: (data: { conversationId: string; senderType: string }) => void) {
    const s = this.getSocket();
    s?.on('stop_typing', callback);
    return () => {
      s?.off('stop_typing', callback);
    };
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const agencySocketService = AgencySocketService.getInstance();
