export interface Destination {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  region: string;
  state: string;
  country: string;
  heroImage: string;
  gallery: string[];
  rating: number;
  reviewCount: string;
  description: string;
  weather: {
    temp: string;
    condition: string;
    high: string;
    low: string;
    humidity: string;
    wind: string;
  };
  elevation: string;
  language: string;
  currency: string;
  timezone: string;
  bestTime: {
    summer: { months: string; temp: string };
    winter: { months: string; temp: string };
    monsoon: { months: string; temp: string };
  };
  thingsToDo: Array<{ id: string; title: string; iconName: string; image: string }>;
  attractions: Array<{ id: string; name: string; rating: number; reviewCount: string; location: string; distance: string; image: string }>;
  hotels: Array<{ id: string; name: string; rating: number; price: string; image: string }>;
  restaurants: Array<{ id: string; name: string; cuisine: string; rating: number; image: string }>;
  travelTips: Array<{ category: string; tip: string }>;
  nearbyAgencies: Array<{ id: string; name: string; logo: string; rating: number; verified: boolean }>;
  packages: Array<{ id: string; title: string; duration: string; price: string; rating: number; image: string; bestseller?: boolean }>;
  reviews: Array<{ id: string; author: string; avatar: string; rating: number; date: string; comment: string; photos?: string[] }>;
  faq: Array<{ question: string; answer: string }>;
  startingPrice: string;
}

export const DESTINATIONS_DATA: Destination[] = [
  {
    id: 'meghalaya',
    name: 'Meghalaya',
    slug: 'meghalaya',
    tagline: 'Abode of Clouds ☁️',
    region: 'NORTH EAST INDIA',
    state: 'Meghalaya',
    country: 'India',
    heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1568849676085-51415703900f?q=80&w=600&auto=format&fit=crop',
    ],
    rating: 4.8,
    reviewCount: '2.3K',
    description: 'Meghalaya, the "Abode of Clouds", is a paradise of lush green hills, living root bridges, twin waterfalls and crystal clear rivers.',
    weather: {
      temp: '22°C',
      condition: 'Cloudy',
      high: '24°C',
      low: '16°C',
      humidity: '78%',
      wind: '12 km/h',
    },
    elevation: '1,496 m',
    language: 'English',
    currency: 'INR',
    timezone: 'GMT +5:30',
    bestTime: {
      summer: { months: 'Mar - May', temp: '16°C - 25°C' },
      winter: { months: 'Oct - Feb', temp: '8°C - 17°C' },
      monsoon: { months: 'Jun - Sep', temp: '17°C - 23°C' },
    },
    thingsToDo: [
      { id: '1', title: 'Trekking', iconName: 'Footprints', image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=400&auto=format&fit=crop' },
      { id: '2', title: 'Camping', iconName: 'Tent', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=400&auto=format&fit=crop' },
      { id: '3', title: 'Boating', iconName: 'Ship', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=400&auto=format&fit=crop' },
      { id: '4', title: 'Caving', iconName: 'Mountain', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=400&auto=format&fit=crop' },
      { id: '5', title: 'Waterfalls', iconName: 'Waves', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop' },
    ],
    attractions: [
      { id: 'att-1', name: 'Nohkalikai Falls', rating: 4.9, reviewCount: '1.8K', location: 'Cherrapunji', distance: '12 km', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop' },
      { id: 'att-2', name: 'Living Root Bridge', rating: 4.8, reviewCount: '2.1K', location: 'Mawsynram', distance: '35 km', image: 'https://images.unsplash.com/photo-1568849676085-51415703900f?q=80&w=600&auto=format&fit=crop' },
      { id: 'att-3', name: 'Dawki River', rating: 4.6, reviewCount: '860', location: 'Dawki', distance: '64 km', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop' },
    ],
    hotels: [
      { id: 'h-1', name: 'Polo Towers Shillong', rating: 4.6, price: '₹4,500/night', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop' },
      { id: 'h-2', name: 'Ri Kynjai Resort', rating: 4.9, price: '₹9,800/night', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=400&auto=format&fit=crop' },
    ],
    restaurants: [
      { id: 'r-1', name: 'Dylan’s Cafe', cuisine: 'Continental & Coffee', rating: 4.7, image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=400&auto=format&fit=crop' },
      { id: 'r-2', name: 'Jadoh Local Cuisine', cuisine: 'Khasi Traditional', rating: 4.5, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=400&auto=format&fit=crop' },
    ],
    travelTips: [
      { category: 'Weather', tip: 'Always carry a sturdy raincoat as sudden downpours are very common.' },
      { category: 'Trekking', tip: 'Wear waterproof shoes with deep treads for walking down Nongriat root bridge stairs.' },
    ],
    nearbyAgencies: [
      { id: 'agency-001', name: 'Wander North Travel', logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop', rating: 4.8, verified: true },
      { id: 'agency-002', name: 'Megha Holidays', logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop', rating: 4.6, verified: true },
      { id: 'agency-003', name: 'Hills & Horizons', logo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop', rating: 4.7, verified: true },
    ],
    packages: [
      { id: 'package-001', title: 'Shillong Escape', duration: '3D/2N', price: '₹8,999', rating: 4.8, image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=400&auto=format&fit=crop', bestseller: true },
      { id: 'package-002', title: 'Meghalaya Explorer', duration: '4D/3N', price: '₹12,499', rating: 4.9, image: 'https://images.unsplash.com/photo-1568849676085-51415703900f?q=80&w=400&auto=format&fit=crop' },
      { id: 'package-003', title: 'Hidden Gems of Meghalaya', duration: '5D/4N', price: '₹16,999', rating: 4.7, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop' },
    ],
    reviews: [
      { id: 'rev-1', author: 'Ananya Sharma', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop', rating: 5, date: '2 weeks ago', comment: 'Dawki river boating was an out of this world experience! Pure crystal clear water.' },
    ],
    faq: [
      { question: 'What is the best time to visit Meghalaya?', answer: 'October to May offers pleasant weather with clear views of waterfalls and valleys.' },
      { question: 'Is Meghalaya safe for solo women travelers?', answer: 'Yes! Meghalaya has a matrilineal society and is regarded as one of the safest travel destinations in India.' },
    ],
    startingPrice: '₹8,999',
  },
  {
    id: 'ladakh',
    name: 'Ladakh',
    slug: 'ladakh',
    tagline: 'Land of High Passes 🏔️',
    region: 'NORTH INDIA',
    state: 'Ladakh',
    country: 'India',
    heroImage: 'https://images.unsplash.com/photo-1568849676085-51415703900f?q=80&w=1200&auto=format&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1568849676085-51415703900f?q=80&w=600&auto=format&fit=crop'],
    rating: 4.9,
    reviewCount: '3.1K',
    description: 'Ladakh is a high-altitude desert surrounded by snow-capped Himalayan peaks, ancient Buddhist monasteries, and crystal blue lakes.',
    weather: { temp: '14°C', condition: 'Sunny', high: '18°C', low: '4°C', humidity: '35%', wind: '15 km/h' },
    elevation: '3,500 m',
    language: 'Ladakhi / Hindi',
    currency: 'INR',
    timezone: 'GMT +5:30',
    bestTime: {
      summer: { months: 'May - Sep', temp: '15°C - 25°C' },
      winter: { months: 'Nov - Feb', temp: '-15°C - 5°C' },
      monsoon: { months: 'Jul - Aug', temp: '12°C - 20°C' },
    },
    thingsToDo: [
      { id: '1', title: 'Bike Tour', iconName: 'Bike', image: 'https://images.unsplash.com/photo-1568849676085-51415703900f?q=80&w=400&auto=format&fit=crop' },
      { id: '2', title: 'Monastery Visit', iconName: 'Building', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=400&auto=format&fit=crop' },
    ],
    attractions: [
      { id: 'att-1', name: 'Pangong Lake', rating: 4.9, reviewCount: '2.9K', location: 'Leh', distance: '140 km', image: 'https://images.unsplash.com/photo-1568849676085-51415703900f?q=80&w=600&auto=format&fit=crop' },
    ],
    hotels: [
      { id: 'h-1', name: 'The Grand Dragon Ladakh', rating: 4.8, price: '₹12,000/night', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop' },
    ],
    restaurants: [
      { id: 'r-1', name: 'Gesmo Restaurant', cuisine: 'Tibetan & Bakery', rating: 4.6, image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=400&auto=format&fit=crop' },
    ],
    travelTips: [{ category: 'Acclimatization', tip: 'Rest completely for the first 24-36 hours after landing in Leh to prevent altitude sickness.' }],
    nearbyAgencies: [
      { id: 'agency-001', name: 'Himalayan Explorers', logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop', rating: 4.9, verified: true },
    ],
    packages: [
      { id: 'package-004', title: 'Ladakh Circuit', duration: '6D/5N', price: '₹18,999', rating: 4.9, image: 'https://images.unsplash.com/photo-1568849676085-51415703900f?q=80&w=400&auto=format&fit=crop' },
    ],
    reviews: [{ id: 'rev-1', author: 'Rohan Mehta', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop', rating: 5, date: '1 month ago', comment: 'Pangong Tso at sunrise is pure magic.' }],
    faq: [{ question: 'Do I need an Inner Line Permit?', answer: 'Yes, domestic and foreign tourists require ILP for Nubra Valley and Pangong.' }],
    startingPrice: '₹18,999',
  },
];

// Helper resolver for finding destination by id or slug
export const getDestinationById = (idOrSlug?: string): Destination => {
  if (!idOrSlug) return DESTINATIONS_DATA[0];
  const normalized = idOrSlug.toLowerCase();
  return (
    DESTINATIONS_DATA.find((d) => d.id === normalized || d.slug === normalized) ||
    DESTINATIONS_DATA[0]
  );
};
