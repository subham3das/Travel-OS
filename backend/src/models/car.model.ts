import mongoose, { Document, Schema } from 'mongoose';

export type VehicleType =
  | 'hatchback'
  | 'sedan'
  | 'suv'
  | 'tempo_traveller'
  | 'luxury'
  | 'mini_bus';

export type VehicleCategory =
  | 'local'
  | 'outstation'
  | 'luxury'
  | 'airport'
  | 'hourly'
  | 'self_drive';

export type VehicleServiceType =
  | 'ROUTE_BOOKING'
  | 'SELF_DRIVE_RENTAL'
  | 'driver_booking'
  | 'self_drive_car'
  | 'self_drive_bike';
export type VehicleSubCategory = 'car' | 'bike';

export interface IRoutePricing {
  oneWayPrice: number;
  roundTripPrice?: number;
  extraKmCharge?: number;
  waitingChargePerHour?: number;
  nightCharge?: number;
  driverAllowancePerDay?: number;
  tollIncluded?: boolean;
  parkingIncluded?: boolean;
  stateTaxIncluded?: boolean;
  maxDistanceKm?: number;
  minBookingHours?: number;
  advanceBookingHours?: number;
}

export interface IRentalPricing {
  hourlyRate?: number;
  dailyRate: number;
  weeklyRate?: number;
  monthlyRate?: number;
}

export interface IRentalPolicies {
  securityDeposit: number;
  includedKmPerDay?: number;
  extraKmCharge?: number;
  fuelPolicy: 'same_to_same' | 'full_to_full' | 'free_fuel' | string;
  minRentalDurationHours?: number;
  maxRentalDurationDays?: number;
}

export interface IBookedSlot {
  startDate: Date;
  endDate: Date;
  bookingId: string;
}

export interface IVehicleDriver {
  name: string;
  photo?: string;
  phone?: string;
  experienceYears: number;
  rating: number;
  tripsCount: number;
  languages: string[];
  isVerified: boolean;
}

export interface IVehicleSpecs {
  seats: number;
  doors?: number;
  luggageBags: number;
  fuel: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'CNG';
  transmission: 'Manual' | 'Automatic';
  hasAC: boolean;
  driverIncluded: boolean;
  modelYear?: number;
  mileage?: string;
  engineCC?: number;
}

export interface ICarRoute {
  _id?: mongoose.Types.ObjectId;
  pickup: string;
  destination: string;
  fromLocation?: string;
  toLocation?: string;
  routeName?: string;
  distanceKm?: number;
  duration?: string;
  price: number;
  pricing?: {
    oneWayPrice: number;
    roundTripPrice?: number;
    extraKmCharge?: number;
    waitingChargePerHour?: number;
    nightCharge?: number;
    driverAllowancePerDay?: number;
    tollIncluded?: boolean;
    parkingIncluded?: boolean;
    stateTaxIncluded?: boolean;
  };
  rules?: {
    maxDistanceKm?: number;
    advanceBookingHours?: number;
    bookingEnabled?: boolean;
  };
  status: 'active' | 'disabled' | 'archived';
  estimatedDuration?: string;
  notes?: string;
  totalBookings?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICar extends Document {
  agencyId: mongoose.Types.ObjectId;
  name: string;
  brand: string;
  type: VehicleType;
  category: VehicleCategory;
  serviceType: VehicleServiceType;
  vehicleSubCategory: VehicleSubCategory;
  pickupLocation?: string;
  city: string;
  dailyPrice?: number;
  routePricing?: IRoutePricing;
  rentalPricing?: IRentalPricing;
  rentalPolicies?: IRentalPolicies;
  bookedSlots: IBookedSlot[];
  routes: ICarRoute[];
  depositPercentage: number;
  fixedDepositAmount?: number;
  specs: IVehicleSpecs;
  driver: IVehicleDriver;
  images: string[];
  thumbnail: string;
  features: string[];
  inclusions: string[];
  exclusions: string[];
  cancellationPolicy: string;
  averageRating: number;
  reviewsCount: number;
  isAvailable: boolean;
  isActive: boolean;
  isFeatured: boolean;
  description: string;
  registrationNumber?: string;
  rcNumber?: string;
  rcDocument?: string;
  insurancePolicyNumber?: string;
  insuranceExpiryDate?: Date;
  permitType?: string;
  permitDocument?: string;
  pollutionCertificateNumber?: string;
  pollutionExpiryDate?: Date;
  owner?: {
    name: string;
    phone: string;
    email?: string;
    businessName?: string;
    rating?: number;
    vehiclesCount?: number;
    totalRevenue?: number;
  };
  status?: 'available' | 'booked' | 'maintenance' | 'inactive';
  totalTrips?: number;
  totalRevenue?: number;
  createdAt: Date;
  updatedAt: Date;
}

const VehicleDriverSchema = new Schema<IVehicleDriver>(
  {
    name: { type: String, required: true },
    photo: { type: String, default: '' },
    phone: { type: String, default: '' },
    experienceYears: { type: Number, default: 3 },
    rating: { type: Number, default: 4.8 },
    tripsCount: { type: Number, default: 100 },
    languages: [{ type: String }],
    isVerified: { type: Boolean, default: true },
  },
  { _id: false }
);

const VehicleSpecsSchema = new Schema<IVehicleSpecs>(
  {
    seats: { type: Number, required: true },
    doors: { type: Number, default: 4 },
    luggageBags: { type: Number, default: 2 },
    fuel: {
      type: String,
      enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'],
      default: 'Diesel',
    },
    transmission: {
      type: String,
      enum: ['Manual', 'Automatic'],
      default: 'Manual',
    },
    hasAC: { type: Boolean, default: true },
    driverIncluded: { type: Boolean, default: true },
    modelYear: { type: Number, default: 2024 },
    mileage: { type: String, default: '14 km/l' },
    engineCC: { type: Number },
  },
  { _id: false }
);

const RentalPricingSchema = new Schema<IRentalPricing>(
  {
    hourlyRate: { type: Number, min: 0 },
    dailyRate: { type: Number, required: true, min: 0 },
    weeklyRate: { type: Number, min: 0 },
    monthlyRate: { type: Number, min: 0 },
  },
  { _id: false }
);

const RentalPoliciesSchema = new Schema<IRentalPolicies>(
  {
    securityDeposit: { type: Number, default: 3000, min: 0 },
    includedKmPerDay: { type: Number, default: 300, min: 0 },
    extraKmCharge: { type: Number, default: 12, min: 0 },
    fuelPolicy: { type: String, default: 'same_to_same' },
    minRentalDurationHours: { type: Number, default: 4, min: 1 },
    maxRentalDurationDays: { type: Number, default: 90 },
  },
  { _id: false }
);

const BookedSlotSchema = new Schema<IBookedSlot>(
  {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    bookingId: { type: String, required: true },
  },
  { _id: false }
);

const CarRouteSchema = new Schema<ICarRoute>(
  {
    pickup: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    fromLocation: { type: String, trim: true },
    toLocation: { type: String, trim: true },
    routeName: { type: String, trim: true, default: '' },
    distanceKm: { type: Number, min: 0, default: 0 },
    duration: { type: String, trim: true, default: '' },
    price: { type: Number, required: true, min: 0 },
    pricing: {
      type: new Schema(
        {
          oneWayPrice: { type: Number, required: true, min: 0 },
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
      ),
      required: false,
    },
    rules: {
      type: new Schema(
        {
          maxDistanceKm: { type: Number, default: 600, min: 0 },
          advanceBookingHours: { type: Number, default: 2, min: 0 },
          bookingEnabled: { type: Boolean, default: true },
        },
        { _id: false }
      ),
      default: () => ({}),
    },
    status: {
      type: String,
      enum: ['active', 'disabled', 'archived'],
      default: 'active',
      index: true,
    },
    estimatedDuration: { type: String, default: '' },
    notes: { type: String, default: '' },
    totalBookings: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

const RoutePricingSchema = new Schema<IRoutePricing>(
  {
    oneWayPrice: { type: Number, min: 0 },
    roundTripPrice: { type: Number, min: 0 },
    extraKmCharge: { type: Number, min: 0 },
    waitingChargePerHour: { type: Number, min: 0 },
    nightCharge: { type: Number, min: 0 },
    driverAllowancePerDay: { type: Number, min: 0 },
    tollIncluded: { type: Boolean, default: false },
    parkingIncluded: { type: Boolean, default: false },
    stateTaxIncluded: { type: Boolean, default: false },
    maxDistanceKm: { type: Number },
    minBookingHours: { type: Number, default: 2 },
    advanceBookingHours: { type: Number, default: 4 },
  },
  { _id: false }
);

const CarSchema = new Schema<ICar>(
  {
    agencyId: {
      type: Schema.Types.ObjectId,
      ref: 'Agency',
      required: true,
      index: true,
    },
    routes: { type: [CarRouteSchema], default: [] },
    name: { type: String, required: true, trim: true, index: true },
    brand: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['hatchback', 'sedan', 'suv', 'tempo_traveller', 'luxury', 'mini_bus'],
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: ['local', 'outstation', 'luxury', 'airport', 'hourly', 'self_drive'],
      default: 'outstation',
      index: true,
    },
    city: { type: String, required: true, trim: true },
    dailyPrice: { type: Number, default: 0, min: 0, index: true },
    depositPercentage: { type: Number, default: 15, min: 0, max: 100 },
    fixedDepositAmount: { type: Number, default: 500, min: 0 },
    routePricing: { type: RoutePricingSchema },
    specs: { type: VehicleSpecsSchema, required: true },
    driver: { type: VehicleDriverSchema, required: false },
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
    pickupLocation: { type: String, default: '', trim: true },
    rentalPricing: { type: RentalPricingSchema },
    rentalPolicies: { type: RentalPoliciesSchema },
    bookedSlots: { type: [BookedSlotSchema], default: [] },
    images: [{ type: String }],
    thumbnail: { type: String, required: true },
    features: [{ type: String }],
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    cancellationPolicy: {
      type: String,
      default: 'Free cancellation up to 24 hours before pickup time.',
    },
    averageRating: { type: Number, default: 4.8, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0, min: 0 },
    isAvailable: { type: Boolean, default: true, index: true },
    isActive: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    description: { type: String, default: '' },
    registrationNumber: { type: String, default: '', trim: true, index: true },
    rcNumber: { type: String, default: '', trim: true },
    rcDocument: { type: String, default: '', trim: true },
    insurancePolicyNumber: { type: String, default: '', trim: true },
    insuranceExpiryDate: { type: Date },
    permitType: { type: String, default: 'Commercial' },
    permitDocument: { type: String, default: '', trim: true },
    pollutionCertificateNumber: { type: String, default: '', trim: true },
    pollutionExpiryDate: { type: Date },
    owner: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
      businessName: { type: String, default: '' },
      rating: { type: Number, default: 4.8 },
      vehiclesCount: { type: Number, default: 1 },
      totalRevenue: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: ['available', 'booked', 'maintenance', 'inactive'],
      default: 'available',
      index: true,
    },
    totalTrips: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

CarSchema.index({ city: 1, type: 1, dailyPrice: 1 });
CarSchema.index({ agencyId: 1, createdAt: -1 });
CarSchema.index({ isActive: 1, isAvailable: 1, category: 1 });
CarSchema.index({ serviceType: 1, isActive: 1, isAvailable: 1 });
CarSchema.index({ vehicleSubCategory: 1, serviceType: 1 });
CarSchema.index({ 'rentalPricing.dailyRate': 1 });
CarSchema.index({ 'bookedSlots.startDate': 1, 'bookedSlots.endDate': 1 });
CarSchema.index({ 'routes.pickup': 1, 'routes.destination': 1, 'routes.status': 1 });
CarSchema.index({ 'routes.price': 1 });

export const CarModel = mongoose.model<ICar>('Car', CarSchema);
