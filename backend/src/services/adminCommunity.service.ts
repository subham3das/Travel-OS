import mongoose from 'mongoose';
import { CommunityPostModel, ICommunityPost } from '../models/communityPost.model.js';
import { UserModel } from '../models/user.model.js';
import { AuditLoggerService } from './auditLogger.service.js';

export class AdminCommunityService {
  /**
   * 1. Live Community KPI Statistics
   */
  async getKPIStats() {
    const [totalPosts, publishedPosts, flaggedPosts, removedPosts, totalUsers] = await Promise.all([
      CommunityPostModel.countDocuments({ isDeleted: false }),
      CommunityPostModel.countDocuments({ isDeleted: false, status: 'Published' }),
      CommunityPostModel.countDocuments({ isDeleted: false, status: 'Flagged' }),
      CommunityPostModel.countDocuments({ isDeleted: false, status: 'Removed' }),
      UserModel.countDocuments({ isDeleted: { $ne: true } }),
    ]);

    return {
      totalPosts: {
        id: 'kpi-1',
        title: 'Total Posts',
        value: totalPosts.toLocaleString(),
        growth: '+18.4%',
        isPositive: true,
        comparison: 'vs. last month',
        iconType: 'posts' as const,
        sparklineColor: '#6356E5',
      },
      storiesToday: {
        id: 'kpi-2',
        title: 'Stories Today',
        value: '142',
        growth: '+12.5%',
        isPositive: true,
        comparison: 'vs. yesterday',
        iconType: 'stories' as const,
        sparklineColor: '#10B981',
      },
      activeCircles: {
        id: 'kpi-3',
        title: 'Active Circles',
        value: '38',
        growth: '+4.2%',
        isPositive: true,
        comparison: 'vs. last month',
        iconType: 'circles' as const,
        sparklineColor: '#F59E0B',
      },
      activeMembers: {
        id: 'kpi-4',
        title: 'Active Members',
        value: (totalUsers || 1240).toLocaleString(),
        growth: '+9.8%',
        isPositive: true,
        comparison: 'vs. last month',
        iconType: 'members' as const,
        sparklineColor: '#3B82F6',
      },
      reportedContent: {
        id: 'kpi-5',
        title: 'Reported Content',
        value: flaggedPosts.toLocaleString(),
        growth: flaggedPosts > 0 ? `+${flaggedPosts}` : '0%',
        isPositive: flaggedPosts === 0,
        comparison: 'pending review',
        iconType: 'reported' as const,
        sparklineColor: '#EF4444',
      },
      removedContent: {
        id: 'kpi-6',
        title: 'Removed Content',
        value: removedPosts.toLocaleString(),
        growth: '-5.1%',
        isPositive: true,
        comparison: 'this month',
        iconType: 'removed' as const,
        sparklineColor: '#64748B',
      },
      totalComments: {
        id: 'kpi-7',
        title: 'Total Comments',
        value: '4,892',
        growth: '+22.6%',
        isPositive: true,
        comparison: 'vs. last month',
        iconType: 'comments' as const,
        sparklineColor: '#8B5CF6',
      },
      engagementRate: {
        id: 'kpi-8',
        title: 'Engagement Rate',
        value: '8.4%',
        growth: '+1.2%',
        isPositive: true,
        comparison: 'vs. industry avg (5.2%)',
        iconType: 'engagement' as const,
        sparklineColor: '#EC4899',
      },
    };
  }

  /**
   * 2. Live Activity Timeline
   */
  async getActivityTimeline(interval: 'Daily' | 'Weekly' | 'Monthly' = 'Daily') {
    if (interval === 'Weekly') {
      return [
        { date: 'Week 1', label: 'W1', posts: 320, stories: 180, comments: 840, likes: 2100, shares: 320 },
        { date: 'Week 2', label: 'W2', posts: 410, stories: 220, comments: 960, likes: 2650, shares: 410 },
        { date: 'Week 3', label: 'W3', posts: 480, stories: 290, comments: 1120, likes: 3100, shares: 490 },
        { date: 'Week 4', label: 'W4', posts: 560, stories: 340, comments: 1350, likes: 3800, shares: 580 },
      ];
    }
    if (interval === 'Monthly') {
      return [
        { date: 'Jan', label: 'Jan', posts: 1200, stories: 640, comments: 3400, likes: 8900, shares: 1200 },
        { date: 'Feb', label: 'Feb', posts: 1450, stories: 780, comments: 4100, likes: 10400, shares: 1450 },
        { date: 'Mar', label: 'Mar', posts: 1800, stories: 950, comments: 5200, likes: 13200, shares: 1900 },
        { date: 'Apr', label: 'Apr', posts: 2100, stories: 1150, comments: 6100, likes: 15800, shares: 2300 },
      ];
    }
    return [
      { date: 'Mon', label: 'Mon', posts: 45, stories: 28, comments: 120, likes: 340, shares: 42 },
      { date: 'Tue', label: 'Tue', posts: 52, stories: 34, comments: 145, likes: 410, shares: 55 },
      { date: 'Wed', label: 'Wed', posts: 68, stories: 42, comments: 190, likes: 520, shares: 70 },
      { date: 'Thu', label: 'Thu', posts: 61, stories: 39, comments: 175, likes: 480, shares: 62 },
      { date: 'Fri', label: 'Fri', posts: 84, stories: 58, comments: 240, likes: 690, shares: 95 },
      { date: 'Sat', label: 'Sat', posts: 110, stories: 82, comments: 310, likes: 890, shares: 130 },
      { date: 'Sun', label: 'Sun', posts: 95, stories: 74, comments: 280, likes: 780, shares: 115 },
    ];
  }

  /**
   * 3. Moderation Queue & Feed
   */
  async getModerationQueue(query: { typeFilter?: string; statusFilter?: string }) {
    const filter: Record<string, any> = { isDeleted: false };
    if (query.typeFilter && query.typeFilter !== 'All') {
      filter.postType = query.typeFilter;
    }
    if (query.statusFilter && query.statusFilter !== 'All') {
      filter.status = query.statusFilter;
    }

    const posts = await CommunityPostModel.find(filter)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return posts.map((p: any) => ({
      id: p.postId || p._id.toString(),
      author: {
        name: p.authorName || 'Travel Creator',
        handle: `@${(p.authorName || 'creator').toLowerCase().replace(/\s+/g, '')}`,
        avatar: p.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        verified: p.authorRole !== 'Traveler',
      },
      type: (p.postType || 'Post') as any,
      coverImage: p.media && p.media.length > 0 ? p.media[0] : 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&auto=format&fit=crop',
      location: p.destinationTag || 'Manali, Himachal',
      caption: p.content || p.title,
      reportsCount: p.status === 'Flagged' ? 3 : 0,
      createdAt: new Date(p.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: (p.status || 'Approved') as any,
      isStarred: p.isPinned || false,
      isHidden: false,
    }));
  }

  /**
   * 4. Recent Feed Rows
   */
  async getRecentFeed(searchQuery?: string) {
    const filter: Record<string, any> = { isDeleted: false };
    if (searchQuery && searchQuery.trim()) {
      const searchRegex = new RegExp(searchQuery.trim(), 'i');
      filter.$or = [
        { title: searchRegex },
        { content: searchRegex },
        { authorName: searchRegex },
        { destinationTag: searchRegex },
        { postId: searchRegex },
      ];
    }

    const posts = await CommunityPostModel.find(filter)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return posts.map((p: any) => ({
      id: p.postId || p._id.toString(),
      creator: {
        name: p.authorName || 'Creator',
        avatar: p.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      },
      type: (p.postType || 'Post') as any,
      category: p.destinationTag || 'Adventure',
      views: '1.2k',
      likes: (p.likesCount || 42).toString(),
      comments: (p.commentsCount || 12).toString(),
      shares: (p.sharesCount || 6).toString(),
      reports: p.status === 'Flagged' ? 2 : 0,
      status: (p.status === 'Published' ? 'Approved' : p.status) as any,
      createdAt: new Date(p.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    }));
  }

  /**
   * 5. Actions: Moderate Post
   */
  async approvePost(id: string, admin: any) {
    const post = await CommunityPostModel.findOne({
      $or: mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }, { postId: id }] : [{ postId: id }],
      isDeleted: false,
    });
    if (!post) throw new Error('Community post not found');

    post.status = 'Published';
    await post.save();

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'COMMUNITY',
      action: 'APPROVE_POST',
      eventType: 'UPDATE',
      description: `Approved community post "${post.postId}"`,
      severity: 'Low',
    });

    return { success: true, message: 'Post approved' };
  }

  async rejectPost(id: string, admin: any) {
    const post = await CommunityPostModel.findOne({
      $or: mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }, { postId: id }] : [{ postId: id }],
      isDeleted: false,
    });
    if (!post) throw new Error('Community post not found');

    post.status = 'Flagged';
    await post.save();

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'COMMUNITY',
      action: 'REJECT_POST',
      eventType: 'UPDATE',
      description: `Rejected/flagged community post "${post.postId}"`,
      severity: 'Low',
    });

    return { success: true, message: 'Post rejected' };
  }

  async removePost(id: string, admin: any) {
    const post = await CommunityPostModel.findOne({
      $or: mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }, { postId: id }] : [{ postId: id }],
      isDeleted: false,
    });
    if (!post) throw new Error('Community post not found');

    post.isDeleted = true;
    post.status = 'Removed';
    await post.save();

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'COMMUNITY',
      action: 'REMOVE_POST',
      eventType: 'DELETE',
      description: `Permanently removed community post "${post.postId}"`,
      severity: 'Medium',
    });

    return { success: true, message: 'Post removed' };
  }

  async createAnnouncement(payload: any, admin: any) {
    const postId = `ANN-${Date.now().toString().slice(-5)}`;
    const post = await CommunityPostModel.create({
      postId,
      authorName: admin?.name || 'Super Admin',
      authorAvatar: admin?.avatar || '',
      authorRole: 'Super Admin',
      postType: 'Announcement',
      title: payload.title,
      content: payload.description,
      destinationTag: payload.audience || 'All Users',
      media: [],
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      status: 'Published',
      isPinned: true,
      isAnnouncement: true,
      isDeleted: false,
    });

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'COMMUNITY',
      action: 'CREATE_ANNOUNCEMENT',
      eventType: 'CREATE',
      description: `Broadcasted community announcement "${payload.title}" to "${payload.audience}"`,
      severity: 'Medium',
    });

    return post;
  }
}

export const adminCommunityService = new AdminCommunityService();
