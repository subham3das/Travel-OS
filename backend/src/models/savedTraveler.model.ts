import mongoose, { Schema, Document } from 'mongoose';

export interface ISavedTraveler extends Document {
  userId: mongoose.Types.ObjectId;
  fullName: string;
  dob: Date;
  gender: 'male' | 'female' | 'other';
  relationship: 'self' | 'spouse' | 'child' | 'parent' | 'sibling' | 'friend' | 'other';
  nationality: string;
  passportNumber?: string;
  aadhaarNumber?: string;
  panNumber?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SavedTravelerSchema = new Schema<ISavedTraveler>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    fullName: { type: String, required: true, trim: true, maxlength: 100 },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    relationship: {
      type: String,
      enum: ['self', 'spouse', 'child', 'parent', 'sibling', 'friend', 'other'],
      default: 'other',
    },
    nationality: { type: String, default: 'Indian' },
    passportNumber: { type: String, trim: true },
    aadhaarNumber: { type: String, trim: true },
    panNumber: { type: String, trim: true },
    emergencyContact: {
      name: { type: String, trim: true },
      phone: { type: String, trim: true },
      relationship: { type: String, trim: true },
    },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

export const SavedTravelerModel = mongoose.model<ISavedTraveler>('SavedTraveler', SavedTravelerSchema);
