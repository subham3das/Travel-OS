import { AdminModel } from '../src/models/admin.model.js';
import { adminProfileService } from '../src/services/adminProfile.service.js';
import { adminAuthService } from '../src/services/adminAuth.service.js';
import { TokenUtil } from '../src/utils/token.util.js';
import { dbConnection } from '../src/config/db.config.js';

async function verifySuperAdminProfile() {
  console.log('🧪 Verifying Super Admin JWT & Profile for: das01subhamj@gmail.com against live MongoDB Atlas...\n');

  try {
    await dbConnection.connect();

    // 1. Authenticate das01subhamj@gmail.com (Super Admin)
    console.log('1️⃣ Authenticating Super Admin (das01subhamj@gmail.com)...');
    const authResult = await adminAuthService.login(
      { email: 'das01subhamj@gmail.com', password: 'AdminPassword@123' },
      { ipAddress: '127.0.0.1', userAgent: 'Chrome on Windows (Integration Test)' }
    );

    const token = authResult.tokens.accessToken;
    console.log('   Access Token issued successfully.');

    // 2. Verify JWT Payload
    console.log('2️⃣ Verifying JWT Token Payload...');
    const decoded = TokenUtil.verifyAccessToken(token);
    console.log(`   JWT UserType: ${decoded.userType}`);
    console.log(`   JWT Email: ${decoded.email}`);
    console.log(`   JWT Role: ${decoded.role}`);
    console.log(`   JWT isSuperAdmin: ${decoded.isSuperAdmin}`);

    if (decoded.email !== 'das01subhamj@gmail.com') {
      throw new Error(`JWT email mismatch: expected das01subhamj@gmail.com, got ${decoded.email}`);
    }
    if (decoded.userType !== 'ADMIN') {
      throw new Error(`JWT userType mismatch: expected ADMIN, got ${decoded.userType}`);
    }

    // 3. Fetch Profile using decoded.userId (Session Driven via Admin collection)
    console.log('3️⃣ Fetching Profile from Admin collection via decoded.userId...');
    const adminId = decoded.userId;
    const profile = await adminProfileService.getProfile(adminId);

    console.log(`   Full Name: ${profile.personalInfo.firstName} ${profile.personalInfo.lastName}`);
    console.log(`   Email: ${profile.personalInfo.email}`);
    console.log(`   Admin ID: ${profile.personalInfo.adminId}`);
    console.log(`   Role: ${profile.personalInfo.role}`);
    console.log(`   Security Score: ${profile.accountStatus.securityScore}%`);

    if (profile.personalInfo.email !== 'das01subhamj@gmail.com') {
      throw new Error(`Profile email mismatch: expected das01subhamj@gmail.com, got ${profile.personalInfo.email}`);
    }

    console.log('\n✅ VERIFICATION COMPLETE: JWT AND ADMIN PROFILE MATCH das01subhamj@gmail.com 100% PERFECTLY!\n');
  } catch (error: any) {
    console.error('❌ Verification Failed:', error.message);
    process.exit(1);
  } finally {
    await dbConnection.disconnect();
    process.exit(0);
  }
}

verifySuperAdminProfile();
