// Ping тест RapidAPI доменов

const { exec } = require('child_process');

console.log('=== Ping Test for RapidAPI Domains ===');
console.log('');

const domains = [
  'rapidapi.com',
  'platformv.p.rapidapi.com',
  'api.rapidapi.com',
  'hub.rapidapi.com'
];

function pingDomain(domain) {
  console.log('Pinging:', domain);
  exec('ping -n 2 ' + domain, (error, stdout, stderr) => {
    if (error) {
      console.log('  ❌ Error:', error.message);
      return { success: false };
    }

    if (stdout.includes('TTL') || stdout.includes('bytes from')) {
      console.log('  ✅ SUCCESS');
      console.log('  Details:', stdout.split('\n')[0].trim());
      return { success: true };
    } else if (stdout.includes('timed out') || stdout.includes('unreachable')) {
      console.log('  ❌ FAILED');
      return { success: false };
    } else {
      console.log('  ❓ UNKNOWN');
      console.log('  Details:', stdout.split('\n')[0].trim());
      return { success: false };
    }
  });
}

async function main() {
  const results = [];

  for (const domain of domains) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay
    const result = pingDomain(domain);
    results.push({ domain, ...result });
  }

  console.log('');
  console.log('=== Ping Test Summary ===');

  const successCount = results.filter(r => r.success).length;
  const failedCount = results.length - successCount;

  console.log('Total:', results.length);
  console.log('Success:', successCount);
  console.log('Failed:', failedCount);
  console.log('Success rate:', ((successCount / results.length) * 100).toFixed(1) + '%');
  console.log('');

  results.forEach((result, index) => {
    console.log((index + 1) + '.', result.domain + ':', result.success ? '✅' : '❌');
  });

  console.log('');
  console.log('=== Conclusion ===');

  if (successCount === results.length) {
    console.log('✅ All domains are accessible');
    console.log('   Problem: RapidAPI Platform API may be blocking API requests');
    console.log('   Solution: Use RapidAPI Studio UI manually');
  } else if (successCount > 0) {
    console.log('⚠️ Some domains are accessible');
    console.log('   Problem: DNS resolution or firewall');
    console.log('   Solution: Check firewall/antivirus settings');
  } else {
    console.log('❌ No domains are accessible');
    console.log('   Problem: Network connectivity or complete firewall');
    console.log('   Solution: Check network connection and firewall');
  }

  console.log('');
  console.log('If rapidapi.com is accessible but platformv.p.rapidapi.com is not:');
  console.log('   1. Platform API may not exist for external use');
  console.log('   2. Platform API may require special access');
  console.log('   3. Platform API may require VPN or special IP whitelisting');
}

main().catch(err => {
  console.error('Fatal Error:', err.message);
  process.exit(1);
});
