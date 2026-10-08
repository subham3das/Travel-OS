import mongoose from 'mongoose';
import { SavedTravelerModel, ISavedTraveler } from '../models/savedTraveler.model.js';
import { NotFoundError } from '../utils/errors.util.js';
import { logger } from '../config/logger.config.js';

export class SavedTravelerService {
  /**
   * List all saved travelers for user
   */
  public async listTravelers(userId: string, includeArchived: boolean = false) {
    const filter: any = {
      userId: new mongoose.Types.ObjectId(userId),
      isDeleted: false,
    };
    if (!includeArchived) {
      filter.isArchived = false;
    }

    const travelers = await SavedTravelerModel.find(filter)
      .sort({ relationship: 1, createdAt: -1 })
      .exec();

    return travelers.map((t) => ({
      id: t._id,
      fullName: t.fullName,
      dob: t.dob,
      gender: t.gender,
      relationship: t.relationship,
      nationality: t.nationality,
      phone: t.phone || '',
      email: t.email || '',
      address: t.address || '',
      emergencyContact: t.emergencyContact || null,
      medicalNotes: t.medicalNotes || '',
      bloodGroup: t.bloodGroup || '',
      passport: t.passport || null,
      aadhaar: t.aadhaar || null,
      pan: t.pan || null,
      photoUrl: t.photoUrl || '',
      isArchived: Boolean(t.isArchived),
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));
  }

  /**
   * Add a new saved traveler
   */
  public async addTraveler(userId: string, data: Partial<ISavedTraveler>) {
    const newTraveler = await SavedTravelerModel.create({
      ...data,
      userId: new mongoose.Types.ObjectId(userId),
    });

    logger.info('👥 Saved traveler added: %s (%s) for user %s', newTraveler.fullName, newTraveler.relationship, userId);

    return {
      id: newTraveler._id,
      fullName: newTraveler.fullName,
      dob: newTraveler.dob,
      gender: newTraveler.gender,
      relationship: newTraveler.relationship,
      nationality: newTraveler.nationality,
      phone: newTraveler.phone || '',
      email: newTraveler.email || '',
      address: newTraveler.address || '',
      emergencyContact: newTraveler.emergencyContact || null,
      medicalNotes: newTraveler.medicalNotes || '',
      bloodGroup: newTraveler.bloodGroup || '',
      passport: newTraveler.passport || null,
      aadhaar: newTraveler.aadhaar || null,
      pan: newTraveler.pan || null,
      photoUrl: newTraveler.photoUrl || '',
      isArchived: Boolean(newTraveler.isArchived),
      createdAt: newTraveler.createdAt,
      updatedAt: newTraveler.updatedAt,
    };
  }

  /**
   * Update saved traveler
   */
  public async updateTraveler(id: string, userId: string, updateData: Partial<ISavedTraveler>) {
    const updated = await SavedTravelerModel.findOneAndUpdate(
      { _id: id, userId, isDeleted: false },
      { $set: updateData },
      { new: true, runValidators: true }
    ).exec();

    if (!updated) {
      throw new NotFoundError('Saved traveler not found or unauthorized');
    }

    logger.info('✏️ Saved traveler updated: %s [%s]', updated.fullName, id);

    return {
      id: updated._id,
      fullName: updated.fullName,
      dob: updated.dob,
      gender: updated.gender,
      relationship: updated.relationship,
      nationality: updated.nationality,
      phone: updated.phone || '',
      email: updated.email || '',
      address: updated.address || '',
      emergencyContact: updated.emergencyContact || null,
      medicalNotes: updated.medicalNotes || '',
      bloodGroup: updated.bloodGroup || '',
      passport: updated.passport || null,
      aadhaar: updated.aadhaar || null,
      pan: updated.pan || null,
      photoUrl: updated.photoUrl || '',
      isArchived: Boolean(updated.isArchived),
      updatedAt: updated.updatedAt,
    };
  }

  /**
   * Toggle archive state
   */
  public async archiveTraveler(id: string, userId: string, isArchived: boolean = true) {
    const updated = await SavedTravelerModel.findOneAndUpdate(
      { _id: id, userId, isDeleted: false },
      { $set: { isArchived } },
      { new: true }
    ).exec();

    if (!updated) {
      throw new NotFoundError('Saved traveler not found or unauthorized');
    }

    logger.info('📦 Saved traveler archive status updated: %s -> %s', id, isArchived);
    return {
      id: updated._id,
      isArchived: updated.isArchived,
      message: isArchived ? 'Traveler archived successfully' : 'Traveler unarchived successfully',
    };
  }

  /**
   * Delete saved traveler (soft delete)
   */
  public async deleteTraveler(id: string, userId: string) {
    const res = await SavedTravelerModel.updateOne(
      { _id: id, userId, isDeleted: false },
      { $set: { isDeleted: true } }
    ).exec();

    if (!res.modifiedCount) {
      throw new NotFoundError('Saved traveler not found or unauthorized');
    }

    logger.info('🗑️ Saved traveler deleted: %s by user %s', id, userId);
    return { message: 'Saved traveler removed successfully' };
  }
}

export const savedTravelerService = new SavedTravelerService();
