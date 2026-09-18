import mongoose, { Document, Schema } from 'mongoose';

export interface IAgencyPrivateNote extends Document {
  agencyId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  bookingId?: mongoose.Types.ObjectId | null;
  authorAdmin: {
    id: mongoose.Types.ObjectId;
    name: string;
    email?: string;
  };
  note: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AgencyPrivateNoteSchema = new Schema<IAgencyPrivateNote>(
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
    authorAdmin: {
      id: { type: Schema.Types.ObjectId, required: true },
      name: { type: String, required: true },
      email: { type: String, default: '' },
    },
    note: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
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

AgencyPrivateNoteSchema.index({ agencyId: 1, customerId: 1, isDeleted: 1, createdAt: -1 });

export const AgencyPrivateNoteModel =
  mongoose.models.AgencyPrivateNote ||
  mongoose.model<IAgencyPrivateNote>(
    'AgencyPrivateNote',
    AgencyPrivateNoteSchema,
    'agency_private_notes'
  );
