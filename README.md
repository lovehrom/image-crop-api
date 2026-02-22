# Image Crop API

Professional image cropping API with rotation and border radius support. Designed for e-commerce, mobile applications, and social networks.

## Features

- **Crop** — Crop images by size or coordinates
- **Resize** — Resize images to specific dimensions
- **Rotate** — Rotate images (90°, 180°, 270°, custom angle)
- **Border Radius** — Rounded corners (radius 10-50px)
- **Health Check** — API status check

## Tech Stack

- **Runtime:** Node.js ^18.0.0
- **Framework:** Express.js
- **Image Processing:** Sharp ^0.33.0
- **Deployment:** Vercel Serverless

## Endpoints

### POST /crop

Process image with crop, resize, rotate, and border radius operations.

**Request:**

Content-Type: `multipart/form-data`

Parameters:
| Parameter | Type | Required | Description |
|-----------|------|-----------|-------------|
| file | file | ✅ Yes | Image file (PNG/JPG, max 5MB) |
| width | number | ❌ No | New width (1-10000px) |
| height | number | ❌ No | New height (1-10000px) |
| x | number | ❌ No | X coordinate (default: 0) |
| y | number | ❌ No | Y coordinate (default: 0) |
| cropWidth | number | ❌ No | Crop area width (>= 1px) |
| cropHeight | number | ❌ No | Crop area height (>= 1px) |
| angle | number | ❌ No | Rotation angle (0-360, or 90, 180, 270) |
| radius | number | ❌ No | Border radius (10-50px) |
| format | string | ❌ No | Output format (png, jpeg, webp, default: png) |

**Example (curl):**

```bash
# Basic crop
curl -X POST "http://localhost:3000/crop" \
  -F "file=@image.png" \
  -F "width=800" \
  -F "height=600"

# Crop with coordinates
curl -X POST "http://localhost:3000/crop" \
  -F "file=@image.png" \
  -F "x=100" \
  -F "y=100" \
  -F "cropWidth=400" \
  -F "cropHeight=400"

# Rotate
curl -X POST "http://localhost:3000/crop" \
  -F "file=@image.png" \
  -F "angle=90"

# Rotate with border radius
curl -X POST "http://localhost:3000/crop" \
  -F "file=@image.png" \
  -F "angle=90" \
  -F "radius=20"
```

**Response:**

Status: 200 OK
Content-Type: image/png | image/jpeg | image/webp
Body: Binary image data

**Error Response:**

```json
{
  "error": "Invalid width. Must be between 1 and 10000px"
}
```

### GET /health

Check API health status.

**Request:**

```bash
curl "http://localhost:3000/health"
```

**Response:**

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid parameters |
| 413 | Payload Too Large - File exceeds 5MB |
| 500 | Internal Server Error |

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start server
npm start

# Development mode
npm run dev
```

### Autonomous Testing

The project includes an autonomous testing script that runs all tests automatically without manual intervention.

**To run all tests:**
```bash
npm run test:api
```

This will:
- Test all 16 API endpoints
- Validate all parameters
- Check error handling
- Generate TEST_REPORT_AUTONOMOUS.md

**Or run tests manually:**
See `INSTRUCTIONS_TESTING.md` for detailed testing instructions.

### Environment Variables

Create `.env` file based on `.env.example`:

```env
PORT=3000
NODE_ENV=production
```

## Testing

### Test Images

For testing, you need a PNG or JPG image file. Copy any image file to the project folder as `test_image.png`.

### Test Results

After running `npm run test:api`, a `TEST_REPORT_AUTONOMOUS.md` file will be generated with:

- All 16 test results (passed/failed)
- Error details if any
- Success rate percentage
- Performance notes

### Manual Testing

See `INSTRUCTIONS_TESTING.md` for detailed manual testing instructions with curl examples.

## Deployment

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy
```

## License

MIT

## Support

For issues and questions, please contact: support@example.com
