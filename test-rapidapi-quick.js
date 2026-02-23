// RapidAPI Quick Test — проверка ключей

const https = require('https');
const fs = require('fs');

// Твой API Key
const API_KEY = 'd5cc66646msh8999b110e4296e1p19be2fjsnb997c3a91aff';

function log(message, data) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  if (data) {
    logMessage += JSON.stringify(data, null, 2) + '\n';
  }
  fs.appendFileSync('RAPIDAPI_TEST_LOG.md', logMessage);
  console.log(message);
  if (data) console.log(JSON.stringify(data, null, 2));
}

async function testHubAPI() {
  log('=== Test 1: RapidAPI Hub API ===');

  const options = {
    hostname: 'rapidapi.com',
    port: 443,
    path: '/v1/users/me',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': API_KEY
    }
  };

  try {
    const response = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve({
              status: res.statusCode,
              data: parsed
            });
          } catch (e) {
            reject(new Error('JSON parse error'));
          }
        });
      });

      req.on('error', reject);
      req.end();
    });

    log('Status:', response.status);

    if (response.status === 200) {
      const profile = response.data;
      log('Profile Info', {
        id: profile.id,
        username: profile.username,
        fullName: profile.fullName,
        email: profile.email
      });

      return {
        success: true,
        userId: profile.id,
        ownerId: profile.id,
        username: profile.username
      };
    } else {
      log('Error Response', {
        status: response.status,
        data: response.data
      });

      return {
        success: false,
        status: response.status,
        error: 'API request failed'
      };
    }
  } catch (error) {
    log('Exception', {
      message: error.message,
      stack: error.stack
    });

    return {
      success: false,
      error: error.message
    };
  }
}

async function testPlatformAPI() {
  log('=== Test 2: RapidAPI Platform API ===');

  const options = {
    hostname: 'platformv.p.rapidapi.com',
    port: 443,
    path: '/v1/users/me',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': API_KEY
    }
  };

  try {
    const response = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve({
              status: res.statusCode,
              data: parsed
            });
          } catch (e) {
            reject(new Error('JSON parse error'));
          }
        });
      });

      req.on('error', reject);
      req.end();
    });

    log('Status:', response.status);
    log('Headers', {
      status: response.status
    });

    if (response.status === 200) {
      const profile = response.data;
      log('Profile Info', {
        id: profile.id,
        username: profile.username,
        fullName: profile.fullName,
        email: profile.email
      });

      return {
        success: true,
        userId: profile.id,
        ownerId: profile.id,
        username: profile.username
      };
    } else {
      log('Error Response', {
        status: response.status,
        data: response.data
      });

      return {
        success: false,
        status: response.status,
        error: 'API request failed'
      };
    }
  } catch (error) {
    log('Exception', {
      message: error.message,
      stack: error.stack
    });

    return {
      success: false,
      error: error.message
    };
  }
}

async function main() {
  log('=== RapidAPI Quick Test Started ===');
  log('API Key:', API_KEY.substring(0, 10) + '...');

  // Test 1: Hub API
  const hubResult = await testHubAPI();

  // Test 2: Platform API
  const platformResult = await testPlatformAPI();

  console.log('\n=== Summary ===');

  let ownerId = null;

  if (hubResult.success) {
    ownerId = hubResult.ownerId;
    console.log('✅ Hub API works!');
    console.log('   Owner ID:', ownerId);
  }

  if (platformResult.success) {
    ownerId = platformResult.ownerId;
    console.log('✅ Platform API works!');
    console.log('   Owner ID:', ownerId);
  }

  if (!ownerId) {
    console.log('❌ Neither API returned valid Owner ID');
    log('Final Result', {
      hubSuccess: hubResult.success,
      platformSuccess: platformResult.success,
      ownerId: null
    });

    console.log('\n=== Manual Action Required ===');
    console.log('1. Check API Key is correct');
    console.log('2. Try accessing RapidAPI Studio directly');
    console.log('3. Verify permissions');
    return;
  }

  log('Final Result', {
    ownerId: ownerId,
    hubSuccess: hubResult.success,
    platformSuccess: platformResult.success
  });

  console.log('\n=== Success ===');
  console.log('✅ Owner ID found:', ownerId);
  console.log('\n=== Next Steps ===');
  console.log('1. Add credentials to TOOLS.md:');
  console.log('   RapidAPI Key: ' + API_KEY);
  console.log('   RapidAPI Owner ID: ' + ownerId);
  console.log('   Platform API URL: https://platformv.p.rapidapi.com');
  console.log('\n2. Update deployer skill');
  console.log('3. Prepare for autonomous publishing');
}

main().catch(err => {
  log('Fatal Error', {
    message: err.message,
    stack: err.stack
  });
  console.error('Fatal:', err);
  process.exit(1);
});
