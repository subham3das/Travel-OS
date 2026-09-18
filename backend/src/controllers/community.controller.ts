import { Request, Response } from 'express';
import { communityService } from '../services/community.service.js';

export class CommunityController {
  public async getPosts(req: Request, res: Response): Promise<void> {
    const category = String(req.query.category || 'all');
    const posts = await communityService.getPosts(category);
    res.status(200).json({
      success: true,
      data: { posts },
    });
  }

  public async createPost(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.userId;
    const post = await communityService.createPost(userId, req.body);
    res.status(201).json({
      success: true,
      data: { post },
    });
  }

  public async likePost(req: Request, res: Response): Promise<void> {
    const postId = String(req.params.id || '');
    const likesCount = await communityService.likePost(postId);
    res.status(200).json({
      success: true,
      data: { likesCount },
    });
  }
}

export const communityController = new CommunityController();
