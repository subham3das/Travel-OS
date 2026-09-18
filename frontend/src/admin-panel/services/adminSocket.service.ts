import { io, Socket } from 'socket.io-client';
import { adminApiClient } from './adminApiClient';

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace('/api', '')
    : 'http://localhost:5000');

class AdminSocketService {
  private static instance: AdminSocketService;
  private socket: Socket | null = null;
  private listeners = new Map<string, Set<(...args: any[]) => void>>();

  private constructor() {}

  public static getInstance(): AdminSocketService {
    if (!AdminSocketService.instance) {
      AdminSocketService.instance = new AdminSocketService();
    }
    return AdminSocketService.instance;
  }

  public connect(): Socket {
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    const token = adminApiClient.getAccessToken();

    this.socket = io(BACKEND_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    this.socket.on('connect', () => {
      console.log('🛡️ Admin Real-time Socket connected:', this.socket?.id);
    });

    this.socket.on('connect_error', (err) => {
      console.warn('Admin socket connection error:', err.message);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Admin socket disconnected:', reason);
    });

    return this.socket;
  }

  public getSocket(): Socket | null {
    if (!this.socket) {
      return this.connect();
    }
    return this.socket;
  }

  /**
   * Listen for new real-time notifications pushed from the server
   */
  public onNotificationNew(callback: (notification: any) => void): () => void {
    const s = this.getSocket();
    s?.on('notification:new', callback);
    return () => {
      s?.off('notification:new', callback);
    };
  }

  /**
   * Listen for notification read state changes
   */
  public onNotificationRead(callback: (data: { id: string; isUnread: boolean; status: string }) => void): () => void {
    const s = this.getSocket();
    s?.on('notification:read', callback);
    return () => {
      s?.off('notification:read', callback);
    };
  }

  /**
   * Listen for mark-all-read broadcast
   */
  public onNotificationReadAll(callback: (data: { recipientType: string; readAll: boolean }) => void): () => void {
    const s = this.getSocket();
    s?.on('notification:read_all', callback);
    return () => {
      s?.off('notification:read_all', callback);
    };
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const adminSocketService = AdminSocketService.getInstance();
