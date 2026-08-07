export interface TeamMember {
  id: string;
  name: string;
  role: string;
  experience: string;
  avatar: string;
  linkedinUrl?: string;
}

export interface AgencyPackage {
  id: string;
  title: string;
  duration: string;
  price: string;
  originalPrice?: string;
  rating: number;
  badge?: string;
  badgeType?: 'bestseller' | 'popular' | 'new';
  imageUrl: string;
}

export interface AgencyReview {
  id: string;
  travelerId: string;
  travelerName: string;
  travelerAvatar: string;
  date: string;
  rating: number;
  comment: string;
  tags: string[];
  imageUrl?: string;
}

export interface OfficeInfo {
  address: string;
  phone: string;
  email: string;
  hours: string;
}

export interface Agency {
  id: string;
  name: string;
  tagline: string;
  logo: string;
  coverImage: string;
  isVerified: boolean;
  featuredBadge?: string;
  rating: number;
  reviewCount: number;
  yearsExperience: number;
  tripsCompleted: string;
  destinationsCount: number;
  guidesCount: number;
  languagesCount: number;
  languages: string;
  location: string;
  startingPrice: string;
  responseTime: string;
  specializationTags: string[];
  travelStyles: string[];
  popularDestinations: { id: string; name: string; rating: number; reviews: number; image: string }[];
  description: string;
  introVideoUrl?: string;
  phone: string;
  email: string;
  website: string;
  gallery: string[];
  team: TeamMember[];
  packages: AgencyPackage[];
  reviews: AgencyReview[];
  certifications: { title: string; subtitle: string; badge: string; variant?: 'green' | 'blue' | 'purple' | 'amber' }[];
  office: OfficeInfo;
  coordinates: {
    lat: number;
    lng: number;
  };
}
