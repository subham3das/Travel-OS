import {
  TravelerUser,
  UserKPIStats,
  UserFilters,
  UserSortConfig,
} from '../types/userManagement';

const STORAGE_KEY_USERS = 'apnatrip_admin_users_list';
const STORAGE_KEY_USER_STATS = 'apnatrip_admin_users_kpi_stats';

export const initialUserKPIStats: UserKPIStats = {
  totalUsers: { count: 12548, growth: '14.2%', isPositive: true },
  activeUsers: { count: 9842, growth: '12.8%', isPositive: true },
  newUsersToday: { count: 156, growth: '18.5%', isPositive: true },
  premiumMembers: { count: 2146, growth: '10.3%', isPositive: true },
  suspendedUsers: { count: 234, growth: '6.4%', isPositive: false },
  verifiedTravelers: { count: 8765, growth: '15.7%', isPositive: true },
};

export const initialTravelerUsers: TravelerUser[] = [
  {
    id: 'USR-1',
    userId: 'USR-250501',
    name: 'Arjun Mehta',
    email: 'arjun.mehta@email.com',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    gender: 'Male',
    dob: '15 Aug, 1995',
    nationality: 'Indian',
    passportStatus: 'Verified',
    emergencyContact: '+91 99887 66554',
    joinDate: 'May 1, 2024',
    joinTime: '10:30 AM',
    status: 'Active',
    verificationStatus: 'Verified',
    membership: 'Gold',
    membershipSince: 'May 1, 2024',
    membershipValidTill: 'May 1, 2025',
    tripsCompleted: 12,
    totalBookings: 18,
    countriesVisited: 7,
    reviewsGiven: 24,
    averageRating: 4.6,
    cancellationRate: '8%',
    totalSpend: '₹48,750',
    walletBalance: '₹3,250',
    pendingRefunds: '₹1,200',
    lastTransactionDate: 'May 20, 2024',
    kycVerification: 'Verified',
    emailVerification: 'Verified',
    phoneVerification: 'Verified',
    passportVerification: 'Verified',
    bookings: [
      { id: 'b1', bookingId: 'BK-2024-8901', packageName: 'Bali Romantic Honeymoon Getaway', agencyName: 'Wanderlust Holidays', bookingDate: 'May 18, 2024', travelDate: 'Jun 10, 2024', amount: '₹24,500', status: 'Confirmed' },
      { id: 'b2', bookingId: 'BK-2024-7652', packageName: 'Goa Coastal Serenity Beach Tour', agencyName: 'Goa Getaways', bookingDate: 'Apr 12, 2024', travelDate: 'Apr 25, 2024', amount: '₹14,250', status: 'Completed' },
      { id: 'b3', bookingId: 'BK-2024-6541', packageName: 'Manali Snow Peak Adventure', agencyName: 'Adventure India', bookingDate: 'Jan 10, 2024', travelDate: 'Feb 02, 2024', amount: '₹10,000', status: 'Completed' },
    ],
    trips: [
      { id: 't1', tripId: 'TR-1081', destination: 'Bali, Indonesia', agencyName: 'Wanderlust Holidays', startDate: 'Jun 10, 2024', endDate: 'Jun 17, 2024', status: 'Upcoming', amount: '₹24,500', travelersCount: 2 },
      { id: 't2', tripId: 'TR-0982', destination: 'Goa, India', agencyName: 'Goa Getaways', startDate: 'Apr 25, 2024', endDate: 'Apr 30, 2024', status: 'Completed', amount: '₹14,250', travelersCount: 3 },
      { id: 't3', tripId: 'TR-0871', destination: 'Manali, India', agencyName: 'Adventure India', startDate: 'Feb 02, 2024', endDate: 'Feb 08, 2024', status: 'Completed', amount: '₹10,000', travelersCount: 2 },
    ],
    payments: [
      { id: 'p1', invoiceNumber: 'INV-2024-9981', amount: '₹24,500', paymentMethod: 'UPI', refundStatus: 'None', paymentStatus: 'Success', date: 'May 18, 2024' },
      { id: 'p2', invoiceNumber: 'INV-2024-8842', amount: '₹14,250', paymentMethod: 'Credit Card', refundStatus: 'None', paymentStatus: 'Success', date: 'Apr 12, 2024' },
      { id: 'p3', invoiceNumber: 'INV-2024-7711', amount: '₹1,200', paymentMethod: 'Credit Card', refundStatus: 'Pending', paymentStatus: 'Success', date: 'Mar 15, 2024' },
    ],
    activities: [
      { id: 'a1', title: 'Package Booked', description: 'Booked Bali Romantic Honeymoon Getaway', type: 'booking', timestamp: 'May 18, 2024 • 04:30 PM' },
      { id: 'a2', title: 'Reviewed Package', description: 'Gave 5 stars to Goa Coastal Serenity', type: 'review', timestamp: 'May 02, 2024 • 11:15 AM' },
      { id: 'a3', title: 'Logged in from Mobile', description: 'iPhone 15 Pro • IP: 103.21.14.88', type: 'login', timestamp: 'May 01, 2024 • 10:30 AM' },
      { id: 'a4', title: 'KYC Approved', description: 'Aadhaar & Passport verification completed', type: 'notification', timestamp: 'May 01, 2024 • 10:45 AM' },
    ],
  },
  {
    id: 'USR-2',
    userId: 'USR-250502',
    name: 'Diya Sharma',
    email: 'diya.sharma@email.com',
    phone: '+91 87654 32109',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    gender: 'Female',
    dob: '22 Sep, 1998',
    nationality: 'Indian',
    passportStatus: 'Verified',
    emergencyContact: '+91 88776 65544',
    joinDate: 'May 2, 2024',
    joinTime: '11:15 AM',
    status: 'Active',
    verificationStatus: 'Verified',
    membership: 'Silver',
    membershipSince: 'May 2, 2024',
    membershipValidTill: 'May 2, 2025',
    tripsCompleted: 8,
    totalBookings: 12,
    countriesVisited: 4,
    reviewsGiven: 16,
    averageRating: 4.8,
    cancellationRate: '4%',
    totalSpend: '₹32,450',
    walletBalance: '₹1,500',
    pendingRefunds: '₹0',
    lastTransactionDate: 'May 14, 2024',
    kycVerification: 'Verified',
    emailVerification: 'Verified',
    phoneVerification: 'Verified',
    passportVerification: 'Verified',
    bookings: [],
    trips: [],
    payments: [],
    activities: [],
  },
  {
    id: 'USR-3',
    userId: 'USR-250503',
    name: 'Rohit Verma',
    email: 'rohit.verma@email.com',
    phone: '+91 98712 34567',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    gender: 'Male',
    dob: '10 Jan, 1992',
    nationality: 'Indian',
    passportStatus: 'Verified',
    emergencyContact: '+91 91234 11223',
    joinDate: 'May 3, 2024',
    joinTime: '02:45 PM',
    status: 'Active',
    verificationStatus: 'Verified',
    membership: 'Platinum',
    membershipSince: 'May 3, 2024',
    membershipValidTill: 'May 3, 2025',
    tripsCompleted: 16,
    totalBookings: 24,
    countriesVisited: 11,
    reviewsGiven: 32,
    averageRating: 4.9,
    cancellationRate: '2%',
    totalSpend: '₹67,890',
    walletBalance: '₹8,400',
    pendingRefunds: '₹0',
    lastTransactionDate: 'May 19, 2024',
    kycVerification: 'Verified',
    emailVerification: 'Verified',
    phoneVerification: 'Verified',
    passportVerification: 'Verified',
    bookings: [],
    trips: [],
    payments: [],
    activities: [],
  },
  {
    id: 'USR-4',
    userId: 'USR-250504',
    name: 'Neha Kapoor',
    email: 'neha.kapoor@email.com',
    phone: '+91 91234 56789',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    gender: 'Female',
    dob: '05 Jun, 2001',
    nationality: 'Indian',
    passportStatus: 'Pending',
    emergencyContact: '+91 94567 89012',
    joinDate: 'May 3, 2024',
    joinTime: '04:10 PM',
    status: 'Active',
    verificationStatus: 'Pending',
    membership: 'Free',
    membershipSince: 'May 3, 2024',
    membershipValidTill: 'Lifetime',
    tripsCompleted: 5,
    totalBookings: 7,
    countriesVisited: 2,
    reviewsGiven: 6,
    averageRating: 4.3,
    cancellationRate: '12%',
    totalSpend: '₹15,230',
    walletBalance: '₹450',
    pendingRefunds: '₹0',
    lastTransactionDate: 'May 10, 2024',
    kycVerification: 'Pending',
    emailVerification: 'Verified',
    phoneVerification: 'Verified',
    passportVerification: 'Pending',
    bookings: [],
    trips: [],
    payments: [],
    activities: [],
  },
  {
    id: 'USR-5',
    userId: 'USR-250505',
    name: 'Karan Singh',
    email: 'karan.singh@email.com',
    phone: '+91 99887 66554',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    city: 'Chandigarh',
    state: 'Punjab',
    country: 'India',
    gender: 'Male',
    dob: '18 Nov, 1994',
    nationality: 'Indian',
    passportStatus: 'Verified',
    emergencyContact: '+91 97766 55443',
    joinDate: 'May 4, 2024',
    joinTime: '09:20 AM',
    status: 'Active',
    verificationStatus: 'Verified',
    membership: 'Silver',
    membershipSince: 'May 4, 2024',
    membershipValidTill: 'May 4, 2025',
    tripsCompleted: 9,
    totalBookings: 14,
    countriesVisited: 5,
    reviewsGiven: 14,
    averageRating: 4.7,
    cancellationRate: '5%',
    totalSpend: '₹28,600',
    walletBalance: '₹2,100',
    pendingRefunds: '₹0',
    lastTransactionDate: 'May 16, 2024',
    kycVerification: 'Verified',
    emailVerification: 'Verified',
    phoneVerification: 'Verified',
    passportVerification: 'Verified',
    bookings: [],
    trips: [],
    payments: [],
    activities: [],
  },
  {
    id: 'USR-6',
    userId: 'USR-250506',
    name: 'Priya Nair',
    email: 'priya.nair@email.com',
    phone: '+91 98678 54321',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    city: 'Kochi',
    state: 'Kerala',
    country: 'India',
    gender: 'Female',
    dob: '12 Apr, 1996',
    nationality: 'Indian',
    passportStatus: 'Verified',
    emergencyContact: '+91 94455 66778',
    joinDate: 'May 4, 2024',
    joinTime: '01:05 PM',
    status: 'Active',
    verificationStatus: 'Verified',
    membership: 'Gold',
    membershipSince: 'May 4, 2024',
    membershipValidTill: 'May 4, 2025',
    tripsCompleted: 7,
    totalBookings: 9,
    countriesVisited: 4,
    reviewsGiven: 12,
    averageRating: 4.9,
    cancellationRate: '0%',
    totalSpend: '₹21,450',
    walletBalance: '₹1,850',
    pendingRefunds: '₹0',
    lastTransactionDate: 'May 15, 2024',
    kycVerification: 'Verified',
    emailVerification: 'Verified',
    phoneVerification: 'Verified',
    passportVerification: 'Verified',
    bookings: [],
    trips: [],
    payments: [],
    activities: [],
  },
  {
    id: 'USR-7',
    userId: 'USR-250507',
    name: 'Vikram Joshi',
    email: 'vikram.joshi@email.com',
    phone: '+91 91122 33445',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop',
    city: 'Ahmedabad',
    state: 'Gujarat',
    country: 'India',
    gender: 'Male',
    dob: '30 Mar, 1999',
    nationality: 'Indian',
    passportStatus: 'Pending',
    emergencyContact: '+91 92233 44556',
    joinDate: 'May 5, 2024',
    joinTime: '10:00 AM',
    status: 'Inactive',
    verificationStatus: 'Pending',
    membership: 'Free',
    membershipSince: 'May 5, 2024',
    membershipValidTill: 'Lifetime',
    tripsCompleted: 3,
    totalBookings: 4,
    countriesVisited: 1,
    reviewsGiven: 2,
    averageRating: 4.1,
    cancellationRate: '15%',
    totalSpend: '₹8,950',
    walletBalance: '₹0',
    pendingRefunds: '₹0',
    lastTransactionDate: 'May 06, 2024',
    kycVerification: 'Pending',
    emailVerification: 'Verified',
    phoneVerification: 'Pending',
    passportVerification: 'Pending',
    bookings: [],
    trips: [],
    payments: [],
    activities: [],
  },
  {
    id: 'USR-8',
    userId: 'USR-250508',
    name: 'Ananya Reddy',
    email: 'ananya.reddy@email.com',
    phone: '+91 93344 55667',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    gender: 'Female',
    dob: '25 Dec, 1993',
    nationality: 'Indian',
    passportStatus: 'Verified',
    emergencyContact: '+91 95566 77889',
    joinDate: 'May 6, 2024',
    joinTime: '03:30 PM',
    status: 'Suspended',
    verificationStatus: 'Verified',
    membership: 'Gold',
    membershipSince: 'May 6, 2024',
    membershipValidTill: 'May 6, 2025',
    tripsCompleted: 11,
    totalBookings: 17,
    countriesVisited: 6,
    reviewsGiven: 18,
    averageRating: 4.5,
    cancellationRate: '18%',
    totalSpend: '₹39,870',
    walletBalance: '₹0',
    pendingRefunds: '₹3,400',
    lastTransactionDate: 'May 12, 2024',
    kycVerification: 'Verified',
    emailVerification: 'Verified',
    phoneVerification: 'Verified',
    passportVerification: 'Verified',
    bookings: [],
    trips: [],
    payments: [],
    activities: [],
  },
  {
    id: 'USR-9',
    userId: 'USR-250509',
    name: 'Siddharth Rao',
    email: 'siddharth.rao@email.com',
    phone: '+91 95566 77889',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop',
    city: 'Kolkata',
    state: 'West Bengal',
    country: 'India',
    gender: 'Male',
    dob: '14 Jul, 1997',
    nationality: 'Indian',
    passportStatus: 'Verified',
    emergencyContact: '+91 96677 88990',
    joinDate: 'May 7, 2024',
    joinTime: '08:45 AM',
    status: 'Active',
    verificationStatus: 'Verified',
    membership: 'Silver',
    membershipSince: 'May 7, 2024',
    membershipValidTill: 'May 7, 2025',
    tripsCompleted: 6,
    totalBookings: 8,
    countriesVisited: 3,
    reviewsGiven: 8,
    averageRating: 4.4,
    cancellationRate: '6%',
    totalSpend: '₹19,330',
    walletBalance: '₹1,200',
    pendingRefunds: '₹0',
    lastTransactionDate: 'May 17, 2024',
    kycVerification: 'Verified',
    emailVerification: 'Verified',
    phoneVerification: 'Verified',
    passportVerification: 'Verified',
    bookings: [],
    trips: [],
    payments: [],
    activities: [],
  },
  {
    id: 'USR-10',
    userId: 'USR-250510',
    name: 'Meera Iyer',
    email: 'meera.iyer@email.com',
    phone: '+91 97788 99011',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    gender: 'Female',
    dob: '08 Aug, 1991',
    nationality: 'Indian',
    passportStatus: 'Verified',
    emergencyContact: '+91 98899 00112',
    joinDate: 'May 7, 2024',
    joinTime: '05:20 PM',
    status: 'Active',
    verificationStatus: 'Verified',
    membership: 'Platinum',
    membershipSince: 'May 7, 2024',
    membershipValidTill: 'May 7, 2025',
    tripsCompleted: 10,
    totalBookings: 15,
    countriesVisited: 8,
    reviewsGiven: 20,
    averageRating: 4.9,
    cancellationRate: '3%',
    totalSpend: '₹31,120',
    walletBalance: '₹4,600',
    pendingRefunds: '₹0',
    lastTransactionDate: 'May 18, 2024',
    kycVerification: 'Verified',
    emailVerification: 'Verified',
    phoneVerification: 'Verified',
    passportVerification: 'Verified',
    bookings: [],
    trips: [],
    payments: [],
    activities: [],
  },
];

class AdminUserManagementService {
  private users: TravelerUser[];
  private kpiStats: UserKPIStats;

  constructor() {
    this.users = this.loadStorage(STORAGE_KEY_USERS, initialTravelerUsers);
    this.kpiStats = this.loadStorage(STORAGE_KEY_USER_STATS, initialUserKPIStats);
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

  public async getKPIStats(): Promise<UserKPIStats> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...this.kpiStats }), 100);
    });
  }

  public async getUsers(
    filters?: Partial<UserFilters>,
    sort?: UserSortConfig
  ): Promise<TravelerUser[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let result = [...this.users];

        if (filters?.search) {
          const q = filters.search.toLowerCase().trim();
          result = result.filter(
            (u) =>
              u.name.toLowerCase().includes(q) ||
              u.email.toLowerCase().includes(q) ||
              u.phone.toLowerCase().includes(q) ||
              u.userId.toLowerCase().includes(q) ||
              u.city.toLowerCase().includes(q)
          );
        }

        if (filters?.userStatus && filters.userStatus !== 'All Status') {
          result = result.filter((u) => u.status === filters.userStatus);
        }

        if (filters?.verification && filters.verification !== 'All Verification') {
          result = result.filter((u) => u.verificationStatus === filters.verification);
        }

        if (filters?.membership && filters.membership !== 'All Membership') {
          result = result.filter((u) => u.membership === filters.membership);
        }

        if (filters?.country && filters.country !== 'All Countries') {
          result = result.filter((u) => u.country === filters.country);
        }

        if (filters?.state && filters.state !== 'All States') {
          result = result.filter((u) => u.state === filters.state);
        }

        if (filters?.city && filters.city !== 'All Cities') {
          result = result.filter((u) => u.city === filters.city);
        }

        if (sort) {
          result.sort((a, b) => {
            let valA: any = a[sort.key as keyof TravelerUser];
            let valB: any = b[sort.key as keyof TravelerUser];

            if (sort.key === 'totalSpend') {
              valA = parseInt(a.totalSpend.replace(/[^0-9]/g, '') || '0', 10);
              valB = parseInt(b.totalSpend.replace(/[^0-9]/g, '') || '0', 10);
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

  public async getUserById(id: string): Promise<TravelerUser | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const found = this.users.find((u) => u.id === id || u.userId === id);
        resolve(found || this.users[0] || null);
      }, 100);
    });
  }

  public async addUser(userData: Partial<TravelerUser>): Promise<TravelerUser> {
    const newUser: TravelerUser = {
      id: `USR-${Date.now()}`,
      userId: `USR-${Math.floor(250500 + this.users.length + 1)}`,
      name: userData.name || 'New Traveler',
      email: userData.email || 'traveler@example.com',
      phone: userData.phone || '+91 90000 00000',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      city: userData.city || 'Mumbai',
      state: userData.state || 'Maharashtra',
      country: userData.country || 'India',
      gender: userData.gender || 'Male',
      dob: userData.dob || '01 Jan, 1998',
      nationality: userData.nationality || 'Indian',
      passportStatus: userData.passportStatus || 'Verified',
      emergencyContact: userData.emergencyContact || '+91 99999 99999',
      joinDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      joinTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: 'Active',
      verificationStatus: userData.verificationStatus || 'Verified',
      membership: userData.membership || 'Free',
      membershipSince: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      membershipValidTill: 'May 1, 2026',
      tripsCompleted: 0,
      totalBookings: 0,
      countriesVisited: 1,
      reviewsGiven: 0,
      averageRating: 5.0,
      cancellationRate: '0%',
      totalSpend: '₹0',
      walletBalance: '₹0',
      pendingRefunds: '₹0',
      lastTransactionDate: '—',
      kycVerification: 'Verified',
      emailVerification: 'Verified',
      phoneVerification: 'Verified',
      passportVerification: 'Verified',
      bookings: [],
      trips: [],
      payments: [],
      activities: [
        { id: `a-${Date.now()}`, title: 'Account Created', description: 'User account registered by Super Admin', type: 'login', timestamp: 'Just now' }
      ],
    };

    this.users = [newUser, ...this.users];
    this.kpiStats.totalUsers.count += 1;
    this.kpiStats.newUsersToday.count += 1;
    this.kpiStats.activeUsers.count += 1;
    this.saveStorage(STORAGE_KEY_USERS, this.users);
    this.saveStorage(STORAGE_KEY_USER_STATS, this.kpiStats);

    return newUser;
  }

  public async updateUser(id: string, updates: Partial<TravelerUser>): Promise<TravelerUser | null> {
    const idx = this.users.findIndex((u) => u.id === id || u.userId === id);
    if (idx === -1) return null;

    this.users[idx] = { ...this.users[idx], ...updates };
    this.saveStorage(STORAGE_KEY_USERS, this.users);
    return this.users[idx];
  }

  public async verifyUser(id: string): Promise<boolean> {
    const user = await this.updateUser(id, {
      verificationStatus: 'Verified',
      kycVerification: 'Verified',
      passportVerification: 'Verified',
    });
    return !!user;
  }

  public async suspendUser(id: string): Promise<boolean> {
    const user = await this.updateUser(id, { status: 'Suspended' });
    return !!user;
  }

  public async activateUser(id: string): Promise<boolean> {
    const user = await this.updateUser(id, { status: 'Active' });
    return !!user;
  }

  public async deleteUser(id: string): Promise<boolean> {
    const initialLen = this.users.length;
    this.users = this.users.filter((u) => u.id !== id && u.userId !== id);
    if (this.users.length < initialLen) {
      this.kpiStats.totalUsers.count = Math.max(0, this.kpiStats.totalUsers.count - 1);
      this.saveStorage(STORAGE_KEY_USERS, this.users);
      this.saveStorage(STORAGE_KEY_USER_STATS, this.kpiStats);
      return true;
    }
    return false;
  }

  public async bulkVerify(ids: string[]): Promise<boolean> {
    this.users = this.users.map((u) => (ids.includes(u.id) ? { ...u, verificationStatus: 'Verified' as const } : u));
    this.saveStorage(STORAGE_KEY_USERS, this.users);
    return true;
  }

  public async bulkSuspend(ids: string[]): Promise<boolean> {
    this.users = this.users.map((u) => (ids.includes(u.id) ? { ...u, status: 'Suspended' as const } : u));
    this.saveStorage(STORAGE_KEY_USERS, this.users);
    return true;
  }

  public async bulkActivate(ids: string[]): Promise<boolean> {
    this.users = this.users.map((u) => (ids.includes(u.id) ? { ...u, status: 'Active' as const } : u));
    this.saveStorage(STORAGE_KEY_USERS, this.users);
    return true;
  }

  public async bulkDelete(ids: string[]): Promise<boolean> {
    this.users = this.users.filter((u) => !ids.includes(u.id));
    this.saveStorage(STORAGE_KEY_USERS, this.users);
    return true;
  }
}

export const adminUserManagementService = new AdminUserManagementService();
