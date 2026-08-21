import { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { ResponseUtil } from '../utils/response.util.js';
import { HTTP_STATUS } from '../constants/http.constant.js';
import { asyncHandler } from '../utils/asyncHandler.util.js';
import { BadRequestError } from '../utils/errors.util.js';

export class AuthController {
  public register = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    return ResponseUtil.success(
      res,
      result,
      'Customer registered successfully. Please verify your email address.',
      HTTP_STATUS.CREATED
    );
  });

  public login = asyncHandler(async (req: Request, res: Response) => {
    const meta = {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    };
    const result = await authService.login(req.body, meta);
    return ResponseUtil.success(res, result, 'Login successful');
  });

  public googleLogin = asyncHandler(async (req: Request, res: Response) => {
    const meta = {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    };
    const result = await authService.googleLogin(req.body, meta);
    return ResponseUtil.success(res, result, 'Google login successful');
  });

  public refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const rawToken = req.body.refreshToken || req.cookies?.refreshToken;
    if (!rawToken) {
      throw new BadRequestError('Refresh token is required');
    }
    const meta = {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    };
    const result = await authService.refreshToken(rawToken, meta);
    return ResponseUtil.success(res, result, 'Token refreshed successfully');
  });

  public logout = asyncHandler(async (req: Request, res: Response) => {
    const rawToken = req.body.refreshToken || req.cookies?.refreshToken;
    await authService.logout(rawToken);
    return ResponseUtil.success(res, { loggedOut: true }, 'Logged out successfully');
  });

  public forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.forgotPassword(req.body.email);
    return ResponseUtil.success(res, result, result.message);
  });

  public resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.resetPassword(req.body.token, req.body.password);
    return ResponseUtil.success(res, result, result.message);
  });

  public changePassword = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await authService.changePassword(
      userId,
      req.body.currentPassword,
      req.body.newPassword
    );
    return ResponseUtil.success(res, result, result.message);
  });

  public verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.verifyEmail(req.body.token);
    return ResponseUtil.success(res, result, result.message);
  });

  public getMe = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const user = await authService.getCurrentUser(userId);
    return ResponseUtil.success(res, { user }, 'User profile fetched successfully');
  });
}

export const authController = new AuthController();
