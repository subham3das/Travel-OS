export interface AdminDepartureItem {
  id: string;
  departureId: string;
  packageId: string;
  packageName: string;
  packageImage: string;
  destination: string;
  category: string;
  durationDays: number;
  agencyId: string;
  agencyName: string;
  agencyLogo?: string;
  departureDate: string;
  endDate: string;
  capacity: number;
  bookedSeats: number;
  remainingSeats: number;
  price: number;
  bookingStatus: 'OPEN' | 'SOLD OUT' | 'BOOKING CLOSED' | 'ONGOING' | 'COMPLETED' | string;
  tripStatus: 'OPEN' | 'SOLD OUT' | 'BOOKING CLOSED' | 'ONGOING' | 'COMPLETED' | string;
  status: string;
  notes?: string;
  createdAt: string;
}

export interface DepartureKPICard {
  id: string;
  title: string;
  value: string;
  growth?: string;
  isPositive?: boolean;
  comparison?: string;
  iconType: string;
  sparklineColor: string;
}

export interface DepartureKPIStats {
  totalDepartures: DepartureKPICard;
  upcomingDepartures: DepartureKPICard;
  todayDepartures: DepartureKPICard;
  ongoingDepartures: DepartureKPICard;
  completedDepartures: DepartureKPICard;
  soldOutDepartures: DepartureKPICard;
  occupancyRate: DepartureKPICard;
}

export interface DepartureFilters {
  search?: string;
  status?: string;
  agency?: string;
  destination?: string;
  departureDate?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DepartureBookingItem {
  id: string;
  bookingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  travelersCount: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export interface DepartureDetailsResponse {
  departure: AdminDepartureItem & {
    agencyEmail?: string;
    agencyPhone?: string;
    bookingOpens?: string;
    bookingCloses?: string;
  };
  bookings: DepartureBookingItem[];
  travelersCount: number;
}
