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
    const debug = {};

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

      debug.contentType = 'multipart/form-data';
      debug.fieldsKeys = Object.keys(fields);
      debug.filesKeys = Object.keys(files);

      // Check if file is in files object
      if (files.file) {
        debug.fileSource = 'files.file (disk)';
        debug.filepath = files.file.filepath;
        imageBuffer = fs.readFileSync(files.file.filepath);
      } else if (fields.file) {
        debug.fileSource = 'fields.file';
        debug.fileType = typeof fields.file;
        
        // Check if file is a string (FormData might send it as base64)
        if (typeof fields.file === 'string') {
          debug.fileStringStart = fields.file.substring(0, Math.min(100, fields.file.length));
          const base64Data = fields.file.replace(/^data:image\/\w+;base64,/, '');
          imageBuffer = Buffer.from(base64Data, 'base64');
          debug.base64Length = base64Data.length;
          debug.bufferLength = imageBuffer.length;
        } else if (Array.isArray(fields.file)) {
          debug.fileArrayType = typeof fields.file[0];
          if (typeof fields.file[0] === 'string') {
            const base64Data = fields.file[0].replace(/^data:image\/\w+;base64,/, '');
            imageBuffer = Buffer.from(base64Data, 'base64');
            debug.bufferLength = imageBuffer.length;
          } else {
            return res.status(400).json({ error: 'Invalid file format', debug });
          }
        } else {
          debug.fileStructure = JSON.stringify(fields.file, null, 2);
          return res.status(400).json({ error: 'File is not a string or array', debug });
        }
      } else {
        return res.status(400).json({ error: 'File is required', debug });
      }

    } else if (contentType.includes('application/json')) {
      // Parse JSON body
      let body = '';
      for await (const chunk of req) {
        body += chunk.toString();
      }
      fields = JSON.parse(body);
      
      debug.contentType = 'application/json';
      debug.fieldsKeys = Object.keys(fields);

      if (fields.file) {
        debug.fileType = typeof fields.file;
        
        if (typeof fields.file === 'string') {
          debug.fileStringStart = fields.file.substring(0, Math.min(100, fields.file.length));
          const base64Data = fields.file.replace(/^data:image\/\w+;base64,/, '');
          imageBuffer = Buffer.from(base64Data, 'base64');
          debug.base64Length = base64Data.length;
          debug.bufferLength = imageBuffer.length;
        } else {
          return res.status(400).json({ error: 'File must be a base64 string', debug });
        }
      } else {
        return res.status(400).json({ error: 'File is required', debug });
      }
    } else {
      debug.contentType = contentType;
      return res.status(400).json({ error: 'Unsupported content type', debug });
    }

    debug.bufferLength = imageBuffer?.length || 0;
    debug.bufferHexStart = imageBuffer?.slice(0, 32).toString('hex') || '';

    // Validate image format
    if (!imageBuffer || imageBuffer.length === 0) {
      return res.status(400).json({ error: 'Empty image buffer', debug });
    }

    // Try to create sharp instance with detailed error info
    try {
      let image = sharp(imageBuffer);
      debug.sharpSuccess = true;

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

    } catch (sharpError) {
      debug.sharpSuccess = false;
      debug.sharpError = sharpError.message;
      debug.sharpStack = sharpError.stack;
      throw sharpError;
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
