import { z } from 'zod';

export const SavedTravelerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100).trim(),
  dob: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val))
    .refine((d) => d < new Date(), 'Date of birth must be in the past'),
  gender: z.enum(['male', 'female', 'other']),
  relationship: z.enum(['self', 'spouse', 'child', 'parent', 'sibling', 'friend', 'other']),
  nationality: z.string().min(2).default('Indian'),
  passportNumber: z.string().max(20).trim().optional(),
  aadhaarNumber: z.string().max(16).trim().optional(),
  panNumber: z.string().max(10).trim().optional(),
  emergencyContact: z
    .object({
      name: z.string().max(100).optional(),
      phone: z.string().regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/).optional(),
      relationship: z.string().max(50).optional(),
    })
    .optional(),
});

export const UpdateSavedTravelerSchema = SavedTravelerSchema.partial();
