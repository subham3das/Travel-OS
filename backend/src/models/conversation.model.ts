import mongoose, { Document, Schema } from 'mongoose';
import './user.model.js';
import './booking.model.js';
import './carBooking.model.js';
import './car.model.js';
import './agency.model.js';

export interface IConversation extends Document {
  agencyId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  bookingId?: mongoose.Types.ObjectId | null;
  carBookingId?: mongoose.Types.ObjectId | null;
  carId?: mongoose.Types.ObjectId | null;
  tripId?: mongoose.Types.ObjectId | null;
  lastMessageId?: mongoose.Types.ObjectId | null;
  lastMessageAt: Date;
  lastMessagePreview: string;
  lastSender: 'agency' | 'customer' | 'car_rental';
  unreadAgencyCount: number;
  unreadCustomerCount: number;
  isArchived: boolean;
  isDeleted: boolean;
  /** Categorizer: 'PACKAGE' (default) | 'CAR_RENTAL' — isolates booking contexts completely */
  conversationType: 'PACKAGE' | 'CAR_RENTAL';
  /** Discriminator: 'agency' (default) | 'car_rental' — mirrors conversationType */
  businessType: 'agency' | 'car_rental';
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    agencyId: {
      type: Schema.Types.ObjectId,
      ref: 'Agency',
      required: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      default: null,
      index: true,
    },
    carBookingId: {
      type: Schema.Types.ObjectId,
      ref: 'CarBooking',
      default: null,
      index: true,
    },
    carId: {
      type: Schema.Types.ObjectId,
      ref: 'Car',
      default: null,
      index: true,
    },
    tripId: {
      type: Schema.Types.ObjectId,
      ref: 'Trip',
      default: null,
      index: true,
    },
    lastMessageId: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    lastMessagePreview: {
      type: String,
      default: '',
      trim: true,
      maxlength: 500,
    },
    lastSender: {
      type: String,
      enum: ['agency', 'customer', 'car_rental'],
      default: 'customer',
    },
    conversationType: {
      type: String,
      enum: ['PACKAGE', 'CAR_RENTAL'],
      default: 'PACKAGE',
      index: true,
    },
    businessType: {
      type: String,
      enum: ['agency', 'car_rental'],
      default: 'agency',
      index: true,
    },
    unreadAgencyCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    unreadCustomerCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for optimal sorting & tenant filtering
ConversationSchema.index({ agencyId: 1, isDeleted: 1, isArchived: 1, lastMessageAt: -1 });
ConversationSchema.index({ agencyId: 1, customerId: 1, conversationType: 1 });
ConversationSchema.index({ customerId: 1, conversationType: 1, isDeleted: 1, lastMessageAt: -1 });
ConversationSchema.index({ customerId: 1, isDeleted: 1, lastMessageAt: -1 });
// Car Rental isolation indexes
ConversationSchema.index({ agencyId: 1, businessType: 1, isDeleted: 1, lastMessageAt: -1 });
ConversationSchema.index({ agencyId: 1, conversationType: 1, isDeleted: 1, lastMessageAt: -1 });
ConversationSchema.index({ carBookingId: 1 });

export const ConversationModel =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>('Conversation', ConversationSchema, 'conversations');
