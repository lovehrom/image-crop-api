const sharp = require('sharp');
const { formidable } = require('formidable');
const fs = require('fs');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check content type
    const contentType = req.headers['content-type'] || '';

    let imageBuffer;
    let fields = {};
    let files = {};

    if (contentType.includes('multipart/form-data')) {
      // Parse multipart/form-data with formidable
      const form = formidable({
        maxFileSize: 5 * 1024 * 1024, // 5MB
        maxTotalFileSize: 5 * 1024 * 1024,
      });

      [fields, files] = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) {
            console.error('Form parse error:', err);
            reject(err);
          } else {
            resolve([fields, files]);
          }
        });
      });

      console.log('Multipart fields:', JSON.stringify(Object.keys(fields), null, 2));
      console.log('Multipart files:', JSON.stringify(Object.keys(files), null, 2));

      // Check if file is in files object
      if (files.file) {
        console.log('File in files object, reading from disk:', files.file.filepath);
        imageBuffer = fs.readFileSync(files.file.filepath);
      } else if (fields.file) {
        console.log('File in fields, type:', typeof fields.file);
        console.log('File is string?', typeof fields.file === 'string');
        console.log('File has value?', fields.file !== undefined && fields.file !== null);
        
        // Check if file is a string (FormData might send it as base64)
        if (typeof fields.file === 'string') {
          console.log('File starts with:', fields.file.substring(0, Math.min(50, fields.file.length)));
          const base64Data = fields.file.replace(/^data:image\/\w+;base64,/, '');
          imageBuffer = Buffer.from(base64Data, 'base64');
        } else if (Array.isArray(fields.file)) {
          console.log('File is array, first element type:', typeof fields.file[0]);
          if (typeof fields.file[0] === 'string') {
            const base64Data = fields.file[0].replace(/^data:image\/\w+;base64,/, '');
            imageBuffer = Buffer.from(base64Data, 'base64');
          } else {
            return res.status(400).json({ error: 'Invalid file format' });
          }
        } else {
          console.log('File object:', JSON.stringify(fields.file, null, 2));
          return res.status(400).json({ error: 'File is not a string or array' });
        }
        console.log('Buffer length:', imageBuffer.length);
      } else {
        return res.status(400).json({ error: 'File is required' });
      }

    } else if (contentType.includes('application/json')) {
      // Parse JSON body
      let body = '';
      for await (const chunk of req) {
        body += chunk.toString();
      }
      fields = JSON.parse(body);
      console.log('JSON fields:', Object.keys(fields));

      if (fields.file) {
        console.log('File in JSON, type:', typeof fields.file);
        
        if (typeof fields.file === 'string') {
          const base64Data = fields.file.replace(/^data:image\/\w+;base64,/, '');
          imageBuffer = Buffer.from(base64Data, 'base64');
        } else {
          return res.status(400).json({ error: 'File must be a base64 string' });
        }
        console.log('Buffer length:', imageBuffer.length);
      } else {
        return res.status(400).json({ error: 'File is required' });
      }
    } else {
      return res.status(400).json({ error: 'Unsupported content type' });
    }

    console.log('Image buffer length:', imageBuffer.length);
    console.log('Buffer first 20 bytes:', imageBuffer.slice(0, 20).toString('hex'));

    // Validate image format
    if (!imageBuffer || imageBuffer.length === 0) {
      return res.status(400).json({ error: 'Empty image buffer' });
    }

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
      message: error.message,
      stack: error.stack
    });
  }
};
