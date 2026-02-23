module.exports = async function handler(req, res) {
  try {
    console.log('Method:', req.method);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body type:', req.body ? typeof req.body : 'undefined');

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Для multipart/form-data в Vercel Serverless Functions
    // req.body может содержать распарсенные данные если они были обработаны

    // Если файл загружен, он может быть в разных местах в зависимости от конфигурации
    if (req.body && req.body.file) {
      return res.status(200).json({
        message: 'File received via req.body.file',
        body: Object.keys(req.body)
      });
    }

    // Если файл в req.files (некоторые конфигурации Vercel)
    if (req.files && req.files.file) {
      return res.status(200).json({
        message: 'File received via req.files.file',
        files: Object.keys(req.files)
      });
    }

    // Если ничего не нашли
    return res.status(200).json({
      message: 'POST request received, but no file found',
      method: req.method,
      hasBody: !!req.body,
      bodyKeys: req.body ? Object.keys(req.body) : [],
      contentType: req.headers['content-type']
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: error.message,
      stack: error.stack
    });
  }
};
