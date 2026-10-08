import mongoose, { Document, Schema } from 'mongoose';

export interface IVehicleRoutePricing {
  oneWayPrice: number;
  roundTripPrice?: number;
  extraKmCharge?: number;
  waitingChargePerHour?: number;
  nightCharge?: number;
  driverAllowancePerDay?: number;
  tollIncluded?: boolean;
  parkingIncluded?: boolean;
  stateTaxIncluded?: boolean;
}

export interface IVehicleRouteRules {
  maxDistanceKm?: number;
  advanceBookingHours?: number;
  bookingEnabled?: boolean;
}

export interface IVehicleRoute extends Document {
  vehicleId: mongoose.Types.ObjectId;
  agencyId: mongoose.Types.ObjectId;
  pickup: string;
  destination: string;
  fromLocation: string;
  toLocation: string;
  routeName?: string;
  distanceKm?: number;
  duration?: string;
  estimatedDuration?: string;
  pricing: IVehicleRoutePricing;
  price: number;
  rules?: IVehicleRouteRules;
  status: 'active' | 'disabled' | 'archived';
  notes?: string;
  totalBookings: number;
  createdAt: Date;
  updatedAt: Date;
}

const VehicleRoutePricingSchema = new Schema<IVehicleRoutePricing>(
  {
    oneWayPrice: { type: Number, required: true, min: 1 },
    roundTripPrice: { type: Number, min: 0 },
    extraKmCharge: { type: Number, default: 14, min: 0 },
    waitingChargePerHour: { type: Number, default: 150, min: 0 },
    nightCharge: { type: Number, default: 300, min: 0 },
    driverAllowancePerDay: { type: Number, default: 400, min: 0 },
    tollIncluded: { type: Boolean, default: true },
    parkingIncluded: { type: Boolean, default: false },
    stateTaxIncluded: { type: Boolean, default: true },
  },
  { _id: false }
);

const VehicleRouteRulesSchema = new Schema<IVehicleRouteRules>(
  {
    maxDistanceKm: { type: Number, default: 600, min: 0 },
    advanceBookingHours: { type: Number, default: 2, min: 0 },
    bookingEnabled: { type: Boolean, default: true },
  },
  { _id: false }
);

const VehicleRouteSchema = new Schema<IVehicleRoute>(
  {
    vehicleId: {
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
    pickup: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    fromLocation: {
      type: String,
      trim: true,
    },
    toLocation: {
      type: String,
      trim: true,
    },
    routeName: {
      type: String,
      trim: true,
      default: '',
    },
    distanceKm: {
      type: Number,
      min: 0,
      default: 0,
    },
    duration: {
      type: String,
      trim: true,
      default: '',
    },
    estimatedDuration: {
      type: String,
      trim: true,
      default: '',
    },
    pricing: {
      type: VehicleRoutePricingSchema,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    rules: {
      type: VehicleRouteRulesSchema,
      default: () => ({}),
    },
    status: {
      type: String,
      enum: ['active', 'disabled', 'archived'],
      default: 'active',
      index: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    totalBookings: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Synchronize pickup/destination with fromLocation/toLocation and price with pricing.oneWayPrice
VehicleRouteSchema.pre('save', function () {
  if (this.pickup && !this.fromLocation) {
    this.fromLocation = this.pickup;
  } else if (this.fromLocation && !this.pickup) {
    this.pickup = this.fromLocation;
  }

  if (this.destination && !this.toLocation) {
    this.toLocation = this.destination;
  } else if (this.toLocation && !this.destination) {
    this.destination = this.toLocation;
  }

  if (this.duration && !this.estimatedDuration) {
    this.estimatedDuration = this.duration;
  } else if (this.estimatedDuration && !this.duration) {
    this.duration = this.estimatedDuration;
  }

  if (this.pricing?.oneWayPrice) {
    this.price = this.pricing.oneWayPrice;
  } else if (this.price) {
    if (!this.pricing) {
      this.pricing = { oneWayPrice: this.price };
    } else {
      this.pricing.oneWayPrice = this.price;
    }
  }
});

// Index to quickly search routes and prevent duplicates for active/disabled routes
VehicleRouteSchema.index(
  { vehicleId: 1, pickup: 1, destination: 1, status: 1 }
);

export const VehicleRouteModel = mongoose.model<IVehicleRoute>('VehicleRoute', VehicleRouteSchema);
