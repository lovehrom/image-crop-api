const express = require('express');
const router = express.Router();
const sharp = require('sharp');
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    fieldSize: 10 * 1024 * 1024,
    fields: 20,
    files: 1
  }
});

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

router.post('/crop', upload.single('file'), async (req, res) => {
  try {
    let imageBuffer;

    if (req.file && req.file.buffer && req.file.buffer.length > 0) {
      imageBuffer = req.file.buffer;
    } else if (req.body && req.body.file && req.body.file.length > 0) {
      const fileData = req.body.file;

      // Debug: return parsed JSON structure to see what Playground sends
      if (fileData.startsWith('{') || fileData.startsWith('[')) {
        try {
          const parsed = JSON.parse(fileData);
          console.log('Parsed file structure:', JSON.stringify(parsed, null, 2));
          return res.json({
            debug: true,
            structure: parsed,
            message: 'Inspect the structure above'
          });
        } catch(e) {
          console.log('JSON parse error:', e.message);
          return res.json({ error: 'Failed to parse JSON', details: e.message });
        }
      } else {
        imageBuffer = Buffer.from(fileData, 'latin1');
      }
    } else {
      return res.status(400).json({ error: 'File is required' });
    }

    const cropWidth  = parseInt(req.body.cropWidth)  || null;
    const cropHeight = parseInt(req.body.cropHeight) || null;
    const x          = parseInt(req.body.x)          || 0;
    const y          = parseInt(req.body.y)          || 0;
    const width      = parseInt(req.body.width)      || null;
    const height     = parseInt(req.body.height)     || null;
    const angle      = parseInt(req.body.angle)      || 0;
    const radius     = parseInt(req.body.radius)     || 0;
    const format     = (req.body.format || 'png').toLowerCase();

    if (!cropWidth || !cropHeight) {
      return res.status(400).json({ error: 'cropWidth and cropHeight are required' });
    }

    let image = sharp(imageBuffer);

    // Step 1: Resize
    if (width || height) {
      image = image.resize(width || null, height || null);
    }

    // Step 2: Rotate
    if (angle !== 0) {
      image = image.rotate(angle);
    }

    // Step 3: Crop
    image = image.extract({ left: x, top: y, width: cropWidth, height: cropHeight });

    // Step 4: Border radius
    if (radius > 0) {
      const mask = Buffer.from(
        `<svg><rect x="0" y="0" width="${cropWidth}" height="${cropHeight}" rx="${radius}" ry="${radius}"/></svg>`
      );
      image = image.composite([{ input: mask, blend: 'dest-in' }]).png();
    }

    if (format === 'jpeg' || format === 'jpg') {
      image = image.jpeg({ quality: 90 });
    } else if (format === 'webp') {
      image = image.webp({ quality: 90 });
    } else {
      image = image.png();
    }

    const result = await image.toBuffer();

    const mimeMap = { png: 'image/png', jpeg: 'image/jpeg', jpg: 'image/jpeg', webp: 'image/webp' };
    res.set('Content-Type', mimeMap[format] || 'image/png');
    res.set('Content-Disposition', `attachment; filename=cropped.${format}`);
    res.send(result);

  } catch (err) {
    console.error('Crop error:', err.message);
    res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

module.exports = router;
