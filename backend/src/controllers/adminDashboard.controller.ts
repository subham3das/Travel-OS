import { Request, Response } from 'express';
import { adminDashboardService } from '../services/adminDashboard.service.js';
import { asyncHandler } from '../utils/asyncHandler.util.js';
import { ResponseUtil } from '../utils/response.util.js';
import { HTTP_STATUS } from '../constants/http.constant.js';

export class AdminDashboardController {
  public getStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const stats = await adminDashboardService.getStats();
    ResponseUtil.success(res, stats, 'Dashboard stats retrieved successfully', HTTP_STATUS.OK);
  });

  public getCharts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const range = (req.query.range as string) || '30d';
    const charts = await adminDashboardService.getCharts(range);
    ResponseUtil.success(res, charts, 'Dashboard charts retrieved successfully', HTTP_STATUS.OK);
  });

  public getRecentActivities = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const limit = Number(req.query.limit) || 5;
    const activities = await adminDashboardService.getRecentActivities(limit);
    ResponseUtil.success(res, activities, 'Recent activities retrieved successfully', HTTP_STATUS.OK);
  });

  public getLatestTransactions = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const limit = Number(req.query.limit) || 5;
    const transactions = await adminDashboardService.getLatestTransactions(limit);
    ResponseUtil.success(res, transactions, 'Latest transactions retrieved successfully', HTTP_STATUS.OK);
  });

  public getPendingApprovals = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const limit = Number(req.query.limit) || 5;
    const approvals = await adminDashboardService.getPendingApprovals(limit);
    ResponseUtil.success(res, approvals, 'Pending approvals retrieved successfully', HTTP_STATUS.OK);
  });

  public getSystemHealth = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const health = await adminDashboardService.getSystemHealth();
    ResponseUtil.success(res, health, 'System health retrieved successfully', HTTP_STATUS.OK);
  });

  public getLive = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const live = await adminDashboardService.getLiveActivity();
    ResponseUtil.success(res, live, 'Live activity feed retrieved successfully', HTTP_STATUS.OK);
  });

  public getActiveTrips = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const limit = Number(req.query.limit) || 4;
    const trips = await adminDashboardService.getActiveTrips(limit);
    ResponseUtil.success(res, trips, 'Active trips retrieved successfully', HTTP_STATUS.OK);
  });

  public getPaymentQueue = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const limit = Number(req.query.limit) || 4;
    const queue = await adminDashboardService.getPaymentQueue(limit);
    ResponseUtil.success(res, queue, 'Payment queue retrieved successfully', HTTP_STATUS.OK);
  });

  public getSupportQueue = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const limit = Number(req.query.limit) || 4;
    const queue = await adminDashboardService.getSupportQueue(limit);
    ResponseUtil.success(res, queue, 'Support queue retrieved successfully', HTTP_STATUS.OK);
  });

  public getQuickActions = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const actions = adminDashboardService.getQuickActions();
    ResponseUtil.success(res, actions, 'Quick actions retrieved successfully', HTTP_STATUS.OK);
  });
}

export const adminDashboardController = new AdminDashboardController();
