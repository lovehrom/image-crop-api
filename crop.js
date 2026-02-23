// Debug endpoint to see what RapidAPI sends

module.exports = async function handler(req, res) {
  try {
    // Collect all request info
    const info = {
      method: req.method,
      url: req.url,
      headers: req.headers,
      contentType: req.headers['content-type'],
    };

    // Collect body as string
    let bodyStr = '';
    for await (const chunk of req) {
      bodyStr += chunk.toString();
    }

    info.bodyLength = bodyStr.length;
    info.bodyPreview = bodyStr.substring(0, 500);
    info.bodyPreviewHex = Buffer.from(bodyStr.substring(0, 100)).toString('hex');

    // Try to parse as JSON
    try {
      const jsonBody = JSON.parse(bodyStr);
      info.jsonParsed = true;
      info.jsonKeys = Object.keys(jsonBody);
      info.jsonValues = {};
      
      for (const [key, value] of Object.entries(jsonBody)) {
        info.jsonValues[key] = {
          type: typeof value,
          length: typeof value === 'string' ? value.length : null,
          preview: typeof value === 'string' ? value.substring(0, 200) : value
        };
      }
    } catch (e) {
      info.jsonParsed = false;
      info.jsonError = e.message;
    }

    // Try to detect if it's multipart/form-data
    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('multipart/form-data')) {
      info.multipartDetected = true;
      // Extract boundary
      const boundaryMatch = contentType.match(/boundary=([^;]+)/);
      if (boundaryMatch) {
        info.boundary = boundaryMatch[1].trim();
      }
    }

    // Return all debug info
    res.status(200).json(info);

  } catch (error) {
    res.status(500).json({
      error: 'Debug endpoint error',
      message: error.message,
      stack: error.stack
    });
  }
};
