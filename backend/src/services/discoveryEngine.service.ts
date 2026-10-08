import mongoose from 'mongoose';
import { PackageModel } from '../models/package.model.js';
import { AgencyModel } from '../models/agency.model.js';
import { DepartureModel } from '../models/departure.model.js';
import { CarModel } from '../models/car.model.js';
import { CMSTrendingDestinationModel } from '../models/cmsFeature.model.js';
import { SectionConfigurationModel, ISectionConfiguration } from '../models/sectionConfiguration.model.js';
import { rankingService } from './ranking.service.js';
import { cmsOverrideService } from './cmsOverride.service.js';
import { recommendationService } from './recommendation.service.js';
import { packageReadinessService } from './packageReadiness.service.js';

export interface DiscoverySectionResponse {
  id: string;
  sectionId: string;
  title: string;
  subtitle: string;
  emoji?: string;
  type: 'package' | 'agency' | 'destination' | 'car_rental';
  order: number;
  totalCount: number;
  hasMore: boolean;
  viewAllLink?: string;
  items: any[];
}

export const ADVENTURE_TYPE_SECTION_METADATA: Record<string, { title: string; subtitle: string; emoji: string }> = {
  Trekking: {
    title: 'Trekking Adventures',
    subtitle: 'Scenic mountain trails, high-altitude passes, and guided alpine treks',
    emoji: '🥾',
  },
  Camping: {
    title: 'Camping Escapes',
    subtitle: 'Wilderness retreats, riverside camps, and starry night stays',
    emoji: '🏕️',
  },
  Backpacking: {
    title: 'Backpacking Journeys',
    subtitle: 'Budget-friendly trails, explorer routes, and authentic cultural immersion',
    emoji: '🎒',
  },
  Expedition: {
    title: 'Grand Expeditions',
    subtitle: 'Challenging high-altitude circuits and remote wilderness conquests',
    emoji: '🏔️',
  },
  'Road Trip': {
    title: 'Road Trips',
    subtitle: 'Iconic mountain passes, coastal drives, and open highway adventures',
    emoji: '🚙',
  },
  'Wildlife Safari': {
    title: 'Wildlife Safaris',
    subtitle: 'Tiger reserves, bird sanctuaries, and thrilling jungle safaris',
    emoji: '🦁',
  },
  'Desert Safari': {
    title: 'Desert Safaris',
    subtitle: 'Dune bashing, camel caravans, and traditional desert campfires',
    emoji: '🐪',
  },
  Cycling: {
    title: 'Cycling Tours',
    subtitle: 'Pedal through lush hills, valleys, and scenic countryside trails',
    emoji: '🚴',
  },
  'River Rafting': {
    title: 'River Rafting & Rapids',
    subtitle: 'White water rapids, river rafting, and adrenaline river sports',
    emoji: '🚣',
  },
  Skiing: {
    title: 'Skiing & Winter Sports',
    subtitle: 'Powder snow slopes, snowboarding, and alpine ski resorts',
    emoji: '⛷️',
  },
  'Snow Adventure': {
    title: 'Snow Adventures',
    subtitle: 'Frozen lake treks, snowshoeing, and glacial landscapes',
    emoji: '❄️',
  },
  'Scuba Diving': {
    title: 'Scuba Diving & Reefs',
    subtitle: 'PADI dive sites, coral reefs, and vibrant underwater marine life',
    emoji: '🤿',
  },
  Paragliding: {
    title: 'Paragliding & Aerial Adventures',
    subtitle: 'Soar across valleys and mountain thermals with tandem pilots',
    emoji: '🪂',
  },
  'General Adventure': {
    title: 'Adventure Highlights',
    subtitle: 'Thrilling outdoor activities and versatile holiday packages',
    emoji: '🧗',
  },
};

export class DiscoveryEngineService {
  /**
   * Helper: Get formatted title, subtitle, and emoji for any Adventure Type
   */
  public getAdventureMeta(advType: string): { title: string; subtitle: string; emoji: string } {
    if (ADVENTURE_TYPE_SECTION_METADATA[advType]) {
      return ADVENTURE_TYPE_SECTION_METADATA[advType];
    }
    return {
      title: `${advType} Adventures`,
      subtitle: `Curated ${advType.toLowerCase()} experiences from verified partner agencies`,
      emoji: '🧭',
    };
  }
  /**
   * Helper: Format raw package doc into clean universal format with agency & departure details
   */
  private formatPackage(pkg: any, primaryDep?: any, agencyDoc?: any): any {
    const rawPrice = (primaryDep && primaryDep.priceOverride) || pkg.price || 0;
    const priceFormatted = `₹${rawPrice.toLocaleString('en-IN')}`;
    const originalPriceFormatted = pkg.originalPrice
      ? `₹${pkg.originalPrice.toLocaleString('en-IN')}`
      : undefined;
    const days = pkg.durationDays || 4;
    const nights = pkg.durationNights || Math.max(1, days - 1);

    const agencyObj = agencyDoc || (typeof pkg.agencyId === 'object' && pkg.agencyId !== null ? pkg.agencyId : null);
    const agencyName = pkg.agencyName || agencyObj?.companyName || agencyObj?.name || 'Verified Partner Agency';
    const agencyId = agencyObj?._id ? String(agencyObj._id) : (agencyObj?.agencyId || (pkg.agencyId ? String(pkg.agencyId) : undefined));
    const agencyLogo = agencyObj?.logo || '';
    const agencyVerified = agencyObj ? (Boolean(agencyObj.isVerified) || agencyObj.verificationStatus === 'APPROVED' || agencyObj.verificationStatus === 'VERIFIED') : true;

    const primaryImg = pkg.coverImage || pkg.featuredImage || (Array.isArray(pkg.images) && pkg.images[0]) || '';

    const capacity = Number(primaryDep?.capacity) || pkg.totalSeats || 20;
    const bookedSeats = Number(primaryDep?.bookedSeats) || 0;
    const availableSeats = primaryDep ? Math.max(0, capacity - bookedSeats) : (pkg.totalSeats || 20);

    const nextDeparture = primaryDep
      ? {
          id: primaryDep.departureId || String(primaryDep._id),
          departureId: primaryDep.departureId || String(primaryDep._id),
          departureDate: primaryDep.departureDate,
          endDate: primaryDep.endDate,
          capacity,
          bookedSeats,
          availableSeats,
          price: primaryDep.priceOverride || rawPrice,
          status: primaryDep.status || 'OPEN',
        }
      : undefined;

    const depSummary = primaryDep
      ? `Next: ${new Date(primaryDep.departureDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })} • ${availableSeats} seats left`
      : 'Departures available';

    return {
      id: pkg.packageId || String(pkg._id),
      _id: String(pkg._id),
      packageId: pkg.packageId || String(pkg._id),
      title: pkg.title,
      destinationName: pkg.destination,
      destination: pkg.destination,
      location: pkg.destination,
      category: pkg.category || 'Adventure',
      adventureType: pkg.adventureType || 'General Adventure',
      price: priceFormatted,
      numericPrice: rawPrice,
      originalPrice: originalPriceFormatted,
      startingPrice: priceFormatted,
      rating: pkg.rating || 4.8,
      reviewCount: pkg.reviewCount || 0,
      reviewsCount: pkg.reviewCount || 0,
      duration: `${days} Days / ${nights} Nights`,
      durationDays: days,
      durationNights: nights,
      imageUrl: primaryImg,
      coverImage: primaryImg,
      primaryImage: primaryImg,
      badge: pkg.discountPercent ? `${pkg.discountPercent}% Off` : (pkg.isFeatured ? 'Featured' : ''),
      agencyName,
      agencyId,
      agencyLogo,
      agencyVerified,
      agency: agencyObj ? {
        id: agencyId,
        name: agencyName,
        logo: agencyLogo,
        isVerified: agencyVerified,
      } : undefined,
      nextDeparture,
      availableSeats,
      departureSummary: depSummary,
      packageStatus: pkg.status || 'APPROVED',
      status: pkg.status || 'APPROVED',
      bookingsCount: pkg.bookingsCount || 0,
      viewsCount: pkg.viewsCount || 0,
      wishlistCount: pkg.wishlistCount || 0,
      createdAt: pkg.createdAt,
    };
  }

  /**
   * Helper: Format raw agency doc
   */
  private formatAgency(ag: any): any {
    return {
      id: String(ag._id),
      _id: String(ag._id),
      agencyId: ag.agencyId || String(ag._id),
      name: ag.companyName || ag.name || 'Verified Travel Agency',
      logoUrl: ag.logo || 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100',
      coverImageUrl: ag.coverImage || '',
      rating: ag.rating || 4.9,
      reviewCount: ag.reviewsCount || ag.reviewCount || 0,
      reviewsCount: ag.reviewsCount || ag.reviewCount || 0,
      isVerified: Boolean(ag.isVerified),
      tripsCompleted: ag.tripsCompleted || ag.bookingsCount || 0,
      specialization: (ag.specializationTags && ag.specializationTags[0]) || 'Adventure Specialists',
      location: ag.location || 'India',
      badge: ag.isVerified ? 'Verified Partner' : 'Registered Agency',
    };
  }

  /**
   * Helper: Format destination doc
   */
  private formatDestination(dest: any): any {
    return {
      id: dest.destinationName ? dest.destinationName.toLowerCase().replace(/\s+/g, '-') : String(dest._id),
      name: dest.destinationName || dest.name,
      country: dest.country || 'India',
      region: dest.region || '',
      description: dest.description || 'Explore scenic wonders and authentic local stays.',
      imageUrl: dest.imageUrl,
      rating: 4.8,
      reviewsCount: 120,
    };
  }

  /**
   * Helper: Format car doc
   */
  private formatCar(car: any): any {
    const rawPrice = car.pricing?.perDay || car.pricePerDay || 2500;
    return {
      id: String(car._id),
      _id: String(car._id),
      name: `${car.brand || ''} ${car.name || 'Car'}`.trim(),
      type: car.type || 'SUV',
      category: car.category || 'Rental',
      city: car.city || 'Delhi',
      price: `₹${rawPrice.toLocaleString('en-IN')}/day`,
      numericPrice: rawPrice,
      rating: car.rating || 4.8,
      reviewCount: car.reviewCount || 0,
      imageUrl: (car.images && car.images[0]) || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600',
      specs: car.specs || { seats: 5, fuel: 'Diesel', transmission: 'Manual' },
      isVerified: true,
      agencyName: (car.agencyId as any)?.companyName || 'Verified Fleet Partner',
    };
  }

  /**
   * Ensure default sections exist in DB
   */
  public async ensureDefaultSectionConfigs(): Promise<void> {
    const count = await SectionConfigurationModel.countDocuments();
    if (count > 0) return;

    const defaults: Partial<ISectionConfiguration>[] = [
      {
        sectionId: 'trending',
        title: 'Trending This Week',
        subtitle: 'Most active and trending holiday packages based on traveler interest',
        emoji: '🔥',
        type: 'package',
        rankingRule: 'trending',
        isEnabled: true,
        showOnHome: true,
        showOnExplore: true,
        order: 1,
        minItems: 4,
        maxItems: 8,
      },
      {
        sectionId: 'popular',
        title: 'Popular Packages',
        subtitle: 'All-time traveler favourites with guaranteed booking confirmations',
        emoji: '🌟',
        type: 'package',
        rankingRule: 'popular',
        isEnabled: true,
        showOnHome: true,
        showOnExplore: true,
        order: 2,
        minItems: 4,
        maxItems: 8,
      },
      {
        sectionId: 'recommended',
        title: 'Recommended For You',
        subtitle: 'Handpicked holiday journeys matched to your travel profile',
        emoji: '✨',
        type: 'package',
        rankingRule: 'recommended',
        isEnabled: true,
        showOnHome: true,
        showOnExplore: true,
        order: 3,
        minItems: 4,
        maxItems: 8,
      },
      {
        sectionId: 'top_destinations',
        title: 'Top Destinations',
        subtitle: 'Breathtaking locations travelers are booking right now',
        emoji: '📍',
        type: 'destination',
        isEnabled: true,
        showOnHome: true,
        showOnExplore: true,
        order: 4,
        minItems: 3,
        maxItems: 8,
      },
      {
        sectionId: 'weekend_escapes',
        title: 'Weekend Escapes',
        subtitle: 'Quick 2 to 3 day getaways to refresh without taking leave',
        emoji: '📅',
        type: 'package',
        rankingRule: 'trending',
        isEnabled: true,
        showOnHome: true,
        showOnExplore: true,
        order: 5,
        minItems: 3,
        maxItems: 8,
      },
      {
        sectionId: 'adventure_trips',
        title: 'Adventure Trips',
        subtitle: 'High-altitude treks, river expeditions, and mountain trails',
        emoji: '🧗',
        type: 'package',
        categoryFilter: 'Adventure',
        rankingRule: 'trending',
        isEnabled: true,
        showOnHome: true,
        showOnExplore: true,
        order: 6,
        minItems: 3,
        maxItems: 8,
      },
      {
        sectionId: 'popular_agencies',
        title: 'Verified Partner Agencies',
        subtitle: 'Top-rated tour operators with accredited local guides',
        emoji: '🏢',
        type: 'agency',
        isEnabled: true,
        showOnHome: true,
        showOnExplore: true,
        order: 7,
        minItems: 3,
        maxItems: 6,
      },
      {
        sectionId: 'budget_trips',
        title: 'Budget Trips',
        subtitle: 'Incredible holidays without breaking your bank',
        emoji: '👛',
        type: 'package',
        rankingRule: 'budget',
        isEnabled: true,
        showOnHome: false,
        showOnExplore: true,
        order: 8,
        minItems: 3,
        maxItems: 8,
      },
      {
        sectionId: 'luxury_escapes',
        title: 'Luxury Escapes',
        subtitle: 'Premium private villas, spa retreats, and five-star hospitality',
        emoji: '💎',
        type: 'package',
        rankingRule: 'luxury',
        isEnabled: true,
        showOnHome: false,
        showOnExplore: true,
        order: 9,
        minItems: 3,
        maxItems: 8,
      },
      {
        sectionId: 'hidden_gems',
        title: 'Hidden Gems',
        subtitle: 'Off-the-beaten-path trails rated highest by explorers',
        emoji: '🏝️',
        type: 'package',
        rankingRule: 'hidden_gems',
        isEnabled: true,
        showOnHome: false,
        showOnExplore: true,
        order: 10,
        minItems: 3,
        maxItems: 8,
      },
      {
        sectionId: 'highest_rated',
        title: 'Highest Rated',
        subtitle: 'Consistently 5-star reviewed itineraries by verified guests',
        emoji: '🏆',
        type: 'package',
        rankingRule: 'highest_rated',
        isEnabled: true,
        showOnHome: false,
        showOnExplore: true,
        order: 11,
        minItems: 3,
        maxItems: 8,
      },
      {
        sectionId: 'car_rentals',
        title: 'Verified Car Rentals',
        subtitle: 'Clean, sanitized vehicles with certified drivers and flexible pickup',
        emoji: '🚗',
        type: 'car_rental',
        isEnabled: true,
        showOnHome: true,
        showOnExplore: true,
        order: 12,
        minItems: 3,
        maxItems: 6,
      },
    ];

    await SectionConfigurationModel.insertMany(defaults);
  }

  /**
   * Helper: Batch enrich package documents with live upcoming departures and agency details (zero N+1 queries)
   */
  public async enrichPackagesWithDepartures(rawPackages: any[]): Promise<any[]> {
    if (!rawPackages || rawPackages.length === 0) return [];

    const packageObjectIds: any[] = [];
    for (const p of rawPackages) {
      if (p._id) {
        packageObjectIds.push(p._id);
        packageObjectIds.push(String(p._id));
      }
      if (p.packageId) {
        packageObjectIds.push(p.packageId);
      }
    }

    const departures = packageObjectIds.length > 0
      ? await DepartureModel.find({
          packageId: { $in: packageObjectIds },
          departureDate: { $gt: new Date() },
          status: { $nin: ['SOLDOUT', 'BOOKING_CLOSED'] as any },
          isManualClosed: { $ne: true },
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

    const unpopulatedAgencyIds: any[] = [];
    for (const p of rawPackages) {
      if (p.agencyId) {
        if (typeof p.agencyId === 'object' && (p.agencyId.companyName || p.agencyId.name)) {
          // already populated
        } else {
          unpopulatedAgencyIds.push(p.agencyId);
        }
      }
    }

    const agencyMap = new Map<string, any>();
    if (unpopulatedAgencyIds.length > 0) {
      const agencies = await AgencyModel.find({ _id: { $in: unpopulatedAgencyIds } }).lean();
      agencies.forEach((a) => agencyMap.set(String(a._id), a));
    }

    return rawPackages.map((p) => {
      const dep = departureMap.get(String(p._id)) || (p.packageId ? departureMap.get(p.packageId) : undefined);
      const agency = p.agencyId && (p.agencyId.companyName || p.agencyId.name)
        ? p.agencyId
        : agencyMap.get(String(p.agencyId));
      return this.formatPackage(p, dep, agency);
    });
  }

  /**
   * Fetch live items for a specific section configuration
   */
  private async fetchItemsForSection(
    section: ISectionConfiguration,
    options: { userId?: string; limit?: number; category?: string; adventureType?: string; search?: string },
    cachedBookableIds?: mongoose.Types.ObjectId[]
  ): Promise<any[]> {
    const limit = options.limit || section.maxItems || 8;
    const bookableIds = cachedBookableIds || (await packageReadinessService.getBookablePackageIds());
    const basePkgQuery: any = {
      _id: { $in: bookableIds },
      isDeleted: false,
      isActive: true,
      status: { $in: ['APPROVED', 'ACTIVE', 'PUBLISHED'] },
    };

    switch (section.type) {
      case 'agency': {
        const agencyQuery: any = {
          isDeleted: false,
          status: { $ne: 'SUSPENDED' },
        };
        if (options.search && options.search.trim()) {
          const sRegex = new RegExp(options.search.trim(), 'i');
          agencyQuery.$or = [
            { name: sRegex },
            { agencyName: sRegex },
            { city: sRegex },
            { state: sRegex },
            { specializationTags: sRegex },
          ];
        }

        const rawAgencies = await AgencyModel.find(agencyQuery)
          .sort({ rating: -1, isVerified: -1, createdAt: -1 })
          .limit(limit * 2)
          .lean();

        let mapped = rawAgencies.map((ag) => this.formatAgency(ag));
        mapped = rankingService.rankAgencies(mapped);
        mapped = await cmsOverrideService.applyAgencyOverrides(mapped, section.sectionId);
        return mapped.slice(0, limit);
      }

      case 'destination': {
        const dbDestinations = await CMSTrendingDestinationModel.find({
          isDeleted: false,
          isActive: true,
        })
          .sort({ priority: 1, createdAt: -1 })
          .limit(limit)
          .lean();

        let destList: any[] = [];
        if (dbDestinations.length > 0) {
          destList = dbDestinations.map((d) => this.formatDestination(d));
        } else {
          // Fallback to distinct destinations from approved packages
          const distinctDestinations = await PackageModel.distinct('destination', basePkgQuery);
          destList = distinctDestinations.slice(0, limit).map((name) => ({
            id: name.toLowerCase().replace(/\s+/g, '-'),
            name,
            country: 'India',
            description: `Discover best packages in ${name}`,
            imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
            rating: 4.8,
            reviewsCount: 95,
          }));
        }

        if (options.search && options.search.trim()) {
          const sRegex = new RegExp(options.search.trim(), 'i');
          destList = destList.filter((d) => sRegex.test(d.name) || sRegex.test(d.country) || sRegex.test(d.description));
        }

        return destList.slice(0, limit);
      }

      case 'car_rental': {
        const carQuery: any = {
          status: { $ne: 'inactive' },
        };
        if (options.search && options.search.trim()) {
          const sRegex = new RegExp(options.search.trim(), 'i');
          carQuery.$or = [
            { name: sRegex },
            { brand: sRegex },
            { city: sRegex },
            { type: sRegex },
            { category: sRegex },
          ];
        }

        const rawCars = await CarModel.find(carQuery)
          .populate('agencyId', 'companyName name')
          .limit(limit)
          .lean();

        return rawCars.map((c) => this.formatCar(c));
      }

      case 'package':
      default: {
        // Handle specialized section filters
        const query: any = { ...basePkgQuery };
        const andClauses: any[] = [];

        if (options.category && options.category.toLowerCase() !== 'all') {
          const cRegex = new RegExp(options.category.trim(), 'i');
          andClauses.push({ $or: [{ category: cRegex }, { adventureType: cRegex }] });
        } else if (section.categoryFilter) {
          andClauses.push({ category: new RegExp(section.categoryFilter, 'i') });
        }

        if (options.adventureType && options.adventureType.toLowerCase() !== 'all') {
          const aRegex = new RegExp(`^${options.adventureType.trim()}$`, 'i');
          andClauses.push({ $or: [{ adventureType: aRegex }, { category: aRegex }] });
        }

        if (options.search && options.search.trim()) {
          const sRegex = new RegExp(options.search.trim(), 'i');
          andClauses.push({
            $or: [
              { title: sRegex },
              { destination: sRegex },
              { category: sRegex },
              { adventureType: sRegex },
              { agencyName: sRegex },
              { description: sRegex },
            ],
          });
        }

        if (section.sectionId === 'weekend_escapes') {
          andClauses.push({ durationDays: { $lte: 3 } });
        } else if (section.sectionId === 'budget_trips') {
          andClauses.push({ price: { $lte: 15000 } });
        } else if (section.sectionId === 'luxury_escapes') {
          andClauses.push({ $or: [{ price: { $gte: 40000 } }, { category: /Luxury/i }] });
        } else if (section.sectionId === 'solo_travel') {
          andClauses.push({ $or: [{ category: /Solo/i }, { title: /Solo/i }] });
        } else if (section.sectionId === 'couple_packages') {
          andClauses.push({ $or: [{ category: /Couple|Honeymoon/i }, { title: /Couple|Honeymoon/i }] });
        } else if (section.sectionId === 'family_trips') {
          andClauses.push({ $or: [{ category: /Family/i }, { title: /Family/i }] });
        }

        if (andClauses.length > 0) {
          query.$and = andClauses;
        }

        let rawPackages: any[] = [];

        if (section.sectionId === 'recommended') {
          rawPackages = await recommendationService.getRecommendations(options.userId, limit * 2);
        } else {
          rawPackages = await PackageModel.find(query)
            .populate('agencyId')
            .limit(limit * 3)
            .lean();
        }

        // Batch enrich with live departures and agency details
        let packages = await this.enrichPackagesWithDepartures(rawPackages);
        packages = rankingService.rankPackages(packages, section.rankingRule || 'trending');

        // Apply CMS Overrides (Admin Pinned overrides)
        packages = await cmsOverrideService.applyPackageOverrides(packages, section.sectionId);
        return packages.slice(0, limit);
      }
    }
  }

  /**
   * Discover dynamic categories in MongoDB and create dynamic category sections
   */
  private async getDynamicCategorySections(
    existingConfigs: ISectionConfiguration[],
    cachedBookableIds?: mongoose.Types.ObjectId[]
  ): Promise<DiscoverySectionResponse[]> {
    const existingCategoryFilters = new Set(
      existingConfigs
        .filter((c) => c.categoryFilter)
        .map((c) => c.categoryFilter?.toLowerCase())
    );

    const bookableIds = cachedBookableIds || (await packageReadinessService.getBookablePackageIds());
    const basePkgQuery = {
      _id: { $in: bookableIds },
      isDeleted: false,
      isActive: true,
      status: { $in: ['APPROVED', 'ACTIVE', 'PUBLISHED'] },
    };
    const distinctCategories: string[] = await PackageModel.distinct('category', basePkgQuery);

    const dynamicSections: DiscoverySectionResponse[] = [];

    for (const cat of distinctCategories) {
      if (!cat || existingCategoryFilters.has(cat.toLowerCase())) continue;

      // Count packages in this category
      const count = await PackageModel.countDocuments({
        ...basePkgQuery,
        category: new RegExp(`^${cat}$`, 'i'),
      });

      // Smart rule: minimum 1 package to form a dynamic category section
      if (count >= 1) {
        const rawPackages = await PackageModel.find({
          ...basePkgQuery,
          category: new RegExp(`^${cat}$`, 'i'),
        })
          .populate('agencyId')
          .limit(8)
          .lean();

        let mapped = await this.enrichPackagesWithDepartures(rawPackages);
        mapped = rankingService.rankPackages(mapped, 'trending');
        mapped = await cmsOverrideService.applyPackageOverrides(mapped, `category_${cat.toLowerCase()}`);

        const sectionId = `cat_${cat.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;

        dynamicSections.push({
          id: sectionId,
          sectionId,
          title: `${cat} Expeditions`,
          subtitle: `Curated ${cat.toLowerCase()} holidays from verified partner agencies`,
          emoji: '🧭',
          type: 'package',
          order: 25 + dynamicSections.length,
          totalCount: count,
          hasMore: count > 8,
          viewAllLink: `/explore?category=${encodeURIComponent(cat)}`,
          items: mapped,
        });
      }
    }

    return dynamicSections;
  }

  /**
   * Discover dynamic Adventure Types in MongoDB and automatically generate dynamic adventure sections
   * e.g. 🥾 Trekking Adventures, 🏕️ Camping Escapes, 🚙 Road Trips.
   * Only renders when at least 1 ready-to-sell package exists, disappears automatically when count is 0.
   */
  public async getDynamicAdventureTypeSections(
    cachedBookableIds?: mongoose.Types.ObjectId[],
    filterAdventureType?: string
  ): Promise<DiscoverySectionResponse[]> {
    const bookableIds = cachedBookableIds || (await packageReadinessService.getBookablePackageIds());
    if (bookableIds.length === 0) return [];

    const basePkgQuery: any = {
      _id: { $in: bookableIds },
      isDeleted: false,
      isActive: true,
      status: { $in: ['APPROVED', 'ACTIVE', 'PUBLISHED'] },
    };

    if (filterAdventureType && filterAdventureType.toLowerCase() !== 'all') {
      basePkgQuery.adventureType = new RegExp(`^${filterAdventureType.trim()}$`, 'i');
    }

    const distinctAdventureTypes: string[] = await PackageModel.distinct('adventureType', basePkgQuery);

    // Prioritize Trekking first as specified in Phase 5
    distinctAdventureTypes.sort((a, b) => {
      if (a.toLowerCase() === 'trekking') return -1;
      if (b.toLowerCase() === 'trekking') return 1;
      return a.localeCompare(b);
    });

    const dynamicSections: DiscoverySectionResponse[] = [];

    for (let i = 0; i < distinctAdventureTypes.length; i++) {
      const advType = distinctAdventureTypes[i];
      if (!advType) continue;

      const count = await PackageModel.countDocuments({
        ...basePkgQuery,
        adventureType: new RegExp(`^${advType}$`, 'i'),
      });

      // Smart rule: minimum 1 ready-to-sell package to form an adventure section
      if (count >= 1) {
        const rawPackages = await PackageModel.find({
          ...basePkgQuery,
          adventureType: new RegExp(`^${advType}$`, 'i'),
        })
          .populate('agencyId')
          .limit(8)
          .lean();

        let mapped = await this.enrichPackagesWithDepartures(rawPackages);
        mapped = rankingService.rankPackages(mapped, 'trending');
        mapped = await cmsOverrideService.applyPackageOverrides(
          mapped,
          `adventure_${advType.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`
        );

        const meta = this.getAdventureMeta(advType);
        const sectionId = `adv_${advType.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;

        dynamicSections.push({
          id: sectionId,
          sectionId,
          title: meta.title,
          subtitle: meta.subtitle,
          emoji: meta.emoji,
          type: 'package',
          order: 4 + i, // Positioned prominently right alongside top sections
          totalCount: count,
          hasMore: count > 8,
          viewAllLink: `/explore?adventureType=${encodeURIComponent(advType)}`,
          items: mapped,
        });
      }
    }

    return dynamicSections;
  }

  /**
   * Generate Full Explore Feed (All enabled sections with live items)
   */
  public async getExploreFeed(options: {
    userId?: string;
    category?: string;
    adventureType?: string;
    search?: string;
  }): Promise<{ sections: DiscoverySectionResponse[]; categories: string[]; adventureTypes: string[] }> {
    await this.ensureDefaultSectionConfigs();

    // Fetch enabled sections
    const configs = await SectionConfigurationModel.find({
      isEnabled: true,
      showOnExplore: true,
    })
      .sort({ order: 1 })
      .lean();

    const bookableIds = await packageReadinessService.getBookablePackageIds();

    const sectionPromises = configs.map(async (conf) => {
      const isFiltered =
        Boolean((options.category && options.category.toLowerCase() !== 'all') ||
        (options.adventureType && options.adventureType.toLowerCase() !== 'all'));

      // If user filtered by category or adventureType, skip non-package sections (e.g. cars, agencies, destinations)
      if (isFiltered && conf.type !== 'package') {
        return null;
      }

      // If user filtered by category, skip non-matching package sections
      if (options.category && options.category.toLowerCase() !== 'all' && conf.type === 'package') {
        if (conf.categoryFilter && !new RegExp(options.category.trim(), 'i').test(conf.categoryFilter)) {
          return null;
        }
      }

      const items = await this.fetchItemsForSection(
        conf as ISectionConfiguration,
        {
          userId: options.userId,
          limit: conf.maxItems || 8,
          category: options.category,
          adventureType: options.adventureType,
          search: options.search,
        },
        bookableIds
      );

      // Smart section rule: Only render if >= minItems. For package sections, render if items.length >= 1
      const minRequired = conf.type === 'package' ? 1 : Math.min(conf.minItems || 1, 1);
      if (items.length >= minRequired) {
        return {
          id: conf.sectionId,
          sectionId: conf.sectionId,
          title: conf.title,
          subtitle: conf.subtitle,
          emoji: conf.emoji || '✨',
          type: conf.type,
          order: conf.order,
          totalCount: items.length,
          hasMore: items.length >= (conf.maxItems || 8),
          viewAllLink: conf.viewAllLink || `/explore?section=${conf.sectionId}`,
          items,
        };
      }
      return null;
    });

    const [resolvedSections, dynamicCatSections, dynamicAdvSections, categories, distinctAdvTypes] = await Promise.all([
      Promise.all(sectionPromises),
      !options.search && (!options.category || options.category === 'all') && (!options.adventureType || options.adventureType === 'all')
        ? this.getDynamicCategorySections(configs as ISectionConfiguration[], bookableIds)
        : Promise.resolve([]),
      !options.search && (!options.category || options.category === 'all')
        ? this.getDynamicAdventureTypeSections(bookableIds, options.adventureType)
        : options.adventureType && options.adventureType !== 'all'
        ? this.getDynamicAdventureTypeSections(bookableIds, options.adventureType)
        : Promise.resolve([]),
      PackageModel.distinct('category', {
        isDeleted: false,
        status: { $in: ['APPROVED', 'DRAFT', 'PENDING'] },
      }),
      PackageModel.distinct('adventureType', {
        isDeleted: false,
        status: { $in: ['APPROVED', 'DRAFT', 'PENDING'] },
      }),
    ]);

    const sections: DiscoverySectionResponse[] = [
      ...(resolvedSections.filter(Boolean) as DiscoverySectionResponse[]),
      ...dynamicCatSections,
      ...dynamicAdvSections,
    ];

    sections.sort((a, b) => a.order - b.order);

    return {
      sections,
      categories: ['All', ...categories.filter(Boolean)],
      adventureTypes: ['All', ...distinctAdvTypes.filter(Boolean)],
    };
  }

  /**
   * Generate Dynamic Homepage Feed (Sections configured for showOnHome + Dynamic Adventure Sections)
   */
  public async getHomepageDiscoverySections(userId?: string): Promise<DiscoverySectionResponse[]> {
    await this.ensureDefaultSectionConfigs();

    const configs = await SectionConfigurationModel.find({
      isEnabled: true,
      showOnHome: true,
    })
      .sort({ order: 1 })
      .lean();

    const bookableIds = await packageReadinessService.getBookablePackageIds();

    const sectionPromises = configs.map(async (conf) => {
      const items = await this.fetchItemsForSection(
        conf as ISectionConfiguration,
        {
          userId,
          limit: conf.maxItems || 8,
        },
        bookableIds
      );

      // Smart section rule: Only render if >= minItems. For package sections, render if items.length >= 1
      const minRequired = conf.type === 'package' ? 1 : Math.min(conf.minItems || 1, 1);
      if (items.length >= minRequired) {
        return {
          id: conf.sectionId,
          sectionId: conf.sectionId,
          title: conf.title,
          subtitle: conf.subtitle,
          emoji: conf.emoji || '✨',
          type: conf.type,
          order: conf.order,
          totalCount: items.length,
          hasMore: items.length >= (conf.maxItems || 8),
          viewAllLink: conf.viewAllLink || `/explore?section=${conf.sectionId}`,
          items,
        };
      }
      return null;
    });

    const [resolvedSections, dynamicAdvSections] = await Promise.all([
      Promise.all(sectionPromises),
      this.getDynamicAdventureTypeSections(bookableIds),
    ]);

    const validConfigs = resolvedSections.filter(Boolean) as DiscoverySectionResponse[];
    const allSections = [...validConfigs, ...dynamicAdvSections];
    allSections.sort((a, b) => a.order - b.order);
    return allSections;
  }

  /**
   * Public standalone endpoints
   */
  public async getTrending(limit: number = 8) {
    const bookableIds = await packageReadinessService.getBookablePackageIds();
    if (bookableIds.length === 0) return [];

    const raw = await PackageModel.find({
      _id: { $in: bookableIds },
      isDeleted: false,
      isActive: true,
      status: { $in: ['APPROVED', 'ACTIVE', 'PUBLISHED'] },
    })
      .populate('agencyId')
      .limit(limit * 3)
      .lean();
    let packages = await this.enrichPackagesWithDepartures(raw);
    packages = rankingService.rankPackages(packages, 'trending');
    packages = await cmsOverrideService.applyPackageOverrides(packages, 'trending');
    return packages.slice(0, limit);
  }

  public async getPopular(limit: number = 8) {
    const bookableIds = await packageReadinessService.getBookablePackageIds();
    if (bookableIds.length === 0) return [];

    const raw = await PackageModel.find({
      _id: { $in: bookableIds },
      isDeleted: false,
      isActive: true,
      status: { $in: ['APPROVED', 'ACTIVE', 'PUBLISHED'] },
    })
      .populate('agencyId')
      .sort({ bookingsCount: -1 })
      .limit(limit * 2)
      .lean();
    let packages = await this.enrichPackagesWithDepartures(raw);
    packages = await cmsOverrideService.applyPackageOverrides(packages, 'popular');
    return packages.slice(0, limit);
  }

  public async getRecommended(userId?: string, limit: number = 8) {
    const raw = await recommendationService.getRecommendations(userId, limit);
    let packages = await this.enrichPackagesWithDepartures(raw);
    packages = await cmsOverrideService.applyPackageOverrides(packages, 'recommended');
    return packages.slice(0, limit);
  }

  public async getAgencies(limit: number = 6) {
    const raw = await AgencyModel.find({ isDeleted: false, status: { $ne: 'SUSPENDED' } })
      .limit(limit * 2)
      .lean();
    let agencies = raw.map((ag) => this.formatAgency(ag));
    agencies = rankingService.rankAgencies(agencies);
    agencies = await cmsOverrideService.applyAgencyOverrides(agencies, 'popular_agencies');
    return agencies.slice(0, limit);
  }

  public async getDestinations(limit: number = 8) {
    const dbDestinations = await CMSTrendingDestinationModel.find({ isDeleted: false, isActive: true })
      .sort({ priority: 1 })
      .limit(limit)
      .lean();

    if (dbDestinations.length > 0) {
      return dbDestinations.map((d) => this.formatDestination(d));
    }

    const distinct = await PackageModel.distinct('destination', { isDeleted: false, status: { $in: ['APPROVED', 'DRAFT', 'PENDING'] } });
    return distinct.slice(0, limit).map((name) => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      country: 'India',
      imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
    }));
  }

  public async getCarRentals(limit: number = 6) {
    const raw = await CarModel.find({ status: { $ne: 'inactive' } })
      .populate('agencyId', 'companyName name')
      .limit(limit)
      .lean();
    return raw.map((c) => this.formatCar(c));
  }
}

export const discoveryEngineService = new DiscoveryEngineService();
