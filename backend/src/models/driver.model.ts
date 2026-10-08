import mongoose, { Document, Schema } from 'mongoose';

export type DriverStatus = 'active' | 'on_trip' | 'off_duty' | 'suspended';

export interface IDriverDocument {
  title: string;
  fileUrl: string;
  type: string;
  verified: boolean;
  uploadedAt: Date;
}

export interface IDriver extends Document {
  agencyId: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  email?: string;
  photo?: string;
  licenseNumber: string;
  licenseExpiry?: Date;
  experienceYears: number;
  assignedCarId?: mongoose.Types.ObjectId;
  assignedCarName?: string;
  status: DriverStatus;
  tripsCompleted: number;
  rating: number;
  reviewsCount: number;
  totalRevenue: number;
  emergencyContact?: string;
  address?: string;
  languages: string[];
  documents: IDriverDocument[];
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DriverDocumentSchema = new Schema<IDriverDocument>(
  {
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    type: { type: String, default: 'License' },
    verified: { type: Boolean, default: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const DriverSchema = new Schema<IDriver>(
  {
    agencyId: {
      type: Schema.Types.ObjectId,
      ref: 'Agency',
      required: true,
    },
    name: { type: String, required: true, trim: true, index: true },
    phone: { type: String, required: true, trim: true, index: true },
    email: { type: String, default: '', trim: true },
    photo: { type: String, default: '' },
    licenseNumber: { type: String, required: true, trim: true, index: true },
    licenseExpiry: { type: Date },
    experienceYears: { type: Number, default: 3 },
    assignedCarId: {
      type: Schema.Types.ObjectId,
      ref: 'Car',
      default: null,
      index: true,
    },
    assignedCarName: { type: String, default: '' },
    status: {
      type: String,
      enum: ['active', 'on_trip', 'off_duty', 'suspended'],
      default: 'active',
      index: true,
    },
    tripsCompleted: { type: Number, default: 0 },
    rating: { type: Number, default: 4.9, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    emergencyContact: { type: String, default: '' },
    address: { type: String, default: '' },
    languages: [{ type: String }],
    documents: [DriverDocumentSchema],
    isVerified: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

DriverSchema.index({ agencyId: 1, status: 1 });
DriverSchema.index({ agencyId: 1, createdAt: -1 });

export const DriverModel = mongoose.model<IDriver>('Driver', DriverSchema);
