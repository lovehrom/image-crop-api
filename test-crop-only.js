const APITester = require('./tester');
const path = require('path');

async function runFailedTests() {
  const baseUrl = 'http://localhost:3000';
  const testImagePath = path.join(__dirname, 'test_image.png');
  const tester = new APITester(baseUrl, testImagePath);

  console.log('=== Testing Failed Tests ===\n');

  await tester.testCropWithCoordinates();
  await tester.testComplexRequest();

  console.log('\n=== Done ===');
}

runFailedTests().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
