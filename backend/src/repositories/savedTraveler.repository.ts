import { SavedTravelerModel, ISavedTraveler } from '../models/savedTraveler.model.js';
import mongoose from 'mongoose';

export class SavedTravelerRepository {
  public async findByUserId(userId: string | mongoose.Types.ObjectId): Promise<ISavedTraveler[]> {
    return SavedTravelerModel.find({ userId, isDeleted: false }).sort({ createdAt: -1 }).exec();
  }

  public async findByIdAndUserId(
    id: string | mongoose.Types.ObjectId,
    userId: string | mongoose.Types.ObjectId
  ): Promise<ISavedTraveler | null> {
    return SavedTravelerModel.findOne({ _id: id, userId, isDeleted: false }).exec();
  }

  public async create(data: Partial<ISavedTraveler>): Promise<ISavedTraveler> {
    const doc = new SavedTravelerModel(data);
    return doc.save();
  }

  public async update(
    id: string | mongoose.Types.ObjectId,
    userId: string | mongoose.Types.ObjectId,
    updateData: Partial<ISavedTraveler>
  ): Promise<ISavedTraveler | null> {
    return SavedTravelerModel.findOneAndUpdate(
      { _id: id, userId, isDeleted: false },
      { $set: updateData },
      { new: true, runValidators: true }
    ).exec();
  }

  public async softDelete(
    id: string | mongoose.Types.ObjectId,
    userId: string | mongoose.Types.ObjectId
  ): Promise<boolean> {
    const res = await SavedTravelerModel.updateOne(
      { _id: id, userId, isDeleted: false },
      { $set: { isDeleted: true } }
    ).exec();
    return res.modifiedCount > 0;
  }
}

export const savedTravelerRepository = new SavedTravelerRepository();
