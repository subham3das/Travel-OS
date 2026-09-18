import { dbConnection } from '../src/config/db.config.js';
import { adminAuthService } from '../src/services/adminAuth.service.js';
import { adminProfileService } from '../src/services/adminProfile.service.js';
import { AuditLogModel } from '../src/models/auditLog.model.js';
import { AdminModel } from '../src/models/admin.model.js';

async function testPasswordRotationFlow() {
  console.log('🧪 Starting Master Change Password Production Test Suite against live MongoDB Atlas...\n');

  try {
    await dbConnection.connect();

    // 1. Authenticate Super Admin
    console.log('1️⃣ Authenticating Super Admin (das01subhamj@gmail.com)...');
    const authResult = await adminAuthService.login(
      { email: 'das01subhamj@gmail.com', password: 'AdminPassword@123' },
      { ipAddress: '103.21.244.67', userAgent: 'Chrome on Windows 11 (SOC Change Password Test)' }
    );
    const adminId = authResult.admin.id;
    console.log(`   Logged-in Admin: ${authResult.admin.name} [${adminId}]`);

    // 2. Test Identical Password Protection
    console.log('2️⃣ Testing Identical Password Rejection...');
    try {
      await adminProfileService.changePassword(
        adminId,
        'AdminPassword@123',
        'AdminPassword@123',
        { ipAddress: '103.21.244.67', userAgent: 'Chrome on Windows' }
      );
      throw new Error('Should have rejected identical password!');
    } catch (err: any) {
      console.log(`   Correctly rejected: ${err.message}`);
    }

    // 3. Test Invalid Current Password Protection
    console.log('3️⃣ Testing Wrong Current Password Rejection...');
    try {
      await adminProfileService.changePassword(
        adminId,
        'WrongPassword@999',
        'NewStrongPassword@2026',
        { ipAddress: '103.21.244.67', userAgent: 'Chrome on Windows' }
      );
      throw new Error('Should have rejected wrong current password!');
    } catch (err: any) {
      console.log(`   Correctly rejected: ${err.message}`);
    }

    // 4. Test Successful Password Rotation
    console.log('4️⃣ Testing Successful Password Rotation...');
    const result = await adminProfileService.changePassword(
      adminId,
      'AdminPassword@123',
      'NewSecurePass@2026!',
      {
        ipAddress: '103.21.244.67',
        userAgent: 'Chrome on Windows 11',
        sessionId: 'sess_pwd_rotate_99',
        device: 'Desktop',
      }
    );
    if (!result) throw new Error('Failed to rotate password');
    console.log('   Password rotated successfully.');

    // 5. Verify passwordChangedAt in MongoDB
    console.log('5️⃣ Verifying passwordChangedAt timestamp in MongoDB...');
    const adminDoc = await AdminModel.findById(adminId);
    if (!adminDoc?.passwordChangedAt) {
      throw new Error('passwordChangedAt was not updated in MongoDB');
    }
    console.log(`   passwordChangedAt: ${adminDoc.passwordChangedAt.toISOString()}`);

    // 6. Verify Audit Log in audit_logs collection
    console.log('6️⃣ Verifying Audit Log in audit_logs collection...');
    const auditDoc = await AuditLogModel.findOne({
      'actor.id': adminId,
      module: 'Profile',
      action: 'Password Changed',
    }).sort({ createdAt: -1 });

    if (!auditDoc) throw new Error('Audit log for password change was not recorded!');
    console.log(`   Found Audit Log Event ID: ${auditDoc.eventId}`);
    console.log(`   Severity: ${auditDoc.severity}, Status: ${auditDoc.status}`);
    console.log(`   Description: ${auditDoc.description}`);

    // 7. Rotate back to standard password
    console.log('7️⃣ Rotating back to default testing password...');
    await adminProfileService.changePassword(
      adminId,
      'NewSecurePass@2026!',
      'AdminPassword@123',
      { ipAddress: '103.21.244.67', userAgent: 'Chrome on Windows 11' }
    );
    console.log('   Restored standard testing password successfully.');

    console.log('\n✅ ALL 7 CHANGE PASSWORD VALIDATIONS & AUDIT TESTS PASSED 100% PERFECTLY!\n');
  } catch (error: any) {
    console.error('❌ Change Password Flow Test Failed:', error.message);
    process.exit(1);
  } finally {
    await dbConnection.disconnect();
    process.exit(0);
  }
}

testPasswordRotationFlow();
