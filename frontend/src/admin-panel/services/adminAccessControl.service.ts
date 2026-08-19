import {
  AuthorizedAdminItem,
  AdminAccessKPIs,
  AdminSecurityOverview,
  AdminAccountStatus,
  AdminSecurityActivityItem,
} from '../types/adminAccessControl';
import {
  initialAuthorizedAdmins,
  initialAdminAccessKPIs,
  initialAdminSecurityOverview,
} from '../data/adminAccessControlData';

const STORAGE_KEY = 'apnatrip_admin_authorized_users';

class AdminAccessControlService {
  private admins: AuthorizedAdminItem[] = [];
  private securityOverview: AdminSecurityOverview = initialAdminSecurityOverview;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.admins = JSON.parse(stored);
        return;
      }
    } catch {
      // ignore
    }
    this.admins = [...initialAuthorizedAdmins];
    this.saveToStorage();
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.admins));
    } catch {
      // ignore
    }
  }

  public async getKPIs(): Promise<AdminAccessKPIs> {
    const total = this.admins.length;
    const active = this.admins.filter((a) => a.accountStatus === 'Active').length;
    const pending = this.admins.filter((a) => a.accountStatus === 'Pending Invitation').length;
    const blocked = this.admins.filter(
      (a) => a.accountStatus === 'Suspended' || a.accountStatus === 'Disabled'
    ).length;

    return {
      totalAuthorized: total,
      activeAccounts: active,
      pendingInvitations: pending,
      blockedAccounts: blocked,
    };
  }

  public async getSecurityOverview(): Promise<AdminSecurityOverview> {
    return {
      ...this.securityOverview,
      pendingInvitations: this.admins.filter((a) => a.accountStatus === 'Pending Invitation').length,
      lockedAccountsCount: this.admins.filter((a) => a.accountStatus === 'Suspended').length,
    };
  }

  public async getAuthorizedAdmins(
    statusFilter: string = 'All',
    searchQuery: string = '',
    roleFilter: string = 'All',
    departmentFilter: string = 'All'
  ): Promise<AuthorizedAdminItem[]> {
    let result = [...this.admins];

    // Status filter
    if (statusFilter !== 'All') {
      result = result.filter((a) => a.accountStatus.toLowerCase() === statusFilter.toLowerCase());
    }

    // Role filter
    if (roleFilter !== 'All') {
      result = result.filter((a) => a.role.toLowerCase() === roleFilter.toLowerCase());
    }

    // Department filter
    if (departmentFilter !== 'All') {
      result = result.filter((a) => a.department.toLowerCase() === departmentFilter.toLowerCase());
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.department.toLowerCase().includes(q) ||
          a.role.toLowerCase().includes(q)
      );
    }

    return result;
  }

  public async authorizeAdmin(data: {
    name: string;
    email: string;
    phone?: string;
    role: string;
    roleId: string;
    department: string;
    sendInvitation: boolean;
  }): Promise<{ success: boolean; message: string; admin?: AuthorizedAdminItem }> {
    const cleanEmail = data.email.trim().toLowerCase();

    // Check duplicate email
    if (this.admins.some((a) => a.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'This email is already in the Authorized Admins list.' };
    }

    const newAdmin: AuthorizedAdminItem = {
      id: `adm-${Date.now()}`,
      name: data.name.trim(),
      email: cleanEmail,
      phone: data.phone?.trim() || '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      role: data.role,
      roleId: data.roleId,
      department: data.department,
      accountStatus: data.sendInvitation ? 'Pending Invitation' : 'Active',
      invitationStatus: data.sendInvitation ? 'Pending' : 'Accepted',
      invitationToken: data.sendInvitation ? `inv_${Math.random().toString(36).substring(2, 10)}` : undefined,
      lastLogin: 'Never',
      createdAt: new Date().toISOString().split('T')[0],
      twoFactorEnabled: false,
    };

    this.admins = [newAdmin, ...this.admins];
    this.saveToStorage();

    // Record audit event
    const newActivity: AdminSecurityActivityItem = {
      id: `sec-${Date.now()}`,
      event: `Authorized ${newAdmin.name} (${newAdmin.email}) with role ${newAdmin.role}`,
      user: 'Super Admin',
      time: 'Just now',
      type: 'invite',
    };
    this.securityOverview.recentActivity = [
      newActivity,
      ...this.securityOverview.recentActivity,
    ].slice(0, 10);

    return {
      success: true,
      message: data.sendInvitation
        ? `Invitation email dispatched to ${cleanEmail}`
        : `Admin ${data.name} authorized as ${data.role}`,
      admin: newAdmin,
    };
  }

  public async updateAdminStatus(
    id: string,
    accountStatus: AdminAccountStatus
  ): Promise<AuthorizedAdminItem | null> {
    const admin = this.admins.find((a) => a.id === id);
    if (!admin) return null;

    if (admin.role === 'Super Admin' && accountStatus !== 'Active') {
      throw new Error('The primary Super Admin account cannot be suspended or disabled.');
    }

    this.admins = this.admins.map((a) => (a.id === id ? { ...a, accountStatus } : a));
    this.saveToStorage();

    // Audit log
    const statusActivity: AdminSecurityActivityItem = {
      id: `sec-${Date.now()}`,
      event: `${admin.name} status updated to ${accountStatus}`,
      user: 'Super Admin Action',
      time: 'Just now',
      type: accountStatus === 'Suspended' ? 'suspend' : 'security',
    };
    this.securityOverview.recentActivity = [
      statusActivity,
      ...this.securityOverview.recentActivity,
    ].slice(0, 10);

    return this.admins.find((a) => a.id === id) || null;
  }

  public async updateAdminDetails(
    id: string,
    partial: Partial<AuthorizedAdminItem>
  ): Promise<AuthorizedAdminItem | null> {
    this.admins = this.admins.map((a) => (a.id === id ? { ...a, ...partial } : a));
    this.saveToStorage();
    return this.admins.find((a) => a.id === id) || null;
  }

  public async deleteAuthorizedAdmin(id: string): Promise<boolean> {
    const target = this.admins.find((a) => a.id === id);
    if (!target) return false;

    if (target.role === 'Super Admin') {
      throw new Error('Cannot delete primary Super Admin.');
    }

    this.admins = this.admins.filter((a) => a.id !== id);
    this.saveToStorage();

    const deleteActivity: AdminSecurityActivityItem = {
      id: `sec-${Date.now()}`,
      event: `Deleted authorization for ${target.email}`,
      user: 'Super Admin',
      time: 'Just now',
      type: 'suspend',
    };
    this.securityOverview.recentActivity = [
      deleteActivity,
      ...this.securityOverview.recentActivity,
    ].slice(0, 10);

    return true;
  }

  public async resendInvitation(id: string): Promise<{ success: boolean; message: string }> {
    const admin = this.admins.find((a) => a.id === id);
    if (!admin) return { success: false, message: 'Admin not found.' };

    const token = `inv_${Math.random().toString(36).substring(2, 10)}`;
    this.admins = this.admins.map((a) =>
      a.id === id
        ? {
            ...a,
            invitationStatus: 'Pending',
            accountStatus: 'Pending Invitation',
            invitationToken: token,
          }
        : a
    );
    this.saveToStorage();

    return {
      success: true,
      message: `Invitation email re-dispatched to ${admin.email}`,
    };
  }

  public async bulkUpdateStatus(ids: string[], status: AdminAccountStatus): Promise<void> {
    this.admins = this.admins.map((a) =>
      ids.includes(a.id) && a.role !== 'Super Admin' ? { ...a, accountStatus: status } : a
    );
    this.saveToStorage();
  }

  public async bulkDelete(ids: string[]): Promise<void> {
    this.admins = this.admins.filter((a) => !ids.includes(a.id) || a.role === 'Super Admin');
    this.saveToStorage();
  }

  /**
   * Enterprise Login Validation Gate:
   * Verifies if email is authorized and account is in Active standing.
   */
  public verifyEmailForLogin(email: string): {
    isAllowed: boolean;
    reason?: string;
    admin?: AuthorizedAdminItem;
  } {
    const cleanEmail = email.trim().toLowerCase();
    const authorized = this.admins.find((a) => a.email.toLowerCase() === cleanEmail);

    if (!authorized) {
      return {
        isAllowed: false,
        reason:
          'You are not authorized to access the Travel OS Admin Panel. Please contact your system administrator.',
      };
    }

    if (authorized.accountStatus === 'Suspended') {
      return {
        isAllowed: false,
        reason: 'Your administrator account has been suspended. Please contact the platform owner.',
      };
    }

    if (authorized.accountStatus === 'Disabled') {
      return {
        isAllowed: false,
        reason: 'This administrator account is disabled.',
      };
    }

    if (authorized.accountStatus === 'Pending Invitation') {
      return {
        isAllowed: false,
        reason:
          'Your invitation is pending. Please complete your registration via the invitation link sent to your email.',
      };
    }

    return {
      isAllowed: true,
      admin: authorized,
    };
  }
}

export const adminAccessControlService = new AdminAccessControlService();
