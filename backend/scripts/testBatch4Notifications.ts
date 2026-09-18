import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { NotificationDispatcher } from '../src/services/notificationDispatcher.service.js';
import { UserModel } from '../src/models/user.model.js';

async function runNotificationTest() {
  console.log('🧪 Starting Batch 4 Notifications & Real-Time Pipeline Test...');
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/apnatrip';
  await mongoose.connect(mongoUri);
  console.log(' Connected to MongoDB');

  try {
    let user = await UserModel.findOne({ role: 'customer' });
    if (!user) user = await UserModel.findOne();
    if (!user) throw new Error('No user found');

    const userId = String(user._id);
    console.log(`👤 Testing with User: ${user.fullName || user.email} (${userId})`);

    // 1. Dispatch a new notification
    const dispatched = await NotificationDispatcher.notifyUser(userId, {
      title: 'Pack your Bags! 🧳',
      description: 'Your itinerary and hotel vouchers are ready for download.',
      category: 'Bookings',
      priority: 'HIGH',
      targetRoute: '/trips',
    });
    console.log(`✅ Dispatched Notification: ID = ${dispatched._id}, Title = "${dispatched.title}"`);

    // 2. Fetch all user notifications
    const notifs = await NotificationDispatcher.getUserNotifications(userId);
    console.log(`✅ User Notifications Retrieved: Count = ${notifs.length}`);
    const found = notifs.find(n => n.id === dispatched._id.toString());
    if (!found) throw new Error('Dispatched notification not found in user notification list');
    console.log(`   Found newly dispatched notification with isRead: ${found.isRead}`);

    // 3. Check unread count
    const unreadCountBefore = await NotificationDispatcher.getUserUnreadCount(userId);
    console.log(`✅ Unread count before read: ${unreadCountBefore}`);

    // 4. Mark single notification as read
    await NotificationDispatcher.markAsRead(dispatched._id.toString(), 'USER', userId);
    const unreadCountAfter = await NotificationDispatcher.getUserUnreadCount(userId);
    console.log(`✅ Marked single as read. Unread count after: ${unreadCountAfter}`);

    // 5. Mark all as read
    await NotificationDispatcher.markAllAsRead('USER', userId);
    const finalUnread = await NotificationDispatcher.getUserUnreadCount(userId);
    console.log(`✅ Marked all as read. Final unread count: ${finalUnread}`);

    console.log('\n🎉 ALL BATCH 4 NOTIFICATION TESTS PASSED SUCCESSFULLY! 🚀\n');
  } catch (error) {
    console.error('❌ Batch 4 Notification Test Failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

runNotificationTest();
