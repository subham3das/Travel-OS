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
import {
  initialRoleKPIStats,
  initialRoleLibraryData,
  initialPermissionsMatrix,
  initialPermissionAudit,
  initialRoleActivity,
  initialActiveSessions,
  initialAccessRequests,
  initialRecentChanges,
} from '../data/rolesData';

class AdminRolesManagementService {
  private kpiStats: RoleKPIStats = initialRoleKPIStats;
  private roles: RoleItem[] = initialRoleLibraryData;
  private permissions: Record<string, PermissionRow[]> = {
    'role-ops-manager': initialPermissionsMatrix,
    'role-super-admin': initialPermissionsMatrix.map((p) => ({
      ...p,
      view: true,
      create: true,
      edit: true,
      delete: true,
      approve: true,
      export: true,
      assign: true,
      fullAccess: true,
    })),
  };
  private auditSummary: PermissionAuditItem[] = initialPermissionAudit;
  private activity: RoleActivityItem[] = initialRoleActivity;
  private sessions: ActiveLoginSessionItem[] = initialActiveSessions;
  private accessRequests: AccessRequestItem[] = initialAccessRequests;
  private recentChanges: RoleChangeTimelineItem[] = initialRecentChanges;

  public async getKPIStats(): Promise<RoleKPIStats> {
    return new Promise((resolve) => setTimeout(() => resolve(this.kpiStats), 40));
  }

  public async getRoles(tab?: string, searchQuery?: string): Promise<RoleItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let result = [...this.roles];

        if (tab === 'System Roles') {
          result = result.filter((r) => r.type === 'System');
        } else if (tab === 'Custom Roles') {
          result = result.filter((r) => r.type === 'Custom');
        }

        if (searchQuery && searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          result = result.filter(
            (r) =>
              r.name.toLowerCase().includes(q) ||
              r.description.toLowerCase().includes(q)
          );
        }

        resolve(result);
      }, 40);
    });
  }

  public async getPermissions(roleId: string): Promise<PermissionRow[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.permissions[roleId] || initialPermissionsMatrix);
      }, 40);
    });
  }

  public async updatePermission(
    roleId: string,
    moduleId: string,
    field: keyof PermissionRow,
    value: boolean
  ): Promise<PermissionRow[]> {
    const current = this.permissions[roleId] || initialPermissionsMatrix;
    const updated = current.map((p) => {
      if (p.moduleId === moduleId) {
        if (field === 'fullAccess') {
          return {
            ...p,
            view: value,
            create: value,
            edit: value,
            delete: value,
            approve: value,
            export: value,
            assign: value,
            fullAccess: value,
          };
        }
        const updatedRow = { ...p, [field]: value };
        const isAllChecked =
          updatedRow.view &&
          updatedRow.create &&
          updatedRow.edit &&
          updatedRow.delete &&
          updatedRow.approve &&
          updatedRow.export &&
          updatedRow.assign;
        return { ...updatedRow, fullAccess: isAllChecked };
      }
      return p;
    });

    this.permissions[roleId] = updated;
    return updated;
  }

  public async createRole(name: string, description: string): Promise<RoleItem> {
    const newRole: RoleItem = {
      id: `role-${Date.now().toString().slice(-4)}`,
      name,
      type: 'Custom',
      description,
      userCount: 0,
      permissionCount: 16,
      updatedAt: 'Just now',
      securityLevel: 'Medium',
      createdBy: 'Super Admin',
      createdOn: 'Just now',
      members: [],
    };
    this.roles = [newRole, ...this.roles];
    this.permissions[newRole.id] = initialPermissionsMatrix.map((p) => ({
      ...p,
      delete: false,
      approve: false,
      fullAccess: false,
    }));
    return newRole;
  }

  public async duplicateRole(roleId: string): Promise<RoleItem> {
    const orig = this.roles.find((r) => r.id === roleId) || this.roles[0];
    const newRole: RoleItem = {
      id: `role-copy-${Date.now().toString().slice(-4)}`,
      name: `${orig.name} (Copy)`,
      type: 'Custom',
      description: `Duplicated from ${orig.name}`,
      userCount: 0,
      permissionCount: orig.permissionCount,
      updatedAt: 'Just now',
      securityLevel: orig.securityLevel,
      createdBy: 'Super Admin',
      createdOn: 'Just now',
      members: [],
    };
    this.roles = [newRole, ...this.roles];
    this.permissions[newRole.id] = [...(this.permissions[roleId] || initialPermissionsMatrix)];
    return newRole;
  }

  public async deleteRole(roleId: string): Promise<boolean> {
    this.roles = this.roles.filter((r) => r.id !== roleId);
    delete this.permissions[roleId];
    return true;
  }

  public async getAuditSummary(): Promise<PermissionAuditItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.auditSummary), 40));
  }

  public async getActivity(): Promise<RoleActivityItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.activity), 40));
  }

  public async getSessions(): Promise<ActiveLoginSessionItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.sessions), 40));
  }

  public async terminateAllSessions(): Promise<boolean> {
    this.sessions = [];
    return true;
  }

  public async getAccessRequests(): Promise<AccessRequestItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.accessRequests), 40));
  }

  public async updateAccessRequest(requestId: string, status: 'Approved' | 'Rejected'): Promise<AccessRequestItem[]> {
    this.accessRequests = this.accessRequests.map((req) =>
      req.id === requestId ? { ...req, status } : req
    );
    return this.accessRequests;
  }

  public async getRecentChanges(): Promise<RoleChangeTimelineItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.recentChanges), 40));
  }
}

export const adminRolesManagementService = new AdminRolesManagementService();
