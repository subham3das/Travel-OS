import mongoose, { Document, Schema } from 'mongoose';

export type ReviewModerationStatus = 'Approved' | 'Pending' | 'Reported' | 'Removed';

export interface IReview extends Document {
  reviewId: string;
  userId?: mongoose.Types.ObjectId;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  agencyId?: mongoose.Types.ObjectId;
  agencyName: string;
  agencyLogo?: string;
  packageId?: mongoose.Types.ObjectId;
  packageName: string;
  bookingId?: string;
  rating: number;
  reviewText: string;
  images: string[];
  status: ReviewModerationStatus;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  spamScore: number;
  helpfulCount: number;
  agencyReply?: {
    text: string;
    repliedAt: Date;
    authorName: string;
  };
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    reviewId: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    userName: { type: String, required: true },
    userEmail: { type: String, default: 'traveler@email.com' },
    userAvatar: { type: String, default: '' },
    agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', index: true },
    agencyName: { type: String, required: true },
    agencyLogo: { type: String, default: '' },
    packageId: { type: Schema.Types.ObjectId, ref: 'Package' },
    packageName: { type: String, required: true },
    bookingId: { type: String, default: 'BK-10455' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    reviewText: { type: String, required: true },
    images: [{ type: String }],
    status: {
      type: String,
      enum: ['Approved', 'Pending', 'Reported', 'Removed'],
      default: 'Approved',
      index: true,
    },
    sentiment: {
      type: String,
      enum: ['Positive', 'Neutral', 'Negative'],
      default: 'Positive',
      index: true,
    },
    spamScore: { type: Number, default: 5 },
    helpfulCount: { type: Number, default: 0 },
    agencyReply: {
      text: { type: String },
      repliedAt: { type: Date },
      authorName: { type: String },
    },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

ReviewSchema.index({ createdAt: -1 });
ReviewSchema.index({ rating: 1, status: 1 });
ReviewSchema.index({ agencyId: 1, isDeleted: 1, createdAt: -1 });
ReviewSchema.index({ packageId: 1, status: 1, isDeleted: 1 });

export const ReviewModel =
  mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema, 'reviews');

