// ─── Super Admin Roles & Permissions (RBAC) Types ─────────────────────────────

export interface RoleKPICardItem {
  id: string;
  title: string;
  value: string;
  growth: string;
  isPositive: boolean;
  comparison: string;
  iconType: 'roles' | 'admins' | 'invitations' | 'custom' | 'sessions' | 'critical';
  sparklineColor: string;
}

export interface RoleKPIStats {
  totalRoles: RoleKPICardItem;
  activeAdmins: RoleKPICardItem;
  pendingInvitations: RoleKPICardItem;
  customRoles: RoleKPICardItem;
  activeSessions: RoleKPICardItem;
  highPrivilegeAccounts: RoleKPICardItem;
}

export type RoleType = 'System' | 'Custom';
export type SecurityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface RoleMemberItem {
  id: string;
  name: string;
  avatar: string;
}

export interface RoleItem {
  id: string;
  name: string;
  type: RoleType;
  description: string;
  userCount: number;
  permissionCount: number;
  updatedAt: string;
  securityLevel: SecurityLevel;
  createdBy: string;
  createdOn: string;
  members: RoleMemberItem[];
}

export interface PermissionRow {
  moduleId: string;
  moduleName: string;
  icon: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  approve: boolean;
  export: boolean;
  assign: boolean;
  fullAccess: boolean;
}

export interface PermissionAuditItem {
  category: string;
  count: number;
  growth: string;
  isPositive: boolean;
  type: 'added' | 'updated' | 'removed' | 'created' | 'deleted';
}

export interface RoleActivityItem {
  id: string;
  admin: string;
  avatar: string;
  action: string;
  timeAgo: string;
}

export interface ActiveLoginSessionItem {
  id: string;
  country: string;
  flag: string;
  count: number;
  deviceBrowser: string;
  timeAgo: string;
}

export interface AccessRequestItem {
  id: string;
  user: string;
  avatar: string;
  requestedRole: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  timeAgo: string;
}

export interface RoleChangeTimelineItem {
  id: string;
  action: string;
  author: string;
  timeAgo: string;
  type: 'permission' | 'user' | 'role';
}
