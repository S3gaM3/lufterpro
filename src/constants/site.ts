import { asset } from '@/lib/asset'
import { typographText } from '@/lib/typography'

/** Локальные пути ассетов (public/). Сайт полностью автономен. */
export const SITE = {
  baseUrl: 'https://lufterpro.ru',
  phoneDisplay: '8(800)500-58-51',
  phoneTel: 'tel:88005005851',
  leadEmail: 'info@lufter-tools.ru',
  address: 'г. Москва, Варшавское шоссе, дом 148',
  /** Яндекс.Карты: точка как на виджете карты на сайте */
  addressMapUrl:
    'https://yandex.ru/maps/?pt=37.60253%2C55.60102&z=17&l=map',
  /** Локальные ассеты (asset() учитывает base path для GitHub Pages). WebP для быстрой загрузки. */
  fallbackImage: asset('/images/placeholder-product.svg'),
  pattern: asset('/images/pattern.webp'),
  logo: asset('/images/logo.webp'),
  brochure: '',
  /** Баннеры разделов каталога */
  imgDiscs: asset('/images/2_sajt_razdely_2.webp'),
  imgCrowns: asset('/images/1_sajt_razdely_2.webp'),
  /** Фон блока «Оформить заказ» на главной */
  orderSectionBackground: asset('/images/bg.webp'),
  /** Hero: баннер lyufter_fon (рабочий с болгаркой, искры, логотип) */
  heroBanner: asset('/images/lyufter_fon.webp'),
  heroBannerMobile: asset('/images/lyufter_fon_mobile.webp'),
  /** Блок «О нас»: фото Максима */
  aboutPhoto: asset('/images/maksim_dlya_sajta-ispravlennyj_montazhnaya_oblast_1_1.webp'),
  iconWarehouse: asset('/images/warehouse.svg'),
  iconQuality: asset('/images/icon-quality.svg'),
  iconPrice: asset('/images/icon-price.svg'),
  /** Маршруты */
  catalogDiscs: '/katalog-diskov',
  catalogCrowns: '/almaznye-koronki',
  contacts: '/#contacts',
  agreement: '/user/agreement',
  /**
   * Карта: виджет Яндекс.Карт (адрес — Варшавское шоссе, 148).
   * ll/pt в формате долгота,широта; pm2rdm — красная метка.
   * Альтернатива без Яндекса: OSM embed с bbox + marker (lat,lon).
   */
  mapEmbed:
    'https://yandex.ru/map-widget/v1/?ll=37.60253%2C55.60102&z=17&pt=37.60253%2C55.60102%2Cpm2rdm',
} as const

const RAW_COPY = {
  heroTitle: 'Профессиональный инструмент',
  heroLead: `«LUFTER» - одна из 13 крупнейших в мире и лидирующая компания в Китае‚ специализирующаяся в разработке, производстве и продаже алмазных инструментов и твердосплавных инструментов.
Обладает производственными мощностями в Америке и Сингапуре, а также имеет свои производственные линии в Европе. Товарный знак «LUFTER» известен всему Китаю и за рубежом.`,
  aboutTitle: 'НЕМНОГО О НАС',
  aboutText: `Компания «LUFTER» представляет более 1200 ассортиментов серийной продукции из трех категорий - такие, как алмазные, шлифовальные, отрезные, сверловые и твердосплавные инструменты.
Мы рады предложить вам широкий спектр услуг по самым выгодным ценам.
 В случае если у Вас возникли вопросы при оформлении заказа, Вы всегда можете обратиться в наш справочный центр по телефону или воспользовавшись онлайн - консультантом на сайте.`,
  features: [
    {
      title: 'БОЛЬШОЙ ВЫБОР',
      text: 'Широкий ассортимент оснастки для электроинструмента',
      iconKey: 'warehouse' as const,
    },
    {
      title: 'НАДЕЖНОЕ КАЧЕСТВО',
      text: 'Гарантируем надежное качество поставляемой продукции',
      iconKey: 'quality' as const,
    },
    {
      title: 'ДОСТУПНЫЕ ЦЕНЫ',
      text: 'Доступные цены на всю нашу продукцию. Удобная форма оплаты',
      iconKey: 'price' as const,
    },
  ],
} as const

export const COPY = typographText(RAW_COPY)
