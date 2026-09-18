import { Request, Response } from 'express';
import { reviewService } from '../services/review.service.js';

export class ReviewController {
  public async getReviews(req: Request, res: Response): Promise<void> {
    const packageId = req.query.packageId ? String(req.query.packageId) : undefined;
    const agencyId = req.query.agencyId ? String(req.query.agencyId) : undefined;
    const reviews = await reviewService.getReviews({ packageId, agencyId });
    res.status(200).json({
      success: true,
      data: { reviews },
    });
  }

  public async submitReview(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.userId;
    const review = await reviewService.submitReview(userId, req.body);
    res.status(201).json({
      success: true,
      data: { review },
    });
  }
}

export const reviewController = new ReviewController();
