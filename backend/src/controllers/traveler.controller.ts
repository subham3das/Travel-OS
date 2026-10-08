import { Request, Response } from 'express';
import { savedTravelerService } from '../services/savedTraveler.service.js';
import { ResponseUtil } from '../utils/response.util.js';
import { HTTP_STATUS } from '../constants/http.constant.js';
import { asyncHandler } from '../utils/asyncHandler.util.js';

export class TravelerController {
  public list = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const includeArchived = req.query.includeArchived === 'true';
    const travelers = await savedTravelerService.listTravelers(userId, includeArchived);
    return ResponseUtil.success(res, { travelers }, 'Saved travelers fetched successfully');
  });

  public add = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const traveler = await savedTravelerService.addTraveler(userId, req.body);
    return ResponseUtil.success(
      res,
      { traveler },
      'Saved traveler added successfully',
      HTTP_STATUS.CREATED
    );
  });

  public update = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const travelerId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const traveler = await savedTravelerService.updateTraveler(String(travelerId), userId, req.body);
    return ResponseUtil.success(res, { traveler }, 'Saved traveler updated successfully');
  });

  public archive = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const travelerId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const isArchived = req.body.isArchived !== false;
    const result = await savedTravelerService.archiveTraveler(String(travelerId), userId, isArchived);
    return ResponseUtil.success(res, result, result.message);
  });

  public delete = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const travelerId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await savedTravelerService.deleteTraveler(String(travelerId), userId);
    return ResponseUtil.success(res, result, result.message);
  });
}

export const travelerController = new TravelerController();
