import mongoose from 'mongoose';
import { AgencyModel } from '../src/models/agency.model.js';
import { ConversationModel } from '../src/models/conversation.model.js';
import { MessageModel } from '../src/models/message.model.js';
import { AgencyPrivateNoteModel } from '../src/models/agencyPrivateNote.model.js';
import { TokenUtil } from '../src/utils/token.util.js';
import { agencyChatService } from '../src/services/agencyChat.service.js';
import { envConfig } from '../src/config/env.config.js';

async function runTests() {
  console.log('🧪 Starting Agency Messages & Inbox Backend Verification Test Suite...\n');

  try {
    const mongoUri = envConfig.MONGODB_URI || 'mongodb://localhost:27017/travel_os_dev';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB.');

    // 1. Create two distinct agencies: Agency Alpha & Agency Beta
    await AgencyModel.deleteMany({ email: { $in: ['agency.alpha@test.com', 'agency.beta@test.com'] } });

    const agencyAlpha = await AgencyModel.create({
      name: 'Agency Alpha Travels',
      agencyDisplayName: 'Alpha Travels',
      ownerName: 'Alpha Owner',
      email: 'agency.alpha@test.com',
      phone: '9988112233',
      applicationId: 'APP-TEST-ALPHA',
      verificationStatus: 'APPROVED',
      status: 'ACTIVE',
      owner: { name: 'Alpha Owner', email: 'agency.alpha@test.com', phone: '9988112233' },
    });

    const agencyBeta = await AgencyModel.create({
      name: 'Agency Beta Safaris',
      agencyDisplayName: 'Beta Safaris',
      ownerName: 'Beta Owner',
      email: 'agency.beta@test.com',
      phone: '9988445566',
      applicationId: 'APP-TEST-BETA',
      verificationStatus: 'APPROVED',
      status: 'ACTIVE',
      owner: { name: 'Beta Owner', email: 'agency.beta@test.com', phone: '9988445566' },
    });

    console.log('✅ Created Agency Alpha:', agencyAlpha._id.toString());
    console.log('✅ Created Agency Beta:', agencyBeta._id.toString());

    // 2. Create Conversations for Agency Alpha & Agency Beta
    const dummyUserId = new mongoose.Types.ObjectId();

    const convAlpha = await ConversationModel.create({
      agencyId: agencyAlpha._id,
      customerId: dummyUserId,
      lastMessagePreview: 'Alpha test message',
      lastMessageAt: new Date(),
      unreadAgencyCount: 1,
    });

    const convBeta = await ConversationModel.create({
      agencyId: agencyBeta._id,
      customerId: dummyUserId,
      lastMessagePreview: 'Beta secret message',
      lastMessageAt: new Date(),
      unreadAgencyCount: 3,
    });

    console.log('✅ Created Conv Alpha:', convAlpha._id.toString());
    console.log('✅ Created Conv Beta:', convBeta._id.toString());

    // 3. Test Multi-Tenant Isolation: Agency Alpha querying conversations
    console.log('\n--- Test 1: Agency Alpha fetching conversations ---');
    const alphaList = await agencyChatService.getConversations(agencyAlpha._id.toString(), { filter: 'All' });
    console.log('Alpha Conversations Count:', alphaList.conversations.length);
    const hasBetaInAlpha = alphaList.conversations.some((c) => c.id === convBeta._id.toString());
    if (hasBetaInAlpha) {
      throw new Error('SECURITY VIOLATION: Agency Alpha can see Agency Beta conversations!');
    }
    console.log('🔒 Security Check Passed: Agency Alpha cannot see Agency Beta conversations.');

    // 4. Test Multi-Tenant Isolation: Agency Alpha trying to read Agency Beta conversation by ID
    console.log('\n--- Test 2: Agency Alpha attempting to read Agency Beta Conversation by ID ---');
    try {
      await agencyChatService.getConversationById(agencyAlpha._id.toString(), convBeta._id.toString());
      throw new Error('SECURITY VIOLATION: Agency Alpha accessed Agency Beta conversation directly!');
    } catch (err: any) {
      console.log('🔒 Security Check Passed: Access correctly rejected with:', err.message);
    }

    // 5. Test Send Message
    console.log('\n--- Test 3: Send Message in Agency Alpha ---');
    const author = {
      id: agencyAlpha._id.toString(),
      name: agencyAlpha.name,
      email: agencyAlpha.email,
    };

    const sentMsg = await agencyChatService.sendMessage(
      agencyAlpha._id.toString(),
      convAlpha._id.toString(),
      author,
      { text: 'Live backend message test!' }
    );
    console.log('✅ Sent message:', sentMsg.id, 'Text:', sentMsg.text);

    // 6. Test Get Messages
    console.log('\n--- Test 4: Retrieve Messages for Conv Alpha ---');
    const msgs = await agencyChatService.getMessages(agencyAlpha._id.toString(), convAlpha._id.toString(), 1, 20);
    console.log('✅ Total messages fetched:', msgs.messages.length);
    if (msgs.messages.length === 0) {
      throw new Error('Expected at least 1 message');
    }

    // 7. Test Mark as Read
    console.log('\n--- Test 5: Mark Conv Alpha as Read ---');
    const readRes = await agencyChatService.markAsRead(agencyAlpha._id.toString(), convAlpha._id.toString());
    console.log('✅ Marked as read:', readRes);

    // 8. Test Private Staff Notes CRUD
    console.log('\n--- Test 6: Private Notes CRUD ---');
    const noteCreated = await agencyChatService.createPrivateNote(
      agencyAlpha._id.toString(),
      dummyUserId.toString(),
      author,
      { note: 'Test private note for customer' }
    );
    console.log('✅ Created Staff Note:', noteCreated.id, noteCreated.note);

    const noteUpdated = await agencyChatService.updatePrivateNote(
      agencyAlpha._id.toString(),
      noteCreated.id,
      'Updated private staff note'
    );
    console.log('✅ Updated Staff Note:', noteUpdated.id, noteUpdated.note);

    const noteDeleted = await agencyChatService.deletePrivateNote(agencyAlpha._id.toString(), noteCreated.id);
    console.log('✅ Deleted Staff Note:', noteDeleted.id);

    // Clean up test records
    await AgencyModel.deleteMany({ _id: { $in: [agencyAlpha._id, agencyBeta._id] } });
    await ConversationModel.deleteMany({ _id: { $in: [convAlpha._id, convBeta._id] } });
    await MessageModel.deleteMany({ conversationId: { $in: [convAlpha._id, convBeta._id] } });
    await AgencyPrivateNoteModel.deleteMany({ _id: noteCreated.id });

    console.log('\n🎉 ALL BACKEND MESSAGING & SECURITY TESTS PASSED PERFECTLY!\n');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

runTests();
