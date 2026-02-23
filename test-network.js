// Simple Network Test

const https = require('https');
const fs = require('fs');

function log(message, data) {
  const timestamp = new Date().toISOString();
  const logMessage = '[' + timestamp + '] ' + message;
  if (data) {
    logMessage += ': ' + JSON.stringify(data);
  }
  logMessage += '\n';
  console.log(logMessage);
  fs.appendFileSync('NETWORK_TEST_LOG.md', logMessage);
}

// Test 1: Google
log('Test 1: Connecting to Google');
https.get('https://www.google.com', (res) => {
  log('Test 1: Success', { status: res.statusCode, headers: res.headers });
}, (err) => {
  log('Test 1: Error', { message: err.message });
});

// Test 2: GitHub
log('Test 2: Connecting to GitHub');
https.get('https://api.github.com', (res) => {
  log('Test 2: Success', { status: res.statusCode, headers: res.headers });
}, (err) => {
  log('Test 2: Error', { message: err.message });
});

// Test 3: RapidAPI Hub
log('Test 3: Connecting to RapidAPI Hub');
https.get('https://rapidapi.com', (res) => {
  log('Test 3: Success', { status: res.statusCode, headers: res.headers });
}, (err) => {
  log('Test 3: Error', { message: err.message });
});

// Test 4: RapidAPI Platform API
log('Test 4: Connecting to RapidAPI Platform API');
https.get('https://platformv.p.rapidapi.com', (res) => {
  log('Test 4: Success', { status: res.statusCode, headers: res.headers });
}, (err) => {
  log('Test 4: Error', { message: err.message });
});

setTimeout(() => {
  log('');
  log('=== Network Test Complete ===');
  log('If tests 1-2 succeed but 3-4 fail, RapidAPI may be blocked or have DNS issues.');
}, 10000);
