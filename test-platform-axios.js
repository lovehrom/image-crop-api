// RapidAPI Platform API Test — с использованием axios (уже установлен)

const axios = require('axios');
const fs = require('fs');

const API_KEY = 'd5cc66646msh8999b110e4296e1p19be2fjsnb997c3a91aff';
const OWNER_ID = '11561343';
const PLATFORM_API = 'https://platformv.p.rapidapi.com';

console.log('=== RapidAPI Platform API Test (Axios) ===');
console.log('Platform API:', PLATFORM_API);
console.log('API Key:', API_KEY.substring(0, 10) + '...');
console.log('Owner ID:', OWNER_ID);
console.log('');

async function testPlatformAPI() {
  // Test 1: GET /v1/users/me
  console.log('=== Test 1: Get Profile ===');
  try {
    const response = await axios.get(PLATFORM_API + '/v1/users/me', {
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': API_KEY
      }
    });
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    console.log('User ID:', response.data.id);
    console.log('Username:', response.data.username);
    console.log('SUCCESS');
    return {
      success: true,
      userId: response.data.id,
      ownerId: response.data.id
    };
  } catch (error) {
    console.log('ERROR:', error.message);
    if (error.response) {
      console.log('Response Status:', error.response.status);
      console.log('Response Data:', JSON.stringify(error.response.data, null, 2));
    }
    return {
      success: false,
      error: error.message
    };
  }
}

testPlatformAPI()
  .then(result => {
    console.log('');
    console.log('=== Result ===');
    if (result.success) {
      console.log('✅ SUCCESS');
      console.log('   User ID:', result.userId);
      console.log('   Owner ID:', result.ownerId);
    } else {
      console.log('❌ FAILED');
      console.log('   Error:', result.error);
    }
  })
  .catch(err => {
    console.log('');
    console.log('=== Fatal Error ===');
    console.log('ERROR:', err.message);
  });
