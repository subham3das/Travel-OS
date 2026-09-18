import { z } from 'zod';

export const AgencyForgotPasswordSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid registered agency email address')
    .toLowerCase()
    .trim(),
});

export const AgencyResetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Password reset token is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least 1 lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least 1 number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least 1 special character'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const AgencyChangePasswordSchema = z
  .object({
    currentPassword: z.string().optional(),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters long')
      .regex(/[A-Z]/, 'New password must contain at least 1 uppercase letter')
      .regex(/[a-z]/, 'New password must contain at least 1 lowercase letter')
      .regex(/[0-9]/, 'New password must contain at least 1 number')
      .regex(/[^A-Za-z0-9]/, 'New password must contain at least 1 special character'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New password and confirmation do not match',
    path: ['confirmPassword'],
  });
