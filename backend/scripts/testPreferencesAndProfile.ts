import { dbConnection } from '../src/config/db.config.js';
import { UserModel } from '../src/models/user.model.js';
import { authService } from '../src/services/auth.service.js';
import { profileService } from '../src/services/profile.service.js';
import { preferencesService } from '../src/services/preferences.service.js';

async function runTest() {
  console.log('🧪 Starting Onboarding Profile & Budget Preferences Verification...');

  await dbConnection.connect();

  const testEmail = `test_onboarding_${Date.now()}@apnatrip.com`;
  const testPhone = `+9198${Math.floor(10000000 + Math.random() * 90000000)}`;

  console.log(`1️⃣ Registering test user: ${testEmail}`);
  const regResult = await authService.register({
    fullName: 'Rahul Sharma',
    email: testEmail,
    phone: testPhone,
    password: 'Password@123',
    confirmPassword: 'Password@123',
    termsAccepted: true,
  });

  const userId = regResult.user.id.toString();
  console.log(`   User registered with ID: ${userId}`);

  console.log('2️⃣ Updating Profile with gender and preferred language...');
  const updatedProfile = await profileService.updateProfile(userId, {
    bio: 'Passionate backpacker exploring the Himalayas and Western Ghats',
    gender: 'male',
    preferredLanguage: 'Hindi',
    homeCity: 'Dehradun',
    dateOfBirth: new Date('1998-05-15'),
  });

  console.log('   Profile returned gender:', updatedProfile.gender);
  console.log('   Profile returned language:', updatedProfile.preferredLanguage);

  if (updatedProfile.gender !== 'male' || updatedProfile.preferredLanguage !== 'Hindi') {
    throw new Error(`Profile fields mismatch: gender=${updatedProfile.gender}, lang=${updatedProfile.preferredLanguage}`);
  }

  console.log('3️⃣ Updating Travel Preferences with duration, transportation, food, and accessibility...');
  const updatedPrefs = await preferencesService.updateTravelPreferences(userId, {
    travelInterests: ['Meghalaya', 'Spiti', 'Trekking', 'Photography'],
    travelStyle: ['adventure', 'nature', 'road-trip'],
    budgetPreference: '₹35,000 / trip',
    preferredBudgetAmount: 35000,
    preferredBudgetTier: 'Comfort',
    preferredTripDuration: ['3-5 Days', '1-2 Weeks'],
    preferredTransportation: ['Flight', 'Train', 'Road Trip'],
    foodPreference: 'All Cuisines',
    accessibilityRequirements: 'Wheelchair Accessible',
  });

  console.log('   Travel Preferences saved in service:', JSON.stringify(updatedPrefs.travelPreferences));

  console.log('4️⃣ Directly querying MongoDB Atlas under user document...');
  const dbUser = await UserModel.findById(userId);
  if (!dbUser) {
    throw new Error('User not found in MongoDB');
  }

  console.log('   DB user.gender:', dbUser.gender);
  console.log('   DB user.preferredLanguage:', dbUser.preferredLanguage);
  console.log('   DB user.travelPreferences.budgetPreference:', dbUser.travelPreferences.budgetPreference);
  console.log('   DB user.travelPreferences.preferredBudgetAmount:', dbUser.travelPreferences.preferredBudgetAmount);
  console.log('   DB user.travelPreferences.preferredBudgetTier:', dbUser.travelPreferences.preferredBudgetTier);
  console.log('   DB user.travelPreferences.preferredTripDuration:', dbUser.travelPreferences.preferredTripDuration);
  console.log('   DB user.travelPreferences.preferredTransportation:', dbUser.travelPreferences.preferredTransportation);
  console.log('   DB user.travelPreferences.foodPreference:', dbUser.travelPreferences.foodPreference);
  console.log('   DB user.travelPreferences.accessibilityRequirements:', dbUser.travelPreferences.accessibilityRequirements);

  // Assertions
  if (dbUser.gender !== 'male') {
    throw new Error(`Assertion failed: expected gender 'male', got '${dbUser.gender}'`);
  }
  if (dbUser.preferredLanguage !== 'Hindi') {
    throw new Error(`Assertion failed: expected preferredLanguage 'Hindi', got '${dbUser.preferredLanguage}'`);
  }
  if (dbUser.travelPreferences.preferredBudgetAmount !== 35000) {
    throw new Error(`Assertion failed: expected preferredBudgetAmount 35000, got ${dbUser.travelPreferences.preferredBudgetAmount}`);
  }
  if (dbUser.travelPreferences.preferredBudgetTier !== 'Comfort') {
    throw new Error(`Assertion failed: expected preferredBudgetTier 'Comfort', got '${dbUser.travelPreferences.preferredBudgetTier}'`);
  }
  if (dbUser.travelPreferences.budgetPreference !== '₹35,000 / trip') {
    throw new Error(`Assertion failed: expected budgetPreference '₹35,000 / trip', got '${dbUser.travelPreferences.budgetPreference}'`);
  }
  if (
    !dbUser.travelPreferences.preferredTripDuration.includes('3-5 Days') ||
    !dbUser.travelPreferences.preferredTripDuration.includes('1-2 Weeks')
  ) {
    throw new Error(`Assertion failed: preferredTripDuration mismatch: ${dbUser.travelPreferences.preferredTripDuration}`);
  }
  if (
    !dbUser.travelPreferences.preferredTransportation.includes('Flight') ||
    !dbUser.travelPreferences.preferredTransportation.includes('Train') ||
    !dbUser.travelPreferences.preferredTransportation.includes('Road Trip')
  ) {
    throw new Error(`Assertion failed: preferredTransportation mismatch: ${dbUser.travelPreferences.preferredTransportation}`);
  }
  if (dbUser.travelPreferences.foodPreference !== 'All Cuisines') {
    throw new Error(`Assertion failed: expected foodPreference 'All Cuisines', got '${dbUser.travelPreferences.foodPreference}'`);
  }
  if (dbUser.travelPreferences.accessibilityRequirements !== 'Wheelchair Accessible') {
    throw new Error(`Assertion failed: expected accessibilityRequirements 'Wheelchair Accessible', got '${dbUser.travelPreferences.accessibilityRequirements}'`);
  }

  console.log('✅ ALL PROFILE & PREFERENCE ONBOARDING ASSERTIONS PASSED PERFECTLY!');

  // Cleanup test user
  await UserModel.findByIdAndDelete(userId);
  console.log('🧹 Cleaned up test user.');

  await dbConnection.disconnect();
  process.exit(0);
}

runTest().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
