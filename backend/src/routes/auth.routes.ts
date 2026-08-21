import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import {
  RegisterSchema,
  LoginSchema,
  RefreshTokenSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  ChangePasswordSchema,
  VerifyEmailSchema,
} from '../validations/auth.validation.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authRateLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new customer account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, email, phone, password, confirmPassword, acceptTerms]
 *             properties:
 *               fullName: { type: string, example: "John Doe" }
 *               email: { type: string, example: "johndoe@example.com" }
 *               phone: { type: string, example: "+919876543210" }
 *               password: { type: string, example: "SecurePass@123" }
 *               confirmPassword: { type: string, example: "SecurePass@123" }
 *               acceptTerms: { type: boolean, example: true }
 *     responses:
 *       201:
 *         description: Registered successfully
 */
router.post(
  '/register',
  authRateLimiter,
  validateRequest({ body: RegisterSchema }),
  authController.register
);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Customer Login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "johndoe@example.com" }
 *               password: { type: string, example: "SecurePass@123" }
 *     responses:
 *       200:
 *         description: Login successful with JWT tokens
 */
router.post(
  '/login',
  authRateLimiter,
  validateRequest({ body: LoginSchema }),
  authController.login
);

/**
 * @openapi
 * /auth/google:
 *   post:
 *     summary: Google OAuth Customer Login or Sign-up
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               credential: { type: string, description: "Google ID Token / Credential" }
 *               email: { type: string }
 *               name: { type: string }
 *               googleId: { type: string }
 *               avatar: { type: string }
 *     responses:
 *       200:
 *         description: Google authentication successful
 */
router.post(
  '/google',
  authRateLimiter,
  authController.googleLogin
);

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Refresh Access Token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200:
 *         description: New access and refresh token pair
 */
router.post(
  '/refresh',
  validateRequest({ body: RefreshTokenSchema }),
  authController.refreshToken
);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Logout Current Session
 *     tags: [Authentication]
 */
router.post('/logout', authController.logout);

/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     summary: Request Password Reset Link
 *     tags: [Authentication]
 */
router.post(
  '/forgot-password',
  authRateLimiter,
  validateRequest({ body: ForgotPasswordSchema }),
  authController.forgotPassword
);

/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     summary: Reset Password with Token
 *     tags: [Authentication]
 */
router.post(
  '/reset-password',
  authRateLimiter,
  validateRequest({ body: ResetPasswordSchema }),
  authController.resetPassword
);

/**
 * @openapi
 * /auth/change-password:
 *   post:
 *     summary: Change Password (Authenticated)
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 */
router.post(
  '/change-password',
  authenticate,
  validateRequest({ body: ChangePasswordSchema }),
  authController.changePassword
);

/**
 * @openapi
 * /auth/verify-email:
 *   post:
 *     summary: Verify Customer Email
 *     tags: [Authentication]
 */
router.post(
  '/verify-email',
  validateRequest({ body: VerifyEmailSchema }),
  authController.verifyEmail
);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Get Current Authenticated Customer Profile
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 */
router.get('/me', authenticate, authController.getMe);

export default router;
