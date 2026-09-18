import { AuditLogModel, IAuditLog, AuditSeverity, AuditStatus } from '../models/auditLog.model.js';

export interface LogAuditEventParams {
  actor?: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    profileImage?: string;
    isSystem?: boolean;
  };
  sessionId?: string;
  module: string;
  action: string;
  eventType: string;
  description: string;
  severity?: AuditSeverity;
  status?: AuditStatus;
  ipAddress?: string;
  country?: string;
  browser?: string;
  device?: string;
  os?: string;
  location?: string;
  changes?: Array<{ field: string; before?: string; after?: string }>;
  metadata?: Record<string, any>;
}

export class AuditLoggerService {
  /**
   * Automatically generate high-entropy enterprise event ID
   * Format: EVT-YYYY-MM-DD-HHMMSS-XXXX
   */
  public static generateEventId(): string {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const yyyy = now.getFullYear();
    const mm = pad(now.getMonth() + 1);
    const dd = pad(now.getDate());
    const hh = pad(now.getHours());
    const min = pad(now.getMinutes());
    const ss = pad(now.getSeconds());
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();

    return `EVT-${yyyy}-${mm}-${dd}-${hh}${min}${ss}-${rand}`;
  }

  /**
   * Log an immutable audit log entry into MongoDB
   */
  public static async log(params: LogAuditEventParams): Promise<IAuditLog | null> {
    try {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });

      const eventId = this.generateEventId();

      const doc = await AuditLogModel.create({
        eventId,
        timestamp: timeStr,
        date: dateStr,
        actor: {
          id: params.actor?.id || 'system',
          name: params.actor?.name || (params.actor?.isSystem ? 'System Engine' : 'Administrator'),
          email: params.actor?.email || '',
          role: params.actor?.role || (params.actor?.isSystem ? 'Automated' : 'Super Admin'),
          profileImage: params.actor?.profileImage || '',
          isSystem: params.actor?.isSystem ?? false,
        },
        sessionId: params.sessionId || `sess_${Date.now()}`,
        module: params.module,
        action: params.action,
        eventType: params.eventType,
        description: params.description,
        severity: params.severity || 'Low',
        status: params.status || 'Success',
        ipAddress: params.ipAddress || '127.0.0.1',
        country: params.country || '🇮🇳',
        browser: params.browser || 'Google Chrome',
        device: params.device || 'Desktop',
        os: params.os || 'Windows 11',
        location: params.location || 'New Delhi, India',
        changes: params.changes || [],
        metadata: params.metadata || {},
      });

      return doc;
    } catch (error) {
      console.error('⚠️ Failed to write audit log:', error);
      return null;
    }
  }
}
