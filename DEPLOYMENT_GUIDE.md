# DEPLOYMENT GUIDE — Руководство по деплою проекта

## Введение

Этот файл содержит инструкции по деплою проекта `image-crop-api` на GitHub и Vercel. В нем описаны ссылки на репозитории, интеграция Vercel с GitHub (Auto Deploy) и логика автоматической проверки ссылок.

---

## Ссылки на проекты

### Vercel Project
**Ссылка:** https://vercel.com/lovehroms-projects/image-crop-api

**Описание:** Репозиторий Vercel для деплоя проекта Image Crop API. В Vercel автоматически применяются изменения при пушах в GitHub (если настроена Integration).

### GitHub Repository
**Ссылка:** https://github.com/lovehroms/image-crop-api

**Описание:** Репозиторий GitHub для хранения кода проекта Image Crop API. Весь код (source) хранится здесь.

---

## Инструкция по использованию

### Сценарий 1: Первичный деплой (у тебя НЕТ репозитория на GitHub)

1. **Подготовка проекта**
   - Убедись, что файлы проекта созданы в папке `K:\Работа\Текущие проекты\image-crop-api`.
   - Убедись, что `package.json`, `src/server.js`, `src/routes/index.js`, `vercel.json` существуют.

2. **Создание репозитория на GitHub**
   - Перейди на https://github.com/new
   - Название репозитория: `image-crop-api`
   - Описание: `API for cropping, resizing, rotating, and rounding corners of images`
   - Выбери `Public` или `Private` (по твоему выбору)
   - Нажми **Create repository**
   - Скопируй URL репозитория (например, `https://github.com/lovehroms/image-crop-api`)

3. **Связывание локального Git с GitHub**
   ```bash
   cd "K:\Работа\Текущие проекты\image-crop-api"
   git init
   git add .
   git commit -m "Initial commit: Added fieldSize limit to Multer config and created project structure"
   git remote add origin https://github.com/lovehroms/image-crop-api.git
   git branch -M main
   git push -u origin main
   ```

4. **Связывание Vercel с GitHub (Auto Deploy)**
   - Перейди на https://vercel.com/lovehroms-projects/image-crop-api
   - В Vercel Dashboard выбери **Settings** → **Git**
   - В поле **Git Repository** введи или выбери: `lovehroms/image-crop-api`
   - В поле **Git Branch** выбери: `main`
   - В поле **Root Directory** введи: `.`
   - Нажми **Save**
   - Vercel автоматически подключит GitHub Integration (Auto Deploy)

5. **Деплой на Vercel**
   - В Vercel Dashboard нажми **Deploy**
   - Выбери **Production Environment**
   - Нажми **Deploy**
   - Жди пока деплой завершится (обычно 1-2 минуты)
   - После завершения появится URL проекта (например, `https://image-crop-api.vercel.app`)

---

### Сценарий 2: Обновление проекта (у тебя ЕСТЬ репозиторий на GitHub)

1. **Внесение изменений в код**
   - Отредактируй файлы проекта в папке `K:\Работа\Текущие проекты\image-crop-api`.
   - Например, измени `src/routes/index.js` или `package.json`.

2. **Коммит и пуш на GitHub**
   ```bash
   cd "K:\Работа\Текущие проекты\image-crop-api"
   git add .
   git commit -m "Added fieldSize limit to Multer config"
   git push
   ```

3. **Автоматический деплой на Vercel**
   - Vercel автоматически заметит пуш в GitHub
   - Vercel автоматически запустит деплой (через 1-2 минуты после пуша)
   - Проверь деплой в Vercel Dashboard → **Deployments**

---

## Интеграция Vercel с GitHub (Auto Deploy)

### Почему это важно?
- **Git (GitHub)** — это "истина истины" (source of truth). Весь код хранится здесь.
- **Vercel** — это хостинг. Он берет код из GitHub и деплоит его автоматически.
- **Логика:** Ты пушишь только на GitHub → Vercel автоматически применяет изменения.

### Как настроить Integration (Auto Deploy)
1. Перейди на Vercel Project: https://vercel.com/lovehroms-projects/image-crop-api
2. Перейди в **Settings** → **Git**
3. В поле **Git Repository** введи: `lovehroms/image-crop-api`
4. В поле **Git Branch** выбери: `main`
5. Нажми **Save**
6. Vercel автоматически подключит GitHub Integration.

### Как это работает?
1. Ты пушишь код на GitHub (`git push`).
2. GitHub Webhook отправляет уведомление в Vercel.
3. Vercel получает код из GitHub.
4. Vercel деплоит код (сборка, деплой).
5. Vercel применяет изменения (Production обновляется).

---

## Проверка ссылок (Кто пишет?)

### Кто пишет документацию?
**Автор:** rapidapi-publisher (автономно)
**Обновление:** При создании или обновлении проекта.

### Логика проверки ссылок:
**Автоматическая проверка:**
- При создании проекта `image-crop-api` я проверяю наличие ссылок:
  - Vercel: `https://vercel.com/lovehroms-projects/image-crop-api`
  - GitHub: `https://github.com/lovehroms/image-crop-api`
- **Если ссылки найдены:** Я записываю их в `DEPLOYMENT_GUIDE.md`.
- **Если ссылки НЕ найдены:** Я запрашиваю у пользователя:
  - "Пожалуйста, создай репозиторий на GitHub и назови его URL".
  - "Пожалуйста, создай проект на Vercel и назови его URL".

**Запрос ссылок у пользователя:**
- Если в `DEPLOYMENT_GUIDE.md` пустые ссылки (например, `https://github.com/YOUR_USERNAME/image-crop-api`), я запрашиваю у пользователя реальные URL.

---

## Хватит ли этой информации чтобы деплоить проекты?

### Да, достаточно! ✅

**Почему:**
1. **Git (GitHub)** — У меня есть доступ к `git` (команды работают).
2. **Vercel CLI** — У тебя есть Vercel CLI и он уже залогинен (я могу запускать `vercel link`, `vercel deploy`).
3. **Интеграция** — Если Vercel подключен к GitHub Integration (Auto Deploy), то мне достаточно пушить на GitHub, а Vercel сам применит изменения.
4. **Инструкции** — У меня есть точные инструкции (ссылки, команды) для деплоя.

**Как это работает в практике:**
1. Я создаю проект и файлы (автономно).
2. Я делаю коммит и пуш на GitHub (`git add .`, `git commit`, `git push`).
3. Vercel автоматически деплоит (через GitHub Integration).
4. Или я запускаю `vercel link` и `vercel deploy --prod` (если нет Integration).

---

## Инструкция для rapidapi-publisher (как деплоить проекты)

### Порядок деплоя:
1. **Проверка ссылок** — Читаю `DEPLOYMENT_GUIDE.md`.
2. **Если ссылки пустые** — Запрашиваю у пользователя реальные URL.
3. **Если ссылки есть** — Использую их для деплоя.

### Git Push:
```bash
cd "K:\Работа\Текущие проекты\image-crop-api"
git remote add origin https://github.com/lovehroms/image-crop-api.git
git branch -M main
git push -u origin main
```

### Vercel Link:
```bash
cd "K:\Работа\Текущие проекты\image-crop-api"
vercel link
```

### Vercel Deploy (Production):
```bash
cd "K:\Работа\Текущие проекты\image-crop-api"
vercel deploy --prod
```

---

## Проверка деплоя

### После деплоя проверь:
1. **Health Check:** `GET https://image-crop-api.vercel.app/api/health`
2. **Crop Endpoint:** `POST https://image-crop-api.vercel.app/api/crop` (с файлом изображения)
3. **Vercel Dashboard:** Проверь последние деплои (Logs, Builds).

---

## Автоматизация

### Скрипт для автоматического деплоя:
```javascript
const { execSync } = require('child_process');

// Путь к проекту
const PROJECT_PATH = '"K:\Работа\Текущие проекты\image-crop-api"';

// Git Push
execSync(`cd ${PROJECT_PATH} && git push`, { stdio: 'inherit' });

// Vercel Deploy (автоматический через GitHub Integration)
// Если Vercel подключен к GitHub Integration — ничего делать не нужно
// Vercel сам применит изменения через 1-2 минуты после пуша

console.log('✅ Деплой завершен! Vercel автоматически применит изменения через GitHub Integration.');
```

---

## Конфигурация Vercel (vercel.json)

```json
{
  "name": "image-crop-api",
  "version": "2.0.0",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "env": {
    "PORT": "3000"
  }
}
```

---

## Дата создания

**Дата:** 2026-02-23
**Автор:** rapidapi-publisher
**Ссылки:** Vercel (https://vercel.com/lovehroms-projects/image-crop-api), GitHub (https://github.com/lovehroms/image-crop-api)

---

## Обновления

**2026-02-23 17:00 UTC+5**
- ✅ Создан файл `DEPLOYMENT_GUIDE.md`
- ✅ Записаны ссылки на Vercel и GitHub
- ✅ Добавлена инструкция по использованию
- ✅ Добавлена интеграция Vercel с GitHub (Auto Deploy)
- ✅ Добавлена логика проверки ссылок (автоматически запрашивает у пользователя, если пустые)
- ✅ Добавлена инструкция для rapidapi-publisher (как деплоить проекты)

---

**Дата последнего обновления:** 2026-02-23 17:00 UTC+5
