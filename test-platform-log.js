// RapidAPI Platform API Test — с логированием в файл

const https = require('https');
const fs = require('fs');

const API_KEY = 'd5cc66646msh8999b110e4296e1p19be2fjsnb997c3a91aff';
const OWNER_ID = '11561343';
const PLATFORM_API = 'https://platformv.p.rapidapi.com';

// Логирование в файл
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = '[' + timestamp + '] ' + message + '\n';
  
  console.log(message);
  fs.appendFileSync('RAPIDAPI_PLATFORM_TEST_LOG.md', logMessage);
}

// Test 1: GET /v1/users/me
log('=== Test 1: Get Profile ===');
log('API Key: ' + API_KEY.substring(0, 10) + '...');
log('Owner ID: ' + OWNER_ID);
log('Platform API: ' + PLATFORM_API);

const req1 = https.request({
  hostname: 'platformv.p.rapidapi.com',
  port: 443,
  path: '/v1/users/me',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'X-RapidAPI-Key': API_KEY
  }
}, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    log('Status: ' + res.statusCode);
    
    if (res.statusCode === 200) {
      try {
        const result = JSON.parse(data);
        log('Response: ' + JSON.stringify(result, null, 2));
        log('User ID: ' + result.id);
        log('Username: ' + result.username);
        log('SUCCESS');
      } catch (e) {
        log('Parse Error: ' + e.message);
        log('Raw Response: ' + data.substring(0, 500));
      }
    } else {
      log('ERROR: Status ' + res.statusCode);
      log('Raw Response: ' + data.substring(0, 500));
    }
  });
});

req1.on('error', (e) => {
  log('Request Error: ' + e.message);
  log('Stack: ' + e.stack);
});

req1.end();

log('');
log('Waiting for API response...');
log('');
