import mongoose from 'mongoose';
import { BookingModel, IBooking } from '../models/booking.model.js';
import { PackageModel } from '../models/package.model.js';
import { AgencyModel } from '../models/agency.model.js';
import { PaymentModel } from '../models/payment.model.js';
import { NotFoundError, BadRequestError } from '../utils/errors.util.js';
import { AuditLoggerService } from './auditLogger.service.js';

export interface AgencyBookingDTO {
  id: string;
  bookingId: string;
  packageId: string;
  packageName: string;
  coverImage: string;
  departureDate: string;
  returnDate: string;
  bookingDate: string;
  travelerCount: number;
  packagePrice: number;
  totalAmount: number;
  amountPaid: number;
  remainingAmount: number;
  dueDate: string;
  owner: {
    id: string;
    name: string;
    gender: 'Male' | 'Female' | 'Other';
    age: number;
    phone?: string;
    email?: string;
    isPrimary: true;
  };
  partners: Array<{
    id: string;
    name: string;
    gender: 'Male' | 'Female' | 'Other';
    age: number;
    phone?: string;
    email?: string;
    isPrimary?: boolean;
  }>;
  traveler: {
    name: string;
    phone: string;
    email: string;
  };
  bookingStatus: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REFUNDED' | 'COMPLETED';
  paymentStatus: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'REFUNDED';
  tripEligibility: 'ELIGIBLE' | 'NOT_ELIGIBLE';
  specialRequests?: string;
  timeline: Array<{
    title: string;
    timestamp?: string;
    completed: boolean;
    active?: boolean;
  }>;
  paymentHistory: Array<{
    id: string;
    amount: number;
    date: string;
    method: string;
    reference: string;
    status: 'SUCCESS' | 'PENDING' | 'FAILED';
  }>;
  assignedTripId?: string;
  assignedTripName?: string;
}

export interface BookingGroupDTO {
  groupId: string;
  packageId: string;
  packageName: string;
  coverImage: string;
  departureDate: string;
  returnDate: string;
  minTravelers: number;
  maxCapacity: number;
  confirmedTravelerCount: number;
  fullyPaidTravelerCount: number;
  pendingPaymentTravelerCount: number;
  totalBookingsCount: number;
  pendingCount: number;
  cancelledCount: number;
  deadlineDate: string;
  deadlineText: string;
  isDeadlineExpired: boolean;
  groupStatus: 'OPEN' | 'READY_FOR_TRIP' | 'MINIMUM_NOT_REACHED' | 'MOVED_TO_TRIP' | 'CANCELLED';
  tripReadyReason?: 'CAPACITY_REACHED' | 'BOOKING_DEADLINE_EXPIRED' | 'MANUAL';
  assignedTripId?: string;
  expectedRevenue: number;
  bookings: AgencyBookingDTO[];
}

export interface AgencyBookingSummary {
  total: number;
  confirmed: number;
  confirmedPct: string;
  pending: number;
  pendingPct: string;
  cancelled: number;
  cancelledPct: string;
  tripReady: number;
  minNotReached: number;
}

export class AgencyBookingService {
  private mapToAgencyBooking(b: IBooking): AgencyBookingDTO {
    const bookingStatusMap: Record<string, 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REFUNDED' | 'COMPLETED'> = {
      CONFIRMED: 'CONFIRMED',
      PENDING: 'PENDING',
      CANCELLED: 'CANCELLED',
      COMPLETED: 'COMPLETED',
    };

    const paymentStatusMap: Record<string, 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'REFUNDED'> = {
      PAID: 'PAID',
      PARTIAL: 'PARTIALLY_PAID',
      PENDING: 'UNPAID',
      REFUNDED: 'REFUNDED',
    };

    const bStatus = bookingStatusMap[b.status] || 'PENDING';
    const pStatus = paymentStatusMap[b.paymentStatus] || 'UNPAID';
    const isEligible = bStatus === 'CONFIRMED' && pStatus === 'PAID';

    const depDateStr = b.tripStartDate ? new Date(b.tripStartDate).toISOString().split('T')[0] : '2026-06-15';
    const retDateStr = b.tripEndDate ? new Date(b.tripEndDate).toISOString().split('T')[0] : '2026-06-20';

    const totalAmount = b.totalAmount || 18999;
    const amountPaid = b.paidAmount || (pStatus === 'PAID' ? totalAmount : 0);
    const travelerCount = b.travelersCount || (b.travelers && b.travelers.length > 0 ? b.travelers.length : 1);
    const packagePrice = Math.round(totalAmount / (travelerCount || 1));

    const primaryTraveler = b.travelers && b.travelers.length > 0 ? b.travelers[0] : null;

    const partners =
      b.travelers && b.travelers.length > 1
        ? b.travelers.slice(1).map((t, idx) => ({
            id: t.id || `partner-${idx}`,
            name: t.name,
            gender: t.gender || 'Male',
            age: t.age || 28,
            phone: t.phone || '',
            email: t.email || '',
            isPrimary: false,
          }))
        : [];

    return {
      id: b.bookingId,
      bookingId: b.bookingId,
      packageId: b.packageId ? b.packageId.toString() : 'PKG-DEFAULT',
      packageName: b.packageName || 'Expedition Tour',
      coverImage:
        b.packageThumbnail ||
        'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=600&auto=format&fit=crop&q=80',
      departureDate: depDateStr,
      returnDate: retDateStr,
      bookingDate: b.createdAt ? new Date(b.createdAt).toISOString().split('T')[0] : '2026-05-10',
      travelerCount,
      packagePrice,
      totalAmount,
      amountPaid,
      remainingAmount: Math.max(0, totalAmount - amountPaid),
      dueDate: depDateStr,
      owner: {
        id: primaryTraveler?.id || `owner-${b.bookingId}`,
        name: primaryTraveler?.name || b.customerName || 'Traveler',
        gender: primaryTraveler?.gender || 'Male',
        age: primaryTraveler?.age || 30,
        phone: primaryTraveler?.phone || b.customerPhone || '',
        email: primaryTraveler?.email || b.customerEmail || '',
        isPrimary: true,
      },
      partners,
      traveler: {
        name: b.customerName || 'Traveler',
        phone: b.customerPhone || '',
        email: b.customerEmail || '',
      },
      bookingStatus: bStatus,
      paymentStatus: pStatus,
      tripEligibility: isEligible ? 'ELIGIBLE' : 'NOT_ELIGIBLE',
      specialRequests: '',
      timeline: [
        { title: 'Booking Created', timestamp: b.createdAt ? new Date(b.createdAt).toLocaleString() : undefined, completed: true },
        { title: 'Payment Confirmed', timestamp: pStatus === 'PAID' ? 'Verified' : undefined, completed: pStatus === 'PAID', active: pStatus !== 'PAID' },
        { title: 'Moved to Operations', completed: bStatus === 'CONFIRMED' },
      ],
      paymentHistory: [
        {
          id: b.transactionId || `tx-${b.bookingId}`,
          amount: amountPaid,
          date: b.createdAt ? new Date(b.createdAt).toISOString().split('T')[0] : '2026-05-10',
          method: b.paymentMethod || 'Razorpay UPI',
          reference: b.transactionId || `PAY-${b.bookingId}`,
          status: pStatus === 'PAID' ? 'SUCCESS' : 'PENDING',
        },
      ],
    };
  }

  /**
   * 1. Get Live KPI Summary for Agency Bookings
   */
  public async getBookingStats(agencyId: string | mongoose.Types.ObjectId): Promise<AgencyBookingSummary> {
    const aid = new mongoose.Types.ObjectId(agencyId.toString());

    const stats = await BookingModel.aggregate([
      { $match: { agencyId: aid } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          confirmed: {
            $sum: { $cond: [{ $eq: ['$status', 'CONFIRMED'] }, 1, 0] },
          },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'PENDING'] }, 1, 0] },
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ['$status', 'CANCELLED'] }, 1, 0] },
          },
        },
      },
    ]);

    const total = stats[0]?.total || 0;
    const confirmed = stats[0]?.confirmed || 0;
    const pending = stats[0]?.pending || 0;
    const cancelled = stats[0]?.cancelled || 0;

    const confirmedPct = total > 0 ? `${((confirmed / total) * 100).toFixed(1)}%` : '0%';
    const pendingPct = total > 0 ? `${((pending / total) * 100).toFixed(1)}%` : '0%';
    const cancelledPct = total > 0 ? `${((cancelled / total) * 100).toFixed(1)}%` : '0%';

    return {
      total,
      confirmed,
      confirmedPct,
      pending,
      pendingPct,
      cancelled,
      cancelledPct,
      tripReady: Math.max(0, Math.floor(confirmed / 2)),
      minNotReached: Math.max(0, Math.floor(pending / 2)),
    };
  }

  /**
   * 2. Get Live Bookings with Departure Groups for Agency
   */
  public async getBookings(
    agencyId: string | mongoose.Types.ObjectId
  ): Promise<{ bookings: AgencyBookingDTO[]; groups: BookingGroupDTO[]; summary: AgencyBookingSummary }> {
    const aid = new mongoose.Types.ObjectId(agencyId.toString());

    const rawBookings = await BookingModel.find({ agencyId: aid }).sort({ tripStartDate: 1, createdAt: -1 });
    const mappedBookings = rawBookings.map((b) => this.mapToAgencyBooking(b));

    // Group bookings by (packageId, departureDate)
    const groupsMap = new Map<string, AgencyBookingDTO[]>();
    for (const bk of mappedBookings) {
      const key = `${bk.packageId}_${bk.departureDate}`;
      if (!groupsMap.has(key)) {
        groupsMap.set(key, []);
      }
      groupsMap.get(key)!.push(bk);
    }

    const groups: BookingGroupDTO[] = [];
    for (const [key, bks] of groupsMap.entries()) {
      const first = bks[0];
      const totalTravelers = bks.reduce((sum, b) => sum + b.travelerCount, 0);
      const confirmedTravelers = bks
        .filter((b) => b.bookingStatus === 'CONFIRMED')
        .reduce((sum, b) => sum + b.travelerCount, 0);
      const paidTravelers = bks
        .filter((b) => b.paymentStatus === 'PAID')
        .reduce((sum, b) => sum + b.travelerCount, 0);
      const pendingTravelers = bks
        .filter((b) => b.paymentStatus === 'UNPAID' || b.paymentStatus === 'PARTIALLY_PAID')
        .reduce((sum, b) => sum + b.travelerCount, 0);

      const minTravelers = 10;
      const maxCapacity = 20;

      let groupStatus: 'OPEN' | 'READY_FOR_TRIP' | 'MINIMUM_NOT_REACHED' | 'MOVED_TO_TRIP' | 'CANCELLED' = 'OPEN';
      let tripReadyReason: 'CAPACITY_REACHED' | 'BOOKING_DEADLINE_EXPIRED' | 'MANUAL' | undefined = undefined;

      if (confirmedTravelers >= maxCapacity) {
        groupStatus = 'READY_FOR_TRIP';
        tripReadyReason = 'CAPACITY_REACHED';
      } else if (confirmedTravelers >= minTravelers) {
        groupStatus = 'READY_FOR_TRIP';
        tripReadyReason = 'MANUAL';
      } else {
        groupStatus = 'OPEN';
      }

      const expectedRevenue = bks.reduce((sum, b) => sum + b.totalAmount, 0);

      groups.push({
        groupId: `GRP-${key}`,
        packageId: first.packageId,
        packageName: first.packageName,
        coverImage: first.coverImage,
        departureDate: first.departureDate,
        returnDate: first.returnDate,
        minTravelers,
        maxCapacity,
        confirmedTravelerCount: confirmedTravelers,
        fullyPaidTravelerCount: paidTravelers,
        pendingPaymentTravelerCount: pendingTravelers,
        totalBookingsCount: bks.length,
        pendingCount: bks.filter((b) => b.bookingStatus === 'PENDING').length,
        cancelledCount: bks.filter((b) => b.bookingStatus === 'CANCELLED').length,
        deadlineDate: first.departureDate,
        deadlineText: `Departs on ${first.departureDate}`,
        isDeadlineExpired: new Date(first.departureDate) < new Date(),
        groupStatus,
        tripReadyReason,
        expectedRevenue,
        bookings: bks,
      });
    }

    const summary = await this.getBookingStats(agencyId);

    return {
      bookings: mappedBookings,
      groups,
      summary,
    };
  }

  /**
   * 3. Get Single Booking Manifest by ID
   */
  public async getBookingById(
    agencyId: string | mongoose.Types.ObjectId,
    bookingId: string
  ): Promise<AgencyBookingDTO> {
    const aid = new mongoose.Types.ObjectId(agencyId.toString());

    const b = await BookingModel.findOne({
      bookingId,
      agencyId: aid,
    });

    if (!b) {
      throw new NotFoundError(`Booking "${bookingId}" not found for this agency.`);
    }

    return this.mapToAgencyBooking(b);
  }

  /**
   * 4. Confirm Pending Booking
   */
  public async confirmBooking(
    agencyId: string | mongoose.Types.ObjectId,
    bookingId: string
  ): Promise<AgencyBookingDTO> {
    const aid = new mongoose.Types.ObjectId(agencyId.toString());

    const b = await BookingModel.findOne({
      bookingId,
      agencyId: aid,
    });

    if (!b) {
      throw new NotFoundError(`Booking "${bookingId}" not found.`);
    }

    b.status = 'CONFIRMED';
    b.updatedAt = new Date();
    await b.save();

    AuditLoggerService.log({
      actor: { id: aid.toString(), name: b.agencyName, email: '', role: 'AGENCY' },
      module: 'BOOKINGS',
      action: 'UPDATE',
      eventType: 'AGENCY_BOOKING_CONFIRMED',
      description: `Agency confirmed booking "${b.bookingId}" for customer "${b.customerName}"`,
      severity: 'Low',
      metadata: { bookingId: b.bookingId, totalAmount: b.totalAmount },
    });

    return this.mapToAgencyBooking(b);
  }

  /**
   * 5. Cancel Booking
   */
  public async cancelBooking(
    agencyId: string | mongoose.Types.ObjectId,
    bookingId: string,
    reason?: string
  ): Promise<AgencyBookingDTO> {
    const aid = new mongoose.Types.ObjectId(agencyId.toString());

    const b = await BookingModel.findOne({
      bookingId,
      agencyId: aid,
    });

    if (!b) {
      throw new NotFoundError(`Booking "${bookingId}" not found.`);
    }

    b.status = 'CANCELLED';
    b.updatedAt = new Date();
    await b.save();

    AuditLoggerService.log({
      actor: { id: aid.toString(), name: b.agencyName, email: '', role: 'AGENCY' },
      module: 'BOOKINGS',
      action: 'UPDATE',
      eventType: 'AGENCY_BOOKING_CANCELLED',
      description: `Agency cancelled booking "${b.bookingId}". Reason: ${reason || 'Not specified'}`,
      severity: 'Medium',
      metadata: { bookingId: b.bookingId, reason },
    });

    return this.mapToAgencyBooking(b);
  }
}

export const agencyBookingService = new AgencyBookingService();
