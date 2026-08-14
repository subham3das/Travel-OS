import {
  AdminPackageItem,
  PackageKPIStats,
  PackageFilters,
  PackageSortConfig,
} from '../types/packageManagement';

const STORAGE_KEY_PACKAGES = 'apnatrip_admin_packages_list';
const STORAGE_KEY_PACKAGE_STATS = 'apnatrip_admin_packages_kpi_stats';

export const initialPackageKPIStats: PackageKPIStats = {
  totalPackages: { count: 5482, growth: '12.4%', isPositive: true },
  activePackages: { count: 4916, growth: '8.7%', isPositive: true },
  pendingReview: { count: 124, growth: '5.3%', isPositive: true },
  draftPackages: { count: 215, growth: '3.1%', isPositive: false },
  soldOut: { count: 37, growth: '12.6%', isPositive: false },
  featuredPackages: { count: 412, growth: '16.2%', isPositive: true },
};

export const initialAdminPackages: AdminPackageItem[] = [
  {
    id: 'PKG-1',
    packageId: 'PKG-2024-0001',
    title: 'Magical Switzerland',
    subtitle: 'Discover the beauty of Alps',
    coverImage: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=600&auto=format&fit=crop',
    agencyName: 'Wanderlust Holidays',
    agencyLogo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=200&auto=format&fit=crop',
    destinationCountry: 'Switzerland',
    destinationRegion: 'Interlaken',
    destinationFlag: '🇨🇭',
    durationDays: 6,
    durationNights: 5,
    durationText: '6D / 5N',
    currentPrice: '₹89,999',
    originalPrice: '₹1,20,000',
    discountPercent: '25% OFF',
    availableSeats: 12,
    totalSeats: 20,
    bookingsCount: 18,
    totalRevenue: '₹16,19,982',
    rating: 4.8,
    reviewCount: 128,
    status: 'Active',
    approvalStatus: 'Approved',
    isFeatured: true,
    category: 'Luxury',
    departureMonth: 'May',
    lastUpdated: 'May 21, 2024',
    viewsCount: '12,450',
    wishlistCount: '1,245',
    conversionRate: '2.8%',
    cancellationRate: '1.2%',
    description: 'Experience the breathtaking beauty of Swiss Alps, crystal clear lakes, charming villages and thrilling adventures in this 6 days 5 nights journey across Switzerland.',
    inclusions: [
      '5 Nights Luxury 4-Star Hotel Stay with Mountain View',
      'Daily Swiss Breakfast Buffet & 3 Gourmet Dinners',
      'Swiss Travel Pass with Unlimited Scenic Train Access',
      'Excursion to Jungfraujoch - Top of Europe',
      'Lake Thun & Lake Brienz Cruise Tickets',
      'English-Speaking Tour Director & Guided City Tours',
    ],
    exclusions: [
      'International Airfare & Visa Processing Charges',
      'Travel Insurance with Extreme Sports Coverage',
      'Personal Expenses, Souvenirs & Alcoholic Drinks',
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Zurich & Transfer to Interlaken', description: 'Arrive at Zurich Airport, scenic train ride to Interlaken, check-in to alpine resort and evening stroll around town.', meals: 'Dinner included', stay: 'Alpine Grand Hotel' },
      { day: 2, title: 'Jungfraujoch - Top of Europe', description: 'Ascend to the highest railway station in Europe with stunning Sphinx observatory views and Ice Palace exploration.', meals: 'Breakfast, Lunch', stay: 'Alpine Grand Hotel' },
      { day: 3, title: 'Lake Thun Cruise & St. Beatus Caves', description: 'Scenic boat cruise along Lake Thun with a guided visit to mystical limestone caves and waterfalls.', meals: 'Breakfast, Dinner', stay: 'Alpine Grand Hotel' },
      { day: 4, title: 'Lucerne Day Trip & Mt. Pilatus', description: 'Explore Chapel Bridge, Lion Monument and take the world’s steepest cogwheel railway up Mt. Pilatus.', meals: 'Breakfast', stay: 'Lucerne Lakefront Hotel' },
      { day: 5, title: 'Scenic GoldenPass Express', description: 'Panoramic train ride through lush valleys, Swiss chalets and wine terraces of Montreux.', meals: 'Breakfast, Swiss Fondue Dinner', stay: 'Lucerne Lakefront Hotel' },
      { day: 6, title: 'Zurich City Tour & Departure', description: 'Morning shopping at Bahnhofstrasse followed by airport transfer for your departure flight.', meals: 'Breakfast', stay: '—' },
    ],
    recentBookings: [
      { id: 'b1', bookingId: 'BK-2024-8901', travelerName: 'Arjun Mehta', travelerEmail: 'arjun.mehta@email.com', travelerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop', bookingDate: 'May 18, 2024', travelDate: 'Jun 10, 2024', seatsBooked: 2, amount: '₹1,79,998', status: 'Confirmed' },
      { id: 'b2', bookingId: 'BK-2024-8842', travelerName: 'Rohit Verma', travelerEmail: 'rohit.verma@email.com', travelerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop', bookingDate: 'May 14, 2024', travelDate: 'Jul 05, 2024', seatsBooked: 4, amount: '₹3,59,996', status: 'Confirmed' },
    ],
    activities: [
      { id: 'act1', adminName: 'Super Admin', action: 'Approved Package', details: 'Package approved for marketplace publication', timestamp: 'May 21, 2024 • 11:30 AM' },
      { id: 'act2', adminName: 'Super Admin', action: 'Featured Badge Added', details: 'Promoted to platform hero carousel', timestamp: 'May 21, 2024 • 11:35 AM' },
    ],
  },
  {
    id: 'PKG-2',
    packageId: 'PKG-2024-0002',
    title: 'Bali Paradise',
    subtitle: 'Explore Bali in comfort',
    coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600&auto=format&fit=crop',
    agencyName: 'Himalayan Treks',
    agencyLogo: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=200&auto=format&fit=crop',
    destinationCountry: 'Indonesia',
    destinationRegion: 'Bali',
    destinationFlag: '🇮🇩',
    durationDays: 5,
    durationNights: 4,
    durationText: '5D / 4N',
    currentPrice: '₹59,999',
    originalPrice: '₹76,000',
    discountPercent: '21% OFF',
    availableSeats: 8,
    totalSeats: 15,
    bookingsCount: 22,
    totalRevenue: '₹13,19,978',
    rating: 4.6,
    reviewCount: 72,
    status: 'Active',
    approvalStatus: 'Approved',
    isFeatured: false,
    category: 'Beach',
    departureMonth: 'May',
    lastUpdated: 'May 20, 2024',
    viewsCount: '9,840',
    wishlistCount: '890',
    conversionRate: '2.4%',
    cancellationRate: '1.8%',
    description: 'Immerse in tropical beauty, exotic temples, pristine beaches and world-class Balinese hospitality in Ubud and Seminyak.',
    inclusions: ['4 Nights Pool Villa Stay', 'Daily Breakfast & Floating Lunch', 'Uluwatu Sunset Tour & Kecak Dance', 'Private Airport Transfers'],
    exclusions: ['International Flights', 'Visa on Arrival', 'Personal Expenses'],
    itinerary: [],
    recentBookings: [],
    activities: [],
  },
  {
    id: 'PKG-3',
    packageId: 'PKG-2024-0003',
    title: 'Rajasthan Royal Tour',
    subtitle: 'Experience Royal Rajasthan',
    coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=600&auto=format&fit=crop',
    agencyName: 'Goa Getaways',
    agencyLogo: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=200&auto=format&fit=crop',
    destinationCountry: 'India',
    destinationRegion: 'Rajasthan',
    destinationFlag: '🇮🇳',
    durationDays: 7,
    durationNights: 6,
    durationText: '7D / 6N',
    currentPrice: '₹32,999',
    originalPrice: '₹45,000',
    discountPercent: '27% OFF',
    availableSeats: 5,
    totalSeats: 25,
    bookingsCount: 31,
    totalRevenue: '₹10,22,969',
    rating: 4.4,
    reviewCount: 96,
    status: 'Pending',
    approvalStatus: 'Pending',
    isFeatured: false,
    category: 'Cultural',
    departureMonth: 'May',
    lastUpdated: 'May 20, 2024',
    viewsCount: '7,450',
    wishlistCount: '620',
    conversionRate: '3.1%',
    cancellationRate: '2.0%',
    description: 'Journey through majestic forts, opulent palaces, desert camel safaris and royal heritage across Jaipur, Jodhpur, and Udaipur.',
    inclusions: ['6 Nights Heritage Hotel Stay', 'Daily Breakfast & Traditional Rajasthani Dinners', 'Fort Entry Tickets & Camel Safari'],
    exclusions: ['Flight / Train Tickets', 'Personal Tips'],
    itinerary: [],
    recentBookings: [],
    activities: [],
  },
  {
    id: 'PKG-4',
    packageId: 'PKG-2024-0004',
    title: 'Maldives Escape',
    subtitle: 'Luxury over the water',
    coverImage: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=600&auto=format&fit=crop',
    agencyName: 'Kerala Backwaters',
    agencyLogo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    destinationCountry: 'Maldives',
    destinationRegion: 'Malé',
    destinationFlag: '🇲🇻',
    durationDays: 4,
    durationNights: 3,
    durationText: '4D / 3N',
    currentPrice: '₹1,29,999',
    originalPrice: '₹1,80,000',
    discountPercent: '28% OFF',
    availableSeats: 0,
    totalSeats: 10,
    bookingsCount: 15,
    totalRevenue: '₹19,49,985',
    rating: 4.9,
    reviewCount: 204,
    status: 'Sold Out',
    approvalStatus: 'Approved',
    isFeatured: true,
    category: 'Honeymoon',
    departureMonth: 'May',
    lastUpdated: 'May 19, 2024',
    viewsCount: '18,900',
    wishlistCount: '2,400',
    conversionRate: '3.5%',
    cancellationRate: '0.5%',
    description: 'Ultra-luxury overwater bungalow villa stay with turquoise lagoons, coral reef snorkeling, spa treatments, and private speedboat transfers.',
    inclusions: ['3 Nights Overwater Pool Villa', 'All-Inclusive Dine-Around Meal Plan', 'Roundtrip Speedboat Transfers'],
    exclusions: ['International Flights', 'Scuba Diving Certification Courses'],
    itinerary: [],
    recentBookings: [],
    activities: [],
  },
  {
    id: 'PKG-5',
    packageId: 'PKG-2024-0005',
    title: 'Manali Adventure',
    subtitle: 'Thrilling adventures await',
    coverImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=600&auto=format&fit=crop',
    agencyName: 'Adventure India',
    agencyLogo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    destinationCountry: 'India',
    destinationRegion: 'Manali',
    destinationFlag: '🇮🇳',
    durationDays: 5,
    durationNights: 4,
    durationText: '5D / 4N',
    currentPrice: '₹24,999',
    originalPrice: '₹32,000',
    discountPercent: '22% OFF',
    availableSeats: 6,
    totalSeats: 20,
    bookingsCount: 17,
    totalRevenue: '₹4,24,983',
    rating: 4.3,
    reviewCount: 54,
    status: 'Active',
    approvalStatus: 'Approved',
    isFeatured: false,
    category: 'Adventure',
    departureMonth: 'May',
    lastUpdated: 'May 19, 2024',
    viewsCount: '6,100',
    wishlistCount: '510',
    conversionRate: '2.1%',
    cancellationRate: '3.0%',
    description: 'Experience Solang Valley paragliding, river rafting on Beas River, Atal Tunnel exploration and bonfire camping under Himalayan stars.',
    inclusions: ['4 Nights Valley-Facing Hotel', 'Breakfast & Dinner', 'Adventure Activity Passes', 'Private Cab for Sightseeing'],
    exclusions: ['Personal Gear', 'Heater Charges'],
    itinerary: [],
    recentBookings: [],
    activities: [],
  },
  {
    id: 'PKG-6',
    packageId: 'PKG-2024-0006',
    title: 'Dubai Luxury Tour',
    subtitle: 'Luxury shopping & more',
    coverImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=600&auto=format&fit=crop',
    agencyName: 'Holiday Hub Agency',
    agencyLogo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    destinationCountry: 'UAE',
    destinationRegion: 'Dubai',
    destinationFlag: '🇦🇪',
    durationDays: 6,
    durationNights: 5,
    durationText: '6D / 5N',
    currentPrice: '₹74,999',
    originalPrice: '₹95,000',
    discountPercent: '21% OFF',
    availableSeats: 9,
    totalSeats: 16,
    bookingsCount: 23,
    totalRevenue: '₹17,24,977',
    rating: 4.7,
    reviewCount: 88,
    status: 'Draft',
    approvalStatus: '—',
    isFeatured: false,
    category: 'Luxury',
    departureMonth: 'May',
    lastUpdated: 'May 18, 2024',
    viewsCount: '8,300',
    wishlistCount: '780',
    conversionRate: '2.6%',
    cancellationRate: '1.4%',
    description: 'Explore Burj Khalifa 124th floor, Desert Safari with BBQ dinner, Dubai Marina Luxury Yacht cruise, and Miracle Garden.',
    inclusions: ['5 Nights 5-Star Hotel Stay', 'Daily Breakfast Buffet', 'Desert Safari with Dune Bashing', 'Burj Khalifa Tickets'],
    exclusions: ['UAE Visa Fees', 'Tourism Dirham Fee'],
    itinerary: [],
    recentBookings: [],
    activities: [],
  },
  {
    id: 'PKG-7',
    packageId: 'PKG-2024-0007',
    title: 'Spiritual Kerala',
    subtitle: 'Backwaters & Temples',
    coverImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=600&auto=format&fit=crop',
    agencyName: 'Explore NorthEast',
    agencyLogo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    destinationCountry: 'India',
    destinationRegion: 'Kerala',
    destinationFlag: '🇮🇳',
    durationDays: 6,
    durationNights: 5,
    durationText: '6D / 5N',
    currentPrice: '₹28,999',
    originalPrice: '₹36,000',
    discountPercent: '19% OFF',
    availableSeats: 7,
    totalSeats: 22,
    bookingsCount: 12,
    totalRevenue: '₹3,47,988',
    rating: 4.2,
    reviewCount: 43,
    status: 'Pending',
    approvalStatus: 'Pending',
    isFeatured: false,
    category: 'Cultural',
    departureMonth: 'May',
    lastUpdated: 'May 18, 2024',
    viewsCount: '4,500',
    wishlistCount: '340',
    conversionRate: '1.9%',
    cancellationRate: '2.2%',
    description: 'Alleppey private premium houseboat cruise, Munnar tea plantation mist, Periyar wildlife sanctuary, and Ayurvedic rejuvenation therapies.',
    inclusions: ['1 Night Alleppey Deluxe Houseboat', '4 Nights Luxury Resort Stay in Munnar & Thekkady', 'All Houseboat Meals'],
    exclusions: ['Ayurvedic Spa Packages', 'Personal Purchases'],
    itinerary: [],
    recentBookings: [],
    activities: [],
  },
  {
    id: 'PKG-8',
    packageId: 'PKG-2024-0008',
    title: 'Bali Volcano Trek',
    subtitle: 'Mount Batur Experience',
    coverImage: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=600&auto=format&fit=crop',
    agencyName: 'Desert Dunes Travels',
    agencyLogo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop',
    destinationCountry: 'Indonesia',
    destinationRegion: 'Bali',
    destinationFlag: '🇮🇩',
    durationDays: 3,
    durationNights: 2,
    durationText: '3D / 2N',
    currentPrice: '₹18,999',
    originalPrice: '₹25,000',
    discountPercent: '24% OFF',
    availableSeats: 10,
    totalSeats: 15,
    bookingsCount: 9,
    totalRevenue: '₹1,70,991',
    rating: 4.1,
    reviewCount: 31,
    status: 'Active',
    approvalStatus: 'Approved',
    isFeatured: false,
    category: 'Trekking',
    departureMonth: 'May',
    lastUpdated: 'May 17, 2024',
    viewsCount: '3,800',
    wishlistCount: '290',
    conversionRate: '2.0%',
    cancellationRate: '2.5%',
    description: 'Early morning Mount Batur sunrise caldera trekking with volcanic steam breakfast, natural hot springs soak, and coffee plantation tasting.',
    inclusions: ['2 Nights Eco-Lodge Stay in Kintamani', 'Professional Mountain Trekking Guides', 'Hot Springs Passes'],
    exclusions: ['Flight Tickets', 'Tips'],
    itinerary: [],
    recentBookings: [],
    activities: [],
  },
  {
    id: 'PKG-9',
    packageId: 'PKG-2024-0009',
    title: 'Kashmir Great Lake',
    subtitle: 'Heaven on Earth',
    coverImage: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?q=80&w=600&auto=format&fit=crop',
    agencyName: 'Sikkim Serenity',
    agencyLogo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop',
    destinationCountry: 'India',
    destinationRegion: 'Kashmir',
    destinationFlag: '🇮🇳',
    durationDays: 6,
    durationNights: 5,
    durationText: '6D / 5N',
    currentPrice: '₹37,999',
    originalPrice: '₹50,000',
    discountPercent: '24% OFF',
    availableSeats: 4,
    totalSeats: 18,
    bookingsCount: 16,
    totalRevenue: '₹6,07,984',
    rating: 4.6,
    reviewCount: 67,
    status: 'Active',
    approvalStatus: 'Approved',
    isFeatured: true,
    category: 'Family',
    departureMonth: 'May',
    lastUpdated: 'May 17, 2024',
    viewsCount: '11,200',
    wishlistCount: '1,100',
    conversionRate: '2.9%',
    cancellationRate: '1.0%',
    description: 'Srinagar Dal Lake Shikara rides, Gulmarg Gondola Phase 2 snow cable car, Pahalgam Betaab Valley walks, and Sonamarg glaciers.',
    inclusions: ['1 Night Dal Lake Super Deluxe Houseboat', '4 Nights Luxury Hotel Stay', 'Daily Breakfast & Dinner', 'Gulmarg Gondola Passes'],
    exclusions: ['Airfare', 'Pony Rides'],
    itinerary: [],
    recentBookings: [],
    activities: [],
  },
  {
    id: 'PKG-10',
    packageId: 'PKG-2024-00010',
    title: 'Golden Triangle',
    subtitle: 'Delhi Agra Jaipur Tour',
    coverImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=600&auto=format&fit=crop',
    agencyName: 'Cityscape Holidays',
    agencyLogo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
    destinationCountry: 'India',
    destinationRegion: 'Delhi, Agra, Jaipur',
    destinationFlag: '🇮🇳',
    durationDays: 5,
    durationNights: 4,
    durationText: '5D / 4N',
    currentPrice: '₹19,999',
    originalPrice: '₹26,000',
    discountPercent: '23% OFF',
    availableSeats: 3,
    totalSeats: 20,
    bookingsCount: 11,
    totalRevenue: '₹2,19,989',
    rating: 4.0,
    reviewCount: 29,
    status: 'Draft',
    approvalStatus: '—',
    isFeatured: false,
    category: 'Cultural',
    departureMonth: 'May',
    lastUpdated: 'May 16, 2024',
    viewsCount: '5,100',
    wishlistCount: '410',
    conversionRate: '1.8%',
    cancellationRate: '2.8%',
    description: 'Classic exploration of India’s most iconic golden landmarks: Taj Mahal sunrise, Agra Fort, Qutub Minar, and Jaipur Amber Palace.',
    inclusions: ['4 Nights 4-Star Hotel Accommodation', 'Daily Breakfast', 'Air-Conditioned Private Vehicle for all Transfers'],
    exclusions: ['Monument Entrance Tickets', 'Camera Fees'],
    itinerary: [],
    recentBookings: [],
    activities: [],
  },
];

class AdminPackageManagementService {
  private packages: AdminPackageItem[];
  private kpiStats: PackageKPIStats;

  constructor() {
    this.packages = this.loadStorage(STORAGE_KEY_PACKAGES, initialAdminPackages);
    this.kpiStats = this.loadStorage(STORAGE_KEY_PACKAGE_STATS, initialPackageKPIStats);
  }

  private loadStorage<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return fallback;
  }

  private saveStorage(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {
      // ignore
    }
  }

  public async getKPIStats(): Promise<PackageKPIStats> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...this.kpiStats }), 100);
    });
  }

  public async getPackages(
    filters?: Partial<PackageFilters>,
    sort?: PackageSortConfig
  ): Promise<AdminPackageItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let result = [...this.packages];

        if (filters?.search) {
          const q = filters.search.toLowerCase().trim();
          result = result.filter(
            (p) =>
              p.title.toLowerCase().includes(q) ||
              p.packageId.toLowerCase().includes(q) ||
              p.destinationCountry.toLowerCase().includes(q) ||
              p.destinationRegion.toLowerCase().includes(q) ||
              p.agencyName.toLowerCase().includes(q)
          );
        }

        if (filters?.status && filters.status !== 'All Status') {
          result = result.filter((p) => p.status === filters.status);
        }

        if (filters?.destination && filters.destination !== 'All Destinations') {
          result = result.filter(
            (p) =>
              p.destinationCountry.toLowerCase() === filters.destination?.toLowerCase() ||
              p.destinationRegion.toLowerCase().includes(filters.destination?.toLowerCase() || '')
          );
        }

        if (filters?.agency && filters.agency !== 'All Agencies') {
          result = result.filter((p) => p.agencyName === filters.agency);
        }

        if (filters?.category && filters.category !== 'All Categories') {
          result = result.filter((p) => p.category === filters.category);
        }

        if (filters?.duration && filters.duration !== 'All Durations') {
          if (filters.duration === '1-3 Days') {
            result = result.filter((p) => p.durationDays <= 3);
          } else if (filters.duration === '4-6 Days') {
            result = result.filter((p) => p.durationDays >= 4 && p.durationDays <= 6);
          } else if (filters.duration === '7-10 Days') {
            result = result.filter((p) => p.durationDays >= 7 && p.durationDays <= 10);
          } else if (filters.duration === '10+ Days') {
            result = result.filter((p) => p.durationDays > 10);
          }
        }

        if (filters?.departureMonth && filters.departureMonth !== 'All Months') {
          result = result.filter((p) => p.departureMonth === filters.departureMonth);
        }

        if (filters?.rating && filters.rating !== 'All Ratings') {
          const minRating = parseFloat(filters.rating.replace(/[^0-9.]/g, '') || '0');
          result = result.filter((p) => p.rating >= minRating);
        }

        if (sort) {
          result.sort((a, b) => {
            let valA: any = a.title;
            let valB: any = b.title;

            if (sort.key === 'name') {
              valA = a.title;
              valB = b.title;
            } else if (sort.key === 'price') {
              valA = parseInt(a.currentPrice.replace(/[^0-9]/g, '') || '0', 10);
              valB = parseInt(b.currentPrice.replace(/[^0-9]/g, '') || '0', 10);
            } else if (sort.key === 'duration') {
              valA = a.durationDays;
              valB = b.durationDays;
            } else if (sort.key === 'bookings') {
              valA = a.bookingsCount;
              valB = b.bookingsCount;
            } else if (sort.key === 'rating') {
              valA = a.rating;
              valB = b.rating;
            } else if (sort.key === 'seats') {
              valA = a.availableSeats;
              valB = b.availableSeats;
            }

            if (valA < valB) return sort.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sort.direction === 'asc' ? 1 : -1;
            return 0;
          });
        }

        resolve(result);
      }, 100);
    });
  }

  public async getPackageById(id: string): Promise<AdminPackageItem | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const found = this.packages.find((p) => p.id === id || p.packageId === id);
        resolve(found || this.packages[0] || null);
      }, 100);
    });
  }

  public async createPackage(packageData: Partial<AdminPackageItem>): Promise<AdminPackageItem> {
    const newPackage: AdminPackageItem = {
      id: `PKG-${Date.now()}`,
      packageId: `PKG-2024-00${this.packages.length + 1}`,
      title: packageData.title || 'New Travel Package',
      subtitle: packageData.subtitle || 'Unforgettable holiday experience',
      coverImage: packageData.coverImage || 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=600&auto=format&fit=crop',
      agencyName: packageData.agencyName || 'Wanderlust Holidays',
      agencyLogo: packageData.agencyLogo || 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=200&auto=format&fit=crop',
      destinationCountry: packageData.destinationCountry || 'India',
      destinationRegion: packageData.destinationRegion || 'Goa',
      destinationFlag: '🇮🇳',
      durationDays: packageData.durationDays || 5,
      durationNights: packageData.durationNights || 4,
      durationText: `${packageData.durationDays || 5}D / ${packageData.durationNights || 4}N`,
      currentPrice: packageData.currentPrice || '₹29,999',
      originalPrice: packageData.originalPrice || '₹39,999',
      discountPercent: '25% OFF',
      availableSeats: packageData.availableSeats || 15,
      totalSeats: packageData.totalSeats || 20,
      bookingsCount: 0,
      totalRevenue: '₹0',
      rating: 5.0,
      reviewCount: 1,
      status: 'Active',
      approvalStatus: 'Approved',
      isFeatured: !!packageData.isFeatured,
      category: packageData.category || 'Adventure',
      departureMonth: packageData.departureMonth || 'June',
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      viewsCount: '150',
      wishlistCount: '25',
      conversionRate: '0%',
      cancellationRate: '0%',
      description: packageData.description || 'Experience stunning vistas, delightful stays and unforgettable cultural attractions.',
      inclusions: ['Hotel Stay', 'Daily Breakfast', 'Sightseeing Transfers'],
      exclusions: ['Flight Tickets', 'Personal Expenses'],
      itinerary: [],
      recentBookings: [],
      activities: [
        { id: `act-${Date.now()}`, adminName: 'Super Admin', action: 'Created Package', details: 'Package created directly by Super Admin', timestamp: 'Just now' }
      ],
    };

    this.packages = [newPackage, ...this.packages];
    this.kpiStats.totalPackages.count += 1;
    this.kpiStats.activePackages.count += 1;
    this.saveStorage(STORAGE_KEY_PACKAGES, this.packages);
    this.saveStorage(STORAGE_KEY_PACKAGE_STATS, this.kpiStats);

    return newPackage;
  }

  public async updatePackage(id: string, updates: Partial<AdminPackageItem>): Promise<AdminPackageItem | null> {
    const idx = this.packages.findIndex((p) => p.id === id || p.packageId === id);
    if (idx === -1) return null;

    this.packages[idx] = { ...this.packages[idx], ...updates, lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) };
    this.saveStorage(STORAGE_KEY_PACKAGES, this.packages);
    return this.packages[idx];
  }

  public async approvePackage(id: string): Promise<boolean> {
    const pkg = await this.updatePackage(id, {
      status: 'Active',
      approvalStatus: 'Approved',
    });
    return !!pkg;
  }

  public async featurePackage(id: string): Promise<boolean> {
    const found = this.packages.find((p) => p.id === id || p.packageId === id);
    if (!found) return false;
    const pkg = await this.updatePackage(id, {
      isFeatured: !found.isFeatured,
    });
    return !!pkg;
  }

  public async hidePackage(id: string): Promise<boolean> {
    const pkg = await this.updatePackage(id, {
      status: 'Hidden',
    });
    return !!pkg;
  }

  public async deletePackage(id: string): Promise<boolean> {
    const initialLen = this.packages.length;
    this.packages = this.packages.filter((p) => p.id !== id && p.packageId !== id);
    if (this.packages.length < initialLen) {
      this.kpiStats.totalPackages.count = Math.max(0, this.kpiStats.totalPackages.count - 1);
      this.saveStorage(STORAGE_KEY_PACKAGES, this.packages);
      this.saveStorage(STORAGE_KEY_PACKAGE_STATS, this.kpiStats);
      return true;
    }
    return false;
  }

  public async bulkApprove(ids: string[]): Promise<boolean> {
    this.packages = this.packages.map((p) =>
      ids.includes(p.id) ? { ...p, status: 'Active' as const, approvalStatus: 'Approved' as const } : p
    );
    this.saveStorage(STORAGE_KEY_PACKAGES, this.packages);
    return true;
  }

  public async bulkFeature(ids: string[]): Promise<boolean> {
    this.packages = this.packages.map((p) => (ids.includes(p.id) ? { ...p, isFeatured: true } : p));
    this.saveStorage(STORAGE_KEY_PACKAGES, this.packages);
    return true;
  }

  public async bulkHide(ids: string[]): Promise<boolean> {
    this.packages = this.packages.map((p) => (ids.includes(p.id) ? { ...p, status: 'Hidden' as const } : p));
    this.saveStorage(STORAGE_KEY_PACKAGES, this.packages);
    return true;
  }

  public async bulkDelete(ids: string[]): Promise<boolean> {
    this.packages = this.packages.filter((p) => !ids.includes(p.id));
    this.saveStorage(STORAGE_KEY_PACKAGES, this.packages);
    return true;
  }
}

export const adminPackageManagementService = new AdminPackageManagementService();
