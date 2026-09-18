import { dbConnection } from '../src/config/db.config.js';
import { adminRepository } from '../src/repositories/admin.repository.js';
import { HashUtil } from '../src/utils/hash.util.js';
import mongoose from 'mongoose';

async function seedSuperAdmin() {
  console.log('🚀 Starting Super Admin Seed Process...');
  await dbConnection.connect();

  const superAdminEmail = (process.env.SUPER_ADMIN_EMAIL || 'admin@travelos.com').toLowerCase().trim();
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || 'AdminPassword@123';
  const superAdminName = process.env.SUPER_ADMIN_NAME || 'Super Administrator';

  try {
    const existingAdmin = await adminRepository.findByEmail(superAdminEmail, true);

    if (!existingAdmin) {
      console.log(`📌 Creating initial Super Admin: ${superAdminEmail}`);
      const passwordHash = await HashUtil.hash(superAdminPassword);

      const created = await adminRepository.create({
        fullName: superAdminName,
        email: superAdminEmail,
        password: passwordHash,
        role: 'SUPER_ADMIN',
        permissions: ['ALL'],
        isSuperAdmin: true,
        isActive: true,
        authProvider: 'both',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      });

      console.log(`✅ Super Admin created successfully with ID: ${created._id}`);
    } else {
      console.log(`ℹ️ Super Admin already exists: ${superAdminEmail}`);
      const passwordHash = await HashUtil.hash(superAdminPassword);
      await adminRepository.updateById(existingAdmin._id as mongoose.Types.ObjectId, {
        fullName: superAdminName,
        password: passwordHash,
        role: 'SUPER_ADMIN',
        permissions: ['ALL'],
        isSuperAdmin: true,
        isActive: true,
        authProvider: 'both',
      });
      console.log(`✅ Super Admin verified and synchronized: ${existingAdmin._id}`);
    }

    console.log('\n=========================================');
    console.log('🔑 SUPER ADMIN CREDENTIALS:');
    console.log(`   Email:    ${superAdminEmail}`);
    console.log(`   Password: ${superAdminPassword}`);
    console.log('=========================================\n');
  } catch (error) {
    console.error('❌ Error during Super Admin seeding:', error);
    process.exit(1);
  } finally {
    await dbConnection.disconnect();
  }
}

seedSuperAdmin();
