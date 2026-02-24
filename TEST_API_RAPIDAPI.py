#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Image Crop API - Full Test Suite for RapidAPI
Tests all parameter combinations
"""

import requests
from PIL import Image
import io
import os
import json
from datetime import datetime
import sys

# Force UTF-8 output for Windows
if sys.platform == "win32":
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# ─── CONFIG ───────────────────────────────────────────────────────────────────
# Use this for RapidAPI (requires API key)
API_URL = "https://lovehrom-image-crop-api.p.rapidapi.com/crop"
API_KEY = "YOUR_RAPIDAPI_KEY_HERE"

# Or use Vercel directly (no API key needed)
# API_URL = "https://image-crop-api-ten.vercel.app/crop"
# API_KEY = None

if API_KEY != "YOUR_RAPIDAPI_KEY_HERE":
    HEADERS = {
        "x-rapidapi-host": "lovehrom-image-crop-api.p.rapidapi.com",
        "x-rapidapi-key": API_KEY,
    }
else:
    HEADERS = {}

OUTPUT_DIR = "crop_test_results"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ─── CREATE TEST IMAGE ────────────────────────────────────────────────────────
def create_test_image(width=800, height=600):
    """Creates a colorful test image with grid for easy visual verification"""
    img = Image.new("RGB", (width, height))
    pixels = img.load()
    for y in range(height):
        for x in range(width):
            # Colorful gradient + grid lines
            r = int(255 * x / width)
            g = int(255 * y / height)
            b = 128
            if x % 100 == 0 or y % 100 == 0:
                r, g, b = 0, 0, 0  # grid lines
            pixels[x, y] = (r, g, b)
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=90)
    buf.seek(0)
    return buf

# ─── SEND REQUEST ─────────────────────────────────────────────────────────────
def test_crop(test_name, params, image_buf=None):
    if image_buf is None:
        image_buf = create_test_image()

    image_buf.seek(0)
    files = {"file": ("test.jpg", image_buf, "image/jpeg")}

    print(f"\n{'='*60}")
    print(f"TEST: {test_name}")
    print(f"Params: {json.dumps(params, indent=2)}")

    try:
        resp = requests.post(API_URL, headers=HEADERS, files=files, data=params, timeout=30)

        ct = resp.headers.get("content-type", "")
        print(f"Status: {resp.status_code}")
        print(f"Content-Type: {ct}")

        if resp.status_code == 200 and "image" in ct:
            # Save result image
            safe_name = test_name.lower().replace(" ", "_").replace("+", "").replace("/", "_")
            ext = "png" if "png" in ct else ("webp" if "webp" in ct else "jpg")
            out_path = os.path.join(OUTPUT_DIR, f"{safe_name}.{ext}")
            with open(out_path, "wb") as f:
                f.write(resp.content)

            # Show image size
            result_img = Image.open(io.BytesIO(resp.content))
            print(f"✅ SUCCESS — Image size: {result_img.size}, saved to {out_path}")
            return True
        else:
            print(f"❌ FAILED")
            try:
                print(f"Response: {resp.json()}")
            except:
                print(f"Response: {resp.text[:300]}")
            return False
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False

# ─── TEST CASES ───────────────────────────────────────────────────────────────
def run_all_tests():
    results = []
    start = datetime.now()

    print("🚀 Image Crop API — Full Test Suite")
    print(f"Started: {start.strftime('%H:%M:%S')}")
    print(f"Output: ./{OUTPUT_DIR}/")

    tests = [
        # 1. Crop only
        ("1 Crop only", {
            "cropWidth": "200",
            "cropHeight": "200",
            "x": "50",
            "y": "50",
        }),
        # 2. Crop + Resize
        ("2 Crop + Resize", {
            "cropWidth": "200",
            "cropHeight": "200",
            "width": "100",
            "height": "100",
        }),
        # 3. Crop + Rotate
        ("3 Crop + Rotate 45", {
            "cropWidth": "200",
            "cropHeight": "200",
            "angle": "45",
        }),
        # 4. Crop + Border Radius
        ("4 Crop + Border Radius", {
            "cropWidth": "200",
            "cropHeight": "200",
            "radius": "30",
        }),
        # 5. All together — PNG
        ("5 All together PNG", {
            "cropWidth": "200",
            "cropHeight": "200",
            "width": "150",
            "height": "150",
            "angle": "90",
            "radius": "20",
            "format": "png",
        }),
        # 6. All together — JPEG
        ("6 All together JPEG", {
            "cropWidth": "200",
            "cropHeight": "200",
            "width": "150",
            "height": "150",
            "angle": "90",
            "radius": "20",
            "format": "jpeg",
        }),
        # 7. All together — WebP
        ("7 All together WebP", {
            "cropWidth": "200",
            "cropHeight": "200",
            "width": "150",
            "height": "150",
            "angle": "90",
            "radius": "20",
            "format": "webp",
        }),
    ]

    for name, params in tests:
        ok = test_crop(name, params)
        results.append((name, ok))

    # ─── SUMMARY ──────────────────────────────────────────────────────────────
    elapsed = (datetime.now() - start).seconds
    passed = sum(1 for _, ok in results if ok)
    total = len(results)

    print(f"\n{'='*60}")
    print(f"📊 RESULTS: {passed}/{total} passed ({elapsed}s)")
    print(f"{'='*60}")
    for name, ok in results:
        icon = "✅" if ok else "❌"
        print(f"  {icon} {name}")

    if passed == total:
        print(f"\n🎉 All tests passed! Results saved to ./{OUTPUT_DIR}/")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed")

if __name__ == "__main__":
    if API_KEY == "YOUR_RAPIDAPI_KEY_HERE" and "rapidapi.com" in API_URL:
        print("❗ Вставь свой RapidAPI ключ в переменную API_KEY!")
        print("Или раскомментируй Vercel URL для тестирования без ключа.")
    else:
        run_all_tests()
