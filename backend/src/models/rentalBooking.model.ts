import mongoose, { Document, Schema } from 'mongoose';

export type RentalType = 'hourly' | 'daily' | 'weekly' | 'monthly';
export type RentalPaymentType = 'full' | 'deposit';
export type RentalPaymentStatus = 'PENDING' | 'DEPOSIT_PAID' | 'FULL_PAID' | 'REFUNDED';
export type RentalBookingStatus =
  | 'AVAILABLE'
  | 'BOOKED'
  | 'READY_FOR_PICKUP'
  | 'ACTIVE'
  | 'RETURN_PENDING'
  | 'COMPLETED'
  | 'CANCELLED';

export interface IRentalBooking extends Document {
  bookingId: string;
  carId: mongoose.Types.ObjectId;
  agencyId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  rentalType: RentalType;
  durationValue: number;
  startDate: Date;
  endDate: Date;
  pickupLocation: string;
  returnLocation?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialNotes?: string;
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
  address?: string;
  gender?: string;
  age?: number;
  rateApplied: number;
  baseAmount: number;
  taxesAmount: number;
  securityDeposit?: number;
  totalAmount: number;
  paymentType: RentalPaymentType;
  depositPaid: number;
  remainingAmount: number;
  paymentMethod?: string;
  paymentStatus: RentalPaymentStatus;
  status?: string;
  bookingStatus: RentalBookingStatus;
  bookingConfirmationCode?: string; // 6-digit pickup verification code
  pickupCode?: string; // 6-digit pickup verification code
  returnCode?: string; // 6-digit return verification code
  transactionId?: string;
  confirmedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancelledBy?: string;
  cancellationReason?: string;
  timeline?: Array<{
    id: string;
    title: string;
    subtitle?: string;
    timestamp?: string;
    status: 'completed' | 'current' | 'upcoming';
    iconType?: string;
  }>;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RentalBookingSchema = new Schema<IRentalBooking>(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    carId: {
      type: Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
      index: true,
    },
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
    rentalType: {
      type: String,
      enum: ['hourly', 'daily', 'weekly', 'monthly'],
      required: true,
      default: 'daily',
    },
    durationValue: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    pickupLocation: {
      type: String,
      required: true,
      trim: true,
    },
    returnLocation: {
      type: String,
      trim: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    customerPhone: {
      type: String,
      required: true,
      trim: true,
    },
    specialNotes: {
      type: String,
      trim: true,
    },
    emergencyContact: {
      name: { type: String, trim: true },
      phone: { type: String, trim: true },
      relationship: { type: String, trim: true },
    },
    address: { type: String, trim: true },
    gender: { type: String, trim: true },
    age: { type: Number },
    rateApplied: {
      type: Number,
      required: true,
      min: 0,
    },
    baseAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    taxesAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    securityDeposit: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentType: {
      type: String,
      enum: ['full', 'deposit'],
      default: 'full',
    },
    depositPaid: {
      type: Number,
      default: 0,
      min: 0,
    },
    remainingAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    paymentMethod: {
      type: String,
      default: 'Razorpay Checkout',
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'DEPOSIT_PAID', 'FULL_PAID', 'REFUNDED'],
      default: 'PENDING',
      index: true,
    },
    status: {
      type: String,
      default: 'BOOKED',
      index: true,
    },
    bookingStatus: {
      type: String,
      enum: [
        'AVAILABLE',
        'BOOKED',
        'READY_FOR_PICKUP',
        'ACTIVE',
        'RETURN_PENDING',
        'COMPLETED',
        'CANCELLED',
      ],
      default: 'BOOKED',
      index: true,
    },
    bookingConfirmationCode: {
      type: String,
      trim: true,
      index: true,
    },
    pickupCode: {
      type: String,
      trim: true,
      index: true,
    },
    returnCode: {
      type: String,
      trim: true,
      index: true,
    },
    transactionId: {
      type: String,
      trim: true,
    },
    confirmedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
    cancelledBy: {
      type: String,
      trim: true,
      default: null,
    },
    cancellationReason: {
      type: String,
      trim: true,
    },
    timeline: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        subtitle: { type: String },
        timestamp: { type: String },
        status: { type: String, enum: ['completed', 'current', 'upcoming'], default: 'upcoming' },
        iconType: { type: String },
      },
    ],
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

RentalBookingSchema.pre('save', function () {
  if (this.bookingStatus) {
    this.status = this.bookingStatus;
  } else if (this.status) {
    this.bookingStatus = this.status as any;
  }
});

RentalBookingSchema.index({ customerId: 1, createdAt: -1 });
RentalBookingSchema.index({ agencyId: 1, createdAt: -1 });
RentalBookingSchema.index({ carId: 1, startDate: 1, endDate: 1 });

export const RentalBookingModel = mongoose.model<IRentalBooking>(
  'RentalBooking',
  RentalBookingSchema
);
