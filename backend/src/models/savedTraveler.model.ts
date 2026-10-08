import mongoose, { Schema, Document } from 'mongoose';

export type SavedTravelerRelationship =
  | 'self'
  | 'spouse'
  | 'child'
  | 'parent'
  | 'sibling'
  | 'friend'
  | 'other';

export interface ISavedTravelerAadhaar {
  number?: string;
  frontUrl?: string;
  backUrl?: string;
}

export interface ISavedTravelerVoterId {
  number?: string;
  frontUrl?: string;
}

export interface ISavedTravelerDrivingLicence {
  number?: string;
  frontUrl?: string;
  backUrl?: string;
}

export interface ISavedTravelerPassport {
  number?: string;
  expiryDate?: Date;
  documentUrl?: string;
}

export interface ISavedTravelerEmergencyContact {
  name?: string;
  phone?: string;
  relationship?: string;
}

export interface ISavedTraveler extends Document {
  userId: mongoose.Types.ObjectId;
  relationship: SavedTravelerRelationship;
  fullName: string;
  dob?: Date;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  nationality: string;
  phone?: string;
  email?: string;
  address?: string;
  emergencyContact?: ISavedTravelerEmergencyContact;
  medicalNotes?: string;
  bloodGroup?: string;
  aadhaar?: ISavedTravelerAadhaar;
  voterId?: ISavedTravelerVoterId;
  drivingLicence?: ISavedTravelerDrivingLicence;
  passport?: ISavedTravelerPassport;
  photoUrl?: string;
  isArchived: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SavedTravelerSchema = new Schema<ISavedTraveler>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    relationship: {
      type: String,
      enum: ['self', 'spouse', 'child', 'parent', 'sibling', 'friend', 'other'],
      default: 'other',
      index: true,
    },
    fullName: { type: String, required: true, trim: true, maxlength: 100 },
    dob: { type: Date },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say'],
      default: 'male',
    },
    nationality: { type: String, default: 'Indian', trim: true },
    phone: { type: String, trim: true, default: '' },
    email: { type: String, trim: true, lowercase: true, default: '' },
    address: { type: String, trim: true, default: '' },
    emergencyContact: {
      name: { type: String, trim: true, default: '' },
      phone: { type: String, trim: true, default: '' },
      relationship: { type: String, trim: true, default: '' },
    },
    medicalNotes: { type: String, trim: true, default: '' },
    bloodGroup: { type: String, trim: true, default: '' },
    aadhaar: {
      number: { type: String, trim: true, default: '' },
      frontUrl: { type: String, default: '' },
      backUrl: { type: String, default: '' },
    },
    voterId: {
      number: { type: String, trim: true, default: '' },
      frontUrl: { type: String, default: '' },
    },
    drivingLicence: {
      number: { type: String, trim: true, default: '' },
      frontUrl: { type: String, default: '' },
      backUrl: { type: String, default: '' },
    },
    passport: {
      number: { type: String, trim: true, default: '' },
      expiryDate: { type: Date },
      documentUrl: { type: String, default: '' },
    },
    photoUrl: { type: String, default: '' },
    isArchived: { type: Boolean, default: false, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

SavedTravelerSchema.index({ userId: 1, isDeleted: 1, isArchived: 1 });

export const SavedTravelerModel =
  mongoose.models.SavedTraveler ||
  mongoose.model<ISavedTraveler>('SavedTraveler', SavedTravelerSchema, 'saved_travelers');
