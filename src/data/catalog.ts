/**
 * Catalog data for discs and crowns.
 * Disc images: /images/disks/{sku}.png (or .jpg where specified)
 *
 * Видео работы (workVideos): URL mp4/webm в public (`/videos/...`) или полные ссылки;
 * поддерживаются ссылки YouTube (watch / youtu.be / embed) и Vimeo.
 */

export interface CatalogItem {
  id: string
  name: string
  description?: string
  image?: string
  /** Дополнительные фото для страницы товара. Если не задано — используется image. */
  images?: string[]
  price?: string
  sku?: string
  /** Расширенное описание для страницы товара */
  fullDescription?: string
  /** Ролики «видео работы»: в карточке — кнопка просмотра; на странице товара — блок под описанием */
  workVideos?: string[]
}

export type ProductCategory = 'discs' | 'crowns'

export function getProductImages(item: CatalogItem): string[] {
  if (item.images?.length) return item.images
  if (item.image) return [item.image]
  return []
}

export function getDiscById(id: string): CatalogItem | undefined {
  return DISCS.find((d) => d.id === id)
}

export function getCrownById(id: string): CatalogItem | undefined {
  return CROWNS.find((c) => c.id === id)
}

export function getProductByCategory(category: ProductCategory, id: string): CatalogItem | undefined {
  return category === 'discs' ? getDiscById(id) : getCrownById(id)
}

function discImage(sku: string): string {
  const jpgSkus = ['005-230', '005-400', '001-180', '001-200', '001-230', '001-250']
  const ext = jpgSkus.includes(sku) ? '.jpg' : '.png'
  const imageSku =
    sku === '003-125' ? '003-232' : sku === '021-125' ? '021-115' : sku === '016-125-1' ? '016-125' : sku
  return `/images/disks/${imageSku}${ext}`
}

/** Diamond discs - 72 items */
export const DISCS: CatalogItem[] = [
  {
    id: '002-125',
    sku: '002-125',
    name: 'Диск алмазный LUFTER BASIC H12 125мм',
    description: 'X 22,23 и 2.2мм с 12 сегментами для мокрого резания',
    image: discImage('002-125'),
    /** Пример: замените на свои файлы в `public/videos/` или ссылки на YouTube */
    workVideos: ['https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'],
  },
  { id: '002-150', sku: '002-150', name: 'Диск алмазный LUFTER BASIC H12 150мм', description: 'X 22,23 и 2.2мм с 12 сегментами для мокрого резания', image: discImage('002-150') },
  { id: '002-232', sku: '002-232', name: 'Диск алмазный LUFTER BASIC H12 232мм', description: 'X 22,23 и 2.4мм с 12 сегментами для мокрого резания', image: discImage('002-232') },
  { id: '002-300', sku: '002-300', name: 'Диск алмазный LUFTER BASIC H12 300мм', description: 'X 25,4 и 3,2мм с 12 сегментами для мокрого резания', image: discImage('002-300') },
  { id: '002-350', sku: '002-350', name: 'Диск алмазный LUFTER BASIC H12 350мм', description: 'X 25,4 и 3,2мм с 12 сегментами для мокрого резания', image: discImage('002-350') },
  { id: '002-400', sku: '002-400', name: 'Диск алмазный LUFTER BASIC H12 400мм', description: 'X 25,4 и 3,2мм с 12 сегментами для мокрого резания', image: discImage('002-400') },
  { id: '002-450', sku: '002-450', name: 'Диск алмазный LUFTER BASIC H12 450мм', description: 'X 25,4 и 3,6мм с 12 сегментами для мокрого резания', image: discImage('002-450') },
  { id: '002-500', sku: '002-500', name: 'Диск алмазный LUFTER BASIC H12 500мм', description: 'X 25,4 и 3,6мм с 12 сегментами для мокрого резания', image: discImage('002-500') },
  { id: '002-600', sku: '002-600', name: 'Диск алмазный LUFTER BASIC H12 600мм', description: 'X 25,4 и 4,2мм с 12 сегментами для мокрого резания', image: discImage('002-600') },
  {
    id: '003-125',
    sku: '003-125',
    name: 'Диск алмазный LUFTER BIGGEST 125мм',
    description: 'X 22,23 и 2.2мм с 12 сегментами для сухого резания бетона',
    image: discImage('003-125'),
    workVideos: [
      'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      /** Второй ролик — пример ссылки YouTube (watch); замените на свой канал */
      'https://www.youtube.com/watch?v=YE7VzlLtp-4',
    ],
  },
  { id: '003-232', sku: '003-232', name: 'Диск алмазный LUFTER BIGGEST 232мм', description: 'X 22,23 и 2.8мм с 16 сегментами для сухого резания бетона', image: discImage('003-232') },
  { id: '004-300', sku: '004-300', name: 'Диск алмазный LUFTER BLACK ROAD PLUS SEGMENT 300мм', description: 'и 25.4/11.5 X 2.8мм с 10 сегментами, турбо чашка', image: discImage('004-300') },
  { id: '004-350', sku: '004-350', name: 'Диск алмазный LUFTER BLACK ROAD PLUS SEGMENT 350мм', description: 'и 25.4/11.5 X 3.2мм с 10 сегментами, турбо чашка', image: discImage('004-350') },
  { id: '004-400', sku: '004-400', name: 'Диск алмазный LUFTER BLACK ROAD PLUS SEGMENT 400мм', description: 'и 25.4/11.5 X 3.6мм с 10 сегментами, турбо чашка', image: discImage('004-400') },
  { id: '004-450', sku: '004-450', name: 'Диск алмазный LUFTER BLACK ROAD PLUS SEGMENT 450мм', description: 'и 25.4/11.5 X 3.8мм с 10 сегментами, турбо чашка', image: discImage('004-450') },
  { id: '004-500', sku: '004-500', name: 'Диск алмазный LUFTER BLACK ROAD PLUS SEGMENT 500мм', description: 'и 25.4/11.5 X 3.8мм с 10 сегментами, турбо чашка', image: discImage('004-500') },
  { id: '005-230', sku: '005-230', name: 'Диск алмазный LUFTER BLACK ROAD SEGMENT 230мм', description: 'X 2.6мм с 10 сегментами, турбо чашка, универсал', image: discImage('005-230') },
  { id: '005-400', sku: '005-400', name: 'Диск алмазный LUFTER BLACK ROAD SEGMENT 400мм', description: 'X 3.5мм с 10 сегментами, турбо чашка, универсал', image: discImage('005-400') },
  { id: '006-115', sku: '006-115', name: 'Диск алмазный LUFTER CORNER 115мм', description: 'X 22,23 и 1.6мм с 25 сегментами для шлифовки углов под 45°', image: discImage('006-115') },
  { id: '006-125', sku: '006-125', name: 'Диск алмазный LUFTER CORNER 125мм', description: 'X 22,23 X 1.6мм с 25 сегментами для шлифовки углов под 45°', image: discImage('006-125') },
  { id: '006-125-14', sku: '006-125-14', name: 'Диск алмазный LUFTER CORNER 125мм', description: 'X 1.6мм с 25 сегментами ø14 для шлифовки углов под 45°', image: discImage('006-125-14') },
  { id: '007-125', sku: '007-125', name: 'Диск алмазный LUFTER DOLOMITE 125мм', description: 'и 22.23мм X 1.4мм с 10 сегментами, мрамор, гранит, бетон', image: discImage('007-125') },
  { id: '007-180', sku: '007-180', name: 'Диск алмазный LUFTER DOLOMITE 180мм', description: 'и 25.4мм X 1.6мм с 10 сегментами, мрамор, гранит, бетон', image: discImage('007-180') },
  { id: '007-200', sku: '007-200', name: 'Диск алмазный LUFTER DOLOMITE 200мм', description: 'и 25.4мм X 1.6мм с 10 сегментами, мрамор, гранит, бетон', image: discImage('007-200') },
  { id: '007-230', sku: '007-230', name: 'Диск алмазный LUFTER DOLOMITE 230мм', description: 'и 25.4мм X 1.6мм с 10 сегментами, мрамор, гранит, бетон', image: discImage('007-230') },
  { id: '007-250', sku: '007-250', name: 'Диск алмазный LUFTER DOLOMITE 250мм', description: 'и 25.4мм X 1.6мм с 10 сегментами, мрамор, гранит, бетон', image: discImage('007-250') },
  { id: '007-300', sku: '007-300', name: 'Диск алмазный LUFTER DOLOMITE 300мм', description: 'и 32мм X 2мм с 10 сегментами, мрамор, гранит, бетон', image: discImage('007-300') },
  { id: '007-350', sku: '007-350', name: 'Диск алмазный LUFTER DOLOMITE 350мм', description: 'и 32мм X 2.2мм с 10 сегментами, мрамор, гранит, бетон', image: discImage('007-350') },
  { id: '007-400', sku: '007-400', name: 'Диск алмазный LUFTER DOLOMITE 400мм', description: 'и 32мм X 2.4мм с 10 сегментами, мрамор, гранит, бетон', image: discImage('007-400') },
  { id: '008-125', sku: '008-125', name: 'Диск алмазный LUFTER ERUDITE SEGMENT 125мм', description: 'X 22,23 и 2.2мм с 12 сегментами, гранит, мрамор, бетон', image: discImage('008-125') },
  { id: '008-230', sku: '008-230', name: 'Диск алмазный LUFTER ERUDITE SEGMENT 230мм', description: 'X 22,23 X 2.6мм с 12 сегментами, гранит, мрамор, бетон', image: discImage('008-230') },
  { id: '009-125', sku: '009-125', name: 'Диск алмазный LUFTER GABBRO LUX 125мм', description: 'и 22.23мм X 1.4мм с 10 сегментами для мрамора и гранита', image: discImage('009-125') },
  { id: '009-180', sku: '009-180', name: 'Диск алмазный LUFTER GABBRO LUX 180мм', description: 'и 25.4мм X 1.6мм с 10 сегментами для мрамора и гранита', image: discImage('009-180') },
  { id: '009-200', sku: '009-200', name: 'Диск алмазный LUFTER GABBRO LUX 200мм', description: 'и 25.4мм X 1.6мм с 10 сегментами для мрамора и гранита', image: discImage('009-200') },
  { id: '009-230', sku: '009-230', name: 'Диск алмазный LUFTER GABBRO LUX 230мм', description: 'и 25.4мм X 1.6мм с 10 сегментами для мрамора и гранита', image: discImage('009-230') },
  { id: '009-250', sku: '009-250', name: 'Диск алмазный LUFTER GABBRO LUX 250мм', description: 'и 25.4мм X 1.6мм с 10 сегментами для мрамора и гранита', image: discImage('009-250') },
  { id: '009-300', sku: '009-300', name: 'Диск алмазный LUFTER GABBRO LUX 300мм', description: 'и 32мм X 2мм с 10 сегментами для мрамора и гранита', image: discImage('009-300') },
  { id: '009-350', sku: '009-350', name: 'Диск алмазный LUFTER GABBRO LUX 350мм', description: 'и 32мм X 2.2мм с 10 сегментами для мрамора и гранита', image: discImage('009-350') },
  { id: '009-400', sku: '009-400', name: 'Диск алмазный LUFTER GABBRO LUX 400мм', description: 'и 32мм X 2.4мм с 10 сегментами для мрамора и гранита', image: discImage('009-400') },
  { id: '010-125', sku: '010-125', name: 'Диск алмазный LUFTER GABBRO 125мм', description: 'и 22.23мм X 1.4мм с 10 сегментами для мрамора и гранита', image: discImage('010-125') },
  { id: '010-200', sku: '010-200', name: 'Диск алмазный LUFTER GABBRO 200мм', description: 'и 25.4мм X 1.6мм с 10 сегментами для мрамора и гранита', image: discImage('010-200') },
  { id: '010-230', sku: '010-230', name: 'Диск алмазный LUFTER GABBRO 230мм', description: 'и 25.4мм X 1.6мм с 10 сегментами для мрамора и гранита', image: discImage('010-230') },
  { id: '010-250', sku: '010-250', name: 'Диск алмазный LUFTER GABBRO 250мм', description: 'и 25.4мм X 1.6мм с 10 сегментами для мрамора и гранита', image: discImage('010-250') },
  { id: '011-300', sku: '011-300', name: 'Диск алмазный LUFTER GRANIT 300мм', description: 'для гранита и твёрдых материалов', image: discImage('011-300') },
  { id: '011-350', sku: '011-350', name: 'Диск алмазный LUFTER GRANIT 350мм', description: 'для гранита и твёрдых материалов', image: discImage('011-350') },
  { id: '011-400', sku: '011-400', name: 'Диск алмазный LUFTER GRANIT 400мм', description: 'для гранита и твёрдых материалов', image: discImage('011-400') },
  { id: '012-115', sku: '012-115', name: 'Диск алмазный LUFTER MARBLE 115мм', description: 'и 22.23мм X 1.6мм с 10 сегментами для мрамора', image: discImage('012-115') },
  { id: '012-125', sku: '012-125', name: 'Диск алмазный LUFTER MARBLE 125мм', description: 'и 22.23мм X 1.6мм с 10 сегментами для мрамора', image: discImage('012-125') },
  { id: '012-150', sku: '012-150', name: 'Диск алмазный LUFTER MARBLE 150мм', description: 'и 22.23мм X 1.6мм с 10 сегментами для мрамора', image: discImage('012-150') },
  { id: '012-180', sku: '012-180', name: 'Диск алмазный LUFTER MARBLE 180мм', description: 'и 25.4мм X 1.6мм с 10 сегментами для мрамора', image: discImage('012-180') },
  { id: '012-232', sku: '012-232', name: 'Диск алмазный LUFTER MARBLE 232мм', description: 'и 22.23мм X 2мм с 10 сегментами для мрамора', image: discImage('012-232') },
  { id: '014-125-14', sku: '014-125-14', name: 'Диск алмазный LUFTER MARBLE ANGLE 125мм', description: 'угловой диск ø14 для шлифовки мрамора', image: discImage('014-125-14') },
  { id: '016-115', sku: '016-115', name: 'Диск алмазный LUFTER SUPER FAST 115мм', description: 'и 22.23мм X 1.4мм с 10 сегментами для высокоскоростного резания', image: discImage('016-115') },
  { id: '016-125', sku: '016-125', name: 'Диск алмазный LUFTER SUPER FAST 125мм', description: 'и 22.23мм X 1.4мм с 10 сегментами для высокоскоростного резания', image: discImage('016-125') },
  { id: '016-125-1', sku: '016-125-1', name: 'Диск алмазный LUFTER SUPER FAST 125мм (вариант)', description: 'и 22.23мм X 1.4мм с 10 сегментами для высокоскоростного резания', image: discImage('016-125-1') },
  { id: '018-115', sku: '018-115', name: 'Диск алмазный LUFTER THE FASTEST 115мм', description: 'и 22.23мм X 1.4мм с 10 сегментами для высокоскоростного резания', image: discImage('018-115') },
  { id: '018-125', sku: '018-125', name: 'Диск алмазный LUFTER THE FASTEST 125мм', description: 'и 22.23мм X 1.4мм с 10 сегментами для высокоскоростного резания', image: discImage('018-125') },
  { id: '019-115', sku: '019-115', name: 'Диск алмазный LUFTER THICK CERAMICS CARBON 115мм', description: 'и 22.23мм X 1.6мм с 10 сегментами для керамики, керамогранита', image: discImage('019-115') },
  { id: '019-125', sku: '019-125', name: 'Диск алмазный LUFTER THICK CERAMICS CARBON 125мм', description: 'и 22.23мм X 1.6мм с 10 сегментами для керамики, керамогранита', image: discImage('019-125') },
  { id: '019-180', sku: '019-180', name: 'Диск алмазный LUFTER THICK CERAMICS CARBON 180мм', description: 'и 25.4мм X 1.6мм с 10 сегментами для керамики, керамогранита', image: discImage('019-180') },
  { id: '019-200', sku: '019-200', name: 'Диск алмазный LUFTER THICK CERAMICS CARBON 200мм', description: 'и 25.4мм X 1.6мм с 10 сегментами для керамики, керамогранита', image: discImage('019-200') },
  { id: '019-230', sku: '019-230', name: 'Диск алмазный LUFTER THICK CERAMICS CARBON 230мм', description: 'и 25.4мм X 1.6мм с 10 сегментами для керамики, керамогранита', image: discImage('019-230') },
  { id: '019-250', sku: '019-250', name: 'Диск алмазный LUFTER THICK CERAMICS CARBON 250мм', description: 'и 25.4мм X 1.6мм с 10 сегментами для керамики, керамогранита', image: discImage('019-250') },
  { id: '020-232', sku: '020-232', name: 'Диск алмазный LUFTER TURBO HIGH SPEED 232мм', description: 'и 22,23 X 2.6мм с 15 сегментами для мокрого резания', image: discImage('020-232') },
  { id: '021-115', sku: '021-115', name: 'Диск алмазный LUFTER TURBO LUX 115мм', description: 'и 22.23мм X 2.2мм с 10 сегментами для мокрого резания', image: discImage('021-115') },
  { id: '021-125', sku: '021-125', name: 'Диск алмазный LUFTER TURBO LUX 125мм', description: 'и 22.23мм X 2.2мм с 10 сегментами для мокрого резания', image: discImage('021-125') },
  { id: '021-150', sku: '021-150', name: 'Диск алмазный LUFTER TURBO LUX 150мм', description: 'и 22.23мм X 2.2мм с 10 сегментами для мокрого резания', image: discImage('021-150') },
  { id: '021-180', sku: '021-180', name: 'Диск алмазный LUFTER TURBO LUX 180мм', description: 'и 22.23мм X 2.4мм с 10 сегментами для мокрого резания', image: discImage('021-180') },
  { id: '021-232', sku: '021-232', name: 'Диск алмазный LUFTER TURBO LUX LARGE 232мм', description: 'и 22.23мм X 2.5мм с 12 сегментами для мокрого резания', image: discImage('021-232') },
  { id: '022-115', sku: '022-115', name: 'Диск алмазный LUFTER TURBO PREMIUM BALANCE 115мм', description: 'и 22,23 X 2.2мм с 10 сегментами для гранита и мрамора', image: discImage('022-115') },
  { id: '022-125', sku: '022-125', name: 'Диск алмазный LUFTER TURBO PREMIUM BALANCE 125мм', description: 'и 22,23 X 2.2мм с 10 сегментами для гранита и мрамора', image: discImage('022-125') },
  { id: '022-150', sku: '022-150', name: 'Диск алмазный LUFTER TURBO PREMIUM BALANCE 150мм', description: 'и 22,23 X 2.2мм с 10 сегментами для гранита и мрамора', image: discImage('022-150') },
  { id: '022-180', sku: '022-180', name: 'Диск алмазный LUFTER TURBO PREMIUM BALANCE 180мм', description: 'и 22,23 X 2.4мм с 10 сегментами для гранита и мрамора', image: discImage('022-180') },
  { id: '022-230', sku: '022-230', name: 'Диск алмазный LUFTER TURBO PREMIUM BALANCE 230мм', description: 'и 22,23 X 2.6мм с 10 сегментами для гранита и мрамора', image: discImage('022-230') },
  { id: '023-115', sku: '023-115', name: 'Диск алмазный LUFTER TURBO SMART TIP-X 115мм', description: 'и 22,23 и 1.4мм с 10 сегментами универсальный', image: discImage('023-115') },
  { id: '023-125', sku: '023-125', name: 'Диск алмазный LUFTER TURBO SMART TIP-X 125мм', description: 'и 22,23 и 1.6мм с 10 сегментами универсальный', image: discImage('023-125') },
  { id: '023-232', sku: '023-232', name: 'Диск алмазный LUFTER TURBO SMART TIP-X 232мм', description: 'и 22,23 и 2.0мм с 10 сегментами универсальный', image: discImage('023-232') },
  { id: '024-125', sku: '024-125', name: 'Диск алмазный LUFTER URANIUM SEGMENT H12 125мм', description: 'и 22,23 X 2.2мм с 12 сегментами для мокрого резания', image: discImage('024-125') },
  { id: '024-230', sku: '024-230', name: 'Диск алмазный LUFTER URANIUM SEGMENT H12 230мм', description: 'и 22,23 X 2.6мм с 12 сегментами для мокрого резания', image: discImage('024-230') },
  { id: '024-300', sku: '024-300', name: 'Диск алмазный LUFTER URANIUM SEGMENT H12 300мм', description: 'X 2,8мм и 25.4мм, 12 сегментами для мокрого резания', image: discImage('024-300') },
  { id: '024-350', sku: '024-350', name: 'Диск алмазный LUFTER URANIUM SEGMENT H12 350мм', description: 'X 3.2мм и 25.4мм, 12 сегментами для мокрого резания', image: discImage('024-350') },
  { id: '024-400', sku: '024-400', name: 'Диск алмазный LUFTER URANIUM SEGMENT H12 400мм', description: 'X 3.4мм и 25.4мм, 12 сегментами для мокрого резания', image: discImage('024-400') },
  { id: '024-450', sku: '024-450', name: 'Диск алмазный LUFTER URANIUM SEGMENT H12 450мм', description: 'X 3.8мм и 25.4мм, 12 сегментами для мокрого резания', image: discImage('024-450') },
  { id: '024-500', sku: '024-500', name: 'Диск алмазный LUFTER URANIUM SEGMENT H12 500мм', description: 'X 3.8мм и 25.4мм с 12 сегментами для мокрого резания', image: discImage('024-500') },
  { id: '024-600', sku: '024-600', name: 'Диск алмазный LUFTER URANIUM SEGMENT H12 600мм', description: 'X 4.6мм и 25.4мм с 12 сегментами для мокрого резания', image: discImage('024-600') },
  { id: '001-180', sku: '001-180', name: 'Диск алмазный LUFTER ANGLE SHAPE 180мм', description: 'и 25.4 X 1.4мм с 25 сегментами для шлифовки углов под 45°', image: discImage('001-180') },
  { id: '001-200', sku: '001-200', name: 'Диск алмазный LUFTER ANGLE SHAPE 200мм', description: 'и 25.4 X 1.4мм с 25 сегментами для шлифовки углов под 45°', image: discImage('001-200') },
  { id: '001-230', sku: '001-230', name: 'Диск алмазный LUFTER ANGLE SHAPE 230мм', description: 'и 25.4 X 1.4мм с 25 сегментами для шлифовки углов под 45°', image: discImage('001-230') },
  { id: '001-250', sku: '001-250', name: 'Диск алмазный LUFTER ANGLE SHAPE 250мм', description: 'и 25.4 X 1.4мм с 25 сегментами для шлифовки углов под 45°', image: discImage('001-250') },
]

/** Diamond crowns - 4 items */
export const CROWNS: CatalogItem[] = [
  { id: '027-70', sku: '027-70', name: 'Алмазная коронка LUFTER 70мм', description: 'Для бурения бетона, кирпича, камня. Сегментная конструкция.', image: '/images/1_sajt_razdely_2.png' },
  { id: '026-68', sku: '026-68', name: 'Алмазная коронка LUFTER 68мм', description: 'Для бурения отверстий в бетоне и армированных конструкциях.', image: '/images/1_sajt_razdely_2.png' },
  { id: '026-72', sku: '026-72', name: 'Алмазная коронка LUFTER 72мм', description: 'Для бурения бетона, керамогранита. Высокая износостойкость.', image: '/images/1_sajt_razdely_2.png' },
  { id: '026-82', sku: '026-82', name: 'Алмазная коронка LUFTER 82мм', description: 'Для бурения отверстий под трубы и коммуникации в твёрдых материалах.', image: '/images/1_sajt_razdely_2.png' },
]
