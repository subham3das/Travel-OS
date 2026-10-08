import mongoose from 'mongoose';
import { PackageModel, IPackage } from '../models/package.model.js';
import { DepartureModel, computeDepartureStatus } from '../models/departure.model.js';
import { AgencyModel } from '../models/agency.model.js';
import { ReviewModel } from '../models/review.model.js';
import { NotFoundError } from '../utils/errors.util.js';
import { logger } from '../config/logger.config.js';
import { packageReadinessService, isPackageVisibleToTraveler } from './packageReadiness.service.js';

export interface CustomerPackageFilters {
  search?: string;
  q?: string;
  category?: string;
  adventureType?: string;
  destination?: string;
  agencyId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  difficulty?: string;
  duration?: string;
  sort?: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}

export class PackageService {
  /**
   * Helper to format a Package document into frontend TourPackage schema
   */
  public formatPackageResponse(
    pkg: any,
    agencyDoc?: any,
    reviewsDocs: any[] = [],
    activeDepartures: any[] = [],
    isBookable?: boolean,
    readinessInfo?: any
  ) {
    const rawPrice = pkg.price || 0;
    const priceFormatted = `₹${rawPrice.toLocaleString('en-IN')}`;
    const originalPriceFormatted = pkg.originalPrice
      ? `₹${pkg.originalPrice.toLocaleString('en-IN')}`
      : undefined;

    const days = pkg.durationDays || 4;
    const nights = pkg.durationNights || Math.max(1, days - 1);
    const durationFormatted = `${days} Days / ${nights} Nights`;

    const destName = pkg.destination || 'India';
    const destId = destName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const mappedItinerary = Array.isArray(pkg.itinerary) && pkg.itinerary.length > 0
      ? pkg.itinerary.map((item: any) => {
          let activities: string[] = [];
          if (Array.isArray(item.plans) && item.plans.length > 0) {
            activities = item.plans
              .map((p: any) => {
                const text = typeof p === 'string' ? p : p?.text || '';
                return text.replace(/^\d{1,2}:\d{2}\s*[-–—]?\s*/, '').trim();
              })
              .filter(Boolean);
          } else if (Array.isArray(item.activities) && item.activities.length > 0) {
            activities = item.activities
              .map((act: any) => {
                const text = typeof act === 'string' ? act : act?.title || act?.text || '';
                return text.replace(/^\d{1,2}:\d{2}\s*[-–—]?\s*/, '').trim();
              })
              .filter(Boolean);
          } else if (item.description) {
            activities = [item.description];
          }

          return {
            day: item.day,
            title: item.title,
            description: item.description || '',
            activities,
            image: item.stay || pkg.coverImage || pkg.featuredImage,
            overnightLocation: item.stay || destName,
          };
        })
      : [];

    const mappedReviews = reviewsDocs.map((r: any) => ({
      id: r.reviewId || String(r._id),
      travelerId: r.userId ? String(r.userId) : '',
      travelerName: r.userName || 'Verified Traveler',
      travelerAvatar: r.userAvatar || '',
      date: r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
      rating: Number(r.rating) || 5,
      comment: r.reviewText || '',
      photos: Array.isArray(r.images) ? r.images : [],
      verifiedPurchase: Boolean(r.verifiedPurchase),
    }));

    const reviewCount = reviewsDocs.length > 0 ? reviewsDocs.length : (pkg.reviewCount || 0);
    let calculatedRating = 0;
    if (reviewsDocs.length > 0) {
      const sum = reviewsDocs.reduce((acc: number, r: any) => acc + (Number(r.rating) || 0), 0);
      calculatedRating = Math.round((sum / reviewsDocs.length) * 10) / 10;
    } else if (pkg.rating && reviewCount > 0) {
      calculatedRating = pkg.rating;
    }

    const accommodationConfirmed = Boolean(pkg.accommodationConfirmed);
    const hotels = accommodationConfirmed && Array.isArray(pkg.accommodations) && pkg.accommodations.length > 0
      ? pkg.accommodations.map((acc: any, idx: number) => ({
          id: acc._id ? String(acc._id) : `hotel-${idx + 1}`,
          name: acc.hotelName || '',
          badge: acc.category || 'Hotel',
          rating: acc.rating || 0,
          reviewsCount: acc.reviewsCount || 0,
          amenities: Array.isArray(acc.amenities) ? acc.amenities : [],
          location: acc.city || acc.address || destName,
          imageUrl: (Array.isArray(acc.hotelImages) && acc.hotelImages[0]) || acc.imageUrl || '',
          roomType: acc.roomType || '',
          checkIn: acc.checkIn || '',
          checkOut: acc.checkOut || '',
          shortDescription: acc.shortDescription || '',
          dayRange: acc.dayRange || '',
        }))
      : [];

    const activities = Array.isArray(pkg.activities) && pkg.activities.length > 0
      ? pkg.activities
          .filter((act: any) => act && (act.title || act.name))
          .map((act: any, idx: number) => ({
            id: act.id || `act-${idx + 1}`,
            title: act.title || act.name || '',
            iconName: act.iconName || 'Camera',
            imageUrl: act.imageUrl || '',
          }))
      : [];

    const faq = Array.isArray(pkg.faq) && pkg.faq.length > 0
      ? pkg.faq
          .filter((item: any) => item && item.question)
          .map((item: any) => ({
            question: item.question,
            answer: item.answer || '',
          }))
      : [];

    const primaryDep = activeDepartures.find((d: any) => {
      const st = computeDepartureStatus(d);
      const cap = Number(d.capacity) || pkg.totalSeats || 20;
      const bkd = Number(d.bookedSeats) || 0;
      return st === 'OPEN' && (cap - bkd) > 0;
    }) || activeDepartures[0];
    const hasOpenDeparture = Boolean(primaryDep && computeDepartureStatus(primaryDep) === 'OPEN' && ((Number(primaryDep.capacity) || pkg.totalSeats || 20) - (Number(primaryDep.bookedSeats) || 0)) > 0);
    const computedBookable = typeof isBookable === 'boolean' ? isBookable : (hasOpenDeparture && Boolean(pkg.isActive) && !pkg.isDeleted);

    const departureInfo = primaryDep
      ? {
          departureId: primaryDep.departureId || String(primaryDep._id),
          departureDate: primaryDep.departureDate ? new Date(primaryDep.departureDate).toISOString() : new Date().toISOString(),
          endDate: primaryDep.endDate ? new Date(primaryDep.endDate).toISOString() : (primaryDep.departureDate ? new Date(primaryDep.departureDate).toISOString() : new Date().toISOString()),
          capacity: Number(primaryDep.capacity) || pkg.totalSeats || 20,
          bookedSeats: Number(primaryDep.bookedSeats) || 0,
          availableSeats: Math.max(0, (Number(primaryDep.capacity) || pkg.totalSeats || 20) - (Number(primaryDep.bookedSeats) || 0)),
          status: computeDepartureStatus({
            status: primaryDep.status,
            isManualClosed: primaryDep.isManualClosed,
            departureDate: primaryDep.departureDate,
            endDate: primaryDep.endDate,
            bookingCloses: primaryDep.bookingCloses,
            capacity: primaryDep.capacity,
            bookedSeats: primaryDep.bookedSeats,
          }),
        }
      : null;

    return {
      id: pkg.packageId || String(pkg._id),
      _id: String(pkg._id),
      packageId: pkg.packageId || String(pkg._id),
      isBookable: computedBookable,
      readiness: readinessInfo || null,
      agencyId: pkg.agencyId ? (typeof pkg.agencyId === 'object' && pkg.agencyId._id ? String(pkg.agencyId._id) : String(pkg.agencyId)) : (agencyDoc?.agencyId || 'agency-001'),
      agencyName: pkg.agencyName || (typeof pkg.agencyId === 'object' ? (pkg.agencyId.companyName || pkg.agencyId.name) : undefined) || agencyDoc?.companyName || agencyDoc?.agencyName || agencyDoc?.name || 'ApnaTrip Partner Agency',
      agencyVerified: agencyDoc?.isVerified ?? (typeof pkg.agencyId === 'object' ? (Boolean(pkg.agencyId.isVerified) || pkg.agencyId.verificationStatus === 'APPROVED') : true),
      agencyLocation: agencyDoc?.location || (typeof pkg.agencyId === 'object' ? pkg.agencyId.location : undefined) || `${pkg.destinationCountry || 'India'}`,
      destinationId: destId,
      destinationName: destName,
      title: pkg.title,
      category: pkg.category || 'Adventure',
      adventureType: pkg.adventureType || 'General Adventure',
      duration: durationFormatted,
      durationDays: days,
      durationNights: nights,
      price: priceFormatted,
      numericPrice: rawPrice,
      startingPrice: priceFormatted,
      discountPrice: originalPriceFormatted,
      rating: calculatedRating,
      reviewCount: reviewCount,
      reviewsCount: reviewCount,
      badge: pkg.discountPercent ? `${pkg.discountPercent}% Off` : (pkg.isFeatured ? 'Featured' : ''),
      badgeType: (pkg.isFeatured ? 'bestseller' : 'popular') as 'bestseller' | 'popular' | 'new' | 'luxury',
      overview: pkg.description || pkg.subtitle || '',
      coverImage: pkg.coverImage || pkg.featuredImage || (Array.isArray(pkg.images) && pkg.images[0]) || '',
      primaryImage: pkg.coverImage || pkg.featuredImage || (Array.isArray(pkg.images) && pkg.images[0]) || '',
      imageUrl: pkg.coverImage || pkg.featuredImage || (Array.isArray(pkg.images) && pkg.images[0]) || '',
      gallery: Array.isArray(pkg.galleryImages) && pkg.galleryImages.length > 0
        ? pkg.galleryImages
        : (Array.isArray(pkg.images) && pkg.images.length > 0 ? pkg.images : (pkg.coverImage ? [pkg.coverImage] : [])),
      nextDeparture: departureInfo,
      availableSeats: departureInfo?.availableSeats ?? (pkg.totalSeats || 20),
      departureSummary: departureInfo ? `Next: ${new Date(departureInfo.departureDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })} • ${departureInfo.availableSeats} seats left` : 'Departures available',
      packageStatus: pkg.status || 'APPROVED',
      status: pkg.status || 'APPROVED',
      groupSize: pkg.totalSeats ? `${pkg.totalSeats} Max Group` : 'Flexible Group',
      difficulty: 'Moderate' as const,
      bestTime: '',
      vehicle: '',
      startLocation: `${destName} Arrival Hub`,
      endLocation: `${destName} Departure Hub`,
      routeDetails: {
        distance: '',
        travelTime: '',
        highway: '',
        stops: [destName],
      },
      includes: Array.isArray(pkg.inclusions) ? pkg.inclusions : [],
      excludes: Array.isArray(pkg.exclusions) ? pkg.exclusions : [],
      itinerary: mappedItinerary,
      accommodationConfirmed,
      accommodations: pkg.accommodations || [],
      hotels,
      activities,
      reviews: mappedReviews,
      faq,
      departure: departureInfo,
      departures: activeDepartures.map((d: any) => {
        const capacity = Number(d.capacity) || pkg.totalSeats || 20;
        const bookedSeats = Number(d.bookedSeats) || 0;
        const availableSeats = Math.max(0, capacity - bookedSeats);
        const depStatus = computeDepartureStatus({
          status: d.status,
          isManualClosed: d.isManualClosed,
          departureDate: new Date(d.departureDate),
          endDate: new Date(d.endDate || d.departureDate),
          bookingCloses: d.bookingCloses ? new Date(d.bookingCloses) : new Date(d.departureDate),
          capacity,
          bookedSeats,
        });

        return {
          id: d.departureId || String(d._id),
          departureId: d.departureId || String(d._id),
          departureDate: new Date(d.departureDate).toISOString(),
          endDate: new Date(d.endDate || d.departureDate).toISOString(),
          capacity,
          bookedSeats,
          availableSeats,
          price: d.priceOverride || pkg.price,
          status: depStatus,
          isSelectable: depStatus === 'OPEN' && availableSeats > 0,
        };
      }),
    };
  }

  /**
   * List public packages with filtering, searching, and pagination
   */
  public async getPackages(filters: CustomerPackageFilters) {
    const {
      search,
      q,
      category,
      destination,
      agencyId,
      minPrice,
      maxPrice,
      minRating,
      sort = 'featured',
      page = 1,
      limit = 20,
    } = filters;

    // Fetch only bookable packages according to strict readiness criteria
    const bookableIds = await packageReadinessService.getBookablePackageIds();
    if (bookableIds.length === 0) {
      return {
        packages: [],
        pagination: {
          total: 0,
          page: Number(page),
          limit: Number(limit),
          totalPages: 1,
          hasMore: false,
        },
      };
    }

    const query: any = {
      _id: { $in: bookableIds },
      isDeleted: false,
      isActive: true,
      status: { $in: ['APPROVED', 'ACTIVE', 'PUBLISHED'] },
    };

    const searchText = search || q;
    if (searchText && searchText.trim()) {
      const regex = new RegExp(searchText.trim(), 'i');
      query.$or = [
        { title: regex },
        { destination: regex },
        { category: regex },
        { adventureType: regex },
        { agencyName: regex },
        { description: regex },
      ];
    }

    if (category && category !== 'all' && category !== 'All') {
      query.category = new RegExp(category.trim(), 'i');
    }

    if (filters.adventureType && filters.adventureType !== 'all' && filters.adventureType !== 'All') {
      query.adventureType = new RegExp(`^${filters.adventureType.trim()}$`, 'i');
    }

    if (destination && destination !== 'all' && destination !== 'All') {
      query.destination = new RegExp(destination.trim(), 'i');
    }

    if (agencyId) {
      if (mongoose.Types.ObjectId.isValid(agencyId)) {
        query.agencyId = new mongoose.Types.ObjectId(agencyId);
      } else {
        query.$or = query.$or || [];
        query.$or.push({ agencyName: new RegExp(agencyId, 'i') });
      }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
    }

    if (minRating !== undefined) {
      query.rating = { $gte: Number(minRating) };
    }

    let sortOption: any = { createdAt: -1 };
    if (sort === 'price-low') sortOption = { price: 1 };
    else if (sort === 'price-high') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };
    else if (sort === 'featured') sortOption = { isFeatured: -1, rating: -1, createdAt: -1 };

    const skip = (Math.max(1, page) - 1) * Math.max(1, limit);
    const take = Math.max(1, limit);

    const [total, packages] = await Promise.all([
      PackageModel.countDocuments(query),
      PackageModel.find(query).sort(sortOption).skip(skip).limit(take).lean(),
    ]);

    const formattedList = await this.enrichAndFormatPackages(packages);

    return {
      packages: formattedList,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / take) || 1,
        hasMore: skip + packages.length < total,
      },
    };
  }

  /**
   * Helper: Batch enrich package documents with live agency details and upcoming departures (zero N+1 queries)
   */
  public async enrichAndFormatPackages(packages: any[]): Promise<any[]> {
    if (!packages || packages.length === 0) return [];

    const agencyIds = packages.map((p) => p.agencyId).filter(Boolean);
    const agencies = agencyIds.length > 0
      ? await AgencyModel.find({ _id: { $in: agencyIds } }).lean()
      : [];
    const agencyMap = new Map<string, any>(agencies.map((a: any) => [String(a._id), a]));

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

    const departureMap = new Map<string, any[]>();
    for (const dep of departures) {
      const pKey = String(dep.packageId);
      if (!departureMap.has(pKey)) {
        departureMap.set(pKey, []);
      }
      departureMap.get(pKey)!.push(dep);
    }

    return packages.map((pkg) => {
      const agencyDoc = agencyMap.get(String(pkg.agencyId));
      const activeDepartures = departureMap.get(String(pkg._id)) || (pkg.packageId ? departureMap.get(pkg.packageId) : []) || [];
      return this.formatPackageResponse(pkg, agencyDoc, [], activeDepartures, true);
    });
  }

  /**
   * Get single package by ID (packageId or MongoDB _id or slug)
   * Enforces single source of truth validator: isPackageVisibleToTraveler
   */
  public async getPackageById(packageIdentifier: string, allowUnavailable: boolean = false) {
    if (!packageIdentifier || !packageIdentifier.trim()) {
      throw new NotFoundError('Package ID must be provided');
    }

    const trimmed = packageIdentifier.trim();
    let pkg: any = null;

    if (mongoose.Types.ObjectId.isValid(trimmed)) {
      pkg = await PackageModel.findOne({ _id: trimmed, isDeleted: false }).lean();
    }

    if (!pkg) {
      pkg = await PackageModel.findOne({
        packageId: { $regex: new RegExp(`^${trimmed}$`, 'i') },
        isDeleted: false,
      }).lean();
    }

    if (!pkg) {
      // Try matching slug or title
      pkg = await PackageModel.findOne({
        title: { $regex: new RegExp(trimmed.replace(/-/g, ' '), 'i') },
        isDeleted: false,
      }).lean();
    }

    if (!pkg) {
      throw new NotFoundError(`Tour package "${packageIdentifier}" not found`);
    }

    // Single source of truth visibility check
    const isVisible = await isPackageVisibleToTraveler(pkg);
    if (!isVisible && !allowUnavailable) {
      throw new NotFoundError('This package is currently unavailable.');
    }

    // Fetch associated agency and reviews
    let agencyDoc: any = null;
    if (pkg.agencyId) {
      agencyDoc = await AgencyModel.findById(pkg.agencyId).lean();
    }

    const reviews = await ReviewModel.find({
      packageId: pkg._id,
      isDeleted: false,
      status: 'Approved',
      isHidden: false,
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const packageQueryIds: any[] = [pkg._id];
    if (mongoose.Types.ObjectId.isValid(pkg._id)) {
      packageQueryIds.push(new mongoose.Types.ObjectId(pkg._id.toString()));
      packageQueryIds.push(pkg._id.toString());
    }
    if (pkg.packageId) {
      packageQueryIds.push(pkg.packageId);
    }

    const activeDepartures = await DepartureModel.find({
      packageId: { $in: packageQueryIds },
      $and: [
        {
          $or: [
            { endDate: { $gte: new Date() } },
            { departureDate: { $gte: new Date() } },
          ],
        },
      ],
    })
      .sort({ departureDate: 1 })
      .lean();

    const readiness = await packageReadinessService.getPackageReadiness(pkg);

    return this.formatPackageResponse(
      pkg,
      agencyDoc,
      reviews,
      activeDepartures,
      readiness.isBookable,
      readiness
    );
  }

  /**
   * Featured Packages (for Home & Landing)
   */
  public async getFeaturedPackages(limit = 6) {
    const bookableIds = await packageReadinessService.getBookablePackageIds();
    if (bookableIds.length === 0) return [];

    const packages = await PackageModel.find({
      _id: { $in: bookableIds },
      isDeleted: false,
      isActive: true,
    })
      .sort({ isFeatured: -1, rating: -1, bookingsCount: -1 })
      .limit(limit)
      .lean();

    return this.enrichAndFormatPackages(packages);
  }

  /**
   * Trending Packages
   */
  public async getTrendingPackages(limit = 8) {
    const bookableIds = await packageReadinessService.getBookablePackageIds();
    if (bookableIds.length === 0) return [];

    const packages = await PackageModel.find({
      _id: { $in: bookableIds },
      isDeleted: false,
      isActive: true,
    })
      .sort({ bookingsCount: -1, rating: -1 })
      .limit(limit)
      .lean();

    return this.enrichAndFormatPackages(packages);
  }

  /**
   * Similar packages
   */
  public async getSimilarPackages(packageId: string, limit = 4) {
    const base = await this.getPackageById(packageId).catch(() => null);
    const bookableIds = await packageReadinessService.getBookablePackageIds();
    if (bookableIds.length === 0) return [];

    if (!base) {
      return this.getFeaturedPackages(limit);
    }

    const basePkgId = base._id ? new mongoose.Types.ObjectId(base._id) : null;
    const filterIds = basePkgId ? bookableIds.filter((id) => String(id) !== String(basePkgId)) : bookableIds;

    const similar = await PackageModel.find({
      _id: { $in: filterIds },
      isDeleted: false,
      isActive: true,
      $or: [
        { destination: new RegExp(base.destinationName, 'i') },
        { adventureType: base.adventureType || 'General Adventure' },
        { category: base.category || base.badge },
      ],
    })
      .limit(limit)
      .lean();

    if (similar.length === 0) {
      return this.getFeaturedPackages(limit);
    }

    return this.enrichAndFormatPackages(similar);
  }
}

export const packageService = new PackageService();
