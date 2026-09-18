import { z } from 'zod';

export const GetConversationsQuerySchema = z.object({
  search: z.string().optional(),
  filter: z
    .enum(['All', 'Unread', 'Bookings', 'Upcoming Trips', 'Completed Trips', 'VIP Customers', 'VIP', 'Archived'])
    .optional()
    .default('All'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
});

export const GetMessagesQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
  before: z.string().optional(),
});

export const SendMessageSchema = z.object({
  text: z.string().max(4000).optional().default(''),
  messageType: z.enum(['text', 'image', 'pdf', 'document', 'location']).default('text'),
  attachments: z
    .array(
      z.object({
        secureUrl: z.string().url(),
        publicId: z.string().optional(),
        fileName: z.string().optional(),
        fileSize: z.string().optional(),
        mimeType: z.string().optional(),
        fileType: z.enum(['image', 'pdf', 'document']),
      })
    )
    .optional(),
});

export const CreateAgencyPrivateNoteSchema = z.object({
  note: z.string().min(1, 'Note content cannot be empty').max(2000),
  bookingId: z.string().optional(),
});

export const UpdateAgencyPrivateNoteSchema = z.object({
  note: z.string().min(1, 'Note content cannot be empty').max(2000),
});
