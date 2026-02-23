# TOOLS — Инструменты и учётные данные

## RapidAPI учетные данные

### API Key
```
d5cc66646msh8999b110e4296e1p19be2fjsnb997c3a91aff
```

### Owner ID
```
11561343
```

### API URLs
- **Platform API:** https://platformv.p.rapidapi.com
- **Hub API:** https://rapidapi.com

---

## Использование в скриптах

### Для Platform API
```javascript
const PLATFORM_API_URL = 'https://platformv.p.rapidapi.com';
const RAPIDAPI_API_KEY = 'd5cc66646msh8999b110e4296e1p19be2fjsnb997c3a91aff';
const OWNER_ID = '11561343';
```

### Для Hub API
```javascript
const HUB_API_URL = 'https://rapidapi.com';
const RAPIDAPI_API_KEY = 'd5cc66646msh8999b110e4296e1p19be2fjsnb997c3a91aff';
const OWNER_ID = '11561343';
```

---

## Автономная публикация на RapidAPI

### Скрипт
- `rapidapi-platform-publisher.js` — автономный публикатор через Platform API
- Использует API Key и Owner ID
- Создаёт API, endpoints, документацию, тарифы
- Публикует автоматически

### Команда запуска
```bash
cd "K:\Работа\rapidapi.com\image-crop-api"
node rapidapi-platform-publisher.js
```

### Время выполнения
- **Первый раз:** 30-60 секунд (настройка скрипта)
- **Последующие:** 10-15 секунд (просто запуск)

---

## Обновление проектов

### Добавление новых проектов
1. Создай проект
2. Получи API Key и Owner ID
3. Добавь в TOOLS.md
4. Создай публикатор для нового проекта
5. Запусти: `node rapidapi-platform-publisher.js`

---

## Безопасность

### Ключи
- ✅ Добавлены в `.gitignore`
- ✅ Не пушатся в репозиторий
- ✅ Используются только локально

### Публикация
- ✅ Через Platform API (официальный)
- ✅ Без необходимости входа в UI
- ✅ Полностью автономно

---

## Дополнительные учётные данные

### GitHub
- Username: `lovehrom`
- URL: https://github.com/lovehrom

### Vercel
- Account: `lovehroms-projects`
- CLI: `vercel`

---

**Дата последнего обновления:** 2026-02-22
