export interface CommentItem {
  id: string;
  postId: string;
  parentCommentId?: string;
  userId: string;
  userName: string;
  userAvatar: string;
  reputationTitle: 'Explorer' | 'Traveller' | 'Adventure Seeker' | 'Globetrotter';
  isVerifiedTraveler?: boolean;
  isAgency?: boolean;
  agencyName?: string;
  content: string;
  createdAt: string;
  isPinned?: boolean;
  likeCount: number;
  userReaction?: 'like' | 'love' | 'fire' | 'helpful' | 'beautiful';
  replies?: CommentItem[];
}

export const INITIAL_COMMENTS: CommentItem[] = [
  {
    id: 'c1',
    postId: 'post-001',
    userId: 'agency-001',
    userName: 'Wander North Travel',
    userAvatar: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=200&auto=format&fit=crop',
    reputationTitle: 'Globetrotter',
    isAgency: true,
    agencyName: 'Wander North Travel',
    content: '📌 Thank you Subham! We loved hosting your group in Cherrapunji. Looking forward to your next mountain trek with us! 🏔️✨',
    createdAt: '2 hours ago',
    isPinned: true,
    likeCount: 42,
    userReaction: 'love',
    replies: [
      {
        id: 'c1-r1',
        postId: 'post-001',
        parentCommentId: 'c1',
        userId: 'user-001',
        userName: 'Subham Das',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
        reputationTitle: 'Traveller',
        isVerifiedTraveler: true,
        content: '@Wander North Travel Huge shoutout to driver Ramesh Sangma as well! Extremely professional.',
        createdAt: '1 hour ago',
        likeCount: 15,
      },
    ],
  },
  {
    id: 'c2',
    postId: 'post-001',
    userId: 'user-003',
    userName: 'Rahul Verma',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    reputationTitle: 'Adventure Seeker',
    isVerifiedTraveler: true,
    content: 'Which camera lens did you use for the double-decker root bridge photo? The water color looks incredible!',
    createdAt: '3 hours ago',
    likeCount: 18,
    userReaction: 'like',
    replies: [
      {
        id: 'c2-r1',
        postId: 'post-001',
        parentCommentId: 'c2',
        userId: 'user-001',
        userName: 'Subham Das',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
        reputationTitle: 'Traveller',
        isVerifiedTraveler: true,
        content: 'Used a 24-70mm f/2.8 lens with a polarising filter to cut down glare on the water! 📸',
        createdAt: '2 hours ago',
        likeCount: 9,
      },
    ],
  },
  {
    id: 'c3',
    postId: 'post-001',
    userId: 'user-004',
    userName: 'Sneha Patel',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    reputationTitle: 'Explorer',
    isVerifiedTraveler: false,
    content: 'Adding Cherrapunji to my 2025 travel bucket list right now! 🌿',
    createdAt: '4 hours ago',
    likeCount: 8,
    replies: [],
  },
];

let commentsStore = [...INITIAL_COMMENTS];

export const getCommentsByPostId = (postId: string): CommentItem[] => {
  return commentsStore.filter((c) => c.postId === postId || postId === 'post-001');
};

export const addCommentToPost = (postId: string, text: string): CommentItem => {
  const newComment: CommentItem = {
    id: `c-${Date.now()}`,
    postId,
    userId: 'user-001',
    userName: 'Subham Das',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    reputationTitle: 'Traveller',
    isVerifiedTraveler: true,
    content: text,
    createdAt: 'Just now',
    likeCount: 0,
    replies: [],
  };
  commentsStore = [newComment, ...commentsStore];
  return newComment;
};

export const addReplyToComment = (parentCommentId: string, text: string): CommentItem => {
  const newReply: CommentItem = {
    id: `r-${Date.now()}`,
    postId: 'post-001',
    parentCommentId,
    userId: 'user-001',
    userName: 'Subham Das',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    reputationTitle: 'Traveller',
    isVerifiedTraveler: true,
    content: text,
    createdAt: 'Just now',
    likeCount: 0,
  };

  const updateReplies = (list: CommentItem[]): CommentItem[] => {
    return list.map((item) => {
      if (item.id === parentCommentId) {
        return { ...item, replies: [...(item.replies || []), newReply] };
      }
      if (item.replies) {
        return { ...item, replies: updateReplies(item.replies) };
      }
      return item;
    });
  };

  commentsStore = updateReplies(commentsStore);
  return newReply;
};
