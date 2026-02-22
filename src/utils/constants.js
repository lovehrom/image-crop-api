// Constants for Image Crop API

// File size limits
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Image size limits
const MIN_WIDTH = 1;
const MAX_WIDTH = 10000;
const MIN_HEIGHT = 1;
const MAX_HEIGHT = 10000;

// Crop size limits
const MIN_CROP_SIZE = 1;

// Rotation angles (special values)
const ROTATION_ANGLES = [90, 180, 270];

// Border radius limits
const MIN_BORDER_RADIUS = 10;
const MAX_BORDER_RADIUS = 50;

// Supported formats
const SUPPORTED_FORMATS = ['png', 'jpeg', 'webp'];

// Default values
const DEFAULT_FORMAT = 'png';
const DEFAULT_BORDER_RADIUS = 0;

// Content types
const CONTENT_TYPES = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  webp: 'image/webp'
};

// Error messages
const ERROR_MESSAGES = {
  INVALID_FILE: 'Invalid file. Must be PNG or JPG, max 5MB',
  FILE_TOO_LARGE: 'File too large. Maximum size is 5MB',
  INVALID_WIDTH: 'Invalid width. Must be between 1 and 10000px',
  INVALID_HEIGHT: 'Invalid height. Must be between 1 and 10000px',
  INVALID_COORDS: 'Invalid coordinates. Must be positive and within image bounds',
  INVALID_ANGLE: 'Invalid angle. Must be between 0 and 360',
  INVALID_RADIUS: 'Invalid radius. Must be between 10 and 50',
  INVALID_FORMAT: 'Invalid format. Must be png, jpeg, or webp'
};

module.exports = {
  MAX_FILE_SIZE,
  MIN_WIDTH,
  MAX_WIDTH,
  MIN_HEIGHT,
  MAX_HEIGHT,
  MIN_CROP_SIZE,
  ROTATION_ANGLES,
  MIN_BORDER_RADIUS,
  MAX_BORDER_RADIUS,
  SUPPORTED_FORMATS,
  DEFAULT_FORMAT,
  DEFAULT_BORDER_RADIUS,
  CONTENT_TYPES,
  ERROR_MESSAGES
};
