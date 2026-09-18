import {
  TravelerUser,
  UserKPIStats,
  UserFilters,
  UserSortConfig,
  GetUsersResponse,
} from '../types/userManagement';
import { adminApiClient } from './adminApiClient';

export const initialUserKPIStats: UserKPIStats = {
  totalUsers: { count: 0, growth: '0%', isPositive: true },
  activeUsers: { count: 0, growth: '0%', isPositive: true },
  newUsersToday: { count: 0, growth: '0%', isPositive: true },
  premiumMembers: { count: 0, growth: '0%', isPositive: true },
  suspendedUsers: { count: 0, growth: '0%', isPositive: false },
  verifiedTravelers: { count: 0, growth: '0%', isPositive: true },
};

class AdminUserManagementService {
  /**
   * 1. Fetch live computed KPI Telemetry from MongoDB
   */
  public async getKPIStats(): Promise<UserKPIStats> {
    const res = await adminApiClient.get<UserKPIStats>('/admin/users/stats');
    return res.data || initialUserKPIStats;
  }

  /**
   * 2. Fetch paginated & filtered users from MongoDB with server-side queries
   */
  public async getUsers(
    filters?: Partial<UserFilters>,
    sort?: UserSortConfig,
    pagination?: { page: number; limit: number }
  ): Promise<GetUsersResponse> {
    const params: Record<string, string | number | boolean | undefined> = {
      page: pagination?.page || 1,
      limit: pagination?.limit || 10,
      search: filters?.search || undefined,
      userStatus: filters?.userStatus && filters.userStatus !== 'All Status' ? filters.userStatus : undefined,
      verification: filters?.verification && filters.verification !== 'All Verification' ? filters.verification : undefined,
      membership: filters?.membership && filters.membership !== 'All Membership' ? filters.membership : undefined,
      country: filters?.country && filters.country !== 'All Countries' ? filters.country : undefined,
      state: filters?.state && filters.state !== 'All States' ? filters.state : undefined,
      city: filters?.city && filters.city !== 'All Cities' ? filters.city : undefined,
      registrationDate: filters?.registrationDate || undefined,
      sortBy: sort?.key || 'joinDate',
      sortOrder: sort?.direction || 'desc',
    };

    const res = await adminApiClient.get<GetUsersResponse>('/admin/users', { params });
    return (
      res.data || {
        users: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 1,
        },
      }
    );
  }

  /**
   * 3. Fetch full populated user profile with live bookings, trips, payments, and audit logs
   */
  public async getUserById(id: string): Promise<TravelerUser | null> {
    const res = await adminApiClient.get<TravelerUser>(`/admin/users/${id}`);
    return res.data || null;
  }

  /**
   * 4. Register new traveler user in MongoDB
   */
  public async addUser(userData: Partial<TravelerUser>): Promise<TravelerUser> {
    const payload = {
      fullName: userData.name || 'New Traveler',
      email: userData.email,
      phone: userData.phone || '',
      city: userData.city || 'Mumbai',
      state: userData.state || 'Maharashtra',
      country: userData.country || 'India',
      gender: userData.gender || 'Male',
      dob: userData.dob,
      dateOfBirth: userData.dob,
      membership: userData.membership || 'Free',
      status: userData.status || 'Active',
      verificationStatus: userData.verificationStatus || 'Verified',
      passportStatus: userData.passportStatus || 'Not Provided',
      emergencyContact: userData.emergencyContact || '',
    };

    const res = await adminApiClient.post<TravelerUser>('/admin/users', payload);
    return res.data!;
  }

  /**
   * 5. Update user profile, membership, or status in MongoDB
   */
  public async updateUser(id: string, updates: Partial<TravelerUser>): Promise<TravelerUser | null> {
    const payload: any = { ...updates };
    if (updates.name) payload.fullName = updates.name;

    const res = await adminApiClient.patch<TravelerUser>(`/admin/users/${id}`, payload);
    return res.data || null;
  }

  /**
   * 6. Verify traveler user account
   */
  public async verifyUser(id: string): Promise<boolean> {
    await adminApiClient.patch(`/admin/users/${id}`, {
      action: 'verify',
      verificationStatus: 'Verified',
    });
    return true;
  }

  /**
   * 7. Suspend traveler user account
   */
  public async suspendUser(id: string): Promise<boolean> {
    await adminApiClient.patch(`/admin/users/${id}`, {
      action: 'suspend',
      status: 'Suspended',
    });
    return true;
  }

  /**
   * 8. Activate traveler user account
   */
  public async activateUser(id: string): Promise<boolean> {
    await adminApiClient.patch(`/admin/users/${id}`, {
      action: 'activate',
      status: 'Active',
    });
    return true;
  }

  /**
   * 9. Soft-delete user from MongoDB
   */
  public async deleteUser(id: string): Promise<boolean> {
    await adminApiClient.delete(`/admin/users/${id}`);
    return true;
  }

  /**
   * 10. Bulk verify users
   */
  public async bulkVerify(ids: string[]): Promise<boolean> {
    await adminApiClient.post('/admin/users/bulk-action', {
      action: 'verify',
      userIds: ids,
    });
    return true;
  }

  /**
   * 11. Bulk suspend users
   */
  public async bulkSuspend(ids: string[]): Promise<boolean> {
    await adminApiClient.post('/admin/users/bulk-action', {
      action: 'suspend',
      userIds: ids,
    });
    return true;
  }

  /**
   * 12. Bulk activate users
   */
  public async bulkActivate(ids: string[]): Promise<boolean> {
    await adminApiClient.post('/admin/users/bulk-action', {
      action: 'activate',
      userIds: ids,
    });
    return true;
  }

  /**
   * 13. Bulk soft-delete users
   */
  public async bulkDelete(ids: string[]): Promise<boolean> {
    await adminApiClient.post('/admin/users/bulk-action', {
      action: 'delete',
      userIds: ids,
    });
    return true;
  }

  /**
   * 14. Trigger password reset link
   */
  public async resetPassword(id: string): Promise<{ success: boolean; message: string; email?: string }> {
    const res = await adminApiClient.post<{ success: boolean; message: string; email?: string }>(
      `/admin/users/${id}/reset-password`
    );
    return res.data || { success: true, message: 'Password reset link dispatched' };
  }

  /**
   * 15. Dispatch notification to traveler
   */
  public async sendNotification(id: string, title: string, message: string): Promise<boolean> {
    await adminApiClient.post(`/admin/users/${id}/notifications`, {
      title,
      message,
    });
    return true;
  }

  /**
   * 16. Export all matching users directly to CSV
   */
  public async exportCSV(filters?: Partial<UserFilters>): Promise<void> {
    const params: Record<string, string | number | boolean | undefined> = {
      search: filters?.search || undefined,
      userStatus: filters?.userStatus && filters.userStatus !== 'All Status' ? filters.userStatus : undefined,
      verification: filters?.verification && filters.verification !== 'All Verification' ? filters.verification : undefined,
      membership: filters?.membership && filters.membership !== 'All Membership' ? filters.membership : undefined,
      country: filters?.country && filters.country !== 'All Countries' ? filters.country : undefined,
      state: filters?.state && filters.state !== 'All States' ? filters.state : undefined,
      city: filters?.city && filters.city !== 'All Cities' ? filters.city : undefined,
      registrationDate: filters?.registrationDate || undefined,
    };

    const token = adminApiClient.getAccessToken();
    const queryStr = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined) as any
    ).toString();

    const response = await fetch(
      `http://localhost:5000/api/admin/users/export?${queryStr}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to export CSV from server');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `apnatrip_users_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

export const adminUserManagementService = new AdminUserManagementService();
