import { Request, Response } from 'express';
import { searchService } from '../services/search.service.js';

export class SearchController {
  public async search(req: Request, res: Response): Promise<void> {
    const filters = {
      query: (req.query.q as string) || (req.query.search as string) || '',
      category: req.query.category as string,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      minRating: req.query.minRating ? Number(req.query.minRating) : undefined,
      duration: req.query.duration as string,
      type: req.query.type as string,
    };

    const results = await searchService.search(filters);
    res.status(200).json({
      success: true,
      data: results,
    });
  }
}

export const searchController = new SearchController();
