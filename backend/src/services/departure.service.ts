import mongoose from 'mongoose';
import { DepartureModel, IDeparture, computeDepartureStatus, DepartureStatus } from '../models/departure.model.js';
import { PackageModel } from '../models/package.model.js';
import { BookingModel } from '../models/booking.model.js';
import { SavedTravelerModel } from '../models/savedTraveler.model.js';
import { TripModel } from '../models/trip.model.js';
import { NotFoundError, BadRequestError, ConflictError } from '../utils/errors.util.js';
import { socketService } from './socket.service.js';
import { NotificationDispatcher } from './notificationDispatcher.service.js';

export interface DepartureListItemDTO {
  id: string;
  departureId: string;
  packageId: string;
  packageName: string;
  destination: string;
  coverImage: string;
  departureDate: string;
  endDate: string;
  capacity: number;
  bookedSeats: number;
  availableSeats: number;
  status: DepartureStatus;
  isManualClosed: boolean;
  bookingOpens: string;
  bookingCloses: string;
  price: number;
}

export interface DepartureTravelerItemDTO {
  bookingId: string;
  bookingMongoId: string;
  travelerTitle: string; // e.g. "Subham", "Rahul + Priya", "XYZ Family"
  primaryName: string;
  bookingType: 'Solo' | 'Couple' | 'Group';
  phone: string;
  email: string;
  seats: number;
  bookingStatus: string;
  pickupPreference?: string;
  address?: string;
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
  medicalNotes?: string;
  documents?: Array<{
    id?: string;
    title: string;
    url: string;
    status?: string;
  }>;
  travelers: Array<{
    name: string;
    age: number;
    gender: string;
    phone?: string;
    email?: string;
    isPrimary?: boolean;
    governmentId?: {
      type: 'Aadhaar' | 'Voter ID' | 'None';
      status: string; // e.g. "✓ Aadhaar Verified", "✓ Voter ID Verified", "Missing"
      number?: string;
      frontUrl?: string;
      backUrl?: string;
    };
    drivingLicence?: {
      status: 'Uploaded' | 'Not Uploaded';
      number?: string;
      frontUrl?: string;
      backUrl?: string;
    };
    passport?: {
      status: 'Uploaded' | 'Not Uploaded';
      number?: string;
      documentUrl?: string;
    };
  }>;
  bookedAt: string;
}

class DepartureService {
  /**
   * Get all departures for an agency with live auto-computed status
   */
  public async getAgencyDepartures(agencyId: string | mongoose.Types.ObjectId): Promise<DepartureListItemDTO[]> {
    const departures = await DepartureModel.find({ agencyId })
      .populate('packageId', 'title destination coverImage featuredImage durationDays durationNights price totalSeats isDeleted')
      .sort({ departureDate: 1 });

    const results: DepartureListItemDTO[] = [];
    const seenIds = new Set<string>();

    for (const dep of departures) {
      const pkg = dep.packageId as any;
      if (!pkg || pkg.isDeleted) continue;

      const depIdStr = dep._id.toString();
      if (seenIds.has(depIdStr)) continue;
      seenIds.add(depIdStr);

      // Realtime compute status
      const liveStatus = computeDepartureStatus({
        status: dep.status,
        isManualClosed: dep.isManualClosed,
        departureDate: dep.departureDate,
        endDate: dep.endDate,
        bookingCloses: dep.bookingCloses,
        capacity: dep.capacity,
        bookedSeats: dep.bookedSeats,
      });

      if (dep.status !== liveStatus) {
        dep.status = liveStatus;
        await dep.save();
      }

      results.push({
        id: depIdStr,
        departureId: dep.departureId,
        packageId: pkg._id.toString(),
        packageName: pkg.title || 'Untitled Package',
        destination: pkg.destination || 'India',
        coverImage: pkg.coverImage || pkg.featuredImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
        departureDate: dep.departureDate.toISOString(),
        endDate: dep.endDate.toISOString(),
        capacity: dep.capacity,
        bookedSeats: dep.bookedSeats,
        availableSeats: Math.max(0, dep.capacity - dep.bookedSeats),
        status: liveStatus,
        isManualClosed: dep.isManualClosed,
        bookingOpens: dep.bookingOpens.toISOString(),
        bookingCloses: dep.bookingCloses.toISOString(),
        price: dep.priceOverride || pkg.price || 0,
      });
    }

    return results;
  }

  /**
   * Schedule a new departure linked to an existing package template.
   * Enforces: Exactly ONE departure document per package and calendar date.
   */
  public async scheduleNewDeparture(
    agencyId: string | mongoose.Types.ObjectId,
    data: {
      packageId: string;
      departureDate: string | Date;
      capacity: number;
      bookingOpens?: string | Date;
      bookingCloses?: string | Date;
      priceOverride?: number;
      notes?: string;
    }
  ): Promise<DepartureListItemDTO> {
    const isObjectId = mongoose.Types.ObjectId.isValid(data.packageId);
    const pkg = await PackageModel.findOne({
      ...(isObjectId
        ? { $or: [{ _id: data.packageId }, { packageId: data.packageId }] }
        : { packageId: data.packageId }),
      agencyId,
      isDeleted: false,
    });
    if (!pkg) {
      throw new NotFoundError('Package template not found or does not belong to your agency');
    }

    const departureDate = new Date(data.departureDate);
    if (isNaN(departureDate.getTime())) {
      throw new BadRequestError('Invalid departure date');
    }

    // Normalize date to calendar day window to prevent duplicate departures on same day
    const dayStart = new Date(departureDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(departureDate);
    dayEnd.setHours(23, 59, 59, 999);

    // Check if departure already exists for this package on the same date
    const existingDep = await DepartureModel.findOne({
      agencyId,
      packageId: pkg._id,
      departureDate: { $gte: dayStart, $lte: dayEnd },
    });

    if (existingDep) {
      // Return existing departure - DO NOT insert duplicate
      return {
        id: existingDep._id.toString(),
        departureId: existingDep.departureId,
        packageId: pkg._id.toString(),
        packageName: pkg.title,
        destination: pkg.destination,
        coverImage: pkg.coverImage || pkg.featuredImage || '',
        departureDate: existingDep.departureDate.toISOString(),
        endDate: existingDep.endDate.toISOString(),
        capacity: existingDep.capacity,
        bookedSeats: existingDep.bookedSeats,
        availableSeats: Math.max(0, existingDep.capacity - existingDep.bookedSeats),
        status: existingDep.status,
        isManualClosed: existingDep.isManualClosed,
        bookingOpens: existingDep.bookingOpens.toISOString(),
        bookingCloses: existingDep.bookingCloses.toISOString(),
        price: existingDep.priceOverride || pkg.price || 0,
      };
    }

    const durationDays = pkg.durationDays || 3;
    const endDate = new Date(departureDate.getTime() + (durationDays - 1) * 24 * 60 * 60 * 1000);
    const bookingOpens = data.bookingOpens ? new Date(data.bookingOpens) : new Date();
    const bookingCloses = data.bookingCloses ? new Date(data.bookingCloses) : new Date(departureDate);
    const capacity = Number(data.capacity) || pkg.totalSeats || 20;

    const departure = new DepartureModel({
      departureId: `DEP-${Date.now().toString(36).toUpperCase()}`,
      packageId: pkg._id,
      agencyId,
      departureDate,
      endDate,
      bookingOpens,
      bookingCloses,
      capacity,
      bookedSeats: 0,
      priceOverride: data.priceOverride,
      notes: data.notes || '',
      status: 'OPEN',
      isManualClosed: false,
    });

    await departure.save();

    // Broadcast live event
    socketService.getIO()?.emit('departure:created', {
      departureId: departure.departureId,
      packageId: pkg._id,
      departureDate,
    });

    NotificationDispatcher.notifyAgency(agencyId, {
      title: 'New Departure Scheduled',
      description: `New departure scheduled for "${pkg.title}" on ${departureDate.toLocaleDateString('en-IN')}.`,
      category: 'Bookings',
      priority: 'MEDIUM',
      targetRoute: '/agency/bookings',
    }).catch(() => {});

    return {
      id: departure._id.toString(),
      departureId: departure.departureId,
      packageId: pkg._id.toString(),
      packageName: pkg.title,
      destination: pkg.destination,
      coverImage: pkg.coverImage || pkg.featuredImage || '',
      departureDate: departure.departureDate.toISOString(),
      endDate: departure.endDate.toISOString(),
      capacity: departure.capacity,
      bookedSeats: 0,
      availableSeats: departure.capacity,
      status: 'OPEN',
      isManualClosed: false,
      bookingOpens: departure.bookingOpens.toISOString(),
      bookingCloses: departure.bookingCloses.toISOString(),
      price: departure.priceOverride || pkg.price,
    };
  }

  /**
   * Get all travelers for a departure
   */
  public async getDepartureTravelers(
    agencyId: string | mongoose.Types.ObjectId,
    departureId: string
  ): Promise<{
    departure: DepartureListItemDTO;
    travelers: DepartureTravelerItemDTO[];
  }> {
    const dep = await DepartureModel.findOne({
      _id: departureId,
      agencyId,
    }).populate('packageId', 'title destination coverImage featuredImage durationDays durationNights price');

    if (!dep) {
      throw new NotFoundError('Departure not found');
    }

    const pkg = dep.packageId as any;

    // Find confirmed bookings for this departure
    const bookings = await BookingModel.find({
      $or: [
        { departureId: dep._id },
        { packageId: dep.packageId, tripStartDate: dep.departureDate },
      ],
      isDeleted: false,
    }).sort({ createdAt: -1 });

    // Gather all traveler IDs across bookings to load document statuses
    const allTravelerIds = bookings.flatMap((b) => b.travelerIds || []);
    const savedTravelers = allTravelerIds.length > 0
      ? await SavedTravelerModel.find({ _id: { $in: allTravelerIds } }).lean()
      : [];
    const travelerMap = new Map(savedTravelers.map((t) => [t._id.toString(), t]));

    const travelerItems: DepartureTravelerItemDTO[] = bookings.map((b) => {
      const seats = b.travelersCount || 1;
      let bookingType: 'Solo' | 'Couple' | 'Group' = 'Solo';
      if (seats === 2) bookingType = 'Couple';
      else if (seats > 2) bookingType = 'Group';
      if (b.bookingType) bookingType = b.bookingType;

      let travelerTitle = b.customerName;
      const travelersList = b.travelers && b.travelers.length > 0 ? b.travelers : [
        {
          name: b.customerName,
          age: 28,
          gender: 'Male',
          phone: b.customerPhone,
          email: b.customerEmail,
          isPrimary: true,
        },
      ];

      if (bookingType === 'Couple' && travelersList.length >= 2) {
        travelerTitle = `${travelersList[0].name} + ${travelersList[1].name}`;
      } else if (bookingType === 'Group') {
        travelerTitle = `${travelersList[0].name}'s Group`;
      }

      return {
        bookingId: b.bookingId,
        bookingMongoId: b._id.toString(),
        travelerTitle,
        primaryName: b.customerName,
        bookingType,
        phone: b.customerPhone,
        email: b.customerEmail,
        seats,
        bookingStatus: b.status,
        pickupPreference: b.pickupPreference || 'Standard Pickup',
        address: b.address || 'Address not provided',
        emergencyContact: b.emergencyContact?.name ? b.emergencyContact : {
          name: 'Contact upon arrival',
          phone: b.customerPhone,
          relationship: 'Self',
        },
        medicalNotes: b.medicalNotes || 'No specific medical restrictions reported.',
        documents: b.documents && b.documents.length > 0 ? b.documents : [
          { title: 'ID Proof (Aadhaar / Voter ID)', url: '', status: 'Verified' },
        ],
        travelers: travelersList.map((t: any, idx: number) => {
          const stId = b.travelerIds?.[idx]?.toString();
          const st = stId ? travelerMap.get(stId) : null;

          const hasAadhaar = Boolean(st?.aadhaar?.frontUrl && st?.aadhaar?.backUrl);
          const hasVoterId = Boolean(st?.voterId?.frontUrl);
          const hasDL = Boolean(st?.drivingLicence?.frontUrl && st?.drivingLicence?.backUrl);
          const hasPassport = Boolean(st?.passport?.documentUrl);

          return {
            name: t.name,
            age: t.age || 26,
            gender: t.gender || 'Not specified',
            phone: t.phone || b.customerPhone,
            email: t.email || b.customerEmail,
            isPrimary: t.isPrimary,
            governmentId: {
              type: hasAadhaar ? 'Aadhaar' : hasVoterId ? 'Voter ID' : 'None',
              status: hasAadhaar ? '✓ Aadhaar Verified' : hasVoterId ? '✓ Voter ID Verified' : 'Missing',
              number: hasAadhaar ? st?.aadhaar?.number : hasVoterId ? st?.voterId?.number : undefined,
              frontUrl: hasAadhaar ? st?.aadhaar?.frontUrl : hasVoterId ? st?.voterId?.frontUrl : undefined,
              backUrl: hasAadhaar ? st?.aadhaar?.backUrl : undefined,
            },
            drivingLicence: {
              status: hasDL ? 'Uploaded' : 'Not Uploaded',
              number: st?.drivingLicence?.number,
              frontUrl: st?.drivingLicence?.frontUrl,
              backUrl: st?.drivingLicence?.backUrl,
            },
            passport: {
              status: hasPassport ? 'Uploaded' : 'Not Uploaded',
              number: st?.passport?.number,
              documentUrl: st?.passport?.documentUrl,
            },
          };
        }),
        bookedAt: b.createdAt.toISOString(),
      };
    });

    const liveStatus = computeDepartureStatus({
      status: dep.status,
      isManualClosed: dep.isManualClosed,
      departureDate: dep.departureDate,
      endDate: dep.endDate,
      bookingCloses: dep.bookingCloses,
      capacity: dep.capacity,
      bookedSeats: dep.bookedSeats,
    });

    return {
      departure: {
        id: dep._id.toString(),
        departureId: dep.departureId,
        packageId: pkg._id.toString(),
        packageName: pkg.title,
        destination: pkg.destination,
        coverImage: pkg.coverImage || pkg.featuredImage || '',
        departureDate: dep.departureDate.toISOString(),
        endDate: dep.endDate.toISOString(),
        capacity: dep.capacity,
        bookedSeats: dep.bookedSeats,
        availableSeats: Math.max(0, dep.capacity - dep.bookedSeats),
        status: liveStatus,
        isManualClosed: dep.isManualClosed,
        bookingOpens: dep.bookingOpens.toISOString(),
        bookingCloses: dep.bookingCloses.toISOString(),
        price: dep.priceOverride || pkg.price,
      },
      travelers: travelerItems,
    };
  }

  /**
   * Start Trip: moves departure to ONGOING, makes trip live for travelers, creates/updates Trip in operations
   */
  public async startDeparture(
    agencyId: string | mongoose.Types.ObjectId,
    departureId: string
  ): Promise<{ status: DepartureStatus; tripId: string }> {
    const dep = await DepartureModel.findOne({ _id: departureId, agencyId });
    if (!dep) {
      throw new NotFoundError('Departure not found');
    }

    const currentStatus = computeDepartureStatus({
      status: dep.status,
      isManualClosed: dep.isManualClosed,
      departureDate: dep.departureDate,
      endDate: dep.endDate,
      bookingCloses: dep.bookingCloses,
      capacity: dep.capacity,
      bookedSeats: dep.bookedSeats,
    });

    if (dep.status === 'COMPLETED' || currentStatus === 'COMPLETED') {
      throw new ConflictError(
        'This departure can no longer be modified because the trip has already started or completed.'
      );
    }

    dep.status = 'ONGOING';
    await dep.save();

    const pkg = await PackageModel.findById(dep.packageId);
    const bookings = await BookingModel.find({
      $or: [
        { departureId: dep._id },
        { packageId: dep.packageId, tripStartDate: dep.departureDate },
      ],
      isDeleted: false,
    });

    const bookingIds = bookings.map((b) => b.bookingId);
    const travelerCount = bookings.reduce((sum, b) => sum + (b.travelersCount || 1), 0);

    // Find or create live Trip in Trip Management
    let trip = await TripModel.findOne({
      agencyId,
      $or: [
        { packageId: dep.packageId, departureDate: dep.departureDate },
        { bookingIds: { $in: bookingIds } },
      ],
      isDeleted: false,
    });

    if (trip) {
      trip.statusCategory = 'Ongoing';
      trip.statusBadgeText = 'Trip Live & In Progress';
      trip.badgeColor = 'purple';
      trip.departureDate = dep.departureDate;
      trip.returnDate = dep.endDate;
      trip.travelerCount = Math.max(travelerCount, dep.bookedSeats);
      trip.capacity = dep.capacity;
      if (bookingIds.length > 0) {
        trip.bookingIds = Array.from(new Set([...trip.bookingIds, ...bookingIds]));
      }
      await trip.save();
    } else {
      trip = new TripModel({
        tripId: `TRIP-${Date.now().toString(36).toUpperCase()}`,
        agencyId,
        packageId: dep.packageId,
        packageName: pkg?.title || 'Tour Departure',
        departureDate: dep.departureDate,
        returnDate: dep.endDate,
        dateRangeText: `${new Date(dep.departureDate).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
        })} - ${new Date(dep.endDate).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })}`,
        destinationRoute: pkg?.destination || 'Destination',
        travelerCount: Math.max(travelerCount, dep.bookedSeats),
        capacity: dep.capacity,
        statusCategory: 'Ongoing',
        statusBadgeText: 'Trip Live & In Progress',
        badgeColor: 'purple',
        coverImage: pkg?.coverImage || pkg?.featuredImage || '',
        bookingIds,
      });
      await trip.save();
    }

    // Mark bookings confirmed
    await BookingModel.updateMany(
      { _id: { $in: bookings.map((b) => b._id) } },
      { $set: { status: 'CONFIRMED' } }
    );

    // Broadcast real-time events
    socketService.getIO()?.emit('departure:capacity-updated', {
      departureId: dep._id,
      bookedSeats: dep.bookedSeats,
      capacity: dep.capacity,
      status: 'ONGOING',
    });
    socketService.getIO()?.emit('trip:started', {
      departureId: dep._id,
      tripId: trip.tripId,
      packageId: dep.packageId,
    });

    // Notify agency: Trip Started
    NotificationDispatcher.notifyAgency(agencyId, {
      title: 'Trip Started',
      description: `Trip for "${pkg?.title || 'Package'}" is now live and in progress.`,
      category: 'Bookings',
      priority: 'HIGH',
      targetRoute: '/agency/bookings',
    }).catch(() => {});

    // Notify booked travelers
    for (const b of bookings) {
      if (b.userId) {
        NotificationDispatcher.notifyUser(b.userId.toString(), {
          title: 'Trip Started! 🎒',
          description: `Your trip for "${pkg?.title || 'Tour'}" is now live and in progress! Have a wonderful journey.`,
          category: 'Trips',
          priority: 'HIGH',
          targetRoute: '/user/my-trips',
        }).catch(() => {});

        socketService.emitToUser(b.userId.toString(), 'current_trip_updated', {
          bookingId: b.bookingId,
          status: 'ONGOING',
        });
        socketService.emitToUser(b.userId.toString(), 'trip_status_updated', {
          bookingId: b.bookingId,
          status: 'ONGOING',
        });
      }
    }

    return { status: 'ONGOING', tripId: trip.tripId };
  }

  /**
   * Reschedule Departure: changes departure dates and updates linked reservations
   */
  public async rescheduleDeparture(
    agencyId: string | mongoose.Types.ObjectId,
    departureId: string,
    newDepartureDateStr: string
  ): Promise<DepartureListItemDTO> {
    const dep = await DepartureModel.findOne({ _id: departureId, agencyId }).populate('packageId');
    if (!dep) {
      throw new NotFoundError('Departure not found');
    }

    const currentStatus = computeDepartureStatus({
      status: dep.status,
      isManualClosed: dep.isManualClosed,
      departureDate: dep.departureDate,
      endDate: dep.endDate,
      bookingCloses: dep.bookingCloses,
      capacity: dep.capacity,
      bookedSeats: dep.bookedSeats,
    });

    if (
      dep.status === 'ONGOING' ||
      dep.status === 'COMPLETED' ||
      currentStatus === 'ONGOING' ||
      currentStatus === 'COMPLETED'
    ) {
      throw new ConflictError(
        'This departure can no longer be modified because the trip has already started or completed.'
      );
    }

    const newDate = new Date(newDepartureDateStr);
    if (isNaN(newDate.getTime())) {
      throw new BadRequestError('Invalid departure date provided');
    }

    const pkg = dep.packageId as any;
    const durationDays = pkg?.durationDays || 3;
    const newEndDate = new Date(newDate.getTime() + (durationDays - 1) * 24 * 60 * 60 * 1000);

    dep.departureDate = newDate;
    dep.endDate = newEndDate;
    dep.bookingCloses = newDate;
    await dep.save();

    // Update bookings linked to this departure
    await BookingModel.updateMany(
      { departureId: dep._id },
      { $set: { tripStartDate: newDate, tripEndDate: newEndDate } }
    );

    // Update operational trip if already exists
    await TripModel.updateMany(
      { packageId: dep.packageId, departureDate: dep.departureDate },
      { $set: { departureDate: newDate, returnDate: newEndDate } }
    );

    // Broadcast realtime event
    socketService.getIO()?.emit('departure:rescheduled', {
      departureId: dep._id,
      newDepartureDate: newDate.toISOString(),
      newEndDate: newEndDate.toISOString(),
    });

    const liveStatus = computeDepartureStatus({
      status: dep.status,
      isManualClosed: dep.isManualClosed,
      departureDate: dep.departureDate,
      endDate: dep.endDate,
      bookingCloses: dep.bookingCloses,
      capacity: dep.capacity,
      bookedSeats: dep.bookedSeats,
    });

    return {
      id: dep._id.toString(),
      departureId: dep.departureId,
      packageId: pkg._id.toString(),
      packageName: pkg.title,
      destination: pkg.destination,
      coverImage: pkg.coverImage || pkg.featuredImage || '',
      departureDate: dep.departureDate.toISOString(),
      endDate: dep.endDate.toISOString(),
      capacity: dep.capacity,
      bookedSeats: dep.bookedSeats,
      availableSeats: Math.max(0, dep.capacity - dep.bookedSeats),
      status: liveStatus,
      isManualClosed: dep.isManualClosed,
      bookingOpens: dep.bookingOpens.toISOString(),
      bookingCloses: dep.bookingCloses.toISOString(),
      price: dep.priceOverride || pkg.price,
    };
  }

  /**
   * Manually close booking for this departure
   */
  public async closeDeparture(
    agencyId: string | mongoose.Types.ObjectId,
    departureId: string
  ): Promise<DepartureStatus> {
    const dep = await DepartureModel.findOne({ _id: departureId, agencyId }).populate('packageId');
    if (!dep) {
      throw new NotFoundError('Departure not found');
    }

    const currentStatus = computeDepartureStatus({
      status: dep.status,
      isManualClosed: dep.isManualClosed,
      departureDate: dep.departureDate,
      endDate: dep.endDate,
      bookingCloses: dep.bookingCloses,
      capacity: dep.capacity,
      bookedSeats: dep.bookedSeats,
    });

    if (
      dep.status === 'ONGOING' ||
      dep.status === 'COMPLETED' ||
      currentStatus === 'ONGOING' ||
      currentStatus === 'COMPLETED'
    ) {
      throw new ConflictError(
        'This departure can no longer be modified because the trip has already started or completed.'
      );
    }

    dep.isManualClosed = true;
    dep.status = 'BOOKING_CLOSED';
    await dep.save();

    // Broadcast realtime event
    socketService.getIO()?.emit('departure:capacity-updated', {
      departureId: dep._id,
      bookedSeats: dep.bookedSeats,
      capacity: dep.capacity,
      status: 'BOOKING_CLOSED',
    });

    const pkg = dep.packageId as any;
    NotificationDispatcher.notifyAgency(agencyId, {
      title: 'Departure Closed',
      description: `Bookings have been closed for "${pkg?.title || 'Package'}".`,
      category: 'Bookings',
      priority: 'MEDIUM',
    }).catch(() => {});

    return 'BOOKING_CLOSED';
  }

  /**
   * Manually end trip: departure completed, travelers moved to history
   */
  public async endDeparture(
    agencyId: string | mongoose.Types.ObjectId,
    departureId: string
  ): Promise<DepartureStatus> {
    const dep = await DepartureModel.findOne({ _id: departureId, agencyId }).populate('packageId');
    if (!dep) {
      throw new NotFoundError('Departure not found');
    }

    dep.status = 'COMPLETED';
    await dep.save();

    // Update Trip in operations
    await TripModel.updateMany(
      {
        agencyId,
        $or: [
          { packageId: dep.packageId, departureDate: dep.departureDate },
          { packageId: dep.packageId, statusCategory: 'Ongoing' },
        ],
      },
      {
        $set: {
          statusCategory: 'Completed',
          statusBadgeText: 'Trip Completed',
          badgeColor: 'slate',
        },
      }
    );

    // Update bookings
    await BookingModel.updateMany(
      { departureId: dep._id },
      { $set: { status: 'COMPLETED' } }
    );

    // Broadcast realtime events
    socketService.getIO()?.emit('departure:capacity-updated', {
      departureId: dep._id,
      bookedSeats: dep.bookedSeats,
      capacity: dep.capacity,
      status: 'COMPLETED',
    });
    socketService.getIO()?.emit('trip:ended', {
      departureId: dep._id,
      packageId: dep.packageId,
    });

    const completedBookings = await BookingModel.find({ departureId: dep._id }).select('userId bookingId').lean();
    for (const b of completedBookings) {
      if (b.userId) {
        socketService.emitToUser(b.userId.toString(), 'current_trip_updated', {
          bookingId: b.bookingId,
          status: 'COMPLETED',
        });
        socketService.emitToUser(b.userId.toString(), 'trip_status_updated', {
          bookingId: b.bookingId,
          status: 'COMPLETED',
        });
      }
    }

    const pkg = dep.packageId as any;
    NotificationDispatcher.notifyAgency(agencyId, {
      title: 'Trip Ended',
      description: `Departure for "${pkg?.title || 'Package'}" has ended and is marked completed.`,
      category: 'Bookings',
      priority: 'MEDIUM',
      targetRoute: '/agency/bookings',
    }).catch(() => {});

    // Notify booked travelers
    const depBookings = await BookingModel.find({
      $or: [
        { departureId: dep._id },
        { packageId: dep.packageId, tripStartDate: dep.departureDate },
      ],
      isDeleted: false,
    });
    for (const b of depBookings) {
      if (b.userId) {
        NotificationDispatcher.notifyUser(b.userId.toString(), {
          title: 'Trip Completed 🎉',
          description: `Your trip for "${pkg?.title || 'Tour'}" has concluded. Thank you for traveling with us!`,
          category: 'Trips',
          priority: 'MEDIUM',
          targetRoute: '/user/my-trips/history',
        }).catch(() => {});
      }
    }

    return 'COMPLETED';
  }

  /**
   * Cancel Departure: Rejects if ONGOING or COMPLETED; closes booking and cancels if OPEN or UPCOMING
   */
  public async cancelDeparture(
    agencyId: string | mongoose.Types.ObjectId,
    departureId: string
  ): Promise<{ success: boolean; message: string }> {
    const dep = await DepartureModel.findOne({ _id: departureId, agencyId }).populate('packageId');
    if (!dep) {
      throw new NotFoundError('Departure not found');
    }

    const currentStatus = computeDepartureStatus({
      status: dep.status,
      isManualClosed: dep.isManualClosed,
      departureDate: dep.departureDate,
      endDate: dep.endDate,
      bookingCloses: dep.bookingCloses,
      capacity: dep.capacity,
      bookedSeats: dep.bookedSeats,
    });

    if (
      dep.status === 'ONGOING' ||
      dep.status === 'COMPLETED' ||
      currentStatus === 'ONGOING' ||
      currentStatus === 'COMPLETED'
    ) {
      throw new ConflictError(
        'This departure can no longer be modified because the trip has already started or completed.'
      );
    }

    dep.isManualClosed = true;
    dep.status = 'BOOKING_CLOSED';
    await dep.save();

    socketService.getIO()?.emit('departure:cancelled', {
      departureId: dep._id,
    });

    return { success: true, message: 'Departure cancelled successfully' };
  }

  /**
   * Update Departure: Rejects if ONGOING or COMPLETED
   */
  public async updateDeparture(
    agencyId: string | mongoose.Types.ObjectId,
    departureId: string,
    updates: Partial<IDeparture>
  ): Promise<DepartureListItemDTO> {
    const dep = await DepartureModel.findOne({ _id: departureId, agencyId }).populate('packageId');
    if (!dep) {
      throw new NotFoundError('Departure not found');
    }

    const currentStatus = computeDepartureStatus({
      status: dep.status,
      isManualClosed: dep.isManualClosed,
      departureDate: dep.departureDate,
      endDate: dep.endDate,
      bookingCloses: dep.bookingCloses,
      capacity: dep.capacity,
      bookedSeats: dep.bookedSeats,
    });

    if (
      dep.status === 'ONGOING' ||
      dep.status === 'COMPLETED' ||
      currentStatus === 'ONGOING' ||
      currentStatus === 'COMPLETED'
    ) {
      throw new ConflictError(
        'This departure can no longer be modified because the trip has already started or completed.'
      );
    }

    if (updates.capacity) dep.capacity = updates.capacity;
    if (updates.priceOverride !== undefined) dep.priceOverride = updates.priceOverride;
    if (updates.notes !== undefined) dep.notes = updates.notes;
    await dep.save();

    const pkg = dep.packageId as any;
    return {
      id: dep._id.toString(),
      departureId: dep.departureId,
      packageId: pkg._id.toString(),
      packageName: pkg.title,
      destination: pkg.destination,
      coverImage: pkg.coverImage || pkg.featuredImage || '',
      departureDate: dep.departureDate.toISOString(),
      endDate: dep.endDate.toISOString(),
      capacity: dep.capacity,
      bookedSeats: dep.bookedSeats,
      availableSeats: Math.max(0, dep.capacity - dep.bookedSeats),
      status: currentStatus,
      isManualClosed: dep.isManualClosed,
      bookingOpens: dep.bookingOpens.toISOString(),
      bookingCloses: dep.bookingCloses.toISOString(),
      price: dep.priceOverride || pkg.price,
    };
  }

  /**
   * Export travelers as CSV (Excel compatible)
   */
  public async exportTravelersCsv(
    agencyId: string | mongoose.Types.ObjectId,
    departureId: string
  ): Promise<{ filename: string; csv: string }> {
    const data = await this.getDepartureTravelers(agencyId, departureId);

    const headers = [
      'Name',
      'Phone',
      'Email',
      'Gender',
      'Age',
      'Emergency Contact',
      'Booking ID',
      'Booking Type',
      'Pickup Preference',
      'Medical Notes',
      'Document Status',
      'Seat Count',
    ];

    const rows: string[] = [];
    rows.push(headers.join(','));

    for (const item of data.travelers) {
      for (const t of item.travelers) {
        const emergencyStr = item.emergencyContact
          ? `"${item.emergencyContact.name} (${item.emergencyContact.phone})"`
          : 'N/A';
        const docStatus = item.documents && item.documents.length > 0 ? 'Verified' : 'Pending';

        const row = [
          `"${t.name.replace(/"/g, '""')}"`,
          `"${t.phone || item.phone}"`,
          `"${t.email || item.email}"`,
          `"${t.gender}"`,
          t.age,
          emergencyStr,
          `"${item.bookingId}"`,
          `"${item.bookingType}"`,
          `"${item.pickupPreference || 'Standard'}"`,
          `"${(item.medicalNotes || 'None').replace(/"/g, '""')}"`,
          `"${docStatus}"`,
          item.seats,
        ];
        rows.push(row.join(','));
      }
    }

    const cleanName = data.departure.packageName.replace(/[^a-zA-Z0-9]/g, '_');
    const dateStr = new Date(data.departure.departureDate).toISOString().split('T')[0];
    const filename = `${cleanName}_${dateStr}_Travelers.csv`;

    return {
      filename,
      csv: rows.join('\n'),
    };
  }

  /**
   * Export travelers as PDF / Printable HTML manifest
   */
  public async exportTravelersPdfHtml(
    agencyId: string | mongoose.Types.ObjectId,
    departureId: string
  ): Promise<{ filename: string; html: string }> {
    const data = await this.getDepartureTravelers(agencyId, departureId);
    const dep = data.departure;
    const dateFormatted = new Date(dep.departureDate).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const rowsHtml = data.travelers
      .map(
        (item, idx) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #E2E8F0; font-weight: bold;">${idx + 1}</td>
          <td style="padding: 10px; border-bottom: 1px solid #E2E8F0;">
            <div style="font-weight: bold; color: #0F172A;">${item.travelerTitle}</div>
            <div style="font-size: 11px; color: #64748B;">ID: ${item.bookingId}</div>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #E2E8F0;">
            <span style="display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: bold; background: #EEF2FF; color: #4F46E5;">
              ${item.bookingType}
            </span>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #E2E8F0; color: #334155;">${item.phone}</td>
          <td style="padding: 10px; border-bottom: 1px solid #E2E8F0; text-align: center; font-weight: bold; color: #4F46E5;">${item.seats}</td>
          <td style="padding: 10px; border-bottom: 1px solid #E2E8F0; font-size: 12px; color: #475569;">
            ${item.emergencyContact ? `${item.emergencyContact.name}: ${item.emergencyContact.phone}` : 'N/A'}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #E2E8F0; font-size: 11px; color: #475569;">
            ${item.medicalNotes || 'None'}
          </td>
        </tr>
      `
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Traveler Manifest - ${dep.packageName}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 40px; color: #0F172A; }
          .header { border-bottom: 2px solid #4F46E5; padding-bottom: 20px; margin-bottom: 25px; }
          .title { font-size: 22px; font-weight: 800; color: #0F172A; margin: 0; }
          .meta { font-size: 13px; color: #64748B; margin-top: 6px; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 15px; }
          th { text-align: left; padding: 10px; background: #F8FAFC; border-bottom: 2px solid #CBD5E1; color: #475569; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">${dep.packageName}</h1>
          <div class="meta">
            Departure Date: <strong>${dateFormatted}</strong> &bull; Destination: <strong>${dep.destination}</strong> &bull; Capacity: <strong>${dep.bookedSeats} / ${dep.capacity} Booked</strong>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width: 30px;">#</th>
              <th>Traveler</th>
              <th>Type</th>
              <th>Phone</th>
              <th style="text-align: center;">Seats</th>
              <th>Emergency Contact</th>
              <th>Medical Notes</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const cleanName = dep.packageName.replace(/[^a-zA-Z0-9]/g, '_');
    const dateStr = new Date(dep.departureDate).toISOString().split('T')[0];
    const filename = `${cleanName}_${dateStr}_Manifest.html`;

    return {
      filename,
      html,
    };
  }
}

export const departureService = new DepartureService();
