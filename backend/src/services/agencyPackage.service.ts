import mongoose from 'mongoose';
import { PackageModel, IPackage, PackageApprovalStatus, IGalleryImage, IPackageItineraryDay, IPackageItineraryPlan } from '../models/package.model.js';
import { DepartureModel } from '../models/departure.model.js';
import { BookingModel } from '../models/booking.model.js';
import { AgencyModel } from '../models/agency.model.js';
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils/errors.util.js';
import { AuditLoggerService } from './auditLogger.service.js';
import { socketService } from './socket.service.js';
import { packageReadinessService } from './packageReadiness.service.js';
import { sellerPaymentProfileService } from './sellerPaymentProfile.service.js';
import { logger } from '../config/logger.config.js';

export function normalizeGalleryImages(images: any[]): IGalleryImage[] {
  if (!Array.isArray(images)) return [];
  return images
    .map((img) => {
      if (typeof img === 'string') {
        return {
          url: img,
          publicId: '',
          uploadedAt: new Date(),
        };
      }
      if (img && typeof img === 'object') {
        const resolvedUrl =
          typeof img.url === 'string'
            ? img.url
            : typeof img.url === 'object' && img.url?.url
            ? img.url.url
            : img.secure_url || img.secureUrl || img.imageUrl || '';
        return {
          url: resolvedUrl || '',
          publicId: img.publicId || img.id || '',
          width: img.width ? Number(img.width) : undefined,
          height: img.height ? Number(img.height) : undefined,
          format: img.format || undefined,
          size: img.size ? Number(img.size) : undefined,
          bytes: img.bytes ? Number(img.bytes) : undefined,
          uploadedAt: img.uploadedAt ? new Date(img.uploadedAt) : new Date(),
          originalFilename: img.originalFilename || img.name || undefined,
          category: img.category || undefined,
        };
      }
      return { url: '', publicId: '', uploadedAt: new Date() };
    })
    .filter((img) => Boolean(img.url));
}

export function normalizeAndValidateItinerary(
  rawItinerary: any,
  isPublishing: boolean
): IPackageItineraryDay[] {
  if (!rawItinerary) {
    if (isPublishing) {
      throw new BadRequestError('Cannot publish package. Itinerary is required.');
    }
    return [];
  }

  if (!Array.isArray(rawItinerary)) {
    if (isPublishing) {
      throw new BadRequestError('Cannot publish package. Itinerary must be an array of days.');
    }
    return [];
  }

  if (isPublishing && rawItinerary.length === 0) {
    throw new BadRequestError('Cannot publish package. Itinerary must have at least one day.');
  }

  return rawItinerary.map((d: any, dIdx: number) => {
    const dayNum = Number(d.day || d.dayNumber || dIdx + 1);
    const dayTitle = (d.title || '').toString().trim();
    const dayDescription = (d.description || '').toString().trim();
    const dayMeals = (Array.isArray(d.meals) ? d.meals.join(', ') : d.meals || '').toString().trim();
    const dayStay = (d.stay || '').toString().trim();

    if (isPublishing && !dayTitle) {
      throw new BadRequestError(`Cannot publish package. Itinerary Day ${dayNum}: Title is required.`);
    }

    let rawPlans = d.plans;
    if ((!rawPlans || !Array.isArray(rawPlans) || rawPlans.length === 0) && Array.isArray(d.activities) && d.activities.length > 0) {
      rawPlans = d.activities;
    }

    const plansArray = Array.isArray(rawPlans) ? rawPlans : [];

    if (isPublishing && plansArray.length === 0) {
      throw new BadRequestError(
        `Cannot publish package. Itinerary Day ${dayNum} ("${dayTitle || 'Untitled'}") requires at least one plan activity.`
      );
    }

    const normalizedPlans: IPackageItineraryPlan[] = [];

    for (let pIdx = 0; pIdx < plansArray.length; pIdx++) {
      const p = plansArray[pIdx];
      let text = '';
      let icon = '';
      let notes = '';

      if (typeof p === 'string') {
        text = p.replace(/^\d{1,2}:\d{2}\s*[-–—]?\s*/, '').trim();
      } else if (p && typeof p === 'object') {
        const rawText = (
          p.text ??
          p.title ??
          p.description ??
          p.content ??
          p.name ??
          ''
        ).toString();
        text = rawText.replace(/^\d{1,2}:\d{2}\s*[-–—]?\s*/, '').trim();
        icon = (p.icon || '').toString().trim();
        notes = (p.notes || '').toString().trim();
      }

      if (isPublishing) {
        if (!text) {
          throw new BadRequestError(
            `Cannot publish package. Itinerary Day ${dayNum} ("${dayTitle || 'Untitled'}"): Plan item ${pIdx + 1} text is required.`
          );
        }
        normalizedPlans.push({ text, icon, notes });
      } else {
        // In draft mode, preserve valid plans and prune empty plan rows to satisfy schema validation
        if (text) {
          normalizedPlans.push({ text, icon, notes });
        }
      }
    }

    return {
      day: dayNum,
      title: dayTitle || `Day ${dayNum}`,
      description: dayDescription,
      plans: normalizedPlans,
      meals: dayMeals,
      stay: dayStay,
    };
  });
}

export interface AgencyPackageFilters {
  search?: string;
  status?: string;
  category?: string;
  adventureType?: string;
  page?: number;
  limit?: number;
}

export interface AgencyPackageDTO {
  id: string;
  packageId: string;
  packageName: string;
  destination: string;
  duration: string;
  price: number;
  rating: number;
  reviewCount: number;
  bookings: number;
  status: 'Active' | 'Draft' | 'Hidden' | 'Archived' | 'Inactive';
  lastUpdated: string;
  packageType: 'Domestic' | 'International';
  adventureType?: string;
  coverImage: string;
  pickupCity?: string;
  dropOffCity?: string;
  whatsappGroupLink?: string;
  readiness?: {
    isBookable: boolean;
    status: 'READY' | 'NEEDS_SETUP';
    label: 'Ready to Sell' | 'Needs Setup';
    missingRequirements: string[];
  };
  raw?: any;
}

export interface AgencyPackageStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
  readyToSell: number;
  needsSetup: number;
  incomplete: number;
  soldOut: number;
  bookingClosed: number;
}

export class AgencyPackageService {
  /**
   * Helper to format relative timestamps
   */
  private formatRelativeTime(date: Date): string {
    const diffMs = Date.now() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  }

  /**
   * Map database IPackage document to frontend AgencyPackage schema
   */
  private mapToAgencyPackage(pkg: IPackage, readiness?: any): AgencyPackageDTO {
    let statusFormatted: 'Active' | 'Draft' | 'Hidden' | 'Archived' | 'Inactive' = 'Active';
    if (!pkg.isActive) {
      if (pkg.status === 'REJECTED') {
        statusFormatted = 'Archived';
      } else if (pkg.status === 'DRAFT') {
        statusFormatted = 'Draft';
      } else if (pkg.status === 'INACTIVE') {
        statusFormatted = 'Inactive';
      } else {
        statusFormatted = 'Hidden';
      }
    } else if (pkg.status === 'DRAFT') {
      statusFormatted = 'Draft';
    } else if (pkg.status === 'REJECTED') {
      statusFormatted = 'Archived';
    } else if (pkg.status === 'INACTIVE') {
      statusFormatted = 'Inactive';
    } else if (
      pkg.status === 'APPROVED' ||
      pkg.status === 'PENDING' ||
      pkg.status === 'PUBLISHED' ||
      pkg.status === 'ACTIVE'
    ) {
      statusFormatted = 'Active';
    }

    const isIntl =
      pkg.destinationCountry &&
      pkg.destinationCountry.toLowerCase() !== 'india' &&
      pkg.destinationCountry.toLowerCase() !== 'in';

    const resolvedCover =
      pkg.coverImage ||
      pkg.featuredImage ||
      (Array.isArray(pkg.galleryImages) && pkg.galleryImages.length > 0
        ? typeof pkg.galleryImages[0] === 'string'
          ? pkg.galleryImages[0]
          : (pkg.galleryImages[0] as any)?.url
        : '') ||
      'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=600&auto=format&fit=crop&q=80';

    return {
      id: pkg._id.toString(),
      packageId: pkg.packageId,
      packageName: pkg.title,
      destination: pkg.destination,
      duration: `${pkg.durationDays} Days / ${pkg.durationNights} Nights`,
      price: pkg.price,
      rating: pkg.rating || 0,
      reviewCount: pkg.reviewCount || 0,
      bookings: pkg.bookingsCount || 0,
      status: statusFormatted,
      lastUpdated: this.formatRelativeTime(pkg.updatedAt || pkg.createdAt),
      packageType: isIntl ? 'International' : 'Domestic',
      adventureType: pkg.adventureType || 'General Adventure',
      coverImage: resolvedCover,
      pickupCity: pkg.pickupCity || pkg.pickupLocation || '',
      dropOffCity: pkg.dropOffCity || pkg.dropOffLocation || '',
      whatsappGroupLink: pkg.whatsappGroupLink || '',
      readiness: readiness
        ? {
            isBookable: Boolean(readiness.isBookable),
            status: readiness.status,
            label: readiness.label,
            missingRequirements: readiness.missingRequirements || [],
          }
        : undefined,
      raw: {
        category: pkg.category,
        adventureType: pkg.adventureType || 'General Adventure',
        durationDays: pkg.durationDays,
        durationNights: pkg.durationNights,
        availableSeats: pkg.availableSeats,
        totalSeats: pkg.totalSeats,
        inclusions: pkg.inclusions,
        exclusions: pkg.exclusions,
        itinerary: pkg.itinerary,
        galleryImages: pkg.galleryImages,
        subtitle: pkg.subtitle,
        description: pkg.description,
        pickupCity: pkg.pickupCity || pkg.pickupLocation || '',
        dropOffCity: pkg.dropOffCity || pkg.dropOffLocation || '',
        pickupLocation: pkg.pickupLocation || pkg.pickupCity || '',
        dropOffLocation: pkg.dropOffLocation || pkg.dropOffCity || '',
        whatsappGroupLink: pkg.whatsappGroupLink || '',
      },
    };
  }

  /**
   * 1. Get Live KPI Statistics for Agency Packages
   */
  public async getPackageStats(agencyId: string | mongoose.Types.ObjectId): Promise<AgencyPackageStats> {
    const aid = new mongoose.Types.ObjectId(agencyId.toString());

    const allAgencyPackages = await PackageModel.find({ agencyId: aid, isDeleted: false }).lean();

    let published = 0;
    let draft = 0;
    let archived = 0;
    let readyToSell = 0;
    let needsSetup = 0;
    let incomplete = 0;
    let soldOut = 0;
    let bookingClosed = 0;

    const readinessResults = await Promise.all(
      allAgencyPackages.map((pkg) => packageReadinessService.getPackageReadiness(pkg))
    );

    for (let i = 0; i < allAgencyPackages.length; i++) {
      const pkg = allAgencyPackages[i];
      const r = readinessResults[i];

      if (pkg.status === 'DRAFT') {
        draft++;
      } else if (!pkg.isActive || pkg.status === 'REJECTED') {
        archived++;
      } else if (
        pkg.isActive &&
        (pkg.status === 'PUBLISHED' || pkg.status === 'APPROVED' || pkg.status === 'ACTIVE' || pkg.status === 'PENDING')
      ) {
        published++;
      }

      if (r.isBookable) {
        readyToSell++;
      } else {
        needsSetup++;
        if (r.missingRequirements.some((req) => req.toLowerCase().includes('sold out'))) {
          soldOut++;
        } else if (r.missingRequirements.some((req) => req.toLowerCase().includes('booking window') || req.toLowerCase().includes('past'))) {
          bookingClosed++;
        } else {
          incomplete++;
        }
      }
    }

    return {
      total: allAgencyPackages.length,
      published,
      draft,
      archived,
      readyToSell,
      needsSetup,
      incomplete,
      soldOut,
      bookingClosed,
    };
  }

  /**
   * 2. Get Paginated & Filtered Agency Packages
   */
  public async getPackages(
    agencyId: string | mongoose.Types.ObjectId,
    filters?: AgencyPackageFilters
  ): Promise<{ items: AgencyPackageDTO[]; total: number; page: number; limit: number; totalPages: number }> {
    const aid = new mongoose.Types.ObjectId(agencyId.toString());
    const query: any = { agencyId: aid, isDeleted: false };

    if (filters?.search && filters.search.trim() !== '') {
      const searchRegex = new RegExp(filters.search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { destination: searchRegex },
        { packageId: searchRegex },
        { category: searchRegex },
        { adventureType: searchRegex },
      ];
    }

    if (filters?.status && filters.status !== 'All') {
      if (filters.status === 'Active' || filters.status === 'Published') {
        query.isActive = true;
        query.status = { $in: ['PUBLISHED', 'APPROVED', 'PENDING', 'ACTIVE'] };
      } else if (filters.status === 'Draft') {
        query.status = 'DRAFT';
      } else if (filters.status === 'Hidden') {
        query.isActive = false;
      } else if (filters.status === 'Archived') {
        query.$or = [{ isActive: false }, { status: 'REJECTED' }];
      }
    }

    if (filters?.category && filters.category !== 'All') {
      if (filters.category === 'Domestic') {
        query.$or = [
          { destinationCountry: { $in: ['India', 'india', 'IN', ''] } },
          { destinationCountry: { $exists: false } },
        ];
      } else if (filters.category === 'International') {
        query.destinationCountry = { $nin: ['India', 'india', 'IN', ''] };
      }
    }

    if (filters?.adventureType && filters.adventureType !== 'All') {
      query.adventureType = new RegExp(`^${filters.adventureType.trim()}$`, 'i');
    }

    const page = Math.max(1, Number(filters?.page) || 1);
    const limit = Math.max(1, Number(filters?.limit) || 20);
    const skip = (page - 1) * limit;

    const [packages, total] = await Promise.all([
      PackageModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      PackageModel.countDocuments(query),
    ]);

    // Live count bookings across all departures for these packages
    const pkgIds = packages.map((p) => p._id);
    const bookingCounts = await BookingModel.aggregate([
      { $match: { packageId: { $in: pkgIds }, status: { $ne: 'CANCELLED' } } },
      { $group: { _id: '$packageId', totalBookings: { $sum: 1 } } },
    ]);
    const bookingCountMap = new Map<string, number>();
    bookingCounts.forEach((bc) => {
      bookingCountMap.set(bc._id.toString(), bc.totalBookings);
    });

    const readinessList = await Promise.all(
      packages.map(async (pkg) => {
        const r = await packageReadinessService.getPackageReadiness(pkg);
        // Phase 6: notify agency whenever package cannot be sold
        packageReadinessService.notifyAgencyIfNeeded(pkg, r);
        return r;
      })
    );

    let items = packages.map((pkg, idx) => {
      const liveBookings = bookingCountMap.get(pkg._id.toString()) || 0;
      pkg.bookingsCount = liveBookings;
      return this.mapToAgencyPackage(pkg, readinessList[idx]);
    });

    if (filters?.status === 'Ready to Sell') {
      items = items.filter((item) => item.readiness?.isBookable);
    } else if (filters?.status === 'Needs Setup') {
      items = items.filter((item) => !item.readiness?.isBookable);
    }

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  /**
   * 3. Get Single Deep Package Details
   */
  public async getPackageById(
    agencyId: string | mongoose.Types.ObjectId,
    packageIdOrMongoId: string
  ): Promise<IPackage> {
    const aid = new mongoose.Types.ObjectId(agencyId.toString());

    let pkg: IPackage | null = null;
    if (mongoose.Types.ObjectId.isValid(packageIdOrMongoId)) {
      pkg = await PackageModel.findOne({
        _id: packageIdOrMongoId,
        agencyId: aid,
        isDeleted: false,
      });
    }

    if (!pkg) {
      pkg = await PackageModel.findOne({
        packageId: packageIdOrMongoId,
        agencyId: aid,
        isDeleted: false,
      });
    }

    if (!pkg) {
      throw new NotFoundError('Tour package not found or does not belong to your agency.');
    }

    const liveBookings = await BookingModel.countDocuments({
      packageId: pkg._id,
      status: { $ne: 'CANCELLED' },
    });
    pkg.bookingsCount = liveBookings;

    const readiness = await packageReadinessService.getPackageReadiness(pkg);
    (pkg as any).readiness = readiness;
    (pkg as any).departures = readiness.upcomingDepartures || [];

    return pkg;
  }

  /**
   * Helper to synchronize departures between package payload and DepartureModel
   */
  public async syncPackageDepartures(
    pkg: IPackage,
    rawDepartures: any[],
    agencyId: mongoose.Types.ObjectId,
    session?: mongoose.ClientSession
  ): Promise<void> {
    if (!Array.isArray(rawDepartures) || rawDepartures.length === 0) return;

    for (let i = 0; i < rawDepartures.length; i++) {
      const depItem = rawDepartures[i];
      if (!depItem || !depItem.departureDate) continue;

      const departureDate = new Date(depItem.departureDate);
      if (isNaN(departureDate.getTime())) continue;

      const durationDays = Number(pkg.durationDays || 3);
      const endDate = depItem.returnDate
        ? new Date(depItem.returnDate)
        : new Date(departureDate.getTime() + durationDays * 24 * 60 * 60 * 1000);
      const bookingCloses = depItem.bookingClosingDate
        ? new Date(depItem.bookingClosingDate)
        : new Date(departureDate.getTime() - 24 * 60 * 60 * 1000);
      const capacity = Number(depItem.maximumTravelers || depItem.capacity || pkg.totalSeats || 20);

      const existingDep = await DepartureModel.findOne({
        packageId: pkg._id,
        departureDate,
      }).session(session || null);

      if (existingDep) {
        existingDep.capacity = capacity;
        existingDep.endDate = endDate;
        existingDep.bookingCloses = bookingCloses;
        existingDep.status = 'OPEN';
        existingDep.isManualClosed = false;
        await existingDep.save(session ? { session } : undefined);
      } else {
        let depId = depItem.departureId || depItem.id || `DEP-${pkg.packageId}-${String(i + 1).padStart(2, '0')}`;
        if (await DepartureModel.exists({ departureId: depId }).session(session || null)) {
          depId = `DEP-${pkg.packageId}-${Date.now().toString(36)}-${String(i + 1).padStart(2, '0')}`;
        }
        await DepartureModel.create(
          [
            {
              departureId: depId,
              packageId: pkg._id,
              agencyId,
              departureDate,
              endDate,
              bookingOpens: new Date(),
              bookingCloses,
              capacity,
              bookedSeats: 0,
              status: 'OPEN',
              isManualClosed: false,
            },
          ],
          session ? { session } : undefined
        );
      }
    }
  }

  /**
   * 4. Create New Package from 9-Step Wizard
   */
  public async createPackage(
    agencyId: string | mongoose.Types.ObjectId,
    data: any
  ): Promise<IPackage> {
    const aid = new mongoose.Types.ObjectId(agencyId.toString());
    const agency = await AgencyModel.findById(aid);
    if (!agency) {
      throw new NotFoundError('Agency not found.');
    }

    // Generate unique package ID
    let packageId = '';
    let count = await PackageModel.countDocuments();
    do {
      count++;
      const padNum = String(count).padStart(4, '0');
      packageId = `PKG-${new Date().getFullYear()}-${padNum}`;
    } while (await PackageModel.exists({ packageId }));

    const title = data.title || data.packageName || 'Untitled Package';
    const destination = data.destination || data.destinationRegion || 'Flexible Destination';
    const price = Number(data.price || data.basePrice || 9999);

    const isPublishedIntent = !data.isDraft && data.status !== 'DRAFT';
    const status = isPublishedIntent ? 'PUBLISHED' : 'DRAFT';
    const isPublished = isPublishedIntent;
    const isDraft = !isPublishedIntent;
    const visibility = isPublishedIntent ? 'PUBLIC' : 'PRIVATE';
    const approvalStatus: PackageApprovalStatus = isPublishedIntent ? 'APPROVED' : 'PENDING';
    const publishedAt = isPublishedIntent ? new Date() : undefined;

    // Check if updating an existing active draft or reusing single active draft
    let existingDraft: IPackage | null = null;
    const draftIdentifier = data.draftId || data.packageId;
    if (draftIdentifier) {
      const existingPkg = await PackageModel.findOne({
        $or: [
          mongoose.isValidObjectId(draftIdentifier) ? { _id: draftIdentifier } : null,
          { packageId: draftIdentifier },
        ].filter(Boolean) as any,
        agencyId: aid,
        isDeleted: false,
      });

      if (existingPkg) {
        if (existingPkg.status === 'PUBLISHED') {
          if (!isPublishedIntent) {
            throw new BadRequestError('Published packages cannot be converted back to drafts.');
          }
          existingDraft = existingPkg;
        } else {
          existingDraft = existingPkg;
        }
      }
    }

    if (!existingDraft && !isPublishedIntent) {
      // Single active draft per agency: reuse existing draft if present
      existingDraft = await PackageModel.findOne({
        agencyId: aid,
        status: 'DRAFT',
        isDeleted: false,
      });
    }

    const normalizedGallery = normalizeGalleryImages(data.galleryImages);
    const coverImg =
      data.coverImage ||
      data.featuredImage ||
      (normalizedGallery.length > 0 ? normalizedGallery[0].url : '') ||
      'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=600&auto=format&fit=crop&q=80';

    // Validate and normalize itinerary before database write
    let normalizedItinerary: IPackageItineraryDay[] | undefined = undefined;
    if (data.itinerary !== undefined) {
      normalizedItinerary = normalizeAndValidateItinerary(data.itinerary, isPublishedIntent);
    } else if (isPublishedIntent && existingDraft) {
      normalizedItinerary = normalizeAndValidateItinerary(existingDraft.itinerary, true);
    }

    logger.info('[PACKAGE PUBLISH BEFORE SAVE]', {
      packageId: existingDraft ? existingDraft.packageId : packageId,
      status,
      isPublished,
      isDraft,
      visibility,
      approvalStatus,
      galleryImagesLength: normalizedGallery.length,
    });
    console.log('[7. Inside the service before save() (createPackage)]', normalizedGallery);
    console.log('[8. Immediately before new PackageModel() / package.set() (createPackage)]', normalizedGallery);

    const session = await mongoose.startSession();
    let savedPackage: IPackage;

    try {
      session.startTransaction();

      if (existingDraft) {
        if (existingDraft.status === 'PUBLISHED' && !isPublishedIntent) {
          throw new BadRequestError('Published packages cannot be converted back to drafts.');
        }

        existingDraft.title = title;
        if (data.subtitle !== undefined) existingDraft.subtitle = data.subtitle;
        if (data.description !== undefined) existingDraft.description = data.description;
        existingDraft.destination = destination;
        if (data.destinationCountry) existingDraft.destinationCountry = data.destinationCountry;
        if (data.destinationRegion) existingDraft.destinationRegion = data.destinationRegion;
        if (data.category) existingDraft.category = data.category;
        if (data.adventureType) existingDraft.adventureType = data.adventureType;
        if (data.durationDays) existingDraft.durationDays = Number(data.durationDays);
        if (data.durationNights) existingDraft.durationNights = Number(data.durationNights);
        if (data.pickupCity !== undefined) existingDraft.pickupCity = data.pickupCity;
        if (data.dropOffCity !== undefined) existingDraft.dropOffCity = data.dropOffCity;
        if (data.pickupLocation !== undefined) existingDraft.pickupLocation = data.pickupLocation;
        if (data.dropOffLocation !== undefined) existingDraft.dropOffLocation = data.dropOffLocation;
        if (data.whatsappGroupLink !== undefined) existingDraft.whatsappGroupLink = data.whatsappGroupLink;
        existingDraft.price = price;
        if (data.originalPrice) existingDraft.originalPrice = Number(data.originalPrice);
        if (data.availableSeats !== undefined) existingDraft.availableSeats = Number(data.availableSeats);
        if (data.totalSeats !== undefined) existingDraft.totalSeats = Number(data.totalSeats);
        if (data.accommodationConfirmed !== undefined) existingDraft.accommodationConfirmed = Boolean(data.accommodationConfirmed);
        if (Array.isArray(data.accommodations)) existingDraft.accommodations = data.accommodations;
        if (coverImg) {
          existingDraft.featuredImage = coverImg;
          existingDraft.coverImage = coverImg;
        }
        if (normalizedGallery.length > 0) {
          existingDraft.galleryImages = normalizedGallery;
        }
        existingDraft.status = status;
        existingDraft.isDraft = isDraft;
        existingDraft.isPublished = isPublished;
        existingDraft.isActive = true;
        existingDraft.visibility = visibility;
        existingDraft.approvalStatus = approvalStatus;
        if (isPublishedIntent) {
          existingDraft.publishedAt = new Date();
        }
        if (data.inclusions) existingDraft.inclusions = data.inclusions;
        if (data.exclusions) existingDraft.exclusions = data.exclusions;
        if (normalizedItinerary !== undefined) {
          existingDraft.itinerary = normalizedItinerary;
        } else if (data.itinerary !== undefined) {
          existingDraft.itinerary = data.itinerary;
        }
        existingDraft.updatedAt = new Date();

        existingDraft.activities = existingDraft.activities || [];
        existingDraft.activities.push({
          id: `act-${Date.now()}`,
          adminName: agency.name,
          action: isPublishedIntent ? 'Package Published' : 'Draft Updated',
          details: isPublishedIntent ? `Published package "${title}"` : `Updated draft package "${title}"`,
          timestamp: new Date().toISOString(),
        });

        await existingDraft.save({ session });
        savedPackage = existingDraft;
      } else {
        const [newPackage] = await PackageModel.create(
          [
            {
            packageId,
            agencyId: aid,
            agencyName: agency.agencyDisplayName || agency.name || 'ApnaTrip Partner',
            agencyLogo: agency.logo || '',
            title,
            subtitle: data.subtitle || '',
            description: data.description || '',
            destination,
            destinationCountry: data.destinationCountry || (data.packageType === 'International' ? 'International' : 'India'),
            destinationRegion: data.destinationRegion || destination,
            destinationFlag: data.destinationFlag || (data.packageType === 'International' ? '✈️' : '🇮🇳'),
            category: data.category || 'Adventure',
            adventureType: data.adventureType || 'General Adventure',
            durationDays: Number(data.durationDays || 3),
            durationNights: Number(data.durationNights || 2),
            pickupCity: data.pickupCity || data.pickupLocation || '',
            dropOffCity: data.dropOffCity || data.dropOffLocation || '',
            pickupLocation: data.pickupLocation || data.pickupCity || '',
            dropOffLocation: data.dropOffLocation || data.dropOffCity || '',
            whatsappGroupLink: data.whatsappGroupLink || (data.step7 && data.step7.whatsappGroupLink) || '',
            price,
            originalPrice: Number(data.originalPrice || price * 1.2),
            discountPercent: data.discountPercent || '',
            availableSeats: Number(data.availableSeats || 20),
            totalSeats: Number(data.totalSeats || 20),
            bookingsCount: 0,
            totalRevenue: 0,
            rating: 0,
            reviewCount: 0,
            accommodationConfirmed: Boolean(data.accommodationConfirmed),
            accommodations: Array.isArray(data.accommodations) ? data.accommodations : [],
            featuredImage: coverImg,
            coverImage: coverImg,
            galleryImages: normalizedGallery,
            status,
            isDraft,
            isPublished,
            isActive: true,
            visibility,
            publishedAt,
            approvalStatus,
            deletedAt: null,
            isFeatured: false,
            inclusions: data.inclusions || [],
            exclusions: data.exclusions || [],
            itinerary: normalizedItinerary || (data.itinerary ? normalizeAndValidateItinerary(data.itinerary, isPublishedIntent) : []),
            activities: [
              {
                id: `act-${Date.now()}`,
                adminName: agency.name,
                action: isPublishedIntent ? 'Package Published' : 'Package Created',
                details: isPublishedIntent ? `Published package "${title}"` : `Created draft package "${title}"`,
                timestamp: new Date().toISOString(),
              },
            ],
            isDeleted: false,
          },
        ],
        { session }
      );

      savedPackage = newPackage;
    }

      // Automatically synchronize DepartureModel records if departures are provided
      const rawDepartures = data.departures || data.upcomingDepartures;
      if (Array.isArray(rawDepartures) && rawDepartures.length > 0) {
        await this.syncPackageDepartures(savedPackage, rawDepartures, aid, session);
      }

      await session.commitTransaction();
    } catch (err) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      logger.error('Failed to create/publish package transaction:', err);
      throw err;
    } finally {
      session.endSession();
    }

    logger.info('[PACKAGE PUBLISH AFTER SAVE]', {
      packageId: savedPackage.packageId,
      id: savedPackage._id.toString(),
      status: savedPackage.status,
      isPublished: savedPackage.isPublished,
      visibility: savedPackage.visibility,
      approvalStatus: savedPackage.approvalStatus,
      galleryImagesLength: savedPackage.galleryImages?.length || 0,
    });

    AuditLoggerService.log({
      actor: {
        id: aid.toString(),
        name: agency.name,
        email: agency.email,
        role: 'AGENCY',
      },
      module: 'PACKAGES',
      action: isPublishedIntent ? 'PUBLISH' : 'CREATE',
      eventType: isPublishedIntent ? 'AGENCY_PACKAGE_PUBLISHED' : 'AGENCY_PACKAGE_CREATED',
      description: `Agency "${agency.name}" ${isPublishedIntent ? 'published' : 'created'} package "${savedPackage.title}" (${savedPackage.packageId})`,
      severity: 'Low',
      metadata: { packageId: savedPackage.packageId, title: savedPackage.title, price: savedPackage.price },
    });

    return savedPackage;
  }

  /**
   * 5. Update Existing Package Details
   */
  public async updatePackage(
    agencyId: string | mongoose.Types.ObjectId,
    packageIdOrMongoId: string,
    data: any
  ): Promise<IPackage> {
    const pkg = await this.getPackageById(agencyId, packageIdOrMongoId);

    if (data.title || data.packageName) pkg.title = data.title || data.packageName;
    if (data.subtitle !== undefined) pkg.subtitle = data.subtitle;
    if (data.description !== undefined) pkg.description = data.description;
    if (data.destination) pkg.destination = data.destination;
    if (data.destinationCountry) pkg.destinationCountry = data.destinationCountry;
    if (data.category) pkg.category = data.category;
    if (data.adventureType) pkg.adventureType = data.adventureType;
    if (data.durationDays) pkg.durationDays = Number(data.durationDays);
    if (data.durationNights) pkg.durationNights = Number(data.durationNights);
    if (data.pickupCity !== undefined) pkg.pickupCity = data.pickupCity;
    if (data.dropOffCity !== undefined) pkg.dropOffCity = data.dropOffCity;
    if (data.pickupLocation !== undefined) pkg.pickupLocation = data.pickupLocation;
    if (data.dropOffLocation !== undefined) pkg.dropOffLocation = data.dropOffLocation;
    if (data.whatsappGroupLink !== undefined) pkg.whatsappGroupLink = data.whatsappGroupLink;
    if (data.price) pkg.price = Number(data.price);
    if (data.originalPrice) pkg.originalPrice = Number(data.originalPrice);
    if (data.availableSeats !== undefined) pkg.availableSeats = Number(data.availableSeats);
    if (data.totalSeats !== undefined) pkg.totalSeats = Number(data.totalSeats);
    if (data.coverImage) pkg.coverImage = data.coverImage;
    if (data.featuredImage) pkg.featuredImage = data.featuredImage;

    // Never overwrite gallery images if omitted or empty
    if (data.galleryImages && Array.isArray(data.galleryImages) && data.galleryImages.length > 0) {
      console.log('[8. Immediately before new PackageModel() / package.set() (updatePackage)]', data.galleryImages);
      pkg.galleryImages = normalizeGalleryImages(data.galleryImages);
    }

    if (data.inclusions) pkg.inclusions = data.inclusions;
    if (data.exclusions) pkg.exclusions = data.exclusions;
    const isPublishing = pkg.status === 'PUBLISHED' || data.status === 'PUBLISHED' || data.isPublished === true;
    if (data.itinerary !== undefined) {
      pkg.itinerary = normalizeAndValidateItinerary(data.itinerary, isPublishing);
    } else if (isPublishing && pkg.itinerary) {
      pkg.itinerary = normalizeAndValidateItinerary(pkg.itinerary, true);
    }
    if (data.accommodationConfirmed !== undefined) pkg.accommodationConfirmed = Boolean(data.accommodationConfirmed);
    if (data.accommodations !== undefined) pkg.accommodations = data.accommodations;
    if (data.isActive !== undefined) pkg.isActive = Boolean(data.isActive);

    if (data.status === 'PUBLISHED' || data.isPublished === true) {
      pkg.status = 'PUBLISHED';
      pkg.isDraft = false;
      pkg.isPublished = true;
      pkg.isActive = true;
      pkg.visibility = 'PUBLIC';
      pkg.approvalStatus = 'APPROVED';
      pkg.publishedAt = pkg.publishedAt || new Date();
      pkg.deletedAt = null as any;
    } else if (data.status === 'DRAFT' || data.isDraft === true) {
      if (pkg.status === 'PUBLISHED') {
        throw new BadRequestError('Published packages cannot be converted back to drafts.');
      }
      pkg.status = 'DRAFT';
      pkg.isDraft = true;
      pkg.isPublished = false;
    }

    pkg.updatedAt = new Date();
    console.log('[7. Inside the service before save() (updatePackage)]', pkg.galleryImages);
    await pkg.save();

    // Automatically synchronize DepartureModel records if departures are provided
    const rawDepartures = data.departures || data.upcomingDepartures;
    if (Array.isArray(rawDepartures) && rawDepartures.length > 0) {
      await this.syncPackageDepartures(pkg, rawDepartures, new mongoose.Types.ObjectId(agencyId.toString()));
    }

    return pkg;
  }

  /**
   * 6. Quick Toggle Package Status (Active / Draft / Hidden / Archived)
   */
  public async updatePackageStatus(
    agencyId: string | mongoose.Types.ObjectId,
    packageIdOrMongoId: string,
    status: 'Active' | 'Draft' | 'Hidden' | 'Archived' | 'Inactive'
  ): Promise<AgencyPackageDTO> {
    const pkg = await this.getPackageById(agencyId, packageIdOrMongoId);

    if (status === 'Active') {
      const targetAgencyId = pkg.agencyId ? pkg.agencyId.toString() : agencyId.toString();
      const payoutCheck = await sellerPaymentProfileService.isSellerPayoutReady(targetAgencyId, 'Agency');
      if (!payoutCheck.ready) {
        throw new ForbiddenError(payoutCheck.reason || 'Complete your payout account setup before publishing this package.');
      }

      const missingFields: string[] = [];
      if (!pkg.title || !pkg.title.trim()) missingFields.push('Package Title');
      if (!pkg.destination || !pkg.destination.trim()) missingFields.push('Destination');
      if (!pkg.price || pkg.price <= 0) missingFields.push('Pricing');
      if (!pkg.coverImage && !pkg.featuredImage && (!pkg.galleryImages || pkg.galleryImages.length === 0)) {
        missingFields.push('Cover Image');
      }

      // Check for at least one scheduled departure
      const departureCount = await DepartureModel.countDocuments({
        $or: [
          { packageId: pkg._id },
          { packageId: pkg.packageId },
          { packageId: pkg._id.toString() },
        ],
      });

      if (departureCount === 0) {
        missingFields.push('At least one scheduled departure');
      }

      if (missingFields.length > 0) {
        throw new BadRequestError(
          `Cannot activate package. Missing required fields: ${missingFields.join(', ')}`
        );
      }

      pkg.isActive = true;
      pkg.status = 'PUBLISHED';
      pkg.isPublished = true;
      pkg.visibility = 'PUBLIC';
      pkg.approvalStatus = 'APPROVED';
      pkg.publishedAt = pkg.publishedAt || new Date();
      pkg.deletedAt = null as any;
    } else if (status === 'Inactive') {
      pkg.isActive = false;
      pkg.status = 'INACTIVE';
      pkg.isPublished = false;
      pkg.visibility = 'PRIVATE';
    } else if (status === 'Draft') {
      if (pkg.status === 'PUBLISHED') {
        throw new BadRequestError('Published packages cannot be converted back to drafts.');
      }
      pkg.status = 'DRAFT';
      pkg.isDraft = true;
      pkg.isActive = false;
      pkg.isPublished = false;
      pkg.visibility = 'PRIVATE';
    } else if (status === 'Hidden') {
      pkg.isActive = false;
      pkg.visibility = 'HIDDEN';
    } else if (status === 'Archived') {
      pkg.isActive = false;
      pkg.status = 'REJECTED';
      pkg.isPublished = false;
    }

    await pkg.save();

    const mapped = this.mapToAgencyPackage(pkg);

    // Emit real-time socket event so all agency tabs stay synchronized
    socketService.getIO()?.emit('package:status-updated', {
      packageId: pkg.packageId,
      id: pkg._id.toString(),
      status: mapped.status,
      isActive: pkg.isActive,
      title: pkg.title,
    });

    return mapped;
  }

  /**
   * 6.5 Explicit Publish Package Flow (End-to-End)
   */
  public async publishPackage(
    agencyId: string | mongoose.Types.ObjectId,
    packageIdOrMongoId: string
  ): Promise<IPackage> {
    const aid = new mongoose.Types.ObjectId(agencyId.toString());
    const pkg = await this.getPackageById(agencyId, packageIdOrMongoId);

    // Prevent duplicate publish
    if (pkg.status === 'PUBLISHED') {
      throw new BadRequestError('This package is already published and cannot be republished.');
    }

    // Check payout setup
    const payoutCheck = await sellerPaymentProfileService.isSellerPayoutReady(aid.toString(), 'Agency');
    if (!payoutCheck.ready) {
      throw new ForbiddenError(payoutCheck.reason || 'Complete your payout account setup before publishing this package.');
    }

    // Validate required fields
    const missingFields: string[] = [];
    if (!pkg.title || !pkg.title.trim()) missingFields.push('Package Title');
    if (!pkg.destination || !pkg.destination.trim()) missingFields.push('Destination');
    if (!pkg.price || pkg.price <= 0) missingFields.push('Pricing');
    if (!pkg.coverImage && !pkg.featuredImage && (!pkg.galleryImages || pkg.galleryImages.length === 0)) {
      missingFields.push('Cover Image or Gallery Images');
    }

    // Verify at least one scheduled departure exists
    const departureCount = await DepartureModel.countDocuments({
      $or: [
        { packageId: pkg._id },
        { packageId: pkg.packageId },
        { packageId: pkg._id.toString() },
      ],
      departureDate: { $gt: new Date() },
      isManualClosed: { $ne: true },
    });

    if (departureCount === 0) {
      throw new BadRequestError('Cannot publish package. At least one future departure schedule is required.');
    }

    if (missingFields.length > 0) {
      throw new BadRequestError(`Cannot publish package. Missing required fields: ${missingFields.join(', ')}`);
    }

    // Validate and normalize itinerary completeness before publish
    pkg.itinerary = normalizeAndValidateItinerary(pkg.itinerary, true);

    const galleryLength = Array.isArray(pkg.galleryImages) ? pkg.galleryImages.length : 0;

    logger.info('[PACKAGE PUBLISH BEFORE SAVE]', {
      packageId: pkg.packageId,
      status: 'PUBLISHED',
      isPublished: true,
      isDraft: false,
      visibility: 'PUBLIC',
      approvalStatus: 'APPROVED',
      galleryImagesLength: galleryLength,
    });

    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      pkg.status = 'PUBLISHED';
      pkg.isDraft = false;
      pkg.isPublished = true;
      pkg.isActive = true;
      pkg.visibility = 'PUBLIC';
      pkg.publishedAt = new Date();
      pkg.approvalStatus = 'APPROVED';
      pkg.deletedAt = null as any;
      pkg.isDeleted = false;
      pkg.updatedAt = new Date();

      pkg.activities = pkg.activities || [];
      pkg.activities.push({
        id: `act-${Date.now()}`,
        adminName: pkg.agencyName || 'Agency Partner',
        action: 'Package Published',
        details: `Published package "${pkg.title}"`,
        timestamp: new Date().toISOString(),
      });

      console.log('[7. Inside the service before save() (publishPackage)]', pkg.galleryImages);
      await pkg.save({ session });

      await session.commitTransaction();
    } catch (err) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      logger.error('Failed to commit package publish transaction:', err);
      throw err;
    } finally {
      session.endSession();
    }

    logger.info('[PACKAGE PUBLISH AFTER SAVE]', {
      packageId: pkg.packageId,
      id: pkg._id.toString(),
      status: pkg.status,
      isPublished: pkg.isPublished,
      visibility: pkg.visibility,
      approvalStatus: pkg.approvalStatus,
      galleryImagesLength: Array.isArray(pkg.galleryImages) ? pkg.galleryImages.length : 0,
    });

    const mapped = this.mapToAgencyPackage(pkg);
    socketService.getIO()?.emit('package:status-updated', {
      packageId: pkg.packageId,
      id: pkg._id.toString(),
      status: mapped.status,
      isActive: pkg.isActive,
      title: pkg.title,
    });

    return pkg;
  }

  /**
   * 6.6 Get Single Active Draft for Agency (Strict Single-Draft Lifecycle)
   */
  public async getActiveDraft(
    agencyId: string | mongoose.Types.ObjectId
  ): Promise<IPackage | null> {
    const aid = new mongoose.Types.ObjectId(agencyId.toString());
    const draft = await PackageModel.findOne({
      agencyId: aid,
      status: 'DRAFT',
      isDeleted: false,
    }).sort({ updatedAt: -1 });

    return draft;
  }

  /**
   * 6.7 Discard/Delete Active Draft
   */
  public async discardActiveDraft(
    agencyId: string | mongoose.Types.ObjectId
  ): Promise<boolean> {
    const aid = new mongoose.Types.ObjectId(agencyId.toString());
    await PackageModel.updateMany(
      {
        agencyId: aid,
        status: 'DRAFT',
        isDeleted: false,
      },
      {
        isDeleted: true,
        deletedAt: new Date(),
      }
    );
    return true;
  }

  /**
   * 7. Duplicate / Clone Existing Package
   */
  public async duplicatePackage(
    agencyId: string | mongoose.Types.ObjectId,
    packageIdOrMongoId: string
  ): Promise<AgencyPackageDTO> {
    const original = await this.getPackageById(agencyId, packageIdOrMongoId);

    const count = await PackageModel.countDocuments();
    const padNum = String(count + 1).padStart(4, '0');
    const newPackageId = `PKG-${new Date().getFullYear()}-${padNum}`;

    const cloned = await PackageModel.create({
      packageId: newPackageId,
      agencyId: original.agencyId,
      agencyName: original.agencyName,
      agencyLogo: original.agencyLogo,
      title: `${original.title} (Copy)`,
      subtitle: original.subtitle,
      description: original.description,
      destination: original.destination,
      destinationCountry: original.destinationCountry,
      destinationRegion: original.destinationRegion,
      destinationFlag: original.destinationFlag,
      category: original.category,
      durationDays: original.durationDays,
      durationNights: original.durationNights,
      price: original.price,
      originalPrice: original.originalPrice,
      discountPercent: original.discountPercent,
      availableSeats: original.availableSeats,
      totalSeats: original.totalSeats,
      bookingsCount: 0,
      totalRevenue: 0,
      rating: 5.0,
      reviewCount: 0,
      featuredImage: original.featuredImage,
      coverImage: original.coverImage,
      galleryImages: original.galleryImages,
      status: 'DRAFT',
      isActive: true,
      isFeatured: false,
      inclusions: original.inclusions,
      exclusions: original.exclusions,
      itinerary: original.itinerary,
      isDeleted: false,
    });

    return this.mapToAgencyPackage(cloned);
  }

  /**
   * 8. Soft Delete Package
   */
  public async deletePackage(
    agencyId: string | mongoose.Types.ObjectId,
    packageIdOrMongoId: string
  ): Promise<boolean> {
    const pkg = await this.getPackageById(agencyId, packageIdOrMongoId);
    pkg.isDeleted = true;
    pkg.isActive = false;
    await pkg.save();
    return true;
  }
}

export const agencyPackageService = new AgencyPackageService();
