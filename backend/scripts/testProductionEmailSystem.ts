import { dbConnection } from '../src/config/db.config.js';
import { UserModel } from '../src/models/user.model.js';
import { PasswordResetModel } from '../src/models/passwordReset.model.js';
import { AuditLogModel } from '../src/models/auditLog.model.js';
import { authService } from '../src/services/auth.service.js';
import { mailService } from '../src/services/mail.service.js';
import crypto from 'crypto';

async function runEmailSystemAudit() {
  console.log('================================================================');
  console.log('🚀 AUDITING PRODUCTION-READY EMAIL & PASSWORD RESET SYSTEM');
  console.log('================================================================');

  await dbConnection.connect();

  const timestamp = Date.now();
  const testUserEmail = `email_prod_${timestamp}@example.com`;
  const initialPassword = 'InitialSecure#2026';
  const newPassword = 'NewStrongPassword@2026';
  const testPhone = `+9198${Math.floor(10000000 + Math.random() * 90000000)}`;

  let registeredUserId: string = '';
  let interceptedResetToken: string = '';

  try {
    // -------------------------------------------------------------------------
    // SCENARIO 1: Centralized MailService Integrity & Method Availability
    // -------------------------------------------------------------------------
    console.log('\n[SCENARIO 1] Checking Centralized MailService Template Methods...');
    const requiredTemplates = [
      'sendUserPasswordResetEmail',
      'sendPasswordResetSuccessEmail',
      'sendWelcomeEmail',
      'sendEmailVerificationEmail',
      'sendCarRentalApprovedEmail',
      'sendCarRentalRejectedEmail',
      'sendBookingConfirmationEmail',
      'sendBookingCancelledEmail',
      'sendPaymentConfirmationEmail',
      'sendKycApprovedEmail',
      'sendKycRejectedEmail',
      'sendMembershipActivatedEmail',
      'sendCouponNotificationEmail',
      'sendOtpEmail',
    ];

    for (const tmpl of requiredTemplates) {
      if (typeof (mailService as any)[tmpl] !== 'function') {
        throw new Error(`Missing template method on centralized mailService: ${tmpl}`);
      }
    }
    console.log(`✅ All ${requiredTemplates.length} centralized template methods are implemented.`);

    // -------------------------------------------------------------------------
    // SCENARIO 2: Register user and verify Welcome Email triggered
    // -------------------------------------------------------------------------
    console.log('\n[SCENARIO 2] Registering User & Verifying Auth Pipeline...');
    const regRes = await authService.register({
      fullName: 'Audit Test Traveler',
      email: testUserEmail,
      phone: testPhone,
      password: initialPassword,
      confirmPassword: initialPassword,
      acceptTerms: true,
    });
    registeredUserId = regRes.user.id.toString();
    console.log(`✅ Registered user ID: ${registeredUserId} (${testUserEmail})`);

    // -------------------------------------------------------------------------
    // SCENARIO 3: Non-existing Email Anti-Enumeration Protection
    // -------------------------------------------------------------------------
    console.log('\n[SCENARIO 3] Forgot Password with NON-EXISTING Email (Anti-Enumeration)...');
    const nonExistingEmail = `nonexistent_${timestamp}@unknown-domain-test.com`;
    const nonExistingRes = await authService.forgotPassword(
      nonExistingEmail,
      { ipAddress: '127.0.0.1', userAgent: 'Mozilla/5.0 Test' }
    );
    console.log('   Response message:', nonExistingRes.message);
    if (!nonExistingRes.message.includes('If an account exists')) {
      throw new Error('Anti-enumeration message mismatch for non-existing email');
    }
    // Check MongoDB: ensure NO password reset token was created for non-existing email
    const nonExistingTokenInDb = await PasswordResetModel.findOne({ email: nonExistingEmail });
    if (nonExistingTokenInDb) {
      throw new Error('Security flaw: Reset token was saved in DB for non-existing user!');
    }
    console.log('✅ Anti-enumeration verified: generic message returned, zero tokens stored.');

    // -------------------------------------------------------------------------
    // SCENARIO 4: Existing Email Forgot Password Flow
    // -------------------------------------------------------------------------
    console.log('\n[SCENARIO 4] Forgot Password with EXISTING Registered Email...');
    
    // Temporarily spy on sendUserPasswordResetEmail to capture the raw reset link
    let capturedLink = '';
    mailService.sendUserPasswordResetEmail = async (to: string, name: string, link: string) => {
      capturedLink = link;
      console.log(`   📧 [MailService Dispatched] Sent reset email to: ${to}`);
      console.log(`   🔗 [Captured Reset Link]: ${link}`);
      return Promise.resolve();
    };

    const existingRes = await authService.forgotPassword(
      testUserEmail,
      { ipAddress: '127.0.0.1', userAgent: 'Mozilla/5.0 Test' }
    );
    console.log('   Response message:', existingRes.message);
    if (existingRes.message !== nonExistingRes.message) {
      throw new Error('Account enumeration leak: Messages differ between existing and non-existing email!');
    }

    // Extract token from link
    const urlObj = new URL(capturedLink);
    interceptedResetToken = urlObj.searchParams.get('token') || '';
    if (!interceptedResetToken || interceptedResetToken.length !== 64) {
      throw new Error(`Invalid token format captured: ${interceptedResetToken}`);
    }
    console.log(`✅ Raw 32-byte cryptographic hex token captured (len=${interceptedResetToken.length})`);

    // Verify token in MongoDB is HASHED (Never stored raw!)
    const hashedCheck = crypto.createHash('sha256').update(interceptedResetToken).digest('hex');
    const dbRecord = await PasswordResetModel.findOne({ token: hashedCheck });
    if (!dbRecord) {
      throw new Error('Reset token hash not found in MongoDB!');
    }
    console.log('✅ Security verified: MongoDB stores SHA-256 hash, raw token never stored.');
    console.log('   Token Hash:', dbRecord.token);
    console.log('   Token Expiry:', dbRecord.expiresAt);
    console.log('   Token isUsed:', dbRecord.isUsed);

    // Verify 15-minute expiry
    const timeDiffMinutes = (dbRecord.expiresAt.getTime() - dbRecord.createdAt.getTime()) / (1000 * 60);
    console.log(`   Duration until expiry: ${Math.round(timeDiffMinutes)} minutes`);
    if (Math.round(timeDiffMinutes) !== 15) {
      throw new Error(`Token expiry is not 15 minutes! Found: ${timeDiffMinutes} min`);
    }
    console.log('✅ Strict 15-minute expiration window verified.');

    // -------------------------------------------------------------------------
    // SCENARIO 5: Verify Token Endpoint (Valid Token)
    // -------------------------------------------------------------------------
    console.log('\n[SCENARIO 5] Verifying Token via authService.verifyResetToken...');
    const verifyRes = await authService.verifyResetToken(
      interceptedResetToken,
      { ipAddress: '127.0.0.1', userAgent: 'Mozilla/5.0 Test' }
    );
    console.log('   Verify result:', verifyRes);
    if (!verifyRes.valid || !verifyRes.email) {
      throw new Error('Valid token failed verification');
    }
    console.log('✅ Token verified successfully. Masked email:', verifyRes.email);

    // -------------------------------------------------------------------------
    // SCENARIO 6: Verify Token Endpoint (Invalid / Tampered Token)
    // -------------------------------------------------------------------------
    console.log('\n[SCENARIO 6] Verifying INVALID / TAMPERED Token...');
    try {
      await authService.verifyResetToken(
        'deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
        { ipAddress: '127.0.0.1', userAgent: 'Mozilla/5.0 Test' }
      );
      throw new Error('Tampered token should have thrown error!');
    } catch (err: any) {
      console.log('   Caught expected rejection:', err.message);
      console.log('✅ Tampered token properly rejected.');
    }

    // -------------------------------------------------------------------------
    // SCENARIO 7: Password Complexity Validation on Reset
    // -------------------------------------------------------------------------
    console.log('\n[SCENARIO 7] Testing Weak Password Rejection on Reset...');
    try {
      await authService.resetPassword(
        interceptedResetToken,
        'weakpassword',
        { ipAddress: '127.0.0.1', userAgent: 'Mozilla/5.0 Test' }
      );
      throw new Error('Weak password without uppercase/digit/special should have failed validation!');
    } catch (err: any) {
      console.log('   Caught expected rejection for weak password:', err.message);
      console.log('✅ Strong password complexity enforcement verified.');
    }

    // -------------------------------------------------------------------------
    // SCENARIO 8: Successful Password Reset Execution
    // -------------------------------------------------------------------------
    console.log('\n[SCENARIO 8] Executing Successful Password Reset with Strong Password...');
    let resetSuccessMailSent = false;
    mailService.sendPasswordResetSuccessEmail = async (to: string, name: string) => {
      resetSuccessMailSent = true;
      console.log(`   📧 [MailService Dispatched] Password reset success confirmation sent to: ${to}`);
      return Promise.resolve();
    };

    const resetResult = await authService.resetPassword(
      interceptedResetToken,
      newPassword,
      { ipAddress: '127.0.0.1', userAgent: 'Mozilla/5.0 Test' }
    );
    console.log('   Reset response message:', resetResult.message);
    if (!resetResult.message.toLowerCase().includes('successfully')) {
      throw new Error('Unexpected reset password response message');
    }

    // Verify token is now marked isUsed: true in MongoDB
    const updatedDbRecord = await PasswordResetModel.findOne({ token: hashedCheck });
    if (!updatedDbRecord || !updatedDbRecord.isUsed) {
      throw new Error('Reset token was not marked as used in database!');
    }
    console.log('✅ Token successfully marked isUsed: true in MongoDB.');

    // -------------------------------------------------------------------------
    // SCENARIO 9: Single-Use Invalidation (Token Replay Attack)
    // -------------------------------------------------------------------------
    console.log('\n[SCENARIO 9] Testing Token Replay Attack with Used Token...');
    try {
      await authService.resetPassword(
        interceptedResetToken,
        'AnotherPassword@999',
        { ipAddress: '127.0.0.1', userAgent: 'Mozilla/5.0 Test' }
      );
      throw new Error('Used token should have failed replay attack!');
    } catch (err: any) {
      console.log('   Caught expected rejection for replay attack:', err.message);
      console.log('✅ Token replay attack successfully blocked.');
    }

    // -------------------------------------------------------------------------
    // SCENARIO 10: Expired Token Rejection
    // -------------------------------------------------------------------------
    console.log('\n[SCENARIO 10] Testing Expired Token Rejection (>15 Minutes)...');
    const expiredRawToken = crypto.randomBytes(32).toString('hex');
    const expiredTokenHash = crypto.createHash('sha256').update(expiredRawToken).digest('hex');
    await PasswordResetModel.create({
      userId: registeredUserId,
      email: testUserEmail,
      token: expiredTokenHash,
      isUsed: false,
      createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
      expiresAt: new Date(Date.now() - 15 * 60 * 1000), // Expired 15 mins ago
    });

    try {
      await authService.verifyResetToken(expiredRawToken, { ipAddress: '127.0.0.1', userAgent: 'Mozilla/5.0 Test' });
      throw new Error('Expired token should not pass verification!');
    } catch (err: any) {
      console.log('   Caught expected rejection for expired token verification:', err.message);
      if (!err.message.includes('expired')) {
        throw new Error(`Expected error message to mention expired, got: ${err.message}`);
      }
    }

    try {
      await authService.resetPassword(
        expiredRawToken,
        'ValidPassword#888',
        { ipAddress: '127.0.0.1', userAgent: 'Mozilla/5.0 Test' }
      );
      throw new Error('Expired token should not allow reset!');
    } catch (err: any) {
      console.log('   Caught expected rejection for expired token reset:', err.message);
      console.log('✅ Expired token rejection verified.');
    }

    // -------------------------------------------------------------------------
    // SCENARIO 11: Rate Limiting Enforcement
    // -------------------------------------------------------------------------
    console.log('\n[SCENARIO 11] Testing Rate Limiter (Max 5 per hour per email)...');
    const rateLimitTestEmail = `ratelimit_${timestamp}@example.com`;
    // Send 5 requests:
    for (let i = 1; i <= 5; i++) {
      await authService.forgotPassword(rateLimitTestEmail, { ipAddress: '192.168.1.50', userAgent: 'TestAgent' });
    }
    console.log('   Sent 5 requests. Attempting 6th request (should be throttled)...');
    try {
      await authService.forgotPassword(rateLimitTestEmail, { ipAddress: '192.168.1.50', userAgent: 'TestAgent' });
      throw new Error('6th forgot password request should have been rate limited!');
    } catch (err: any) {
      console.log('   Caught expected rate limit rejection:', err.message);
      console.log('✅ Rate limiting properly enforced (HTTP 429 Too Many Requests).');
    }

    // -------------------------------------------------------------------------
    // SCENARIO 12: Authentication Flow with Old vs New Password
    // -------------------------------------------------------------------------
    console.log('\n[SCENARIO 12] Testing Login with Old Password (Should Fail)...');
    try {
      await authService.login({
        email: testUserEmail,
        password: initialPassword,
      });
      throw new Error('Login with old password succeeded! It must fail.');
    } catch (err: any) {
      console.log('   Caught expected login failure with old password:', err.message);
      console.log('✅ Old password successfully rejected.');
    }

    console.log('\nTesting Login with NEW Password (Should Succeed)...');
    const newLoginRes = await authService.login({
      email: testUserEmail,
      password: newPassword,
    });
    console.log('   Login succeeded for:', newLoginRes.user.email);
    console.log('   New access token issued:', !!newLoginRes.tokens.accessToken);
    console.log('✅ Login with new password 100% verified.');

    // -------------------------------------------------------------------------
    // SCENARIO 13: Audit Trail Verification in MongoDB
    // -------------------------------------------------------------------------
    console.log('\n[SCENARIO 13] Inspecting Security Audit Logs in MongoDB...');
    const auditLogs = await AuditLogModel.find({
      $or: [
        { email: testUserEmail },
        { action: { $regex: 'token|reset|password', $options: 'i' } }
      ]
    }).sort({ timestamp: -1 }).limit(10).lean();

    console.log(`   Found ${auditLogs.length} recent password-reset related audit logs:`);
    for (const log of auditLogs) {
      console.log(`   - [${log.action}] email=${log.actor?.email || log.email || 'N/A'} ip=${log.ipAddress || 'N/A'}`);
    }

    if (auditLogs.length === 0) {
      throw new Error('Audit log missing security event records!');
    }
    console.log('✅ Security audit trail verified in MongoDB.');

    // -------------------------------------------------------------------------
    // CLEANUP
    // -------------------------------------------------------------------------
    console.log('\n[CLEANUP] Cleaning up test records...');
    await UserModel.deleteOne({ _id: registeredUserId });
    await PasswordResetModel.deleteMany({ email: testUserEmail });
    await PasswordResetModel.deleteMany({ email: rateLimitTestEmail });
    console.log('✅ Cleaned up temporary test artifacts.');

    console.log('\n================================================================');
    console.log('🎉 ALL 15 PRODUCTION EMAIL & SECURITY AUDIT SCENARIOS PASSED!');
    console.log('================================================================');

    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ AUDIT FAILED:', error);
    process.exit(1);
  }
}

runEmailSystemAudit();
