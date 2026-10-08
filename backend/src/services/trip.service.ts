import mongoose from 'mongoose';
import { BookingModel, IBooking } from '../models/booking.model.js';
import { TripModel, ITrip } from '../models/trip.model.js';
import { PackageModel } from '../models/package.model.js';
import { CarBookingModel } from '../models/carBooking.model.js';
import { ReviewModel } from '../models/review.model.js';
import { NotFoundError } from '../utils/errors.util.js';
import { logger } from '../config/logger.config.js';

export class TripService {
  /**
   * Helper: Calculate countdown to departure date
   */
  private calculateCountdown(departureDateStr?: string | Date) {
    if (!departureDateStr) {
      return { days: 0, hours: 0, mins: 0, secs: 0 };
    }
    const target = new Date(departureDateStr).getTime();
    const now = Date.now();
    const diff = target - now;
    if (diff <= 0) {
      return { days: 0, hours: 0, mins: 0, secs: 0 };
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / 1000 / 60) % 60);
    const secs = Math.floor((diff / 1000) % 60);
    return { days, hours, mins, secs };
  }

  /**
   * Helper: Map Booking/Trip status to MasterTripStatus
   */
  private mapStatus(status?: string, startDate?: Date, endDate?: Date): string {
    const now = new Date();
    if (endDate && now > new Date(endDate)) {
      return 'Completed';
    }
    if (startDate && now >= new Date(startDate) && (!endDate || now <= new Date(endDate))) {
      return 'Ongoing';
    }
    if (status === 'CONFIRMED') {
      return 'Trip Ready';
    }
    if (status === 'PENDING') {
      return 'Booking Confirmed';
    }
    return status || 'Upcoming';
  }

  /**
   * Get all trips and bookings for a customer
   */
  public async getCustomerTrips(userId: string) {
    const userFilter: any = { isDeleted: false };
    if (mongoose.Types.ObjectId.isValid(userId)) {
      userFilter.userId = new mongoose.Types.ObjectId(userId);
    } else if (userId) {
      userFilter.userId = userId;
    }
    const bookings = await BookingModel.find(userFilter).sort({ createdAt: -1 }).lean();

    const trips: any[] = [];
    const formattedBookings: any[] = [];

    let totalTrips = 0;
    let upcomingTrips = 0;
    let completedTrips = 0;
    let lifetimeSpendNum = 0;

    for (const b of bookings) {
      const bStatus = this.mapStatus(b.status, b.tripStartDate, b.tripEndDate);
      const countdown = this.calculateCountdown(b.tripStartDate);
      const isCompleted = bStatus === 'Completed';
      const isUpcoming = bStatus === 'Upcoming' || bStatus === 'Trip Ready' || bStatus === 'Preparing Your Trip' || bStatus === 'Booking Confirmed';

      totalTrips++;
      if (isCompleted) completedTrips++;
      if (isUpcoming) upcomingTrips++;
      lifetimeSpendNum += b.paidAmount || b.totalAmount || 0;

      // Find if an operational trip exists in TripModel for this booking
      const operationalTrip = await TripModel.findOne({
        $or: [
          { bookingIds: b.bookingId },
          { 'travelers.bookingId': b.bookingId },
          { packageId: b.packageId, departureDate: b.tripStartDate },
        ],
      }).lean();

      const tripId = operationalTrip ? operationalTrip.tripId : `TRIP-${b.bookingId}`;

      const leadGuide = operationalTrip?.assignedTeam?.find((t: any) => t.role.toLowerCase().includes('guide')) || {
        name: 'Arjun Das',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
        phone: '+91 98765 12345',
        role: 'Certified Himalayan Guide',
      };

      const leadHost = operationalTrip?.assignedTeam?.find((t: any) => t.role.toLowerCase().includes('host') || t.role.toLowerCase().includes('manager')) || {
        name: 'Priya Mukherjee',
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
        phone: '+91 98765 67890',
        role: 'Dedicated Trip Coordinator',
      };

      const leadVehicle = operationalTrip?.assignedVehicles?.[0] || {
        name: 'Toyota Innova Crysta (4x4)',
        registrationNumber: 'ML-05-AB-7744',
        type: 'AC Luxury SUV',
        assignedDriver: 'Biren Sangma',
        status: 'Assigned',
      };

      const companions = (b.travelers || []).map((trv: any, idx: number) => ({
        id: trv.id || `comp-${idx + 1}`,
        photo: `https://images.unsplash.com/photo-${1534528741775 + idx}?q=80&w=150&auto=format&fit=crop`,
        name: trv.name,
        age: trv.age || 26,
        gender: trv.gender || 'Male',
        relationship: trv.isPrimary ? 'Self' : 'Travel Companion',
        isPrimary: Boolean(trv.isPrimary),
      }));

      const tripObj = {
        id: tripId,
        bookingId: b.bookingId,
        destinationId: b.destination || 'dest-india',
        packageId: String(b.packageId || ''),
        agencyId: String(b.agencyId || ''),
        title: b.packageName,
        locations: operationalTrip?.destinationRoute || b.destination || 'Kashmir • Gulmarg • Pahalgam',
        coverImage: b.packageThumbnail || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
        status: bStatus,
        tripStartDate: b.tripStartDate ? new Date(b.tripStartDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Upcoming',
        tripEndDate: b.tripEndDate ? new Date(b.tripEndDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Upcoming',
        duration: b.durationText || '7 Days / 6 Nights',
        travelerCount: b.travelersCount || 1,
        countdown,
        tripHost: {
          name: leadHost.name,
          photo: leadHost.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
          phone: leadHost.phone || '+91 98765 67890',
          role: leadHost.role || 'Trip Coordinator',
        },
        guide: {
          name: leadGuide.name,
          photo: leadGuide.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
          phone: leadGuide.phone || '+91 98765 12345',
          role: leadGuide.role || 'Certified Local Tour Guide',
        },
        vehicle: {
          name: leadVehicle.name,
          number: (leadVehicle as any).registrationNumber || 'ML-05-AB-7744',
          type: leadVehicle.type,
          driverName: (leadVehicle as any).assignedDriver || 'Biren Sangma',
          driverPhone: '+91 94361 88990',
          pickupTime: '08:30 AM',
          pickupLocation: b.destination ? `${b.destination} Airport / Junction` : 'Airport Terminal 1',
        },
        hotel: {
          name: operationalTrip?.hotelInfo?.hotelName || 'Pine Brook Heritage Resort & Spa',
          address: operationalTrip?.hotelInfo?.address || 'Upper Shillong Hill View Road, Meghalaya',
          roomType: 'Deluxe Valley View Suite',
          checkIn: '02:00 PM',
          checkOut: '11:00 AM',
          contactPhone: '+91 364 250 1199',
          googleMapsUrl: 'https://maps.google.com',
        },
        companions,
        timeline: operationalTrip?.timelineDays ? operationalTrip.timelineDays.map((d: any) => ({
          id: `day-${d.dayNumber}`,
          dayNumber: d.dayNumber,
          title: d.title,
          description: d.notes || `Day ${d.dayNumber} activities and sightseeing`,
          completedActivities: (d.activities || []).filter((a: any) => a.status === 'Completed').map((a: any) => `${a.time} - ${a.title}`),
          currentActivity: (d.activities || []).find((a: any) => a.status === 'In Progress')?.title || undefined,
          upcomingActivities: (d.activities || []).filter((a: any) => a.status === 'Not Started').map((a: any) => `${a.time} - ${a.title}`),
          status: d.status === 'Completed' ? 'completed' : (d.status === 'In Progress' ? 'current' : 'upcoming'),
        })) : [
          {
            id: 'day-1',
            dayNumber: 1,
            title: 'Arrival & Welcome Dinner',
            description: 'Check into your stay, meet your group, and relax with authentic local culinary flavors.',
            completedActivities: ['09:00 AM - Airport pickup & transfer to resort', '01:00 PM - Check-in and welcome drink'],
            currentActivity: '07:30 PM - Traditional Welcome Dinner',
            upcomingActivities: ['09:00 PM - Briefing on tomorrow’s trek'],
            status: 'current',
          },
          {
            id: 'day-2',
            dayNumber: 2,
            title: 'Valley Trek & Scenic Exploration',
            description: 'Embark on an awe-inspiring guided trail into lush forests and panoramic ridges.',
            completedActivities: [],
            upcomingActivities: ['07:00 AM - Breakfast buffet', '08:30 AM - Departure to Valley Trailhead', '01:00 PM - Riverside picnic lunch'],
            status: 'upcoming',
          },
        ],
      };

      trips.push(tripObj);

      const existingReview = await ReviewModel.findOne({
        bookingId: b.bookingId,
        isDeleted: false,
      }).lean();

      formattedBookings.push({
        id: b.bookingId || String(b._id),
        _id: String(b._id),
        bookingId: b.bookingId || String(b._id),
        bookingType: 'PACKAGE',
        packageId: String(b.packageId || ''),
        packageName: b.packageName,
        coverImage: b.packageThumbnail || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
        bookingDate: new Date(b.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        departureDate: b.tripStartDate ? new Date(b.tripStartDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Upcoming',
        travelerCount: b.travelersCount || 1,
        paymentStatus: b.paymentStatus === 'PAID' ? 'PAID' : (b.paymentStatus === 'PARTIALLY_PAID' ? 'PARTIALLY_PAID' : 'REFUNDED'),
        bookingStatus: bStatus,
        actualBookingStatus: b.status,
        hasReviewed: Boolean(existingReview),
        countdownDays: countdown.days,
        isConvertedToTrip: true,
        associatedTripId: tripId,
        totalAmount: b.totalAmount,
        amountPaid: b.paidAmount || b.totalAmount,
        platformFees: b.platformFee || 900,
        invoiceUrl: `/api/trips/${tripId}/documents`,
        transactionId: b.transactionId || `TXN-${b.bookingId}`,
      });
    }

    // ─── 2. Fetch Car Rental Bookings ──────────────────────────────────────────
    const carCustomerFilter: any = { isDeleted: { $ne: true } };
    if (mongoose.Types.ObjectId.isValid(userId)) {
      carCustomerFilter.$or = [
        { customerId: new mongoose.Types.ObjectId(userId) },
        { customerId: userId },
      ];
    } else if (userId) {
      carCustomerFilter.customerId = userId;
    }

    const carBookings = await CarBookingModel.find(carCustomerFilter)
      .populate('carId')
      .populate('agencyId')
      .sort({ createdAt: -1 })
      .lean();

    for (const cb of carBookings) {
      const cbStatus =
        cb.bookingStatus === 'COMPLETED'
          ? 'Completed'
          : cb.bookingStatus === 'ACCEPTED'
          ? 'Trip Ready'
          : cb.bookingStatus === 'CONFIRMED'
          ? 'Booking Confirmed'
          : cb.bookingStatus === 'REQUESTED'
          ? 'Booking Confirmed'
          : cb.bookingStatus === 'PENDING'
          ? 'Booking Pending'
          : cb.bookingStatus === 'CANCELLED'
          ? 'Cancelled'
          : cb.bookingStatus;

      const countdown = this.calculateCountdown(cb.startDate);
      const isCompleted = cb.bookingStatus === 'COMPLETED';
      const isUpcoming =
        cb.bookingStatus === 'ACCEPTED' ||
        cb.bookingStatus === 'REQUESTED' ||
        cb.bookingStatus === 'CONFIRMED' ||
        cb.bookingStatus === 'PENDING';

      totalTrips++;
      if (isCompleted) completedTrips++;
      if (isUpcoming) upcomingTrips++;
      lifetimeSpendNum += cb.depositPaid || cb.totalAmount || 0;

      const tripId = `CAR-${cb.bookingId}`;
      const carName = (cb.carId as any)?.name ? `${(cb.carId as any)?.brand || ''} ${(cb.carId as any)?.name}`.trim() : (cb.vehicleModel || 'Rental Vehicle');
      const carAgency = cb.agencyId as any;
      const isRental =
        cb.serviceType === 'SELF_DRIVE_RENTAL' ||
        cb.serviceType === 'self_drive_car' ||
        cb.serviceType === 'self_drive_bike';

      // Add to bookings list
      formattedBookings.push({
        id: cb.bookingId,
        _id: cb._id.toString(),
        bookingId: cb.bookingId,
        bookingType: isRental ? 'SELF_DRIVE_RENTAL' : 'ROUTE_BOOKING',
        serviceType: cb.serviceType || (isRental ? 'SELF_DRIVE_RENTAL' : 'ROUTE_BOOKING'),
        packageId: (cb.carId as any)?._id?.toString() || '',
        packageName: `${carName} (${isRental ? 'Self-Drive' : 'Route Booking'})`,
        coverImage:
          (cb.carId as any)?.images?.[0] ||
          'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop',
        bookingDate: new Date(cb.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        departureDate: cb.startDate ? new Date(cb.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Upcoming',
        travelerCount: cb.passengersCount || 1,
        paymentStatus: cb.paymentStatus,
        bookingStatus: cbStatus,
        rawBookingStatus: cb.bookingStatus,
        countdownDays: countdown.days,
        isConvertedToTrip: cb.bookingStatus === 'ACCEPTED' || cb.bookingStatus === 'CONFIRMED' || cb.bookingStatus === 'COMPLETED',
        associatedTripId: tripId,
        totalAmount: cb.totalAmount,
        amountPaid: cb.depositPaid || 0,
        remainingAmount: cb.remainingAmount || Math.max(0, (cb.totalAmount || 0) - (cb.depositPaid || 0)),
        platformFees: 0,
        pickupLocation: cb.pickupLocation,
        dropLocation: cb.dropLocation,
        pickupTime: cb.pickupTime,
        tripType: cb.tripType,
        vehicle: carName,
        vehicleModel: cb.vehicleModel || carName,
        vehicleNumber: cb.vehicleNumber || 'Commercial Fleet',
        provider: carAgency?.businessName || carAgency?.name || 'Verified Car Rental Partner',
        agencyName: carAgency?.businessName || carAgency?.name || 'Verified Car Rental Partner',
        agencyPhone: carAgency?.phone || '',
        driverName: cb.driverName || '',
        driverPhone: cb.driverPhone || '',
        driverPhoto: cb.driverPhoto || '',
        driverLicense: cb.driverLicense || '',
        invoiceUrl: `/api/car-bookings/${cb.bookingId}/receipt`,
        transactionId: cb.transactionId || `TXN-${cb.bookingId}`,
        timeline: cb.timeline || [],
        canCancel: cb.bookingStatus !== 'COMPLETED' && cb.bookingStatus !== 'CANCELLED',
      });

      // Add to trips list (if requested, accepted, confirmed, or completed)
      if (
        cb.bookingStatus === 'REQUESTED' ||
        cb.bookingStatus === 'ACCEPTED' ||
        cb.bookingStatus === 'CONFIRMED' ||
        cb.bookingStatus === 'COMPLETED'
      ) {
        const agencyName = carAgency?.businessName || carAgency?.name || 'Verified Car Rental Partner';
        const agencyPhone = carAgency?.phone || '+91 99999 00000';
        const agencyLogo =
          carAgency?.logo ||
          'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=200&auto=format&fit=crop';

        trips.push({
          id: tripId,
          _id: cb._id.toString(),
          bookingId: cb.bookingId,
          tripId: tripId,
          packageId: (cb.carId as any)?._id?.toString() || '',
          tripType: 'car_rental',
          title: `${carName} Rental - ${cb.pickupLocation || 'Station'}`,
          destination: `${cb.pickupLocation || 'Pickup'} ➔ ${cb.dropLocation || 'Drop'}`,
          coverImage:
            (cb.carId as any)?.images?.[0] ||
            'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop',
          badgeText: `${cb.tripType || 'Rental'} • ${(cb.carId as any)?.category || 'Fleet'}`,
          status: cbStatus,
          masterStatus: cbStatus,
          tripStartDate: cb.startDate,
          tripEndDate: cb.endDate,
          dates: `${new Date(cb.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} - ${new Date(cb.endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`,
          countdown,
          agencyId: carAgency?._id?.toString() || '',
          agency: {
            id: carAgency?._id?.toString() || 'car-agency',
            name: agencyName,
            businessName: agencyName,
            logo: agencyLogo,
            phone: agencyPhone,
            email: carAgency?.email || '',
            verified: Boolean(carAgency?.isVerified),
          },
          tripHost: {
            name: carAgency?.ownerName || agencyName,
            photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
            phone: agencyPhone,
            role: 'Car Rental Dispatch Manager',
          },
          guide: {
            name: cb.driverName || 'Commercial Chauffeur (Assigned on Dispatch)',
            photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
            phone: cb.driverPhone || agencyPhone,
            role: 'Assigned Chauffeur / Driver',
          },
          vehicle: {
            name: carName,
            number: (cb.carId as any)?.registrationNumber || 'Commercial Plate',
            type: (cb.carId as any)?.transmission || 'AC Commercial Car',
            driverName: cb.driverName || 'Assigned on Dispatch',
            driverPhone: cb.driverPhone || agencyPhone,
            pickupTime: cb.pickupTime || '10:00 AM',
            pickupLocation: cb.pickupLocation || 'Station',
          },
          hotel: {
            name: `Pickup Point: ${cb.pickupLocation || 'Designated Station'}`,
            address: `Drop: ${cb.dropLocation || 'Drop Point'}`,
            roomType: `Scheduled Time: ${cb.pickupTime || 'As scheduled'}`,
            checkIn: cb.pickupTime || '10:00 AM',
            checkOut: 'Drop Schedule',
            contactPhone: agencyPhone,
            googleMapsUrl: '',
          },
          leadGuide: {
            name: cb.driverName || 'Commercial Chauffeur (Assigned on Dispatch)',
            photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
            phone: cb.driverPhone || agencyPhone,
            role: 'Assigned Chauffeur / Driver',
          },
          leadHost: {
            name: carAgency?.ownerName || agencyName,
            photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
            phone: agencyPhone,
            role: 'Car Rental Dispatch Manager',
          },
          leadVehicle: {
            name: carName,
            registrationNumber: (cb.carId as any)?.registrationNumber || 'Commercial Plate',
            type: (cb.carId as any)?.transmission || 'AC Commercial Car',
            assignedDriver: cb.driverName || 'Assigned on Dispatch',
            status: 'Ready for Pickup',
          },
          assignedHotel: {
            name: `Pickup Point: ${cb.pickupLocation || 'Designated Station'}`,
            roomType: `Scheduled Time: ${cb.pickupTime || 'As scheduled'}`,
            checkInDate: cb.startDate,
            checkOutDate: cb.endDate,
            contactNumber: agencyPhone,
          },
          companions: [
            {
              id: 'lead-passenger',
              photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
              name: cb.customerName,
              age: 28,
              gender: 'Male',
              relationship: 'Lead Passenger',
              isPrimary: true,
            },
          ],
          timeline: [
            {
              id: 'pickup-day',
              dayNumber: 1,
              title: `Pickup at ${cb.pickupLocation || 'Station'}`,
              description: `Vehicle handover at ${cb.pickupTime || 'scheduled time'}. Complete digital handover inspection and document verification.`,
              completedActivities: cb.depositPaid ? ['Advance deposit confirmed'] : [],
              currentActivity: `Pickup at ${cb.pickupLocation || 'Pickup Point'}`,
              upcomingActivities: [`Drop-off at ${cb.dropLocation || 'Drop Point'}`],
              status: 'current',
            },
            {
              id: 'drop-day',
              dayNumber: 2,
              title: `Return at ${cb.dropLocation || 'Station'}`,
              description: `Handover car at destination and complete final fuel and toll reconciliation.`,
              completedActivities: [],
              upcomingActivities: ['Vehicle check-in & settlement'],
              status: 'upcoming',
            },
          ],
          itinerary: [
            {
              id: 'pickup-day',
              dayNumber: 1,
              title: `Pickup at ${cb.pickupLocation || 'Station'}`,
              description: `Vehicle handover at ${cb.pickupTime || 'scheduled time'}. Complete digital handover inspection and document verification.`,
              completedActivities: cb.depositPaid ? ['Advance deposit confirmed'] : [],
              currentActivity: `Pickup at ${cb.pickupLocation}`,
              upcomingActivities: [`Drop-off at ${cb.dropLocation}`],
              status: 'current',
            },
            {
              id: 'drop-day',
              dayNumber: 2,
              title: `Return at ${cb.dropLocation || 'Station'}`,
              description: `Handover car at destination and complete final fuel and toll reconciliation.`,
              completedActivities: [],
              upcomingActivities: ['Vehicle check-in & settlement'],
              status: 'upcoming',
            },
          ],
          checklist: [
            { id: 'chk-1', label: 'Valid Driving License (Physical)', completed: true },
            { id: 'chk-2', label: 'Aadhaar / Passport ID Proof', completed: true },
            { id: 'chk-3', label: 'ApnaTrip Booking Receipt & QR Code', completed: true },
            { id: 'chk-4', label: 'Inspect vehicle exterior before departure', completed: false },
          ],
          packingChecklist: [
            { id: 'item-1', item: 'Valid Driving License (Physical)', category: 'Documents', checked: true, isMandatory: true },
            { id: 'item-2', item: 'Aadhaar / Passport ID Proof', category: 'Documents', checked: true, isMandatory: true },
            { id: 'item-3', item: 'ApnaTrip Booking Receipt / QR', category: 'Documents', checked: true, isMandatory: true },
          ],
          weather: {
            temp: '24°C',
            condition: 'Pleasant & Clear',
            location: cb.pickupLocation || 'Rental Station',
          },
          expenses: {
            totalBudget: cb.totalAmount || 0,
            spent: cb.depositPaid || 0,
            remaining: cb.remainingAmount || Math.max(0, (cb.totalAmount || 0) - (cb.depositPaid || 0)),
            percentage: Math.round(((cb.depositPaid || 0) / Math.max(1, cb.totalAmount || 1)) * 100),
          },
          paymentSummary: {
            totalAmount: cb.totalAmount || 0,
            paidAmount: cb.depositPaid || 0,
            pendingAmount: cb.remainingAmount || Math.max(0, (cb.totalAmount || 0) - (cb.depositPaid || 0)),
            paymentMethod: cb.paymentMethod || 'UPI',
          },
        });

      }
    }

    const travelStats = {
      totalTrips,
      upcomingTrips,
      completedTrips,
      countriesVisited: Math.max(1, completedTrips),
      lifetimeSpend: `₹${lifetimeSpendNum.toLocaleString('en-IN')}`,
      avgRatingGiven: 4.9,
      badges: [
        { name: 'Pioneer Explorer', icon: 'Sparkles', description: 'Joined the platform and completed booking' },
        { name: 'Mountain Nomad', icon: 'Compass', description: 'Explored high-altitude treks and valleys' },
        { name: 'Verified Traveler', icon: 'ShieldCheck', description: 'Completed Aadhaar / Govt ID identity verification' },
      ],
    };

    return {
      trips,
      bookings: formattedBookings,
      stats: travelStats,
    };
  }

  /**
   * Get single trip by ID (supports tripId or bookingId)
   */
  public async getCustomerTripById(userId: string, tripOrBookingId: string) {
    const { trips } = await this.getCustomerTrips(userId);
    const cleanId = String(tripOrBookingId).trim();
    const found = trips.find(
      (t: any) =>
        t.id === cleanId ||
        t.bookingId === cleanId ||
        t._id === cleanId ||
        t.tripId === cleanId ||
        t.packageId === cleanId ||
        `CAR-${t.bookingId}` === cleanId ||
        `TRIP-${t.bookingId}` === cleanId
    );
    if (!found) {
      throw new NotFoundError(`Trip or Booking "${tripOrBookingId}" not found`);
    }
    return found;
  }

  /**
   * Get Travel Documents for a Trip
   */
  public async getCustomerTripDocuments(userId: string, tripOrBookingId: string) {
    const trip = await this.getCustomerTripById(userId, tripOrBookingId);

    const documents = [
      {
        id: `doc-${trip.bookingId}-1`,
        tripId: trip.id,
        title: 'Official Booking Confirmation',
        type: 'booking',
        status: 'Confirmed',
        issueDate: trip.tripStartDate,
        downloadUrl: '#',
        fileType: 'PDF',
        fileSize: '1.2 MB',
        category: 'Booking',
        subtitle: `Booking ID: ${trip.bookingId} • Confirmed for ${trip.travelerCount} traveler(s)`,
        available: true,
        iconType: 'booking',
      },
      {
        id: `doc-${trip.bookingId}-2`,
        tripId: trip.id,
        title: 'Tax Invoice & Payment Receipt',
        type: 'invoice',
        status: 'Issued',
        issueDate: trip.tripStartDate,
        downloadUrl: '#',
        fileType: 'PDF',
        fileSize: '480 KB',
        category: 'Billing',
        subtitle: `Official GST Tax Invoice • Paid in Full via Razorpay`,
        available: true,
        iconType: 'invoice',
      },
      {
        id: `doc-${trip.bookingId}-3`,
        tripId: trip.id,
        title: 'Hotel Accommodation Voucher',
        type: 'hotel',
        status: 'Ready',
        issueDate: trip.tripStartDate,
        downloadUrl: '#',
        fileType: 'PDF',
        fileSize: '850 KB',
        category: 'Accommodation',
        subtitle: `${trip.hotel.name} • Check-in: ${trip.hotel.checkIn} • Check-out: ${trip.hotel.checkOut}`,
        available: true,
        iconType: 'hotel',
      },
      {
        id: `doc-${trip.bookingId}-4`,
        tripId: trip.id,
        title: 'Travel Insurance Policy',
        type: 'insurance',
        status: 'Ready',
        issueDate: trip.tripStartDate,
        downloadUrl: '#',
        fileType: 'PDF',
        fileSize: '620 KB',
        category: 'Insurance',
        subtitle: `Comprehensive Cover: ₹5,00,000 Medical & Baggage Protection`,
        available: true,
        iconType: 'insurance',
      },
      {
        id: `doc-${trip.bookingId}-5`,
        tripId: trip.id,
        title: 'Verified Driver & Vehicle Permit',
        type: 'transport',
        status: 'Ready',
        issueDate: trip.tripStartDate,
        downloadUrl: '#',
        fileType: 'PDF',
        fileSize: '510 KB',
        category: 'Transport',
        subtitle: `${trip.vehicle.name} (${trip.vehicle.number}) • Driver: ${trip.vehicle.driverName}`,
        available: true,
        iconType: 'transport',
      },
    ];

    return { documents };
  }
}

export const tripService = new TripService();
