import { PackageModel } from '../models/package.model.js';
import { AgencyModel } from '../models/agency.model.js';
import { BookingModel } from '../models/booking.model.js';
import { TripModel } from '../models/trip.model.js';

export interface GlobalSearchFilters {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  duration?: string;
  type?: string;
  userId?: string;
}

export class SearchService {
  public async search(filters: GlobalSearchFilters) {
    const q = (filters.query || '').trim();
    const regex = q ? new RegExp(q, 'i') : null;

    // 1. Search Packages
    const packageQuery: any = { isDeleted: false };
    if (regex) {
      packageQuery.$or = [
        { title: regex },
        { destination: regex },
        { category: regex },
        { agencyName: regex },
        { description: regex },
      ];
    }
    if (filters.category && filters.category !== 'all') {
      packageQuery.category = new RegExp(filters.category, 'i');
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

    const [packages, agencies] = await Promise.all([
      PackageModel.find(packageQuery).limit(12).lean(),
      AgencyModel.find(agencyQuery).limit(8).lean(),
    ]);

    // Map packages to SearchResultItem
    const mappedPackages = packages.map((pkg: any) => ({
      id: pkg.packageId || String(pkg._id),
      type: 'package' as const,
      title: pkg.title,
      subtitle: `${pkg.destination || 'India'} • ${pkg.durationDays || 4} Days • by ${pkg.agencyName || 'Partner'}`,
      imageUrl: pkg.coverImage || pkg.featuredImage || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800',
      rating: pkg.rating || 4.8,
      reviewsCount: pkg.reviewCount || 120,
      price: `₹${(pkg.price || 0).toLocaleString('en-IN')}`,
      badge: pkg.discountPercent ? `${pkg.discountPercent}% Off` : (pkg.isFeatured ? 'Featured' : 'Popular'),
      tags: [pkg.category || 'Adventure', `${pkg.durationDays || 4}D/${pkg.durationNights || 3}N`],
      route: `/package/${pkg.packageId || String(pkg._id)}`,
    }));

    // Derive destination results from packages
    const destinationMap = new Map<string, any>();
    packages.forEach((pkg: any) => {
      const destName = pkg.destination || 'Meghalaya';
      const destId = destName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (!destinationMap.has(destId)) {
        destinationMap.set(destId, {
          id: destId,
          type: 'destination' as const,
          title: destName,
          subtitle: `${pkg.destinationRegion || 'North India'} • Starting ₹${(pkg.price || 5999).toLocaleString('en-IN')}`,
          imageUrl: pkg.coverImage || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800',
          rating: 4.8,
          reviewsCount: '1.2K',
          price: `From ₹${(pkg.price || 5999).toLocaleString('en-IN')}`,
          badge: 'Trending',
          tags: ['Scenic', 'Adventure'],
          route: `/destination/${destId}`,
        });
      }
    });

    const mappedDestinations = Array.from(destinationMap.values());

    // Map agencies to SearchResultItem
    const mappedAgencies = agencies.map((agency: any) => {
      const agencyName = agency.agencyName || agency.name || 'Travel Agency';
      const location = agency.city ? `${agency.city}, ${agency.state || 'India'}` : (agency.location || 'India');
      const aid = agency.agencyId || String(agency._id);

      return {
        id: aid,
        type: 'agency' as const,
        title: agencyName,
        subtitle: `${location} • ${agency.tripsCompleted || '1,000+'}+ Trips`,
        imageUrl: agency.logo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
        rating: agency.rating || 4.9,
        reviewsCount: agency.reviewCount || 95,
        badge: agency.isVerified ? 'Verified' : 'Partner',
        tags: Array.isArray(agency.specializationTags) ? agency.specializationTags.slice(0, 2) : ['Adventure'],
        route: `/agencies/${aid}`,
      };
    });

    const totalCount = mappedDestinations.length + mappedPackages.length + mappedAgencies.length;

    return {
      destinations: mappedDestinations,
      packages: mappedPackages,
      agencies: mappedAgencies,
      bookings: [],
      trips: [],
      messages: [],
      totalCount,
    };
  }
}

export const searchService = new SearchService();
