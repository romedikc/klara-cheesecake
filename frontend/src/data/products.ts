import type { Product, ProductDetail } from '../types'
import { images } from './images'

export const products: Product[] = [
  {
    id: 'basque',
    name: 'Баскский чизкейк',
    tag: 'Классический',
    price: 1900,
    description: 'Карамельная корочка, нежная кремовая середина. На 8–10 порций.',
    image: images.cakeBasque,
    badge: 'Хит продаж',
  },
  {
    id: 'raspberry',
    name: 'Малиновый вихрь',
    tag: 'Ягодный',
    price: 2100,
    description: 'Нью-йорк стайл с лентой из свежей ягоды.',
    image: images.cakeRaspberry,
    badge: 'Сезонное',
  },
  {
    id: 'lemon',
    name: 'Лимон и тимьян',
    tag: 'Цитрусовый',
    price: 2000,
    description: 'Яркий, травяной, на основе из подрумяненного масла.',
    image: images.cakeLemon,
    badge: 'Новинка',
    badgeDark: true,
  },
  {
    id: 'chocolate',
    name: 'Шоколадный бархат',
    tag: 'Классический',
    price: 2200,
    description: 'Бельгийский шоколад и маскарпоне. Плотный, насыщенный.',
    image: images.cakeChocolate,
  },
  {
    id: 'cashew',
    name: 'Кешью и ваниль',
    tag: 'Веганский',
    price: 2400,
    description: '100% растительный, без выпечки. Нежный ореховый крем.',
    image: images.cakeCashew,
  },
  {
    id: 'giftset',
    name: 'Набор «Три вкуса»',
    tag: 'Подарочный',
    price: 4900,
    description: 'Баскский, малиновый и лимонный — в подарочной упаковке.',
    image: images.cakeGiftSet,
    // featured: true,
  },
]

export const cakeFilters = [
  'Все',
  'Классические',
  'Сезонные',
  'Веганские',
  'Без глютена',
  'Подарочные',
]

export const cakeSortOptions = [
  'Популярные',
  'Сначала новые',
  'Сначала дешевле',
  'Сначала дороже',
]

/** Full detail record for the product page (Basque cheesecake). */
export const productDetails: Record<string, ProductDetail> = {
  basque: {
    id: 'basque',
    name: 'Баскский чизкейк',
    tag: 'Классический',
    price: 1900,
    description: 'Карамельная корочка, нежная кремовая середина. На 8–10 порций.',
    image: images.cakeBasque,
    badge: 'Хит продаж',
    priceNote: 'за торт (8–10 порций)',
    ratingValue: 4.9,
    reviewsCount: 312,
    longDescription: [
      'Наш баскский чизкейк — это приговор классическим рецептам. Высокая температура выпечки даёт ту самую тёмную карамельную корочку, под которой скрывается невесомая, почти жидкая середина.',
      'Мы печём каждый торт за 48 часов до доставки — не раньше. Никакой заморозки, никаких стабилизаторов. Только сливочный сыр, яйца, сахар и щепотка морской соли.',
    ],
    gallery: [
      images.cakeBasque,
      images.basqueGallery2,
      images.basqueGallery3,
      images.cakeRaspberry,
    ],
    sizes: [
      'Маленький (4–6 порц.) +0 сом',
      'Средний (8–10 порц.)',
      'Большой (14–16 порц.) +600 сом',
    ],
    defaultSizeIndex: 1,
    deliveryDates: ['Завтра (25 июня)', '26 июня', '27 июня', 'Другая дата'],
    defaultDateIndex: 1,
    ingredients: [
      'Сливочный сыр (Cremette)',
      'Яйца куриные',
      'Сахар тростниковый',
      'Сливки 33%',
      'Мука пшеничная',
      'Соль морская',
      'Ваниль натуральная',
    ],
    allergens:
      'Содержит: глютен, молоко, яйца. Производится на предприятии, где используются орехи.',
    reviews: [
      {
        author: 'Полина Н.',
        rating: 5,
        text: '«Заказывала на день рождения — гости в восторге. Середина такая нежная, прямо тает. Упаковка идеальная, довезли без повреждений.»',
        date: '12 июня 2026',
      },
      {
        author: 'Марина К.',
        rating: 5,
        text: '«Уже третий раз заказываю — не могу остановиться. Лучший баскский, который я пробовала, и я объездила весь город.»',
        date: '3 июня 2026',
      },
      {
        author: 'Андрей В.',
        rating: 4,
        text: '«Отличный торт, очень вкусный. Единственное — хотелось бы больше опций по дате доставки. В целом — рекомендую.»',
        date: '28 мая 2026',
      },
    ],
    relatedIds: ['raspberry', 'lemon', 'giftset'],
  },
}
