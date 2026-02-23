// RapidAPI Platform API Test — с использованием http модуля

const http = require('http');
const https = require('https');
const fs = require('fs');

const API_KEY = 'd5cc66646msh8999b110e4296e1p19be2fjsnb997c3a91aff';
const OWNER_ID = '11561343';

// Логирование в файл
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = '[' + timestamp + '] ' + message + '\n';
  console.log(message);
  fs.appendFileSync('RAPIDAPI_HTTP_TEST_LOG.md', logMessage, 'utf8');
}

// Функция для выполнения HTTP запросов
function makeRequest(url, method, data = null, useHttps = false) {
  const urlObj = new URL(url);
  const lib = useHttps ? https : http;

  const options = {
    hostname: urlObj.hostname,
    port: urlObj.port || (useHttps ? 443 : 80),
    path: urlObj.pathname + urlObj.search,
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': API_KEY
    }
  };

  if (data) {
    options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(data));
  }

  return new Promise((resolve, reject) => {
    const req = lib.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(responseData);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(response);
          } else {
            reject(new Error('API request failed with status ' + res.statusCode + ': ' + JSON.stringify(response)));
          }
        } catch (e) {
          reject(new Error('Failed to parse response: ' + e.message));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error('Request failed: ' + error.message));
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function testPlatformAPI() {
  log('=== RapidAPI Platform API Test (http module) ===');
  log('Platform API: https://platformv.p.rapidapi.com');
  log('API Key: ' + API_KEY.substring(0, 10) + '...');
  log('Owner ID: ' + OWNER_ID);
  log('');

  // Test 1: GET /v1/users/me
  log('=== Test 1: Get Profile ===');
  try {
    const result = await makeRequest('https://platformv.p.rapidapi.com/v1/users/me', 'GET');
    log('SUCCESS: Platform API is accessible!');
    log('   User ID: ' + result.id);
    log('   Username: ' + result.username);
    log('   Email: ' + result.email);
    log('');
    log('✅ Conclusion: Platform API exists and is accessible!');
    log('');
    log('   Owner ID for API creation: ' + OWNER_ID);
    return {
      success: true,
      userId: result.id,
      username: result.username
    };
  } catch (error) {
    log('ERROR: ' + error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

async function main() {
  log('=== RapidAPI Platform API Test Started ===');
  log('');

  const result = await testPlatformAPI();

  if (result.success) {
    log('=== Test Result ===');
    log('✅ SUCCESS');
    log('   Platform API is accessible');
    log('   User ID: ' + result.userId);
    log('   Owner ID: ' + OWNER_ID);
    log('');
    log('=== Conclusion ===');
    log('✅ Platform API is ready for autonomous publishing!');
    log('');
    log('   Next steps:');
    log('   1. Create API (POST /v1/apis)');
    log('   2. Add endpoints (POST /v1/apis/{id}/endpoints)');
    log('   3. Create documentation (POST /v1/apis/{id}/documentation)');
    log('   4. Create pricing (POST /v1/apis/{id}/subscriptions)');
    log('   5. Publish API (POST /v1/apis/{id}/publish)');
  } else {
    log('=== Test Result ===');
    log('❌ FAILED');
    log('   Error: ' + result.error);
    log('');
    log('=== Manual Action Required ===');
    log('   1. Check if Platform API is accessible');
    log('   2. Verify API Key is correct');
    log('   3. Check network connection');
  }
}

main().catch(err => {
  log('=== Fatal Error ===');
  log('ERROR: ' + err.message);
  log('Stack: ' + err.stack);
});
