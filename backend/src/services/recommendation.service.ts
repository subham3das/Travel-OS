import mongoose from 'mongoose';
import { PackageModel } from '../models/package.model.js';
import { UserModel } from '../models/user.model.js';
import { BookingModel } from '../models/booking.model.js';
import { rankingService } from './ranking.service.js';
import { packageReadinessService } from './packageReadiness.service.js';

export class RecommendationService {
  /**
   * Get personalized recommendations for a user or smart discovery fallback
   */
  public async getRecommendations(userId?: string, limit: number = 8): Promise<any[]> {
    let preferredCategories: string[] = [];
    let preferredDestinations: string[] = [];
    let preferredAdventureTypes: string[] = [];
    let bookedPackageIds: string[] = [];

    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      try {
        const [user, bookings] = await Promise.all([
          UserModel.findById(userId).lean(),
          BookingModel.find({ userId: new mongoose.Types.ObjectId(userId) })
            .select('packageId destination')
            .lean(),
        ]);

        if (user?.travelPreferences?.travelInterests?.length) {
          preferredCategories.push(...user.travelPreferences.travelInterests);
          preferredAdventureTypes.push(...user.travelPreferences.travelInterests);
        }

        bookings.forEach((b: any) => {
          if (b.packageId) bookedPackageIds.push(String(b.packageId));
          if (b.destination) preferredDestinations.push(b.destination);
        });

        // Also extract adventureTypes from previously booked packages
        if (bookedPackageIds.length > 0) {
          const bookedPackages = await PackageModel.find({
            $or: [
              { _id: { $in: bookedPackageIds.filter((id) => mongoose.Types.ObjectId.isValid(id)) } },
              { packageId: { $in: bookedPackageIds } },
            ],
          })
            .select('adventureType')
            .lean();

          bookedPackages.forEach((bp: any) => {
            if (bp.adventureType && !preferredAdventureTypes.includes(bp.adventureType)) {
              preferredAdventureTypes.push(bp.adventureType);
            }
          });
        }
      } catch (err) {
        // Fall back gracefully
      }
    }

    const bookableIds = await packageReadinessService.getBookablePackageIds();
    if (bookableIds.length === 0) return [];

    let allowedIds = bookableIds;
    if (bookedPackageIds.length > 0) {
      const bookedSet = new Set(bookedPackageIds);
      allowedIds = bookableIds.filter((id) => !bookedSet.has(String(id)));
    }

    // Build query for personalized packages
    const baseFilter: any = {
      _id: { $in: allowedIds },
      isDeleted: false,
      isActive: true,
      status: { $in: ['APPROVED', 'ACTIVE', 'PUBLISHED'] },
    };

    let candidatePackages: any[] = [];

    // If user has specific category, adventure type, or destination preferences
    if (preferredCategories.length > 0 || preferredDestinations.length > 0 || preferredAdventureTypes.length > 0) {
      const matchCriteria: any[] = [];
      if (preferredCategories.length > 0) {
        matchCriteria.push({ category: { $in: preferredCategories.map((c) => new RegExp(c, 'i')) } });
      }
      if (preferredAdventureTypes.length > 0) {
        matchCriteria.push({ adventureType: { $in: preferredAdventureTypes.map((a) => new RegExp(`^${a}$`, 'i')) } });
      }
      if (preferredDestinations.length > 0) {
        matchCriteria.push({ destination: { $in: preferredDestinations.map((d) => new RegExp(d, 'i')) } });
      }

      candidatePackages = await PackageModel.find({
        ...baseFilter,
        $or: matchCriteria,
      })
        .limit(limit * 2)
        .lean();
    }

    // If candidatePackages are fewer than limit, fill up with top-ranked general packages
    if (candidatePackages.length < limit) {
      const existingIds = new Set(candidatePackages.map((p) => p._id.toString()));
      const remainingBookableIds = allowedIds.filter((id) => !existingIds.has(String(id)));
      const fallbackFilter = {
        ...baseFilter,
        _id: { $in: remainingBookableIds },
      };

      const topPackages = await PackageModel.find(fallbackFilter)
        .sort({ rating: -1, bookingsCount: -1, createdAt: -1 })
        .limit(limit * 2)
        .lean();

      candidatePackages.push(...topPackages);
    }

    // Rank candidate packages
    const ranked = rankingService.rankPackages(candidatePackages, 'trending');
    return ranked.slice(0, limit);
  }
}

export const recommendationService = new RecommendationService();
