import mongoose, { Document, Schema } from 'mongoose';

export interface ICarReview extends Document {
  carId: mongoose.Types.ObjectId;
  bookingId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  comment: string;
  photos: string[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CarReviewSchema = new Schema<ICarReview>(
  {
    carId: {
      type: Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'CarBooking',
      required: true,
      unique: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    customerName: { type: String, required: true },
    customerAvatar: { type: String, default: '' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    photos: [{ type: String }],
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

CarReviewSchema.index({ carId: 1, createdAt: -1 });

export const CarReviewModel = mongoose.model<ICarReview>('CarReview', CarReviewSchema);
