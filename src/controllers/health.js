// Health check controller

const constants = require('../utils/constants');

/**
 * Health check endpoint
 * Returns API status and version
 */
async function healthCheck(req, res) {
  const response = {
    status: 'healthy',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  };

  res.status(200).json(response);
}

module.exports = {
  healthCheck
};
