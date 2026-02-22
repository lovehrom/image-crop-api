// Express routes for Image Crop API

const express = require('express');
const multer = require('multer');
const cropController = require('../controllers/crop');
const healthController = require('../controllers/health');
const validate = require('../middleware/validate');
const constants = require('../utils/constants');

const router = express.Router();

// Multer configuration for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: constants.MAX_FILE_SIZE
  },
  fileFilter: (req, file, cb) => {
    // Validate file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error(constants.ERROR_MESSAGES.INVALID_FILE));
    }
  }
});

/**
 * POST /crop - Process image with crop, resize, rotate, border radius
 */
router.post('/crop',
  upload.single('file'),
  validate,
  cropController.handleCrop
);

/**
 * GET /health - Health check
 */
router.get('/health', healthController.healthCheck);

module.exports = router;
