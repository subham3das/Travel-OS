import { RoleModel, IRole } from '../models/role.model.js';
import mongoose from 'mongoose';

export class RoleRepository {
  public async findAll(filter: Record<string, any> = {}): Promise<IRole[]> {
    return RoleModel.find(filter).sort({ isSystemRole: -1, createdAt: 1 }).exec();
  }

  public async findById(id: string | mongoose.Types.ObjectId): Promise<IRole | null> {
    return RoleModel.findById(id).exec();
  }

  public async findBySlug(slug: string): Promise<IRole | null> {
    return RoleModel.findOne({ slug: slug.toLowerCase() }).exec();
  }

  public async create(roleData: Partial<IRole>): Promise<IRole> {
    const role = new RoleModel(roleData);
    return role.save();
  }

  public async updateById(
    id: string | mongoose.Types.ObjectId,
    updateData: Partial<IRole>
  ): Promise<IRole | null> {
    return RoleModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { returnDocument: 'after', runValidators: true }
    ).exec();
  }

  public async deleteById(id: string | mongoose.Types.ObjectId): Promise<boolean> {
    const res = await RoleModel.findByIdAndDelete(id).exec();
    return !!res;
  }

  public async count(filter: Record<string, any> = {}): Promise<number> {
    return RoleModel.countDocuments(filter).exec();
  }
}

export const roleRepository = new RoleRepository();
