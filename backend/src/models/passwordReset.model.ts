import mongoose, { Schema, Document } from 'mongoose';

export interface IPasswordReset extends Document {
  userId: mongoose.Types.ObjectId;
  email: string;
  token: string;
  isUsed: boolean;
  expiresAt: Date;
  createdAt: Date;
}

const PasswordResetSchema = new Schema<IPasswordReset>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    email: { type: String, required: true, lowercase: true },
    token: { type: String, required: true, unique: true, index: true },
    isUsed: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true, index: { expires: '1h' } },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const PasswordResetModel = mongoose.model<IPasswordReset>('PasswordReset', PasswordResetSchema);
