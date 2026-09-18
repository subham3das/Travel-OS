import { AdminActivityModel, IAdminActivity } from '../models/adminActivity.model.js';

export class AdminActivityRepository {
  public async create(data: Partial<IAdminActivity>): Promise<IAdminActivity> {
    const activity = new AdminActivityModel(data);
    return activity.save();
  }

  public async findRecent(limit = 20): Promise<IAdminActivity[]> {
    return AdminActivityModel.find().sort({ createdAt: -1 }).limit(limit).exec();
  }

  public async count(): Promise<number> {
    return AdminActivityModel.countDocuments().exec();
  }
}

export const adminActivityRepository = new AdminActivityRepository();
