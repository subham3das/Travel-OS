import { Request, Response } from 'express';
import { agencyDashboardService } from '../services/agencyDashboard.service.js';
import { ResponseUtil } from '../utils/response.util.js';
import { HTTP_STATUS } from '../constants/http.constant.js';

export class AgencyDashboardController {
  /**
   * GET /api/agencies/dashboard
   * Unified Aggregation Endpoint for Authenticated Agency Dashboard
   */
  public getDashboard = async (req: Request, res: Response): Promise<void> => {
    try {
      const agency = req.agency;
      if (!agency) {
        ResponseUtil.error(res, 'Agency context not found.', HTTP_STATUS.UNAUTHORIZED);
        return;
      }

      const range = String(req.query.range || 'This Month');
      const data = await agencyDashboardService.getDashboardData(agency, range);

      ResponseUtil.success(res, data, 'Agency dashboard data retrieved successfully.');
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to retrieve dashboard data.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  /**
   * GET /api/agencies/dashboard/recent-bookings
   */
  public getRecentBookings = async (req: Request, res: Response): Promise<void> => {
    try {
      const agency = req.agency;
      if (!agency) {
        ResponseUtil.error(res, 'Agency context not found.', HTTP_STATUS.UNAUTHORIZED);
        return;
      }

      const data = await agencyDashboardService.getDashboardData(agency);
      ResponseUtil.success(res, data.recentBookings, 'Recent bookings retrieved successfully.');
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to retrieve recent bookings.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  /**
   * GET /api/agencies/dashboard/upcoming-departures
   */
  public getUpcomingDepartures = async (req: Request, res: Response): Promise<void> => {
    try {
      const agency = req.agency;
      if (!agency) {
        ResponseUtil.error(res, 'Agency context not found.', HTTP_STATUS.UNAUTHORIZED);
        return;
      }

      const data = await agencyDashboardService.getDashboardData(agency);
      ResponseUtil.success(res, data.departures, 'Upcoming departures retrieved successfully.');
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to retrieve departures.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };
}

export const agencyDashboardController = new AgencyDashboardController();
