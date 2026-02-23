const sharp = require('sharp');
const formidable = require('formidable');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Configure formidable for Vercel Serverless Functions
  const form = formidable({
    maxFileSize: 5 * 1024 * 1024, // 5MB
    maxTotalFileSize: 5 * 1024 * 1024,
    keepExtensions: false,
    multiples: false
  });

  try {
    // Parse incoming request with Promise wrapper
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    if (!files.file) {
      return res.status(400).json({ error: 'File is required' });
    }

    // Read file content
    const fs = require('fs');
    const imageBuffer = fs.readFileSync(files.file.filepath);

    let image = sharp(imageBuffer);

    // Обрезка (crop)
    if (fields.cropWidth && fields.cropHeight && fields.x && fields.y) {
      image = image.extract({
        left: parseInt(fields.cropWidth),
        top: parseInt(fields.cropHeight),
        width: parseInt(fields.x),
        height: parseInt(fields.y)
      });
    }

    // Изменение размера (resize)
    if (fields.width && fields.height) {
      image = image.resize(parseInt(fields.width), parseInt(fields.height));
    }

    // Поворот (rotate)
    if (fields.angle) {
      image = image.rotate(parseInt(fields.angle));
    }

    // Скругление углов (rounded corners)
    if (fields.radius && parseInt(fields.radius) > 0) {
      const radius = parseInt(fields.radius);
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
    const format = fields.format || 'png';
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
