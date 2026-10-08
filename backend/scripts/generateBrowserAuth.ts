import mongoose from 'mongoose';
import fs from 'fs';
import { AdminModel } from '../src/models/admin.model.js';
import { TokenUtil, JwtTokenPayload } from '../src/utils/token.util.js';
import { envConfig } from '../src/config/env.config.js';

async function main() {
  await mongoose.connect(envConfig.MONGODB_URI);
  const superAdmin = await AdminModel.findOne({ email: 'das01subhamj@gmail.com' }).lean();
  if (!superAdmin) throw new Error('Super Admin not found');

  const payload: JwtTokenPayload = {
    userId: superAdmin._id.toString(),
    adminId: superAdmin._id.toString(),
    email: superAdmin.email,
    role: superAdmin.role,
    userType: 'ADMIN',
    isSuperAdmin: true,
    permissions: ['ALL'],
  };

  const accessToken = TokenUtil.signAccessToken(payload);
  const refreshToken = TokenUtil.signRefreshToken(payload);

  const authState = {
    isAuthenticated: true,
    isLoading: false,
    admin: {
      id: superAdmin._id.toString(),
      fullName: `${superAdmin.firstName || 'Super'} ${superAdmin.lastName || 'Admin'}`,
      name: `${superAdmin.firstName || 'Super'} ${superAdmin.lastName || 'Admin'}`,
      email: superAdmin.email,
      role: superAdmin.role || 'SUPER_ADMIN',
      permissions: ['ALL'],
      avatar: '',
      profileImage: '',
      isActive: true,
      isSuperAdmin: true,
      authProvider: 'LOCAL',
    },
    token: accessToken,
    refreshToken: refreshToken,
    sessionStartedAt: new Date().toISOString(),
  };

  const output = {
    accessToken,
    refreshToken,
    authState,
  };

  fs.writeFileSync('browserAuth.json', JSON.stringify(output, null, 2));
  console.log('✅ Wrote browserAuth.json successfully');
  await mongoose.disconnect();
}

main().catch(console.error);
