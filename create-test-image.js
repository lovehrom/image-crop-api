// Create test image for API testing

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createTestImage() {
  const outputPath = path.join(__dirname, 'test_image.png');

  // Create a test image with some content
  const width = 1000;
  const height = 800;

  // Create a simple gradient-like image
  const svgString = `
  <svg width="${width}" height="${height}">
    <rect x="0" y="0" width="${width}" height="${height}" fill="#3b82f6"/>
    <rect x="0" y="0" width="${width/2}" height="${height/2}" fill="#ef4444"/>
    <rect x="${width/2}" y="${height/2}" width="${width/2}" height="${height/2}" fill="#22c55e"/>
    <circle cx="${width/2}" cy="${height/2}" r="100" fill="#ffffff"/>
    <text x="50%" y="50%" font-family="Arial" font-size="24" fill="black" text-anchor="middle" dominant-baseline="middle">Test Image</text>
  </svg>
  `;

  const buffer = Buffer.from(svgString);

  try {
    await sharp(buffer)
      .png()
      .toFile(outputPath);

    console.log(`✅ Test image created: ${outputPath}`);

    // Check file size
    const stats = fs.statSync(outputPath);
    console.log(`   Size: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`   Dimensions: ${width}x${height}`);

    return outputPath;
  } catch (error) {
    console.error('❌ Failed to create test image:', error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  createTestImage()
    .then(() => {
      console.log('\nTest image is ready for API testing.');
      process.exit(0);
    })
    .catch(error => {
      console.error('\nError:', error);
      process.exit(1);
    });
}

module.exports = { createTestImage };
