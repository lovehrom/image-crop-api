// Validation middleware for Image Crop API

const constants = require('../utils/constants');
const fileUtils = require('../utils/fileUtils');

/**
 * Validate crop parameters
 */
function validateCropParams(req, res, next) {
  const { width, height, x, y, cropWidth, cropHeight, angle, radius, format } = req.body;

  // Validate width
  if (width !== undefined && width !== null) {
    const w = parseInt(width);
    if (isNaN(w) || w < constants.MIN_WIDTH || w > constants.MAX_WIDTH) {
      return res.status(400).json({
        error: constants.ERROR_MESSAGES.INVALID_WIDTH
      });
    }
  }

  // Validate height
  if (height !== undefined && height !== null) {
    const h = parseInt(height);
    if (isNaN(h) || h < constants.MIN_HEIGHT || h > constants.MAX_HEIGHT) {
      return res.status(400).json({
        error: constants.ERROR_MESSAGES.INVALID_HEIGHT
      });
    }
  }

  // Validate coordinates
  if (x !== undefined) {
    const coord = parseInt(x);
    if (isNaN(coord) || coord < 0) {
      return res.status(400).json({
        error: constants.ERROR_MESSAGES.INVALID_COORDS
      });
    }
  }

  if (y !== undefined) {
    const coord = parseInt(y);
    if (isNaN(coord) || coord < 0) {
      return res.status(400).json({
        error: constants.ERROR_MESSAGES.INVALID_COORDS
      });
    }
  }

  // Validate crop size
  if (cropWidth !== undefined) {
    const w = parseInt(cropWidth);
    if (isNaN(w) || w < constants.MIN_CROP_SIZE) {
      return res.status(400).json({
        error: 'Invalid crop width. Must be at least 1px'
      });
    }
  }

  if (cropHeight !== undefined) {
    const h = parseInt(cropHeight);
    if (isNaN(h) || h < constants.MIN_CROP_SIZE) {
      return res.status(400).json({
        error: 'Invalid crop height. Must be at least 1px'
      });
    }
  }

  // Validate angle
  if (angle !== undefined) {
    const a = parseInt(angle);
    if (isNaN(a) || a < 0 || a > 360) {
      return res.status(400).json({
        error: constants.ERROR_MESSAGES.INVALID_ANGLE
      });
    }
  }

  // Validate radius
  if (radius !== undefined) {
    const r = parseInt(radius);
    if (isNaN(r) || r < constants.MIN_BORDER_RADIUS || r > constants.MAX_BORDER_RADIUS) {
      return res.status(400).json({
        error: constants.ERROR_MESSAGES.INVALID_RADIUS
      });
    }
  }

  // Validate format
  if (format !== undefined) {
    if (!constants.SUPPORTED_FORMATS.includes(format.toLowerCase())) {
      return res.status(400).json({
        error: constants.ERROR_MESSAGES.INVALID_FORMAT
      });
    }
  }

  req.validatedParams = {
    width: width ? parseInt(width) : undefined,
    height: height ? parseInt(height) : undefined,
    x: x ? parseInt(x) : 0,
    y: y ? parseInt(y) : 0,
    cropWidth: cropWidth ? parseInt(cropWidth) : undefined,
    cropHeight: cropHeight ? parseInt(cropHeight) : undefined,
    angle: angle !== undefined ? parseInt(angle) : undefined,
    radius: radius !== undefined ? parseInt(radius) : constants.DEFAULT_BORDER_RADIUS,
    format: format ? format.toLowerCase() : constants.DEFAULT_FORMAT
  };

  next();
}

module.exports = validateCropParams;
