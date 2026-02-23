// RapidAPI Simple Test (Sync)

const https = require('https');
const fs = require('fs');

const API_KEY = 'd5cc66646msh8999b110e4296e1p19be2fjsnb997c3a91aff';

console.log('=== RapidAPI Key Test ===');
console.log('Key:', API_KEY.substring(0, 10) + '...');

// Test 1: Hub API
const optionsHub = {
  hostname: 'rapidapi.com',
  port: 443,
  path: '/v1/users/me',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'X-RapidAPI-Key': API_KEY
  }
};

const reqHub = https.request(optionsHub, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('=== Hub API Response ===');
    console.log('Status:', res.statusCode);

    try {
      const result = JSON.parse(data);
      console.log('Success!');

      if (result.id) {
        console.log('User ID:', result.id);
        console.log('Owner ID:', result.id);
        console.log('Username:', result.username);

        fs.writeFileSync('RAPIDAPI_HUB_INFO.txt', `
RapidAPI Hub API Works!
User ID: ${result.id}
Owner ID: ${result.id}
Username: ${result.username}
API Key: ${API_KEY}
`);
        console.log('\n✅ Hub info saved to RAPIDAPI_HUB_INFO.txt');
      } else {
        console.log('No ID in response');
        console.log('Response:', result);
      }
    } catch (e) {
      console.log('Parse Error:', e.message);
    }
  });
});

reqHub.on('error', (e) => {
  console.log('Request Error:', e.message);
});

reqHub.end();

// Test 2: Platform API
const optionsPlatform = {
  hostname: 'platformv.p.rapidapi.com',
  port: 443,
  path: '/v1/users/me',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'X-RapidAPI-Key': API_KEY
  }
};

const reqPlatform = https.request(optionsPlatform, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('\n=== Platform API Response ===');
    console.log('Status:', res.statusCode);

    try {
      const result = JSON.parse(data);
      console.log('Success!');

      if (result.id) {
        console.log('User ID:', result.id);
        console.log('Owner ID:', result.id);
        console.log('Username:', result.username);

        fs.writeFileSync('RAPIDAPI_PLATFORM_INFO.txt', `
RapidAPI Platform API Works!
User ID: ${result.id}
Owner ID: ${result.id}
Username: ${result.username}
API Key: ${API_KEY}
`);
        console.log('\n✅ Platform info saved to RAPIDAPI_PLATFORM_INFO.txt');
      } else {
        console.log('No ID in response');
        console.log('Response:', result);
      }
    } catch (e) {
      console.log('Parse Error:', e.message);
    }
  });
});

reqPlatform.on('error', (e) => {
  console.log('Request Error:', e.message);
});

reqPlatform.end();

console.log('\nWaiting for API responses...\n');
