// Создание примеров для каждой функции Image Crop API (используя Sharp напрямую)

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

class ExampleGenerator {
  constructor(imagePath) {
    this.imagePath = imagePath;
  }

  async createExample(name, processFn, outputFile) {
    console.log(`Создание: ${name}...`);
    try {
      const result = await processFn(sharp(this.imagePath));
      await result.toFile(outputFile);
      const stats = fs.statSync(outputFile);
      console.log(`✅ Сохранено: ${outputFile} (${(stats.size / 1024).toFixed(2)} KB)`);
      return { name, file: outputFile, size: stats.size };
    } catch (error) {
      console.error(`❌ Ошибка: ${error.message}`);
      return { name, error: error.message };
    }
  }

  async generateExamples() {
    console.log('=== Создание примеров для Image Crop API ===\n');

    const results = [];

    // 1. Оригинальное изображение (копия для сравнения)
    console.log('1. Оригинальное изображение...');
    const originalBuffer = fs.readFileSync(this.imagePath);
    fs.writeFileSync('example_01_original.png', originalBuffer);
    const originalStats = fs.statSync('example_01_original.png');
    results.push({ name: 'Оригинальное изображение', file: 'example_01_original.png', size: originalStats.size });

    // 2. Resize (800x600)
    results.push(await this.createExample(
      'Resize (800x600)',
      image => image.resize(800, 600),
      'example_02_resize_800x600.png'
    ));

    // 3. Resize (500x400)
    results.push(await this.createExample(
      'Resize (500x400)',
      image => image.resize(500, 400),
      'example_03_resize_500x400.png'
    ));

    // 4. Rotate 90°
    results.push(await this.createExample(
      'Rotate 90°',
      image => image.rotate(90),
      'example_04_rotate_90.png'
    ));

    // 5. Rotate 180°
    results.push(await this.createExample(
      'Rotate 180°',
      image => image.rotate(180),
      'example_05_rotate_180.png'
    ));

    // 6. Rotate 270°
    results.push(await this.createExample(
      'Rotate 270°',
      image => image.rotate(270),
      'example_06_rotate_270.png'
    ));

    // 7. Rotate 45° (custom)
    results.push(await this.createExample(
      'Rotate 45°',
      image => image.rotate(45),
      'example_07_rotate_45.png'
    ));

    // 8. Border Radius 10px
    results.push(await this.createExample(
      'Border Radius 10px',
      async image => {
        const metadata = await image.metadata();
        const svg = `<svg width="${metadata.width}" height="${metadata.height}">
          <rect x="0" y="0" width="${metadata.width}" height="${metadata.height}" rx="10" ry="10" fill="white"/>
        </svg>`;
        return image.composite([{ input: Buffer.from(svg), blend: 'dest-in' }]);
      },
      'example_08_border_radius_10.png'
    ));

    // 9. Border Radius 30px
    results.push(await this.createExample(
      'Border Radius 30px',
      async image => {
        const metadata = await image.metadata();
        const svg = `<svg width="${metadata.width}" height="${metadata.height}">
          <rect x="0" y="0" width="${metadata.width}" height="${metadata.height}" rx="30" ry="30" fill="white"/>
        </svg>`;
        return image.composite([{ input: Buffer.from(svg), blend: 'dest-in' }]);
      },
      'example_09_border_radius_30.png'
    ));

    // 10. Crop with coordinates (100,100, 600x500)
    results.push(await this.createExample(
      'Crop with coordinates',
      image => image.extract({ left: 100, top: 100, width: 600, height: 500 }),
      'example_10_crop_coordinates.png'
    ));

    // 11. Complex: Resize + Rotate + Crop
    results.push(await this.createExample(
      'Complex (resize + rotate + crop)',
      image => image.resize(600, 500).rotate(45).extract({ left: 20, top: 20, width: 500, height: 400 }),
      'example_11_complex.png'
    ));

    // 12. Complex: Resize + Border Radius (JPEG)
    results.push(await this.createExample(
      'Resize + Border Radius (JPEG)',
      async image => {
        const resized = await image.resize(800, 600).jpeg({ quality: 85 }).toBuffer();
        const img = sharp(resized);
        const metadata = await img.metadata();
        const svg = `<svg width="${metadata.width}" height="${metadata.height}">
          <rect x="0" y="0" width="${metadata.width}" height="${metadata.height}" rx="25" ry="25" fill="white"/>
        </svg>`;
        return img.composite([{ input: Buffer.from(svg), blend: 'dest-in' }]).jpeg({ quality: 85 });
      },
      'example_12_resize_radius.jpg'
    ));

    console.log('\n=== Все примеры созданы! ===');
    console.log(`Всего файлов: ${results.length}\n`);

    // Печатаем результаты
    results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.name}`);
      if (result.size) console.log(`   Размер: ${(result.size / 1024).toFixed(2)} KB`);
      console.log(`   Файл: ${result.file}\n`);
    });

    return results;
  }
}

// Запуск
async function main() {
  const imagePath = path.join(__dirname, 'test_image.png');

  console.log('Изображение:', imagePath, '\n');

  const generator = new ExampleGenerator(imagePath);
  await generator.generateExamples();
}

main().catch(err => {
  console.error('Ошибка:', err);
  process.exit(1);
});
