const sharp = require('sharp');
const fs = require('fs');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse JSON body for RapidAPI (file as base64 string)
    let body = '';

    for await (const chunk of req) {
      body += chunk.toString();
    }

    const data = JSON.parse(body);

    // Extract file from base64
    let imageBuffer;

    if (data.file) {
      // If file is base64 string
      if (typeof data.file === 'string') {
        // Remove data URL prefix if present
        const base64Data = data.file.replace(/^data:image\/\w+;base64,/, '');
        imageBuffer = Buffer.from(base64Data, 'base64');
      } else {
        return res.status(400).json({ error: 'Invalid file format' });
      }
    } else {
      return res.status(400).json({ error: 'File is required' });
    }

    let image = sharp(imageBuffer);

    // Обрезка (crop)
    if (data.cropWidth && data.cropHeight && data.x && data.y) {
      image = image.extract({
        left: parseInt(data.cropWidth),
        top: parseInt(data.cropHeight),
        width: parseInt(data.x),
        height: parseInt(data.y)
      });
    }

    // Изменение размера (resize)
    if (data.width && data.height) {
      image = image.resize(parseInt(data.width), parseInt(data.height));
    }

    // Поворот (rotate)
    if (data.angle) {
      image = image.rotate(parseInt(data.angle));
    }

    // Скругление углов (rounded corners)
    if (data.radius && parseInt(data.radius) > 0) {
      const radius = parseInt(data.radius);
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
    const format = data.format || 'png';
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
