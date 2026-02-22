// Crop controller for Image Crop API

const imageService = require('../services/imageService');
const constants = require('../utils/constants');

/**
 * Handle crop request
 */
async function handleCrop(req, res) {
  // Validate file presence
  if (!req.file) {
    return res.status(400).json({
      error: constants.ERROR_MESSAGES.INVALID_FILE
    });
  }

  // Validate file size
  if (!req.file.buffer && !req.file.data) {
    return res.status(413).json({
      error: constants.ERROR_MESSAGES.FILE_TOO_LARGE
    });
  }

  try {
    // Process image - use buffer if available, otherwise use data
    const fileData = req.file.buffer || req.file.data;
    const result = await imageService.processImage({ data: fileData }, req.body);

    if (!result.success) {
      return res.status(500).json({
        error: 'Failed to process image',
        details: result.error
      });
    }

    // Send processed image
    res.setHeader('Content-Type', result.contentType);
    res.send(result.buffer);

  } catch (error) {
    console.error('Crop error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}

module.exports = {
  handleCrop
};
