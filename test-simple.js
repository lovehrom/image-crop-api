// Простейший тест RapidAPI Platform API

const https = require('https');

const API_KEY = 'd5cc66646msh8999b110e4296e1p19be2fjsnb997c3a91aff';
const OWNER_ID = '11561343';

console.log('=== Simple Test ===');
console.log('Key:', API_KEY);
console.log('Owner:', OWNER_ID);
console.log('');

// Test 1: GET Request
const req1 = https.request({
    hostname: 'platformv.p.rapidapi.com',
    port: 443,
    path: '/v1/users/me',
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': API_KEY
    }
}, (res) => {
    console.log('Test 1 Status:', res.statusCode);

    if (res.statusCode === 200) {
        console.log('SUCCESS');
    } else {
        console.log('FAILED');
    }

    // Test 2: POST Request
    const postData = JSON.stringify({
        ownerId: OWNER_ID,
        name: 'Test API'
    });

    const req2 = https.request({
        hostname: 'platformv.p.rapidapi.com',
        port: 443,
        path: '/v1/apis',
        method: 'POST',
        headers: {
            'X-RapidAPI-Key': API_KEY,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    }, (res2) => {
        console.log('');
        console.log('Test 2 Status:', res2.statusCode);

        if (res2.statusCode >= 200 && res2.statusCode < 300) {
            console.log('SUCCESS');
        } else {
            console.log('FAILED');
        }
    });

    req2.write(postData);
    req2.end();
});

req1.on('error', (e) => {
    console.log('Test 1 Error:', e.message);
});

req1.end();

console.log('Waiting for responses...');
