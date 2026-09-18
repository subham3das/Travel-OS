import mongoose from 'mongoose';
import { PackageModel, IPackage, PackageApprovalStatus } from '../models/package.model.js';
import { AgencyModel } from '../models/agency.model.js';
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils/errors.util.js';
import { AuditLoggerService } from './auditLogger.service.js';

export interface AgencyPackageFilters {
  search?: string;
  status?: string;
  category?: string;
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
  status: 'Active' | 'Draft' | 'Hidden' | 'Archived';
  lastUpdated: string;
  packageType: 'Domestic' | 'International';
  coverImage: string;
  raw?: any;
}

export interface AgencyPackageStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
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
  private mapToAgencyPackage(pkg: IPackage): AgencyPackageDTO {
    let statusFormatted: 'Active' | 'Draft' | 'Hidden' | 'Archived' = 'Active';
    if (!pkg.isActive) {
      statusFormatted = 'Hidden';
    } else if (pkg.status === 'DRAFT') {
      statusFormatted = 'Draft';
    } else if (pkg.status === 'REJECTED') {
      statusFormatted = 'Archived';
    } else if (pkg.status === 'APPROVED' || pkg.status === 'PENDING') {
      statusFormatted = 'Active';
    }

    const isIntl =
      pkg.destinationCountry &&
      pkg.destinationCountry.toLowerCase() !== 'india' &&
      pkg.destinationCountry.toLowerCase() !== 'in';

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
      coverImage:
        pkg.coverImage ||
        pkg.featuredImage ||
        (pkg.galleryImages && pkg.galleryImages.length > 0 ? pkg.galleryImages[0] : '') ||
        'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=600&auto=format&fit=crop&q=80',
      raw: {
        category: pkg.category,
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
      },
    };
  }

  /**
   * 1. Get Live KPI Statistics for Agency Packages
   */
  public async getPackageStats(agencyId: string | mongoose.Types.ObjectId): Promise<AgencyPackageStats> {
    const aid = new mongoose.Types.ObjectId(agencyId.toString());

    const stats = await PackageModel.aggregate([
      { $match: { agencyId: aid, isDeleted: false } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          published: {
            $sum: {
              $cond: [{ $and: [{ $eq: ['$isActive', true] }, { $eq: ['$status', 'APPROVED'] }] }, 1, 0],
            },
          },
          draft: {
            $sum: {
              $cond: [{ $eq: ['$status', 'DRAFT'] }, 1, 0],
            },
          },
          archived: {
            $sum: {
              $cond: [{ $or: [{ $eq: ['$isActive', false] }, { $eq: ['$status', 'REJECTED'] }] }, 1, 0],
            },
          },
        },
      },
    ]);

    if (!stats || stats.length === 0) {
      return { total: 0, published: 0, draft: 0, archived: 0 };
    }

    return {
      total: stats[0].total || 0,
      published: stats[0].published || 0,
      draft: stats[0].draft || 0,
      archived: stats[0].archived || 0,
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
      ];
    }

    if (filters?.status && filters.status !== 'All') {
      if (filters.status === 'Active') {
        query.isActive = true;
        query.status = { $in: ['APPROVED', 'PENDING'] };
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

    const page = Math.max(1, Number(filters?.page) || 1);
    const limit = Math.max(1, Number(filters?.limit) || 20);
    const skip = (page - 1) * limit;

    const [packages, total] = await Promise.all([
      PackageModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      PackageModel.countDocuments(query),
    ]);

    return {
      items: packages.map((pkg) => this.mapToAgencyPackage(pkg)),
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

    return pkg;
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
    const count = await PackageModel.countDocuments();
    const padNum = String(count + 1).padStart(4, '0');
    const packageId = `PKG-${new Date().getFullYear()}-${padNum}`;

    const title = data.title || data.packageName || 'Untitled Package';
    const destination = data.destination || data.destinationRegion || 'Flexible Destination';
    const price = Number(data.price || data.basePrice || 9999);

    const newPackage = await PackageModel.create({
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
      durationDays: Number(data.durationDays || 3),
      durationNights: Number(data.durationNights || 2),
      price,
      originalPrice: Number(data.originalPrice || price * 1.2),
      discountPercent: data.discountPercent || '',
      availableSeats: Number(data.availableSeats || 20),
      totalSeats: Number(data.totalSeats || 20),
      bookingsCount: 0,
      totalRevenue: 0,
      rating: 5.0,
      reviewCount: 0,
      featuredImage: data.coverImage || data.featuredImage || '',
      coverImage: data.coverImage || data.featuredImage || '',
      galleryImages: data.galleryImages || [],
      status: data.isDraft ? 'DRAFT' : 'APPROVED',
      isActive: true,
      isFeatured: false,
      inclusions: data.inclusions || [],
      exclusions: data.exclusions || [],
      itinerary: data.itinerary || [],
      activities: [
        {
          id: `act-${Date.now()}`,
          adminName: agency.name,
          action: 'Package Created',
          details: `Created package "${title}"`,
          timestamp: new Date().toISOString(),
        },
      ],
      isDeleted: false,
    });

    AuditLoggerService.log({
      actor: {
        id: aid.toString(),
        name: agency.name,
        email: agency.email,
        role: 'AGENCY',
      },
      module: 'PACKAGES',
      action: 'CREATE',
      eventType: 'AGENCY_PACKAGE_CREATED',
      description: `Agency "${agency.name}" created package "${newPackage.title}" (${newPackage.packageId})`,
      severity: 'Low',
      metadata: { packageId: newPackage.packageId, title: newPackage.title, price: newPackage.price },
    });

    return newPackage;
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
    if (data.durationDays) pkg.durationDays = Number(data.durationDays);
    if (data.durationNights) pkg.durationNights = Number(data.durationNights);
    if (data.price) pkg.price = Number(data.price);
    if (data.originalPrice) pkg.originalPrice = Number(data.originalPrice);
    if (data.availableSeats !== undefined) pkg.availableSeats = Number(data.availableSeats);
    if (data.totalSeats !== undefined) pkg.totalSeats = Number(data.totalSeats);
    if (data.coverImage) pkg.coverImage = data.coverImage;
    if (data.featuredImage) pkg.featuredImage = data.featuredImage;
    if (data.galleryImages) pkg.galleryImages = data.galleryImages;
    if (data.inclusions) pkg.inclusions = data.inclusions;
    if (data.exclusions) pkg.exclusions = data.exclusions;
    if (data.itinerary) pkg.itinerary = data.itinerary;
    if (data.isActive !== undefined) pkg.isActive = Boolean(data.isActive);

    pkg.updatedAt = new Date();
    await pkg.save();

    return pkg;
  }

  /**
   * 6. Quick Toggle Package Status (Active / Draft / Hidden / Archived)
   */
  public async updatePackageStatus(
    agencyId: string | mongoose.Types.ObjectId,
    packageIdOrMongoId: string,
    status: 'Active' | 'Draft' | 'Hidden' | 'Archived'
  ): Promise<AgencyPackageDTO> {
    const pkg = await this.getPackageById(agencyId, packageIdOrMongoId);

    if (status === 'Active') {
      pkg.isActive = true;
      pkg.status = 'APPROVED';
    } else if (status === 'Draft') {
      pkg.status = 'DRAFT';
      pkg.isActive = true;
    } else if (status === 'Hidden') {
      pkg.isActive = false;
    } else if (status === 'Archived') {
      pkg.isActive = false;
      pkg.status = 'REJECTED';
    }

    await pkg.save();
    return this.mapToAgencyPackage(pkg);
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
