import { agencyApiClient } from './agencyApiClient';

export interface CarRentalProfileData {
  businessName?: string;
  ownerName?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pinCode?: string;
  panNumber?: string;
  gstNumber?: string;
  businessLicenseNumber?: string;
  profilePhotoUrl?: string;
  coverPhotoUrl?: string;
  description?: string;
  workingHours?: string;
  emergencyContact?: string;
  fleetSize?: number;
  operatingCities?: string[];
  documents?: Array<{
    id: string;
    name: string;
    type: string;
    status: string;
    fileUrl: string;
    uploadedAt: string;
  }>;
  bankDetails?: {
    accountHolderName?: string;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    upiId?: string;
  };
  supportedVehicleServices?: ('driver_booking' | 'self_drive_car' | 'self_drive_bike')[];
}

export interface CarRentalProfileResponse {
  agencyId: string;
  applicationId: string;
  name: string;
  businessTypes: ('agency' | 'car_rental')[];
  activeBusiness: 'agency' | 'car_rental';
  carRentalVerificationStatus: 'NOT_REGISTERED' | 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  carRentalProfile: CarRentalProfileData | null;
  carRentalApprovedAt?: string;
  carRentalRejectionReason?: string;
}

export interface CarRentalDashboardStats {
  fleetStats: {
    totalCars: number;
    activeCars: number;
    bookedCars?: number;
    maintenanceCars?: number;
    inactiveCars?: number;
    utilizationRate: number;
  };
  driverStats?: {
    totalDrivers: number;
    activeDrivers: number;
  };
  bookingStats: {
    totalBookings: number;
    activeRentals: number;
    pendingRequests: number;
    completedRentals?: number;
    completedBookings?: number;
    todayBookings?: number;
  };
  financialStats: {
    totalRevenue: number;
    advanceCollected: number;
    remainingDue?: number;
    pendingBalance?: number;
  };
  recentBookings: any[];
  topVehicles?: any[];
}

export const agencyCarRentalService = {
  /**
   * 1. Get Car Rental Profile and Verification Status
   */
  async getProfile(): Promise<CarRentalProfileResponse> {
    const res = await agencyApiClient.get<CarRentalProfileResponse>('/agencies/car-rental/profile');
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to fetch car rental profile');
  },

  /**
   * 1b. Standalone Onboarding for new Car Rental Providers (Public)
   */
  async onboardStandalone(data: any): Promise<{ token: string; user: any; agency: any; applicationId: string }> {
    const res = await agencyApiClient.post('/agencies/car-rental/onboard', data);
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to submit car rental onboarding application');
  },

  /**
   * 2. Register Car Rental Business
   */
  async register(data: Partial<CarRentalProfileData>): Promise<any> {
    const res = await agencyApiClient.post('/agencies/car-rental/register', data);
    if (res.success) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to register car rental business');
  },

  /**
   * 3. Update Car Rental Profile
   */
  async updateProfile(data: Partial<CarRentalProfileData>): Promise<any> {
    const res = await agencyApiClient.patch('/agencies/car-rental/profile', data);
    if (res.success) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to update car rental profile');
  },

  /**
   * 4. Switch Active Business
   */
  async switchBusiness(business: 'agency' | 'car_rental'): Promise<any> {
    const res = await agencyApiClient.post('/agencies/car-rental/switch-business', { business });
    if (res.success) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to switch business');
  },

  /**
   * 5. Get Dashboard Telemetry Stats
   */
  async getDashboardStats(): Promise<CarRentalDashboardStats> {
    const res = await agencyApiClient.get<CarRentalDashboardStats>('/agencies/car-rental/dashboard');
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to fetch dashboard stats');
  },

  /**
   * 6. Get Calendar Schedule
   */
  async getCalendar(): Promise<{ cars: any[]; bookings: any[] }> {
    const res = await agencyApiClient.get<{ cars: any[]; bookings: any[] }>('/agencies/car-rental/calendar');
    if (res.success && res.data) {
      return res.data;
    }
    return { cars: [], bookings: [] };
  },

  /**
   * 7. Get Drivers
   */
  async getDrivers(): Promise<any[]> {
    const res = await agencyApiClient.get<{ drivers: any[] }>('/agencies/car-rental/drivers');
    if (res.success && res.data) {
      return (res.data as any).drivers || (Array.isArray(res.data) ? res.data : []);
    }
    return [];
  },

  /**
   * 8. Fleet Management: Get All Cars
   */
  async getCars(): Promise<any[]> {
    const res = await agencyApiClient.get<{ cars: any[] }>('/agencies/cars');
    if (res.success && res.data) {
      return res.data.cars || [];
    }
    return [];
  },

  /**
   * 9. Create Vehicle Listing
   */
  async createCar(data: any): Promise<any> {
    const res = await agencyApiClient.post('/agencies/cars', data);
    if (res.success) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to create car listing');
  },

  /**
   * 10. Update Vehicle Listing
   */
  async updateCar(id: string, data: any): Promise<any> {
    const res = await agencyApiClient.patch(`/agencies/cars/${id}`, data);
    if (res.success) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to update car listing');
  },

  /**
   * 11. Delete Vehicle Listing
   */
  async deleteCar(id: string): Promise<void> {
    const res = await agencyApiClient.delete(`/agencies/cars/${id}`);
    if (!res.success) {
      throw new Error(res.message || 'Failed to delete car listing');
    }
  },

  /**
   * 12. Get Bookings
   */
  async getBookings(status?: string): Promise<any[]> {
    const query = status ? `?status=${status}` : '';
    const res = await agencyApiClient.get<{ bookings: any[] }>(`/agencies/car-bookings${query}`);
    if (res.success && res.data) {
      return res.data.bookings || [];
    }
    return [];
  },

  /**
   * 13. Update Booking Status (Accept, Reject, Complete, Cancel)
   */
  async updateBookingStatus(id: string, status: string, rejectionReason?: string): Promise<any> {
    const res = await agencyApiClient.patch(`/agencies/car-bookings/${id}/status`, {
      status,
      rejectionReason,
    });
    if (res.success) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to update booking status');
  },

  /**
   * 14. Get Fleet Overview
   */
  async getFleetOverview(): Promise<{ breakdown: any; owners: any[] }> {
    const res = await agencyApiClient.get<{ breakdown: any; owners: any[] }>('/agencies/car-rental/fleet-overview');
    if (res.success && res.data) {
      return res.data;
    }
    return {
      breakdown: { totalVehicles: 0, suv: 0, sedan: 0, luxury: 0, tempo: 0, miniBus: 0, hatchback: 0, available: 0, inactive: 0, maintenance: 0 },
      owners: [],
    };
  },


  /**
   * 15b. Assign Driver and Confirm Booking
   */
  async assignDriver(
    bookingId: string,
    data: { driverId: string; vehicleNumber?: string; vehicleModel?: string }
  ): Promise<any> {
    const res = await agencyApiClient.post(`/agencies/car-rental/bookings/${bookingId}/assign-driver`, data);
    if (res.success) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to assign driver');
  },

  /**
   * 15c. Create Driver
   */
  async createDriver(data: any): Promise<any> {
    const res = await agencyApiClient.post('/agencies/car-rental/drivers', data);
    if (res.success) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to create driver');
  },

  /**
   * 16. Update Driver
   */
  async updateDriver(id: string, data: any): Promise<any> {
    const res = await agencyApiClient.patch(`/agencies/car-rental/drivers/${id}`, data);
    if (res.success) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to update driver');
  },

  /**
   * 17. Get Rental Customers CRM
   */
  async getCustomers(): Promise<any[]> {
    const res = await agencyApiClient.get<{ customers: any[] }>('/agencies/car-rental/customers');
    if (res.success && res.data) {
      return res.data.customers || [];
    }
    return [];
  },

  /**
   * 18. Get Rental Analytics
   */
  async getAnalytics(): Promise<any> {
    const res = await agencyApiClient.get<any>('/agencies/car-rental/analytics');
    if (res.success && res.data) {
      return res.data;
    }
    return null;
  },

  /**
   * 19. Get Fleet Reviews and Ratings
   */
  async getReviews(): Promise<{ reviews: any[]; stats: { totalReviews: number; averageRating: number; distribution: Record<number, number> } }> {
    const res = await agencyApiClient.get<{ reviews: any[]; stats: { totalReviews: number; averageRating: number; distribution: Record<number, number> } }>('/agencies/car-rental/reviews');
    if (res.success && res.data) {
      return res.data;
    }
    return {
      reviews: [],
      stats: { totalReviews: 0, averageRating: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
    };
  },

  /**
   * 20. Route Management for Vehicles
   */
  async getVehicleRoutes(vehicleId: string): Promise<any[]> {
    const res = await agencyApiClient.get<any>(`/agencies/car-rental/vehicles/${vehicleId}/routes`);
    if (res.success && res.data) {
      return Array.isArray(res.data) ? res.data : (res.data.routes || []);
    }
    return [];
  },

  async addVehicleRoute(
    vehicleId: string,
    routeData: any
  ): Promise<any> {
    const res = await agencyApiClient.post(`/agencies/car-rental/vehicles/${vehicleId}/routes`, routeData);
    if (res.success) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to add route');
  },

  async updateVehicleRoute(
    vehicleId: string,
    routeId: string,
    routeData: any
  ): Promise<any> {
    const res = await agencyApiClient.patch(`/agencies/car-rental/vehicles/${vehicleId}/routes/${routeId}`, routeData);
    if (res.success) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to update route');
  },

  async duplicateVehicleRoute(vehicleId: string, routeId: string, data?: any): Promise<any> {
    const res = await agencyApiClient.post(`/agencies/car-rental/vehicles/${vehicleId}/routes/${routeId}/duplicate`, data || {});
    if (res.success) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to duplicate route');
  },

  async deleteVehicleRoute(vehicleId: string, routeId: string): Promise<void> {
    const res = await agencyApiClient.delete(`/agencies/car-rental/vehicles/${vehicleId}/routes/${routeId}`);
    if (!res.success) {
      throw new Error(res.message || 'Failed to delete route');
    }
  },

  async toggleVehicleRouteStatus(vehicleId: string, routeId: string): Promise<any> {
    const res = await agencyApiClient.patch(`/agencies/car-rental/vehicles/${vehicleId}/routes/${routeId}/toggle`, {});
    if (res.success) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to toggle route status');
  },

  /**
   * 21. Self-Drive Rental Handover & Settlement
   */
  async rentalPickupCheckIn(bookingId: string, data: { odometerStart: number; fuelStatusStart: string; notes?: string }): Promise<any> {
    const res = await agencyApiClient.post(`/car-bookings/rentals/${bookingId}/checkin`, data);
    if (res.success) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to check-in rental vehicle');
  },

  async rentalReturnCheckOut(bookingId: string, data: { odometerEnd: number; fuelStatusEnd: string; damageFee?: number; damageNotes?: string; fuelDifferenceFee?: number }): Promise<any> {
    const res = await agencyApiClient.post(`/car-bookings/rentals/${bookingId}/checkout`, data);
    if (res.success) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to process return checkout');
  },

  async refundSecurityDeposit(bookingId: string, data: { amount?: number; reason?: string }): Promise<any> {
    const res = await agencyApiClient.post(`/car-bookings/rentals/${bookingId}/refund-deposit`, data);
    if (res.success) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to refund security deposit');
  },
};
