import mongoose, { Document, Schema } from 'mongoose';

export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface ITravelProfileEmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface ITravelProfileAadhaar {
  number?: string;
  frontUrl?: string;
  backUrl?: string;
}

export interface ITravelProfileVoterId {
  number?: string;
  frontUrl?: string;
}

export interface ITravelProfileDrivingLicence {
  number?: string;
  frontUrl?: string;
  backUrl?: string;
}

export interface ITravelProfilePassport {
  number?: string;
  expiryDate?: Date;
  documentUrl?: string; // Photo / info page only
}

export interface ITravelProfilePreferences {
  seatPreference?: string;
  mealPreference?: string;
  specialAssistance?: string;
}

export interface ITravelProfile extends Document {
  userId: mongoose.Types.ObjectId;
  fullName: string;
  dob?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  nationality: string;
  phone: string;
  email: string;

  // Address
  address?: string;
  city?: string;
  state?: string;
  country: string;
  pin?: string;

  // Emergency Contact
  emergencyContact?: ITravelProfileEmergencyContact;

  // Medical Information
  bloodGroup?: string;
  medicalConditions?: string;
  allergies?: string;

  // Identity Documents (Cloudinary URLs)
  aadhaar?: ITravelProfileAadhaar;
  voterId?: ITravelProfileVoterId;
  drivingLicence?: ITravelProfileDrivingLicence;
  passport?: ITravelProfilePassport;

  // Travel Preferences
  travelPreferences?: ITravelProfilePreferences;

  // Status & Completion
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  completionPercentage: number;
  missingFields: string[];

  createdAt: Date;
  updatedAt: Date;
}

const TravelProfileSchema = new Schema<ITravelProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    fullName: { type: String, required: true, trim: true },
    dob: { type: Date },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say'],
      default: 'male',
    },
    nationality: { type: String, default: 'Indian', trim: true },
    phone: { type: String, default: '', trim: true },
    email: { type: String, default: '', trim: true, lowercase: true },

    address: { type: String, default: '', trim: true },
    city: { type: String, default: '', trim: true },
    state: { type: String, default: '', trim: true },
    country: { type: String, default: 'India', trim: true },
    pin: { type: String, default: '', trim: true },

    emergencyContact: {
      name: { type: String, default: '', trim: true },
      phone: { type: String, default: '', trim: true },
      relationship: { type: String, default: '', trim: true },
    },

    bloodGroup: { type: String, default: '', trim: true },
    medicalConditions: { type: String, default: '', trim: true },
    allergies: { type: String, default: '', trim: true },

    aadhaar: {
      number: { type: String, default: '', trim: true },
      frontUrl: { type: String, default: '' },
      backUrl: { type: String, default: '' },
    },
    voterId: {
      number: { type: String, default: '', trim: true },
      frontUrl: { type: String, default: '' },
    },
    drivingLicence: {
      number: { type: String, default: '', trim: true },
      frontUrl: { type: String, default: '' },
      backUrl: { type: String, default: '' },
    },
    passport: {
      number: { type: String, default: '', trim: true },
      expiryDate: { type: Date },
      documentUrl: { type: String, default: '' },
    },

    travelPreferences: {
      seatPreference: { type: String, default: 'Any' },
      mealPreference: { type: String, default: 'Standard' },
      specialAssistance: { type: String, default: '' },
    },

    verificationStatus: {
      type: String,
      enum: ['UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED'],
      default: 'UNVERIFIED',
    },
    rejectionReason: { type: String, default: '', trim: true },
    completionPercentage: { type: Number, default: 40 },
    missingFields: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

/**
 * Helper to compute travel profile completion percentage and missing fields
 */
export function computeProfileCompletion(profile: Partial<ITravelProfile>): {
  completionPercentage: number;
  missingFields: string[];
} {
  const missing: string[] = [];
  let score = 0;
  const totalWeight = 100;

  // 1. Basic Identity (30 pts)
  if (profile.fullName && profile.fullName.trim().length >= 2) {
    score += 10;
  } else {
    missing.push('Full Name');
  }

  if (profile.dob) {
    score += 5;
  } else {
    missing.push('Date of Birth');
  }

  if (profile.gender) {
    score += 5;
  } else {
    missing.push('Gender');
  }

  if (profile.phone && profile.phone.trim().length >= 7) {
    score += 5;
  } else {
    missing.push('Phone');
  }

  if (profile.email && profile.email.includes('@')) {
    score += 5;
  } else {
    missing.push('Email');
  }

  // 2. Address (15 pts)
  if (profile.address && profile.city && profile.pin) {
    score += 15;
  } else {
    missing.push('Address & PIN');
  }

  // 3. Emergency Contact (20 pts)
  if (
    profile.emergencyContact?.name &&
    profile.emergencyContact?.phone &&
    profile.emergencyContact.phone.trim().length >= 7
  ) {
    score += 20;
  } else {
    missing.push('Emergency Contact');
  }

  // 4. Medical Info (15 pts)
  if (profile.bloodGroup) {
    score += 15;
  } else {
    missing.push('Medical Info / Blood Group');
  }

  // 5. Identity Documents (20 pts) - Required Primary Government ID: Aadhaar (Front & Back) OR Voter ID (Front)
  const hasAadhaar = Boolean(profile.aadhaar?.frontUrl && profile.aadhaar?.backUrl);
  const hasVoterId = Boolean(profile.voterId?.frontUrl);
  if (hasAadhaar || hasVoterId) {
    score += 20;
  } else {
    missing.push('Primary Government ID (Aadhaar Front & Back OR Voter ID)');
  }

  return {
    completionPercentage: Math.min(totalWeight, Math.max(score, 0)),
    missingFields: missing,
  };
}

TravelProfileSchema.pre('save', function () {
  const { completionPercentage, missingFields } = computeProfileCompletion(this);
  this.completionPercentage = completionPercentage;
  this.missingFields = missingFields;
});

export const TravelProfileModel =
  mongoose.models.TravelProfile ||
  mongoose.model<ITravelProfile>('TravelProfile', TravelProfileSchema, 'travel_profiles');
