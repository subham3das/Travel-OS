import mongoose from 'mongoose';
import { PackageModel, IPackage } from '../models/package.model.js';
import { DepartureModel, IDeparture, computeDepartureStatus } from '../models/departure.model.js';
import { AgencyModel } from '../models/agency.model.js';
import { NotificationModel } from '../models/notification.model.js';
import { NotificationDispatcher } from './notificationDispatcher.service.js';
import { sellerPaymentProfileService } from './sellerPaymentProfile.service.js';
import { logger } from '../config/logger.config.js';

export interface PackageReadinessReasons {
  isPackageActive: boolean;
  isPackagePublished: boolean;
  isAgencyApproved: boolean;
  isPayoutReady: boolean;
  hasDepartures: boolean;
  hasOpenDeparture: boolean;
  hasFutureDeparture: boolean;
  isBookingWindowOpen: boolean;
  hasCapacity: boolean;
  hasRemainingSeats: boolean;
  hasValidPrice: boolean;
  hasItinerary: boolean;
  hasMedia: boolean;
  isNotArchived: boolean;
  isNotHidden: boolean;
}

export interface PackageReadinessResult {
  isBookable: boolean;
  status: 'READY' | 'NEEDS_SETUP';
  label: 'Ready to Sell' | 'Needs Setup';
  visibilityStatus: 'Visible' | 'Hidden';
  visibilityReason: 'No Departure' | 'Booking Closed' | 'Hidden' | 'Archived' | 'Agency Suspended' | 'Sold Out' | 'Draft' | 'Pending Review' | string;
  missingRequirements: string[];
  reasons: PackageReadinessReasons;
  validDepartureCount: number;
  upcomingDepartures?: Array<{
    id: string;
    departureId: string;
    departureDate: Date;
    endDate: Date;
    capacity: number;
    bookedSeats: number;
    remainingSeats: number;
    price: number;
    status: string;
    isSelectable: boolean;
  }>;
  nextDeparture?: {
    id: string;
    departureDate: Date;
    capacity: number;
    bookedSeats: number;
    remainingSeats: number;
    price: number;
  };
}

export class PackageReadinessService {
  /**
   * Evaluate complete package readiness according to Phase 1 required conditions
   */
  public async getPackageReadiness(pkgOrId: any): Promise<PackageReadinessResult> {
    let pkg: any = null;

    if (!pkgOrId) {
      return this.buildIncompleteResult(['Package does not exist']);
    }

    if (typeof pkgOrId === 'string' || pkgOrId instanceof mongoose.Types.ObjectId) {
      if (mongoose.Types.ObjectId.isValid(String(pkgOrId))) {
        pkg = await PackageModel.findOne({ _id: pkgOrId, isDeleted: false }).lean();
      }
      if (!pkg) {
        pkg = await PackageModel.findOne({ packageId: String(pkgOrId), isDeleted: false }).lean();
      }
    } else {
      pkg = pkgOrId;
    }

    if (!pkg) {
      return this.buildIncompleteResult(['Package not found']);
    }

    const packageObjectId = pkg._id;
    const now = new Date();

    // 1. Package Active & Valid pricing
    const isPackageActive = Boolean(pkg.isActive) && !pkg.isDeleted;
    const hasValidPrice = typeof pkg.price === 'number' && pkg.price > 0;
    const hasItinerary = Array.isArray(pkg.itinerary) && pkg.itinerary.length > 0;
    const hasMedia =
      (Array.isArray(pkg.images) && pkg.images.length > 0) ||
      (Array.isArray(pkg.galleryImages) && pkg.galleryImages.length > 0) ||
      Boolean(pkg.coverImage) ||
      Boolean(pkg.featuredImage);

    // 2. Package Published status (Must NOT be DRAFT, PENDING, REJECTED, INACTIVE, HIDDEN, ARCHIVED)
    const rawStatus = (pkg.status || '').toUpperCase();
    const isPackagePublished = ['APPROVED', 'ACTIVE', 'PUBLISHED'].includes(rawStatus);
    const isNotArchived = rawStatus !== 'ARCHIVED';
    const isNotHidden = rawStatus !== 'HIDDEN';

    // 3. Agency is Approved
    let isAgencyApproved = true;
    if (pkg.agencyId) {
      const agency = await AgencyModel.findById(pkg.agencyId).lean();
      if (!agency || agency.isDeleted) {
        isAgencyApproved = false;
      } else {
        const vStatus = (agency.verificationStatus || '').toUpperCase();
        const aStatus = (agency.status || '').toUpperCase();
        isAgencyApproved =
          vStatus === 'APPROVED' ||
          vStatus === 'VERIFIED' ||
          aStatus === 'ACTIVE' ||
          Boolean(agency.isVerified);
      }
    }

    // 3.5 Seller Payment & Payout Setup (Razorpay Route)
    let isPayoutReady = true;
    if (pkg.agencyId) {
      const payoutCheck = await sellerPaymentProfileService.isSellerPayoutReady(pkg.agencyId, 'Agency');
      isPayoutReady = payoutCheck.ready;
    }

    // 4. Fetch all departures for this package (matching both Mongo _id and custom packageId)
    const queryPackageIds: any[] = [packageObjectId];
    if (mongoose.Types.ObjectId.isValid(packageObjectId)) {
      queryPackageIds.push(new mongoose.Types.ObjectId(packageObjectId.toString()));
      queryPackageIds.push(packageObjectId.toString());
    }
    if (pkg.packageId) {
      queryPackageIds.push(pkg.packageId);
    }

    const departures: any[] = await DepartureModel.find({
      packageId: { $in: queryPackageIds },
    })
      .sort({ departureDate: 1 })
      .lean();

    const hasDepartures = departures.length > 0;
    let hasFutureDeparture = false;
    let isBookingWindowOpen = false;
    let hasCapacity = false;
    let hasRemainingSeats = false;
    let hasOpenDeparture = false;
    let validDepartureCount = 0;
    let nextDeparture: any = undefined;
    const upcomingDepartures: any[] = [];

    for (const dep of departures) {
      const depDate = new Date(dep.departureDate);
      const isFuture = depDate > now;
      if (isFuture) hasFutureDeparture = true;

      const bookingCloses = dep.bookingCloses ? new Date(dep.bookingCloses) : depDate;
      const bookingOpens = dep.bookingOpens ? new Date(dep.bookingOpens) : new Date(0);
      const windowOpen = now >= bookingOpens && now < bookingCloses;
      if (windowOpen) isBookingWindowOpen = true;

      const capacity = Number(dep.capacity) || 0;
      if (capacity > 0) hasCapacity = true;

      const bookedSeats = Number(dep.bookedSeats) || 0;
      const remaining = capacity - bookedSeats;
      if (remaining > 0) hasRemainingSeats = true;

      const computedStatus = computeDepartureStatus(dep);
      const isOpen = computedStatus === 'OPEN' && !dep.isManualClosed;
      const isSelectable = isFuture && windowOpen && capacity > 0 && remaining > 0 && isOpen;

      if (isSelectable) {
        hasOpenDeparture = true;
        validDepartureCount++;
        if (!nextDeparture) {
          nextDeparture = {
            id: dep.departureId || String(dep._id),
            departureDate: depDate,
            capacity,
            bookedSeats,
            remainingSeats: remaining,
            price: dep.priceOverride || pkg.price,
          };
        }
      }

      upcomingDepartures.push({
        id: dep.departureId || String(dep._id),
        departureId: dep.departureId || String(dep._id),
        departureDate: depDate,
        endDate: dep.endDate ? new Date(dep.endDate) : depDate,
        capacity,
        bookedSeats,
        remainingSeats: remaining,
        price: dep.priceOverride || pkg.price,
        status: computedStatus,
        isSelectable,
      });
    }

    // Compile Missing Requirements
    const missingRequirements: string[] = [];

    if (!isPackageActive) missingRequirements.push('Package is inactive');
    if (!isPackagePublished) missingRequirements.push('Package is not published / approved');
    if (!isNotArchived) missingRequirements.push('Package is archived');
    if (!isNotHidden) missingRequirements.push('Package is hidden');
    if (!hasValidPrice) missingRequirements.push('Valid price is not configured');
    if (!hasItinerary) missingRequirements.push('Package must contain at least one itinerary item');
    if (!hasMedia) missingRequirements.push('Package must contain cover or gallery images');
    if (!isAgencyApproved) missingRequirements.push('Agency account is pending approval');
    if (!isPayoutReady) missingRequirements.push('Complete your payout account setup before publishing this package.');

    if (!hasDepartures) {
      missingRequirements.push('No scheduled departures created');
    } else if (!hasFutureDeparture) {
      missingRequirements.push('All scheduled departures are in the past');
    } else if (!hasCapacity) {
      missingRequirements.push('Departure capacity is zero');
    } else if (!hasRemainingSeats) {
      missingRequirements.push('Departures are sold out (zero remaining seats)');
    } else if (!isBookingWindowOpen) {
      missingRequirements.push('Booking window has closed');
    } else if (!hasOpenDeparture) {
      missingRequirements.push('No active departures with OPEN status');
    }

    const isBookable = missingRequirements.length === 0;

    // Determine Visibility Status and Specific Reason for Admin & Agency Panels
    const visibilityStatus: 'Visible' | 'Hidden' = isBookable ? 'Visible' : 'Hidden';
    let visibilityReason: 'No Departure' | 'Booking Closed' | 'Hidden' | 'Archived' | 'Agency Suspended' | 'Sold Out' | 'Draft' | 'Pending Review' | 'Payout Setup Required' | string = 'Visible';

    if (!isBookable) {
      if (!isPayoutReady) {
        visibilityReason = 'Payout Setup Required';
      } else if (!isNotArchived) {
        visibilityReason = 'Archived';
      } else if (!isNotHidden) {
        visibilityReason = 'Hidden';
      } else if (!isAgencyApproved) {
        visibilityReason = 'Agency Suspended';
      } else if (!hasDepartures || !hasFutureDeparture) {
        visibilityReason = 'No Departure';
      } else if (!hasCapacity || !hasRemainingSeats) {
        visibilityReason = 'Sold Out';
      } else if (!isBookingWindowOpen) {
        visibilityReason = 'Booking Closed';
      } else if (!isPackagePublished) {
        visibilityReason = rawStatus === 'DRAFT' ? 'Draft' : 'Pending Review';
      } else {
        visibilityReason = 'Hidden';
      }
    }

    return {
      isBookable,
      status: isBookable ? 'READY' : 'NEEDS_SETUP',
      label: isBookable ? 'Ready to Sell' : 'Needs Setup',
      visibilityStatus,
      visibilityReason,
      missingRequirements,
      reasons: {
        isPackageActive,
        isPackagePublished,
        isAgencyApproved,
        isPayoutReady,
        hasDepartures,
        hasOpenDeparture,
        hasFutureDeparture,
        isBookingWindowOpen,
        hasCapacity,
        hasRemainingSeats,
        hasValidPrice,
        hasItinerary,
        hasMedia,
        isNotArchived,
        isNotHidden,
      },
      validDepartureCount,
      upcomingDepartures,
      nextDeparture,
    };
  }

  /**
   * Primary single source of truth validator required:
   * isPackageVisibleToTraveler(package)
   * A traveler must NEVER see a package anywhere if it is not completely configured and bookable.
   */
  public async isPackageVisibleToTraveler(pkgOrId: any): Promise<boolean> {
    const readiness = await this.getPackageReadiness(pkgOrId);
    return readiness.isBookable;
  }

  /**
   * Backward-compatible alias for isPackageVisibleToTraveler
   */
  public async isPackageBookable(pkgOrId: any): Promise<boolean> {
    return this.isPackageVisibleToTraveler(pkgOrId);
  }

  /**
   * Helper to return all MongoDB Package _id values currently visible and bookable to travelers
   * Highly optimized: avoids looping or N+1 queries across list endpoints
   */
  public async getBookablePackageIds(): Promise<mongoose.Types.ObjectId[]> {
    const now = new Date();

    // 1. Find all packageIds with at least one active, valid, open departure in the future
    const validPackageIds = await DepartureModel.find({
      departureDate: { $gt: now },
      status: { $nin: ['SOLDOUT', 'BOOKING_CLOSED', 'ONGOING', 'COMPLETED'] as any },
      isManualClosed: { $ne: true },
      capacity: { $gt: 0 },
      $and: [
        {
          $or: [
            { bookingCloses: { $gt: now } },
            { bookingCloses: { $exists: false } },
            { bookingCloses: null },
          ],
        },
        {
          $or: [
            { bookingOpens: { $lte: now } },
            { bookingOpens: { $exists: false } },
            { bookingOpens: null },
          ],
        },
        {
          $or: [
            { bookedSeats: { $exists: false } },
            { bookedSeats: null },
            { $expr: { $gt: ['$capacity', { $ifNull: ['$bookedSeats', 0] }] } },
          ],
        },
      ],
    }).distinct('packageId');

    if (!validPackageIds || validPackageIds.length === 0) {
      return [];
    }

    // Segregate validPackageIds into ObjectIds and String IDs
    const validObjectIds: mongoose.Types.ObjectId[] = [];
    const validStringPackageIds: string[] = [];
    for (const pid of validPackageIds) {
      if (!pid) continue;
      const pidStr = pid.toString();
      validStringPackageIds.push(pidStr);
      if (mongoose.Types.ObjectId.isValid(pidStr)) {
        validObjectIds.push(new mongoose.Types.ObjectId(pidStr));
      }
    }

    // 2. Filter by approved agencies (case-insensitive)
    const approvedAgencies = await AgencyModel.find({
      $or: [
        { status: { $regex: /^active$/i } },
        { verificationStatus: { $in: [/^approved$/i, /^verified$/i] } },
        { isVerified: true },
      ],
      status: { $nin: [/^suspended$/i, /^rejected$/i] },
      verificationStatus: { $ne: 'REJECTED' },
      isDeleted: { $ne: true },
    }).select('_id agencyId').lean();

    const approvedAgencyObjectIds = approvedAgencies
      .map((a) => a._id)
      .filter((id) => id && mongoose.Types.ObjectId.isValid(id.toString()))
      .map((id) => new mongoose.Types.ObjectId(id.toString()));

    // 3. Find published, active packages matching valid departures and approved agencies
    const packageQuery: any = {
      $or: [
        ...(validObjectIds.length > 0 ? [{ _id: { $in: validObjectIds } }] : []),
        ...(validStringPackageIds.length > 0 ? [{ packageId: { $in: validStringPackageIds } }] : []),
      ],
      isDeleted: false,
      isActive: true,
      status: { $in: [/^approved$/i, /^active$/i, /^published$/i] },
      price: { $gt: 0 },
      itinerary: { $exists: true, $ne: [] },
      $and: [
        {
          $or: [
            { coverImage: { $exists: true, $ne: '' } },
            { featuredImage: { $exists: true, $ne: '' } },
            { images: { $exists: true, $ne: [] } },
            { galleryImages: { $exists: true, $ne: [] } },
          ],
        },
      ],
    };

    if (approvedAgencies.length > 0) {
      packageQuery.$and.push({
        $or: [
          ...(approvedAgencyObjectIds.length > 0 ? [{ agencyId: { $in: approvedAgencyObjectIds } }] : []),
          { agencyId: { $exists: false } },
          { agencyId: null },
        ],
      });
    }

    const bookablePackages = await PackageModel.find(packageQuery).distinct('_id');
    return bookablePackages as mongoose.Types.ObjectId[];
  }

  /**
   * Alias: getVisiblePackageIds()
   */
  public async getVisiblePackageIds(): Promise<mongoose.Types.ObjectId[]> {
    return this.getBookablePackageIds();
  }

  /**
   * Universal MongoDB Filter for Public Traveler Queries
   */
  public async getBookableQueryFilter(additionalQuery: any = {}): Promise<any> {
    const bookableIds = await this.getBookablePackageIds();
    return {
      ...additionalQuery,
      _id: { $in: bookableIds },
      isDeleted: false,
      isActive: true,
    };
  }

  /**
   * Phase 6: Notify agency whenever a package cannot be sold
   */
  public async notifyAgencyIfNeeded(pkg: any, readiness: PackageReadinessResult): Promise<void> {
    if (readiness.isBookable || !pkg?.agencyId) return;

    const agencyIdStr = pkg.agencyId.toString();
    const pkgIdStr = pkg._id ? pkg._id.toString() : String(pkg.id || pkg.packageId);

    // Determine notification message according to Phase 6 requirements
    let description = `Package "${pkg.title}" is hidden because it requires setup.`;
    if (!readiness.reasons.hasDepartures) {
      description = `Package "${pkg.title}" is hidden because no departure has been scheduled.`;
    } else if (!readiness.reasons.isBookingWindowOpen) {
      description = `Package "${pkg.title}" booking window has expired.`;
    } else if (!readiness.reasons.hasRemainingSeats) {
      description = `Package "${pkg.title}" has zero available seats.`;
    } else if (!readiness.reasons.hasFutureDeparture) {
      description = `All departures for "${pkg.title}" are completed.`;
    }

    try {
      const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
      const existing = await NotificationModel.findOne({
        agencyId: new mongoose.Types.ObjectId(agencyIdStr),
        relatedEntityId: pkgIdStr,
        category: 'package',
        createdAt: { $gte: twelveHoursAgo },
      });

      if (!existing) {
        await NotificationDispatcher.notifyAgency(agencyIdStr, {
          title: `Package Hidden: ${pkg.title}`,
          description,
          category: 'package',
          priority: 'HIGH',
          targetRoute: `/agency/packages/${pkg.packageId || pkgIdStr}/edit?step=4`,
          ctaText: 'Schedule Departure',
          ctaLink: `/agency/packages/${pkg.packageId || pkgIdStr}/edit?step=4`,
          relatedEntityType: 'PACKAGE',
          relatedEntityId: pkgIdStr,
          relatedEntityName: pkg.title,
        });
      }
    } catch (err: any) {
      logger.warn(`Failed to dispatch agency notification for unbookable package: ${err.message}`);
    }
  }

  private buildIncompleteResult(missingRequirements: string[]): PackageReadinessResult {
    return {
      isBookable: false,
      status: 'NEEDS_SETUP',
      label: 'Needs Setup',
      visibilityStatus: 'Hidden',
      visibilityReason: missingRequirements[0] || 'Hidden',
      missingRequirements,
      reasons: {
        isPackageActive: false,
        isPackagePublished: false,
        isAgencyApproved: false,
        isPayoutReady: false,
        hasDepartures: false,
        hasOpenDeparture: false,
        hasFutureDeparture: false,
        isBookingWindowOpen: false,
        hasCapacity: false,
        hasRemainingSeats: false,
        hasValidPrice: false,
        hasItinerary: false,
        hasMedia: false,
        isNotArchived: false,
        isNotHidden: false,
      },
      validDepartureCount: 0,
    };
  }
}

export const packageReadinessService = new PackageReadinessService();

/**
 * Global single source of truth exported validator: isPackageVisibleToTraveler(package)
 * Used across the entire platform to guarantee travelers NEVER see incomplete packages.
 */
export const isPackageVisibleToTraveler = (pkgOrId: any): Promise<boolean> => {
  return packageReadinessService.isPackageVisibleToTraveler(pkgOrId);
};

/**
 * Backward-compatible alias
 */
export const isPackageBookable = (pkgOrId: any): Promise<boolean> => {
  return packageReadinessService.isPackageVisibleToTraveler(pkgOrId);
};

