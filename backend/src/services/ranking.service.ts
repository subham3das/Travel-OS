export class RankingService {
  /**
   * Calculate live dynamic score for a package
   * Trending Score = Bookings*12 + Views*1 + Wishlist*5 + Reviews*8 + RatingBonus + RecentBonus
   */
  public calculatePackageScore(pkg: any): number {
    const bookings = Number(pkg.bookingsCount) || 0;
    const views = Number(pkg.viewsCount) || 0;
    const wishlist = Number(pkg.wishlistCount) || 0;
    const reviews = Number(pkg.reviewCount) || 0;
    const rating = Number(pkg.rating) || 0;

    let score = bookings * 12 + views * 1 + wishlist * 5 + reviews * 8;

    // High rating quality bonus
    if (rating >= 4.5) {
      score += 30;
    } else if (rating >= 4.0) {
      score += 15;
    }

    // Recent growth bonus (created in last 14 days)
    if (pkg.createdAt) {
      const ageInDays = (Date.now() - new Date(pkg.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      if (ageInDays <= 7) {
        score += 25;
      } else if (ageInDays <= 14) {
        score += 15;
      }
    }

    return score;
  }

  /**
   * Calculate score for an agency
   * Agency Score = Rating*20 + TripsCompleted*5 + Reviews*3 + VerifiedBonus
   */
  public calculateAgencyScore(agency: any): number {
    const rating = Number(agency.rating) || 0;
    const trips = Number(agency.tripsCompleted || agency.bookingsCount) || 0;
    const reviews = Number(agency.reviewCount || agency.reviewsCount) || 0;
    const isVerified = Boolean(agency.isVerified);

    let score = rating * 20 + trips * 5 + reviews * 3;
    if (isVerified) score += 35;

    return score;
  }

  /**
   * Sort array of packages by ranking rule
   */
  public rankPackages(packages: any[], rule: string = 'trending'): any[] {
    const copy = [...packages];

    switch (rule) {
      case 'trending':
        return copy.sort((a, b) => this.calculatePackageScore(b) - this.calculatePackageScore(a));

      case 'popular':
      case 'most_booked':
        return copy.sort((a, b) => (b.bookingsCount || 0) - (a.bookingsCount || 0));

      case 'highest_rated':
        return copy.sort((a, b) => {
          if ((b.rating || 0) !== (a.rating || 0)) {
            return (b.rating || 0) - (a.rating || 0);
          }
          return (b.reviewCount || 0) - (a.reviewCount || 0);
        });

      case 'recently_added':
      case 'newest':
        return copy.sort(
          (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );

      case 'most_wishlisted':
        return copy.sort((a, b) => (b.wishlistCount || 0) - (a.wishlistCount || 0));

      case 'hidden_gems':
        // High rating, lower views/bookings
        return copy
          .filter((p) => (p.rating || 0) >= 4.0 && (p.bookingsCount || 0) <= 25)
          .sort((a, b) => (b.rating || 0) - (a.rating || 0));

      case 'budget':
      case 'price_low':
        return copy.sort((a, b) => (a.price || 0) - (b.price || 0));

      case 'luxury':
      case 'price_high':
        return copy.sort((a, b) => (b.price || 0) - (a.price || 0));

      default:
        return copy.sort((a, b) => this.calculatePackageScore(b) - this.calculatePackageScore(a));
    }
  }

  /**
   * Sort agencies by performance score
   */
  public rankAgencies(agencies: any[]): any[] {
    return [...agencies].sort(
      (a, b) => this.calculateAgencyScore(b) - this.calculateAgencyScore(a)
    );
  }
}

export const rankingService = new RankingService();
