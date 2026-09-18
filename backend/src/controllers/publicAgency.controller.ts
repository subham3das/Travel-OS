import { Request, Response } from 'express';
import { publicAgencyService } from '../services/publicAgency.service.js';

export class PublicAgencyController {
  public async getAgencies(req: Request, res: Response): Promise<void> {
    const filters = {
      search: (req.query.search as string) || (req.query.q as string),
      location: req.query.location as string,
      verifiedOnly: req.query.verifiedOnly === 'true',
      minRating: req.query.minRating ? Number(req.query.minRating) : undefined,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
    };

    const result = await publicAgencyService.getAgencies(filters);
    res.status(200).json({
      success: true,
      data: result,
    });
  }

  public async getAgencyById(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id || req.params.agencyId || '');
    const agency = await publicAgencyService.getAgencyById(id);
    res.status(200).json({
      success: true,
      data: { agency },
    });
  }
}

export const publicAgencyController = new PublicAgencyController();
