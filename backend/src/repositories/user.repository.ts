import { UserModel, IUser } from '../models/user.model.js';
import mongoose from 'mongoose';

export class UserRepository {
  public async findByEmail(email: string, includePassword = false): Promise<IUser | null> {
    const query = UserModel.findOne({ email: email.toLowerCase(), isDeleted: false });
    if (includePassword) {
      query.select('+password');
    }
    return query.exec();
  }

  public async findByPhone(phone: string): Promise<IUser | null> {
    return UserModel.findOne({ phone, isDeleted: false }).exec();
  }

  public async findByUsername(username: string): Promise<IUser | null> {
    return UserModel.findOne({ username: username.toLowerCase(), isDeleted: false }).exec();
  }

  public async findById(id: string | mongoose.Types.ObjectId): Promise<IUser | null> {
    return UserModel.findOne({ _id: id, isDeleted: false }).exec();
  }

  public async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new UserModel(userData);
    return user.save();
  }

  public async updateById(
    id: string | mongoose.Types.ObjectId,
    updateData: Partial<IUser>
  ): Promise<IUser | null> {
    return UserModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: updateData },
      { new: true, runValidators: true }
    ).exec();
  }

  public async updatePassword(id: string | mongoose.Types.ObjectId, passwordHash: string): Promise<boolean> {
    const res = await UserModel.updateOne(
      { _id: id },
      { $set: { password: passwordHash } }
    ).exec();
    return res.modifiedCount > 0;
  }

  public async markEmailVerified(id: string | mongoose.Types.ObjectId): Promise<IUser | null> {
    return UserModel.findOneAndUpdate(
      { _id: id },
      { $set: { isEmailVerified: true, emailVerifiedAt: new Date() } },
      { new: true }
    ).exec();
  }
}

export const userRepository = new UserRepository();
