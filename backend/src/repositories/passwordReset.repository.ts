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

  public async findValidToken(token: string): Promise<IPasswordReset | null> {
    return PasswordResetModel.findOne({
      token,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    }).exec();
  }

  public async markUsed(token: string): Promise<void> {
    await PasswordResetModel.updateOne({ token }, { $set: { isUsed: true } }).exec();
  }
}

export const passwordResetRepository = new PasswordResetRepository();
