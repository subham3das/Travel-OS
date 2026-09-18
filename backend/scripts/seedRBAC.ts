import { dbConnection } from '../src/config/db.config.js';
import { PermissionModel } from '../src/models/permission.model.js';
import { RoleModel } from '../src/models/role.model.js';
import { AdminModel } from '../src/models/admin.model.js';
import { AdminActivityModel } from '../src/models/adminActivity.model.js';
import { AdminSessionModel } from '../src/models/adminSession.model.js';
import { HashUtil } from '../src/utils/hash.util.js';
import { RBAC_MODULES, RBAC_ACTIONS } from '../src/constants/rbac.constant.js';
import mongoose from 'mongoose';

async function seedRBAC() {
  console.log('🚀 Starting Master RBAC Seeder for Travel OS...');
  await dbConnection.connect();

  try {
    // 1. Seed Master Permissions Catalog
    console.log('1️⃣ Seeding Master Permissions Catalog (21 Modules × 8 Actions)...');
    const permissionDocs: Array<{ module: string; action: string; key: string; description: string }> = [];

    for (const mod of RBAC_MODULES) {
      for (const act of RBAC_ACTIONS) {
        const modKey = mod.toLowerCase().replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
        const key = `${modKey}.${act}`;
        permissionDocs.push({
          module: mod,
          action: act,
          key,
          description: `Grants ${act} access for the ${mod} module`,
        });
      }
    }

    for (const p of permissionDocs) {
      await PermissionModel.updateOne(
        { key: p.key },
        { $set: p },
        { upsert: true }
      );
    }
    console.log(`   ✓ Seeded/Updated ${permissionDocs.length} master permissions.`);

    // 2. Seed Master System Roles
    console.log('2️⃣ Seeding Master System Roles...');
    const systemRoles = [
      {
        name: 'Super Admin',
        slug: 'super_admin',
        description: 'Unrestricted global access to all Travel OS system resources and administrative functions',
        securityLevel: 'Critical' as const,
        permissions: ['ALL'],
        isSystemRole: true,
      },
      {
        name: 'Operations Manager',
        slug: 'operations_manager',
        description: 'Oversees agency onboarding, verification, package lifecycle, and booking resolution',
        securityLevel: 'High' as const,
        permissions: [
          'dashboard.view', 'dashboard.export',
          'agencies.view', 'agencies.create', 'agencies.edit', 'agencies.approve', 'agencies.export', 'agencies.assign',
          'agency_requests.view', 'agency_requests.edit', 'agency_requests.approve',
          'users.view', 'users.edit', 'users.export',
          'packages.view', 'packages.create', 'packages.edit', 'packages.approve', 'packages.export',
          'trips.view', 'trips.create', 'trips.edit', 'trips.export',
          'bookings.view', 'bookings.edit', 'bookings.approve', 'bookings.export',
          'reviews.view', 'reviews.edit', 'reviews.delete',
          'support.view', 'support.create', 'support.edit', 'support.assign',
        ],
        isSystemRole: true,
      },
      {
        name: 'Finance Manager',
        slug: 'finance_manager',
        description: 'Manages payment verification, refunds, settlements, agency payouts, and financial reporting',
        securityLevel: 'High' as const,
        permissions: [
          'dashboard.view', 'dashboard.export',
          'payments.view', 'payments.edit', 'payments.approve', 'payments.export',
          'finance.view', 'finance.create', 'finance.edit', 'finance.approve', 'finance.export',
          'reports.view', 'reports.export',
          'bookings.view', 'bookings.export',
        ],
        isSystemRole: true,
      },
      {
        name: 'Support Manager',
        slug: 'support_manager',
        description: 'Handles traveler tickets, community moderation, agency inquiries, and dispute resolution',
        securityLevel: 'Medium' as const,
        permissions: [
          'dashboard.view',
          'support.view', 'support.create', 'support.edit', 'support.assign',
          'community.view', 'community.edit', 'community.delete',
          'reviews.view', 'reviews.edit',
          'bookings.view',
          'users.view',
        ],
        isSystemRole: true,
      },
      {
        name: 'Content Manager',
        slug: 'content_manager',
        description: 'Controls marketplace banners, destination stories, travel circles, and CMS assets',
        securityLevel: 'Low' as const,
        permissions: [
          'dashboard.view',
          'cms.view', 'cms.create', 'cms.edit', 'cms.delete', 'cms.approve', 'cms.export',
          'media.view', 'media.create', 'media.edit', 'media.delete',
          'community.view', 'community.edit',
        ],
        isSystemRole: true,
      },
    ];

    const seededRoleMap: Record<string, mongoose.Types.ObjectId> = {};

    for (const r of systemRoles) {
      const roleDoc = await RoleModel.findOneAndUpdate(
        { slug: r.slug },
        { $set: r },
        { upsert: true, returnDocument: 'after' }
      );
      if (roleDoc) {
        seededRoleMap[r.slug] = roleDoc._id as mongoose.Types.ObjectId;
      }
      console.log(`   ✓ Seeded role: ${r.name} (${r.slug})`);
    }

    // 3. Ensure Super Admin Account
    console.log('3️⃣ Synchronizing Super Admin Account in MongoDB...');
    const superAdminEmail = (process.env.SUPER_ADMIN_EMAIL || 'das01subhamj@gmail.com').toLowerCase().trim();
    const fallbackAdminEmail = 'admin@travelos.com';
    const defaultPassword = process.env.SUPER_ADMIN_PASSWORD || 'AdminPassword@123';
    const passwordHash = await HashUtil.hash(defaultPassword);

    const adminEmails = [superAdminEmail, fallbackAdminEmail];

    for (const email of adminEmails) {
      const existing = await AdminModel.findOne({ email });
      if (existing) {
        await AdminModel.updateOne(
          { email },
          {
            $set: {
              fullName: 'Super Administrator',
              roleId: seededRoleMap['super_admin'],
              role: 'SUPER_ADMIN',
              isSuperAdmin: true,
              permissions: ['ALL'],
              isActive: true,
              authProvider: 'both',
              profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            },
          }
        );
        console.log(`   ✓ Updated existing Super Admin: ${email}`);
      } else {
        const created = await AdminModel.create({
          fullName: 'Super Administrator',
          email,
          password: passwordHash,
          roleId: seededRoleMap['super_admin'],
          role: 'SUPER_ADMIN',
          isSuperAdmin: true,
          permissions: ['ALL'],
          isActive: true,
          authProvider: 'both',
          profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        });
        console.log(`   ✓ Created new Super Admin: ${email} [${created._id}]`);
      }
    }

    // 4. Seed Initial Activity & Sessions
    console.log('4️⃣ Seeding initial live admin activity & active sessions...');
    const primaryAdmin = await AdminModel.findOne({ email: superAdminEmail });
    if (primaryAdmin) {
      await AdminActivityModel.deleteMany({ adminId: primaryAdmin._id });
      await AdminActivityModel.create([
        {
          adminId: primaryAdmin._id,
          adminName: primaryAdmin.fullName,
          adminAvatar: primaryAdmin.profileImage,
          action: 'Initialized Master RBAC Permissions Matrix',
          module: 'Roles',
          ip: '127.0.0.1',
          device: 'Desktop',
          browser: 'Chrome (macOS)',
        },
        {
          adminId: primaryAdmin._id,
          adminName: primaryAdmin.fullName,
          adminAvatar: primaryAdmin.profileImage,
          action: 'Configured Enterprise System Roles',
          module: 'Settings',
          ip: '127.0.0.1',
          device: 'Desktop',
          browser: 'Chrome (macOS)',
        },
      ]);

      await AdminSessionModel.deleteMany({ adminId: primaryAdmin._id });
      await AdminSessionModel.create([
        {
          adminId: primaryAdmin._id,
          adminEmail: primaryAdmin.email,
          browser: 'Chrome 122',
          device: 'MacBook Pro',
          os: 'macOS Sonoma',
          ip: '103.212.145.22',
          location: 'New Delhi, India',
          country: 'India',
          flag: '🇮🇳',
          isActive: true,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        {
          adminId: primaryAdmin._id,
          adminEmail: primaryAdmin.email,
          browser: 'Chrome Mobile',
          device: 'iPhone 15 Pro',
          os: 'iOS 17',
          ip: '103.212.145.22',
          location: 'New Delhi, India',
          country: 'India',
          flag: '🇮🇳',
          isActive: true,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      ]);
    }

    console.log('\n✅ MASTER RBAC SEEDING COMPLETED 100% SUCCESSFULLY!\n');
  } catch (err) {
    console.error('❌ Error during RBAC seeding:', err);
    process.exit(1);
  } finally {
    await dbConnection.disconnect();
  }
}

seedRBAC();
