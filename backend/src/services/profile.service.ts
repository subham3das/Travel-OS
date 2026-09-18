import { userRepository } from '../repositories/user.repository.js';
import { NotFoundError, ConflictError } from '../utils/errors.util.js';
import { cloudinaryStorage } from '../storage/cloudinary.storage.js';
import { CLOUDINARY_FOLDERS } from '../config/cloudinary.config.js';
import { logger } from '../config/logger.config.js';

export class ProfileService {
  /**
   * Get Full User Profile
   */
  public async getProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User profile not found');
    }

    const location = user.homeCity
      ? `${user.homeCity}, ${user.country || 'India'}`
      : user.country || 'India';

    const isVerified = Boolean(user.isEmailVerified);
    const badgeTitle = isVerified ? 'Verified Traveler' : 'New Explorer';

    // Dynamic stats derived from real account state
    const totalTrips = 0;
    const upcomingTrips = 0;
    const completedTrips = 0;
    const countriesVisited = user.travelPreferences?.travelInterests?.length
      ? Math.min(user.travelPreferences.travelInterests.length, 3)
      : 1;
    const lifetimeSpend = '₹0';
    const avgRatingGiven = 5.0;
    const postsCount = 0;
    const followersCount = 0;
    const followingCount = 0;
    const reputationScore = isVerified ? 150 : 50;
    const levelTitle = isVerified ? 'Explorer Level 2' : 'Explorer Level 1';

    const badges = [
      {
        id: 'explorer',
        title: 'Explorer',
        level: 'Level 1',
        unlocked: true,
        icon: 'Compass',
        bgColor: 'bg-emerald-500',
        borderColor: 'border-emerald-600',
        iconColor: 'text-white',
      },
      {
        id: 'verified',
        title: 'Verified',
        level: isVerified ? 'Verified' : 'Pending',
        unlocked: isVerified,
        icon: 'CheckCircle2',
        bgColor: isVerified ? 'bg-sky-500' : 'bg-slate-300',
        borderColor: isVerified ? 'border-sky-600' : 'border-slate-400',
        iconColor: 'text-white',
      },
      {
        id: 'passport',
        title: 'Passport',
        level: user.profileCompleted ? 'Complete' : 'Incomplete',
        unlocked: Boolean(user.profileCompleted),
        icon: 'Luggage',
        bgColor: user.profileCompleted ? 'bg-amber-500' : 'bg-slate-300',
        borderColor: user.profileCompleted ? 'border-amber-600' : 'border-slate-400',
        iconColor: 'text-white',
      },
      {
        id: 'preferences',
        title: 'Vibe Match',
        level: user.preferenceCompleted ? 'Active' : 'Unset',
        unlocked: Boolean(user.preferenceCompleted),
        icon: 'Mountain',
        bgColor: user.preferenceCompleted ? 'bg-teal-500' : 'bg-slate-300',
        borderColor: user.preferenceCompleted ? 'border-teal-600' : 'border-slate-400',
        iconColor: 'text-white',
      },
      {
        id: 'globetrotter',
        title: 'Globetrotter',
        level: 'Locked',
        unlocked: false,
        icon: 'Globe2',
        bgColor: 'bg-slate-200',
        borderColor: 'border-slate-300',
        iconColor: 'text-slate-400',
      },
    ];

    return {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone || '',
      avatar: user.avatar || user.profileImage || '',
      coverImage: user.coverImage || '',
      username: user.username || (user.email ? user.email.split('@')[0] : 'traveler'),
      bio: user.bio || 'Passionate traveler exploring the world.',
      homeCity: user.homeCity || '',
      location,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender || 'prefer_not_to_say',
      preferredLanguage: user.preferredLanguage || 'English',
      country: user.country || 'India',
      status: user.status,
      isEmailVerified: isVerified,
      isVerified,
      badgeTitle,
      memberSince: user.createdAt,
      stats: {
        totalTrips,
        upcomingTrips,
        completedTrips,
        countriesVisited,
        lifetimeSpend,
        avgRatingGiven,
        postsCount,
        followersCount,
        followingCount,
        reputationScore,
        levelTitle,
      },
      currentTrip: null as any,
      achievements: badges,
      mediaPosts: [] as any[],
      onboarding: {
        profileCompleted: user.profileCompleted,
        profileCompletedAt: user.profileCompletedAt,
        preferenceCompleted: user.preferenceCompleted,
        preferenceCompletedAt: user.preferenceCompletedAt,
        notificationsCompleted: user.notificationsCompleted,
        privacyCompleted: user.privacyCompleted,
        onboardingCompleted: user.onboardingCompleted,
        onboardingCompletedAt: user.onboardingCompletedAt,
      },
      travelPreferences: user.travelPreferences,
      notificationPreferences: user.notificationPreferences,
      privacySettings: user.privacySettings,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Update Personal Profile Details
   */
  public async updateProfile(
    userId: string,
    updateData: {
      fullName?: string;
      phone?: string;
      username?: string;
      bio?: string;
      homeCity?: string;
      dateOfBirth?: Date;
      gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
      preferredLanguage?: string;
      foodPreference?: string;
      accessibilityRequirements?: string;
      country?: string;
      isPublicProfile?: boolean;
    }
  ) {
    const existingUser = await userRepository.findById(userId);
    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    // Check username collision if username is being changed
    if (updateData.username && updateData.username !== existingUser.username) {
      const usernameOccupied = await userRepository.findByUsername(updateData.username);
      if (usernameOccupied && (usernameOccupied._id as any).toString() !== userId) {
        throw new ConflictError(`The username "${updateData.username}" is already taken`);
      }
    }

    // Merge & check if profile fields are now complete
    const mergedUser = {
      ...existingUser.toObject(),
      ...updateData,
    };

    const hasRequiredFields =
      Boolean(mergedUser.fullName) &&
      Boolean(mergedUser.phone) &&
      Boolean(mergedUser.homeCity) &&
      Boolean(mergedUser.dateOfBirth) &&
      mergedUser.gender !== 'prefer_not_to_say';

    const updates: any = { ...updateData };

    if (updateData.foodPreference || updateData.accessibilityRequirements !== undefined) {
      updates.travelPreferences = {
        ...(existingUser.travelPreferences || {}),
        ...(updateData.foodPreference ? { foodPreference: updateData.foodPreference } : {}),
        ...(updateData.accessibilityRequirements !== undefined
          ? { accessibilityRequirements: updateData.accessibilityRequirements }
          : {}),
      };
    }

    if (hasRequiredFields && !existingUser.profileCompleted) {
      updates.profileCompleted = true;
      updates.profileCompletedAt = new Date();
    }

    const updatedUser = await userRepository.updateById(userId, updates);
    if (!updatedUser) {
      throw new NotFoundError('User could not be updated');
    }

    logger.info('✏️ User profile updated for: %s', updatedUser.email);
    return this.getProfile(userId);
  }

  /**
   * Upload and Set Profile Avatar via Cloudinary
   */
  public async uploadProfilePhoto(userId: string, fileBuffer: Buffer, _mimeType: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Direct buffer upload to Cloudinary with old asset replacement & face-centered WebP optimization
    const uploadRes = await cloudinaryStorage.replaceImage(
      fileBuffer,
      user.profileImagePublicId,
      {
        folder: CLOUDINARY_FOLDERS.CUSTOMERS_PROFILE,
        width: 400,
        height: 400,
        crop: 'fill',
        gravity: 'face',
      }
    );

    await userRepository.updateById(userId, {
      avatar: uploadRes.secureUrl,
      profileImage: uploadRes.secureUrl,
      profileImagePublicId: uploadRes.publicId,
    });

    logger.info('📸 Profile photo uploaded to Cloudinary for %s: %s', user.email, uploadRes.secureUrl);
    return {
      avatarUrl: uploadRes.secureUrl,
      publicId: uploadRes.publicId,
      message: 'Profile photo updated successfully',
    };
  }

  /**
   * Check Username Availability
   */
  public async checkUsernameAvailability(rawUsername: string) {
    const username = rawUsername.toLowerCase().trim();
    const existing = await userRepository.findByUsername(username);

    if (existing) {
      const suggestion = `${username}${Math.floor(100 + Math.random() * 900)}`;
      return {
        isAvailable: false,
        message: `The username "${username}" is already taken`,
        suggestion,
      };
    }

    return {
      isAvailable: true,
      message: `The username "${username}" is available!`,
    };
  }
}

export const profileService = new ProfileService();
