import { Agency, AgencySummaryStats } from '../types/agency';
import {
  AgencyRequestItem,
  AgencyRequestSummaryStats,
} from '../types/agencyRequest';
import { AgencyVerificationStatus } from '../../agency-panel/types/agency';
import { setAgencyApplicationStatus } from '../../agency-panel/services/agencyOnboarding.service';

export interface AuditLogEntry {
  id: string;
  adminName: string;
  agencyName: string;
  action: string;
  details: string;
  date: string;
  time: string;
  ipAddress: string;
}

export interface AdminNotificationEntry {
  id: string;
  title: string;
  message: string;
  recipientEmail: string;
  status: 'Unread' | 'Read';
  timestamp: string;
}

const STORAGE_KEY_REQUESTS = 'apnatrip_admin_agency_requests';
const STORAGE_KEY_AGENCIES = 'apnatrip_admin_agencies';
const STORAGE_KEY_REQUEST_STATS = 'apnatrip_admin_request_stats';
const STORAGE_KEY_AGENCY_STATS = 'apnatrip_admin_agency_stats';
const STORAGE_KEY_AUDIT_LOGS = 'apnatrip_admin_audit_logs';
const STORAGE_KEY_NOTIFICATIONS = 'apnatrip_admin_notifications';

const initialAgencyRequestStats: AgencyRequestSummaryStats = {
  pendingRequests: { count: 0, growth: '0%', isPositive: true },
  approvedToday: { count: 0, growth: '0%', isPositive: true },
  rejectedToday: { count: 0, growth: '0%', isPositive: false },
  underReview: { count: 0, growth: '0%', isPositive: true },
  documentsMissing: { count: 0, growth: '0%', isPositive: true },
  avgApprovalTime: { value: '0m', growth: '0%', isPositive: true },
};

const initialAgencyRequestsList: AgencyRequestItem[] = [];

const initialAgencySummaryStats: AgencySummaryStats = {
  totalAgencies: { id: 'total', title: 'Total Agencies', count: 0, growth: '0%', isPositive: true, comparisonText: 'from last 30 days', iconType: 'total', bgColor: 'bg-purple-50', iconColor: 'text-[#6356E5]' },
  activeAgencies: { id: 'active', title: 'Active Agencies', count: 0, growth: '0%', isPositive: true, comparisonText: 'from last 30 days', iconType: 'active', bgColor: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  pendingApproval: { id: 'pending', title: 'Pending Approval', count: 0, growth: '0%', isPositive: true, comparisonText: 'from last 30 days', iconType: 'pending', bgColor: 'bg-amber-50', iconColor: 'text-amber-600' },
  suspendedAgencies: { id: 'suspended', title: 'Suspended Agencies', count: 0, growth: '0%', isPositive: false, comparisonText: 'from last 30 days', iconType: 'suspended', bgColor: 'bg-rose-50', iconColor: 'text-rose-500' },
  rejectedAgencies: { id: 'rejected', title: 'Rejected Agencies', count: 0, growth: '0%', isPositive: false, comparisonText: 'from last 30 days', iconType: 'rejected', bgColor: 'bg-rose-50', iconColor: 'text-rose-600' },
  verifiedAgencies: { id: 'verified', title: 'Verified Agencies', count: 0, growth: '0%', isPositive: true, comparisonText: 'from last 30 days', iconType: 'verified', bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
};

const initialAgenciesList: Agency[] = [];

class AdminSharedStore {
  private requests: AgencyRequestItem[];
  private agencies: Agency[];
  private requestStats: AgencyRequestSummaryStats;
  private agencyStats: AgencySummaryStats;
  private auditLogs: AuditLogEntry[];
  private notifications: AdminNotificationEntry[];

  constructor() {
    this.requests = this.loadStorage(STORAGE_KEY_REQUESTS, initialAgencyRequestsList);
    this.agencies = this.loadStorage(STORAGE_KEY_AGENCIES, initialAgenciesList);
    this.requestStats = this.loadStorage(STORAGE_KEY_REQUEST_STATS, initialAgencyRequestStats);
    this.agencyStats = this.loadStorage(STORAGE_KEY_AGENCY_STATS, initialAgencySummaryStats);
    this.auditLogs = this.loadStorage(STORAGE_KEY_AUDIT_LOGS, []);
    this.notifications = this.loadStorage(STORAGE_KEY_NOTIFICATIONS, []);
  }

  private loadStorage<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return fallback;
  }

  private saveStorage(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {
      // ignore
    }
  }

  public getRequests(): AgencyRequestItem[] {
    return [...this.requests];
  }

  public getAgencies(): Agency[] {
    return [...this.agencies];
  }

  public getRequestStats(): AgencyRequestSummaryStats {
    return { ...this.requestStats };
  }

  public getAgencyStats(): AgencySummaryStats {
    return { ...this.agencyStats };
  }

  public getAuditLogs(): AuditLogEntry[] {
    return [...this.auditLogs];
  }

  public getNotifications(): AdminNotificationEntry[] {
    return [...this.notifications];
  }

  public approveAgencyRequest(requestId: string, reviewNotes?: string): {
    success: boolean;
    approvedAgency?: Agency;
    updatedRequests?: AgencyRequestItem[];
    updatedStats?: AgencyRequestSummaryStats;
    message?: string;
  } {
    const reqIndex = this.requests.findIndex((r) => r.id === requestId);
    if (reqIndex === -1) {
      return { success: false, message: 'Agency request not found' };
    }

    const req = this.requests[reqIndex];
    if (req.reviewStatus === 'Approved') {
      return { success: false, message: 'Agency has already been approved' };
    }

    const now = new Date();
    const currentDateStr = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const currentTimeStr = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newAgency: Agency = {
      id: `AG-${Math.floor(100 + Math.random() * 900)}`,
      name: req.agencyName,
      logo: req.logo,
      gstNumber: req.gstNumber,
      owner: {
        name: req.ownerName,
        email: req.ownerEmail,
        phone: req.ownerPhone,
      },
      email: req.ownerEmail,
      phone: req.ownerPhone,
      website: req.website || 'www.agencyportal.com',
      businessType: req.businessType,
      city: req.city || 'Mumbai',
      state: req.state || 'Maharashtra',
      rating: 5.0,
      reviewCount: 1,
      packages: 0,
      bookings: 0,
      revenue: '₹0',
      verification: 'Verified',
      status: 'Active',
      joinDate: currentDateStr,
      performance: {
        bookings: 0,
        bookingsGrowth: '0%',
        trips: 0,
        tripsGrowth: '0%',
        revenue: '₹0',
        revenueGrowth: '0%',
        reviews: 1,
        reviewsGrowth: '0%',
      },
      verificationDetails: {
        kyc: 'Verified',
        gst: 'Verified',
        businessLicense: 'Verified',
        bankVerification: 'Verified',
      },
    };

    this.agencies = [newAgency, ...this.agencies];
    this.agencyStats = {
      ...this.agencyStats,
      totalAgencies: {
        ...this.agencyStats.totalAgencies,
        count: this.agencyStats.totalAgencies.count + 1,
      },
      activeAgencies: {
        ...this.agencyStats.activeAgencies,
        count: this.agencyStats.activeAgencies.count + 1,
      },
      verifiedAgencies: {
        ...this.agencyStats.verifiedAgencies,
        count: this.agencyStats.verifiedAgencies.count + 1,
      },
    };

    const wasUnderReview = req.reviewStatus === 'Under Review';
    this.requests = this.requests.filter((r) => r.id !== requestId);

    this.requestStats = {
      ...this.requestStats,
      pendingRequests: {
        ...this.requestStats.pendingRequests,
        count: Math.max(0, this.requestStats.pendingRequests.count - 1),
      },
      approvedToday: {
        ...this.requestStats.approvedToday,
        count: this.requestStats.approvedToday.count + 1,
      },
      underReview: {
        ...this.requestStats.underReview,
        count: wasUnderReview
          ? Math.max(0, this.requestStats.underReview.count - 1)
          : this.requestStats.underReview.count,
      },
    };

    const auditEntry: AuditLogEntry = {
      id: `AUD-${Date.now()}`,
      adminName: 'Super Admin',
      agencyName: req.agencyName,
      action: 'APPROVED_AGENCY',
      details: `Super Admin approved ${req.agencyName} (${req.applicationId}). Agency promoted to Active status.`,
      date: currentDateStr,
      time: currentTimeStr,
      ipAddress: '192.168.1.1',
    };
    this.auditLogs = [auditEntry, ...this.auditLogs];

    const notifEntry: AdminNotificationEntry = {
      id: `NOTIF-${Date.now()}`,
      title: 'Agency Approved',
      message: `Congratulations! Your agency ${req.agencyName} has been verified and approved. You can now access the Agency Dashboard and start publishing travel packages.`,
      recipientEmail: req.ownerEmail,
      status: 'Unread',
      timestamp: `${currentDateStr} ${currentTimeStr}`,
    };
    this.notifications = [notifEntry, ...this.notifications];

    try {
      setAgencyApplicationStatus(AgencyVerificationStatus.APPROVED);
    } catch {
      // ignore
    }

    this.saveStorage(STORAGE_KEY_REQUESTS, this.requests);
    this.saveStorage(STORAGE_KEY_AGENCIES, this.agencies);
    this.saveStorage(STORAGE_KEY_REQUEST_STATS, this.requestStats);
    this.saveStorage(STORAGE_KEY_AGENCY_STATS, this.agencyStats);
    this.saveStorage(STORAGE_KEY_AUDIT_LOGS, this.auditLogs);
    this.saveStorage(STORAGE_KEY_NOTIFICATIONS, this.notifications);

    return {
      success: true,
      approvedAgency: newAgency,
      updatedRequests: this.getRequests(),
      updatedStats: this.getRequestStats(),
    };
  }

  public rejectAgencyRequest(requestId: string, reason?: string) {
    const reqIndex = this.requests.findIndex((r) => r.id === requestId);
    if (reqIndex === -1) return { success: false, message: 'Request not found' };

    this.requests = this.requests.map((r) =>
      r.id === requestId ? { ...r, reviewStatus: 'Rejected' as const } : r
    );

    this.requestStats = {
      ...this.requestStats,
      rejectedToday: {
        ...this.requestStats.rejectedToday,
        count: this.requestStats.rejectedToday.count + 1,
      },
    };

    this.saveStorage(STORAGE_KEY_REQUESTS, this.requests);
    this.saveStorage(STORAGE_KEY_REQUEST_STATS, this.requestStats);

    return {
      success: true,
      updatedRequests: this.getRequests(),
      updatedStats: this.getRequestStats(),
    };
  }

  public requestMoreDocuments(requestId: string) {
    this.requests = this.requests.map((r) =>
      r.id === requestId
        ? { ...r, verificationStatus: 'Missing Docs' as const }
        : r
    );
    this.saveStorage(STORAGE_KEY_REQUESTS, this.requests);
    return {
      success: true,
      updatedRequests: this.getRequests(),
    };
  }
}

export const adminSharedStore = new AdminSharedStore();
