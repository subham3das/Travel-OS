import { dbConnection } from '../src/config/db.config.js';
import { AdminModel } from '../src/models/admin.model.js';
import { adminAuthService } from '../src/services/adminAuth.service.js';
import { adminRepository } from '../src/repositories/admin.repository.js';
import { TokenUtil } from '../src/utils/token.util.js';
import { HashUtil } from '../src/utils/hash.util.js';
import mongoose from 'mongoose';

async function run() {
  console.log('🧪 Starting Super Admin Production Authentication Test Suite...');
  await dbConnection.connect();

  const timestamp = Date.now();
  const testAdminEmail = `superadmin_${timestamp}@travelos.com`;
  const testAdminPassword = 'SuperSecretAdminPass@2026';

  try {
    // Test 1: Unregistered Email Login
    console.log('1️⃣ Testing Unregistered Email Rejection...');
    try {
      await adminAuthService.login({
        email: 'unregistered_hacker@domain.com',
        password: 'RandomPassword123',
      });
      throw new Error('Unregistered admin should have been rejected!');
    } catch (err: any) {
      console.log('   Correctly rejected unregistered email:', err.message);
      if (err.message !== 'This email is not registered as a Super Admin.') {
        throw new Error(`Unexpected error message: ${err.message}`);
      }
    }

    // Test 2: Pre-create an Authorized Admin in MongoDB
    console.log('2️⃣ Pre-registering authorized Super Admin in MongoDB...');
    const passwordHash = await HashUtil.hash(testAdminPassword);
    const createdAdmin = await adminRepository.create({
      fullName: 'Vikram Super Admin',
      email: testAdminEmail,
      password: passwordHash,
      role: 'SUPER_ADMIN',
      permissions: ['ALL'],
      isSuperAdmin: true,
      isActive: true,
      authProvider: 'both',
    });
    console.log('   Admin created in DB with ID:', createdAdmin._id);

    // Test 3: Wrong Password
    console.log('3️⃣ Testing Incorrect Password Handling...');
    try {
      await adminAuthService.login({
        email: testAdminEmail,
        password: 'WrongPassword@999',
      });
      throw new Error('Wrong password should have been rejected!');
    } catch (err: any) {
      console.log('   Correctly rejected wrong password:', err.message);
      if (err.message !== 'Incorrect email or password.') {
        throw new Error(`Unexpected error message: ${err.message}`);
      }
    }

    // Test 4: Correct Password Login
    console.log('4️⃣ Testing Successful Super Admin Login...');
    const loginRes = await adminAuthService.login({
      email: testAdminEmail,
      password: testAdminPassword,
    });
    console.log('   Login success! Admin Name:', loginRes.admin.name);
    console.log('   Admin Role:', loginRes.admin.role);
    console.log('   Is Super Admin:', loginRes.admin.isSuperAdmin);
    console.log('   Tokens issued:', !!loginRes.tokens.accessToken, !!loginRes.tokens.refreshToken);

    if (loginRes.admin.role !== 'SUPER_ADMIN' || !loginRes.admin.isSuperAdmin) {
      throw new Error('Admin role or isSuperAdmin mismatch');
    }

    // Test 5: Verify Admin JWT Payload
    console.log('5️⃣ Verifying Admin JWT isolation & userType...');
    const decoded = TokenUtil.verifyAccessToken(loginRes.tokens.accessToken);
    console.log('   Decoded userType:', decoded.userType);
    console.log('   Decoded adminId:', decoded.adminId);
    if (decoded.userType !== 'ADMIN') {
      throw new Error('Token userType is not ADMIN');
    }

    // Test 6: Get Me Profile from MongoDB
    console.log('6️⃣ Testing getMe authenticated query...');
    const me = await adminAuthService.getMe(loginRes.admin.id);
    console.log('   getMe returned:', me.email, me.fullName, me.permissions);
    if (me.email !== testAdminEmail) {
      throw new Error('getMe email mismatch');
    }

    // Test 7: Google Login with Unregistered Email (Strict: No Auto-Signup)
    console.log('7️⃣ Testing Google Login with Unregistered Email...');
    const unregisteredGooglePayload = {
      // Mocked Google ID Token payload structure
      idToken: `mock.${Buffer.from(JSON.stringify({ email: 'unauthorized_google@travelos.com', sub: 'g-12345' })).toString('base64')}.mock`,
    };
    try {
      await adminAuthService.googleLogin(unregisteredGooglePayload);
      throw new Error('Unregistered Google login should have been rejected!');
    } catch (err: any) {
      console.log('   Correctly rejected unauthorized Google account:', err.message);
      if (err.message !== 'This Google account is not registered as a Super Admin.') {
        throw new Error(`Unexpected Google rejection message: ${err.message}`);
      }
    }

    // Test 8: Disabled Admin Account Rejection
    console.log('8️⃣ Testing Disabled Account Rejection...');
    await adminRepository.updateById(createdAdmin._id as mongoose.Types.ObjectId, {
      isActive: false,
    });
    try {
      await adminAuthService.login({
        email: testAdminEmail,
        password: testAdminPassword,
      });
      throw new Error('Disabled admin should have been rejected!');
    } catch (err: any) {
      console.log('   Correctly rejected disabled account:', err.message);
      if (err.message !== 'Your administrator account has been disabled.') {
        throw new Error(`Unexpected disabled error message: ${err.message}`);
      }
    }

    console.log('\n✅ ALL 8 SUPER ADMIN AUTHENTICATION TESTS PASSED 100% PERFECTLY!\n');
  } finally {
    // Cleanup
    await AdminModel.deleteOne({ email: testAdminEmail });
    console.log('🧹 Cleaned up test admin account.');
    await dbConnection.disconnect();
  }
}

run().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
