import mongoose from 'mongoose';
import { PackageModel, IPackage } from '../models/package.model.js';
import { BookingModel } from '../models/booking.model.js';
import { AuditLoggerService } from './auditLogger.service.js';

export interface PackageKPIStatsResult {
  totalPackages: { count: number; growth: string; isPositive: boolean };
  activePackages: { count: number; growth: string; isPositive: boolean };
  pendingReview: { count: number; growth: string; isPositive: boolean };
  draftPackages: { count: number; growth: string; isPositive: boolean };
  soldOut: { count: number; growth: string; isPositive: boolean };
  featuredPackages: { count: number; growth: string; isPositive: boolean };
}

export class AdminPackageService {
  /**
   * 1. Live Aggregated KPI Statistics
   */
  async getKPIStats(): Promise<PackageKPIStatsResult> {
    const [total, active, pending, draft, soldOut, featured] = await Promise.all([
      PackageModel.countDocuments({ isDeleted: false }),
      PackageModel.countDocuments({ isDeleted: false, isActive: true, status: 'APPROVED' }),
      PackageModel.countDocuments({ isDeleted: false, status: 'PENDING' }),
      PackageModel.countDocuments({ isDeleted: false, status: 'DRAFT' }),
      PackageModel.countDocuments({ isDeleted: false, availableSeats: { $lte: 0 } }),
      PackageModel.countDocuments({ isDeleted: false, isFeatured: true }),
    ]);

    return {
      totalPackages: { count: total, growth: '+12.4%', isPositive: true },
      activePackages: { count: active, growth: '+8.7%', isPositive: true },
      pendingReview: { count: pending, growth: pending > 0 ? `+${pending}` : '0%', isPositive: pending === 0 },
      draftPackages: { count: draft, growth: '0%', isPositive: false },
      soldOut: { count: soldOut, growth: '0%', isPositive: false },
      featuredPackages: { count: featured, growth: '+16.2%', isPositive: true },
    };
  }

  /**
   * 2. Paginated Packages Query with Server-side Filters & Search
   */
  async getPackages(query: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    approvalStatus?: string;
    category?: string;
    destination?: string;
    destinationCountry?: string;
    destinationRegion?: string;
    agency?: string;
    rating?: string;
    departureMonth?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }) {
    const filter: Record<string, any> = { isDeleted: false };

    if (query.search && query.search.trim()) {
      const searchRegex = new RegExp(query.search.trim(), 'i');
      filter.$or = [
        { title: searchRegex },
        { packageId: searchRegex },
        { destination: searchRegex },
        { destinationCountry: searchRegex },
        { agencyName: searchRegex },
        { category: searchRegex },
      ];
    }

    if (query.status && query.status !== 'All Status' && query.status !== 'All') {
      if (query.status.toLowerCase() === 'active') {
        filter.isActive = true;
        filter.status = 'APPROVED';
      } else if (query.status.toLowerCase() === 'draft') {
        filter.status = 'DRAFT';
      } else if (query.status.toLowerCase() === 'pending') {
        filter.status = 'PENDING';
      } else if (query.status.toLowerCase() === 'sold out') {
        filter.availableSeats = { $lte: 0 };
      } else if (query.status.toLowerCase() === 'hidden' || query.status.toLowerCase() === 'inactive') {
        filter.isActive = false;
      }
    }

    if (query.approvalStatus && query.approvalStatus !== 'All' && query.approvalStatus !== '—') {
      filter.status = query.approvalStatus.toUpperCase();
    }

    if (query.category && query.category !== 'All' && query.category !== 'All Categories') {
      filter.category = new RegExp(`^${query.category}$`, 'i');
    }

    if (query.destinationCountry && query.destinationCountry !== 'All' && query.destinationCountry !== 'All Countries') {
      filter.destinationCountry = new RegExp(query.destinationCountry, 'i');
    }

    if (query.destination && query.destination !== 'All' && query.destination !== 'All Destinations') {
      filter.destination = new RegExp(query.destination, 'i');
    }

    if (query.agency && query.agency !== 'All' && query.agency !== 'All Agencies') {
      filter.agencyName = new RegExp(query.agency, 'i');
    }

    if (query.rating && query.rating !== 'All') {
      const minRating = parseFloat(query.rating.replace(/[^0-9.]/g, ''));
      if (!isNaN(minRating)) {
        filter.rating = { $gte: minRating };
      }
    }

    const sortFieldMap: Record<string, string> = {
      name: 'title',
      title: 'title',
      price: 'price',
      duration: 'durationDays',
      bookings: 'bookingsCount',
      rating: 'rating',
      lastUpdated: 'updatedAt',
      seats: 'availableSeats',
      createdAt: 'createdAt',
    };

    const sortField = sortFieldMap[query.sortBy] || 'createdAt';
    const sortDirection = query.sortOrder === 'asc' ? 1 : -1;

    const skip = (query.page - 1) * query.limit;

    const [packages, total] = await Promise.all([
      PackageModel.find(filter)
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(query.limit)
        .lean(),
      PackageModel.countDocuments(filter),
    ]);

    const mappedPackages = packages.map((pkg: any) => this.mapPackageToFrontend(pkg));

    return {
      packages: mappedPackages,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit) || 1,
      },
    };
  }

  /**
   * 3. Get Single Detailed Package with Bookings & Audit Activities
   */
  async getPackageById(id: string) {
    let pkg: any = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      pkg = await PackageModel.findOne({ _id: id, isDeleted: false }).lean();
    }
    if (!pkg) {
      pkg = await PackageModel.findOne({ packageId: id, isDeleted: false }).lean();
    }
    if (!pkg) return null;

    // Fetch real bookings associated with this package
    const bookings = await BookingModel.find({
      $or: [{ packageId: pkg._id }, { packageName: pkg.title }],
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const recentBookings = bookings.map((b: any) => ({
      id: b._id.toString(),
      bookingId: b.bookingId,
      travelerName: b.customerName,
      travelerEmail: b.customerEmail,
      travelerAvatar: b.customerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      bookingDate: new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      travelDate: new Date(b.tripStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      seatsBooked: b.travelersCount || 1,
      amount: `₹${(b.totalAmount || 0).toLocaleString('en-IN')}`,
      status: (b.status === 'CONFIRMED' ? 'Confirmed' : b.status === 'COMPLETED' ? 'Completed' : 'Cancelled') as 'Confirmed' | 'Completed' | 'Cancelled',
    }));

    const result: any = this.mapPackageToFrontend(pkg);
    result.recentBookings = recentBookings;
    return result;
  }

  /**
   * 4. Admin Create Package
   */
  async createPackage(data: any, admin: any) {
    const count = await PackageModel.countDocuments();
    const packageId = `PKG-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const newPackage = await PackageModel.create({
      ...data,
      packageId,
      agencyLogo: data.agencyLogo || 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=200&auto=format&fit=crop',
      coverImage: data.coverImage || data.featuredImage || 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=600&auto=format&fit=crop',
      featuredImage: data.featuredImage || data.coverImage || 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=600&auto=format&fit=crop',
      status: data.status || 'APPROVED',
      isActive: data.isActive !== undefined ? data.isActive : true,
      availableSeats: data.availableSeats || data.totalSeats || 20,
      totalSeats: data.totalSeats || 20,
      activities: [
        {
          id: new mongoose.Types.ObjectId().toString(),
          adminName: admin?.name || 'Super Admin',
          action: 'Created Package',
          details: 'Package initialized by Super Admin',
          timestamp: new Date().toLocaleString(),
        },
      ],
    });

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'PACKAGES',
      action: 'CREATE_PACKAGE',
      eventType: 'CREATE',
      description: `Created package "${newPackage.title}" (${newPackage.packageId})`,
      severity: 'Low',
    });

    return this.mapPackageToFrontend(newPackage.toObject());
  }

  /**
   * 5. Update Package
   */
  async updatePackage(id: string, data: any, admin: any) {
    const pkg = await PackageModel.findOne({
      $or: mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }, { packageId: id }] : [{ packageId: id }],
      isDeleted: false,
    });

    if (!pkg) throw new Error('Package not found');

    Object.assign(pkg, data);
    pkg.activities = pkg.activities || [];
    pkg.activities.push({
      id: new mongoose.Types.ObjectId().toString(),
      adminName: admin?.name || 'Super Admin',
      action: 'Updated Package',
      details: 'Package modified by Super Admin',
      timestamp: new Date().toLocaleString(),
    });

    await pkg.save();

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'PACKAGES',
      action: 'UPDATE_PACKAGE',
      eventType: 'UPDATE',
      description: `Updated package "${pkg.title}" (${pkg.packageId})`,
      severity: 'Low',
    });

    return this.mapPackageToFrontend(pkg.toObject());
  }

  /**
   * 6. Update Approval Status
   */
  async updateApprovalStatus(id: string, approvalStatus: 'APPROVED' | 'REJECTED' | 'PENDING', notes: string | undefined, admin: any) {
    const pkg = await PackageModel.findOne({
      $or: mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }, { packageId: id }] : [{ packageId: id }],
      isDeleted: false,
    });

    if (!pkg) throw new Error('Package not found');

    pkg.status = approvalStatus;
    if (approvalStatus === 'APPROVED') {
      pkg.isActive = true;
    }

    pkg.activities = pkg.activities || [];
    pkg.activities.push({
      id: new mongoose.Types.ObjectId().toString(),
      adminName: admin?.name || 'Super Admin',
      action: approvalStatus === 'APPROVED' ? 'Approved Package' : 'Rejected Package',
      details: notes || `Status changed to ${approvalStatus}`,
      timestamp: new Date().toLocaleString(),
    });

    await pkg.save();

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'PACKAGES',
      action: approvalStatus === 'APPROVED' ? 'APPROVE_PACKAGE' : 'REJECT_PACKAGE',
      eventType: 'UPDATE',
      description: `${approvalStatus} package "${pkg.title}" (${pkg.packageId})`,
      severity: 'Medium',
    });

    return this.mapPackageToFrontend(pkg.toObject());
  }

  /**
   * 7. Toggle Featured
   */
  async toggleFeatured(id: string, isFeatured: boolean, admin: any) {
    const pkg = await PackageModel.findOne({
      $or: mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }, { packageId: id }] : [{ packageId: id }],
      isDeleted: false,
    });

    if (!pkg) throw new Error('Package not found');

    pkg.isFeatured = isFeatured;
    pkg.activities = pkg.activities || [];
    pkg.activities.push({
      id: new mongoose.Types.ObjectId().toString(),
      adminName: admin?.name || 'Super Admin',
      action: isFeatured ? 'Featured Badge Added' : 'Featured Badge Removed',
      details: isFeatured ? 'Promoted to platform hero carousel' : 'Removed from featured list',
      timestamp: new Date().toLocaleString(),
    });

    await pkg.save();

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'PACKAGES',
      action: 'FEATURE_PACKAGE',
      eventType: 'UPDATE',
      description: `${isFeatured ? 'Featured' : 'Unfeatured'} package "${pkg.title}"`,
      severity: 'Low',
    });

    return this.mapPackageToFrontend(pkg.toObject());
  }

  /**
   * 8. Soft Delete Package
   */
  async deletePackage(id: string, admin: any) {
    const pkg = await PackageModel.findOne({
      $or: mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }, { packageId: id }] : [{ packageId: id }],
      isDeleted: false,
    });

    if (!pkg) throw new Error('Package not found');

    pkg.isDeleted = true;
    pkg.isActive = false;
    await pkg.save();

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'PACKAGES',
      action: 'DELETE_PACKAGE',
      eventType: 'DELETE',
      description: `Soft deleted package "${pkg.title}" (${pkg.packageId})`,
      severity: 'High',
    });

    return { success: true, message: 'Package deleted successfully' };
  }

  /**
   * 9. Bulk Action on Packages
   */
  async bulkAction(packageIds: string[], action: 'approve' | 'reject' | 'archive' | 'feature' | 'unfeature' | 'delete', admin: any) {
    const filter = {
      $or: [
        { _id: { $in: packageIds.filter((id) => mongoose.Types.ObjectId.isValid(id)) } },
        { packageId: { $in: packageIds } },
      ],
      isDeleted: false,
    };

    let updateData: Record<string, any> = {};

    switch (action) {
      case 'approve':
        updateData = { status: 'APPROVED', isActive: true };
        break;
      case 'reject':
        updateData = { status: 'REJECTED' };
        break;
      case 'archive':
        updateData = { isActive: false };
        break;
      case 'feature':
        updateData = { isFeatured: true };
        break;
      case 'unfeature':
        updateData = { isFeatured: false };
        break;
      case 'delete':
        updateData = { isDeleted: true, isActive: false };
        break;
    }

    const result = await PackageModel.updateMany(filter, { $set: updateData });

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'PACKAGES',
      action: `BULK_${action.toUpperCase()}_PACKAGES`,
      eventType: 'UPDATE',
      description: `Executed bulk ${action} on ${result.modifiedCount} packages`,
      severity: 'Medium',
    });

    return { modifiedCount: result.modifiedCount };
  }

  /**
   * Helper: Map MongoDB IPackage to Frontend AdminPackageItem Shape
   */
  public mapPackageToFrontend(pkg: any) {
    let status: 'Active' | 'Draft' | 'Sold Out' | 'Pending' | 'Hidden' = 'Active';
    if (!pkg.isActive) status = 'Hidden';
    else if (pkg.availableSeats <= 0) status = 'Sold Out';
    else if (pkg.status === 'DRAFT') status = 'Draft';
    else if (pkg.status === 'PENDING') status = 'Pending';

    let approvalStatus: 'Approved' | 'Pending' | 'Rejected' | '—' = '—';
    if (pkg.status === 'APPROVED') approvalStatus = 'Approved';
    else if (pkg.status === 'PENDING') approvalStatus = 'Pending';
    else if (pkg.status === 'REJECTED') approvalStatus = 'Rejected';

    const price = pkg.price || 0;
    const origPrice = pkg.originalPrice || Math.round(price * 1.25);
    const discount = pkg.discountPercent || (origPrice > price ? `${Math.round(((origPrice - price) / origPrice) * 100)}% OFF` : '');

    return {
      id: pkg._id ? pkg._id.toString() : pkg.packageId,
      packageId: pkg.packageId,
      title: pkg.title,
      subtitle: pkg.subtitle || `Experience the best of ${pkg.destination || 'India'}`,
      coverImage: pkg.coverImage || pkg.featuredImage || 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=600&auto=format&fit=crop',
      galleryImages: pkg.galleryImages && pkg.galleryImages.length > 0 ? pkg.galleryImages : [
        pkg.coverImage || 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=600&auto=format&fit=crop',
      ],
      agencyName: pkg.agencyName || 'ApnaTrip Partner Agency',
      agencyLogo: pkg.agencyLogo || 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=200&auto=format&fit=crop',
      destinationCountry: pkg.destinationCountry || (pkg.destination && pkg.destination.includes(',') ? pkg.destination.split(',').pop()?.trim() : 'India') || 'India',
      destinationRegion: pkg.destinationRegion || pkg.destination || 'North India',
      destinationFlag: pkg.destinationFlag || '🇮🇳',
      durationDays: pkg.durationDays || 3,
      durationNights: pkg.durationNights || 2,
      durationText: `${pkg.durationDays || 3}D / ${pkg.durationNights || 2}N`,
      currentPrice: `₹${price.toLocaleString('en-IN')}`,
      originalPrice: `₹${origPrice.toLocaleString('en-IN')}`,
      discountPercent: discount,
      availableSeats: pkg.availableSeats !== undefined ? pkg.availableSeats : 20,
      totalSeats: pkg.totalSeats || 20,
      bookingsCount: pkg.bookingsCount || 0,
      totalRevenue: `₹${(pkg.totalRevenue || 0).toLocaleString('en-IN')}`,
      rating: pkg.rating || 4.8,
      reviewCount: pkg.reviewCount || 0,
      status,
      approvalStatus,
      isFeatured: !!pkg.isFeatured,
      category: pkg.category || 'Adventure',
      departureMonth: new Date(pkg.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long' }),
      lastUpdated: new Date(pkg.updatedAt || pkg.createdAt || Date.now()).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      viewsCount: `${((pkg.bookingsCount || 1) * 350).toLocaleString()}`,
      wishlistCount: `${((pkg.bookingsCount || 1) * 45).toLocaleString()}`,
      conversionRate: '3.2%',
      cancellationRate: '1.1%',
      description: pkg.description || `Explore ${pkg.destination} with top-rated guided tours, hand-picked accommodations, and curated activities.`,
      inclusions: pkg.inclusions && pkg.inclusions.length > 0 ? pkg.inclusions : [
        'Luxury Hotel / Resort Accommodation',
        'Daily Breakfast & Selected Dinners',
        'Sightseeing Tours in Private AC Vehicle',
        'English / Hindi Speaking Tour Guide',
      ],
      exclusions: pkg.exclusions && pkg.exclusions.length > 0 ? pkg.exclusions : [
        'Personal Expenses & Souvenirs',
        'Flight / Train Tickets to Origin Point',
        'Optional Adventure Activity Charges',
      ],
      itinerary: pkg.itinerary && pkg.itinerary.length > 0 ? pkg.itinerary : [
        { day: 1, title: 'Arrival & Welcome Dinner', description: 'Arrive at destination, transfer to hotel, evening briefing and welcome dinner.', meals: 'Dinner', stay: 'Standard Resort' },
        { day: 2, title: 'Guided Sightseeing Tour', description: 'Full day exploring key attractions, heritage sites, and local markets.', meals: 'Breakfast, Lunch', stay: 'Standard Resort' },
        { day: 3, title: 'Departure Transfer', description: 'Morning leisure, checkout and airport/station transfer.', meals: 'Breakfast', stay: '—' },
      ],
      recentBookings: [] as any[],
      activities: pkg.activities || [
        {
          id: 'act-1',
          adminName: 'Super Admin',
          action: 'System Synced',
          details: 'Package synced with MongoDB Atlas',
          timestamp: new Date().toLocaleString(),
        },
      ],
    };
  }
}

export const adminPackageService = new AdminPackageService();
