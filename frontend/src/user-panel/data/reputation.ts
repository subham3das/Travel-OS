export interface BadgeItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserReputationProfile {
  userId: string;
  reputation: number;
  levelTitle: 'Explorer' | 'Traveller' | 'Adventure Seeker' | 'Globetrotter' | 'Legend Explorer';
  completedTrips: number;
  reviewCount: number;
  recommendationCount: number;
  storyCount: number;
  photoUploads: number;
  helpfulVotes: number;
  badges: BadgeItem[];
}

export const getReputationLevelTitle = (reputation: number): UserReputationProfile['levelTitle'] => {
  if (reputation >= 1000) return 'Legend Explorer';
  if (reputation >= 500) return 'Globetrotter';
  if (reputation >= 250) return 'Adventure Seeker';
  if (reputation >= 100) return 'Traveller';
  return 'Explorer';
};

export const INITIAL_USER_REPUTATION: UserReputationProfile = {
  userId: 'user-001',
  reputation: 245,
  levelTitle: 'Traveller',
  completedTrips: 5,
  reviewCount: 4,
  recommendationCount: 4,
  storyCount: 2,
  photoUploads: 18,
  helpfulVotes: 32,
  badges: [
    { id: 'b1', name: 'First Trip', description: 'Completed your first booked journey on ApnaTrip', icon: '✈️', unlocked: true, unlockedAt: '12 Jan 2024' },
    { id: 'b2', name: 'First Review', description: 'Wrote your first genuine travel review', icon: '✍️', unlocked: true, unlockedAt: '15 Jan 2024' },
    { id: 'b3', name: 'Trusted Reviewer', description: 'Received 25+ helpful votes from community', icon: '⭐', unlocked: true, unlockedAt: '20 Feb 2024' },
    { id: 'b4', name: 'Verified Traveller', description: 'Verified identity and booking status', icon: '🛡️', unlocked: true, unlockedAt: '01 Mar 2024' },
    { id: 'b5', name: 'Mountain Lover', description: 'Explored 3+ Himalayan mountain destinations', icon: '🏔️', unlocked: true, unlockedAt: '10 Apr 2024' },
    { id: 'b6', name: 'Top Storyteller', description: 'Published 3+ travel stories in community', icon: '📖', unlocked: false },
    { id: 'b7', name: 'Community Helper', description: 'Helped 50+ travelers with answers', icon: '🤝', unlocked: false },
    { id: 'b8', name: 'Beach Explorer', description: 'Explored 3+ coastal beach destinations', icon: '🏖️', unlocked: false },
  ],
};

let userReputationState = { ...INITIAL_USER_REPUTATION };

export const getUserReputation = (): UserReputationProfile => {
  return { ...userReputationState, levelTitle: getReputationLevelTitle(userReputationState.reputation) };
};

export const addReputationPoints = (points: number, actionName: string): UserReputationProfile => {
  userReputationState.reputation += points;
  userReputationState.levelTitle = getReputationLevelTitle(userReputationState.reputation);
  
  if (actionName === 'review') userReputationState.reviewCount += 1;
  if (actionName === 'recommend') userReputationState.recommendationCount += 1;
  if (actionName === 'story') userReputationState.storyCount += 1;

  // Unlock badges if thresholds met
  if (userReputationState.reviewCount >= 1) {
    const b = userReputationState.badges.find((x) => x.id === 'b2');
    if (b) b.unlocked = true;
  }
  if (userReputationState.storyCount >= 3) {
    const b = userReputationState.badges.find((x) => x.id === 'b6');
    if (b) b.unlocked = true;
  }

  return { ...userReputationState };
};
