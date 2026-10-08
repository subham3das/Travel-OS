import mongoose, { Document, Schema } from 'mongoose';

export type SellerType = 'Agency' | 'Car Rental' | 'Activity' | 'Hotel';

export type SellerPaymentStatus =
  | 'NOT_STARTED'
  | 'SKIPPED'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'NEEDS_UPDATE';

export type SellerKycStatus = 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
export type SellerBankVerificationStatus = 'PENDING' | 'VERIFIED' | 'FAILED';

export type BusinessType =
  | 'individual'
  | 'proprietorship'
  | 'partnership'
  | 'private_limited'
  | 'public_limited'
  | 'llp'
  | 'trust'
  | 'society'
  | 'not_yet_registered';

export interface ISellerPaymentProfile extends Document {
  sellerId: mongoose.Types.ObjectId;
  sellerType: SellerType;
  businessName: string;
  businessType: BusinessType;
  businessEmail?: string;
  businessPhone?: string;
  panNumber?: string;
  gstin?: string;

  // Bank & IFSC details
  bankName: string;
  ifscCode: string;
  accountNumberEncrypted: string;
  accountNumberMasked: string;
  beneficiaryName: string;
  payoutMethod: 'bank' | 'upi';
  upiId?: string;

  // Razorpay Route integration identifiers
  razorpayContactId?: string;
  razorpayFundAccountId?: string;
  razorpayLinkedAccountId?: string;
  razorpayAccountStatus?: string;

  // Onboarding & Compliance States
  status: SellerPaymentStatus;
  kycStatus: SellerKycStatus;
  bankVerificationStatus: SellerBankVerificationStatus;
  routeEnabled: boolean;
  settlementsEnabled: boolean;

  // Payout Hold & Compliance Controls (Phase 16)
  isPayoutHold?: boolean;
  payoutHoldReason?: string;
  payoutHoldPlacedAt?: Date;
  payoutHoldPlacedBy?: string;
  complianceSuspended?: boolean;
  complianceReason?: string;
  complianceSuspendedAt?: Date;
  complianceSuspendedBy?: string;

  // Guided Wizard Persistence & Progress Tracker
  currentStep: number;
  onboardingProgress?: {
    businessDetails?: { completed: boolean; updatedAt?: Date };
    bankAccountAdded?: { completed: boolean; updatedAt?: Date };
    contactCreated?: { completed: boolean; contactId?: string; updatedAt?: Date };
    fundAccountCreated?: { completed: boolean; fundAccountId?: string; updatedAt?: Date };
    linkedAccountCreated?: { completed: boolean; linkedAccountId?: string; updatedAt?: Date };
    bankVerification?: { status: 'PENDING' | 'VERIFIED' | 'FAILED'; reason?: string; updatedAt?: Date };
    razorpayReview?: { status: 'PENDING' | 'APPROVED' | 'REJECTED'; reason?: string; updatedAt?: Date };
    settlementEnabled?: { completed: boolean; updatedAt?: Date };
    failedStep?: string;
    failureReason?: string;
    recommendedAction?: string;
  };

  // Immutable Bank Account & Replacement Workflow
  isBankLocked: boolean;
  archivedBankAccounts?: Array<{
    bankName: string;
    ifscCode: string;
    accountNumberEncrypted: string;
    accountNumberMasked: string;
    beneficiaryName: string;
    razorpayFundAccountId?: string;
    replacedAt: Date;
    replacedBy?: string;
    reason?: string;
  }>;
  payoutChangeRequest?: {
    requestedAt: Date;
    newBankName: string;
    newIfscCode: string;
    newAccountNumberEncrypted: string;
    newAccountNumberMasked: string;
    newBeneficiaryName: string;
    reason: string;
    status: 'PENDING' | 'VERIFYING' | 'APPROVED' | 'REJECTED';
    razorpayFundAccountId?: string;
    reviewedAt?: Date;
    reviewedBy?: string;
    rejectionReason?: string;
  };

  // Automated Retry & Recovery Tracking
  retryCount: number;
  nextRetryAt?: Date;
  lastError?: string;
  lastFailedOperation?: string;
  recoveryStatus?: 'NONE' | 'SCHEDULED' | 'IN_PROGRESS' | 'RETRY_EXHAUSTED' | 'MANUAL_INTERVENTION_REQUIRED' | 'RESOLVED';

  // Timestamps & Audit details
  lastSyncTime?: Date;
  submittedAt?: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  onboardingFailureReason?: string;
  adminNotes?: string;

  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SellerPaymentProfileSchema = new Schema<ISellerPaymentProfile>(
  {
    sellerId: { type: Schema.Types.ObjectId, required: true, index: true },
    sellerType: {
      type: String,
      enum: ['Agency', 'Car Rental', 'Activity', 'Hotel'],
      required: true,
      default: 'Agency',
      index: true,
    },
    businessName: { type: String, required: true, trim: true },
    businessType: {
      type: String,
      enum: [
        'individual',
        'proprietorship',
        'partnership',
        'private_limited',
        'public_limited',
        'llp',
        'trust',
        'society',
        'not_yet_registered',
      ],
      default: 'proprietorship',
    },
    businessEmail: { type: String, lowercase: true, trim: true },
    businessPhone: { type: String, trim: true },
    panNumber: { type: String, uppercase: true, trim: true },
    gstin: { type: String, uppercase: true, trim: true },

    bankName: { type: String, default: 'Indian Bank' },
    ifscCode: { type: String, required: true, uppercase: true, trim: true },
    accountNumberEncrypted: { type: String, required: true },
    accountNumberMasked: { type: String, required: true },
    beneficiaryName: { type: String, required: true, trim: true },
    payoutMethod: { type: String, enum: ['bank', 'upi'], default: 'bank' },
    upiId: { type: String, trim: true },

    razorpayContactId: { type: String, index: true },
    razorpayFundAccountId: { type: String, index: true },
    razorpayLinkedAccountId: { type: String, index: true },
    razorpayAccountStatus: { type: String, default: 'created' },

    status: {
      type: String,
      enum: ['NOT_STARTED', 'SKIPPED', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'NEEDS_UPDATE'],
      default: 'NOT_STARTED',
      index: true,
    },
    kycStatus: {
      type: String,
      enum: ['PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
    bankVerificationStatus: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'FAILED'],
      default: 'PENDING',
    },
    routeEnabled: { type: Boolean, default: false },
    settlementsEnabled: { type: Boolean, default: false },

    // Payout Hold & Compliance Controls (Phase 16)
    isPayoutHold: { type: Boolean, default: false, index: true },
    payoutHoldReason: { type: String },
    payoutHoldPlacedAt: { type: Date },
    payoutHoldPlacedBy: { type: String },
    complianceSuspended: { type: Boolean, default: false, index: true },
    complianceReason: { type: String },
    complianceSuspendedAt: { type: Date },
    complianceSuspendedBy: { type: String },

    // Guided Wizard Persistence & Progress Tracker
    currentStep: { type: Number, default: 1, min: 1, max: 5 },
    onboardingProgress: {
      businessDetails: { completed: { type: Boolean, default: false }, updatedAt: { type: Date } },
      bankAccountAdded: { completed: { type: Boolean, default: false }, updatedAt: { type: Date } },
      contactCreated: { completed: { type: Boolean, default: false }, contactId: { type: String }, updatedAt: { type: Date } },
      fundAccountCreated: { completed: { type: Boolean, default: false }, fundAccountId: { type: String }, updatedAt: { type: Date } },
      linkedAccountCreated: { completed: { type: Boolean, default: false }, linkedAccountId: { type: String }, updatedAt: { type: Date } },
      bankVerification: {
        status: { type: String, enum: ['PENDING', 'VERIFIED', 'FAILED'], default: 'PENDING' },
        reason: { type: String },
        updatedAt: { type: Date },
      },
      razorpayReview: {
        status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
        reason: { type: String },
        updatedAt: { type: Date },
      },
      settlementEnabled: { completed: { type: Boolean, default: false }, updatedAt: { type: Date } },
      failedStep: { type: String },
      failureReason: { type: String },
      recommendedAction: { type: String },
    },

    // Immutable Bank Account & Replacement Workflow
    isBankLocked: { type: Boolean, default: false },
    archivedBankAccounts: [
      {
        bankName: { type: String },
        ifscCode: { type: String },
        accountNumberEncrypted: { type: String },
        accountNumberMasked: { type: String },
        beneficiaryName: { type: String },
        razorpayFundAccountId: { type: String },
        replacedAt: { type: Date, default: Date.now },
        replacedBy: { type: String },
        reason: { type: String },
      },
    ],
    payoutChangeRequest: {
      requestedAt: { type: Date },
      newBankName: { type: String },
      newIfscCode: { type: String },
      newAccountNumberEncrypted: { type: String },
      newAccountNumberMasked: { type: String },
      newBeneficiaryName: { type: String },
      reason: { type: String },
      status: { type: String, enum: ['PENDING', 'VERIFYING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
      razorpayFundAccountId: { type: String },
      reviewedAt: { type: Date },
      reviewedBy: { type: String },
      rejectionReason: { type: String },
    },

    // Automated Retry & Recovery Tracking
    retryCount: { type: Number, default: 0 },
    nextRetryAt: { type: Date },
    lastError: { type: String },
    lastFailedOperation: { type: String },
    recoveryStatus: {
      type: String,
      enum: ['NONE', 'SCHEDULED', 'IN_PROGRESS', 'RETRY_EXHAUSTED', 'MANUAL_INTERVENTION_REQUIRED', 'RESOLVED'],
      default: 'NONE',
    },

    lastSyncTime: { type: Date },
    submittedAt: { type: Date },
    approvedAt: { type: Date },
    rejectedAt: { type: Date },
    rejectionReason: { type: String },
    onboardingFailureReason: { type: String },
    adminNotes: { type: String },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

SellerPaymentProfileSchema.index({ sellerId: 1, sellerType: 1 }, { unique: true });
SellerPaymentProfileSchema.index({ status: 1, routeEnabled: 1, bankVerificationStatus: 1 });

export const SellerPaymentProfileModel =
  mongoose.models.SellerPaymentProfile ||
  mongoose.model<ISellerPaymentProfile>('SellerPaymentProfile', SellerPaymentProfileSchema, 'seller_payment_profiles');
