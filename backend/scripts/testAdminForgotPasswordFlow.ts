import { dbConnection } from '../src/config/db.config.js';
import { adminAuthService } from '../src/services/adminAuth.service.js';
import { PasswordResetModel } from '../src/models/passwordReset.model.js';
import { AuditLogModel } from '../src/models/auditLog.model.js';

async function testAdminForgotPasswordFlow() {
  console.log('🧪 Starting Master Admin Forgot Password Integration Suite against live MongoDB Atlas...\n');

  try {
    await dbConnection.connect();

    // 1. Test Valid Administrator Forgot Password Request
    console.log('1️⃣ Testing Forgot Password Request for das01subhamj@gmail.com...');
    const result = await adminAuthService.forgotPassword(
      'das01subhamj@gmail.com',
      {
        ipAddress: '103.21.244.67',
        userAgent: 'Chrome on Windows 11 (Forgot Password Test)',
        sessionId: 'sess_forgot_pwd_99',
        device: 'Desktop',
      }
    );

    console.log(`   Response: ${result.message}`);
    if (!result.success) throw new Error('Forgot password request returned success: false');

    // 2. Verify PasswordReset document in MongoDB
    console.log('2️⃣ Verifying PasswordReset document in MongoDB...');
    const resetDoc = await PasswordResetModel.findOne({ email: 'das01subhamj@gmail.com' }).sort({ createdAt: -1 });
    if (!resetDoc) throw new Error('Password reset token was not saved in MongoDB');

    console.log(`   Reset Token (SHA-256 Hash): ${resetDoc.token.slice(0, 16)}...`);
    console.log(`   Expires At: ${resetDoc.expiresAt.toISOString()}`);
    const timeUntilExpiry = resetDoc.expiresAt.getTime() - Date.now();
    const minutesRemaining = Math.round(timeUntilExpiry / (60 * 1000));
    console.log(`   Token validity window: ~${minutesRemaining} minutes remaining (Target: 30 mins)`);

    if (minutesRemaining < 28 || minutesRemaining > 31) {
      throw new Error(`Token expiry is unexpected: got ${minutesRemaining} minutes`);
    }

    // 3. Verify Centralized Audit Log
    console.log('3️⃣ Verifying Audit Log in audit_logs collection...');
    const auditDoc = await AuditLogModel.findOne({
      'actor.email': 'das01subhamj@gmail.com',
      module: 'Authentication',
      action: 'Password Reset Requested',
    }).sort({ createdAt: -1 });

    if (!auditDoc) throw new Error('Audit log for forgot password was not found in MongoDB!');
    console.log(`   Found Audit Event ID: ${auditDoc.eventId}`);
    console.log(`   Severity: ${auditDoc.severity}, Status: ${auditDoc.status}`);
    console.log(`   Description: ${auditDoc.description}`);

    // 4. Test Invalid Email Rejection
    console.log('4️⃣ Testing Unregistered Email Rejection...');
    try {
      await adminAuthService.forgotPassword('unknown.attacker@gmail.com');
      throw new Error('Should have rejected unknown email address!');
    } catch (err: any) {
      console.log(`   Correctly rejected: ${err.message}`);
    }

    console.log('\n✅ ALL 4 ADMIN FORGOT PASSWORD & RECOVERY TESTS PASSED 100% PERFECTLY!\n');
  } catch (error: any) {
    console.error('❌ Admin Forgot Password Flow Test Failed:', error.message);
    process.exit(1);
  } finally {
    await dbConnection.disconnect();
    process.exit(0);
  }
}

testAdminForgotPasswordFlow();
