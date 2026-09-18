import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { communityService } from '../src/services/community.service.js';
import { reviewService } from '../src/services/review.service.js';
import { UserModel } from '../src/models/user.model.js';
import { PackageModel } from '../src/models/package.model.js';

async function runCommunityReviewTest() {
  console.log('🧪 Starting Batch 6 Community & Reviews Integration Test...');
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/apnatrip';
  await mongoose.connect(mongoUri);
  console.log(' Connected to MongoDB');

  try {
    let user = await UserModel.findOne({ role: 'customer' });
    if (!user) user = await UserModel.findOne();
    if (!user) throw new Error('No user found');

    const userId = String(user._id);
    console.log(`👤 Testing with User: ${user.fullName || user.email} (${userId})`);

    // 1. Test Community Feed (Auto-seeded or live)
    const posts = await communityService.getPosts();
    console.log(`✅ Retrieved Community Posts: Count = ${posts.length}`);
    if (posts.length === 0) throw new Error('Expected at least 1 community post');

    // 2. Test Community Post Creation
    const createdPost = await communityService.createPost(userId, {
      title: 'Sunrise above the Clouds at Tiger Hill 🌅',
      content: 'Woke up at 4:30 AM to witness Mt Kanchenjunga painted in pure golden light. Truly breathtaking!',
      destination: 'Darjeeling, India',
      postType: 'Story',
      media: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop'],
    });
    console.log(`✅ Created Community Post: ID = ${createdPost.postId}, Title = "${createdPost.title}"`);

    // 3. Test Post Like
    const likesAfter = await communityService.likePost(createdPost.postId);
    console.log(`✅ Liked Post: New Likes Count = ${likesAfter}`);

    // 4. Test Reviews
    const pkg = await PackageModel.findOne().lean();
    const createdReview = await reviewService.submitReview(userId, {
      packageId: pkg ? String(pkg._id) : undefined,
      rating: 5,
      reviewText: 'Flawless arrangements, friendly certified guides, and boutique luxury stays throughout.',
    });
    console.log(`✅ Created Review: ID = ${createdReview.reviewId}, Rating = ${createdReview.rating}★`);

    // 5. Test Query Reviews
    const reviews = await reviewService.getReviews({ packageId: pkg ? String(pkg._id) : undefined });
    console.log(`✅ Retrieved Reviews: Count = ${reviews.length}`);
    const foundRev = reviews.find(r => r.id === createdReview.reviewId);
    if (!foundRev) throw new Error('Created review not found in reviews query');
    console.log(`   Verified review for package: "${foundRev.packageName}"`);

    console.log('\n🎉 ALL BATCH 6 COMMUNITY & REVIEW TESTS PASSED SUCCESSFULLY! 🚀\n');
  } catch (error) {
    console.error('❌ Batch 6 Community & Review Test Failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

runCommunityReviewTest();
