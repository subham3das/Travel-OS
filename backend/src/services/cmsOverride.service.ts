import mongoose from 'mongoose';
import { DiscoveryOverrideModel, IDiscoveryOverride } from '../models/discoveryOverride.model.js';
import { PackageModel } from '../models/package.model.js';
import { AgencyModel } from '../models/agency.model.js';

export class CMSOverrideService {
  /**
   * Get all active overrides for a given section and targetType
   */
  public async getActiveOverrides(
    sectionId: string,
    targetType: 'PACKAGE' | 'AGENCY'
  ): Promise<IDiscoveryOverride[]> {
    const today = new Date().toISOString().slice(0, 10);
    return DiscoveryOverrideModel.find({
      targetType,
      isActive: true,
      $or: [{ sectionId }, { sectionId: 'all' }],
      $and: [
        { $or: [{ startDate: { $exists: false } }, { startDate: '' }, { startDate: { $lte: today } }] },
        { $or: [{ endDate: { $exists: false } }, { endDate: '' }, { endDate: { $gte: today } }] },
      ],
    })
      .sort({ priority: -1, createdAt: -1 })
      .lean();
  }

  /**
   * Apply package overrides to an automatically ranked package list
   */
  public async applyPackageOverrides(
    packages: any[],
    sectionId: string
  ): Promise<any[]> {
    const overrides = await this.getActiveOverrides(sectionId, 'PACKAGE');
    if (!overrides || overrides.length === 0) {
      return packages;
    }

    const pinnedPackages: any[] = [];
    const pinnedIds = new Set<string>();

    for (const ov of overrides) {
      const targetIdStr = ov.targetId.toString();
      pinnedIds.add(targetIdStr);

      // Check if target is already in the list
      const existingIdx = packages.findIndex(
        (p) => p._id?.toString() === targetIdStr || p.id === targetIdStr || p.packageId === targetIdStr
      );

      if (existingIdx !== -1) {
        const item = { ...packages[existingIdx] };
        if (ov.overrideBadge && ov.overrideBadge !== 'Normal') {
          item.badge = ov.overrideBadge;
        }
        item.isPinned = true;
        item.overridePriority = ov.priority;
        pinnedPackages.push(item);
      } else {
        // Fetch from DB if not in the current slice
        const dbPkg = await PackageModel.findOne({
          _id: ov.targetId,
          isDeleted: false,
          status: 'APPROVED',
          isActive: true,
        }).lean();

        if (dbPkg) {
          pinnedPackages.push({
            id: dbPkg.packageId || String(dbPkg._id),
            _id: String(dbPkg._id),
            packageId: dbPkg.packageId || String(dbPkg._id),
            title: dbPkg.title,
            destinationName: dbPkg.destination,
            price: `₹${(dbPkg.price || 0).toLocaleString('en-IN')}`,
            numericPrice: dbPkg.price || 0,
            rating: dbPkg.rating || 4.8,
            reviewCount: dbPkg.reviewCount || 1,
            duration: `${dbPkg.durationDays || 4} Days / ${dbPkg.durationNights || 3} Nights`,
            coverImage: dbPkg.coverImage || dbPkg.featuredImage || '',
            badge: ov.overrideBadge !== 'Normal' ? ov.overrideBadge : 'Featured',
            isPinned: true,
            overridePriority: ov.priority,
          });
        }
      }
    }

    // Sort pinned packages by override priority DESC
    pinnedPackages.sort((a, b) => (b.overridePriority || 0) - (a.overridePriority || 0));

    // Filter out pinned from automatic list to avoid duplicates
    const remaining = packages.filter(
      (p) => !pinnedIds.has(p._id?.toString()) && !pinnedIds.has(p.id) && !pinnedIds.has(p.packageId)
    );

    return [...pinnedPackages, ...remaining];
  }

  /**
   * Apply agency overrides to an automatically ranked agency list
   */
  public async applyAgencyOverrides(
    agencies: any[],
    sectionId: string
  ): Promise<any[]> {
    const overrides = await this.getActiveOverrides(sectionId, 'AGENCY');
    if (!overrides || overrides.length === 0) {
      return agencies;
    }

    const pinnedAgencies: any[] = [];
    const pinnedIds = new Set<string>();

    for (const ov of overrides) {
      const targetIdStr = ov.targetId.toString();
      pinnedIds.add(targetIdStr);

      const existingIdx = agencies.findIndex(
        (a) => a._id?.toString() === targetIdStr || a.id === targetIdStr || a.agencyId === targetIdStr
      );

      if (existingIdx !== -1) {
        const item = { ...agencies[existingIdx] };
        if (ov.overrideBadge && ov.overrideBadge !== 'Normal') {
          item.badge = ov.overrideBadge;
        }
        item.isPinned = true;
        item.overridePriority = ov.priority;
        pinnedAgencies.push(item);
      } else {
        const dbAgency = await AgencyModel.findOne({
          _id: ov.targetId,
          isDeleted: false,
          status: { $ne: 'SUSPENDED' },
        }).lean();

        if (dbAgency) {
          pinnedAgencies.push({
            id: String(dbAgency._id),
            _id: String(dbAgency._id),
            agencyId: (dbAgency as any).agencyId || String(dbAgency._id),
            name: (dbAgency as any).companyName || (dbAgency as any).name,
            logoUrl: (dbAgency as any).logo || '',
            coverImageUrl: (dbAgency as any).coverImage || '',
            rating: (dbAgency as any).rating || 4.9,
            reviewCount: (dbAgency as any).reviewsCount || 1,
            isVerified: Boolean((dbAgency as any).isVerified),
            badge: ov.overrideBadge !== 'Normal' ? ov.overrideBadge : 'Featured Agency',
            isPinned: true,
            overridePriority: ov.priority,
          });
        }
      }
    }

    pinnedAgencies.sort((a, b) => (b.overridePriority || 0) - (a.overridePriority || 0));

    const remaining = agencies.filter(
      (a) => !pinnedIds.has(a._id?.toString()) && !pinnedIds.has(a.id) && !pinnedIds.has(a.agencyId)
    );

    return [...pinnedAgencies, ...remaining];
  }

  /**
   * Admin: Create or update an override
   */
  public async setOverride(data: {
    targetType: 'PACKAGE' | 'AGENCY';
    targetId: string;
    sectionId: string;
    overrideBadge?: string;
    priority?: number;
    isActive?: boolean;
    startDate?: string;
    endDate?: string;
    notes?: string;
    createdAdmin?: string;
  }) {
    const filter = {
      targetId: new mongoose.Types.ObjectId(data.targetId),
      sectionId: data.sectionId || 'all',
    };

    const update = {
      targetType: data.targetType,
      targetId: new mongoose.Types.ObjectId(data.targetId),
      sectionId: data.sectionId || 'all',
      overrideBadge: data.overrideBadge || 'Featured',
      priority: typeof data.priority === 'number' ? data.priority : 100,
      isActive: data.isActive !== undefined ? data.isActive : true,
      startDate: data.startDate,
      endDate: data.endDate,
      notes: data.notes || '',
      createdAdmin: data.createdAdmin || 'Super Admin',
    };

    return DiscoveryOverrideModel.findOneAndUpdate(filter, update, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
  }

  /**
   * Admin: Delete an override
   */
  public async deleteOverride(overrideId: string) {
    return DiscoveryOverrideModel.findByIdAndDelete(overrideId);
  }

  /**
   * Admin: Get all overrides with target details populated
   */
  public async getAllOverrides(targetType?: string) {
    const query: any = {};
    if (targetType) query.targetType = targetType;

    const list = await DiscoveryOverrideModel.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .lean();

    // Populate target entity details
    const populated = await Promise.all(
      list.map(async (ov) => {
        let targetDetails: any = null;
        if (ov.targetType === 'PACKAGE') {
          targetDetails = await PackageModel.findById(ov.targetId)
            .select('title destination price coverImage featuredImage rating agencyName')
            .lean();
        } else if (ov.targetType === 'AGENCY') {
          targetDetails = await AgencyModel.findById(ov.targetId)
            .select('name companyName logo coverImage rating isVerified location')
            .lean();
        }
        return {
          ...ov,
          targetDetails,
        };
      })
    );

    return populated;
  }
}

export const cmsOverrideService = new CMSOverrideService();
