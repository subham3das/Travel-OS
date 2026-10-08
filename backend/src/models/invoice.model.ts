import mongoose, { Schema, Document } from 'mongoose';

export type InvoiceStatus = 'paid' | 'void' | 'refunded';

export interface IInvoice extends Document {
  invoiceNumber: string;
  businessType: 'agency' | 'car_rental' | 'customer';
  partnerName: string;
  userEmail: string;
  userPhone: string;
  bookingId?: string;
  subscriptionId?: mongoose.Types.ObjectId;
  paymentId: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  currency: string;
  status: InvoiceStatus;
  pdfUrl?: string;
  issuedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    businessType: {
      type: String,
      enum: ['agency', 'car_rental', 'customer'],
      required: true,
      default: 'agency',
    },
    partnerName: {
      type: String,
      required: true,
      trim: true,
    },
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    userPhone: {
      type: String,
      required: true,
      trim: true,
    },
    bookingId: {
      type: String,
      index: true,
      default: null,
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'PartnerSubscription',
      default: null,
      index: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['paid', 'void', 'refunded'],
      default: 'paid',
    },
    pdfUrl: {
      type: String,
      default: null,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const InvoiceModel = mongoose.model<IInvoice>('Invoice', InvoiceSchema);
