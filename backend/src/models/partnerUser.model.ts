import mongoose, { Document, Schema } from 'mongoose';

export interface IPartnerUser extends Document {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: 'partner' | 'agency_owner' | 'staff' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const PartnerUserSchema = new Schema<IPartnerUser>(
  {
    name: { type: String, required: true, trim: true, minlength: 3, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    role: { type: String, default: 'partner' },
  },
  {
    timestamps: true,
  }
);

export const PartnerUserModel = mongoose.model<IPartnerUser>('PartnerUser', PartnerUserSchema);
