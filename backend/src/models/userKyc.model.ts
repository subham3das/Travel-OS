import mongoose, { Schema, Document } from 'mongoose';

export type KycStatus = 'Pending' | 'Verified' | 'Rejected' | 'Expired' | 'Suspended' | 'None';

export type KycDocumentStatus = 'Pending' | 'Verified' | 'Rejected';

export interface IKycDocument {
  id: string;
  type: string;
  docCategory: 'aadhaar' | 'voterId' | 'drivingLicence' | 'passport' | 'other';
  status: KycDocumentStatus;
  uploadedAt: Date;
  verifiedAt?: Date;
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

export interface IKycTimelineEvent {
  id: string;
  action: string;
  timestamp: Date;
  admin?: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  };
  notes?: string;
}

export interface IUserKyc extends Document {
  userId: mongoose.Types.ObjectId;
  verificationId: string;
  status: KycStatus;
  submittedAt?: Date;
  verifiedAt?: Date;
  lastUpdated: Date;
  reviewedBy?: {
    id?: string;
    name: string;
    email?: string;
    role?: string;
  };
  rejectionReason?: string;
  internalNote?: string;
  riskScore?: number;
  riskLevel?: 'Low' | 'Medium' | 'High';
  verificationSource?: string;
  fraudDetection?: string;
  faceMatchPercent?: number;
  documentMatchPercent?: number;
  governmentValidation?: string;
  documents: IKycDocument[];
  timeline: IKycTimelineEvent[];
  createdAt: Date;
  updatedAt: Date;
}

const KycDocumentSubSchema = new Schema<IKycDocument>(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    docCategory: {
      type: String,
      enum: ['aadhaar', 'voterId', 'drivingLicence', 'passport', 'other'],
      default: 'other',
    },
    status: {
      type: String,
      enum: ['Pending', 'Verified', 'Rejected'],
      default: 'Pending',
    },
    uploadedAt: { type: Date, default: Date.now },
    verifiedAt: { type: Date },
    mimeType: { type: String, default: 'image/jpeg' },
    size: { type: String, default: '1.5 MB' },
    fileUrl: { type: String, required: true },
    thumbnailUrl: { type: String, default: '' },
    documentNumberMasked: { type: String, default: '' },
    country: { type: String, default: 'India' },
    expiryDate: { type: String, default: '' },
    ocrResult: { type: String, default: '' },
    forgeryCheck: { type: String, default: '' },
    faceMatchPercent: { type: Number },
    rejectionReason: { type: String },
  },
  { _id: false }
);

const KycTimelineSubSchema = new Schema<IKycTimelineEvent>(
  {
    id: { type: String, required: true },
    action: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    admin: {
      id: { type: String },
      name: { type: String },
      email: { type: String },
      role: { type: String },
    },
    notes: { type: String },
  },
  { _id: false }
);

const UserKycSchema = new Schema<IUserKyc>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    verificationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Verified', 'Rejected', 'Expired', 'Suspended', 'None'],
      default: 'Pending',
      index: true,
    },
    submittedAt: { type: Date },
    verifiedAt: { type: Date },
    lastUpdated: { type: Date, default: Date.now },
    reviewedBy: {
      id: { type: String },
      name: { type: String },
      email: { type: String },
      role: { type: String },
    },
    rejectionReason: { type: String, default: '' },
    internalNote: { type: String, default: '' },
    riskScore: { type: Number, default: 12 },
    riskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Low',
    },
    verificationSource: { type: String, default: 'Manual Upload & DigiLocker' },
    fraudDetection: { type: String, default: 'Passed (0 Anomaly Flags)' },
    faceMatchPercent: { type: Number, default: 98.4 },
    documentMatchPercent: { type: Number, default: 99.1 },
    governmentValidation: { type: String, default: 'UIDAI / ECI Database Verified' },
    documents: [KycDocumentSubSchema],
    timeline: [KycTimelineSubSchema],
  },
  {
    timestamps: true,
    collection: 'user_kycs',
  }
);

export const UserKycModel =
  mongoose.models.UserKyc || mongoose.model<IUserKyc>('UserKyc', UserKycSchema);
