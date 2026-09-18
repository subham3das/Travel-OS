async function testGoogleAuth() {
  console.log('Testing Google Auth endpoint...');

  // Create a mock base64 token for offline/testing fallback
  const mockPayload = {
    email: `google.user.${Date.now()}@gmail.com`,
    name: 'Google Test User',
    sub: `google_oauth_sub_${Date.now()}`,
    picture: 'https://lh3.googleusercontent.com/a/default-user',
  };
  const mockIdToken = `header.${Buffer.from(JSON.stringify(mockPayload)).toString('base64')}.signature`;

  const res = await fetch('http://localhost:5000/api/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      credential: mockIdToken,
    }),
  });

  const data: any = await res.json();
  console.log('Google Auth Status:', res.status, 'Success:', data.success);
  if (data.success) {
    console.log('User created:', data.data?.user?.email, 'Provider:', data.data?.user?.authProvider);
    console.log('Tokens issued:', Boolean(data.data?.tokens?.accessToken));
    console.log('✅ Google Auth integration verified successfully!');
  } else {
    console.error('❌ Google Auth failed:', data);
  }
}

testGoogleAuth().catch(console.error);
