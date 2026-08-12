import {
  Agency,
  AgencySummaryStats,
  AgencyFilters,
  AgencyPerformance,
  AgencyVerification,
  AgencyActivity,
} from '../types/agency';

export const mockAgencySummaryStats: AgencySummaryStats = {
  totalAgencies: {
    id: 'total',
    title: 'Total Agencies',
    count: 1248,
    growth: '12.5%',
    isPositive: true,
    comparisonText: 'from last 30 days',
    iconType: 'total',
    bgColor: 'bg-purple-50',
    iconColor: 'text-[#6356E5]',
  },
  activeAgencies: {
    id: 'active',
    title: 'Active Agencies',
    count: 982,
    growth: '8.3%',
    isPositive: true,
    comparisonText: 'from last 30 days',
    iconType: 'active',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  pendingApproval: {
    id: 'pending',
    title: 'Pending Approval',
    count: 128,
    growth: '5.7%',
    isPositive: true,
    comparisonText: 'from last 30 days',
    iconType: 'pending',
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  suspendedAgencies: {
    id: 'suspended',
    title: 'Suspended Agencies',
    count: 56,
    growth: '3.2%',
    isPositive: false,
    comparisonText: 'from last 30 days',
    iconType: 'suspended',
    bgColor: 'bg-rose-50',
    iconColor: 'text-rose-500',
  },
  rejectedAgencies: {
    id: 'rejected',
    title: 'Rejected Agencies',
    count: 32,
    growth: '1.1%',
    isPositive: false,
    comparisonText: 'from last 30 days',
    iconType: 'rejected',
    bgColor: 'bg-rose-50',
    iconColor: 'text-rose-600',
  },
  verifiedAgencies: {
    id: 'verified',
    title: 'Verified Agencies',
    count: 876,
    growth: '10.2%',
    isPositive: true,
    comparisonText: 'from last 30 days',
    iconType: 'verified',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
};

export const mockAgenciesList: Agency[] = [
  {
    id: 'AG-101',
    name: 'Wanderlust Holidays',
    logo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=200&auto=format&fit=crop',
    gstNumber: '27AABCU9603R1ZV',
    owner: {
      name: 'Aman Sharma',
      email: 'aman@wanderlust.com',
      phone: '+91 98765 43210',
    },
    email: 'aman@wanderlust.com',
    phone: '+91 98765 43210',
    website: 'www.wanderlustholidays.com',
    businessType: 'Tour Operator',
    city: 'Mumbai',
    state: 'Maharashtra',
    rating: 4.8,
    reviewCount: 128,
    packages: 45,
    bookings: 1245,
    revenue: '₹48,75,230',
    verification: 'Verified',
    status: 'Active',
    joinDate: 'May 21, 2024',
    performance: {
      bookings: 1245,
      bookingsGrowth: '12.4%',
      trips: 98,
      tripsGrowth: '6.1%',
      revenue: '₹48,75,230',
      revenueGrowth: '8.2%',
      reviews: 128,
      reviewsGrowth: '9.3%',
    },
    verificationDetails: {
      kyc: 'Verified',
      gst: 'Verified',
      businessLicense: 'Verified',
      bankVerification: 'Under Review',
    },
  },
  {
    id: 'AG-102',
    name: 'Himalayan Treks',
    logo: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=200&auto=format&fit=crop',
    gstNumber: '01AAACH1Z34B1ZK',
    owner: {
      name: 'Neha Rawat',
      email: 'neha@himalayantreks.com',
      phone: '+91 98765 11122',
    },
    email: 'neha@himalayantreks.com',
    phone: '+91 98765 11122',
    website: 'www.himalayantreks.com',
    businessType: 'Adventure',
    city: 'Dehradun',
    state: 'Uttarakhand',
    rating: 4.6,
    reviewCount: 98,
    packages: 32,
    bookings: 856,
    revenue: '₹32,40,880',
    verification: 'Under Review',
    status: 'Pending',
    joinDate: 'Jun 10, 2024',
    performance: {
      bookings: 856,
      bookingsGrowth: '9.1%',
      trips: 64,
      tripsGrowth: '4.5%',
      revenue: '₹32,40,880',
      revenueGrowth: '6.7%',
      reviews: 98,
      reviewsGrowth: '7.8%',
    },
    verificationDetails: {
      kyc: 'Verified',
      gst: 'Under Review',
      businessLicense: 'Verified',
      bankVerification: 'Pending',
    },
  },
  {
    id: 'AG-103',
    name: 'Goa Getaways',
    logo: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=200&auto=format&fit=crop',
    gstNumber: '30AABCG7890C1Z3',
    owner: {
      name: 'Rohit Verma',
      email: 'info@goagetaways.com',
      phone: '+91 98765 22233',
    },
    email: 'info@goagetaways.com',
    phone: '+91 98765 22233',
    website: 'www.goagetaways.com',
    businessType: 'Tour Operator',
    city: 'Goa',
    state: 'Goa',
    rating: 4.5,
    reviewCount: 76,
    packages: 28,
    bookings: 678,
    revenue: '₹25,60,345',
    verification: 'Verified',
    status: 'Active',
    joinDate: 'Apr 15, 2024',
  },
  {
    id: 'AG-104',
    name: 'Kerala Backwaters Tours',
    logo: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=200&auto=format&fit=crop',
    gstNumber: '32AAACK1234D1Z5',
    owner: {
      name: 'Sanjay Nair',
      email: 'sanjay@keralabackwaters.com',
      phone: '+91 98765 33344',
    },
    email: 'sanjay@keralabackwaters.com',
    phone: '+91 98765 33344',
    website: 'www.keralabackwaters.com',
    businessType: 'Tour Operator',
    city: 'Kochi',
    state: 'Kerala',
    rating: 4.7,
    reviewCount: 112,
    packages: 38,
    bookings: 932,
    revenue: '₹36,80,450',
    verification: 'Verified',
    status: 'Active',
    joinDate: 'Mar 20, 2024',
  },
  {
    id: 'AG-105',
    name: 'Adventure India',
    logo: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=200&auto=format&fit=crop',
    gstNumber: '07AACR4567E1Z1',
    owner: {
      name: 'Vikram Singh',
      email: 'vikram@adventureindia.com',
      phone: '+91 98765 44455',
    },
    email: 'vikram@adventureindia.com',
    phone: '+91 98765 44455',
    website: 'www.adventureindia.com',
    businessType: 'Adventure',
    city: 'Manali',
    state: 'Himachal Pradesh',
    rating: 4.3,
    reviewCount: 54,
    packages: 24,
    bookings: 543,
    revenue: '₹18,75,230',
    verification: 'Documents Missing',
    status: 'Pending',
    joinDate: 'Jul 05, 2024',
  },
  {
    id: 'AG-106',
    name: 'Holiday Hub Agency',
    logo: 'https://images.unsplash.com/photo-1476514525535-ce74f45814ce?q=80&w=200&auto=format&fit=crop',
    gstNumber: '29AABCH6789F1Z2',
    owner: {
      name: 'Priya Mehta',
      email: 'priya@holidayhub.com',
      phone: '+91 98765 55566',
    },
    email: 'priya@holidayhub.com',
    phone: '+91 98765 55566',
    website: 'www.holidayhub.com',
    businessType: 'Travel Agency',
    city: 'Bangalore',
    state: 'Karnataka',
    rating: 4.2,
    reviewCount: 48,
    packages: 20,
    bookings: 412,
    revenue: '₹15,40,120',
    verification: 'Verified',
    status: 'Suspended',
    joinDate: 'Feb 11, 2024',
  },
  {
    id: 'AG-107',
    name: 'Explore NorthEast',
    logo: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=200&auto=format&fit=crop',
    gstNumber: '18AABCE3456G1Z9',
    owner: {
      name: 'Tenzing Lepcha',
      email: 'tenzing@explorenortheast.com',
      phone: '+91 98765 66677',
    },
    email: 'tenzing@explorenortheast.com',
    phone: '+91 98765 66677',
    website: 'www.explorenortheast.com',
    businessType: 'Tour Operator',
    city: 'Guwahati',
    state: 'Assam',
    rating: 4.9,
    reviewCount: 165,
    packages: 55,
    bookings: 1654,
    revenue: '₹61,20,980',
    verification: 'Verified',
    status: 'Active',
    joinDate: 'Jan 18, 2024',
  },
  {
    id: 'AG-108',
    name: 'Desert Dunes Travels',
    logo: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=200&auto=format&fit=crop',
    gstNumber: '08AABCD7891H1Z7',
    owner: {
      name: 'Mohit Choudhary',
      email: 'mohit@desertdunes.com',
      phone: '+91 98765 77788',
    },
    email: 'mohit@desertdunes.com',
    phone: '+91 98765 77788',
    website: 'www.desertdunes.com',
    businessType: 'Tour Operator',
    city: 'Jaisalmer',
    state: 'Rajasthan',
    rating: 4.1,
    reviewCount: 36,
    packages: 18,
    bookings: 298,
    revenue: '₹9,85,450',
    verification: 'Under Review',
    status: 'Pending',
    joinDate: 'Jul 22, 2024',
  },
  {
    id: 'AG-109',
    name: 'Sikkim Serenity',
    logo: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=200&auto=format&fit=crop',
    gstNumber: '11AABCS1234I1Z8',
    owner: {
      name: 'Pema Bhutia',
      email: 'pema@sikkimserenity.com',
      phone: '+91 98765 88899',
    },
    email: 'pema@sikkimserenity.com',
    phone: '+91 98765 88899',
    website: 'www.sikkimserenity.com',
    businessType: 'Tour Operator',
    city: 'Gangtok',
    state: 'Sikkim',
    rating: 4.6,
    reviewCount: 63,
    packages: 26,
    bookings: 587,
    revenue: '₹20,30,760',
    verification: 'Verified',
    status: 'Active',
    joinDate: 'May 30, 2024',
  },
  {
    id: 'AG-110',
    name: 'Cityscape Holidays',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=200&auto=format&fit=crop',
    gstNumber: '24AABCC5678J1Z6',
    owner: {
      name: 'Karan Malhotra',
      email: 'karan@cityscapeholidays.com',
      phone: '+91 98765 99900',
    },
    email: 'karan@cityscapeholidays.com',
    phone: '+91 98765 99900',
    website: 'www.cityscapeholidays.com',
    businessType: 'Travel Agency',
    city: 'Delhi',
    state: 'Delhi',
    rating: 3.8,
    reviewCount: 29,
    packages: 15,
    bookings: 224,
    revenue: '₹7,25,310',
    verification: 'Documents Missing',
    status: 'Rejected',
    joinDate: 'Jun 28, 2024',
  },
];

export const adminAgencyService = {
  async getSummaryStats(): Promise<AgencySummaryStats> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockAgencySummaryStats), 100);
    });
  },

  async getAgencies(filters?: Partial<AgencyFilters>): Promise<Agency[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let result = [...mockAgenciesList];
        if (filters?.search) {
          const q = filters.search.toLowerCase();
          result = result.filter(
            (a) =>
              a.name.toLowerCase().includes(q) ||
              a.owner.name.toLowerCase().includes(q) ||
              a.email.toLowerCase().includes(q) ||
              a.gstNumber.toLowerCase().includes(q) ||
              a.city.toLowerCase().includes(q)
          );
        }
        if (filters?.status && filters.status !== 'All Status') {
          result = result.filter((a) => a.status === filters.status);
        }
        if (filters?.verification && filters.verification !== 'All Verification') {
          result = result.filter((a) => a.verification === filters.verification);
        }
        if (filters?.businessType && filters.businessType !== 'All Types') {
          result = result.filter((a) => a.businessType === filters.businessType);
        }
        resolve(result);
      }, 100);
    });
  },

  async getAgencyById(id: string): Promise<Agency | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const found = mockAgenciesList.find((a) => a.id === id || a.name.toLowerCase() === id.toLowerCase());
        resolve(found || mockAgenciesList[0]);
      }, 100);
    });
  },

  async verifyAgency(id: string): Promise<{ success: boolean }> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 150);
    });
  },

  async activateAgency(id: string): Promise<{ success: boolean }> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 150);
    });
  },

  async suspendAgency(id: string): Promise<{ success: boolean }> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 150);
    });
  },

  async deleteAgency(id: string): Promise<{ success: boolean }> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 150);
    });
  },
};
