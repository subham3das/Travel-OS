import { z } from 'zod';

export const AdminBookingQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  bookingStatus: z.string().optional(),
  paymentStatus: z.string().optional(),
  package: z.string().optional(),
  agency: z.string().optional(),
  destination: z.string().optional(),
  travelDate: z.string().optional(),
  bookingDate: z.string().optional(),
  dateRange: z.string().optional(),
  amountRange: z.string().optional(),
  user: z.string().optional(),
  sortBy: z.enum(['bookingId', 'traveler', 'package', 'amount', 'bookingDate', 'status', 'bookedAtDate', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const AdminUpdateBookingSchema = z.object({
  status: z.enum(['CONFIRMED', 'PENDING', 'CANCELLED', 'COMPLETED']).optional(),
  paymentStatus: z.enum(['PAID', 'PARTIAL', 'PENDING', 'REFUNDED']).optional(),
  tripStartDate: z.string().optional(),
  tripEndDate: z.string().optional(),
  destination: z.string().optional(),
  packageName: z.string().optional(),
  totalAmount: z.number().optional(),
  paidAmount: z.number().optional(),
  travelers: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string(),
        age: z.number().optional(),
        gender: z.enum(['Male', 'Female', 'Other']).optional(),
        passportNumber: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
        isPrimary: z.boolean().optional(),
      })
    )
    .optional(),
  notes: z.string().optional(),
});

export const AdminBulkBookingActionSchema = z.object({
  bookingIds: z.array(z.string()).min(1, 'At least one booking must be selected'),
  action: z.enum(['confirm', 'cancel', 'complete', 'delete']),
});
