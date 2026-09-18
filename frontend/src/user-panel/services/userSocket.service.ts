import { io, Socket } from 'socket.io-client';
import { apiClient } from '../../services/apiClient';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace('/api', '')
  : 'http://localhost:5000';

class UserSocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  public connect(): Socket {
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    const token = apiClient.getAccessToken();

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    this.socket.on('connect', () => {
      console.log('⚡ Connected to real-time User Socket:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Disconnected from real-time User Socket:', reason);
    });

    // Wire wildcard / tracked events
    this.socket.on('notification:new', (data) => {
      this.notifyListeners('notification:new', data);
    });

    this.socket.on('notification:read', (data) => {
      this.notifyListeners('notification:read', data);
    });

    this.socket.on('notification:read_all', (data) => {
      this.notifyListeners('notification:read_all', data);
    });

    this.socket.on('message:new', (data) => {
      this.notifyListeners('message:new', data);
    });

    this.socket.on('message:received', (data) => {
      this.notifyListeners('message:received', data);
    });

    this.socket.on('chat:typing', (data) => {
      this.notifyListeners('chat:typing', data);
    });

    return this.socket;
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public subscribe(event: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    if (!this.socket || !this.socket.connected) {
      this.connect();
    }

    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  private notifyListeners(event: string, data: any) {
    const set = this.listeners.get(event);
    if (set) {
      set.forEach((cb) => {
        try {
          cb(data);
        } catch (e) {
          console.error(`Error in socket listener for ${event}:`, e);
        }
      });
    }
  }

  public joinConversation(conversationId: string) {
    this.socket?.emit('join_conversation', conversationId);
  }

  public leaveConversation(conversationId: string) {
    this.socket?.emit('leave_conversation', conversationId);
  }

  public emit(event: string, data: any) {
    if (!this.socket || !this.socket.connected) {
      this.connect();
    }
    this.socket?.emit(event, data);
  }
}

export const userSocketService = new UserSocketService();
