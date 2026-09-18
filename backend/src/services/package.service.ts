import mongoose from 'mongoose';
import { PackageModel, IPackage } from '../models/package.model.js';
import { AgencyModel } from '../models/agency.model.js';
import { ReviewModel } from '../models/review.model.js';
import { NotFoundError } from '../utils/errors.util.js';
import { logger } from '../config/logger.config.js';

export interface CustomerPackageFilters {
  search?: string;
  q?: string;
  category?: string;
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
  public formatPackageResponse(pkg: any, agencyDoc?: any, reviewsDocs: any[] = []) {
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
      ? pkg.itinerary.map((item: any) => ({
          day: item.day,
          title: item.title,
          activities: Array.isArray(item.activities) ? item.activities : [item.description || 'Sightseeing and exploration'],
          image: item.stay || pkg.coverImage || pkg.featuredImage,
          overnightLocation: item.stay || destName,
        }))
      : [
          {
            day: 1,
            title: `Arrival & Welcome to ${destName}`,
            activities: ['Airport/Station Pickup', 'Hotel Check-in & Briefing', 'Local Market Walk & Dinner'],
            overnightLocation: destName,
          },
          {
            day: 2,
            title: 'Scenic Sightseeing & Exploration',
            activities: ['Guided Highlights Tour', 'Scenic Viewpoints & Nature Trail', 'Traditional Cultural Experience'],
            overnightLocation: destName,
          },
          {
            day: 3,
            title: 'Adventure & Signature Activities',
            activities: ['Outdoor Excursions', 'Photography Stops', 'Evening Leisure'],
            overnightLocation: destName,
          },
          {
            day: 4,
            title: 'Souvenirs & Departure',
            activities: ['Breakfast at Stay', 'Local Shopping', 'Transfer to Departure Point'],
            overnightLocation: destName,
          },
        ];

    const mappedReviews = reviewsDocs.map((r: any) => ({
      id: r.reviewId || String(r._id),
      travelerId: r.userId ? String(r.userId) : 'traveler-01',
      travelerName: r.userName || 'Traveler',
      travelerAvatar: r.userAvatar || '',
      date: r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recent',
      rating: r.rating || 5,
      comment: r.reviewText || '',
      photos: r.images || [],
    }));

    return {
      id: pkg.packageId || String(pkg._id),
      _id: String(pkg._id),
      packageId: pkg.packageId || String(pkg._id),
      agencyId: pkg.agencyId ? String(pkg.agencyId) : (agencyDoc?.agencyId || 'agency-001'),
      agencyName: pkg.agencyName || agencyDoc?.agencyName || agencyDoc?.name || 'ApnaTrip Partner Agency',
      agencyVerified: agencyDoc?.isVerified ?? true,
      agencyLocation: agencyDoc?.location || `${pkg.destinationCountry || 'India'}`,
      destinationId: destId,
      destinationName: destName,
      title: pkg.title,
      duration: durationFormatted,
      durationDays: days,
      durationNights: nights,
      price: priceFormatted,
      numericPrice: rawPrice,
      discountPrice: originalPriceFormatted,
      rating: pkg.rating || 4.8,
      reviewCount: pkg.reviewCount || reviewsDocs.length || 120,
      badge: pkg.discountPercent ? `${pkg.discountPercent}% Off` : (pkg.isFeatured ? 'Featured' : 'Best Seller'),
      badgeType: (pkg.isFeatured ? 'bestseller' : 'popular') as 'bestseller' | 'popular' | 'new' | 'luxury',
      overview: pkg.description || pkg.subtitle || `Experience the best of ${destName} with handpicked accommodations, expert local guides, and seamless transfers.`,
      coverImage: pkg.coverImage || pkg.featuredImage || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
      gallery: Array.isArray(pkg.galleryImages) && pkg.galleryImages.length > 0
        ? pkg.galleryImages
        : [
            pkg.coverImage || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800',
            'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=800',
            'https://images.unsplash.com/photo-1568849676085-51415703900f?q=80&w=800',
          ],
      groupSize: `${pkg.totalSeats || 15} Max Group`,
      difficulty: 'Moderate' as const,
      bestTime: 'Oct – May',
      vehicle: 'AC SUV / Tempo Traveler',
      startLocation: `${destName} Arrival Hub`,
      endLocation: `${destName} Departure Hub`,
      routeDetails: {
        distance: `${days * 120} km`,
        travelTime: `${days * 3}h total drive`,
        highway: 'Scenic Highway & Mountain Corridors',
        stops: [destName, 'Sightseeing Route', 'Cultural Stops'],
      },
      includes: Array.isArray(pkg.inclusions) && pkg.inclusions.length > 0
        ? pkg.inclusions
        : ['All hotel & resort stays', 'Daily breakfast & dinner', 'AC vehicle for all transfers', 'Experienced local tour guide', 'All toll taxes and permits'],
      excludes: Array.isArray(pkg.exclusions) && pkg.exclusions.length > 0
        ? pkg.exclusions
        : ['Airfare / Train tickets', 'Personal expenses & tips', 'Lunch and snacks unless specified', 'Travel insurance (optional add-on)'],
      itinerary: mappedItinerary,
      hotels: [
        {
          id: 'hotel-1',
          name: `Premium ${destName} Heritage Resort`,
          badge: '4-Star Luxury',
          rating: 4.8,
          reviewsCount: 310,
          amenities: ['Free WiFi', 'Breakfast Included', 'Mountain / Nature View', '24/7 Room Service'],
          location: destName,
          imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800',
        },
      ],
      activities: [
        {
          id: 'act-1',
          title: 'Guided Nature Hike & Photography',
          iconName: 'Camera',
          imageUrl: pkg.coverImage || 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800',
        },
      ],
      reviews: mappedReviews,
      faq: [
        {
          question: 'What is the cancellation policy for this package?',
          answer: 'Free cancellation up to 7 days before departure. 50% refund between 3 to 7 days. Non-refundable within 72 hours of departure.',
        },
        {
          question: 'Is this tour suitable for families and senior citizens?',
          answer: 'Yes! The pace is comfortable with easy walking trails, sanitized vehicles, and premium stays suitable for all age groups.',
        },
        {
          question: 'Are meals included?',
          answer: 'Daily breakfast and dinner are included as specified in the itinerary.',
        },
      ],
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

    const query: any = {
      isDeleted: false,
      status: { $in: ['APPROVED', 'DRAFT', 'PENDING'] }, // Show active marketplace inventory
    };

    const searchText = search || q;
    if (searchText && searchText.trim()) {
      const regex = new RegExp(searchText.trim(), 'i');
      query.$or = [
        { title: regex },
        { destination: regex },
        { category: regex },
        { agencyName: regex },
        { description: regex },
      ];
    }

    if (category && category !== 'all' && category !== 'All') {
      query.category = new RegExp(category.trim(), 'i');
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

    const formattedList = packages.map((pkg) => this.formatPackageResponse(pkg));

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
   * Get single package by ID (packageId or MongoDB _id or slug)
   */
  public async getPackageById(packageIdentifier: string) {
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

    // Fetch associated agency and reviews
    let agencyDoc: any = null;
    if (pkg.agencyId) {
      agencyDoc = await AgencyModel.findById(pkg.agencyId).lean();
    }

    const reviews = await ReviewModel.find({
      packageId: pkg._id,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return this.formatPackageResponse(pkg, agencyDoc, reviews);
  }

  /**
   * Featured Packages (for Home & Landing)
   */
  public async getFeaturedPackages(limit = 6) {
    const packages = await PackageModel.find({ isDeleted: false })
      .sort({ isFeatured: -1, rating: -1, bookingsCount: -1 })
      .limit(limit)
      .lean();

    return packages.map((p) => this.formatPackageResponse(p));
  }

  /**
   * Trending Packages
   */
  public async getTrendingPackages(limit = 8) {
    const packages = await PackageModel.find({ isDeleted: false })
      .sort({ bookingsCount: -1, rating: -1 })
      .limit(limit)
      .lean();

    return packages.map((p) => this.formatPackageResponse(p));
  }

  /**
   * Similar packages
   */
  public async getSimilarPackages(packageId: string, limit = 4) {
    const base = await this.getPackageById(packageId).catch(() => null);
    if (!base) return this.getFeaturedPackages(limit);

    const similar = await PackageModel.find({
      packageId: { $ne: base.id },
      isDeleted: false,
      $or: [
        { destination: new RegExp(base.destinationName, 'i') },
        { category: base.badge },
      ],
    })
      .limit(limit)
      .lean();

    if (similar.length === 0) {
      return this.getFeaturedPackages(limit);
    }

    return similar.map((p) => this.formatPackageResponse(p));
  }
}

export const packageService = new PackageService();
