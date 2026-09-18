import { dbConnection } from '../src/config/db.config.js';
import { adminAuthService } from '../src/services/adminAuth.service.js';
import { adminProfileService } from '../src/services/adminProfile.service.js';
import { AdminModel } from '../src/models/admin.model.js';
import { AuditLogModel } from '../src/models/auditLog.model.js';
import { UpdateAdminPreferencesSchema } from '../src/validations/adminProfile.validation.js';

async function testMasterThemeFlow() {
  console.log('🧪 Starting Master Global Theme & Preferences Integration Suite against live MongoDB Atlas...\n');

  try {
    await dbConnection.connect();

    // 1. Authenticate Super Admin
    console.log('1️⃣ Authenticating Super Admin (das01subhamj@gmail.com)...');
    let authResult;
    try {
      authResult = await adminAuthService.login(
        { email: 'das01subhamj@gmail.com', password: 'AdminPassword@123' },
        { ipAddress: '103.21.244.67', userAgent: 'Chrome on Windows 11 (Theme System Test)' }
      );
    } catch {
      authResult = await adminAuthService.login(
        { email: 'das01subhamj@gmail.com', password: 'Subhamtravel@26' },
        { ipAddress: '103.21.244.67', userAgent: 'Chrome on Windows 11 (Theme System Test)' }
      );
    }
    const adminId = authResult.admin.id;
    console.log(`   Logged-in Admin: ${authResult.admin.name} [${adminId}]`);

    // 2. Set theme to Light first to establish baseline
    await adminProfileService.updatePreferences(adminId, { theme: 'Light' });

    // 3. Test Theme Change from Light to Dark
    console.log('2️⃣ Testing Theme Transition: Light -> Dark...');
    const darkPrefs = await adminProfileService.updatePreferences(
      adminId,
      { theme: 'Dark' },
      {
        ipAddress: '103.21.244.67',
        userAgent: 'Chrome on Windows 11',
        sessionId: 'sess_theme_test_01',
        device: 'Desktop',
      }
    );

    if (darkPrefs.theme !== 'Dark') throw new Error(`Expected theme 'Dark', got ${darkPrefs.theme}`);
    console.log('   Preference updated to Dark in MongoDB.');

    // 4. Verify MongoDB Admin Document
    console.log('3️⃣ Verifying Admin document preferences in MongoDB...');
    const adminDocDark = await AdminModel.findById(adminId);
    if (adminDocDark?.preferences?.theme !== 'Dark') {
      throw new Error(`MongoDB document has incorrect theme: ${adminDocDark?.preferences?.theme}`);
    }
    console.log(`   MongoDB Admin.preferences.theme: "${adminDocDark.preferences.theme}"`);

    // 5. Verify Audit Log for Light -> Dark
    console.log('4️⃣ Verifying "Theme Changed" Audit Log in audit_logs...');
    const darkAudit = await AuditLogModel.findOne({
      'actor.id': adminId,
      module: 'Settings',
      action: 'Theme Changed',
      'changes.after': 'Dark',
    }).sort({ createdAt: -1 });

    if (!darkAudit) throw new Error('Audit log for Theme Changed (Dark) was not recorded!');
    console.log(`   Found Audit Log Event ID: ${darkAudit.eventId}`);
    console.log(`   Severity: ${darkAudit.severity}, Status: ${darkAudit.status}`);
    console.log(`   Description: ${darkAudit.description}`);

    // 6. Test Theme Change from Dark to System
    console.log('5️⃣ Testing Theme Transition: Dark -> System...');
    const systemPrefs = await adminProfileService.updatePreferences(
      adminId,
      { theme: 'System' },
      {
        ipAddress: '103.21.244.67',
        userAgent: 'Chrome on Windows 11',
        sessionId: 'sess_theme_test_02',
        device: 'Desktop',
      }
    );

    if (systemPrefs.theme !== 'System') throw new Error(`Expected theme 'System', got ${systemPrefs.theme}`);
    console.log('   Preference updated to System in MongoDB.');

    // 7. Verify Schema Validation on Invalid Themes
    console.log('6️⃣ Testing Schema Validation on Invalid Themes...');
    const invalidValidation = UpdateAdminPreferencesSchema.safeParse({ theme: 'NeonGreen' });
    if (invalidValidation.success) throw new Error('Schema should have rejected invalid theme!');
    console.log('   Correctly rejected invalid theme: NeonGreen');

    const lowercaseValidation = UpdateAdminPreferencesSchema.safeParse({ theme: 'dark' });
    if (!lowercaseValidation.success || lowercaseValidation.data.theme !== 'Dark') {
      throw new Error('Schema failed to normalize lowercase theme: dark -> Dark');
    }
    console.log(`   Correctly normalized lowercase input 'dark' -> '${lowercaseValidation.data.theme}'`);

    // 8. Restore default Light theme
    console.log('7️⃣ Restoring standard Light theme baseline...');
    await adminProfileService.updatePreferences(adminId, { theme: 'Light' });
    console.log('   Baseline Light theme restored successfully.');

    console.log('\n✅ ALL 7 GLOBAL THEME & AUDIT LOG TESTS PASSED 100% PERFECTLY!\n');
  } catch (error: any) {
    console.error('❌ Theme Flow Test Failed:', error.message);
    process.exit(1);
  } finally {
    await dbConnection.disconnect();
    process.exit(0);
  }
}

testMasterThemeFlow();
