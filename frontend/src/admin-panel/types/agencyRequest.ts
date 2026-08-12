// ─── Super Admin Agency Requests Data Interfaces ──────────────────────────────

export type AgencyRequestStatus = 'Pending' | 'Under Review' | 'Approved' | 'Rejected';
export type DocumentVerificationStatus = 'Complete' | 'Under Review' | 'Missing Docs';

export interface DocumentItem {
  id: string;
  name: string;
  type: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  fileUrl: string;
  uploadedAt: string;
}

export interface VerificationCheckitem {
  id: string;
  label: string;
  status: 'Verified' | 'Pending' | 'Under Review' | 'Missing';
}

export interface TimelineEvent {
  id: string;
  title: string;
  timestamp: string;
  completed: boolean;
  color?: string;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  adminName: string;
  action: string;
  notes?: string;
  status: string;
}

export interface AgencyRequestItem {
  id: string;
  applicationId: string;
  agencyName: string;
  logo: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  businessType: 'Tour Operator' | 'Adventure' | 'Travel Agency' | 'DMC' | 'OTA';
  submittedDate: string;
  gstNumber: string;
  website: string;
  establishedYear: string;
  officeAddress: string;
  aadhaarNumber: string;
  panNumber: string;
  city: string;
  state: string;

  // Ratios & Badges
  documentsUploadedCount: number;
  documentsTotalCount: number;
  verificationStatus: DocumentVerificationStatus;
  reviewStatus: AgencyRequestStatus;

  // Extended Details
  verificationChecklist: VerificationCheckitem[];
  documents: DocumentItem[];
  timeline: TimelineEvent[];
  activities: ActivityLogItem[];
  reviewNotes?: string;
  complianceScore: number;
}

export interface AgencyRequestSummaryStats {
  pendingRequests: { count: number; growth: string; isPositive: boolean };
  approvedToday: { count: number; growth: string; isPositive: boolean };
  rejectedToday: { count: number; growth: string; isPositive: boolean };
  underReview: { count: number; growth: string; isPositive: boolean };
  documentsMissing: { count: number; growth: string; isPositive: boolean };
  avgApprovalTime: { value: string; growth: string; isPositive: boolean };
}

export interface AgencyRequestFilters {
  status: string;
  businessType: string;
  state: string;
  submissionDate: string;
  verificationStatus: string;
  search: string;
}
