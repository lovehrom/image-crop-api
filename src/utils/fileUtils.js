// File utilities for Image Crop API

const constants = require('./constants');

/**
 * Validate file format
 */
function validateFileFormat(mimetype) {
  const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
  return validTypes.includes(mimetype);
}

/**
 * Validate file size
 */
function validateFileSize(size) {
  return size <= constants.MAX_FILE_SIZE;
}

/**
 * Get file extension from mime type
 */
function getFileExtension(mimetype) {
  const map = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/webp': 'webp'
  };
  return map[mimetype] || 'png';
}

module.exports = {
  validateFileFormat,
  validateFileSize,
  getFileExtension
};
