// RapidAPI Platform API Test — с использованием fetch

const fs = require('fs');

const API_KEY = 'd5cc66646msh8999b110e4296e1p19be2fjsnb997c3a91aff';
const OWNER_ID = '11561343';
const PLATFORM_API = 'https://platformv.p.rapidapi.com';

console.log('=== RapidAPI Platform API Test (Fetch) ===');
console.log('Platform API:', PLATFORM_API);
console.log('API Key:', API_KEY.substring(0, 10) + '...');
console.log('Owner ID:', OWNER_ID);
console.log('');

async function testPlatformAPI() {
  // Test 1: GET /v1/users/me
  console.log('=== Test 1: Get Profile ===');
  try {
    const response = await fetch(PLATFORM_API + '/v1/users/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': API_KEY
      }
    });

    const status = response.status;
    const data = await response.json();

    console.log('Status:', status);
    console.log('Response:', JSON.stringify(data, null, 2));

    if (status === 200) {
      console.log('SUCCESS: Profile retrieved!');
      console.log('User ID:', data.id);
      console.log('Username:', data.username);
    } else {
      console.log('FAILED: Status ' + status);
    }
  } catch (error) {
    console.log('ERROR:', error.message);
    console.log('Stack:', error.stack);
  }

  // Test 2: POST /v1/apis (создание API)
  console.log('');
  console.log('=== Test 2: Create API ===');
  try {
    const apiData = {
      ownerId: OWNER_ID,
      name: 'Image Crop API Test',
      shortDescription: 'Test API for autonomous publishing',
      longDescription: 'This is a test API to verify autonomous publishing works.',
      category: 'Image Processing',
      tags: ['image', 'test', 'api']
    };

    const response = await fetch(PLATFORM_API + '/v1/apis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': API_KEY
      },
      body: JSON.stringify(apiData)
    });

    const status = response.status;
    const data = await response.json();

    console.log('Status:', status);
    console.log('Response:', JSON.stringify(data, null, 2));

    if (status >= 200 && status < 300) {
      console.log('SUCCESS: API created!');
      console.log('API ID:', data.id);
    } else {
      console.log('FAILED: Status ' + status);
      console.log('Error:', data.error || data.message);
    }
  } catch (error) {
    console.log('ERROR:', error.message);
    console.log('Stack:', error.stack);
  }
}

testPlatformAPI()
  .then(() => {
    console.log('');
    console.log('=== Test Complete ===');
  })
  .catch(err => {
    console.log('');
    console.log('=== Fatal Error ===');
    console.log('ERROR:', err.message);
  });
