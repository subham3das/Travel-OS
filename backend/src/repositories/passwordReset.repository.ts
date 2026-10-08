import { PasswordResetModel, IPasswordReset } from '../models/passwordReset.model.js';
import mongoose from 'mongoose';

export class PasswordResetRepository {
  public async create(data: {
    userId: mongoose.Types.ObjectId;
    email: string;
    token: string;
    expiresAt: Date;
  }): Promise<IPasswordReset> {
    // Invalidate prior unused tokens
    await PasswordResetModel.deleteMany({ userId: data.userId }).exec();
    const doc = new PasswordResetModel(data);
    return doc.save();
  }

  public async findValidToken(hashedToken: string): Promise<IPasswordReset | null> {
    return PasswordResetModel.findOne({
      token: hashedToken,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    }).exec();
  }

  public async findByTokenHash(hashedToken: string): Promise<IPasswordReset | null> {
    return PasswordResetModel.findOne({ token: hashedToken }).exec();
  }

  public async markUsed(hashedToken: string): Promise<void> {
    await PasswordResetModel.updateOne({ token: hashedToken }, { $set: { isUsed: true } }).exec();
  }

  public async invalidateAllForUser(userId: mongoose.Types.ObjectId): Promise<void> {
    await PasswordResetModel.deleteMany({ userId }).exec();
  }

  public async invalidateAllExcept(userId: mongoose.Types.ObjectId, keepToken: string): Promise<void> {
    await PasswordResetModel.deleteMany({
      userId,
      token: { $ne: keepToken },
    }).exec();
  }
}

export const passwordResetRepository = new PasswordResetRepository();
