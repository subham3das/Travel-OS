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
  pendingRequests: { count: 34, growth: '21.4%', isPositive: true },
  approvedToday: { count: 12, growth: '33.3%', isPositive: true },
  rejectedToday: { count: 3, growth: '25%', isPositive: false },
  underReview: { count: 8, growth: '14.3%', isPositive: true },
  documentsMissing: { count: 7, growth: '16.7%', isPositive: true },
  avgApprovalTime: { value: '2h 45m', growth: '8.3%', isPositive: true },
};

const initialAgencyRequestsList: AgencyRequestItem[] = [
  {
    id: 'REQ-101',
    applicationId: 'APP-2024-00567',
    agencyName: 'Wanderlust Holidays',
    logo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=200&auto=format&fit=crop',
    ownerName: 'Aman Sharma',
    ownerEmail: 'aman@wanderlust.com',
    ownerPhone: '+91 98765 43210',
    businessType: 'Tour Operator',
    submittedDate: 'May 21, 2024 10:30 AM',
    gstNumber: '27AABCU9603R1ZV',
    website: 'www.wanderlustholidays.com',
    establishedYear: '2018',
    officeAddress: '123, Andheri West, Mumbai, Maharashtra - 400058',
    aadhaarNumber: 'XXXX XXXX 1234',
    panNumber: 'ABCDE1234F',
    city: 'Mumbai',
    state: 'Maharashtra',
    documentsUploadedCount: 6,
    documentsTotalCount: 6,
    verificationStatus: 'Complete',
    reviewStatus: 'Pending',
    complianceScore: 92,
    verificationChecklist: [
      { id: 'vc1', label: 'GST Verification', status: 'Verified' },
      { id: 'vc2', label: 'PAN Verification', status: 'Verified' },
      { id: 'vc3', label: 'Business License', status: 'Verified' },
      { id: 'vc4', label: 'Bank Verification', status: 'Under Review' },
      { id: 'vc5', label: 'KYC Verification', status: 'Verified' },
      { id: 'vc6', label: 'Office Address', status: 'Pending' },
    ],
    documents: [
      { id: 'd1', name: 'GST Certificate.pdf', type: 'GST', status: 'Approved', fileUrl: '#', uploadedAt: 'May 21, 2024 10:32 AM' },
      { id: 'd2', name: 'PAN Card Copy.pdf', type: 'PAN', status: 'Approved', fileUrl: '#', uploadedAt: 'May 21, 2024 10:35 AM' },
      { id: 'd3', name: 'Trade License.pdf', type: 'License', status: 'Approved', fileUrl: '#', uploadedAt: 'May 21, 2024 10:38 AM' },
      { id: 'd4', name: 'Bank Statement.pdf', type: 'Bank Proof', status: 'Pending', fileUrl: '#', uploadedAt: 'May 21, 2024 10:40 AM' },
      { id: 'd5', name: 'Office Premises Proof.pdf', type: 'Address', status: 'Approved', fileUrl: '#', uploadedAt: 'May 21, 2024 10:42 AM' },
      { id: 'd6', name: 'Owner Aadhaar Card.pdf', type: 'Identity', status: 'Approved', fileUrl: '#', uploadedAt: 'May 21, 2024 10:45 AM' },
    ],
    timeline: [
      { id: 't1', title: 'Application Submitted', timestamp: 'May 21, 2024 10:30 AM', completed: true },
      { id: 't2', title: 'Documents Uploaded', timestamp: 'May 21, 2024 10:45 AM', completed: true },
      { id: 't3', title: 'Verification Started', timestamp: 'May 21, 2024 11:20 AM', completed: true },
      { id: 't4', title: 'Admin Viewed', timestamp: 'May 21, 2024 12:15 PM', completed: true },
      { id: 't5', title: 'Pending Approval', timestamp: '—', completed: false },
    ],
    activities: [
      { id: 'act1', timestamp: 'May 21, 2024 12:15 PM', adminName: 'Super Admin', action: 'Viewed Application', notes: 'Checked GST & PAN validity', status: 'Under Audit' },
      { id: 'act2', timestamp: 'May 21, 2024 11:20 AM', adminName: 'System Bot', action: 'KYC Verified', notes: 'Aadhaar OTP verified', status: 'Automated Pass' },
    ],
  },
  {
    id: 'REQ-102',
    applicationId: 'APP-2024-00568',
    agencyName: 'Himalayan Treks',
    logo: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=200&auto=format&fit=crop',
    ownerName: 'Neha Rawat',
    ownerEmail: 'neha@himalayantreks.com',
    ownerPhone: '+91 98765 11122',
    businessType: 'Adventure',
    submittedDate: 'May 21, 2024 09:15 AM',
    gstNumber: '01AAACH1Z34B1ZK',
    website: 'www.himalayantreks.com',
    establishedYear: '2020',
    officeAddress: 'Mall Road, Dehradun, Uttarakhand - 248001',
    aadhaarNumber: 'XXXX XXXX 5678',
    panNumber: 'FGHIJ5678K',
    city: 'Dehradun',
    state: 'Uttarakhand',
    documentsUploadedCount: 4,
    documentsTotalCount: 6,
    verificationStatus: 'Missing Docs',
    reviewStatus: 'Pending',
    complianceScore: 68,
    verificationChecklist: [],
    documents: [],
    timeline: [],
    activities: [],
  },
  {
    id: 'REQ-103',
    applicationId: 'APP-2024-00569',
    agencyName: 'Goa Getaways',
    logo: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=200&auto=format&fit=crop',
    ownerName: 'Rohit Verma',
    ownerEmail: 'info@goagetaways.com',
    ownerPhone: '+91 98765 22233',
    businessType: 'Tour Operator',
    submittedDate: 'May 20, 2024 04:45 PM',
    gstNumber: '30AABCG7890C1Z3',
    website: 'www.goagetaways.com',
    establishedYear: '2019',
    officeAddress: 'Panjim Beach Road, Goa - 403001',
    aadhaarNumber: 'XXXX XXXX 9012',
    panNumber: 'LMNOP9012Q',
    city: 'Goa',
    state: 'Goa',
    documentsUploadedCount: 6,
    documentsTotalCount: 6,
    verificationStatus: 'Complete',
    reviewStatus: 'Under Review',
    complianceScore: 88,
    verificationChecklist: [],
    documents: [],
    timeline: [],
    activities: [],
  },
];

const initialAgencySummaryStats: AgencySummaryStats = {
  totalAgencies: { id: 'total', title: 'Total Agencies', count: 1248, growth: '12.5%', isPositive: true, comparisonText: 'from last 30 days', iconType: 'total', bgColor: 'bg-purple-50', iconColor: 'text-[#6356E5]' },
  activeAgencies: { id: 'active', title: 'Active Agencies', count: 982, growth: '8.3%', isPositive: true, comparisonText: 'from last 30 days', iconType: 'active', bgColor: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  pendingApproval: { id: 'pending', title: 'Pending Approval', count: 128, growth: '5.7%', isPositive: true, comparisonText: 'from last 30 days', iconType: 'pending', bgColor: 'bg-amber-50', iconColor: 'text-amber-600' },
  suspendedAgencies: { id: 'suspended', title: 'Suspended Agencies', count: 56, growth: '3.2%', isPositive: false, comparisonText: 'from last 30 days', iconType: 'suspended', bgColor: 'bg-rose-50', iconColor: 'text-rose-500' },
  rejectedAgencies: { id: 'rejected', title: 'Rejected Agencies', count: 32, growth: '1.1%', isPositive: false, comparisonText: 'from last 30 days', iconType: 'rejected', bgColor: 'bg-rose-50', iconColor: 'text-rose-600' },
  verifiedAgencies: { id: 'verified', title: 'Verified Agencies', count: 876, growth: '10.2%', isPositive: true, comparisonText: 'from last 30 days', iconType: 'verified', bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
};

const initialAgenciesList: Agency[] = [
  {
    id: 'AG-101',
    name: 'Wanderlust Holidays',
    logo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=200&auto=format&fit=crop',
    gstNumber: '27AABCU9603R1ZV',
    owner: { name: 'Aman Sharma', email: 'aman@wanderlust.com', phone: '+91 98765 43210' },
    email: 'aman@wanderlust.com',
    phone: '+91 98765 43210',
    website: 'www.wanderlustholidays.com',
    businessType: 'Tour Operator',
    city: 'Mumbai',
    state: 'Maharashtra',
    rating: 4.8,
    reviewCount: 128,
    packages: 45,
    bookings: 1245,
    revenue: '₹48,75,230',
    verification: 'Verified',
    status: 'Active',
    joinDate: 'May 21, 2024',
  },
  {
    id: 'AG-102',
    name: 'Himalayan Treks',
    logo: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=200&auto=format&fit=crop',
    gstNumber: '01AAACH1Z34B1ZK',
    owner: { name: 'Neha Rawat', email: 'neha@himalayantreks.com', phone: '+91 98765 11122' },
    email: 'neha@himalayantreks.com',
    phone: '+91 98765 11122',
    website: 'www.himalayantreks.com',
    businessType: 'Adventure',
    city: 'Dehradun',
    state: 'Uttarakhand',
    rating: 4.6,
    reviewCount: 98,
    packages: 32,
    bookings: 856,
    revenue: '₹32,40,880',
    verification: 'Under Review',
    status: 'Pending',
    joinDate: 'Jun 10, 2024',
  },
];

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
