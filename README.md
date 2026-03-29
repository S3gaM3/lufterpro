# LUFTER — витрина (клиент)

Статический сайт: каталог алмазных дисков и коронок, карточка товара, формы заявок через `mailto`.

## Локальный запуск

```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

## Сборка

- `npm run build` — артефакты в `dist/`.
- Для GitHub Pages с **своим доменом** в CI задано `BASE_PATH=/` (см. `.github/workflows/client.yml`).

## Что в проекте

- React + TypeScript + Vite
- каталоги дисков и коронок, карточка товара
- SEO: meta, canonical, `public/robots.txt`, `public/sitemap.xml`
- ассеты в `public/`

## Ассеты и медиа

- `npm run images:download`, `npm run images:convert`
- Видео: локальные файлы в `public/videos/...` или внешние ссылки (см. `src/lib/videoUrls.ts`)

## Деплой

Публикация **GitHub Pages** через Actions: `.github/workflows/client.yml` (артефакт `dist`).

В репозитории: **Settings → Pages → Build and deployment: GitHub Actions**.

## Проверка перед релизом

- `npm run ci` (lint + build)
- маршруты `/`, `/katalog-diskov`, `/almaznye-koronki`, `/user/agreement`
- формы открывают почтовый клиент
- нет битых картинок на ключевых экранах (есть плейсхолдер)
