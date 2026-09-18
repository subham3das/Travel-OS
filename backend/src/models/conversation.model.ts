import mongoose, { Document, Schema } from 'mongoose';
import './user.model.js';
import './booking.model.js';
import './agency.model.js';

export interface IConversation extends Document {
  agencyId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  bookingId?: mongoose.Types.ObjectId | null;
  tripId?: mongoose.Types.ObjectId | null;
  lastMessageId?: mongoose.Types.ObjectId | null;
  lastMessageAt: Date;
  lastMessagePreview: string;
  lastSender: 'agency' | 'customer';
  unreadAgencyCount: number;
  unreadCustomerCount: number;
  isArchived: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    agencyId: {
      type: Schema.Types.ObjectId,
      ref: 'Agency',
      required: true,
      index: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
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
      enum: ['agency', 'customer'],
      default: 'customer',
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
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for optimal sorting & tenant filtering
ConversationSchema.index({ agencyId: 1, isDeleted: 1, isArchived: 1, lastMessageAt: -1 });
ConversationSchema.index({ agencyId: 1, customerId: 1, bookingId: 1 });
ConversationSchema.index({ customerId: 1, isDeleted: 1, lastMessageAt: -1 });

export const ConversationModel =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>('Conversation', ConversationSchema, 'conversations');
