import { z } from 'zod';

export const AdminPackageQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  status: z.string().optional(),
  approvalStatus: z.string().optional(),
  category: z.string().optional(),
  destination: z.string().optional(),
  destinationCountry: z.string().optional(),
  destinationRegion: z.string().optional(),
  agency: z.string().optional(),
  departureMonth: z.string().optional(),
  rating: z.string().optional(),
  priceRange: z.string().optional(),
  duration: z.string().optional(),
  sortBy: z.enum(['name', 'title', 'price', 'duration', 'bookings', 'rating', 'lastUpdated', 'seats', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const AdminCreatePackageSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  agencyId: z.string().optional(),
  agencyName: z.string().min(2, 'Agency name is required'),
  agencyLogo: z.string().optional(),
  destination: z.string().min(2, 'Destination is required'),
  destinationCountry: z.string().optional(),
  destinationRegion: z.string().optional(),
  destinationFlag: z.string().optional(),
  category: z.string().default('Adventure'),
  durationDays: z.number().min(1).default(3),
  durationNights: z.number().min(0).default(2),
  price: z.number().min(0, 'Price must be positive'),
  originalPrice: z.number().optional(),
  discountPercent: z.string().optional(),
  availableSeats: z.number().min(0).default(20),
  totalSeats: z.number().min(1).default(20),
  featuredImage: z.string().optional(),
  coverImage: z.string().optional(),
  galleryImages: z.array(z.string()).optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'DRAFT']).default('APPROVED'),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  inclusions: z.array(z.string()).optional(),
  exclusions: z.array(z.string()).optional(),
  itinerary: z
    .array(
      z.object({
        day: z.number(),
        title: z.string(),
        description: z.string().optional(),
        meals: z.string().optional(),
        stay: z.string().optional(),
      })
    )
    .optional(),
});

export const AdminUpdatePackageSchema = AdminCreatePackageSchema.partial();

export const AdminPackageApprovalSchema = z.object({
  approvalStatus: z.enum(['APPROVED', 'REJECTED', 'PENDING']),
  notes: z.string().optional(),
});

export const AdminBulkPackageActionSchema = z.object({
  packageIds: z.array(z.string()).min(1, 'At least one package must be selected'),
  action: z.enum(['approve', 'reject', 'archive', 'feature', 'unfeature', 'delete']),
});
