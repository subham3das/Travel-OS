import mongoose, { Schema, Document } from 'mongoose';

export interface ITravelPreferences {
  travelInterests: string[];
  travelStyle: string[];
  budgetPreference: string;
  preferredTripDuration: string[];
  preferredTransportation: string[];
  foodPreference: string;
  accessibilityRequirements?: string;
}

export interface INotificationPreferences {
  pushNotifications: boolean;
  emailNotifications: boolean;
  bookingUpdates: boolean;
  tripReminders: boolean;
  travelRecommendations: boolean;
  offersAndDiscounts: boolean;
  communityActivity: boolean;
  friendRequests: boolean;
  messages: boolean;
  marketingEmails: boolean;
}

export interface IPrivacySettings {
  publicProfile: boolean;
  showBio: boolean;
  showHomeCity: boolean;
  showTravelStats: boolean;
  allowMessages: boolean;
  allowFollowers: boolean;
  appearInSearch: boolean;
  showOnlineStatus: boolean;
}

export interface IUser extends Document {
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  avatar?: string;
  username?: string;
  bio?: string;
  homeCity?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  preferredLanguage?: string;
  country?: string;

  // Account State & Verification
  status: 'Active' | 'Suspended' | 'Disabled' | 'Pending';
  isEmailVerified: boolean;
  emailVerifiedAt?: Date;

  // OAuth Provider Integration
  authProvider: 'local' | 'google';
  googleId?: string;
  profileImage?: string;
  profileImagePublicId?: string;
  coverImage?: string;
  coverImagePublicId?: string;

  // Onboarding Step Flags
  profileCompleted: boolean;
  profileCompletedAt?: Date;
  preferenceCompleted: boolean;
  preferenceCompletedAt?: Date;
  notificationsCompleted: boolean;
  privacyCompleted: boolean;
  onboardingCompleted: boolean;
  onboardingCompletedAt?: Date;

  // Nested Preferences
  travelPreferences: ITravelPreferences;
  notificationPreferences: INotificationPreferences;
  privacySettings: IPrivacySettings;

  lastLogin?: Date;

  // Soft Delete & Timestamps
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    phone: { type: String, sparse: true, trim: true, index: true },
    password: { type: String, select: false },
    avatar: { type: String, default: '' },
    username: { type: String, unique: true, sparse: true, trim: true, lowercase: true, maxlength: 30 },
    bio: { type: String, trim: true, maxlength: 500, default: '' },
    homeCity: { type: String, trim: true, default: '' },
    dateOfBirth: { type: Date },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say'],
      default: 'prefer_not_to_say',
    },
    preferredLanguage: { type: String, default: 'English' },
    country: { type: String, default: 'India' },

    status: {
      type: String,
      enum: ['Active', 'Suspended', 'Disabled', 'Pending'],
      default: 'Active',
      index: true,
    },
    isEmailVerified: { type: Boolean, default: false },
    emailVerifiedAt: { type: Date },

    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
    googleId: { type: String, sparse: true },
    profileImage: { type: String },
    profileImagePublicId: { type: String },
    coverImage: { type: String },
    coverImagePublicId: { type: String },

    profileCompleted: { type: Boolean, default: false },
    profileCompletedAt: { type: Date },
    preferenceCompleted: { type: Boolean, default: false },
    preferenceCompletedAt: { type: Date },
    notificationsCompleted: { type: Boolean, default: false },
    privacyCompleted: { type: Boolean, default: false },
    onboardingCompleted: { type: Boolean, default: false },
    onboardingCompletedAt: { type: Date },
    lastLogin: { type: Date },

    travelPreferences: {
      travelInterests: { type: [String], default: [] },
      travelStyle: { type: [String], default: [] },
      budgetPreference: { type: String, default: 'Mid Range' },
      preferredTripDuration: { type: [String], default: [] },
      preferredTransportation: { type: [String], default: [] },
      foodPreference: { type: String, default: 'Non-Veg' },
      accessibilityRequirements: { type: String, default: '' },
    },

    notificationPreferences: {
      pushNotifications: { type: Boolean, default: true },
      emailNotifications: { type: Boolean, default: true },
      bookingUpdates: { type: Boolean, default: true },
      tripReminders: { type: Boolean, default: true },
      travelRecommendations: { type: Boolean, default: true },
      offersAndDiscounts: { type: Boolean, default: true },
      communityActivity: { type: Boolean, default: true },
      friendRequests: { type: Boolean, default: true },
      messages: { type: Boolean, default: true },
      marketingEmails: { type: Boolean, default: false },
    },

    privacySettings: {
      publicProfile: { type: Boolean, default: true },
      showBio: { type: Boolean, default: true },
      showHomeCity: { type: Boolean, default: true },
      showTravelStats: { type: Boolean, default: true },
      allowMessages: { type: Boolean, default: true },
      allowFollowers: { type: Boolean, default: true },
      appearInSearch: { type: Boolean, default: true },
      showOnlineStatus: { type: Boolean, default: true },
    },

    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: any) => {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound indexes
UserSchema.index({ status: 1, isDeleted: 1 });
UserSchema.index({ createdAt: -1 });

export const UserModel = mongoose.model<IUser>('User', UserSchema);
