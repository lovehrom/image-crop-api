// Express application entry point

require('dotenv').config();
const express = require('express');
const routes = require('./src/routes');

const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Image Crop API',
    version: '1.0.0',
    endpoints: {
      crop: 'POST /crop',
      health: 'GET /health'
    }
  });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
