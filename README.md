# newlufter — клиент (статический сайт)

Сайт LUFTER: каталог алмазных дисков и коронок. Полностью клиентская часть, без сервера.

## Запуск

```bash
npm install
npm run dev    # разработка
npm run build  # сборка в dist/
npm run preview # просмотр собранного
```

## Изображения (WebP)

Картинки в формате WebP для быстрой загрузки.

- `public/images/logo.webp`, `pattern.webp`, `lyufter_fon.webp`, `lyufter_fon_mobile.webp`, `bg.webp` и др.
- `public/images/disks/{sku}.webp` — фото дисков
- `public/images/1_sajt_razdely_2.webp`, `2_sajt_razdely_2.webp` — баннеры каталога

**Команды:**
- `npm run images:download` — загружает фото дисков с lufter-tools.ru и сохраняет как WebP
- `npm run images:convert` — конвертирует существующие PNG/JPG в `public/images/` в WebP (удаляет оригиналы)

## Деплой

Собранный `dist/` — статические файлы. GitHub Actions собирает и публикует на GitHub Pages при push в `main`.
