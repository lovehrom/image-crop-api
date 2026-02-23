module.exports = (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: Date.now(),
    version: '1.0.0'
  });
};
