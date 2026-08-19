import mongoose from 'mongoose';
import { savedTravelerRepository } from '../repositories/savedTraveler.repository.js';
import { NotFoundError } from '../utils/errors.util.js';
import { ISavedTraveler } from '../models/savedTraveler.model.js';
import { logger } from '../config/logger.config.js';

export class SavedTravelerService {
  /**
   * List all saved travelers for user
   */
  public async listTravelers(userId: string) {
    const travelers = await savedTravelerRepository.findByUserId(userId);
    return travelers.map((t) => ({
      id: t._id,
      fullName: t.fullName,
      dob: t.dob,
      gender: t.gender,
      relationship: t.relationship,
      nationality: t.nationality,
      passportNumber: t.passportNumber || '',
      aadhaarNumber: t.aadhaarNumber || '',
      panNumber: t.panNumber || '',
      emergencyContact: t.emergencyContact || null,
      createdAt: t.createdAt,
    }));
  }

  /**
   * Add a new saved traveler
   */
  public async addTraveler(userId: string, data: Partial<ISavedTraveler>) {
    const newTraveler = await savedTravelerRepository.create({
      ...data,
      userId: new mongoose.Types.ObjectId(userId),
    });

    logger.info('👥 Saved traveler added: %s for user %s', newTraveler.fullName, userId);
    return {
      id: newTraveler._id,
      fullName: newTraveler.fullName,
      dob: newTraveler.dob,
      gender: newTraveler.gender,
      relationship: newTraveler.relationship,
      nationality: newTraveler.nationality,
      passportNumber: newTraveler.passportNumber || '',
      aadhaarNumber: newTraveler.aadhaarNumber || '',
      panNumber: newTraveler.panNumber || '',
      emergencyContact: newTraveler.emergencyContact || null,
      createdAt: newTraveler.createdAt,
    };
  }

  /**
   * Update saved traveler
   */
  public async updateTraveler(id: string, userId: string, updateData: Partial<ISavedTraveler>) {
    const updated = await savedTravelerRepository.update(id, userId, updateData);
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
      passportNumber: updated.passportNumber || '',
      aadhaarNumber: updated.aadhaarNumber || '',
      panNumber: updated.panNumber || '',
      emergencyContact: updated.emergencyContact || null,
      updatedAt: updated.updatedAt,
    };
  }

  /**
   * Delete saved traveler (soft delete)
   */
  public async deleteTraveler(id: string, userId: string) {
    const success = await savedTravelerRepository.softDelete(id, userId);
    if (!success) {
      throw new NotFoundError('Saved traveler not found or unauthorized');
    }

    logger.info('🗑️ Saved traveler deleted: %s by user %s', id, userId);
    return { message: 'Saved traveler removed successfully' };
  }
}

export const savedTravelerService = new SavedTravelerService();
