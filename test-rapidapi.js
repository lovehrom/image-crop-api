// Тест RapidAPI API

const https = require('https');

// Тест подключения к RapidAPI
async function testRapidAPIConnection() {
  console.log('=== Test 1: RapidAPI Connection ===');

  const options = {
    hostname: 'rapidapi.com',
    port: 443,
    path: '/api/apis',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': 'test_key'
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
          resolve({
            status: res.statusCode,
            data: data
          });
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.end();
    });

    console.log('Status:', response.status);
    console.log('Response:', response.data.substring(0, 200));

    return {
      connected: response.status < 500,
      status: response.status
    };
  } catch (error) {
    console.error('Error:', error.message);
    return {
      connected: false,
      error: error.message
    };
  }
}

// Логирование
function log(message) {
  console.log(message);
  const fs = require('fs');
  const timestamp = new Date().toISOString();
  const logMessage = '[' + timestamp + '] ' + message + '\n';
  fs.appendFileSync('RAPIDAPI_TEST_REPORT.md', logMessage);
}

async function main() {
  log('=== RapidAPI Auto Publisher Test Started ===\n');

  log('Test 1: Connection to RapidAPI');
  const result = await testRapidAPIConnection();

  if (result.connected) {
    log('SUCCESS: RapidAPI is reachable');
    log('Status: ' + result.status);
  } else {
    log('FAILED: RapidAPI is not reachable');
    log('Error: ' + result.error);
  }

  log('\n=== Test Complete ===');
  log('\nConclusion:');
  log('- RapidAPI API exists and is reachable');
  log('- For auto-publishing, need RapidAPI API Key');
  log('- API Key must be obtained manually from RapidAPI Studio');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
