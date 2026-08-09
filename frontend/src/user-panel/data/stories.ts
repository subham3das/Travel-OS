export interface TravelStoryItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  title: string;
  description?: string;
  destinationName: string;
  agencyName?: string;
  tripId?: string;
  videoUrl: string;
  thumbnailUrl: string;
  durationSeconds: number;
  tags: string[];
  likes: number;
  views: string;
  createdAt: string;
}

export const INITIAL_STORIES: TravelStoryItem[] = [
  {
    id: 'story-001',
    userId: 'user-001',
    userName: 'Subham Das',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    title: '7 Days in Magical Meghalaya 🏔️✨',
    description: 'Exploring Cherrapunji waterfalls and living root bridges in monsoon!',
    destinationName: 'Meghalaya',
    agencyName: 'Wander North Travel',
    tripId: 'trip-001',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-[#6356E5]-waterfall-in-forest-2213-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop',
    durationSeconds: 45,
    tags: ['Meghalaya', 'Adventure', 'Waterfalls'],
    likes: 1840,
    views: '12.4K',
    createdAt: '3 hours ago',
  },
  {
    id: 'story-002',
    userId: 'user-002',
    userName: 'Ananya Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    title: 'Riding through Khardung La Pass 🏍️',
    description: 'High altitude mountain pass adventure in Ladakh!',
    destinationName: 'Ladakh',
    agencyName: 'Himalayan Explorers',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-motorcycle-riding-on-a-mountain-road-41584-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1568849676085-51415703900f?q=80&w=600&auto=format&fit=crop',
    durationSeconds: 60,
    tags: ['Ladakh', 'Motorcycle', 'Mountains'],
    likes: 3200,
    views: '28.1K',
    createdAt: 'Yesterday',
  },
];

let storiesState = [...INITIAL_STORIES];

export const getTravelStories = (): TravelStoryItem[] => {
  return [...storiesState];
};

export const addTravelStory = (newStory: Omit<TravelStoryItem, 'id' | 'likes' | 'views' | 'createdAt'>): TravelStoryItem => {
  const story: TravelStoryItem = {
    ...newStory,
    id: `story-${Date.now()}`,
    likes: 0,
    views: '1',
    createdAt: 'Just now',
  };
  storiesState = [story, ...storiesState];
  return story;
};
