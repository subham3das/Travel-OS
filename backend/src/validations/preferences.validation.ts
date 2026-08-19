import { z } from 'zod';

export const TravelPreferencesSchema = z.object({
  travelInterests: z.array(z.string()).min(1, 'Please select at least 1 travel interest'),
  travelStyle: z.array(z.string()).min(1, 'Please select at least 1 travel style'),
  budgetPreference: z.string().min(1, 'Budget preference is required'),
  preferredTripDuration: z.array(z.string()).min(1, 'Preferred trip duration is required'),
  preferredTransportation: z.array(z.string()).min(1, 'Preferred transportation is required'),
  foodPreference: z.string().min(1, 'Food preference is required'),
  accessibilityRequirements: z.string().max(300).optional(),
});

export const NotificationPreferencesSchema = z.object({
  pushNotifications: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
  bookingUpdates: z.boolean().optional(),
  tripReminders: z.boolean().optional(),
  travelRecommendations: z.boolean().optional(),
  offersAndDiscounts: z.boolean().optional(),
  communityActivity: z.boolean().optional(),
  friendRequests: z.boolean().optional(),
  messages: z.boolean().optional(),
  marketingEmails: z.boolean().optional(),
});

export const PrivacyPreferencesSchema = z.object({
  publicProfile: z.boolean().optional(),
  showBio: z.boolean().optional(),
  showHomeCity: z.boolean().optional(),
  showTravelStats: z.boolean().optional(),
  allowMessages: z.boolean().optional(),
  allowFollowers: z.boolean().optional(),
  appearInSearch: z.boolean().optional(),
  showOnlineStatus: z.boolean().optional(),
});
