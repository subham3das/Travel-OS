import { PackageModel } from '../models/package.model.js';
import { AgencyModel } from '../models/agency.model.js';
import { DepartureModel } from '../models/departure.model.js';
import { BookingModel } from '../models/booking.model.js';
import { TripModel } from '../models/trip.model.js';
import { CarModel } from '../models/car.model.js';
import { CarBookingModel } from '../models/carBooking.model.js';
import { UserModel } from '../models/user.model.js';
import { ConversationModel } from '../models/conversation.model.js';
import { packageReadinessService } from './packageReadiness.service.js';

export interface GlobalSearchFilters {
  query?: string;
  category?: string;
  adventureType?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  duration?: string;
  type?: string;
  userId?: string;
}

export interface CanonicalSearchResult {
  id: string;
  type: 'package' | 'destination' | 'agency' | 'car' | 'traveler' | 'trip' | 'booking' | 'message';
  title: string;
  subtitle: string;
  slug: string;
  route: string;
  image: string;
  badge?: string;
  rating?: number;
  metadata?: Record<string, any>;
  // Backwards compatibility aliases
  targetUrl?: string;
  imageUrl?: string;
}

export class SearchService {
  public async search(filters: GlobalSearchFilters) {
    const q = (filters.query || '').trim();
    const regex = q ? new RegExp(q, 'i') : null;

    // 1. Search Packages - Only return bookable packages
    const bookablePackageIds = await packageReadinessService.getBookablePackageIds();
    const packageQuery: any = {
      _id: { $in: bookablePackageIds },
      isDeleted: false,
      isActive: true,
      status: { $in: ['APPROVED', 'ACTIVE', 'PUBLISHED'] },
    };
    if (regex) {
      packageQuery.$or = [
        { title: regex },
        { destination: regex },
        { category: regex },
        { adventureType: regex },
        { agencyName: regex },
        { description: regex },
      ];
    }
    if (filters.category && filters.category !== 'all') {
      packageQuery.category = new RegExp(filters.category, 'i');
    }
    if (filters.adventureType && filters.adventureType !== 'all') {
      packageQuery.adventureType = new RegExp(`^${filters.adventureType.trim()}$`, 'i');
    }
    if (filters.minPrice || filters.maxPrice) {
      packageQuery.price = {};
      if (filters.minPrice) packageQuery.price.$gte = Number(filters.minPrice);
      if (filters.maxPrice) packageQuery.price.$lte = Number(filters.maxPrice);
    }
    if (filters.minRating) {
      packageQuery.rating = { $gte: Number(filters.minRating) };
    }

    // 2. Search Agencies
    const agencyQuery: any = { isDeleted: false };
    if (regex) {
      agencyQuery.$or = [
        { name: regex },
        { agencyName: regex },
        { city: regex },
        { state: regex },
        { specializationTags: regex },
      ];
    }
    if (filters.minRating) {
      agencyQuery.rating = { $gte: Number(filters.minRating) };
    }

    // 3. Search Cars
    const carQuery: any = { isDeleted: { $ne: true } };
    if (regex) {
      carQuery.$or = [
        { name: regex },
        { brand: regex },
        { city: regex },
        { type: regex },
        { category: regex },
      ];
    }
    if (filters.minPrice || filters.maxPrice) {
      carQuery.dailyPrice = {};
      if (filters.minPrice) carQuery.dailyPrice.$gte = Number(filters.minPrice);
      if (filters.maxPrice) carQuery.dailyPrice.$lte = Number(filters.maxPrice);
    }

    // 4. Search Travelers (Users)
    const userQuery: any = {
      status: { $ne: 'Disabled' },
      'privacySettings.appearInSearch': { $ne: false },
    };
    if (regex) {
      userQuery.$or = [
        { fullName: regex },
        { username: regex },
        { homeCity: regex },
        { bio: regex },
      ];
    }

    // 5. Search Trips
    const tripQuery: any = {
      statusCategory: { $ne: 'Cancelled' },
    };
    if (regex) {
      tripQuery.$or = [
        { packageName: regex },
        { destinationRoute: regex },
        { tripId: regex },
        { dateRangeText: regex },
      ];
    }

    // 6. Search Bookings (Standard & Car)
    const bookingQuery: any = {};
    if (regex) {
      bookingQuery.$or = [
        { bookingId: regex },
        { packageName: regex },
        { customerName: regex },
        { customerEmail: regex },
      ];
    }

    const carBookingQuery: any = {};
    if (regex) {
      carBookingQuery.$or = [
        { bookingId: regex },
        { carName: regex },
        { customerName: regex },
        { customerEmail: regex },
        { pickupLocation: regex },
      ];
    }

    // 7. Search Conversations (Messages)
    const conversationQuery: any = { isDeleted: { $ne: true } };
    if (regex) {
      conversationQuery.$or = [
        { lastMessagePreview: regex },
      ];
    }

    // Execute queries in parallel
    const [
      packages,
      agencies,
      cars,
      users,
      trips,
      bookings,
      carBookings,
      conversations,
    ] = await Promise.all([
      PackageModel.find(packageQuery).populate('agencyId', 'companyName name logo verificationStatus isVerified rating reviewsCount').limit(12).lean(),
      AgencyModel.find(agencyQuery).limit(8).lean(),
      CarModel.find(carQuery).limit(8).lean(),
      q ? UserModel.find(userQuery).limit(6).lean() : Promise.resolve([]),
      q ? TripModel.find(tripQuery).limit(6).lean() : Promise.resolve([]),
      q ? BookingModel.find(bookingQuery).limit(6).lean() : Promise.resolve([]),
      q ? CarBookingModel.find(carBookingQuery).limit(6).lean() : Promise.resolve([]),
      q ? ConversationModel.find(conversationQuery).limit(6).lean() : Promise.resolve([]),
    ]);

    // Batch fetch upcoming departures for search packages (zero N+1 queries)
    const pkgIds: any[] = [];
    for (const p of packages) {
      if (p._id) {
        pkgIds.push(p._id);
        pkgIds.push(String(p._id));
      }
      if (p.packageId) {
        pkgIds.push(p.packageId);
      }
    }

    const departures = pkgIds.length > 0
      ? await DepartureModel.find({
          packageId: { $in: pkgIds },
          departureDate: { $gt: new Date() },
          status: { $nin: ['SOLDOUT', 'BOOKING_CLOSED'] as any },
        })
          .sort({ departureDate: 1 })
          .lean()
      : [];

    const departureMap = new Map<string, any>();
    for (const dep of departures) {
      const pKey = String(dep.packageId);
      if (!departureMap.has(pKey)) {
        departureMap.set(pKey, dep);
      }
    }

    // 1. Mapped Packages
    const mappedPackages: CanonicalSearchResult[] = packages.map((pkg: any) => {
      const id = pkg.packageId || String(pkg._id);
      const route = `/packages/${id}`;
      const image = pkg.coverImage || pkg.featuredImage || (Array.isArray(pkg.images) && pkg.images[0]) || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800';
      const agencyObj = typeof pkg.agencyId === 'object' && pkg.agencyId !== null ? pkg.agencyId : null;
      const agencyName = pkg.agencyName || agencyObj?.companyName || agencyObj?.name || 'Verified Partner Agency';
      const dep = departureMap.get(String(pkg._id)) || (pkg.packageId ? departureMap.get(pkg.packageId) : undefined);
      const capacity = Number(dep?.capacity) || pkg.totalSeats || 20;
      const bookedSeats = Number(dep?.bookedSeats) || 0;
      const availableSeats = dep ? Math.max(0, capacity - bookedSeats) : (pkg.totalSeats || 20);

      return {
        id,
        type: 'package',
        title: pkg.title,
        subtitle: `${pkg.destination || 'India'} • ${pkg.durationDays || 4} Days • by ${agencyName}`,
        slug: id,
        route,
        targetUrl: route,
        image,
        imageUrl: image,
        rating: pkg.rating || 4.8,
        badge: pkg.discountPercent ? `${pkg.discountPercent}% Off` : (pkg.isFeatured ? 'Featured' : 'Popular'),
        metadata: {
          price: `₹${(pkg.price || 0).toLocaleString('en-IN')}`,
          rawPrice: pkg.price || 0,
          duration: `${pkg.durationDays || 4}D/${pkg.durationNights || 3}N`,
          category: pkg.category || 'Adventure',
          adventureType: pkg.adventureType || 'General Adventure',
          agencyName,
          agencyId: agencyObj?._id ? String(agencyObj._id) : (pkg.agencyId ? String(pkg.agencyId) : undefined),
          reviewsCount: pkg.reviewCount || 120,
          availableSeats,
          nextDeparture: dep
            ? {
                departureId: dep.departureId || String(dep._id),
                departureDate: dep.departureDate,
                availableSeats,
                price: dep.priceOverride || pkg.price,
              }
            : undefined,
          departureSummary: dep
            ? `Next: ${new Date(dep.departureDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })} • ${availableSeats} seats left`
            : 'Departures available',
        },
      };
    });

    // Phase 7: Prioritize Adventure Type matches when searching (e.g. searching "Trekking" prioritizes Trekking packages)
    if (q) {
      const qLower = q.toLowerCase();
      mappedPackages.sort((a, b) => {
        const aAdv = ((a.metadata?.adventureType as string) || '').toLowerCase();
        const bAdv = ((b.metadata?.adventureType as string) || '').toLowerCase();
        const aMatch = aAdv === qLower || aAdv.includes(qLower) ? 1 : 0;
        const bMatch = bAdv === qLower || bAdv.includes(qLower) ? 1 : 0;
        return bMatch - aMatch;
      });
    }

    // 2. Mapped Destinations (Derived from packages or predefined destinations)
    const destinationMap = new Map<string, CanonicalSearchResult>();
    packages.forEach((pkg: any) => {
      const destName = pkg.destination || 'Meghalaya';
      const destId = destName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (!destinationMap.has(destId)) {
        const route = `/destinations/${destId}`;
        const image = pkg.coverImage || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800';

        destinationMap.set(destId, {
          id: destId,
          type: 'destination',
          title: destName,
          subtitle: `${pkg.destinationRegion || 'North India'} • Starting ₹${(pkg.price || 5999).toLocaleString('en-IN')}`,
          slug: destId,
          route,
          targetUrl: route,
          image,
          imageUrl: image,
          rating: 4.8,
          badge: 'Trending',
          metadata: {
            price: `From ₹${(pkg.price || 5999).toLocaleString('en-IN')}`,
            rawPrice: pkg.price || 5999,
            region: pkg.destinationRegion || 'India',
            packagesCount: 1,
          },
        });
      }
    });
    const mappedDestinations = Array.from(destinationMap.values());

    // 3. Mapped Agencies
    const mappedAgencies: CanonicalSearchResult[] = agencies.map((agency: any) => {
      const aid = agency.agencyId || String(agency._id);
      const agencyName = agency.agencyName || agency.name || 'Travel Agency';
      const location = agency.city ? `${agency.city}, ${agency.state || 'India'}` : (agency.location || 'India');
      const route = `/agency/${aid}`;
      const image = agency.logo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200';

      return {
        id: aid,
        type: 'agency',
        title: agencyName,
        subtitle: `${location} • ${agency.tripsCompleted || '1,000+'}+ Trips`,
        slug: aid,
        route,
        targetUrl: route,
        image,
        imageUrl: image,
        rating: agency.rating || 4.9,
        badge: agency.isVerified ? 'Verified' : 'Partner',
        metadata: {
          location,
          tripsCompleted: agency.tripsCompleted || 100,
          tags: Array.isArray(agency.specializationTags) ? agency.specializationTags.slice(0, 2) : ['Adventure'],
          reviewsCount: agency.reviewCount || 95,
        },
      };
    });

    // 4. Mapped Cars
    const mappedCars: CanonicalSearchResult[] = cars.map((car: any) => {
      const cid = String(car._id);
      const route = `/cars/${cid}`;
      const image = car.thumbnail || (Array.isArray(car.images) && car.images[0]) || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800';

      return {
        id: cid,
        type: 'car',
        title: car.name,
        subtitle: `${car.brand || 'Vehicle'} • ${car.type ? car.type.toUpperCase() : 'SUV'} in ${car.city || 'Station'}`,
        slug: cid,
        route,
        targetUrl: route,
        image,
        imageUrl: image,
        rating: car.averageRating || 4.8,
        badge: `₹${(car.dailyPrice || 2500).toLocaleString('en-IN')}/day`,
        metadata: {
          brand: car.brand,
          city: car.city,
          type: car.type,
          dailyPrice: car.dailyPrice,
          seats: car.specs?.seats || 5,
        },
      };
    });

    // 5. Mapped Travelers
    const mappedTravelers: CanonicalSearchResult[] = users.map((u: any) => {
      const uid = String(u._id);
      const route = `/traveler/${uid}`;
      const image = u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200';

      return {
        id: uid,
        type: 'traveler',
        title: u.fullName || 'Traveler',
        subtitle: `${u.username ? '@' + u.username : 'Explorer'} • ${u.homeCity || 'India'}`,
        slug: u.username || uid,
        route,
        targetUrl: route,
        image,
        imageUrl: image,
        badge: u.isKycVerified ? 'Verified' : undefined,
        metadata: {
          username: u.username,
          homeCity: u.homeCity,
          bio: u.bio,
        },
      };
    });

    // 6. Mapped Trips
    const mappedTrips: CanonicalSearchResult[] = trips.map((t: any) => {
      const tid = t.tripId || String(t._id);
      const route = `/trips/${tid}`;
      const image = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800';

      return {
        id: tid,
        type: 'trip',
        title: t.packageName || `Trip: ${tid}`,
        subtitle: `${t.dateRangeText || 'Scheduled'} • ${t.destinationRoute || 'India'}`,
        slug: tid,
        route,
        targetUrl: route,
        image,
        imageUrl: image,
        badge: t.statusCategory || 'Upcoming',
        metadata: {
          travelerCount: t.travelerCount,
          status: t.statusCategory,
        },
      };
    });

    // 7. Mapped Bookings (Tour + Car)
    const mappedTourBookings: CanonicalSearchResult[] = bookings.map((b: any) => {
      const bid = b.bookingId || String(b._id);
      const route = `/bookings/${bid}`;
      const image = b.packageThumbnail || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800';

      return {
        id: bid,
        type: 'booking',
        title: `Booking: ${b.packageName || bid}`,
        subtitle: `ID: ${bid} • ${b.customerName || 'Traveler'} • ₹${(b.totalAmount || 0).toLocaleString('en-IN')}`,
        slug: bid,
        route,
        targetUrl: route,
        image,
        imageUrl: image,
        badge: b.bookingStatus || 'CONFIRMED',
        metadata: {
          amount: b.totalAmount,
          paymentStatus: b.paymentStatus,
          status: b.bookingStatus,
        },
      };
    });

    const mappedCarBookings: CanonicalSearchResult[] = carBookings.map((cb: any) => {
      const bid = cb.bookingId || String(cb._id);
      const route = `/bookings/${bid}`;
      const image = cb.carThumbnail || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800';

      return {
        id: bid,
        type: 'booking',
        title: `Car Rental: ${cb.carName || bid}`,
        subtitle: `ID: ${bid} • ${cb.pickupLocation || 'Station'} • ₹${(cb.totalAmount || 0).toLocaleString('en-IN')}`,
        slug: bid,
        route,
        targetUrl: route,
        image,
        imageUrl: image,
        badge: cb.status || 'CONFIRMED',
        metadata: {
          amount: cb.totalAmount,
          paymentStatus: cb.paymentStatus,
          status: cb.status,
          bookingType: 'CAR_RENTAL',
        },
      };
    });
    const mappedAllBookings = [...mappedTourBookings, ...mappedCarBookings];

    // 8. Mapped Messages
    const mappedMessages: CanonicalSearchResult[] = conversations.map((c: any) => {
      const cid = String(c._id);
      const route = `/chat/${cid}`;
      const image = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200';

      return {
        id: cid,
        type: 'message',
        title: `Chat Conversation`,
        subtitle: c.lastMessagePreview || 'Click to view conversation',
        slug: cid,
        route,
        targetUrl: route,
        image,
        imageUrl: image,
        badge: c.unreadCustomerCount ? `${c.unreadCustomerCount} New` : undefined,
        metadata: {
          businessType: c.businessType,
          lastMessageAt: c.lastMessageAt,
        },
      };
    });

    const totalCount =
      mappedDestinations.length +
      mappedPackages.length +
      mappedAgencies.length +
      mappedCars.length +
      mappedTravelers.length +
      mappedTrips.length +
      mappedAllBookings.length +
      mappedMessages.length;

    return {
      destinations: mappedDestinations,
      packages: mappedPackages,
      agencies: mappedAgencies,
      cars: mappedCars,
      travelers: mappedTravelers,
      trips: mappedTrips,
      bookings: mappedAllBookings,
      messages: mappedMessages,
      totalCount,
    };
  }
}

export const searchService = new SearchService();
