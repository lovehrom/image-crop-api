// RapidAPI Hub Profile Test

const https = require('https');
const fs = require('fs');

// Твой API Key (Hub API Key)
const HUB_API_KEY = 'd5cc66646msh8999b110e4296e1p19be2fjsnb997c3a91aff';

async function getHubProfile() {
  console.log('=== RapidAPI Hub Profile Test ===\n');
  console.log('API Key:', HUB_API_KEY.substring(0, 10) + '...\n');

  const options = {
    hostname: 'rapidapi.com',
    port: 443,
    path: '/v1/users/me',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': HUB_API_KEY
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

    if (response.status === 200) {
      const profile = response.data;
      console.log('\n=== Profile Info ===');
      console.log('User ID:', profile.id);
      console.log('Username:', profile.username);
      console.log('Full Name:', profile.fullName);
      console.log('Email:', profile.email);
      console.log('Role:', profile.role);

      // Owner ID — это user_id
      const ownerId = profile.id;

      console.log('\n=== Owner ID Found ===');
      console.log('Owner ID:', ownerId);

      // Логируем
      const logMessage = `Date: ${new Date().toISOString()}
Hub API: https://rapidapi.com
API Key: ${HUB_API_KEY}
User ID: ${profile.id}
Username: ${profile.username}
Owner ID: ${ownerId}
`;

      fs.writeFileSync('HUB_PROFILE_INFO.md', logMessage);

      console.log('\n✅ Profile info saved to HUB_PROFILE_INFO.md');
      console.log('Owner ID found:', ownerId);

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
  console.log('=== RapidAPI Hub Profile Finder ===\n');
  console.log('API Key:', d5cc66646msh8999b110e4296e1p19be2fjsnb997c3a91aff.substring(0, 10) + '...\n');

  const result = await getHubProfile();

  console.log('\n=== Result ===');
  if (result.success) {
    console.log('✅ SUCCESS');
    console.log('   User ID:', result.userId);
    console.log('   Owner ID:', result.ownerId);
    console.log('   Username:', result.username);
    console.log('\n=== Conclusion ===');
    console.log('Owner ID found:', result.ownerId);
    console.log('This is needed for Platform API automation.');
  } else {
    console.log('❌ FAILED');
    console.log('   Error:', result.error);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
