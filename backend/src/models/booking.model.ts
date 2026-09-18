import mongoose, { Document, Schema } from 'mongoose';

export type BookingStatus = 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED';
export type BookingPaymentStatus = 'PAID' | 'PARTIAL' | 'PENDING' | 'REFUNDED';

export interface IBookingTraveler {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  passportNumber?: string;
  phone?: string;
  email?: string;
  isPrimary?: boolean;
}

export interface IBookingActivity {
  id: string;
  actor: string;
  role: 'Super Admin' | 'Agency' | 'Traveler' | 'System';
  action: string;
  details: string;
  timestamp: string;
}

export interface IBookingTimelineStep {
  id: string;
  title: string;
  subtitle?: string;
  timestamp?: string;
  status: 'completed' | 'current' | 'upcoming';
  iconType?: string;
}

export interface IBooking extends Document {
  bookingId: string;
  userId?: mongoose.Types.ObjectId;
  agencyId?: mongoose.Types.ObjectId;
  packageId?: mongoose.Types.ObjectId;
  packageName: string;
  packageThumbnail?: string;
  agencyName: string;
  agencyLogo?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAvatar?: string;
  travelersCount: number;
  totalAmount: number;
  basePrice?: number;
  taxesAndFees?: number;
  platformFee?: number;
  discountAmount?: number;
  discountCode?: string;
  insuranceFee?: number;
  grandTotal?: number;
  paidAmount: number;
  paymentMethod?: string;
  transactionId?: string;
  bookingSource?: string;
  status: BookingStatus;
  paymentStatus: BookingPaymentStatus;
  destination: string;
  destinationCountry?: string;
  destinationRegion?: string;
  durationText?: string;
  tripStartDate: Date;
  tripEndDate: Date;
  travelers?: IBookingTraveler[];
  activities?: IBookingActivity[];
  timeline?: IBookingTimelineStep[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    bookingId: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', index: true },
    packageId: { type: Schema.Types.ObjectId, ref: 'Package' },
    packageName: { type: String, required: true },
    packageThumbnail: { type: String, default: '' },
    agencyName: { type: String, required: true },
    agencyLogo: { type: String, default: '' },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true, lowercase: true },
    customerPhone: { type: String, required: true },
    customerAvatar: { type: String, default: '' },
    travelersCount: { type: Number, default: 1 },
    totalAmount: { type: Number, required: true },
    basePrice: { type: Number, default: 0 },
    taxesAndFees: { type: Number, default: 0 },
    platformFee: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    discountCode: { type: String, default: '' },
    insuranceFee: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    paymentMethod: { type: String, default: 'Credit Card' },
    transactionId: { type: String, default: '' },
    bookingSource: { type: String, default: 'Web' },
    status: {
      type: String,
      enum: ['CONFIRMED', 'PENDING', 'CANCELLED', 'COMPLETED'],
      default: 'CONFIRMED',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['PAID', 'PARTIAL', 'PENDING', 'REFUNDED'],
      default: 'PAID',
      index: true,
    },
    destination: { type: String, required: true },
    destinationCountry: { type: String, default: '' },
    destinationRegion: { type: String, default: '' },
    durationText: { type: String, default: '3D / 2N' },
    tripStartDate: { type: Date, required: true, index: true },
    tripEndDate: { type: Date, required: true, index: true },
    travelers: [
      {
        id: { type: String },
        name: { type: String, required: true },
        age: { type: Number, default: 30 },
        gender: { type: String, default: 'Male' },
        passportNumber: { type: String, default: '' },
        phone: { type: String, default: '' },
        email: { type: String, default: '' },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    activities: [
      {
        id: { type: String },
        actor: { type: String },
        role: { type: String },
        action: { type: String },
        details: { type: String },
        timestamp: { type: String },
      },
    ],
    timeline: [
      {
        id: { type: String },
        title: { type: String },
        subtitle: { type: String },
        timestamp: { type: String },
        status: { type: String },
        iconType: { type: String },
      },
    ],
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

BookingSchema.index({ createdAt: -1 });
BookingSchema.index({ status: 1, paymentStatus: 1, isDeleted: 1 });
BookingSchema.index({ agencyId: 1, isDeleted: 1, createdAt: -1 });
BookingSchema.index({ userId: 1, isDeleted: 1, createdAt: -1 });
BookingSchema.index({ agencyId: 1, tripStartDate: 1, status: 1 });

export const BookingModel =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema, 'bookings');

