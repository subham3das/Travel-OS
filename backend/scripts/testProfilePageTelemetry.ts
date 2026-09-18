import { dbConnection } from '../src/config/db.config.js';
import { userRepository } from '../src/repositories/user.repository.js';
import { UserModel } from '../src/models/user.model.js';
import { profileService } from '../src/services/profile.service.js';

async function run() {
  console.log('🧪 Testing User Profile Real MongoDB Telemetry & Multi-User Isolation...');
  await dbConnection.connect();

  const timestamp = Date.now();
  const user1Email = `traveler_a_${timestamp}@apnatrip.com`;
  const user2Email = `traveler_b_${timestamp}@apnatrip.com`;

  try {
    // 1. Create User A
    const userA = await userRepository.create({
      fullName: 'Alice Wanderer',
      email: user1Email,
      phone: `+9198${Math.floor(10000000 + Math.random() * 90000000)}`,
      password: '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890',
      status: 'Active',
      isEmailVerified: true,
      homeCity: 'Dehradun',
      bio: 'Lover of mountain passes and pine forests',
      profileCompleted: true,
    } as any);
    console.log('1️⃣ User A registered with ID: %s', userA._id);

    // 2. Fetch User A profile via ProfileService
    const profileA = await profileService.getProfile(userA._id.toString());
    console.log('   Profile A fullName:', profileA.fullName);
    console.log('   Profile A location:', profileA.location);
    console.log('   Profile A isVerified:', profileA.isVerified);
    console.log('   Profile A stats:', profileA.stats);
    console.log('   Profile A badges count:', profileA.achievements.length);

    if (profileA.fullName !== 'Alice Wanderer') throw new Error('User A fullName mismatch');
    if (profileA.location !== 'Dehradun, India') throw new Error('User A location mismatch');
    if (profileA.isVerified !== true) throw new Error('User A isVerified mismatch');
    if (profileA.stats.totalTrips !== 0) throw new Error('User A trips count mismatch');

    // 3. Create User B (New User with unverified email)
    const userB = await userRepository.create({
      fullName: 'Bob Explorer',
      email: user2Email,
      phone: `+9198${Math.floor(10000000 + Math.random() * 90000000)}`,
      password: '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890',
      status: 'Active',
      isEmailVerified: false,
      homeCity: 'Jaipur',
      bio: 'Desert safari and royal fort enthusiast',
      profileCompleted: false,
    } as any);
    console.log('2️⃣ User B registered with ID: %s', userB._id);

    // 4. Fetch User B profile & verify Multi-User Isolation
    const profileB = await profileService.getProfile(userB._id.toString());
    console.log('   Profile B fullName:', profileB.fullName);
    console.log('   Profile B location:', profileB.location);
    console.log('   Profile B isVerified:', profileB.isVerified);
    console.log('   Profile B badgeTitle:', profileB.badgeTitle);

    if (profileB.fullName !== 'Bob Explorer') throw new Error('User B fullName mismatch');
    if (profileB.location !== 'Jaipur, India') throw new Error('User B location mismatch');
    if (profileB.isVerified !== false) throw new Error('User B isVerified mismatch');
    if (profileB.badgeTitle !== 'New Explorer') throw new Error('User B badgeTitle mismatch');

    // Verify isolation (No data leakage between User A and User B)
    if (profileA.id.toString() === profileB.id.toString()) throw new Error('Isolation failed: same ID');
    if (profileA.fullName === profileB.fullName) throw new Error('Isolation failed: same Name');

    // 5. Test Live Profile Update Synchronization
    console.log('3️⃣ Updating User A profile...');
    const updatedProfileA = await profileService.updateProfile(userA._id.toString(), {
      fullName: 'Alice Walker',
      homeCity: 'Manali',
      bio: 'Updated bio for Himalayan trails',
    });

    console.log('   Updated Profile A fullName:', updatedProfileA.fullName);
    console.log('   Updated Profile A location:', updatedProfileA.location);
    if (updatedProfileA.fullName !== 'Alice Walker') throw new Error('Profile update failed');
    if (updatedProfileA.location !== 'Manali, India') throw new Error('Location sync failed');

    console.log('✅ ALL PROFILE TELEMETRY & ISOLATION ASSERTIONS PASSED PERFECTLY!');
  } finally {
    // Cleanup
    await UserModel.deleteOne({ email: user1Email });
    await UserModel.deleteOne({ email: user2Email });
    console.log('🧹 Cleaned up test accounts.');
    await dbConnection.disconnect();
  }
}

run().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
