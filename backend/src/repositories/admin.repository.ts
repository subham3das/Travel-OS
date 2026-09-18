import { AdminModel, IAdmin } from '../models/admin.model.js';
import mongoose from 'mongoose';

export class AdminRepository {
  public async findByEmail(email: string, includePassword = false): Promise<IAdmin | null> {
    const query = AdminModel.findOne({ email: email.toLowerCase().trim(), isDeleted: false });
    if (includePassword) {
      query.select('+password');
    }
    return query.exec();
  }

  public async findByGoogleId(googleId: string): Promise<IAdmin | null> {
    return AdminModel.findOne({ googleId, isDeleted: false }).exec();
  }

  public async findById(id: string | mongoose.Types.ObjectId, includePassword = false): Promise<IAdmin | null> {
    const query = AdminModel.findOne({ _id: id, isDeleted: false });
    if (includePassword) {
      query.select('+password');
    }
    return query.exec();
  }

  public async create(adminData: Partial<IAdmin>): Promise<IAdmin> {
    const admin = new AdminModel(adminData);
    return admin.save();
  }

  public async updateById(
    id: string | mongoose.Types.ObjectId,
    updateData: Partial<IAdmin>
  ): Promise<IAdmin | null> {
    return AdminModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: updateData },
      { returnDocument: 'after', runValidators: true }
    ).exec();
  }

  public async updateLastLogin(id: string | mongoose.Types.ObjectId): Promise<void> {
    await AdminModel.updateOne(
      { _id: id },
      { $set: { lastLogin: new Date() } }
    ).exec();
  }

  public async count(filter: Record<string, any> = {}): Promise<number> {
    return AdminModel.countDocuments({ ...filter, isDeleted: false }).exec();
  }
}

export const adminRepository = new AdminRepository();
