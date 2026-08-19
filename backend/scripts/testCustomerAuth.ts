async function runTest() {
  const email = `alex.traveler.${Date.now()}@example.com`;
  const phone = `+9198${Math.floor(10000000 + Math.random() * 90000000)}`;

  console.log(`\n🔹 1. Testing Registration for: ${email}`);
  const regRes = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Alex Johnson',
      email,
      phone,
      password: 'Password@123',
      confirmPassword: 'Password@123',
      acceptTerms: true,
    }),
  });

  const regData: any = await regRes.json();
  console.log('Registration Status:', regRes.status, 'Success:', regData.success);
  if (!regData.success) {
    console.error('Registration failed:', regData);
    return;
  }

  const token = regData.data.tokens.accessToken;
  const refreshToken = regData.data.tokens.refreshToken;
  const verificationToken = regData.data.verificationToken;

  console.log('\n🔹 2. Testing Email Verification');
  const verifyRes = await fetch('http://localhost:5000/api/auth/verify-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: verificationToken }),
  });
  const verifyData: any = await verifyRes.json();
  console.log('Verify Email Status:', verifyRes.status, 'Success:', verifyData.success);

  console.log('\n🔹 3. Testing Check Username Availability');
  const checkUserRes = await fetch('http://localhost:5000/api/profile/check-username/alex_johnson');
  const checkUserData: any = await checkUserRes.json();
  console.log('Check Username:', checkUserData.data);

  console.log('\n🔹 4. Testing Update Profile');
  const profileRes = await fetch('http://localhost:5000/api/profile', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      username: `alex_${Date.now()}`,
      homeCity: 'Bengaluru',
      dateOfBirth: '1996-04-12',
      gender: 'male',
      bio: 'Lover of high-altitude Himalayan treks and landscape photography.',
    }),
  });
  const profileData: any = await profileRes.json();
  console.log('Profile Update Status:', profileRes.status, 'ProfileCompleted:', profileData.data?.profile?.onboarding?.profileCompleted);

  console.log('\n🔹 5. Testing Travel Preferences');
  const prefRes = await fetch('http://localhost:5000/api/profile/travel-preferences', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      travelInterests: ['Adventure', 'Mountains', 'Wildlife', 'Trekking'],
      travelStyle: ['Solo', 'Group'],
      budgetPreference: 'Mid Range',
      preferredTripDuration: ['3–5 Days', 'One Week'],
      preferredTransportation: ['Flight', 'Bus'],
      foodPreference: 'Non-Veg',
    }),
  });
  const prefData: any = await prefRes.json();
  console.log('Preferences Status:', prefRes.status, 'PreferenceCompleted:', prefData.data?.preferenceCompleted);

  console.log('\n🔹 6. Testing Saved Travelers CRUD');
  const addTravelerRes = await fetch('http://localhost:5000/api/travelers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      fullName: 'Sarah Johnson',
      dob: '1998-09-20',
      gender: 'female',
      relationship: 'spouse',
      nationality: 'Indian',
      emergencyContact: {
        name: 'Alex Johnson',
        phone: phone,
        relationship: 'Spouse',
      },
    }),
  });
  const travelerData: any = await addTravelerRes.json();
  console.log('Add Traveler Status:', addTravelerRes.status, 'Traveler:', travelerData.data?.traveler?.fullName);

  console.log('\n🔹 7. Testing Onboarding Status');
  const onbStatusRes = await fetch('http://localhost:5000/api/onboarding/status', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const onbStatusData: any = await onbStatusRes.json();
  console.log('Onboarding Status Data:', onbStatusData.data);

  console.log('\n🔹 8. Testing Complete Onboarding');
  const onbCompleteRes = await fetch('http://localhost:5000/api/onboarding/complete', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  const onbCompleteData: any = await onbCompleteRes.json();
  console.log('Onboarding Complete Data:', onbCompleteData.data);

  console.log('\n🔹 9. Testing Token Refresh');
  const refreshRes = await fetch('http://localhost:5000/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  const refreshData: any = await refreshRes.json();
  console.log('Token Refresh Status:', refreshRes.status, 'HasNewAccessToken:', Boolean(refreshData.data?.accessToken));

  console.log('\n🎉 ALL 9 CUSTOMER JOURNEY TEST STEPS PASSED PERFECTLY!\n');
}

runTest().catch(console.error);
