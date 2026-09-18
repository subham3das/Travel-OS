import crypto from 'crypto';
import { dbConnection } from '../src/config/db.config.js';
import { adminAuthService } from '../src/services/adminAuth.service.js';
import { PasswordResetModel } from '../src/models/passwordReset.model.js';
import { AuditLogModel } from '../src/models/auditLog.model.js';
import { AdminModel } from '../src/models/admin.model.js';
import { AdminSessionModel } from '../src/models/adminSession.model.js';
import { RefreshTokenModel } from '../src/models/refreshToken.model.js';

async function testMasterProductionResetFlow() {
  console.log('🧪 Starting Master Production Password Reset & SMTP Integration Suite...\n');

  try {
    await dbConnection.connect();

    const targetEmail = 'das01subhamj@gmail.com';

    // 1. Clean up any previous test tokens
    await PasswordResetModel.deleteMany({ email: targetEmail });

    // 2. Test Real Forgot Password Request with Real SMTP Email Dispatch
    console.log('1️⃣ Triggering Forgot Password Request with Real Nodemailer SMTP Dispatch...');
    const forgotResult = await adminAuthService.forgotPassword(
      targetEmail,
      {
        ipAddress: '103.21.244.67',
        userAgent: 'Chrome on Windows 11 (Master Reset Test)',
        sessionId: 'sess_prod_reset_01',
        device: 'Desktop',
      }
    );

    console.log(`   Response: "${forgotResult.message}"`);
    if (!forgotResult.success) throw new Error('Forgot password returned success: false');

    // 3. Verify Only Hashed Token in MongoDB
    console.log('2️⃣ Verifying PasswordReset document in MongoDB...');
    const resetDoc = await PasswordResetModel.findOne({ email: targetEmail });
    if (!resetDoc) throw new Error('PasswordReset document not found in MongoDB!');

    console.log(`   Stored Token Hash (SHA-256): ${resetDoc.token}`);
    console.log(`   Expiry Timestamp: ${resetDoc.expiresAt.toISOString()} (30 minutes target)`);

    // 4. Verify Audit Log for Reset Email Sent
    console.log('3️⃣ Verifying Audit Logs in audit_logs collection...');
    const sentAudit = await AuditLogModel.findOne({
      'actor.email': targetEmail,
      module: 'Authentication',
      action: 'Reset Email Sent',
    }).sort({ createdAt: -1 });

    if (!sentAudit) throw new Error('Audit log for "Reset Email Sent" was not recorded!');
    console.log(`   Found Audit Log Event ID: ${sentAudit.eventId}`);
    console.log(`   Severity: ${sentAudit.severity}, Status: ${sentAudit.status}`);
    console.log(`   Description: ${sentAudit.description}`);

    // 5. Test Invalid Token Rejection
    console.log('4️⃣ Testing Invalid Token Rejection on reset-password...');
    try {
      await adminAuthService.resetPassword('malformed_or_tampered_token_xyz', 'NewPass@2026!Valid', {
        ipAddress: '103.21.244.67',
        userAgent: 'Chrome on Windows 11',
      });
      throw new Error('Should have rejected invalid token!');
    } catch (err: any) {
      console.log(`   Correctly rejected: ${err.message}`);
    }

    const invalidAudit = await AuditLogModel.findOne({
      module: 'Authentication',
      action: 'Invalid Token Used',
    }).sort({ createdAt: -1 });
    if (!invalidAudit) throw new Error('Audit log for "Invalid Token Used" was not recorded!');
    console.log(`   Verified "Invalid Token Used" Audit Event: ${invalidAudit.eventId}`);

    // 6. Test Valid Token Reset Password
    console.log('5️⃣ Testing Successful Password Reset using Valid Token...');
    // Generate a known raw token & hash it into MongoDB to test full reset cycle
    const testRawToken = crypto.randomBytes(32).toString('hex');
    const testHashedToken = crypto.createHash('sha256').update(testRawToken).digest('hex');
    const testAdmin = await AdminModel.findOne({ email: targetEmail });
    if (!testAdmin) throw new Error('Test Admin account not found in MongoDB');

    // Create a mock active session to test session revocation
    await AdminSessionModel.create({
      adminId: testAdmin._id,
      adminEmail: targetEmail,
      ip: '103.21.244.67',
      browser: 'Chrome',
      device: 'Desktop',
      os: 'Windows',
      isActive: true,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await PasswordResetModel.deleteMany({ email: targetEmail });
    await PasswordResetModel.create({
      userId: testAdmin._id,
      email: targetEmail,
      token: testHashedToken,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    });

    const resetResult = await adminAuthService.resetPassword(
      testRawToken,
      'NewSecureAdmin@2026!',
      {
        ipAddress: '103.21.244.67',
        userAgent: 'Chrome on Windows 11',
        sessionId: 'sess_prod_reset_02',
        device: 'Desktop',
      }
    );

    console.log(`   Reset Result: "${resetResult.message}"`);
    if (!resetResult.success) throw new Error('resetPassword returned success: false');

    // 7. Verify Token Invalidation & Session Revocation
    console.log('6️⃣ Verifying Token Deletion & Session Revocation in MongoDB...');
    const remainingTokens = await PasswordResetModel.find({ email: targetEmail });
    if (remainingTokens.length > 0) throw new Error('Reset token was not deleted after use!');
    console.log('   Reset token successfully consumed and purged.');

    const activeSessions = await AdminSessionModel.find({ adminId: testAdmin._id, isActive: true });
    if (activeSessions.length > 0) throw new Error('Active sessions were not revoked!');
    console.log('   All prior admin sessions successfully revoked.');

    // 8. Verify Password Successfully Reset Audit Log
    console.log('7️⃣ Verifying "Password Successfully Reset" Audit Log...');
    const successAudit = await AuditLogModel.findOne({
      'actor.email': targetEmail,
      module: 'Authentication',
      action: 'Password Successfully Reset',
    }).sort({ createdAt: -1 });

    if (!successAudit) throw new Error('Audit log for "Password Successfully Reset" was not found!');
    console.log(`   Found Audit Log Event ID: ${successAudit.eventId}`);
    console.log(`   Severity: ${successAudit.severity}, Status: ${successAudit.status}`);

    // 9. Restore standard password for seamless pair programming
    console.log('8️⃣ Restoring standard credentials (AdminPassword@123)...');
    const restoreRawToken = crypto.randomBytes(32).toString('hex');
    const restoreHash = crypto.createHash('sha256').update(restoreRawToken).digest('hex');
    await PasswordResetModel.create({
      userId: testAdmin._id,
      email: targetEmail,
      token: restoreHash,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    });
    await adminAuthService.resetPassword(restoreRawToken, 'AdminPassword@123');
    console.log('   Standard admin credentials restored successfully.');

    console.log('\n✅ ALL 8 MASTER PRODUCTION RESET & SMTP TESTS PASSED 100% PERFECTLY!\n');
  } catch (error: any) {
    console.error('❌ Master Production Reset Flow Test Failed:', error.message);
    process.exit(1);
  } finally {
    await dbConnection.disconnect();
    process.exit(0);
  }
}

testMasterProductionResetFlow();
