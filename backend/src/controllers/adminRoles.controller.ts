import { Request, Response } from 'express';
import { adminRolesService } from '../services/adminRoles.service.js';
import { asyncHandler } from '../utils/asyncHandler.util.js';
import { ResponseUtil } from '../utils/response.util.js';
import { HTTP_STATUS } from '../constants/http.constant.js';

export class AdminRolesController {
  private getAdminActor(req: Request) {
    return {
      id: (req.admin as any)?._id?.toString() || req.user?.userId || 'unknown',
      name: (req.admin as any)?.fullName || req.user?.email || 'Super Admin',
    };
  }

  public getDashboard = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const stats = await adminRolesService.getDashboardStats();
    ResponseUtil.success(res, stats, 'Dashboard KPI stats retrieved successfully', HTTP_STATUS.OK);
  });

  public getRoles = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { tab, search } = req.query as { tab?: string; search?: string };
    const roles = await adminRolesService.getRoles(tab, search);
    ResponseUtil.success(res, roles, 'Roles list retrieved successfully', HTTP_STATUS.OK);
  });

  public getPermissions = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { roleId } = req.query as { roleId?: string };
    const matrix = await adminRolesService.getPermissionsMatrix(roleId);
    ResponseUtil.success(res, matrix, 'Permissions matrix retrieved successfully', HTTP_STATUS.OK);
  });

  public updateRolePermission = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params.id);
    const { moduleId, field, value } = req.body;
    const actor = this.getAdminActor(req);

    const updated = await adminRolesService.updatePermission(id, moduleId, field, value, actor);
    ResponseUtil.success(res, updated, 'Role permission updated successfully', HTTP_STATUS.OK);
  });

  public createRole = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { name, description, securityLevel } = req.body;
    const actor = this.getAdminActor(req);

    const role = await adminRolesService.createRole(name, description, securityLevel, actor);
    ResponseUtil.success(res, role, 'Role created successfully', HTTP_STATUS.CREATED);
  });

  public duplicateRole = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params.id);
    const actor = this.getAdminActor(req);

    const role = await adminRolesService.duplicateRole(id, actor);
    ResponseUtil.success(res, role, 'Role duplicated successfully', HTTP_STATUS.CREATED);
  });

  public deleteRole = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params.id);
    const actor = this.getAdminActor(req);

    await adminRolesService.deleteRole(id, actor);
    ResponseUtil.success(res, null, 'Role deleted successfully', HTTP_STATUS.OK);
  });

  public assignAdmins = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params.id);
    const { adminIds } = req.body;
    const actor = this.getAdminActor(req);

    await adminRolesService.assignAdminsToRole(id, adminIds, actor);
    ResponseUtil.success(res, null, 'Admins assigned successfully', HTTP_STATUS.OK);
  });

  public getAdminsList = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { search, department } = req.query as { search?: string; department?: string };
    const admins = await adminRolesService.getAdminsList(search, department);
    ResponseUtil.success(res, admins, 'Authorized admins list retrieved successfully', HTTP_STATUS.OK);
  });

  public updateAdmin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params.id);
    const actor = this.getAdminActor(req);

    const updated = await adminRolesService.updateAdminUser(id, req.body, actor);
    ResponseUtil.success(res, updated, 'Admin privileges updated successfully', HTTP_STATUS.OK);
  });

  public getSessions = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const sessions = await adminRolesService.getSessions();
    ResponseUtil.success(res, sessions, 'Active sessions retrieved successfully', HTTP_STATUS.OK);
  });

  public terminateAllSessions = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const actor = this.getAdminActor(req);
    const count = await adminRolesService.terminateAllSessions(actor);
    ResponseUtil.success(res, { count }, `Terminated ${count} active sessions`, HTTP_STATUS.OK);
  });

  public getActivity = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const limit = req.query.limit ? Number(req.query.limit) : 20;
    const activities = await adminRolesService.getActivity(limit);
    ResponseUtil.success(res, activities, 'Admin activity stream retrieved successfully', HTTP_STATUS.OK);
  });

  public getAuditSummary = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const summary = await adminRolesService.getAuditSummary();
    ResponseUtil.success(res, summary, 'Audit summary retrieved successfully', HTTP_STATUS.OK);
  });

  public getAccessRequests = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const requests = await adminRolesService.getAccessRequests();
    ResponseUtil.success(res, requests, 'Access requests retrieved successfully', HTTP_STATUS.OK);
  });

  public updateAccessRequest = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params.id);
    const { status } = req.body;
    const actor = this.getAdminActor(req);

    const updated = await adminRolesService.updateAccessRequestStatus(id, status, actor);
    ResponseUtil.success(res, updated, `Access request ${status.toLowerCase()} successfully`, HTTP_STATUS.OK);
  });
}

export const adminRolesController = new AdminRolesController();
