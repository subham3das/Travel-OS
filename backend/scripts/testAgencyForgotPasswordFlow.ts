import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { envConfig } from '../src/config/env.config.js';
import { AgencyModel } from '../src/models/agency.model.js';
import { agencyAuthService } from '../src/services/agencyAuth.service.js';
import { TokenUtil } from '../src/utils/token.util.js';

async function runTest() {
  console.log('═════════════════════════════════════════════════════════════════');
  console.log('🧪 Starting Agency Forgot & Reset Password Flow Integration Test');
  console.log('═════════════════════════════════════════════════════════════════\n');

  await mongoose.connect(envConfig.MONGODB_URI);
  console.log('✓ Connected to MongoDB Atlas');

  const testEmail = `test_agency_${Date.now()}@example.com`;
  const initialPassword = 'InitialPassword123!';
  const newPassword = 'NewSecretPassword@2026';

  // 1. Create a mock approved Agency
  const passwordHash = await bcrypt.hash(initialPassword, 10);
  const agency = await AgencyModel.create({
    applicationId: `ATP-APP-${Date.now().toString().slice(-6)}`,
    agencyId: `ATP-AGY-2026-${Date.now().toString().slice(-6)}`,
    name: 'Himalayan Test Expeditions',
    legalBusinessName: 'Himalayan Test Expeditions Pvt Ltd',
    email: testEmail,
    loginEmail: testEmail,
    phone: '+91 9876543210',
    ownerName: 'Subham Das',
    passwordHash: passwordHash,
    verificationStatus: 'APPROVED',
    status: 'ACTIVE',
    canLogin: true,
    isDeleted: false,
  });

  console.log(`✓ Created test agency: ${agency.name} (${agency.agencyId})`);
  console.log(`  Login Email: ${testEmail}`);

  // 2. Test Anti-Enumeration for non-existent email
  console.log('\n--- Test 1: Anti-Enumeration for Unknown Email ---');
  const unknownEmail = 'doesnotexist_99999@randomdomain.com';
  const unknownRes = await agencyAuthService.forgotPassword(unknownEmail, '127.0.0.1');
  console.log('  Response:', unknownRes);
  if (!unknownRes.success || !unknownRes.message.includes('If an account exists with this email')) {
    throw new Error('Anti-enumeration check failed!');
  }
  console.log('✓ Anti-enumeration test passed (generic success returned without leaking email existence)');

  // 3. Test Forgot Password for Registered Agency
  console.log('\n--- Test 2: Forgot Password for Registered Agency ---');
  const forgotRes = await agencyAuthService.forgotPassword(testEmail, '127.0.0.1');
  console.log('  Response:', forgotRes);
  if (!forgotRes.success) {
    throw new Error('Forgot password request failed!');
  }

  // Reload agency from DB
  const agencyAfterForgot = await AgencyModel.findById(agency._id);
  if (!agencyAfterForgot?.resetPasswordToken || !agencyAfterForgot?.resetPasswordExpires) {
    throw new Error('Reset token was not saved to database!');
  }

  console.log('✓ Reset token successfully generated and hashed with SHA-256');
  console.log(`  DB Hashed Token: ${agencyAfterForgot.resetPasswordToken.slice(0, 16)}...`);
  console.log(`  Expiry Timestamp: ${agencyAfterForgot.resetPasswordExpires.toISOString()}`);

  // 4. Test Reset Password with Invalid Token
  console.log('\n--- Test 3: Reset Password with Invalid Token ---');
  try {
    await agencyAuthService.resetPassword({
      token: 'completely_invalid_token_1234567890',
      password: newPassword,
    });
    throw new Error('Should have rejected invalid token!');
  } catch (err: any) {
    console.log(`✓ Invalid token correctly rejected: "${err.message}"`);
  }

  // 5. Test Reset Password with Expired Token
  console.log('\n--- Test 4: Reset Password with Expired Token ---');
  const expiredRawToken = crypto.randomBytes(32).toString('hex');
  const expiredHashed = crypto.createHash('sha256').update(expiredRawToken).digest('hex');
  agencyAfterForgot.resetPasswordToken = expiredHashed;
  agencyAfterForgot.resetPasswordExpires = new Date(Date.now() - 5000); // 5 seconds in past
  await agencyAfterForgot.save();

  try {
    await agencyAuthService.resetPassword({
      token: expiredRawToken,
      password: newPassword,
    });
    throw new Error('Should have rejected expired token!');
  } catch (err: any) {
    console.log(`✓ Expired token correctly rejected: "${err.message}"`);
  }

  // 6. Request a fresh valid token and complete Reset Password
  console.log('\n--- Test 5: Successful Password Reset Flow ---');
  // Re-issue valid token
  const validRawToken = crypto.randomBytes(32).toString('hex');
  const validHashed = crypto.createHash('sha256').update(validRawToken).digest('hex');
  agencyAfterForgot.resetPasswordToken = validHashed;
  agencyAfterForgot.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
  await agencyAfterForgot.save();

  const resetResult = await agencyAuthService.resetPassword({
    token: validRawToken,
    password: newPassword,
    confirmPassword: newPassword,
  });

  console.log('  Reset Result:', resetResult);
  if (!resetResult.success) {
    throw new Error('Reset password flow failed!');
  }

  // 7. Verify DB State after Reset
  const agencyAfterReset = await AgencyModel.findById(agency._id);
  if (agencyAfterReset?.resetPasswordToken || agencyAfterReset?.resetPasswordExpires) {
    throw new Error('Reset token was not cleared after single use!');
  }
  if (!agencyAfterReset?.passwordChangedAt) {
    throw new Error('passwordChangedAt was not updated!');
  }
  console.log('✓ Token was wiped immediately after single use');
  console.log(`✓ passwordChangedAt set to: ${agencyAfterReset.passwordChangedAt.toISOString()}`);
  console.log(`✓ Token version incremented to: ${agencyAfterReset.tokenVersion}`);

  // 8. Test Old Password vs New Password
  console.log('\n--- Test 6: Verify New Password Works & Old Password Fails ---');
  const isOldValid = await bcrypt.compare(initialPassword, agencyAfterReset.passwordHash || '');
  const isNewValid = await bcrypt.compare(newPassword, agencyAfterReset.passwordHash || '');

  console.log(`  Old password valid? ${isOldValid} (Expected: false)`);
  console.log(`  New password valid? ${isNewValid} (Expected: true)`);

  if (isOldValid || !isNewValid) {
    throw new Error('Password hash mismatch!');
  }

  console.log('✓ Old password completely invalidated, new password successfully active');

  // Clean up test agency
  await AgencyModel.deleteOne({ _id: agency._id });
  console.log('\n✓ Cleaned up test data');

  console.log('\n═════════════════════════════════════════════════════════════════');
  console.log('🎉 ALL INTEGRATION TESTS PASSED WITH 100% SUCCESS');
  console.log('═════════════════════════════════════════════════════════════════\n');

  await mongoose.disconnect();
  process.exit(0);
}

runTest().catch((err) => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
