// ─── Car Rental Socket Service ────────────────────────────────────────────────
// Mirrors agencySocket.service.ts but uses separate rooms scoped to Car Rental.
// Room format: carRental_<agencyId>
// Sender type: 'car_rental'

import { io, Socket } from 'socket.io-client';
import { agencyApiClient } from './agencyApiClient';
import { ChatMessage } from '../types/inbox';

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace('/api', '')
    : 'http://localhost:5000');

class CarRentalSocketService {
  private static instance: CarRentalSocketService;
  private socket: Socket | null = null;

  private constructor() {}

  public static getInstance(): CarRentalSocketService {
    if (!CarRentalSocketService.instance) {
      CarRentalSocketService.instance = new CarRentalSocketService();
    }
    return CarRentalSocketService.instance;
  }

  public connect(): Socket {
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    const token = agencyApiClient.getAccessToken();

    this.socket = io(BACKEND_URL, {
      auth: { token, context: 'car_rental' },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    this.socket.on('connect', () => {
      console.log('🚗 Car Rental Real-time Socket connected:', this.socket?.id);
    });

    this.socket.on('connect_error', (err) => {
      console.warn('Car Rental socket connection error:', err.message);
    });

    return this.socket;
  }

  public getSocket(): Socket | null {
    if (!this.socket) return this.connect();
    return this.socket;
  }

  /** Join a conversation room (shared room key with agency socket) */
  public joinConversation(conversationId: string) {
    if (!conversationId) return;
    this.getSocket()?.emit('join_conversation', conversationId);
  }

  public leaveConversation(conversationId: string) {
    if (!conversationId) return;
    this.getSocket()?.emit('leave_conversation', conversationId);
  }

  /** Emit typing as car_rental provider */
  public emitTyping(conversationId: string, senderName: string) {
    if (!conversationId) return;
    this.getSocket()?.emit('typing', { conversationId, senderName, senderType: 'car_rental' });
  }

  public emitStopTyping(conversationId: string) {
    if (!conversationId) return;
    this.getSocket()?.emit('stop_typing', { conversationId, senderType: 'car_rental' });
  }

  public onNewMessage(callback: (msg: ChatMessage) => void) {
    const s = this.getSocket();
    s?.on('new_message', callback);
    return () => s?.off('new_message', callback);
  }

  public onMessageRead(callback: (data: { conversationId: string; readBy?: string }) => void) {
    const s = this.getSocket();
    s?.on('message_read', callback);
    return () => s?.off('message_read', callback);
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

  public onTyping(
    callback: (data: { conversationId: string; senderName: string; senderType: string }) => void
  ) {
    const s = this.getSocket();
    s?.on('typing', callback);
    return () => s?.off('typing', callback);
  }

  public onStopTyping(
    callback: (data: { conversationId: string; senderType: string }) => void
  ) {
    const s = this.getSocket();
    s?.on('stop_typing', callback);
    return () => s?.off('stop_typing', callback);
  }

  /** Listen for car-rental-scoped notification events */
  public onNotification(callback: (data: any) => void) {
    const s = this.getSocket();
    s?.on('notification_created', callback);
    return () => s?.off('notification_created', callback);
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const carRentalSocketService = CarRentalSocketService.getInstance();
