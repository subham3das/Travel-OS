// ─── Super Admin Agency Requests Data Interfaces ──────────────────────────────

export type AgencyRequestStatus = 'Pending' | 'Under Review' | 'Approved' | 'Rejected';
export type DocumentVerificationStatus = 'Complete' | 'Under Review' | 'Missing Docs';

export type DocumentItemStatus =
  | 'Approved'
  | 'Pending'
  | 'Under Review'
  | 'Missing'
  | 'Rejected'
  | 'Re-upload Requested'
  | 'Re-upload Submitted';

export interface DocumentItem {
  id: string;
  name: string;
  type: string;
  status: DocumentItemStatus;
  fileUrl: string;
  uploadedAt: string;
  rejectionReason?: string;
  customReason?: string;
  internalNote?: string;
  reuploadedAt?: string;
  reuploadedFileUrl?: string;
}

export interface RequestedDocumentItem {
  documentId: string;
  documentName: string;
  documentType: string;
  previousStatus?: string;
  status: 'PENDING_AGENCY_UPLOAD' | 'REUPLOAD_SUBMITTED' | 'APPROVED' | 'REJECTED';
  reason: string;
  customReason?: string;
  internalNote?: string;
  requestedBy?: {
    id: string;
    name: string;
    email: string;
  };
  requestedAt: string;
  requestRound: number;
  reuploadedFileUrl?: string;
  reuploadedAt?: string;
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

export interface AgencyBankDetails {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branch?: string;
  upiId?: string;
  accountType?: string;
  payoutMethod?: string;
  verified?: boolean;
  status?: 'Pending' | 'Under Review' | 'Verified' | 'Rejected';
  verifiedAt?: string;
  verifiedBy?: string;
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
  bankDetails?: AgencyBankDetails;
  timeline: TimelineEvent[];
  activities: ActivityLogItem[];
  reviewNotes?: string;
  complianceScore: number;
  requestedDocuments?: string[];
  requestedDocumentsDetails?: RequestedDocumentItem[];
  documentRequestMessage?: string;
  documentRequestRound?: number;
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
