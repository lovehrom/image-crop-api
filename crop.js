const sharp = require('sharp');
const { formidable } = require('formidable');
const fs = require('fs');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Configure formidable
    const form = formidable({
      maxFileSize: 5 * 1024 * 1024, // 5MB
      maxTotalFileSize: 5 * 1024 * 1024,
    });

    // Parse form with Promise wrapper
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('Form parse error:', err);
          reject(err);
        } else {
          resolve([fields, files]);
        }
      });
    });

    // Debug logging
    console.log('Files:', JSON.stringify(Object.keys(files), null, 2));
    console.log('Fields:', JSON.stringify(Object.keys(fields), null, 2));

    if (!files.file) {
      return res.status(400).json({
        error: 'File is required',
        debug: {
          filesKeys: Object.keys(files),
          fieldsKeys: Object.keys(fields),
          allFiles: Object.keys(files).map(k => ({
            key: k,
            value: files[k]
          }))
        }
      });
    }

    // Get image buffer from disk
    if (files.file.filepath && fs.existsSync(files.file.filepath)) {
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

    } else {
      return res.status(500).json({
        error: 'Failed to read file',
        debug: {
          fileExists: files.file?.filepath ? fs.existsSync(files.file.filepath) : false,
          filepath: files.file?.filepath,
          fileObject: files.file
        }
      });
    }

  } catch (error) {
    console.error('Image processing error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      stack: error.stack
    });
  }
};
