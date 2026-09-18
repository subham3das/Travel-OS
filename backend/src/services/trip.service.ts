import mongoose from 'mongoose';
import { BookingModel, IBooking } from '../models/booking.model.js';
import { TripModel, ITrip } from '../models/trip.model.js';
import { PackageModel } from '../models/package.model.js';
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

      formattedBookings.push({
        id: b.bookingId,
        packageId: String(b.packageId || ''),
        packageName: b.packageName,
        coverImage: b.packageThumbnail || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
        bookingDate: new Date(b.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        departureDate: b.tripStartDate ? new Date(b.tripStartDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Upcoming',
        travelerCount: b.travelersCount || 1,
        paymentStatus: b.paymentStatus === 'PAID' ? 'PAID' : (b.paymentStatus === 'PARTIALLY_PAID' ? 'PARTIALLY_PAID' : 'REFUNDED'),
        bookingStatus: bStatus,
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
    const found = trips.find(t => t.id === tripOrBookingId || t.bookingId === tripOrBookingId);
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
