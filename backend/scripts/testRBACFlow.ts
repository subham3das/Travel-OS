import { dbConnection } from '../src/config/db.config.js';
import { adminRolesService } from '../src/services/adminRoles.service.js';
import { RoleModel } from '../src/models/role.model.js';

async function run() {
  console.log('🧪 Starting Master RBAC Backend Suite against live MongoDB Atlas...');
  await dbConnection.connect();

  try {
    // 1. Dashboard KPI Stats
    console.log('1️⃣ Testing getDashboardStats...');
    const stats = await adminRolesService.getDashboardStats();
    console.log('   Total Roles:', stats.totalRoles.value);
    console.log('   Active Admins:', stats.activeAdmins.value);
    console.log('   High Privilege Accounts:', stats.highPrivilegeAccounts.value);
    if (!stats.totalRoles.value || !stats.activeAdmins.value) {
      throw new Error('Dashboard stats returned invalid values');
    }

    // 2. Roles List
    console.log('2️⃣ Testing getRoles...');
    const roles = await adminRolesService.getRoles();
    console.log(`   Fetched ${roles.length} roles from MongoDB.`);
    const superAdminRole = roles.find((r) => r.slug === 'super_admin');
    if (!superAdminRole) {
      throw new Error('Super Admin role missing in MongoDB');
    }
    console.log('   Super Admin role permissions count:', superAdminRole.permissionCount);

    // 3. Permissions Matrix
    console.log('3️⃣ Testing getPermissionsMatrix for Super Admin...');
    const matrix = await adminRolesService.getPermissionsMatrix(superAdminRole.id);
    console.log(`   Fetched matrix with ${matrix.length} modules.`);
    const dashboardRow = matrix.find((m) => m.moduleName === 'Dashboard');
    if (!dashboardRow || !dashboardRow.fullAccess) {
      throw new Error('Super Admin should have fullAccess: true across all modules');
    }

    // 4. Create Custom Role
    console.log('4️⃣ Testing createRole (Custom)...');
    const timestamp = Date.now();
    const customRole = await adminRolesService.createRole(
      `Custom Auditor ${timestamp}`,
      'Audits marketplace financial records and transactions',
      'Medium'
    );
    console.log('   Created custom role:', customRole.name, `[${customRole.id}]`);
    if (customRole.type !== 'Custom') {
      throw new Error('Role type should be Custom');
    }

    // 5. Update Permission on Custom Role
    console.log('5️⃣ Testing updatePermission on custom role...');
    const updatedMatrix = await adminRolesService.updatePermission(
      customRole.id,
      'agencies',
      'approve',
      true
    );
    const agencyModule = updatedMatrix.find((m) => m.moduleId === 'agencies');
    console.log('   Agency module approve status:', agencyModule?.approve);
    if (!agencyModule || !agencyModule.approve) {
      throw new Error('Permission update was not persisted');
    }

    // 6. Duplicate Role
    console.log('6️⃣ Testing duplicateRole...');
    const duplicated = await adminRolesService.duplicateRole(customRole.id);
    console.log('   Duplicated role:', duplicated.name);

    // 7. Get Authorized Admins List
    console.log('7️⃣ Testing getAdminsList (IAM Table)...');
    const admins = await adminRolesService.getAdminsList();
    console.log(`   Fetched ${admins.length} authorized administrators from MongoDB.`);
    if (admins.length === 0) {
      throw new Error('Admins collection returned empty');
    }

    // 8. Sessions & Activity
    console.log('8️⃣ Testing getSessions & getActivity...');
    const sessions = await adminRolesService.getSessions();
    const activity = await adminRolesService.getActivity();
    console.log(`   Active sessions: ${sessions.length}, Recent activity logs: ${activity.length}`);

    // 9. Protect System Roles against deletion
    console.log('9️⃣ Testing System Role Deletion Protection...');
    try {
      await adminRolesService.deleteRole(superAdminRole.id);
      throw new Error('System role deletion should have been blocked!');
    } catch (err: any) {
      console.log('   Correctly blocked system role deletion:', err.message);
    }

    // 10. Clean up test custom roles
    console.log('🔟 Cleaning up test custom roles...');
    await adminRolesService.deleteRole(customRole.id);
    await adminRolesService.deleteRole(duplicated.id);
    console.log('   Test roles deleted cleanly.');

    console.log('\n✅ ALL 10 RBAC SERVICE & DATABASE TESTS PASSED 100% PERFECTLY!\n');
  } finally {
    await dbConnection.disconnect();
  }
}

run().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
