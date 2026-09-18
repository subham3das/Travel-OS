import { auditLogRepository, AuditQueryFilter } from '../repositories/auditLog.repository.js';
import { NotFoundError } from '../utils/errors.util.js';
import { DateUtil } from '../utils/date.util.js';

export class AdminAuditLogsService {
  /**
   * 1. Get Paginated & Filtered Audit Logs
   */
  public async getAuditLogs(filters: AuditQueryFilter = {}, page = 1, limit = 20) {
    const { logs, total, totalPages } = await auditLogRepository.findLogs(filters, page, limit);

    const formattedLogs = logs.map((log) => {
      let iconType: string = 'shield';
      const evt = log.eventType.toLowerCase();
      if (evt.includes('approved')) iconType = 'check-shield';
      else if (evt.includes('updated') || evt.includes('edit')) iconType = 'edit';
      else if (evt.includes('refund')) iconType = 'refund';
      else if (evt.includes('failed') || evt.includes('alert')) iconType = 'alert-shield';
      else if (evt.includes('booking') || evt.includes('calendar')) iconType = 'calendar';
      else if (evt.includes('lock') || evt.includes('suspend')) iconType = 'user-lock';
      else if (evt.includes('package')) iconType = 'package';
      else if (evt.includes('delete') || evt.includes('trash')) iconType = 'trash';
      else if (evt.includes('key') || evt.includes('token')) iconType = 'key';

      return {
        id: log.eventId || log._id.toString(),
        timestamp: log.timestamp,
        date: log.date,
        module: log.module,
        eventType: log.eventType,
        description: log.description,
        actor: {
          name: log.actor.name,
          role: log.actor.role || 'Admin',
          email: log.actor.email || '',
          userId: log.actor.id ? `ADM-${log.actor.id.slice(-4).toUpperCase()}` : 'SYS',
          avatar: log.actor.profileImage,
          isSystem: log.actor.isSystem,
        },
        ipAddress: log.ipAddress,
        country: log.country || '🇮🇳',
        device: log.device || 'Desktop',
        browser: log.browser || 'Google Chrome',
        os: log.os || 'Windows 11',
        location: log.location || 'New Delhi, India',
        sessionId: log.sessionId || `sess_${log._id.toString().slice(-6)}`,
        severity: log.severity,
        status: log.status,
        iconType,
        changes: log.changes || [],
        metadata: log.metadata || {},
      };
    });

    return {
      logs: formattedLogs,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  /**
   * 2. Get Real-time KPI Stats
   */
  public async getKPIStats() {
    return auditLogRepository.getKPIStats();
  }

  /**
   * 3. Get Grouped Module Categories
   */
  public async getCategories() {
    return auditLogRepository.getCategories();
  }

  /**
   * 4. Get Event Distribution Breakdown
   */
  public async getDistribution() {
    return auditLogRepository.getDistribution();
  }

  /**
   * 5. Get Top Active Admins Leaderboard
   */
  public async getTopAdmins() {
    return auditLogRepository.getTopAdmins();
  }

  /**
   * 6. Get Security Alerts
   */
  public async getSecurityAlerts() {
    const alerts = await auditLogRepository.getSecurityAlerts();
    return alerts.map((alt) => {
      let iconType = 'shield';
      const desc = alt.description.toLowerCase();
      if (desc.includes('login') || desc.includes('failed')) iconType = 'alert';
      else if (desc.includes('permission') || desc.includes('role')) iconType = 'escalation';
      else if (desc.includes('location') || desc.includes('ip')) iconType = 'location';
      else if (desc.includes('api') || desc.includes('key')) iconType = 'api';

      return {
        id: alt.eventId || alt._id.toString(),
        title: alt.description,
        timeAgo: DateUtil.getRelativeTime(alt.createdAt),
        severity: alt.severity,
        iconType,
      };
    });
  }

  /**
   * 7. Get Temporal Login Activity Heatmap
   */
  public async getLoginHeatmap() {
    return auditLogRepository.getLoginHeatmap();
  }

  /**
   * 8. Get Single Event Details
   */
  public async getAuditLogById(id: string) {
    const log = await auditLogRepository.findById(id);
    if (!log) {
      throw new NotFoundError('Audit log event not found.');
    }

    return {
      id: log.eventId || log._id.toString(),
      timestamp: log.timestamp,
      date: log.date,
      module: log.module,
      eventType: log.eventType,
      description: log.description,
      actor: {
        name: log.actor.name,
        role: log.actor.role || 'Admin',
        email: log.actor.email || '',
        userId: log.actor.id ? `ADM-${log.actor.id.slice(-4).toUpperCase()}` : 'SYS',
        avatar: log.actor.profileImage,
        isSystem: log.actor.isSystem,
      },
      ipAddress: log.ipAddress,
      country: log.country || '🇮🇳',
      device: log.device || 'Desktop',
      browser: log.browser || 'Google Chrome',
      os: log.os || 'Windows 11',
      location: log.location || 'New Delhi, India',
      sessionId: log.sessionId || `sess_${log._id.toString().slice(-6)}`,
      severity: log.severity,
      status: log.status,
      changes: log.changes || [],
      metadata: log.metadata || {},
    };
  }
}

export const adminAuditLogsService = new AdminAuditLogsService();
