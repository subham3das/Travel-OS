import mongoose from 'mongoose';
import { BookingModel } from '../models/booking.model.js';
import { PackageModel } from '../models/package.model.js';
import { TripModel } from '../models/trip.model.js';
import { AgencyModel } from '../models/agency.model.js';
import { logger } from '../config/logger.config.js';

import { DepartureModel } from '../models/departure.model.js';

/**
 * Shape of the single ongoing trip returned to the frontend.
 * All date math and progress calculation happens here — never on the client.
 */
export interface OngoingTripDTO {
  id: string;
  bookingId: string;
  packageId: string;
  packageName: string;
  coverImage: string;
  agencyName: string;
  destination: string;
  startDate: string;   // ISO
  endDate: string;     // ISO
  currentDay: number;
  totalDays: number;
  progressPercentage: number;  // 0–100, rounded integer
  status: 'ONGOING';
  // Routes for UI buttons
  viewRoute: string;
  chatRoute: string;
  documentsRoute: string;
  emergencyPhone: string;
}

export interface CurrentTripApiResponse {
  hasTrip: true;
  trip: OngoingTripDTO;
}

export interface NoTripApiResponse {
  hasTrip: false;
}

export type GetCurrentTripResponse = CurrentTripApiResponse | NoTripApiResponse;

export class MyTripService {
  /**
   * GET /api/my/current-trip
   *
   * Returns ONGOING package trips where:
   *   1. The agency has started the trip:
   *      - Departure.status = 'ONGOING'
   *      - TripModel.statusCategory = 'Ongoing'
   *      - Booking.status = 'ONGOING'
   *   OR
   *   2. Calendar travel dates are currently active:
   *      - tripStartDate <= today <= tripEndDate AND status in ['CONFIRMED', 'ONGOING']
   *
   * If multiple exist, prioritizes agency-started trips (most recent first).
   */
  public async getCurrentTrip(userId: string): Promise<GetCurrentTripResponse> {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const now = new Date();

    // Fetch all confirmed or ongoing package bookings for this user
    const bookings = await BookingModel.find({
      userId: userObjectId,
      isDeleted: false,
      status: { $in: ['CONFIRMED', 'ONGOING'] },
    })
      .populate('packageId')
      .populate('agencyId')
      .sort({ createdAt: -1 })
      .lean();

    if (bookings.length === 0) {
      return { hasTrip: false };
    }

    // 1. Gather all departure IDs and booking IDs
    const departureIds = bookings
      .map((b) => b.departureId)
      .filter((id) => Boolean(id) && mongoose.Types.ObjectId.isValid(String(id)))
      .map((id) => new mongoose.Types.ObjectId(String(id)));

    const bookingIds = bookings.map((b) => b.bookingId).filter(Boolean);

    // 2. Query departures to check if any is ONGOING
    const departures = departureIds.length > 0
      ? await DepartureModel.find({ _id: { $in: departureIds } }).lean()
      : [];
    const departureMap = new Map(departures.map((d) => [d._id.toString(), d]));

    // 3. Query operational trips that are Ongoing
    const trips = bookingIds.length > 0
      ? await TripModel.find({
          statusCategory: 'Ongoing',
          isDeleted: false,
          $or: [
            { bookingIds: { $in: bookingIds } },
            { 'travelers.bookingId': { $in: bookingIds } },
          ],
        }).lean()
      : [];

    // 4. Score and filter bookings
    const candidates: Array<{
      booking: any;
      tripDoc?: any;
      depDoc?: any;
      score: number;
    }> = [];

    for (const b of bookings) {
      const dep = b.departureId ? departureMap.get(String(b.departureId)) : null;
      const matchedTrip = trips.find((t) => t.bookingIds?.includes(b.bookingId));

      const isDepOngoing = dep?.status === 'ONGOING';
      const isTripOngoing = Boolean(matchedTrip);
      const isBookingOngoing = b.status === 'ONGOING';
      const isStartedByAgency = isDepOngoing || isTripOngoing || isBookingOngoing;

      // Completed departures / trips are not ongoing
      const isCompleted = dep?.status === 'COMPLETED' || b.status === 'COMPLETED';
      if (isCompleted) continue;

      const start = new Date(b.tripStartDate);
      const end = new Date(b.tripEndDate);
      const isWithinDates = now >= start && now <= end;

      if (isStartedByAgency) {
        // High priority: Agency explicitly started the trip
        candidates.push({
          booking: b,
          tripDoc: matchedTrip,
          depDoc: dep,
          score: 100,
        });
      } else if (isWithinDates) {
        // Normal priority: Currently within scheduled calendar dates
        candidates.push({
          booking: b,
          tripDoc: matchedTrip,
          depDoc: dep,
          score: 50,
        });
      }
    }

    if (candidates.length === 0) {
      return { hasTrip: false };
    }

    // Sort by agency-started first (score 100 > 50), then nearest start date to now
    candidates.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const aStart = new Date(a.booking.tripStartDate).getTime();
      const bStart = new Date(b.booking.tripStartDate).getTime();
      return Math.abs(aStart - now.getTime()) - Math.abs(bStart - now.getTime());
    });

    const chosen = candidates[0];
    const b = chosen.booking;
    const pkg = b.packageId as any;
    const agency = b.agencyId as any;

    const startDate = new Date(b.tripStartDate);
    const endDate = new Date(b.tripEndDate);

    const totalDays =
      pkg?.durationDays ||
      Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));

    // Calculate currentDay:
    let currentDay = 1;
    if (now < startDate) {
      // Trip started early by agency
      currentDay = 1;
    } else if (now > endDate) {
      currentDay = totalDays;
    } else {
      const daysElapsed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      currentDay = Math.min(totalDays, Math.max(1, daysElapsed + 1));
    }

    const progressPercentage = Math.min(
      100,
      Math.max(5, Math.round((currentDay / totalDays) * 100))
    );

    // TripDoc for richer route/emergency info
    let tripDoc: any = chosen.tripDoc;
    if (!tripDoc) {
      try {
        tripDoc = await TripModel.findOne({
          $or: [
            { bookingIds: b.bookingId },
            { 'travelers.bookingId': b.bookingId },
            { packageId: b.packageId?._id || b.packageId },
          ],
          isDeleted: false,
        }).lean();
      } catch (err) {
        logger.warn('getCurrentTrip: TripModel lookup failed for bookingId %s: %s', b.bookingId, (err as any)?.message);
      }
    }

    const tripId = tripDoc?.tripId || b.bookingId;
    const emergencyPhone =
      tripDoc?.emergencyInfo?.contactPhone || agency?.phone || '+91 98765 43210';

    const trip: OngoingTripDTO = {
      id: tripId,
      bookingId: b.bookingId,
      packageId: pkg?._id ? pkg._id.toString() : (b.packageId?.toString() ?? ''),
      packageName: b.packageName,
      coverImage: b.packageThumbnail || pkg?.coverImage || '',
      agencyName: b.agencyName || agency?.name || agency?.businessName || 'Travel Agency',
      destination: b.destination,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      currentDay,
      totalDays,
      progressPercentage,
      status: 'ONGOING',
      viewRoute: `/trips/${tripId}`,
      chatRoute: `/chat?agencyId=${agency?._id || b.agencyId || ''}&bookingId=${b.bookingId}`,
      documentsRoute: `/trips/${tripId}/documents`,
      emergencyPhone,
    };

    return { hasTrip: true, trip };
  }

  /**
   * Package bookings for this customer (used by MyTripsPage)
   */
  public async getMyPackageBookings(userId: string) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    return BookingModel.find({
      userId: userObjectId,
      isDeleted: false,
    })
      .populate('packageId')
      .populate('agencyId')
      .sort({ createdAt: -1 })
      .lean();
  }

  /**
   * Car rental bookings for this customer (used by MyTripsPage)
   */
  public async getMyCarRentalBookings(userId: string) {
    const { CarBookingModel } = await import('../models/carBooking.model.js');
    const userObjectId = new mongoose.Types.ObjectId(userId);
    return CarBookingModel.find({
      $or: [{ customerId: userObjectId }, { customerId: userId }],
      isDeleted: { $ne: true },
    })
      .populate('carId')
      .populate('agencyId')
      .sort({ createdAt: -1 })
      .lean();
  }
}

export const myTripService = new MyTripService();
