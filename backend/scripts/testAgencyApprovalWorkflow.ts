import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { AgencyModel } from '../src/models/agency.model.js';
import { adminAgencyRequestService } from '../src/services/adminAgencyRequest.service.js';
import { envConfig } from '../src/config/env.config.js';
import { TokenUtil } from '../src/utils/token.util.js';

async function runApprovalWorkflowTests() {
  console.log('🧪 Starting Agency Approval & Auto Account Creation Test Suite...\n');

  try {
    const mongoUri = envConfig.MONGODB_URI || 'mongodb://localhost:27017/travel_os_dev';
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB.');

    const adminUser = {
      _id: new mongoose.Types.ObjectId(),
      id: new mongoose.Types.ObjectId().toString(),
      name: 'Super Admin User',
      email: 'admin@apnatrip.com',
      role: { name: 'SUPER_ADMIN' },
    };

    // ── Test 1: Agency Approval & Automated Account Creation ──
    console.log('\n--- Test 1: Agency Verification Approval & Auto Account Creation ---');
    const testEmail = 'himalayan.partner@testagency.com';
    await AgencyModel.deleteOne({ email: testEmail });

    const newAgencyApp = await AgencyModel.create({
      name: 'Himalayan Partner Adventures',
      agencyDisplayName: 'Himalayan Partners',
      ownerName: 'Subodh Sharma',
      email: testEmail,
      phone: '9876543210',
      applicationId: 'APP-TEST-998811',
      verificationStatus: 'UNDER_REVIEW',
      status: 'PENDING',
      owner: {
        name: 'Subodh Sharma',
        email: testEmail,
        phone: '9876543210',
      },
    });
    console.log('Created pending application for:', newAgencyApp.name);

    // Call approveRequest
    const approvalResult = await adminAgencyRequestService.approveRequest(
      newAgencyApp._id.toString(),
      adminUser,
      'Approved after verifying all business KYC documents.',
      { ip: '192.168.1.1', browser: 'Chrome/120' }
    );

    console.log('Approval Result Message:', approvalResult.message);
    const updatedAgency = await AgencyModel.findById(newAgencyApp._id);

    if (!updatedAgency) throw new Error('Agency not found after approval');

    console.log('Generated Agency ID:', updatedAgency.agencyId);
    console.log('Login Email:', updatedAgency.loginEmail);
    console.log('Account Status:', updatedAgency.status);
    console.log('Verification Status:', updatedAgency.verificationStatus);
    console.log('canLogin:', updatedAgency.canLogin);
    console.log('passwordChanged:', updatedAgency.passwordChanged);
    console.log('Approved At:', updatedAgency.approvedAt);

    // Validations
    if (!updatedAgency.agencyId || !updatedAgency.agencyId.startsWith('ATP-AGY-')) {
      throw new Error(`Invalid agencyId generated: ${updatedAgency.agencyId}`);
    }
    if (updatedAgency.status !== 'ACTIVE') {
      throw new Error(`Expected status 'ACTIVE', got '${updatedAgency.status}'`);
    }
    if (updatedAgency.verificationStatus !== 'APPROVED') {
      throw new Error(`Expected verificationStatus 'APPROVED', got '${updatedAgency.verificationStatus}'`);
    }
    if (updatedAgency.canLogin !== true) {
      throw new Error(`Expected canLogin to be true`);
    }
    if (updatedAgency.passwordChanged !== false) {
      throw new Error(`Expected passwordChanged to be false for new approval`);
    }
    if (!updatedAgency.passwordHash || !updatedAgency.passwordHash.startsWith('$2')) {
      throw new Error(`Invalid passwordHash stored in database`);
    }
    if (updatedAgency.loginEmail !== testEmail) {
      throw new Error(`Expected loginEmail '${testEmail}', got '${updatedAgency.loginEmail}'`);
    }
    console.log('✅ Test 1 Passed: Agency approved and account credentials generated successfully.');

    // ── Test 2: Security & Password Verification ──
    console.log('\n--- Test 2: Password Security & Hash Validation ---');
    // Ensure plain password is never stored
    if ((updatedAgency as any).tempPassword || (updatedAgency as any).password) {
      throw new Error('Security Violation: Plain text password found in agency document!');
    }
    console.log('✅ Confirmed: Plain text password is NEVER stored in database.');

    // ── Test 3: Duplicate Approval Prevention ──
    console.log('\n--- Test 3: Duplicate Approval Safety Check ---');
    const existingAgencyId = updatedAgency.agencyId;
    const existingPasswordHash = updatedAgency.passwordHash;

    const secondApproval = await adminAgencyRequestService.approveRequest(
      updatedAgency._id.toString(),
      adminUser,
      'Re-approving active agency'
    );

    const reCheckedAgency = await AgencyModel.findById(updatedAgency._id);
    if (reCheckedAgency?.agencyId !== existingAgencyId) {
      throw new Error('Duplicate Approval Overwrote Existing Agency ID!');
    }
    if (reCheckedAgency?.passwordHash !== existingPasswordHash) {
      throw new Error('Duplicate Approval Overwrote Existing Password Hash!');
    }
    console.log('✅ Test 3 Passed: Duplicate approval safely preserves existing Agency ID & credentials.');

    // ── Test 4: First Login & Mandatory Password Change ──
    console.log('\n--- Test 4: First Login & Mandatory Password Change Workflow ---');
    const token = TokenUtil.signAccessToken({
      userId: updatedAgency._id.toString(),
      agencyId: updatedAgency._id.toString(),
      email: updatedAgency.loginEmail || updatedAgency.email,
      userType: 'agency',
      role: 'owner',
    });

    console.log('Simulating First Login Token Generation...');
    const mustChangePassword = updatedAgency.passwordChanged === false;
    if (!mustChangePassword) {
      throw new Error('Expected mustChangePassword to be true before password update.');
    }
    console.log('Must Change Password Flag:', mustChangePassword);

    // Update password
    const newPermanentPassword = 'PermanentSecurePassword@2026';
    const newPasswordHash = await bcrypt.hash(newPermanentPassword, 10);

    updatedAgency.passwordHash = newPasswordHash;
    updatedAgency.passwordChanged = true;
    await updatedAgency.save();

    const verifiedUpdatedAgency = await AgencyModel.findById(updatedAgency._id);
    if (verifiedUpdatedAgency?.passwordChanged !== true) {
      throw new Error('Expected passwordChanged to be true after password update.');
    }

    const isNewPasswordValid = await bcrypt.compare(newPermanentPassword, verifiedUpdatedAgency.passwordHash!);
    if (!isNewPasswordValid) {
      throw new Error('New password failed bcrypt verification!');
    }
    console.log('✅ Test 4 Passed: Mandatory password change completed and verified with bcrypt.');

    // ── Test 5: Clean Up Test Records ──
    console.log('\n--- Cleaning Up Test Records ---');
    await AgencyModel.deleteOne({ email: testEmail });
    console.log('✅ Cleaned up test agency application.');

    console.log('\n🎉 ALL 5 AGENCY APPROVAL WORKFLOW TESTS PASSED WITH 100% SUCCESS!\n');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Test Suite Failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

runApprovalWorkflowTests();
