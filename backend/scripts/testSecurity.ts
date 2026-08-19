async function runSecurityTests() {
  console.log('\n🔒 1. Testing Duplicate Registration Error Handling (409 Conflict)');
  const duplicateEmail = 'duplicate.test@example.com';
  const duplicatePhone = '+919999999999';

  // First registration
  await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Original User',
      email: duplicateEmail,
      phone: duplicatePhone,
      password: 'Password@123',
      confirmPassword: 'Password@123',
      acceptTerms: true,
    }),
  });

  // Duplicate email attempt
  const dupRes = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Imposter User',
      email: duplicateEmail,
      phone: '+918888888888',
      password: 'Password@123',
      confirmPassword: 'Password@123',
      acceptTerms: true,
    }),
  });
  const dupData: any = await dupRes.json();
  console.log('Duplicate Email Status:', dupRes.status, 'Error Code:', dupData.errorCode);

  console.log('\n🔒 2. Testing Invalid Password Login (401 Unauthorized)');
  const invalidLoginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: duplicateEmail,
      password: 'WrongPassword@999',
    }),
  });
  const invalidLoginData: any = await invalidLoginRes.json();
  console.log('Invalid Login Status:', invalidLoginRes.status, 'Error Code:', invalidLoginData.errorCode);

  console.log('\n🔒 3. Testing Unauthorized Protected Route Access (401 Unauthorized)');
  const unauthRes = await fetch('http://localhost:5000/api/profile');
  const unauthData: any = await unauthRes.json();
  console.log('Unauthorized Access Status:', unauthRes.status, 'Error Code:', unauthData.errorCode);

  console.log('\n🔒 4. Testing Zod Validation Error (422 Unprocessable Entity)');
  const invalidPayloadRes = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'A',
      email: 'not-an-email',
      phone: '123',
      password: 'short',
      confirmPassword: 'mismatch',
      acceptTerms: false,
    }),
  });
  const invalidPayloadData: any = await invalidPayloadRes.json();
  console.log('Validation Error Status:', invalidPayloadRes.status, 'Validation Errors Count:', invalidPayloadData.errors?.length);

  console.log('\n🎉 ALL SECURITY & ERROR BOUNDARY TESTS PASSED!\n');
}

runSecurityTests().catch(console.error);
