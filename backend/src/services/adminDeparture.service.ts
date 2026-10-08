import mongoose from 'mongoose';
import { DepartureModel, computeDepartureStatus, DepartureStatus } from '../models/departure.model.js';
import { PackageModel } from '../models/package.model.js';
import { AgencyModel } from '../models/agency.model.js';
import { BookingModel } from '../models/booking.model.js';
import { NotFoundError } from '../utils/errors.util.js';

export interface AdminDepartureQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  agency?: string;
  destination?: string;
  departureDate?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class AdminDepartureService {
  /**
   * 1. Departures Platform KPI Statistics
   */
  async getKPIStats() {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const [
      totalDepartures,
      upcomingDepartures,
      todayDepartures,
      ongoingDepartures,
      completedDepartures,
      soldOutDepartures,
      capacityAgg,
    ] = await Promise.all([
      DepartureModel.countDocuments(),
      DepartureModel.countDocuments({ departureDate: { $gt: now }, status: { $ne: 'COMPLETED' } }),
      DepartureModel.countDocuments({ departureDate: { $gte: startOfToday, $lte: endOfToday } }),
      DepartureModel.countDocuments({
        $or: [
          { status: 'ONGOING' },
          { departureDate: { $lte: now }, endDate: { $gte: now }, status: { $ne: 'COMPLETED' } },
        ],
      }),
      DepartureModel.countDocuments({
        $or: [{ status: 'COMPLETED' }, { endDate: { $lt: now } }],
      }),
      DepartureModel.countDocuments({ status: 'SOLDOUT' }),
      DepartureModel.aggregate([
        {
          $group: {
            _id: null,
            totalCapacity: { $sum: '$capacity' },
            totalBooked: { $sum: '$bookedSeats' },
          },
        },
      ]),
    ]);

    const totalCapacity = capacityAgg[0]?.totalCapacity || 0;
    const totalBooked = capacityAgg[0]?.totalBooked || 0;
    const occupancyRate = totalCapacity > 0 ? ((totalBooked / totalCapacity) * 100).toFixed(1) : '0';

    return {
      totalDepartures: {
        id: 'totalDepartures',
        title: 'Total Departures',
        value: totalDepartures.toLocaleString(),
        iconType: 'total',
        sparklineColor: '#6356E5',
      },
      upcomingDepartures: {
        id: 'upcomingDepartures',
        title: 'Upcoming Departures',
        value: upcomingDepartures.toLocaleString(),
        iconType: 'upcoming',
        sparklineColor: '#3B82F6',
      },
      todayDepartures: {
        id: 'todayDepartures',
        title: "Today's Departures",
        value: todayDepartures.toLocaleString(),
        iconType: 'today',
        sparklineColor: '#F59E0B',
      },
      ongoingDepartures: {
        id: 'ongoingDepartures',
        title: 'Ongoing Trips',
        value: ongoingDepartures.toLocaleString(),
        iconType: 'ongoing',
        sparklineColor: '#10B981',
      },
      completedDepartures: {
        id: 'completedDepartures',
        title: 'Completed Departures',
        value: completedDepartures.toLocaleString(),
        iconType: 'completed',
        sparklineColor: '#64748B',
      },
      soldOutDepartures: {
        id: 'soldOutDepartures',
        title: 'Sold Out',
        value: soldOutDepartures.toLocaleString(),
        iconType: 'soldout',
        sparklineColor: '#EC4899',
      },
      occupancyRate: {
        id: 'occupancyRate',
        title: 'Platform Occupancy Rate',
        value: `${occupancyRate}%`,
        subText: `${totalBooked} / ${totalCapacity} seats booked`,
        iconType: 'occupancy',
        sparklineColor: '#8B5CF6',
      },
    };
  }

  /**
   * 2. Paginated Master Departures List
   */
  async getDepartures(query: AdminDepartureQuery) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 10));
    const filter: Record<string, any> = {};

    // Filter by Agency
    if (query.agency && query.agency !== 'All' && query.agency !== 'All Agencies') {
      if (mongoose.Types.ObjectId.isValid(query.agency)) {
        filter.agencyId = new mongoose.Types.ObjectId(query.agency);
      } else {
        const matchedAgencies = await AgencyModel.find({
          $or: [
            { name: new RegExp(query.agency.trim(), 'i') },
            { agencyDisplayName: new RegExp(query.agency.trim(), 'i') },
          ],
        }).select('_id');
        filter.agencyId = { $in: matchedAgencies.map((a) => a._id) };
      }
    }

    // Filter by Destination
    if (query.destination && query.destination !== 'All' && query.destination !== 'All Destinations') {
      const matchedPkgs = await PackageModel.find({
        destination: new RegExp(query.destination.trim(), 'i'),
      }).select('_id');
      filter.packageId = { $in: matchedPkgs.map((p) => p._id) };
    }

    // Filter by Date
    if (query.departureDate) {
      const dateObj = new Date(query.departureDate);
      if (!isNaN(dateObj.getTime())) {
        const start = new Date(dateObj);
        start.setHours(0, 0, 0, 0);
        const end = new Date(dateObj);
        end.setHours(23, 59, 59, 999);
        filter.departureDate = { $gte: start, $lte: end };
      }
    } else if (query.startDate || query.endDate) {
      filter.departureDate = {};
      if (query.startDate) filter.departureDate.$gte = new Date(query.startDate);
      if (query.endDate) filter.departureDate.$lte = new Date(query.endDate);
    }

    // Search query across Departure ID, Package Name, Destination, Agency Name
    if (query.search && query.search.trim()) {
      const searchRegex = new RegExp(query.search.trim(), 'i');
      const [matchedPkgs, matchedAgencies] = await Promise.all([
        PackageModel.find({
          $or: [{ title: searchRegex }, { destination: searchRegex }],
        }).select('_id'),
        AgencyModel.find({
          $or: [{ name: searchRegex }, { agencyDisplayName: searchRegex }],
        }).select('_id'),
      ]);

      filter.$or = [
        { departureId: searchRegex },
        { packageId: { $in: matchedPkgs.map((p) => p._id) } },
        { agencyId: { $in: matchedAgencies.map((a) => a._id) } },
      ];
    }

    // Status filter
    if (query.status && query.status !== 'All' && query.status !== 'ALL') {
      filter.status = query.status.toUpperCase();
    }

    // Sort order
    const sortField = query.sortBy || 'departureDate';
    const sortDir = query.sortOrder === 'desc' ? -1 : 1;

    const [departures, total] = await Promise.all([
      DepartureModel.find(filter)
        .populate('packageId', 'title destination coverImage featuredImage price durationDays category')
        .populate('agencyId', 'name agencyDisplayName logo email phone')
        .sort({ [sortField]: sortDir })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      DepartureModel.countDocuments(filter),
    ]);

    const mappedDepartures = departures.map((dep: any) => {
      const pkg = dep.packageId || {};
      const agency = dep.agencyId || {};
      const computedStatus = computeDepartureStatus({
        status: dep.status,
        isManualClosed: dep.isManualClosed,
        departureDate: dep.departureDate,
        endDate: dep.endDate,
        bookingCloses: dep.bookingCloses,
        capacity: dep.capacity,
        bookedSeats: dep.bookedSeats,
      });

      const remainingSeats = Math.max(0, (dep.capacity || 0) - (dep.bookedSeats || 0));

      return {
        id: dep._id.toString(),
        departureId: dep.departureId,
        packageId: pkg._id ? pkg._id.toString() : '',
        packageName: pkg.title || 'Tour Package',
        packageImage: pkg.coverImage || pkg.featuredImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200',
        destination: pkg.destination || 'India',
        category: pkg.category || 'Adventure',
        durationDays: pkg.durationDays || 3,
        agencyId: agency._id ? agency._id.toString() : '',
        agencyName: agency.agencyDisplayName || agency.name || 'ApnaTrip Partner',
        agencyLogo: agency.logo || '',
        departureDate: dep.departureDate,
        endDate: dep.endDate,
        capacity: dep.capacity || 20,
        bookedSeats: dep.bookedSeats || 0,
        remainingSeats,
        price: dep.priceOverride || pkg.price || 0,
        bookingStatus: dep.isManualClosed ? 'CLOSED' : computedStatus === 'OPEN' ? 'OPEN' : computedStatus,
        tripStatus: computedStatus,
        status: computedStatus,
        notes: dep.notes || '',
        createdAt: dep.createdAt,
      };
    });

    return {
      departures: mappedDepartures,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 3. Get Single Departure Detail with Linked Bookings & Manifest
   */
  async getDepartureById(departureId: string) {
    const dep = await DepartureModel.findOne({
      $or: [
        { _id: mongoose.Types.ObjectId.isValid(departureId) ? departureId : null },
        { departureId },
      ],
    })
      .populate('packageId')
      .populate('agencyId')
      .lean();

    if (!dep) {
      throw new NotFoundError('Departure not found');
    }

    const pkg: any = dep.packageId || {};
    const agency: any = dep.agencyId || {};

    const computedStatus = computeDepartureStatus({
      status: dep.status,
      isManualClosed: dep.isManualClosed,
      departureDate: dep.departureDate,
      endDate: dep.endDate,
      bookingCloses: dep.bookingCloses,
      capacity: dep.capacity,
      bookedSeats: dep.bookedSeats,
    });

    // Fetch confirmed bookings for this departure
    const bookings = await BookingModel.find({
      $or: [
        { departureId: dep._id },
        { packageId: dep.packageId, tripStartDate: dep.departureDate },
      ],
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .lean();

    return {
      departure: {
        id: dep._id.toString(),
        departureId: dep.departureId,
        packageId: pkg._id ? pkg._id.toString() : '',
        packageName: pkg.title || 'Tour Package',
        packageImage: pkg.coverImage || pkg.featuredImage || '',
        destination: pkg.destination || 'India',
        category: pkg.category || 'Adventure',
        durationDays: pkg.durationDays || 3,
        agencyId: agency._id ? agency._id.toString() : '',
        agencyName: agency.agencyDisplayName || agency.name || 'Agency Partner',
        agencyEmail: agency.email,
        agencyPhone: agency.phone,
        agencyLogo: agency.logo || '',
        departureDate: dep.departureDate,
        endDate: dep.endDate,
        bookingOpens: dep.bookingOpens,
        bookingCloses: dep.bookingCloses,
        capacity: dep.capacity,
        bookedSeats: dep.bookedSeats,
        remainingSeats: Math.max(0, dep.capacity - dep.bookedSeats),
        price: dep.priceOverride || pkg.price || 0,
        bookingStatus: dep.isManualClosed ? 'CLOSED' : computedStatus === 'OPEN' ? 'OPEN' : computedStatus,
        tripStatus: computedStatus,
        status: computedStatus,
        notes: dep.notes || '',
        createdAt: dep.createdAt,
      },
      bookings: bookings.map((b: any) => ({
        id: b._id.toString(),
        bookingId: b.bookingId,
        customerName: b.customerName,
        customerEmail: b.customerEmail,
        customerPhone: b.customerPhone,
        travelersCount: b.travelersCount || 1,
        totalAmount: b.totalAmount,
        status: b.status,
        paymentStatus: b.paymentStatus,
        createdAt: b.createdAt,
      })),
      travelersCount: bookings.reduce((sum: number, b: any) => sum + (b.travelersCount || 1), 0),
    };
  }
}

export const adminDepartureService = new AdminDepartureService();
