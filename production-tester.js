// Production tester for Image Crop API (using Axios)

const axios = require('axios');
const fs = require('fs');
const path = require('path');

class ProductionTester {
  constructor(baseUrl, testImagePath) {
    this.baseUrl = baseUrl;
    this.testImagePath = testImagePath;
    this.results = [];
  }

  async testHealthCheck() {
    console.log('=== Testing Health Check ===');
    try {
      const response = await axios.get(`${this.baseUrl}/health`);
      const data = response.data;

      const passed = response.status === 200 && data.status === 'healthy';
      console.log(passed ? '✅ PASSED' : '❌ FAILED');
      console.log('Response:', JSON.stringify(data, null, 2));

      this.results.push({
        test: 'Health Check',
        passed,
        status: response.status,
        data
      });

      return passed;
    } catch (error) {
      console.log('❌ FAILED:', error.message);
      this.results.push({ test: 'Health Check', passed: false, error: error.message });
      return false;
    }
  }

  async testCrop(params, testName) {
    console.log(`\n=== Testing: ${testName} ===`);
    try {
      const FormData = require('form-data');
      const formData = new FormData();

      const fileBuffer = fs.readFileSync(this.testImagePath);
      formData.append('file', fileBuffer, path.basename(this.testImagePath));

      Object.entries(params).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await axios.post(`${this.baseUrl}/crop`, formData, {
        headers: formData.getHeaders()
      });

      const passed = response.status === 200;
      const contentType = response.headers['content-type'];

      console.log(passed ? '✅ PASSED' : '❌ FAILED');
      console.log('Status:', response.status);
      console.log('Content-Type:', contentType);

      this.results.push({
        test: testName,
        passed,
        status: response.status,
        contentType,
        params
      });

      return passed;
    } catch (error) {
      console.log('❌ FAILED:', error.message);
      if (error.response) {
        console.log('Status:', error.response.status);
      }
      this.results.push({ test: testName, passed: false, error: error.message });
      return false;
    }
  }

  async runAllTests() {
    console.log(`\n=== Production Test Suite ===`);
    console.log(`Base URL: ${this.baseUrl}`);
    console.log(`Test Image: ${this.testImagePath}\n`);

    // Health Check
    await this.testHealthCheck();

    // Resize
    await this.testCrop({ width: '800', height: '600' }, 'Resize (800x600)');

    // Rotate
    await this.testCrop({ angle: '90' }, 'Rotate 90°');

    // Border Radius
    await this.testCrop({ radius: '20' }, 'Border Radius (20px)');

    // Crop
    await this.testCrop({ x: '100', y: '100', cropWidth: '400', cropHeight: '400' }, 'Crop with coordinates');

    // Complex
    await this.testCrop({
      width: '800',
      height: '600',
      x: '20',
      y: '20',
      cropWidth: '600',
      cropHeight: '400',
      angle: '45',
      format: 'jpeg'
    }, 'Complex Request (resize + rotate + crop + format)');

    // Summary
    console.log('\n=== Test Summary ===');
    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.length - passed;
    console.log(`Total: ${this.results.length}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Success rate: ${((passed / this.results.length) * 100).toFixed(1)}%`);

    return this.results;
  }
}

// Run tests
async function main() {
  const baseUrl = 'https://image-crop-api-ten.vercel.app';
  const testImagePath = path.join('K:\\Работа\\rapidapi.com\\image-crop-api', 'test_image.png');

  console.log('=== Production API Tester ===\n');

  const tester = new ProductionTester(baseUrl, testImagePath);
  await tester.runAllTests();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
