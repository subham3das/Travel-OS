import {
  RoleKPIStats,
  RoleItem,
  PermissionRow,
  PermissionAuditItem,
  RoleActivityItem,
  ActiveLoginSessionItem,
  AccessRequestItem,
  RoleChangeTimelineItem,
} from '../types/rolesManagement';
import { adminApiClient } from './adminApiClient';

export const initialRoleKPIStats: RoleKPIStats = {
  totalRoles: {
    id: 'totalRoles',
    title: 'Total Roles',
    value: '0',
    growth: '0%',
    isPositive: true,
    comparison: 'from database',
    iconType: 'roles',
    sparklineColor: '#6356E5',
  },
  activeAdmins: {
    id: 'activeAdmins',
    title: 'Active Admins',
    value: '0',
    growth: '0%',
    isPositive: true,
    comparison: 'from database',
    iconType: 'admins',
    sparklineColor: '#3B82F6',
  },
  pendingInvitations: {
    id: 'pendingInvitations',
    title: 'Pending Invitations',
    value: '0',
    growth: '0%',
    isPositive: false,
    comparison: 'from database',
    iconType: 'invitations',
    sparklineColor: '#F97316',
  },
  customRoles: {
    id: 'customRoles',
    title: 'Custom Roles',
    value: '0',
    growth: '0%',
    isPositive: true,
    comparison: 'from database',
    iconType: 'custom',
    sparklineColor: '#10B981',
  },
  activeSessions: {
    id: 'activeSessions',
    title: 'Active Sessions',
    value: '0',
    growth: '0%',
    isPositive: true,
    comparison: 'from database',
    iconType: 'sessions',
    sparklineColor: '#8B5CF6',
  },
  highPrivilegeAccounts: {
    id: 'highPrivilegeAccounts',
    title: 'High Privilege Accounts',
    value: '0',
    growth: '0%',
    isPositive: false,
    comparison: 'from database',
    iconType: 'critical',
    sparklineColor: '#EF4444',
  },
};

export const initialRoleLibraryData: RoleItem[] = [];
export const initialPermissionsMatrix: PermissionRow[] = [];
export const initialPermissionAudit: PermissionAuditItem[] = [];
export const initialRoleActivity: RoleActivityItem[] = [];
export const initialActiveSessions: ActiveLoginSessionItem[] = [];
export const initialAccessRequests: AccessRequestItem[] = [];
export const initialRecentChanges: RoleChangeTimelineItem[] = [];

class AdminRolesManagementService {
  /**
   * Fetch Live Dashboard KPI Telemetry from MongoDB
   */
  public async getKPIStats(): Promise<RoleKPIStats> {
    const res = await adminApiClient.get<RoleKPIStats>('/admin/roles/dashboard');
    return res.data!;
  }

  /**
   * Fetch Live Roles from MongoDB
   */
  public async getRoles(tab?: string, searchQuery?: string): Promise<RoleItem[]> {
    const res = await adminApiClient.get<RoleItem[]>('/admin/roles', {
      params: {
        tab: tab || undefined,
        search: searchQuery || undefined,
      },
    });
    return res.data || [];
  }

  /**
   * Fetch Permissions Matrix for Selected Role from MongoDB
   */
  public async getPermissions(roleId?: string): Promise<PermissionRow[]> {
    const res = await adminApiClient.get<PermissionRow[]>('/admin/permissions', {
      params: { roleId: roleId || undefined },
    });
    return res.data || [];
  }

  /**
   * Update / Toggle a Permission on a Role in MongoDB
   */
  public async updatePermission(
    roleId: string,
    moduleId: string,
    field: keyof PermissionRow | string,
    value: boolean
  ): Promise<PermissionRow[]> {
    const res = await adminApiClient.patch<PermissionRow[]>(
      `/admin/roles/${roleId}/permissions`,
      {
        moduleId,
        field,
        value,
      }
    );
    return res.data || [];
  }

  /**
   * Create New Custom Role in MongoDB
   */
  public async createRole(
    name: string,
    description: string,
    securityLevel: 'Low' | 'Medium' | 'High' | 'Critical' = 'Medium'
  ): Promise<RoleItem> {
    const res = await adminApiClient.post<RoleItem>('/admin/roles', {
      name,
      description,
      securityLevel,
    });
    return res.data!;
  }

  /**
   * Duplicate Role in MongoDB
   */
  public async duplicateRole(roleId: string): Promise<RoleItem> {
    const res = await adminApiClient.post<RoleItem>(`/admin/roles/${roleId}/duplicate`);
    return res.data!;
  }

  /**
   * Delete Custom Role in MongoDB
   */
  public async deleteRole(roleId: string): Promise<boolean> {
    await adminApiClient.delete(`/admin/roles/${roleId}`);
    return true;
  }

  /**
   * Assign Administrator Accounts to Role
   */
  public async assignAdmins(roleId: string, adminIds: string[]): Promise<boolean> {
    await adminApiClient.post(`/admin/roles/${roleId}/assign`, { adminIds });
    return true;
  }

  /**
   * Fetch Live Permission Audit Summary
   */
  public async getAuditSummary(): Promise<PermissionAuditItem[]> {
    const res = await adminApiClient.get<PermissionAuditItem[]>('/admin/roles/audit-summary');
    return res.data || [];
  }

  /**
   * Fetch Live Real-Time Admin Activity Stream
   */
  public async getActivity(): Promise<RoleActivityItem[]> {
    const res = await adminApiClient.get<RoleActivityItem[]>('/admin/activity');
    return res.data || [];
  }

  /**
   * Fetch Live Active Login Sessions from MongoDB
   */
  public async getSessions(): Promise<ActiveLoginSessionItem[]> {
    const res = await adminApiClient.get<ActiveLoginSessionItem[]>('/admin/sessions');
    return res.data || [];
  }

  /**
   * Emergency Kill Switch: Terminate All Active Sessions
   */
  public async terminateAllSessions(): Promise<boolean> {
    await adminApiClient.post('/admin/sessions/terminate-all');
    return true;
  }

  /**
   * Fetch Live Access & Privilege Elevation Requests
   */
  public async getAccessRequests(): Promise<AccessRequestItem[]> {
    const res = await adminApiClient.get<AccessRequestItem[]>('/admin/roles/access-requests');
    return res.data || [];
  }

  /**
   * Approve or Reject Access Request
   */
  public async updateAccessRequest(
    requestId: string,
    status: 'Approved' | 'Rejected'
  ): Promise<AccessRequestItem[]> {
    const res = await adminApiClient.post<AccessRequestItem[]>(
      `/admin/roles/access-requests/${requestId}/status`,
      { status }
    );
    return res.data || [];
  }

  /**
   * Fetch Recent Change Timeline (From Activity Stream)
   */
  public async getRecentChanges(): Promise<RoleChangeTimelineItem[]> {
    try {
      const res = await adminApiClient.get<RoleActivityItem[]>('/admin/activity', {
        params: { limit: 6 },
      });
      if (res.data && res.data.length > 0) {
        return res.data.map((act, index) => ({
          id: act.id || `change-${index}`,
          action: act.action,
          author: act.admin,
          timeAgo: act.timeAgo,
          type: 'permission',
        }));
      }
    } catch {
      // ignore
    }
    return [];
  }

  /**
   * Fetch Authorized Administrators List (IAM Table)
   */
  public async getAuthorizedAdmins(search?: string, department?: string): Promise<any[]> {
    const res = await adminApiClient.get<any[]>('/admin/admins', {
      params: { search, department },
    });
    return res.data || [];
  }

  /**
   * Update Administrator Role / Status / Department in MongoDB
   */
  public async updateAuthorizedAdmin(id: string, data: any): Promise<any> {
    const res = await adminApiClient.patch<any>(`/admin/admins/${id}`, data);
    return res.data;
  }

  /**
   * Authorize / Invite New Administrator into MongoDB
   */
  public async authorizeNewAdmin(data: {
    fullName: string;
    email: string;
    role: string;
    department?: string;
    password?: string;
  }): Promise<any> {
    const res = await adminApiClient.post<any>('/admin/auth/create', data);
    return res.data;
  }
}

export const adminRolesManagementService = new AdminRolesManagementService();
