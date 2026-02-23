const sharp = require('sharp');
const formidable = require('formidable');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable({
    maxFileSize: 5 * 1024 * 1024, // 5MB
    maxTotalFileSize: 5 * 1024 * 1024
  });

  try {
    const [fields, files] = await form.parse(req);

    if (!files.file || files.file.length === 0) {
      return res.status(400).json({ error: 'File is required' });
    }

    const file = files.file[0];
    let image = sharp(file.filepath);

    // Обрезка (crop)
    if (fields.cropWidth && fields.cropHeight && fields.x && fields.y) {
      image = image.extract({
        left: parseInt(fields.x[0]),
        top: parseInt(fields.y[0]),
        width: parseInt(fields.cropWidth[0]),
        height: parseInt(fields.cropHeight[0])
      });
    }

    // Изменение размера (resize)
    if (fields.width && fields.height) {
      image = image.resize(parseInt(fields.width[0]), parseInt(fields.height[0]));
    }

    // Поворот (rotate)
    if (fields.angle) {
      image = image.rotate(parseInt(fields.angle[0]));
    }

    // Скругление углов (rounded corners)
    if (fields.radius && fields.radius[0] > 0) {
      const radius = parseInt(fields.radius[0]);
      const metadata = await image.metadata();
      const width = metadata.width;
      const height = metadata.height;

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
    const format = fields.format ? fields.format[0] : 'png';
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
    res.status(500).json({ error: 'Internal server error' });
  }
}
