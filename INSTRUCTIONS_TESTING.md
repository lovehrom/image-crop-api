# INSTRUCTIONS_TESTING.md — Инструкция по тестированию Image Crop API

---

## 📋 Подготовка к тестированию

### Шаг 1: Установка зависимостей
Открой терминал и перейди в папку проекта:

```bash
cd "K:\Работа\rapidapi.com\image-crop-api"
npm install
```

**Ожидаемый результат:**
```
added 23 packages, and audited 24 packages in Xs
found 0 vulnerabilities
```

### Шаг 2: Создание окружения
Скопируй `.env.example` в `.env`:

```bash
copy .env.example .env
```

Открой `.env` и проверь содержимое:
```env
PORT=3000
NODE_ENV=production
```

### Шаг 3: Запуск сервера
Запусти сервер:

```bash
npm start
```

**Ожидаемый результат:**
```
Server running on port 3000
```

---

## 📋 Тестирование Health Check

### GET /health

**Команда:**
```bash
curl "http://localhost:3000/health"
```

**Ожидаемый ответ:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**Проверки:**
- Status: `healthy`
- Version: `1.0.0`
- Timestamp: допустимый ISO формат

---

## 📋 Тестирование POST /crop

### Подготовка тестового файла
Для тестирования нужен PNG или JPG файл. Если нет — создай простой файл или скачай тестовое изображение.

**Вариант 1: Создай тестовый файл**
```bash
# Можно использовать любой PNG файл на компьютере
# Скопируй его в папку проекта как test_image.png
```

---

### Тест 1: Basic Crop (изменение размера)

**Команда:**
```bash
curl -X POST "http://localhost:3000/crop" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test_image.png" \
  -F "width=800" \
  -F "height=600"
```

**Ожидаемый результат:**
- Status: 200 OK
- Content-Type: image/png
- Body: Изображение 800x600px

**Что проверяем:**
- Сервер обрабатывает файл
- Изображение изменено до 800x600px

---

### Тест 2: Crop with Coordinates

**Команда:**
```bash
curl -X POST "http://localhost:3000/crop" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test_image.png" \
  -F "x=100" \
  -F "y=100" \
  -F "cropWidth=400" \
  -F "cropHeight=400"
```

**Ожидаемый результат:**
- Status: 200 OK
- Content-Type: image/png
- Body: Обрезанная область изображения 400x400px (начиная с координат 100, 100)

**Что проверяем:**
- Обрезка работает корректно
- Координаты приняты

---

### Тест 3: Rotate 90 градусов

**Команда:**
```bash
curl -X POST "http://localhost:3000/crop" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test_image.png" \
  -F "angle=90"
```

**Ожидаемый результат:**
- Status: 200 OK
- Content-Type: image/png
- Body: Изображение повёрнутое на 90° по часовой стрелке

**Что проверяем:**
- Поворот работает корректно
- Угол 90° обработан правильно

---

### Тест 4: Rotate 180 градусов

**Команда:**
```bash
curl -X POST "http://localhost:3000/crop" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test_image.png" \
  -F "angle=180"
```

**Ожидаемый результат:**
- Status: 200 OK
- Content-Type: image/png
- Body: Изображение повёрнутое на 180° (перевёрнутое)

**Что проверяем:**
- Поворот на 180° работает
- Изображение перевёрнуто

---

### Тест 5: Rotate 270 градусов

**Команда:**
```bash
curl -X POST "http://localhost:3000/crop" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test_image.png" \
  -F "angle=270"
```

**Ожидаемый результат:**
- Status: 200 OK
- Content-Type: image/png
- Body: Изображение повёрнутое на 270°

**Что проверяем:**
- Поворот на 270° работает
- Изображение повёрнуто правильно

---

### Тест 6: Custom Angle

**Команда:**
```bash
curl -X POST "http://localhost:3000/crop" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test_image.png" \
  -F "angle=45"
```

**Ожидаемый результат:**
- Status: 200 OK
- Content-Type: image/png
- Body: Изображение повёрнутое на 45°

**Что проверяем:**
- Произвольный угол работает
- Угол 45° обработан правильно

---

### Тест 7: Border Radius (Rounded Corners)

**Команда:**
```bash
curl -X POST "http://localhost:3000/crop" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test_image.png" \
  -F "radius=20"
```

**Ожидаемый результат:**
- Status: 200 OK
- Content-Type: image/png
- Body: Изображение со скруглёнными углами (radius 20px)

**Что проверяем:**
- Скругление углов работает
- Радиус 20px обработан правильно

---

### Тест 8: Border Radius (10px)

**Команда:**
```bash
curl -X POST "http://localhost:3000/crop" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test_image.png" \
  -F "radius=10"
```

**Ожидаемый результат:**
- Status: 200 OK
- Content-Type: image/png
- Body: Изображение с небольшим скруглением (radius 10px)

**Что проверяем:**
- Скругление с радиусом 10px работает

---

### Тест 9: Resize without crop

**Команда:**
```bash
curl -X POST "http://localhost:3000/crop" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test_image.png" \
  -F "width=500" \
  -F "height=400"
```

**Ожидаемый результат:**
- Status: 200 OK
- Content-Type: image/png
- Body: Изображение 500x400px

**Что проверяем:**
- Изменение размера без координат работает

---

### Тест 10: Change Format to JPEG

**Команда:**
```bash
curl -X POST "http://localhost:3000/crop" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test_image.png" \
  -F "format=jpeg"
```

**Ожидаемый результат:**
- Status: 200 OK
- Content-Type: image/jpeg
- Body: Изображение в формате JPEG

**Что проверяем:**
- Изменение формата на JPEG работает
- Content-Type: image/jpeg

---

### Тест 11: Complex Request (все операции)

**Команда:**
```bash
curl -X POST "http://localhost:3000/crop" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test_image.png" \
  -F "width=800" \
  -F "height=600" \
  -F "x=50" \
  -F "y=50" \
  -F "cropWidth=600" \
  -F "cropHeight=400" \
  -F "angle=90" \
  -F "radius=15" \
  -F "format=jpeg"
```

**Ожидаемый результат:**
- Status: 200 OK
- Content-Type: image/jpeg
- Body: Изображение обработанное:
  - Обрезано по координатам (50, 50, 600x400)
  - Повёрнуто на 90°
  - Скруглённые углы (radius 15px)
  - В формате JPEG

**Что проверяем:**
- Все параметры работают вместе
- Сложный запрос обрабатывается корректно

---

## 📋 Тестирование ошибок

### Тест 1: Отсутствующий файл

**Команда:**
```bash
curl -X POST "http://localhost:3000/crop" \
  -H "Content-Type: multipart/form-data"
```

**Ожидаемый результат:**
```json
{
  "error": "Invalid file. Must be PNG or JPG, max 5MB"
}
```

**Статус:** 400 Bad Request

---

### Тест 2: Неверный параметр (width)

**Команда:**
```bash
curl -X POST "http://localhost:3000/crop" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test_image.png" \
  -F "width=0"
```

**Ожидаемый результат:**
```json
{
  "error": "Invalid width. Must be between 1 and 10000px"
}
```

**Статус:** 400 Bad Request

---

### Тест 3: Неверный параметр (angle)

**Команда:**
```bash
curl -X POST "http://localhost:3000/crop" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test_image.png" \
  -F "angle=400"
```

**Ожидаемый результат:**
```json
{
  "error": "Invalid angle. Must be between 0 and 360"
}
```

**Статус:** 400 Bad Request

---

### Тест 4: Неверный формат

**Команда:**
```bash
curl -X POST "http://localhost:3000/crop" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test_image.png" \
  -F "format=gif"
```

**Ожидаемый результат:**
```json
{
  "error": "Invalid format. Must be png, jpeg, or webp"
}
```

**Статус:** 400 Bad Request

---

## 📋 Сводная таблица тестов

| Тест | Endpoint | Параметры | Ожидаемый результат | Статус |
|------|----------|-----------|-------------------|--------|
| 1 | GET /health | - | Status healthy, v1.0.0 | - |
| 2 | POST /crop | file, width=800, height=600 | PNG 800x600 | - |
| 3 | POST /crop | file, x=100, y=100, cropWidth=400, cropHeight=400 | PNG 400x400 cropped | - |
| 4 | POST /crop | file, angle=90 | PNG rotated 90° | - |
| 5 | POST /crop | file, angle=180 | PNG rotated 180° | - |
| 6 | POST /crop | file, angle=270 | PNG rotated 270° | - |
| 7 | POST /crop | file, angle=45 | PNG rotated 45° | - |
| 8 | POST /crop | file, radius=20 | PNG with rounded corners (20px) | - |
| 9 | POST /crop | file, radius=10 | PNG with rounded corners (10px) | - |
| 10 | POST /crop | file, width=500, height=400 | PNG 500x400 | - |
| 11 | POST /crop | file, format=jpeg | JPEG | - |
| 12 | POST /crop | All parameters combined | Complex JPEG | - |
| 13 | POST /crop | (no file) | Error: Invalid file | 400 |
| 14 | POST /crop | file, width=0 | Error: Invalid width | 400 |
| 15 | POST /crop | file, angle=400 | Error: Invalid angle | 400 |
| 16 | POST /crop | file, format=gif | Error: Invalid format | 400 |

---

## 📋 Проверка результатов

### Что должно работать:
- [ ] Health Check возвращает статус healthy
- [ ] Basic crop с размерами работает
- [ ] Crop с координатами работает
- [ ] Rotate на 90°, 180°, 270°, custom angle работает
- [ ] Border radius (10px, 20px) работает
- [ ] Resize работает
- [ ] Изменение формата (PNG → JPEG) работает
- [ ] Сложный запрос со всеми параметрами работает
- [ ] Валидация ошибок возвращает правильный статус 400
- [ ] Валидация неверных параметров работает
- [ ] Время ответа < 500ms для простых операций
- [ ] Время ответа < 1s для сложных операций

### Что проверить вручную:
- [ ] Все PNG файлы открываются корректно
- [ ] Все JPEG файлы открываются корректно
- [ ] Размеры изображений соответствуют ожидаемым
- [ ] Поворот изображений правильный (по часовой стрелке)
- [ ] Скругление углов визуально проверено
- [ ] Ошибки возвращаются в формате JSON с полем error

---

## 📋 Автоматизация тестирования (PowerShell)

Для автоматизации тестов можно использовать PowerShell:

### Скрипт для автоматического тестирования

```powershell
$serverUrl = "http://localhost:3000"
$testFile = "test_image.png"

# Test 1: Health Check
Write-Host "Test 1: Health Check" -ForegroundColor Green
$healthResponse = Invoke-RestMethod -Uri "$serverUrl/health" -Method Get
Write-Host $healthResponse.StatusCode -ForegroundColor Yellow
Write-Host $healthResponse.Content -ForegroundColor White

# Test 2: Basic Crop
Write-Host "Test 2: Basic Crop" -ForegroundColor Cyan
$params = @{
    file = Get-Item -Path $testFile
    width = "800"
    height = "600"
}
$cropResponse = Invoke-RestMethod -Uri "$serverUrl/crop" -Method Post -Form $params
Write-Host $cropResponse.StatusCode -ForegroundColor Yellow

# Test 3: Rotate 90°
Write-Host "Test 3: Rotate 90°" -ForegroundColor Cyan
$params = @{
    file = Get-Item -Path $testFile
    angle = "90"
}
$rotateResponse = Invoke-RestMethod -Uri "$serverUrl/crop" -Method Post -Form $params
Write-Host $rotateResponse.StatusCode -ForegroundColor Yellow
```

---

## 📋 Траблшутинг

### Если сервер не запускается

**Проблема:** Пишет "port 3000 already in use"

**Решение:**
```bash
# Найти процесс на порту 3000
netstat -ano | findstr :3000

# Завершить процесс
taskkill /PID [PID] /F

# Повторный запуск
npm start
```

### Если npm install зависает

**Проблема:** Установка длится долго

**Решение:**
```bash
# Очистить кэш npm
npm cache clean --force

# Установить без package-lock.json
rm package-lock.json
npm install
```

### Если curl не работает

**Проблема:** curl не найден

**Решение:** Использовать PowerShell Invoke-RestMethod или установить curl через Chocolatey:
```powershell
choco install curl
```

---

## 📋 Чек-лист перед тестированием

- [ ] Node.js установлен (версия >= 18.0.0)
- [ ] npm установлен
- [ ] Переход в папку проекта выполнен
- [ ] Зависимости установлены (npm install)
- [ ] .env файл создан
- [ ] Тестовый файл изображения создан
- [ ] Сервер запущен (npm start)
- [ ] Сервер работает на порту 3000
- [ ] Тестовые команды подготовлены

---

## 📋 После тестирования

1. Создай файл `TEST_REPORT.md` в папке проекта
2. Укажи результаты всех тестов (успешно/неуспешно)
3. Опиши проблемы если есть
4. Укажи время ответа для каждого теста
5. Укажи любые несоответствия с ТЗ

---

**Дата:** 2026-02-21
**Версия:** 1.0.0
**Проект:** Image Crop API
