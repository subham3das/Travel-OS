import mongoose from 'mongoose';
import { RegistrationDraftModel } from '../src/models/registrationDraft.model.js';
import { AgencyModel } from '../src/models/agency.model.js';
import { ApprovalRequestModel } from '../src/models/approvalRequest.model.js';
import { adminAgencyRequestService } from '../src/services/adminAgencyRequest.service.js';
import { envConfig } from '../src/config/env.config.js';

async function main() {
  await mongoose.connect(envConfig.MONGODB_URI);

  const agency = await AgencyModel.findOne({ name: 'Himalaya Horizon Expeditions' }).lean();
  if (!agency) {
    console.log('No agency found with name Himalaya Horizon Expeditions');
    await mongoose.disconnect();
    return;
  }

  const draft = await RegistrationDraftModel.findOne({
    $or: [{ userId: agency.ownerId }, { 'businessDetails.email': agency.email }]
  }).lean();

  const approvalReq = await ApprovalRequestModel.findOne({
    $or: [{ agencyId: agency._id }, { email: agency.email }]
  }).lean();

  const adminDto = await adminAgencyRequestService.getAgencyRequestById(agency._id.toString());

  console.log('\n================ PIPELINE DATA VERIFICATION ================');
  console.log('1. RegistrationDraft:');
  console.log('   - draftId:', draft?.draftId);
  console.log('   - isCompleted:', draft?.isCompleted);
  console.log('   - documentsCount:', draft?.documents?.length);
  console.log('   - bank:', draft?.bank?.bankName, draft?.bank?.accountNumber, draft?.bank?.ifscCode);

  console.log('\n2. Agency (MongoDB):');
  console.log('   - id:', agency._id);
  console.log('   - applicationId:', agency.applicationId);
  console.log('   - onboardingStatus:', agency.onboardingStatus);
  console.log('   - paymentStatus:', agency.paymentStatus);
  console.log('   - documentsCount:', agency.documents?.length);
  console.log('   - bankDetails:', agency.bankDetails?.bankName, agency.bankDetails?.accountNumber, agency.bankDetails?.ifscCode, agency.bankDetails?.branch);

  console.log('\n3. ApprovalRequest (MongoDB):');
  console.log('   - id:', approvalReq?._id);
  console.log('   - applicationId:', approvalReq?.applicationId);
  console.log('   - documentsCount:', approvalReq?.documents?.length);
  console.log('   - bank:', approvalReq?.bank?.bankName, approvalReq?.bank?.accountNumber, approvalReq?.bank?.ifscCode, (approvalReq?.bank as any)?.branch);

  console.log('\n4. Admin DTO (Admin API):');
  console.log('   - documentsUploadedCount:', adminDto.documentsUploadedCount);
  console.log('   - documentsTotalCount:', adminDto.documentsTotalCount);
  console.log('   - missing:', adminDto.documentsTotalCount - adminDto.documentsUploadedCount);
  console.log('   - documentsArrayLength:', adminDto.documents.length);
  console.log('   - bankName:', adminDto.bankDetails?.bankName);
  console.log('   - accountNumber:', adminDto.bankDetails?.accountNumber);
  console.log('   - ifscCode:', adminDto.bankDetails?.ifscCode);
  console.log('   - branch:', adminDto.bankDetails?.branch);
  console.log('============================================================\n');

  await mongoose.disconnect();
}

main().catch(console.error);
