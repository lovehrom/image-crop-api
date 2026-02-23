const sharp = require('sharp');
const multer = require('multer');

// Configure Multer with memory storage and increased limits
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB для файла
    fieldSize: 10 * 1024 * 1024, // 10MB для текстовых полей
    fields: 20,
    files: 1
  }
});

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse request with Multer middleware
    await new Promise((resolve, reject) => {
      upload.single('file')(req, res, (err) => {
        if (err) {
          console.error('Multer error:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });

    // Handle both cases: file in req.file or in req.body.file
    let imageBuffer;
    const debug = {
      reqFileExists: !!req.file,
      reqBodyFileExists: !!req.body?.file,
      reqBodyFileType: req.body?.file ? typeof req.body.file : null,
      reqBodyKeys: Object.keys(req.body || {})
    };

    if (req.file) {
      // Case 1: Binary file in req.file
      debug.fileSource = 'req.file.buffer';
      imageBuffer = req.file.buffer;
    } else if (req.body.file) {
      // Case 2: File as string in req.body.file
      debug.fileSource = 'req.body.file (string)';
      if (typeof req.body.file === 'string') {
        // Try to decode as binary
        imageBuffer = Buffer.from(req.body.file, 'binary');
        debug.decodingMethod = 'binary';
        debug.bufferLength = imageBuffer.length;
      } else {
        return res.status(400).json({ 
          error: 'Invalid file format in body',
          debug 
        });
      }
    } else {
      return res.status(400).json({ 
        error: 'File is required',
        debug
      });
    }

    let image = sharp(imageBuffer);

    // Обрезка (crop)
    if (req.body.cropWidth && req.body.cropHeight && req.body.x && req.body.y) {
      image = image.extract({
        left: parseInt(req.body.cropWidth),
        top: parseInt(req.body.cropHeight),
        width: parseInt(req.body.x),
        height: parseInt(req.body.y)
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
    if (req.body.radius && parseInt(req.body.radius) > 0) {
      const radius = parseInt(req.body.radius);
      const metadata = await image.metadata();
      const width = metadata.width;
      const height = metadata.height;

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
    res.setHeader('Content-Type', `image/${format}`);
    res.send(processedImage);

  } catch (error) {
    console.error('Image processing error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      stack: error.stack
    });
  }
};
