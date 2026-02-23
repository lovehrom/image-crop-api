const express = require('express');
const router = express.Router();
const sharp = require('sharp');
const multer = require('multer');
const { body, validationResult } = require('express-validator');

// ===== MULTER CONFIG =====
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    fieldSize: 10 * 1024 * 1024 // 10MB field size limit
  }
});

/**
 * POST /crop
 * Обработка изображений (обрезка, изменение размера, поворот, скругление углов)
 */
router.post('/crop', upload.single('file'), [
  body('cropWidth').optional().isInt({ min: 1 }),
  body('cropHeight').optional().isInt({ min: 1 }),
  body('x').optional().isInt({ min: 0 }),
  body('y').optional().isInt({ min: 0 }),
  body('width').optional().isInt({ min: 1 }),
  body('height').optional().isInt({ min: 1 }),
  body('angle').optional().isInt({ min: 0, max: 360 }),
  body('radius').optional().isInt({ min: 0 }),
  body('format').optional().isIn(['png', 'jpeg', 'webp'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'File is required' });
    }

    let image = sharp(req.file.buffer);

    // Обрезка (crop)
    if (req.body.cropWidth && req.body.cropHeight && req.body.x && req.body.y) {
      image = image.extract({
        left: parseInt(req.body.x),
        top: parseInt(req.body.y),
        width: parseInt(req.body.cropWidth),
        height: parseInt(req.body.cropHeight)
      });
    }

    // Изменение размера (resize)
    if (req.body.width && req.body.height) {
      image = image.resize(parseInt(req.body.width), parseInt(req.body.height));
    }

    // Поворот (rotate)
    if (req.body.angle) {
      image = image.rotate(parseInt(req.body.angle));
    }

    // Скругление углов (rounded corners)
    if (req.body.radius && req.body.radius > 0) {
      const radius = parseInt(req.body.radius);
      const width = image.metadata.width;
      const height = image.metadata.height;

      // Создаем маску для скругления
      const roundedCorners = Buffer.from(
        `<svg><rect x="0" y="0" width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="black"/></svg>`
      );

      const roundedCornersMask = await sharp(roundedCorners)
        .resize(width, height)
        .grayscale()
        .toBuffer();

      image = image.composite([
        { input: roundedCornersMask, blend: 'in' }
      ]);
    }

    // Конвертация в формат
    const format = req.body.format || 'png';
    let processedImage;

    if (format === 'png') {
      processedImage = await image.png().toBuffer();
    } else if (format === 'jpeg') {
      processedImage = await image.jpeg({ quality: 80 }).toBuffer();
    } else if (format === 'webp') {
      processedImage = await image.webp({ quality: 80 }).toBuffer();
    }

    // Отправка результата
    res.set('Content-Type', `image/${format}`);
    res.send(processedImage);

  } catch (error) {
    console.error('Image processing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /health
 * Проверка здоровья API
 */
router.get('/health', async (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: Date.now(),
    version: '1.0.0'
  });
});

module.exports = router;
