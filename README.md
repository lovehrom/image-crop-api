# Image Crop API

![Node.js](https://img.shields.io/badge/Node.js-14%2B-339933?logo=node.js)
![Express](https://img.shields.io/badge/Express-4.18-000000?logo=express)
![Sharp](https://img.shields.io/badge/Sharp-0.32-blue)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)
![License](https://img.shields.io/badge/License-MIT-green)

REST API for cropping, resizing, rotating and processing images. Powered by **Sharp**, deployed on **Vercel**.

## Endpoints

### `POST /api/crop`

Crop, resize, rotate and apply border radius to an image.

**Form-Data fields:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `file` | File | Yes | Image file (PNG, JPG, WebP, up to 5 MB) |
| `cropWidth` | Int | Yes | Width of crop region |
| `cropHeight` | Int | Yes | Height of crop region |
| `x` | Int | No | X offset for crop (default: 0) |
| `y` | Int | No | Y offset for crop (default: 0) |
| `width` | Int | No | Resize width before crop |
| `height` | Int | No | Resize height before crop |
| `angle` | Int | No | Rotation angle in degrees (default: 0) |
| `radius` | Int | No | Border radius in px (default: 0) |
| `format` | String | No | Output format: `png`, `jpeg`, `webp` (default: `png`) |

**Example (cURL):**

```bash
curl -X POST https://image-crop-api-ten.vercel.app/api/crop \
  -F "file=@photo.jpg" \
  -F "cropWidth=500" \
  -F "cropHeight=500" \
  -F "x=100" \
  -F "y=50" \
  -F "angle=0" \
  -F "format=png" \
  -o cropped.png
```

### `GET /api/health`

Health check endpoint.

```json
{ "status": "healthy", "version": "1.0.0", "timestamp": "..." }
```

## Tech Stack

- **Runtime:** Node.js 14+
- **Framework:** Express
- **Image Processing:** Sharp
- **File Upload:** Multer
- **Validation:** express-validator
- **Hosting:** Vercel

## Quick Start

```bash
git clone https://github.com/lovehrom/image-crop-api.git
cd image-crop-api
npm install
cp .env.example .env
npm start
```

## License

MIT
