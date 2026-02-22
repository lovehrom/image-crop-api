// Middleware to handle file validation before crop

const constants = require('../utils/constants');
const fileUtils = require('../utils/fileUtils');

/**
 * Validate file before crop
 */
async function validateFile(req, res, next) {
  // Validate file presence
  if (!req.file) {
    return res.status(400).json({
      error: constants.ERROR_MESSAGES.INVALID_FILE
    });
  }

  // Validate file size
  if (!req.file.buffer || req.file.buffer.length > constants.MAX_FILE_SIZE) {
    return res.status(413).json({
      error: constants.ERROR_MESSAGES.FILE_TOO_LARGE
    });
  }

  // Store validated file buffer
  req.validatedFile = {
    buffer: req.file.buffer,
    mimetype: req.file.mimetype
  };

  next();
}

module.exports = {
  validateFile
};
