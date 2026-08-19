// ─── Super Admin Audit Logs & Security Operations Center (SOC) Types ──────────

export type AuditSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type AuditStatus = 'Success' | 'Warning' | 'Failed' | 'Pending';

export interface AuditLogKPICardItem {
  id: string;
  title: string;
  value: string;
  growth: string;
  isPositive: boolean;
  comparison: string;
  iconType: 'events' | 'critical' | 'failed' | 'threats' | 'admin' | 'system';
  sparklineColor: string;
}

export interface AuditLogKPIStats {
  totalEventsToday: AuditLogKPICardItem;
  criticalEvents: AuditLogKPICardItem;
  failedLogins: AuditLogKPICardItem;
  suspiciousActivities: AuditLogKPICardItem;
  adminActions: AuditLogKPICardItem;
  systemEvents: AuditLogKPICardItem;
}

export interface AuditActor {
  name: string;
  role: string;
  email: string;
  avatar?: string;
  userId: string;
  isSystem?: boolean;
}

export interface FieldChangeItem {
  field: string;
  before: string;
  after: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  date: string;
  module: string;
  eventType: string;
  description: string;
  actor: AuditActor;
  ipAddress: string;
  country?: string;
  device: string;
  browser: string;
  os: string;
  location: string;
  sessionId: string;
  severity: AuditSeverity;
  status: AuditStatus;
  changes?: FieldChangeItem[];
  iconType?: string;
}

export interface EventCategoryCount {
  id: string;
  name: string;
  count: number;
  iconType: string;
}

export interface EventDistributionItem {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface TopActiveAdminItem {
  id: string;
  name: string;
  role: string;
  avatar: string;
  actionCount: number;
  percentage: number;
}

export interface SecurityAlertItem {
  id: string;
  title: string;
  timeAgo: string;
  severity: 'Critical' | 'High' | 'Medium';
  iconType: 'shield' | 'alert' | 'escalation' | 'location' | 'api';
}
