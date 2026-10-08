import mongoose, { Document, Schema } from 'mongoose';

export interface IPartnerOtp extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'email' | 'phone';
  identifier: string;
  otpHash: string;
  expiresAt: Date;
  resendAttempts: number;
  lastSentAt: Date;
  verified: boolean;
  createdAt: Date;
}

const PartnerOtpSchema = new Schema<IPartnerOtp>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'PartnerUser', required: true, index: true },
    type: { type: String, enum: ['email', 'phone'], required: true },
    identifier: { type: String, required: true, lowercase: true, trim: true },
    otpHash: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: '15m' } },
    resendAttempts: { type: Number, default: 0 },
    lastSentAt: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const PartnerOtpModel = mongoose.model<IPartnerOtp>('PartnerOtp', PartnerOtpSchema);
