import { AuditLogModel, IAuditLog } from '../models/auditLog.model.js';
import mongoose from 'mongoose';

export interface AuditQueryFilter {
  search?: string;
  category?: string;
  severity?: string;
  module?: string;
  user?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export class AuditLogRepository {
  /**
   * Build MongoDB filter query from client filters
   */
  private buildQuery(filters: AuditQueryFilter = {}) {
    const query: any = {};

    if (filters.category && filters.category !== 'All') {
      query.module = { $regex: new RegExp(`^${filters.category}$`, 'i') };
    }

    if (filters.module && filters.module !== 'All Modules' && filters.module !== 'All') {
      query.module = { $regex: new RegExp(`^${filters.module}$`, 'i') };
    }

    if (filters.severity && filters.severity !== 'All Severities' && filters.severity !== 'All') {
      query.severity = filters.severity;
    }

    if (filters.status && filters.status !== 'All Statuses' && filters.status !== 'All') {
      query.status = filters.status;
    }

    if (filters.search && filters.search.trim() !== '') {
      const searchRegex = new RegExp(filters.search.trim(), 'i');
      query.$or = [
        { description: searchRegex },
        { eventType: searchRegex },
        { action: searchRegex },
        { 'actor.name': searchRegex },
        { 'actor.email': searchRegex },
        { ipAddress: searchRegex },
        { eventId: searchRegex },
      ];
    }

    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
      if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
    }

    return query;
  }

  /**
   * Fetch Paginated Audit Logs
   */
  public async findLogs(
    filters: AuditQueryFilter = {},
    page = 1,
    limit = 20
  ): Promise<{ logs: IAuditLog[]; total: number; totalPages: number }> {
    const query = this.buildQuery(filters);
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      AuditLogModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      AuditLogModel.countDocuments(query).exec(),
    ]);

    return {
      logs,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  /**
   * Get Single Audit Log Event by ID or eventId
   */
  public async findById(id: string): Promise<IAuditLog | null> {
    if (mongoose.Types.ObjectId.isValid(id)) {
      const byId = await AuditLogModel.findById(id).exec();
      if (byId) return byId;
    }
    return AuditLogModel.findOne({ eventId: id }).exec();
  }

  /**
   * Compute Real-time Dashboard KPI Telemetry via MongoDB Aggregation
   */
  public async getKPIStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalEventsToday,
      criticalEvents,
      failedLogins,
      suspiciousActivities,
      adminActions,
      systemEvents,
    ] = await Promise.all([
      AuditLogModel.countDocuments({ createdAt: { $gte: today } }),
      AuditLogModel.countDocuments({ severity: 'Critical' }),
      AuditLogModel.countDocuments({ status: 'Failed', module: 'Authentication' }),
      AuditLogModel.countDocuments({
        $or: [{ severity: 'Critical' }, { severity: 'High', status: 'Failed' }],
      }),
      AuditLogModel.countDocuments({ 'actor.isSystem': { $ne: true } }),
      AuditLogModel.countDocuments({ 'actor.isSystem': true }),
    ]);

    return {
      totalEventsToday: {
        id: 'totalEventsToday',
        title: 'Total Events Today',
        value: totalEventsToday.toLocaleString(),
        growth: '+100%',
        isPositive: true,
        comparison: 'vs yesterday',
        iconType: 'events',
        sparklineColor: '#6356E5',
      },
      criticalEvents: {
        id: 'criticalEvents',
        title: 'Critical Events',
        value: criticalEvents.toLocaleString(),
        growth: '0%',
        isPositive: criticalEvents === 0,
        comparison: 'vs yesterday',
        iconType: 'critical',
        sparklineColor: '#EF4444',
      },
      failedLogins: {
        id: 'failedLogins',
        title: 'Failed Logins',
        value: failedLogins.toLocaleString(),
        growth: '0%',
        isPositive: failedLogins === 0,
        comparison: 'vs yesterday',
        iconType: 'failed',
        sparklineColor: '#F97316',
      },
      suspiciousActivities: {
        id: 'suspiciousActivities',
        title: 'Suspicious Activities',
        value: suspiciousActivities.toLocaleString(),
        growth: '0%',
        isPositive: suspiciousActivities === 0,
        comparison: 'vs yesterday',
        iconType: 'threats',
        sparklineColor: '#EF4444',
      },
      adminActions: {
        id: 'adminActions',
        title: 'Admin Actions',
        value: adminActions.toLocaleString(),
        growth: '+100%',
        isPositive: true,
        comparison: 'vs yesterday',
        iconType: 'admin',
        sparklineColor: '#3B82F6',
      },
      systemEvents: {
        id: 'systemEvents',
        title: 'System Events',
        value: systemEvents.toLocaleString(),
        growth: '+100%',
        isPositive: true,
        comparison: 'vs yesterday',
        iconType: 'system',
        sparklineColor: '#10B981',
      },
    };
  }

  /**
   * Grouped Event Categories with Live Counts
   */
  public async getCategories() {
    const results = await AuditLogModel.aggregate([
      {
        $group: {
          _id: '$module',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const moduleIcons: Record<string, string> = {
      Authentication: 'Shield',
      Agencies: 'Building2',
      Users: 'Users',
      Bookings: 'CalendarCheck',
      Payments: 'CreditCard',
      Finance: 'Wallet',
      Trips: 'Compass',
      CMS: 'Layout',
      Notifications: 'Bell',
      'Roles & Permissions': 'ShieldCheck',
      Settings: 'Settings',
      APIs: 'Code',
      System: 'Server',
      Profile: 'User',
      Security: 'Lock',
    };

    return results.map((r) => ({
      id: (r._id || 'other').toLowerCase().replace(/\s+/g, '-'),
      name: r._id || 'General',
      count: r.count,
      iconType: moduleIcons[r._id] || 'Server',
    }));
  }

  /**
   * Module Distribution Breakdown
   */
  public async getDistribution() {
    const total = await AuditLogModel.countDocuments();
    if (total === 0) return [];

    const grouped = await AuditLogModel.aggregate([
      {
        $group: {
          _id: '$module',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    const colors = ['#6356E5', '#3B82F6', '#06B6D4', '#F97316', '#EC4899', '#10B981'];

    return grouped.map((g, idx) => ({
      name: g._id || 'Other',
      count: g.count,
      percentage: Number(((g.count / total) * 100).toFixed(1)),
      color: colors[idx % colors.length],
    }));
  }

  /**
   * Top Active Administrators Ranking
   */
  public async getTopAdmins() {
    const grouped = await AuditLogModel.aggregate([
      {
        $match: { 'actor.isSystem': { $ne: true } },
      },
      {
        $group: {
          _id: '$actor.id',
          name: { $first: '$actor.name' },
          role: { $first: '$actor.role' },
          avatar: { $first: '$actor.profileImage' },
          actionCount: { $sum: 1 },
        },
      },
      { $sort: { actionCount: -1 } },
      { $limit: 5 },
    ]);

    const maxActions = grouped.length > 0 ? grouped[0].actionCount : 1;

    return grouped.map((g) => ({
      id: g._id || 'adm-unknown',
      name: g.name || 'Administrator',
      role: g.role || 'Admin',
      avatar:
        g.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      actionCount: g.actionCount,
      percentage: Math.round((g.actionCount / maxActions) * 100),
    }));
  }

  /**
   * Security Alerts (High & Critical Severity)
   */
  public async getSecurityAlerts() {
    return AuditLogModel.find({
      $or: [{ severity: 'Critical' }, { severity: 'High' }, { status: 'Failed' }],
    })
      .sort({ createdAt: -1 })
      .limit(6)
      .exec();
  }

  /**
   * 7x7 Temporal Login Activity Heatmap
   */
  public async getLoginHeatmap() {
    // Return standard activity matrix based on events
    const logs = await AuditLogModel.find().select('createdAt').limit(200).exec();
    const matrix: number[][] = Array(7)
      .fill(0)
      .map(() => Array(7).fill(0));

    logs.forEach((log) => {
      const date = new Date(log.createdAt);
      const dayIdx = (date.getDay() + 6) % 7; // Mon = 0, Sun = 6
      const hourSlot = Math.min(6, Math.floor(date.getHours() / 4));
      matrix[dayIdx][hourSlot] += 0.25;
      if (matrix[dayIdx][hourSlot] > 1) matrix[dayIdx][hourSlot] = 1;
    });

    return matrix;
  }
}

export const auditLogRepository = new AuditLogRepository();
