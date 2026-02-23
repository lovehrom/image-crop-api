// RapidAPI Platform Profile Test

const https = require('https');
const fs = require('fs');

// Platform API URL
const PLATFORM_API = 'https://platformv.p.rapidapi.com';

// Твой API Key (убрал префикс API:)
const RAPIDAPI_PLATFORM_KEY = 'd5cc66646msh8999b110e4296e1p19be2fjsnb997c3a91aff';

async function getPlatformProfile() {
  console.log('=== RapidAPI Platform Profile Test ===\n');
  console.log('Platform API:', PLATFORM_API);
  console.log('API Key:', RAPIDAPI_PLATFORM_KEY.substring(0, 10) + '...\n');

  const options = {
    hostname: 'platformv.p.rapidapi.com',
    port: 443,
    path: '/v1/users/me',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': RAPIDAPI_PLATFORM_KEY
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
            const result = JSON.parse(data);
            resolve({
                status: res.statusCode,
                data: result
              });
          } catch (e) {
            reject(new Error('Failed to parse response: ' + e.message));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.end();
    });

    console.log('Status:', response.status);
    console.log('Headers:', JSON.stringify(response.data, null, 2));

    if (response.status === 200) {
      const profile = response.data;
      console.log('\n=== Profile Info ===');
      console.log('User ID:', profile.id);
      console.log('Username:', profile.username);
      console.log('Full Name:', profile.fullName);
      console.log('Email:', profile.email);
      console.log('Role:', profile.role);
      console.log('Account Status:', profile.accountStatus);

      // Ищем ownerId
      const ownerId = profile.id;

      console.log('\n=== Owner ID Found ===');
      console.log('Owner ID:', ownerId);

      // Логируем
      const logMessage = `
Date: ${new Date().toISOString()}
Platform API: ${PLATFORM_API}
API Key: ${RAPIDAPI_PLATFORM_KEY}
User ID: ${profile.id}
Username: ${profile.username}
Owner ID: ${ownerId}
`;

      fs.writeFileSync('PLATFORM_PROFILE_INFO.md', logMessage);

      console.log('\n✅ Profile info saved to PLATFORM_PROFILE_INFO.md');
      console.log('Owner ID found: ' + ownerId);

      return {
        success: true,
        userId: profile.id,
        ownerId: ownerId,
        username: profile.username
      };
    } else {
      console.log('\n❌ Error: Response status ' + response.status);
      console.log('Data:', JSON.stringify(response.data, null, 2));

      return {
        success: false,
        status: response.status,
        error: 'Failed to get profile'
      };
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);

    return {
      success: false,
      error: error.message
    };
  }
}

async function main() {
  console.log('=== RapidAPI Platform Profile Finder ===\n');
  console.log('Platform API: https://platformv.p.rapidapi.com/v1/users/me\n');

  const result = await getPlatformProfile();

  console.log('\n=== Result ===');
  if (result.success) {
    console.log('✅ SUCCESS');
    console.log('   User ID:', result.userId);
    console.log('   Owner ID:', result.ownerId);
    console.log('   Username:', result.username);
    console.log('\n=== Next Steps ===');
    console.log('1. Update TOOLS.md with credentials');
    console.log('2. Update deployer skill to use Platform API');
    console.log('3. Prepare for autonomous publishing');
  } else {
    console.log('❌ FAILED');
    console.log('   Error:', result.error);
    console.log('\n=== Manual Action Needed ===');
    console.log('1. Check if API Key is a Platform API Key (not Hub API Key)');
    console.log('2. Verify Platform API is accessible');
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
