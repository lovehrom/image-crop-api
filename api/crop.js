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
      const fileData = req.body.file;
      debug.fileSource = 'req.body.file';
      debug.fileDataType = typeof fileData;
      debug.fileDataLength = fileData.length;
      debug.fileDataStart = fileData.substring(0, 100);

      // Try base64 first
      if (typeof fileData === 'string' && fileData.match(/^[A-Za-z0-9+/]+=*$/)) {
        debug.decodingMethod = 'base64';
        imageBuffer = Buffer.from(fileData, 'base64');
      } else {
        // Try latin1 (binary-like)
        debug.decodingMethod = 'latin1';
        imageBuffer = Buffer.from(fileData, 'latin1');
      }

      debug.decodedBufferLength = imageBuffer.length;
    } else {
      return res.status(400).json({
        error: 'File is required',
        debug
      });
    }

    // Parse and validate parameters
    const cropWidth = parseInt(req.body.cropWidth);
    const cropHeight = parseInt(req.body.cropHeight);
    const x = parseInt(req.body.x);
    const y = parseInt(req.body.y);
    const width = parseInt(req.body.width);
    const height = parseInt(req.body.height);
    const angle = parseInt(req.body.angle);
    const radius = parseInt(req.body.radius);
    const format = req.body.format || 'png';

    debug.parsedParams = {
      cropWidth, cropHeight, x, y, width, height, angle, radius, format
    };

    // Validate crop parameters
    if (!cropWidth || !cropHeight || !x || !y) {
      console.log('Skipping crop - missing params');
    }

    // Validate resize parameters
    if (!width || !height) {
      console.log('Skipping resize - missing params');
    }

    // Debug before Sharp
    console.log('Buffer length:', imageBuffer.length);
    console.log('Buffer first bytes:', imageBuffer.slice(0, 4).toString('hex'));

    let image = sharp(imageBuffer);

    // Обрезка (crop)
    if (cropWidth && cropHeight && x && y) {
      image = image.extract({
        left: x,
        top: y,
        width: cropWidth,
        height: cropHeight
      });
    }

    // Изменение размера (resize)
    if (width && height) {
      image = image.resize(width, height);
    }

    // Поворот (rotate)
    if (angle) {
      image = image.rotate(angle);
    }

    // Скругление углов (rounded corners)
    if (radius && radius > 0) {
      const metadata = await image.metadata();
      const imgWidth = metadata.width;
      const imgHeight = metadata.height;

      const roundedCorners = Buffer.from(
        `<svg><rect x="0" y="0" width="${imgWidth}" height="${imgHeight}" rx="${radius}" ry="${radius}" fill="black"/></svg>`
      );

      const roundedCornersMask = await sharp(roundedCorners)
        .resize(imgWidth, imgHeight)
        .grayscale()
        .toBuffer();

      image = image.composite([
        { input: roundedCornersMask, blend: 'in' }
      ]);
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
      message: error.message,
      stack: error.stack
    });
  }
};
