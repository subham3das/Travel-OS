import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { customerChatService } from '../src/services/customerChat.service.js';
import { UserModel } from '../src/models/user.model.js';

async function runCustomerChatTest() {
  console.log('🧪 Starting Batch 5 Customer Real-Time Chat Integration Test...');
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/apnatrip';
  await mongoose.connect(mongoUri);
  console.log(' Connected to MongoDB');

  try {
    let user = await UserModel.findOne({ role: 'customer' });
    if (!user) user = await UserModel.findOne();
    if (!user) throw new Error('No user found');

    const userId = String(user._id);
    console.log(`👤 Testing Chat with User: ${user.fullName || user.email} (${userId})`);

    // 1. Get customer conversations (auto-initializes if none)
    const convs = await customerChatService.getCustomerConversations(userId);
    console.log(`✅ Retrieved Customer Conversations: Count = ${convs.length}`);
    if (convs.length === 0) throw new Error('Expected at least 1 conversation');

    const activeConv = convs[0];
    console.log(`   Conversation: "${activeConv.agencyName}" (ID: ${activeConv.id})`);
    console.log(`   Last message: "${activeConv.lastMessage}" at ${activeConv.lastMessageTime}`);

    // 2. Send a message from the customer
    const sent = await customerChatService.sendMessage(userId, {
      conversationId: activeConv.id,
      text: 'Hello! I have a question about our pickup location at the airport.',
    });
    console.log(`✅ Sent Message: ID = ${sent.id}, Text = "${sent.text}" at ${sent.timestamp}`);

    // 3. Retrieve conversation by ID and verify message exists
    const retrievedConv = await customerChatService.getConversationById(userId, activeConv.id);
    console.log(`✅ Retrieved Conversation by ID: Total Messages = ${retrievedConv.messages.length}`);
    const foundMsg = retrievedConv.messages.find((m: any) => m.id === sent.id);
    if (!foundMsg) throw new Error('Sent message not found in retrieved conversation messages');
    console.log(`   Verified message in conversation history with text: "${foundMsg.text}"`);

    console.log('\n🎉 ALL BATCH 5 CUSTOMER CHAT TESTS PASSED SUCCESSFULLY! 🚀\n');
  } catch (error) {
    console.error('❌ Batch 5 Customer Chat Test Failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

runCustomerChatTest();
