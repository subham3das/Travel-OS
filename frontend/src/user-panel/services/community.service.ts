import { apiClient } from '../../services/apiClient';
import { CommunityPost } from '../data/posts';

class CommunityService {
  public async getPosts(category = 'all'): Promise<CommunityPost[]> {
    try {
      const res = await apiClient.get<{ posts: CommunityPost[] }>('/community/posts', {
        params: { category },
        requiresAuth: false,
      });
      return res.data?.posts || [];
    } catch {
      return [];
    }
  }

  public async createPost(payload: {
    title: string;
    content: string;
    destination?: string;
    postType?: string;
    media?: string[];
  }): Promise<CommunityPost> {
    const res = await apiClient.post<{ post: CommunityPost }>('/community/posts', payload);
    if (!res.data?.post) {
      throw new Error(res.message || 'Failed to create post');
    }
    return res.data.post;
  }

  public async likePost(postId: string): Promise<number> {
    try {
      const res = await apiClient.post<{ likesCount: number }>(`/community/posts/${encodeURIComponent(postId)}/like`, {});
      return res.data?.likesCount || 0;
    } catch {
      return 0;
    }
  }
}

export const communityService = new CommunityService();
