import mongoose from 'mongoose';
import { AgencyModel } from '../src/models/agency.model.js';
import { envConfig } from '../src/config/env.config.js';

async function main() {
  await mongoose.connect(envConfig.MONGODB_URI);
  const agencies = await AgencyModel.find({ isDeleted: false }, {
    email: 1, name: 1, applicationId: 1, onboardingStatus: 1, verificationStatus: 1, paymentStatus: 1, documents: 1, bankDetails: 1
  }).sort({ createdAt: -1 }).limit(5).lean();

  console.log('Recent Agencies in MongoDB:');
  for (const a of agencies) {
    console.log({
      id: a._id,
      name: a.name,
      appId: a.applicationId,
      email: a.email,
      onboarding: a.onboardingStatus,
      verification: a.verificationStatus,
      payment: a.paymentStatus,
      docsCount: a.documents?.length || 0,
      bank: a.bankDetails?.bankName ? `${a.bankDetails.bankName} - ${a.bankDetails.accountNumber}` : 'none',
    });
  }
  await mongoose.disconnect();
}

main().catch(console.error);
