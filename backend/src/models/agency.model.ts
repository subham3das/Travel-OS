import mongoose, { Document, Schema } from 'mongoose';

export type AgencyVerificationStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'APPROVED'
  | 'REJECTED'
  | 'MISSING_DOCS';

export type AgencyStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'REJECTED';

export interface IAgencyDocumentItem {
  id: string;
  name: string;
  type: string;
  status: 'Approved' | 'Pending' | 'Under Review' | 'Missing' | 'Rejected' | 'Re-upload Requested' | 'Re-upload Submitted';
  fileUrl: string;
  size?: number;
  sizeFormatted?: string;
  uploadedAt: string;
  rejectionReason?: string;
  customReason?: string;
  internalNote?: string;
  requestedAt?: string;
  reuploadedAt?: string;
  reuploadedFileUrl?: string;
}

export interface IRequestedDocumentDetail {
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

export interface IVerificationChecklistItem {
  id: string;
  label: string;
  status: 'Verified' | 'Pending' | 'Under Review' | 'Missing';
}

export interface ITimelineEvent {
  id: string;
  title: string;
  timestamp: string;
  completed: boolean;
  desc?: string;
  actor?: string;
  color?: string;
}

export interface IReviewNote {
  id: string;
  adminId: string;
  adminName: string;
  note: string;
  createdAt: string;
  updatedAt?: string;
}

export interface IAgency extends Document {
  applicationId: string;
  agencyId?: string;
  name: string;
  legalBusinessName?: string;
  agencyDisplayName?: string;
  email: string;
  phone: string;
  ownerName: string;
  businessType?: string;
  yearEstablished?: string;
  registrationNumber?: string;
  gstNumber?: string;
  businessAddress?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  country?: string;
  website?: string;
  description?: string;
  logo?: string;
  banner?: string;

  // Owner details
  owner?: {
    name: string;
    email: string;
    phone: string;
    panNumber?: string;
    aadhaarNumber?: string;
    governmentIdType?: string;
    governmentIdUrl?: string;
    selfieUrl?: string;
    addressProofUrl?: string;
  };

  // Profile Branding & Operations
  profile?: {
    logoUrl?: string;
    coverUrl?: string;
    tagline?: string;
    about?: string;
    yearsOfExperience?: string;
    teamSize?: string;
    selectedServices?: string[];
    destinations?: string[];
    languages?: string[];
    phone?: string;
    email?: string;
    website?: string;
    instagram?: string;
    facebook?: string;
  };

  // Additional Profile Details
  panNumber?: string;
  businessLicenseNumber?: string;
  alternatePhone?: string;
  supportEmail?: string;
  googleMapsLocation?: string;
  emergencyContact?: string;
  teamMemberCount?: number;
  languages?: string[];

  // Social Links
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    linkedin?: string;
    x?: string;
    website?: string;
  };

  // Business Operating Hours
  businessHours?: Array<{
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
    isOpen: boolean;
    openTime: string;
    closeTime: string;
    isHoliday: boolean;
  }>;

  // System & Operations Settings
  settings?: Record<string, any>;

  // Bank & Payouts
  bankDetails?: {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountType?: string;
    upiId?: string;
    payoutMethod?: string;
    branch?: string;
    verified?: boolean;
    verifiedAt?: string;
    verifiedBy?: string;
    status?: 'Pending' | 'Under Review' | 'Verified' | 'Rejected';
  };

  // Verification & KYC Details
  documents: IAgencyDocumentItem[];
  verificationChecklist: IVerificationChecklistItem[];
  complianceScore: number;
  timeline: ITimelineEvent[];
  reviewNotes: IReviewNote[];
  requestedDocuments?: string[];
  requestedDocumentsDetails?: IRequestedDocumentDetail[];
  documentRequestRound?: number;
  documentRequestMessage?: string;

  // Status, Credentials & Governance
  verificationStatus: AgencyVerificationStatus;
  status: AgencyStatus;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  approvedAt?: Date;
  approvedBy?: mongoose.Types.ObjectId | string;
  rejectionReason?: string;

  // Credentials & Login Security
  loginEmail?: string;
  passwordHash?: string;
  passwordChanged?: boolean;
  passwordChangedAt?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  tokenVersion?: number;
  canLogin?: boolean;
  isActive?: boolean;
  emailVerified?: boolean;
  agencyVerified?: boolean;
  lastLogin?: Date;

  // Onboarding & Draft Lifecycle
  onboardingStep?: number;
  completionPercentage?: number;
  submissionIp?: string;
  submissionBrowser?: string;
  draftData?: Record<string, any>;

  // Performance metrics
  rating?: number;
  totalBookings?: number;
  totalRevenue?: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AgencyDocumentItemSchema = new Schema<IAgencyDocumentItem>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    status: {
      type: String,
      enum: ['Approved', 'Pending', 'Under Review', 'Missing', 'Rejected', 'Re-upload Requested', 'Re-upload Submitted'],
      default: 'Pending',
    },
    fileUrl: { type: String, required: true },
    size: { type: Number },
    sizeFormatted: { type: String },
    uploadedAt: { type: String, default: () => new Date().toISOString() },
    rejectionReason: { type: String },
    customReason: { type: String },
    internalNote: { type: String },
    requestedAt: { type: String },
    reuploadedAt: { type: String },
    reuploadedFileUrl: { type: String },
  },
  { _id: false }
);

const RequestedDocumentDetailSchema = new Schema<IRequestedDocumentDetail>(
  {
    documentId: { type: String, required: true },
    documentName: { type: String, required: true },
    documentType: { type: String, required: true },
    previousStatus: { type: String },
    status: {
      type: String,
      enum: ['PENDING_AGENCY_UPLOAD', 'REUPLOAD_SUBMITTED', 'APPROVED', 'REJECTED'],
      default: 'PENDING_AGENCY_UPLOAD',
    },
    reason: { type: String, required: true },
    customReason: { type: String },
    internalNote: { type: String },
    requestedBy: {
      id: { type: String },
      name: { type: String },
      email: { type: String },
    },
    requestedAt: { type: String, default: () => new Date().toISOString() },
    requestRound: { type: Number, default: 1 },
    reuploadedFileUrl: { type: String },
    reuploadedAt: { type: String },
  },
  { _id: false }
);

const VerificationChecklistItemSchema = new Schema<IVerificationChecklistItem>(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    status: {
      type: String,
      enum: ['Verified', 'Pending', 'Under Review', 'Missing'],
      default: 'Pending',
    },
  },
  { _id: false }
);

const TimelineEventSchema = new Schema<ITimelineEvent>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    timestamp: { type: String, required: true },
    completed: { type: Boolean, default: false },
    desc: { type: String },
    actor: { type: String },
    color: { type: String },
  },
  { _id: false }
);

const ReviewNoteSchema = new Schema<IReviewNote>(
  {
    id: { type: String, required: true },
    adminId: { type: String, required: true },
    adminName: { type: String, required: true },
    note: { type: String, required: true },
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String },
  },
  { _id: false }
);

const AgencySchema = new Schema<IAgency>(
  {
    applicationId: { type: String, required: true, unique: true, index: true },
    agencyId: { type: String, unique: true, sparse: true, index: true },
    name: { type: String, required: true, trim: true, index: true },
    legalBusinessName: { type: String, trim: true },
    agencyDisplayName: { type: String, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    phone: { type: String, required: true, trim: true },
    ownerName: { type: String, required: true, trim: true },
    businessType: { type: String, default: 'Tour Operator' },
    yearEstablished: { type: String },
    registrationNumber: { type: String, trim: true },
    gstNumber: { type: String, trim: true },
    businessAddress: { type: String },
    city: { type: String },
    state: { type: String },
    pinCode: { type: String },
    country: { type: String, default: 'India' },
    website: { type: String },
    description: { type: String },
    logo: { type: String },
    banner: { type: String },

    // Owner info
    owner: {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
      panNumber: { type: String },
      aadhaarNumber: { type: String },
      governmentIdType: { type: String },
      governmentIdUrl: { type: String },
      selfieUrl: { type: String },
      addressProofUrl: { type: String },
    },

    // Profile info
    profile: {
      logoUrl: { type: String },
      coverUrl: { type: String },
      tagline: { type: String },
      about: { type: String },
      yearsOfExperience: { type: String },
      teamSize: { type: String },
      selectedServices: [{ type: String }],
      destinations: [{ type: String }],
      languages: [{ type: String }],
      phone: { type: String },
      email: { type: String },
      website: { type: String },
      instagram: { type: String },
      facebook: { type: String },
    },

    // Additional Profile Details
    panNumber: { type: String, trim: true },
    businessLicenseNumber: { type: String, trim: true },
    alternatePhone: { type: String, trim: true },
    supportEmail: { type: String, trim: true, lowercase: true },
    googleMapsLocation: { type: String },
    emergencyContact: { type: String },
    teamMemberCount: { type: Number, default: 8 },
    languages: [{ type: String }],

    // Social Links
    socialLinks: {
      instagram: { type: String },
      facebook: { type: String },
      youtube: { type: String },
      linkedin: { type: String },
      x: { type: String },
      website: { type: String },
    },

    // Business Operating Hours
    businessHours: [
      {
        day: { type: String, required: true },
        isOpen: { type: Boolean, default: true },
        openTime: { type: String, default: '09:00 AM' },
        closeTime: { type: String, default: '07:00 PM' },
        isHoliday: { type: Boolean, default: false },
      },
    ],

    // System & Operational Settings
    settings: { type: Schema.Types.Mixed, default: {} },

    // Bank Details
    bankDetails: {
      accountHolderName: { type: String },
      bankName: { type: String },
      accountNumber: { type: String },
      ifscCode: { type: String },
      accountType: { type: String, default: 'Current Account' },
      upiId: { type: String },
      payoutMethod: { type: String, default: 'bank' },
      branch: { type: String },
      verified: { type: Boolean, default: false },
      verifiedAt: { type: String },
      verifiedBy: { type: String },
      status: {
        type: String,
        enum: ['Pending', 'Under Review', 'Verified', 'Rejected'],
        default: 'Under Review',
      },
    },

    // Verification & Documents
    documents: { type: [AgencyDocumentItemSchema], default: [] },
    verificationChecklist: { type: [VerificationChecklistItemSchema], default: [] },
    complianceScore: { type: Number, default: 85 },
    timeline: { type: [TimelineEventSchema], default: [] },
    reviewNotes: { type: [ReviewNoteSchema], default: [] },
    requestedDocuments: [{ type: String }],
    requestedDocumentsDetails: { type: [RequestedDocumentDetailSchema], default: [] },
    documentRequestRound: { type: Number, default: 0 },
    documentRequestMessage: { type: String },

    // Review & Status
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'UNDER_REVIEW', 'VERIFIED', 'APPROVED', 'REJECTED', 'MISSING_DOCS'],
      default: 'PENDING',
      index: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACTIVE', 'INACTIVE', 'SUSPENDED', 'REJECTED'],
      default: 'PENDING',
      index: true,
    },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
    reviewedAt: { type: Date },
    approvedAt: { type: Date },
    approvedBy: { type: Schema.Types.Mixed },
    rejectionReason: { type: String },

    // Credentials & Login Security
    loginEmail: { type: String, lowercase: true, trim: true, index: true },
    passwordHash: { type: String },
    passwordChanged: { type: Boolean, default: false },
    passwordChangedAt: { type: Date },
    resetPasswordToken: { type: String, sparse: true, index: true },
    resetPasswordExpires: { type: Date },
    tokenVersion: { type: Number, default: 0 },
    canLogin: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: true },
    agencyVerified: { type: Boolean, default: true },
    lastLogin: { type: Date },

    // Onboarding & Draft Lifecycle
    onboardingStep: { type: Number, default: 1 },
    completionPercentage: { type: Number, default: 0 },
    submissionIp: { type: String },
    submissionBrowser: { type: String },
    draftData: { type: Schema.Types.Mixed, default: {} },

    // Metrics
    rating: { type: Number, default: 4.8 },
    totalBookings: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

AgencySchema.index({ createdAt: -1 });
AgencySchema.index({ name: 'text', email: 'text', city: 'text', gstNumber: 'text', applicationId: 'text' });

export const AgencyModel =
  mongoose.models.Agency || mongoose.model<IAgency>('Agency', AgencySchema, 'agencies');
