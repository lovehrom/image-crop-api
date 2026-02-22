// Image service using Sharp for Image Crop API

const sharp = require('sharp');
const constants = require('../utils/constants');

/**
 * Process image with crop, resize, rotate, and border radius
 * Border radius is applied AFTER crop
 */
async function processImage(file, params) {
  const {
    width,
    height,
    x = 0,
    y = 0,
    cropWidth,
    cropHeight,
    angle,
    radius = constants.DEFAULT_BORDER_RADIUS,
    format = constants.DEFAULT_FORMAT
  } = params;

  try {
    let image = sharp(file.data);
    let originalWidth;
    let originalHeight;

    // Get original dimensions
    const metadata = await image.metadata();
    originalWidth = metadata.width;
    originalHeight = metadata.height;

    // Resize if width or height specified
    if (width || height) {
      const resizeOptions = {};
      if (width) resizeOptions.width = parseInt(width);
      if (height) resizeOptions.height = parseInt(height);
      image = image.resize(resizeOptions);
      // Get new dimensions after resize
      const resizedMetadata = await image.metadata();
      originalWidth = resizedMetadata.width;
      originalHeight = resizedMetadata.height;
    }

    // Rotate if angle specified
    if (angle !== undefined) {
      image = image.rotate(parseInt(angle));
      // Force metadata refresh after rotation by getting raw pixel data
      const rotatedBuffer = await image.toBuffer();
      const rotatedImage = sharp(rotatedBuffer);
      image = rotatedImage;

      // Update dimensions after rotation
      const rotatedMetadata = await image.metadata();
      originalWidth = rotatedMetadata.width;
      originalHeight = rotatedMetadata.height;
    }

    // Validate crop dimensions against current image size (after resize/rotate)
    if (cropWidth) {
      const cw = parseInt(cropWidth);
      const xVal = parseInt(x);
      if (xVal + cw > originalWidth) {
        return {
          success: false,
          error: `Crop width ${cw} + x offset ${x} exceeds image width ${originalWidth}`
        };
      }
    }
    if (cropHeight) {
      const ch = parseInt(cropHeight);
      const yVal = parseInt(y);
      if (yVal + ch > originalHeight) {
        return {
          success: false,
          error: `Crop height ${ch} + y offset ${y} exceeds image height ${originalHeight}`
        };
      }
    }

    // Crop if coordinates specified (apply BEFORE border radius)
    if (cropWidth || cropHeight) {
      const cw = parseInt(cropWidth);
      const ch = parseInt(cropHeight);
      image = image.extract({
        left: parseInt(x),
        top: parseInt(y),
        width: cw,
        height: ch
      });
    }

    // Apply border radius (rounded corners) ONLY AFTER crop
    if (radius > 0) {
      const r = parseInt(radius);
      const metadata = await image.metadata();
      const imgWidth = metadata.width;
      const imgHeight = metadata.height;

      // Create rounded effect using composite
      const svgString = `
      <svg width="${imgWidth}" height="${imgHeight}">
        <rect x="0" y="0" width="${imgWidth}" height="${imgHeight}" rx="${r}" ry="${r}" fill="white"/>
      </svg>
      `;
      const overlay = Buffer.from(svgString);
      image = image.composite([{
        input: overlay,
        blend: 'dest-in'
      }]);
    }

    // Set format
    if (format === 'jpeg') {
      image = image.jpeg({ quality: 85 });
    } else if (format === 'webp') {
      image = image.webp();
    } else {
      image = image.png();
    }

    // Get buffer
    const buffer = await image.toBuffer();

    return {
      success: true,
      buffer,
      format,
      contentType: constants.CONTENT_TYPES[format]
    };

  } catch (error) {
    console.error('Image processing error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  processImage
};
