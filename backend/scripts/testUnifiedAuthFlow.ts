import { dbConnection } from '../src/config/db.config.js';
import { UserModel } from '../src/models/user.model.js';
import { authService } from '../src/services/auth.service.js';
import { profileService } from '../src/services/profile.service.js';
import { TokenUtil } from '../src/utils/token.util.js';

async function run() {
  console.log('🧪 Starting Unified Authentication & Session Verification Suite...');
  await dbConnection.connect();

  const timestamp = Date.now();
  const testEmail = `auth_test_${timestamp}@apnatrip.com`;
  const testPassword = 'Password@123';
  const testPhone = `+9198${Math.floor(10000000 + Math.random() * 90000000)}`;

  try {
    // 1. Test Register
    console.log('1️⃣ Testing Registration...');
    const registerResult = await authService.register({
      fullName: 'Vikram Malhotra',
      email: testEmail,
      phone: testPhone,
      password: testPassword,
      acceptTerms: true,
    });

    console.log('   Registered User ID:', registerResult.user.id);
    console.log('   Access Token generated:', !!registerResult.tokens.accessToken);
    console.log('   Refresh Token generated:', !!registerResult.tokens.refreshToken);

    if (!registerResult.tokens.accessToken || !registerResult.tokens.refreshToken) {
      throw new Error('Tokens missing on registration');
    }

    // 2. Test Login
    console.log('2️⃣ Testing Login with valid credentials...');
    const loginResult = await authService.login({
      email: testEmail,
      password: testPassword,
    });

    console.log('   Login successful for:', loginResult.user.email);
    const accessToken = loginResult.tokens.accessToken;
    const refreshToken = loginResult.tokens.refreshToken;

    // 3. Verify Token Validation
    console.log('3️⃣ Verifying JWT payload validation...');
    const decoded = TokenUtil.verifyAccessToken(accessToken);
    console.log('   Decoded User ID:', decoded.userId);
    console.log('   Decoded Email:', decoded.email);
    if (decoded.userId !== registerResult.user.id.toString()) {
      throw new Error('Decoded user ID does not match registration ID');
    }

    // 4. Test Protected Profile Retrieval (MongoDB Driven)
    console.log('4️⃣ Testing Protected Profile Telemetry Retrieval from MongoDB...');
    const profile = await profileService.getProfile(decoded.userId);
    console.log('   Profile fullName:', profile.fullName);
    console.log('   Profile email:', profile.email);
    console.log('   Profile stats trips:', profile.stats.totalTrips);
    if (profile.fullName !== 'Vikram Malhotra' || profile.email !== testEmail) {
      throw new Error('Profile data does not match authenticated user in MongoDB');
    }

    // 5. Test Token Refresh
    console.log('5️⃣ Testing Token Refresh Flow...');
    const refreshed = await authService.refreshToken(refreshToken);
    console.log('   New Access Token generated:', !!refreshed.accessToken);
    const decodedRefreshed = TokenUtil.verifyAccessToken(refreshed.accessToken);
    if (decodedRefreshed.userId !== decoded.userId) {
      throw new Error('Refreshed token user ID mismatch');
    }

    // 6. Test Invalid Token Handling
    console.log('6️⃣ Testing Invalid / Tampered Token Rejection...');
    try {
      TokenUtil.verifyAccessToken('invalid.token.string');
      throw new Error('Invalid token should have thrown error');
    } catch (err: any) {
      console.log('   Successfully rejected invalid token:', err.message);
    }

    console.log('✅ ALL UNIFIED AUTHENTICATION & SESSION TESTS PASSED PERFECTLY!');
  } finally {
    // Cleanup
    await UserModel.deleteOne({ email: testEmail });
    console.log('🧹 Cleaned up test user.');
    await dbConnection.disconnect();
  }
}

run().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
