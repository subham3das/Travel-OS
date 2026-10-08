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
  departureId?: mongoose.Types.ObjectId;
  travelerIds?: mongoose.Types.ObjectId[];
  paymentId?: mongoose.Types.ObjectId;
  packageName: string;
  packageThumbnail?: string;
  agencyName: string;
  agencyLogo?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAvatar?: string;
  bookingType?: 'Solo' | 'Couple' | 'Group';
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
  address?: string;
  medicalNotes?: string;
  pickupPreference?: string;
  documents?: Array<{
    id?: string;
    title: string;
    url: string;
    status?: string;
  }>;
  travelersCount: number;
  totalAmount: number;
  basePrice?: number;
  taxesAndFees?: number;
  platformFee?: number;
  commissionRate?: number;
  commissionType?: 'PERCENTAGE' | 'FIXED';
  commissionAmount?: number;
  agencyReceivable?: number;
  netAmount?: number;
  discountAmount?: number;
  discountCode?: string;
  insuranceFee?: number;
  grandTotal?: number;
  paidAmount: number;
  paymentMethod?: string;
  transactionId?: string;
  transferId?: string;
  settlementId?: string;
  financialSnapshot?: {
    bookingAmount: number;
    discount?: number;
    taxes?: number;
    gatewayFee?: number;
    platformCommissionRate: number;
    platformCommissionType: 'PERCENTAGE' | 'FIXED';
    platformCommissionAmount: number;
    agencyReceivable: number;
    netAmount: number;
    gateway: string;
    paymentId?: string;
    orderId?: string;
    transferId?: string;
    settlementId?: string;
    transferStatus?: string;
    settlementStatus?: string;
    createdAt?: Date;
    paidAt?: Date;
  };
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
  isFinancialLocked?: boolean;
  financialLockedAt?: Date;
  financialLockReason?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    bookingId: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    agencyId: { type: Schema.Types.ObjectId, ref: 'Agency' },
    packageId: { type: Schema.Types.ObjectId, ref: 'Package' },
    departureId: { type: Schema.Types.ObjectId, ref: 'Departure', index: true },
    travelerIds: [{ type: Schema.Types.ObjectId, ref: 'SavedTraveler', index: true }],
    paymentId: { type: Schema.Types.ObjectId, ref: 'Payment', index: true },
    packageName: { type: String, required: true },
    packageThumbnail: { type: String, default: '' },
    agencyName: { type: String, required: true },
    agencyLogo: { type: String, default: '' },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true, lowercase: true },
    customerPhone: { type: String, required: true },
    customerAvatar: { type: String, default: '' },
    bookingType: { type: String, enum: ['Solo', 'Couple', 'Group'], default: 'Solo' },
    emergencyContact: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
      relationship: { type: String, default: '' },
    },
    address: { type: String, default: '' },
    medicalNotes: { type: String, default: '' },
    pickupPreference: { type: String, default: '' },
    documents: [
      {
        id: { type: String },
        title: { type: String, default: '' },
        url: { type: String, default: '' },
        status: { type: String, default: 'Uploaded' },
      },
    ],
    travelersCount: { type: Number, default: 1 },
    totalAmount: { type: Number, required: true },
    basePrice: { type: Number, default: 0 },
    taxesAndFees: { type: Number, default: 0 },
    platformFee: { type: Number, default: 0 },
    commissionRate: { type: Number, default: 10 },
    commissionType: { type: String, enum: ['PERCENTAGE', 'FIXED'], default: 'PERCENTAGE' },
    commissionAmount: { type: Number, default: 0 },
    agencyReceivable: { type: Number, default: 0 },
    netAmount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    discountCode: { type: String, default: '' },
    insuranceFee: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    paymentMethod: { type: String, default: 'Credit Card' },
    transactionId: { type: String, default: '' },
    transferId: { type: String, default: '' },
    settlementId: { type: String, default: '' },
    financialSnapshot: {
      bookingAmount: { type: Number },
      discount: { type: Number, default: 0 },
      taxes: { type: Number, default: 0 },
      gatewayFee: { type: Number, default: 0 },
      platformCommissionRate: { type: Number },
      platformCommissionType: { type: String, enum: ['PERCENTAGE', 'FIXED'], default: 'PERCENTAGE' },
      platformCommissionAmount: { type: Number },
      agencyReceivable: { type: Number },
      netAmount: { type: Number },
      gateway: { type: String, default: 'Razorpay' },
      paymentId: { type: String },
      orderId: { type: String },
      transferId: { type: String },
      settlementId: { type: String },
      transferStatus: { type: String },
      settlementStatus: { type: String },
      createdAt: { type: Date },
      paidAt: { type: Date },
    },
    bookingSource: { type: String, default: 'Web' },
    status: {
      type: String,
      enum: ['CONFIRMED', 'PENDING', 'CANCELLED', 'COMPLETED'],
      default: 'CONFIRMED',
    },
    paymentStatus: {
      type: String,
      enum: ['PAID', 'PARTIAL', 'PENDING', 'REFUNDED'],
      default: 'PAID',
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
    isFinancialLocked: { type: Boolean, default: false, index: true },
    financialLockedAt: { type: Date },
    financialLockReason: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Phase 4: Financial Immutability Guard
BookingSchema.pre('save', function () {
  if (this.isFinancialLocked && !this.isNew) {
    if (
      this.isModified('totalAmount') ||
      this.isModified('basePrice') ||
      this.isModified('commissionAmount') ||
      this.isModified('agencyReceivable') ||
      this.isModified('financialSnapshot')
    ) {
      throw new Error(
        'FinancialLockError: Booking financial snapshot is locked after settlement. Direct edits are strictly prohibited. Use adjustment ledger or refund instead.'
      );
    }
  }
});

BookingSchema.index({ createdAt: -1 });
BookingSchema.index({ status: 1, paymentStatus: 1, isDeleted: 1 });
BookingSchema.index({ agencyId: 1, isDeleted: 1, createdAt: -1 });
BookingSchema.index({ userId: 1, isDeleted: 1, createdAt: -1 });
BookingSchema.index({ agencyId: 1, tripStartDate: 1, status: 1 });

export const BookingModel =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema, 'bookings');

