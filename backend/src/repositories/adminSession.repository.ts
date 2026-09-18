import { AdminSessionModel, IAdminSession } from '../models/adminSession.model.js';
import mongoose from 'mongoose';

export class AdminSessionRepository {
  public async create(data: Partial<IAdminSession>): Promise<IAdminSession> {
    const session = new AdminSessionModel(data);
    return session.save();
  }

  public async findActive(limit = 50): Promise<IAdminSession[]> {
    return AdminSessionModel.find({ isActive: true }).sort({ createdAt: -1 }).limit(limit).exec();
  }

  public async terminateAll(): Promise<number> {
    const res = await AdminSessionModel.updateMany(
      { isActive: true },
      { $set: { isActive: false } }
    ).exec();
    return res.modifiedCount;
  }

  public async terminateById(id: string | mongoose.Types.ObjectId): Promise<boolean> {
    const res = await AdminSessionModel.findByIdAndUpdate(
      id,
      { $set: { isActive: false } }
    ).exec();
    return !!res;
  }

  public async countActive(): Promise<number> {
    return AdminSessionModel.countDocuments({ isActive: true }).exec();
  }
}

export const adminSessionRepository = new AdminSessionRepository();
