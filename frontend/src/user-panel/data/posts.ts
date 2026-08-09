export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: 'story' | 'experience' | 'tip' | 'question';
  title?: string;
  caption: string;
  destinationId?: string;
  destinationName?: string;
  agencyId?: string;
  agencyName?: string;
  tripId?: string;
  images: string[];
  tags: string[];
  visibility: 'public' | 'followers' | 'draft';
  likes: number;
  comments: number;
  createdAt: string;
  rating?: number;
}

export const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'post-001',
    userId: 'user-001',
    userName: 'Subham Das',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    type: 'story',
    title: 'Chasing Waterfalls in Magical Meghalaya 🏔️✨',
    caption: 'Trekking down to the double-decker living root bridge in Cherrapunji was an indescribable experience! The monsoon mist and turquoise pools made it feel like a fairy tale.',
    destinationId: 'meghalaya',
    destinationName: 'Meghalaya',
    agencyId: 'agency-001',
    agencyName: 'Wander North Travel',
    tripId: 'trip-001',
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
    ],
    tags: ['Meghalaya', 'SoloTravel', 'Backpacking', 'Waterfalls'],
    visibility: 'public',
    likes: 142,
    comments: 28,
    createdAt: '2 hours ago',
    rating: 5,
  },
  {
    id: 'post-002',
    userId: 'user-002',
    userName: 'Priya Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
    type: 'tip',
    title: 'Essential Packing Tip for Ladakh Bike Trips 🏍️',
    caption: 'Always carry extra thermal layers and oxygen cans when crossing Khardung La pass. Keep hydration packs easily accessible inside your riding jacket!',
    destinationId: 'ladakh',
    destinationName: 'Ladakh',
    images: [],
    tags: ['Ladakh', 'MotorcycleTravel', 'TravelTips'],
    visibility: 'public',
    likes: 98,
    comments: 14,
    createdAt: 'Yesterday',
  },
];

let postsState = [...INITIAL_POSTS];

export const getCommunityPosts = (): CommunityPost[] => {
  return [...postsState];
};

export const addNewPost = (newPost: Omit<CommunityPost, 'id' | 'likes' | 'comments' | 'createdAt'>): CommunityPost => {
  const post: CommunityPost = {
    ...newPost,
    id: `post-${Date.now()}`,
    likes: 0,
    comments: 0,
    createdAt: 'Just now',
  };
  postsState = [post, ...postsState];
  return post;
};
