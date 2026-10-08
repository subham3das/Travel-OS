import mongoose from 'mongoose';
import { AgencyModel, IAgency } from '../models/agency.model.js';
import { CarModel } from '../models/car.model.js';
import { VehicleRouteModel, IVehicleRoute } from '../models/vehicleRoute.model.js';
import { DriverModel } from '../models/driver.model.js';
import { CarBookingModel } from '../models/carBooking.model.js';
import { CarReviewModel } from '../models/carReview.model.js';
import { NotificationModel } from '../models/notification.model.js';
import { AuditLoggerService } from './auditLogger.service.js';
import bcrypt from 'bcrypt';
import { TokenUtil } from '../utils/token.util.js';
import { carBookingService } from './carBooking.service.js';
import { NotFoundError, BadRequestError, ConflictError, ForbiddenError } from '../utils/errors.util.js';
import { sellerPaymentProfileService } from './sellerPaymentProfile.service.js';
import { socketService } from './socket.service.js';
import { logger } from '../config/logger.config.js';

export interface RegisterCarRentalDTO {
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
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
  documents?: any[];
  bankDetails?: {
    accountHolderName?: string;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    upiId?: string;
  };
}

export interface StandaloneCarRentalOnboardingDTO extends RegisterCarRentalDTO {
  legalBusinessName?: string;
  password?: string;
}

export class AgencyCarRentalService {
  /**
   * 0. Standalone Onboarding for new Car Rental Providers (unauthenticated entry)
   */
  public async onboardStandaloneCarRentalPartner(data: StandaloneCarRentalOnboardingDTO) {
    const cleanEmail = (data.email || '').trim().toLowerCase();
    if (!cleanEmail) {
      throw new BadRequestError('Email address is required.');
    }
    if (!data.businessName || !data.businessName.trim()) {
      throw new BadRequestError('Car Rental business name is required.');
    }
    if (!data.phone || !data.phone.trim()) {
      throw new BadRequestError('Phone number is required.');
    }

    // Check for existing active agency with this email
    const existing = await AgencyModel.findOne({
      $or: [{ email: cleanEmail }, { 'owner.email': cleanEmail }, { loginEmail: cleanEmail }],
      status: { $in: ['ACTIVE', 'APPROVED'] },
      isDeleted: false,
    });

    if (existing) {
      throw new ConflictError('A partner account with this email address already exists. Please log in.');
    }

    const saltRounds = 10;
    const rawPassword = data.password && data.password.trim() ? data.password.trim() : 'ApnaTrip@2026';
    const passwordHash = await bcrypt.hash(rawPassword, saltRounds);

    const generatedAppId = `ATP-CR-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const newAgency = new AgencyModel({
      applicationId: generatedAppId,
      name: data.businessName.trim(),
      agencyDisplayName: data.businessName.trim(),
      legalBusinessName: (data.legalBusinessName || data.businessName).trim(),
      email: cleanEmail,
      loginEmail: cleanEmail,
      phone: data.phone.trim(),
      ownerName: data.ownerName || 'Fleet Partner',
      owner: {
        name: data.ownerName || 'Fleet Partner',
        email: cleanEmail,
        phone: data.phone.trim(),
      },
      businessAddress: data.address || '',
      city: data.city || 'Mumbai',
      state: data.state || 'Maharashtra',
      country: data.country || 'India',
      pinCode: data.pinCode || '',
      panNumber: data.panNumber || '',
      gstNumber: data.gstNumber || '',
      businessTypes: ['car_rental'],
      activeBusiness: 'car_rental',
      verificationStatus: 'PENDING',
      carRentalVerificationStatus: 'PENDING',
      status: 'PENDING',
      passwordHash,
      passwordChanged: true,
      carRentalProfile: {
        businessName: data.businessName.trim(),
        ownerName: data.ownerName || 'Fleet Partner',
        phone: data.phone.trim(),
        email: cleanEmail,
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        country: data.country || 'India',
        pinCode: data.pinCode || '',
        panNumber: data.panNumber || '',
        gstNumber: data.gstNumber || '',
        businessLicenseNumber: data.businessLicenseNumber || '',
        profilePhotoUrl: data.profilePhotoUrl || '',
        coverPhotoUrl: data.coverPhotoUrl || '',
        description: data.description || 'Premier commercial fleet provider on ApnaTrip.',
        workingHours: data.workingHours || '24/7 Operations',
        emergencyContact: data.emergencyContact || data.phone || '',
        fleetSize: Number(data.fleetSize) || 1,
        operatingCities: data.operatingCities || (data.city ? [data.city] : ['All India']),
        documents: (data.documents || []).map((doc, idx) => ({
          id: doc.id || `cr-doc-${Date.now()}-${idx}`,
          name: doc.name || 'Commercial Vehicle Permit',
          type: doc.type || 'Commercial License',
          status: 'Pending',
          fileUrl: doc.fileUrl || '',
          uploadedAt: new Date().toISOString(),
        })),
        bankDetails: data.bankDetails || {},
      },
    });

    await newAgency.save();

    // Log audit log
    await AuditLoggerService.log({
      actor: {
        id: newAgency._id.toString(),
        name: newAgency.name,
        email: newAgency.email,
        role: 'Agency',
      },
      module: 'CarRental',
      action: 'Standalone Car Rental Onboarding Submitted',
      eventType: 'CAR_RENTAL_STANDALONE_ONBOARDED',
      description: `New Car Rental Provider "${newAgency.name}" completed standalone onboarding (App ID: ${generatedAppId}).`,
      severity: 'Low',
      status: 'Success',
      metadata: {
        agencyId: newAgency._id.toString(),
        applicationId: generatedAppId,
      },
    });

    // Notify admin
    try {
      await NotificationModel.create({
        recipientType: 'ADMIN',
        category: 'agency',
        title: 'New Car Rental Provider Application',
        description: `Car Rental Partner "${newAgency.name}" (${generatedAppId}) submitted an application.`,
        priority: 'HIGH',
        status: 'UNREAD',
        isUnread: true,
        targetRoute: '/admin/verification-pending',
        relatedEntityType: 'Agency',
        relatedEntityId: newAgency._id.toString(),
      });
    } catch (err) {
      logger.error('Failed to notify admin of standalone car rental registration', err);
    }

    // Generate JWT token
    const token = TokenUtil.signAccessToken({
      userId: newAgency._id.toString(),
      agencyId: newAgency._id.toString(),
      customAgencyId: newAgency.agencyId,
      email: cleanEmail,
      userType: 'agency',
      role: 'owner',
    });

    const user = {
      id: `ag-usr-${newAgency._id.toString().slice(-6)}`,
      agencyId: newAgency._id.toString(),
      customAgencyId: newAgency.agencyId,
      name: newAgency.ownerName,
      email: cleanEmail,
      phone: newAgency.phone,
      role: 'owner',
      isActive: true,
    };

    return {
      token,
      user,
      agency: newAgency,
      applicationId: generatedAppId,
    };
  }

  /**
   * 1. Register or submit Car Rental profile for logged-in agency
   */
  public async registerCarRental(agencyId: string, data: RegisterCarRentalDTO): Promise<IAgency> {
    const agency = await AgencyModel.findOne({ _id: agencyId, isDeleted: false });
    if (!agency) {
      throw new NotFoundError('Agency account not found.');
    }

    const currentTypes = agency.businessTypes || ['agency'];
    if (!currentTypes.includes('car_rental')) {
      currentTypes.push('car_rental');
    }

    agency.businessTypes = currentTypes;
    agency.carRentalVerificationStatus = 'PENDING';
    agency.carRentalProfile = {
      businessName: data.businessName || agency.name || 'Car Rental Service',
      ownerName: data.ownerName || agency.ownerName || agency.owner?.name || 'Fleet Owner',
      phone: data.phone || agency.phone || '',
      email: (data.email || agency.email || '').toLowerCase(),
      address: data.address || agency.businessAddress || '',
      city: data.city || agency.city || '',
      state: data.state || agency.state || '',
      country: data.country || agency.country || 'India',
      pinCode: data.pinCode || agency.pinCode || '',
      panNumber: data.panNumber || agency.panNumber || '',
      gstNumber: data.gstNumber || agency.gstNumber || '',
      businessLicenseNumber: data.businessLicenseNumber || '',
      profilePhotoUrl: data.profilePhotoUrl || agency.logo || '',
      coverPhotoUrl: data.coverPhotoUrl || agency.banner || '',
      description: data.description || agency.description || '',
      workingHours: data.workingHours || '09:00 AM - 08:00 PM',
      emergencyContact: data.emergencyContact || agency.emergencyContact || '',
      fleetSize: Number(data.fleetSize) || 1,
      operatingCities: data.operatingCities || (agency.city ? [agency.city] : ['All India']),
      documents: (data.documents || []).map((doc, idx) => ({
        id: doc.id || `cr-doc-${Date.now()}-${idx}`,
        name: doc.name || 'Commercial Vehicle Document',
        type: doc.type || 'License',
        status: 'Pending',
        fileUrl: doc.fileUrl || '',
        uploadedAt: new Date().toISOString(),
      })),
      bankDetails: data.bankDetails || {
        accountHolderName: agency.bankDetails?.accountHolderName || '',
        bankName: agency.bankDetails?.bankName || '',
        accountNumber: agency.bankDetails?.accountNumber || '',
        ifscCode: agency.bankDetails?.ifscCode || '',
        upiId: agency.bankDetails?.upiId || '',
      },
    };

    await agency.save();

    // Log administrative audit trail
    await AuditLoggerService.log({
      actor: {
        id: agency._id.toString(),
        name: agency.name,
        email: agency.email,
        role: 'Agency',
      },
      module: 'CarRental',
      action: 'Car Rental Business Registered',
      eventType: 'AGENCY_CAR_RENTAL_REGISTERED',
      description: `Agency "${agency.name}" registered their Car Rental business vertical (Status: PENDING).`,
      severity: 'Low',
      status: 'Success',
      metadata: {
        agencyId: agency._id.toString(),
        businessName: data.businessName,
      },
    });

    // Notify Super Admin
    try {
      await NotificationModel.create({
        recipientType: 'ADMIN',
        category: 'agency',
        title: 'New Car Rental Application',
        description: `Partner "${agency.name}" has applied for Car Rental business verification.`,
        priority: 'HIGH',
        status: 'UNREAD',
        isUnread: true,
        targetRoute: '/admin/verification-pending',
        relatedEntityType: 'Agency',
        relatedEntityId: agency._id.toString(),
      });
    } catch (err) {
      logger.error('Failed to notify admin on car rental registration', err);
    }

    return agency;
  }

  /**
   * 2. Get Car Rental profile & verification status
   */
  public async getCarRentalProfile(agencyId: string) {
    const agency = await AgencyModel.findOne({ _id: agencyId, isDeleted: false });
    if (!agency) {
      throw new NotFoundError('Agency account not found.');
    }

    return {
      agencyId: agency._id,
      applicationId: agency.applicationId,
      name: agency.name,
      businessTypes: agency.businessTypes || ['agency'],
      activeBusiness: agency.activeBusiness || 'agency',
      carRentalVerificationStatus: agency.carRentalVerificationStatus || 'NOT_REGISTERED',
      carRentalProfile: agency.carRentalProfile || null,
      carRentalApprovedAt: agency.carRentalApprovedAt,
      carRentalRejectionReason: agency.carRentalRejectionReason,
    };
  }

  /**
   * 3. Update Car Rental Profile
   */
  public async updateCarRentalProfile(agencyId: string, updateData: Partial<RegisterCarRentalDTO>) {
    const agency = await AgencyModel.findOne({ _id: agencyId, isDeleted: false });
    if (!agency) {
      throw new NotFoundError('Agency account not found.');
    }

    agency.carRentalProfile = {
      ...(agency.carRentalProfile || {}),
      ...updateData,
    };

    await agency.save();
    return agency.carRentalProfile;
  }

  /**
   * 4. Switch active business session
   */
  public async switchActiveBusiness(agencyId: string, business: 'agency' | 'car_rental') {
    const agency = await AgencyModel.findOne({ _id: agencyId, isDeleted: false });
    if (!agency) {
      throw new NotFoundError('Agency account not found.');
    }

    if (business === 'car_rental') {
      const isRegistered = agency.carRentalVerificationStatus && agency.carRentalVerificationStatus !== 'NOT_REGISTERED';
      if (!isRegistered) {
        return {
          activeBusiness: 'agency',
          needsRegistration: true,
          carRentalVerificationStatus: 'NOT_REGISTERED',
        };
      }
    }

    agency.activeBusiness = business;
    await agency.save();

    return {
      activeBusiness: agency.activeBusiness,
      carRentalVerificationStatus: agency.carRentalVerificationStatus || 'NOT_REGISTERED',
      needsRegistration: false,
    };
  }

  /**
   * 5. Dashboard KPI telemetry for Car Rental operations
   */
  public async getDashboardStats(agencyId: string) {
    const agencyObjectId = new mongoose.Types.ObjectId(agencyId);

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const [cars, bookings, driversCount] = await Promise.all([
      CarModel.find({ agencyId: agencyObjectId, isActive: true }).lean(),
      CarBookingModel.find({ agencyId: agencyObjectId, isDeleted: false })
        .populate('carId', 'name brand type category dailyPrice images thumbnail registrationNumber')
        .sort({ createdAt: -1 })
        .lean(),
      DriverModel.countDocuments({ agencyId: agencyObjectId, status: { $ne: 'suspended' } }),
    ]);

    const totalCars = cars.length;
    const availableCars = cars.filter((c) => c.isAvailable && c.status !== 'maintenance').length;

    let totalRevenue = 0;
    let advanceCollected = 0;
    let activeRentals = 0;
    let pendingRequests = 0;
    let completedRentals = 0;
    let bookedTodayCount = 0;

    const todaySchedule: any[] = [];
    const customerMap = new Map<string, any>();

    bookings.forEach((b: any) => {
      const bTotal = b.totalAmount || 0;
      const bDeposit = b.depositPaid || 0;

      if (b.bookingStatus === 'ACCEPTED' || b.bookingStatus === 'COMPLETED') {
        totalRevenue += bTotal;
        advanceCollected += bDeposit;
      }
      if (b.bookingStatus === 'ACCEPTED') activeRentals++;
      if (b.bookingStatus === 'REQUESTED') pendingRequests++;
      if (b.bookingStatus === 'COMPLETED') completedRentals++;

      // Check if active or booked today
      const start = new Date(b.startDate);
      const end = new Date(b.endDate);
      if (start <= endOfToday && end >= startOfToday && b.bookingStatus !== 'CANCELLED' && b.bookingStatus !== 'REJECTED') {
        bookedTodayCount++;
        if (todaySchedule.length < 5) {
          todaySchedule.push({
            bookingId: b.bookingId,
            customerName: b.customerName,
            customerPhone: b.customerPhone,
            pickupLocation: b.pickupLocation,
            dropLocation: b.dropLocation,
            pickupTime: b.pickupTime || '10:00 AM',
            vehicle: b.carId ? `${b.carId.brand} ${b.carId.name}` : 'Rental Vehicle',
            status: b.bookingStatus,
          });
        }
      }

      // Track customers
      if (b.customerEmail && !customerMap.has(b.customerEmail)) {
        customerMap.set(b.customerEmail, {
          name: b.customerName,
          email: b.customerEmail,
          phone: b.customerPhone,
          lastBookingDate: b.createdAt,
          totalSpent: bTotal,
          vehicle: b.carId ? `${b.carId.brand} ${b.carId.name}` : 'Fleet Vehicle',
        });
      }
    });

    const utilizationRate = totalCars > 0 ? Math.min(100, Math.round((activeRentals / totalCars) * 100)) : 0;

    // Top vehicles sorted by trips or rating
    const topVehicles = cars
      .slice(0, 5)
      .map((car) => ({
        id: car._id,
        name: `${car.brand} ${car.name}`,
        type: car.type,
        dailyPrice: car.dailyPrice ?? car.routePricing?.oneWayPrice ?? 1500,
        rating: car.averageRating || 4.8,
        tripsCount: car.totalTrips || car.driver?.tripsCount || 12,
        revenue: car.totalRevenue || ((car.dailyPrice ?? car.routePricing?.oneWayPrice ?? 1500) * (car.totalTrips || 8)),
        thumbnail: car.thumbnail || car.images?.[0] || '',
        status: car.status || (car.isAvailable ? 'available' : 'booked'),
      }));

    return {
      // 6 Core Metrics for Dashboard
      totalVehicles: totalCars,
      availableVehicles: availableCars,
      bookedTodayCount,
      totalRevenue,
      pendingRequestsCount: pendingRequests,
      totalDriversCount: driversCount || cars.filter((c) => c.driver?.name).length,

      // Charts & Telemetry
      utilizationRate,
      topVehicles,
      recentCustomers: Array.from(customerMap.values()).slice(0, 5),
      todaySchedule,

      // Legacy structures for full compatibility
      fleetStats: {
        totalCars,
        activeCars: availableCars,
        utilizationRate,
      },
      serviceBreakdown: {
        driverBookingCars: cars.filter((c) => !c.serviceType || c.serviceType === 'driver_booking').length,
        selfDriveCars: cars.filter((c) => c.serviceType === 'self_drive_car').length,
        selfDriveBikes: cars.filter((c) => c.serviceType === 'self_drive_bike' || c.vehicleSubCategory === 'bike').length,
      },
      bookingStats: {
        totalBookings: bookings.length,
        activeRentals,
        pendingRequests,
        completedRentals,
      },
      financialStats: {
        totalRevenue,
        advanceCollected,
        remainingDue: Math.max(0, totalRevenue - advanceCollected),
      },
      recentBookings: bookings.slice(0, 6),
    };
  }

  /**
   * Helper to validate and sanitize vehicle payloads based on serviceType
   * Enforces strict business model separation (Phase 6 & Phase 10)
   */
  private validateAndSanitizeVehiclePayload(data: any, isUpdate = false) {
    const rawType = data.serviceType || (isUpdate ? undefined : 'ROUTE_BOOKING');
    let serviceType: 'ROUTE_BOOKING' | 'SELF_DRIVE_RENTAL' | undefined;
    if (rawType) {
      if (rawType === 'ROUTE_BOOKING' || rawType === 'driver_booking') {
        serviceType = 'ROUTE_BOOKING';
      } else if (rawType === 'SELF_DRIVE_RENTAL' || rawType === 'self_drive_car' || rawType === 'self_drive_bike') {
        serviceType = 'SELF_DRIVE_RENTAL';
      } else {
        serviceType = rawType;
      }
    }

    if (serviceType === 'ROUTE_BOOKING') {
      const forbiddenRentalFields: string[] = [];
      if (data.dailyPrice !== undefined && data.dailyPrice !== null && Number(data.dailyPrice) > 0) {
        forbiddenRentalFields.push('Daily Tariff (dailyPrice)');
      }
      if (data.fixedDepositAmount !== undefined && data.fixedDepositAmount !== null && Number(data.fixedDepositAmount) > 0) {
        forbiddenRentalFields.push('Security Deposit (fixedDepositAmount)');
      }
      if (data.rentalPricing && Object.keys(data.rentalPricing).length > 0) {
        const rp = data.rentalPricing;
        if (rp.hourlyRate || rp.dailyRate || rp.weeklyRate || rp.monthlyRate) {
          forbiddenRentalFields.push('Rental Pricing (hourlyRate, dailyRate, weeklyRate, monthlyRate)');
        }
      }
      if (data.rentalPolicies && Object.keys(data.rentalPolicies).length > 0) {
        const pol = data.rentalPolicies;
        if (pol.securityDeposit || pol.minRentalDurationHours || pol.maxRentalDurationDays || pol.fuelPolicy || pol.lateReturnChargePerHour) {
          forbiddenRentalFields.push('Rental Duration / Policies');
        }
      }

      if (forbiddenRentalFields.length > 0) {
        throw new BadRequestError(
          `Payload contains invalid fields for ROUTE_BOOKING: ${forbiddenRentalFields.join(', ')}. Route bookings cannot include daily tariff, security deposit, hourly tariff, or rental duration packages.`
        );
      }

      // Cleanup cross-model fields & strip vehicle-level route pricing (managed per route)
      delete data.rentalPricing;
      delete data.rentalPolicies;
      delete data.fixedDepositAmount;
      delete data.routePricing;
      delete data.oneWayPrice;
      delete data.roundTripPrice;
      data.dailyPrice = 0;
      data.serviceType = 'ROUTE_BOOKING';
    } else if (serviceType === 'SELF_DRIVE_RENTAL') {
      const forbiddenRouteFields: string[] = [];
      if (data.routePricing && Object.keys(data.routePricing).length > 0) {
        const rp = data.routePricing;
        if (rp.oneWayPrice || rp.roundTripPrice || rp.waitingChargePerHour || rp.nightCharge || rp.driverAllowancePerDay) {
          forbiddenRouteFields.push('Route Pricing (oneWayPrice, roundTripPrice, waitingCharge, nightCharge, driverAllowance)');
        }
      }
      if (data.oneWayPrice !== undefined && data.oneWayPrice !== null && Number(data.oneWayPrice) > 0) {
        forbiddenRouteFields.push('One Way Fare');
      }
      if (data.roundTripPrice !== undefined && data.roundTripPrice !== null && Number(data.roundTripPrice) > 0) {
        forbiddenRouteFields.push('Round Trip Fare');
      }
      if (Array.isArray(data.routes) && data.routes.length > 0) {
        forbiddenRouteFields.push('Supported Routes (routes)');
      }

      if (forbiddenRouteFields.length > 0) {
        throw new BadRequestError(
          `Payload contains invalid fields for SELF_DRIVE_RENTAL: ${forbiddenRouteFields.join(', ')}. Self-Drive rentals cannot include route fares, round-trip fares, waiting charges, or route configurations.`
        );
      }

      // Cleanup cross-model fields
      delete data.routePricing;
      delete data.routes;
      delete data.driver;
      data.serviceType = 'SELF_DRIVE_RENTAL';
    }

    return { serviceType, sanitizedData: data };
  }

  /**
   * Sanitizes output vehicle record to prevent mixed pricing models (Phase 10)
   */
  public sanitizeVehicleOutput(car: any) {
    if (!car) return car;
    const isSelfDrive =
      car.serviceType === 'SELF_DRIVE_RENTAL' ||
      car.serviceType === 'self_drive_car' ||
      car.serviceType === 'self_drive_bike';

    if (isSelfDrive) {
      car.serviceType = 'SELF_DRIVE_RENTAL';
      delete car.routePricing;
      delete car.routes;
      delete car.driver;
    } else {
      car.serviceType = 'ROUTE_BOOKING';
      delete car.rentalPricing;
      delete car.rentalPolicies;
      delete car.fixedDepositAmount;
    }
    return car;
  }

  /**
   * 6. Vehicles / Fleet Directory
   */
  public async getVehicles(agencyId: string, filter?: any) {
    const agencyObjectId = new mongoose.Types.ObjectId(agencyId);
    const query: any = { agencyId: agencyObjectId, isActive: true };

    if (filter?.serviceType && filter.serviceType !== 'all') {
      if (filter.serviceType === 'ROUTE_BOOKING' || filter.serviceType === 'driver_booking') {
        query.serviceType = { $in: ['ROUTE_BOOKING', 'driver_booking'] };
      } else if (
        filter.serviceType === 'SELF_DRIVE_RENTAL' ||
        filter.serviceType === 'self_drive_car' ||
        filter.serviceType === 'self_drive_bike'
      ) {
        query.serviceType = { $in: ['SELF_DRIVE_RENTAL', 'self_drive_car', 'self_drive_bike'] };
      } else {
        query.serviceType = filter.serviceType;
      }
    }
    if (filter?.vehicleSubCategory && filter.vehicleSubCategory !== 'all') {
      query.vehicleSubCategory = filter.vehicleSubCategory;
    }
    if (filter?.type && filter.type !== 'all') {
      query.type = filter.type;
    }
    if (filter?.status && filter.status !== 'all') {
      if (filter.status === 'available') query.isAvailable = true;
      if (filter.status === 'booked') query.isAvailable = false;
      if (filter.status === 'maintenance') query.status = 'maintenance';
    }

    const cars = await CarModel.find(query).sort({ createdAt: -1 }).lean();
    return cars.map((car: any) => this.sanitizeVehicleOutput(car));
  }

  /**
   * 7. Vehicle Details Dossier
   */
  public async getVehicleById(agencyId: string, carId: string) {
    const agencyObjectId = new mongoose.Types.ObjectId(agencyId);
    const carObjectId = new mongoose.Types.ObjectId(carId);

    const car = await CarModel.findOne({ _id: carObjectId, agencyId: agencyObjectId, isActive: true }).lean();
    if (!car) {
      throw new NotFoundError('Vehicle not found in your fleet inventory.');
    }

    const [bookings, reviews] = await Promise.all([
      CarBookingModel.find({ carId: carObjectId, isDeleted: false })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      CarReviewModel.find({ carId: carObjectId }).sort({ createdAt: -1 }).limit(10).lean(),
    ]);

    return {
      ...this.sanitizeVehicleOutput(car),
      bookingHistory: bookings,
      reviews,
    };
  }

  /**
   * 8. Create Vehicle Listing
   */
  public async createVehicle(agencyId: string, data: any) {
    if (data.isAvailable !== false) {
      const payoutCheck = await sellerPaymentProfileService.isSellerPayoutReady(agencyId, 'Car Rental');
      if (!payoutCheck.ready) {
        throw new ForbiddenError(payoutCheck.reason || 'Complete your payout account setup before publishing this car.');
      }
    }

    const { serviceType, sanitizedData } = this.validateAndSanitizeVehiclePayload(data, false);
    const agencyObjectId = new mongoose.Types.ObjectId(agencyId);

    const isSelfDrive = serviceType === 'SELF_DRIVE_RENTAL';
    const isBike = sanitizedData.vehicleSubCategory === 'bike';

    const car = new CarModel({
      ...sanitizedData,
      agencyId: agencyObjectId,
      serviceType: isSelfDrive ? 'SELF_DRIVE_RENTAL' : 'ROUTE_BOOKING',
      vehicleSubCategory: isBike ? 'bike' : 'car',
      pickupLocation: sanitizedData.pickupLocation || sanitizedData.city || '',
      dailyPrice: isSelfDrive ? Number(sanitizedData.dailyPrice || sanitizedData.rentalPricing?.dailyRate || 1500) : 0,
      routePricing: !isSelfDrive && sanitizedData.routePricing ? {
        oneWayPrice: Number(sanitizedData.routePricing.oneWayPrice || 1500),
        roundTripPrice: sanitizedData.routePricing.roundTripPrice ? Number(sanitizedData.routePricing.roundTripPrice) : undefined,
        extraKmCharge: Number(sanitizedData.routePricing.extraKmCharge ?? 12),
        waitingChargePerHour: sanitizedData.routePricing.waitingChargePerHour ? Number(sanitizedData.routePricing.waitingChargePerHour) : undefined,
        nightCharge: sanitizedData.routePricing.nightCharge ? Number(sanitizedData.routePricing.nightCharge) : undefined,
        driverAllowancePerDay: sanitizedData.routePricing.driverAllowancePerDay ? Number(sanitizedData.routePricing.driverAllowancePerDay) : undefined,
        tollIncluded: Boolean(sanitizedData.routePricing.tollIncluded),
        parkingIncluded: Boolean(sanitizedData.routePricing.parkingIncluded),
        stateTaxIncluded: Boolean(sanitizedData.routePricing.stateTaxIncluded),
        maxDistanceKm: sanitizedData.routePricing.maxDistanceKm ? Number(sanitizedData.routePricing.maxDistanceKm) : undefined,
        minBookingHours: sanitizedData.routePricing.minBookingHours ? Number(sanitizedData.routePricing.minBookingHours) : undefined,
        advanceBookingHours: sanitizedData.routePricing.advanceBookingHours ? Number(sanitizedData.routePricing.advanceBookingHours) : undefined,
      } : undefined,
      rentalPricing: isSelfDrive && sanitizedData.rentalPricing ? {
        hourlyRate: sanitizedData.rentalPricing.hourlyRate ? Number(sanitizedData.rentalPricing.hourlyRate) : undefined,
        dailyRate: Number(sanitizedData.rentalPricing.dailyRate || 1500),
        weeklyRate: sanitizedData.rentalPricing.weeklyRate ? Number(sanitizedData.rentalPricing.weeklyRate) : undefined,
        monthlyRate: sanitizedData.rentalPricing.monthlyRate ? Number(sanitizedData.rentalPricing.monthlyRate) : undefined,
      } : undefined,
      rentalPolicies: isSelfDrive && sanitizedData.rentalPolicies ? {
        securityDeposit: Number(sanitizedData.rentalPolicies.securityDeposit ?? 3000),
        includedKmPerDay: Number(sanitizedData.rentalPolicies.includedKmPerDay ?? 300),
        extraKmCharge: Number(sanitizedData.rentalPolicies.extraKmCharge ?? 12),
        fuelPolicy: sanitizedData.rentalPolicies.fuelPolicy || 'same_to_same',
        minRentalDurationHours: Number(sanitizedData.rentalPolicies.minRentalDurationHours ?? 4),
        maxRentalDurationDays: Number(sanitizedData.rentalPolicies.maxRentalDurationDays ?? 90),
      } : undefined,
      isAvailable: sanitizedData.isAvailable ?? true,
      isActive: true,
      specs: {
        seats: Number(sanitizedData.specs?.seats || sanitizedData.seats || (isBike ? 2 : 5)),
        doors: Number(sanitizedData.specs?.doors || (isBike ? 0 : 4)),
        luggageBags: Number(sanitizedData.specs?.luggageBags || (isBike ? 1 : 2)),
        fuel: sanitizedData.specs?.fuel || sanitizedData.fuel || 'Petrol',
        transmission: sanitizedData.specs?.transmission || sanitizedData.transmission || 'Manual',
        hasAC: isBike ? false : (sanitizedData.specs?.hasAC ?? true),
        driverIncluded: !isSelfDrive,
        modelYear: Number(sanitizedData.specs?.modelYear || sanitizedData.modelYear || 2024),
        mileage: sanitizedData.specs?.mileage || (isBike ? '40 km/l' : '15 km/l'),
        engineCC: (sanitizedData.specs?.engineCC || sanitizedData.engineCC) ? Number(sanitizedData.specs?.engineCC || sanitizedData.engineCC) : undefined,
      },
      driver: isSelfDrive ? undefined : (sanitizedData.driver || {
        name: sanitizedData.driverName || 'Designated Driver',
        phone: sanitizedData.driverPhone || '',
        experienceYears: 4,
        rating: 4.9,
        tripsCount: 50,
        languages: ['English', 'Hindi'],
        isVerified: true,
      }),
      thumbnail: sanitizedData.thumbnail || sanitizedData.images?.[0] || (isBike ? 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=600' : 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600'),
    });

    await car.save();
    return this.sanitizeVehicleOutput(car.toObject());
  }

  /**
   * 9. Update Vehicle Listing
   */
  public async updateVehicle(agencyId: string, carId: string, data: any) {
    if (data.isAvailable === true) {
      const payoutCheck = await sellerPaymentProfileService.isSellerPayoutReady(agencyId, 'Car Rental');
      if (!payoutCheck.ready) {
        throw new ForbiddenError(payoutCheck.reason || 'Complete your payout account setup before publishing this car.');
      }
    }

    const { serviceType, sanitizedData } = this.validateAndSanitizeVehiclePayload(data, true);
    const agencyObjectId = new mongoose.Types.ObjectId(agencyId);
    const carObjectId = new mongoose.Types.ObjectId(carId);

    const updateDoc: any = { $set: sanitizedData };
    const unsetFields: Record<string, any> = {};

    if (serviceType === 'ROUTE_BOOKING') {
      unsetFields.routePricing = 1;
      unsetFields.rentalPricing = 1;
      unsetFields.rentalPolicies = 1;
      unsetFields.fixedDepositAmount = 1;
    } else if (serviceType === 'SELF_DRIVE_RENTAL') {
      unsetFields.routePricing = 1;
      unsetFields.routes = 1;
      unsetFields.driver = 1;
    }

    if (Object.keys(unsetFields).length > 0) {
      updateDoc.$unset = unsetFields;
    }

    const car = await CarModel.findOneAndUpdate(
      { _id: carObjectId, agencyId: agencyObjectId, isActive: true },
      updateDoc,
      { new: true }
    ).lean();

    if (!car) {
      throw new NotFoundError('Vehicle not found.');
    }
    return this.sanitizeVehicleOutput(car);
  }

  /**
   * 10. Delete Vehicle Listing
   */
  public async deleteVehicle(agencyId: string, carId: string) {
    const agencyObjectId = new mongoose.Types.ObjectId(agencyId);
    const carObjectId = new mongoose.Types.ObjectId(carId);

    const car = await CarModel.findOneAndUpdate(
      { _id: carObjectId, agencyId: agencyObjectId },
      { $set: { isActive: false, isAvailable: false } }
    );

    if (!car) {
      throw new NotFoundError('Vehicle not found.');
    }
    return { success: true };
  }

  /**
   * 10b. Route-Based Pricing Management (Add, Edit, Delete, Toggle, Duplicate Routes)
   */
  public async getVehicleRoutes(agencyId: string, carId: string) {
    const agencyObjectId = new mongoose.Types.ObjectId(agencyId);
    const carObjectId = new mongoose.Types.ObjectId(carId);

    const car = await CarModel.findOne({ _id: carObjectId, agencyId: agencyObjectId, isActive: true }).lean();
    if (!car) {
      throw new NotFoundError('Vehicle not found.');
    }

    let routes = await VehicleRouteModel.find({
      vehicleId: carObjectId,
      agencyId: agencyObjectId,
      status: { $ne: 'archived' },
    })
      .sort({ createdAt: -1 })
      .lean();

    // Auto-migrate any existing embedded routes if VehicleRouteModel collection is empty for this car
    if (routes.length === 0 && Array.isArray(car.routes) && car.routes.length > 0) {
      const docsToInsert = car.routes
        .filter((r: any) => r.status !== 'archived')
        .map((r: any) => ({
          _id: r._id || new mongoose.Types.ObjectId(),
          vehicleId: carObjectId,
          agencyId: agencyObjectId,
          pickup: (r.pickup || r.fromLocation || '').trim(),
          destination: (r.destination || r.toLocation || '').trim(),
          fromLocation: (r.pickup || r.fromLocation || '').trim(),
          toLocation: (r.destination || r.toLocation || '').trim(),
          routeName: r.routeName || '',
          distanceKm: Number(r.distanceKm || r.distance) || 0,
          duration: r.duration || r.estimatedDuration || '',
          estimatedDuration: r.estimatedDuration || r.duration || '',
          pricing: {
            oneWayPrice: Number(r.pricing?.oneWayPrice ?? r.price) || 1500,
            roundTripPrice: r.pricing?.roundTripPrice ? Number(r.pricing.roundTripPrice) : undefined,
            extraKmCharge: r.pricing?.extraKmCharge ? Number(r.pricing.extraKmCharge) : 14,
            waitingChargePerHour: r.pricing?.waitingChargePerHour ? Number(r.pricing.waitingChargePerHour) : 150,
            nightCharge: r.pricing?.nightCharge ? Number(r.pricing.nightCharge) : 300,
            driverAllowancePerDay: r.pricing?.driverAllowancePerDay ? Number(r.pricing.driverAllowancePerDay) : 400,
            tollIncluded: r.pricing?.tollIncluded ?? true,
            parkingIncluded: r.pricing?.parkingIncluded ?? false,
            stateTaxIncluded: r.pricing?.stateTaxIncluded ?? true,
          },
          price: Number(r.pricing?.oneWayPrice ?? r.price) || 1500,
          rules: {
            maxDistanceKm: Number(r.rules?.maxDistanceKm) || 600,
            advanceBookingHours: Number(r.rules?.advanceBookingHours) || 2,
            bookingEnabled: r.rules?.bookingEnabled ?? true,
          },
          notes: r.notes || '',
          status: r.status || 'active',
          totalBookings: r.totalBookings || 0,
        }));

      if (docsToInsert.length > 0) {
        await VehicleRouteModel.insertMany(docsToInsert);
        routes = await VehicleRouteModel.find({
          vehicleId: carObjectId,
          agencyId: agencyObjectId,
          status: { $ne: 'archived' },
        })
          .sort({ createdAt: -1 })
          .lean();
      }
    }

    return routes;
  }

  public async addVehicleRoute(agencyId: string, carId: string, data: any) {
    const agencyObjectId = new mongoose.Types.ObjectId(agencyId);
    const carObjectId = new mongoose.Types.ObjectId(carId);

    const car = await CarModel.findOne({ _id: carObjectId, agencyId: agencyObjectId, isActive: true });
    if (!car) {
      throw new NotFoundError('Vehicle not found.');
    }

    const pickup = (data.pickup || data.fromLocation || '').trim();
    const destination = (data.destination || data.toLocation || '').trim();

    if (!pickup || !destination) {
      throw new BadRequestError('Both pickup and destination locations are required.');
    }

    if (pickup.toLowerCase() === destination.toLowerCase()) {
      throw new BadRequestError('Pickup and destination locations cannot be identical.');
    }

    // Duplicate route check (Phase 11)
    const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const existingRoute = await VehicleRouteModel.findOne({
      vehicleId: carObjectId,
      status: { $ne: 'archived' },
      pickup: new RegExp(`^${escapeRegExp(pickup)}$`, 'i'),
      destination: new RegExp(`^${escapeRegExp(destination)}$`, 'i'),
    });

    if (existingRoute) {
      throw new BadRequestError(
        `A route between "${pickup}" and "${destination}" already exists for this vehicle. Edit the existing route instead.`
      );
    }

    const oneWay = Number(data.pricing?.oneWayPrice ?? data.oneWayPrice ?? data.price);
    if (!oneWay || oneWay <= 0) {
      throw new BadRequestError('A valid one-way fare greater than 0 is required.');
    }

    const pricing = {
      oneWayPrice: oneWay,
      roundTripPrice: data.pricing?.roundTripPrice ? Number(data.pricing.roundTripPrice) : (data.roundTripPrice ? Number(data.roundTripPrice) : undefined),
      extraKmCharge: data.pricing?.extraKmCharge ? Number(data.pricing.extraKmCharge) : (data.extraKmCharge !== undefined ? Number(data.extraKmCharge) : 14),
      waitingChargePerHour: data.pricing?.waitingChargePerHour ? Number(data.pricing.waitingChargePerHour) : (data.waitingChargePerHour !== undefined ? Number(data.waitingChargePerHour) : 150),
      nightCharge: data.pricing?.nightCharge ? Number(data.pricing.nightCharge) : (data.nightCharge !== undefined ? Number(data.nightCharge) : 300),
      driverAllowancePerDay: data.pricing?.driverAllowancePerDay ? Number(data.pricing.driverAllowancePerDay) : (data.driverAllowancePerDay !== undefined ? Number(data.driverAllowancePerDay) : 400),
      tollIncluded: data.pricing?.tollIncluded ?? data.tollIncluded ?? true,
      parkingIncluded: data.pricing?.parkingIncluded ?? data.parkingIncluded ?? false,
      stateTaxIncluded: data.pricing?.stateTaxIncluded ?? data.stateTaxIncluded ?? true,
    };

    const rules = {
      maxDistanceKm: Number(data.rules?.maxDistanceKm ?? data.maxDistanceKm) || 600,
      advanceBookingHours: Number(data.rules?.advanceBookingHours ?? data.advanceBookingHours) || 2,
      bookingEnabled: data.rules?.bookingEnabled ?? data.bookingEnabled ?? true,
    };

    const newRouteDoc = await VehicleRouteModel.create({
      vehicleId: carObjectId,
      agencyId: agencyObjectId,
      pickup,
      destination,
      fromLocation: pickup,
      toLocation: destination,
      routeName: data.routeName?.trim() || '',
      distanceKm: Number(data.distanceKm ?? data.distance) || 0,
      duration: data.duration?.trim() || data.estimatedDuration?.trim() || '',
      estimatedDuration: data.estimatedDuration?.trim() || data.duration?.trim() || '',
      pricing,
      price: oneWay,
      rules,
      status: data.status === 'disabled' ? 'disabled' : 'active',
      notes: data.notes?.trim() || '',
      totalBookings: 0,
    });

    // Synchronize to car.routes for backward compatibility
    car.routes = car.routes.filter((r: any) => r._id?.toString() !== newRouteDoc._id.toString());
    car.routes.push({
      _id: newRouteDoc._id,
      pickup,
      destination,
      fromLocation: pickup,
      toLocation: destination,
      routeName: newRouteDoc.routeName,
      distanceKm: newRouteDoc.distanceKm,
      duration: newRouteDoc.duration,
      estimatedDuration: newRouteDoc.estimatedDuration,
      price: oneWay,
      pricing,
      rules,
      status: newRouteDoc.status,
      notes: newRouteDoc.notes,
      totalBookings: 0,
    } as any);
    await car.save();

    const allRoutes = await this.getVehicleRoutes(agencyId, carId);
    return {
      success: true,
      addedRoute: newRouteDoc,
      routes: allRoutes,
    };
  }

  public async updateVehicleRoute(agencyId: string, carId: string, routeId: string, data: any) {
    const agencyObjectId = new mongoose.Types.ObjectId(agencyId);
    const carObjectId = new mongoose.Types.ObjectId(carId);
    const routeObjectId = new mongoose.Types.ObjectId(routeId);

    const car = await CarModel.findOne({ _id: carObjectId, agencyId: agencyObjectId, isActive: true });
    if (!car) {
      throw new NotFoundError('Vehicle not found.');
    }

    const routeDoc = await VehicleRouteModel.findOne({
      _id: routeObjectId,
      vehicleId: carObjectId,
      status: { $ne: 'archived' },
    });

    if (!routeDoc) {
      throw new NotFoundError('Route not found.');
    }

    const newPickup = data.pickup !== undefined || data.fromLocation !== undefined
      ? (data.pickup || data.fromLocation || '').trim()
      : routeDoc.pickup;

    const newDest = data.destination !== undefined || data.toLocation !== undefined
      ? (data.destination || data.toLocation || '').trim()
      : routeDoc.destination;

    if (!newPickup || !newDest) {
      throw new BadRequestError('Pickup and destination locations cannot be empty.');
    }

    if (newPickup.toLowerCase() === newDest.toLowerCase()) {
      throw new BadRequestError('Pickup and destination locations cannot be identical.');
    }

    // Check duplicate if pickup/dest is modified
    if (newPickup.toLowerCase() !== routeDoc.pickup.toLowerCase() || newDest.toLowerCase() !== routeDoc.destination.toLowerCase()) {
      const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const conflict = await VehicleRouteModel.findOne({
        _id: { $ne: routeObjectId },
        vehicleId: carObjectId,
        status: { $ne: 'archived' },
        pickup: new RegExp(`^${escapeRegExp(newPickup)}$`, 'i'),
        destination: new RegExp(`^${escapeRegExp(newDest)}$`, 'i'),
      });
      if (conflict) {
        throw new BadRequestError(`A route from "${newPickup}" to "${newDest}" already exists for this vehicle.`);
      }
    }

    routeDoc.pickup = newPickup;
    routeDoc.destination = newDest;
    routeDoc.fromLocation = newPickup;
    routeDoc.toLocation = newDest;

    if (data.routeName !== undefined) routeDoc.routeName = data.routeName.trim();
    if (data.distanceKm !== undefined || data.distance !== undefined) {
      routeDoc.distanceKm = Number(data.distanceKm ?? data.distance) || 0;
    }
    if (data.duration !== undefined || data.estimatedDuration !== undefined) {
      const dur = (data.duration || data.estimatedDuration || '').trim();
      routeDoc.duration = dur;
      routeDoc.estimatedDuration = dur;
    }
    if (data.status !== undefined) routeDoc.status = data.status;
    if (data.notes !== undefined) routeDoc.notes = data.notes.trim();

    const oneWay = Number(data.pricing?.oneWayPrice ?? data.oneWayPrice ?? data.price);
    if (oneWay && oneWay > 0) {
      routeDoc.pricing.oneWayPrice = oneWay;
      routeDoc.price = oneWay;
    }
    if (data.pricing?.roundTripPrice !== undefined || data.roundTripPrice !== undefined) {
      routeDoc.pricing.roundTripPrice = Number(data.pricing?.roundTripPrice ?? data.roundTripPrice) || undefined;
    }
    if (data.pricing?.extraKmCharge !== undefined || data.extraKmCharge !== undefined) {
      routeDoc.pricing.extraKmCharge = Number(data.pricing?.extraKmCharge ?? data.extraKmCharge) || 14;
    }
    if (data.pricing?.waitingChargePerHour !== undefined || data.waitingChargePerHour !== undefined) {
      routeDoc.pricing.waitingChargePerHour = Number(data.pricing?.waitingChargePerHour ?? data.waitingChargePerHour) || 150;
    }
    if (data.pricing?.nightCharge !== undefined || data.nightCharge !== undefined) {
      routeDoc.pricing.nightCharge = Number(data.pricing?.nightCharge ?? data.nightCharge) || 300;
    }
    if (data.pricing?.driverAllowancePerDay !== undefined || data.driverAllowancePerDay !== undefined) {
      routeDoc.pricing.driverAllowancePerDay = Number(data.pricing?.driverAllowancePerDay ?? data.driverAllowancePerDay) || 400;
    }
    if (data.pricing?.tollIncluded !== undefined || data.tollIncluded !== undefined) {
      routeDoc.pricing.tollIncluded = Boolean(data.pricing?.tollIncluded ?? data.tollIncluded);
    }
    if (data.pricing?.parkingIncluded !== undefined || data.parkingIncluded !== undefined) {
      routeDoc.pricing.parkingIncluded = Boolean(data.pricing?.parkingIncluded ?? data.parkingIncluded);
    }
    if (data.pricing?.stateTaxIncluded !== undefined || data.stateTaxIncluded !== undefined) {
      routeDoc.pricing.stateTaxIncluded = Boolean(data.pricing?.stateTaxIncluded ?? data.stateTaxIncluded);
    }

    if (data.rules) {
      if (data.rules.maxDistanceKm !== undefined) routeDoc.rules = { ...routeDoc.rules, maxDistanceKm: Number(data.rules.maxDistanceKm) };
      if (data.rules.advanceBookingHours !== undefined) routeDoc.rules = { ...routeDoc.rules, advanceBookingHours: Number(data.rules.advanceBookingHours) };
      if (data.rules.bookingEnabled !== undefined) routeDoc.rules = { ...routeDoc.rules, bookingEnabled: Boolean(data.rules.bookingEnabled) };
    }

    await routeDoc.save();

    // Synchronize embedded car.routes
    const embedded = (car.routes as any).id(routeId);
    if (embedded) {
      embedded.pickup = routeDoc.pickup;
      embedded.destination = routeDoc.destination;
      embedded.fromLocation = routeDoc.fromLocation;
      embedded.toLocation = routeDoc.toLocation;
      embedded.routeName = routeDoc.routeName;
      embedded.distanceKm = routeDoc.distanceKm;
      embedded.duration = routeDoc.duration;
      embedded.estimatedDuration = routeDoc.estimatedDuration;
      embedded.price = routeDoc.price;
      embedded.pricing = routeDoc.pricing;
      embedded.rules = routeDoc.rules;
      embedded.status = routeDoc.status;
      embedded.notes = routeDoc.notes;
    } else {
      car.routes.push(routeDoc.toObject() as any);
    }
    await car.save();

    const allRoutes = await this.getVehicleRoutes(agencyId, carId);
    return {
      success: true,
      updatedRoute: routeDoc,
      routes: allRoutes,
    };
  }

  public async deleteVehicleRoute(agencyId: string, carId: string, routeId: string) {
    const agencyObjectId = new mongoose.Types.ObjectId(agencyId);
    const carObjectId = new mongoose.Types.ObjectId(carId);
    const routeObjectId = new mongoose.Types.ObjectId(routeId);

    const car = await CarModel.findOne({ _id: carObjectId, agencyId: agencyObjectId, isActive: true });
    if (!car) {
      throw new NotFoundError('Vehicle not found.');
    }

    await VehicleRouteModel.findOneAndUpdate(
      { _id: routeObjectId, vehicleId: carObjectId },
      { $set: { status: 'archived' } }
    );

    car.routes = car.routes.filter((r: any) => r._id?.toString() !== routeId);
    await car.save();

    const allRoutes = await this.getVehicleRoutes(agencyId, carId);
    return { success: true, routes: allRoutes };
  }

  public async toggleVehicleRouteStatus(agencyId: string, carId: string, routeId: string) {
    const agencyObjectId = new mongoose.Types.ObjectId(agencyId);
    const carObjectId = new mongoose.Types.ObjectId(carId);
    const routeObjectId = new mongoose.Types.ObjectId(routeId);

    const car = await CarModel.findOne({ _id: carObjectId, agencyId: agencyObjectId, isActive: true });
    if (!car) {
      throw new NotFoundError('Vehicle not found.');
    }

    const routeDoc = await VehicleRouteModel.findOne({ _id: routeObjectId, vehicleId: carObjectId });
    if (!routeDoc) {
      throw new NotFoundError('Route not found.');
    }

    routeDoc.status = routeDoc.status === 'active' ? 'disabled' : 'active';
    await routeDoc.save();

    const embedded = (car.routes as any).id(routeId);
    if (embedded) {
      embedded.status = routeDoc.status;
      await car.save();
    }

    const allRoutes = await this.getVehicleRoutes(agencyId, carId);
    return { success: true, status: routeDoc.status, updatedRoute: routeDoc, routes: allRoutes };
  }

  public async duplicateVehicleRoute(agencyId: string, carId: string, routeId: string, overrideData?: any) {
    const agencyObjectId = new mongoose.Types.ObjectId(agencyId);
    const carObjectId = new mongoose.Types.ObjectId(carId);
    const routeObjectId = new mongoose.Types.ObjectId(routeId);

    const sourceRoute = await VehicleRouteModel.findOne({ _id: routeObjectId, vehicleId: carObjectId }).lean();
    if (!sourceRoute) {
      throw new NotFoundError('Source route to duplicate not found.');
    }

    // Default reverse route (Return) if override not provided
    let newPickup = (overrideData?.pickup || sourceRoute.destination).trim();
    let newDest = (overrideData?.destination || sourceRoute.pickup).trim();

    // Check duplicate
    const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    let exists = await VehicleRouteModel.findOne({
      vehicleId: carObjectId,
      status: { $ne: 'archived' },
      pickup: new RegExp(`^${escapeRegExp(newPickup)}$`, 'i'),
      destination: new RegExp(`^${escapeRegExp(newDest)}$`, 'i'),
    });

    if (exists) {
      // Suffix with (Copy) to avoid duplicate name conflict
      newDest = `${newDest} (Alt)`;
    }

    const duplicatedDoc = await VehicleRouteModel.create({
      vehicleId: carObjectId,
      agencyId: agencyObjectId,
      pickup: newPickup,
      destination: newDest,
      fromLocation: newPickup,
      toLocation: newDest,
      routeName: overrideData?.routeName || `${sourceRoute.routeName ? sourceRoute.routeName + ' (Copy)' : ''}`.trim(),
      distanceKm: sourceRoute.distanceKm,
      duration: sourceRoute.duration,
      estimatedDuration: sourceRoute.estimatedDuration,
      pricing: sourceRoute.pricing,
      price: sourceRoute.price,
      rules: sourceRoute.rules,
      status: 'active',
      notes: sourceRoute.notes,
      totalBookings: 0,
    });

    const car = await CarModel.findOne({ _id: carObjectId, agencyId: agencyObjectId });
    if (car) {
      car.routes.push(duplicatedDoc.toObject() as any);
      await car.save();
    }

    const allRoutes = await this.getVehicleRoutes(agencyId, carId);
    return {
      success: true,
      duplicatedRoute: duplicatedDoc,
      routes: allRoutes,
    };
  }

  /**
   * 11. Admin-Style Fleet Overview & Owner Performance
   */
  public async getFleetOverview(agencyId: string) {
    const agencyObjectId = new mongoose.Types.ObjectId(agencyId);
    const cars = await CarModel.find({ agencyId: agencyObjectId, isActive: true }).lean();

    const breakdown = {
      totalVehicles: cars.length,
      suv: cars.filter((c) => c.type === 'suv').length,
      sedan: cars.filter((c) => c.type === 'sedan').length,
      luxury: cars.filter((c) => c.type === 'luxury').length,
      tempo: cars.filter((c) => c.type === 'tempo_traveller').length,
      miniBus: cars.filter((c) => c.type === 'mini_bus').length,
      hatchback: cars.filter((c) => c.type === 'hatchback').length,
      available: cars.filter((c) => c.isAvailable && c.status !== 'maintenance').length,
      inactive: cars.filter((c) => !c.isAvailable && c.status !== 'maintenance').length,
      maintenance: cars.filter((c) => c.status === 'maintenance').length,
    };

    // Aggregate by Owner
    const ownerMap = new Map<string, any>();
    cars.forEach((car) => {
      const ownerName = car.owner?.name || car.owner?.businessName || 'Fleet Partner';
      const key = ownerName.toLowerCase();

      if (!ownerMap.has(key)) {
        ownerMap.set(key, {
          id: key,
          name: ownerName,
          businessName: car.owner?.businessName || ownerName,
          phone: car.owner?.phone || car.driver?.phone || '+91 98765 43210',
          email: car.owner?.email || '',
          rating: car.owner?.rating || car.averageRating || 4.9,
          vehiclesOwned: 0,
          totalRevenue: 0,
          lastBooking: 'Recently',
          vehicles: [],
        });
      }

      const entry = ownerMap.get(key);
      entry.vehiclesOwned++;
      entry.totalRevenue += car.totalRevenue || ((car.dailyPrice ?? car.routePricing?.oneWayPrice ?? 1500) * 10);
      entry.vehicles.push({
        id: car._id,
        name: `${car.brand} ${car.name}`,
        type: car.type,
        registrationNumber: car.registrationNumber || 'MH 02 AB 1234',
        dailyPrice: car.dailyPrice ?? car.routePricing?.oneWayPrice ?? 1500,
        status: car.status || (car.isAvailable ? 'available' : 'booked'),
      });
    });

    return {
      breakdown,
      owners: Array.from(ownerMap.values()),
    };
  }

  /**
   * 12. Drivers Directory
   */
  public async getDrivers(agencyId: string) {
    const agencyObjectId = new mongoose.Types.ObjectId(agencyId);

    const [drivers, cars] = await Promise.all([
      DriverModel.find({ agencyId: agencyObjectId }).sort({ createdAt: -1 }).lean(),
      CarModel.find({ agencyId: agencyObjectId, isActive: true }).select('driver name brand registrationNumber').lean(),
    ]);

    if (drivers.length > 0) {
      return drivers;
    }

    // If no dedicated Driver documents yet, extract from cars with real structure
    const extracted: any[] = [];
    cars.forEach((car) => {
      if (car.driver && car.driver.name) {
        extracted.push({
          _id: car._id,
          agencyId: agencyObjectId,
          name: car.driver.name,
          phone: car.driver.phone || '',
          photo: car.driver.photo || '',
          experienceYears: car.driver.experienceYears || 1,
          licenseNumber: (car.driver as any).licenseNumber || 'Verified Commercial',
          licenseExpiry: new Date(Date.now() + 365 * 24 * 3600 * 1000),
          assignedCarId: car._id,
          assignedCarName: `${car.brand} ${car.name}`,
          status: 'active',
          tripsCompleted: car.driver.tripsCount || 0,
          rating: car.driver.rating || 5.0,
          reviewsCount: 0,
          totalRevenue: 0,
          languages: car.driver.languages || ['English', 'Hindi'],
          isVerified: car.driver.isVerified ?? true,
          documents: [],
        });
      }
    });

    return extracted;
  }

  /**
   * 13. Create Driver
   */
  public async createDriver(agencyId: string, data: any) {
    const agencyObjectId = new mongoose.Types.ObjectId(agencyId);

    const driver = new DriverModel({
      ...data,
      agencyId: agencyObjectId,
      status: data.status || 'active',
      isVerified: true,
      tripsCompleted: Number(data.tripsCompleted || 0),
      rating: Number(data.rating || 4.9),
      totalRevenue: Number(data.totalRevenue || 0),
    });

    await driver.save();
    return driver;
  }

  /**
   * 14. Update Driver
   */
  public async updateDriver(agencyId: string, driverId: string, data: any) {
    const agencyObjectId = new mongoose.Types.ObjectId(agencyId);
    const driverObjectId = new mongoose.Types.ObjectId(driverId);

    const driver = await DriverModel.findOneAndUpdate(
      { _id: driverObjectId, agencyId: agencyObjectId },
      { $set: data },
      { new: true }
    );

    if (!driver) {
      throw new NotFoundError('Driver not found.');
    }
    return driver;
  }

  /**
   * 15. Rental Bookings List
   */
  public async getBookings(agencyId: string, status?: string) {
    const agencyObjectId = new mongoose.Types.ObjectId(agencyId);
    const filter: any = { agencyId: agencyObjectId, isDeleted: false };

    if (status && status !== 'all') {
      filter.bookingStatus = status.toUpperCase();
    }

    const bookings = await CarBookingModel.find(filter)
      .populate('carId', 'name brand type category dailyPrice images thumbnail registrationNumber')
      .sort({ createdAt: -1 })
      .lean();

    return bookings;
  }

  /**
   * 16. Update Rental Booking Status (Supports both _id and bookingId)
   */
  public async updateBookingStatus(agencyId: string, bookingId: string, status: string, rejectionReason?: string) {
    return carBookingService.agencyUpdateStatus(
      agencyId,
      bookingId,
      status.toUpperCase() as any,
      rejectionReason
    );
  }

  /**
   * 16b. Assign Driver and Confirm Booking (or update assigned driver)
   */
  public async assignDriverAndConfirmBooking(
    agencyId: string,
    bookingIdOrDocId: string,
    driverId: string,
    vehicleNumber?: string,
    vehicleModel?: string
  ) {
    const agencyObjectId = new mongoose.Types.ObjectId(agencyId);

    // Lookup booking by _id or bookingId
    let bookingFilter: any = { agencyId: agencyObjectId };
    if (mongoose.Types.ObjectId.isValid(bookingIdOrDocId)) {
      bookingFilter.$or = [
        { _id: new mongoose.Types.ObjectId(bookingIdOrDocId) },
        { bookingId: bookingIdOrDocId },
      ];
    } else {
      bookingFilter.bookingId = bookingIdOrDocId;
    }

    const booking = await CarBookingModel.findOne(bookingFilter);
    if (!booking) {
      throw new NotFoundError('Booking reservation not found or unauthorized.');
    }

    // Lookup driver from DriverModel
    let driver: any = null;
    if (mongoose.Types.ObjectId.isValid(driverId)) {
      driver = await DriverModel.findOne({
        _id: new mongoose.Types.ObjectId(driverId),
        agencyId: agencyObjectId,
      }).lean();
    }

    // Fallback: check if driverId matches a car's embedded driver or driver name
    if (!driver) {
      const carWithDriver = await CarModel.findOne({
        agencyId: agencyObjectId,
        $or: [
          { _id: mongoose.Types.ObjectId.isValid(driverId) ? new mongoose.Types.ObjectId(driverId) : undefined },
          { 'driver.name': driverId },
        ].filter(Boolean) as any,
      }).lean();
      if (carWithDriver?.driver?.name) {
        driver = {
          _id: carWithDriver._id,
          name: carWithDriver.driver.name,
          phone: carWithDriver.driver.phone || '',
          photo: carWithDriver.driver.photo || '',
          licenseNumber: (carWithDriver.driver as any).licenseNumber || 'Verified Commercial',
        };
      }
    }

    if (!driver) {
      throw new NotFoundError('Selected driver was not found in your agency driver roster.');
    }

    // Lookup vehicle info if vehicleNumber or vehicleModel not explicitly given
    const car = await CarModel.findById(booking.carId).lean();
    const finalVehicleNumber =
      vehicleNumber?.trim() ||
      car?.registrationNumber ||
      (car as any)?.licensePlate ||
      'DL-01-COMMERCIAL';
    const finalVehicleModel =
      vehicleModel?.trim() ||
      (car ? `${car.brand} ${car.name}` : booking.vehicleModel || 'Fleet Vehicle');

    const isAlreadyConfirmed =
      booking.bookingStatus === 'CONFIRMED' || booking.bookingStatus === 'ACCEPTED';

    // Store driver assignment details
    booking.driverId = driver._id;
    booking.driverName = driver.name;
    booking.driverPhone = driver.phone;
    booking.driverPhoto = driver.photo || '';
    booking.driverLicense = driver.licenseNumber || '';
    booking.vehicleNumber = finalVehicleNumber;
    booking.vehicleModel = finalVehicleModel;

    let notificationTitle: string;
    let notificationDesc: string;

    if (isAlreadyConfirmed) {
      // Driver change on an already confirmed booking
      notificationTitle = 'Driver Updated';
      notificationDesc = 'Your assigned driver has been updated.';
    } else {
      // Initial confirmation
      booking.bookingStatus = 'CONFIRMED';
      booking.confirmedAt = new Date();
      booking.confirmedBy = agencyObjectId;
      notificationTitle = 'Booking Confirmed';
      notificationDesc = 'Your booking has been confirmed.';
    }

    await booking.save();

    // Increment driver's completed trips / assign status
    if (mongoose.Types.ObjectId.isValid(driver._id)) {
      DriverModel.updateOne(
        { _id: driver._id },
        { $inc: { tripsCompleted: 1 }, $set: { status: 'on_trip' } }
      ).exec();
    }

    // Notify Traveler
    try {
      if (booking.customerId) {
        await NotificationModel.create({
          recipientType: 'USER',
          recipientId: booking.customerId,
          category: 'Bookings',
          title: notificationTitle,
          description: notificationDesc,
          priority: 'HIGH',
          status: 'UNREAD',
          isUnread: true,
          targetRoute: `/car-bookings/${booking.bookingId}`,
          relatedEntityType: 'CarBooking',
          relatedEntityId: booking.bookingId,
          metadata: {
            bookingId: booking.bookingId,
            driverName: driver.name,
            driverPhone: driver.phone,
            vehicleNumber: finalVehicleNumber,
            vehicleModel: finalVehicleModel,
          },
        });

        socketService.emitToUser(booking.customerId.toString(), 'booking_status_updated', {
          bookingId: booking.bookingId,
          status: booking.bookingStatus,
          driverName: driver.name,
          driverPhone: driver.phone,
          vehicleNumber: finalVehicleNumber,
          vehicleModel: finalVehicleModel,
          notificationTitle,
          notificationDesc,
        });
      }
    } catch (notifErr) {
      logger.error('Failed to send driver assignment notification to traveler', notifErr);
    }

    return booking.populate([
      { path: 'carId' },
      { path: 'agencyId', select: 'name businessName logo email phone isVerified' },
    ]);
  }

  /**
   * 17. Rental Customers CRM
   */
  public async getCustomers(agencyId: string) {
    const agencyObjectId = new mongoose.Types.ObjectId(agencyId);

    const bookings = await CarBookingModel.find({ agencyId: agencyObjectId, isDeleted: false })
      .populate('carId', 'name brand')
      .sort({ createdAt: -1 })
      .lean();

    const customerMap = new Map<string, any>();

    bookings.forEach((b: any) => {
      const email = (b.customerEmail || '').trim().toLowerCase();
      if (!email) return;

      if (!customerMap.has(email)) {
        customerMap.set(email, {
          id: b.customerId ? String(b.customerId) : email,
          name: b.customerName,
          email,
          phone: b.customerPhone || '—',
          totalBookings: 0,
          totalSpent: 0,
          advancePaidTotal: 0,
          lastRentalDate: b.createdAt,
          lastVehicle: b.carId ? `${b.carId.brand} ${b.carId.name}` : 'Rental Vehicle',
          status: 'Active Traveler',
          bookings: [],
        });
      }

      const record = customerMap.get(email);
      record.totalBookings++;
      record.totalSpent += b.totalAmount || 0;
      record.advancePaidTotal += b.depositPaid || 0;
      record.bookings.push({
        bookingId: b.bookingId,
        startDate: b.startDate,
        endDate: b.endDate,
        totalAmount: b.totalAmount,
        bookingStatus: b.bookingStatus,
      });
    });

    return Array.from(customerMap.values());
  }

  /**
   * 18. Rental Analytics
   */
  public async getAnalytics(agencyId: string) {
    const agencyObjectId = new mongoose.Types.ObjectId(agencyId);

    const [cars, bookings] = await Promise.all([
      CarModel.find({ agencyId: agencyObjectId, isActive: true }).lean(),
      CarBookingModel.find({ agencyId: agencyObjectId, isDeleted: false }).lean(),
    ]);

    const totalVehicles = cars.length;
    let totalRevenue = 0;
    let completedTrips = 0;

    const monthlyRevenueMap: { [key: string]: number } = {
      Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0,
      Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0,
    };
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    bookings.forEach((b) => {
      if (b.bookingStatus === 'ACCEPTED' || b.bookingStatus === 'COMPLETED') {
        const amt = b.totalAmount || 0;
        totalRevenue += amt;
        const d = new Date(b.createdAt);
        const m = monthNames[d.getMonth()];
        if (m) monthlyRevenueMap[m] += amt;
      }
      if (b.bookingStatus === 'COMPLETED') completedTrips++;
    });

    const activeRentals = bookings.filter((b) => b.bookingStatus === 'ACCEPTED').length;
    const occupancyRate = totalVehicles > 0 ? Math.min(100, Math.round((activeRentals / totalVehicles) * 100)) : 0;

    const revenueByMonth = Object.entries(monthlyRevenueMap).map(([month, amount]) => ({
      month,
      revenue: amount,
    }));

    // Dynamic utilization by vehicle type calculated from actual inventory and bookings
    const vehicleTypes = ['suv', 'sedan', 'luxury', 'tempo_traveller', 'hatchback', 'mini_bus'];
    const typeLabels: Record<string, string> = {
      suv: 'SUV',
      sedan: 'Sedan',
      luxury: 'Luxury',
      tempo_traveller: 'Tempo Traveller',
      hatchback: 'Hatchback',
      mini_bus: 'Mini Bus',
    };

    const utilizationByType = vehicleTypes
      .map((t) => {
        const totalOfThisType = cars.filter((c) => c.type === t).length;
        if (totalOfThisType === 0) return null;
        const activeOfThisType = bookings.filter((b) => {
          if (b.bookingStatus !== 'ACCEPTED') return false;
          const carDoc = cars.find((c) => c._id.toString() === b.carId?.toString());
          return carDoc && carDoc.type === t;
        }).length;
        return {
          type: typeLabels[t] || t,
          utilization: Math.min(100, Math.round((activeOfThisType / totalOfThisType) * 100)),
          count: totalOfThisType,
        };
      })
      .filter(Boolean);

    const finalUtilization = utilizationByType.length > 0 ? utilizationByType : [
      { type: 'SUV', utilization: 0, count: 0 },
      { type: 'Sedan', utilization: 0, count: 0 },
      { type: 'Luxury', utilization: 0, count: 0 },
      { type: 'Tempo Traveller', utilization: 0, count: 0 },
    ];

    // Dynamic peak season calculation based on historical revenue distribution
    const sortedMonths = Object.entries(monthlyRevenueMap).sort((a, b) => b[1] - a[1]);
    const topMonthNames = sortedMonths.filter(([_, amt]) => amt > 0).map(([m]) => m);
    const peakMonths = topMonthNames.length > 0 ? topMonthNames.slice(0, 3) : ['October', 'November', 'December'];

    return {
      occupancyRate,
      totalRevenue,
      completedTrips,
      totalVehicles,
      revenueByMonth,
      peakSeason: {
        peakMonths,
        occupancyFactor: `${occupancyRate}%`,
        recommendation: totalVehicles > 0 && occupancyRate > 75
          ? 'High fleet demand detected. Expand available vehicles to maximize revenue.'
          : 'Promote weekend getaways to increase fleet utilization.',
      },
      utilizationByType: finalUtilization,
    };
  }

  /**
   * 19. Calendar & Availability Schedule
   */
  public async getCalendarSchedule(agencyId: string, month?: number, year?: number) {
    const agencyObjectId = new mongoose.Types.ObjectId(agencyId);

    const cars = await CarModel.find({ agencyId: agencyObjectId, isActive: true })
      .select('name brand type category dailyPrice isAvailable registrationNumber')
      .lean();

    const bookings = await CarBookingModel.find({
      agencyId: agencyObjectId,
      bookingStatus: { $in: ['REQUESTED', 'ACCEPTED', 'COMPLETED'] },
      isDeleted: false,
    })
      .select('bookingId carId startDate endDate pickupLocation customerName bookingStatus paymentStatus')
      .lean();

    return {
      cars,
      bookings,
    };
  }

  /**
   * 20. Reviews & Ratings for Agency Fleet
   */
  public async getReviews(agencyId: string) {
    const agencyObjectId = new mongoose.Types.ObjectId(agencyId);
    const cars = await CarModel.find({ agencyId: agencyObjectId, isActive: true })
      .select('_id name brand type thumbnail images')
      .lean();

    const carIds = cars.map((c) => c._id);
    const reviews = await CarReviewModel.find({ carId: { $in: carIds }, isDeleted: false })
      .populate('carId', 'name brand type thumbnail')
      .populate('customerId', 'fullName avatar email')
      .sort({ createdAt: -1 })
      .lean();

    const totalReviews = reviews.length;
    const avgRating =
      totalReviews > 0
        ? Math.round((reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / totalReviews) * 10) / 10
        : 5.0;

    return {
      reviews,
      totalReviews,
      averageRating: avgRating,
      ratingBreakdown: {
        5: reviews.filter((r) => r.rating === 5).length,
        4: reviews.filter((r) => r.rating === 4).length,
        3: reviews.filter((r) => r.rating === 3).length,
        2: reviews.filter((r) => r.rating === 2).length,
        1: reviews.filter((r) => r.rating === 1).length,
      },
    };
  }
}

export const agencyCarRentalService = new AgencyCarRentalService();
