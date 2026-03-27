# newlufter — storefront + CMS

Клиентская витрина LUFTER: каталог алмазных дисков и коронок, страницы товара, формы заявок.

Репозиторий теперь поддерживает 2 контура:
- публичная витрина (исходный сайт);
- новая CMS с админ-панелью (`apps/admin`) и API (`apps/api`).

## CMS quick start

```bash
# API
cd apps/api
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev

# Admin
cd ../admin
npm install
npm run dev
```

По умолчанию:
- API: `http://localhost:4001/api`
- Admin: `http://localhost:5174`

## Локальный запуск

```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

## Что включено в релиз

- SPA на React + TypeScript + Vite
- каталоги дисков и коронок
- карточка товара
- формы обратной связи с fallback через `mailto`
- SEO-базис: meta/canonical/robots/sitemap
- базовые a11y улучшения

## Ассеты

- Ассеты подключаются из `public/`.
- Для отсутствующих изображений используется безопасный плейсхолдер, чтобы не было критичных 404 на ключевых маршрутах.
- Скрипты ассетов:
  - `npm run images:download`
  - `npm run images:convert`

## Видео работы

- Клиенты сайта ничего не загружают.
- Ролики добавляет только администратор, у которого есть доступ к файлам проекта.
- Допустимые источники:
  - локальные файлы в `public/videos/...` (ссылки вида `/videos/....mp4`)
  - внешние `https://` ссылки YouTube/Vimeo

## Деплой

`dist/` публикуется как статика на GitHub Pages через workflow в `.github/workflows/client.yml`.

Для CMS-деплоя на reg.ru (ISPmanager + phpMyAdmin) используйте:
- `docs/deploy-reg-ru-ispmanager.md`

## GitHub Actions

- `/.github/workflows/ci.yml` — общий CI монорепо (storefront + admin + api).
- `/.github/workflows/client.yml` — сборка и публикация витрины в GitHub Pages.

## Smoke checklist (перед релизом)

- `npm run lint` проходит без ошибок
- `npm run build` проходит без ошибок
- открываются маршруты:
  - `/`
  - `/katalog-diskov`
  - `/almaznye-koronki`
  - `/user/agreement`
- карточка товара открывается из каждого каталога
- формы (главная, футер, модалка) открывают почтовый клиент через `mailto`
- на ключевых экранах нет битых изображений (подставляется плейсхолдер)
- `robots.txt` и `sitemap.xml` доступны из `public/`
