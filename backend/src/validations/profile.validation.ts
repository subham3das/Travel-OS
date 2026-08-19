import { z } from 'zod';

export const UpdateProfileSchema = z.object({
  fullName: z.string().min(2).max(100).trim().optional(),
  phone: z.string().regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/, 'Invalid phone format').optional(),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_.-]+$/, 'Username can only contain alphanumeric characters, underscores, dots, or hyphens')
    .toLowerCase()
    .trim()
    .optional(),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').trim().optional(),
  homeCity: z.string().max(100).trim().optional(),
  dateOfBirth: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val))
    .refine((d) => d < new Date(), 'Date of birth must be in the past')
    .optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  preferredLanguage: z.string().max(50).optional(),
  country: z.string().max(100).optional(),
  isPublicProfile: z.boolean().optional(),
});

export const CheckUsernameParamsSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_.-]+$/)
    .toLowerCase(),
});
