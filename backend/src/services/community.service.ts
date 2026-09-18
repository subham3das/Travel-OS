import mongoose from 'mongoose';
import { CommunityPostModel, ICommunityPost } from '../models/communityPost.model.js';
import { UserModel } from '../models/user.model.js';
import { NotFoundError, BadRequestError } from '../utils/errors.util.js';
import { logger } from '../config/logger.config.js';

export class CommunityService {
  /**
   * 1. Get community posts
   */
  public async getPosts(category = 'all'): Promise<any[]> {
    const query: any = { isDeleted: false, status: 'Published' };

    let posts = await CommunityPostModel.find(query)
      .sort({ isPinned: -1, createdAt: -1 })
      .limit(50)
      .lean();

    // Auto-seed initial engaging community posts if none exist
    if (posts.length === 0) {
      const seedPosts = [
        {
          postId: 'post-seed-1',
          authorName: 'Aarav Mehta',
          authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
          authorRole: 'Verified Guide',
          postType: 'Story',
          title: 'Conquering the Living Root Bridges of Cherrapunji',
          content: 'Just returned from an unforgettable 5-day trek deep into the East Khasi Hills. Standing beneath the centuries-old double-decker living root bridge at Nongriat felt like entering a mythical realm. Make sure to pack sturdy grip shoes and carry hydration tablets!',
          destinationTag: 'Meghalaya, India',
          media: [
            'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
          ],
          likesCount: 142,
          commentsCount: 19,
          sharesCount: 8,
          status: 'Published',
          isPinned: true,
        },
        {
          postId: 'post-seed-2',
          authorName: 'Sneha Roy',
          authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
          authorRole: 'Traveler',
          postType: 'Tip',
          title: 'Top 5 Cafes & Viewpoints in Gulmarg',
          content: 'If you are heading to Kashmir this season, do not miss the hot saffron Kahwa at Highland Breeze Cafe right near the Phase 1 Gondola terminal. Best scenic snowy mountain backdrop in the valley!',
          destinationTag: 'Kashmir, India',
          media: [
            'https://images.unsplash.com/photo-1517824806704-9040b037703b?q=80&w=800&auto=format&fit=crop',
          ],
          likesCount: 98,
          commentsCount: 12,
          sharesCount: 4,
          status: 'Published',
        },
      ];

      for (const p of seedPosts) {
        await CommunityPostModel.create(p);
      }

      posts = await CommunityPostModel.find(query)
        .sort({ isPinned: -1, createdAt: -1 })
        .lean();
    }

    return posts.map((p) => ({
      id: p.postId || p._id.toString(),
      _id: p._id.toString(),
      author: {
        id: p.authorId ? p.authorId.toString() : 'author-default',
        name: p.authorName,
        avatar: p.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
        role: p.authorRole,
      },
      title: p.title,
      content: p.content,
      destination: p.destinationTag || 'India',
      media: p.media || [],
      likesCount: p.likesCount || 0,
      commentsCount: p.commentsCount || 0,
      sharesCount: p.sharesCount || 0,
      isLiked: false,
      isPinned: Boolean(p.isPinned),
      timestamp: new Date(p.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      category: p.postType,
    }));
  }

  /**
   * 2. Create community post
   */
  public async createPost(userId: string, payload: any): Promise<any> {
    const user = await UserModel.findById(userId).lean();
    if (!user) throw new NotFoundError('User not found');

    const newPost = await CommunityPostModel.create({
      postId: `POST-${Date.now().toString().slice(-6)}`,
      authorId: user._id,
      authorName: user.fullName || user.username || 'Traveler',
      authorAvatar: user.avatar || '',
      authorRole: 'Traveler',
      postType: payload.postType || 'Story',
      title: payload.title,
      content: payload.content,
      destinationTag: payload.destination || 'India',
      media: payload.media || [],
      status: 'Published',
    });

    logger.info('📝 Community post created: %s by user: %s', newPost.postId, userId);

    return newPost;
  }

  /**
   * 3. Like a post
   */
  public async likePost(postId: string): Promise<number> {
    const post = await CommunityPostModel.findOneAndUpdate(
      { $or: [{ postId }, { _id: mongoose.Types.ObjectId.isValid(postId) ? new mongoose.Types.ObjectId(postId) : null }] },
      { $inc: { likesCount: 1 } },
      { returnDocument: 'after' }
    );
    return post?.likesCount || 1;
  }
}

export const communityService = new CommunityService();
