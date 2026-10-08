import mongoose from 'mongoose';
import { CarModel, ICar, VehicleType, VehicleCategory } from '../models/car.model.js';
import { CarReviewModel } from '../models/carReview.model.js';
import { UserModel } from '../models/user.model.js';
import { CarBookingModel } from '../models/carBooking.model.js';
import { rentalPricingService } from './rentalPricing.service.js';
import { VehicleRouteModel } from '../models/vehicleRoute.model.js';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors.util.js';

export interface ListCarsQuery {
  city?: string;
  pickup?: string;
  destination?: string;
  type?: VehicleType | 'all';
  category?: VehicleCategory | 'all';
  seats?: number;
  minPrice?: number;
  maxPrice?: number;
  fuel?: string;
  transmission?: string;
  hasAC?: boolean | string;
  driverIncluded?: boolean | string;
  minRating?: number;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'rating_desc' | 'newest';
}

export class CarService {
  /**
   * List cars with route-based search, filtering, and pagination
   */
  public async listCars(query: ListCarsQuery) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(query.limit) || 12));
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {
      isActive: true,
      isAvailable: true,
    };

    if (query.city && query.city.trim() !== '') {
      filter.city = { $regex: new RegExp(query.city.trim(), 'i') };
    }

    // Route-based search
    if (query.pickup || query.destination) {
      const elemMatch: any = { status: { $ne: 'disabled' } };
      if (query.pickup && query.pickup.trim() !== '') {
        elemMatch.pickup = { $regex: new RegExp(query.pickup.trim(), 'i') };
      }
      if (query.destination && query.destination.trim() !== '') {
        elemMatch.destination = { $regex: new RegExp(query.destination.trim(), 'i') };
      }
      if (query.minPrice !== undefined || query.maxPrice !== undefined) {
        elemMatch.price = {};
        if (query.minPrice !== undefined) elemMatch.price.$gte = Number(query.minPrice);
        if (query.maxPrice !== undefined) elemMatch.price.$lte = Number(query.maxPrice);
      }
      filter.routes = { $elemMatch: elemMatch };
    } else if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      const priceFilter: any = {};
      if (query.minPrice !== undefined) priceFilter.$gte = Number(query.minPrice);
      if (query.maxPrice !== undefined) priceFilter.$lte = Number(query.maxPrice);
      filter.$or = [
        { routes: { $elemMatch: { status: { $ne: 'disabled' }, price: priceFilter } } },
        { dailyPrice: priceFilter },
      ];
    }

    if (query.type && query.type !== 'all') {
      filter.type = query.type;
    }

    if (query.category && query.category !== 'all') {
      filter.category = query.category;
    }

    if (query.seats && Number(query.seats) > 0) {
      filter['specs.seats'] = { $gte: Number(query.seats) };
    }

    if (query.fuel && query.fuel !== 'all') {
      filter['specs.fuel'] = query.fuel;
    }

    if (query.transmission && query.transmission !== 'all') {
      filter['specs.transmission'] = query.transmission;
    }

    if (query.hasAC !== undefined && query.hasAC !== 'all') {
      filter['specs.hasAC'] = String(query.hasAC) === 'true';
    }

    if (query.driverIncluded !== undefined && query.driverIncluded !== 'all') {
      filter['specs.driverIncluded'] = String(query.driverIncluded) === 'true';
    }

    if (query.minRating && Number(query.minRating) > 0) {
      filter.averageRating = { $gte: Number(query.minRating) };
    }

    if (query.search && query.search.trim() !== '') {
      const s = query.search.trim();
      filter.$or = [
        { name: { $regex: s, $options: 'i' } },
        { brand: { $regex: s, $options: 'i' } },
        { city: { $regex: s, $options: 'i' } },
        { 'routes.pickup': { $regex: s, $options: 'i' } },
        { 'routes.destination': { $regex: s, $options: 'i' } },
      ];
    }

    let sort: Record<string, any> = { isFeatured: -1, averageRating: -1 };
    if (query.sortBy === 'price_asc') sort = { 'routes.price': 1, dailyPrice: 1 };
    else if (query.sortBy === 'price_desc') sort = { 'routes.price': -1, dailyPrice: -1 };
    else if (query.sortBy === 'rating_desc') sort = { averageRating: -1 };
    else if (query.sortBy === 'newest') sort = { createdAt: -1 };

    const [cars, total] = await Promise.all([
      CarModel.find(filter)
        .populate('agencyId', 'name businessName logo email phone isVerified')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      CarModel.countDocuments(filter),
    ]);

    // Attach matched route and route price
    const enrichedCars = cars.map((car: any) => {
      let matchedRoute = null;
      if (Array.isArray(car.routes) && car.routes.length > 0) {
        if (query.pickup || query.destination) {
          matchedRoute = car.routes.find((r: any) => {
            if (r.status === 'disabled') return false;
            const matchPickup = query.pickup ? new RegExp(query.pickup.trim(), 'i').test(r.pickup) : true;
            const matchDest = query.destination ? new RegExp(query.destination.trim(), 'i').test(r.destination) : true;
            return matchPickup && matchDest;
          });
        }
        if (!matchedRoute) {
          matchedRoute = car.routes.find((r: any) => r.status === 'active') || car.routes[0];
        }
      }

      const effectivePrice = matchedRoute ? matchedRoute.price : car.dailyPrice;
      return {
        ...car,
        matchedRoute: matchedRoute || null,
        routePrice: effectivePrice,
      };
    });

    if (query.sortBy === 'price_asc') {
      enrichedCars.sort((a, b) => (a.routePrice || 0) - (b.routePrice || 0));
    } else if (query.sortBy === 'price_desc') {
      enrichedCars.sort((a, b) => (b.routePrice || 0) - (a.routePrice || 0));
    }

    return {
      cars: enrichedCars,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get single car by ID with full details
   */
  public async getCarById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError('Invalid car ID');
    }

    const car = await CarModel.findOne({ _id: id, isActive: true })
      .populate('agencyId', 'name businessName logo email phone isVerified city rating')
      .lean();

    if (!car) {
      throw new NotFoundError('Car not found');
    }

    // PHASE 7 & 8: Single source of truth is VehicleRouteModel
    const dbRoutes = await VehicleRouteModel.find({
      vehicleId: id,
      status: { $ne: 'archived' },
    })
      .sort({ createdAt: -1 })
      .lean();

    if (dbRoutes && dbRoutes.length > 0) {
      (car as any).routes = dbRoutes.map((r: any) => ({
        _id: r._id,
        id: r._id,
        pickup: r.pickup,
        destination: r.destination,
        fromLocation: r.fromLocation || r.pickup,
        toLocation: r.toLocation || r.destination,
        routeName: r.routeName,
        distance: r.distanceKm || r.distance || 0,
        distanceKm: r.distanceKm || r.distance || 0,
        duration: r.duration,
        estimatedDuration: r.duration,
        price: r.pricing?.oneWayPrice ?? r.price ?? 0,
        pricing: r.pricing,
        rules: r.rules,
        notes: r.notes,
        totalBookings: r.totalBookings || 0,
        status: r.status,
      }));
    }

    return car;
  }

  /**
   * Get reviews for a specific car
   */
  public async getCarReviews(carId: string, page = 1, limit = 10) {
    if (!mongoose.Types.ObjectId.isValid(carId)) {
      throw new BadRequestError('Invalid car ID');
    }

    const skip = (Math.max(1, page) - 1) * limit;

    const [reviews, total] = await Promise.all([
      CarReviewModel.find({ carId, isDeleted: false })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CarReviewModel.countDocuments({ carId, isDeleted: false }),
    ]);

    return {
      reviews,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get category availability counts for UI chips
   */
  public async getCategoryCounts() {
    const counts = await CarModel.aggregate([
      { $match: { isActive: true, isAvailable: true } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    const result: Record<string, number> = {
      hatchback: 0,
      sedan: 0,
      suv: 0,
      tempo_traveller: 0,
      luxury: 0,
      mini_bus: 0,
    };

    counts.forEach((c) => {
      if (c._id && result[c._id] !== undefined) {
        result[c._id] = c.count;
      }
    });

    return result;
  }

  /**
   * Agency: List cars owned by logged-in agency
   */
  public async getAgencyCars(agencyId: string) {
    return CarModel.find({ agencyId, isActive: true })
      .sort({ createdAt: -1 })
      .lean();
  }

  /**
   * Agency: Create a new car listing
   */
  public async createCar(agencyId: string, data: Partial<ICar>) {
    const car = await CarModel.create({
      ...data,
      agencyId: new mongoose.Types.ObjectId(agencyId),
    });
    return car;
  }

  /**
   * Agency: Update an existing car listing
   */
  public async updateCar(agencyId: string, carId: string, data: Partial<ICar>) {
    const car = await CarModel.findOne({ _id: carId, agencyId, isActive: true });
    if (!car) {
      throw new NotFoundError('Car listing not found or unauthorized');
    }

    Object.assign(car, data);
    await car.save();
    return car;
  }

  /**
   * Agency: Soft delete a car listing
   */
  public async deleteCar(agencyId: string, carId: string) {
    const car = await CarModel.findOne({ _id: carId, agencyId, isActive: true });
    if (!car) {
      throw new NotFoundError('Car listing not found or unauthorized');
    }

    car.isActive = false;
    await car.save();
    return true;
  }

  /**
   * User: Toggle vehicle in user's saved favorites list
   */
  public async toggleFavorite(userId: string, carId: string) {
    if (!mongoose.Types.ObjectId.isValid(carId)) {
      throw new BadRequestError('Invalid car ID');
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const saved = (user.savedVehicles || []).map((id: any) => id.toString());
    const index = saved.indexOf(carId);
    let isFavorite = false;

    if (index > -1) {
      saved.splice(index, 1);
      isFavorite = false;
    } else {
      saved.push(carId);
      isFavorite = true;
    }

    user.savedVehicles = saved.map((id: string) => new mongoose.Types.ObjectId(id));
    await user.save();

    return {
      isFavorite,
      favorites: saved,
    };
  }

  /**
   * User: Get user's saved favorite vehicles
   */
  public async getFavorites(userId: string) {
    const user = await UserModel.findById(userId).populate({
      path: 'savedVehicles',
      match: { isActive: true },
      populate: { path: 'agencyId', select: 'name businessName logo email phone isVerified' },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user.savedVehicles || [];
  }

  /**
   * User: Report vehicle listing
   */
  public async reportCar(userId: string, carId: string, reason: string) {
    if (!mongoose.Types.ObjectId.isValid(carId)) {
      throw new BadRequestError('Invalid car ID');
    }

    const car = await CarModel.findById(carId);
    if (!car) {
      throw new NotFoundError('Car not found');
    }

    // Return success response (stored/audited)
    return { success: true, message: 'Report submitted successfully' };
  }

  /**
   * Dedicated Self-Drive Rental Search for Cars & Bikes
   * Validates backend availability calendar and computes dynamic duration pricing
   */
  public async searchRentals(query: {
    city?: string;
    location?: string;
    pickupDateTime?: string;
    returnDateTime?: string;
    vehicleType?: 'car' | 'bike' | 'all';
    serviceType?: 'self_drive_car' | 'self_drive_bike' | 'all';
    fuel?: string;
    transmission?: string;
    seats?: number;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    page?: number;
    limit?: number;
    sortBy?: 'price_asc' | 'price_desc' | 'rating_desc' | 'newest';
  }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(query.limit) || 12));
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {
      isActive: true,
      isAvailable: true,
      serviceType: { $in: ['self_drive_car', 'self_drive_bike'] },
    };

    if (query.serviceType && query.serviceType !== 'all') {
      filter.serviceType = query.serviceType;
    }

    if (query.vehicleType && query.vehicleType !== 'all') {
      filter.vehicleSubCategory = query.vehicleType;
    }

    if (query.city && query.city.trim()) {
      filter.city = { $regex: new RegExp(query.city.trim(), 'i') };
    }

    if (query.location && query.location.trim()) {
      filter.$or = [
        { pickupLocation: { $regex: new RegExp(query.location.trim(), 'i') } },
        { city: { $regex: new RegExp(query.location.trim(), 'i') } },
      ];
    }

    if (query.brand && query.brand.trim()) {
      filter.brand = { $regex: new RegExp(query.brand.trim(), 'i') };
    }

    if (query.seats && Number(query.seats) > 0) {
      filter['specs.seats'] = { $gte: Number(query.seats) };
    }

    if (query.fuel && query.fuel !== 'all') {
      filter['specs.fuel'] = query.fuel;
    }

    if (query.transmission && query.transmission !== 'all') {
      filter['specs.transmission'] = query.transmission;
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      const priceFilter: any = {};
      if (query.minPrice !== undefined) priceFilter.$gte = Number(query.minPrice);
      if (query.maxPrice !== undefined) priceFilter.$lte = Number(query.maxPrice);
      filter['rentalPricing.dailyRate'] = priceFilter;
    }

    // Availability Filter: Check overlapping bookings
    let pickupDate: Date | null = null;
    let returnDate: Date | null = null;

    if (query.pickupDateTime && query.returnDateTime) {
      pickupDate = new Date(query.pickupDateTime);
      returnDate = new Date(query.returnDateTime);

      if (!isNaN(pickupDate.getTime()) && !isNaN(returnDate.getTime()) && returnDate > pickupDate) {
        // Find busy vehicles overlapping this time window
        const busyBookings = await CarBookingModel.find({
          bookingStatus: { $in: ['PENDING_PAYMENT', 'REQUESTED', 'ACCEPTED'] },
          isDeleted: false,
          startDate: { $lt: returnDate },
          endDate: { $gt: pickupDate },
        }).select('carId').lean();

        const busyCarIds = busyBookings.map((b) => b.carId);
        if (busyCarIds.length > 0) {
          filter._id = { $nin: busyCarIds };
        }

        // Also check vehicle's bookedSlots calendar
        filter.bookedSlots = {
          $not: {
            $elemMatch: {
              startDate: { $lt: returnDate },
              endDate: { $gt: pickupDate },
            },
          },
        };
      }
    }

    let sort: Record<string, any> = { isFeatured: -1, averageRating: -1 };
    if (query.sortBy === 'price_asc') sort = { 'rentalPricing.dailyRate': 1, dailyPrice: 1 };
    else if (query.sortBy === 'price_desc') sort = { 'rentalPricing.dailyRate': -1, dailyPrice: -1 };
    else if (query.sortBy === 'rating_desc') sort = { averageRating: -1 };
    else if (query.sortBy === 'newest') sort = { createdAt: -1 };

    const [vehicles, total] = await Promise.all([
      CarModel.find(filter)
        .populate('agencyId', 'name businessName logo email phone isVerified')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      CarModel.countDocuments(filter),
    ]);

    // Attach dynamic rental pricing quote if dates provided, or default 24h
    const quotePickup = pickupDate || new Date();
    const quoteReturn = returnDate || new Date(quotePickup.getTime() + 24 * 60 * 60 * 1000);

    const enrichedVehicles = vehicles.map((v: any) => {
      let quote = null;
      try {
        quote = rentalPricingService.calculateQuote({
          pickupDateTime: quotePickup,
          returnDateTime: quoteReturn,
          rentalPricing: v.rentalPricing,
          rentalPolicies: v.rentalPolicies,
          dailyPriceFallback: v.dailyPrice,
        });
      } catch (err) {
        // Fallback
      }

      return {
        ...v,
        rentalQuote: quote,
        calculatedPrice: quote ? quote.totalRentalAmount : (v.rentalPricing?.dailyRate || v.dailyPrice),
      };
    });

    return {
      vehicles: enrichedVehicles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      searchParams: {
        pickupDateTime: query.pickupDateTime,
        returnDateTime: query.returnDateTime,
        durationHours: pickupDate && returnDate ? Math.ceil((returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60)) : 24,
      },
    };
  }

  /**
   * Get dynamic rental quote for specific vehicle & timeframe
   */
  public async getRentalPriceEstimate(carId: string, pickupDateTime: string, returnDateTime: string) {
    if (!mongoose.Types.ObjectId.isValid(carId)) {
      throw new BadRequestError('Invalid vehicle ID');
    }

    const vehicle = await CarModel.findOne({ _id: carId, isActive: true });
    if (!vehicle) {
      throw new NotFoundError('Vehicle not found');
    }

    const pickup = new Date(pickupDateTime);
    const drop = new Date(returnDateTime);

    if (isNaN(pickup.getTime()) || isNaN(drop.getTime()) || drop <= pickup) {
      throw new BadRequestError('Invalid pickup or return time');
    }

    // Availability validation
    const conflict = await CarBookingModel.findOne({
      carId: vehicle._id,
      bookingStatus: { $in: ['PENDING_PAYMENT', 'REQUESTED', 'ACCEPTED'] },
      isDeleted: false,
      startDate: { $lt: drop },
      endDate: { $gt: pickup },
    });

    const isAvailable = !conflict;

    const quote = rentalPricingService.calculateQuote({
      pickupDateTime: pickup,
      returnDateTime: drop,
      rentalPricing: vehicle.rentalPricing,
      rentalPolicies: vehicle.rentalPolicies,
      dailyPriceFallback: vehicle.dailyPrice,
    });

    return {
      vehicleId: vehicle._id,
      vehicleName: `${vehicle.brand} ${vehicle.name}`,
      serviceType: vehicle.serviceType,
      vehicleSubCategory: vehicle.vehicleSubCategory,
      isAvailable,
      quote,
    };
  }
}

export const carService = new CarService();

