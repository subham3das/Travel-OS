import mongoose from 'mongoose';
import {
  TravelProfileModel,
  ITravelProfile,
  computeProfileCompletion,
} from '../models/travelProfile.model.js';
import { SavedTravelerModel } from '../models/savedTraveler.model.js';
import { UserModel } from '../models/user.model.js';
import { NotFoundError } from '../utils/errors.util.js';
import { logger } from '../config/logger.config.js';

export class TravelProfileService {
  /**
   * Fetch or auto-initialize Travel Profile for user
   */
  public async getProfile(userId: string) {
    let profile = await TravelProfileModel.findOne({ userId });

    if (!profile) {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new NotFoundError('User account not found');
      }

      const initialData: Partial<ITravelProfile> = {
        userId: new mongoose.Types.ObjectId(userId),
        fullName: user.fullName || 'Traveler',
        email: user.email || '',
        phone: user.phone || '',
        gender: (user.gender as any) || 'male',
        dob: user.dateOfBirth,
        address: user.homeCity || '',
        city: user.homeCity || '',
        state: user.state || '',
        country: user.country || 'India',
        emergencyContact: {
          name: '',
          phone: user.emergencyContact || '',
          relationship: 'Emergency Contact',
        },
        travelPreferences: {
          seatPreference: 'Window',
          mealPreference: 'Vegetarian',
          specialAssistance: '',
        },
        verificationStatus: user.isKycVerified ? 'VERIFIED' : 'UNVERIFIED',
      };

      const completion = computeProfileCompletion(initialData);
      initialData.completionPercentage = completion.completionPercentage;
      initialData.missingFields = completion.missingFields;

      profile = await TravelProfileModel.create(initialData);
      logger.info('✨ Auto-initialized Travel Profile for user: %s', userId);
    }

    // Ensure Self traveler exists in saved_travelers
    await this.ensureSelfTraveler(userId, profile);

    const savedTravelersCount = await SavedTravelerModel.countDocuments({
      userId,
      isDeleted: false,
    });

    const completion = computeProfileCompletion(profile);

    return {
      profile: {
        id: profile._id,
        fullName: profile.fullName,
        dob: profile.dob,
        gender: profile.gender,
        nationality: profile.nationality,
        phone: profile.phone,
        email: profile.email,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        country: profile.country,
        pin: profile.pin,
        emergencyContact: profile.emergencyContact,
        bloodGroup: profile.bloodGroup,
        medicalConditions: profile.medicalConditions,
        allergies: profile.allergies,
        aadhaar: profile.aadhaar,
        voterId: profile.voterId,
        drivingLicence: profile.drivingLicence,
        passport: profile.passport,
        travelPreferences: profile.travelPreferences,
        verificationStatus: profile.verificationStatus,
        rejectionReason: profile.rejectionReason || '',
        completionPercentage: completion.completionPercentage,
        missingFields: completion.missingFields,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
      stats: {
        completionPercentage: completion.completionPercentage,
        missingFields: completion.missingFields,
        savedTravelersCount,
        isVerified: profile.verificationStatus === 'VERIFIED',
      },
    };
  }

  /**
   * Update Travel Profile and keep 'self' saved traveler in sync
   */
  public async updateProfile(userId: string, updateData: Partial<ITravelProfile>) {
    let profile = await TravelProfileModel.findOne({ userId });

    if (!profile) {
      await this.getProfile(userId);
      profile = await TravelProfileModel.findOne({ userId });
    }

    if (!profile) {
      throw new NotFoundError('Travel Profile could not be initialized');
    }

    // Apply updates
    Object.assign(profile, updateData);

    const completion = computeProfileCompletion(profile);
    profile.completionPercentage = completion.completionPercentage;
    profile.missingFields = completion.missingFields;

    // If user uploaded docs while status was REJECTED, move back to PENDING for review
    const hasDocUpdate =
      updateData.aadhaar?.frontUrl ||
      updateData.voterId?.frontUrl ||
      updateData.drivingLicence?.frontUrl ||
      updateData.passport?.documentUrl;

    if (hasDocUpdate && profile.verificationStatus === 'REJECTED') {
      profile.verificationStatus = 'PENDING';
      profile.rejectionReason = '';
    }

    await profile.save();
    logger.info('💾 Travel Profile updated for user: %s (Completion: %d%)', userId, profile.completionPercentage);

    // Synchronize the 'Self' saved traveler automatically
    await this.syncSelfTraveler(userId, profile);

    const savedTravelersCount = await SavedTravelerModel.countDocuments({
      userId,
      isDeleted: false,
    });

    return {
      profile: {
        id: profile._id,
        fullName: profile.fullName,
        dob: profile.dob,
        gender: profile.gender,
        nationality: profile.nationality,
        phone: profile.phone,
        email: profile.email,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        country: profile.country,
        pin: profile.pin,
        emergencyContact: profile.emergencyContact,
        bloodGroup: profile.bloodGroup,
        medicalConditions: profile.medicalConditions,
        allergies: profile.allergies,
        aadhaar: profile.aadhaar,
        voterId: profile.voterId,
        drivingLicence: profile.drivingLicence,
        passport: profile.passport,
        travelPreferences: profile.travelPreferences,
        verificationStatus: profile.verificationStatus,
        rejectionReason: profile.rejectionReason || '',
        completionPercentage: profile.completionPercentage,
        missingFields: profile.missingFields,
        updatedAt: profile.updatedAt,
      },
      stats: {
        completionPercentage: profile.completionPercentage,
        missingFields: profile.missingFields,
        savedTravelersCount,
        isVerified: profile.verificationStatus === 'VERIFIED',
      },
    };
  }

  /**
   * Internal helper: Guarantee a 'self' traveler exists in saved_travelers
   */
  private async ensureSelfTraveler(userId: string, profile: ITravelProfile) {
    const existingSelf = await SavedTravelerModel.findOne({
      userId,
      relationship: 'self',
      isDeleted: false,
    });

    if (!existingSelf) {
      await SavedTravelerModel.create({
        userId: new mongoose.Types.ObjectId(userId),
        relationship: 'self',
        fullName: profile.fullName || 'Traveler',
        dob: profile.dob || new Date('1995-01-01'),
        gender: profile.gender || 'male',
        nationality: profile.nationality || 'Indian',
        phone: profile.phone || '',
        email: profile.email || '',
        address: profile.address || '',
        emergencyContact: profile.emergencyContact,
        bloodGroup: profile.bloodGroup || '',
        medicalNotes: [profile.medicalConditions, profile.allergies].filter(Boolean).join('; '),
        aadhaar: profile.aadhaar,
        voterId: profile.voterId,
        drivingLicence: profile.drivingLicence,
        passport: profile.passport,
      });
      logger.info('👥 Auto-created Self saved traveler for user %s', userId);
    }
  }

  /**
   * Internal helper: Keep the 'self' traveler in sync with TravelProfile
   */
  private async syncSelfTraveler(userId: string, profile: ITravelProfile) {
    const existingSelf = await SavedTravelerModel.findOne({
      userId,
      relationship: 'self',
      isDeleted: false,
    });

    const payload = {
      fullName: profile.fullName,
      dob: profile.dob || existingSelf?.dob || new Date('1995-01-01'),
      gender: profile.gender || 'male',
      nationality: profile.nationality || 'Indian',
      phone: profile.phone,
      email: profile.email,
      address: profile.address,
      emergencyContact: profile.emergencyContact,
      bloodGroup: profile.bloodGroup,
      medicalNotes: [profile.medicalConditions, profile.allergies].filter(Boolean).join('; '),
      aadhaar: profile.aadhaar,
      voterId: profile.voterId,
      drivingLicence: profile.drivingLicence,
      passport: profile.passport,
    };

    if (existingSelf) {
      await SavedTravelerModel.updateOne({ _id: existingSelf._id }, { $set: payload });
    } else {
      await SavedTravelerModel.create({
        userId: new mongoose.Types.ObjectId(userId),
        relationship: 'self',
        ...payload,
      });
    }
  }
}

export const travelProfileService = new TravelProfileService();
