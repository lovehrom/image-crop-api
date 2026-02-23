# RapidAPI Studio — Как заполнить всё для Image Crop API

Этот файл содержит точные значения для заполнения RapidAPI Studio для Image Crop API.

---

## ⚠️ ВАЖНО: Настройка CORS перед публикацией!

**Image Crop API НЕ имеет CORS middleware в коде!**

Без настройки CORS:
- ❌ Тесты RapidAPI Playground НЕ пройдут
- ❌ Пользователи RapidAPI НЕ смогут пользоваться API
- ❌ RapidAPI Studio НЕ сможет протестировать API

### Как настроить CORS:

1. Открыть файл `K:\Работа\Текущие проекты\image-crop-api\index.js`
2. Установить пакет если нет:
```bash
cd "K:\Работа\Текущие проекты\image-crop-api"
npm install cors
```

3. Добавить CORS middleware (строка 8, после `app.use(express.json());` но ДО `app.use('/', routes);`):
```javascript
const cors = require('cors');

// ДОБАВИТЬ после app.use(express.json());
app.use(cors()); // добавь эту строку!
```

4. Сохранить файл `index.js`

5. Задеплоить на Vercel:
```bash
cd "K:\Работа\Текущие проекты\image-crop-api"
vercel deploy --yes
```

6. Проверить что работает:
```bash
vercel curl /health --yes
```

**Только после этого продолжай с инструкцией ниже!**

---

## 1. Создание проекта на RapidAPI

1. Зайди на https://rapidapi.com/provider
2. Нажми **"Add New API"**
3. Заполни форму:
   - **Name:** `Image Crop API`
   - **Short Description:** `Process images via API using Sharp engine`
   - **Category:** выбери **Images**
   - **Data Import:** выбери `Do not import data`
4. Нажми **"Add API"**

---

## 2. Hub Listing (витрина)

Перейди во вкладку **Hub Listing → General**:

### General

| Поле | Что вписать |
|---|---|
| **Logo** | Загрузи квадратное PNG изображение (минимум 500x500px) |
| **Long Description** | (см. ниже) |
| **Website** | `https://github.com/lovehrom/image-crop-api` |
| **Terms of Use** | `Free to use for personal and commercial projects.` |

### Long Description (скопируй это):

```
Process images via API using Sharp engine with professional quality.

Features:
- Crop by coordinates (x, y, cropWidth, cropHeight)
- Resize to target dimensions (width, height)
- Rotate by any angle (0-360 degrees)
- Apply border radius for rounded corners
- Multiple output formats: PNG, JPEG, WebP
- High-quality image processing using Sharp library

Operations are applied in order: resize → rotate → crop → border radius.
Coordinates x/y/cropWidth/cropHeight are calculated relative to image AFTER resize and rotate.

Perfect for:
- Image thumbnails generation
- Profile picture processing
- Social media image preparation
- E-commerce product image optimization

API optimised for Vercel serverless functions with cold start handling.
```

---

## 3. Gateway (Base URL)

Перейди во вкладку **Gateway**:

- **Base URL:** `https://image-crop-api-ten.vercel.app`
  - ❌ НЕ добавляй слеш в конце
  - ❌ НЕ добавляй путь `/api` или `/v1`
  - ✅ Только домен, как указано выше
- **Visibility:** переключи на `Public`

---

## 4. Definitions (Эндпоинты)

Перейди во вкладку **Definitions**

### Создай Group:
1. Нажми **"Create Group"**
2. Дай название: `Image Processing`
3. Нажми **"Create"**

---

### Эндпоинт 1: GET /health (Health Check)

**Внутри группы Image Processing создай:**

| Поле | Значение |
|---|---|
| **Name** | Health Check |
| **Description** | Check if API is running and get version info |
| **Method** | GET |
| **Endpoint Path** | /health |

**Параметров нет**

**Тест:**
1. Нажми **"Test Endpoint"**
2. Нажми **"Test"** (без параметров)
3. Должен прийти ответ:
```json
{
  "status": "healthy",
  "version": "1.0.0"
}
```
4. Нажми **"Save as Example"**

---

### Эндпоинт 2: POST /crop (Process Image)

**Внутри группы Image Processing создай:**

| Поле | Значение |
|---|---|
| **Name** | Process Image |
| **Description** | Process image with crop, resize, rotate, and border radius operations |
| **Method** | POST |
| **Endpoint Path** | /crop |

### Параметры (Body - form-data):

Выбери тип тела запроса: **form-data**

Нажми **"Add Parameter"** для каждого поля:

#### Параметр 1: file

| Поле | Значение |
|---|---|
| **Name** | `file` |
| **Type** | `file` |
| **Condition** | `required` |
| **Description** | Image file to process (JPG or PNG, max 2MB) |
| **Example** | (выбери любой тестовый файл изображения) |

#### Параметр 2: cropWidth

| Поле | Значение |
|---|---|
| **Name** | `cropWidth` |
| **Type** | `number` |
| **Condition** | `optional` |
| **Description** | Width of crop area in pixels (AFTER resize and rotate) |
| **Example** | `400` |

#### Параметр 3: cropHeight

| Поле | Значение |
|---|---|
| **Name** | `cropHeight` |
| **Type** | `number` |
| **Condition** | `optional` |
| **Description** | Height of crop area in pixels (AFTER resize and rotate) |
| **Example** | `300` |

#### Параметр 4: x

| Поле | Значение |
|---|---|
| **Name** | `x` |
| **Type** | `number` |
| **Condition** | `optional` |
| **Description** | Left offset for crop, default 0 (AFTER resize and rotate) |
| **Example** | `50` |

#### Параметр 5: y

| Поле | Значение |
|---|---|
| **Name** | `y` |
| **Type** | `number` |
| **Condition** | `optional` |
| **Description** | Top offset for crop, default 0 (AFTER resize and rotate) |
| **Example** | `50` |

#### Параметр 6: width

| Поле | Значение |
|---|---|
| **Name** | `width` |
| **Type** | `number` |
| **Condition** | `optional` |
| **Description** | Resize image to this width BEFORE crop and rotate |
| **Example** | `800` |

#### Параметр 7: height

| Поле | Значение |
|---|---|
| **Name** | `height` |
| **Type** | `number` |
| **Condition** | `optional` |
| **Description** | Resize image to this height BEFORE crop and rotate |
| **Example** | `600` |

#### Параметр 8: angle

| Поле | Значение |
|---|---|
| **Name** | `angle` |
| **Type** | `number` |
| **Condition** | `optional` |
| **Description** | Rotation angle in degrees (0-360, default 0). Applied BEFORE crop |
| **Example** | `90` |

#### Параметр 9: radius

| Поле | Значение |
|---|---|
| **Name** | `radius` |
| **Type** | `number` |
| **Condition** | `optional` |
| **Description** | Border radius for rounded corners in pixels, default 0 |
| **Example** | `20` |

#### Параметр 10: format

| Поле | Значение |
|---|---|
| **Name** | `format` |
| **Type** | `string` |
| **Condition** | `optional` |
| **Description** | Output format: 'png', 'jpeg', or 'webp'. Default: 'png' |
| **Example** | `png` |

---

### Тестирование POST /crop

**Тест 1: Simple crop (200x200px from center)**

1. Нажми **"Test Endpoint"**
2. Заполни:
   - **file:** выбери тестовое изображение
   - **cropWidth:** `200`
   - **cropHeight:** `200`
   - **x:** оставь пустым (по умолчанию 0)
   - **y:** оставь пустым (по умолчанию 0)
   - **width:** оставь пустым
   - **height:** оставь пустым
   - **angle:** оставь пустым
   - **radius:** оставь пустым
   - **format:** `png`
3. Нажми **"Test"**
4. Должен прийти обработанное изображение (200x200px)
5. Нажми **"Save as Example"**

**Тест 2: Resize + Crop**

1. Нажми **"Test Endpoint"**
2. Заполни:
   - **file:** выбери тестовое изображение
   - **cropWidth:** `300`
   - **cropHeight:** `300`
   - **x:** оставь пустым (по умолчанию 0)
   - **y:** оставь пустым (по умолчанию 0)
   - **width:** `800`
   - **height:** `600`
   - **angle:** оставь пустым (по умолчанию 0)
   - **radius:** оставь пустым (по умолчанию 0)
   - **format:** `jpeg`
3. Нажми **"Test"**
4. Должен прийти обработанное изображение (JPEG)
5. Нажми **"Save as Example"**

**Тест 3: Rotate + Border Radius**

1. Нажми **"Test Endpoint"**
2. Заполни:
   - **file:** выбери тестовое изображение
   - **cropWidth:** оставь пустым
   - **cropHeight:** оставь пустым
   - **x:** оставь пустым
   - **y:** оставь пустым
   - **width:** `400`
   - **height:** `400`
   - **angle:** `45`
   - **radius:** `50`
   - **format:** `png`
3. Нажми **"Test"**
4. Должен прийти обработанное изображение (повёрнутое на 45° с закруглёнными углами)
5. Нажми **"Save as Example"**

---

## 5. Security (аутентификация)

Перейди во вкладку **Definitions → Security**

- Выбери схему: **None**

API не требует собственной авторизации — он открытый.

---

## 6. Monetization (монетизация)

Перейди во вкладку **Monetization → Plans**

Нажми **"Add Plan"** и создай 3 тарифа:

### Plan 1: Free

| Поле | Значение |
|---|---|
| **Name** | `Free` |
| **Description** | For testing and personal projects |
| **Price** | `0` |
| **Currency** | `USD` |
| **Unit** | `Month` |
| **Requests** | `50` |
| **Rate Limit** | `10` (requests per minute) |

### Plan 2: Basic

| Поле | Значение |
|---|---|
| **Name** | `Basic` |
| **Description** | For small businesses and startups |
| **Price** | `10` |
| **Currency** | `USD` |
| **Unit** | `Month` |
| **Requests** | `500` |
| **Rate Limit** | `20` (requests per minute) |

### Plan 3: Pro

| Поле | Значение |
|---|---|
| **Name** | `Pro` |
| **Description** | For growing companies with high volume |
| **Price** | `25` |
| **Currency** | `USD` |
| **Unit** | `Month` |
| **Requests** | `5,000` |
| **Rate Limit** | `50` (requests per minute) |

---

## 7. Публикация

### Чеклист перед публикацией

- [ ] ✅ **CORS настроен!** (см. раздел "ВАЖНО" выше)
- [ ] Base URL: `https://image-crop-api-ten.vercel.app`
- [ ] Все эндпоинты созданы и протестированы:
  - [ ] GET /health — протестирован, пример сохранён
  - [ ] POST /crop — протестирован (3 теста), примеры сохранены
- [ ] Terms of Use заполнены в Hub Listing → General
- [ ] Созданы 3 тарифа в Monetization (Free, Basic, Pro)
- [ ] Visibility переключён на Public

---

### Публикация

1. Переключи **Visibility** в **"Public"** во вкладке Gateway
2. Нажми **"Make API Public"** в правом верхнем углу
3. Готово! API опубликован на RapidAPI!

---

## Тестирование после публикации

После публикации API будет доступен по адресу:
`https://rapidapi.com/lovehrom/image-crop-api`

### Тест через curl:

```bash
# Health Check
curl -X GET "https://image-crop-api-ten.vercel.app/health"

# Simple crop (200x200)
curl -X POST "https://image-crop-api-ten.vercel.app/crop" \
  -F "file=@test.jpg" \
  -F "cropWidth=200" \
  -F "cropHeight=200" \
  -o cropped.jpg
```

---

## Частые ошибки и решения

| Ошибка | Причина | Решение |
|---|---|---|
| Тест не проходит (CORS error) | ❌ Не настроен CORS | ✅ См. раздел "ВАЖНО" в начале файла |
| Тест не проходит (Timeout) | ❌ Cold start Vercel | ✅ Повтори запрос через 5-10 секунд |
| Нельзя сделать API публичным | ❌ Не заполнены Terms of Use | ✅ Hub Listing → General → Terms of Use: `Free to use for personal and commercial projects.` |
| 413 Payload Too Large | ❌ Файл слишком большой | ✅ Сжеми изображение до 2MB или меньше |
| 400 Bad Request: Invalid coordinates | ❌ Координаты не числовые | ✅ Убедись что x, y, cropWidth, cropHeight — это числа |
| 400 Bad Request: Invalid angle | ❌ Угол не числовой или вне диапазона | ✅ Убедись что angle — это число от 0 до 360 |

---

## Информация о проекте

- **Название:** Image Crop API
- **Версия:** 1.0.0
- **Framework:** Express (Node.js)
- **Стек:** Sharp + Multer + Express
- **Деплой:** Vercel (Serverless)
- **CORS:** ⚠️ Требуется настройка (см. раздел "ВАЖНО" выше)

---

## Как настроить CORS (повторение):

1. Открыть `K:\Работа\Текущие проекты\image-crop-api\index.js`
2. Установить: `npm install cors`
3. Добавить после `app.use(express.json());`:
```javascript
const cors = require('cors');
app.use(cors());
```
4. Задеплоить: `vercel deploy --yes`

---

**Дата создания инструкции:** 2026-02-23
**Автор:** rapidapi-publisher (командир chain агентов)
