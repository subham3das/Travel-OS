export interface Trip {
  id: string;
  bookingId: string;
  destinationId: string;
  packageId: string;
  agencyId: string;
  title: string;
  locations: string;
  coverImage: string;
  status: 'Upcoming Trip' | 'Ongoing' | 'Completed';
  tripStartDate: string;
  tripEndDate: string;
  travelerCount: number;
  countdown: {
    days: number;
    hours: number;
    mins: number;
    secs: number;
  };
  travelers: Array<{
    name: string;
    avatar: string;
    email: string;
    phone: string;
  }>;
  agency: {
    id: string;
    name: string;
    logo: string;
    verified: boolean;
    rating: number;
    phone: string;
  };
  hotel: {
    name: string;
    checkIn: string;
    checkOut: string;
    address: string;
    image: string;
  };
  transport: {
    pickupPoint: string;
    pickupTime: string;
    driverName: string;
    vehicle: string;
    driverPhone: string;
  };
  weather: {
    temp: string;
    condition: string;
    location: string;
  };
  checklist: Array<{
    id: string;
    label: string;
    completed: boolean;
  }>;
  expenses: {
    totalBudget: number;
    spent: number;
    remaining: number;
    percentage: number;
  };
  timeline: Array<{
    title: string;
    date: string;
    status: 'completed' | 'current' | 'upcoming';
  }>;
  invoiceUrl?: string;
}

export const TRIPS_DATA: Trip[] = [
  {
    id: 'trip-001',
    bookingId: 'AT-784512',
    destinationId: 'meghalaya',
    packageId: 'package-001',
    agencyId: 'agency-001',
    title: 'Magical Meghalaya',
    locations: 'Shillong • Cherrapunji • Mawlynnong',
    coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop',
    status: 'Upcoming Trip',
    tripStartDate: '20 May, 2025',
    tripEndDate: '26 May, 2025',
    travelerCount: 2,
    countdown: {
      days: 8,
      hours: 2,
      mins: 45,
      secs: 18,
    },
    travelers: [
      { name: 'Subham Das', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop', email: 'subham@example.com', phone: '+91 9876543210' },
      { name: 'Priya Sharma', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop', email: 'priya@example.com', phone: '+91 9876543211' },
    ],
    agency: {
      id: 'agency-001',
      name: 'Wander North Travel',
      logo: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=150&auto=format&fit=crop',
      verified: true,
      rating: 4.8,
      phone: '+91 9123456789',
    },
    hotel: {
      name: 'Pine Brook Resort, Shillong',
      checkIn: '20 May, 12:00 PM',
      checkOut: '26 May, 11:00 AM',
      address: 'Polo Grounds, Shillong, Meghalaya 793001',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop',
    },
    transport: {
      pickupPoint: 'Guwahati Airport (GAU)',
      pickupTime: '20 May, 08:00 AM',
      driverName: 'Ramesh Sangma',
      vehicle: 'Toyota Innova Crysta (ML 05 X 9988)',
      driverPhone: '+91 9898989898',
    },
    weather: {
      temp: '22°C',
      condition: 'Cloudy',
      location: 'Shillong, Meghalaya',
    },
    checklist: [
      { id: '1', label: 'Passport & ID Proofs', completed: true },
      { id: '2', label: 'Medicines & First Aid', completed: true },
      { id: '3', label: 'Power Bank & Chargers', completed: true },
      { id: '4', label: 'Raincoat & Umbrella', completed: true },
      { id: '5', label: 'Comfortable Trekking Shoes', completed: true },
      { id: '6', label: 'Camera & Memory Cards', completed: false },
      { id: '7', label: 'Travel Insurance Documents', completed: false },
      { id: '8', label: 'Extra Cash (Local Currency)', completed: false },
    ],
    expenses: {
      totalBudget: 45000,
      spent: 18750,
      remaining: 26250,
      percentage: 42,
    },
    timeline: [
      { title: 'Booking Confirmed', date: '12 May, 2025', status: 'completed' },
      { title: 'Agency Preparing', date: 'In Progress', status: 'current' },
      { title: 'Trip Starts', date: '20 May, 2025', status: 'upcoming' },
      { title: 'Trip Ends', date: '26 May, 2025', status: 'upcoming' },
    ],
    invoiceUrl: '#',
  },
];

export const getTripById = (id?: string): Trip => {
  if (!id) return TRIPS_DATA[0];
  return TRIPS_DATA.find((t) => t.id === id || t.bookingId === id) || TRIPS_DATA[0];
};
