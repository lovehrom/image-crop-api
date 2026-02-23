# DEPLOY_RAPIDAPI.md — Как опубликовать Image Crop API на RapidAPI

## Что это?

Это инструкция по публикации Image Crop API на RapidAPI Studio. Следуй этим шагам чтобы опубликовать свой API и начать зарабатывать!

---

## Шаги для публикации

### 1. Открой инструкцию по RapidAPI Studio

Открой файл:
```
K:\Работа\Текущие проекты\image-crop-api\RAPIDAPI_FILL_GUIDE_FOR_USER.md
```

В этой инструкции есть все точные значения для заполнения RapidAPI Studio.

### 2. Создай API на RapidAPI

1. Зайди на https://rapidapi.com/provider
2. Нажми **"Add New API"**
3. Заполни форму:
   - **Name:** `Image Crop API`
   - **Short Description:** `Process images via API using Sharp engine`
   - **Category:** выбери **Images**
   - **Data Import:** выбери `Do not import data`
4. Нажми **"Add API"**

### 3. Заполни Hub Listing (витрина)

Перейди во вкладку **Hub Listing → General**:

| Поле | Значение |
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

Operations are applied in order: resize → rotate → crop → border radius.
Coordinates x/y/cropWidth/cropHeight are calculated relative to image AFTER resize and rotate.

Perfect for:
- Image thumbnails generation
- Profile picture processing
- Social media image preparation
- E-commerce product image optimization

API optimised for Vercel serverless functions with cold start handling.
```

### 4. Заполни Gateway (Base URL)

Перейди во вкладку **Gateway**:

- **Base URL:** `https://image-crop-api-ten.vercel.app`
  - ❌ НЕ добавляй слеш в конце
  - ❌ НЕ добавляй путь `/api` или `/v1`
  - ✅ Только домен, как указано выше
- **Visibility:** переключи на `Public`

### 5. Заполни Definitions (эндпоинты)

Перейди во вкладку **Definitions**

**Создай группу:**
1. Нажми **"Create Group"**
2. Дай название: `Image Processing`
3. Нажми **"Create"**

**Добавь эндпоинты (из инструкции):**

1. **GET /health** — Health Check
2. **POST /crop** — Process Image

Для каждого эндпоинта заполни параметры и протестируй (см. инструкцию в RAPIDAPI_FILL_GUIDE_FOR_USER.md).

### 6. Заполни Security

Перейди во вкладку **Definitions → Security**:

- Выбери схему: **None**

### 7. Создай тарифы

Перейди во вкладку **Monetization → Plans**

Создай 3 тарифа:

**Plan 1: Free**
- Name: `Free`
- Description: `For testing and personal projects`
- Price: `0`
- Requests: `50`
- Rate Limit: `10`

**Plan 2: Basic**
- Name: `Basic`
- Description: `For small businesses and startups`
- Price: `10`
- Requests: `500`
- Rate Limit: `20`

**Plan 3: Pro**
- Name: `Pro`
- Description: `For growing companies with high volume`
- Price: `25`
- Requests: `5,000`
- Rate Limit: `50`

### 8. Опубликуй

**Чеклист перед публикацией:**

- [ ] Base URL: `https://image-crop-api-ten.vercel.app`
- [ ] Все эндпоинты созданы и протестированы:
  - [ ] GET /health — протестирован, пример сохранён
  - [ ] POST /crop — протестирован (3 теста), примеры сохранены
- [ ] Terms of Use заполнены в Hub Listing → General
- [ ] CORS настроен (✅ уже настроен!)
- [ ] Созданы 3 тарифа в Monetization
- [ ] Visibility переключён на Public

**Публикация:**

1. Переключи **Visibility** в **"Public"** во вкладке Gateway
2. Нажми **"Make API Public"** в правом верхнем углу

Готово! API опубликован на RapidAPI!

---

## После публикации

### Проверка что всё работает

```bash
# Health Check
curl -X GET "https://image-crop-api-ten.vercel.app/health"

# Crop image (200x200px from center)
curl -X POST "https://image-crop-api-ten.vercel.app/crop" \
  -F "file=@test.jpg" \
  -F "cropWidth=200" \
  -F "cropHeight=200" \
  -o cropped.jpg
```

### Добавление в каталог RapidAPI

После публикации API появится в RapidAPI каталоге:
- https://rapidapi.com/category/images

Пользователи смогут найти его и использовать!

---

## Настройка тарифов и монетизации

### Как изменить тарифы

1. Зайди в RapidAPI Studio
2. Перейди во вкладку **Monetization → Plans**
3. Нажми на тариф
4. Измени цену, количество запросов, лимиты
5. Нажми **"Save"**

### Как создать новый тариф

1. Зайди в RapidAPI Studio
2. Перейди во вкладку **Monetization → Plans**
3. Нажми **"Add Plan"**
4. Заполни все поля
5. Нажми **"Save"**

### Рекомендации по тарифам

**Free тариф:**
- Дает пользователям попробовать API бесплатно
- Лимит запросов: 50/месяц
- Ограничение: 10 запросов/минуту

**Basic тариф:**
- Для пользователей с небольшими проектами
- Лимит запросов: 500/месяц
- Ограничение: 20 запросов/минуту
- Цена: $10/месяц

**Pro тариф:**
- Для пользователей с высокими нагрузками
- Лимит запросов: 5,000/месяц
- Ограничение: 50 запросов/минуту
- Цена: $25/месяц

---

## Мониторинг использования

### Как посмотреть статистику

1. Зайди в RapidAPI Studio
2. Перейди во вкладку **Analytics**
3. Там увидишь:
   - Количество запросов
   - Количество подписок
   - Доход
   - Страны пользователей
   - Платформы

### Как экспортировать данные

1. Зайди в RapidAPI Studio
2. Перейди во вкладку **Analytics**
3. Нажми **"Export"**
4. Выбери формат (CSV, JSON, Excel)

---

## Частые вопросы

### Могу ли я изменить API после публикации?

Да! Меняй код в своём проекте, задеплой на Vercel, и RapidAPI автоматически заберёт обновления.

### Могу ли я удалить API?

Да! Зайди в RapidAPI Studio → Settings → Delete API.

### Могу ли я изменить Base URL?

Да! Зайди в RapidAPI Studio → Gateway → Base URL.

### Что делать если тесты не проходят?

1. Проверь что Base URL правильный
2. Проверь что CORS настроен (✅ уже настроен)
3. Перезагрузи страницу
4. Проверь что API работает на Vercel

### Как защитить API от злоупотреблений?

RapidAPI автоматически добавляет заголовок `X-RapidAPI-Key` к каждому запросу. Проверяй этот заголовок в своём коде если нужна дополнительная защита.

---

## Особенности Image Crop API

### CORS уже настроен!

✅ CORS middleware уже добавлен в код (`app.use(cors())`)
✅ Тесты RapidAPI Playground пройдут
✅ Пользователи RapidAPI смогут пользоваться API

### Порядок операций

⚠️ **Важно:** Операции применяются в следующем порядке:

1. **Resize** → Изменение размера
2. **Rotate** → Поворот
3. **Crop** → Обрезка
4. **Border radius** → Скругление углов

**Почему важно:** Координаты x/y/cropWidth/cropHeight рассчитываются ОТНОСИТЕЛЬНО изображения ПОСЛЕ resize и rotate.

### Обработка больших изображений

- Максимальный размер файла: 2MB
- Максимальные размеры: Sharp поддерживает очень большие изображения (10,000+ px)
- Рекомендация: Оптимизировать изображения перед загрузкой для ускорения

### Форматы вывода

- **PNG:** Без потерь, поддерживает прозрачность (по умолчанию)
- **JPEG:** Сжатие с потерями, меньший размер файла
- **WebP:** Современный формат, хорошее сжатие, поддерживается современными браузерами

---

## Документация API

- **Инструкция по RapidAPI Studio:** `RAPIDAPI_FILL_GUIDE_FOR_USER.md`
- **GitHub:** https://github.com/lovehrom/image-crop-api
- **Vercel:** https://image-crop-api-ten.vercel.app

---

**Дата создания:** 2026-02-23
**Автор:** rapidapi-publisher
