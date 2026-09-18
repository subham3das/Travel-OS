import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { corsOptions } from '../config/cors.config.js';
import { TokenUtil, JwtTokenPayload } from '../utils/token.util.js';
import { logger } from '../config/logger.config.js';

interface AuthenticatedSocket extends Socket {
  userPayload?: JwtTokenPayload;
  entityType?: 'agency' | 'user' | 'admin';
  entityId?: string;
}

class SocketService {
  private static instance: SocketService;
  private io: Server | null = null;
  // Map of entityId -> Set of socket IDs
  private onlineUsers = new Map<string, Set<string>>();

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public init(httpServer: HttpServer): Server {
    if (this.io) {
      return this.io;
    }

    this.io = new Server(httpServer, {
      cors: corsOptions,
      transports: ['websocket', 'polling'],
      pingTimeout: 30000,
      pingInterval: 25000,
    });

    // 1. JWT Authentication Middleware
    this.io.use((socket: AuthenticatedSocket, next) => {
      try {
        const token =
          socket.handshake.auth?.token ||
          socket.handshake.headers?.authorization?.replace('Bearer ', '') ||
          socket.handshake.query?.token;

        if (!token || typeof token !== 'string') {
          // Allow connection as guest if needed, or authenticate
          return next();
        }

        try {
          const payload = TokenUtil.verifyAccessToken(token);
          socket.userPayload = payload;

          if (payload.agencyId || payload.role === 'AGENCY' || payload.role === 'AGENCY_ADMIN') {
            socket.entityType = 'agency';
            socket.entityId = payload.agencyId || payload.userId;
          } else if (payload.role === 'SUPER_ADMIN' || payload.role === 'ADMIN') {
            socket.entityType = 'admin';
            socket.entityId = payload.userId;
          } else {
            socket.entityType = 'user';
            socket.entityId = payload.userId;
          }
        } catch (err: any) {
          logger.warn('Socket token verification failed: %s', err.message);
        }

        next();
      } catch (error: any) {
        logger.error('Socket middleware error: %s', error.message);
        next(error);
      }
    });

    // 2. Connection Handler
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      const entityId = socket.entityId;
      const entityType = socket.entityType;

      if (entityId) {
        // Track presence
        if (!this.onlineUsers.has(entityId)) {
          this.onlineUsers.set(entityId, new Set());
        }
        this.onlineUsers.get(entityId)!.add(socket.id);

        // Join personal / entity room
        if (entityType === 'agency') {
          socket.join(`agency_${entityId}`);
          logger.info('🏢 Agency connected to socket room agency_%s (socket: %s)', entityId, socket.id);
        } else if (entityType === 'user') {
          socket.join(`user_${entityId}`);
          this.io?.emit('customer_online', { customerId: entityId });
          logger.info('👤 Customer connected to socket room user_%s (socket: %s)', entityId, socket.id);
        } else if (entityType === 'admin') {
          socket.join('admin');
          socket.join(`admin_${entityId}`);
          logger.info('🛡️ Admin connected to socket room admin / admin_%s (socket: %s)', entityId, socket.id);
        }
      } else if (entityType === 'admin') {
        socket.join('admin');
        logger.info('🛡️ Admin connected to socket room admin (socket: %s)', socket.id);
      }

      // Join Conversation Room
      socket.on('join_conversation', (conversationId: string) => {
        if (conversationId) {
          socket.join(`conversation_${conversationId}`);
          logger.info('💬 Socket %s joined conversation_%s', socket.id, conversationId);
        }
      });

      // Leave Conversation Room
      socket.on('leave_conversation', (conversationId: string) => {
        if (conversationId) {
          socket.leave(`conversation_${conversationId}`);
          logger.info('👋 Socket %s left conversation_%s', socket.id, conversationId);
        }
      });

      // Typing indicators
      socket.on('typing', ({ conversationId, senderName, senderType }) => {
        if (conversationId) {
          socket.to(`conversation_${conversationId}`).emit('typing', {
            conversationId,
            senderName,
            senderType,
          });
        }
      });

      socket.on('stop_typing', ({ conversationId, senderType }) => {
        if (conversationId) {
          socket.to(`conversation_${conversationId}`).emit('stop_typing', {
            conversationId,
            senderType,
          });
        }
      });

      // Disconnect Handler
      socket.on('disconnect', () => {
        if (entityId && this.onlineUsers.has(entityId)) {
          const socketSet = this.onlineUsers.get(entityId)!;
          socketSet.delete(socket.id);
          if (socketSet.size === 0) {
            this.onlineUsers.delete(entityId);
            if (entityType === 'user') {
              this.io?.emit('customer_offline', { customerId: entityId });
            }
          }
        }
        logger.info('🔌 Socket disconnected: %s', socket.id);
      });
    });

    logger.info('✓ Socket.IO Real-Time Engine Initialized');
    return this.io;
  }

  public getIO(): Server | null {
    return this.io;
  }

  public isUserOnline(userId: string): boolean {
    return this.onlineUsers.has(userId) && this.onlineUsers.get(userId)!.size > 0;
  }

  public getOnlineUserIds(): string[] {
    return Array.from(this.onlineUsers.keys());
  }

  public emitToConversation(conversationId: string, event: string, data: any): void {
    if (this.io) {
      this.io.to(`conversation_${conversationId}`).emit(event, data);
    }
  }

  public emitToAdmin(event: string, data: any): void {
    if (this.io) {
      this.io.to('admin').emit(event, data);
    }
  }

  public emitToAgency(agencyId: string, event: string, data: any): void {
    if (this.io) {
      this.io.to(`agency_${agencyId}`).emit(event, data);
    }
  }

  public emitToUser(userId: string, event: string, data: any): void {
    if (this.io) {
      this.io.to(`user_${userId}`).emit(event, data);
    }
  }
}

export const socketService = SocketService.getInstance();
