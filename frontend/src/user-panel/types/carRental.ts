export type VehicleCategory =
  | 'outstation'
  | 'local'
  | 'airport'
  | 'hourly'
  | 'self_drive'
  | 'luxury';

export type VehicleType =
  | 'hatchback'
  | 'sedan'
  | 'suv'
  | 'tempo_traveller'
  | 'luxury'
  | 'mini_bus';

export type TripType =
  | 'one_way'
  | 'round_trip'
  | 'full_day'
  | 'multi_day';

export type FuelType = 'Petrol' | 'Diesel' | 'CNG' | 'Electric';

export type TransmissionType = 'Manual' | 'Automatic';

export interface RouteRules {
  maxDistanceKm?: number;
  advanceBookingHours?: number;
  bookingEnabled?: boolean;
}

export interface CarRoute {
  _id?: string;
  id?: string;
  vehicleId?: string;
  pickup: string;
  destination: string;
  fromLocation?: string;
  toLocation?: string;
  routeName?: string;
  distanceKm?: number;
  distance?: number;
  duration?: string;
  estimatedDuration?: string;
  price: number;
  pricing?: RoutePricing;
  rules?: RouteRules;
  status: 'active' | 'disabled' | 'archived';
  notes?: string;
  totalBookings?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoutePricing {
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

export interface VehiclePricing {
  basePricePerDay: number;
  fixedPrice?: number;
  driverAllowancePerDay?: number;
  nightStayAllowance?: number;
  tollTaxesIncluded?: boolean;
}

export interface VehicleSpecification {
  seats: number;
  doors: number;
  luggageBags: number;
  fuel: FuelType;
  transmission: TransmissionType;
  hasAC: boolean;
  driverIncluded: boolean;
  modelYear: number;
  mileage: string;
  engineCC?: number;
  features: string[];
}

export interface VehicleProvider {
  id: string;
  name: string;
  type: 'Travel Agency' | 'Car Provider' | 'Both';
  isVerified: boolean;
  rating: number;
  totalTrips: number;
  contactPhone: string;
  supportEmail: string;
  location: string;
  avatar: string;
  offersBothPackagesAndCars: boolean;
}

export interface VehicleReview {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  model?: string;
  type: VehicleType;
  category: VehicleCategory;
  images: string[];
  thumbnail: string;
  provider: VehicleProvider;
  specs: VehicleSpecification;
  pricing: VehiclePricing;
  cancellationPolicy: string;
  rating: number;
  reviewsCount: number;
  isAvailable: boolean;
  description: string;
  isFeatured: boolean;
  isFavorite?: boolean;
  driver?: {
    name: string;
    photo?: string;
    phone?: string;
    experienceYears?: number;
    rating?: number;
    tripsCount?: number;
    languages?: string[];
    isVerified?: boolean;
  };
  routes?: CarRoute[];
  matchedRoute?: CarRoute | null;
  routePrice?: number;
  inclusions?: string[];
  exclusions?: string[];
  serviceType?: 'ROUTE_BOOKING' | 'SELF_DRIVE_RENTAL' | 'driver_booking' | 'self_drive_car' | 'self_drive_bike';
  vehicleSubCategory?: 'car' | 'bike';
  pickupLocation?: string;
  dailyPrice?: number;
  fixedDepositAmount?: number;
  routePricing?: RoutePricing;
  rentalPricing?: {
    hourlyRate?: number;
    dailyRate: number;
    weeklyRate?: number;
    monthlyRate?: number;
  };
  rentalPolicies?: {
    securityDeposit: number;
    includedKmPerDay?: number;
    extraKmCharge?: number;
    fuelPolicy: string;
    minRentalDurationHours?: number;
    maxRentalDurationDays?: number;
  };
  rentalQuote?: {
    durationHours: number;
    totalDays: number;
    tierApplied: string;
    unitRate: number;
    baseAmount: number;
    taxesAmount: number;
    securityDeposit: number;
    totalRentalAmount: number;
    totalPayableAtBooking: number;
    includedKm: number;
  };
  calculatedPrice?: number;
}

export interface CarRentalSearchParams {
  pickupLocation?: string;
  dropLocation?: string;
  travelDate?: string;
  pickupTime?: string;
  pickupDateTime?: string;
  returnDateTime?: string;
  serviceType?: 'ROUTE_BOOKING' | 'SELF_DRIVE_RENTAL' | 'driver_booking' | 'self_drive_car' | 'self_drive_bike' | 'all';
  vehicleSubCategory?: 'car' | 'bike' | 'all';
  tripType?: TripType;
  category?: VehicleCategory | 'all';
  type?: VehicleType | 'all';
  city?: string;
  filters?: Partial<CarRentalFilterState>;
}

export interface CarRentalFilterState {
  priceRange: [number, number];
  vehicleTypes: VehicleType[];
  seats: number[];
  fuel: FuelType[];
  transmission: TransmissionType[];
  driverIncluded: boolean | null;
  hasAC: boolean | null;
  minRating: number;
  onlyVerifiedProviders: boolean;
  availabilityOnly: boolean;
  minPrice?: number;
  maxPrice?: number;
  verifiedOnly?: boolean;
  driverIncludedOnly?: boolean;
  offersBothOnly?: boolean;
}

export interface CarRentalBooking {
  id: string;
  vehicleId: string;
  vehicleName: string;
  vehicleImage: string;
  providerId: string;
  providerName: string;
  pickupLocation: string;
  dropLocation: string;
  startDate: string;
  endDate: string;
  pickupTime: string;
  tripType: TripType;
  travellerName?: string;
  travellerPhone?: string;
  travellerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  specialRequests?: string;
  specialNotes?: string;
  routeId?: string;
  fixedPrice?: number;
  remainingAmount?: number;
  passengersCount?: number;
  totalDays?: number;
  totalAmount: number;
  depositPaid?: number;
  paymentMethod?: 'card' | 'upi' | 'netbanking' | 'pay_on_pickup';
  paymentStatus?: 'paid' | 'pending' | 'DEPOSIT_PAID' | string;
  bookingStatus?: 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'REQUESTED' | 'ACCEPTED' | 'PENDING' | 'CONFIRMED' | string;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  driverPhoto?: string;
  driverLicense?: string;
  vehicleNumber?: string;
  vehicleModel?: string;
  emergencyContact?: { name: string; phone: string; relationship?: string };
  address?: string;
  gender?: string;
  age?: number;
  transactionId?: string;
  confirmedAt?: string;
  confirmedBy?: string;
  status?: string;
  createdAt?: string;
}
