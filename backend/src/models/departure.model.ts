import mongoose, { Document, Schema } from 'mongoose';

export type DepartureStatus =
  | 'OPEN'
  | 'UPCOMING'
  | 'SOLDOUT'
  | 'BOOKING_CLOSED'
  | 'ONGOING'
  | 'COMPLETED';

export interface IDeparture extends Document {
  departureId: string;
  packageId: mongoose.Types.ObjectId | string;
  agencyId: mongoose.Types.ObjectId;
  departureDate: Date;
  endDate: Date;
  bookingOpens: Date;
  bookingCloses: Date;
  capacity: number;
  bookedSeats: number;
  priceOverride?: number;
  status: DepartureStatus;
  isManualClosed: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export function computeDepartureStatus(dep: {
  status?: DepartureStatus;
  isManualClosed?: boolean;
  departureDate: Date;
  endDate: Date;
  bookingCloses: Date;
  capacity: number;
  bookedSeats: number;
}): DepartureStatus {
  // If explicitly completed or past trip end date -> COMPLETED
  if (dep.status === 'COMPLETED') return 'COMPLETED';
  const now = new Date();
  if (now > new Date(dep.endDate)) return 'COMPLETED';

  // If ongoing (trip started by agency or departure date arrived) -> ONGOING
  if (dep.status === 'ONGOING' || now >= new Date(dep.departureDate)) return 'ONGOING';

  // If manual closed or booking deadline arrived -> BOOKING_CLOSED
  if (dep.isManualClosed || dep.status === 'BOOKING_CLOSED' || now >= new Date(dep.bookingCloses)) return 'BOOKING_CLOSED';

  // If fully booked -> SOLDOUT
  if (dep.bookedSeats >= dep.capacity) return 'SOLDOUT';

  return 'OPEN';
}

const DepartureSchema = new Schema<IDeparture>(
  {
    departureId: { type: String, required: true, unique: true },
    packageId: { type: Schema.Types.Mixed, ref: 'Package', required: true, index: true },
    agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true, index: true },
    departureDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true },
    bookingOpens: { type: Date, default: Date.now },
    bookingCloses: { type: Date, required: true },
    capacity: { type: Number, required: true, min: 1, default: 20 },
    bookedSeats: { type: Number, required: true, default: 0, min: 0 },
    priceOverride: { type: Number },
    status: {
      type: String,
      enum: ['OPEN', 'SOLDOUT', 'BOOKING_CLOSED', 'ONGOING', 'COMPLETED'],
      default: 'OPEN',
      index: true,
    },
    isManualClosed: { type: Boolean, default: false },
    notes: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

DepartureSchema.index({ agencyId: 1, departureDate: 1 });
DepartureSchema.index({ packageId: 1, departureDate: 1 });
DepartureSchema.index({ agencyId: 1, packageId: 1, departureDate: 1 }, { unique: true });

export const DepartureModel = mongoose.model<IDeparture>('Departure', DepartureSchema);
