# newlufter — клиент (статический сайт)

Сайт LUFTER: каталог алмазных дисков и коронок. Полностью клиентская часть, без сервера.

## Запуск

```bash
npm install
npm run dev    # разработка
npm run build  # сборка в dist/
npm run preview # просмотр собранного
```

## Изображения

Для отображения картинок товаров поместите файлы в `public/images/`:

- `public/images/logo.png`, `pattern.jpg`, `lyufter_fon.png` и др. (см. `src/constants/site.ts`)
- `public/images/disks/{sku}.png` — фото дисков (например `002-125.png`)
- `public/images/1_sajt_razdely_2.png` — для коронок

Опционально: `node scripts/download-images.mjs` — загружает изображения товаров с lufter-tools.ru.

## Деплой

Собранный `dist/` — статические файлы. GitHub Actions собирает и публикует на GitHub Pages при push в `main`.
