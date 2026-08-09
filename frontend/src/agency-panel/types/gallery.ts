// ─── Package Gallery & Media Types ──────────────────────────────────────────

export type CategoryTag =
  | 'Scenic Views'
  | 'Accommodation'
  | 'Food'
  | 'Activities'
  | 'Transport'
  | 'Local Culture'
  | 'Adventure'
  | 'Wildlife';

export interface GalleryImage {
  id: string;
  url: string;
  name?: string;
  sizeMB?: number;
  isCover?: boolean;
  category?: CategoryTag;
}

export interface VideoFile {
  id: string;
  url: string;
  name: string;
  duration: string;
  sizeMB: number;
  thumbnail: string;
}

export interface Step5GalleryInfo {
  coverImage: string;
  galleryImages: GalleryImage[];
  videos: VideoFile[];
  imageCategories: CategoryTag[];
  previewIndex: number;
}

export const CATEGORY_TAGS_CONFIG: { tag: CategoryTag; icon: string }[] = [
  { tag: 'Scenic Views', icon: '🏔️' },
  { tag: 'Accommodation', icon: '🛏️' },
  { tag: 'Food', icon: '🍽️' },
  { tag: 'Activities', icon: '🏃' },
  { tag: 'Transport', icon: '🚗' },
  { tag: 'Local Culture', icon: '🏛️' },
  { tag: 'Adventure', icon: '🧗' },
  { tag: 'Wildlife', icon: '🐾' },
];

export const INITIAL_GALLERY_IMAGES: GalleryImage[] = [
  {
    id: 'img-1',
    url: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=500&q=80',
    name: 'ladakh_flags.jpg',
    category: 'Local Culture',
  },
  {
    id: 'img-2',
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=500&q=80',
    name: 'thiksey_monastery.jpg',
    category: 'Scenic Views',
  },
  {
    id: 'img-3',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80',
    name: 'pangong_tso.jpg',
    category: 'Scenic Views',
  },
  {
    id: 'img-4',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=500&q=80',
    name: 'khardung_la.jpg',
    category: 'Adventure',
  },
  {
    id: 'img-5',
    url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=500&q=80',
    name: 'hunder_dunes.jpg',
    category: 'Adventure',
  },
  {
    id: 'img-6',
    url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=500&q=80',
    name: 'biking_ladakh.jpg',
    category: 'Activities',
  },
  {
    id: 'img-7',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80',
    name: 'nubra_sunset.jpg',
    category: 'Scenic Views',
  },
  {
    id: 'img-8',
    url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80',
    name: 'resort_stay.jpg',
    category: 'Accommodation',
  },
];

export const INITIAL_VIDEOS: VideoFile[] = [
  {
    id: 'vid-1',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    name: 'Ladakh Promo Video.mp4',
    duration: '01:25',
    sizeMB: 45.6,
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80',
  },
];
