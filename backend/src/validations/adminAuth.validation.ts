import { z } from 'zod';

export const AdminLoginSchema = z.object({
  email: z.string().email('Please enter a valid administrator email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

export const AdminGoogleLoginSchema = z.object({
  credential: z.string().optional(),
  idToken: z.string().optional(),
  accessToken: z.string().optional(),
}).refine(
  (data) => !!(data.credential || data.idToken || data.accessToken),
  { message: 'A valid Google token is required' }
);

export const AdminForgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid administrator email address').toLowerCase().trim(),
});

export const AdminResetPasswordSchema = z.object({
  token: z.string().min(1, 'Password reset token is required'),
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters long')
    .regex(/[A-Z]/, 'New password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'New password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'New password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'New password must contain at least one special character (@$!%*?&#)'),
});

export const CreateAdminSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Valid email is required').toLowerCase().trim(),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  role: z.enum([
    'SUPER_ADMIN',
    'ADMIN',
    'FINANCE_MANAGER',
    'OPERATIONS_MANAGER',
    'SUPPORT_MANAGER',
    'CONTENT_MANAGER',
  ]).default('ADMIN'),
  permissions: z.array(z.string()).default(['ALL']),
  authProvider: z.enum(['credentials', 'google', 'both']).default('credentials'),
  profileImage: z.string().optional(),
});
