import { apiClient } from '../../services/apiClient';
import {
  Vehicle,
  CarRentalSearchParams,
  CarRentalFilterState,
  CarRentalBooking,
  VehicleCategory,
  VehicleType,
  VehicleReview,
} from '../types/carRental';

// Import local image assets bundled by Vite
import catHatchback from '../../assets/images/cars/cat_hatchback.png';
import catSedan from '../../assets/images/cars/cat_sedan.png';
import catSuv from '../../assets/images/cars/cat_suv.png';
import catTempo from '../../assets/images/cars/cat_tempo.png';
import catLuxury from '../../assets/images/cars/cat_luxury.png';
import catMinibus from '../../assets/images/cars/cat_minibus.png';

import carInnova from '../../assets/images/cars/car_innova_crysta.jpg';
import carBmw from '../../assets/images/cars/car_bmw_luxury.jpg';
import carTempo from '../../assets/images/cars/car_tempo_traveller.jpg';
import carThar from '../../assets/images/cars/car_mahindra_thar.jpg';
import carI20 from '../../assets/images/cars/car_hyundai_i20.jpg';
import carMinibus from '../../assets/images/cars/car_mercedes_minibus.jpg';

import innova1 from '../../assets/images/cars/innova_view_1.png';
import innova2 from '../../assets/images/cars/innova_view_2.png';
import innova3 from '../../assets/images/cars/innova_view_3.png';
import innova4 from '../../assets/images/cars/innova_view_4.png';
import innova5 from '../../assets/images/cars/innova_view_5.png';

import driverRohit from '../../assets/images/cars/driver_rohit.png';
import reviewerAnanya from '../../assets/images/cars/reviewer_ananya.png';

export const VEHICLE_CATEGORY_ASSETS: Record<VehicleType, { label: string; sub: string; image: string }> = {
  hatchback: { label: 'Hatchback', sub: 'Economical', image: catHatchback },
  sedan: { label: 'Sedan', sub: 'Comfortable', image: catSedan },
  suv: { label: 'SUV', sub: 'Spacious', image: catSuv },
  tempo_traveller: { label: 'Tempo Traveller', sub: 'For Groups', image: catTempo },
  luxury: { label: 'Luxury', sub: 'Premium Class', image: catLuxury },
  mini_bus: { label: 'Mini Bus', sub: 'Group Tours', image: catMinibus },
};

const LOCAL_CAR_PHOTOS: Record<string, string> = {
  hatchback: carI20,
  sedan: carBmw,
  suv: carInnova,
  tempo_traveller: carTempo,
  luxury: carBmw,
  mini_bus: carMinibus,
};

const ASSET_IMAGE_MAP: Record<string, string> = {
  'cat_hatchback.png': catHatchback,
  'cat_sedan.png': catSedan,
  'cat_suv.png': catSuv,
  'cat_tempo.png': catTempo,
  'cat_luxury.png': catLuxury,
  'cat_minibus.png': catMinibus,
  'car_innova_crysta.jpg': carInnova,
  'car_bmw_luxury.jpg': carBmw,
  'car_tempo_traveller.jpg': carTempo,
  'car_mahindra_thar.jpg': carThar,
  'car_hyundai_i20.jpg': carI20,
  'car_mercedes_minibus.jpg': carMinibus,
  'innova_view_1.png': innova1,
  'innova_view_2.png': innova2,
  'innova_view_3.png': innova3,
  'innova_view_4.png': innova4,
  'innova_view_5.png': innova5,
  'driver_rohit.png': driverRohit,
  'reviewer_ananya.png': reviewerAnanya,
};

export function resolveCarImage(src?: string, fallbackType?: string): string {
  if (!src) return LOCAL_CAR_PHOTOS[fallbackType || 'suv'] || carInnova;
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return src;
  }
  const filename = src.split('/').pop() || src;
  if (ASSET_IMAGE_MAP[filename]) {
    return ASSET_IMAGE_MAP[filename];
  }
  return LOCAL_CAR_PHOTOS[fallbackType || 'suv'] || carInnova;
}

const FAVORITES_STORAGE_KEY = 'apnatrip_saved_vehicles';
const RECENT_STORAGE_KEY = 'apnatrip_recent_vehicles';

export function mapBackendCarToVehicle(car: any): Vehicle {
  const rawImages = Array.isArray(car.images) && car.images.length > 0 ? car.images : (car.thumbnail ? [car.thumbnail] : []);
  const images = rawImages.map((img: string) => resolveCarImage(img, car.type));
  const thumbnail = resolveCarImage(car.thumbnail || rawImages[0] || '', car.type);
  const agency = car.agencyId || {};

  return {
    id: car._id || car.id,
    name: car.name,
    brand: car.brand || 'Vehicle',
    type: car.type || 'suv',
    category: car.category || 'outstation',
    images,
    thumbnail,
    provider: {
      id: agency._id || agency.id || '',
      name: agency.name || agency.businessName || car.owner?.businessName || 'Fleet Operator',
      type: 'Car Provider',
      isVerified: agency.isVerified ?? false,
      rating: agency.rating || car.averageRating || 0,
      totalTrips: agency.totalTrips || car.totalTrips || 0,
      contactPhone: agency.phone || car.owner?.phone || '',
      supportEmail: agency.email || car.owner?.email || 'support@apnatrip.in',
      location: agency.city || car.city || '',
      avatar: agency.logo || agency.avatar ? resolveCarImage(agency.logo || agency.avatar, 'driver') : '',
      offersBothPackagesAndCars: Boolean(agency.businessTypes?.includes('agency')),
    },
    specs: {
      seats: car.specs?.seats || 5,
      doors: car.specs?.doors || 4,
      luggageBags: car.specs?.luggageBags || 3,
      fuel: car.specs?.fuel || 'Diesel',
      transmission: car.specs?.transmission || 'Automatic',
      hasAC: car.specs?.hasAC ?? true,
      driverIncluded: car.specs?.driverIncluded ?? true,
      modelYear: car.specs?.modelYear || 2024,
      mileage: car.specs?.mileage || '14 km/l',
      engineCC: car.specs?.engineCC,
      features: car.features && car.features.length > 0 ? car.features : ['AC', 'Power Steering'],
    },
    serviceType: car.serviceType || 'ROUTE_BOOKING',
    vehicleSubCategory: car.vehicleSubCategory || (car.serviceType === 'self_drive_bike' ? 'bike' : 'car'),
    pickupLocation: car.pickupLocation || car.city || '',
    rentalPricing: car.rentalPricing,
    rentalPolicies: car.rentalPolicies,
    rentalQuote: car.rentalQuote,
    routePricing: car.routePricing,
    calculatedPrice: car.calculatedPrice || (car.serviceType === 'ROUTE_BOOKING' ? (car.routePricing?.oneWayPrice || car.routePrice || (car.matchedRoute ? car.matchedRoute.price : 0)) : (car.rentalQuote?.totalRentalAmount || car.rentalPricing?.dailyRate || car.dailyPrice)),
    pricing: {
      basePricePerDay: car.serviceType === 'ROUTE_BOOKING' ? 0 : (car.rentalPricing?.dailyRate || car.dailyPrice || 0),
      fixedPrice: car.serviceType === 'ROUTE_BOOKING' ? (car.routePricing?.oneWayPrice || car.routePrice || (car.matchedRoute ? car.matchedRoute.price : 0)) : (car.rentalPricing?.dailyRate || car.dailyPrice || 0),
      driverAllowancePerDay: car.routePricing?.driverAllowancePerDay || 0,
      nightStayAllowance: car.routePricing?.nightCharge || 0,
      tollTaxesIncluded: car.routePricing?.tollIncluded ?? true,
    },
    routes: (car.routes || []).map((r: any) => ({
      _id: r._id || r.id,
      id: r._id || r.id,
      pickup: r.pickup || r.fromLocation,
      destination: r.destination || r.toLocation,
      fromLocation: r.fromLocation || r.pickup,
      toLocation: r.toLocation || r.destination,
      routeName: r.routeName,
      distanceKm: r.distanceKm || r.distance,
      distance: r.distanceKm || r.distance,
      duration: r.duration || r.estimatedDuration,
      estimatedDuration: r.duration || r.estimatedDuration,
      price: Number(r.pricing?.oneWayPrice ?? r.price) || 0,
      pricing: r.pricing,
      rules: r.rules,
      notes: r.notes,
      totalBookings: r.totalBookings || 0,
      status: r.status || 'active',
    })),
    matchedRoute: car.matchedRoute || null,
    routePrice: car.routePrice || car.routePricing?.oneWayPrice || (car.matchedRoute ? car.matchedRoute.price : 0),
    driver: car.driver && car.driver.name ? {
      name: car.driver.name,
      photo: resolveCarImage(car.driver.photo, 'driver'),
      phone: car.driver.phone || '',
      experienceYears: car.driver.experienceYears || 0,
      rating: car.driver.rating || 0,
      tripsCount: car.driver.tripsCount || 0,
      languages: car.driver.languages || [],
      isVerified: car.driver.isVerified ?? false,
    } : {
      name: 'No driver assigned',
      photo: '',
      phone: '',
      experienceYears: 0,
      rating: 0,
      tripsCount: 0,
      languages: [],
      isVerified: false,
    },
    inclusions: car.inclusions && car.inclusions.length > 0 ? car.inclusions : [
      'Commercial Permit & Insurance',
      'Fixed Route Fuel Included',
      'Chauffeur / Driver Included',
      'Sanitized, AC vehicle',
    ],
    exclusions: car.exclusions && car.exclusions.length > 0 ? car.exclusions : [
      'Personal Expenses & Tips',
      'Special detours outside defined route',
    ],
    cancellationPolicy: car.cancellationPolicy || 'Free cancellation up to 24 hours before scheduled pickup time.',
    rating: car.averageRating || 0,
    reviewsCount: car.reviewsCount || 0,
    isAvailable: car.isAvailable ?? true,
    description: car.description || '',
    isFeatured: car.isFeatured ?? false,
  };
}

class CarRentalService {
  async getVehicles(params?: any): Promise<Vehicle[]> {
    try {
      const queryParams: Record<string, any> = {};
      if (params?.pickup) queryParams.pickup = params.pickup;
      if (params?.destination) queryParams.destination = params.destination;
      if (params?.city) queryParams.city = params.city;
      if (params?.category && params.category !== 'all') queryParams.category = params.category;
      if (params?.type && params.type !== 'all') queryParams.type = params.type;
      if (params?.seats && Number(params.seats) > 0) queryParams.seats = params.seats;
      if (params?.hasAC !== undefined && params.hasAC !== 'all') queryParams.hasAC = params.hasAC;
      if (params?.driverIncluded !== undefined && params.driverIncluded !== 'all') queryParams.driverIncluded = params.driverIncluded;
      if (params?.fuel && params.fuel !== 'all') queryParams.fuel = Array.isArray(params.fuel) ? params.fuel.join(',') : params.fuel;
      if (params?.transmission && params.transmission !== 'all') queryParams.transmission = Array.isArray(params.transmission) ? params.transmission.join(',') : params.transmission;
      if (params?.priceRange) {
        queryParams.minPrice = params.priceRange[0];
        queryParams.maxPrice = params.priceRange[1];
      }
      if (params?.minRating && Number(params.minRating) > 0) queryParams.minRating = params.minRating;
      if (params?.rating && Number(params.rating) > 0) queryParams.minRating = params.rating;
      if (params?.search) queryParams.search = params.search;
      if (params?.sortBy) queryParams.sortBy = params.sortBy;
      
      const res = await apiClient.get<any>('/cars', { params: queryParams });
      const carsList = res.data?.cars || res.data?.data?.cars || (Array.isArray(res.data) ? res.data : []);
      if (Array.isArray(carsList)) {
        return carsList.map(mapBackendCarToVehicle);
      }
    } catch (err) {
      console.warn('CarRentalService: Failed to fetch vehicles from backend', err);
    }
    return [];
  }

  async getVehicleById(id: string): Promise<Vehicle | null> {
    try {
      if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
        return null;
      }
      const res = await apiClient.get<any>(`/cars/${id}`);
      const carData = res.data?.car || res.data?.data?.car || res.data;
      if (carData && (carData._id || carData.name)) {
        return mapBackendCarToVehicle(carData);
      }
    } catch (err) {
      console.warn('CarRentalService: Failed to fetch vehicle by ID', err);
    }
    return null;
  }

  async searchVehicles(params: CarRentalSearchParams): Promise<Vehicle[]> {
    return this.getVehicles(params);
  }

  async createBooking(payload: Partial<CarRentalBooking>): Promise<{ success: boolean; booking: CarRentalBooking }> {
    const res = await apiClient.post<any>('/car-bookings', {
      carId: payload.vehicleId,
      routeId: payload.routeId,
      tripType: payload.tripType || 'one_way',
      startDate: payload.startDate,
      endDate: payload.endDate || payload.startDate,
      pickupLocation: payload.pickupLocation,
      dropLocation: payload.dropLocation,
      pickupTime: payload.pickupTime,
      passengersCount: payload.passengersCount || 2,
      specialNotes: payload.specialNotes,
      paymentType: payload.depositPaid ? 'deposit' : 'full',
      customerName: payload.customerName || payload.travellerName || '',
      customerEmail: payload.customerEmail || payload.travellerEmail || '',
      customerPhone: payload.customerPhone || payload.travellerPhone || '',
      emergencyContact: payload.emergencyContact,
      address: payload.address,
      gender: payload.gender,
      age: payload.age,
    });

    const b = res.data?.data?.booking || res.data?.booking || res.data;
    if (!b) {
      throw new Error(res.data?.message || 'Failed to create booking reservation');
    }

    // Auto-confirm payment if advance or token provided
    let finalBooking = b;
    if (payload.paymentMethod) {
      try {
        const payRes = await apiClient.post<any>(`/car-bookings/${b._id || b.bookingId}/pay`, {
          paymentMethod: payload.paymentMethod || 'upi',
          transactionId: `TXN-${Date.now()}`,
        });
        if (payRes.data?.data?.booking || payRes.data?.booking) {
          finalBooking = payRes.data?.data?.booking || payRes.data?.booking;
        }
      } catch (payErr) {
        console.warn('Payment record warning:', payErr);
      }
    }

    const mappedBooking: CarRentalBooking = {
      id: finalBooking?.bookingId || finalBooking?._id || '',
      vehicleId: finalBooking?.carId?._id || finalBooking?.carId || payload.vehicleId || '',
      vehicleName: payload.vehicleName || finalBooking?.carId?.name || 'Vehicle',
      vehicleImage: payload.vehicleImage || finalBooking?.carId?.thumbnail || '',
      providerId: finalBooking?.agencyId?._id || finalBooking?.agencyId || payload.providerId || '',
      providerName: payload.providerName || finalBooking?.agencyId?.name || '',
      pickupLocation: finalBooking?.pickupLocation || payload.pickupLocation || '',
      dropLocation: finalBooking?.dropLocation || payload.dropLocation || '',
      startDate: finalBooking?.startDate || payload.startDate || '',
      endDate: finalBooking?.endDate || payload.endDate || '',
      pickupTime: finalBooking?.pickupTime || payload.pickupTime || '',
      tripType: finalBooking?.tripType || payload.tripType || 'one_way',
      totalDays: finalBooking?.totalDays || payload.totalDays || 1,
      passengersCount: finalBooking?.passengersCount || payload.passengersCount || 2,
      totalAmount: finalBooking?.totalAmount || payload.totalAmount || 0,
      depositPaid: finalBooking?.depositPaid || payload.depositPaid || 0,
      status: finalBooking?.bookingStatus || finalBooking?.status || 'REQUESTED',
      createdAt: finalBooking?.createdAt || new Date().toISOString(),
      customerName: finalBooking?.customerName || payload.customerName || '',
      customerEmail: finalBooking?.customerEmail || payload.customerEmail || '',
      customerPhone: finalBooking?.customerPhone || payload.customerPhone || '',
    };
    return { success: true, booking: mappedBooking };
  }

  async initChat(agencyId?: string, carId?: string, initialMessage?: string): Promise<{ conversationId?: string; id?: string }> {
    try {
      const res = await apiClient.post<any>('/chat/conversations', { agencyId, carId, initialMessage });
      return res.data?.data || res.data || {};
    } catch (err) {
      console.warn('CarRentalService: Failed to initialize chat', err);
      return {};
    }
  }

  // Favorites Management (MongoDB Backend + local fast cache)
  async getFavorites(): Promise<string[]> {
    try {
      const res = await apiClient.get<any>('/cars/favorites/my');
      const list = res.data?.cars || res.data?.data?.cars || [];
      if (Array.isArray(list)) {
        const ids = list.map((c: any) => c._id || c.id).filter(Boolean);
        try {
          localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
        } catch {}
        return ids;
      }
    } catch {
      // Offline fallback
    }
    return this.getCachedFavorites();
  }

  async toggleFavorite(vehicleId: string): Promise<boolean> {
    try {
      const res = await apiClient.post<any>(`/cars/${vehicleId}/favorite`);
      const isFav = res.data?.data?.isFavorite ?? res.data?.isFavorite;
      if (typeof isFav === 'boolean') {
        const current = this.getCachedFavorites();
        const updated = isFav ? [...current, vehicleId] : current.filter((id) => id !== vehicleId);
        try {
          localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
        } catch {}
        return isFav;
      }
    } catch (err) {
      console.warn('Failed to sync favorite with backend', err);
    }
    // Fallback locally
    const list = this.getCachedFavorites();
    const idx = list.indexOf(vehicleId);
    let isFav = false;
    if (idx > -1) {
      list.splice(idx, 1);
      isFav = false;
    } else {
      list.push(vehicleId);
      isFav = true;
    }
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(list));
    } catch {}
    return isFav;
  }

  getCachedFavorites(): string[] {
    try {
      const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  isFavorite(vehicleId: string): boolean {
    return this.getCachedFavorites().includes(vehicleId);
  }

  // Recently Viewed Vehicles
  getRecentlyViewed(): Vehicle[] {
    try {
      const raw = localStorage.getItem(RECENT_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  addToRecentlyViewed(vehicle: Vehicle): void {
    try {
      const current = this.getRecentlyViewed();
      const filtered = current.filter((v) => v.id !== vehicle.id);
      const updated = [vehicle, ...filtered].slice(0, 8);
      localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }

  // Reviews
  async getVehicleReviews(vehicleId: string, page = 1): Promise<VehicleReview[]> {
    try {
      if (!vehicleId || !/^[0-9a-fA-F]{24}$/.test(vehicleId)) {
        return [];
      }
      const res = await apiClient.get<any>(`/cars/${vehicleId}/reviews`, { params: { page, limit: 10 } });
      const list = res.data?.reviews || res.data?.data?.reviews || [];
      return list.map((r: any): VehicleReview => ({
        id: r._id || r.id,
        userName: r.customerName || r.userName || 'Traveller',
        userAvatar: r.customerAvatar || r.userAvatar || '',
        rating: r.rating || 0,
        date: r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '',
        comment: r.comment || '',
      }));
    } catch {
      return [];
    }
  }

  async reportListing(vehicleId: string, reason: string): Promise<boolean> {
    try {
      await apiClient.post(`/cars/${vehicleId}/report`, { reason });
      return true;
    } catch {
      return true;
    }
  }

  /**
   * Self-Drive Rental Search for Cars & Bikes
   */
  async searchRentals(params: {
    city?: string;
    location?: string;
    pickupDateTime?: string;
    returnDateTime?: string;
    vehicleType?: 'car' | 'bike' | 'all';
    serviceType?: string;
    fuel?: string;
    transmission?: string;
    seats?: number;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
  }): Promise<{ vehicles: Vehicle[]; pagination: any; searchParams: any }> {
    try {
      const res = await apiClient.get<any>('/cars/rentals/search', { params });
      const raw = res.data?.data || res.data || {};
      const list = raw.vehicles || [];
      return {
        vehicles: list.map(mapBackendCarToVehicle),
        pagination: raw.pagination || { page: 1, limit: 12, total: list.length, totalPages: 1 },
        searchParams: raw.searchParams || {},
      };
    } catch (err) {
      console.warn('Rental search failed, returning empty set:', err);
      return {
        vehicles: [],
        pagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
        searchParams: {},
      };
    }
  }

  /**
   * Get dynamic rental quote for specific vehicle & timeframe
   */
  async getRentalPriceEstimate(carId: string, pickupDateTime: string, returnDateTime: string): Promise<any> {
    const res = await apiClient.get<any>('/cars/rentals/estimate', {
      params: { carId, pickupDateTime, returnDateTime },
    });
    return res.data?.data || res.data;
  }

  /**
   * Create Self-Drive Rental Booking
   */
  async createRentalBooking(data: {
    carId: string;
    pickupDateTime: string;
    returnDateTime: string;
    pickupLocation: string;
    dropLocation?: string;
    paymentType?: 'full' | 'deposit';
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    specialNotes?: string;
    emergencyContact?: { name: string; phone: string; relationship?: string };
    address?: string;
    gender?: string;
    age?: number;
  }): Promise<any> {
    const res = await apiClient.post<any>('/car-bookings/rentals', data);
    return res.data?.data?.booking || res.data?.booking || res.data;
  }
}

export const carRentalService = new CarRentalService();
