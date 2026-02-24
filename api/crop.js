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

    // Handle both scenarios
    let imageBuffer;

    // Scenario 1: Normal clients - file in req.file (binary)
    if (req.file && req.file.buffer && req.file.buffer.length > 0) {
      imageBuffer = req.file.buffer;
    }
    // Scenario 2: RapidAPI Playground - file in req.body.file (JSON string with base64)
    else if (req.body.file && typeof req.body.file === 'string') {
      const fileData = req.body.file;

      // Parse JSON with base64 data URL
      if (fileData.startsWith('{') || fileData.startsWith('[')) {
        try {
          const parsed = JSON.parse(fileData);
          const base64Data = parsed.data || parsed.base64 || parsed.content || Object.values(parsed)[0];

          if (base64Data && typeof base64Data === 'string') {
            // Handle data URL format: "data:image/png;base64,<base64>"
            if (base64Data.startsWith('data:')) {
              const base64Part = base64Data.split(',')[1];
              if (!base64Part) {
                return res.status(400).json({ error: 'Invalid data URL format' });
              }
              imageBuffer = Buffer.from(base64Part, 'base64');
            }
            // Handle pure base64 string
            else {
              imageBuffer = Buffer.from(base64Data, 'base64');
            }
          } else {
            return res.status(400).json({ error: 'No base64 data found in JSON' });
          }
        } catch(e) {
          console.log('JSON parse error:', e.message);
          return res.status(400).json({ error: 'Failed to parse JSON', details: e.message });
        }
      } else {
        imageBuffer = Buffer.from(fileData, 'latin1');
      }
    } else {
      return res.status(400).json({ error: 'File is required' });
    }

    // Parse parameters
    const cropWidth = parseInt(req.body.cropWidth);
    const cropHeight = parseInt(req.body.cropHeight);
    const x = parseInt(req.body.x);
    const y = parseInt(req.body.y);
    const width = parseInt(req.body.width);
    const height = parseInt(req.body.height);
    const angle = parseInt(req.body.angle);
    const radius = parseInt(req.body.radius);
    const format = req.body.format || 'png';

    // Validate crop parameters
    if (!cropWidth || !cropHeight) {
      return res.status(400).json({ error: 'cropWidth and cropHeight are required' });
    }

    let image = sharp(imageBuffer);

    // Get original dimensions
    const metadata = await image.metadata();
    let imgWidth = metadata.width;
    let imgHeight = metadata.height;

    // Apply transformations
    if (cropWidth && cropHeight && x && y) {
      imgWidth = cropWidth;
      imgHeight = cropHeight;
      image = image.extract({
        left: x,
        top: y,
        width: cropWidth,
        height: cropHeight
      });
    }

    // Изменение размера (resize)
    if (width && height) {
      imgWidth = width;
      imgHeight = height;
      image = image.resize(width, height);
    }

    // Поворот (rotate)
    if (angle) {
      image = image.rotate(angle);
    }

    // Скругление углов (rounded corners)
    if (radius && radius > 0) {
      const mask = Buffer.from(
        `<svg><rect x="0" y="0" width="${imgWidth}" height="${imgHeight}" rx="${radius}" ry="${radius}"/></svg>`
      );
      image = image.composite([{ input: mask, blend: 'dest-in' }]).png();
    }

    // Конвертация в формат
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
      message: error.message
    });
  }
};
