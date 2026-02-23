module.exports = (req, res) => {
  res.status(200).json({
    name: 'Image Crop API',
    version: '1.0.0',
    endpoints: {
      crop: 'POST /api/crop',
      health: 'GET /api/health'
    }
  });
};
