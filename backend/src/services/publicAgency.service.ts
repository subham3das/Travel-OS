import mongoose from 'mongoose';
import { AgencyModel, IAgency } from '../models/agency.model.js';
import { PackageModel } from '../models/package.model.js';
import { ReviewModel } from '../models/review.model.js';
import { NotFoundError } from '../utils/errors.util.js';

export interface PublicAgencyFilters {
  search?: string;
  q?: string;
  location?: string;
  verifiedOnly?: boolean;
  minRating?: number;
  page?: number;
  limit?: number;
}

export class PublicAgencyService {
  /**
   * Format an agency document to the frontend Agency interface
   */
  public async formatAgencyResponse(agency: any, packagesList: any[] = [], reviewsList: any[] = []) {
    const rawId = agency.agencyId || String(agency._id);
    const agencyName = agency.agencyName || agency.name || 'ApnaTrip Travel Agency';
    const location = agency.city ? `${agency.city}, ${agency.state || 'India'}` : (agency.location || 'India');

    const formattedPackages = packagesList.map((p: any) => ({
      id: p.packageId || String(p._id),
      title: p.title,
      duration: `${p.durationDays || 4} Days / ${p.durationNights || 3} Nights`,
      price: `₹${(p.price || 0).toLocaleString('en-IN')}`,
      originalPrice: p.originalPrice ? `₹${p.originalPrice.toLocaleString('en-IN')}` : undefined,
      rating: p.rating || 4.8,
      badge: p.discountPercent ? `${p.discountPercent}% Off` : (p.isFeatured ? 'Featured' : 'Popular'),
      badgeType: (p.isFeatured ? 'bestseller' : 'popular') as 'bestseller' | 'popular' | 'new',
      imageUrl: p.coverImage || p.featuredImage || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800',
    }));

    const formattedReviews = reviewsList.map((r: any) => ({
      id: r.reviewId || String(r._id),
      travelerId: r.userId ? String(r.userId) : 'traveler-01',
      travelerName: r.userName || 'Traveler',
      travelerAvatar: r.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
      date: r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recent',
      rating: r.rating || 5,
      comment: r.reviewText || '',
      tags: ['Verified Booking', 'Great Experience'],
      imageUrl: r.images && r.images.length > 0 ? r.images[0] : undefined,
    }));

    const tags = Array.isArray(agency.specializationTags) && agency.specializationTags.length > 0
      ? agency.specializationTags
      : ['Adventure Tours', 'Custom Itineraries', 'Family Expeditions', 'Mountain Treks'];

    return {
      id: rawId,
      _id: String(agency._id),
      agencyId: rawId,
      name: agencyName,
      tagline: agency.tagline || 'Leading Authorized Travel Specialists',
      logo: agency.logo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
      coverImage: agency.coverImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200',
      isVerified: agency.isVerified ?? (agency.verificationStatus === 'APPROVED' || agency.verificationStatus === 'VERIFIED'),
      featuredBadge: agency.featuredBadge || 'Verified Partner',
      rating: agency.rating || 4.9,
      reviewCount: agency.reviewCount || reviewsList.length || 140,
      yearsExperience: agency.yearsExperience || 6,
      tripsCompleted: `${agency.tripsCompleted || '1,200+'}+ Trips`,
      destinationsCount: agency.destinationsCount || 12,
      guidesCount: agency.guidesCount || 8,
      languagesCount: 3,
      languages: 'English, Hindi, Assamese',
      location,
      startingPrice: '₹4,999',
      responseTime: 'Within 2 hours',
      specializationTags: tags,
      travelStyles: ['Adventure', 'Nature', 'Heritage', 'Custom Group'],
      popularDestinations: [
        { id: 'meghalaya', name: 'Meghalaya', rating: 4.9, reviews: 320, image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=400' },
        { id: 'ladakh', name: 'Ladakh', rating: 4.8, reviews: 290, image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=400' },
      ],
      description: agency.description || `${agencyName} is an authorized and certified premier travel operator providing authentic, safe, and tailor-made travel adventures with dedicated local guides.`,
      introVideoUrl: agency.introVideoUrl || undefined,
      phone: agency.phone || '+91 98765 43210',
      email: agency.agencyEmail || agency.email || 'support@agency.com',
      website: agency.website || 'https://apnatrip.com',
      gallery: [
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600',
        'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=600',
      ],
      team: [
        {
          id: 'tm-1',
          name: 'Lead Operations Director',
          role: 'Founder & Chief Explorer',
          experience: '10+ Years',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
        },
      ],
      packages: formattedPackages,
      reviews: formattedReviews,
      certifications: [
        { title: 'Ministry of Tourism', subtitle: 'Govt. Recognized', badge: 'Certified', variant: 'green' as const },
        { title: 'IATA Accredited', subtitle: 'Global Standards', badge: 'Verified', variant: 'blue' as const },
      ],
      office: {
        address: agency.address || `${location}`,
        phone: agency.phone || '+91 98765 43210',
        email: agency.agencyEmail || agency.email || 'contact@agency.com',
        hours: 'Mon – Sat: 09:00 AM – 07:00 PM',
      },
      coordinates: {
        lat: 26.1445,
        lng: 91.7362,
      },
    };
  }

  /**
   * List public agencies
   */
  public async getAgencies(filters: PublicAgencyFilters) {
    const { search, q, location, verifiedOnly, minRating, page = 1, limit = 15 } = filters;

    const query: any = {
      isDeleted: false,
    };

    const searchText = search || q;
    if (searchText && searchText.trim()) {
      const regex = new RegExp(searchText.trim(), 'i');
      query.$or = [
        { name: regex },
        { agencyName: regex },
        { city: regex },
        { state: regex },
        { description: regex },
        { specializationTags: regex },
      ];
    }

    if (location && location !== 'all') {
      const locRegex = new RegExp(location.trim(), 'i');
      query.$or = query.$or || [];
      query.$or.push({ city: locRegex }, { state: locRegex }, { location: locRegex });
    }

    if (verifiedOnly) {
      query.isVerified = true;
    }

    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    const skip = (Math.max(1, page) - 1) * Math.max(1, limit);
    const take = Math.max(1, limit);

    const [total, agencies] = await Promise.all([
      AgencyModel.countDocuments(query),
      AgencyModel.find(query).sort({ rating: -1, createdAt: -1 }).skip(skip).limit(take).lean(),
    ]);

    const formattedAgencies = await Promise.all(
      agencies.map((agency) => this.formatAgencyResponse(agency))
    );

    return {
      agencies: formattedAgencies,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / take) || 1,
        hasMore: skip + agencies.length < total,
      },
    };
  }

  /**
   * Get single agency by ID or slug
   */
  public async getAgencyById(agencyIdentifier: string) {
    if (!agencyIdentifier || !agencyIdentifier.trim()) {
      throw new NotFoundError('Agency ID must be provided');
    }

    const trimmed = agencyIdentifier.trim();
    let agency: any = null;

    if (mongoose.Types.ObjectId.isValid(trimmed)) {
      agency = await AgencyModel.findOne({ _id: trimmed, isDeleted: false }).lean();
    }

    if (!agency) {
      agency = await AgencyModel.findOne({
        agencyId: { $regex: new RegExp(`^${trimmed}$`, 'i') },
        isDeleted: false,
      }).lean();
    }

    if (!agency) {
      agency = await AgencyModel.findOne({
        $or: [
          { name: { $regex: new RegExp(trimmed.replace(/-/g, ' '), 'i') } },
          { agencyName: { $regex: new RegExp(trimmed.replace(/-/g, ' '), 'i') } },
        ],
        isDeleted: false,
      }).lean();
    }

    if (!agency) {
      throw new NotFoundError(`Agency "${agencyIdentifier}" not found`);
    }

    // Fetch this agency's packages
    const packages = await PackageModel.find({
      agencyId: agency._id,
      isDeleted: false,
    }).lean();

    // Fetch this agency's reviews
    const reviews = await ReviewModel.find({
      agencyId: agency._id,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .limit(15)
      .lean();

    return this.formatAgencyResponse(agency, packages, reviews);
  }
}

export const publicAgencyService = new PublicAgencyService();
