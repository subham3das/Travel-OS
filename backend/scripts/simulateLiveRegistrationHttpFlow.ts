import mongoose from 'mongoose';
import { AdminModel } from '../src/models/admin.model.js';
import { TokenUtil, JwtTokenPayload } from '../src/utils/token.util.js';
import { envConfig } from '../src/config/env.config.js';
import { PartnerUserModel } from '../src/models/partnerUser.model.js';
import { AgencyModel } from '../src/models/agency.model.js';
import bcrypt from 'bcrypt';

async function main() {
  await mongoose.connect(envConfig.MONGODB_URI);
  console.log('✅ Connected to MongoDB Atlas');

  const testEmail = `live.partner.${Date.now()}@apnatrip.com`;
  const testPhone = '98765' + Math.floor(10000 + Math.random() * 90000);
  const password = 'Password@123';
  const businessName = 'Himalaya Horizon Expeditions';
  const ownerName = 'Subham Das';

  console.log('\n--- 1. Creating Partner User in MongoDB ---');
  const passwordHash = await bcrypt.hash(password, 10);
  const partnerUser = await PartnerUserModel.create({
    name: ownerName,
    email: testEmail,
    phone: testPhone,
    passwordHash,
    emailVerified: true,
    phoneVerified: true,
    role: 'partner',
  });

  const partnerToken = TokenUtil.signAccessToken({
    userId: partnerUser._id.toString(),
    email: testEmail,
    name: ownerName,
    phone: testPhone,
    userType: 'agency',
    role: 'owner',
  });

  console.log('✅ Partner User Created:', partnerUser._id.toString(), testEmail);

  // 2. HTTP Call: Save Draft with 6 Cloudinary Documents & Full Bank Details
  console.log('\n--- 2. HTTP POST /api/registration/draft ---');
  const draftId = `DFT-LIVE-${Date.now()}`;
  const draftPayload = {
    draftId,
    userId: partnerUser._id.toString(),
    serviceType: 'agency',
    businessDetails: {
      legalBusinessName: 'Himalaya Horizon Expeditions Pvt Ltd',
      businessName,
      agencyDisplayName: businessName,
      email: testEmail,
      loginEmail: testEmail,
      phone: testPhone,
      ownerName,
      businessType: 'Travel Agency',
      gstNumber: '07AAAAA0000A1Z5',
      panNumber: 'ABCDE1234F',
      businessAddress: 'Plot 42, Connaught Circus',
      city: 'New Delhi',
      state: 'Delhi',
      pinCode: '110001',
      country: 'India',
    },
    profileDetails: {
      logoUrl: 'https://res.cloudinary.com/hcysv27y/image/upload/v1720000000/travelos/logo.jpg',
      coverUrl: 'https://res.cloudinary.com/hcysv27y/image/upload/v1720000000/travelos/cover.jpg',
      about: 'Premier Himalayan travel, trekking, and expedition operators.',
      tagline: 'Explore the Himalayas with confidence',
      yearsOfExperience: '10',
      teamSize: '15',
    },
    documents: [
      {
        id: 'doc-reg-cert',
        name: 'Business Registration Certificate',
        type: 'Business Registration',
        fileUrl: 'https://res.cloudinary.com/hcysv27y/image/upload/v1720000000/travelos/registration_cert.pdf',
        size: 145000,
      },
      {
        id: 'doc-gst-cert',
        name: 'GST Certificate',
        type: 'GST Certificate',
        fileUrl: 'https://res.cloudinary.com/hcysv27y/image/upload/v1720000000/travelos/gst_certificate.pdf',
        size: 120000,
      },
      {
        id: 'doc-pan-card',
        name: 'Company PAN Card',
        type: 'PAN Card',
        fileUrl: 'https://res.cloudinary.com/hcysv27y/image/upload/v1720000000/travelos/company_pan.pdf',
        size: 98000,
      },
      {
        id: 'doc-gov-id',
        name: 'Owner Government ID (Aadhaar)',
        type: 'Government ID',
        fileUrl: 'https://res.cloudinary.com/hcysv27y/image/upload/v1720000000/travelos/owner_aadhaar.pdf',
        size: 210000,
      },
      {
        id: 'doc-selfie',
        name: 'Owner Photo / Selfie',
        type: 'Owner Photo',
        fileUrl: 'https://res.cloudinary.com/hcysv27y/image/upload/v1720000000/travelos/owner_photo.jpg',
        size: 85000,
      },
      {
        id: 'doc-address-proof',
        name: 'Office Address Proof',
        type: 'Address Proof',
        fileUrl: 'https://res.cloudinary.com/hcysv27y/image/upload/v1720000000/travelos/office_address_proof.pdf',
        size: 175000,
      },
    ],
    bank: {
      accountHolderName: 'Himalaya Horizon Expeditions Pvt Ltd',
      bankName: 'HDFC Bank',
      accountNumber: '50200098765432',
      ifscCode: 'HDFC0001234',
      branch: 'Connaught Place New Delhi',
      upiId: 'himalaya@hdfcbank',
      accountType: 'Current Account',
      payoutMethod: 'bank',
    },
    currentStep: 5,
  };

  const draftRes = await fetch('http://localhost:5000/api/registration/draft', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${partnerToken}`,
    },
    body: JSON.stringify(draftPayload),
  });

  const draftJson: any = await draftRes.json();
  console.log('✅ POST /api/registration/draft status:', draftRes.status, draftJson.success);

  // 3. Create initial Agency record for partner (as happens during account registration)
  const initialAgency = await AgencyModel.create({
    applicationId: `AGY-REQ-2026-${Math.floor(10000 + Math.random() * 90000)}`,
    name: businessName,
    legalBusinessName: businessName,
    agencyDisplayName: businessName,
    email: testEmail,
    loginEmail: testEmail,
    phone: testPhone,
    ownerName,
    ownerId: partnerUser._id,
    businessType: 'Travel Agency',
    businessTypes: ['agency'],
    activeBusiness: 'agency',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    owner: {
      name: ownerName,
      email: testEmail,
      phone: testPhone,
    },
    passwordHash,
    canLogin: true,
    isActive: true,
    emailVerified: true,
    phoneVerified: true,
    onboardingStatus: 'PAYMENT_PENDING',
    verificationStatus: 'PENDING',
    status: 'PENDING',
    paymentStatus: 'PENDING',
  });

  console.log('✅ Initial Agency Record Created in DB:', initialAgency._id.toString());

  // Generate Agency-scoped token
  const agencyToken = TokenUtil.signAccessToken({
    userId: partnerUser._id.toString(),
    agencyId: initialAgency._id.toString(),
    email: testEmail,
    name: ownerName,
    phone: testPhone,
    userType: 'agency',
    role: 'owner',
  });

  // 4. HTTP POST /api/subscriptions/create-order
  console.log('\n--- 3. HTTP POST /api/subscriptions/create-order ---');
  const orderRes = await fetch('http://localhost:5000/api/subscriptions/create-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${agencyToken}`,
    },
    body: JSON.stringify({
      businessType: 'agency',
      draftId,
    }),
  });

  const orderJson: any = await orderRes.json();
  console.log('✅ POST /api/subscriptions/create-order status:', orderRes.status, orderJson.data?.subscriptionId);
  const subscriptionId = orderJson.data?.subscriptionId;
  const razorpayOrderId = orderJson.data?.orderId || `order_${Date.now()}`;
  const mockPaymentId = `pay_mock_${Date.now()}`;

  // 5. HTTP POST /api/subscriptions/verify-payment
  console.log('\n--- 4. HTTP POST /api/subscriptions/verify-payment ---');
  const verifyRes = await fetch('http://localhost:5000/api/subscriptions/verify-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${agencyToken}`,
    },
    body: JSON.stringify({
      subscriptionId,
      orderId: razorpayOrderId,
      paymentId: mockPaymentId,
      draftId,
    }),
  });

  const verifyJson: any = await verifyRes.json();
  console.log('✅ POST /api/subscriptions/verify-payment status:', verifyRes.status, verifyJson.success);

  // 6. Generate Super Admin Access Token for Browser Test
  console.log('\n--- 5. Preparing Super Admin Credentials for Browser Session ---');
  const superAdmin = await AdminModel.findOne({ email: 'das01subhamj@gmail.com' }).lean();
  if (!superAdmin) throw new Error('Super Admin not found in DB');

  const adminTokenPayload: JwtTokenPayload = {
    userId: superAdmin._id.toString(),
    adminId: superAdmin._id.toString(),
    email: superAdmin.email,
    role: superAdmin.role,
    userType: 'ADMIN',
    isSuperAdmin: true,
    permissions: ['ALL'],
  };

  const adminAccessToken = TokenUtil.signAccessToken(adminTokenPayload);
  const adminRefreshToken = TokenUtil.signRefreshToken(adminTokenPayload);

  const adminAuthState = {
    isAuthenticated: true,
    isLoading: false,
    admin: {
      id: superAdmin._id.toString(),
      fullName: `${superAdmin.firstName || 'Super'} ${superAdmin.lastName || 'Admin'}`,
      name: `${superAdmin.firstName || 'Super'} ${superAdmin.lastName || 'Admin'}`,
      email: superAdmin.email,
      role: superAdmin.role || 'SUPER_ADMIN',
      permissions: ['ALL'],
      avatar: '',
      profileImage: '',
      isActive: true,
      isSuperAdmin: true,
      authProvider: 'LOCAL',
    },
    token: adminAccessToken,
    refreshToken: adminRefreshToken,
    sessionStartedAt: new Date().toISOString(),
  };

  // 7. Verify via Admin API
  console.log('\n--- 6. Verifying via HTTP GET /api/admin/agency-requests ---');
  const adminApiRes = await fetch(`http://localhost:5000/api/admin/agency-requests?search=${encodeURIComponent(testEmail)}`, {
    headers: {
      Authorization: `Bearer ${adminAccessToken}`,
    },
  });
  const adminApiJson: any = await adminApiRes.json();
  console.log('✅ Admin API returned status:', adminApiRes.status, 'Total items:', adminApiJson.data?.items?.length);
  const targetAgencyItem = adminApiJson.data?.items?.[0];

  console.log('\n🔍 TARGET AGENCY INSPECTION:');
  console.log('   • Name:', targetAgencyItem?.agencyName);
  console.log('   • Documents Uploaded:', targetAgencyItem?.documentsUploadedCount, '/ 6');
  console.log('   • Documents in Tab:', targetAgencyItem?.documents?.length);
  console.log('   • Bank Name:', targetAgencyItem?.bankDetails?.bankName);
  console.log('   • Account Number:', targetAgencyItem?.bankDetails?.accountNumber);
  console.log('   • IFSC Code:', targetAgencyItem?.bankDetails?.ifscCode);
  console.log('   • Branch:', targetAgencyItem?.bankDetails?.branch);

  // Write localStorage setup file for browser subagent
  const browserSetup = {
    agencyId: initialAgency._id.toString(),
    agencyName: businessName,
    agencyEmail: testEmail,
    adminAccessToken,
    adminRefreshToken,
    adminAuthState,
  };

  await mongoose.disconnect();
  console.log('\n🚀 BROWSER SESSION READY!');
  return browserSetup;
}

main().catch(console.error);
