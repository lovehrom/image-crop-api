// RapidAPI Platform API Test — с использованием axios

const https = require('https');
const fs = require('fs');

const API_KEY = 'd5cc66646msh8999b110e4296e1p19be2fjsnb997c3a91aff';
const OWNER_ID = '11561343';
const PLATFORM_API = 'https://platformv.p.rapidapi.com';

console.log('=== RapidAPI Platform API Test (Axios) ===');
console.log('Platform API:', PLATFORM_API);
console.log('API Key:', API_KEY.substring(0, 10) + '...');
console.log('Owner ID:', OWNER_ID);
console.log('');

// Test 1: GET /v1/users/me
console.log('=== Test 1: Get Profile ===');
const options1 = {
    hostname: 'platformv.p.rapidapi.com',
    port: 443,
    path: '/v1/users/me',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': API_KEY
    }
};

const req1 = https.request(options1, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Headers:', JSON.stringify(res.headers, null, 2));
        try {
            const result = JSON.parse(data);
            console.log('Response:', JSON.stringify(result, null, 2));
            
            if (res.statusCode === 200) {
                console.log('✅ Profile received!');
                console.log('User ID:', result.id);
                console.log('Username:', result.username);
            }
        } catch (e) {
            console.log('Parse Error:', e.message);
        }
    });
});

req1.on('error', (error) => {
    console.log('Request Error:', error.message);
});

req1.end();

// Test 2: POST /v1/apis (создание API)
console.log('\n=== Test 2: Create API ===');
setTimeout(() => {
    const apiData = {
        ownerId: OWNER_ID,
        name: 'Image Crop API Test',
        shortDescription: 'Test API for autonomous publishing',
        longDescription: 'This is a test API to verify autonomous publishing works.',
        category: 'Image Processing',
        tags: ['image', 'test', 'api'],
        website: 'https://github.com/lovehrom/image-crop-api'
    };

    const options2 = {
        hostname: 'platformv.p.rapidapi.com',
        port: 443,
        path: '/v1/apis',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': API_KEY
        }
    };

    const req2 = https.request(options2, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            console.log('Status:', res.statusCode);
            try {
                const result = JSON.parse(data);
                console.log('Response:', JSON.stringify(result, null, 2));

                if (res.statusCode >= 200 && res.statusCode < 300) {
                    console.log('✅ API created!');
                    console.log('API ID:', result.id);
                } else {
                    console.log('❌ API creation failed!');
                    console.log('Error:', result.error || result.message);
                }
            } catch (e) {
                console.log('Parse Error:', e.message);
                console.log('Raw Response:', data.substring(0, 500));
            }
        });
    });

    req2.on('error', (error) => {
        console.log('Request Error:', error.message);
    });

    req2.write(JSON.stringify(apiData));
    req2.end();

}, 2000);
