// Максимально простой сетевой тест

console.log('=== Simple Network Test ===');

const http = require('http');
const https = require('https');
const fs = require('fs');

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = '[' + timestamp + '] ' + message + '\n';
  console.log(message);
  fs.appendFileSync('NETWORK_SIMPLE_TEST_LOG.md', logMessage, 'utf8');
}

// Test 1: Google (HTTP)
log('Test 1: HTTP Request to Google');
const req1 = http.request({
  hostname: 'www.google.com',
  port: 80,
  path: '/'
}, (res) => {
  log('Test 1: Status ' + res.statusCode);
  if (res.statusCode === 200 || res.statusCode === 302 || res.statusCode === 301) {
    log('Test 1: SUCCESS');
  } else {
    log('Test 1: FAILED');
  }
});

req1.on('error', (e) => {
  log('Test 1: ERROR: ' + e.message);
});

req1.end();

// Test 2: GitHub (HTTPS)
setTimeout(() => {
  log('');
  log('Test 2: HTTPS Request to GitHub');
  const req2 = https.request({
    hostname: 'api.github.com',
    port: 443,
    path: '/',
    headers: {
      'User-Agent': 'test'
    }
  }, (res) => {
    log('Test 2: Status ' + res.statusCode);
    if (res.statusCode === 200 || res.statusCode === 204) {
      log('Test 2: SUCCESS');
    } else {
      log('Test 2: FAILED');
    }
  });

  req2.on('error', (e) => {
    log('Test 2: ERROR: ' + e.message);
  });

  req2.end();
}, 1000);

// Test 3: RapidAPI Hub (HTTPS)
setTimeout(() => {
  log('');
  log('Test 3: HTTPS Request to RapidAPI Hub');
  const req3 = https.request({
    hostname: 'rapidapi.com',
    port: 443,
    path: '/',
    headers: {
      'User-Agent': 'test'
    }
  }, (res) => {
    log('Test 3: Status ' + res.statusCode);
    if (res.statusCode === 200 || res.statusCode === 204) {
      log('Test 3: SUCCESS');
    } else {
      log('Test 3: FAILED');
    }
  });

  req3.on('error', (e) => {
    log('Test 3: ERROR: ' + e.message);
  });

  req3.end();
}, 2000);

// Test 4: RapidAPI Platform API (HTTPS)
setTimeout(() => {
  log('');
  log('Test 4: HTTPS Request to RapidAPI Platform API');
  const req4 = https.request({
    hostname: 'platformv.p.rapidapi.com',
    port: 443,
    path: '/v1/users/me',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': 'd5cc66646msh8999b110e4296e1p19be2fjsnb997c3a91aff'
    }
  }, (res) => {
    log('Test 4: Status ' + res.statusCode);

    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      if (res.statusCode === 200) {
        try {
          const result = JSON.parse(responseData);
          log('Test 4: SUCCESS');
          log('User ID: ' + result.id);
          log('Username: ' + result.username);
        } catch (e) {
          log('Test 4: PARSE ERROR');
        }
      } else {
        log('Test 4: FAILED');
      }
    });
  });

  req4.on('error', (e) => {
    log('Test 4: ERROR: ' + e.message);
  });

  req4.end();
}, 3000);

// Test 5: RapidAPI Hub User Profile (HTTPS)
setTimeout(() => {
  log('');
  log('Test 5: HTTPS Request to RapidAPI Hub User Profile');
  const req5 = https.request({
    hostname: 'rapidapi.com',
    port: 443,
    path: '/v1/users/me',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': 'd5cc66646msh8999b110e4296e1p19be2fjsnb997c3a91aff'
    }
  }, (res) => {
    log('Test 5: Status ' + res.statusCode);

    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      if (res.statusCode === 200) {
        try {
          const result = JSON.parse(responseData);
          log('Test 5: SUCCESS');
          log('User ID: ' + result.id);
          log('Username: ' + result.username);
        } catch (e) {
          log('Test 5: PARSE ERROR');
        }
      } else {
        log('Test 5: FAILED');
      }
    });
  });

  req5.on('error', (e) => {
    log('Test 5: ERROR: ' + e.message);
  });

  req5.end();
}, 4000);

// Summary
setTimeout(() => {
  log('');
  log('=== Network Test Complete ===');
  log('');
  log('Results logged to: NETWORK_SIMPLE_TEST_LOG.md');
  log('');
  log('If tests 1-2 pass but 3-5 fail:');
  log('   1. RapidAPI may be blocking your IP');
  log('   2. Firewall/antivirus may be blocking RapidAPI');
  log('   3. DNS resolution issues for rapidapi.com');
  log('');
  log('If all tests fail:');
  log('   1. Network connectivity issue');
  log('   2. Node.js/HTTP module issue');
  log('   3. System firewall blocking all traffic');
}, 5000);

log('Waiting for network responses...');
