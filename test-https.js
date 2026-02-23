// Test https module

const https = require('https');

console.log('=== HTTPS Module Test ===');

// Test 1: Google
const req1 = https.request({
    hostname: 'www.google.com',
    port: 443,
    path: '/',
    method: 'GET'
}, (res) => {
    console.log('Test 1 Status:', res.statusCode);
    if (res.statusCode === 200) {
        console.log('✅ HTTPS module works!');
    }
});

req1.on('error', (e) => {
    console.log('❌ Test 1 Error:', e.message);
});

req1.end();

// Test 2: RapidAPI
setTimeout(() => {
    const req2 = https.request({
        hostname: 'rapidapi.com',
        port: 443,
        path: '/v1/users/me',
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'd5cc66646msh8999b110e4296e1p19be2fjsnb997c3a91aff'
        }
    }, (res) => {
        console.log('Test 2 Status:', res.statusCode);
        if (res.statusCode === 200) {
            console.log('✅ RapidAPI Hub API works!');
        }
    });

    req2.on('error', (e) => {
        console.log('❌ Test 2 Error:', e.message);
    });

    req2.end();

}, 2000);

console.log('Waiting for responses...');
