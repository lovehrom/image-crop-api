// RapidAPI Platform API Test — синхронный

const https = require('https');
const fs = require('fs');

const API_KEY = 'd5cc66646msh8999b110e4296e1p19be2fjsnb997c3a91aff';
const OWNER_ID = '11561343';
const PLATFORM_API = 'https://platformv.p.rapidapi.com';

console.log('=== RapidAPI Platform API Sync Test ===');
console.log('Platform API:', PLATFORM_API);
console.log('API Key:', API_KEY.substring(0, 10) + '...');
console.log('Owner ID:', OWNER_ID);
console.log('');

// Test 1: GET /v1/users/me
console.log('=== Test 1: Get Profile ===');

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
        console.log('Status:', res.statusCode);

        if (res.statusCode === 200) {
            try {
                const result = JSON.parse(data);
                console.log('✅ SUCCESS: Profile retrieved');
                console.log('User ID:', result.id);
                console.log('Username:', result.username);
                console.log('Full Name:', result.fullName);
                console.log('Email:', result.email);
            } catch (e) {
                console.log('❌ Parse Error:', e.message);
                console.log('Raw Response:', data.substring(0, 500));
            }
        } else {
            console.log('❌ Error: Status ' + res.statusCode);
            console.log('Raw Response:', data.substring(0, 500));
        }

        // Test 2: POST /v1/apis (создание API)
        console.log('');
        console.log('=== Test 2: Create API ===');

        const apiData = {
            ownerId: OWNER_ID,
            name: 'Image Crop API',
            shortDescription: 'Professional image cropping API with rotation and border radius support.',
            longDescription: 'Image Crop API provides professional image processing capabilities including crop by size and coordinates, resize to specific dimensions, rotate (90°, 180°, 270°, custom angle), border radius (rounded corners), and format conversion (PNG, JPEG, WebP). Fast, simple, and reliable.',
            category: 'Image Processing',
            tags: ['image', 'crop', 'resize', 'rotate', 'api'],
            website: 'https://github.com/lovehrom/image-crop-api'
        };

        const req2 = https.request({
            hostname: 'platformv.p.rapidapi.com',
            port: 443,
            path: '/v1/apis',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-RapidAPI-Key': API_KEY
            }
        }, (res2) => {
            let data2 = '';

            res2.on('data', (chunk) => {
                data2 += chunk;
            });

            res2.on('end', () => {
                console.log('Status:', res2.statusCode);

                if (res2.statusCode >= 200 && res2.statusCode < 300) {
                    try {
                        const result2 = JSON.parse(data2);
                        console.log('✅ SUCCESS: API created');
                        console.log('API ID:', result2.id);
                        console.log('API Name:', result2.name);
                    } catch (e) {
                        console.log('❌ Parse Error:', e.message);
                        console.log('Raw Response:', data2.substring(0, 500));
                    }
                } else {
                    console.log('❌ Error: Status ' + res2.statusCode);
                    console.log('Raw Response:', data2.substring(0, 500));
                }
            });
        });

        req2.on('error', (error) => {
            console.log('❌ Request Error:', error.message);
        });

        req2.write(JSON.stringify(apiData));
        req2.end();
    });
});

req1.on('error', (error) => {
    console.log('❌ Request Error:', error.message);
});

req1.end();

console.log('Waiting for API responses...');
