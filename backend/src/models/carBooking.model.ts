import mongoose, { Document, Schema } from 'mongoose';

export type CarBookingTripType = 'one_way' | 'round_trip' | 'hourly' | 'full_day' | 'multi_day';
export type CarPaymentType = 'full' | 'deposit';
export type CarPaymentStatus = 'PENDING' | 'DEPOSIT_PAID' | 'FULL_PAID' | 'REFUNDED';
export type CarBookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PENDING_PAYMENT'
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface ICarBooking extends Document {
  bookingId: string;
  carId: mongoose.Types.ObjectId;
  agencyId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  tripType: CarBookingTripType;
  routeId?: mongoose.Types.ObjectId;
  fixedPrice?: number;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  pickupLocation: string;
  dropLocation: string;
  pickupTime: string;
  passengersCount: number;
  specialNotes?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  dailyRate: number;
  baseAmount: number;
  taxesAmount: number;
  totalAmount: number;
  commissionRate?: number;
  commissionType?: 'PERCENTAGE' | 'FIXED';
  commissionAmount?: number;
  agencyReceivable?: number;
  netAmount?: number;
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
  paymentType: CarPaymentType;
  depositPaid: number;
  remainingAmount: number;
  paymentMethod: string;
  transactionId?: string;
  paymentStatus: CarPaymentStatus;
  bookingStatus: CarBookingStatus;
  conversationId?: mongoose.Types.ObjectId;
  rejectionReason?: string;
  completedAt?: Date;
  cancelledAt?: Date;
  driverId?: mongoose.Types.ObjectId;
  driverName?: string;
  driverPhone?: string;
  driverPhoto?: string;
  driverLicense?: string;
  vehicleNumber?: string;
  vehicleModel?: string;
  confirmedAt?: Date;
  confirmedBy?: mongoose.Types.ObjectId;
  serviceType?: 'ROUTE_BOOKING' | 'SELF_DRIVE_RENTAL' | 'driver_booking' | 'self_drive_car' | 'self_drive_bike';
  vehicleSubCategory?: 'car' | 'bike';
  pickupDateTime?: Date;
  returnDateTime?: Date;
  rentalDurationHours?: number;
  pricingTierApplied?: 'hourly' | 'daily' | 'weekly' | 'monthly';
  securityDeposit?: number;
  securityDepositStatus?: 'PENDING' | 'HELD' | 'REFUNDED' | 'PARTIALLY_REFUNDED' | 'DEDUCTED';
  securityDepositRefundId?: string;
  securityDepositDeductionAmount?: number;
  securityDepositDeductionReason?: string;
  odometerStart?: number;
  odometerEnd?: number;
  fuelStatusStart?: string;
  fuelStatusEnd?: string;
  lateFee?: number;
  damageFee?: number;
  damageNotes?: string;
  extraKmFee?: number;
  checkInAt?: Date;
  checkOutAt?: Date;
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
  address?: string;
  gender?: string;
  age?: number;
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

const CarBookingSchema = new Schema<ICarBooking>(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
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
    },
    tripType: {
      type: String,
      enum: ['one_way', 'round_trip', 'hourly', 'full_day', 'multi_day'],
      default: 'one_way',
      required: true,
    },
    routeId: {
      type: Schema.Types.ObjectId,
      index: true,
    },
    fixedPrice: { type: Number },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true },
    totalDays: { type: Number, required: true, min: 1 },
    pickupLocation: { type: String, required: true, trim: true },
    dropLocation: { type: String, required: true, trim: true },
    pickupTime: { type: String, default: '10:00 AM' },
    passengersCount: { type: Number, default: 4, min: 1 },
    specialNotes: { type: String, default: '', trim: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    dailyRate: { type: Number, required: true },
    baseAmount: { type: Number, required: true },
    taxesAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    commissionRate: { type: Number, default: 10 },
    commissionType: { type: String, enum: ['PERCENTAGE', 'FIXED'], default: 'PERCENTAGE' },
    commissionAmount: { type: Number, default: 0 },
    agencyReceivable: { type: Number, default: 0 },
    netAmount: { type: Number, default: 0 },
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
    paymentType: {
      type: String,
      enum: ['full', 'deposit'],
      default: 'deposit',
      required: true,
    },
    depositPaid: { type: Number, default: 0 },
    remainingAmount: { type: Number, default: 0 },
    paymentMethod: { type: String, default: 'upi' },
    transactionId: { type: String },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'DEPOSIT_PAID', 'FULL_PAID', 'REFUNDED'],
      default: 'PENDING',
      index: true,
    },
    bookingStatus: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'PENDING_PAYMENT', 'REQUESTED', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING',
      index: true,
    },
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      index: true,
    },
    rejectionReason: { type: String },
    completedAt: { type: Date },
    cancelledAt: { type: Date },
    driverId: {
      type: Schema.Types.ObjectId,
      ref: 'Driver',
      index: true,
    },
    driverName: { type: String, default: '' },
    driverPhone: { type: String, default: '' },
    driverPhoto: { type: String, default: '' },
    driverLicense: { type: String, default: '' },
    vehicleNumber: { type: String, default: '' },
    vehicleModel: { type: String, default: '' },
    confirmedAt: { type: Date },
    confirmedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Agency',
    },
    serviceType: {
      type: String,
      enum: ['ROUTE_BOOKING', 'SELF_DRIVE_RENTAL', 'driver_booking', 'self_drive_car', 'self_drive_bike'],
      default: 'ROUTE_BOOKING',
      index: true,
    },
    vehicleSubCategory: {
      type: String,
      enum: ['car', 'bike'],
      default: 'car',
      index: true,
    },
    pickupDateTime: { type: Date, index: true },
    returnDateTime: { type: Date, index: true },
    rentalDurationHours: { type: Number },
    pricingTierApplied: {
      type: String,
      enum: ['hourly', 'daily', 'weekly', 'monthly'],
    },
    securityDeposit: { type: Number, default: 0 },
    securityDepositStatus: {
      type: String,
      enum: ['PENDING', 'HELD', 'REFUNDED', 'PARTIALLY_REFUNDED', 'DEDUCTED'],
      default: 'PENDING',
      index: true,
    },
    securityDepositRefundId: { type: String },
    securityDepositDeductionAmount: { type: Number, default: 0 },
    securityDepositDeductionReason: { type: String },
    odometerStart: { type: Number },
    odometerEnd: { type: Number },
    fuelStatusStart: { type: String },
    fuelStatusEnd: { type: String },
    lateFee: { type: Number, default: 0 },
    damageFee: { type: Number, default: 0 },
    damageNotes: { type: String },
    extraKmFee: { type: Number, default: 0 },
    emergencyContact: {
      name: { type: String },
      phone: { type: String },
      relationship: { type: String },
    },
    address: { type: String },
    gender: { type: String },
    age: { type: Number },
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
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

CarBookingSchema.index({ customerId: 1, createdAt: -1 });
CarBookingSchema.index({ agencyId: 1, isDeleted: 1, createdAt: -1 });
CarBookingSchema.index({ agencyId: 1, bookingStatus: 1 });
CarBookingSchema.index({ carId: 1, bookingStatus: 1, startDate: 1, endDate: 1 });
CarBookingSchema.index({ serviceType: 1, bookingStatus: 1 });

export const CarBookingModel = mongoose.model<ICarBooking>('CarBooking', CarBookingSchema);
