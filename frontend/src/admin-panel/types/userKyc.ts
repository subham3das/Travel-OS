export type KycStatusType =
  | 'Pending'
  | 'Verified'
  | 'Rejected'
  | 'Expired'
  | 'Suspended'
  | 'None';

export type KycDocumentStatusType = 'Pending' | 'Verified' | 'Rejected';

export interface DocumentSummaryData {
  uploaded: number;
  verified: number;
  pending: number;
  rejected: number;
  expired: number;
}

export interface KycDocumentItem {
  id: string;
  type: string;
  docCategory: string;
  status: KycDocumentStatusType;
  uploadedAt: string;
  verifiedAt?: string;
  mimeType: string;
  size: string;
  fileUrl: string;
  thumbnailUrl: string;
  documentNumberMasked?: string;
  country?: string;
  expiryDate?: string;
  ocrResult?: string;
  forgeryCheck?: string;
  faceMatchPercent?: number;
  rejectionReason?: string;
}

export interface KycTimelineItem {
  id: string;
  action: string;
  timestamp: string;
  admin?: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  };
  notes?: string;
}

export interface AdminKycData {
  status: KycStatusType;
  submittedAt: string | null;
  verifiedAt: string | null;
  lastUpdated: string;
  reviewedBy: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  } | null;
  verificationId: string;
  rejectionReason: string;
  internalNote: string;
  riskScore?: number;
  riskLevel?: 'Low' | 'Medium' | 'High';
  verificationSource?: string;
  fraudDetection?: string;
  faceMatchPercent?: number;
  documentMatchPercent?: number;
  governmentValidation?: string;
  summary?: DocumentSummaryData;
  documents: KycDocumentItem[];
  timeline: KycTimelineItem[];
}

export interface UserMembershipData {
  currentPlan: 'Free' | 'Silver' | 'Gold' | 'Platinum';
  memberSince: string;
  validTill: string;
  renewal: string;
  benefits: string[];
  upgradeEligibility: string;
}

export interface UserKycDetailsResponse {
  kyc: AdminKycData;
  membership: UserMembershipData;
}
